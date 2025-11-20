import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Analyze assumptions API called")

    const { kpiAssumptions, industry, platformSelection, companySize } = await request.json()

    console.log("[v0] Request data:", {
      kpiCount: kpiAssumptions?.length,
      industry,
      platformSelection,
      companySize,
    })

    if (!kpiAssumptions || !industry || !platformSelection) {
      console.log("[v0] Missing required data")
      return Response.json({ error: "Missing required data for analysis" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY not found")
      return Response.json(
        { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    console.log("[v0] Starting OpenAI analysis...")

    const analysisPrompt = `Analyze the following business assumptions for a ${companySize || "medium-sized"} company in the ${industry} industry implementing ${platformSelection} solutions:

KPI Assumptions:
${JSON.stringify(kpiAssumptions, null, 2)}

Please provide a structured analysis with:
1. **Assumption Validation**: Are these assumptions realistic for this industry and company size?
2. **Risk Assessment**: What are the potential risks or challenges with these assumptions?
3. **Industry Benchmarks**: How do these compare to typical industry performance?
4. **Optimization Recommendations**: Specific suggestions to improve these assumptions
5. **Implementation Insights**: Key factors for successful achievement of these targets

Focus on actionable insights and be specific about the ${industry} industry context.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a business analyst expert specializing in ROI analysis and KPI optimization. Provide detailed, actionable insights based on industry knowledge and best practices. Be specific and practical in your recommendations.",
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content || "Unable to generate analysis at this time."

    console.log("[v0] OpenAI analysis completed successfully")

    return Response.json(
      {
        analysis,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error analyzing assumptions:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error details:", errorMessage)
    if (error instanceof Error && error.stack) {
      console.error("[v0] Error stack:", error.stack)
    }

    return Response.json(
      {
        error: `Failed to analyze assumptions: ${errorMessage}`,
      },
      { status: 500 },
    )
  }
}

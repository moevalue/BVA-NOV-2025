import { streamText } from "ai"
import { perplexity } from "@ai-sdk/perplexity"
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
      return new Response("Missing required data for analysis", { status: 400 })
    }

    if (!process.env.PERPLEXITY_API_KEY) {
      console.error("[v0] PERPLEXITY_API_KEY is not set")
      return new Response("API configuration error: Missing API key", { status: 500 })
    }

    console.log("[v0] Starting Perplexity analysis...")

    // Create a comprehensive prompt for Perplexity analysis
    const analysisPrompt = `
Analyze the following business assumptions for a ${companySize || "medium-sized"} company in the ${industry} industry implementing ${platformSelection} solutions:

KPI Assumptions:
${JSON.stringify(kpiAssumptions, null, 2)}

Please provide:
1. **Assumption Validation**: Are these assumptions realistic for this industry and company size?
2. **Risk Assessment**: What are the potential risks or challenges with these assumptions?
3. **Industry Benchmarks**: How do these compare to typical industry performance?
4. **Optimization Recommendations**: Specific suggestions to improve these assumptions
5. **Implementation Insights**: Key factors for successful achievement of these targets

Focus on actionable insights and be specific about the ${industry} industry context.
`

    const result = streamText({
      model: perplexity("sonar-pro"),
      prompt: analysisPrompt,
      system:
        "You are a business analyst expert specializing in ROI analysis and KPI optimization. Provide detailed, actionable insights based on industry knowledge and best practices. Be specific and practical in your recommendations.",
    })

    console.log("[v0] Perplexity analysis started successfully")

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] Error analyzing assumptions:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(`Failed to analyze assumptions: ${errorMessage}`, { status: 500 })
  }
}

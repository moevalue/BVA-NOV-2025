import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const IndustryBenchmarkSchema = z.object({
  kpiName: z.string(),
  platform: z.string(),
  industry: z.string(),
  companySize: z.object({
    small: z.string(),
    medium: z.string(),
    large: z.string(),
  }),
  sources: z.array(z.string()),
  lastUpdated: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
})

const BenchmarkResponseSchema = z.object({
  benchmarks: z.array(IndustryBenchmarkSchema),
  metadata: z.object({
    generatedAt: z.string(),
    industry: z.string(),
    platform: z.string(),
    totalBenchmarks: z.number(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const { kpiName, industry, platform, companySize } = await request.json()

    if (!kpiName || !industry || !platform) {
      return NextResponse.json({ error: "Missing required parameters: kpiName, industry, platform" }, { status: 400 })
    }

    console.log("[v0] Fetching real-time industry benchmarks for:", { kpiName, industry, platform })

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt: `You are an expert business analyst with access to current industry data. Provide real-time industry benchmarks for the following KPI:

KPI: ${kpiName}
Industry: ${industry}
Platform: ${platform}
Company Size Context: ${companySize || "All sizes"}

Please provide current 2024-2025 industry averages by company size (small: <500 employees, medium: 500-5000 employees, large: >5000 employees) for this specific KPI in the ${industry} industry using ${platform} platforms.

Include:
1. Specific numerical ranges or percentages for each company size
2. Current industry sources and studies
3. Confidence level in the data
4. Last updated timeframe

Focus on providing actionable, specific benchmarks that a business can use for comparison. Use current market data and industry reports from 2024-2025.`,
      schema: BenchmarkResponseSchema,
    })

    console.log("[v0] Successfully generated industry benchmarks")

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("[v0] Error generating industry benchmarks:", error)

    const fallbackData = {
      benchmarks: [
        {
          kpiName: request.body?.kpiName || "Unknown KPI",
          platform: request.body?.platform || "Unknown Platform",
          industry: request.body?.industry || "Unknown Industry",
          companySize: {
            small: "Data temporarily unavailable",
            medium: "Data temporarily unavailable",
            large: "Data temporarily unavailable",
          },
          sources: ["Fallback data - AI service temporarily unavailable"],
          lastUpdated: new Date().toISOString(),
          confidence: "low" as const,
        },
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        industry: request.body?.industry || "Unknown",
        platform: request.body?.platform || "Unknown",
        totalBenchmarks: 1,
      },
    }

    return NextResponse.json(fallbackData)
  }
}

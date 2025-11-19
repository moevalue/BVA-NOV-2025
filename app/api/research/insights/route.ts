import { researchService } from "@/lib/research-service"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { industry, platform } = await req.json()

    if (!industry || !platform) {
      return Response.json({ error: "Industry and platform are required" }, { status: 400 })
    }

    const insights = await researchService.generateIndustryInsights(industry, platform)

    return Response.json(insights)
  } catch (error) {
    console.error("Research insights error:", error)
    return Response.json({ error: "Failed to generate research insights" }, { status: 500 })
  }
}

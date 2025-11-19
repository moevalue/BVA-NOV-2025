import { researchService } from "@/lib/research-service"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { industry, platform } = await req.json()

    if (!industry || !platform) {
      return Response.json({ error: "Industry and platform are required" }, { status: 400 })
    }

    const competitiveAnalysis = await researchService.generateCompetitiveAnalysis(industry, platform)

    return Response.json(competitiveAnalysis)
  } catch (error) {
    console.error("Competitive analysis error:", error)
    return Response.json({ error: "Failed to generate competitive analysis" }, { status: 500 })
  }
}

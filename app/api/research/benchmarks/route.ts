import { researchService } from "@/lib/research-service"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { industry, platform } = await req.json()

    if (!industry || !platform) {
      return Response.json({ error: "Industry and platform are required" }, { status: 400 })
    }

    const benchmarks = await researchService.generateBenchmarkData(industry, platform)

    return Response.json(benchmarks)
  } catch (error) {
    console.error("Benchmark data error:", error)
    return Response.json({ error: "Failed to generate benchmark data" }, { status: 500 })
  }
}

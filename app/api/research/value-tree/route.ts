import { researchService } from "@/lib/research-service"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { industry, platform } = await req.json()

    if (!industry || !platform) {
      return Response.json({ error: "Industry and platform are required" }, { status: 400 })
    }

    const valueTree = await researchService.generateValueTree(industry, platform)

    return Response.json(valueTree)
  } catch (error) {
    console.error("Value tree error:", error)
    return Response.json({ error: "Failed to generate value tree" }, { status: 500 })
  }
}

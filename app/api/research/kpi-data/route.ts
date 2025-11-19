import { type NextRequest, NextResponse } from "next/server"
import { researchService } from "@/lib/research-service"

export async function POST(request: NextRequest) {
  try {
    const { industry, platform, selectedKPIs } = await request.json()

    if (!industry || !platform || !selectedKPIs || !Array.isArray(selectedKPIs)) {
      return NextResponse.json(
        { error: "Missing required fields: industry, platform, and selectedKPIs array" },
        { status: 400 },
      )
    }

    const kpiData = await researchService.generateKPIData(industry, platform, selectedKPIs)

    return NextResponse.json(kpiData)
  } catch (error) {
    console.error("Error in KPI data API:", error)
    return NextResponse.json({ error: "Failed to generate KPI data" }, { status: 500 })
  }
}

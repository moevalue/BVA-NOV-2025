"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Target, AlertCircle, Brain, Loader2, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AssumptionsProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

interface KPIAssumption {
  kpiName: string
  assumptions: {
    [key: string]: string | number
  }
}

const getKPIBaselines = (kpiName: string, platformSelection: string, industry: string) => {
  const baselines: { [key: string]: { low: string; moderate: string; high: string } } = {
    "AHT – Average handling time": {
      low: "5-10% reduction in AHT",
      moderate: "10-20% reduction in AHT",
      high: "20-35% reduction in AHT",
    },
    "FCR – First Call Resolution / IVR Containment": {
      low: "5-10% improvement in FCR",
      moderate: "10-15% improvement in FCR",
      high: "15-25% improvement in FCR",
    },
    "Agent occupancy/efficiency": {
      low: "3-5% increase in occupancy",
      moderate: "5-10% increase in occupancy",
      high: "10-15% increase in occupancy",
    },
    "Customer Lifetime Value": {
      low: "2-5% increase in CLV",
      moderate: "5-12% increase in CLV",
      high: "12-20% increase in CLV",
    },
    "RPC – Revenue per Call": {
      low: "3-8% increase in RPC",
      moderate: "8-15% increase in RPC",
      high: "15-25% increase in RPC",
    },
    "CSAT (voice, email, self-serve)": {
      low: "0.2-0.5 point improvement",
      moderate: "0.5-1.0 point improvement",
      high: "1.0-1.5 point improvement",
    },
    "NPS score": {
      low: "5-10 point improvement",
      moderate: "10-20 point improvement",
      high: "20-30 point improvement",
    },
    "Improve employee onboarding: field technician": {
      low: "10-20% reduction in time to productivity",
      moderate: "20-35% reduction in time to productivity",
      high: "35-50% reduction in time to productivity",
    },
    "Improve employee retention: field technician": {
      low: "5-10% reduction in attrition",
      moderate: "10-20% reduction in attrition",
      high: "20-30% reduction in attrition",
    },
    "Increase first-time visit fix rate": {
      low: "5-10% improvement in fix rate",
      moderate: "10-20% improvement in fix rate",
      high: "20-30% improvement in fix rate",
    },
    "Reduce service resolution effort: time": {
      low: "10-15% reduction in visit duration",
      moderate: "15-25% reduction in visit duration",
      high: "25-40% reduction in visit duration",
    },
    "Reduce service resolution effort: avoid 2nd technician costs": {
      low: "15-25% reduction in 2-tech visits",
      moderate: "25-40% reduction in 2-tech visits",
      high: "40-60% reduction in 2-tech visits",
    },
    "Reduce number of on-site service visits: contact center / remote assist": {
      low: "10-20% improvement in remote resolution",
      moderate: "20-35% improvement in remote resolution",
      high: "35-50% improvement in remote resolution",
    },
    "Reduce number of on-site service visits: reduce missed appointments": {
      low: "20-30% reduction in missed visits",
      moderate: "30-50% reduction in missed visits",
      high: "50-70% reduction in missed visits",
    },
    "Reduce travel costs: avoid unnecessary visits": {
      low: "10-15% reduction in travel costs",
      moderate: "15-25% reduction in travel costs",
      high: "25-40% reduction in travel costs",
    },
    "Reduce travel costs: travelling distance": {
      low: "5-10% reduction in travel distance",
      moderate: "10-20% reduction in travel distance",
      high: "20-30% reduction in travel distance",
    },
    "Overhead cost": {
      low: "5-10% reduction in overhead",
      moderate: "10-20% reduction in overhead",
      high: "20-35% reduction in overhead",
    },
    "Reduced technology/software spend": {
      low: "10-20% reduction in tech spend",
      moderate: "20-35% reduction in tech spend",
      high: "35-50% reduction in tech spend",
    },
  }

  return (
    baselines[kpiName] || {
      low: "5-10% improvement",
      moderate: "10-20% improvement",
      high: "20-35% improvement",
    }
  )
}

const getIndustryAverages = (kpiName: string, platformSelection: string, industry: string, companySize: string) => {
  const industryAverages: { [key: string]: { [key: string]: { small: string; medium: string; large: string } } } = {
    "AHT – Average handling time": {
      "field-services": {
        small: "8-12 minutes average AHT",
        medium: "6-10 minutes average AHT",
        large: "4-8 minutes average AHT",
      },
      ccaas: {
        small: "6-9 minutes average AHT",
        medium: "4-7 minutes average AHT",
        large: "3-5 minutes average AHT",
      },
    },
    "FCR – First Call Resolution / IVR Containment": {
      "field-services": {
        small: "65-75% FCR rate",
        medium: "70-80% FCR rate",
        large: "75-85% FCR rate",
      },
      ccaas: {
        small: "70-80% FCR rate",
        medium: "75-85% FCR rate",
        large: "80-90% FCR rate",
      },
    },
    "Agent occupancy/efficiency": {
      "field-services": {
        small: "60-70% occupancy",
        medium: "65-75% occupancy",
        large: "70-80% occupancy",
      },
      ccaas: {
        small: "65-75% occupancy",
        medium: "70-80% occupancy",
        large: "75-85% occupancy",
      },
    },
    "Customer Lifetime Value": {
      "field-services": {
        small: "$2,000-$5,000 CLV",
        medium: "$5,000-$15,000 CLV",
        large: "$15,000-$50,000 CLV",
      },
      ccaas: {
        small: "$1,500-$3,000 CLV",
        medium: "$3,000-$8,000 CLV",
        large: "$8,000-$25,000 CLV",
      },
    },
    "CSAT (voice, email, self-serve)": {
      "field-services": {
        small: "3.8-4.2 CSAT score",
        medium: "4.0-4.4 CSAT score",
        large: "4.2-4.6 CSAT score",
      },
      ccaas: {
        small: "3.9-4.3 CSAT score",
        medium: "4.1-4.5 CSAT score",
        large: "4.3-4.7 CSAT score",
      },
    },
    "NPS score": {
      "field-services": {
        small: "20-35 NPS",
        medium: "30-45 NPS",
        large: "40-60 NPS",
      },
      ccaas: {
        small: "25-40 NPS",
        medium: "35-50 NPS",
        large: "45-65 NPS",
      },
    },
    "Improve employee onboarding: field technician": {
      "field-services": {
        small: "45-60 days to productivity",
        medium: "30-45 days to productivity",
        large: "20-35 days to productivity",
      },
    },
    "Improve employee retention: field technician": {
      "field-services": {
        small: "15-25% annual attrition",
        medium: "10-20% annual attrition",
        large: "8-15% annual attrition",
      },
    },
    "Increase first-time visit fix rate": {
      "field-services": {
        small: "60-70% fix rate",
        medium: "70-80% fix rate",
        large: "75-85% fix rate",
      },
    },
    "Reduce service resolution effort: time": {
      "field-services": {
        small: "2-4 hours per visit",
        medium: "1.5-3 hours per visit",
        large: "1-2.5 hours per visit",
      },
    },
    "Reduce travel costs: travelling distance": {
      "field-services": {
        small: "$50-$100 travel cost per visit",
        medium: "$40-$80 travel cost per visit",
        large: "$30-$60 travel cost per visit",
      },
    },
  }

  const platformData = industryAverages[kpiName]?.[platformSelection] || industryAverages[kpiName]?.["default"]
  if (!platformData) {
    return {
      small: "Industry data not available",
      medium: "Industry data not available",
      large: "Industry data not available",
    }
  }

  return platformData
}

const kpiAssumptionFields = {
  "AHT – Average handling time": [
    { key: "currentAHT", label: "Current AHT (minutes)", type: "number", required: true },
    {
      key: "targetAHTReduction",
      label: "Target AHT Reduction (%)",
      type: "number",
      required: true,
      platformSpecific: "ccaas",
    },
    {
      key: "targetAHT",
      label: "Target AHT (minutes)",
      type: "number",
      required: true,
      platformSpecific: "field-services",
    },
    { key: "annualCalls", label: "Annual Number of Calls", type: "number", required: true },
    { key: "costPerMinute", label: "Cost per Minute ($)", type: "number", required: true },
    { key: "implementationTime", label: "Time to Achieve Target (months)", type: "number", required: false },
  ],
  "Improve employee onboarding: field technician": [
    { key: "fieldServiceFTEs", label: "Field Service FTEs", type: "number", required: true },
    {
      key: "ftesOnboardedPerYear",
      label: "Field Service FTEs Onboarded per year (%)",
      type: "number",
      required: true,
    },
    {
      key: "currentTimeToProductivity",
      label: "Current time to productivity for Field Service FTEs (business days)",
      type: "number",
      required: true,
    },
    { key: "dailyCostFieldServiceFTE", label: "Daily cost of field service FTE ($)", type: "number", required: true },
    {
      key: "timeToProductivityReduction",
      label: "Field service time-to-productivity reduction (%)",
      type: "number",
      required: true,
    },
  ],
  "Improve employee retention: field technician": [
    { key: "fieldServiceFTEs", label: "Field Service FTEs", type: "number", required: true },
    {
      key: "fieldServiceAttritionRate",
      label: "Field Service FTE Attrition Rate (%)",
      type: "number",
      required: true,
    },
    {
      key: "costOfHiring",
      label: "Cost of searching and hiring a new Field Service FTE ($)",
      type: "number",
      required: true,
    },
    {
      key: "attritionRateReduction",
      label: "Field Service FTE attrition rate reduction (%)",
      type: "number",
      required: true,
    },
  ],
  "Increase first-time visit fix rate": [
    {
      key: "totalFieldServiceCases",
      label: "Total # of Field Service Cases per year",
      type: "number",
      required: true,
    },
    {
      key: "currentResolutionRate",
      label: "Current field service resolution Rate (%)",
      type: "number",
      required: true,
    },
    { key: "avgVisitsPerCase", label: "Average Number of Visits per case", type: "number", required: true },
    { key: "costPerVisit", label: "Cost per field service visit ($)", type: "number", required: true },
    {
      key: "resolutionRateImprovement",
      label: "Improvement in Field Service resolution rate (%)",
      type: "number",
      required: true,
    },
  ],
  "Reduce service resolution effort: time": [
    {
      key: "totalFieldServiceCases",
      label: "Total # of Field Service Cases per year",
      type: "number",
      required: true,
    },
    { key: "avgVisitsPerCase", label: "Average Number of Visits per case", type: "number", required: true },
    { key: "costPerVisit", label: "Cost per field service visit ($)", type: "number", required: true },
    {
      key: "visitDurationReduction",
      label: "Reduction in visit duration (%)",
      type: "number",
      required: true,
    },
  ],
  "Reduce service resolution effort: avoid 2nd technician costs": [
    {
      key: "totalFieldServiceCases",
      label: "Total # of Field Service Cases per year",
      type: "number",
      required: true,
    },
    { key: "avgVisitsPerCase", label: "Average Number of Visits per case", type: "number", required: true },
    {
      key: "visitsRequiring2Technicians",
      label: "Visits requiring 2 technicians (%)",
      type: "number",
      required: true,
    },
    { key: "costPerVisit", label: "Cost per field service visit ($)", type: "number", required: true },
    {
      key: "reductionIn2TechnicianVisits",
      label: "Reduction in visits requiring 2 technicians (%)",
      type: "number",
      required: true,
    },
  ],
  "Reduce number of on-site service visits: contact center / remote assist": [
    {
      key: "totalFieldServiceCases",
      label: "Total # of Field Service Cases per year",
      type: "number",
      required: true,
    },
    {
      key: "currentContactCenterResolutionRate",
      label: "Current Contact Center resolution rate (%)",
      type: "number",
      required: true,
    },
    { key: "avgVisitsPerCase", label: "Average Number of Visits per case", type: "number", required: true },
    { key: "costPerVisit", label: "Cost per field service visit ($)", type: "number", required: true },
    {
      key: "contactCenterResolutionImprovement",
      label: "Improvement in Contact Center resolution rate (%)",
      type: "number",
      required: true,
    },
  ],
  "Reduce number of on-site service visits: reduce missed appointments": [
    {
      key: "totalFieldServiceCases",
      label: "Total # of Field Service Cases per year",
      type: "number",
      required: true,
    },
    {
      key: "currentMissedVisitsRate",
      label: "Current missed visits rate (%)",
      type: "number",
      required: true,
    },
    { key: "avgVisitsPerCase", label: "Average Number of Visits per case", type: "number", required: true },
    { key: "costPerVisit", label: "Cost per field service visit ($)", type: "number", required: true },
    {
      key: "missedVisitsReduction",
      label: "Reduction in missed visits rate (%)",
      type: "number",
      required: true,
    },
  ],
  "Reduce travel costs: avoid unnecessary visits": [
    {
      key: "totalFieldServiceCases",
      label: "Total # of Field Service Cases per year",
      type: "number",
      required: true,
    },
    {
      key: "currentResolutionRate",
      label: "Current field service resolution Rate (%)",
      type: "number",
      required: true,
    },
    { key: "avgVisitsPerCase", label: "Average Number of Visits per case", type: "number", required: true },
    { key: "travelCostPerVisit", label: "Travel cost per visit ($)", type: "number", required: true },
    {
      key: "resolutionRateImprovement",
      label: "Improvement in Field Service resolution rate (%)",
      type: "number",
      required: true,
    },
  ],
  "Reduce travel costs: travelling distance": [
    {
      key: "totalFieldServiceCases",
      label: "Total # of Field Service Cases per year",
      type: "number",
      required: true,
    },
    { key: "travelCostPerVisit", label: "Travel cost per visit ($)", type: "number", required: true },
    { key: "avgVisitsPerCase", label: "Average Number of Visits per case", type: "number", required: true },
    {
      key: "travelDistanceReduction",
      label: "Reduction in travel distance per visit (%)",
      type: "number",
      required: true,
    },
  ],
  "FCR – First Call Resolution / IVR Containment": [
    { key: "currentFCR", label: "Current FCR Rate (%)", type: "number", required: true },
    { key: "targetFCR", label: "Target FCR Rate (%)", type: "number", required: true },
    { key: "annualCalls", label: "Annual Number of Calls", type: "number", required: true },
    { key: "repeatCallCost", label: "Cost per Repeat Call ($)", type: "number", required: true },
    { key: "avgResolutionTime", label: "Average Resolution Time (minutes)", type: "number", required: false },
  ],
  "Agent occupancy/efficiency": [
    { key: "currentOccupancy", label: "Current Agent Occupancy (%)", type: "number", required: true },
    { key: "targetOccupancy", label: "Target Agent Occupancy (%)", type: "number", required: true },
    { key: "numberOfAgents", label: "Number of Agents", type: "number", required: true },
    { key: "avgAgentSalary", label: "Average Agent Salary ($)", type: "number", required: true },
    { key: "workingHoursPerDay", label: "Working Hours per Day", type: "number", required: false },
  ],
  "Customer Lifetime Value": [
    { key: "currentCLV", label: "Current Customer Lifetime Value ($)", type: "number", required: true },
    { key: "targetCLV", label: "Target Customer Lifetime Value ($)", type: "number", required: true },
    { key: "customerBase", label: "Total Customer Base", type: "number", required: true },
    { key: "churnRate", label: "Current Churn Rate (%)", type: "number", required: true },
    { key: "acquisitionCost", label: "Customer Acquisition Cost ($)", type: "number", required: false },
  ],
  "RPC – Revenue per Call": [
    { key: "currentRPC", label: "Current Revenue per Call ($)", type: "number", required: true },
    { key: "targetRPC", label: "Target Revenue per Call ($)", type: "number", required: true },
    { key: "annualCalls", label: "Annual Number of Calls", type: "number", required: true },
    { key: "conversionRate", label: "Current Conversion Rate (%)", type: "number", required: true },
    { key: "avgOrderValue", label: "Average Order Value ($)", type: "number", required: false },
  ],
  "CSAT (voice, email, self-serve)": [
    { key: "currentCSAT", label: "Current CSAT Score", type: "number", required: true },
    { key: "targetCSAT", label: "Target CSAT Score", type: "number", required: true },
    { key: "surveyResponses", label: "Monthly Survey Responses", type: "number", required: true },
    { key: "retentionImpact", label: "CSAT Impact on Retention (%)", type: "number", required: true },
    { key: "revenuePerCustomer", label: "Average Revenue per Customer ($)", type: "number", required: false },
  ],
  "NPS score": [
    { key: "currentNPS", label: "Current NPS Score", type: "number", required: true },
    { key: "targetNPS", label: "Target NPS Score", type: "number", required: true },
    { key: "customerBase", label: "Total Customer Base", type: "number", required: true },
    { key: "referralRate", label: "Referral Rate per Promoter (%)", type: "number", required: true },
    { key: "referralValue", label: "Average Value per Referral ($)", type: "number", required: false },
  ],
  "Overhead cost": [
    { key: "currentOverhead", label: "Current Monthly Overhead Cost ($)", type: "number", required: true },
    { key: "targetReduction", label: "Target Cost Reduction (%)", type: "number", required: true },
    { key: "costCategories", label: "Main Cost Categories", type: "text", required: false },
    { key: "implementationCost", label: "Implementation Cost ($)", type: "number", required: false },
  ],
  "Reduced technology/software spend": [
    { key: "currentTechSpend", label: "Current Annual Tech Spend ($)", type: "number", required: true },
    { key: "targetReduction", label: "Target Reduction (%)", type: "number", required: true },
    { key: "licenseCosts", label: "Current License Costs ($)", type: "number", required: true },
    { key: "maintenanceCosts", label: "Current Maintenance Costs ($)", type: "number", required: true },
    { key: "newSolutionCost", label: "New Solution Annual Cost ($)", type: "number", required: false },
  ],
}

export function Assumptions({ data, onUpdate, onNext, onPrevious }: AssumptionsProps) {
  const [kpiAssumptions, setKpiAssumptions] = useState<KPIAssumption[]>([])
  const initializedRef = useRef(false)
  const lastSyncedKPIsRef = useRef<string>("") // Track the last synced KPI state

  const [benchmarkData, setBenchmarkData] = useState<{
    metrics: any[]
    sources: string[]
    lastUpdated: string
    loading: boolean
  }>({
    metrics: [],
    sources: [],
    lastUpdated: "",
    loading: false,
  })

  const [kpiData, setKpiData] = useState<{
    baselines: any[]
    industryAverages: any[]
    sources: string[]
    lastUpdated: string
    loading: boolean
  }>({
    baselines: [],
    industryAverages: [],
    sources: [],
    lastUpdated: "",
    loading: false,
  })

  const [industryBenchmarks, setIndustryBenchmarks] = useState<{
    [key: string]: {
      small: string
      medium: string
      large: string
      sources: string[]
      lastUpdated: string
      confidence: string
    }
  }>({})

  const [benchmarkLoading, setBenchmarkLoading] = useState<{ [key: string]: boolean }>({})

  const selectedKPIs = Array.isArray(data.kpis) ? data.kpis : []

  const kpiNamesString = useMemo(() => {
    return selectedKPIs.map((kpi: any) => (typeof kpi === "string" ? kpi : kpi.name)).join(",")
  }, [selectedKPIs.length, JSON.stringify(selectedKPIs)])

  const [analysisResult, setAnalysisResult] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    const selectedKPINames = selectedKPIs.map((kpi: any) => (typeof kpi === "string" ? kpi : kpi.name))

    if (selectedKPINames.length === 0) {
      return
    }

    // Create a stable key for the current KPI selection
    const currentKPIsKey = selectedKPINames.sort().join("|")

    // Skip if we've already synced these exact KPIs
    if (lastSyncedKPIsRef.current === currentKPIsKey) {
      return
    }

    // Check if we need to initialize or update
    const existingAssumptions = data.kpiAssumptions || []
    const existingKPINames = existingAssumptions.map((ka: KPIAssumption) => ka.kpiName)

    // Only update if KPIs have actually changed
    const kpisChanged =
      selectedKPINames.length !== existingKPINames.length ||
      selectedKPINames.some((name: string) => !existingKPINames.includes(name))

    if (!kpisChanged && initializedRef.current) {
      // KPIs haven't changed and we've already initialized
      if (kpiAssumptions.length === 0 && existingAssumptions.length > 0) {
        setKpiAssumptions(existingAssumptions)
      }
      lastSyncedKPIsRef.current = currentKPIsKey
      return
    }

    initializedRef.current = true
    lastSyncedKPIsRef.current = currentKPIsKey

    // Create new assumptions array with all selected KPIs
    const newAssumptions = selectedKPINames.map((kpiName: string) => {
      // Keep existing assumptions if they exist
      const existing = existingAssumptions.find((ka: KPIAssumption) => ka.kpiName === kpiName)
      return existing || { kpiName, assumptions: {} }
    })

    setKpiAssumptions(newAssumptions)

    // Only update parent if assumptions actually changed and we're not in initial render
    if (kpisChanged && initializedRef.current) {
      // Use setTimeout to defer the update to after render completes
      setTimeout(() => {
        onUpdate({ ...data, kpiAssumptions: newAssumptions })
      }, 0)
    }
  }, [kpiNamesString]) // Only depend on stable KPI names string

  const fetchedKPIsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const fetchRealTimeBenchmarks = async () => {
      if (!data.platformSelection || !data.industry || kpiAssumptions.length === 0) {
        return
      }

      // Fetch benchmarks for each KPI
      for (const kpiAssumption of kpiAssumptions) {
        const cacheKey = `${kpiAssumption.kpiName}-${data.platformSelection}-${data.industry}`

        // Skip if already fetched
        if (fetchedKPIsRef.current.has(cacheKey)) {
          continue
        }

        // Mark as being fetched
        fetchedKPIsRef.current.add(cacheKey)
        setBenchmarkLoading((prev) => ({ ...prev, [cacheKey]: true }))

        try {
          console.log("[v0] Fetching real-time benchmarks for:", kpiAssumption.kpiName)

          const response = await fetch("/api/industry-benchmarks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              kpiName: kpiAssumption.kpiName,
              industry: data.industry,
              platform: data.platformSelection,
              companySize: data.companySize,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch benchmarks: ${response.statusText}`)
          }

          const result = await response.json()
          console.log("[v0] Received benchmark data:", result)

          if (result.benchmarks && result.benchmarks.length > 0) {
            const benchmark = result.benchmarks[0]
            setIndustryBenchmarks((prev) => ({
              ...prev,
              [cacheKey]: {
                small: benchmark.companySize.small,
                medium: benchmark.companySize.medium,
                large: benchmark.companySize.large,
                sources: benchmark.sources,
                lastUpdated: benchmark.lastUpdated,
                confidence: benchmark.confidence,
              },
            }))
          }
        } catch (error) {
          console.error("[v0] Error fetching benchmark data:", error)
          // Remove from fetched set on error so it can be retried
          fetchedKPIsRef.current.delete(cacheKey)
        } finally {
          setBenchmarkLoading((prev) => ({ ...prev, [cacheKey]: false }))
        }
      }
    }

    fetchRealTimeBenchmarks()
  }, [data.platformSelection, data.industry, data.companySize, kpiNamesString]) // Depend on stable KPI names string instead of kpiAssumptions

  const analyzeAssumptions = async () => {
    if (kpiAssumptions.length === 0) {
      alert("Please add some KPI assumptions before analyzing")
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult("")
    setShowAnalysis(true)

    try {
      console.log("[v0] Starting assumption analysis...")
      console.log("[v0] Request data:", {
        kpiAssumptions,
        industry: data.industry,
        platform: data.platformSelection,
        companySize: data.companySize,
      })

      const response = await fetch("/api/assumptions/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kpiAssumptions,
          industry: data.industry,
          platformSelection: data.platformSelection,
          companySize: data.companySize,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error:", errorText)
        throw new Error(errorText || `API request failed with status ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        console.log("[v0] Starting to read stream...")
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            console.log("[v0] Stream complete")
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          fullResponse += chunk
          setAnalysisResult(fullResponse)
        }
      }
    } catch (error) {
      console.error("[v0] Error analyzing assumptions:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setAnalysisResult(
        `Error: ${errorMessage}\n\nPlease check:\n1. Your PERPLEXITY_API_KEY environment variable is set\n2. Your API key is valid\n3. You have internet connectivity`,
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getFieldsForKPI = (kpiName: string) => {
    // Find exact match first
    if (kpiAssumptionFields[kpiName as keyof typeof kpiAssumptionFields]) {
      let fields = kpiAssumptionFields[kpiName as keyof typeof kpiAssumptionFields]

      if (kpiName === "AHT – Average handling time") {
        fields = fields.filter((field) => {
          if (field.platformSpecific === "ccaas" && data.platformSelection !== "ccaas") {
            return false
          }
          if (field.platformSpecific === "field-services" && data.platformSelection === "ccaas") {
            return false
          }
          return true
        })
      }

      return fields
    }

    // Find partial match for similar KPIs
    const matchingKey = Object.keys(kpiAssumptionFields).find(
      (key) =>
        kpiName.toLowerCase().includes(key.toLowerCase().split(" ")[0]) ||
        key.toLowerCase().includes(kpiName.toLowerCase().split(" ")[0]),
    )

    if (matchingKey) {
      return kpiAssumptionFields[matchingKey as keyof typeof kpiAssumptionFields]
    }

    // Default fields for unknown KPIs
    return [
      { key: "currentValue", label: "Current Value", type: "number", required: true },
      { key: "targetValue", label: "Target Value", type: "number", required: true },
      { key: "baselineData", label: "Baseline Data Source", type: "text", required: false },
      { key: "assumptions", label: "Key Assumptions", type: "text", required: false },
    ]
  }

  const getKPIBaselines = (kpiName: string, platformSelection: string, industry: string) => {
    // Try to find dynamic data first
    const dynamicBaseline = kpiData.baselines.find(
      (baseline) =>
        baseline.kpiName === kpiName || baseline.kpiName.toLowerCase().includes(kpiName.toLowerCase().split(" ")[0]),
    )

    if (dynamicBaseline) {
      return {
        low: dynamicBaseline.low,
        moderate: dynamicBaseline.moderate,
        high: dynamicBaseline.high,
        source: dynamicBaseline.source,
      }
    }

    // Fallback to static baselines
    const baselines: { [key: string]: { low: string; moderate: string; high: string } } = {
      "AHT – Average handling time": {
        low: "5-10% reduction in AHT",
        moderate: "10-20% reduction in AHT",
        high: "20-35% reduction in AHT",
      },
      "FCR – First Call Resolution / IVR Containment": {
        low: "5-10% improvement in FCR",
        moderate: "10-15% improvement in FCR",
        high: "15-25% improvement in FCR",
      },
      "Agent occupancy/efficiency": {
        low: "3-5% increase in occupancy",
        moderate: "5-10% increase in occupancy",
        high: "10-15% increase in occupancy",
      },
      "Customer Lifetime Value": {
        low: "2-5% increase in CLV",
        moderate: "5-12% increase in CLV",
        high: "12-20% increase in CLV",
      },
      "RPC – Revenue per Call": {
        low: "3-8% increase in RPC",
        moderate: "8-15% increase in RPC",
        high: "15-25% increase in RPC",
      },
      "CSAT (voice, email, self-serve)": {
        low: "0.2-0.5 point improvement",
        moderate: "0.5-1.0 point improvement",
        high: "1.0-1.5 point improvement",
      },
      "NPS score": {
        low: "5-10 point improvement",
        moderate: "10-20 point improvement",
        high: "20-30 point improvement",
      },
      "Improve employee onboarding: field technician": {
        low: "10-20% reduction in time to productivity",
        moderate: "20-35% reduction in time to productivity",
        high: "35-50% reduction in time to productivity",
      },
      "Improve employee retention: field technician": {
        low: "5-10% reduction in attrition",
        moderate: "10-20% reduction in attrition",
        high: "20-30% reduction in attrition",
      },
      "Increase first-time visit fix rate": {
        low: "5-10% improvement in fix rate",
        moderate: "10-20% improvement in fix rate",
        high: "20-30% improvement in fix rate",
      },
      "Reduce service resolution effort: time": {
        low: "10-15% reduction in visit duration",
        moderate: "15-25% reduction in visit duration",
        high: "25-40% reduction in visit duration",
      },
      "Reduce service resolution effort: avoid 2nd technician costs": {
        low: "15-25% reduction in 2-tech visits",
        moderate: "25-40% reduction in 2-tech visits",
        high: "40-60% reduction in 2-tech visits",
      },
      "Reduce number of on-site service visits: contact center / remote assist": {
        low: "10-20% improvement in remote resolution",
        moderate: "20-35% improvement in remote resolution",
        high: "35-50% improvement in remote resolution",
      },
      "Reduce number of on-site service visits: reduce missed appointments": {
        low: "20-30% reduction in missed visits",
        moderate: "30-50% reduction in missed visits",
        high: "50-70% reduction in missed visits",
      },
      "Reduce travel costs: avoid unnecessary visits": {
        low: "10-15% reduction in travel costs",
        moderate: "15-25% reduction in travel costs",
        high: "25-40% reduction in travel costs",
      },
      "Reduce travel costs: travelling distance": {
        low: "5-10% reduction in travel distance",
        moderate: "10-20% reduction in travel distance",
        high: "20-30% reduction in travel distance",
      },
      "Overhead cost": {
        low: "5-10% reduction in overhead",
        moderate: "10-20% reduction in overhead",
        high: "20-35% reduction in overhead",
      },
      "Reduced technology/software spend": {
        low: "10-20% reduction in tech spend",
        moderate: "20-35% reduction in tech spend",
        high: "35-50% reduction in tech spend",
      },
    }

    return (
      baselines[kpiName] || {
        low: "5-10% improvement",
        moderate: "10-20% improvement",
        high: "20-35% improvement",
      }
    )
  }

  const getIndustryAverages = (kpiName: string, platformSelection: string, industry: string, companySize: string) => {
    const cacheKey = `${kpiName}-${platformSelection}-${industry}`

    if (industryBenchmarks[cacheKey]) {
      const benchmark = industryBenchmarks[cacheKey]
      return {
        small: benchmark.small,
        medium: benchmark.medium,
        large: benchmark.large,
        sources: benchmark.sources,
        lastUpdated: benchmark.lastUpdated,
        confidence: benchmark.confidence,
      }
    }

    // Try to find dynamic data from existing API
    const dynamicAverage = kpiData.industryAverages.find(
      (avg) =>
        (avg.kpiName === kpiName || avg.kpiName.toLowerCase().includes(kpiName.toLowerCase().split(" ")[0])) &&
        avg.platform === platformSelection,
    )

    if (dynamicAverage) {
      return {
        small: dynamicAverage.small,
        medium: dynamicAverage.medium,
        large: dynamicAverage.large,
        source: dynamicAverage.source,
      }
    }

    // Fallback to static industry averages
    const industryAverages: { [key: string]: { [key: string]: { small: string; medium: string; large: string } } } = {
      "AHT – Average handling time": {
        "field-services": {
          small: "8-12 minutes average AHT",
          medium: "6-10 minutes average AHT",
          large: "4-8 minutes average AHT",
        },
        ccaas: {
          small: "6-9 minutes average AHT",
          medium: "4-7 minutes average AHT",
          large: "3-5 minutes average AHT",
        },
      },
      "FCR – First Call Resolution / IVR Containment": {
        "field-services": {
          small: "65-75% FCR rate",
          medium: "70-80% FCR rate",
          large: "75-85% FCR rate",
        },
        ccaas: {
          small: "70-80% FCR rate",
          medium: "75-85% FCR rate",
          large: "80-90% FCR rate",
        },
      },
      "Agent occupancy/efficiency": {
        "field-services": {
          small: "60-70% occupancy",
          medium: "65-75% occupancy",
          large: "70-80% occupancy",
        },
        ccaas: {
          small: "65-75% occupancy",
          medium: "70-80% occupancy",
          large: "75-85% occupancy",
        },
      },
      "Customer Lifetime Value": {
        "field-services": {
          small: "$2,000-$5,000 CLV",
          medium: "$5,000-$15,000 CLV",
          large: "$15,000-$50,000 CLV",
        },
        ccaas: {
          small: "$1,500-$3,000 CLV",
          medium: "$3,000-$8,000 CLV",
          large: "$8,000-$25,000 CLV",
        },
      },
      "CSAT (voice, email, self-serve)": {
        "field-services": {
          small: "3.8-4.2 CSAT score",
          medium: "4.0-4.4 CSAT score",
          large: "4.2-4.6 CSAT score",
        },
        ccaas: {
          small: "3.9-4.3 CSAT score",
          medium: "4.1-4.5 CSAT score",
          large: "4.3-4.7 CSAT score",
        },
      },
      "NPS score": {
        "field-services": {
          small: "20-35 NPS",
          medium: "30-45 NPS",
          large: "40-60 NPS",
        },
        ccaas: {
          small: "25-40 NPS",
          medium: "35-50 NPS",
          large: "45-65 NPS",
        },
      },
      "Improve employee onboarding: field technician": {
        "field-services": {
          small: "45-60 days to productivity",
          medium: "30-45 days to productivity",
          large: "20-35 days to productivity",
        },
      },
      "Improve employee retention: field technician": {
        "field-services": {
          small: "15-25% annual attrition",
          medium: "10-20% annual attrition",
          large: "8-15% annual attrition",
        },
      },
      "Increase first-time visit fix rate": {
        "field-services": {
          small: "60-70% fix rate",
          medium: "70-80% fix rate",
          large: "75-85% fix rate",
        },
      },
      "Reduce service resolution effort: time": {
        "field-services": {
          small: "2-4 hours per visit",
          medium: "1.5-3 hours per visit",
          large: "1-2.5 hours per visit",
        },
      },
      "Reduce travel costs: travelling distance": {
        "field-services": {
          small: "$50-$100 travel cost per visit",
          medium: "$40-$80 travel cost per visit",
          large: "$30-$60 travel cost per visit",
        },
      },
    }

    const platformData = industryAverages[kpiName]?.[platformSelection] || industryAverages[kpiName]?.["default"]
    if (!platformData) {
      return {
        small: "Industry data not available",
        medium: "Industry data not available",
        large: "Industry data not available",
      }
    }

    return platformData
  }

  const updateKPIAssumption = (kpiName: string, key: string, value: string | number) => {
    setKpiAssumptions((prevAssumptions) => {
      const updated = prevAssumptions.map((ka) => {
        if (ka.kpiName === kpiName) {
          return {
            ...ka,
            assumptions: {
              ...ka.assumptions,
              [key]: value,
            },
          }
        }
        return ka
      })

      onUpdate({ ...data, kpiAssumptions: updated })
      return updated
    })
  }

  const canProceed =
    Array.isArray(kpiAssumptions) &&
    kpiAssumptions.length > 0 &&
    kpiAssumptions.every((ka) => {
      const fields = getFieldsForKPI(ka.kpiName)
      const requiredFields = fields.filter((f) => f.required)
      return requiredFields.every((field) => ka.assumptions[field.key])
    })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">KPI Assumptions</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Define the specific assumptions and baseline data for each selected KPI. These values will be used to
          calculate the business impact and ROI.
        </p>
      </div>

      {kpiAssumptions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI-Powered Assumption Analysis
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Sparkles className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            </CardTitle>
            <CardDescription>
              Get intelligent insights about your KPI assumptions using advanced AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={analyzeAssumptions}
                disabled={isAnalyzing || kpiAssumptions.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze My Assumptions
                  </>
                )}
              </Button>
              {showAnalysis && (
                <Button variant="outline" onClick={() => setShowAnalysis(!showAnalysis)} size="sm">
                  {showAnalysis ? "Hide Analysis" : "Show Analysis"}
                </Button>
              )}
            </div>

            {showAnalysis && (
              <div className="bg-white border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">AI Analysis Results</span>
                </div>
                {isAnalyzing ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing your assumptions with industry data...</span>
                  </div>
                ) : analysisResult ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{analysisResult}</div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Click "Analyze My Assumptions" to get AI-powered insights</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No KPIs Selected Warning */}
      {selectedKPIs.length === 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>No KPIs Selected</strong>
            <br />
            Please go back to Objectives & KPIs and select at least one KPI to define assumptions.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Assumption Forms */}
      {Array.isArray(kpiAssumptions) &&
        kpiAssumptions.map((kpiAssumption, index) => {
          const fields = getFieldsForKPI(kpiAssumption.kpiName)
          const baselines = getKPIBaselines(kpiAssumption.kpiName, data.platformSelection, data.industry)
          const cacheKey = `${kpiAssumption.kpiName}-${data.platformSelection}-${data.industry}`

          return (
            <Card key={kpiAssumption.kpiName}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  {kpiAssumption.kpiName}
                </CardTitle>
                <CardDescription>
                  Define the baseline values and assumptions for calculating the impact of this KPI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.platformSelection && data.industry && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-yellow-800 mb-3">Industry Baseline Estimates</h4>

                    {benchmarkData.loading || kpiData.loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mx-auto"></div>
                        <p className="text-sm text-yellow-600 mt-2">Loading current industry benchmarks...</p>
                      </div>
                    ) : benchmarkData.metrics.length > 0 ? (
                      <div className="space-y-4">
                        {benchmarkData.metrics
                          .filter((metric) =>
                            metric.name.toLowerCase().includes(kpiAssumption.kpiName.toLowerCase().split(" ")[0]),
                          )
                          .slice(0, 1)
                          .map((metric, index) => (
                            <div key={index} className="bg-white p-3 rounded border">
                              <div className="font-medium text-yellow-800 mb-2">{metric.name}</div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="font-medium text-yellow-700">Industry Average</div>
                                  <div className="text-yellow-600">
                                    {metric.industry_average} {metric.unit}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-yellow-700">Top Quartile</div>
                                  <div className="text-yellow-600">
                                    {metric.top_quartile} {metric.unit}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-yellow-600 mt-2">{metric.description}</div>
                            </div>
                          ))}

                        {benchmarkData.sources.length > 0 && (
                          <div className="text-xs italic text-yellow-600 mt-3">
                            <p>
                              <strong>Sources:</strong> {benchmarkData.sources.join(", ")}
                            </p>
                            <p>
                              <strong>Last Updated:</strong> {benchmarkData.lastUpdated}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
                          <div className="text-center">
                            <div className="font-medium text-yellow-700">Low</div>
                            <div className="text-yellow-600">{baselines.low}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-yellow-700">Moderate</div>
                            <div className="text-yellow-600">{baselines.moderate}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-yellow-700">High</div>
                            <div className="text-yellow-600">{baselines.high}</div>
                          </div>
                        </div>

                        {kpiData.sources.length > 0 && (
                          <div className="text-xs italic text-yellow-600 mt-3">
                            <p>
                              <strong>Sources:</strong> {kpiData.sources.join(", ")}
                            </p>
                            <p>
                              <strong>Last Updated:</strong> {kpiData.lastUpdated}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {data.companySize && (
                      <>
                        <div className="border-t border-yellow-200 pt-3">
                          <h5 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                            Industry Averages by Company Size
                            {industryBenchmarks[cacheKey] && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Real-time Data
                              </Badge>
                            )}
                            {benchmarkLoading[cacheKey] && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Updating...
                              </Badge>
                            )}
                          </h5>

                          {benchmarkLoading[cacheKey] ? (
                            <div className="text-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mx-auto"></div>
                              <p className="text-sm text-yellow-600 mt-2">Fetching latest industry data...</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              {(() => {
                                const averages = getIndustryAverages(
                                  kpiAssumption.kpiName,
                                  data.platformSelection,
                                  data.industry,
                                  data.companySize,
                                )
                                return (
                                  <>
                                    <div className="text-center">
                                      <div className="font-medium text-yellow-700">Small Companies</div>
                                      <div className="text-yellow-600">{averages.small}</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-medium text-yellow-700">Medium Companies</div>
                                      <div className="text-yellow-600">{averages.medium}</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-medium text-yellow-700">Large Companies</div>
                                      <div className="text-yellow-600">{averages.large}</div>
                                    </div>
                                  </>
                                )
                              })()}
                            </div>
                          )}

                          <div className="text-xs italic text-yellow-600 mt-2">
                            <p>
                              {industryBenchmarks[cacheKey]?.sources ? (
                                <>
                                  Real-time data sources: {industryBenchmarks[cacheKey].sources.join(", ")}
                                  <br />
                                  Data confidence: {industryBenchmarks[cacheKey].confidence}
                                  <br />
                                  Last updated: {new Date(industryBenchmarks[cacheKey].lastUpdated).toLocaleString()}
                                </>
                              ) : kpiData.sources.length > 0 ? (
                                <>Company size benchmarks based on: {kpiData.sources.join(", ")}</>
                              ) : (
                                <>
                                  Company size benchmarks based on: Deloitte Enterprise Performance Study 2024, PwC
                                  Operations Excellence Report, KPMG Digital Transformation Index, EY Global Performance
                                  Analytics Survey
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <Label htmlFor={`${kpiAssumption.kpiName}-${field.key}`}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === "text" ? (
                        <Textarea
                          id={`${kpiAssumption.kpiName}-${field.key}`}
                          value={kpiAssumption.assumptions[field.key] || ""}
                          onChange={(e) => updateKPIAssumption(kpiAssumption.kpiName, field.key, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          rows={2}
                        />
                      ) : (
                        <Input
                          id={`${kpiAssumption.kpiName}-${field.key}`}
                          type={field.type}
                          value={kpiAssumption.assumptions[field.key] || ""}
                          onChange={(e) =>
                            updateKPIAssumption(
                              kpiAssumption.kpiName,
                              field.key,
                              field.type === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value,
                            )
                          }
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}

      {/* Summary */}
      {Array.isArray(kpiAssumptions) && kpiAssumptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Assumptions Summary
            </CardTitle>
            <CardDescription>Review your KPI assumptions before proceeding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kpiAssumptions.map((ka) => {
                const fields = getFieldsForKPI(ka.kpiName)
                const requiredFields = fields.filter((f) => f.required)
                const completedRequired = requiredFields.filter((f) => ka.assumptions[f.key]).length
                const isComplete = completedRequired === requiredFields.length

                return (
                  <div key={ka.kpiName} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">{ka.kpiName}</span>
                    <Badge
                      variant={isComplete ? "default" : "secondary"}
                      className={isComplete ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                    >
                      {completedRequired}/{requiredFields.length} Required Fields
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Objectives & KPIs
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="bg-blue-600 hover:bg-blue-700">
          Next: Financial Analysis
        </Button>
      </div>
    </div>
  )
}

export default Assumptions

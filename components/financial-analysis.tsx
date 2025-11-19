"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, DollarSign, TrendingUp, AlertTriangle, Plus, Trash2 } from "lucide-react"

interface CostItem {
  id: string
  costMethod: string
  costType: string
  amount: number
  description: string
  numberOfLicenses?: number
}

interface FinancialData {
  costItems: CostItem[]

  // Benefits
  costSavings: number
  revenueIncrease: number
  productivityGains: number
  otherBenefits: number

  // Parameters
  projectDuration: number
  discountRate: number
  riskFactor: number

  // Calculated values
  totalCosts: number
  totalBenefits: number
  netBenefit: number
  roi: number
  paybackPeriod: number
  npv: number
}

interface FinancialAnalysisProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

function FinancialAnalysis({ data, onUpdate, onNext, onPrevious }: FinancialAnalysisProps) {
  const [financialData, setFinancialData] = useState<FinancialData>({
    costItems: [],
    costSavings: 0,
    revenueIncrease: 0,
    productivityGains: 0,
    otherBenefits: 0,
    projectDuration: 12,
    discountRate: 10,
    riskFactor: 5,
    totalCosts: 0,
    totalBenefits: 0,
    netBenefit: 0,
    roi: 0,
    paybackPeriod: 0,
    npv: 0,
    ...data.financialData,
  })

  const [improvement, setImprovement] = useState<number>(0) // Declare improvement variable
  const [calculatedBenefits, setCalculatedBenefits] = useState({
    costSavings: 0,
    revenueIncrease: 0,
    productivityGains: 0,
    breakdown: [] as { kpi: string; category: string; amount: number; calculation: string }[],
  })

  const addCostItem = () => {
    const newCostItem: CostItem = {
      id: Date.now().toString(),
      costMethod: "",
      costType: "",
      amount: 0,
      description: "",
    }
    setFinancialData((prev) => ({
      ...prev,
      costItems: [...prev.costItems, newCostItem],
    }))
  }

  const updateCostItem = (id: string, field: keyof CostItem, value: string | number) => {
    setFinancialData((prev) => ({
      ...prev,
      costItems: prev.costItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeCostItem = (id: string) => {
    setFinancialData((prev) => ({
      ...prev,
      costItems: prev.costItems.filter((item) => item.id !== id),
    }))
  }

  useEffect(() => {
    const costItemsTotal = financialData.costItems.reduce((sum, item) => {
      let itemCost = item.amount

      if (item.costMethod === "recurring") {
        // Convert monthly amount to annual, then multiply by project duration in years
        const annualCost = item.amount * 12 // Monthly to annual
        itemCost = annualCost * (financialData.projectDuration / 12) // Annual cost over project duration

        if (item.costType === "license" && item.numberOfLicenses) {
          itemCost = itemCost * item.numberOfLicenses
        }
      } else if (item.costMethod === "fixed" && item.costType === "license" && item.numberOfLicenses) {
        itemCost = item.amount * item.numberOfLicenses
      }

      return sum + itemCost
    }, 0)

    const totalCosts = costItemsTotal

    const annualBenefits =
      financialData.costSavings +
      financialData.revenueIncrease +
      financialData.productivityGains +
      financialData.otherBenefits

    const totalBenefits = annualBenefits * (financialData.projectDuration / 12)
    const netBenefit = totalBenefits - totalCosts
    const roi = totalCosts > 0 ? (netBenefit / totalCosts) * 100 : 0
    const paybackPeriod = annualBenefits > 0 ? totalCosts / annualBenefits : 0

    // Simple NPV calculation
    const discountRate = financialData.discountRate / 100
    let npv = -totalCosts
    for (let year = 1; year <= Math.ceil(financialData.projectDuration / 12); year++) {
      npv += annualBenefits / Math.pow(1 + discountRate, year)
    }

    // Only update if calculated values have actually changed to prevent infinite loops
    if (
      Math.abs(financialData.totalCosts - totalCosts) > 0.01 ||
      Math.abs(financialData.totalBenefits - totalBenefits) > 0.01 ||
      Math.abs(financialData.netBenefit - netBenefit) > 0.01 ||
      Math.abs(financialData.roi - roi) > 0.01 ||
      Math.abs(financialData.paybackPeriod - paybackPeriod) > 0.01 ||
      Math.abs(financialData.npv - npv) > 0.01
    ) {
      const updatedData = {
        ...financialData,
        totalCosts,
        totalBenefits,
        netBenefit,
        roi,
        paybackPeriod,
        npv,
      }
      setFinancialData(updatedData)
      onUpdate({ ...data, financialData: updatedData })
    }
  }, [financialData]) // Updated to use financialData as a single dependency

  useEffect(() => {
    const rawAssumptions = data.kpiAssumptions || []
    const assumptions = Array.isArray(rawAssumptions) ? rawAssumptions : []
    console.log("[v0] Assumptions data:", assumptions)

    let calculatedCostSavings = 0
    let calculatedRevenueIncrease = 0
    let calculatedProductivityGains = 0
    const benefitBreakdown: { kpi: string; category: string; amount: number; calculation: string }[] = []

    if (assumptions.length === 0) {
      console.log("[v0] No assumptions found or assumptions is not an array")
      setCalculatedBenefits({
        costSavings: 0,
        revenueIncrease: 0,
        productivityGains: 0,
        breakdown: [],
      })
      return
    }

    assumptions.forEach((kpiAssumption: any) => {
      const kpiName = kpiAssumption.kpiName
      const assumption = kpiAssumption.assumptions

      console.log("[v0] Processing KPI:", kpiName, assumption)

      if (!assumption || Object.keys(assumption).length === 0) {
        console.log("[v0] Skipping KPI due to missing assumptions:", kpiName)
        return
      }

      if (kpiName.includes("Customer Lifetime Value") || kpiName.includes("CLV")) {
        const currentCLV = Number.parseFloat(assumption.currentCLV) || 0
        const targetCLV = Number.parseFloat(assumption.targetCLV) || 0
        const customerBase = Number.parseFloat(assumption.customerBase) || 0
        const churnRate = Number.parseFloat(assumption.churnRate) || 0

        if (targetCLV > currentCLV && customerBase > 0) {
          const clvIncrease = targetCLV - currentCLV
          const annualNewCustomers = customerBase * (churnRate / 100) // Customers to replace due to churn
          const revenueIncrease = clvIncrease * annualNewCustomers
          calculatedRevenueIncrease += revenueIncrease
          benefitBreakdown.push({
            kpi: "Customer Lifetime Value",
            category: "Revenue Increase",
            amount: revenueIncrease,
            calculation: `$${clvIncrease.toFixed(0)} CLV increase × ${annualNewCustomers.toFixed(0)} annual customers`,
          })
        }
      }

      if (kpiName.includes("Call Automation") || kpiName.includes("calls deflected")) {
        const currentFCR = Number.parseFloat(assumption.currentFCR) || 0
        const targetFCR = Number.parseFloat(assumption.targetFCR) || 0
        const annualCalls = Number.parseFloat(assumption.annualCalls) || 0
        const repeatCallCost = Number.parseFloat(assumption.repeatCallCost) || 0

        if (targetFCR > currentFCR && annualCalls > 0 && repeatCallCost > 0) {
          const improvementDecimal = (targetFCR - currentFCR) / 100
          const savings = improvementDecimal * annualCalls * repeatCallCost
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Call Automation",
            category: "Cost Savings",
            amount: savings,
            calculation: `${(improvementDecimal * 100).toFixed(1)}% automation increase × ${annualCalls.toLocaleString()} calls × $${repeatCallCost}/call`,
          })
        }
      }

      if (kpiName.includes("AHT") || kpiName.includes("Average handling time")) {
        const currentAHT = Number.parseFloat(assumption.currentAHT) || 0
        const targetAHTReduction = Number.parseFloat(assumption.targetAHTReduction) || 0
        const targetAHT = Number.parseFloat(assumption.targetAHT) || 0
        const annualCalls = Number.parseFloat(assumption.annualCalls) || 0
        const costPerMinute = Number.parseFloat(assumption.costPerMinute) || 0

        // Calculate actual target AHT based on reduction percentage (for CCaaS) or use direct value (for field services)
        const actualTargetAHT = targetAHTReduction > 0 ? currentAHT * (1 - targetAHTReduction / 100) : targetAHT

        if (currentAHT > actualTargetAHT && annualCalls > 0 && costPerMinute > 0) {
          const timeSavingsMinutes = currentAHT - actualTargetAHT
          const savings = timeSavingsMinutes * annualCalls * costPerMinute
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Average Handling Time",
            category: "Cost Savings",
            amount: savings,
            calculation: `${timeSavingsMinutes.toFixed(1)} min reduction (${targetAHTReduction > 0 ? targetAHTReduction + "% of " + currentAHT : actualTargetAHT} min target) × ${annualCalls.toLocaleString()} calls × $${costPerMinute.toFixed(2)}/min`,
          })
        }
      }

      if (kpiName.includes("FCR") || kpiName.includes("First Call Resolution")) {
        const currentFCR = Number.parseFloat(assumption.currentFCR) || 0
        const targetFCR = Number.parseFloat(assumption.targetFCR) || 0
        const annualCalls = Number.parseFloat(assumption.annualCalls) || 0
        const repeatCallCost = Number.parseFloat(assumption.repeatCallCost) || 0

        if (targetFCR > currentFCR && annualCalls > 0 && repeatCallCost > 0) {
          const improvementDecimal = (targetFCR - currentFCR) / 100
          const savings = improvementDecimal * annualCalls * repeatCallCost
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "First Call Resolution",
            category: "Cost Savings",
            amount: savings,
            calculation: `${(improvementDecimal * 100).toFixed(1)}% improvement × ${annualCalls.toLocaleString()} calls × $${repeatCallCost}/repeat call`,
          })
        }
      }

      if (
        kpiName.includes("Agent") &&
        (kpiName.includes("occupancy") || kpiName.includes("efficiency") || kpiName.includes("Productivity"))
      ) {
        const currentOccupancy = Number.parseFloat(assumption.currentOccupancy) || 0
        const targetOccupancy = Number.parseFloat(assumption.targetOccupancy) || 0
        const numberOfAgents = Number.parseFloat(assumption.numberOfAgents) || 0
        const avgAgentSalary = Number.parseFloat(assumption.avgAgentSalary) || 0

        if (targetOccupancy > currentOccupancy && numberOfAgents > 0 && avgAgentSalary > 0) {
          const efficiencyGain = (targetOccupancy - currentOccupancy) / 100
          const savings = efficiencyGain * numberOfAgents * avgAgentSalary
          calculatedProductivityGains += savings
          benefitBreakdown.push({
            kpi: "Agent Efficiency",
            category: "Productivity Gains",
            amount: savings,
            calculation: `${(efficiencyGain * 100).toFixed(1)}% efficiency gain × ${numberOfAgents} agents × $${avgAgentSalary.toLocaleString()}/agent/year`,
          })
        }
      }

      if (kpiName.includes("RPC") || kpiName.includes("Revenue per Call") || kpiName.includes("revenue per call")) {
        const currentRPC = Number.parseFloat(assumption.currentRPC) || 0
        const targetRPC = Number.parseFloat(assumption.targetRPC) || 0
        const annualCalls = Number.parseFloat(assumption.annualCalls) || 0

        if (targetRPC > currentRPC && annualCalls > 0) {
          const revenueIncrease = (targetRPC - currentRPC) * annualCalls
          calculatedRevenueIncrease += revenueIncrease
          benefitBreakdown.push({
            kpi: "Revenue per Call",
            category: "Revenue Increase",
            amount: revenueIncrease,
            calculation: `$${(targetRPC - currentRPC).toFixed(2)} increase × ${annualCalls.toLocaleString()} calls`,
          })
        }
      }

      if (kpiName.includes("CSAT") || kpiName.includes("Customer Satisfaction") || kpiName.includes("satisfaction")) {
        const currentCSAT = Number.parseFloat(assumption.currentCSAT) || 0
        const targetCSAT = Number.parseFloat(assumption.targetCSAT) || 0
        const surveyResponses = Number.parseFloat(assumption.surveyResponses) || 0
        const retentionImpact = Number.parseFloat(assumption.retentionImpact) || 0
        const revenuePerCustomer = Number.parseFloat(assumption.revenuePerCustomer) || 0

        if (targetCSAT > currentCSAT && surveyResponses > 0 && retentionImpact > 0 && revenuePerCustomer > 0) {
          const satisfactionImprovement = (targetCSAT - currentCSAT) / 100
          const retentionIncrease = satisfactionImprovement * (retentionImpact / 100)
          const revenue = retentionIncrease * surveyResponses * 12 * revenuePerCustomer // Monthly to annual
          calculatedRevenueIncrease += revenue
          benefitBreakdown.push({
            kpi: "Customer Satisfaction",
            category: "Revenue Increase",
            amount: revenue,
            calculation: `${(satisfactionImprovement * 100).toFixed(1)}% satisfaction × ${retentionImpact}% retention impact × ${surveyResponses} monthly responses × $${revenuePerCustomer}/customer`,
          })
        }
      }

      if (kpiName.includes("employee onboarding") && kpiName.includes("field technician")) {
        const fieldServiceFTEs = Number.parseFloat(assumption.fieldServiceFTEs) || 0
        const ftesOnboardedPerYear = Number.parseFloat(assumption.ftesOnboardedPerYear) || 0
        const currentTimeToProductivity = Number.parseFloat(assumption.currentTimeToProductivity) || 0
        const dailyCostFieldServiceFTE = Number.parseFloat(assumption.dailyCostFieldServiceFTE) || 0
        const timeToProductivityReduction = Number.parseFloat(assumption.timeToProductivityReduction) || 0

        if (
          fieldServiceFTEs > 0 &&
          ftesOnboardedPerYear > 0 &&
          currentTimeToProductivity > 0 &&
          dailyCostFieldServiceFTE > 0 &&
          timeToProductivityReduction > 0
        ) {
          const savings =
            fieldServiceFTEs *
            (ftesOnboardedPerYear / 100) *
            currentTimeToProductivity *
            dailyCostFieldServiceFTE *
            (timeToProductivityReduction / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Improve employee onboarding: field technician",
            category: "Cost Savings",
            amount: savings,
            calculation: `${fieldServiceFTEs} FTEs × ${ftesOnboardedPerYear}% onboarded × ${currentTimeToProductivity} days × $${dailyCostFieldServiceFTE}/day × ${timeToProductivityReduction}% reduction`,
          })
        }
      }

      if (kpiName.includes("first-time visit fix") || kpiName.includes("Increase first-time visit fix rate")) {
        const totalFieldServiceCases = Number.parseFloat(assumption.totalFieldServiceCases) || 0
        const currentResolutionRate = Number.parseFloat(assumption.currentResolutionRate) || 0
        const avgVisitsPerCase = Number.parseFloat(assumption.avgVisitsPerCase) || 0
        const costPerVisit = Number.parseFloat(assumption.costPerVisit) || 0
        const resolutionRateImprovement = Number.parseFloat(assumption.resolutionRateImprovement) || 0

        if (
          totalFieldServiceCases > 0 &&
          currentResolutionRate > 0 &&
          avgVisitsPerCase > 0 &&
          costPerVisit > 0 &&
          resolutionRateImprovement > 0
        ) {
          const savings =
            totalFieldServiceCases *
            (currentResolutionRate / 100) *
            avgVisitsPerCase *
            costPerVisit *
            (resolutionRateImprovement / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Increase first-time visit fix rate",
            category: "Cost Savings",
            amount: savings,
            calculation: `${totalFieldServiceCases.toLocaleString()} cases × ${currentResolutionRate}% resolution rate × ${avgVisitsPerCase} visits/case × $${costPerVisit}/visit × ${resolutionRateImprovement}% improvement`,
          })
        }
      }

      if (kpiName.includes("service resolution effort") && kpiName.includes("time")) {
        const totalFieldServiceCases = Number.parseFloat(assumption.totalFieldServiceCases) || 0
        const avgVisitsPerCase = Number.parseFloat(assumption.avgVisitsPerCase) || 0
        const costPerVisit = Number.parseFloat(assumption.costPerVisit) || 0
        const visitDurationReduction = Number.parseFloat(assumption.visitDurationReduction) || 0

        if (totalFieldServiceCases > 0 && avgVisitsPerCase > 0 && costPerVisit > 0 && visitDurationReduction > 0) {
          const savings = totalFieldServiceCases * avgVisitsPerCase * costPerVisit * (visitDurationReduction / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Reduce service resolution effort: time",
            category: "Cost Savings",
            amount: savings,
            calculation: `${totalFieldServiceCases.toLocaleString()} cases × ${avgVisitsPerCase} visits/case × $${costPerVisit}/visit × ${visitDurationReduction}% duration reduction`,
          })
        }
      }

      if (
        kpiName.includes("on-site service visits") &&
        (kpiName.includes("contact center") || kpiName.includes("remote assist"))
      ) {
        const totalFieldServiceCases = Number.parseFloat(assumption.totalFieldServiceCases) || 0
        const currentContactCenterResolutionRate = Number.parseFloat(assumption.currentContactCenterResolutionRate) || 0
        const avgVisitsPerCase = Number.parseFloat(assumption.avgVisitsPerCase) || 0
        const costPerVisit = Number.parseFloat(assumption.costPerVisit) || 0
        const contactCenterResolutionImprovement = Number.parseFloat(assumption.contactCenterResolutionImprovement) || 0

        if (
          totalFieldServiceCases > 0 &&
          currentContactCenterResolutionRate > 0 &&
          avgVisitsPerCase > 0 &&
          costPerVisit > 0 &&
          contactCenterResolutionImprovement > 0
        ) {
          const savings =
            totalFieldServiceCases *
            (currentContactCenterResolutionRate / 100) *
            avgVisitsPerCase *
            costPerVisit *
            (contactCenterResolutionImprovement / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Reduce number of on-site service visits: contact center / remote assist",
            category: "Cost Savings",
            amount: savings,
            calculation: `${totalFieldServiceCases.toLocaleString()} cases × ${currentContactCenterResolutionRate}% contact center resolution × ${avgVisitsPerCase} visits/case × $${costPerVisit}/visit × ${contactCenterResolutionImprovement}% improvement`,
          })
        }
      }

      if (kpiName.includes("employee retention") && kpiName.includes("field technician")) {
        const fieldServiceFTEs = Number.parseFloat(assumption.fieldServiceFTEs) || 0
        const attritionRate = Number.parseFloat(assumption.attritionRate) || 0
        const hiringCost = Number.parseFloat(assumption.hiringCost) || 0
        const attritionReduction = Number.parseFloat(assumption.attritionReduction) || 0

        if (fieldServiceFTEs > 0 && attritionRate > 0 && hiringCost > 0 && attritionReduction > 0) {
          const savings = fieldServiceFTEs * (attritionRate / 100) * hiringCost * (attritionReduction / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Improve employee retention: field technician",
            category: "Cost Savings",
            amount: savings,
            calculation: `${fieldServiceFTEs} FTEs × ${attritionRate}% attrition rate × $${hiringCost.toLocaleString()}/hire × ${attritionReduction}% reduction`,
          })
        }
      }

      if (kpiName.includes("missed appointments") || kpiName.includes("reduce missed")) {
        const totalFieldServiceCases = Number.parseFloat(assumption.totalFieldServiceCases) || 0
        const avgVisitsPerCase = Number.parseFloat(assumption.avgVisitsPerCase) || 0
        const currentMissedVisitsRate = Number.parseFloat(assumption.currentMissedVisitsRate) || 0
        const costPerVisit = Number.parseFloat(assumption.costPerVisit) || 0
        const missedVisitsReduction = Number.parseFloat(assumption.missedVisitsReduction) || 0

        if (
          totalFieldServiceCases > 0 &&
          avgVisitsPerCase > 0 &&
          currentMissedVisitsRate > 0 &&
          costPerVisit > 0 &&
          missedVisitsReduction > 0
        ) {
          const savings =
            totalFieldServiceCases *
            avgVisitsPerCase *
            (currentMissedVisitsRate / 100) *
            costPerVisit *
            (missedVisitsReduction / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Reduce number of on-site service visits: reduce missed appointments",
            category: "Cost Savings",
            amount: savings,
            calculation: `${totalFieldServiceCases.toLocaleString()} cases × ${avgVisitsPerCase} visits/case × ${currentMissedVisitsRate}% missed rate × $${costPerVisit}/visit × ${missedVisitsReduction}% reduction`,
          })
        }
      }

      if (kpiName.includes("avoid 2nd technician") || kpiName.includes("2nd technician costs")) {
        const totalFieldServiceCases = Number.parseFloat(assumption.totalFieldServiceCases) || 0
        const avgVisitsPerCase = Number.parseFloat(assumption.avgVisitsPerCase) || 0
        const visitsRequiring2Technicians = Number.parseFloat(assumption.visitsRequiring2Technicians) || 0
        const costPerVisit = Number.parseFloat(assumption.costPerVisit) || 0
        const reductionIn2TechnicianVisits = Number.parseFloat(assumption.reductionIn2TechnicianVisits) || 0

        if (
          totalFieldServiceCases > 0 &&
          avgVisitsPerCase > 0 &&
          visitsRequiring2Technicians > 0 &&
          costPerVisit > 0 &&
          reductionIn2TechnicianVisits > 0
        ) {
          const savings =
            totalFieldServiceCases *
            avgVisitsPerCase *
            (visitsRequiring2Technicians / 100) *
            costPerVisit *
            (reductionIn2TechnicianVisits / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Reduce service resolution effort: avoid 2nd technician costs",
            category: "Cost Savings",
            amount: savings,
            calculation: `${totalFieldServiceCases.toLocaleString()} cases × ${avgVisitsPerCase} visits/case × ${visitsRequiring2Technicians}% requiring 2 techs × $${costPerVisit}/visit × ${reductionIn2TechnicianVisits}% reduction`,
          })
        }
      }

      if (kpiName.includes("travel costs") && kpiName.includes("avoid unnecessary visits")) {
        const totalFieldServiceCases = Number.parseFloat(assumption.totalFieldServiceCases) || 0
        const currentResolutionRate = Number.parseFloat(assumption.currentResolutionRate) || 0
        const avgVisitsPerCase = Number.parseFloat(assumption.avgVisitsPerCase) || 0
        const travelCostPerVisit = Number.parseFloat(assumption.travelCostPerVisit) || 0
        const resolutionRateImprovement = Number.parseFloat(assumption.resolutionRateImprovement) || 0

        if (
          totalFieldServiceCases > 0 &&
          currentResolutionRate > 0 &&
          avgVisitsPerCase > 0 &&
          travelCostPerVisit > 0 &&
          resolutionRateImprovement > 0
        ) {
          const savings =
            totalFieldServiceCases *
            (currentResolutionRate / 100) *
            avgVisitsPerCase *
            travelCostPerVisit *
            (resolutionRateImprovement / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Reduce travel costs: avoid unnecessary visits",
            category: "Cost Savings",
            amount: savings,
            calculation: `${totalFieldServiceCases.toLocaleString()} cases × ${currentResolutionRate}% resolution rate × ${avgVisitsPerCase} visits/case × $${travelCostPerVisit}/visit × ${resolutionRateImprovement}% improvement`,
          })
        }
      }

      if (kpiName.includes("travel costs") && kpiName.includes("travelling distance")) {
        const totalFieldServiceCases = Number.parseFloat(assumption.totalFieldServiceCases) || 0
        const travelCostPerVisit = Number.parseFloat(assumption.travelCostPerVisit) || 0
        const avgVisitsPerCase = Number.parseFloat(assumption.avgVisitsPerCase) || 0
        const travelDistanceReduction = Number.parseFloat(assumption.travelDistanceReduction) || 0

        if (
          totalFieldServiceCases > 0 &&
          travelCostPerVisit > 0 &&
          avgVisitsPerCase > 0 &&
          travelDistanceReduction > 0
        ) {
          const savings =
            totalFieldServiceCases * travelCostPerVisit * avgVisitsPerCase * (travelDistanceReduction / 100)
          calculatedCostSavings += savings
          benefitBreakdown.push({
            kpi: "Reduce travel costs: travelling distance",
            category: "Cost Savings",
            amount: savings,
            calculation: `${totalFieldServiceCases.toLocaleString()} cases × $${travelCostPerVisit}/visit × ${avgVisitsPerCase} visits/case × ${travelDistanceReduction}% distance reduction`,
          })
        }
      }
    })

    const newBenefits = {
      costSavings: calculatedCostSavings,
      revenueIncrease: calculatedRevenueIncrease,
      productivityGains: calculatedProductivityGains,
      breakdown: benefitBreakdown,
    }

    console.log("[v0] Calculated benefits:", newBenefits)

    setCalculatedBenefits(newBenefits)
    setFinancialData((prev) => ({
      ...prev,
      costSavings: newBenefits.costSavings,
      revenueIncrease: newBenefits.revenueIncrease,
      productivityGains: newBenefits.productivityGains,
    }))
  }, [data.kpiAssumptions])

  const updateField = (field: keyof FinancialData, value: number) => {
    setFinancialData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getROIStatus = (roi: number) => {
    if (roi >= 100) return { label: "Excellent", color: "bg-green-100 text-green-800" }
    if (roi >= 50) return { label: "Good", color: "bg-blue-100 text-blue-800" }
    if (roi >= 20) return { label: "Acceptable", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Poor", color: "bg-red-100 text-red-800" }
  }

  const roiStatus = getROIStatus(financialData.roi)

  const prevBenefitsRef = useRef({
    costSavings: 0,
    revenueIncrease: 0,
    productivityGains: 0,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Financial Analysis</h2>
        <p className="text-muted-foreground">Calculate ROI, NPV, and other financial metrics for your project</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-red-500" />
            Cost Input
          </CardTitle>
          <CardDescription>Add detailed cost items with method and type classification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialData.costItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Cost Method</Label>
                  <Select onValueChange={(value) => updateCostItem(item.id, "costMethod", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Cost</SelectItem>
                      <SelectItem value="recurring">Recurring Cost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cost Type</Label>
                  <Select onValueChange={(value) => updateCostItem(item.id, "costType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="implementation">Implementation Cost</SelectItem>
                      <SelectItem value="license">License Cost</SelectItem>
                      <SelectItem value="maintenance">Maintenance & Support Cost</SelectItem>
                      <SelectItem value="training">Training Cost</SelectItem>
                      <SelectItem value="technology">Technology Cost</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{item.costMethod === "recurring" ? "Monthly Amount" : "Amount"}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={item.amount || ""}
                    onChange={(e) => updateCostItem(item.id, "amount", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2 flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCostItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {item.costType === "license" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Number of Licenses</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.numberOfLicenses || ""}
                      onChange={(e) =>
                        updateCostItem(item.id, "numberOfLicenses", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  {item.costMethod === "recurring" && item.numberOfLicenses && item.amount && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Annual Cost Preview</Label>
                      <div className="p-2 bg-muted/50 rounded text-sm">
                        {formatCurrency(item.amount * 12 * item.numberOfLicenses)} per year
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Input
                  placeholder="Brief description of this cost item"
                  value={item.description}
                  onChange={(e) => updateCostItem(item.id, "description", e.target.value)}
                />
              </div>
            </div>
          ))}

          <Button onClick={addCostItem} variant="outline" className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Cost Item
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-1">
        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Project Benefits (Annual)
            </CardTitle>
            <CardDescription>
              {calculatedBenefits.breakdown.length > 0
                ? "Benefits calculated automatically from KPI assumptions"
                : "No KPI assumptions found. Please complete the Assumptions tab first."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculatedBenefits.breakdown.length > 0 ? (
              <>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Benefit Breakdown by KPI:</h4>
                  {calculatedBenefits.breakdown.map((benefit, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{benefit.kpi}</span>
                        <Badge variant="outline" className="text-xs">
                          {benefit.category}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{benefit.calculation}</span>
                        <span className="font-semibold text-green-600">{formatCurrency(benefit.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />
              </>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Complete the Assumptions tab to automatically calculate project benefits based on your selected KPIs.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Cost Savings</span>
                <span className="font-semibold text-green-600">{formatCurrency(financialData.costSavings)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Revenue Increase</span>
                <span className="font-semibold text-blue-600">{formatCurrency(financialData.revenueIncrease)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Productivity Gains</span>
                <span className="font-semibold text-purple-600">{formatCurrency(financialData.productivityGains)}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherBenefits">Other Benefits (Manual Entry)</Label>
                <Input
                  id="otherBenefits"
                  type="number"
                  placeholder="0"
                  value={financialData.otherBenefits || ""}
                  onChange={(e) => updateField("otherBenefits", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Annual Benefits:</span>
                <span className="text-green-600 font-semibold">
                  {formatCurrency(
                    financialData.costSavings +
                      financialData.revenueIncrease +
                      financialData.productivityGains +
                      financialData.otherBenefits,
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span>Total Benefits:</span>
                <span className="text-green-600">{formatCurrency(financialData.totalBenefits)}</span>
              </div>
            </div>

            {/* Total Costs display */}
            <Separator />
            <div className="flex justify-between items-center font-semibold">
              <span>Total Costs:</span>
              <span className="text-red-600">{formatCurrency(financialData.totalCosts)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Analysis Parameters
          </CardTitle>
          <CardDescription>Set parameters for financial calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="projectDuration">Project Duration (months)</Label>
              <Select onValueChange={(value) => updateField("projectDuration", Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={financialData.projectDuration.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="18">18 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountRate">Discount Rate (%)</Label>
              <Input
                id="discountRate"
                type="number"
                placeholder="10"
                value={financialData.discountRate || ""}
                onChange={(e) => updateField("discountRate", Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskFactor">Risk Factor (%)</Label>
              <Input
                id="riskFactor"
                type="number"
                placeholder="5"
                value={financialData.riskFactor || ""}
                onChange={(e) => updateField("riskFactor", Number.parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Financial Results
          </CardTitle>
          <CardDescription>Calculated financial metrics for your project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">Net Benefit</h4>
              <p className={`text-2xl font-bold ${financialData.netBenefit >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(financialData.netBenefit)}
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">ROI</h4>
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${financialData.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {financialData.roi.toFixed(1)}%
                </p>
                <Badge className={roiStatus.color}>{roiStatus.label}</Badge>
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">Payback Period</h4>
              <p className="text-2xl font-bold text-foreground">{financialData.paybackPeriod.toFixed(1)} years</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">NPV</h4>
              <p className={`text-2xl font-bold ${financialData.npv >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(financialData.npv)}
              </p>
            </div>
          </div>

          {financialData.roi < 20 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Low ROI Warning</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    The calculated ROI is below 20%. Consider reviewing your cost and benefit estimates or exploring
                    ways to increase project value.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Assumptions
        </Button>
        <Button onClick={onNext}>Next: View Results</Button>
      </div>
    </div>
  )
}

export { FinancialAnalysis }
export default FinancialAnalysis

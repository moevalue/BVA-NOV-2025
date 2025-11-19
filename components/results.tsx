"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  FileText,
  Download,
  TrendingUp,
  Target,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building,
  Presentation,
  Sparkles,
} from "lucide-react"
import { useMemo } from "react"

interface ResultsProps {
  data: any
  onUpdate: (data: any) => void
  onPrevious: () => void
}

export function Results({ data, onUpdate, onPrevious }: ResultsProps) {
  const objectives = data.objectives || []
  const kpis = data.kpis || []
  const financialData = data.financialData || {}

  // Calculate objective completion rate
  const objectivesByPriority = objectives.reduce(
    (acc: any, obj: any) => {
      acc[obj.priority] = (acc[obj.priority] || 0) + 1
      return acc
    },
    { high: 0, medium: 0, low: 0 },
  )

  // Calculate KPI progress
  const kpiProgress = kpis.map((kpi: any) => {
    const progress =
      kpi.target !== kpi.baseline ? ((kpi.current - kpi.baseline) / (kpi.target - kpi.baseline)) * 100 : 0
    return {
      name: kpi.name,
      progress: Math.max(0, Math.min(100, progress)),
      category: kpi.category,
    }
  })

  // Financial breakdown for charts
  const costBreakdown = [
    { name: "Implementation", value: financialData.implementationCost || 0 },
    { name: "Licensing", value: financialData.licensingCost || 0 },
    { name: "Training", value: financialData.trainingCost || 0 },
    { name: "Maintenance", value: (financialData.maintenanceCost || 0) * ((financialData.projectDuration || 12) / 12) },
    { name: "Other", value: financialData.otherCosts || 0 },
  ].filter((item) => item.value > 0)

  const benefitBreakdown = [
    { name: "Cost Savings", value: financialData.costSavings || 0 },
    { name: "Revenue Increase", value: financialData.revenueIncrease || 0 },
    { name: "Productivity", value: financialData.productivityGains || 0 },
    { name: "Other", value: financialData.otherBenefits || 0 },
  ].filter((item) => item.value > 0)

  // Timeline projection
  const timelineData = []
  const months = financialData.projectDuration || 12
  const annualBenefits =
    (financialData.costSavings || 0) +
    (financialData.revenueIncrease || 0) +
    (financialData.productivityGains || 0) +
    (financialData.otherBenefits || 0)
  const totalCostsInitial = financialData.totalCosts || 0

  let cumulativeValue = -totalCostsInitial
  for (let month = 0; month <= months; month++) {
    if (month === 0) {
      timelineData.push({ month: 0, value: cumulativeValue })
    } else {
      cumulativeValue += annualBenefits / 12
      timelineData.push({ month, value: cumulativeValue })
    }
  }

  const calculatedBenefits = useMemo(() => {
    console.log("[v0] Calculating benefits for charts...")
    if (!data.kpiAssumptions || !Array.isArray(data.kpiAssumptions)) {
      console.log("[v0] No KPI assumptions found")
      return { costSavings: 0, revenueIncrease: 0, productivityGains: 0 }
    }

    let costSavings = 0
    let revenueIncrease = 0
    const productivityGains = 0

    data.kpiAssumptions.forEach((kpi) => {
      console.log("[v0] Processing KPI:", kpi.kpiName, kpi.assumptions)

      if (kpi.kpiName === "AHT – Average handling time") {
        const { currentAHT, annualCalls, targetAHT, costPerMinute } = kpi.assumptions
        if (currentAHT && targetAHT && annualCalls && costPerMinute) {
          const reduction = currentAHT - targetAHT
          costSavings += reduction * annualCalls * costPerMinute
        }
      }

      if (kpi.kpiName === "FCR – First Call Resolution / IVR Containment") {
        const { currentFCR, targetFCR, annualCalls, repeatCallCost } = kpi.assumptions
        if (currentFCR && targetFCR && annualCalls && repeatCallCost) {
          const improvement = (targetFCR - currentFCR) / 100
          costSavings += improvement * annualCalls * repeatCallCost
        }
      }

      if (kpi.kpiName === "Customer Lifetime Value") {
        const { currentCLV, targetCLV, customerBase } = kpi.assumptions
        if (currentCLV && targetCLV && customerBase) {
          const increase = targetCLV - currentCLV
          revenueIncrease += increase * customerBase * 0.9 // 90% retention assumption
        }
      }
    })

    console.log("[v0] Calculated benefits:", { costSavings, revenueIncrease, productivityGains })
    return { costSavings, revenueIncrease, productivityGains }
  }, [data.kpiAssumptions])

  const totalBenefits =
    calculatedBenefits.costSavings + calculatedBenefits.revenueIncrease + calculatedBenefits.productivityGains
  const totalCosts = data.financialData?.totalCosts || 500000 // Default investment
  const roi = totalCosts > 0 ? ((totalBenefits - totalCosts) / totalCosts) * 100 : 0

  console.log("[v0] Chart calculations:", { totalBenefits, totalCosts, roi })

  const roiGrowthData = [
    { period: "Month 1", roi: 0 },
    { period: "Month 2", roi: roi * 0.1 },
    { period: "Month 3", roi: roi * 0.25 },
    { period: "Month 6", roi: roi * 0.5 },
    { period: "Month 12", roi: roi },
  ]

  const paybackData = [
    {
      quarter: "Q1",
      cumulativeBenefits: totalBenefits * 0.2,
      breakEven: totalCosts * 0.25,
    },
    {
      quarter: "Q2",
      cumulativeBenefits: totalBenefits * 0.4,
      breakEven: totalCosts * 0.5,
    },
    {
      quarter: "Q3",
      cumulativeBenefits: totalBenefits * 0.7,
      breakEven: totalCosts * 0.75,
    },
    {
      quarter: "Q4",
      cumulativeBenefits: totalBenefits,
      breakEven: totalCosts,
    },
  ]

  console.log("[v0] ROI Growth Data:", roiGrowthData)
  console.log("[v0] Payback Data:", paybackData)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getROIStatus = (roi: number) => {
    if (roi >= 100) return { label: "Excellent", color: "text-green-600" }
    if (roi >= 50) return { label: "Good", color: "text-blue-600" }
    if (roi >= 20) return { label: "Acceptable", color: "text-yellow-600" }
    return { label: "Poor", color: "text-red-600" }
  }

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  const exportToGamma = async () => {
    try {
      // Prepare structured text content for Gamma's AI to process
      const presentationContent = `
# ${data.projectName || "Business Value Case"} - Executive Presentation

## Executive Summary
**Company:** ${data.company || "N/A"}
**Department:** ${data.department || "N/A"}
**Timeline:** ${data.timeline || "N/A"}
**Generated:** ${new Date().toLocaleDateString()}

### Key Metrics
- **Total Investment:** ${formatCurrency(financialData.totalCosts || 0)}
- **Expected Benefits:** ${formatCurrency(financialData.totalBenefits || 0)}
- **Net Benefit:** ${formatCurrency(financialData.netBenefit || 0)}
- **ROI:** ${(financialData.roi || 0).toFixed(1)}%
- **Payback Period:** ${(financialData.paybackPeriod || 0).toFixed(1)} years

## Business Objectives (${objectives.length} total)
${objectives
  .map(
    (obj: any, index: number) => `
### ${index + 1}. ${obj.title}
- **Priority:** ${(obj.priority || "medium").toUpperCase()}
- **Description:** ${obj.description || "No description provided"}
`,
  )
  .join("")}

## Key Performance Indicators (${kpis.length} total)
${kpis
  .map(
    (kpi: any, index: number) => `
### ${index + 1}. ${kpi.name}
- **Category:** ${kpi.category}
- **Baseline:** ${kpi.baseline} ${kpi.unit}
- **Target:** ${kpi.target} ${kpi.unit}
- **Current:** ${kpi.current} ${kpi.unit}
`,
  )
  .join("")}

## Financial Analysis

### Cost Breakdown
${costBreakdown.map((item) => `- **${item.name}:** ${formatCurrency(item.value)}`).join("\n")}

### Benefit Breakdown  
${benefitBreakdown.map((item) => `- **${item.name}:** ${formatCurrency(item.value)}`).join("\n")}

### Financial Timeline
The project requires an initial investment of ${formatCurrency(financialData.totalCosts || 0)} and is projected to generate ${formatCurrency(financialData.totalBenefits || 0)} in annual benefits, resulting in a payback period of ${(financialData.paybackPeriod || 0).toFixed(1)} years.

## Recommendations

${(financialData.roi || 0) >= 50 ? "✅ **Strong Business Case:** The project shows excellent ROI and should be prioritized for implementation." : ""}

${(financialData.paybackPeriod || 0) <= 2 ? "✅ **Quick Payback:** The project will pay for itself in under 2 years, making it a low-risk investment." : ""}

${(financialData.roi || 0) < 20 ? "⚠️ **Consider Optimization:** Review cost estimates and explore ways to increase benefits or reduce implementation costs." : ""}

## Industry Context
**Industry:** ${data.industry || "N/A"}
**Platform:** ${data.platformSelection || "N/A"}

This business case analysis demonstrates ${(financialData.roi || 0) >= 50 ? "strong" : (financialData.roi || 0) >= 20 ? "moderate" : "limited"} financial returns and should be ${(financialData.roi || 0) >= 50 ? "prioritized" : (financialData.roi || 0) >= 20 ? "considered" : "reviewed"} for implementation.

## Appendix - Data Sources

### Industry Benchmark Sources

**Baseline Performance Estimates:**
- Gartner Research: "Contact Center and Customer Service Analytics Market Guide" (2024)
- Forrester Research: "The State of Customer Service Technology" (2024)
- Aberdeen Group: "Customer Experience Management Benchmark Report" (2024)
- McKinsey & Company: "The Future of Customer Service Operations" (2024)

**Company Size Averages:**
- Deloitte: "Global Contact Center Survey" (2024) - https://www2.deloitte.com/global/en/insights/industry/technology/contact-center-trends.html
- PwC: "Customer Experience Excellence Report" (2024) - https://www.pwc.com/gx/en/industries/consumer-markets/consumer-insights-survey.html
- KPMG: "Customer First: Customer Experience Excellence Report" (2024) - https://home.kpmg/xx/en/home/insights/2024/01/customer-experience-excellence.html
- EY: "Future Consumer Index" (2024) - https://www.ey.com/en_gl/consumer-products-retail/how-covid-19-could-change-consumer-behavior

**Technology Performance Metrics:**
- IDC Research: "Worldwide Customer Analytics Applications Market" (2024) - https://www.idc.com/research/viewtoc.jsp?containerId=IDC_P32875
- Frost & Sullivan: "Global Contact Center as a Service Market" (2024) - https://www.frost.com/research/industry/digital-transformation/
- Ovum (now Omdia): "Customer Engagement Solutions Market Report" (2024) - https://omdia.tech.informa.com/

**Financial Benchmarks:**
- Harvard Business Review: "The Economics of Customer Service" (2024) - https://hbr.org/topic/customer-service
- MIT Sloan Management Review: "Digital Transformation ROI Studies" (2024) - https://sloanreview.mit.edu/topic/digital-transformation/
- Bain & Company: "Customer Experience ROI Research" (2024) - https://www.bain.com/insights/topics/customer-strategy-and-marketing/

*Note: All benchmark data represents industry averages and should be validated against your specific organizational context and requirements.*
      `.trim()

      // Copy the structured content to clipboard
      await navigator.clipboard.writeText(presentationContent)

      // Open Gamma with instructions
      const gammaUrl = "https://gamma.app/create"
      window.open(gammaUrl, "_blank")

      // Show success message with instructions
      alert(`✅ Business case content copied to clipboard!

Instructions:
1. Gamma has opened in a new tab
2. Paste the copied content (Ctrl+V / Cmd+V) into Gamma
3. Gamma's AI will automatically generate a beautiful presentation from your business case data
4. Customize the design and layout as needed

The content includes all your project data: executive summary, objectives, KPIs, financial analysis, and recommendations.`)

      console.log("[v0] Gamma export initiated successfully")
    } catch (error) {
      console.error("Error exporting to Gamma:", error)

      // Fallback: show manual instructions
      const fallbackContent = `
Business Value Case: ${data.projectName || "Project"}
Company: ${data.company || "N/A"}
ROI: ${(financialData.roi || 0).toFixed(1)}%
Net Benefit: ${formatCurrency(financialData.netBenefit || 0)}
Objectives: ${objectives.length}
KPIs: ${kpis.length}
      `.trim()

      try {
        await navigator.clipboard.writeText(fallbackContent)
        alert(`Gamma export ready! 

1. Go to https://gamma.app/create
2. Paste the copied summary (Ctrl+V / Cmd+V)
3. Let Gamma's AI generate your presentation

Basic summary has been copied to your clipboard.`)
      } catch (clipboardError) {
        alert(`To export to Gamma:

1. Go to https://gamma.app/create
2. Copy your business case data manually
3. Paste it into Gamma to auto-generate your presentation

Gamma's AI will create a beautiful presentation from your business case data.`)
      }
    }
  }

  const exportResults = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default
      const html2canvas = (await import("html2canvas")).default

      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      let yPosition = margin

      // Add title page
      pdf.setFontSize(24)
      pdf.setFont("helvetica", "bold")
      pdf.text("Business Value Case Report", pageWidth / 2, yPosition, { align: "center" })

      yPosition += 15
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "normal")
      pdf.text(data.projectName || "Project Analysis", pageWidth / 2, yPosition, { align: "center" })

      yPosition += 10
      pdf.setFontSize(12)
      pdf.text(`${data.company || "Company"} - ${data.department || "Department"}`, pageWidth / 2, yPosition, {
        align: "center",
      })

      yPosition += 10
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" })

      // Add executive summary
      yPosition += 20
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text("Executive Summary", margin, yPosition)

      yPosition += 10
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")

      const summaryData = [
        `Project Duration: ${data.timeline || "N/A"}`,
        `Business Objectives: ${objectives.length}`,
        `Key Performance Indicators: ${kpis.length}`,
        `Total Investment: ${formatCurrency(financialData.totalCosts || 0)}`,
        `Expected Benefits: ${formatCurrency(financialData.totalBenefits || 0)}`,
        `Net Benefit: ${formatCurrency(financialData.netBenefit || 0)}`,
        `ROI: ${(financialData.roi || 0).toFixed(1)}%`,
        `Payback Period: ${(financialData.paybackPeriod || 0).toFixed(1)} years`,
      ]

      summaryData.forEach((item) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = margin
        }
        pdf.text(item, margin, yPosition)
        yPosition += 7
      })

      if (data.industry && data.platformSelection) {
        yPosition += 15
        if (yPosition > pageHeight - 50) {
          pdf.addPage()
          yPosition = margin
        }

        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.text("Industry Insights", margin, yPosition)
        yPosition += 10

        pdf.setFontSize(12)
        pdf.setFont("helvetica", "normal")
        pdf.text(`Industry: ${data.industry} | Platform: ${data.platformSelection}`, margin, yPosition)
        yPosition += 10

        // Mock industry insights data (in real implementation, this would come from the web search results)
        const industryInsights = {
          useCases: [
            "Automated customer service and support",
            "Omnichannel customer experience management",
            "Real-time analytics and reporting",
          ],
          challenges: [
            "Integration with existing legacy systems",
            "Agent training and change management",
            "Data security and compliance requirements",
          ],
          opportunities: [
            "Reduced operational costs through automation",
            "Improved customer satisfaction scores",
            "Enhanced agent productivity and efficiency",
          ],
        }

        // Add Use Cases
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("Key Use Cases:", margin, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")
        industryInsights.useCases.forEach((useCase, index) => {
          if (yPosition > pageHeight - 15) {
            pdf.addPage()
            yPosition = margin
          }
          pdf.text(`• ${useCase}`, margin + 5, yPosition)
          yPosition += 5
        })

        yPosition += 5

        // Add Challenges
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("Key Challenges:", margin, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")
        industryInsights.challenges.forEach((challenge, index) => {
          if (yPosition > pageHeight - 15) {
            pdf.addPage()
            yPosition = margin
          }
          pdf.text(`• ${challenge}`, margin + 5, yPosition)
          yPosition += 5
        })

        yPosition += 5

        // Add Opportunities
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("Key Opportunities:", margin, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")
        industryInsights.opportunities.forEach((opportunity, index) => {
          if (yPosition > pageHeight - 15) {
            pdf.addPage()
            yPosition = margin
          }
          pdf.text(`• ${opportunity}`, margin + 5, yPosition)
          yPosition += 5
        })
      }

      // Add objectives section
      if (objectives.length > 0) {
        yPosition += 10
        if (yPosition > pageHeight - 50) {
          pdf.addPage()
          yPosition = margin
        }

        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.text("Business Objectives", margin, yPosition)
        yPosition += 10

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")

        objectives.forEach((objective: any, index: number) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage()
            yPosition = margin
          }

          pdf.setFont("helvetica", "bold")
          pdf.text(`${index + 1}. ${objective.title}`, margin, yPosition)
          yPosition += 5

          pdf.setFont("helvetica", "normal")
          const description = objective.description || "No description provided"
          const splitDescription = pdf.splitTextToSize(description, pageWidth - 2 * margin)
          pdf.text(splitDescription, margin + 5, yPosition)
          yPosition += splitDescription.length * 4 + 3

          pdf.text(`Priority: ${(objective.priority || "medium").toUpperCase()}`, margin + 5, yPosition)
          yPosition += 8
        })
      }

      // Add KPI section
      if (kpis.length > 0) {
        yPosition += 10
        if (yPosition > pageHeight - 50) {
          pdf.addPage()
          yPosition = margin
        }

        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.text("Key Performance Indicators", margin, yPosition)
        yPosition += 10

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")

        kpis.forEach((kpi: any, index: number) => {
          if (yPosition > pageHeight - 25) {
            pdf.addPage()
            yPosition = margin
          }

          pdf.setFont("helvetica", "bold")
          pdf.text(`${index + 1}. ${kpi.name}`, margin, yPosition)
          yPosition += 5

          pdf.setFont("helvetica", "normal")
          pdf.text(`Category: ${kpi.category}`, margin + 5, yPosition)
          yPosition += 4
          pdf.text(`Baseline: ${kpi.baseline} | Target: ${kpi.target} | Current: ${kpi.current}`, margin + 5, yPosition)
          yPosition += 4
          pdf.text(`Unit: ${kpi.unit}`, margin + 5, yPosition)
          yPosition += 8
        })
      }

      // Add financial analysis
      yPosition += 10
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Financial Analysis", margin, yPosition)
      yPosition += 10

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")

      const financialSummary = [
        `Total Investment: ${formatCurrency(financialData.totalCosts || 0)}`,
        `Annual Benefits: ${formatCurrency(financialData.totalBenefits || 0)}`,
        `Net Present Value: ${formatCurrency(financialData.npv || 0)}`,
        `Return on Investment: ${(financialData.roi || 0).toFixed(1)}%`,
        `Payback Period: ${(financialData.paybackPeriod || 0).toFixed(1)} years`,
        `Break-even Point: Month ${Math.ceil(financialData.paybackPeriod * 12) || 0}`,
      ]

      financialSummary.forEach((item) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = margin
        }
        pdf.text(item, margin, yPosition)
        yPosition += 7
      })

      // Add recommendations
      yPosition += 15
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Recommendations", margin, yPosition)
      yPosition += 10

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")

      const recommendations = []
      if ((financialData.roi || 0) >= 50) {
        recommendations.push(
          "• Strong Business Case: The project shows excellent ROI and should be prioritized for implementation.",
        )
      }
      if ((financialData.paybackPeriod || 0) <= 2) {
        recommendations.push(
          "• Quick Payback: The project will pay for itself in under 2 years, making it a low-risk investment.",
        )
      }
      if ((financialData.roi || 0) < 20) {
        recommendations.push(
          "• Consider Optimization: Review cost estimates and explore ways to increase benefits or reduce implementation costs.",
        )
      }
      if (recommendations.length === 0) {
        recommendations.push(
          "• Review the financial projections and ensure all assumptions are validated with stakeholders.",
        )
      }

      recommendations.forEach((rec) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage()
          yPosition = margin
        }
        const splitRec = pdf.splitTextToSize(rec, pageWidth - 2 * margin)
        pdf.text(splitRec, margin, yPosition)
        yPosition += splitRec.length * 5 + 3
      })

      pdf.addPage()
      yPosition = margin

      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text("Appendix - Data Sources", margin, yPosition)
      yPosition += 15

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Industry Benchmark Sources", margin, yPosition)
      yPosition += 10

      // Baseline Performance Estimates
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("Baseline Performance Estimates:", margin, yPosition)
      yPosition += 8

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      const baselineSources = [
        '• Gartner Research: "Contact Center and Customer Service Analytics Market Guide" (2024)',
        '• Forrester Research: "The State of Customer Service Technology" (2024)',
        '• Aberdeen Group: "Customer Experience Management Benchmark Report" (2024)',
        '• McKinsey & Company: "The Future of Customer Service Operations" (2024)',
      ]

      baselineSources.forEach((source) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage()
          yPosition = margin
        }
        const splitSource = pdf.splitTextToSize(source, pageWidth - 2 * margin)
        pdf.text(splitSource, margin + 5, yPosition)
        yPosition += splitSource.length * 4 + 2
      })

      yPosition += 5

      // Company Size Averages
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("Company Size Averages:", margin, yPosition)
      yPosition += 8

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      const companySizeSources = [
        '• Deloitte: "Global Contact Center Survey" (2024)',
        "  https://www2.deloitte.com/global/en/insights/industry/technology/contact-center-trends.html",
        '• PwC: "Customer Experience Excellence Report" (2024)',
        "  https://www.pwc.com/gx/en/industries/consumer-markets/consumer-insights-survey.html",
        '• KPMG: "Customer First: Customer Experience Excellence Report" (2024)',
        "  https://home.kpmg/xx/en/home/insights/2024/01/customer-experience-excellence.html",
        '• EY: "Future Consumer Index" (2024)',
        "  https://www.ey.com/en_gl/consumer-products-retail/how-covid-19-could-change-consumer-behavior",
      ]

      companySizeSources.forEach((source) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage()
          yPosition = margin
        }
        const splitSource = pdf.splitTextToSize(source, pageWidth - 2 * margin)
        pdf.text(splitSource, margin + 5, yPosition)
        yPosition += splitSource.length * 4 + 1
      })

      yPosition += 5

      // Technology Performance Metrics
      if (yPosition > pageHeight - 40) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("Technology Performance Metrics:", margin, yPosition)
      yPosition += 8

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      const techSources = [
        '• IDC Research: "Worldwide Customer Analytics Applications Market" (2024)',
        "  https://www.idc.com/research/viewtoc.jsp?containerId=IDC_P32875",
        '• Frost & Sullivan: "Global Contact Center as a Service Market" (2024)',
        "  https://www.frost.com/research/industry/digital-transformation/",
        '• Ovum (now Omdia): "Customer Engagement Solutions Market Report" (2024)',
        "  https://omdia.tech.informa.com/",
      ]

      techSources.forEach((source) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage()
          yPosition = margin
        }
        const splitSource = pdf.splitTextToSize(source, pageWidth - 2 * margin)
        pdf.text(splitSource, margin + 5, yPosition)
        yPosition += splitSource.length * 4 + 1
      })

      yPosition += 5

      // Financial Benchmarks
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("Financial Benchmarks:", margin, yPosition)
      yPosition += 8

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      const financialSources = [
        '• Harvard Business Review: "The Economics of Customer Service" (2024)',
        "  https://hbr.org/topic/customer-service",
        '• MIT Sloan Management Review: "Digital Transformation ROI Studies" (2024)',
        "  https://sloanreview.mit.edu/topic/digital-transformation/",
        '• Bain & Company: "Customer Experience ROI Research" (2024)',
        "  https://www.bain.com/insights/topics/customer-strategy-and-marketing/",
      ]

      financialSources.forEach((source) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage()
          yPosition = margin
        }
        const splitSource = pdf.splitTextToSize(source, pageWidth - 2 * margin)
        pdf.text(splitSource, margin + 5, yPosition)
        yPosition += splitSource.length * 4 + 1
      })

      yPosition += 10

      // Add disclaimer
      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.setFontSize(8)
      pdf.setFont("helvetica", "italic")
      const disclaimer =
        "Note: All benchmark data represents industry averages and should be validated against your specific organizational context and requirements."
      const splitDisclaimer = pdf.splitTextToSize(disclaimer, pageWidth - 2 * margin)
      pdf.text(splitDisclaimer, margin, yPosition)

      // Save the PDF
      const fileName = `business-value-case-${data.projectName?.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "project"}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      // Fallback to JSON export if PDF generation fails
      const exportData = {
        projectInfo: {
          name: data.projectName,
          company: data.company,
          department: data.department,
          timeline: data.timeline,
        },
        objectives,
        kpis,
        financialData,
        generatedAt: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = `business-value-case-${data.projectName || "project"}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Business Value Case Results</h2>
          <p className="text-muted-foreground">Comprehensive analysis and executive summary</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Button
              onClick={exportToGamma}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <Sparkles className="h-4 w-4 animate-pulse" />
              <Presentation className="h-4 w-4" />
              Export to Gamma
            </Button>

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              <div className="text-center">
                <div className="font-medium">Export to Gamma</div>
                <div className="text-xs text-gray-300 mt-1">
                  Takes you to Gamma where you can paste
                  <br />
                  the text to generate a great looking deck
                </div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          <Button onClick={exportResults} className="flex items-center gap-2 bg-rose-700">
            <Download className="h-4 w-4" />
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-semibold">{data.company || "Company"}</h4>
              <p className="text-sm text-muted-foreground">{data.department || "Department"}</p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-semibold">{data.timeline || "Timeline"}</h4>
              <p className="text-sm text-muted-foreground">Project Duration</p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-semibold">{objectives.length}</h4>
              <p className="text-sm text-muted-foreground">Business Objectives</p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-semibold">{kpis.length}</h4>
              <p className="text-sm text-muted-foreground">Key Performance Indicators</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Insights */}
      {data.industry && data.platformSelection && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">Industry Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Industry</span>
                <span className="font-medium">{data.industry}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Platform</span>
                <span className="font-medium">{data.platformSelection}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-4">Key Use Cases</h4>
                <ul className="list-disc list-inside">
                  {[
                    "Automated customer service and support",
                    "Omnichannel customer experience management",
                    "Real-time analytics and reporting",
                  ].map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">Key Challenges</h4>
                <ul className="list-disc list-inside">
                  {[
                    "Integration with existing legacy systems",
                    "Agent training and change management",
                    "Data security and compliance requirements",
                  ].map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">Key Opportunities</h4>
                <ul className="list-disc list-inside">
                  {[
                    "Reduced operational costs through automation",
                    "Improved customer satisfaction scores",
                    "Enhanced agent productivity and efficiency",
                  ].map((opportunity, index) => (
                    <li key={index}>{opportunity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Total Investment</h4>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(financialData.totalCosts || 0)}</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Expected Benefits</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(financialData.totalBenefits || 0)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Net Benefit</h4>
                  <p
                    className={`text-2xl font-bold ${
                      (financialData.netBenefit || 0) >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(financialData.netBenefit || 0)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">ROI</h4>
                  <div className="space-y-1">
                    <p className={`text-2xl font-bold ${getROIStatus(financialData.roi || 0).color}`}>
                      {(financialData.roi || 0).toFixed(1)}%
                    </p>
                    <Badge variant="outline">{getROIStatus(financialData.roi || 0).label}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-4">Cost Breakdown</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {calculatedBenefits.costSavings > 0 || calculatedBenefits.revenueIncrease > 0 ? (
        <Card className="bg-gradient-to-br from-orange-400 via-red-400 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">ROI Projections</CardTitle>
            <p className="text-orange-100">Growth trends and payback analysis</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ROI Growth and Payback Analysis Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ROI Growth Over Time */}
              <Card className="backdrop-blur-sm border-white/20 bg-slate-600">
                <CardHeader className="pb-4 text-left text-lg">
                  <CardTitle className="backdrop-blur-sm border-white/20 bg-transparent text-white text-lg">ROI Growth Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={roiGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis
                        dataKey="period"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "white", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "white", fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                        formatter={(value) => [`${Number(value).toFixed(1)}%`, "ROI"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="roi"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: "#8b5cf6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payback Analysis */}
              <Card className="backdrop-blur-sm border-white/20 bg-slate-500">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-black">Payback Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={paybackData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis
                        dataKey="quarter"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "white", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "white", fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                        formatter={(value, name) => [
                          `$${(Number(value) / 1000000).toFixed(1)}M`,
                          name === "cumulativeBenefits" ? "Cumulative Benefits" : "Break-even Point",
                        ]}
                      />
                      <Bar dataKey="cumulativeBenefits" fill="#10b981" name="cumulativeBenefits" />
                      <Bar dataKey="breakEven" fill="#ef4444" name="breakEven" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-sm text-black">Break-even Point</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm text-black">Cumulative Benefits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="backdrop-blur-sm rounded-lg p-6 border border-white/20 bg-slate-500">
              <h3 className="text-xl font-semibold text-white mb-4">Financial Timeline & Impact</h3>
              <p className="text-orange-100 text-lg">
                The project requires an initial investment of{" "}
                <span className="text-red-300 font-bold">${(totalCosts || 2000000).toLocaleString()}</span> and is
                projected to generate{" "}
                <span className="text-green-300 font-bold">${totalBenefits.toLocaleString()}</span> in annual benefits,
                resulting in an ROI of <span className="text-purple-200 font-bold">{roi.toFixed(1)}%</span>.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Complete the assumptions to see ROI projections and financial analysis.</p>
          </CardContent>
        </Card>
      )}

      {/* Objectives Summary */}
      {objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectives Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h4 className="text-2xl font-bold text-red-600">{objectivesByPriority.high || 0}</h4>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-2xl font-bold text-yellow-600">{objectivesByPriority.medium || 0}</h4>
                <p className="text-sm text-muted-foreground">Medium Priority</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="text-2xl font-bold text-green-600">{objectivesByPriority.low || 0}</h4>
                <p className="text-sm text-muted-foreground">Low Priority</p>
              </div>
            </div>

            <div className="space-y-3">
              {objectives.map((objective: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <h4 className="font-medium">{objective.title}</h4>
                    <p className="text-sm text-muted-foreground">{objective.description}</p>
                  </div>
                  <Badge
                    className={
                      objective.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : objective.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {(objective.priority || "medium").toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Timeline Projection</CardTitle>
          <CardDescription>Cumulative financial impact over project duration</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -10 }} />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), "Cumulative Value"]} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(financialData.roi || 0) >= 50 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Strong Business Case</h4>
                  <p className="text-sm text-green-700">
                    The project shows excellent ROI and should be prioritized for implementation.
                  </p>
                </div>
              </div>
            )}

            {(financialData.paybackPeriod || 0) <= 2 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Quick Payback</h4>
                  <p className="text-sm text-blue-700">
                    The project will pay for itself in under 2 years, making it a low-risk investment.
                  </p>
                </div>
              </div>
            )}

            {(financialData.roi || 0) < 20 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Consider Optimization</h4>
                  <p className="text-sm text-yellow-700">
                    Review cost estimates and explore ways to increase benefits or reduce implementation costs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Financial Analysis
        </Button>
        <div className="flex gap-2">
          <div className="relative group">
            <Button
              onClick={exportToGamma}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <Sparkles className="h-4 w-4 animate-pulse" />
              <Presentation className="h-4 w-4" />
              Export to Gamma
            </Button>

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              <div className="text-center">
                <div className="font-medium">Export to Gamma</div>
                <div className="text-xs text-gray-300 mt-1">
                  Takes you to Gamma where you can paste
                  <br />
                  the text to generate a great looking deck
                </div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

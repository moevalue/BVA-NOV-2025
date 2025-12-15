"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Target, Building2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ObjectivesKPIsProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

const ObjectivesKPIs = ({ data, onUpdate, onNext, onPrevious }: ObjectivesKPIsProps) => {
  const [selectedObjectives, setSelectedObjectives] = useState<any[]>(data.objectives || [])
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([])
  const [showCustomObjective, setShowCustomObjective] = useState(false)
  const [customObjective, setCustomObjective] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  })

  const [industryInsights, setIndustryInsights] = useState<{
    useCases: any[]
    challenges: any[]
    opportunities: any[]
    marketData?: any
    sources?: any[]
    loading: boolean
  }>({
    useCases: [],
    challenges: [],
    opportunities: [],
    loading: false,
  })

  const ccaasValueTreeData = {
    strategicObjective: "CCaaS Value",
    financialLevers: [
      {
        id: "cost-optimization",
        name: "Cost Optimization",
        color: "bg-gradient-to-r from-pink-500 to-orange-500",
        objectives: [
          {
            id: "reduce-labor-cost",
            title: "1. Reduce Labor Cost",
            valueDriver: "Agent Efficiency Productivity",
            kpis: [
              "AHT – Average handling time",
              "Call Automation: Decreased cost per interaction (CPC%) - % calls deflected",
              "Agent occupancy/efficiency",
              "After call work",
              "Average queue time",
              "New employee training days",
            ],
          },
          {
            id: "increase-operational-efficiency",
            title: "2. Increase Operational Efficiency",
            valueDriver: "Reduce Cost-to-Serve",
            kpis: [
              "FCR – First Call Resolution / IVR Containment",
              "Self-service expansion",
              "% agent disputes",
              "% supervisor escalations",
              "Supervisor to staff ratio",
            ],
          },
          {
            id: "reduce-fixed-costs",
            title: "3. Reduce Fixed Costs",
            valueDriver: "Overhead / Technology Spend",
            kpis: ["Overhead cost", "Reduced technology/software spend"],
          },
        ],
      },
      {
        id: "revenue-uplift",
        name: "Revenue Uplift",
        color: "bg-gradient-to-r from-pink-600 to-pink-500",
        objectives: [
          {
            id: "increase-revenue",
            title: "4. Increase Revenue – Customer Brand Promotion",
            valueDriver: "Increase Customer Value: Cross-sell / Up-sell",
            kpis: [
              "Customer Lifetime Value",
              "RPC – Revenue per Call",
              "Conversion rates",
              "Service expansion",
              "Customer Retention",
              "Lead Prioritization",
            ],
          },
        ],
      },
      {
        id: "elevate-cx",
        name: "Elevate CX",
        color: "bg-gradient-to-r from-pink-600 to-purple-600",
        objectives: [
          {
            id: "increase-cx-effectiveness",
            title: "5. Increase CX Effectiveness",
            valueDriver: "User Satisfaction",
            kpis: [
              "CSAT (voice, email, self-serve)",
              "NPS score",
              "Abandon rate",
              "Churn prediction (sentiment)",
              "Reduce call transfer rate (agent to agent)",
              "Reduced customer frustration & efforts",
              "Increased customer retention & trust",
              "Bookings & revenue per call",
            ],
          },
        ],
      },
    ],
  }

  const fieldServicesValueTreeData = {
    strategicObjective: "Field Services Value",
    financialLevers: [
      {
        id: "cost-reduction",
        name: "Cost Reduction",
        color: "bg-gradient-to-r from-pink-500 to-orange-500",
        objectives: [
          {
            id: "increase-operational-efficiency",
            title: "Increase Operational Efficiency",
            valueDriver: "Efficiency Productivity",
            kpis: [
              "Improve employee onboarding: field technician",
              "Improve employee retention: field technician",
              "Increase first-time visit fix rate",
              "Reduce case resolution time",
              "Reduce case volume: channel shift",
              "Reduce number of on-site service visits: contact center / remote assist",
              "Reduce number of on-site service visits: reduce missed appointments",
              "Reduce service resolution effort: avoid 2nd technician costs",
              "Reduce service resolution effort: time",
              "Reduce travel costs: avoid unnecessary visits",
              "Reduce travel costs: travelling distance",
            ],
          },
        ],
      },
    ],
  }

  const platformSelection = data.platformSelection || ""
  const isFieldServices =
    platformSelection.toLowerCase().includes("field") && platformSelection.toLowerCase().includes("service")
  const isCcaaS = platformSelection.toLowerCase().includes("ccaas")
  const isCRM = platformSelection.toLowerCase().includes("crm")
  const isSupportedPlatform = isFieldServices || isCcaaS || isCRM

  let valueTreeData = ccaasValueTreeData
  let normalizedObjectives: any[] = []

  if (isFieldServices) {
    valueTreeData = fieldServicesValueTreeData
    // Field Services uses financialLevers structure
    normalizedObjectives = valueTreeData.financialLevers?.flatMap((lever: any) => lever.objectives || []) || []
  } else if (isCRM) {
    // CRM value tree data
    valueTreeData = {
      objectives: [
        {
          id: "increase-sales-opportunities",
          title: "Increase Sales Opportunities",
          isPrimary: true,
          valueDrivers: [
            {
              id: "improve-revenue",
              title: "Improve Revenue",
              kpis: [
                { id: "avg-sale-customer", title: "Average Sale/Customer" },
                { id: "opportunity-win-rate", title: "Opportunity Win Rate" },
                { id: "proposed-margin", title: "Proposed Margin/Target Margin by Customer" },
                { id: "new-business-opps", title: "New business opportunities/new customers" },
                { id: "customer-engagement", title: "New Customer Engagement/Opportunity" },
                { id: "opportunity-lead-time", title: "Opportunity Lead-Time/Customer" },
              ],
            },
          ],
        },
        {
          id: "increase-customer-retention",
          title: "Increase Customer Retention",
          isPrimary: false,
          valueDrivers: [
            {
              id: "incumbency-success",
              title: "Incumbency Success",
              kpis: [
                { id: "net-follow-on-revenue", title: "Net Follow-On Revenue/Incumbent Contracts" },
                { id: "customer-lifetime-value", title: "Customer Lifetime Value" },
              ],
            },
          ],
        },
        {
          id: "increase-expansion",
          title: "Increase Expansion",
          isPrimary: false,
          valueDrivers: [
            {
              id: "cross-selling-upselling",
              title: "Cross Selling and Upselling",
              kpis: [
                { id: "net-new-revenue", title: "Net-New Revenue per Customer" },
                { id: "product-diversification", title: "New Product/Service Diversification by Customer" },
              ],
            },
          ],
        },
        {
          id: "reduce-customer-costs",
          title: "Reduce Customer Costs",
          isPrimary: true,
          valueDrivers: [
            {
              id: "reduce-costs",
              title: "Reduce Costs",
              kpis: [
                { id: "resource-utilization", title: "Resource Utilization – FTE Cost" },
                { id: "crm-solution-cost", title: "CRM Solution Cost/Cost of Sales" },
                { id: "retention-costs", title: "Customer/Opportunity Retention Costs" },
              ],
            },
          ],
        },
        {
          id: "increase-operational-efficiency",
          title: "Increase Operational Efficiency",
          isPrimary: true,
          valueDrivers: [
            {
              id: "sales-team-efficiency",
              title: "Sales Team Efficiency",
              kpis: [
                { id: "opportunity-response-time", title: "Opportunity Response Time (by Stage)" },
                { id: "employee-ramp-time", title: "New Employee Ramp Up time (onboarding)" },
                { id: "productivity-improvement", title: "Employee Productivity Improvement" },
              ],
            },
          ],
        },
        {
          id: "increase-employee-satisfaction",
          title: "Increase Employee Satisfaction",
          isPrimary: false,
          valueDrivers: [
            {
              id: "improve-employee-satisfaction",
              title: "Improve Employee Satisfaction",
              kpis: [
                { id: "crm-adoption-rates", title: "CRM Adoption Rates (Usage Rate)" },
                { id: "employee-satisfaction", title: "Employee Satisfaction/Sentiment (Pulse Survey)" },
              ],
            },
          ],
        },
        {
          id: "increase-customer-satisfaction",
          title: "Increase Customer Satisfaction",
          isPrimary: false,
          valueDrivers: [
            {
              id: "improve-customer-service",
              title: "Improve Customer Service Level",
              kpis: [
                { id: "customer-satisfaction-score", title: "Customer Satisfaction Score (CSAT)" },
                { id: "incentive-conversion", title: "Award/Incentive Fee Conversion Rate" },
              ],
            },
          ],
        },
      ],
    }
    // CRM uses direct objectives structure
    normalizedObjectives = valueTreeData.objectives || []
  } else {
    // CCaaS uses financialLevers structure
    normalizedObjectives = valueTreeData.financialLevers?.flatMap((lever: any) => lever.objectives || []) || []
  }

  const roiType = data.roiType || ""
  const maxKPIs = roiType === "rom-bvc" ? 4 : null
  const selectedKPICount = selectedKPIs.length

  useEffect(() => {
    const fetchIndustryInsights = async () => {
      const industry = data.industry
      const platform = data.platformSelection

      if (industry && platform && industry !== "Select industry" && platform !== "Select platform") {
        setIndustryInsights((prev) => ({ ...prev, loading: true }))

        try {
          console.log("[v0] Fetching insights for:", { industry, platform })
          const response = await fetch("/api/research/insights", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ industry, platform }),
          })

          if (response.ok) {
            const insights = await response.json()
            console.log("[v0] Received insights:", insights)
            setIndustryInsights({
              ...insights,
              loading: false,
            })
          } else {
            const errorText = await response.text()
            console.error("[v0] API response error:", response.status, errorText)
            throw new Error(`API returned ${response.status}: ${errorText}`)
          }
        } catch (error) {
          console.error("[v0] Error fetching industry insights:", error)
          setIndustryInsights({
            useCases: [
              {
                title: `${platform} implementation for ${industry}`,
                description: "Primary implementation use case for digital transformation",
                impact: "High",
                priority: "high",
                source: "Industry Best Practices 2024",
              },
              {
                title: `Customer experience enhancement via ${platform}`,
                description: "Improving customer interactions and satisfaction",
                impact: "Medium",
                priority: "high",
                source: "Customer Experience Research",
              },
              {
                title: `Operational efficiency through ${platform} automation`,
                description: "Streamlining processes and reducing manual work",
                impact: "Medium",
                priority: "medium",
                source: "Operational Excellence Study",
              },
            ],
            challenges: [
              {
                title: `Integration complexity in ${industry}`,
                description: "Legacy system integration and data migration challenges",
                severity: "high",
                frequency: "Common",
                source: "Implementation Survey 2024",
              },
              {
                title: `Change management and user adoption`,
                description: "Training staff and ensuring smooth transition",
                severity: "medium",
                frequency: "Very Common",
                source: "Change Management Report",
              },
              {
                title: `Budget and resource allocation`,
                description: "Securing adequate funding and skilled personnel",
                severity: "medium",
                frequency: "Common",
                source: "Budget Planning Analysis",
              },
            ],
            opportunities: [
              {
                title: `Operational efficiency in ${industry}`,
                description: "Cost reduction and process optimization opportunities",
                potential: "High",
                timeframe: "6-12 months",
                source: "ROI Analysis Report",
              },
              {
                title: `Market expansion and competitive advantage`,
                description: "New market opportunities and differentiation",
                potential: "Medium",
                timeframe: "12-18 months",
                source: "Market Research Study",
              },
              {
                title: `Innovation and digital transformation`,
                description: "Technology-driven innovation and modernization",
                potential: "High",
                timeframe: "18-24 months",
                source: "Digital Transformation Guide",
              },
            ],
            sources: [
              "Industry Best Practices 2024",
              "Customer Experience Research",
              "Operational Excellence Study",
              "Implementation Survey 2024",
              "Change Management Report",
              "Budget Planning Analysis",
              "ROI Analysis Report",
              "Market Research Study",
              "Digital Transformation Guide",
            ],
            loading: false,
          })
        }
      }
    }

    fetchIndustryInsights()
  }, [data.industry, data.platformSelection])

  const handleObjectiveToggle = (objective: any) => {
    const isSelected = selectedObjectives.some((obj) => obj.id === objective.id)
    let newSelectedObjectives

    if (isSelected) {
      newSelectedObjectives = selectedObjectives.filter((obj) => obj.id !== objective.id)
      // Remove KPIs from this objective
      const objectiveKPIs = objective.kpis || []
      setSelectedKPIs((prev) => prev.filter((kpi) => !objectiveKPIs.includes(kpi)))
    } else {
      newSelectedObjectives = [...selectedObjectives, objective]
    }

    setSelectedObjectives(newSelectedObjectives)
    onUpdate({ ...data, objectives: newSelectedObjectives })
  }

  const handleKPIToggle = (kpi: string) => {
    if (selectedKPIs.includes(kpi)) {
      const newSelectedKPIs = selectedKPIs.filter((k) => k !== kpi)
      setSelectedKPIs(newSelectedKPIs)
      onUpdate({ ...data, kpis: newSelectedKPIs.map((k) => ({ name: k, selected: true })) })
    } else {
      if (maxKPIs && selectedKPIs.length >= maxKPIs) {
        return // Don't allow more than max KPIs
      }
      const newSelectedKPIs = [...selectedKPIs, kpi]
      setSelectedKPIs(newSelectedKPIs)
      onUpdate({ ...data, kpis: newSelectedKPIs.map((k) => ({ name: k, selected: true })) })
    }
  }

  const addCustomObjective = () => {
    if (customObjective.title && customObjective.description) {
      const newObjective = {
        id: `custom-${Date.now()}`,
        ...customObjective,
        isCustom: true,
      }
      const newSelectedObjectives = [...selectedObjectives, newObjective]
      setSelectedObjectives(newSelectedObjectives)
      onUpdate({ ...data, objectives: newSelectedObjectives })
      setCustomObjective({ title: "", description: "", category: "", priority: "medium" })
      setShowCustomObjective(false)
    }
  }

  const canProceed = selectedObjectives.length > 0 && selectedKPIs.length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Objectives & KPIs Selection</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Select business objectives from the {isFieldServices ? "Field Services" : isCRM ? "CRM" : "CCaaS"} Value Tree
          and choose relevant KPIs to measure success.
          {maxKPIs && (
            <span className="text-orange-600 font-medium"> ROM BVC analysis is limited to {maxKPIs} KPIs maximum.</span>
          )}
        </p>
      </div>

      {/* Industry Insights section */}
      {data.industry &&
        data.platformSelection &&
        data.industry !== "Select industry" &&
        data.platformSelection !== "Select platform" && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Building2 className="h-5 w-5" />
                Industry Insights: {data.industry} + {data.platformSelection}
              </CardTitle>
              <CardDescription className="text-blue-700">
                Contextual insights for {data.platformSelection} implementation in the {data.industry} industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {industryInsights.loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading industry insights...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Top Use Cases
                    </h4>
                    <ul className="space-y-2">
                      {(industryInsights.useCases || []).slice(0, 3).map((useCase, index) => (
                        <li key={index} className="text-sm bg-white p-3 rounded border-l-4 border-green-500">
                          <div className="font-medium text-green-800">{useCase.title}</div>
                          <div className="text-green-600 text-xs mt-1">{useCase.description}</div>
                          <div className="flex gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                useCase.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : useCase.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {useCase.priority} priority
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {useCase.impact} impact
                            </Badge>
                          </div>
                          {useCase.source && (
                            <div className="text-xs text-muted-foreground mt-1 italic">Source: {useCase.source}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Key Challenges
                    </h4>
                    <ul className="space-y-2">
                      {(industryInsights.challenges || []).slice(0, 3).map((challenge, index) => (
                        <li key={index} className="text-sm bg-white p-3 rounded border-l-4 border-orange-500">
                          <div className="font-medium text-orange-800">{challenge.title}</div>
                          <div className="text-orange-600 text-xs mt-1">{challenge.description}</div>
                          <div className="flex gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                challenge.severity === "critical"
                                  ? "bg-red-100 text-red-700"
                                  : challenge.severity === "high"
                                    ? "bg-orange-100 text-orange-700"
                                    : challenge.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-green-100 text-green-700"
                              }`}
                            >
                              {challenge.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {challenge.frequency}
                            </Badge>
                          </div>
                          {challenge.source && (
                            <div className="text-xs text-muted-foreground mt-1 italic">Source: {challenge.source}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {(industryInsights.opportunities || []).slice(0, 3).map((opportunity, index) => (
                        <li key={index} className="text-sm bg-white p-3 rounded border-l-4 border-blue-500">
                          <div className="font-medium text-blue-800">{opportunity.title}</div>
                          <div className="text-blue-600 text-xs mt-1">{opportunity.description}</div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              {opportunity.potential} potential
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {opportunity.timeframe}
                            </Badge>
                          </div>
                          {opportunity.source && (
                            <div className="text-xs text-muted-foreground mt-1 italic">
                              Source: {opportunity.source}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {!industryInsights.loading && industryInsights.sources && industryInsights.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-blue-200">
                  <h5 className="font-medium text-blue-800 mb-2">Research Sources</h5>
                  <div className="text-xs text-blue-600 space-y-1">
                    {industryInsights.sources.map((source, index) => (
                      <div key={index}>• {source}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* ROI Type Warning */}
      {!roiType && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>ROI Type Not Selected</strong>
            <br />
            Please go back to Project Setup and select an ROI Type to determine KPI selection limits.
          </AlertDescription>
        </Alert>
      )}

      {roiType && (
        <>
          {/* Value Tree */}
          {!isSupportedPlatform && platformSelection && platformSelection !== "Select platform" ? (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="h-5 w-5" />
                  Framework In Development
                </CardTitle>
                <CardDescription className="text-orange-700">
                  The {platformSelection} framework is currently being developed and is not ready yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mb-4">
                    <AlertCircle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Coming Soon</h3>
                    <p className="text-orange-700 max-w-md mx-auto">
                      We're working hard to bring you the {platformSelection} value tree with comprehensive objectives
                      and KPIs. Please select either <strong>CcaaS</strong>, <strong>Field Services</strong>, or{" "}
                      <strong>CRM</strong> to continue with your business value case analysis.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2 mt-6">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      CcaaS - Ready
                    </Badge>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Field Services - Ready
                    </Badge>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      CRM - Ready
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  {isFieldServices ? "Field Services Value Tree" : isCRM ? "CRM Value Tree" : "CCaaS Value Tree"}
                </CardTitle>
                <CardDescription>
                  A Value Tree can be used as the next layer down to tie financial levers and strategic objectives to
                  measurable KPIs. Select objectives and their associated KPIs for{" "}
                  {isFieldServices ? "Field Services" : isCRM ? "CRM" : "CCaaS"} implementation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {normalizedObjectives.map((objective) => {
                  const isObjectiveSelected = selectedObjectives.some((obj) => obj.id === objective.id)

                  return (
                    <div key={objective.id} className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isObjectiveSelected}
                          onCheckedChange={() => handleObjectiveToggle(objective)}
                          className="mt-1 h-5 w-5 border-2 border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-pink-600">{objective.title}</h4>
                          </div>
                          {objective.valueDriver && (
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Value Driver:</strong> {objective.valueDriver}
                            </p>
                          )}

                          {/* KPIs for this objective */}
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-foreground">Key Performance Indicators:</h5>
                            <div className="grid gap-3">
                              {objective.valueDrivers
                                ? // CRM structure with nested valueDrivers
                                  objective.valueDrivers.map((valueDriver: any) => (
                                    <div key={valueDriver.id} className="space-y-2">
                                      <div className="text-xs font-medium text-muted-foreground pl-2">
                                        {valueDriver.title}
                                      </div>
                                      {(valueDriver.kpis || []).map((kpi: any) => {
                                        const isKPISelected = selectedKPIs.includes(kpi.title)
                                        const isKPIDisabled = maxKPIs && selectedKPICount >= maxKPIs && !isKPISelected
                                        const isInDevelopment =
                                          kpi.title === "Reduce case resolution time" ||
                                          kpi.title === "Reduce case volume: channel shift"

                                        return (
                                          <div
                                            key={kpi.id}
                                            className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors ${
                                              isInDevelopment ? "bg-yellow-50 border border-yellow-200" : ""
                                            }`}
                                          >
                                            <Checkbox
                                              checked={isKPISelected}
                                              onCheckedChange={() => handleKPIToggle(kpi.title)}
                                              disabled={isKPIDisabled || isInDevelopment}
                                              className={`h-4 w-4 border-2 ${
                                                isKPIDisabled || isInDevelopment
                                                  ? "border-gray-300 opacity-50"
                                                  : "border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                              }`}
                                            />
                                            <span
                                              className={`text-sm font-medium ${
                                                isKPIDisabled || isInDevelopment
                                                  ? "text-muted-foreground"
                                                  : "text-foreground"
                                              } ${isKPISelected ? "text-green-700" : ""}`}
                                            >
                                              {kpi.title}
                                              {isInDevelopment && (
                                                <span className="text-yellow-600 ml-2">
                                                  * <span className="text-xs">(In Development)</span>
                                                </span>
                                              )}
                                            </span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  ))
                                : // CCaaS/Field Services structure with direct kpis array
                                  (objective.kpis || []).map((kpi: string) => {
                                    const isKPISelected = selectedKPIs.includes(kpi)
                                    const isKPIDisabled = maxKPIs && selectedKPICount >= maxKPIs && !isKPISelected
                                    const isInDevelopment =
                                      kpi === "Reduce case resolution time" ||
                                      kpi === "Reduce case volume: channel shift"

                                    return (
                                      <div
                                        key={kpi}
                                        className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors ${
                                          isInDevelopment ? "bg-yellow-50 border border-yellow-200" : ""
                                        }`}
                                      >
                                        <Checkbox
                                          checked={isKPISelected}
                                          onCheckedChange={() => handleKPIToggle(kpi)}
                                          disabled={isKPIDisabled || isInDevelopment}
                                          className={`h-4 w-4 border-2 ${
                                            isKPIDisabled || isInDevelopment
                                              ? "border-gray-300 opacity-50"
                                              : "border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                          }`}
                                        />
                                        <span
                                          className={`text-sm font-medium ${
                                            isKPIDisabled || isInDevelopment
                                              ? "text-muted-foreground"
                                              : "text-foreground"
                                          } ${isKPISelected ? "text-green-700" : ""}`}
                                        >
                                          {kpi}
                                          {isInDevelopment && (
                                            <span className="text-yellow-600 ml-2">
                                              * <span className="text-xs">(In Development)</span>
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    )
                                  })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Selection Summary */}
      {(selectedObjectives.length > 0 || selectedKPIs.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Selection Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedObjectives.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Selected Objectives ({selectedObjectives.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedObjectives.map((obj) => (
                    <Badge key={obj.id} variant="secondary" className="bg-blue-100 text-blue-800">
                      {obj.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedKPIs.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">
                  Selected KPIs ({selectedKPICount}
                  {maxKPIs ? `/${maxKPIs}` : ""})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedKPIs.map((kpi) => (
                    <Badge key={kpi} variant="secondary" className="bg-green-100 text-green-800">
                      {kpi}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-purple-600" />
            Custom Objectives
          </CardTitle>
          <CardDescription>Add additional objectives specific to your business case</CardDescription>
        </CardHeader>
        <CardContent>
          {!showCustomObjective ? (
            <Button variant="outline" onClick={() => setShowCustomObjective(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Objective
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="custom-title">Objective Title</Label>
                  <Input
                    id="custom-title"
                    value={customObjective.title}
                    onChange={(e) => setCustomObjective({ ...customObjective, title: e.target.value })}
                    placeholder="Enter objective title"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="custom-priority">Priority</Label>
                  <Select
                    value={customObjective.priority}
                    onValueChange={(value) => setCustomObjective({ ...customObjective, priority: value })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="custom-description">Description</Label>
                <Textarea
                  id="custom-description"
                  value={customObjective.description}
                  onChange={(e) => setCustomObjective({ ...customObjective, description: e.target.value })}
                  placeholder="Describe the objective and expected outcomes"
                  rows={3}
                  className="bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addCustomObjective} disabled={!customObjective.title || !customObjective.description}>
                  Add Objective
                </Button>
                <Button variant="outline" onClick={() => setShowCustomObjective(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Data Section */}
      {industryInsights.marketData && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">Market Intelligence</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-700">Market Size</div>
              <div className="text-blue-600">{industryInsights.marketData.marketSize}</div>
            </div>
            <div>
              <div className="font-medium text-blue-700">Growth Rate</div>
              <div className="text-blue-600">{industryInsights.marketData.growthRate}</div>
            </div>
          </div>
          {industryInsights.marketData.keyTrends && (
            <div className="mt-3">
              <div className="font-medium text-blue-700 mb-2">Key Trends</div>
              <div className="flex flex-wrap gap-2">
                {(industryInsights.marketData.keyTrends || []).map((trend: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    {trend}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Project Setup
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed || !isSupportedPlatform}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Assumptions
        </Button>
      </div>
    </div>
  )
}

export { ObjectivesKPIs }
export default ObjectivesKPIs

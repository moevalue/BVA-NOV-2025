"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, CheckCircle2 } from "lucide-react"

interface Objective {
  id: string
  title: string
  description: string
  category: string
  priority: string
  successCriteria: string
}

interface ObjectivesProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

const crmValueTreeData = {
  strategicObjective: "CRM Value",
  financialLevers: [
    {
      id: "sales-opportunities",
      name: "Increase Sales Opportunities",
      color: "bg-gradient-to-r from-pink-500 to-orange-500",
      objectives: [
        {
          id: "improve-revenue",
          number: "1",
          title: "Increase Sales Opportunities",
          valueDriver: "Improve Revenue",
          kpis: [
            "Average Sale/Customer",
            "Opportunity Win Rate",
            "Proposed Margin/Target Margin by Customer",
            "New business opportunities/new customers",
            "New Customer Engagement/Opportunity",
            "Opportunity Lead-Time/Customer",
          ],
        },
      ],
    },
    {
      id: "customer-retention",
      name: "Increase Customer Retention",
      color: "bg-gradient-to-r from-gray-600 to-gray-700",
      objectives: [
        {
          id: "incumbency-success",
          number: "2",
          title: "Increase Customer Retention",
          valueDriver: "Incumbency Success",
          kpis: ["Net Follow-On Revenue/Incumbent Contracts", "Customer Lifetime Value"],
        },
      ],
    },
    {
      id: "expansion",
      name: "Increase Expansion",
      color: "bg-gradient-to-r from-gray-600 to-gray-700",
      objectives: [
        {
          id: "cross-selling-upselling",
          number: "3",
          title: "Increase Expansion",
          valueDriver: "Cross Selling and Upselling",
          kpis: ["Net-New Revenue per Customer", "New Product/Service Diversification by Customer"],
        },
      ],
    },
    {
      id: "reduce-costs",
      name: "Reduce Customer Costs",
      color: "bg-gradient-to-r from-pink-500 to-orange-500",
      objectives: [
        {
          id: "reduce-costs-driver",
          number: "4",
          title: "Reduce Customer Costs",
          valueDriver: "Reduce Costs",
          kpis: [
            "Resource Utilization – FTE Cost",
            "CRM Solution Cost/ Cost of Sales",
            "Customer/Opportunity Retention Costs",
          ],
        },
      ],
    },
    {
      id: "operational-efficiency",
      name: "Increase Operational Efficiency",
      color: "bg-gradient-to-r from-pink-500 to-orange-500",
      objectives: [
        {
          id: "sales-team-efficiency",
          number: "5",
          title: "Increase Operational Efficiency",
          valueDriver: "Sales Team Efficiency",
          kpis: [
            "Opportunity Response Time (by Stage)",
            "New Employee Ramp Up time (onboarding)",
            "Employee Productivity Improvement",
          ],
        },
      ],
    },
    {
      id: "employee-satisfaction",
      name: "Increase Employee Satisfaction",
      color: "bg-gradient-to-r from-gray-600 to-gray-700",
      objectives: [
        {
          id: "improve-employee-satisfaction",
          number: "6",
          title: "Increase Employee Satisfaction",
          valueDriver: "Improve Employee Satisfaction",
          kpis: ["CRM Adoption Rates (Usage Rate)", "Employee Satisfaction/Sentiment (Pulse Survey)"],
        },
      ],
    },
    {
      id: "customer-satisfaction",
      name: "Increase Customer Satisfaction",
      color: "bg-gradient-to-r from-gray-600 to-gray-700",
      objectives: [
        {
          id: "improve-customer-service",
          number: "7",
          title: "Increase Customer Satisfaction",
          valueDriver: "Improve Customer Service Level",
          kpis: ["Customer Satisfaction Score (CSAT)", "Award/Incentive Fee Conversion Rate"],
        },
      ],
    },
  ],
}

const valueTreeData = {
  strategicObjective: "CCaaS Value",
  financialLevers: [
    {
      id: "cost-optimization",
      name: "Cost Optimization",
      color: "bg-gradient-to-r from-pink-500 to-orange-500",
      objectives: [
        {
          id: "reduce-labor-cost",
          number: "1",
          title: "Reduce Labor Cost",
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
          number: "2",
          title: "Increase Operational Efficiency",
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
          number: "3",
          title: "Reduce Fixed Costs",
          valueDriver: "Overhead / Technology Spend",
          kpis: ["Overhead cost", "Reduced technology/software spend"],
        },
      ],
    },
    {
      id: "revenue-uplift",
      name: "Revenue Uplift",
      color: "bg-gradient-to-r from-pink-600 to-red-600",
      objectives: [
        {
          id: "increase-revenue",
          number: "4",
          title: "Increase Revenue – Customer Brand Promotion",
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
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
      objectives: [
        {
          id: "increase-cx-effectiveness",
          number: "5",
          title: "Increase CX Effectiveness",
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

export function Objectives({ data, onUpdate, onNext, onPrevious }: ObjectivesProps) {
  const [selectedObjectives, setSelectedObjectives] = useState<any[]>(data.selectedObjectives || [])
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(data.selectedKPIs || [])
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [newObjective, setNewObjective] = useState<Partial<Objective>>({
    title: "",
    description: "",
    category: "",
    priority: "",
    successCriteria: "",
  })

  const objectives = data.objectives || []

  const categories = [
    { value: "cost-reduction", label: "Cost Reduction" },
    { value: "revenue-increase", label: "Revenue Increase" },
    { value: "efficiency", label: "Operational Efficiency" },
    { value: "quality", label: "Quality Improvement" },
    { value: "compliance", label: "Compliance & Risk" },
    { value: "customer", label: "Customer Experience" },
    { value: "innovation", label: "Innovation & Growth" },
  ]

  const priorities = [
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  ]

  const toggleObjectiveSelection = (objectiveId: string) => {
    const objectiveData = valueTreeData.financialLevers
      .flatMap((lever) => lever.objectives)
      .find((obj) => obj.id === objectiveId)

    if (!objectiveData) return

    const isSelected = selectedObjectives.some((obj) => obj.id === objectiveId)
    const updated = isSelected
      ? selectedObjectives.filter((obj) => obj.id !== objectiveId)
      : [...selectedObjectives, objectiveData]

    setSelectedObjectives(updated)
    onUpdate({ ...data, selectedObjectives: updated })
  }

  const toggleKPISelection = (kpi: string) => {
    const updated = selectedKPIs.includes(kpi) ? selectedKPIs.filter((k) => k !== kpi) : [...selectedKPIs, kpi]

    setSelectedKPIs(updated)
    onUpdate({ ...data, selectedKPIs: updated })
  }

  const addObjective = () => {
    if (newObjective.title && newObjective.category && newObjective.priority) {
      const objective: Objective = {
        id: Date.now().toString(),
        title: newObjective.title || "",
        description: newObjective.description || "",
        category: newObjective.category || "",
        priority: newObjective.priority || "",
        successCriteria: newObjective.successCriteria || "",
      }

      const updatedObjectives = [...objectives, objective]
      onUpdate({ ...data, objectives: updatedObjectives })

      setNewObjective({
        title: "",
        description: "",
        category: "",
        priority: "",
        successCriteria: "",
      })
      setShowCustomForm(false)
    }
  }

  const removeObjective = (id: string) => {
    const updatedObjectives = objectives.filter((obj: Objective) => obj.id !== id)
    onUpdate({ ...data, objectives: updatedObjectives })
  }

  const getCategoryLabel = (value: string) => {
    return categories.find((cat) => cat.value === value)?.label || value
  }

  const getPriorityStyle = (value: string) => {
    return priorities.find((pri) => pri.value === value)?.color || "bg-gray-100 text-gray-800"
  }

  const platformSelection = data.platformSelection || "ccaas"
  const currentValueTree = platformSelection === "crm" ? crmValueTreeData : valueTreeData

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Business Objectives</h2>
        <p className="text-muted-foreground">
          Select objectives from the {platformSelection === "crm" ? "CRM" : "CCaaS"} Value Tree or define custom
          objectives
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-orange-600">
            {platformSelection === "crm" ? "CRM Value Tree" : "CCaaS Value Tree"}
          </CardTitle>
          <CardDescription>
            A Value Tree can be used as the next layer down to tie financial levers and strategic objectives to
            measurable KPIs. Below is an illustrative view for the {platformSelection === "crm" ? "CRM" : "CCaaS"} value
            tree.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Strategic Objective */}
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-pink-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                {currentValueTree.strategicObjective}
              </div>
            </div>

            {/* Financial Levers and Objectives */}
            <div className="grid gap-6 lg:grid-cols-3">
              {currentValueTree.financialLevers.map((lever) => (
                <div key={lever.id} className="space-y-4">
                  {/* Financial Lever */}
                  <div className="text-center">
                    <div className={`inline-block ${lever.color} text-white px-4 py-2 rounded-lg font-semibold`}>
                      {lever.name}
                    </div>
                  </div>

                  {/* Business Objectives */}
                  <div className="space-y-3">
                    {lever.objectives.map((objective) => (
                      <div key={objective.id} className="border rounded-lg overflow-hidden">
                        {/* Objective Header */}
                        <div
                          className={`p-3 cursor-pointer transition-all ${
                            selectedObjectives.some((obj) => obj.id === objective.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-pink-600 text-white hover:bg-pink-700"
                          }`}
                          onClick={() => toggleObjectiveSelection(objective.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{objective.number}.</span>
                              <span className="font-medium text-sm">{objective.title}</span>
                            </div>
                            {selectedObjectives.some((obj) => obj.id === objective.id) && (
                              <CheckCircle2 className="h-5 w-5" />
                            )}
                          </div>
                        </div>

                        {/* Value Driver and KPIs */}
                        <div className="p-3 bg-gray-50 space-y-2">
                          <div className="font-medium text-sm text-gray-700">Value Driver: {objective.valueDriver}</div>
                          <div className="text-xs text-gray-600">
                            <div className="font-medium mb-2">Key Performance Indicators:</div>
                            <div className="space-y-2">
                              {objective.kpis.map((kpi, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <Checkbox
                                    id={`${objective.id}-kpi-${index}`}
                                    checked={selectedKPIs.includes(kpi)}
                                    onCheckedChange={() => toggleKPISelection(kpi)}
                                    className="mt-0.5"
                                  />
                                  <label
                                    htmlFor={`${objective.id}-kpi-${index}`}
                                    className="text-xs cursor-pointer leading-relaxed"
                                  >
                                    {kpi}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Summary */}
            {(selectedObjectives.length > 0 || selectedKPIs.length > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                {selectedObjectives.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Selected Objectives ({selectedObjectives.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedObjectives.map((objective) => (
                        <Badge key={objective.id} className="bg-blue-100 text-blue-800">
                          {objective.number}. {objective.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedKPIs.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Selected KPIs ({selectedKPIs.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedKPIs.map((kpi, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                          {kpi}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Custom Objectives
            <Button variant="outline" size="sm" onClick={() => setShowCustomForm(!showCustomForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom
            </Button>
          </CardTitle>
          <CardDescription>
            Add additional objectives not covered in the {platformSelection === "crm" ? "CRM" : "CCaaS"} value tree
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showCustomForm && (
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="objectiveTitle">Objective Title *</Label>
                  <Input
                    id="objectiveTitle"
                    placeholder="e.g., Reduce customer service response time"
                    value={newObjective.title || ""}
                    onChange={(e) => setNewObjective({ ...newObjective, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setNewObjective({ ...newObjective, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the objective and its expected impact..."
                  value={newObjective.description || ""}
                  onChange={(e) => setNewObjective({ ...newObjective, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select onValueChange={(value) => setNewObjective({ ...newObjective, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successCriteria">Success Criteria</Label>
                  <Input
                    id="successCriteria"
                    placeholder="e.g., Response time < 2 hours"
                    value={newObjective.successCriteria || ""}
                    onChange={(e) => setNewObjective({ ...newObjective, successCriteria: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addObjective}>Add Objective</Button>
                <Button variant="outline" onClick={() => setShowCustomForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {objectives.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Custom Objectives ({objectives.length})</h4>
              {objectives.map((objective: Objective) => (
                <div key={objective.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{objective.title}</h4>
                      {objective.description && (
                        <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeObjective(objective.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{getCategoryLabel(objective.category)}</Badge>
                    <Badge className={getPriorityStyle(objective.priority)}>{objective.priority.toUpperCase()}</Badge>
                    {objective.successCriteria && (
                      <Badge variant="secondary">Success: {objective.successCriteria}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Project Setup
        </Button>
        <Button onClick={onNext} disabled={selectedObjectives.length === 0 && objectives.length === 0}>
          Next: Define KPIs
        </Button>
      </div>
    </div>
  )
}

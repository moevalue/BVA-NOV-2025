"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, TrendingUp, Target, CheckCircle2 } from "lucide-react"

interface KPI {
  id: string
  name: string
  description: string
  category: string
  unit: string
  baseline: number
  target: number
  current: number
  frequency: string
  linkedObjective: string
}

interface KPIsProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function KPIs({ data, onUpdate, onNext, onPrevious }: KPIsProps) {
  const [newKPI, setNewKPI] = useState<Partial<KPI>>({
    name: "",
    description: "",
    category: "",
    unit: "",
    baseline: 0,
    target: 0,
    current: 0,
    frequency: "",
    linkedObjective: "",
  })

  const kpis = data.kpis || []
  const objectives = data.objectives || []

  const categories = [
    { value: "financial", label: "Financial" },
    { value: "operational", label: "Operational" },
    { value: "customer", label: "Customer" },
    { value: "quality", label: "Quality" },
    { value: "productivity", label: "Productivity" },
    { value: "compliance", label: "Compliance" },
  ]

  const units = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "currency", label: "Currency ($)" },
    { value: "count", label: "Count (#)" },
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "ratio", label: "Ratio" },
  ]

  const frequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annually", label: "Annually" },
  ]

  const addKPI = () => {
    if (newKPI.name && newKPI.category && newKPI.unit && newKPI.frequency) {
      const kpi: KPI = {
        id: Date.now().toString(),
        name: newKPI.name || "",
        description: newKPI.description || "",
        category: newKPI.category || "",
        unit: newKPI.unit || "",
        baseline: newKPI.baseline || 0,
        target: newKPI.target || 0,
        current: newKPI.current || newKPI.baseline || 0,
        frequency: newKPI.frequency || "",
        linkedObjective: newKPI.linkedObjective || "",
      }

      const updatedKPIs = [...kpis, kpi]
      onUpdate({ ...data, kpis: updatedKPIs })

      setNewKPI({
        name: "",
        description: "",
        category: "",
        unit: "",
        baseline: 0,
        target: 0,
        current: 0,
        frequency: "",
        linkedObjective: "",
      })
    }
  }

  const removeKPI = (id: string) => {
    const updatedKPIs = kpis.filter((kpi: KPI) => kpi.id !== id)
    onUpdate({ ...data, kpis: updatedKPIs })
  }

  const updateKPICurrent = (id: string, value: number) => {
    const updatedKPIs = kpis.map((kpi: KPI) => (kpi.id === id ? { ...kpi, current: value } : kpi))
    onUpdate({ ...data, kpis: updatedKPIs })
  }

  const calculateProgress = (kpi: KPI) => {
    if (kpi.target === kpi.baseline) return 0
    const progress = ((kpi.current - kpi.baseline) / (kpi.target - kpi.baseline)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case "percentage":
        return `${value}%`
      case "currency":
        return `$${value.toLocaleString()}`
      case "hours":
        return `${value}h`
      case "days":
        return `${value}d`
      default:
        return value.toString()
    }
  }

  const getCategoryLabel = (value: string) => {
    return categories.find((cat) => cat.value === value)?.label || value
  }

  const getObjectiveTitle = (id: string) => {
    const objective = objectives.find((obj: any) => obj.id === id)
    return objective ? objective.title : "No objective linked"
  }

  const selectedObjectives = data.selectedObjectives || []
  const availableKPIs = selectedObjectives.flatMap(
    (obj: any) =>
      obj.kpis?.map((kpi: string) => ({
        id: `${obj.id}-${kpi}`,
        name: kpi,
        category: obj.category || "operational",
        objective: obj.title,
        objectiveId: obj.id,
      })) || [],
  )

  const [selectedKPIIds, setSelectedKPIIds] = useState<string[]>(data.selectedKPIIds || [])

  const roiType = data.roiType || ""
  const maxKPIs = roiType === "rom-bvc" ? 4 : null

  const toggleKPISelection = (kpiId: string) => {
    const newSelection = selectedKPIIds.includes(kpiId)
      ? selectedKPIIds.filter((id) => id !== kpiId)
      : [...selectedKPIIds, kpiId]

    if (!selectedKPIIds.includes(kpiId) && maxKPIs && selectedKPIIds.length >= maxKPIs) {
      return
    }

    setSelectedKPIIds(newSelection)
    onUpdate({ ...data, selectedKPIIds: newSelection })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Key Performance Indicators</h2>
        <p className="text-muted-foreground">Select KPIs from your chosen objectives or define custom ones</p>
        {maxKPIs && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ROM BVC Analysis:</strong> You can select up to {maxKPIs} KPIs ({selectedKPIIds.length}/{maxKPIs}{" "}
              selected)
            </p>
          </div>
        )}
      </div>

      {availableKPIs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              KPIs from Selected Objectives
            </CardTitle>
            <CardDescription>Select the KPIs you want to track from your chosen business objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedObjectives.map((objective: any) => (
                <div key={objective.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {objective.title}
                  </h4>
                  <div className="space-y-3">
                    {objective.kpis?.map((kpi: string) => {
                      const kpiId = `${objective.id}-${kpi}`
                      const isSelected = selectedKPIIds.includes(kpiId)
                      const isDisabled = maxKPIs && !isSelected && selectedKPIIds.length >= maxKPIs

                      return (
                        <div key={kpiId} className="flex items-start space-x-3">
                          <Checkbox
                            id={kpiId}
                            checked={isSelected}
                            onCheckedChange={() => toggleKPISelection(kpiId)}
                            disabled={isDisabled}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={kpiId}
                              className={`text-sm cursor-pointer ${isSelected ? "font-medium" : ""} ${isDisabled ? "text-muted-foreground" : ""}`}
                            >
                              {kpi}
                            </Label>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {objective.valueDriver}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {objective.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {selectedKPIIds.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground">
                  Selected KPIs: {selectedKPIIds.length}
                  {maxKPIs && ` / ${maxKPIs}`}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedKPIIds.map((kpiId) => {
                    const kpi = availableKPIs.find((k) => k.id === kpiId)
                    return kpi ? (
                      <Badge key={kpiId} variant="default" className="text-xs">
                        {kpi.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!roiType && (
        <Card className="border-dashed border-yellow-200 bg-yellow-50">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Target className="h-12 w-12 text-yellow-600 mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">ROI Type Not Selected</h3>
            <p className="text-yellow-700 text-center mb-4">
              Please go back to Project Setup and select an ROI Type to determine KPI selection limits.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Custom KPI
          </CardTitle>
          <CardDescription>Define additional measurable indicators beyond the standard ones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kpiName">KPI Name *</Label>
              <Input
                id="kpiName"
                placeholder="e.g., Customer Response Time"
                value={newKPI.name || ""}
                onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kpiCategory">Category *</Label>
              <Select onValueChange={(value) => setNewKPI({ ...newKPI, category: value })}>
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
            <Label htmlFor="kpiDescription">Description</Label>
            <Textarea
              id="kpiDescription"
              placeholder="Describe what this KPI measures and why it's important..."
              value={newKPI.description || ""}
              onChange={(e) => setNewKPI({ ...newKPI, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select onValueChange={(value) => setNewKPI({ ...newKPI, unit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Measurement Frequency *</Label>
              <Select onValueChange={(value) => setNewKPI({ ...newKPI, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedObjective">Linked Objective</Label>
              <Select onValueChange={(value) => setNewKPI({ ...newKPI, linkedObjective: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No objective</SelectItem>
                  {objectives.map((objective: any) => (
                    <SelectItem key={objective.id} value={objective.id}>
                      {objective.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="baseline">Baseline Value</Label>
              <Input
                id="baseline"
                type="number"
                placeholder="Current value"
                value={newKPI.baseline || ""}
                onChange={(e) => setNewKPI({ ...newKPI, baseline: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                placeholder="Goal value"
                value={newKPI.target || ""}
                onChange={(e) => setNewKPI({ ...newKPI, target: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">Current Value</Label>
              <Input
                id="current"
                type="number"
                placeholder="Current value"
                value={newKPI.current || ""}
                onChange={(e) => setNewKPI({ ...newKPI, current: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <Button onClick={addKPI} className="w-full">
            Add KPI
          </Button>
        </CardContent>
      </Card>

      {kpis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Defined KPIs ({kpis.length})</CardTitle>
            <CardDescription>Track and manage your key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {kpis.map((kpi: KPI) => {
                const progress = calculateProgress(kpi)
                return (
                  <div key={kpi.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          {kpi.name}
                        </h4>
                        {kpi.description && <p className="text-sm text-muted-foreground mt-1">{kpi.description}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKPI(kpi.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{getCategoryLabel(kpi.category)}</Badge>
                      <Badge variant="secondary">{kpi.frequency}</Badge>
                      {kpi.linkedObjective && (
                        <Badge variant="outline" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {getObjectiveTitle(kpi.linkedObjective)}
                        </Badge>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Baseline</p>
                        <p className="font-semibold">{formatValue(kpi.baseline, kpi.unit)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Current</p>
                        <div className="space-y-1">
                          <p className="font-semibold">{formatValue(kpi.current, kpi.unit)}</p>
                          <Input
                            type="number"
                            value={kpi.current}
                            onChange={(e) => updateKPICurrent(kpi.id, Number.parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="font-semibold">{formatValue(kpi.target, kpi.unit)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="font-semibold">{progress.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Target</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Objectives
        </Button>
        <Button onClick={onNext} disabled={selectedKPIIds.length === 0 && kpis.length === 0}>
          Next: Financial Analysis
        </Button>
      </div>
    </div>
  )
}

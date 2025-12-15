"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, FileText } from "lucide-react"

interface ProjectSetupProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function ProjectSetup({ data, onUpdate, onNext }: ProjectSetupProps) {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ ...data, [field]: value })
  }

  const isFormValid = data.clientName && data.projectName && data.industry && data.companySize

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Project Setup</h2>
        <p className="text-muted-foreground">Define the basic parameters of your business value case </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-700">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Client Information</CardTitle>
                <CardDescription>{""}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Point of Contact </Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={data.clientName || ""}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountId">
                Account ID <span className="text-orange-500 italic">(Optional - future connection to C365)</span>{" "}
              </Label>
              <Input
                id="accountId"
                placeholder="Enter account ID"
                value={data.accountId || ""}
                onChange={(e) => handleInputChange("accountId", e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">
                  Company Size <span className="text-orange-500 italic">(Optional)</span>{" "}
                </Label>
                <Select onValueChange={(value) => handleInputChange("companySize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10)</SelectItem>
                    <SelectItem value="small">Small (11-50)</SelectItem>
                    <SelectItem value="medium">Medium (51-200)</SelectItem>
                    <SelectItem value="large">Large (201-1000)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brazil">Brazil</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="uk">UK</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualRevenue">
                Annual Revenue <span className="text-orange-500 italic">(Optional)</span>{" "}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="annualRevenue"
                  type="number"
                  placeholder="0"
                  className="pl-8"
                  value={data.annualRevenue || ""}
                  onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="relationshipOwner">
                  Relationship Owner <span className="text-orange-500 italic">(Optional)</span>{" "}
                </Label>
                <Input
                  id="relationshipOwner"
                  placeholder="John Smith"
                  value={data.relationshipOwner || ""}
                  onChange={(e) => handleInputChange("relationshipOwner", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Primary contact for this engagement</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesStage">
                  Sales Stage <span className="text-orange-500 italic">(Optional)</span>{" "}
                </Label>
                <Select onValueChange={(value) => handleInputChange("salesStage", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Current stage of the sales process</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherNotes">Other Notes</Label>
              <Textarea
                id="otherNotes"
                placeholder="Additional context, requirements, or considerations for this ROI analysis..."
                value={data.otherNotes || ""}
                onChange={(e) => handleInputChange("otherNotes", e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Any additional information relevant to this analysis</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-700">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Project Details</CardTitle>
                <CardDescription>Information about this ROI analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Avanade Implementation Q1 2024"
                value={data.projectName || ""}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">
                Project Description <span className="text-orange-500 italic">(Optional)</span>{" "}
              </Label>
              <Textarea
                id="projectDescription"
                placeholder="Brief description of the project scope and goals"
                value={data.projectDescription || ""}
                onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platformSelection">Platform Selection</Label>
                <Select onValueChange={(value) => handleInputChange("platformSelection", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ccaas" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-medium">
                      CcaaS ✓ Ready
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roiType">ROI Type</Label>
                <Select onValueChange={(value) => handleInputChange("roiType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ROI type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rom-bvc">ROM BVC</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Rough Order of Magnitude(ROM) BVC:</strong> Limited to 4 KPIs maximum
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-orange-500 italic">(Optional)</span>{" "}
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={data.startDate || ""}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roiTimeline">
                  {"ROI Timeline: \ndefines the length of the analysis, typically 3 or 5 years"}
                </Label>
                <Select onValueChange={(value) => handleInputChange("roiTimeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="3 years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1 year</SelectItem>
                    <SelectItem value="2-years">2 years</SelectItem>
                    <SelectItem value="3-years">3 years</SelectItem>
                    <SelectItem value="4-years">4 years</SelectItem>
                    <SelectItem value="5-years">5 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountRate">Discount Rate</Label>
              <div className="relative">
                <Input
                  id="discountRate"
                  type="number"
                  step="0.1"
                  placeholder="10.0"
                  className="pr-8"
                  value={data.discountRate || ""}
                  onChange={(e) => handleInputChange("discountRate", e.target.value)}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Cost of capital for NPV calculations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!isFormValid} className="px-8 bg-orange-700">
          Next: Define Objectives
        </Button>
      </div>
    </div>
  )
}

export default ProjectSetup

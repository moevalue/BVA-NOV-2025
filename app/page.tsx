"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProjectSetup } from "@/components/project-setup"
import { ObjectivesKPIs } from "@/components/objectives-kpis"
import { Assumptions } from "@/components/assumptions"
import { FinancialAnalysis } from "@/components/financial-analysis"
import { Results } from "@/components/results"
import { ProjectSelector } from "@/components/project-selector"
import { updateProject, type Project } from "@/lib/projects"

export default function BusinessValueCase() {
  const [activeTab, setActiveTab] = useState("setup")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [user, setUser] = useState<any>(null)

  const [projectData, setProjectData] = useState(() => {
    return {
      projectName: "",
      company: "",
      department: "",
      timeline: "",
      objectives: [],
      kpis: [],
      financialData: {},
      results: {},
      assumptions: {},
      roiType: "",
      kpiAssumptions: {},
      platformSelection: "",
      industry: "",
      clientName: "",
      accountId: "",
      companySize: "",
    }
  })

  useEffect(() => {
    checkUser()
    loadFromLocalStorage()
  }, [])

  const checkUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        console.log("[v0] Auth endpoint returned non-OK status:", response.status)
      }
    } catch (error) {
      console.error("[v0] Error checking user:", error)
    }
  }

  const loadFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem("businessValueCaseData")
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          setProjectData(parsedData)
          setLastSaved(new Date())
        }
      } catch (error) {
        console.error("Failed to load saved data:", error)
      }
    }
  }

  const autoSave = useCallback(
    async (data: typeof projectData) => {
      setIsSaving(true)
      try {
        if (user && currentProject?.id) {
          await updateProject(currentProject.id, {
            project_name: data.projectName,
            company: data.company,
            department: data.department,
            timeline: data.timeline,
            client_name: data.clientName,
            account_id: data.accountId,
            company_size: data.companySize,
            industry: data.industry,
            platform_selection: data.platformSelection,
            roi_type: data.roiType,
            objectives: data.objectives,
            kpis: data.kpis,
            kpi_assumptions: data.kpiAssumptions,
            assumptions: data.assumptions,
            financial_data: data.financialData,
            results: data.results,
          })
        } else {
          localStorage.setItem("businessValueCaseData", JSON.stringify(data))
        }
        setLastSaved(new Date())
      } catch (error) {
        console.error("Failed to save data:", error)
      } finally {
        setTimeout(() => setIsSaving(false), 500)
      }
    },
    [user, currentProject],
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      autoSave(projectData)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [projectData, autoSave])

  const handleTabChange = (newTab: string) => {
    autoSave(projectData)
    setActiveTab(newTab)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("businessValueCaseData")
      setProjectData({
        projectName: "",
        company: "",
        department: "",
        timeline: "",
        objectives: [],
        kpis: [],
        financialData: {},
        results: {},
        assumptions: {},
        roiType: "",
        kpiAssumptions: {},
        platformSelection: "",
        industry: "",
        clientName: "",
        accountId: "",
        companySize: "",
      })
      setLastSaved(null)
    }
  }

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(projectData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `business-value-case-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export data:", error)
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        setProjectData(importedData)
        autoSave(importedData)
      } catch (error) {
        console.error("Failed to import data:", error)
        alert("Failed to import data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  const calculateProgress = () => {
    let completedSections = 0
    const totalSections = 5

    if (projectData.projectName && projectData.company && projectData.roiType) {
      completedSections++
    }

    if (projectData.objectives && projectData.objectives.length > 0) {
      completedSections++
    }

    if (projectData.kpiAssumptions && Object.keys(projectData.kpiAssumptions).length > 0) {
      completedSections++
    }

    if (
      projectData.financialData &&
      (projectData.financialData.costSavings > 0 ||
        projectData.financialData.revenueIncrease > 0 ||
        projectData.financialData.productivityGains > 0)
    ) {
      completedSections++
    }

    if (activeTab === "results" || completedSections === 4) {
      completedSections++
    }

    return Math.round((completedSections / totalSections) * 100)
  }

  const progress = calculateProgress()

  const tabs = [
    { id: "setup", label: "Project Setup", icon: "📋" },
    { id: "objectives", label: "Objectives & KPIs", icon: "🎯" },
    { id: "assumptions", label: "Assumptions", icon: "📝" },
    { id: "financial", label: "Financial Analysis", icon: "💰" },
    { id: "results", label: "Results", icon: "📈" },
  ]

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project)
    setProjectData({
      projectName: project.project_name,
      company: project.company,
      department: project.department,
      timeline: project.timeline,
      clientName: project.client_name || "",
      accountId: project.account_id || "",
      companySize: project.company_size || "",
      industry: project.industry,
      platformSelection: project.platform_selection,
      roiType: project.roi_type,
      objectives: project.objectives || [],
      kpis: project.kpis || [],
      kpiAssumptions: project.kpi_assumptions || {},
      assumptions: project.assumptions || {},
      financialData: project.financial_data || {},
      results: project.results || {},
    })
    setLastSaved(new Date(project.updated_at!))
  }

  const handleNewProject = () => {
    setCurrentProject(null)
    setProjectData({
      projectName: "",
      company: "",
      department: "",
      timeline: "",
      objectives: [],
      kpis: [],
      financialData: {},
      results: {},
      assumptions: {},
      roiType: "",
      kpiAssumptions: {},
      platformSelection: "",
      industry: "",
      clientName: "",
      accountId: "",
      companySize: "",
    })
    setLastSaved(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Business Value Case Builder</h1>
              <p className="text-muted-foreground">Create comprehensive ROI analysis and value propositions</p>
            </div>
            <div className="flex items-center gap-4">
              <ProjectSelector
                currentProject={currentProject}
                onProjectSelect={handleProjectSelect}
                onNewProject={handleNewProject}
              />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isSaving ? (
                    <>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Saving...</span>
                    </>
                  ) : lastSaved ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Saved {lastSaved.toLocaleTimeString()}</span>
                    </>
                  ) : null}
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  Export Data
                </Button>
                <Button variant="outline" size="sm" onClick={() => document.getElementById("import-file")?.click()}>
                  Import Data
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  style={{ display: "none" }}
                />
                <Button variant="outline" size="sm" onClick={handleClearData}>
                  Clear Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 leading-7">
                <span className="text-2xl">💼</span>
                {projectData.projectName || currentProject?.project_name || "Business Value Case"}
              </CardTitle>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/Logo_Avanade%281%29-rcMm3ZSwXeKcagFB67Xkc84lShRIM4.webp"
                alt="Avanade Logo"
                className="w-auto h-8"
              />
            </div>
            <CardDescription>Follow the guided process to build a comprehensive business value case</CardDescription>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Calculator Progress</span>
                <span className="font-medium text-foreground">{progress}% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300 ease-in-out bg-slate-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8 bg-orange-400">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 text-sm font-medium">
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="setup" className="space-y-6">
                <ProjectSetup
                  data={projectData}
                  onUpdate={setProjectData}
                  onNext={() => handleTabChange("objectives")}
                />
              </TabsContent>

              <TabsContent value="objectives" className="space-y-6">
                <ObjectivesKPIs
                  data={projectData}
                  onUpdate={setProjectData}
                  onNext={() => handleTabChange("assumptions")}
                  onPrevious={() => handleTabChange("setup")}
                />
              </TabsContent>

              <TabsContent value="assumptions" className="space-y-6">
                <Assumptions
                  data={projectData}
                  onUpdate={setProjectData}
                  onNext={() => handleTabChange("financial")}
                  onPrevious={() => handleTabChange("objectives")}
                />
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <FinancialAnalysis
                  data={projectData}
                  onUpdate={setProjectData}
                  onNext={() => handleTabChange("results")}
                  onPrevious={() => handleTabChange("assumptions")}
                />
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <Results data={projectData} onUpdate={setProjectData} onPrevious={() => handleTabChange("financial")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

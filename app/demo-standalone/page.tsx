"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectSetup } from "@/components/project-setup"
import { ObjectivesKPIs } from "@/components/objectives-kpis"
import { Assumptions } from "@/components/assumptions"
import { FinancialAnalysis } from "@/components/financial-analysis"
import { Results } from "@/components/results"
import { useRouter } from "next/navigation"

export default function DemoStandalone() {
  const [activeTab, setActiveTab] = useState("setup")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const router = useRouter()

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
    }
  })

  useEffect(() => {
    // Load demo data from localStorage if available
    const savedData = localStorage.getItem("demoProjectData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setProjectData(parsedData)
        setLastSaved(new Date())
      } catch (error) {
        console.error("Failed to load demo data:", error)
      }
    }
  }, [])

  const autoSave = useCallback(async (data: typeof projectData) => {
    setIsSaving(true)
    try {
      localStorage.setItem("demoProjectData", JSON.stringify(data))
      setLastSaved(new Date())
    } catch (error) {
      console.error("Failed to save demo data:", error)
    } finally {
      setTimeout(() => setIsSaving(false), 500)
    }
  }, [])

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

  const handleLoginRedirect = () => {
    localStorage.removeItem("demoProjectData")
    router.push("/auth/login")
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

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              Demo Mode
            </Badge>
            <span className="text-sm text-blue-700">
              You're using the demo version. Data is saved locally and will be lost when you clear your browser data.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoginRedirect}
            className="text-blue-700 border-blue-300 bg-transparent"
          >
            Sign In for Full Access
          </Button>
        </div>
      </div>

      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Business Value Case Builder</h1>
              <p className="text-muted-foreground">Create comprehensive ROI analysis and value propositions</p>
            </div>
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
              <Badge variant="secondary" className="text-sm">
                Demo Edition
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLoginRedirect}>
                Exit Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💼</span>
              {projectData.projectName || "Demo Business Value Case"}
            </CardTitle>
            <CardDescription>Follow the guided process to build a comprehensive business value case</CardDescription>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Calculator Progress</span>
                <span className="font-medium text-foreground">{progress}% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
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

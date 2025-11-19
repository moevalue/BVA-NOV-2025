"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ExternalLink } from "lucide-react"
import dynamic from "next/dynamic"

export const dynamicExport = "force-dynamic"

const ProjectSetup = dynamic(() => import("@/components/project-setup"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
})
const ObjectivesKPIs = dynamic(() => import("@/components/objectives-kpis"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
})
const Assumptions = dynamic(() => import("@/components/assumptions"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
})
const FinancialAnalysis = dynamic(() => import("@/components/financial-analysis"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
})
const Results = dynamic(() => import("@/components/results"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>,
})

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("project-setup")
  const [projectData, setProjectData] = useState({
    projectName: "",
    company: "",
    department: "",
    platformSelection: "",
    projectDuration: "",
    objectives: [],
    kpis: [],
    kpiAssumptions: {},
    costItems: [],
    additionalCosts: [],
    clientName: "",
    accountId: "",
    industry: "",
    companySize: "",
    annualRevenue: "",
    relationshipOwner: "",
    salesStage: "",
    otherNotes: "",
    projectDescription: "",
    startDate: "",
    roiTimeline: "",
    discountRate: "",
    assumptions: {},
    financialData: {},
    results: {},
    roiType: "",
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      const savedData = localStorage.getItem("demo-business-value-case")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setProjectData((prev) => ({ ...prev, ...parsedData }))
      }
    } catch (error) {
      console.error("Error loading demo data:", error)
    }
  }, [mounted])

  // Auto-save to localStorage
  useEffect(() => {
    if (!mounted) return

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("demo-business-value-case", JSON.stringify(projectData))
      } catch (error) {
        console.error("Error saving demo data:", error)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [projectData, mounted])

  const updateProjectData = (updates: any) => {
    setProjectData((prev) => ({ ...prev, ...updates }))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading demo...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "project-setup", label: "Project Setup", icon: "📋" },
    { id: "objectives-kpis", label: "Objectives & KPIs", icon: "🎯" },
    { id: "assumptions", label: "Assumptions", icon: "📊" },
    { id: "financial-analysis", label: "Financial Analysis", icon: "💰" },
    { id: "results", label: "Results", icon: "📈" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "project-setup":
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
            <ProjectSetup projectData={projectData} updateProjectData={updateProjectData} />
          </Suspense>
        )
      case "objectives-kpis":
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
            <ObjectivesKPIs projectData={projectData} updateProjectData={updateProjectData} />
          </Suspense>
        )
      case "assumptions":
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
            <Assumptions projectData={projectData} updateProjectData={updateProjectData} />
          </Suspense>
        )
      case "financial-analysis":
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
            <FinancialAnalysis projectData={projectData} updateProjectData={updateProjectData} />
          </Suspense>
        )
      case "results":
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
            <Results projectData={projectData} updateProjectData={updateProjectData} />
          </Suspense>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Demo Mode - Your data is saved locally and will be lost when you clear browser data
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/auth/signup" className="flex items-center gap-1">
                <ExternalLink className="h-4 w-4" />
                Sign Up for Full Version
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Value Case Builder</h1>
              <p className="text-gray-600 mt-1">Create comprehensive ROI analysis and value propositions</p>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Demo Version
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">{renderTabContent()}</div>
    </div>
  )
}

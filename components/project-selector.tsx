"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, FolderOpen, Copy, Trash2 } from "lucide-react"
import { getUserProjects, createProject, deleteProject, duplicateProject, type Project } from "@/lib/projects"

interface ProjectSelectorProps {
  currentProject: Project | null
  onProjectSelect: (project: Project) => void
  onNewProject: () => void
}

export function ProjectSelector({ currentProject, onProjectSelect, onNewProject }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectCompany, setNewProjectCompany] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    const userProjects = await getUserProjects()
    setProjects(userProjects)
  }

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !newProjectCompany.trim()) return

    setIsLoading(true)
    const newProject = await createProject({
      project_name: newProjectName,
      company: newProjectCompany,
      department: "",
      timeline: "",
      client_name: "",
      account_id: "",
      company_size: "",
      industry: "",
      platform_selection: "",
      roi_type: "",
      objectives: [],
      kpis: [],
      kpi_assumptions: {},
      assumptions: {},
      financial_data: {},
      results: {},
    })

    if (newProject) {
      setProjects([newProject, ...projects])
      onProjectSelect(newProject)
      setNewProjectName("")
      setNewProjectCompany("")
      setIsNewProjectOpen(false)
    }
    setIsLoading(false)
  }

  const handleDuplicateProject = async (project: Project) => {
    const duplicatedProject = await duplicateProject(project.id!, `${project.project_name} (Copy)`)
    if (duplicatedProject) {
      setProjects([duplicatedProject, ...projects])
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      const success = await deleteProject(projectId)
      if (success) {
        setProjects(projects.filter((p) => p.id !== projectId))
        if (currentProject?.id === projectId) {
          onNewProject()
        }
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <FolderOpen className="h-4 w-4" />
            {currentProject ? currentProject.project_name : "Select Project"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Projects</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {projects.map((project) => (
                <Card key={project.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex-1"
                        onClick={() => {
                          onProjectSelect(project)
                          setIsOpen(false)
                        }}
                      >
                        <CardTitle className="text-sm">{project.project_name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{project.company}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {new Date(project.updated_at!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicateProject(project)
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProject(project.id!)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No projects yet. Create your first project to get started.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={newProjectCompany}
                onChange={(e) => setNewProjectCompany(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || !newProjectCompany.trim() || isLoading}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

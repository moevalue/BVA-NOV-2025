export interface Project {
  id?: string
  user_id?: string
  project_name: string
  company: string
  department: string
  timeline: string
  client_name: string
  account_id: string
  company_size: string
  industry: string
  platform_selection: string
  roi_type: string
  project_description?: string
  start_date?: string
  roi_timeline?: string
  discount_rate?: string
  annual_revenue?: string
  relationship_owner?: string
  sales_stage?: string
  other_notes?: string
  project_duration?: string
  objectives: any[]
  kpis: any[]
  kpi_assumptions: any
  assumptions: any
  financial_data: any
  results: any
  cost_items?: any[]
  additional_costs?: any[]
  created_at?: string
  updated_at?: string
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getProjectsFromStorage(): Project[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("business-value-projects")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("[v0] Error reading projects from localStorage:", error)
    return []
  }
}

function saveProjectsToStorage(projects: Project[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("business-value-projects", JSON.stringify(projects))
  } catch (error) {
    console.error("[v0] Error saving projects to localStorage:", error)
  }
}

export async function getUserProjects(): Promise<Project[]> {
  return getProjectsFromStorage()
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = getProjectsFromStorage()
  return projects.find((p) => p.id === id) || null
}

export async function createProject(
  projectData: Omit<Project, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<Project | null> {
  try {
    const projects = getProjectsFromStorage()
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const updatedProjects = [newProject, ...projects]
    saveProjectsToStorage(updatedProjects)

    return newProject
  } catch (error) {
    console.error("[v0] Error creating project:", error)
    return null
  }
}

export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project | null> {
  try {
    const projects = getProjectsFromStorage()
    const projectIndex = projects.findIndex((p) => p.id === id)

    if (projectIndex === -1) {
      return null
    }

    const updatedProject = {
      ...projects[projectIndex],
      ...projectData,
      updated_at: new Date().toISOString(),
    }

    projects[projectIndex] = updatedProject
    saveProjectsToStorage(projects)

    return updatedProject
  } catch (error) {
    console.error("[v0] Error updating project:", error)
    return null
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const projects = getProjectsFromStorage()
    const filteredProjects = projects.filter((p) => p.id !== id)

    if (filteredProjects.length === projects.length) {
      return false // Project not found
    }

    saveProjectsToStorage(filteredProjects)
    return true
  } catch (error) {
    console.error("[v0] Error deleting project:", error)
    return false
  }
}

export async function duplicateProject(id: string, newName: string): Promise<Project | null> {
  try {
    const originalProject = await getProject(id)
    if (!originalProject) return null

    const { id: _, user_id: __, created_at: ___, updated_at: ____, ...projectData } = originalProject

    return createProject({
      ...projectData,
      project_name: newName,
    })
  } catch (error) {
    console.error("[v0] Error duplicating project:", error)
    return null
  }
}

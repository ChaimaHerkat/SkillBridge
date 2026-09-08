import apiCall from './api'
import type { Project, ProjectFilter } from '../types/project'

export const projectService = {
  getProjects: async (filters?: ProjectFilter): Promise<Project[]> => {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.minBudget) params.append('minBudget', filters.minBudget.toString())
    if (filters?.maxBudget) params.append('maxBudget', filters.maxBudget.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)

    const query = params.toString()
    const url = query ? `/projects?${query}` : '/projects'
    return apiCall(url)
  },

  getProjectById: async (projectId: string): Promise<Project> => {
    return apiCall(`/projects/${projectId}`)
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    return apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateProject: async (projectId: string, data: Partial<Project>): Promise<Project> => {
    return apiCall(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await apiCall(`/projects/${projectId}`, { method: 'DELETE' })
  },

  getClientProjects: async (clientId: string): Promise<Project[]> => {
    return apiCall(`/clients/${clientId}/projects`)
  },

  applyToProject: async (projectId: string, proposalData: any): Promise<any> => {
    return apiCall(`/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify(proposalData),
    })
  },
}

export default projectService

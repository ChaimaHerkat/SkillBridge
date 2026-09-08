import { useState, useEffect } from 'react'
import type { Project, ProjectFilter } from '../types/project'
import projectService from '../services/projectService'

export const useProjects = (filters?: ProjectFilter) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await projectService.getProjects(filters)
        setProjects(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [filters])

  return { projects, isLoading, error }
}

export default useProjects

import apiCall from './api'
import type { Freelancer } from '../types/freelancer'



export const freelancerService = {
  getFreelancers: async (): Promise<Freelancer[]> => {
    return apiCall('/freelancers')
  },

  getFreelancerById: async (freelancerId: string): Promise<Freelancer> => {
    return apiCall(`/freelancers/${freelancerId}`)
  },

  searchFreelancers: async (query: string, skills?: string[]): Promise<Freelancer[]> => {
    const params = new URLSearchParams()
    params.append('search', query)
    if (skills?.length) {
      skills.forEach((skill) => params.append('skills', skill))
    }

    return apiCall(`/freelancers/search?${params.toString()}`)
  },

  updateFreelancerProfile: async (freelancerId: string, data: Partial<Freelancer>): Promise<Freelancer> => {
    return apiCall(`/freelancers/${freelancerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  getFreelancerApplications: async (freelancerId: string): Promise<any[]> => {
    return apiCall(`/freelancers/${freelancerId}/applications`)
  },
}

export default freelancerService

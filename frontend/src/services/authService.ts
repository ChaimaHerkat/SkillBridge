import apiCall from './api'
import type {User, AuthUser  }  from '../types/user'


export const authService = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'client' | 'freelancer'
  ): Promise<AuthUser> => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, role }),
    })
  },

  logout: (): void => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  getCurrentUser: async (): Promise<User> => {
    return apiCall('/auth/me')
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    return apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

export default authService

import apiCall from './api'
import type {User, AuthUser  }  from '../types/user'


export const authService = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    // API returns { token, user }
    const { token, user } = res as any

    if (token) {
      localStorage.setItem('authToken', token)
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }

    return { ...(user as any), token } as AuthUser
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'client' | 'freelancer'
  ): Promise<any> => {
    // Normalize role to backend choices (CLIENT / FREELANCER)
    const normalizedRole = role === 'client' ? 'CLIENT' : 'FREELANCER'

    // register returns created user object; caller can login afterwards
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, role: normalizedRole }),
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

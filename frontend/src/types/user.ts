export interface User {
  id: number | string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  role: 'CLIENT' | 'FREELANCER'
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface AuthUser extends User {
  token: string
}

export interface UserProfile extends User {
  phone?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}
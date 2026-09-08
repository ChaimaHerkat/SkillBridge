export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  role: 'client' | 'freelancer' | 'admin'
  createdAt: Date
  updatedAt: Date
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
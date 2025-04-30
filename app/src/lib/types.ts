export enum UserRole {
  Client = 'client',
  Freelancer = 'freelancer'
}

export type User = {
  id: string
  name: string
  email: string
  bio: string | null
  profilePicture: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
  profile?: Profile
}

export type Skill = {
  id: string
  name: string
}

export type Profile = {
  id: string
  userId: string
  bio: string
  profilePicture?: string
  company?: string
  website?: string
  title?: string
  hourlyRate?: number
  skills: Skill[]
  createdAt: string
  updatedAt: string

  user?: User
}

export type ClientProfile = Omit<Profile, 'title' | 'hourlyRate' | 'skills'> & {
  company?: string
  website?: string
}

export type FreelancerProfile = Omit<Profile, 'company' | 'website'> & {
  title: string
  hourlyRate: number
  skills: Skill[]
}

export interface Project {
  id: string
  title: string
  description: string
  budget: number
  category: string
  deadline: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  clientId: string
  client: {
    id: string
    name: string
    profilePicture?: string
  }
  freelancerId?: string
  freelancer?: {
    id: string
    name: string
    profilePicture?: string
  }
  bids?: Bid[]
  createdAt: string
  updatedAt: string
}

export interface Bid {
  id: string
  amount: number
  deliveryDays: number
  proposal: string
  status: 'pending' | 'accepted' | 'rejected'
  freelancerId: string
  freelancer: {
    id: string
    name: string
    profilePicture?: string
  }
  projectId: string
  project: Project
  createdAt: string
  updatedAt: string
}

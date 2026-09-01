export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  duration: string;
  skillsRequired: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  clientId: string;
  freelancerId?: string;
  applicants?: string[];
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  attachments?: string[];
}

export interface ProjectFilter {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: Project['status'];
  search?: string;
}

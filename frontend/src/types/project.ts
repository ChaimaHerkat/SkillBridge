export interface Project {
  id: number | string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  duration: string;
  skills_required: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  client: number | string;
  freelancer?: number | string | null;
  applicants?: (number | string)[];
  created_at: string | Date;
  updated_at: string | Date;
  deadline?: string | Date | null;
  attachments?: string[];
}

export interface ProjectFilter {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: Project['status'];
  search?: string;
}

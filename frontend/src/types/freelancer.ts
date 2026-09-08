export interface Freelancer {
  id: string;
  userId: string;
  title: string;
  description: string;
  skills: string[];
  hourlyRate?: number;
  experience: 'beginner' | 'intermediate' | 'expert';
  portfolio: PortfolioItem[];
  rating: number;
  reviewCount: number;
  completedProjects: number;
  isAvailable: boolean;
  certifications?: string[];
  languages?: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  technologies: string[];
}

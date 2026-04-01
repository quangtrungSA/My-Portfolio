export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: Record<string, string>;
  location: string;
  email: string;
  phone: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  tagline: string;
  availableForHire: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiencyLevel: number;
  icon: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  sortOrder: number;
  category: string;
  status: string;
  startDate: string;
  endDate: string | null;
  clientName: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  logoUrl: string;
  sortOrder: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string;
  logoUrl: string;
  sortOrder: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  message: string;
  username: string;
  role: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrg: string;
  credentialId: string;
  credentialUrl: string;
  badgeUrl: string;
  issueDate: string;
  expiryDate: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  content: string;
  rating: number;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  caption: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  createdAt: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  description: string;
  updatedAt: string;
}

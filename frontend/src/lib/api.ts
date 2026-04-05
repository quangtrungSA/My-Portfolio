import type {
  ApiResponse,
  AuthResponse,
  BlogPost,
  Certification,
  Contact,
  Education,
  Experience,
  Profile,
  Project,
  SiteSetting,
  Skill,
  SkillCategory,
  Tag,
  Testimonial,
} from "@/types";

// ---------------------------------------------------------------------------
// Base fetch utility
// ---------------------------------------------------------------------------

async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message =
      errorBody?.message ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<ApiResponse<T>>;
}

// ---------------------------------------------------------------------------
// Public – Profile
// ---------------------------------------------------------------------------

export async function fetchProfile(): Promise<ApiResponse<Profile>> {
  return fetchApi<Profile>("/api/profile");
}

// ---------------------------------------------------------------------------
// Public – Skills
// ---------------------------------------------------------------------------

export async function fetchSkills(): Promise<ApiResponse<Skill[]>> {
  return fetchApi<Skill[]>("/api/skills");
}

export async function fetchSkillCategories(): Promise<
  ApiResponse<SkillCategory[]>
> {
  return fetchApi<SkillCategory[]>("/api/skill-categories");
}

// ---------------------------------------------------------------------------
// Public – Projects
// ---------------------------------------------------------------------------

export async function fetchProjects(): Promise<ApiResponse<Project[]>> {
  return fetchApi<Project[]>("/api/projects");
}

export async function fetchFeaturedProjects(): Promise<
  ApiResponse<Project[]>
> {
  return fetchApi<Project[]>("/api/projects/featured");
}

// ---------------------------------------------------------------------------
// Public – Experience
// ---------------------------------------------------------------------------

export async function fetchExperiences(): Promise<ApiResponse<Experience[]>> {
  return fetchApi<Experience[]>("/api/experiences");
}

// ---------------------------------------------------------------------------
// Public – Education
// ---------------------------------------------------------------------------

export async function fetchEducation(): Promise<ApiResponse<Education[]>> {
  return fetchApi<Education[]>("/api/education");
}

// ---------------------------------------------------------------------------
// Public – Blog
// ---------------------------------------------------------------------------

export async function fetchPublishedBlogPosts(): Promise<
  ApiResponse<BlogPost[]>
> {
  return fetchApi<BlogPost[]>("/api/blog?published=true");
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<ApiResponse<BlogPost>> {
  return fetchApi<BlogPost>(`/api/blog/slug/${slug}`);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(
  username: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  return fetchApi<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logout(): Promise<ApiResponse<void>> {
  return fetchApi<void>("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<ApiResponse<AuthResponse>> {
  return fetchApi<AuthResponse>("/api/auth/me");
}

// ---------------------------------------------------------------------------
// Admin – Profile
// ---------------------------------------------------------------------------

export async function updateProfile(
  data: Partial<Profile>
): Promise<ApiResponse<Profile>> {
  return fetchApi<Profile>("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Admin – Skills
// ---------------------------------------------------------------------------

export type SkillInput = {
  name: string;
  categoryId: string;
  proficiencyLevel: number;
  icon?: string;
  sortOrder?: number;
};

export async function createSkill(
  data: SkillInput
): Promise<ApiResponse<Skill>> {
  return fetchApi<Skill>("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSkill(
  id: string,
  data: SkillInput
): Promise<ApiResponse<Skill>> {
  return fetchApi<Skill>(`/api/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/skills/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Admin – Skill Categories
// ---------------------------------------------------------------------------

export type SkillCategoryInput = {
  name: string;
  color?: string;
  sortOrder?: number;
};

export async function createSkillCategory(
  data: SkillCategoryInput
): Promise<ApiResponse<SkillCategory>> {
  return fetchApi<SkillCategory>("/api/admin/skill-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSkillCategory(
  id: string,
  data: SkillCategoryInput
): Promise<ApiResponse<SkillCategory>> {
  return fetchApi<SkillCategory>(`/api/admin/skill-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSkillCategory(
  id: string
): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/skill-categories/${id}`, {
    method: "DELETE",
  });
}


// ---------------------------------------------------------------------------
// Admin – Projects
// ---------------------------------------------------------------------------

export async function createProject(
  data: Omit<Project, "id">
): Promise<ApiResponse<Project>> {
  return fetchApi<Project>("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<ApiResponse<Project>> {
  return fetchApi<Project>(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/projects/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Admin – Experience
// ---------------------------------------------------------------------------

export async function createExperience(
  data: Omit<Experience, "id">
): Promise<ApiResponse<Experience>> {
  return fetchApi<Experience>("/api/admin/experiences", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExperience(
  id: string,
  data: Partial<Experience>
): Promise<ApiResponse<Experience>> {
  return fetchApi<Experience>(`/api/admin/experiences/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteExperience(
  id: string
): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/experiences/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Admin – Education
// ---------------------------------------------------------------------------

export async function createEducation(
  data: Omit<Education, "id">
): Promise<ApiResponse<Education>> {
  return fetchApi<Education>("/api/admin/education", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEducation(
  id: string,
  data: Partial<Education>
): Promise<ApiResponse<Education>> {
  return fetchApi<Education>(`/api/admin/education/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEducation(
  id: string
): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/education/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Admin – Blog Posts
// ---------------------------------------------------------------------------

export async function fetchAllBlogPosts(): Promise<ApiResponse<BlogPost[]>> {
  return fetchApi<BlogPost[]>("/api/admin/blog");
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<ApiResponse<BlogPost>> {
  return fetchApi<BlogPost>("/api/admin/blog", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<ApiResponse<BlogPost>> {
  return fetchApi<BlogPost>(`/api/admin/blog/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBlogPost(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/blog/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Admin – Contacts
// ---------------------------------------------------------------------------

export async function fetchContacts(): Promise<ApiResponse<Contact[]>> {
  return fetchApi<Contact[]>("/api/admin/contacts");
}

export async function markContactRead(
  id: string
): Promise<ApiResponse<Contact>> {
  return fetchApi<Contact>(`/api/admin/contacts/${id}/read`, {
    method: "PUT",
  });
}

export async function deleteContact(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/contacts/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Public – Contact form
// ---------------------------------------------------------------------------

export async function submitContact(
  data: Pick<Contact, "name" | "email" | "subject" | "message">
): Promise<ApiResponse<Contact>> {
  return fetchApi<Contact>("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Public – Certifications
// ---------------------------------------------------------------------------

export async function fetchCertifications(): Promise<
  ApiResponse<Certification[]>
> {
  return fetchApi<Certification[]>("/api/certifications");
}

// ---------------------------------------------------------------------------
// Public – Testimonials
// ---------------------------------------------------------------------------

export async function fetchTestimonials(): Promise<
  ApiResponse<Testimonial[]>
> {
  return fetchApi<Testimonial[]>("/api/testimonials");
}

export async function fetchFeaturedTestimonials(): Promise<
  ApiResponse<Testimonial[]>
> {
  return fetchApi<Testimonial[]>("/api/testimonials/featured");
}

// ---------------------------------------------------------------------------
// Public – Tags
// ---------------------------------------------------------------------------

export async function fetchTags(): Promise<ApiResponse<Tag[]>> {
  return fetchApi<Tag[]>("/api/tags");
}

// ---------------------------------------------------------------------------
// Admin – Certifications
// ---------------------------------------------------------------------------

export async function createCertification(
  data: Omit<Certification, "id" | "createdAt" | "updatedAt">
): Promise<ApiResponse<Certification>> {
  return fetchApi<Certification>("/api/admin/certifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCertification(
  id: string,
  data: Partial<Certification>
): Promise<ApiResponse<Certification>> {
  return fetchApi<Certification>(`/api/admin/certifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCertification(
  id: string
): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/certifications/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Admin – Testimonials
// ---------------------------------------------------------------------------

export async function createTestimonial(
  data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">
): Promise<ApiResponse<Testimonial>> {
  return fetchApi<Testimonial>("/api/admin/testimonials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTestimonial(
  id: string,
  data: Partial<Testimonial>
): Promise<ApiResponse<Testimonial>> {
  return fetchApi<Testimonial>(`/api/admin/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTestimonial(
  id: string
): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/testimonials/${id}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Admin – Tags
// ---------------------------------------------------------------------------

export async function createTag(data: Omit<Tag, "id" | "createdAt">): Promise<ApiResponse<Tag>> {
  return fetchApi<Tag>("/api/admin/tags", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteTag(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/api/admin/tags/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Admin – Site Settings
// ---------------------------------------------------------------------------

export async function fetchSettings(): Promise<ApiResponse<SiteSetting[]>> {
  return fetchApi<SiteSetting[]>("/api/admin/settings");
}

export async function updateSetting(
  data: Partial<SiteSetting>
): Promise<ApiResponse<SiteSetting>> {
  return fetchApi<SiteSetting>("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

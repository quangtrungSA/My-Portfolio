import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EducationSection } from "@/components/sections/education-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { BlogSection } from "@/components/sections/blog-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type {
  Profile,
  Skill,
  Project,
  Experience,
  Education,
  Certification,
  Testimonial,
  BlogPost,
  ApiResponse,
} from "@/types";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8080";

async function fetchData<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json: ApiResponse<T[]> = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function fetchSingle<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json: ApiResponse<T[]> = await res.json();
    return json.data?.[0] || null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [
    profile,
    skills,
    projects,
    experiences,
    education,
    certifications,
    testimonials,
    blogPosts,
  ] = await Promise.all([
    fetchSingle<Profile>("/api/profiles"),
    fetchData<Skill>("/api/skills"),
    fetchData<Project>("/api/projects"),
    fetchData<Experience>("/api/experiences"),
    fetchData<Education>("/api/education"),
    fetchData<Certification>("/api/certifications"),
    fetchData<Testimonial>("/api/testimonials"),
    fetchData<BlogPost>("/api/blog-posts"),
  ]);

  const defaultProfile: Profile = {
    id: "",
    name: "Your Name",
    title: "Full Stack Developer",
    bio: "Welcome to my portfolio! I'm a passionate developer who loves building modern web applications.",
    avatarUrl: "",
    resumeUrl: "",
    socialLinks: {},
    location: "Vietnam",
    email: "hello@example.com",
    phone: "",
    metaTitle: "",
    metaDescription: "",
    ogImageUrl: "",
    tagline: "",
    availableForHire: false,
    createdAt: "",
    updatedAt: "",
  };

  const p = profile || defaultProfile;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section id="home">
          <HeroSection profile={p} />
        </section>
        <section id="about">
          <AboutSection profile={p} />
        </section>
        <section id="skills">
          <SkillsSection skills={skills} />
        </section>
        <section id="projects">
          <ProjectsSection projects={projects} />
        </section>
        <section id="experience">
          <ExperienceSection experiences={experiences} />
        </section>
        <section id="education">
          <EducationSection education={education} />
        </section>
        <section id="certifications">
          <CertificationsSection certifications={certifications} />
        </section>
        <section id="testimonials">
          <TestimonialsSection testimonials={testimonials} />
        </section>
        <section id="blog">
          <BlogSection posts={blogPosts.slice(0, 3)} />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}

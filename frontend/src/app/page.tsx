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
import { FloatingNav } from "@/components/layout/floating-nav";
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

const API_BASE = process.env.API_URL || "http://localhost:8080";

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
    bio: "Welcome to my portfolio!",
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
      {/* Floating side navigation */}
      <FloatingNav />

      <main>
        {/* Hero - dark gradient (standalone) */}
        <section id="home">
          <HeroSection profile={p} />
        </section>

        {/* About - subtle warm gradient */}
        <section
          id="about"
          className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 dark:from-slate-950 dark:via-orange-950/10 dark:to-slate-900"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,146,60,0.08),transparent_50%)]" />
          <AboutSection profile={p} />
        </section>

        {/* Skills - cool blue gradient */}
        <section
          id="skills"
          className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="dark relative">
            <SkillsSection skills={skills} />
          </div>
        </section>

        {/* Projects - light gradient with pattern */}
        <section
          id="projects"
          className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50/20 to-purple-50/30 dark:from-slate-950 dark:via-violet-950/10 dark:to-slate-900"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_70%)]" />
          <ProjectsSection projects={projects} />
        </section>

        {/* Experience - dark slate with blue accent */}
        <section
          id="experience"
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
          <div className="dark relative">
            <ExperienceSection experiences={experiences} />
          </div>
        </section>

        {/* Education - warm light gradient */}
        <section
          id="education"
          className="relative overflow-hidden bg-gradient-to-br from-amber-50/40 via-slate-50 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.06),transparent_60%)]" />
          <EducationSection education={education} />
        </section>

        {/* Certifications - dark purple/gold gradient */}
        <section
          id="certifications"
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950/50 to-slate-900"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]" />
          <div className="dark relative">
            <CertificationsSection certifications={certifications} />
          </div>
        </section>

        {/* Testimonials - light pink/rose gradient */}
        <section
          id="testimonials"
          className="relative overflow-hidden bg-gradient-to-br from-rose-50/40 via-slate-50 to-pink-50/30 dark:from-slate-950 dark:via-rose-950/5 dark:to-slate-900"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.05),transparent_60%)]" />
          <TestimonialsSection testimonials={testimonials} />
        </section>

        {/* Blog - subtle gradient */}
        <section
          id="blog"
          className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-50 dark:from-slate-950 dark:via-sky-950/5 dark:to-slate-900"
        >
          <BlogSection posts={blogPosts.slice(0, 3)} />
        </section>

        {/* Contact - dark gradient */}
        <section
          id="contact"
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
          <div className="dark relative">
            <ContactSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

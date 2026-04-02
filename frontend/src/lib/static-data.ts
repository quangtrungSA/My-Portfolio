/**
 * Static fallback data – rendered when the API is unreachable.
 * Keeps the portfolio fully functional even if the backend is down.
 */

import type {
  Profile,
  Skill,
  Project,
  Experience,
  Education,
  Certification,
  Testimonial,
} from "@/types";

// ─────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────
export const STATIC_PROFILE: Profile = {
  id: "1",
  name: "Ly Van Quang Trung",
  title: "Software Engineer",
  tagline: "Building scalable full-stack applications with Java & Next.js",
  bio: "I'm a Software Engineer with hands-on experience building full-stack web applications using Java Spring Boot and Next.js. I care about clean architecture, performance, and shipping products that work reliably in production. Currently open to exciting backend or full-stack opportunities.",
  avatarUrl: "/images/Image.jpeg",
  resumeUrl: "",
  location: "Ho Chi Minh City, Vietnam",
  email: "lyvanquangtrung@gmail.com",
  phone: "",
  availableForHire: true,
  socialLinks: {
    github: "https://github.com/quangtrungSA",
    linkedin: "https://linkedin.com/in/quangtrung",
  },
  metaTitle: "Ly Van Quang Trung – Software Engineer",
  metaDescription:
    "Personal portfolio of Ly Van Quang Trung – Software Engineer specialising in Java Spring Boot and Next.js.",
  ogImageUrl: "",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2026-04-01T00:00:00Z",
};

// ─────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────
export const STATIC_SKILLS: Skill[] = [
  // Backend
  { id: "1",  name: "Java",          category: "Backend",        proficiencyLevel: 90, icon: "☕", sortOrder: 1 },
  { id: "2",  name: "Spring Boot",   category: "Backend",        proficiencyLevel: 88, icon: "🍃", sortOrder: 2 },
  { id: "3",  name: "Spring Security", category: "Backend",      proficiencyLevel: 82, icon: "🔐", sortOrder: 3 },
  { id: "4",  name: "REST APIs",     category: "Backend",        proficiencyLevel: 90, icon: "🔗", sortOrder: 4 },
  { id: "5",  name: "JUnit / Mockito", category: "Backend",      proficiencyLevel: 75, icon: "🧪", sortOrder: 5 },
  // Frontend
  { id: "6",  name: "Next.js",       category: "Frontend",       proficiencyLevel: 85, icon: "▲", sortOrder: 6 },
  { id: "7",  name: "React",         category: "Frontend",       proficiencyLevel: 85, icon: "⚛️", sortOrder: 7 },
  { id: "8",  name: "TypeScript",    category: "Frontend",       proficiencyLevel: 80, icon: "📘", sortOrder: 8 },
  { id: "9",  name: "Tailwind CSS",  category: "Frontend",       proficiencyLevel: 85, icon: "🎨", sortOrder: 9 },
  { id: "10", name: "Framer Motion", category: "Frontend",       proficiencyLevel: 70, icon: "✨", sortOrder: 10 },
  // Database
  { id: "11", name: "PostgreSQL",    category: "Database",       proficiencyLevel: 85, icon: "🐘", sortOrder: 11 },
  { id: "12", name: "MySQL",         category: "Database",       proficiencyLevel: 80, icon: "🗄️", sortOrder: 12 },
  { id: "13", name: "Redis",         category: "Database",       proficiencyLevel: 65, icon: "🔴", sortOrder: 13 },
  // Infrastructure
  { id: "14", name: "Docker",        category: "Infrastructure", proficiencyLevel: 80, icon: "🐳", sortOrder: 14 },
  { id: "15", name: "GitHub Actions", category: "Infrastructure",proficiencyLevel: 78, icon: "⚙️", sortOrder: 15 },
  { id: "16", name: "Linux",         category: "Infrastructure", proficiencyLevel: 75, icon: "🐧", sortOrder: 16 },
  { id: "17", name: "Fly.io / Render", category: "Infrastructure",proficiencyLevel: 70,icon: "☁️", sortOrder: 17 },
  // Tools
  { id: "18", name: "Git",           category: "Tools",          proficiencyLevel: 90, icon: "🔀", sortOrder: 18 },
  { id: "19", name: "IntelliJ IDEA", category: "Tools",          proficiencyLevel: 88, icon: "💡", sortOrder: 19 },
  { id: "20", name: "Postman",       category: "Tools",          proficiencyLevel: 85, icon: "📮", sortOrder: 20 },
];

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
export const STATIC_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Personal Portfolio & CMS",
    description:
      "Full-stack personal portfolio with a headless CMS admin dashboard. Built with Next.js 14 (App Router) on the frontend and Spring Boot 3 on the backend. Features JWT auth, dark/light mode, Framer Motion animations, and a full REST API.",
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    techStack: ["Next.js 14", "Spring Boot 3", "PostgreSQL", "Tailwind CSS", "Docker", "Vercel", "Fly.io"],
    githubUrl: "https://github.com/quangtrungSA/My-Portfolio",
    liveUrl: "https://frontend-two-tan-77.vercel.app",
    featured: true,
    sortOrder: 1,
    category: "Full-Stack",
    status: "completed",
    startDate: "2024-11-01",
    endDate: "2025-03-01",
    clientName: "",
  },
  {
    id: "2",
    title: "E-Commerce REST API",
    description:
      "Scalable REST API for an e-commerce platform supporting products, orders, inventory, and payment processing. Implements clean architecture, Redis caching, and comprehensive unit tests with JUnit 5.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    techStack: ["Spring Boot", "PostgreSQL", "Redis", "Docker", "Swagger/OpenAPI"],
    githubUrl: "https://github.com/quangtrungSA",
    liveUrl: "",
    featured: true,
    sortOrder: 2,
    category: "Backend",
    status: "completed",
    startDate: "2024-06-01",
    endDate: "2024-10-01",
    clientName: "",
  },
  {
    id: "3",
    title: "Task Management App",
    description:
      "Real-time collaborative task management application with boards, lists, and cards. Built with React and Spring Boot WebSocket. Supports drag-and-drop reordering and multi-user collaboration.",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
    techStack: ["React", "TypeScript", "Spring Boot", "WebSocket", "PostgreSQL"],
    githubUrl: "https://github.com/quangtrungSA",
    liveUrl: "",
    featured: false,
    sortOrder: 3,
    category: "Full-Stack",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-05-01",
    clientName: "",
  },
  {
    id: "4",
    title: "CI/CD Pipeline Template",
    description:
      "GitHub Actions CI/CD template for Java Spring Boot + Next.js monorepos. Includes multi-stage Docker builds, automated testing, and zero-downtime deployments to cloud platforms.",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
    techStack: ["GitHub Actions", "Docker", "Java", "Node.js", "Shell Script"],
    githubUrl: "https://github.com/quangtrungSA",
    liveUrl: "",
    featured: false,
    sortOrder: 4,
    category: "DevOps",
    status: "completed",
    startDate: "2023-09-01",
    endDate: "2023-12-01",
    clientName: "",
  },
];

// ─────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────
export const STATIC_EXPERIENCES: Experience[] = [
  {
    id: "1",
    company: "FPT Software",
    position: "Software Engineer",
    startDate: "2024-01-01",
    endDate: null,
    description: `[GOAL] Develop and maintain enterprise Java Spring Boot microservices for large-scale B2B clients in the financial and logistics sectors.
[TECH] Java 21, Spring Boot 3, PostgreSQL, Redis, Docker, REST API, JUnit 5, Mockito, Agile/Scrum
[PHASE:Enterprise Portal] Jan 2024 - Jun 2024 | 8 members
[ROLE] Built and maintained RESTful APIs consumed by web & mobile apps (10k+ DAU)
[ROLE] Optimised slow SQL queries and indexes, reducing average response time by 40%
[ROLE] Wrote unit and integration tests (JUnit 5 + Mockito), raising coverage from 45% to 78%
[PHASE:Microservices Migration] Jul 2024 - Present | 12 members
[ROLE] Participated in decomposing a monolith into 6 Spring Boot microservices
[ROLE] Implemented JWT-based auth service shared across all services
[ROLE] Collaborated with teams in Vietnam, Japan, and Singapore in Agile sprints
[ROLE] On-call production support: resolved 3 P1 incidents with RCA documentation`,
    logoUrl: "/images/logos/fpt-software.svg",
    sortOrder: 1,
  },
  {
    id: "2",
    company: "Hybrid Technologies",
    position: "Junior Software Engineer",
    startDate: "2022-07-01",
    endDate: "2023-12-31",
    description: `[GOAL] Build and ship full-stack features for a B2B SaaS product used by 200+ companies across Southeast Asia.
[TECH] React, TypeScript, Node.js, Express, PostgreSQL, Docker, GitHub Actions, Tailwind CSS
[PHASE:SaaS Platform v2] Jul 2022 - Apr 2023 | 6 members
[ROLE] Implemented 15+ full-stack features across React frontend and Node.js backend
[ROLE] Designed PostgreSQL schemas and wrote migration scripts for 4 new modules
[ROLE] Reduced frontend bundle size by 25% via code-splitting and lazy loading
[PHASE:DevOps & Tooling] May 2023 - Dec 2023 | 4 members
[ROLE] Built CI/CD pipelines with GitHub Actions and multi-stage Docker builds
[ROLE] Cut deployment time from 25 minutes to 8 minutes via pipeline optimisation
[ROLE] Mentored 2 junior interns on Git workflow, code review, and testing practices`,
    logoUrl: "/images/logos/hybrid-technologies.svg",
    sortOrder: 2,
  },
  {
    id: "3",
    company: "Freelance",
    position: "Full-Stack Developer",
    startDate: "2021-06-01",
    endDate: "2022-06-30",
    description: `[GOAL] Deliver full-stack web applications for small businesses in Vietnam — on time, on budget, and built to last.
[TECH] PHP, Laravel, Vue.js, MySQL, PayPal API, VNPay, Nginx, Ubuntu VPS
[PHASE:Client Projects] Jun 2021 - Jun 2022 | Solo developer
[ROLE] Delivered 5 production web applications for retail, food & beverage, and service clients
[ROLE] Built e-commerce stores with shopping cart, order management, and VNPay/PayPal checkout
[ROLE] Set up Linux VPS hosting (Nginx + MySQL) with SSL and automated backups
[ROLE] Provided ongoing maintenance, performance tuning, and SEO optimisation`,
    logoUrl: "/images/logos/freelance.svg",
    sortOrder: 3,
  },
];

// ─────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────
export const STATIC_EDUCATION: Education[] = [
  {
    id: "1",
    institution: "University of Information Technology (UIT)",
    degree: "Bachelor of Engineering",
    field: "Information Technology",
    startDate: "2018-09-01",
    endDate: "2022-06-30",
    description:
      "Specialised in Software Engineering. Coursework included Data Structures & Algorithms, Database Systems, Operating Systems, Computer Networks, and Software Architecture. Final thesis: Real-time chat application using Spring Boot and WebSocket (Grade: 9.2/10).",
    logoUrl: "",
    sortOrder: 1,
  },
];

// ─────────────────────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────────────────────
export const STATIC_CERTIFICATIONS: Certification[] = [
  {
    id: "1",
    name: "Oracle Certified Professional: Java SE 17 Developer",
    issuingOrg: "Oracle",
    credentialId: "OCP-JAVA17-001",
    credentialUrl: "https://catalog-education.oracle.com",
    badgeUrl: "/images/logos/oracle.svg",
    issueDate: "2024-06-01",
    expiryDate: null,
    sortOrder: 1,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Oracle Certified Associate: Java SE 8 Programmer",
    issuingOrg: "Oracle",
    credentialId: "OCA-JAVA8-001",
    credentialUrl: "https://catalog-education.oracle.com",
    badgeUrl: "/images/logos/oracle.svg",
    issueDate: "2023-03-01",
    expiryDate: null,
    sortOrder: 2,
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-03-01T00:00:00Z",
  },
  {
    id: "3",
    name: "LPI Linux Essentials (010-160)",
    issuingOrg: "Linux Professional Institute",
    credentialId: "LPI-LE-001",
    credentialUrl: "https://lpi.org",
    badgeUrl: "/images/logos/lpi.svg",
    issueDate: "2023-08-01",
    expiryDate: null,
    sortOrder: 3,
    createdAt: "2023-08-01T00:00:00Z",
    updatedAt: "2023-08-01T00:00:00Z",
  },
  {
    id: "4",
    name: "LPI Web Development Essentials (030-100)",
    issuingOrg: "Linux Professional Institute",
    credentialId: "LPI-WDE-001",
    credentialUrl: "https://lpi.org",
    badgeUrl: "/images/logos/lpi.svg",
    issueDate: "2024-01-01",
    expiryDate: null,
    sortOrder: 4,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
export const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    authorName: "Nguyen Thanh Tuan",
    authorTitle: "Senior Engineer at FPT Software",
    authorAvatar: "",
    content:
      "Trung is one of the most reliable engineers I've worked with. He takes ownership of problems end-to-end and consistently delivers clean, well-tested code. His deep understanding of Java and Spring Boot made him a core contributor to our team from day one.",
    rating: 5,
    featured: true,
    sortOrder: 1,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
  },
  {
    id: "2",
    authorName: "Le Thi Minh",
    authorTitle: "Tech Lead at Hybrid Technologies",
    authorAvatar: "",
    content:
      "Working with Trung on our SaaS product was a great experience. He quickly grasped complex business logic and translated it into pragmatic technical solutions. His work on the CI/CD pipeline saved our team hours of manual deployment time every week.",
    rating: 5,
    featured: true,
    sortOrder: 2,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "3",
    authorName: "Pham Van Duc",
    authorTitle: "Freelance Client – E-Commerce Project",
    authorAvatar: "",
    content:
      "Trung built our online store from scratch and delivered everything on time and on budget. The site has been running without issues for over a year. He was professional, communicated clearly, and genuinely cared about our business goals.",
    rating: 5,
    featured: false,
    sortOrder: 3,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];


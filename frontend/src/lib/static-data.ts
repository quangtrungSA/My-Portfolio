/**
 * Static fallback data – rendered when the API is unreachable.
 * Keeps the portfolio fully functional even if the backend is down.
 */

import type {
  Profile,
  Skill,
  SkillCategory,
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
  bio: "A result-oriented Software Engineer with over five years of hands-on experience in the IT industry. Holding 8 internationally recognized certifications from Oracle and Linux Professional Institute, I specialize in building scalable, high-quality software solutions. My career has spanned roles from Back-end Developer to Full-stack Developer, and I am currently working as a DevOps Engineer at mgm Technology Partners — a leading German IT company. I have collaborated with cross-functional teams across multiple countries, delivering production-grade systems for clients in Japan, Switzerland, and Germany.",
  avatarUrl: "/images/Image.jpeg",
  resumeUrl: "",
  location: "Ho Chi Minh City, Vietnam",
  email: "lyvanquangtrung@gmail.com",
  phone: "",
  availableForHire: true,
  // Individual social links
  githubUrl: "https://github.com/quangtrungSA",
  linkedinUrl: "https://www.linkedin.com/in/quangtrungsadev",
  leetcodeUrl: "https://leetcode.com/quangtrungleetcode/",
  facebookUrl: "https://www.facebook.com/quangtrungsadev",
  instagramUrl: "https://www.instagram.com/quangtrung_1999",
  dailydevUrl: "https://app.daily.dev/quangtrung27",
  redditUrl: "https://reddit.com/user/Bubbly_Kiwi_5882",
  metaTitle: "Ly Van Quang Trung – Software Engineer",
  metaDescription:
    "Personal portfolio of Ly Van Quang Trung – Software Engineer specialising in Java Spring Boot and Next.js.",
  ogImageUrl: "",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2026-04-01T00:00:00Z",
};

// ─────────────────────────────────────────────
// SKILL CATEGORIES (static fallback)
// ─────────────────────────────────────────────
const mkCat = (id: string, name: string, color: string, sortOrder: number): SkillCategory => ({
  id, name, color, sortOrder, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
});
const CAT_BACKEND        = mkCat("cat-1", "Backend",        "blue",    0);
const CAT_FRONTEND       = mkCat("cat-2", "Frontend",       "purple",  1);
const CAT_DATABASE       = mkCat("cat-3", "Database",       "amber",   2);
const CAT_INFRASTRUCTURE = mkCat("cat-4", "Infrastructure", "emerald", 3);
const CAT_TOOLS          = mkCat("cat-5", "Tools",          "rose",    4);

// ─────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────
export const STATIC_SKILLS: Skill[] = [
  // Backend
  { id: "1",  name: "Java",             category: CAT_BACKEND,        proficiencyLevel: 90, icon: "☕", sortOrder: 1 },
  { id: "2",  name: "Spring Boot",      category: CAT_BACKEND,        proficiencyLevel: 88, icon: "🍃", sortOrder: 2 },
  { id: "3",  name: "Spring Security",  category: CAT_BACKEND,        proficiencyLevel: 82, icon: "🔐", sortOrder: 3 },
  { id: "4",  name: "REST APIs",        category: CAT_BACKEND,        proficiencyLevel: 90, icon: "🔗", sortOrder: 4 },
  { id: "5",  name: "JUnit / Mockito",  category: CAT_BACKEND,        proficiencyLevel: 75, icon: "🧪", sortOrder: 5 },
  // Frontend
  { id: "6",  name: "Next.js",          category: CAT_FRONTEND,       proficiencyLevel: 85, icon: "▲",  sortOrder: 6 },
  { id: "7",  name: "React",            category: CAT_FRONTEND,       proficiencyLevel: 85, icon: "⚛️", sortOrder: 7 },
  { id: "8",  name: "TypeScript",       category: CAT_FRONTEND,       proficiencyLevel: 80, icon: "📘", sortOrder: 8 },
  { id: "9",  name: "Tailwind CSS",     category: CAT_FRONTEND,       proficiencyLevel: 85, icon: "🎨", sortOrder: 9 },
  { id: "10", name: "Framer Motion",    category: CAT_FRONTEND,       proficiencyLevel: 70, icon: "✨", sortOrder: 10 },
  // Database
  { id: "11", name: "PostgreSQL",       category: CAT_DATABASE,       proficiencyLevel: 85, icon: "🐘", sortOrder: 11 },
  { id: "12", name: "MySQL",            category: CAT_DATABASE,       proficiencyLevel: 80, icon: "🗄️", sortOrder: 12 },
  { id: "13", name: "Redis",            category: CAT_DATABASE,       proficiencyLevel: 65, icon: "🔴", sortOrder: 13 },
  // Infrastructure
  { id: "14", name: "Docker",           category: CAT_INFRASTRUCTURE, proficiencyLevel: 80, icon: "🐳", sortOrder: 14 },
  { id: "15", name: "GitHub Actions",   category: CAT_INFRASTRUCTURE, proficiencyLevel: 78, icon: "⚙️", sortOrder: 15 },
  { id: "16", name: "Linux",            category: CAT_INFRASTRUCTURE, proficiencyLevel: 75, icon: "🐧", sortOrder: 16 },
  { id: "17", name: "Fly.io / Render",  category: CAT_INFRASTRUCTURE, proficiencyLevel: 70, icon: "☁️", sortOrder: 17 },
  // Tools
  { id: "18", name: "Git",              category: CAT_TOOLS,          proficiencyLevel: 90, icon: "🔀", sortOrder: 18 },
  { id: "19", name: "IntelliJ IDEA",    category: CAT_TOOLS,          proficiencyLevel: 88, icon: "💡", sortOrder: 19 },
  { id: "20", name: "Postman",          category: CAT_TOOLS,          proficiencyLevel: 85, icon: "📮", sortOrder: 20 },
];

// ─────────────────────────────────────────────
// PROJECTS  (real GitHub repos)
// ─────────────────────────────────────────────
export const STATIC_PROJECTS: Project[] = [
  {
    id: "1",
    title: "My Portfolio & CMS",
    description:
      "Full-stack personal portfolio with an admin CMS dashboard. Next.js 14 App Router + Spring Boot 3 backend, PostgreSQL on Neon, JWT auth (httpOnly cookie), Framer Motion animations, dark/light mode, and a full CI/CD pipeline via GitHub Actions → Vercel + Render.",
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    techStack: ["Next.js 14", "Spring Boot 3", "PostgreSQL", "Tailwind CSS", "Docker", "GitHub Actions"],
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
    title: "Shop Spring Boot Admin",
    description:
      "Full-stack e-commerce web application with a Spring Boot MVC backend and admin dashboard. Features product, category, order, employee, and customer management. Includes Spring Security authentication, Liquibase database migrations, and Thymeleaf templating.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    techStack: ["Spring Boot", "Spring Security", "Liquibase", "Thymeleaf", "MySQL", "Maven"],
    githubUrl: "https://github.com/quangtrungSA/shop-sb-admin",
    liveUrl: "",
    featured: true,
    sortOrder: 2,
    category: "Full-Stack",
    status: "completed",
    startDate: "2019-01-01",
    endDate: "2019-07-01",
    clientName: "",
  },
  {
    id: "3",
    title: "Diet & Nutrition Tracker App",
    description:
      "Android mobile application for daily diet and calorie tracking. Built with Java and Gradle for Android. Features daily meal logging, nutrition breakdown, custom fonts, and an intuitive UI for tracking health goals.",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    techStack: ["Java", "Android", "Gradle", "SQLite"],
    githubUrl: "https://github.com/quangtrungSA/dietApp",
    liveUrl: "",
    featured: false,
    sortOrder: 3,
    category: "Mobile",
    status: "completed",
    startDate: "2020-05-01",
    endDate: "2020-08-01",
    clientName: "",
  },
  {
    id: "4",
    title: "Coffee House Website",
    description:
      "Responsive React frontend for a coffee house business. Built with Create React App, featuring a modern landing page, menu display, and interactive UI components. Clean design with CSS animations.",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    techStack: ["React", "JavaScript", "CSS3", "HTML5"],
    githubUrl: "https://github.com/quangtrungSA/coffeeHouse",
    liveUrl: "",
    featured: false,
    sortOrder: 4,
    category: "Frontend",
    status: "completed",
    startDate: "2020-11-01",
    endDate: "2021-01-01",
    clientName: "",
  },
  {
    id: "5",
    title: "Java Design Patterns (14 Patterns)",
    description:
      "Comprehensive Java implementation of 14 classic Gang-of-Four design patterns. Each pattern includes a clear example with real-world use cases. Covers Creational, Structural, and Behavioral patterns — useful as a reference for Java developers.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    techStack: ["Java", "OOP", "Design Patterns"],
    githubUrl: "https://github.com/quangtrungSA/LeetCodeMonths5Year2023",
    liveUrl: "",
    featured: false,
    sortOrder: 5,
    category: "Backend",
    status: "completed",
    startDate: "2023-04-01",
    endDate: "2023-05-01",
    clientName: "",
  },
  {
    id: "6",
    title: "Selenium + TestNG Automation",
    description:
      "Automated UI testing framework built with Selenium WebDriver and TestNG. Includes test configurations, ExtentReports for HTML test reporting, and Google Guice for dependency injection. Demonstrates end-to-end browser automation for web applications.",
    imageUrl: "https://images.unsplash.com/photo-1518349619113-03114f06ac3a?w=800&q=80",
    techStack: ["Java", "Selenium", "TestNG", "Maven", "ExtentReports"],
    githubUrl: "https://github.com/quangtrungSA/selenium-TestNG",
    liveUrl: "",
    featured: false,
    sortOrder: 6,
    category: "Backend",
    status: "completed",
    startDate: "2020-10-01",
    endDate: "2020-12-01",
    clientName: "",
  },
  {
    id: "7",
    title: "Linux Tools & Documentation",
    description:
      "Comprehensive Linux reference documentation and shell scripts covering user/group management, scheduling (cron/at), stream redirection, RPM package management, and X11 GUI configuration. Useful as a practical Linux admin cheatsheet.",
    imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
    techStack: ["Linux", "Bash", "Shell Script", "Cron"],
    githubUrl: "https://github.com/quangtrungSA/LinuxToolAndDocument",
    liveUrl: "",
    featured: false,
    sortOrder: 7,
    category: "DevOps",
    status: "completed",
    startDate: "2021-01-01",
    endDate: "2021-06-01",
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
    projectName: "Enterprise Microservices Platform",
    startDate: "2024-01-01",
    endDate: null,
    goal: "Develop and maintain enterprise Java Spring Boot microservices for large-scale B2B clients in the financial and logistics sectors.",
    technologies: ["Java 21", "Spring Boot 3", "PostgreSQL", "Redis", "Docker", "REST API", "JUnit 5", "Mockito", "Agile/Scrum"],
    logoUrl: "/images/logos/fpt-software.svg",
    sortOrder: 1,
    phases: [
      {
        id: "p1",
        name: "Enterprise Portal",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        teamSize: 8,
        sortOrder: 0,
        roles: [
          { id: "r1", name: "Built and maintained RESTful APIs consumed by web & mobile apps (10k+ DAU)", description: "", sortOrder: 0 },
          { id: "r2", name: "Optimised slow SQL queries and indexes, reducing average response time by 40%", description: "", sortOrder: 1 },
          { id: "r3", name: "Wrote unit and integration tests (JUnit 5 + Mockito), raising coverage from 45% to 78%", description: "", sortOrder: 2 },
        ],
      },
      {
        id: "p2",
        name: "Microservices Migration",
        startDate: "2024-07-01",
        endDate: null,
        teamSize: 12,
        sortOrder: 1,
        roles: [
          { id: "r4", name: "Participated in decomposing a monolith into 6 Spring Boot microservices", description: "", sortOrder: 0 },
          { id: "r5", name: "Implemented JWT-based auth service shared across all services", description: "", sortOrder: 1 },
          { id: "r6", name: "Collaborated with teams in Vietnam, Japan, and Singapore in Agile sprints", description: "", sortOrder: 2 },
          { id: "r7", name: "On-call production support: resolved 3 P1 incidents with RCA documentation", description: "", sortOrder: 3 },
        ],
      },
    ],
  },
  {
    id: "2",
    company: "Hybrid Technologies",
    position: "Junior Software Engineer",
    projectName: "B2B SaaS Platform",
    startDate: "2022-07-01",
    endDate: "2023-12-31",
    goal: "Build and ship full-stack features for a B2B SaaS product used by 200+ companies across Southeast Asia.",
    technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "GitHub Actions", "Tailwind CSS"],
    logoUrl: "/images/logos/hybrid-technologies.svg",
    sortOrder: 2,
    phases: [
      {
        id: "p3",
        name: "SaaS Platform v2",
        startDate: "2022-07-01",
        endDate: "2023-04-30",
        teamSize: 6,
        sortOrder: 0,
        roles: [
          { id: "r8", name: "Implemented 15+ full-stack features across React frontend and Node.js backend", description: "", sortOrder: 0 },
          { id: "r9", name: "Designed PostgreSQL schemas and wrote migration scripts for 4 new modules", description: "", sortOrder: 1 },
          { id: "r10", name: "Reduced frontend bundle size by 25% via code-splitting and lazy loading", description: "", sortOrder: 2 },
        ],
      },
      {
        id: "p4",
        name: "DevOps & Tooling",
        startDate: "2023-05-01",
        endDate: "2023-12-31",
        teamSize: 4,
        sortOrder: 1,
        roles: [
          { id: "r11", name: "Built CI/CD pipelines with GitHub Actions and multi-stage Docker builds", description: "", sortOrder: 0 },
          { id: "r12", name: "Cut deployment time from 25 minutes to 8 minutes via pipeline optimisation", description: "", sortOrder: 1 },
          { id: "r13", name: "Mentored 2 junior interns on Git workflow, code review, and testing practices", description: "", sortOrder: 2 },
        ],
      },
    ],
  },
  {
    id: "3",
    company: "Freelance",
    position: "Full-Stack Developer",
    projectName: "Client Web Applications",
    startDate: "2021-06-01",
    endDate: "2022-06-30",
    goal: "Deliver full-stack web applications for small businesses in Vietnam — on time, on budget, and built to last.",
    technologies: ["PHP", "Laravel", "Vue.js", "MySQL", "PayPal API", "VNPay", "Nginx", "Ubuntu VPS"],
    logoUrl: "/images/logos/freelance.svg",
    sortOrder: 3,
    phases: [
      {
        id: "p5",
        name: "Client Projects",
        startDate: "2021-06-01",
        endDate: "2022-06-30",
        teamSize: 1,
        sortOrder: 0,
        roles: [
          { id: "r14", name: "Delivered 5 production web applications for retail, food & beverage, and service clients", description: "", sortOrder: 0 },
          { id: "r15", name: "Built e-commerce stores with shopping cart, order management, and VNPay/PayPal checkout", description: "", sortOrder: 1 },
          { id: "r16", name: "Set up Linux VPS hosting (Nginx + MySQL) with SSL and automated backups", description: "", sortOrder: 2 },
          { id: "r17", name: "Provided ongoing maintenance, performance tuning, and SEO optimisation", description: "", sortOrder: 3 },
        ],
      },
    ],
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
    issuingOrg: "Oracle Corporation",
    credentialId: "OCP-JAVA17-001",
    credentialUrl: "https://catalog-education.oracle.com",
    badgeUrl: "/images/corporation/oracle.png",
    issueDate: "2024-06-01",
    expiryDate: null,
    sortOrder: 1,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Oracle Certified Associate: Java SE 8 Programmer",
    issuingOrg: "Oracle Corporation",
    credentialId: "OCA-JAVA8-001",
    credentialUrl: "https://catalog-education.oracle.com",
    badgeUrl: "/images/corporation/oracle.png",
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
    badgeUrl: "/images/corporation/linux.png",
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
    badgeUrl: "/images/corporation/linux.png",
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
    authorName: "FPT Software Da Nang",
    authorTitle: "Business Unit R17",
    authorAvatar: "/images/company/fpt.png",
    content:
      "Best performance employee of business unit R17 - FPT Software year 2022. Recognized for outstanding technical contributions and dedication to project delivery.",
    rating: 5,
    featured: true,
    sortOrder: 1,
    createdAt: "2025-12-01T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
  },
  {
    id: "2",
    authorName: "FPT Software Da Nang",
    authorTitle: "Certification Achievement",
    authorAvatar: "/images/company/fpt.png",
    content:
      "Top 2 Fsofter achieved the most international certificates at FPT Software Danang in 2022. Demonstrated exceptional commitment to continuous learning and professional development.",
    rating: 5,
    featured: true,
    sortOrder: 2,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "3",
    authorName: "Hybrid Technologies",
    authorTitle: "Outstanding Project - NOVA E-learning",
    authorAvatar: "/images/company/Hybrid.png",
    content:
      "Successfully delivered the NOVA E-learning platform for Nova Holdings (Japan) - a comprehensive English teaching application serving thousands of students. Led backend development using Java Spring Boot, implemented RESTful APIs, integrated payment systems, and ensured high availability.",
    rating: 5,
    featured: true,
    sortOrder: 3,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];


// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

// ---------------------------------------------------------------------------
// Skill categories
// ---------------------------------------------------------------------------

export const SKILL_CATEGORIES: string[] = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "Tools",
  "Other",
];

// ---------------------------------------------------------------------------
// Social icon mapping
// ---------------------------------------------------------------------------

export const SOCIAL_ICONS: Record<string, string> = {
  github: "Github",
  linkedin: "Linkedin",
  twitter: "Twitter",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "Youtube",
  dribbble: "Dribbble",
  behance: "Globe",
  medium: "BookOpen",
  devto: "Code",
  stackoverflow: "Code2",
  website: "Globe",
  email: "Mail",
};

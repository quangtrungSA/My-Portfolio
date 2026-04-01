"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  User,
  Wrench,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquareQuote,
  FileText,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { label: "Home", href: "#home", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Wrench },
  { label: "Projects", href: "#projects", icon: FolderKanban },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Education", href: "#education", icon: GraduationCap },
  { label: "Certs", href: "#certifications", icon: Award },
  { label: "Reviews", href: "#testimonials", icon: MessageSquareQuote },
  { label: "Blog", href: "/blog", icon: FileText },
  { label: "Contact", href: "#contact", icon: Mail },
];

export function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showNav, setShowNav] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show nav after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating toggle button - always visible after scroll */}
      <AnimatePresence>
        {showNav && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed right-4 top-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 text-white shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:bg-slate-800 hover:shadow-xl dark:border-white/10 dark:bg-slate-800/90 sm:right-6"
            aria-label="Toggle navigation"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="size-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="size-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating nav panel */}
      <AnimatePresence>
        {isOpen && showNav && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm"
            />

            {/* Nav panel */}
            <motion.nav
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-4 top-20 z-[60] w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/30 backdrop-blur-xl dark:bg-slate-800/95 sm:right-6"
            >
              <div className="p-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.replace("#", "");
                  const Icon = item.icon;

                  return item.href.startsWith("/") ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`size-4 ${isActive ? "text-blue-400" : ""}`}
                      />
                      {item.label}
                      {isActive && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Theme toggle + divider */}
              <div className="border-t border-white/10 p-2">
                {mounted && (
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    {theme === "dark" ? (
                      <Sun className="size-4" />
                    ) : (
                      <Moon className="size-4" />
                    )}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Dot indicators on the side (visible when nav is closed) */}
      <AnimatePresence>
        {showNav && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 sm:right-6 sm:flex"
          >
            {navItems
              .filter((item) => item.href.startsWith("#"))
              .map((item) => {
                const isActive =
                  activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="group relative flex items-center justify-end"
                    aria-label={item.label}
                  >
                    {/* Tooltip */}
                    <span className="absolute right-5 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      {item.label}
                    </span>
                    {/* Dot */}
                    <div
                      className={`h-2 w-2 rounded-full transition-all ${
                        isActive
                          ? "scale-125 bg-blue-500 shadow-md shadow-blue-500/50"
                          : "bg-slate-500/50 group-hover:bg-slate-400"
                      }`}
                    />
                  </a>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ExternalLink, Code2, FolderKanban, Star } from "lucide-react";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

// Color palettes for cards
const CARD_PALETTE = [
  {
    border: "border-cyan-800/30",
    accent: "border-l-2 border-l-cyan-400/50",
    topBg: "bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900",
    techBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    btn: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300",
  },
  {
    border: "border-violet-800/30",
    accent: "border-l-2 border-l-violet-400/50",
    topBg: "bg-gradient-to-br from-slate-900 via-violet-950/30 to-slate-900",
    techBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    btn: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 text-violet-300",
  },
  {
    border: "border-emerald-800/30",
    accent: "border-l-2 border-l-emerald-400/50",
    topBg: "bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900",
    techBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    btn: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
  },
  {
    border: "border-amber-800/30",
    accent: "border-l-2 border-l-amber-400/50",
    topBg: "bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900",
    techBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    btn: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300",
  },
  {
    border: "border-rose-800/30",
    accent: "border-l-2 border-l-rose-400/50",
    topBg: "bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900",
    techBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    btn: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300",
  },
  {
    border: "border-blue-800/30",
    accent: "border-l-2 border-l-blue-400/50",
    topBg: "bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900",
    techBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    btn: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const pal = CARD_PALETTE[index % CARD_PALETTE.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-xl border ${pal.border} ${pal.accent} bg-slate-900/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/20`}
      >
        {/* Image section - compact */}
        {project.imageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            {project.featured && (
              <div className="absolute top-2 right-2">
                <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30">
                  <Star className="size-2.5 fill-amber-400 text-amber-400" />
                  Featured
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content - compact */}
        <div className={`flex flex-1 flex-col p-3 ${pal.topBg}`}>
          {/* Title & Featured badge (if no image) */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-white line-clamp-1">
              {project.title}
            </h3>
            {!project.imageUrl && project.featured && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30 shrink-0">
                <Star className="size-2.5 fill-amber-400 text-amber-400" />
                Featured
              </span>
            )}
          </div>

          {/* Description - compact */}
          <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack - compact */}
          <div className="flex flex-wrap gap-1 mb-3 flex-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className={`rounded-md border px-1.5 py-0.5 text-[9px] font-medium ${pal.techBg}`}
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-500">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Action buttons - compact */}
          <div className="flex gap-2 mt-auto">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${pal.btn}`}
              >
                <Code2 className="size-3" />
                Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${pal.btn}`}
              >
                <ExternalLink className="size-3" />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Show featured projects first, then limit to 6
  const sorted = [...projects]
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 6);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header - matching certifications style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          {/* Icon badge */}
          <motion.div
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 dark:border-cyan-500/20 bg-cyan-100/50 dark:bg-cyan-500/5 px-4 py-1.5">
              <FolderKanban className="size-4 text-cyan-600 dark:text-cyan-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400/70">
                Portfolio
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 dark:from-cyan-300 dark:via-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
              Personal
            </span>{" "}
            <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 dark:from-slate-300 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 90 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-cyan-500/60 via-blue-500/40 to-cyan-500/60"
          />

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            A selection of projects I&apos;ve worked on. Featured projects are highlighted.
          </motion.p>
        </motion.div>

        {/* Projects grid - 3 columns, smaller cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

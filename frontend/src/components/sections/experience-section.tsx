"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Target,
  GitBranch,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { format } from "date-fns";
import type { Experience } from "@/types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

interface ParsedProject {
  goal: string;
  tech: string[];
  phases: { name: string; period: string; team: string; roles: string[] }[];
}

function parseDescription(desc: string): ParsedProject {
  const result: ParsedProject = { goal: "", tech: [], phases: [] };
  if (!desc) return result;

  const lines = desc.split("\n");
  let currentPhase: (typeof result.phases)[0] | null = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("[GOAL]")) {
      result.goal = trimmed.replace("[GOAL]", "").trim();
    } else if (trimmed.startsWith("[TECH]")) {
      result.tech = trimmed
        .replace("[TECH]", "")
        .trim()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (trimmed.startsWith("[PHASE:")) {
      const match = trimmed.match(/\[PHASE:(.+?)\]\s*(.*)/);
      if (match) {
        const parts = (match[2] || "").split("|").map((p) => p.trim());
        currentPhase = {
          name: match[1],
          period: parts[0] || "",
          team: parts[1] || "",
          roles: [],
        };
        result.phases.push(currentPhase);
      }
    } else if (trimmed.startsWith("[ROLE]")) {
      const role = trimmed.replace("[ROLE]", "").trim();
      if (currentPhase) {
        currentPhase.roles.push(role);
      } else {
        if (result.phases.length === 0) {
          currentPhase = { name: "Main", period: "", team: "", roles: [] };
          result.phases.push(currentPhase);
        }
        result.phases[result.phases.length - 1].roles.push(role);
      }
    }
  });

  return result;
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

function calcDuration(start: string, end: string | null): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months =
    (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth();
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y > 0 && m > 0) return `${y}y ${m}m`;
  if (y > 0) return `${y}y`;
  return `${m}m`;
}

interface CompanyGroup {
  company: string;
  logoUrl: string | null;
  experiences: Experience[];
  startDate: string;
  endDate: string | null;
}

function ProjectCard({
  exp,
  delay,
}: {
  exp: Experience;
  delay: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const parsed = parseDescription(exp.description || "");
  const parts = exp.position.split(" - ");
  const role = parts[0];
  const project = parts.length > 1 ? parts.slice(1).join(" - ") : null;
  const hasDetails = parsed.goal || parsed.tech.length > 0 || parsed.phases.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="relative pb-6 pl-8 last:pb-0"
    >
      {/* Branch connector */}
      <div className="absolute left-0 top-5 h-px w-6 bg-slate-600/50" />
      <div className="absolute left-[-3px] top-[17px] h-2.5 w-2.5 rounded-full border-2 border-blue-500/60 bg-slate-900" />

      {/* PROJECT CARD */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all hover:border-white/[0.1]">
        {/* Header - always visible */}
        <div className="px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              {project && (
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5 text-blue-400" />
                  <span className="text-sm font-bold text-blue-400">
                    {project}
                  </span>
                </div>
              )}
              <p className="mt-0.5 text-xs font-medium text-slate-400">
                {role}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-500">
                {formatDate(exp.startDate)} &mdash;{" "}
                {exp.endDate ? (
                  formatDate(exp.endDate)
                ) : (
                  <span className="text-emerald-400">Present</span>
                )}
              </span>

              {/* View/Hide button */}
              {hasDetails && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                    expanded
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                  }`}
                >
                  {expanded ? (
                    <>
                      <EyeOff className="size-3" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="size-3" />
                      Details
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Tech badges - always visible as summary */}
          {parsed.tech.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {parsed.tech.slice(0, expanded ? undefined : 5).map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-400"
                >
                  {t}
                </span>
              ))}
              {!expanded && parsed.tech.length > 5 && (
                <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">
                  +{parsed.tech.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && hasDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/[0.06] px-4 py-3 space-y-3">
                {/* Goal */}
                {parsed.goal && (
                  <div className="flex gap-2">
                    <Target className="mt-0.5 size-3.5 flex-shrink-0 text-amber-400" />
                    <p className="text-xs leading-relaxed text-slate-400">
                      {parsed.goal}
                    </p>
                  </div>
                )}

                {/* Phases tree */}
                {parsed.phases.length > 0 && (
                  <div className="relative ml-1">
                    {parsed.phases.map((phase, pi) => (
                      <div
                        key={pi}
                        className="relative pb-3 pl-5 last:pb-0"
                      >
                        {/* Phase branch */}
                        <div className="absolute left-0 top-2 h-px w-3 bg-slate-600/40" />
                        <div className="absolute left-[-1px] top-[6px] h-1.5 w-1.5 rounded-full bg-purple-500/70" />
                        {pi < parsed.phases.length - 1 && (
                          <div className="absolute left-0 top-[7px] bottom-0 w-px bg-slate-700/30" />
                        )}

                        {/* Phase header */}
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <GitBranch className="size-3 text-purple-400" />
                          <span className="text-[11px] font-semibold text-purple-400">
                            {phase.name}
                          </span>
                          {phase.period && (
                            <span className="text-[10px] text-slate-600">
                              {phase.period}
                            </span>
                          )}
                          {phase.team && (
                            <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-500">
                              {phase.team}
                            </span>
                          )}
                        </div>

                        {/* Roles */}
                        <ul className="space-y-0.5">
                          {phase.roles.map((r, ri) => (
                            <li
                              key={ri}
                              className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500"
                            >
                              <CheckCircle2 className="mt-[2px] size-2.5 flex-shrink-0 text-emerald-500/50" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const companyGroups = useMemo(() => {
    const groups: CompanyGroup[] = [];
    const map = new Map<string, CompanyGroup>();

    experiences.forEach((exp) => {
      const key = exp.company;
      if (!map.has(key)) {
        const group: CompanyGroup = {
          company: exp.company,
          logoUrl: exp.logoUrl,
          experiences: [],
          startDate: exp.startDate,
          endDate: exp.endDate,
        };
        map.set(key, group);
        groups.push(group);
      }
      const group = map.get(key)!;
      group.experiences.push(exp);
      if (exp.startDate < group.startDate) group.startDate = exp.startDate;
      if (!exp.endDate) {
        group.endDate = null;
      } else if (group.endDate && exp.endDate > group.endDate) {
        group.endDate = exp.endDate;
      }
    });

    return groups;
  }, [experiences]);

  if (experiences.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Work Experience
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-3 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            My professional journey across companies and projects
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-slate-600/30 to-transparent sm:left-8" />

          {companyGroups.map((group, gi) => (
            <motion.div
              key={group.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="relative mb-12 last:mb-0"
            >
              {/* Company header */}
              <div className="relative flex items-start gap-4 pb-4 sm:gap-5">
                <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-blue-500/40 bg-white shadow-lg shadow-blue-500/10 sm:h-[72px] sm:w-[72px]">
                  {group.logoUrl ? (
                    <Image
                      src={group.logoUrl}
                      alt={group.company}
                      width={64}
                      height={64}
                      className="h-[80%] w-[80%] object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="text-lg font-bold text-blue-400">
                      {group.company.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-white sm:text-xl">
                    {group.company}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {formatDate(group.startDate)} &mdash;{" "}
                      {group.endDate ? formatDate(group.endDate) : "Present"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {calcDuration(group.startDate, group.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {group.experiences.length} project
                      {group.experiences.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project branches */}
              <div className="relative ml-6 sm:ml-8">
                {group.experiences.map((exp, ei) => (
                  <ProjectCard
                    key={exp.id}
                    exp={exp}
                    delay={gi * 0.05 + ei * 0.08}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

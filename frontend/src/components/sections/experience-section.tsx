"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { Experience } from "@/types";

interface ExperienceSectionProps {
  experiences: Experience[];
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

// Group experiences by company
interface CompanyGroup {
  company: string;
  logoUrl: string | null;
  experiences: Experience[];
  startDate: string;
  endDate: string | null;
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  // Group by company, keeping timeline order
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
      // Expand date range
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
          {/* Main vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-slate-600/30 to-transparent sm:left-8" />

          {companyGroups.map((group, groupIndex) => (
            <motion.div
              key={group.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIndex * 0.15 }}
              className="relative mb-10 last:mb-0"
            >
              {/* Company header node */}
              <div className="relative flex items-start gap-4 pb-4 sm:gap-5">
                {/* Logo circle on timeline */}
                <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-blue-500/40 bg-slate-800 shadow-lg shadow-blue-500/10 sm:h-16 sm:w-16">
                  {group.logoUrl ? (
                    <Image
                      src={group.logoUrl}
                      alt={group.company}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-blue-400">
                      {group.company.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Company info */}
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
                {group.experiences.map((exp, expIndex) => {
                  // Extract project name from position (e.g. "Java Developer - AIRCASH (Finance Domain)")
                  const parts = exp.position.split(" - ");
                  const role = parts[0];
                  const project = parts.length > 1 ? parts.slice(1).join(" - ") : null;

                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: groupIndex * 0.1 + expIndex * 0.08,
                      }}
                      className="relative pb-4 pl-8 last:pb-0"
                    >
                      {/* Branch line (horizontal) */}
                      <div className="absolute left-0 top-4 h-px w-6 bg-slate-600/50" />
                      {/* Branch dot */}
                      <div className="absolute left-[-3px] top-[13px] h-2 w-2 rounded-full border border-slate-500 bg-slate-800" />
                      {/* Vertical connector for siblings */}
                      {expIndex < group.experiences.length - 1 && (
                        <div className="absolute left-[-2.5px] top-[15px] bottom-0 w-px bg-slate-600/30" />
                      )}

                      {/* Project card */}
                      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all hover:border-blue-500/20 hover:bg-white/[0.06]">
                        {/* Project header */}
                        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            {project && (
                              <div className="mb-1 flex items-center gap-1.5">
                                <ChevronRight className="size-3 text-blue-400" />
                                <span className="text-sm font-semibold text-blue-400">
                                  {project}
                                </span>
                              </div>
                            )}
                            <p className="text-sm font-medium text-slate-300">
                              {role}
                            </p>
                          </div>
                          <span className="mt-1 flex-shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 sm:mt-0">
                            {formatDate(exp.startDate)} &mdash;{" "}
                            {exp.endDate ? formatDate(exp.endDate) : (
                              <span className="text-emerald-400">Present</span>
                            )}
                          </span>
                        </div>

                        {/* Description */}
                        {exp.description && (
                          <p className="text-xs leading-relaxed text-slate-500 line-clamp-3 group-hover:line-clamp-none group-hover:text-slate-400 transition-colors">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

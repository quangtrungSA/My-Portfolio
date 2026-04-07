"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Calendar,
  Clock,
  FolderGit2,
  ChevronRight,
  Target,
  GitBranch,
  CheckCircle2,
  Eye,
  EyeOff,
  Briefcase,
  ChevronsUpDown,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import type { Experience } from "@/types";

// ── Constellation canvas background ──────────────────────────────────────────
function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 55;
    const MAX_DIST = 140;
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1 + Math.random() * 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      });

      // Lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(99,179,237,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Dots
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(147,197,253,0.5)";
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60"
    />
  );
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

function calcDuration(start: string, end: string | null): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth();
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

// ── Animated timeline dot ────────────────────────────────────────────────────
function TimelineDot({ active }: { active?: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {active && (
        <motion.span
          className="absolute inline-flex h-5 w-5 rounded-full bg-blue-400/30"
          animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      )}
      <span className={`relative z-10 h-3 w-3 rounded-full border-2 ${active ? "border-blue-400 bg-blue-500 shadow-[0_0_8px_2px_rgba(96,165,250,0.5)]" : "border-slate-500/60 bg-slate-800"}`} />
    </div>
  );
}

// ── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ exp, delay, forceCollapse }: {
  exp: Experience;
  delay: number;
  forceCollapse: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => { setExpanded(!forceCollapse); }, [forceCollapse]);

  const project = exp.projectName || (exp.position.includes(" - ") ? exp.position.split(" - ").slice(1).join(" - ") : null);
  const role = exp.position.split(" - ")[0];
  const technologies = exp.technologies || [];
  const goal = exp.goal || "";
  const phases = (exp.phases || []).sort((a, b) => a.sortOrder - b.sortOrder);
  const hasDetails = goal || technologies.length > 0 || phases.length > 0;
  const isActive = !exp.endDate;

  return (
    <div ref={ref} className="relative pb-6 pl-8 last:pb-0">
      {/* Branch line */}
      <div className="absolute left-0 top-5 h-px w-6 bg-gradient-to-r from-slate-600/60 to-transparent" />
      <div className="absolute left-[-5px] top-[15px]">
        <TimelineDot active={isActive} />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -24, scale: 0.97 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 22, delay }}
        whileHover={{ y: -2 }}
        className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm transition-colors hover:border-blue-500/20"
      >
        {/* Glow on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.06),transparent_60%)]" />

        {/* Top gradient accent */}
        {isActive && (
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
        )}

        {/* Header */}
        <div className="relative px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              {project && (
                <div className="flex items-center gap-1.5">
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: delay + 1 }}
                  >
                    <ChevronRight className="size-3.5 text-blue-400" />
                  </motion.span>
                  <span className="text-sm font-bold text-blue-300">{project}</span>
                  {isActive && (
                    <span className="ml-1 flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
              )}
              <p className="mt-0.5 text-xs font-medium text-slate-400">{role}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-500">
                {formatDate(exp.startDate)} &mdash;{" "}
                {exp.endDate ? formatDate(exp.endDate) : <span className="text-emerald-400">Present</span>}
              </span>
              {hasDetails && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setExpanded(!expanded)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${expanded ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300"}`}
                >
                  {expanded ? <><EyeOff className="size-3" />Hide</> : <><Eye className="size-3" />Details</>}
                </motion.button>
              )}
            </div>
          </div>

          {/* Tech badges */}
          {technologies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {technologies.slice(0, expanded ? undefined : 5).map((t, ti) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: delay + 0.1 + ti * 0.03 }}
                  className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-400"
                >
                  {t}
                </motion.span>
              ))}
              {!expanded && technologies.length > 5 && (
                <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">+{technologies.length - 5} more</span>
              )}
            </div>
          )}
        </div>

        {/* Expandable */}
        <AnimatePresence>
          {expanded && hasDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/[0.05] px-4 py-3 space-y-3">
                {goal && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2"
                  >
                    <Target className="mt-0.5 size-3.5 flex-shrink-0 text-amber-400" />
                    <p className="text-xs leading-relaxed text-slate-400">{goal}</p>
                  </motion.div>
                )}

                {phases.length > 0 && (
                  <div className="relative ml-1 space-y-0">
                    {phases.map((phase, pi) => (
                      <motion.div
                        key={phase.id || pi}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + pi * 0.08 }}
                        className="relative pb-3 pl-5 last:pb-0"
                      >
                        <div className="absolute left-0 top-2 h-px w-3 bg-slate-600/40" />
                        <div className="absolute left-[-1px] top-[6px] h-1.5 w-1.5 rounded-full bg-purple-400/70" />
                        {pi < phases.length - 1 && (
                          <div className="absolute left-0 top-[7px] bottom-0 w-px bg-slate-700/30" />
                        )}
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <GitBranch className="size-3 text-purple-400" />
                          <span className="text-[11px] font-semibold text-purple-300">{phase.name}</span>
                          {(phase.startDate || phase.endDate) && (
                            <span className="text-[10px] text-slate-600">
                              {phase.startDate ? formatDate(phase.startDate) : ""}
                              {phase.startDate && phase.endDate ? " – " : ""}
                              {phase.endDate ? formatDate(phase.endDate) : phase.startDate ? " – Present" : ""}
                            </span>
                          )}
                          {phase.teamSize && (
                            <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-500">{phase.teamSize} members</span>
                          )}
                        </div>
                        {phase.roles && phase.roles.length > 0 && (
                          <ul className="space-y-1">
                            {phase.roles.sort((a, b) => a.sortOrder - b.sortOrder).map((r, ri) => (
                              <motion.li
                                key={r.id || ri}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + ri * 0.04 }}
                                className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500"
                              >
                                <CheckCircle2 className="mt-[2px] size-2.5 flex-shrink-0 text-emerald-500/60" />
                                {r.name}
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [allCollapsed, setAllCollapsed] = useState(false);

  const companyGroups = useMemo(() => {
    const groups: CompanyGroup[] = [];
    const map = new Map<string, CompanyGroup>();
    experiences.forEach((exp) => {
      const key = exp.company;
      if (!map.has(key)) {
        const group: CompanyGroup = { company: exp.company, logoUrl: exp.logoUrl, experiences: [], startDate: exp.startDate, endDate: exp.endDate };
        map.set(key, group);
        groups.push(group);
      }
      const group = map.get(key)!;
      group.experiences.push(exp);
      if (exp.startDate < group.startDate) group.startDate = exp.startDate;
      if (!exp.endDate) { group.endDate = null; }
      else if (group.endDate && exp.endDate > group.endDate) { group.endDate = exp.endDate; }
    });
    return groups;
  }, [experiences]);

  if (experiences.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">

      {/* ── Background ─────────────────────────────────────────────── */}
      <ConstellationBg />

      {/* Deep gradient */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(30,58,138,0.15),transparent)]" />

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(148,163,184,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="pointer-events-none absolute -z-10 left-[-10%] top-[20%] h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut", delay: 3 }}
        className="pointer-events-none absolute -z-10 right-[-10%] bottom-[15%] h-80 w-80 rounded-full bg-indigo-600/10 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, 35, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 6 }}
        className="pointer-events-none absolute -z-10 left-[40%] top-[60%] h-64 w-64 rounded-full bg-cyan-500/8 blur-[90px]"
      />

      {/* Rotating geometric rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="pointer-events-none absolute -z-10 right-[5%] top-[10%] h-48 w-48 rounded-full border border-blue-400/8"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
        className="pointer-events-none absolute -z-10 right-[5%] top-[10%] h-72 w-72 rounded-full border border-indigo-400/5"
        style={{ margin: "-48px" }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="pointer-events-none absolute -z-10 left-[2%] bottom-[15%] h-36 w-36 rounded-full border border-cyan-400/8"
      />

      {/* Travelling light beam along left edge */}
      <motion.div
        className="pointer-events-none absolute -z-10 left-0 w-px bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"
        style={{ height: "30%" }}
        animate={{ top: ["-30%", "130%"] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      {/* Horizontal scanning line */}
      <motion.div
        className="pointer-events-none absolute -z-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />

      {/* Floating sparkle particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute -z-10 rounded-full bg-blue-300/30"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${5 + i * 9.5}%`,
            top: `${10 + (i * 8) % 80}%`,
          }}
          animate={{
            y: [0, -(20 + i * 8), 0],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.6, delay: i * 0.5 }}
        />
      ))}

      {/* Sparkle icons */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`sp-${i}`}
          className="pointer-events-none absolute -z-10"
          style={{ left: `${10 + i * 20}%`, top: `${15 + (i * 17) % 65}%` }}
          animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.1, 0.5], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 5 + i, delay: i * 1.1 }}
        >
          <Sparkles className="size-3 text-blue-400/30" />
        </motion.div>
      ))}

      {/* ── Edge / perimeter animations ──────────────────────────── */}

      {/* TOP edge — dots travelling left→right */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`top-${i}`}
          className="pointer-events-none absolute -z-10 top-0 h-1 w-12 rounded-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
          animate={{ left: ["-5%", "105%"] }}
          transition={{ repeat: Infinity, duration: 5 + i * 1.2, delay: i * 1.5, ease: "linear" }}
        />
      ))}

      {/* BOTTOM edge — dots travelling right→left */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`bot-${i}`}
          className="pointer-events-none absolute -z-10 bottom-0 h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          animate={{ left: ["105%", "-5%"] }}
          transition={{ repeat: Infinity, duration: 6 + i * 1.5, delay: i * 2, ease: "linear" }}
        />
      ))}

      {/* LEFT edge — dots travelling top→bottom */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`left-${i}`}
          className="pointer-events-none absolute -z-10 left-0 w-1 h-16 rounded-full bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent"
          animate={{ top: ["-10%", "110%"] }}
          transition={{ repeat: Infinity, duration: 7 + i * 1.3, delay: i * 1.8, ease: "linear" }}
        />
      ))}

      {/* RIGHT edge — dots travelling bottom→top */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`right-${i}`}
          className="pointer-events-none absolute -z-10 right-0 w-1 h-16 rounded-full bg-gradient-to-b from-transparent via-violet-400/40 to-transparent"
          animate={{ top: ["110%", "-10%"] }}
          transition={{ repeat: Infinity, duration: 8 + i * 1.1, delay: i * 2.2, ease: "linear" }}
        />
      ))}

      {/* Corner glows */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="pointer-events-none absolute -z-10 top-0 left-0 h-32 w-32 bg-blue-500/8 blur-[40px] rounded-br-full"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.5 }}
        className="pointer-events-none absolute -z-10 top-0 right-0 h-32 w-32 bg-indigo-500/8 blur-[40px] rounded-bl-full"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute -z-10 bottom-0 left-0 h-32 w-32 bg-cyan-500/8 blur-[40px] rounded-tr-full"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.8 }}
        className="pointer-events-none absolute -z-10 bottom-0 right-0 h-32 w-32 bg-violet-500/8 blur-[40px] rounded-tl-full"
      />

      {/* Twinkling dots — 2 lề trái/phải + top/bottom */}
      {[
        { left: "1%",  top: "8%",   size: 8, dur: 0.9, delay: 0   },
        { left: "2%",  top: "28%",  size: 6, dur: 1.3, delay: 0.5 },
        { left: "1%",  top: "52%",  size: 9, dur: 1.0, delay: 0.8 },
        { left: "3%",  top: "74%",  size: 6, dur: 1.4, delay: 0.3 },
        { left: "2%",  top: "90%",  size: 7, dur: 1.1, delay: 0.6 },
        { left: "96%", top: "12%",  size: 9, dur: 1.0, delay: 0.4 },
        { left: "97%", top: "35%",  size: 6, dur: 1.2, delay: 0.1 },
        { left: "96%", top: "58%",  size: 8, dur: 0.9, delay: 0.7 },
        { left: "97%", top: "80%",  size: 6, dur: 1.5, delay: 0.2 },
        { left: "35%", top: "0.5%", size: 7, dur: 1.1, delay: 0.9 },
        { left: "58%", top: "0.5%", size: 6, dur: 1.3, delay: 0.4 },
        { left: "22%", top: "99%",  size: 8, dur: 1.0, delay: 0.6 },
        { left: "72%", top: "99%",  size: 6, dur: 1.2, delay: 1.0 },
      ].map((s, i) => (
        <motion.div
          key={`twdot-${i}`}
          className="pointer-events-none absolute z-10 rounded-full bg-cyan-300"
          style={{
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            boxShadow: `0 0 ${s.size * 2}px ${s.size}px rgba(103,232,249,0.3)`,
          }}
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: s.dur * 2, delay: s.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Cross sparkles — blue/indigo */}
      {[
        { left: "2%",  top: "18%", delay: 0.3 },
        { left: "96%", top: "25%", delay: 1.0 },
        { left: "1%",  top: "62%", delay: 0.7 },
        { left: "97%", top: "70%", delay: 0.5 },
        { left: "42%", top: "1%",  delay: 1.3 },
        { left: "65%", top: "98%", delay: 0.8 },
        { left: "15%", top: "98%", delay: 0.4 },
        { left: "80%", top: "1%",  delay: 1.1 },
      ].map((c, i) => (
        <motion.div
          key={`cross-${i}`}
          className="pointer-events-none absolute z-10"
          style={{ left: c.left, top: c.top }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.7, 1.1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.5 + i * 0.3, delay: c.delay, ease: "easeInOut" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(99,179,237,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(99,179,237,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>
      ))}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ── Heading ───────────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          {/* Badge */}
          <motion.div
            className="mb-5 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/8 px-4 py-1.5 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 2 }}
              >
                <Briefcase className="size-4 text-blue-400/80" />
              </motion.div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400/80">Career Journey</span>
            </motion.div>
          </motion.div>

          {/* Title — letter by letter for "Work", slide for "Experience" */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            <span className="inline-flex">
              {"Work".split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateY: -90 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.05 + i * 0.08 }}
                  style={{ display: "inline-block" }}
                  className="text-white"
                >
                  {c}
                </motion.span>
              ))}
            </span>
            {" "}
            <span className="inline-flex">
              {"Experience".split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateY: -90 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.45 + i * 0.06 }}
                  style={{ display: "inline-block" }}
                  className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
                >
                  {c}
                </motion.span>
              ))}
            </span>
          </h2>

          {/* Animated underline */}
          <div className="mx-auto mt-5 flex justify-center">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 100 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="h-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="mx-auto mt-4 max-w-2xl text-slate-400"
          >
            My professional journey across companies and projects
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAllCollapsed((p) => !p)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
            >
              <ChevronsUpDown className="size-3.5" />
              {allCollapsed ? "Show All" : "Hide All"}
            </motion.button>
          </motion.div>
        </div>

        {/* ── Timeline ──────────────────────────────────────────────── */}
        <div className="relative">
          {/* Self-drawing timeline spine */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ originY: 0 }}
            className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-blue-400/20 to-transparent sm:left-8"
          />

          {companyGroups.map((group, gi) => (
            <motion.div
              key={group.company}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 160, damping: 24, delay: gi * 0.12 }}
              className="relative mb-14 last:mb-0"
            >
              {/* Company header */}
              <div className="relative flex items-start gap-4 pb-5 sm:gap-5">
                {/* Logo with glow ring */}
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  className="relative z-10 flex-shrink-0"
                >
                  {/* Outer glow pulse */}
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, delay: gi * 0.5 }}
                    className="absolute inset-0 rounded-xl bg-blue-400/20 blur-sm"
                  />
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border-2 border-blue-500/40 bg-white shadow-lg shadow-blue-500/15 sm:h-[72px] sm:w-[72px]">
                    {group.logoUrl ? (
                      <Image
                        src={group.logoUrl}
                        alt={group.company}
                        width={64}
                        height={64}
                        className={`object-contain ${group.company.toLowerCase().includes("mgm") ? "h-full w-full scale-[1.5]" : "h-[80%] w-[80%]"}`}
                        unoptimized
                      />
                    ) : (
                      <span className="text-lg font-bold text-blue-400">{group.company.charAt(0)}</span>
                    )}
                  </div>
                </motion.div>

                <div className="flex-1 pt-1">
                  <motion.h3
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.12 + 0.1 }}
                    className="text-lg font-bold text-white sm:text-xl"
                  >
                    {group.company}
                    {!group.endDate && (
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="ml-2 inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400"
                      >
                        Current
                      </motion.span>
                    )}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.12 + 0.2 }}
                    className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500"
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-blue-400/60" />
                      {formatDate(group.startDate)} &mdash; {group.endDate ? formatDate(group.endDate) : <span className="text-emerald-400">Present</span>}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-violet-400/60" />
                      {calcDuration(group.startDate, group.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderGit2 className="size-3 text-cyan-400/60" />
                      {group.experiences.length} project{group.experiences.length > 1 ? "s" : ""}
                    </span>
                    {group.company.toLowerCase().includes("mgm") && (
                      <Link
                        href="/mgm-life"
                        className="flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-400 ring-1 ring-violet-500/20 transition-colors hover:bg-violet-500/20"
                      >
                        <Sparkles className="size-3" />
                        mgm life →
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Project cards */}
              <div className="relative ml-6 sm:ml-8 border-l border-slate-700/30 pl-0">
                {group.experiences.map((exp, ei) => (
                  <ProjectCard
                    key={exp.id}
                    exp={exp}
                    delay={gi * 0.06 + ei * 0.1}
                    forceCollapse={allCollapsed}
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

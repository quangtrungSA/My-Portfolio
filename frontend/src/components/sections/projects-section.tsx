"use client";

import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { ExternalLink, Code2, FolderKanban, Star, ChevronDown, ChevronUp, Sparkles, Layers, Trophy } from "lucide-react";
import type { Project } from "@/types";

// ── Constellation canvas ───────────────────────────────────────────────────
function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let id: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.2 + 0.4,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      });
      for (let i = 0; i < dots.length; i++)
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(34,211,238,${(1 - dist / 130) * 0.12})`; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
      dots.forEach((d) => { ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(103,232,249,0.35)"; ctx.fill(); });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-50" />;
}

// ── Stat counter ───────────────────────────────────────────────────────────
function StatNum({ to, label, icon }: { to: number; label: string; icon: React.ReactNode }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.06, y: -3 }}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm shadow-lg"
    >
      <div className="text-cyan-400/80">{icon}</div>
      <span className="text-3xl font-bold leading-none bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">{val}<span>+</span></span>
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

interface ProjectsSectionProps {
  projects: Project[];
}

const CARD_PALETTE = [
  { border: "border-cyan-800/30",    accent: "border-l-2 border-l-cyan-400/50",    topBg: "from-slate-900 via-cyan-950/30 to-slate-900",    techBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",    btn: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300",    glow: "rgba(34,211,238,0.12)" },
  { border: "border-violet-800/30",  accent: "border-l-2 border-l-violet-400/50",  topBg: "from-slate-900 via-violet-950/30 to-slate-900",  techBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",  btn: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 text-violet-300",  glow: "rgba(139,92,246,0.12)" },
  { border: "border-emerald-800/30", accent: "border-l-2 border-l-emerald-400/50", topBg: "from-slate-900 via-emerald-950/30 to-slate-900", techBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", btn: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300", glow: "rgba(52,211,153,0.12)" },
  { border: "border-amber-800/30",   accent: "border-l-2 border-l-amber-400/50",   topBg: "from-slate-900 via-amber-950/30 to-slate-900",   techBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",   btn: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300",   glow: "rgba(251,191,36,0.12)" },
  { border: "border-rose-800/30",    accent: "border-l-2 border-l-rose-400/50",    topBg: "from-slate-900 via-rose-950/30 to-slate-900",    techBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",    btn: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300",    glow: "rgba(251,113,133,0.12)" },
  { border: "border-blue-800/30",    accent: "border-l-2 border-l-blue-400/50",    topBg: "from-slate-900 via-blue-950/30 to-slate-900",    techBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",    btn: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300",    glow: "rgba(96,165,250,0.12)" },
];

function ProjectCard({ project, index, isExtra }: { project: Project; index: number; isExtra?: boolean }) {
  const pal = CARD_PALETTE[index % CARD_PALETTE.length];

  // Extra cards come from different directions
  const extraInitial = [
    { x: -60, y: 40 },
    { x: 0,   y: 80 },
    { x: 60,  y: 40 },
  ];
  const fromDir = extraInitial[index % 3];

  return (
    <motion.div
      initial={isExtra ? { opacity: 0, x: fromDir.x, y: fromDir.y, scale: 0.85, rotateX: 15 } : { opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0 }}
      exit={isExtra ? { opacity: 0, y: 40, scale: 0.9 } : undefined}
      transition={
        isExtra
          ? { type: "spring", stiffness: 180, damping: 20, delay: index * 0.1 }
          : { type: "spring", stiffness: 160, damping: 22, delay: index * 0.08 }
      }
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="h-full"
      style={{ perspective: 800 }}
    >
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-xl border ${pal.border} ${pal.accent} bg-slate-900/90 backdrop-blur-sm transition-all duration-300`}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px ${pal.glow}`; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
      >
        {/* Shine sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent z-10"
          whileHover={{ translateX: "200%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />

        {/* Image */}
        {project.imageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image src={project.imageUrl} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            {project.featured && (
              <div className="absolute top-2 right-2">
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30"
                >
                  <Star className="size-2.5 fill-amber-400 text-amber-400" />
                  Featured
                </motion.span>
              </div>
            )}
          </div>
        )}

        <div className={`flex flex-1 flex-col p-3 bg-gradient-to-br ${pal.topBg}`}>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-white line-clamp-1">{project.title}</h3>
            {!project.imageUrl && project.featured && (
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30 shrink-0"
              >
                <Star className="size-2.5 fill-amber-400 text-amber-400" />
                Featured
              </motion.span>
            )}
          </div>

          <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">{project.description}</p>

          <div className="flex flex-wrap gap-1 mb-3 flex-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className={`rounded-md border px-1.5 py-0.5 text-[9px] font-medium ${pal.techBg}`}>{tech}</span>
            ))}
            {project.techStack.length > 4 && (
              <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-500">+{project.techStack.length - 4}</span>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            {project.githubUrl && (
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${pal.btn}`}
              >
                <Code2 className="size-3" />Code
              </motion.a>
            )}
            {project.liveUrl && (
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${pal.btn}`}
              >
                <ExternalLink className="size-3" />Demo
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Burst particles on load more ──────────────────────────────────────────────
function BurstParticles({ trigger }: { trigger: number }) {
  if (trigger === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 80 + Math.random() * 60;
        return (
          <motion.div
            key={`${trigger}-${i}`}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-cyan-400"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, opacity: 0, scale: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [burst, setBurst] = useState(0);

  const sorted = [...projects]
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 6);

  const first3  = sorted.slice(0, 3);
  const extra3  = sorted.slice(3);
  const hasMore = extra3.length > 0;

  if (projects.length === 0) return null;

  const handleToggle = () => {
    if (!showAll) setBurst((b) => b + 1);
    setShowAll((v) => !v);
  };

  const techCount = Array.from(new Set(sorted.flatMap((p) => p.techStack))).length;

  return (
    <section id="projects" className="relative py-20 sm:py-28 overflow-hidden">

      {/* ── Background ── */}
      <ConstellationBg />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(8,145,178,0.08),transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(103,232,249,1) 1px, transparent 1px)", backgroundSize: "34px 34px" }}
      />
      <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="pointer-events-none absolute -z-10 left-[-8%] top-[15%] h-80 w-80 rounded-full bg-cyan-500/8 blur-[110px]" />
      <motion.div animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 24, ease: "easeInOut", delay: 4 }}
        className="pointer-events-none absolute -z-10 right-[-8%] bottom-[10%] h-72 w-72 rounded-full bg-blue-500/8 blur-[100px]" />
      <motion.div
        className="pointer-events-none absolute z-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        style={{ boxShadow: "0 0 8px 2px rgba(34,211,238,0.3)" }}
        animate={{ top: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      />
      {/* Twinkling dots on edges */}
      {[
        { left: "1%",  top: "10%", s: 7, d: 1.8, dl: 0   },
        { left: "2%",  top: "40%", s: 5, d: 2.2, dl: 0.5 },
        { left: "1%",  top: "70%", s: 8, d: 1.6, dl: 0.9 },
        { left: "96%", top: "15%", s: 8, d: 1.9, dl: 0.3 },
        { left: "97%", top: "50%", s: 5, d: 2.0, dl: 0.7 },
        { left: "96%", top: "80%", s: 7, d: 1.7, dl: 0.2 },
        { left: "40%", top: "0.5%", s: 6, d: 2.1, dl: 0.6 },
        { left: "65%", top: "98.5%", s: 6, d: 1.8, dl: 1.0 },
      ].map((s, i) => (
        <motion.div key={`twdot-${i}`}
          className="pointer-events-none absolute z-10 rounded-full bg-cyan-300"
          style={{ left: s.left, top: s.top, width: s.s, height: s.s, boxShadow: `0 0 ${s.s * 2}px ${s.s}px rgba(34,211,238,0.3)` }}
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: s.d, delay: s.dl, ease: "easeInOut" }}
        />
      ))}
      {[
        { left: "2%",  top: "25%", dl: 0.4 },
        { left: "96%", top: "35%", dl: 1.0 },
        { left: "1%",  top: "58%", dl: 0.7 },
        { left: "97%", top: "65%", dl: 0.3 },
        { left: "30%", top: "1%",  dl: 1.2 },
        { left: "70%", top: "98%", dl: 0.8 },
      ].map((c, i) => (
        <motion.div key={`cross-${i}`} className="pointer-events-none absolute z-10" style={{ left: c.left, top: c.top }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.7, 1.1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.5 + i * 0.3, delay: c.dl, ease: "easeInOut" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(34,211,238,0.65)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(34,211,238,0.65)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>
      ))}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <motion.div
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 dark:border-cyan-500/20 bg-cyan-100/50 dark:bg-cyan-500/5 px-4 py-1.5">
              <FolderKanban className="size-4 text-cyan-600 dark:text-cyan-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400/70">Portfolio</span>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="inline-flex">
              {"Personal".split("").map((c, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 30, rotateY: -90 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.05 + i * 0.06 }}
                  style={{ display: "inline-block" }}
                  className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
                >{c}</motion.span>
              ))}
            </span>
            {" "}
            <span className="inline-flex">
              {"Projects".split("").map((c, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 30, rotateY: -90 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.55 + i * 0.06 }}
                  style={{ display: "inline-block" }}
                  className="text-slate-800 dark:text-slate-200"
                >{c}</motion.span>
              ))}
            </span>
          </h2>

          <motion.div
            initial={{ width: 0 }} whileInView={{ width: 90 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-cyan-500/60 via-blue-500/40 to-cyan-500/60"
          />
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            A selection of projects I&apos;ve worked on. Featured projects are highlighted.
          </motion.p>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-10 flex justify-center gap-4"
        >
          <StatNum to={sorted.length} label="Projects" icon={<FolderKanban className="size-5" />} />
          <StatNum to={techCount} label="Technologies" icon={<Layers className="size-5" />} />
          <StatNum to={sorted.filter(p => p.featured).length} label="Featured" icon={<Trophy className="size-5" />} />
        </motion.div>

        {/* ── First 3 ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {first3.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* ── Extra 3 with AnimatePresence ── */}
        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {extra3.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} isExtra />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Load More button ── */}
        {hasMore && (
          <div className="relative mt-10 flex justify-center">
            <BurstParticles trigger={burst} />

            <motion.button
              onClick={handleToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="relative flex items-center gap-2 overflow-hidden rounded-full border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-300 backdrop-blur-sm transition-colors hover:bg-cyan-500/20"
            >
              {/* Pulsing glow ring — only when collapsed */}
              {!showAll && (
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full border border-cyan-400/40"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}

              {/* Shine sweep */}
              <motion.span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
                whileHover={{ translateX: "200%" }}
                transition={{ duration: 0.5 }}
              />

              <motion.div
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                {showAll ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </motion.div>

              <motion.span
                key={showAll ? "less" : "more"}
                initial={{ opacity: 0, y: showAll ? -10 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {showAll ? "Show Less" : `Load ${extra3.length} More Projects`}
              </motion.span>

              {!showAll && (
                <motion.div
                  animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Sparkles className="size-4 text-cyan-400" />
                </motion.div>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}

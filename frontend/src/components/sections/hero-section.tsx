"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowDown, Download, MapPin, Award, Sparkles, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types";

interface HeroSectionProps {
  profile: Profile;
}

// ── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(words: string[], speed = 75, pause = 2200) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    if (isPausing) return;
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) {
            setIsPausing(true);
            setTimeout(() => { setIsPausing(false); setIsDeleting(true); }, pause);
          }
        } else {
          setText(current.slice(0, text.length - 1));
          if (text.length - 1 === 0) {
            setIsDeleting(false);
            setWordIndex((i) => i + 1);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, isPausing, wordIndex, words, speed, pause]);

  return text;
}

// ── Animated counter hook ────────────────────────────────────────────────────
function useCounter(end: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end, duration]);

  return { count, start };
}

// ── Tech floating tags ───────────────────────────────────────────────────────
const TECH_TAGS = [
  { label: "Java", color: "text-orange-400 border-orange-400/30 bg-orange-400/5" },
  { label: "Spring Boot", color: "text-green-400 border-green-400/30 bg-green-400/5" },
  { label: "React", color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5" },
  { label: "TypeScript", color: "text-blue-400 border-blue-400/30 bg-blue-400/5" },
  { label: "PostgreSQL", color: "text-sky-400 border-sky-400/30 bg-sky-400/5" },
  { label: "Docker", color: "text-blue-300 border-blue-300/30 bg-blue-300/5" },
  { label: "Azure DevOps", color: "text-indigo-400 border-indigo-400/30 bg-indigo-400/5" },
  { label: "Kubernetes", color: "text-purple-400 border-purple-400/30 bg-purple-400/5" },
];

const TAG_POSITIONS = [
  { left: "4%",  top: "18%" },
  { left: "6%",  top: "55%" },
  { left: "2%",  top: "75%" },
  { left: "82%", top: "15%" },
  { left: "85%", top: "50%" },
  { left: "80%", top: "72%" },
  { left: "12%", top: "35%" },
  { left: "74%", top: "33%" },
];

// ── Particles ────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: i % 3 === 0 ? 2 : 1,
  left: `${4 + (i * 4.1) % 92}%`,
  top:  `${5 + (i * 7.3) % 88}%`,
  duration: 2.5 + (i % 5) * 0.7,
  delay: i * 0.35,
}));

export function HeroSection({ profile }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse spotlight
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spotX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const spotY = useSpring(rawY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rawX, rawY]);

  // Typewriter
  const ROLES = [
    profile.title || "Software Engineer",
    "Full Stack Developer",
    "Backend Engineer",
    "DevOps Enthusiast",
    "AI Integration Developer",
  ];
  const typedRole = useTypewriter(ROLES);

  // Stats counters
  const years   = useCounter(5);
  const certs   = useCounter(8);
  const projects = useCounter(10);

  // Scroll helper
  const handleScrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* ── Background layers ─────────────────────────────────────── */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(at_20%_80%,rgba(59,130,246,0.3)_0%,transparent_50%),radial-gradient(at_80%_20%,rgba(139,92,246,0.25)_0%,transparent_50%),radial-gradient(at_50%_50%,rgba(236,72,153,0.12)_0%,transparent_60%)]" />

      {/* Mouse spotlight */}
      <motion.div
        className="pointer-events-none absolute -z-10 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          x: spotX,
          y: spotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        className="absolute -z-10 left-[8%] top-[18%] h-80 w-80 rounded-full bg-blue-500/20 blur-[110px]"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 35, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 11, ease: "easeInOut", delay: 1.5 }}
        className="absolute -z-10 right-[12%] top-[25%] h-96 w-96 rounded-full bg-purple-500/18 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 13, ease: "easeInOut", delay: 3 }}
        className="absolute -z-10 left-[35%] bottom-[15%] h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px]"
      />

      {/* Grid + dot pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      {/* ── Floating tech tags ────────────────────────────────────── */}
      {TECH_TAGS.map((tag, i) => (
        <motion.div
          key={tag.label}
          className={`absolute hidden xl:flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur-sm ${tag.color}`}
          style={TAG_POSITIONS[i]}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.75, 0.4],
            y: [0, -10, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            opacity: { repeat: Infinity, duration: 4 + i * 0.5, delay: i * 0.4, ease: "easeInOut" },
            y:       { repeat: Infinity, duration: 5 + i * 0.4, delay: i * 0.3, ease: "easeInOut" },
            scale:   { repeat: Infinity, duration: 4 + i * 0.3, delay: i * 0.5, ease: "easeInOut" },
          }}
        >
          <Code2 className="size-3 opacity-70" />
          {tag.label}
        </motion.div>
      ))}

      {/* ── Particles ─────────────────────────────────────────────── */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute -z-10 rounded-full bg-white/50"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          {profile.availableForHire ? (
            <Badge
              variant="secondary"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-emerald-300 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for hire
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="gap-1.5 border-slate-500/30 bg-slate-500/10 px-4 py-1.5 text-slate-400 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-500" />
              </span>
              Unavailable
            </Badge>
          )}
        </motion.div>

        {/* Name — staggered letters */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="whitespace-nowrap text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Hi, I&apos;m{" "}
          <motion.span
            className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            style={{ backgroundSize: "200%" }}
          >
            {profile.name}
          </motion.span>{" "}
          <span className="text-slate-400">(</span>
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            DaeMyn
          </span>
          <span className="text-slate-400">)</span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 flex items-center justify-center gap-1 text-xl font-medium text-blue-200/80 sm:text-2xl"
        >
          <span>{typedRole}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block h-[1.2em] w-0.5 bg-blue-400 align-middle"
          />
        </motion.div>

        {/* Tagline */}
        {profile.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mx-auto mt-3 flex items-center justify-center gap-2 text-base text-slate-400 sm:text-lg"
          >
            <Sparkles className="size-4 text-yellow-400" />
            {profile.tagline}
          </motion.p>
        )}

        {/* Animated stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4"
          onViewportEnter={() => { years.start(); certs.start(); projects.start(); }}
        >
          {[
            { value: years.count,    suffix: "+", label: "Years Exp.",     icon: <Award className="size-3.5 text-yellow-400" /> },
            { value: certs.count,    suffix: "",  label: "Certificates",   icon: <Sparkles className="size-3.5 text-purple-400" /> },
            { value: projects.count, suffix: "+", label: "Projects",       icon: <Code2 className="size-3.5 text-cyan-400" /> },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.08, y: -2 }}
              className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                {stat.icon}
                {stat.label}
              </div>
              <span className="text-2xl font-bold text-white">
                {stat.value}{stat.suffix}
              </span>
            </motion.div>
          ))}
          {profile.location && (
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-400 backdrop-blur-sm"
            >
              <MapPin className="size-3.5 text-blue-400" />
              {profile.location}
            </motion.div>
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              onClick={() => handleScrollTo("#projects")}
              className="group gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/40"
            >
              View My Work
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleScrollTo("#contact")}
              className="gap-2 border-slate-600 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              Get in Touch
            </Button>
          </motion.div>
          {profile.resumeUrl && (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-slate-600 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                render={
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" />
                }
              >
                <Download className="size-4" />
                Resume
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => handleScrollTo("#about")}
        >
          <span className="text-xs text-slate-500">Scroll down</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-slate-600 p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="h-1.5 w-1.5 rounded-full bg-blue-400"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Fades */}
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

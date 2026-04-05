"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Award, ExternalLink, Calendar, ShieldCheck, BadgeCheck, Building2, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import type { Certification } from "@/types";

interface CertificationsSectionProps {
  certifications: Certification[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to }: { to: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
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
  return <span ref={ref}>{val}</span>;
}

// ── Floating particles canvas ─────────────────────────────────────────────────
function ParticleBg() {
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
    const pts = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      phase: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.phase += 0.02;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        const a = (Math.sin(p.phase) * 0.25 + 0.35) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${a})`;
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-50" />;
}

// ── Card palette ───────────────────────────────────────────────────────────────
const PALETTES = [
  { border: "border-rose-500/20",   glow: "0 8px 32px rgba(244,63,94,0.12)",   pill: "text-rose-300 bg-rose-500/10 border-rose-500/20",   dot: "bg-rose-400",   btn: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/25 text-rose-300",  bar: "from-rose-500/40 to-rose-400/20",   top: "from-rose-500/10 to-transparent" },
  { border: "border-blue-500/20",   glow: "0 8px 32px rgba(59,130,246,0.12)",  pill: "text-blue-300 bg-blue-500/10 border-blue-500/20",   dot: "bg-blue-400",   btn: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/25 text-blue-300",  bar: "from-blue-500/40 to-blue-400/20",   top: "from-blue-500/10 to-transparent" },
  { border: "border-amber-500/20",  glow: "0 8px 32px rgba(245,158,11,0.12)", pill: "text-amber-300 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400", btn: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/25 text-amber-300", bar: "from-amber-500/40 to-amber-400/20", top: "from-amber-500/10 to-transparent" },
  { border: "border-teal-500/20",   glow: "0 8px 32px rgba(20,184,166,0.12)", pill: "text-teal-300 bg-teal-500/10 border-teal-500/20",   dot: "bg-teal-400",   btn: "bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/25 text-teal-300",  bar: "from-teal-500/40 to-teal-400/20",   top: "from-teal-500/10 to-transparent" },
];

const LOCAL_LOGOS: Record<string, string> = {
  "Oracle":                       "/images/logos/oracle.svg",
  "Oracle Corporation":           "/images/logos/oracle.svg",
  "Linux Professional Institute": "/images/logos/lpi.svg",
  "LPI":                          "/images/logos/lpi.svg",
};

// ── Single card ────────────────────────────────────────────────────────────────
function CertCard({ cert, index }: { cert: Certification; index: number }) {
  const pal = PALETTES[index % PALETTES.length];
  const logoSrc = LOCAL_LOGOS[cert.issuingOrg] ?? cert.badgeUrl ?? null;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 160, damping: 22, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${pal.border} bg-slate-900/80 backdrop-blur-sm transition-all duration-300`}
        style={{ boxShadow: "none" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = pal.glow; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
      >
        {/* Colour accent top strip */}
        <div className={`h-1 w-full bg-gradient-to-r ${pal.bar}`} />

        {/* Shine sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
          whileHover={{ translateX: "200%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />

        {/* ── Logo area ── */}
        <div className={`relative flex items-center gap-4 bg-gradient-to-b ${pal.top} px-5 py-4`}>
          <motion.div
            className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10"
            whileHover={{ scale: 1.08, rotate: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            {logoSrc ? (
              <Image src={logoSrc} alt={cert.issuingOrg} width={56} height={56} className="h-full w-full object-cover" />
            ) : (
              <Award className="size-7 text-slate-400" />
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${pal.pill}`}>
              <motion.span
                className={`h-1.5 w-1.5 rounded-full ${pal.dot}`}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, delay: index * 0.35 }}
              />
              {cert.issuingOrg}
            </span>
          </div>

          {/* Verified icon */}
          <BadgeCheck className="size-4 flex-shrink-0 text-emerald-400/50" />
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
          <h3 className="mb-4 flex-1 text-sm font-semibold leading-snug text-slate-100">
            {cert.name}
          </h3>

          {/* Meta */}
          <div className="mb-4 space-y-1.5 rounded-xl bg-black/20 px-3 py-2.5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="size-3 text-slate-500" />
              Issued{" "}
              <span className="font-semibold text-slate-200">{formatDate(cert.issueDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400/70">
              <ShieldCheck className="size-3" />
              {cert.expiryDate ? `Expires ${formatDate(cert.expiryDate)}` : "No Expiry"}
            </div>
            {cert.credentialId && (
              <p className="truncate text-[10px] text-slate-600">
                ID: {cert.credentialId}
              </p>
            )}
          </div>

          {/* CTA */}
          {cert.credentialUrl ? (
            <motion.a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative mt-auto flex items-center justify-center gap-2 overflow-hidden rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors duration-200 ${pal.btn}`}
            >
              <motion.span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                whileHover={{ translateX: "200%" }}
                transition={{ duration: 0.45 }}
              />
              <ExternalLink className="size-3.5" />
              View Credential
            </motion.a>
          ) : (
            <div className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-black/20 px-3 py-2.5 text-xs text-slate-500">
              <BadgeCheck className="size-3.5 text-emerald-500/50" />
              Verified
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) return null;
  const orgs = Array.from(new Set(certifications.map((c) => c.issuingOrg)));

  return (
    <section id="certifications" className="relative py-16 sm:py-20 overflow-hidden">

      {/* ── Background ── */}
      <ParticleBg />

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(251,191,36,1) 1px, transparent 1px)", backgroundSize: "36px 36px" }}
      />

      {/* Radial centre glow */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(120,53,15,0.12),transparent)]" />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -25, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        className="pointer-events-none absolute -z-10 left-[-6%] top-[8%] h-80 w-80 rounded-full bg-amber-500/8 blur-[110px]"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 35, 0], scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 22, ease: "easeInOut", delay: 5 }}
        className="pointer-events-none absolute -z-10 right-[-6%] bottom-[8%] h-72 w-72 rounded-full bg-yellow-500/8 blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 3 }}
        className="pointer-events-none absolute -z-10 left-[45%] bottom-[20%] h-48 w-48 rounded-full bg-orange-500/5 blur-[80px]"
      />

      {/* Twinkling dots — chỉ ở 2 bên lề */}
      {[
        { left: "1%",  top: "12%", size: 8,  dur: 0.9, delay: 0   },
        { left: "3%",  top: "35%", size: 6,  dur: 1.3, delay: 0.4 },
        { left: "2%",  top: "58%", size: 9,  dur: 1.0, delay: 0.8 },
        { left: "4%",  top: "78%", size: 6,  dur: 1.4, delay: 0.2 },
        { left: "96%", top: "10%", size: 9,  dur: 1.1, delay: 0.5 },
        { left: "97%", top: "30%", size: 6,  dur: 1.2, delay: 0.1 },
        { left: "95%", top: "55%", size: 8,  dur: 0.9, delay: 0.7 },
        { left: "96%", top: "76%", size: 6,  dur: 1.5, delay: 0.3 },
        { left: "48%", top: "0.5%", size: 7, dur: 1.1, delay: 0.6 },
        { left: "65%", top: "98%", size: 8,  dur: 1.0, delay: 0.9 },
        { left: "28%", top: "1%",  size: 6,  dur: 1.6, delay: 0.2 },
        { left: "78%", top: "99%", size: 7,  dur: 1.2, delay: 1.0 },
      ].map((s, i) => (
        <motion.div
          key={`dot-${i}`}
          className="pointer-events-none absolute z-10 rounded-full bg-amber-300"
          style={{
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            boxShadow: `0 0 ${s.size * 2}px ${s.size}px rgba(251,191,36,0.25)`,
          }}
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: s.dur * 2, delay: s.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Cross sparkles — 2 bên lề */}
      {[
        { left: "2%",  top: "22%", delay: 0.3 },
        { left: "95%", top: "42%", delay: 1.0 },
        { left: "3%",  top: "65%", delay: 0.7 },
        { left: "96%", top: "82%", delay: 0.5 },
        { left: "38%", top: "1%",  delay: 1.3 },
        { left: "60%", top: "98%", delay: 0.8 },
        { left: "18%", top: "98%", delay: 0.4 },
        { left: "82%", top: "2%",  delay: 1.1 },
      ].map((c, i) => (
        <motion.div
          key={`cross-${i}`}
          className="pointer-events-none absolute z-10"
          style={{ left: c.left, top: c.top }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.7, 1.1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.5 + i * 0.3, delay: c.delay, ease: "easeInOut" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(251,191,36,0.65)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(251,191,36,0.65)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>
      ))}

      {/* Horizontal scanning line */}
      <motion.div
        className="pointer-events-none absolute -z-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/12 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
      />

      {/* Top edge travellers */}
      {[...Array(3)].map((_, i) => (
        <motion.div key={`te-${i}`}
          className="pointer-events-none absolute -z-10 top-0 h-0.5 w-16 rounded-full bg-gradient-to-r from-transparent via-amber-300/35 to-transparent"
          animate={{ left: ["-8%", "108%"] }}
          transition={{ repeat: Infinity, duration: 7 + i * 1.5, delay: i * 2.2, ease: "linear" }}
        />
      ))}

      {/* Bottom edge travellers — reverse */}
      {[...Array(2)].map((_, i) => (
        <motion.div key={`be-${i}`}
          className="pointer-events-none absolute -z-10 bottom-0 h-0.5 w-20 rounded-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent"
          animate={{ left: ["108%", "-8%"] }}
          transition={{ repeat: Infinity, duration: 9 + i * 2, delay: i * 3, ease: "linear" }}
        />
      ))}

      {/* Corner glows */}
      <motion.div animate={{ opacity: [0.3, 0.65, 0.3] }} transition={{ repeat: Infinity, duration: 4 }}
        className="pointer-events-none absolute -z-10 top-0 left-0 h-40 w-40 rounded-br-full bg-amber-500/6 blur-[50px]" />
      <motion.div animate={{ opacity: [0.3, 0.65, 0.3] }} transition={{ repeat: Infinity, duration: 5, delay: 1.5 }}
        className="pointer-events-none absolute -z-10 top-0 right-0 h-40 w-40 rounded-bl-full bg-yellow-500/6 blur-[50px]" />
      <motion.div animate={{ opacity: [0.3, 0.65, 0.3] }} transition={{ repeat: Infinity, duration: 4.5, delay: 2.5 }}
        className="pointer-events-none absolute -z-10 bottom-0 left-0 h-40 w-40 rounded-tr-full bg-orange-500/5 blur-[50px]" />
      <motion.div animate={{ opacity: [0.3, 0.65, 0.3] }} transition={{ repeat: Infinity, duration: 6, delay: 0.8 }}
        className="pointer-events-none absolute -z-10 bottom-0 right-0 h-40 w-40 rounded-tl-full bg-amber-400/5 blur-[50px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <div className="mb-10 text-center">
          <motion.div
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-4 py-1.5 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: [0, 12, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 2 }}
              >
                <GraduationCap className="size-4 text-amber-400/80" />
              </motion.div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400/80">Certifications</span>
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {/* "My" — outer: flip entrance | inner: nhấp nháy màu */}
            <span className="inline-flex">
              {"My".split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateY: -90 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.05 + i * 0.1 }}
                  style={{ display: "inline-block" }}
                >
                  <motion.span
                    animate={{ color: ["#ffffff", "#fcd34d", "#fb923c", "#ffffff"] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5, ease: "easeInOut" }}
                    style={{ display: "inline-block" }}
                  >
                    {c}
                  </motion.span>
                </motion.span>
              ))}
            </span>
            {" "}
            {/* "Credentials" — outer: flip entrance | inner: nhấp nháy vàng */}
            <span className="inline-flex">
              {"Credentials".split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateY: -90 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.25 + i * 0.06 }}
                  style={{ display: "inline-block" }}
                >
                  <motion.span
                    animate={{ color: ["#fbbf24", "#fef08a", "#f97316", "#fbbf24"] }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.18, ease: "easeInOut" }}
                    style={{ display: "inline-block" }}
                  >
                    {c}
                  </motion.span>
                </motion.span>
              ))}
            </span>
          </h2>

          <div className="mt-4 flex justify-center">
            <motion.div
              initial={{ width: 0 }} whileInView={{ width: 72 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="h-0.5 rounded-full bg-gradient-to-r from-amber-400/50 via-yellow-300/70 to-amber-400/50"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.75 }}
            className="mx-auto mt-3 max-w-xl text-sm text-slate-400"
          >
            Professional certifications and credentials I have earned.
          </motion.p>
        </div>

        {/* ── Stats ── */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {[
            { icon: <Award className="size-3.5 text-amber-400" />,   val: certifications.length, label: "Certifications", cls: "text-amber-200 bg-amber-500/10 border-amber-500/20" },
            { icon: <Building2 className="size-3.5 text-blue-400" />, val: orgs.length,           label: "Organizations",  cls: "text-blue-200 bg-blue-500/10 border-blue-500/20" },
            { icon: <ShieldCheck className="size-3.5 text-emerald-400" />, val: null,             label: "All Verified",   cls: "text-emerald-200 bg-emerald-500/10 border-emerald-500/20" },
          ].map((s, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.1 }}
              whileHover={{ scale: 1.06, y: -2 }}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${s.cls}`}
            >
              {s.icon}
              {s.val !== null ? <><Counter to={s.val} />{" "}</> : null}{s.label}
            </motion.span>
          ))}
        </div>

        {/* ── Cards ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { Award, ExternalLink, Calendar, ShieldCheck, BadgeCheck, Building2, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import type { Certification } from "@/types";

interface CertificationsSectionProps {
  certifications: Certification[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

// Balanced palettes — visible color identity but not overpowering
const CARD_PALETTE = [
  {
    // Card 1 — soft rose
    topBg:  "bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900",
    accent: "border-l-2 border-l-rose-400/50",
    border: "border-rose-800/30",
    ring:   "hover:ring-rose-400/20",
    pill:   "bg-rose-950/40 text-rose-300/80 border border-rose-800/40",
    btn:    "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200",
    glow:   "hover:shadow-rose-950/40",
    dot:    "bg-rose-400/70",
    iconTint: "text-rose-400/60",
  },
  {
    // Card 2 — soft blue
    topBg:  "bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900",
    accent: "border-l-2 border-l-blue-400/50",
    border: "border-blue-800/30",
    ring:   "hover:ring-blue-400/20",
    pill:   "bg-blue-950/40 text-blue-300/80 border border-blue-800/40",
    btn:    "bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:text-blue-200",
    glow:   "hover:shadow-blue-950/40",
    dot:    "bg-blue-400/70",
    iconTint: "text-blue-400/60",
  },
  {
    // Card 3 — soft amber
    topBg:  "bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900",
    accent: "border-l-2 border-l-amber-400/50",
    border: "border-amber-800/30",
    ring:   "hover:ring-amber-400/20",
    pill:   "bg-amber-950/40 text-amber-300/80 border border-amber-800/40",
    btn:    "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200",
    glow:   "hover:shadow-amber-950/40",
    dot:    "bg-amber-400/70",
    iconTint: "text-amber-400/60",
  },
  {
    // Card 4 — soft teal
    topBg:  "bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-900",
    accent: "border-l-2 border-l-teal-400/50",
    border: "border-teal-800/30",
    ring:   "hover:ring-teal-400/20",
    pill:   "bg-teal-950/40 text-teal-300/80 border border-teal-800/40",
    btn:    "bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 hover:text-teal-200",
    glow:   "hover:shadow-teal-950/40",
    dot:    "bg-teal-400/70",
    iconTint: "text-teal-400/60",
  },
];

// Explicit local logos — keys match exact issuingOrg from DB
const LOCAL_LOGOS: Record<string, string> = {
  "Oracle":                       "/images/corporation/oracle.png",
  "Oracle Corporation":           "/images/corporation/oracle.png",
  "Linux Professional Institute": "/images/corporation/linux.png",
  "LPI":                          "/images/corporation/linux.png",
};

// Stagger container variant
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const pillVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
};

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  const orgs = Array.from(new Set(certifications.map((c) => c.issuingOrg)));

  return (
    <section id="certifications" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          {/* Icon badge */}
          <motion.div
            className="mb-3 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5">
              <GraduationCap className="size-4 text-amber-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400/70">
                Certifications
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            My{" "}
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Credentials
            </span>
          </h2>

          {/* Animated underline */}
          <div className="mt-3 flex justify-center">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 70 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="h-0.5 rounded-full bg-gradient-to-r from-amber-400/60 via-yellow-400/40 to-amber-400/60"
            />
          </div>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-3 max-w-xl text-xs text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Professional certifications and credentials I have earned.
          </motion.p>
        </motion.div>

        {/* Stats pills — staggered slide-in */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          <motion.span
            custom={0}
            variants={pillVariants}
            className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-200 border border-amber-400/40 shadow-sm shadow-amber-500/10"
          >
            <Award className="size-3.5 text-amber-400" />
            {certifications.length} Certifications
          </motion.span>
          <motion.span
            custom={1}
            variants={pillVariants}
            className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1.5 text-xs font-bold text-blue-200 border border-blue-400/40 shadow-sm shadow-blue-500/10"
          >
            <Building2 className="size-3.5 text-blue-400" />
            {orgs.length} Organizations
          </motion.span>
          <motion.span
            custom={2}
            variants={pillVariants}
            className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-200 border border-emerald-400/40 shadow-sm shadow-emerald-500/10"
          >
            <ShieldCheck className="size-3.5 text-emerald-400" />
            All Verified
          </motion.span>
        </motion.div>

        {/* Cards — staggered grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {certifications.map((cert, index) => {
            const pal = CARD_PALETTE[index % CARD_PALETTE.length];
            const logoSrc = LOCAL_LOGOS[cert.issuingOrg] ?? null;

            return (
              <motion.div
                key={cert.id}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="h-full"
              >
                <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${pal.border} ${pal.accent} bg-slate-900/90 ring-1 ring-transparent transition-all duration-300 hover:shadow-xl ${pal.glow} ${pal.ring} backdrop-blur-sm`}>

                  {/* ── Top banner ── */}
                  <div className={`relative ${pal.topBg} px-5 pb-6 pt-5`}>
                    {/* Subtle light streak */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_60%)]" />

                    {/* Verified tick — gentle pulse on hover */}
                    <motion.div
                      className="absolute right-3 top-3 z-10"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BadgeCheck className={`size-4 ${pal.iconTint}`} />
                    </motion.div>

                    {/* Logo — float animation on hover */}
                    <div className="relative z-10">
                      <motion.div
                        className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white/95 p-2 shadow-md ring-1 ring-white/10"
                        whileHover={{
                          y: -3,
                          scale: 1.05,
                          transition: { type: "spring", stiffness: 400, damping: 15 },
                        }}
                      >
                        {logoSrc ? (
                          <Image
                            src={logoSrc}
                            alt={cert.issuingOrg}
                            width={48}
                            height={48}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Award className="size-8 text-slate-400" />
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Org pill */}
                    <span className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${pal.pill}`}>
                      <span className={`size-1.5 rounded-full ${pal.dot}`} />
                      {cert.issuingOrg}
                    </span>

                    {/* Cert name */}
                    <h3 className="mb-4 flex-1 text-sm font-semibold leading-snug tracking-tight text-slate-100">
                      {cert.name}
                    </h3>

                    {/* Date box */}
                    <div className="mb-4 space-y-2 rounded-xl bg-black/25 p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="size-3.5 shrink-0 text-slate-500" />
                        <span>
                          Issued{" "}
                          <span className="font-semibold text-slate-200">
                            {formatDate(cert.issueDate)}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <ShieldCheck className="size-3.5 shrink-0 text-emerald-500/60" />
                        <span className="font-medium text-emerald-400/60">
                          {cert.expiryDate
                            ? `Expires ${formatDate(cert.expiryDate)}`
                            : "No Expiry"}
                        </span>
                      </div>
                      {cert.credentialId && (
                        <div className="truncate pt-0.5 text-[10px]">
                          <span className="text-slate-600">ID: </span>
                          <span className="text-slate-500">{cert.credentialId}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA — scale + glow on hover */}
                    {cert.credentialUrl ? (
                      <motion.a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-auto flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-200 ${pal.btn}`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
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
          })}
        </motion.div>
      </div>
    </section>
  );
}

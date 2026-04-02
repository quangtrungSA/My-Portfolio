"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Award, ExternalLink, Calendar, ShieldCheck, BadgeCheck, Building2, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import type { Certification } from "@/types";

interface CertificationsSectionProps {
  certifications: Certification[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

// 4 distinct dark-base palettes — subtle color tint, not blinding
const CARD_PALETTE = [
  {
    // Card 1 — dark crimson tint
    topBg:  "bg-gradient-to-br from-slate-900 via-red-950 to-slate-900",
    accent: "border-l-4 border-l-red-500",
    border: "border-red-900/60",
    ring:   "hover:ring-red-500/30",
    pill:   "bg-red-900/50 text-red-300 border border-red-700/60",
    btn:    "bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-red-300",
    glow:   "hover:shadow-red-950/80",
    dot:    "bg-red-400",
  },
  {
    // Card 2 — dark navy/blue tint
    topBg:  "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900",
    accent: "border-l-4 border-l-blue-500",
    border: "border-blue-900/60",
    ring:   "hover:ring-blue-500/30",
    pill:   "bg-blue-900/50 text-blue-300 border border-blue-700/60",
    btn:    "bg-blue-500/20 hover:bg-blue-500/35 border border-blue-500/40 text-blue-300",
    glow:   "hover:shadow-blue-950/80",
    dot:    "bg-blue-400",
  },
  {
    // Card 3 — dark amber/gold tint
    topBg:  "bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900",
    accent: "border-l-4 border-l-amber-400",
    border: "border-amber-900/60",
    ring:   "hover:ring-amber-400/30",
    pill:   "bg-amber-900/50 text-amber-300 border border-amber-700/60",
    btn:    "bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-300",
    glow:   "hover:shadow-amber-950/80",
    dot:    "bg-amber-400",
  },
  {
    // Card 4 — dark teal/emerald tint
    topBg:  "bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900",
    accent: "border-l-4 border-l-teal-400",
    border: "border-teal-900/60",
    ring:   "hover:ring-teal-400/30",
    pill:   "bg-teal-900/50 text-teal-300 border border-teal-700/60",
    btn:    "bg-teal-500/20 hover:bg-teal-500/35 border border-teal-500/40 text-teal-300",
    glow:   "hover:shadow-teal-950/80",
    dot:    "bg-teal-400",
  },
];

// Explicit local logos from /public/images/corporation/
const LOCAL_LOGOS: Record<string, string> = {
  "Oracle":                       "/images/corporation/oracle.png",
  "Linux Professional Institute": "/images/corporation/linux.png",
};

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  const orgs = Array.from(new Set(certifications.map((c) => c.issuingOrg)));

  return (
    <section id="certifications" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Custom heading (dark-aware, explicit white) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          {/* Icon badge */}
          <div className="mb-4 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5">
              <GraduationCap className="size-4 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                Certifications
              </span>
            </div>
          </div>

          {/* Title — always white */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            My{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Credentials
            </span>
          </h2>

          {/* Animated underline — gold/purple */}
          <div className="mt-4 flex justify-center">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 100 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="h-1 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-purple-500"
            />
          </div>

          {/* Subtitle — always light */}
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            Professional certifications and credentials I have earned.
          </p>
        </motion.div>

        {/* Stats pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 flex flex-wrap gap-3"
        >
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
            🏅 {certifications.length} Certifications
          </span>
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-slate-300">
            <Building2 className="size-3.5" />
            {orgs.length} Organizations
          </span>
          <span className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-medium text-emerald-400">
            <ShieldCheck className="size-3.5" />
            All Verified
          </span>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, index) => {
            const pal = CARD_PALETTE[index % CARD_PALETTE.length];
            const logoSrc = LOCAL_LOGOS[cert.issuingOrg] ?? null;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="h-full"
              >
                <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${pal.border} ${pal.accent} bg-slate-900 ring-1 ring-transparent transition-all duration-300 hover:shadow-2xl ${pal.glow} ${pal.ring} backdrop-blur-sm`}>

                  {/* ── Top banner — dark with subtle color tint ── */}
                  <div className={`relative ${pal.topBg} px-5 pb-6 pt-5`}>
                    {/* Subtle light streak */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_60%)]" />

                    {/* Verified tick */}
                    <div className="absolute right-3 top-3 z-10">
                      <BadgeCheck className="size-5 text-white/70 drop-shadow" />
                    </div>

                    {/* Logo — white rounded square */}
                    <div className="relative z-10">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-lg ring-2 ring-white/20">
                        {logoSrc ? (
                          <Image
                            src={logoSrc}
                            alt={cert.issuingOrg}
                            width={48}
                            height={48}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Award className="size-8 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Org pill */}
                    <span className={`mb-3 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${pal.pill}`}>
                      <span className={`size-1.5 rounded-full ${pal.dot}`} />
                      {cert.issuingOrg}
                    </span>

                    {/* ── Cert name — PROMINENT ── */}
                    <h3 className="mb-4 flex-1 text-base font-extrabold leading-snug tracking-tight text-white drop-shadow-sm">
                      {cert.name}
                    </h3>

                    {/* Date box */}
                    <div className="mb-4 space-y-2 rounded-xl bg-black/30 p-3">
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
                        <ShieldCheck className="size-3.5 shrink-0 text-emerald-400" />
                        <span className="font-semibold text-emerald-400">
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

                    {/* CTA */}
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-auto flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${pal.btn}`}
                      >
                        <ExternalLink className="size-3.5" />
                        View Credential
                      </a>
                    ) : (
                      <div className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-black/20 px-3 py-2.5 text-xs text-slate-500">
                        <BadgeCheck className="size-3.5 text-emerald-500" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

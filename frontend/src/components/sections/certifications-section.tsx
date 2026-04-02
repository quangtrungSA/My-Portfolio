"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Award, ExternalLink, Calendar, ShieldCheck, BadgeCheck, Building2 } from "lucide-react";
import { format } from "date-fns";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Certification } from "@/types";

interface CertificationsSectionProps {
  certifications: Certification[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

// Per-org color config
const ORG_CONFIG: Record<string, {
  topBg: string;       // card top banner background
  border: string;      // card border
  ring: string;        // hover ring
  orgPill: string;     // org name pill
  btnBg: string;       // CTA button background
  btnText: string;     // CTA button text
  iconBg: string;      // logo circle background
  glow: string;        // hover shadow color
}> = {
  Oracle: {
    topBg:    "bg-gradient-to-br from-red-700 via-red-800 to-rose-900",
    border:   "border-red-700/40",
    ring:     "hover:ring-red-500/30",
    orgPill:  "bg-red-900/60 text-red-300 border border-red-700/50",
    btnBg:    "bg-red-700/30 hover:bg-red-700/50 border border-red-600/40",
    btnText:  "text-red-300",
    iconBg:   "bg-white",
    glow:     "hover:shadow-red-900/50",
  },
  "Linux Professional Institute": {
    topBg:    "bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-900",
    border:   "border-amber-600/40",
    ring:     "hover:ring-amber-500/30",
    orgPill:  "bg-amber-900/60 text-amber-300 border border-amber-700/50",
    btnBg:    "bg-amber-700/30 hover:bg-amber-700/50 border border-amber-600/40",
    btnText:  "text-amber-300",
    iconBg:   "bg-white",
    glow:     "hover:shadow-amber-900/50",
  },
};

const DEFAULT_CONFIG = {
  topBg:    "bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900",
  border:   "border-violet-600/40",
  ring:     "hover:ring-violet-500/30",
  orgPill:  "bg-violet-900/60 text-violet-300 border border-violet-700/50",
  btnBg:    "bg-violet-700/30 hover:bg-violet-700/50 border border-violet-600/40",
  btnText:  "text-violet-300",
  iconBg:   "bg-white",
  glow:     "hover:shadow-violet-900/50",
};

function getConfig(org: string) {
  return ORG_CONFIG[org] ?? DEFAULT_CONFIG;
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  const orgs = Array.from(new Set(certifications.map((c) => c.issuingOrg)));

  return (
    <section id="certifications" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Certifications"
          subtitle="Professional certifications and credentials I have earned."
        />

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
            const cfg = getConfig(cert.issuingOrg);
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
                <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${cfg.border} bg-slate-800/80 ring-1 ring-transparent transition-all duration-300 hover:shadow-2xl ${cfg.glow} ${cfg.ring} backdrop-blur-sm`}>

                  {/* ── Colored top banner ── */}
                  <div className={`relative ${cfg.topBg} px-5 pb-5 pt-5`}>
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_50%,rgba(255,255,255,0.04)_100%)]" />

                    {/* Verified tick */}
                    <div className="absolute right-3 top-3">
                      <BadgeCheck className="size-5 text-white/80 drop-shadow" />
                    </div>

                    {/* Logo circle */}
                    <div className="relative flex justify-start">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${cfg.iconBg} p-2 shadow-lg ring-2 ring-white/30`}>
                        {cert.badgeUrl ? (
                          <Image
                            src={cert.badgeUrl}
                            alt={cert.issuingOrg}
                            width={48}
                            height={48}
                            className="h-full w-full object-contain"
                            unoptimized
                          />
                        ) : (
                          <Award className="size-8 text-slate-700" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Org pill */}
                    <span className={`mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${cfg.orgPill}`}>
                      {cert.issuingOrg}
                    </span>

                    {/* Cert name */}
                    <h3 className="mb-4 flex-1 text-sm font-semibold leading-snug text-slate-100">
                      {cert.name}
                    </h3>

                    {/* Dates */}
                    <div className="mb-4 space-y-2 rounded-xl bg-slate-900/50 p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="size-3.5 shrink-0 text-slate-500" />
                        <span>Issued <span className="font-medium text-slate-300">{formatDate(cert.issueDate)}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
                        <span className="font-medium text-emerald-400">
                          {cert.expiryDate ? `Expires ${formatDate(cert.expiryDate)}` : "No Expiry"}
                        </span>
                      </div>
                      {cert.credentialId && (
                        <div className="truncate pt-0.5 text-[10px] text-slate-600">
                          ID: <span className="text-slate-500">{cert.credentialId}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-auto flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${cfg.btnBg} ${cfg.btnText}`}
                      >
                        <ExternalLink className="size-3.5" />
                        View Credential
                      </a>
                    ) : (
                      <div className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/40 px-3 py-2.5 text-xs text-slate-500">
                        <BadgeCheck className="size-3.5 text-emerald-600" />
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

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

// Each card gets a UNIQUE color so all 4 look visually distinct
const CARD_PALETTE = [
  {
    topBg:   "bg-gradient-to-br from-red-500 via-red-600 to-rose-700",
    border:  "border-red-500/50",
    ring:    "hover:ring-red-400/40",
    pill:    "bg-red-950/70 text-red-300 border border-red-600/50",
    btn:     "bg-red-600/25 hover:bg-red-600/45 border border-red-500/50 text-red-300",
    glow:    "hover:shadow-red-900/60",
    shimmer: "from-red-400/10",
  },
  {
    topBg:   "bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700",
    border:  "border-blue-500/50",
    ring:    "hover:ring-blue-400/40",
    pill:    "bg-blue-950/70 text-blue-300 border border-blue-600/50",
    btn:     "bg-blue-600/25 hover:bg-blue-600/45 border border-blue-500/50 text-blue-300",
    glow:    "hover:shadow-blue-900/60",
    shimmer: "from-blue-400/10",
  },
  {
    topBg:   "bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-600",
    border:  "border-amber-500/50",
    ring:    "hover:ring-amber-400/40",
    pill:    "bg-amber-950/70 text-amber-300 border border-amber-600/50",
    btn:     "bg-amber-600/25 hover:bg-amber-600/45 border border-amber-500/50 text-amber-300",
    glow:    "hover:shadow-amber-900/60",
    shimmer: "from-amber-400/10",
  },
  {
    topBg:   "bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700",
    border:  "border-teal-500/50",
    ring:    "hover:ring-teal-400/40",
    pill:    "bg-teal-950/70 text-teal-300 border border-teal-600/50",
    btn:     "bg-teal-600/25 hover:bg-teal-600/45 border border-teal-500/50 text-teal-300",
    glow:    "hover:shadow-teal-900/60",
    shimmer: "from-teal-400/10",
  },
];

// Map org name → local logo path
function getLocalLogo(org: string): string | null {
  const map: Record<string, string> = {
    "Oracle":                      "/images/corporation/oracle.png",
    "Linux Professional Institute": "/images/corporation/linux.png",
  };
  return map[org] ?? null;
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

        {/* Cards — each gets a unique color from CARD_PALETTE */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, index) => {
            const pal = CARD_PALETTE[index % CARD_PALETTE.length];
            const localLogo = getLocalLogo(cert.issuingOrg);

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
                <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${pal.border} bg-slate-800/90 ring-1 ring-transparent transition-all duration-300 hover:shadow-2xl ${pal.glow} ${pal.ring} backdrop-blur-sm`}>

                  {/* ── Colored top banner ── */}
                  <div className={`relative ${pal.topBg} px-5 pb-6 pt-5`}>
                    {/* Diagonal shimmer */}
                    <div className={`absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,transparent_55%,rgba(255,255,255,0.05)_100%)]`} />

                    {/* Verified tick top-right */}
                    <div className="absolute right-3 top-3 z-10">
                      <BadgeCheck className="size-5 text-white/90 drop-shadow" />
                    </div>

                    {/* Logo on white circle */}
                    <div className="relative z-10 flex justify-start">
                      <div className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-xl ring-2 ring-white/40">
                        {localLogo ? (
                          <Image
                            src={localLogo}
                            alt={cert.issuingOrg}
                            width={52}
                            height={52}
                            className="h-full w-full object-contain"
                          />
                        ) : cert.badgeUrl ? (
                          <Image
                            src={cert.badgeUrl}
                            alt={cert.issuingOrg}
                            width={52}
                            height={52}
                            className="h-full w-full object-contain"
                            unoptimized
                          />
                        ) : (
                          <Award className="size-8 text-slate-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Org pill */}
                    <span className={`mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${pal.pill}`}>
                      {cert.issuingOrg}
                    </span>

                    {/* Cert name — white, bold, readable */}
                    <h3 className="mb-4 flex-1 text-sm font-bold leading-snug text-white">
                      {cert.name}
                    </h3>

                    {/* Date box */}
                    <div className="mb-4 space-y-2 rounded-xl bg-slate-900/60 p-3">
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
                      <div className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/40 px-3 py-2.5 text-xs text-slate-500">
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

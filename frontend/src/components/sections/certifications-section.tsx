"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Award, ExternalLink, Calendar, ShieldCheck, BadgeCheck } from "lucide-react";
import { format } from "date-fns";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Certification } from "@/types";

interface CertificationsSectionProps {
  certifications: Certification[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

// Color theme per issuing org
const ORG_THEME: Record<string, { border: string; glow: string; badge: string; text: string; bg: string }> = {
  Oracle: {
    border: "border-red-500/30",
    glow: "hover:shadow-red-500/20",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    text: "text-red-400",
    bg: "from-red-500/10 to-transparent",
  },
  "Linux Professional Institute": {
    border: "border-yellow-500/30",
    glow: "hover:shadow-yellow-500/20",
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    text: "text-yellow-400",
    bg: "from-yellow-500/10 to-transparent",
  },
};

const DEFAULT_THEME = {
  border: "border-purple-500/30",
  glow: "hover:shadow-purple-500/20",
  badge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  text: "text-purple-400",
  bg: "from-purple-500/10 to-transparent",
};

function getTheme(org: string) {
  return ORG_THEME[org] ?? DEFAULT_THEME;
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

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
        >
          <span className="font-semibold text-white">
            {certifications.length} Certifications
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{orgs.length} Issuing Organizations</span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="size-3.5" />
            All Verified
          </span>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, index) => {
            const theme = getTheme(cert.issuingOrg);
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${theme.border} bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:shadow-xl ${theme.glow}`}
                >
                  {/* Top glow gradient */}
                  <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${theme.bg} opacity-60`} />

                  {/* Verified badge */}
                  <div className="absolute right-3 top-3 z-10">
                    <BadgeCheck className={`size-5 ${theme.text}`} />
                  </div>

                  {/* Badge / Logo */}
                  <div className="relative flex items-center justify-center px-6 pb-2 pt-8">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      {cert.badgeUrl ? (
                        <Image
                          src={cert.badgeUrl}
                          alt={cert.issuingOrg}
                          width={80}
                          height={80}
                          className="h-full w-full object-contain drop-shadow-lg"
                          unoptimized
                        />
                      ) : (
                        <div className={`flex h-full w-full items-center justify-center rounded-2xl border ${theme.border} bg-white/5`}>
                          <Award className={`size-8 ${theme.text}`} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative flex flex-1 flex-col px-5 pb-5 pt-3">
                    {/* Org badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${theme.badge}`}>
                        {cert.issuingOrg}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="mb-3 flex-1 text-sm font-semibold leading-snug text-white">
                      {cert.name}
                    </h3>

                    {/* Dates */}
                    <div className="mb-4 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="size-3 shrink-0" />
                        <span>Issued {formatDate(cert.issueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="size-3 shrink-0 text-emerald-500" />
                        <span className="text-xs text-emerald-400">
                          {cert.expiryDate
                            ? `Expires ${formatDate(cert.expiryDate)}`
                            : "No Expiry"}
                        </span>
                      </div>
                    </div>

                    {/* Credential ID */}
                    {cert.credentialId && (
                      <p className="mb-4 truncate text-[10px] text-slate-600">
                        ID: {cert.credentialId}
                      </p>
                    )}

                    {/* CTA */}
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-auto flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${theme.border} ${theme.text} hover:bg-white/10`}
                      >
                        <ExternalLink className="size-3" />
                        View Credential
                      </a>
                    ) : (
                      <div className="mt-auto flex items-center justify-center gap-1.5 rounded-xl border border-white/5 px-3 py-2 text-xs text-slate-600">
                        <BadgeCheck className="size-3" />
                        Verified Credential
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

"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, UserCircle } from "lucide-react";
import type { Profile } from "@/types";

interface AboutSectionProps {
  profile: Profile;
}

// Priority order for social links display
const SOCIAL_ORDER = ["github", "linkedin", "leetcode", "facebook", "instagram", "dailydev", "reddit", "twitter", "website", "email"];

// Social icons with authentic brand colors - subtle by default, brand color on hover
const socialConfig: Record<string, { icon: React.ReactNode; label: string; hoverBg: string; hoverText: string; iconColor: string }> = {
  github: {
    label: "GitHub",
    iconColor: "text-[#181717] dark:text-white",
    hoverBg: "hover:bg-[#181717] dark:hover:bg-[#333]",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    iconColor: "text-[#0A66C2]",
    hoverBg: "hover:bg-[#0A66C2]",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  leetcode: {
    label: "LeetCode",
    iconColor: "text-[#FFA116]",
    hoverBg: "hover:bg-[#FFA116]",
    hoverText: "hover:text-black",
    icon: (
      <svg className="size-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
      </svg>
    ),
  },
  facebook: {
    label: "Facebook",
    iconColor: "text-[#1877F2]",
    hoverBg: "hover:bg-[#1877F2]",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    iconColor: "text-[#E4405F]",
    hoverBg: "hover:bg-gradient-to-tr hover:from-[#FFDC80] hover:via-[#F56040] hover:via-[#C13584] hover:to-[#833AB4]",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-9.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/>
      </svg>
    ),
  },
  dailydev: {
    label: "Daily.dev",
    iconColor: "text-slate-800 dark:text-white",
    hoverBg: "hover:bg-[#1a1a1a]",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" viewBox="0 0 24 24" fill="none">
        <path d="M4.5 5.5L11.5 12L4.5 18.5V5.5Z" fill="currentColor" className="text-slate-700 dark:text-white"/>
        <path d="M12.5 5.5L19.5 12L12.5 18.5V5.5Z" fill="currentColor" className="text-slate-400 dark:text-slate-500"/>
      </svg>
    ),
  },
  reddit: {
    label: "Reddit",
    iconColor: "text-[#FF4500]",
    hoverBg: "hover:bg-[#FF4500]",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    ),
  },
  twitter: {
    label: "Twitter/X",
    iconColor: "text-[#000000] dark:text-white",
    hoverBg: "hover:bg-[#000000]",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  email: {
    label: "Email",
    iconColor: "text-emerald-600 dark:text-emerald-500",
    hoverBg: "hover:bg-emerald-600",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  website: {
    label: "Website",
    iconColor: "text-blue-600 dark:text-blue-500",
    hoverBg: "hover:bg-blue-600",
    hoverText: "hover:text-white",
    icon: (
      <svg className="size-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
};

// Helper function to get sorted social links from individual profile fields
function getSortedSocialLinks(profile: Profile) {
  const socialLinks: Array<[string, string]> = [];
  
  // Map individual fields to social link entries
  if (profile.githubUrl) socialLinks.push(["github", profile.githubUrl]);
  if (profile.linkedinUrl) socialLinks.push(["linkedin", profile.linkedinUrl]);
  if (profile.leetcodeUrl) socialLinks.push(["leetcode", profile.leetcodeUrl]);
  if (profile.facebookUrl) socialLinks.push(["facebook", profile.facebookUrl]);
  if (profile.instagramUrl) socialLinks.push(["instagram", profile.instagramUrl]);
  if (profile.dailydevUrl) socialLinks.push(["dailydev", profile.dailydevUrl]);
  if (profile.redditUrl) socialLinks.push(["reddit", profile.redditUrl]);
  if (profile.twitterUrl) socialLinks.push(["twitter", profile.twitterUrl]);
  if (profile.websiteUrl) socialLinks.push(["website", profile.websiteUrl]);
  
  // Sort by priority order
  return socialLinks.sort((a, b) => {
    const indexA = SOCIAL_ORDER.indexOf(a[0]);
    const indexB = SOCIAL_ORDER.indexOf(b[0]);
    const orderA = indexA === -1 ? 999 : indexA;
    const orderB = indexB === -1 ? 999 : indexB;
    return orderA - orderB;
  });
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header - matching projects/certifications style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          {/* Icon badge */}
          <motion.div
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-violet-400/30 dark:border-violet-500/20 bg-violet-100/50 dark:bg-violet-500/5 px-4 py-1.5">
              <UserCircle className="size-4 text-violet-600 dark:text-violet-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400/70">
                Introduction
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 dark:from-violet-300 dark:via-purple-400 dark:to-violet-300 bg-clip-text text-transparent">
              About
            </span>{" "}
            <span className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 dark:from-slate-300 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
              Me
            </span>
          </h2>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 90 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-violet-500/60 via-purple-500/40 to-violet-500/60"
          />

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Get to know a little more about who I am and what I do.
          </motion.p>
        </motion.div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border-2 border-violet-500/20 dark:border-violet-400/10 shadow-xl">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    width={400}
                    height={400}
                    className="aspect-square object-cover"
                    unoptimized={profile.avatarUrl.startsWith('/images')}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex aspect-square w-[400px] items-center justify-center bg-slate-100 dark:bg-slate-800 text-6xl font-bold text-slate-400 dark:text-slate-500">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bio + Social */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Name - prominent styling with different color from title */}
            <motion.h3 
              className="text-3xl sm:text-4xl font-black tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}
            >
              <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
                {profile.name}
              </span>
            </motion.h3>
            
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              {profile.title}
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              {profile.bio}
            </p>

            {/* Career Journey & International Clients — loaded from DB */}
            {(profile.careerSummary || profile.internationalClients) && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-4">
                {profile.careerSummary && (
                  <>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-teal-500 text-white text-xs">🚀</span>
                      Career Journey
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {profile.careerSummary}
                    </p>
                  </>
                )}
                {profile.internationalClients && (() => {
                  try {
                    const clients: Array<{ name: string; country: string; flag: string; url?: string; company?: string; description?: string }> =
                      typeof profile.internationalClients === "string"
                        ? JSON.parse(profile.internationalClients)
                        : profile.internationalClients;
                    if (!Array.isArray(clients) || clients.length === 0) return null;
                    return (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2">
                          International Clients
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {clients.map((client) => {
                            const inner = (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-base leading-none">{client.flag}</span>
                                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                    {client.name}
                                    {client.url && <span className="ml-1 text-cyan-500">↗</span>}
                                  </span>
                                </div>
                                {(client.company || client.description) && (
                                  <div className="mt-1 ml-7 space-y-0.5">
                                    {client.company && (
                                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        via {client.company}
                                      </p>
                                    )}
                                    {client.description && (
                                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                        {client.description}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </>
                            );
                            return client.url ? (
                              <a
                                key={client.name}
                                href={client.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg border border-slate-200 dark:border-slate-600/50 bg-white dark:bg-slate-700/40 px-3 py-2 transition-colors hover:border-cyan-400 dark:hover:border-cyan-500/50"
                              >
                                {inner}
                              </a>
                            ) : (
                              <div
                                key={client.name}
                                className="rounded-lg border border-slate-200 dark:border-slate-600/50 bg-white dark:bg-slate-700/40 px-3 py-2"
                              >
                                {inner}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
            )}

            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                <MapPin className="size-4 text-teal-500 dark:text-teal-400/60" />
                <span>{profile.location}</span>
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-4 relative z-10">
              {getSortedSocialLinks(profile).map(([key, url]) => {
                const config = socialConfig[key.toLowerCase()];
                if (!config) return null;
                const href = url.startsWith("http") ? url : `https://${url}`;
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={config.label}
                    title={config.label}
                    style={{ zIndex: 50 }}
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${config.iconColor} shadow-sm transition-colors duration-200 cursor-pointer select-none ${config.hoverBg} ${config.hoverText}`}
                  >
                    {config.icon}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

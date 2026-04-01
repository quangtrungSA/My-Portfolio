"use client";

import { motion } from "motion/react";
import { ArrowDown, Download, MapPin, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types";

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* === ANIMATED BACKGROUND LAYERS === */}

      {/* Base dark gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 dark:from-black dark:via-slate-950 dark:to-indigo-950" />

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(at_20%_80%,rgba(59,130,246,0.3)_0%,transparent_50%),radial-gradient(at_80%_20%,rgba(139,92,246,0.25)_0%,transparent_50%),radial-gradient(at_50%_50%,rgba(236,72,153,0.15)_0%,transparent_60%)]" />

      {/* Animated floating orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute -z-10 left-[10%] top-[20%] h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        className="absolute -z-10 right-[15%] top-[30%] h-80 w-80 rounded-full bg-purple-500/20 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
        className="absolute -z-10 left-[30%] bottom-[20%] h-64 w-64 rounded-full bg-pink-500/15 blur-[100px]"
      />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Dot pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      {/* Top gradient fade for header blend */}
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/30 to-transparent" />

      {/* Animated particles / stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3 + i * 0.5,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
          className="absolute -z-10 h-1 w-1 rounded-full bg-white/60"
          style={{
            left: `${15 + i * 17}%`,
            top: `${20 + (i * 13) % 60}%`,
          }}
        />
      ))}

      {/* === CONTENT === */}
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          {profile.availableForHire && (
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
          )}
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {profile.name}
          </span>
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 text-xl font-medium text-blue-200/80 sm:text-2xl"
        >
          {profile.title}
        </motion.p>

        {/* Tagline */}
        {profile.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-3 flex items-center justify-center gap-2 text-base text-slate-400 sm:text-lg"
          >
            <Sparkles className="size-4 text-yellow-400" />
            {profile.tagline}
          </motion.p>
        )}

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400"
        >
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-blue-400" />
              {profile.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Award className="size-3.5 text-yellow-400" />
            8 International Certificates
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-purple-400" />
            4+ Years Experience
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={() => handleScrollTo("#projects")}
            className="group gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/40"
          >
            View My Work
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleScrollTo("#contact")}
            className="gap-2 border-slate-600 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
          >
            Get in Touch
          </Button>
          {profile.resumeUrl && (
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-slate-600 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              render={
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <Download className="size-4" />
              Resume
            </Button>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-500">Scroll down</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-slate-600 p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-1.5 w-1.5 rounded-full bg-blue-400"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

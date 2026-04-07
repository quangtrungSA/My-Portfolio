"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  Music2,
  Music,
  Heart,
  Star,
  Clock,
  BookOpen,
  Video,
  Mic2,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

const timeline = [
  {
    year: "2016",
    title: "First Keys",
    description:
      "Picked up piano self-taught, learning basic scales and simple melodies on a digital keyboard. Music became a peaceful escape from coding.",
    icon: Music,
    color: "from-blue-500 to-cyan-500",
  },
  {
    year: "2018",
    title: "Classical Foundation",
    description:
      "Began studying classical pieces — Bach Inventions, Für Elise, and Mozart Sonatas. Developed finger independence and music-reading skills.",
    icon: BookOpen,
    color: "from-indigo-500 to-blue-500",
  },
  {
    year: "2020",
    title: "Exploring Genres",
    description:
      "Expanded into jazz chords, pop arrangements, and film scores. Discovered that improvisation shares a creative mindset with programming.",
    icon: Heart,
    color: "from-purple-500 to-indigo-500",
  },
  {
    year: "2022",
    title: "Romantic Era Deep Dive",
    description:
      "Fell in love with Chopin Nocturnes and Debussy Impressionism. Started recording practice sessions to track progress.",
    icon: Star,
    color: "from-violet-500 to-purple-500",
  },
  {
    year: "2024",
    title: "Current Chapter",
    description:
      "Practicing 30–45 minutes daily. Working on Clair de Lune (Debussy) and La Campanella (Liszt). Piano keeps me grounded outside of tech.",
    icon: Mic2,
    color: "from-pink-500 to-violet-500",
  },
];

const favorites = [
  {
    title: "Clair de Lune",
    composer: "Claude Debussy",
    level: "Advanced",
    status: "In Progress",
    note: "The flowing arpeggios remind me of cascading async calls 🌊",
  },
  {
    title: "Nocturne Op. 9 No. 2",
    composer: "Frédéric Chopin",
    level: "Intermediate",
    status: "Learned",
    note: "My go-to piece to unwind after a long sprint",
  },
  {
    title: "Gymnopédie No. 1",
    composer: "Erik Satie",
    level: "Beginner–Intermediate",
    status: "Learned",
    note: "Simple but profoundly meditative — less is more",
  },
  {
    title: "River Flows in You",
    composer: "Yiruma",
    level: "Intermediate",
    status: "Learned",
    note: "The piece that got me seriously into piano",
  },
  {
    title: "Prelude in C Major",
    composer: "J.S. Bach",
    level: "Beginner–Intermediate",
    status: "Learned",
    note: "Pure structure and beauty — Bach is the architect of music",
  },
  {
    title: "La Campanella",
    composer: "Franz Liszt",
    level: "Advanced",
    status: "Working On",
    note: "My white whale — technically brutal but so rewarding",
  },
];

const composers = [
  { name: "Chopin", emoji: "🎹", tag: "Romantic" },
  { name: "Debussy", emoji: "🌊", tag: "Impressionist" },
  { name: "Bach", emoji: "🏛️", tag: "Baroque" },
  { name: "Satie", emoji: "☁️", tag: "Minimalist" },
  { name: "Liszt", emoji: "🔥", tag: "Romantic" },
  { name: "Yiruma", emoji: "💫", tag: "Contemporary" },
  { name: "Joe Hisaishi", emoji: "🌸", tag: "Film Score" },
  { name: "Hans Zimmer", emoji: "🎬", tag: "Film Score" },
];

const stats = [
  { label: "Years Playing", value: "8+", icon: Clock },
  { label: "Pieces Learned", value: "20+", icon: Music2 },
  { label: "Daily Practice", value: "~45 min", icon: Heart },
  { label: "Favourite Era", value: "Romantic", icon: Star },
];

const statusColor: Record<string, string> = {
  Learned: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "In Progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Working On": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function PianoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Header />

      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-pink-600/8 blur-3xl"
          animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        />
      </div>

      <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30">
              <Music2 className="size-10 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Piano{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Journey
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
            Where code meets keys. Playing piano is my creative counterbalance to
            software engineering — a space to feel, not just think.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
              >
                <Icon className="mx-auto mb-2 size-5 text-indigo-400" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Timeline */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl"
          >
            The{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Story So Far
            </span>
          </motion.h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent sm:left-1/2" />

            <div className="space-y-8">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                const isRight = i % 2 === 0;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: isRight ? -24 : 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative flex items-start gap-6 sm:gap-0 ${
                      isRight ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <div
                      className={`ml-20 sm:ml-0 sm:w-[calc(50%-3rem)] ${
                        isRight ? "sm:pr-12 sm:text-right" : "sm:pl-12"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                      >
                        <span className="mb-1 block text-xs font-semibold text-indigo-400">
                          {item.year}
                        </span>
                        <h3 className="mb-2 font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>

                    {/* Icon dot — centred on the line */}
                    <div
                      className={`absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${item.color} shadow-lg sm:left-1/2 sm:-translate-x-1/2`}
                    >
                      <Icon className="size-4 text-white" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Favourite pieces */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl"
          >
            Favourite{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pieces
            </span>
          </motion.h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((piece, i) => (
              <motion.div
                key={piece.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-indigo-500/30 hover:bg-white/8"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {piece.title}
                    </h3>
                    <p className="text-xs text-slate-400">{piece.composer}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor[piece.status]}`}
                  >
                    {piece.status}
                  </span>
                </div>
                <p className="mb-3 text-xs text-slate-500 italic leading-relaxed">
                  &ldquo;{piece.note}&rdquo;
                </p>
                <Badge
                  variant="outline"
                  className="border-white/10 text-xs text-slate-400"
                >
                  {piece.level}
                </Badge>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Favourite composers */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl"
          >
            Composers I{" "}
            <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Love
            </span>
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-3">
            {composers.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <span>{c.emoji}</span>
                <span className="font-medium text-slate-200">{c.name}</span>
                <span className="text-xs text-slate-500">{c.tag}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why piano section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 p-8 text-center backdrop-blur-sm sm:p-12"
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
              <Heart className="size-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Why Piano Matters To Me
          </h2>
          <p className="mx-auto max-w-2xl text-slate-300 leading-relaxed">
            Programming and piano share a beautiful paradox — both reward
            precision and creativity in equal measure. When I&apos;m debugging a
            gnarly issue at work, sitting at the piano resets my thinking. There
            are no stack traces in music, only flow. It&apos;s the one place where
            &ldquo;good enough&rdquo; feels just right, and perfection is always a
            practice session away.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Stress Relief", "Creative Outlet", "Mindfulness", "Discipline", "Pure Joy"].map(
              (tag) => (
                <Badge
                  key={tag}
                  className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                  variant="outline"
                >
                  {tag}
                </Badge>
              )
            )}
          </div>
        </motion.section>

        {/* YouTube / recordings placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-dashed border-white/10 bg-white/3 p-8 text-center"
        >
          <Video className="mx-auto mb-3 size-8 text-slate-500" />
          <p className="text-slate-400 text-sm">
            Recordings &amp; covers coming soon — stay tuned 🎹
          </p>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
}

const categoryColors: Record<string, { gradient: string; glow: string; border: string; text: string }> = {
  Backend:        { gradient: "from-blue-500 to-cyan-400",    glow: "shadow-blue-500/20",   border: "border-blue-500/30",   text: "text-blue-400" },
  Frontend:       { gradient: "from-purple-500 to-pink-400",  glow: "shadow-purple-500/20", border: "border-purple-500/30", text: "text-purple-400" },
  Database:       { gradient: "from-amber-500 to-orange-400", glow: "shadow-amber-500/20",  border: "border-amber-500/30",  text: "text-amber-400" },
  Infrastructure: { gradient: "from-emerald-500 to-teal-400", glow: "shadow-emerald-500/20",border: "border-emerald-500/30",text: "text-emerald-400" },
  Tools:          { gradient: "from-rose-500 to-red-400",     glow: "shadow-rose-500/20",   border: "border-rose-500/30",   text: "text-rose-400" },
};

const defaultColor = { gradient: "from-slate-500 to-slate-400", glow: "shadow-slate-500/20", border: "border-slate-500/30", text: "text-slate-400" };

function SkillCard({ skill, index, color }: { skill: Skill; index: number; color: typeof defaultColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`group relative overflow-hidden rounded-xl border ${color.border} bg-white/[0.03] p-4 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:${color.glow} hover:shadow-lg`}
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${color.gradient} opacity-0 blur-xl transition-opacity group-hover:opacity-10`} />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{skill.name}</h3>
          <span className={`text-xs font-bold ${color.text}`}>
            {skill.proficiencyLevel}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.proficiencyLevel}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.04 + 0.2, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${color.gradient}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = useMemo(() => {
    const map = new Map<string, Skill[]>();
    skills.forEach((skill) => {
      const cat = skill.category || "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(skill);
    });
    return Array.from(map.entries());
  }, [skills]);

  const [activeCategory, setActiveCategory] = useState(categories[0]?.[0] || "");

  if (categories.length === 0) return null;

  const activeSkills = categories.find(([c]) => c === activeCategory)?.[1] || [];
  const activeColor = categoryColors[activeCategory] || defaultColor;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Skills & Technologies
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-3 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {categories.map(([category, catSkills]) => {
            const color = categoryColors[category] || defaultColor;
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${color.gradient} text-white shadow-lg ${color.glow}`
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
                <span className={`ml-1.5 text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}>
                  {catSkills.length}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {activeSkills.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={index}
                color={activeColor}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-white">{skills.length}</div>
            <div className="text-xs text-slate-500">Technologies</div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <div className="text-2xl font-bold text-white">{categories.length}</div>
            <div className="text-xs text-slate-500">Categories</div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <div className="text-2xl font-bold text-white">4+</div>
            <div className="text-xs text-slate-500">Years Experience</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group transition-shadow hover:shadow-md">
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {skill.icon && (
                <span className="text-xl">{skill.icon}</span>
              )}
              <span className="text-sm font-medium">{skill.name}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {skill.proficiencyLevel}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.proficiencyLevel}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
            />
          </div>
        </CardContent>
      </Card>
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

  if (categories.length === 0) return null;

  const defaultCategory = categories[0][0];

  return (
    <section id="skills" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="The tools and technologies I use to bring ideas to life."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue={defaultCategory} className="w-full">
            <div className="mb-8 flex justify-center">
              <TabsList className="flex-wrap">
                {categories.map(([category]) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map(([category, categorySkills]) => (
              <TabsContent key={category} value={category}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categorySkills.map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} index={index} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}

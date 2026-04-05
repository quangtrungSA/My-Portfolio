"use client";

import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Education } from "@/types";

interface EducationSectionProps {
  education: Education[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
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
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 dark:border-emerald-500/20 bg-emerald-100/50 dark:bg-emerald-500/5 px-4 py-1.5">
              <GraduationCap className="size-4 text-emerald-600 dark:text-emerald-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400/70">
                Academic Background
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-300 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">My</span>{" "}
            <span className="text-slate-700 dark:text-slate-200">Education</span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 90 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-emerald-500/60 via-teal-500/40 to-emerald-500/60"
          />
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            My academic background and qualifications
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">
                        {edu.degree} in {edu.field}
                      </CardTitle>
                      <p className="mt-1 text-sm font-medium text-primary">
                        {edu.institution}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(edu.startDate)} &mdash;{" "}
                        {edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {edu.description && (
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {edu.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

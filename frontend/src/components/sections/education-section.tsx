"use client";

import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Education"
          subtitle="My academic background and qualifications."
        />

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

"use client";

import { motion } from "motion/react";
import { Briefcase } from "lucide-react";
import { format } from "date-fns";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Experience } from "@/types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

function TimelineItem({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-10 pb-10 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border last:hidden" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 flex size-8 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm">
        <Briefcase className="size-3.5 text-primary" />
      </div>

      {/* Content */}
      <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold">{experience.position}</h3>
          <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
            {formatDate(experience.startDate)} &mdash;{" "}
            {experience.endDate ? formatDate(experience.endDate) : "Present"}
          </span>
        </div>
        <p className="mb-3 text-sm font-medium text-primary">
          {experience.company}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {experience.description}
        </p>
      </div>
    </motion.div>
  );
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey and career highlights."
        />

        <div className="relative">
          {experiences.map((exp, index) => (
            <TimelineItem key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

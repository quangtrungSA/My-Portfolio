"use client";

import { motion } from "motion/react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12 text-center"
    >
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 flex justify-center">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-1 rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/50"
        />
      </div>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

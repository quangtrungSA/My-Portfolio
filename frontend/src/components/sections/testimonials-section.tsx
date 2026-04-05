"use client";

import { motion } from "motion/react";
import { Quote, Star, MessageSquareQuote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center gap-2 rounded-full border border-violet-400/30 dark:border-violet-500/20 bg-violet-100/50 dark:bg-violet-500/5 px-4 py-1.5">
              <MessageSquareQuote className="size-4 text-violet-600 dark:text-violet-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400/70">
                Kind Words
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 dark:from-violet-300 dark:via-purple-400 dark:to-violet-300 bg-clip-text text-transparent">Client</span>{" "}
            <span className="text-slate-700 dark:text-slate-200">Testimonials</span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 90 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-violet-500/60 via-purple-500/40 to-violet-500/60"
          />
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            What others have to say about working with me
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex h-full flex-col pt-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Quote className="size-8 shrink-0 text-primary/20" />
                    <StarRating rating={testimonial.rating} />
                  </div>

                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {testimonial.content}
                  </p>

                  <div className="flex items-center gap-3 border-t pt-4">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={testimonial.authorAvatar}
                        alt={testimonial.authorName}
                      />
                      <AvatarFallback>
                        {getInitials(testimonial.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {testimonial.authorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.authorTitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

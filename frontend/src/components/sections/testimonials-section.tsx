"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/shared/section-heading";
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
        <SectionHeading
          title="Testimonials"
          subtitle="What others have to say about working with me."
        />

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

"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, Code2, Users, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Profile } from "@/types";

interface AboutSectionProps {
  profile: Profile;
}

const socialIcons: Record<string, React.ElementType> = {
  github: Code2,
  linkedin: Users,
  twitter: Globe,
  website: Globe,
  email: Mail,
};

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About Me"
          subtitle="Get to know a little more about who I am and what I do."
        />

        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border-2 border-primary/10 shadow-xl">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    width={400}
                    height={400}
                    className="aspect-square object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-[400px] items-center justify-center bg-muted text-6xl font-bold text-muted-foreground">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bio + Social */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold">{profile.name}</h3>
            <p className="text-lg text-muted-foreground">{profile.title}</p>
            <p className="leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>

            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>{profile.location}</span>
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(profile.socialLinks || {}).map(([key, url]) => {
                const Icon = socialIcons[key];
                if (!Icon || !url) return null;
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="icon"
                    render={
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={key}
                      />
                    }
                  >
                    <Icon className="size-4" />
                  </Button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

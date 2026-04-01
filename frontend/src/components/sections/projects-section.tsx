"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ExternalLink, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className={`flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg ${
          project.featured
            ? "ring-2 ring-primary/30 shadow-primary/10"
            : ""
        }`}
      >
        {/* Project Image */}
        {project.imageUrl && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {project.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 text-primary-foreground">
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1">{project.title}</CardTitle>
            {!project.imageUrl && project.featured && (
              <Badge className="shrink-0 bg-primary/90 text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          {project.githubUrl && (
            <Button
              variant="outline"
              size="sm"
              render={
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <Code2 className="mr-1.5 size-3.5" />
              Code
            </Button>
          )}
          {project.liveUrl && (
            <Button
              size="sm"
              render={
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLink className="mr-1.5 size-3.5" />
              Live Demo
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Show featured projects first
  const sorted = [...projects].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  return (
    <section id="projects" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Projects"
          subtitle="A selection of projects I've worked on. Featured projects are highlighted."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

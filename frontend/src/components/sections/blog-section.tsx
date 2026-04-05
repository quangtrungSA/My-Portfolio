"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types";
import { STATIC_BLOG_POSTS } from "@/lib/blog-data";

interface BlogSectionProps {
  posts: BlogPost[];
}

function estimateReadTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

export function BlogSection({ posts }: BlogSectionProps) {
  const allPosts = posts.length > 0 ? posts : STATIC_BLOG_POSTS;
  const latestPosts = allPosts.slice(0, 3);

  return (
    <section id="blog" className="bg-muted/30 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <motion.div
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-sky-400/30 dark:border-sky-500/20 bg-sky-100/50 dark:bg-sky-500/5 px-4 py-1.5">
              <Newspaper className="size-4 text-sky-600 dark:text-sky-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400/70">
                Blog
              </span>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-slate-700 dark:text-slate-200">Latest</span>{" "}
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-600 dark:from-sky-300 dark:via-cyan-400 dark:to-sky-300 bg-clip-text text-transparent">Blog Posts</span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 90 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-sky-500/60 via-cyan-500/40 to-sky-500/60"
          />
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Thoughts, tutorials, and insights from my journey in software engineering
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-blue-500/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-full text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="mb-2 line-clamp-2 flex-none text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3" />
                        <time dateTime={post.createdAt}>
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </time>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3" />
                        {estimateReadTime(post.content)} min read
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="group gap-2"
            render={<Link href="/blog" />}
          >
            View All Articles
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

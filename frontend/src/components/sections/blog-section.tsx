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
    <section id="blog" className="relative bg-muted/30 py-14 sm:py-20 overflow-hidden">
      {/* Moving grid */}
      <motion.div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{backgroundImage:"linear-gradient(rgba(251,146,60,1) 1px,transparent 1px),linear-gradient(90deg,rgba(251,146,60,1) 1px,transparent 1px)",backgroundSize:"48px 48px"}}
        animate={{backgroundPosition:["0px 0px","48px 48px"]}} transition={{repeat:Infinity,duration:10,ease:"linear"}} />
      {/* Orbs */}
      <motion.div animate={{x:[0,50,0],y:[0,-35,0],scale:[1,1.25,1]}} transition={{repeat:Infinity,duration:18,ease:"easeInOut"}}
        className="pointer-events-none absolute -z-10 left-[-6%] top-[5%] h-96 w-96 rounded-full bg-orange-500/10 blur-[110px]" />
      <motion.div animate={{x:[0,-40,0],y:[0,40,0],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:22,ease:"easeInOut",delay:4}}
        className="pointer-events-none absolute -z-10 right-[-6%] bottom-[5%] h-80 w-80 rounded-full bg-amber-500/10 blur-[100px]" />
      <motion.div animate={{scale:[1,1.3,1],opacity:[0.3,0.6,0.3]}} transition={{repeat:Infinity,duration:10,ease:"easeInOut",delay:6}}
        className="pointer-events-none absolute -z-10 left-[45%] top-[30%] h-56 w-56 rounded-full bg-yellow-500/7 blur-[80px]" />
      {/* Edge travellers */}
      {[...Array(3)].map((_,i)=>(
        <motion.div key={`te-${i}`} className="pointer-events-none absolute z-0 top-0 h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"
          animate={{left:["-8%","108%"]}} transition={{repeat:Infinity,duration:6+i*1.5,delay:i*2,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`be-${i}`} className="pointer-events-none absolute z-0 bottom-0 h-[2px] w-20 rounded-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
          animate={{left:["108%","-8%"]}} transition={{repeat:Infinity,duration:8+i*2,delay:i*3,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`le-${i}`} className="pointer-events-none absolute z-0 left-0 w-[2px] h-16 rounded-full bg-gradient-to-b from-transparent via-orange-400/40 to-transparent"
          animate={{top:["-10%","110%"]}} transition={{repeat:Infinity,duration:7+i*1.5,delay:i*2,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`re-${i}`} className="pointer-events-none absolute z-0 right-0 w-[2px] h-16 rounded-full bg-gradient-to-b from-transparent via-amber-400/40 to-transparent"
          animate={{top:["110%","-10%"]}} transition={{repeat:Infinity,duration:8+i*1.5,delay:i*2.5,ease:"linear"}} />
      ))}
      {/* Corner glows */}
      <motion.div animate={{opacity:[0.3,0.7,0.3],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:4}}
        className="pointer-events-none absolute -z-10 top-0 left-0 h-36 w-36 rounded-br-full bg-orange-500/8 blur-[40px]" />
      <motion.div animate={{opacity:[0.3,0.7,0.3],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:5,delay:1.5}}
        className="pointer-events-none absolute -z-10 top-0 right-0 h-36 w-36 rounded-bl-full bg-amber-500/8 blur-[40px]" />
      <motion.div animate={{opacity:[0.3,0.7,0.3],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:4.5,delay:2.5}}
        className="pointer-events-none absolute -z-10 bottom-0 left-0 h-36 w-36 rounded-tr-full bg-yellow-500/8 blur-[40px]" />
      <motion.div animate={{opacity:[0.3,0.7,0.3],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:6,delay:0.8}}
        className="pointer-events-none absolute -z-10 bottom-0 right-0 h-36 w-36 rounded-tl-full bg-orange-400/8 blur-[40px]" />
      {/* Twinkling — amber theme */}
      {[{l:"1%",t:"14%",s:7,d:1.8,dl:0},{l:"2%",t:"48%",s:5,d:2.1,dl:0.5},{l:"1%",t:"78%",s:7,d:1.6,dl:0.9},{l:"96%",t:"20%",s:8,d:1.9,dl:0.3},{l:"97%",t:"55%",s:5,d:2.0,dl:0.7},{l:"96%",t:"82%",s:6,d:1.7,dl:0.2},{l:"40%",t:"1%",s:6,d:2.2,dl:0.6},{l:"62%",t:"98%",s:5,d:1.9,dl:0.8}].map((s,i)=>(
        <motion.div key={i} className="pointer-events-none absolute z-10 rounded-full bg-orange-300"
          style={{left:s.l,top:s.t,width:s.s,height:s.s,boxShadow:`0 0 ${s.s*2}px ${s.s}px rgba(251,146,60,0.3)`}}
          animate={{opacity:[0.2,0.7,0.2],scale:[0.8,1.2,0.8]}}
          transition={{repeat:Infinity,duration:s.d,delay:s.dl,ease:"easeInOut"}} />
      ))}
      {[{l:"2%",t:"30%",dl:0.3},{l:"96%",t:"38%",dl:1.0},{l:"1%",t:"62%",dl:0.7},{l:"97%",t:"68%",dl:0.5},{l:"28%",t:"1%",dl:1.2},{l:"72%",t:"98%",dl:0.8}].map((c,i)=>(
        <motion.div key={i} className="pointer-events-none absolute z-10" style={{left:c.l,top:c.t}}
          animate={{opacity:[0,0.5,0],scale:[0.7,1.1,0.7]}}
          transition={{repeat:Infinity,duration:2.4+i*0.3,delay:c.dl,ease:"easeInOut"}}>
          <svg width="12" height="12" viewBox="0 0 12 12"><line x1="6" y1="0" x2="6" y2="12" stroke="rgba(251,146,60,0.7)" strokeWidth="1.5" strokeLinecap="round"/><line x1="0" y1="6" x2="12" y2="6" stroke="rgba(251,146,60,0.7)" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </motion.div>
      ))}
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

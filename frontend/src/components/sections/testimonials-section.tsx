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
    <section id="testimonials" className="relative py-14 sm:py-20 overflow-hidden">
      {/* Aurora waves */}
      <motion.div animate={{x:[0,70,0],y:[0,-25,0],scale:[1,1.35,1],opacity:[0.3,0.65,0.3]}} transition={{repeat:Infinity,duration:10,ease:"easeInOut"}}
        className="pointer-events-none absolute -z-10 left-[-10%] top-[0%] h-96 w-[65%] rounded-full bg-gradient-to-r from-rose-500/12 to-purple-500/10 blur-[110px]" />
      <motion.div animate={{x:[0,-55,0],y:[0,35,0],scale:[1,1.25,1],opacity:[0.3,0.65,0.3]}} transition={{repeat:Infinity,duration:13,ease:"easeInOut",delay:3}}
        className="pointer-events-none absolute -z-10 right-[-10%] bottom-[0%] h-80 w-[55%] rounded-full bg-gradient-to-l from-pink-500/12 to-violet-500/10 blur-[100px]" />
      <motion.div animate={{scale:[1,1.4,1],opacity:[0.2,0.5,0.2]}} transition={{repeat:Infinity,duration:9,ease:"easeInOut",delay:5}}
        className="pointer-events-none absolute -z-10 left-[40%] top-[40%] h-56 w-56 rounded-full bg-rose-400/8 blur-[70px]" />
      {/* Edge travellers */}
      {[...Array(3)].map((_,i)=>(
        <motion.div key={`te-${i}`} className="pointer-events-none absolute z-0 top-0 h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-rose-400/50 to-transparent"
          animate={{left:["-8%","108%"]}} transition={{repeat:Infinity,duration:6+i*1.5,delay:i*2,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`be-${i}`} className="pointer-events-none absolute z-0 bottom-0 h-[2px] w-20 rounded-full bg-gradient-to-r from-transparent via-pink-400/40 to-transparent"
          animate={{left:["108%","-8%"]}} transition={{repeat:Infinity,duration:8+i*2,delay:i*3,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`le-${i}`} className="pointer-events-none absolute z-0 left-0 w-[2px] h-16 rounded-full bg-gradient-to-b from-transparent via-rose-400/40 to-transparent"
          animate={{top:["-10%","110%"]}} transition={{repeat:Infinity,duration:7+i*1.5,delay:i*2,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`re-${i}`} className="pointer-events-none absolute z-0 right-0 w-[2px] h-16 rounded-full bg-gradient-to-b from-transparent via-violet-400/40 to-transparent"
          animate={{top:["110%","-10%"]}} transition={{repeat:Infinity,duration:8+i*1.5,delay:i*2.5,ease:"linear"}} />
      ))}
      {/* Corner glows */}
      <motion.div animate={{opacity:[0.3,0.7,0.3],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:4}}
        className="pointer-events-none absolute -z-10 top-0 left-0 h-36 w-36 rounded-br-full bg-rose-500/8 blur-[40px]" />
      <motion.div animate={{opacity:[0.3,0.7,0.3],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:5,delay:1.5}}
        className="pointer-events-none absolute -z-10 top-0 right-0 h-36 w-36 rounded-bl-full bg-purple-500/8 blur-[40px]" />
      <motion.div animate={{opacity:[0.3,0.7,0.3],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:4.5,delay:2.5}}
        className="pointer-events-none absolute -z-10 bottom-0 left-0 h-36 w-36 rounded-tr-full bg-pink-500/8 blur-[40px]" />
      <motion.div animate={{opacity:[0.3,0.7,0.3],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:6,delay:0.8}}
        className="pointer-events-none absolute -z-10 bottom-0 right-0 h-36 w-36 rounded-tl-full bg-violet-500/8 blur-[40px]" />
      {/* Floating quote marks */}
      {[{l:"3%",t:"15%",s:24,dl:0},{l:"5%",t:"60%",s:18,dl:1.2},{l:"92%",t:"10%",s:20,dl:0.6},{l:"90%",t:"65%",s:22,dl:0.9},{l:"45%",t:"1%",s:18,dl:1.5},{l:"55%",t:"96%",s:20,dl:0.3}].map((q,i)=>(
        <motion.div key={i} className="pointer-events-none absolute z-10 font-serif font-bold text-rose-400/20"
          style={{left:q.l,top:q.t,fontSize:q.s}}
          animate={{opacity:[0.05,0.3,0.05],y:[0,-8,0],scale:[0.9,1.1,0.9]}}
          transition={{repeat:Infinity,duration:3+i*0.4,delay:q.dl,ease:"easeInOut"}}>
          &ldquo;
        </motion.div>
      ))}
      {/* Twinkling dots — rose theme */}
      {[{l:"1%",t:"12%",s:6,d:1.8,dl:0},{l:"2%",t:"42%",s:7,d:2.0,dl:0.5},{l:"1%",t:"72%",s:5,d:1.6,dl:0.9},{l:"96%",t:"18%",s:7,d:1.9,dl:0.3},{l:"97%",t:"52%",s:5,d:2.1,dl:0.7},{l:"96%",t:"80%",s:6,d:1.7,dl:0.2},{l:"35%",t:"1%",s:5,d:2.2,dl:0.6},{l:"65%",t:"98%",s:6,d:1.8,dl:1.0}].map((s,i)=>(
        <motion.div key={i} className="pointer-events-none absolute z-10 rounded-full bg-rose-300"
          style={{left:s.l,top:s.t,width:s.s,height:s.s,boxShadow:`0 0 ${s.s*2}px ${s.s}px rgba(251,113,133,0.3)`}}
          animate={{opacity:[0.2,0.7,0.2],scale:[0.8,1.2,0.8]}}
          transition={{repeat:Infinity,duration:s.d,delay:s.dl,ease:"easeInOut"}} />
      ))}
      {[{l:"2%",t:"28%",dl:0.4},{l:"96%",t:"35%",dl:1.0},{l:"1%",t:"58%",dl:0.7},{l:"97%",t:"68%",dl:0.5}].map((c,i)=>(
        <motion.div key={i} className="pointer-events-none absolute z-10" style={{left:c.l,top:c.t}}
          animate={{opacity:[0,0.5,0],scale:[0.7,1.1,0.7]}}
          transition={{repeat:Infinity,duration:2.4+i*0.3,delay:c.dl,ease:"easeInOut"}}>
          <svg width="12" height="12" viewBox="0 0 12 12"><line x1="6" y1="0" x2="6" y2="12" stroke="rgba(251,113,133,0.7)" strokeWidth="1.5" strokeLinecap="round"/><line x1="0" y1="6" x2="12" y2="6" stroke="rgba(251,113,133,0.7)" strokeWidth="1.5" strokeLinecap="round"/></svg>
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
                    {testimonial.authorAvatar?.includes("/company/") ? (
                      <div className="flex h-10 w-auto max-w-[100px] flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white px-1.5">
                        <img
                          src={testimonial.authorAvatar}
                          alt={testimonial.authorName}
                          className="h-auto max-h-[28px] w-auto max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <Avatar className="size-10">
                        <AvatarImage
                          src={testimonial.authorAvatar}
                          alt={testimonial.authorName}
                        />
                        <AvatarFallback>
                          {getInitials(testimonial.authorName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
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

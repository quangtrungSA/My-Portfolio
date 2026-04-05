"use client";

import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Education } from "@/types";

interface EducationSectionProps {
  education: Education[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Diamond grid */}
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='%2310b981' stroke-width='1'/%3E%3C/svg%3E\")", backgroundSize: "40px 40px" }} />
      {/* Orbs */}
      <motion.div animate={{x:[0,40,0],y:[0,-30,0],scale:[1,1.25,1]}} transition={{repeat:Infinity,duration:16,ease:"easeInOut"}}
        className="pointer-events-none absolute -z-10 left-[-6%] top-[5%] h-96 w-96 rounded-full bg-emerald-500/10 blur-[110px]" />
      <motion.div animate={{x:[0,-35,0],y:[0,40,0],scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:20,ease:"easeInOut",delay:4}}
        className="pointer-events-none absolute -z-10 right-[-6%] bottom-[5%] h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />
      <motion.div animate={{scale:[1,1.3,1],opacity:[0.3,0.6,0.3],x:[0,25,0]}} transition={{repeat:Infinity,duration:12,ease:"easeInOut",delay:6}}
        className="pointer-events-none absolute -z-10 left-[40%] top-[30%] h-56 w-56 rounded-full bg-green-500/7 blur-[80px]" />
      {/* Edge travellers */}
      {[...Array(3)].map((_,i)=>(
        <motion.div key={`te-${i}`} className="pointer-events-none absolute z-0 top-0 h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
          animate={{left:["-8%","108%"]}} transition={{repeat:Infinity,duration:6+i*1.5,delay:i*2,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`be-${i}`} className="pointer-events-none absolute z-0 bottom-0 h-[2px] w-20 rounded-full bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"
          animate={{left:["108%","-8%"]}} transition={{repeat:Infinity,duration:8+i*2,delay:i*3,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`le-${i}`} className="pointer-events-none absolute z-0 left-0 w-[2px] h-16 rounded-full bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent"
          animate={{top:["-10%","110%"]}} transition={{repeat:Infinity,duration:7+i*1.5,delay:i*2,ease:"linear"}} />
      ))}
      {[...Array(2)].map((_,i)=>(
        <motion.div key={`re-${i}`} className="pointer-events-none absolute z-0 right-0 w-[2px] h-16 rounded-full bg-gradient-to-b from-transparent via-teal-400/40 to-transparent"
          animate={{top:["110%","-10%"]}} transition={{repeat:Infinity,duration:8+i*1.5,delay:i*2.5,ease:"linear"}} />
      ))}
      {/* Corner glows */}
      <motion.div animate={{opacity:[0.3,0.7,0.3]}} transition={{repeat:Infinity,duration:4}}
        className="pointer-events-none absolute -z-10 top-0 left-0 h-36 w-36 rounded-br-full bg-emerald-500/8 blur-[40px]" />
      <motion.div animate={{opacity:[0.3,0.7,0.3]}} transition={{repeat:Infinity,duration:5,delay:1.5}}
        className="pointer-events-none absolute -z-10 bottom-0 right-0 h-36 w-36 rounded-tl-full bg-teal-500/8 blur-[40px]" />
      {/* Floating diamonds */}
      {[{l:"5%",t:"20%",s:10,d:3.0,dl:0},{l:"8%",t:"60%",s:8,d:3.5,dl:1},{l:"92%",t:"15%",s:10,d:2.8,dl:0.5},{l:"90%",t:"65%",s:8,d:3.2,dl:1.5},{l:"45%",t:"2%",s:8,d:3.0,dl:0.8},{l:"55%",t:"96%",s:10,d:2.5,dl:1.2}].map((d,i)=>(
        <motion.div key={i} className="pointer-events-none absolute z-10"
          style={{left:d.l,top:d.t,width:d.s,height:d.s}}
          animate={{opacity:[0.1,0.6,0.1],rotate:[0,45,90,135,180],scale:[0.8,1.2,0.8]}}
          transition={{repeat:Infinity,duration:d.d,delay:d.dl,ease:"easeInOut"}}>
          <svg width={d.s} height={d.s} viewBox="0 0 10 10"><path d="M5 0 L10 5 L5 10 L0 5 Z" fill="none" stroke="rgba(52,211,153,0.7)" strokeWidth="1.2"/></svg>
        </motion.div>
      ))}
      {/* Twinkling dots */}
      {[{l:"1%",t:"18%",s:6,d:1.9,dl:0},{l:"2%",t:"50%",s:7,d:2.1,dl:0.5},{l:"1%",t:"80%",s:5,d:1.7,dl:0.9},{l:"96%",t:"22%",s:7,d:2.0,dl:0.3},{l:"97%",t:"55%",s:5,d:1.8,dl:0.7},{l:"96%",t:"85%",s:6,d:2.2,dl:0.2}].map((s,i)=>(
        <motion.div key={i} className="pointer-events-none absolute z-10 rounded-full bg-emerald-300"
          style={{left:s.l,top:s.t,width:s.s,height:s.s,boxShadow:`0 0 ${s.s*2}px ${s.s}px rgba(52,211,153,0.3)`}}
          animate={{opacity:[0.2,0.7,0.2],scale:[0.8,1.2,0.8]}}
          transition={{repeat:Infinity,duration:s.d,delay:s.dl,ease:"easeInOut"}} />
      ))}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 dark:border-emerald-500/20 bg-emerald-100/50 dark:bg-emerald-500/5 px-4 py-1.5">
              <GraduationCap className="size-4 text-emerald-600 dark:text-emerald-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400/70">
                Academic Background
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-300 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">My</span>{" "}
            <span className="text-slate-700 dark:text-slate-200">Education</span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 90 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-emerald-500/60 via-teal-500/40 to-emerald-500/60"
          />
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            My academic background and qualifications
          </motion.p>
        </motion.div>

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
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white border border-slate-200 dark:border-slate-700 shadow-sm">
                      {edu.logoUrl ? (
                        <Image
                          src={edu.logoUrl}
                          alt={edu.institution}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                          unoptimized
                        />
                      ) : (
                        <GraduationCap className="size-5 text-primary" />
                      )}
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

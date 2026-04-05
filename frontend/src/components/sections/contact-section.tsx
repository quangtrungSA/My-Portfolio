"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Send,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  SendHorizonal,
  CheckCircle2,
  ArrowUpRight,
  AlertCircle,
  User,
  FileText,
  Sparkles,
} from "lucide-react";

import { toast } from "sonner";
import type { Profile } from "@/types";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
// ---------------------------------------------------------------------------
// Schema & constants
// ---------------------------------------------------------------------------

const MAX_MESSAGE_LENGTH = 1000;

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(
      MAX_MESSAGE_LENGTH,
      `Message must be at most ${MAX_MESSAGE_LENGTH} characters`
    ),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// Quick-topic chips (let user pre-fill subject)
// ---------------------------------------------------------------------------

const QUICK_TOPICS = [
  { label: "💼 Job Opportunity", subject: "Job Opportunity" },
  { label: "🤝 Freelance Project", subject: "Freelance Project Inquiry" },
  { label: "💡 Collaboration", subject: "Collaboration Idea" },
  { label: "👋 Just Saying Hi", subject: "Hello!" },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ---------------------------------------------------------------------------
// Animated field error
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1 text-[11px] text-red-400 overflow-hidden"
        >
          <AlertCircle className="size-3 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Shared input class builder
// ---------------------------------------------------------------------------

function inputClass(hasError: boolean, hasSuccess: boolean) {
  const base =
    "w-full rounded-lg border bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:bg-white/[0.05]";
  if (hasError)
    return `${base} border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20`;
  if (hasSuccess)
    return `${base} border-emerald-500/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20`;
  return `${base} border-white/[0.08] focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ContactSectionProps {
  profile: Profile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const CONTACT_INFO = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email || "trungly.dev@gmail.com",
      href: `mailto:${profile.email || "trungly.dev@gmail.com"}`,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      hoverBg: "hover:bg-blue-500/20",
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile.location || "Ho Chi Minh City, Vietnam",
      href: null,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      hoverBg: "hover:bg-emerald-500/20",
    },
    {
      icon: GithubIcon,
      label: "GitHub",
      value: "github.com/quangtrungSA",
      href: "https://github.com/quangtrungSA",
      color: "text-white",
      bg: "bg-white/5 border-white/10",
      hoverBg: "hover:bg-white/10",
    },
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      value: "linkedin.com/in/quangtrungsadev",
      href: "https://www.linkedin.com/in/quangtrungsadev",
      color: "text-[#0A66C2]",
      bg: "bg-[#0A66C2]/10 border-[#0A66C2]/20",
      hoverBg: "hover:bg-[#0A66C2]/20",
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const messageValue = watch("message") ?? "";

  // Pre-fill subject from quick topic
  const selectTopic = useCallback(
    (subject: string) => {
      setValue("subject", subject, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue]
  );

  const isFieldValid = (field: keyof ContactFormData): boolean =>
    Boolean(touchedFields[field] && dirtyFields[field] && !errors[field]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("Failed to send message. Please try again later.");
        return;
      }

      toast.success("Message sent successfully! I'll get back to you soon.");
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Character counter helpers
  const charPercent = messageValue.length / MAX_MESSAGE_LENGTH;
  const charColor =
    charPercent > 1
      ? "text-red-400 font-medium"
      : charPercent > 0.9
        ? "text-amber-400"
        : "text-slate-600";

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── Heading ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <motion.div
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5">
              <SendHorizonal className="size-4 text-blue-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400/70">
                Contact
              </span>
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-white">Get In</span>{" "}
            <span className="bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 90 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-blue-500/60 via-cyan-500/40 to-blue-500/60"
          />
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Have a question or want to work together? Drop me a message and
            I&apos;ll get back to you as soon as possible.
          </motion.p>
        </motion.div>

        {/* ─── Two-column layout ─── */}
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
          {/* ── Left: Contact Info ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            {/* Intro card */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <MessageSquare className="size-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Let&apos;s Build Something Great
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                I&apos;m always interested in hearing about new projects and
                opportunities. Whether you have a question or just want to say
                hi, feel free to reach out!
              </p>
            </motion.div>

            {/* Contact info cards */}
            {CONTACT_INFO.map((info) => (
              <motion.div key={info.label} variants={itemVariants}>
                {info.href ? (
                  <a
                    href={info.href}
                    target={
                      info.href.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${info.bg} transition-colors ${info.hoverBg}`}
                    >
                      <info.icon className={`size-4.5 ${info.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                        {info.label}
                      </p>
                      <p className="truncate text-sm font-medium text-slate-200">
                        {info.value}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 text-slate-600 transition-all group-hover:text-slate-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${info.bg}`}
                    >
                      <info.icon className={`size-4.5 ${info.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                        {info.label}
                      </p>
                      <p className="truncate text-sm font-medium text-slate-200">
                        {info.value}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Availability badge */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3"
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-emerald-400/80">
                Available for freelance work
              </span>
            </motion.div>
          </motion.div>

          {/* ── Right: Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              {/* Decorative gradient bar */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

              <div className="p-6 sm:p-8">
                {/* Form header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                    <Send className="size-4.5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Send a Message
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fill out the form and I&apos;ll respond ASAP
                    </p>
                  </div>
                </div>

                {/* Quick-topic chips */}
                <div className="mb-6">
                  <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    <Sparkles className="size-3" />
                    Quick Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_TOPICS.map((topic) => (
                      <button
                        key={topic.subject}
                        type="button"
                        onClick={() => selectTopic(topic.subject)}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        <User className="size-3" />
                        Name
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          placeholder="Your name"
                          autoComplete="name"
                          aria-invalid={!!errors.name}
                          className={inputClass(
                            !!errors.name,
                            isFieldValid("name")
                          )}
                          {...register("name")}
                        />
                        <AnimatePresence>
                          {isFieldValid("name") && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <CheckCircle2 className="size-4 text-emerald-400" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <FieldError message={errors.name?.message} />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        <Mail className="size-3" />
                        Email
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          className={inputClass(
                            !!errors.email,
                            isFieldValid("email")
                          )}
                          {...register("email")}
                        />
                        <AnimatePresence>
                          {isFieldValid("email") && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <CheckCircle2 className="size-4 text-emerald-400" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <FieldError message={errors.email?.message} />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400"
                    >
                      <FileText className="size-3" />
                      Subject
                    </label>
                    <div className="relative">
                      <input
                        id="subject"
                        placeholder="What's this about?"
                        aria-invalid={!!errors.subject}
                        className={inputClass(
                          !!errors.subject,
                          isFieldValid("subject")
                        )}
                        {...register("subject")}
                      />
                      <AnimatePresence>
                        {isFieldValid("subject") && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <CheckCircle2 className="size-4 text-emerald-400" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <FieldError message={errors.subject?.message} />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="message"
                        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        <MessageSquare className="size-3" />
                        Message
                      </label>
                      <span
                        className={`text-[11px] tabular-nums transition-colors ${charColor}`}
                      >
                        {messageValue.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                    <textarea
                      id="message"
                      placeholder="Tell me about your project, idea, or just say hello..."
                      rows={5}
                      aria-invalid={!!errors.message}
                      className={`resize-y ${inputClass(
                        !!errors.message,
                        isFieldValid("message")
                      )}`}
                      {...register("message")}
                    />
                    {/* Character limit progress bar */}
                    <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                      <motion.div
                        className={`h-full rounded-full ${
                          charPercent > 1
                            ? "bg-red-500"
                            : charPercent > 0.9
                              ? "bg-amber-500"
                              : "bg-blue-500/50"
                        }`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(charPercent * 100, 100)}%`,
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <FieldError message={errors.message?.message} />
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || submitted}
                    whileHover={
                      !isSubmitting && !submitted ? { scale: 1.01 } : {}
                    }
                    whileTap={
                      !isSubmitting && !submitted ? { scale: 0.98 } : {}
                    }
                    className={`group flex w-full items-center justify-center gap-2.5 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
                      submitted
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 disabled:opacity-60"
                    }`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isSubmitting ? (
                        <motion.span
                          key="submitting"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="size-4 animate-spin" />
                          Sending...
                        </motion.span>
                      ) : submitted ? (
                        <motion.span
                          key="submitted"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="size-4" />
                          Message Sent!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2"
                        >
                          <Send className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          Send Message
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Privacy note */}
                  <p className="text-center text-[11px] text-slate-600">
                    🔒 Your information is safe. I&apos;ll only use it to
                    respond to your message.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

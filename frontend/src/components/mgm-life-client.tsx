"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Globe,
  BookOpen,
  PartyPopper,
  Users,
  MapPin,
  Mic2,
  Coffee,
  Heart,
  Zap,
  Award,
  Languages,
  Play,
  Laptop,
  Trophy,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import type { MgmLifeItem } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// URL helpers
// ─────────────────────────────────────────────────────────────────────────────

// ─── URL helpers ─────────────────────────────────────────────────────────────

function isGcsUrl(url: string): boolean {
  return url?.includes("storage.googleapis.com") || url?.includes("storage.cloud.google.com");
}

function isGcsVideo(url: string): boolean {
  return isGcsUrl(url) && /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url);
}

function extractDriveId(url: string): string | null {
  if (!url) return null;
  const idParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParam) return idParam[1];
  const filePath = url.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/);
  if (filePath) return filePath[1];
  return null;
}

/** Normalize image URL — GCS served directly, Drive → lh3 thumbnail */
export function normalizeDriveUrl(url: string): string {
  if (!url) return url;
  if (isGcsUrl(url)) return url;
  const id = extractDriveId(url);
  if (id) return `https://lh3.googleusercontent.com/d/${id}=w1600`;
  return url;
}

function driveFullUrl(url: string): string {
  if (!url) return url;
  if (isGcsUrl(url)) return url;
  const id = extractDriveId(url);
  if (id) return `https://lh3.googleusercontent.com/d/${id}=w4000`;
  return url;
}

export function driveVideoEmbedUrl(url: string): string {
  if (!url) return url;
  if (isGcsUrl(url)) return url;
  if (url.includes("/preview")) return url;
  const id = extractDriveId(url);
  if (id) return `https://drive.google.com/file/d/${id}/preview`;
  return url;
}

/** Known video Drive IDs — used as fallback before migration 038 updates mediaType */
const KNOWN_VIDEO_DRIVE_IDS = new Set([
  "1cHKeV4QUc72gL2yT67jjIcaWlS7dt3Sa", // Instant Noodles
  "1qq58Z7xGwiaP31H5ar3lXOZaszFZKBYH", // English Outdoor
  "1ACxtxOFS9C8RvT4DYFldw4TyuBTeRPI8", // English Class
  "1GHIaIRqA13a8s9PE5BubeEKzjYoqPwAo", // Piano
  "1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU", // mgm Office
]);

/** Resolve media type — GCS video by extension, known Drive IDs, or DB value */
function resolveMediaType(item: MgmLifeItem): "IMAGE" | "VIDEO" {
  const url = item.mediaUrl ?? "";
  if (isGcsVideo(url)) return "VIDEO";
  if (item.mediaType === "VIDEO") return "VIDEO";
  const id = extractDriveId(url);
  if (id && KNOWN_VIDEO_DRIVE_IDS.has(id)) return "VIDEO";
  return "IMAGE";
}

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────────────────────────

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={onClose}
      >
        <X className="size-6" />
      </motion.button>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
        />
        <p className="mt-3 text-center text-sm text-slate-300">{alt}</p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox context hook
// ─────────────────────────────────────────────────────────────────────────────

export function useLightbox() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ src: driveFullUrl(src), alt });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const LightboxOverlay = () => (
    <AnimatePresence>
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />
      )}
    </AnimatePresence>
  );

  return { openLightbox, LightboxOverlay };
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated wrappers
// ─────────────────────────────────────────────────────────────────────────────

type FadeVariant = "up" | "down" | "left" | "right" | "blur" | "zoom" | "flip" | "bounce";

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: FadeVariant;
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: Record<FadeVariant, { initial: any; animate: any; transition: any }> = {
    up:     { initial: { opacity: 0, y: 40 },                          animate: { opacity: 1, y: 0 },              transition: { duration: 0.6, ease: "easeOut" } },
    down:   { initial: { opacity: 0, y: -40 },                         animate: { opacity: 1, y: 0 },              transition: { duration: 0.6, ease: "easeOut" } },
    left:   { initial: { opacity: 0, x: 40 },                          animate: { opacity: 1, x: 0 },              transition: { duration: 0.6, ease: "easeOut" } },
    right:  { initial: { opacity: 0, x: -40 },                         animate: { opacity: 1, x: 0 },              transition: { duration: 0.6, ease: "easeOut" } },
    blur:   { initial: { opacity: 0, filter: "blur(12px)", y: 20 },    animate: { opacity: 1, filter: "blur(0px)", y: 0 }, transition: { duration: 0.7, ease: "easeOut" } },
    zoom:   { initial: { opacity: 0, scale: 0.85 },                    animate: { opacity: 1, scale: 1 },          transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } },
    flip:   { initial: { opacity: 0, rotateX: 25, y: 30 },             animate: { opacity: 1, rotateX: 0, y: 0 }, transition: { duration: 0.65, ease: "easeOut" } },
    bounce: { initial: { opacity: 0, y: 50 },                          animate: { opacity: 1, y: 0 },              transition: { type: "spring", stiffness: 260, damping: 18 } },
  };

  const v = variants[direction];

  return (
    <motion.div
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...v.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "slideUp",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "slideUp" | "slideLeft" | "zoom" | "bounce" | "blur";
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: Record<string, any> = {
    slideUp:   { hidden: { opacity: 0, y: 30 },                        visible: { opacity: 1, y: 0 } },
    slideLeft: { hidden: { opacity: 0, x: -30 },                       visible: { opacity: 1, x: 0 } },
    zoom:      { hidden: { opacity: 0, scale: 0.8 },                   visible: { opacity: 1, scale: 1 } },
    bounce:    { hidden: { opacity: 0, y: 40 },                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 18 } } },
    blur:      { hidden: { opacity: 0, filter: "blur(8px)", y: 15 },   visible: { opacity: 1, filter: "blur(0px)", y: 0 } },
  };

  return (
    <motion.div variants={variants[variant]} className={className}>
      {children}
    </motion.div>
  );
}

export function ScaleOnHover({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lazy video — shows thumbnail until user clicks play
// ─────────────────────────────────────────────────────────────────────────────

function LazyVideo({ item }: { item: MgmLifeItem }) {
  const [open, setOpen] = useState(false);
  const gcsVideo = isGcsVideo(item.mediaUrl);
  const id = extractDriveId(item.mediaUrl);
  const embedSrc = gcsVideo ? item.mediaUrl : id ? `https://drive.google.com/file/d/${id}/preview` : item.mediaUrl;

  return (
    <>
      {/* Thumbnail — for GCS videos use a muted video as poster, for Drive use lh3 thumbnail */}
      <div className="group absolute inset-0 cursor-pointer overflow-hidden" onClick={() => setOpen(true)}>
        {gcsVideo ? (
          <video
            src={item.mediaUrl}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={id ? `https://lh3.googleusercontent.com/d/${id}=w1280` : item.mediaUrl}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-2 ring-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25 group-hover:ring-white/60">
            <Play className="size-7 translate-x-0.5 text-white drop-shadow-lg" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-0.5 text-xs text-white/70 backdrop-blur-sm">
          <Play className="size-3" /> Video
        </div>
      </div>

      {/* Popup */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute -right-3 -top-3 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20" onClick={() => setOpen(false)}>
              <X className="size-5" />
            </button>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
              {gcsVideo ? (
                <video
                  src={embedSrc}
                  className="h-full w-full"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <>
                  <iframe
                    src={embedSrc}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                  <div className="pointer-events-none absolute right-0 top-0 h-12 w-16 bg-black" />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Clickable image — click to open lightbox (no zoom overlay)
// ─────────────────────────────────────────────────────────────────────────────

export function ClickableImage({
  item,
  className,
  onOpen,
}: {
  item: MgmLifeItem;
  className?: string;
  onOpen: (src: string, alt: string) => void;
}) {
  if (resolveMediaType(item) === "VIDEO") {
    if (isGcsVideo(item.mediaUrl)) {
      return (
        <video
          src={item.mediaUrl}
          className={className ?? "h-full w-full object-cover"}
          controls
          playsInline
        />
      );
    }
    return (
      <iframe
        src={driveVideoEmbedUrl(item.mediaUrl)}
        className={className ?? "h-full w-full"}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }

  return (
    <div
      className="group/img relative h-full w-full cursor-pointer"
      onClick={() => onOpen(item.mediaUrl, item.title)}
    >
      <Image
        src={normalizeDriveUrl(item.mediaUrl)}
        alt={item.title}
        fill
        className={`${className ?? "object-cover"}`}
        unoptimized
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Full page content (client component with animations + lightbox)
// ─────────────────────────────────────────────────────────────────────────────

export function MgmLifePageContent({ items }: { items: MgmLifeItem[] }) {
  const { openLightbox, LightboxOverlay } = useLightbox();

  const englishItems = items.filter((i) => i.category === "ENGLISH_CLASS");
  const generalItems = items.filter((i) => i.category === "GENERAL");
  const happyFridayItems = items.filter((i) => i.category === "HAPPY_FRIDAY");

  const getItem = (id: string) => items.find((i) => i.id === id || i.mediaUrl?.includes(id));
  const getByTitle = (keyword: string) => items.find((i) => i.title?.includes(keyword));
  const welcomeGift  = getByTitle("Onboarding Gift") ?? getByTitle("Welcome to mgm") ?? getItem("1wigY74letDLUD-uUSeBtmMxY4Lgq_AnN");
  const speaker1     = getItem("1d61zh7zySVYgT3IVv2feCuzX38dkMOVN");
  const speaker2     = getItem("110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9");
  const office1      = getByTitle("mgm Office Da Nang") ?? getByTitle("mgm Office ") ?? getItem("1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU");
  const office2      = getByTitle("mgm Office Rooftop") ?? getItem("1PzieFriIyLxMr8Q3lxmnoOlW7hy02C80");
  const noodles      = getByTitle("Instant Noodles") ?? getByTitle("Noodles") ?? getItem("13HcKoP-xkU6zLAkVG93vzUCtdg-WT9Xk");
  const piano        = getByTitle("Piano") ?? getItem("1ZEsaj7zr0UHGTyOHBv9vKMfSWXIWJ0mi");

  const officeVideo        = getItem("84d5a768-b2c5-4876-97a2-edd4e8411263");
  const happyFridayVideo1  = getItem("00e77590-dfd8-4cb0-b90f-83a4caebfbcb");
  const happyFridayVideo2  = getItem("2c025fe8-db38-40b4-9d25-c4c377bbd8d4");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main>

        {/* ══════════════════════════════════════════════════════════════
            1. HERO — Overview mgm
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pb-28 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,92,246,0.18),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Eyebrow */}
            <FadeIn delay={0} direction="blur">
              <div className="mb-6 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
                  <Globe className="size-4" /> International Technology Company
                </span>
              </div>
            </FadeIn>

            {/* Title */}
            <FadeIn delay={0.1} direction="blur">
              <h1 className="mb-6 text-center text-6xl font-extrabold tracking-tight sm:text-7xl">
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                  mgm life
                </span>
              </h1>
            </FadeIn>

            {/* Tagline */}
            <FadeIn delay={0.2} direction="blur">
              <p className="mx-auto mb-4 max-w-3xl text-center text-xl text-slate-300 sm:text-2xl">
                <span className="font-bold text-white">mgm technology partners</span> — where German engineering meets Vietnamese talent in Da Nang.
              </p>
              <p className="mx-auto mb-14 max-w-2xl text-center text-base text-slate-400">
                Founded in 1994 in Munich, Germany. Our Vietnam office is located in the heart of Da Nang —
                where a multinational team (Germany, Vietnam, France, Austria…) builds enterprise software
                for global clients.
              </p>
            </FadeIn>

            {/* Stats */}
            <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.12}>
              {[
                { value: "1994",  label: "Founded",         icon: Award },
                { value: "10+",   label: "Global offices",  icon: Globe },
                { value: "700+",  label: "Employees",       icon: Users },
                { value: "🇩🇪🇻🇳🇫🇷🇦🇹", label: "Nationalities", icon: Heart },
              ].map(({ value, label, icon: Icon }) => (
                <StaggerItem key={label} variant="zoom">
                  <ScaleOnHover>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
                      <Icon className="mx-auto mb-2 size-5 text-slate-400" />
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="mt-1 text-xs text-slate-400">{label}</div>
                    </div>
                  </ScaleOnHover>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            2. ABOUT — Da Nang office + multinational team
        ══════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <FadeIn direction="right">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-400">
                    <MapPin className="size-3.5" /> Da Nang, Vietnam
                  </div>
                  <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
                    A global company,<br />
                    <span className="text-violet-400">right in the heart of Da Nang</span>
                  </h2>
                  <div className="space-y-4 text-slate-400">
                    <p>
                      mgm technology partners is a leading German software company specialising in
                      large-scale enterprise solutions — from retail and insurance to e-commerce,
                      including tax systems for the German government.
                      The Da Nang office bridges Vietnamese engineering talent with Europe&apos;s
                      technology ecosystem.
                    </p>
                    <p>
                      The Da Nang team works directly with colleagues in Germany on real cross-border
                      projects — not outsourcing, but{" "}
                      <span className="font-semibold text-slate-200">a genuine part of mgm worldwide</span>.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {[
                      { icon: Globe,     text: "HQ in Munich, Germany" },
                      { icon: Users,     text: "Multinational team" },
                      { icon: Zap,       text: "Real enterprise projects" },
                      { icon: Languages, text: "English-first environment" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-sm text-slate-300">
                        <Icon className="size-4 shrink-0 text-violet-400" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Office collage */}
              <FadeIn direction="left">
                <StaggerContainer className="grid grid-cols-1 gap-4">
                  {office1 && (
                    <StaggerItem key={office1.id}>
                      <div
                        className="relative overflow-hidden rounded-2xl bg-slate-800 aspect-[8/4.2] cursor-pointer"
                        onClick={() => openLightbox(office1.mediaUrl, office1.title)}
                      >
                        <Image
                          src={normalizeDriveUrl(office1.mediaUrl)}
                          alt={office1.title}
                          fill
                          className="object-cover object-top"
                          unoptimized
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-xs font-medium text-white">{office1.title}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  )}
                  {office2 && (
                    <StaggerItem key={office2.id}>
                      <div
                        className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-[16/9] cursor-pointer"
                        onClick={() => openLightbox(office2.mediaUrl, office2.title)}
                      >
                        <Image
                          src={normalizeDriveUrl(office2.mediaUrl)}
                          alt={office2.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-xs font-medium text-white">{office2.title}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  )}
                  {!office1 && !office2 && (
                    <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 text-slate-600">
                      Office photos coming soon
                    </div>
                  )}
                </StaggerContainer>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            3. WELCOME GIFT
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(251,191,36,0.07),transparent_60%)]" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Card image */}
              <FadeIn direction="zoom" className="order-2 lg:order-1">
                {welcomeGift ? (
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-800/50 shadow-2xl shadow-amber-900/20">
                    <Image
                      src={normalizeDriveUrl(welcomeGift.mediaUrl)}
                      alt={welcomeGift.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-3xl border border-dashed border-white/10 bg-slate-800" />
                )}
              </FadeIn>

              {/* Text */}
              <FadeIn direction="right" className="order-1 lg:order-2">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
                  <Heart className="size-3.5" /> Welcome Gift
                </div>
                <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
                  Welcome to the team —
                  <span className="text-amber-400"> like family from day one</span>
                </h2>
                <p className="mb-4 text-slate-400">
                  From the very first day, mgm sends every new employee a personalised welcome card —
                  signed by{" "}
                  <span className="font-semibold text-slate-200">
                    Ms. Ngo Loan, Deputy General Director
                  </span>
                  . A small gesture that says a great deal about how people are valued here.
                </p>
                <p className="text-slate-400">
                  Onboarding at mgm is not a checklist — it is an experience designed to make you
                  feel genuinely welcomed, from leadership all the way to your teammates.
                </p>
                <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <p className="text-sm italic text-slate-300">
                    &ldquo;Welcome to the mgm family, Trung. Wishing you wonderful, productive days
                    and many great memories ahead.&rdquo;
                  </p>
                  <p className="mt-3 text-xs text-amber-400">— Ngo Loan, Deputy General Director</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            4. BENEFITS
        ══════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-900 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FadeIn direction="flip">
              <div className="mb-14 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                  <Zap className="size-3.5" /> Employee Benefits
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  <span className="bg-gradient-to-r from-yellow-400 to-emerald-400 bg-clip-text text-transparent">Outstanding Benefits</span>
                </h2>
                <p className="mt-3 text-slate-400">
                  mgm invests in people — not just with salary, but with real life experiences.
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start">
              {[
                {
                  icon: Languages,
                  color: "blue",
                  title: "English Class · 2h/day",
                  desc: "New employees get 2 hours of English class daily for their first 3 months — during working hours, counted as paid time.",
                  tag: "Paid time",
                },
                {
                  icon: PartyPopper,
                  color: "amber",
                  title: "Happy Friday",
                  desc: "Every Friday, teachers and students head out together for the entire morning — breakfast, city walks, or whatever brings joy. No assignments. No deadlines.",
                  tag: "Every Friday",
                },
                {
                  icon: Mic2,
                  color: "purple",
                  title: "International Speakers",
                  desc: "International experts from Germany and across Europe regularly share technical knowledge and real-world engineering experience.",
                  tag: "Knowledge sharing",
                },
                {
                  icon: Globe,
                  color: "violet",
                  title: "Global Projects",
                  desc: "Work directly with the German team on real enterprise projects for European clients — not outsourcing, but true collaboration.",
                  tag: "Cross-border",
                },
                {
                  icon: Coffee,
                  color: "emerald",
                  title: "Relaxed Office Culture",
                  desc: "No rigid dress code. Piano in the office, a kitchen, and colleagues who actually enjoy being there. A place you look forward to each morning.",
                  tag: "Work-life balance",
                },
                {
                  icon: BookOpen,
                  color: "rose",
                  title: "Learning Culture",
                  desc: "Internal tech talks, knowledge-sharing sessions, and direct exposure to senior engineers from Germany and across Europe.",
                  tag: "Continuous learning",
                },
                {
                  icon: Laptop,
                  color: "blue",
                  title: "MacBook or ThinkPad — your choice",
                  desc: "Employees choose their own device: latest MacBook Pro/Air or Lenovo ThinkPad, paired with flagship keyboard and premium mouse.",
                  tag: "Latest hardware",
                },
                {
                  icon: Trophy,
                  color: "emerald",
                  title: "Sports Clubs",
                  desc: "Join the badminton, swimming, marathon running, or football club. mgm supports an active lifestyle — teammates who play together, stay together.",
                  tag: "Active lifestyle",
                },
              ].map(({ icon: Icon, color, title, desc, tag }) => (
                <StaggerItem key={title} variant="bounce">
                  <ScaleOnHover>
                    <div
                      className={`rounded-2xl border p-6 transition-all hover:border-${color}-500/40 border-${color}-500/20 bg-gradient-to-br from-${color}-950/30 to-slate-900`}
                    >
                      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10`}>
                        <Icon className={`size-5 text-${color}-400`} />
                      </div>
                      <h3 className="mb-2 font-semibold text-white">{title}</h3>
                      <p className="text-sm text-slate-400">{desc}</p>
                      <span className={`mt-4 inline-flex items-center rounded-full bg-${color}-500/10 px-2.5 py-0.5 text-xs font-medium text-${color}-400 ring-1 ring-${color}-500/20`}>
                        {tag}
                      </span>
                    </div>
                  </ScaleOnHover>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            5. INTERNATIONAL SPEAKERS
        ══════════════════════════════════════════════════════════════ */}
        {(speaker1 || speaker2) && (
          <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <div className="mb-12">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-400">
                    <Mic2 className="size-3.5" /> International Speakers
                  </div>
                  <h2 className="text-3xl font-bold sm:text-4xl">
                    <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">International Speakers at mgm</span>
                  </h2>
                  <p className="mt-3 max-w-xl text-slate-400">
                    Experts from Germany and across Europe regularly visit Da Nang to share
                    knowledge — from software architecture to ISO quality standards.
                  </p>
                </div>
              </FadeIn>

              <StaggerContainer className="grid gap-6 sm:grid-cols-2">
                {[speaker1, speaker2].filter(Boolean).map((item) => (
                  <StaggerItem key={item!.id} variant="blur">
                    <ScaleOnHover>
                      <div className="overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-800/50">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={driveFullUrl(item!.mediaUrl)}
                            alt={item!.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="p-5">
                          <p className="font-semibold text-white">{item!.title}</p>
                          <p className="mt-1 text-sm text-slate-400">{item!.description}</p>
                        </div>
                      </div>
                    </ScaleOnHover>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            6. OFFICE PHOTOS + VIDEO
        ══════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-950 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="mb-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-400">
                  <MapPin className="size-3.5" /> Our Office
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">mgm Da Nang Office</span>
                </h2>
                <p className="mt-3 text-slate-400">
                  An open, modern workspace — where code meets coffee and music.
                </p>
              </div>
            </FadeIn>

            {/* Video placeholder or actual video */}
            <FadeIn delay={0.1} direction="zoom">
              <div className="mb-6 overflow-hidden rounded-3xl border border-sky-500/30 bg-slate-900 shadow-2xl shadow-sky-900/20 ring-1 ring-sky-500/10">
                {officeVideo ? (
                  <div className="relative aspect-video overflow-hidden">
                    <LazyVideo item={officeVideo} />
                  </div>
                ) : (
                  <div className="relative flex aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 to-slate-900 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
                      <Play className="size-7 text-white" />
                    </div>
                    <p className="text-sm text-slate-400">Office video — coming soon</p>
                    <p className="text-xs text-slate-600">
                      Admin can add a video at /admin/mgm-life
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            7. ENGLISH CLASS BENEFIT (with video)
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(59,130,246,0.1),transparent_60%)]" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                  <Languages className="size-3.5" /> Language Benefit
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">English Class — A Rare Benefit</span>
                </h2>
                <p className="mt-3 text-slate-400">
                  New employees receive 2 hours of English class every day during their first 3 months —
                  counted as fully paid working hours. A head start that very few companies offer.
                </p>
              </div>
            </FadeIn>

            {/* Photos grid */}
            <StaggerContainer className="grid grid-cols-2 gap-4">
              {englishItems.filter((i) => resolveMediaType(i) === "IMAGE").slice(0, 4).map((item) => (
                <StaggerItem key={item.id}>
                  <div className="relative overflow-hidden rounded-2xl bg-slate-800 aspect-video">
                    <ClickableImage item={item} className="object-cover" onOpen={openLightbox} />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Info strip */}
            <StaggerContainer className="mt-6 grid grid-cols-3 gap-4">
              {[
                { value: "2h", label: "Every day" },
                { value: "3mo", label: "For new employees" },
                { value: "100%", label: "Paid time" },
              ].map(({ value, label }) => (
                <StaggerItem key={label}>
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
                    <div className="text-2xl font-bold text-blue-300">{value}</div>
                    <div className="mt-1 text-xs text-slate-400">{label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Happy Friday */}
            <FadeIn className="mt-16" direction="bounce">
              <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
                  <PartyPopper className="size-3.5" /> Happy Friday
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  The whole team gets <span className="text-amber-400">a free morning every Friday</span>
                </h3>
                <p className="max-w-2xl text-slate-400">
                  Every Friday, the entire team is free for the whole morning to enjoy outdoor activities —
                  archery, SUP paddling, hiking, mountain climbing, and more. No deadlines, no emails.
                  Just teammates having a great time together.
                </p>
              </div>
            </FadeIn>

            {/* Happy Friday videos */}
            {(happyFridayVideo1 || happyFridayVideo2) && (
              <StaggerContainer className="mt-6 grid gap-5 sm:grid-cols-2">
                {([
                  { item: happyFridayVideo1, label: "Outdoor Trip", desc: "The whole team heads out together" },
                  { item: happyFridayVideo2, label: "Archery", desc: "Team archery — focus, aim, release" },
                ] as const).filter((v) => v.item).map(({ item, label, desc }) => (
                  <StaggerItem key={item!.id} variant="bounce">
                    <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-800/50 shadow-lg shadow-amber-900/10">
                      <div className="relative aspect-video overflow-hidden">
                        <LazyVideo item={item!} />
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-amber-300">{label}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

            {/* Happy Friday photo items */}
            {happyFridayItems.length > 0 && (
              <StaggerContainer className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {happyFridayItems
                  .filter((i) => resolveMediaType(i) === "IMAGE" && i.id !== happyFridayVideo1?.id && i.id !== happyFridayVideo2?.id)
                  .map((item) => (
                  <StaggerItem key={item.id}>
                    <div className="overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-800/50">
                      <div className="relative aspect-video overflow-hidden">
                        <ClickableImage item={item} className="object-cover" onOpen={openLightbox} />
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            8. DAILY LIFE — Lifestyle, support, noodles, piano & more
        ══════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <FadeIn direction="flip">
              <div className="mb-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                  <Coffee className="size-3.5" /> Employee Lifestyle
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Employee Lifestyle at mgm</span>
                </h2>
                <p className="mt-3 text-slate-400">
                  Not just work — a place where people learn, have fun, and grow together.
                </p>
              </div>
            </FadeIn>

            {/* Lifestyle highlight: peer support + English */}
            <FadeIn>
              <div className="mb-10 overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-950/30 to-slate-900 p-6 sm:p-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xl font-bold text-white">
                      Everyone speaks English — and everyone supports each other
                    </h3>
                    <p className="mb-3 text-sm text-slate-400">
                      Thanks to daily English practice, mgm employees communicate naturally in
                      every situation — from meetings with German clients to everyday international emails.
                    </p>
                    <p className="text-sm text-slate-400">
                      The culture here is{" "}
                      <span className="font-semibold text-teal-300">no one gets left behind</span>
                      : colleagues, teachers, and management actively support one another —
                      because when the whole team is strong, everyone wins.
                    </p>
                  </div>
                  <StaggerContainer className="grid grid-cols-2 gap-3 items-start">
                    {[
                      { icon: Languages, title: "Daily English",  desc: "English flows naturally — no pressure, no fear" },
                      { icon: Heart,     title: "Peer Support",   desc: "Colleagues always ready to help each other out" },
                      { icon: Globe,     title: "Global Mindset", desc: "German-Vietnamese cross-cultural thinking" },
                      { icon: Zap,       title: "Grow Together",  desc: "A strong team starts with every individual growing" },
                    ].map(({ icon: Icon, title, desc }) => (
                      <StaggerItem key={title}>
                        <div className="rounded-xl border border-teal-500/15 bg-teal-500/5 p-3">
                          <Icon className="mb-1.5 size-4 text-teal-400" />
                          <p className="text-xs font-semibold text-white">{title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            </FadeIn>

            <div className="grid gap-6 sm:grid-cols-2 items-start">
              {/* Noodles */}
              {noodles && (
                <FadeIn direction="right">
                  <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-800/50 shadow-lg shadow-amber-900/10">
                    <div className="relative aspect-video overflow-hidden">
                      <LazyVideo item={noodles} />
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-amber-300">Instant Noodles at the Office</p>
                      <p className="text-xs text-slate-500">Late afternoons cooking instant noodles together — the most wholesome moment at mgm.</p>
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Piano */}
              {piano && (
                <FadeIn direction="left">
                  <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-800/50 shadow-lg shadow-amber-900/10">
                    <div className="relative aspect-video overflow-hidden">
                      <LazyVideo item={piano} />
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-amber-300">Piano at the Office</p>
                      <p className="text-xs text-slate-500">The office piano — a place to unwind and share a passion for music with your teammates.</p>
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Extra general items */}
              {generalItems
                .filter((i) =>
                  i.id !== noodles?.id &&
                  i.id !== piano?.id &&
                  !i.title?.toLowerCase().includes("noodle") &&
                  !i.title?.toLowerCase().includes("piano")
                )
                .map((item) => (
                  <FadeIn key={item.id}>
                    <ScaleOnHover>
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60">
                        <div className="relative aspect-video overflow-hidden">
                          <ClickableImage item={item} className="object-cover" onOpen={openLightbox} />
                        </div>
                        <div className="p-5">
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    </ScaleOnHover>
                  </FadeIn>
                ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            9. CLOSING CTA
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 py-24 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]" />
          <FadeIn direction="zoom" className="relative mx-auto max-w-2xl px-4">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-400">
              <Heart className="size-3.5" /> Join mgm
            </div>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Become part of the mgm family</span>
            </h2>
            <p className="mb-8 text-slate-400">
              If you want to work in a truly international environment, improve your English
              every single day on the clock, and be surrounded by genuinely kind people —
              mgm Da Nang is the place for you.
            </p>
            <a
              href="https://www.mgm-tp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
            >
              Explore careers at mgm
            </a>
          </FadeIn>
        </section>

      </main>
      <footer className="border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>
      </footer>
      <LightboxOverlay />
    </div>
  );
}

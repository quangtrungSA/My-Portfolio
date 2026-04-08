import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { MgmLifeItem, ApiResponse } from "@/types";
import {
  Globe,
  BookOpen,
  PartyPopper,
  Users,
  MapPin,
  Mic2,
  Coffee,
  Music,
  Heart,
  Zap,
  Award,
  Languages,
  Play,
  Laptop,
  Mouse,
  Keyboard,
} from "lucide-react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// Data & helpers
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = process.env.API_URL || "http://localhost:8080";

const GD = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1280`;

const STATIC_ITEMS: MgmLifeItem[] = [
  { id: "s1", title: "English Class — Outdoor Session", description: "Teachers and students explore Da Nang together during class hours.", mediaType: "IMAGE", mediaUrl: GD("1EvGNzQ5tmhG6sf0-WCY6aI3VH7ElYJih"), thumbnailUrl: "", category: "ENGLISH_CLASS", sortOrder: 1, published: true, createdAt: "", updatedAt: "" },
  { id: "s2", title: "English Class", description: "2-hour daily English class at the office — counted as paid working hours.", mediaType: "IMAGE", mediaUrl: GD("19QqwZGUpQgAvUwl_ZdiX6VZ3WAlRosFX"), thumbnailUrl: "", category: "ENGLISH_CLASS", sortOrder: 2, published: true, createdAt: "", updatedAt: "" },
  { id: "s5", title: "Onboarding Gift — Welcome to mgm!", description: "A warm welcome card from Ms. Ngo Loan — Deputy General Director.", mediaType: "IMAGE", mediaUrl: GD("1wigY74letDLUD-uUSeBtmMxY4Lgq_AnN"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 1, published: true, createdAt: "", updatedAt: "" },
  { id: "s6", title: "Software Quality — ISO/IEC 25010", description: "International speaker session on software quality characteristics.", mediaType: "IMAGE", mediaUrl: GD("110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 2, published: true, createdAt: "", updatedAt: "" },
  { id: "s7", title: "Tech Talk at mgm", description: "Engineers sharing knowledge and technical insights.", mediaType: "IMAGE", mediaUrl: GD("1d61zh7zySVYgT3IVv2feCuzX38dkMOVN"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 3, published: true, createdAt: "", updatedAt: "" },
  { id: "s8", title: "mgm Office — Da Nang", description: "Our workspace in the heart of Da Nang — open, modern, and welcoming.", mediaType: "IMAGE", mediaUrl: GD("1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 4, published: true, createdAt: "", updatedAt: "" },
  { id: "s9",  title: "mgm Office Da Nang — Workspace",  description: "A modern, collaborative workspace where the team builds enterprise software for global clients.", mediaType: "IMAGE", mediaUrl: GD("1dKCMJjTeqgcVdIjsmRv6hGBMJ9dpj68Q"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 5, published: true, createdAt: "", updatedAt: "" },
  { id: "s10", title: "mgm Office Da Nang — Team Area",   description: "Open team area designed for collaboration — where Vietnamese and international engineers work side by side.", mediaType: "IMAGE", mediaUrl: GD("14vhCNIqbuOTZl-ljJuIoypIDf_1mjhpa"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 6, published: true, createdAt: "", updatedAt: "" },
  { id: "s3", title: "Instant Noodles at the Office", description: "Late afternoons cooking instant noodles together.", mediaType: "IMAGE", mediaUrl: GD("13HcKoP-xkU6zLAkVG93vzUCtdg-WT9Xk"), thumbnailUrl: "", category: "GENERAL", sortOrder: 1, published: true, createdAt: "", updatedAt: "" },
  { id: "s4", title: "Piano at the Office", description: "The office piano — a place to unwind and share a passion for music.", mediaType: "IMAGE", mediaUrl: GD("1ZEsaj7zr0UHGTyOHBv9vKMfSWXIWJ0mi"), thumbnailUrl: "", category: "GENERAL", sortOrder: 2, published: true, createdAt: "", updatedAt: "" },
];

async function fetchItems(): Promise<MgmLifeItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/mgm-life`, { next: { revalidate: 60 } });
    if (!res.ok) return STATIC_ITEMS;
    const json: ApiResponse<MgmLifeItem[]> = await res.json();
    return json.data?.length ? json.data : STATIC_ITEMS;
  } catch {
    return STATIC_ITEMS;
  }
}

// Normalize any Google Drive URL to the reliable thumbnail format
function normalizeDriveUrl(url: string): string {
  if (!url) return url;
  // Already thumbnail format
  if (url.includes("drive.google.com/thumbnail")) return url;
  // Extract file ID from uc?export=view&id=XXX
  const ucMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w1280`;
  // Extract file ID from /file/d/XXX/
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1280`;
  return url;
}

function DriveMedia({ item, className }: { item: MgmLifeItem; className?: string }) {
  if (item.mediaType === "VIDEO" && item.mediaUrl) {
    // Convert drive file URL to embed/preview URL for video
    const videoUrl = item.mediaUrl.includes("/preview")
      ? item.mediaUrl
      : item.mediaUrl.replace(/\/view(\?.*)?$/, "/preview")
          .replace(/[?&]export=view/, "")
          || item.mediaUrl;
    return (
      <iframe
        src={videoUrl}
        className={className ?? "h-full w-full"}
        allow="autoplay"
        allowFullScreen
      ></iframe>
    );
  }
  if (item.mediaUrl) {
    return (
      <Image
        src={normalizeDriveUrl(item.mediaUrl)}
        alt={item.title}
        fill
        className={className ?? "object-cover"}
        unoptimized
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-800">
      <Play className="size-10 text-slate-500" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function MgmLifePage() {
  const items = await fetchItems();

  const englishItems = items.filter((i) => i.category === "ENGLISH_CLASS");
  const companyItems = items.filter((i) => i.category === "COMPANY_OVERVIEW");
  const generalItems = items.filter((i) => i.category === "GENERAL");
  const happyFridayItems = items.filter((i) => i.category === "HAPPY_FRIDAY");

  // Specific items by ID for pinned spots
  const getItem = (id: string) => items.find((i) => i.id === id || i.mediaUrl?.includes(id));
  const welcomeGift  = getItem("1wigY74letDLUD-uUSeBtmMxY4Lgq_AnN");
  const speaker1     = getItem("1d61zh7zySVYgT3IVv2feCuzX38dkMOVN");
  const speaker2     = getItem("110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9");
  const office1      = getItem("1dKCMJjTeqgcVdIjsmRv6hGBMJ9dpj68Q");
  const office2      = getItem("14vhCNIqbuOTZl-ljJuIoypIDf_1mjhpa");
  const noodles      = getItem("13HcKoP-xkU6zLAkVG93vzUCtdg-WT9Xk");
  const piano        = getItem("1ZEsaj7zr0UHGTyOHBv9vKMfSWXIWJ0mi");

  // Video items (from DB once admin uploads them)
  const officeVideo  = items.find((i) => i.mediaType === "VIDEO" && i.category === "COMPANY_OVERVIEW");
  const englishVideo = items.find((i) => i.mediaType === "VIDEO" && i.category === "ENGLISH_CLASS");

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
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
                <Globe className="size-4" /> International Technology Company
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-center text-6xl font-extrabold tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                mgm life
              </span>
            </h1>

            {/* Tagline */}
            <p className="mx-auto mb-4 max-w-3xl text-center text-xl text-slate-300 sm:text-2xl">
              <span className="font-bold text-white">mgm technology partners</span> — where German engineering meets Vietnamese talent in Da Nang.
            </p>
            <p className="mx-auto mb-14 max-w-2xl text-center text-base text-slate-400">
              Founded in 1994 in Munich, Germany. Our Vietnam office is located in the heart of Da Nang —
              where a multinational team (Germany, Vietnam, France, Austria…) builds enterprise software
              for global clients.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: "1994",  label: "Founded",         icon: Award },
                { value: "10+",   label: "Global offices",  icon: Globe },
                { value: "700+",  label: "Employees",       icon: Users },
                { value: "🇩🇪🇻🇳🇫🇷🇦🇹", label: "Nationalities", icon: Heart },
              ].map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
                >
                  <Icon className="mx-auto mb-2 size-5 text-slate-400" />
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            2. ABOUT — Da Nang office + multinational team
        ══════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
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
                    large-scale enterprise solutions — from banking and insurance to e-commerce.
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

              {/* Office collage */}
              <div className="grid grid-cols-2 gap-3">
                {[office1, office2].filter(Boolean).map((item, i) => (
                  <div
                    key={item!.id}
                    className={`relative overflow-hidden rounded-2xl bg-slate-800 ${
                      i === 0 ? "aspect-[3/4]" : "aspect-square self-end"
                    }`}
                  >
                    <DriveMedia item={item!} className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-xs font-medium text-white">{item!.title}</p>
                    </div>
                  </div>
                ))}
                {(!office1 || !office2) && (
                  <div className="col-span-2 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 text-slate-600">
                    Office photos coming soon
                  </div>
                )}
              </div>
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
              <div className="order-2 lg:order-1">
                {welcomeGift ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-amber-500/20 shadow-2xl shadow-amber-900/20">
                    <DriveMedia item={welcomeGift} className="object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-3xl border border-dashed border-white/10 bg-slate-800" />
                )}
              </div>

              {/* Text */}
              <div className="order-1 lg:order-2">
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
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            4. BENEFITS
        ══════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-900 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                <Zap className="size-3.5" /> Employee Benefits
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Outstanding Benefits
              </h2>
              <p className="mt-3 text-slate-400">
                mgm invests in people — not just with salary, but with real life experiences.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  color: "sky",
                  title: "MacBook or ThinkPad — your choice",
                  desc: "Employees choose their own device: latest MacBook Pro/Air or Lenovo ThinkPad, paired with flagship keyboard and premium mouse.",
                  tag: "Latest hardware",
                },
              ].map(({ icon: Icon, color, title, desc, tag }) => (
                <div
                  key={title}
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
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            5. INTERNATIONAL SPEAKERS
        ══════════════════════════════════════════════════════════════ */}
        {(speaker1 || speaker2) && (
          <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-400">
                  <Mic2 className="size-3.5" /> International Speakers
                </div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  International Speakers at mgm
                </h2>
                <p className="mt-3 max-w-xl text-slate-400">
                  Experts from Germany and across Europe regularly visit Da Nang to share
                  knowledge — from software architecture to ISO quality standards.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {[speaker1, speaker2].filter(Boolean).map((item) => (
                  <div
                    key={item!.id}
                    className="group overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-800/50"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <DriveMedia item={item!} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <p className="font-semibold text-white">{item!.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{item!.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            6. OFFICE PHOTOS + VIDEO
        ══════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-950 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-400">
                <MapPin className="size-3.5" /> Our Office
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                mgm Da Nang Office
              </h2>
              <p className="mt-3 text-slate-400">
                An open, modern workspace — where code meets coffee and music.
              </p>
            </div>

            {/* Office photo */}
            {companyItems.find((i) => i.mediaUrl?.includes("1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU")) && (
              <div className="relative mb-6 aspect-video overflow-hidden rounded-3xl border border-white/10">
                <DriveMedia
                  item={companyItems.find((i) => i.mediaUrl?.includes("1xE8O5NKYhkUWVVdLy58JcoJy4I8q9MYU"))!}
                  className="object-cover"
                />
              </div>
            )}

            {/* Video placeholder or actual video */}
            <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-800">
              {officeVideo ? (
                <div className="relative aspect-video">
                  <iframe
                    src={officeVideo.mediaUrl}
                    className="h-full w-full"
                    allow="autoplay"
                    allowFullScreen
                  />
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
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            7. ENGLISH CLASS BENEFIT (with video)
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(59,130,246,0.1),transparent_60%)]" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                <Languages className="size-3.5" /> Language Benefit
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                English Class — A Rare Benefit
              </h2>
              <p className="mt-3 text-slate-400">
                New employees receive 2 hours of English class every day during their first 3 months —
                counted as fully paid working hours. A head start that very few companies offer.
              </p>
            </div>

            {/* Video + 2 photos layout */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Video side */}
              <div className="overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-800">
                {englishVideo ? (
                  <div className="relative aspect-video">
                    <iframe
                      src={englishVideo.mediaUrl}
                      className="h-full w-full"
                      allow="autoplay"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative flex aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-950/50 to-slate-900 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10">
                      <Play className="size-6 text-blue-400" />
                    </div>
                    <p className="text-sm text-slate-400">English Class video — coming soon</p>
                  </div>
                )}
              </div>

              {/* Photos side */}
              <div className="grid grid-rows-2 gap-4">
                {englishItems.slice(0, 2).map((item) => (
                  <div key={item.id} className="relative overflow-hidden rounded-2xl bg-slate-800">
                    <div className="relative aspect-video">
                      <DriveMedia item={item} className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info strip */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "2h", label: "Every day" },
                { value: "3mo", label: "For new employees" },
                { value: "100%", label: "Paid time" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
                  <div className="text-2xl font-bold text-blue-300">{value}</div>
                  <div className="mt-1 text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
            </div>

            {/* Happy Friday items if any */}
            {happyFridayItems.length > 0 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {happyFridayItems.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-2xl border border-blue-500/10 bg-slate-800/50">
                    <div className="relative aspect-video overflow-hidden">
                      <DriveMedia item={item} className="object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            8. DAILY LIFE — Lifestyle, support, noodles, piano & more
        ══════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                <Coffee className="size-3.5" /> Employee Lifestyle
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Employee Lifestyle at mgm
              </h2>
              <p className="mt-3 text-slate-400">
                Not just work — a place where people learn, have fun, and grow together.
              </p>
            </div>

            {/* Lifestyle highlight: peer support + English */}
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
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Languages, title: "Daily English",  desc: "English flows naturally — no pressure, no fear" },
                    { icon: Heart,     title: "Peer Support",   desc: "Colleagues always ready to help each other out" },
                    { icon: Globe,     title: "Global Mindset", desc: "Cross-cultural thinking from a German-Vietnamese environment" },
                    { icon: Zap,       title: "Grow Together",  desc: "A strong team starts with every individual growing" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="rounded-xl border border-teal-500/15 bg-teal-500/5 p-3">
                      <Icon className="mb-1.5 size-4 text-teal-400" />
                      <p className="text-xs font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Device setup highlight */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950/30 to-slate-900 p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="shrink-0">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10">
                    <Laptop className="size-7 text-sky-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold text-white">
                    Device of your choice — MacBook or ThinkPad
                  </h3>
                  <p className="text-sm text-slate-400">
                    mgm equips every employee with the{" "}
                    <span className="font-semibold text-sky-300">latest MacBook Pro / Air or Lenovo ThinkPad</span>{" "}
                    based on personal preference and role. Paired with premium accessories —
                    mechanical keyboard or Apple Magic Keyboard, and the latest high-end mouse.
                    No worrying about tools. Just focus on doing great work.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <div className="flex items-center gap-4">
                    {[
                      { icon: Laptop,   label: "MacBook / ThinkPad" },
                      { icon: Keyboard, label: "Latest keyboard" },
                      { icon: Mouse,    label: "Premium mouse" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1">
                        <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2.5">
                          <Icon className="size-4 text-sky-400" />
                        </div>
                        <span className="text-center text-[10px] text-slate-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Noodles */}
              {noodles && (
                <div className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60">
                  <div className="relative aspect-video overflow-hidden">
                    <DriveMedia item={noodles} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <Coffee className="size-4 text-orange-400" />
                      <span className="text-xs font-medium uppercase tracking-wide text-orange-400">Kitchen Moments</span>
                    </div>
                    <h3 className="font-semibold text-white">{noodles.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{noodles.description}</p>
                  </div>
                </div>
              )}

              {/* Piano */}
              {piano && (
                <div className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60">
                  <div className="relative aspect-video overflow-hidden">
                    <DriveMedia item={piano} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <Music className="size-4 text-violet-400" />
                      <span className="text-xs font-medium uppercase tracking-wide text-violet-400">Music & Culture</span>
                    </div>
                    <h3 className="font-semibold text-white">{piano.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{piano.description}</p>
                  </div>
                </div>
              )}

              {/* Extra general items */}
              {generalItems
                .filter((i) => i.id !== noodles?.id && i.id !== piano?.id)
                .map((item) => (
                  <div key={item.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60">
                    <div className="relative aspect-video overflow-hidden">
                      <DriveMedia item={item} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            9. CLOSING CTA
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 py-24 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]" />
          <div className="relative mx-auto max-w-2xl px-4">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-400">
              <Heart className="size-3.5" /> Join mgm
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Become part of the mgm family
            </h2>
            <p className="mb-8 text-slate-400">
              If you want to work in a truly international environment, improve your English
              every single day on the clock, and be surrounded by genuinely kind people —
              mgm Da Nang is the place for you.
            </p>
            <a
              href="https://mgm-tp.com/career"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
            >
              Explore careers at mgm
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

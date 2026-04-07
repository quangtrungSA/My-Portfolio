import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { MgmLifeItem, ApiResponse } from "@/types";
import { Building2, Globe, BookOpen, PartyPopper, Play, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const API_BASE = process.env.API_URL || "http://localhost:8080";

const STATIC_MGM_ITEMS: MgmLifeItem[] = [
  // English Class
  {
    id: "static-1",
    title: "English Class — Outdoor Session",
    description: "Teachers and students explore the city together during English class hours.",
    mediaType: "IMAGE",
    mediaUrl: "https://drive.google.com/uc?export=view&id=1EvGNzQ5tmhG6sf0-WCY6aI3VH7ElYJih",
    thumbnailUrl: "",
    category: "ENGLISH_CLASS",
    sortOrder: 1,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "static-2",
    title: "English Class",
    description: "2-hour daily English class at the office — counted as paid working hours.",
    mediaType: "IMAGE",
    mediaUrl: "https://drive.google.com/uc?export=view&id=19QqwZGUpQgAvUwl_ZdiX6VZ3WAlRosFX",
    thumbnailUrl: "",
    category: "ENGLISH_CLASS",
    sortOrder: 2,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  // Company Overview
  {
    id: "static-5",
    title: "Onboarding Gift — Welcome to mgm!",
    description: "A warm welcome card to Trung from Ms. Ngo Loan — Deputy General Director of mgm technology partners Vietnam.",
    mediaType: "IMAGE",
    mediaUrl: "https://drive.google.com/uc?export=view&id=1wigY74letDLUD-uUSeBtmMxY4Lgq_AnN",
    thumbnailUrl: "",
    category: "COMPANY_OVERVIEW",
    sortOrder: 1,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "static-6",
    title: "Software Quality Standards — ISO/IEC 25010",
    description: "Presentation on software quality characteristics: usability, reliability, security and more.",
    mediaType: "IMAGE",
    mediaUrl: "https://drive.google.com/uc?export=view&id=110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9",
    thumbnailUrl: "",
    category: "COMPANY_OVERVIEW",
    sortOrder: 2,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "static-7",
    title: "Tech Talk at mgm",
    description: "Knowledge sharing session — engineers presenting and discussing technical topics.",
    mediaType: "IMAGE",
    mediaUrl: "https://drive.google.com/uc?export=view&id=1d61zh7zySVYgT3IVv2feCuzX38dkMOVN",
    thumbnailUrl: "",
    category: "COMPANY_OVERVIEW",
    sortOrder: 3,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  // Life at mgm
  {
    id: "static-3",
    title: "Instant Noodles at the Office",
    description: "Late afternoons cooking instant noodles together — the most wholesome moment at mgm.",
    mediaType: "IMAGE",
    mediaUrl: "https://drive.google.com/uc?export=view&id=13HcKoP-xkU6zLAkVG93vzUCtdg-WT9Xk",
    thumbnailUrl: "",
    category: "GENERAL",
    sortOrder: 1,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "static-4",
    title: "Piano at the Office",
    description: "The office piano at mgm — a place to unwind and share a passion for music.",
    mediaType: "IMAGE",
    mediaUrl: "https://drive.google.com/uc?export=view&id=1ZEsaj7zr0UHGTyOHBv9vKMfSWXIWJ0mi",
    thumbnailUrl: "",
    category: "GENERAL",
    sortOrder: 2,
    published: true,
    createdAt: "",
    updatedAt: "",
  },
];

async function fetchMgmLifeItems(): Promise<MgmLifeItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/mgm-life`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return STATIC_MGM_ITEMS;
    const json: ApiResponse<MgmLifeItem[]> = await res.json();
    return json.data?.length ? json.data : STATIC_MGM_ITEMS;
  } catch {
    return STATIC_MGM_ITEMS;
  }
}

function DriveEmbed({ item }: { item: MgmLifeItem }) {
  if (item.mediaType === "VIDEO" && item.mediaUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
        <iframe
          src={item.mediaUrl}
          className="h-full w-full"
          allow="autoplay"
          allowFullScreen
        />
      </div>
    );
  }

  if (item.mediaUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-800">
        <Image
          src={item.mediaUrl}
          alt={item.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-800 text-slate-500">
      {item.mediaType === "VIDEO" ? (
        <Play className="size-12" />
      ) : (
        <ImageIcon className="size-12" />
      )}
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  ENGLISH_CLASS: "English Class",
  HAPPY_FRIDAY: "Happy Friday",
  COMPANY_OVERVIEW: "Company",
  GENERAL: "Life at mgm",
};

const CATEGORY_COLORS: Record<string, string> = {
  ENGLISH_CLASS: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  HAPPY_FRIDAY: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  COMPANY_OVERVIEW: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  GENERAL: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
};

export default async function MgmLifePage() {
  const items = await fetchMgmLifeItems();

  const englishClassItems = items.filter((i) => i.category === "ENGLISH_CLASS");
  const happyFridayItems = items.filter((i) => i.category === "HAPPY_FRIDAY");
  const companyItems = items.filter((i) => i.category === "COMPANY_OVERVIEW");
  const generalItems = items.filter((i) => i.category === "GENERAL");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pb-24 pt-32">
          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
              <Globe className="size-4" />
              International Company
            </div>

            {/* Logo / Title */}
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                mgm life
              </span>
            </h1>
            <p className="mb-2 text-2xl font-semibold text-slate-200">
              mgm technology partners
            </p>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Một công ty công nghệ quốc tế với trụ sở chính tại{" "}
              <span className="font-semibold text-slate-200">Munich, Đức</span>{" "}
              — nơi văn hóa học hỏi và niềm vui luôn song hành cùng công việc.
            </p>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-10">
              {[
                { label: "Năm thành lập", value: "1994" },
                { label: "Văn phòng toàn cầu", value: "10+" },
                { label: "Nhân viên", value: "700+" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-sm text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-b from-slate-950 to-slate-900 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Phúc lợi nổi bật
              </h2>
              <p className="mt-3 text-slate-400">
                mgm technology partners đầu tư vào con người — không chỉ bằng lương mà bằng cả trải nghiệm.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {/* Benefit 1: English Class */}
              <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900 p-8 transition-all hover:border-blue-500/40">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <BookOpen className="size-6 text-blue-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  Lớp tiếng Anh mỗi ngày
                </h3>
                <p className="text-slate-400">
                  Nhân viên được học tiếng Anh{" "}
                  <span className="font-semibold text-blue-300">2 tiếng mỗi ngày</span>{" "}
                  trong giờ làm việc — được tính như giờ lương, không khấu trừ.
                  Đây là cam kết của mgm trong việc nâng cao năng lực ngôn ngữ cho toàn đội ngũ.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">
                  Được tính như lương
                </div>
              </div>

              {/* Benefit 2: Happy Friday */}
              <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-slate-900 p-8 transition-all hover:border-amber-500/40">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                  <PartyPopper className="size-6 text-amber-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  Happy Friday
                </h3>
                <p className="text-slate-400">
                  Mỗi thứ Sáu, toàn bộ giáo viên và học viên cùng nhau ra ngoài{" "}
                  <span className="font-semibold text-amber-300">cả buổi sáng</span>{" "}
                  — khám phá thành phố, ăn sáng, hay đơn giản là tận hưởng thời gian vui vẻ bên nhau.
                  Không bài tập. Không deadline.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
                  Mỗi thứ Sáu
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Media Sections ───────────────────────────────────────────── */}

        {/* English Class media */}
        {englishClassItems.length > 0 && (
          <MediaSection
            title="English Class"
            subtitle="Lớp học tiếng Anh — nơi học viên và giáo viên cùng phát triển mỗi ngày."
            items={englishClassItems}
            accentClass="text-blue-400"
          />
        )}

        {/* Happy Friday media */}
        {happyFridayItems.length > 0 && (
          <MediaSection
            title="Happy Friday"
            subtitle="Những buổi sáng thứ Sáu đáng nhớ — ra ngoài, vui chơi, gắn kết."
            items={happyFridayItems}
            accentClass="text-amber-400"
            dark
          />
        )}

        {/* Company Overview media */}
        {companyItems.length > 0 && (
          <MediaSection
            title="Về mgm technology partners"
            subtitle="Hình ảnh và thông tin về công ty tại Việt Nam và trụ sở Đức."
            items={companyItems}
            accentClass="text-purple-400"
          />
        )}

        {/* General media */}
        {generalItems.length > 0 && (
          <MediaSection
            title="Cuộc sống tại mgm"
            subtitle="Những khoảnh khắc đời thường tại văn phòng mgm."
            items={generalItems}
            accentClass="text-emerald-400"
            dark
          />
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <section className="py-24 text-center">
            <div className="mx-auto max-w-md px-4">
              <Building2 className="mx-auto mb-4 size-12 text-slate-600" />
              <p className="text-slate-500">
                Nội dung đang được cập nhật. Vui lòng quay lại sau.
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function MediaSection({
  title,
  subtitle,
  items,
  accentClass,
  dark = false,
}: {
  title: string;
  subtitle: string;
  items: MgmLifeItem[];
  accentClass: string;
  dark?: boolean;
}) {
  return (
    <section
      className={`py-24 ${
        dark
          ? "bg-slate-900"
          : "bg-gradient-to-b from-slate-900 to-slate-950"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className={`text-2xl font-bold ${accentClass} sm:text-3xl`}>
            {title}
          </h2>
          <p className="mt-2 text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`grid gap-6 ${
            items.length === 1
              ? "sm:grid-cols-1 max-w-2xl"
              : items.length === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50"
            >
              <DriveEmbed item={item} />
              {(item.title || item.description) && (
                <div className="p-4">
                  {item.title && (
                    <p className="font-semibold text-white">{item.title}</p>
                  )}
                  {item.description && (
                    <p className="mt-1 text-sm text-slate-400">
                      {item.description}
                    </p>
                  )}
                  <span
                    className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                      CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.GENERAL
                    }`}
                  >
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

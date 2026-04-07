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
} from "lucide-react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// Data & helpers
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = process.env.API_URL || "http://localhost:8080";

const GD = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;

const STATIC_ITEMS: MgmLifeItem[] = [
  { id: "s1", title: "English Class — Outdoor Session", description: "Teachers and students explore Da Nang together during class hours.", mediaType: "IMAGE", mediaUrl: GD("1EvGNzQ5tmhG6sf0-WCY6aI3VH7ElYJih"), thumbnailUrl: "", category: "ENGLISH_CLASS", sortOrder: 1, published: true, createdAt: "", updatedAt: "" },
  { id: "s2", title: "English Class", description: "2-hour daily English class at the office — counted as paid working hours.", mediaType: "IMAGE", mediaUrl: GD("19QqwZGUpQgAvUwl_ZdiX6VZ3WAlRosFX"), thumbnailUrl: "", category: "ENGLISH_CLASS", sortOrder: 2, published: true, createdAt: "", updatedAt: "" },
  { id: "s5", title: "Onboarding Gift — Welcome to mgm!", description: "A warm welcome card from Ms. Ngo Loan — Deputy General Director.", mediaType: "IMAGE", mediaUrl: GD("1wigY74letDLUD-uUSeBtmMxY4Lgq_AnN"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 1, published: true, createdAt: "", updatedAt: "" },
  { id: "s6", title: "Software Quality — ISO/IEC 25010", description: "International speaker session on software quality characteristics.", mediaType: "IMAGE", mediaUrl: GD("110ZpnhR08VEg0yGXEpK3TFLkU0DJcWd9"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 2, published: true, createdAt: "", updatedAt: "" },
  { id: "s7", title: "Tech Talk at mgm", description: "Engineers sharing knowledge and technical insights.", mediaType: "IMAGE", mediaUrl: GD("1d61zh7zySVYgT3IVv2feCuzX38dkMOVN"), thumbnailUrl: "", category: "COMPANY_OVERVIEW", sortOrder: 3, published: true, createdAt: "", updatedAt: "" },
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

function DriveImage({ id, alt, className }: { id: string; alt: string; className?: string }) {
  return (
    <Image
      src={GD(id)}
      alt={alt}
      fill
      className={className ?? "object-cover"}
      unoptimized
    />
  );
}

function DriveMedia({ item, className }: { item: MgmLifeItem; className?: string }) {
  if (item.mediaType === "VIDEO" && item.mediaUrl) {
    return (
      <iframe
        src={item.mediaUrl}
        className={className ?? "h-full w-full"}
        allow="autoplay"
        allowFullScreen
      />
    );
  }
  if (item.mediaUrl) {
    return (
      <Image
        src={item.mediaUrl}
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
              <span className="font-bold text-white">mgm technology partners</span> — nơi công nghệ
              Đức gặp gỡ tài năng Việt Nam tại Đà Nẵng.
            </p>
            <p className="mx-auto mb-14 max-w-2xl text-center text-base text-slate-400">
              Thành lập năm 1994 tại Munich, Đức. Văn phòng Việt Nam đặt tại trung tâm Đà Nẵng —
              nơi team đa quốc tịch (Đức, Việt Nam, Pháp, Áo…) cùng nhau xây dựng phần mềm
              doanh nghiệp cho khách hàng toàn cầu.
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
                  <MapPin className="size-3.5" /> Đà Nẵng, Việt Nam
                </div>
                <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
                  Một công ty quốc tế,<br />
                  <span className="text-violet-400">ngay giữa lòng Đà Nẵng</span>
                </h2>
                <div className="space-y-4 text-slate-400">
                  <p>
                    mgm technology partners là công ty phần mềm Đức hàng đầu, chuyên xây dựng
                    giải pháp doanh nghiệp quy mô lớn — từ banking, insurance đến e-commerce.
                    Văn phòng Đà Nẵng là cầu nối giữa engineering talent Việt Nam và
                    ecosystem công nghệ châu Âu.
                  </p>
                  <p>
                    Team tại Đà Nẵng làm việc trực tiếp với đồng nghiệp người Đức, tham gia
                    các dự án cross-border thực sự — không phải outsourcing, mà là
                    <span className="font-semibold text-slate-200"> một phần của mgm toàn cầu</span>.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    { icon: Globe,     text: "Trụ sở Munich, Đức" },
                    { icon: Users,     text: "Team đa quốc tịch" },
                    { icon: Zap,       text: "Dự án enterprise thực" },
                    { icon: Languages, text: "Môi trường tiếng Anh" },
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
                {[speaker1, speaker2].filter(Boolean).map((item, i) => (
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
                {(!speaker1 || !speaker2) && (
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
                  Chào mừng thành viên mới —
                  <span className="text-amber-400"> như một gia đình</span>
                </h2>
                <p className="mb-4 text-slate-400">
                  Ngay từ ngày đầu tiên, mgm gửi đến nhân viên mới một thiệp chào mừng
                  thân thiết. Thiệp ký tên từ{" "}
                  <span className="font-semibold text-slate-200">
                    bà Ngô Loan — Phó Tổng Giám đốc
                  </span>{" "}
                  — một cử chỉ nhỏ nhưng nói lên nhiều điều về văn hóa trọng người tại đây.
                </p>
                <p className="text-slate-400">
                  Onboarding tại mgm không phải một quy trình — đó là trải nghiệm được thiết
                  kế để bạn cảm thấy được chào đón thực sự, từ ban lãnh đạo đến đồng nghiệp.
                </p>
                <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <p className="text-sm italic text-slate-300">
                    "Chào mừng Trung đến với mgm family. Chúc bạn có những ngày làm việc
                    vui vẻ, hiệu quả và nhiều kỷ niệm đẹp."
                  </p>
                  <p className="mt-3 text-xs text-amber-400">— Ngô Loan, Deputy General Director</p>
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
                Phúc lợi vượt trội
              </h2>
              <p className="mt-3 text-slate-400">
                mgm đầu tư vào con người — không chỉ bằng lương, mà bằng trải nghiệm sống.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Languages,
                  color: "blue",
                  title: "English Class · 2h/ngày",
                  desc: "Học tiếng Anh trong giờ làm việc, được tính như giờ lương. Đây là phúc lợi hiếm có ở bất kỳ công ty nào.",
                  tag: "Paid time",
                },
                {
                  icon: PartyPopper,
                  color: "amber",
                  title: "Happy Friday",
                  desc: "Mỗi thứ Sáu, giáo viên và học viên cùng ra ngoài cả buổi sáng — ăn sáng, khám phá thành phố, hoàn toàn tự do.",
                  tag: "Every Friday",
                },
                {
                  icon: Mic2,
                  color: "purple",
                  title: "International Speakers",
                  desc: "Diễn giả quốc tế từ Đức và khắp châu Âu thường xuyên chia sẻ kiến thức kỹ thuật và kinh nghiệm thực tiễn.",
                  tag: "Knowledge sharing",
                },
                {
                  icon: Globe,
                  color: "violet",
                  title: "Global Projects",
                  desc: "Làm việc trực tiếp với team Đức trên các dự án enterprise thực sự cho khách hàng châu Âu.",
                  tag: "Cross-border",
                },
                {
                  icon: Coffee,
                  color: "emerald",
                  title: "Relaxed Office Culture",
                  desc: "Không dress code cứng nhắc. Có piano, có bếp, có đồng nghiệp vui tính. Văn phòng là nơi bạn muốn đến mỗi sáng.",
                  tag: "Work-life balance",
                },
                {
                  icon: BookOpen,
                  color: "rose",
                  title: "Learning Culture",
                  desc: "Tech talk nội bộ, session chia sẻ kỹ thuật, cơ hội học hỏi từ senior engineer người Đức và châu Âu.",
                  tag: "Continuous learning",
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
                  Diễn giả quốc tế tại mgm
                </h2>
                <p className="mt-3 max-w-xl text-slate-400">
                  Các chuyên gia từ Đức và châu Âu thường xuyên đến Đà Nẵng để chia sẻ
                  kiến thức — từ software architecture đến ISO quality standards.
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
                Văn phòng mgm Đà Nẵng
              </h2>
              <p className="mt-3 text-slate-400">
                Không gian làm việc mở, hiện đại — nơi code gặp gỡ cà phê và âm nhạc.
              </p>
            </div>

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
                  <p className="text-sm text-slate-400">Video văn phòng — sắp ra mắt</p>
                  <p className="text-xs text-slate-600">
                    Admin có thể thêm video tại /admin/mgm-life
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
                English Class — Phúc lợi độc đáo
              </h2>
              <p className="mt-3 text-slate-400">
                2 tiếng tiếng Anh mỗi ngày, trong giờ làm việc, được tính như lương.
                Không nơi nào khác làm điều này.
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
                    <p className="text-sm text-slate-400">Video English Class — sắp ra mắt</p>
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
                { value: "100%", label: "Paid time" },
                { value: "🎉", label: "Happy Friday outdoor" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
                  <div className="text-2xl font-bold text-blue-300">{value}</div>
                  <div className="mt-1 text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>

            <div
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
                Cuộc sống nhân viên tại mgm
              </h2>
              <p className="mt-3 text-slate-400">
                Không chỉ làm việc — đây là nơi mọi người cùng học, cùng vui, cùng lớn.
              </p>
            </div>

            {/* Lifestyle highlight: peer support + English */}
            <div className="mb-10 overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-950/30 to-slate-900 p-6 sm:p-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-xl font-bold text-white">
                    Ai cũng giỏi tiếng Anh — và luôn hỗ trợ nhau
                  </h3>
                  <p className="mb-3 text-sm text-slate-400">
                    Nhờ học tiếng Anh mỗi ngày, nhân viên mgm giao tiếp tự nhiên trong mọi
                    tình huống — từ meeting với khách hàng Đức đến email quốc tế thường ngày.
                  </p>
                  <p className="text-sm text-slate-400">
                    Văn hóa tại đây là{" "}
                    <span className="font-semibold text-teal-300">không ai bị bỏ lại</span>
                    : đồng nghiệp, giáo viên và ban quản lý đều chủ động hỗ trợ nhau —
                    vì khi cả team mạnh, mọi người đều được lợi.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Languages, title: "Daily English",  desc: "Tiếng Anh là ngôn ngữ tự nhiên, không áp lực" },
                    { icon: Heart,     title: "Peer Support",   desc: "Đồng nghiệp luôn sẵn sàng giúp nhau" },
                    { icon: Globe,     title: "Global Mindset", desc: "Tư duy đa văn hóa từ môi trường Đức–Việt" },
                    { icon: Zap,       title: "Grow Together",  desc: "Team mạnh khi từng người cùng lớn" },
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
              Trở thành một phần của mgm family
            </h2>
            <p className="mb-8 text-slate-400">
              Nếu bạn muốn làm việc trong môi trường quốc tế, học tiếng Anh mỗi ngày trong
              giờ làm, và được đồng hành bởi những người tử tế — mgm Đà Nẵng là nơi dành cho bạn.
            </p>
            <a
              href="https://mgm-tp.com/career"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
            >
              Xem cơ hội tại mgm
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

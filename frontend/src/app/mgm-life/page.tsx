import type { MgmLifeItem, ApiResponse } from "@/types";
import { MgmLifePageContent } from "@/components/mgm-life-client";

// ─────────────────────────────────────────────────────────────────────────────
// Data & helpers (server-only)
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

// ─────────────────────────────────────────────────────────────────────────────
// Page (Server Component — fetches data, delegates rendering to client)
// ─────────────────────────────────────────────────────────────────────────────

export default async function MgmLifePage() {
  const items = await fetchItems();
  return <MgmLifePageContent items={items} />;
}

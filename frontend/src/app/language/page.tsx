import Link from "next/link";
import { Globe, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Language",
  description: "My language learning journey and skills.",
};

export default function LanguagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Portfolio
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <Globe className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Language</h1>
            <p className="text-slate-400">My language learning journey</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <p className="text-lg text-slate-300 leading-relaxed">
            Coming soon... This page will showcase my language skills, learning progress, and resources.
          </p>
        </div>
      </div>
    </div>
  );
}

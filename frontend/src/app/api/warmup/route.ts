import { NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:8080";

// GET /api/warmup — ping backend to prevent cold start
// Call this endpoint periodically (e.g. every 5 min via cron or UptimeRobot)
export async function GET() {
  try {
    const start = Date.now();
    await fetch(`${API_BASE}/api/mgm-life`, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });
    return NextResponse.json({ ok: true, latency: Date.now() - start });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

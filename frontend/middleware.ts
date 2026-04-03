import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── API routing ──────────────────────────────────────────────
  // /api/auth/* → handled by Next.js API routes (do nothing)
  // /api/*      → proxy to backend
  if (pathname.startsWith("/api/")) {
    if (pathname.startsWith("/api/auth/")) {
      // Let Next.js API routes handle auth
      return NextResponse.next();
    }
    // Proxy all other /api/* to backend
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const url = new URL(pathname + request.nextUrl.search, apiUrl);
    return NextResponse.rewrite(url);
  }

  // ── Admin auth guard ─────────────────────────────────────────
  // Protect /admin routes, but allow /admin/login through
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("portfolio_token");

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

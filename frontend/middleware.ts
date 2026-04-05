import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  // API proxy is handled by /api/[...path]/route.ts
  // /api/auth/* is handled by /api/auth/*/route.ts
  matcher: ["/admin/:path*"],
};

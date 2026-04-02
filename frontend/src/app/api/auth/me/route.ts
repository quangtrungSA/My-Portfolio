import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated", data: null },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token", data: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Authenticated",
    data: { username: payload.username, role: payload.role },
  });
}


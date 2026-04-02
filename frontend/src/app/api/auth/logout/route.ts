import { NextResponse } from "next/server";
import { createLogoutCookie } from "@/lib/auth";

export async function POST() {
  const cookie = createLogoutCookie();

  return NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
      data: null,
    },
    { status: 200, headers: { "Set-Cookie": cookie } }
  );
}


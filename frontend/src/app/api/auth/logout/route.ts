import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully", data: null },
    { status: 200 }
  );
  // Clear the portfolio_token cookie
  response.cookies.set("portfolio_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });
  return response;
}

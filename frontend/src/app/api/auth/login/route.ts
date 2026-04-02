import { NextRequest, NextResponse } from "next/server";
import {
  validateCredentials,
  signToken,
  createTokenCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
          data: null,
        },
        { status: 401 }
      );
    }

    const token = await signToken({ username, role: "ADMIN" });
    const cookie = createTokenCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          message: "Login successful",
          username,
          role: "ADMIN",
        },
      },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
        data: null,
      },
      { status: 500 }
    );
  }
}


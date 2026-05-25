import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, COOKIE_NAME } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "unkhair2025";

  if (username !== validUser || password !== validPass) {
    return NextResponse.json(
      { success: false, message: "Username atau password salah" },
      { status: 401 }
    );
  }

  const token = await createAdminToken();

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 jam
    path: "/",
  });

  return res;
}

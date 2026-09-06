import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, checkPassword, createSessionToken, isPasswordConfigured } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = typeof body.password === "string" ? body.password : "";

    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const token = await createSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    passwordConfigured: isPasswordConfigured(),
  });
}

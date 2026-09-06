import { NextResponse } from "next/server";
import { isAuthenticated, isPasswordConfigured } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  const authenticated = await isAuthenticated();
  return NextResponse.json({
    authenticated,
    passwordConfigured: isPasswordConfigured(),
  });
}

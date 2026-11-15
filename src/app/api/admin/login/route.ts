import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({ error: "Admin page is disabled." }, { status: 404 });
}

export async function GET() {
  return NextResponse.json({ error: "Admin page is disabled." }, { status: 404 });
}

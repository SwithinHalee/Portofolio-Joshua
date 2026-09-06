import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function sanitizeName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return base || "upload";
}

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Body is not multipart form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Field 'file' is required." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds the 8 MB limit." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WebP, GIF, or AVIF images are accepted." },
      { status: 400 }
    );
  }

  const safe = sanitizeName(file.name);
  const filename = `${Date.now()}-${safe}`;

  // If Vercel Blob token is configured, use Blob storage (persists across all devices globally)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`portfolio/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url, source: "blob" });
    } catch (err) {
      console.error("Vercel Blob upload failed:", err);
      return NextResponse.json({ error: "Failed to upload to Vercel Blob storage." }, { status: 500 });
    }
  }

  // Fallback: Local filesystem (for dev / local test)
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  try {
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), bytes);
    return NextResponse.json({ url: `/images/uploads/${filename}`, source: "local" });
  } catch {
    return NextResponse.json({ error: "Could not save the file locally." }, { status: 500 });
  }
}

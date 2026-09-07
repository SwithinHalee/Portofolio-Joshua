import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  DB_MAX_BYTES,
  IMAGE_REDIS_PREFIX,
  getImageRedisClient,
  type StoredImage,
} from "@/lib/image-store";

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

function toImageId(filename: string): string {
  // Redis key aman: tanpa titik / slash. Ekstensi tidak dibutuhkan
  // karena content-type disimpan terpisah di database.
  return filename.replace(/\./g, "-").slice(0, 100);
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

  // 1) Prioritas utama: Vercel Blob (object storage, tanpa batas Redis).
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

  // 2) Fallback database (Upstash Redis): filesystem Vercel bersifat read-only
  // dan ephemeral, jadi file kecil disimpan sebagai base64 di Redis lalu
  // disajikan lewat GET /api/image?id=...
  if (file.size <= DB_MAX_BYTES) {
    const redis = getImageRedisClient();
    if (redis) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const record: StoredImage = {
          contentType: file.type,
          base64: buffer.toString("base64"),
          size: file.size,
          createdAt: new Date().toISOString(),
        };
        const id = toImageId(filename);
        await redis.set(`${IMAGE_REDIS_PREFIX}${id}`, record);
        return NextResponse.json({ url: `/api/image?id=${encodeURIComponent(id)}`, source: "database" });
      } catch (err) {
        console.error("Database image upload failed:", err);
        // Lanjut ke pesan error yang jelas di bawah (jangan diam-diam ke local).
      }
    }
  }

  // 3) Deploy (Vercel): JANGAN coba tulis ke local — filesystem read-only
  // sehingga selalu gagal dengan "Could not save the file locally."
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    if (file.size > DB_MAX_BYTES) {
      return NextResponse.json(
        {
          error:
            "File exceeds the 700 KB database limit and Blob storage is not configured. " +
            "Set BLOB_READ_WRITE_TOKEN in Vercel project settings, or upload an image under 700 KB.",
        },
        { status: 413 }
      );
    }
    return NextResponse.json(
      {
        error:
          "Image storage is not configured. Set BLOB_READ_WRITE_TOKEN (Vercel Blob) " +
          "or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (database) in Vercel project settings.",
      },
      { status: 500 }
    );
  }

  // 4) Dev lokal saja: filesystem masih bisa ditulis.
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  try {
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), bytes);
    return NextResponse.json({ url: `/images/uploads/${filename}`, source: "local" });
  } catch (err) {
    console.error("Local upload failed:", err);
    return NextResponse.json({ error: "Could not save the file locally." }, { status: 500 });
  }
}

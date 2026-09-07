import { NextResponse } from "next/server";
import { IMAGE_REDIS_PREFIX, getImageRedisClient, isValidImageId, type StoredImage } from "@/lib/image-store";

export const runtime = "nodejs";

function isStoredImage(v: unknown): v is StoredImage {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.contentType === "string" &&
    typeof r.base64 === "string" &&
    r.contentType.startsWith("image/") &&
    r.base64.length > 0
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";

  if (!id || !isValidImageId(id)) {
    return NextResponse.json({ error: "Invalid image id." }, { status: 400 });
  }

  const redis = getImageRedisClient();
  if (!redis) {
    return NextResponse.json({ error: "Image database is not configured." }, { status: 500 });
  }

  try {
    const raw = await redis.get<unknown>(`${IMAGE_REDIS_PREFIX}${id}`);
    if (!isStoredImage(raw)) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }
    const bytes = Buffer.from(raw.base64, "base64");
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": raw.contentType,
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Failed to read image from database:", err);
    return NextResponse.json({ error: "Failed to load image." }, { status: 500 });
  }
}

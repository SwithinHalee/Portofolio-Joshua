import { Redis } from "@upstash/redis";

export const IMAGE_REDIS_PREFIX = "portfolio:image:";

/** Batas aman agar payload base64 + JSON tetap di bawah limit 1 MB Upstash REST. */
export const DB_MAX_BYTES = 700 * 1024;

export interface StoredImage {
  contentType: string;
  base64: string;
  size: number;
  createdAt: string;
}

export function getImageRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isImageDbConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

const IMAGE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-_]{0,99}$/;

export function isValidImageId(id: string): boolean {
  return IMAGE_ID_PATTERN.test(id);
}

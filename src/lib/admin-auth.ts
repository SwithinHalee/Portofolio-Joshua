import { cookies } from "next/headers";

export const ADMIN_DISABLED = true;
export const ADMIN_COOKIE_NAME = "joshua_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function hmacSha256(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }
  const payload = `admin:${Date.now()}`;
  const sig = await hmacSha256(secret, payload);
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret();
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [b64Payload, sig] = parts;
  try {
    const payload = Buffer.from(b64Payload, "base64url").toString("utf8");
    if (!payload.startsWith("admin:")) return false;
    const [, timestampStr] = payload.split(":");
    const ts = parseInt(timestampStr, 10);
    if (isNaN(ts)) return false;
    // Expire after 7 days
    if (Date.now() - ts > SESSION_MAX_AGE * 1000) return false;
    const expectedSig = await hmacSha256(secret, payload);
    return sig === expectedSig;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  if (ADMIN_DISABLED) {
    return false;
  }
  if (!process.env.ADMIN_PASSWORD) {
    return false;
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function isPasswordConfigured(): boolean {
  if (ADMIN_DISABLED) return false;
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(password: string): boolean {
  if (ADMIN_DISABLED) return false;
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  return password === configured;
}

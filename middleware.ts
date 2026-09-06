import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "joshua_admin_session";

async function verifySignature(secret: string, payload: string, sig: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = new Uint8Array(sig.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    return await crypto.subtle.verify("HMAC", key, sigBytes.buffer as ArrayBuffer, enc.encode(payload));
  } catch {
    return false;
  }
}

function decodePayload(b64: string): string | null {
  try {
    let normalized = b64.replace(/-/g, "+").replace(/_/g, "/");
    const remainder = normalized.length % 4;
    if (remainder === 2) normalized += "==";
    else if (remainder === 3) normalized += "=";
    else if (remainder !== 0) return null;
    return atob(normalized);
  } catch {
    return null;
  }
}

async function hasValidAdminSession(req: NextRequest): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return true;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const payload = decodePayload(parts[0]);
  if (!payload || !payload.startsWith("admin:")) return false;
  const [, tsStr] = payload.split(":");
  const ts = parseInt(tsStr, 10);
  if (isNaN(ts) || Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return false;
  const secret = process.env.ADMIN_SESSION_SECRET || adminPassword;
  return verifySignature(secret, payload, parts[1]);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname.startsWith("/admin")) {
    const ok = await hasValidAdminSession(req);
    if (!ok) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

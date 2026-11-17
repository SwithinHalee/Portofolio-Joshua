import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_DISABLED } from "@/lib/admin-auth";

const ALWAYS_PUBLIC_PATHS = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/icon.png",
  "/icon.svg",
  "/apple-icon.png",
  "/opengraph-image",
]);

const EXPLOIT_PROBE_PREFIXES = [
  "/.env",
  "/.git",
  "/wp-admin",
  "/wp-login",
  "/wp-content",
  "/wp-includes",
  "/xmlrpc.php",
  "/phpmyadmin",
  "/cgi-bin",
  "/vendor/phpunit",
  "/actuator",
];

function notFoundResponse(): NextResponse {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lowerPath = pathname.toLowerCase();

  if (ADMIN_DISABLED && (lowerPath === "/admin" || lowerPath.startsWith("/admin/"))) {
    return notFoundResponse();
  }

  if (EXPLOIT_PROBE_PREFIXES.some((prefix) => lowerPath.startsWith(prefix))) {
    return notFoundResponse();
  }

  if (lowerPath.startsWith("/_vercel") || ALWAYS_PUBLIC_PATHS.has(lowerPath)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_vercel).*)"],
};

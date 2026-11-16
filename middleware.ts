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

const ALLOWED_BOT_PATTERNS = [
  "google",
  "gstatic",
  "vercel",
  "headlesschrome",
  "chrome-lighthouse",
  "lighthouse",
  "pagespeed",
  "gtmetrix",
  "pingdom",
  "uptimerobot",
  "bingbot",
  "bingpreview",
  "msnbot",
  "adidxbot",
  "duckduckbot",
  "applebot",
  "slurp",
  "yahoo",
  "yandex",
  "baiduspider",
  "linkedinbot",
  "twitterbot",
  "facebookexternalhit",
  "facebot",
  "meta-externalads",
  "whatsapp",
  "telegrambot",
  "discordbot",
  "slackbot",
  "pinterest",
  "redditbot",
  "embedly",
  "w3c_validator",
];

const BLOCKED_SCRAPER_PATTERNS = [
  "gptbot",
  "chatgpt-user",
  "oai-searchbot",
  "ccbot",
  "claudebot",
  "claude-web",
  "anthropic-ai",
  "bytespider",
  "perplexitybot",
  "diffbot",
  "imagesiftbot",
  "omgili",
  "omgilibot",
  "cohere-ai",
  "ai2bot",
  "youbot",
  "meta-externalagent",
  "meta-externalfetcher",
  "amazonbot",
  "petalbot",
  "ahrefsbot",
  "semrushbot",
  "dotbot",
  "mj12bot",
  "blexbot",
  "dataforseobot",
  "megaindex",
  "turnitinbot",
  "scrapy",
  "httrack",
  "webcopier",
  "nikto",
  "sqlmap",
  "nmap",
  "masscan",
  "zgrab",
  "nuclei",
  "dirbuster",
  "gobuster",
  "feroxbuster",
  "wfuzz",
  "acunetix",
  "nessus",
  "openvas",
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

  const ua = (req.headers.get("user-agent") ?? "").toLowerCase();

  if (!ua.trim()) {
    return new NextResponse("Forbidden: Automated requests without User-Agent are not permitted.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const isAllowedBot = ALLOWED_BOT_PATTERNS.some((pattern) => ua.includes(pattern));
  if (!isAllowedBot) {
    const isBlockedScraper = BLOCKED_SCRAPER_PATTERNS.some((pattern) => ua.includes(pattern));
    if (isBlockedScraper) {
      return new NextResponse("Forbidden: Automated scraping is not permitted.", {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_vercel).*)"],
};

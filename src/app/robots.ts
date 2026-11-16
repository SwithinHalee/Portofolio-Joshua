import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ALLOWED_GOOGLE_BOTS = [
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-News",
  "Googlebot-Video",
  "Google-InspectionTool",
  "GoogleOther",
  "Storebot-Google",
];

const BLOCKED_SCRAPER_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "CCBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Bytespider",
  "PerplexityBot",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Omgili",
  "YouBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Amazonbot",
  "PetalBot",
  "AhrefsBot",
  "SemrushBot",
  "DotBot",
  "MJ12bot",
  "BLEXBot",
  "DataForSeoBot",
  "Scrapy",
  "TurnitinBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ALLOWED_GOOGLE_BOTS,
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: BLOCKED_SCRAPER_BOTS,
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

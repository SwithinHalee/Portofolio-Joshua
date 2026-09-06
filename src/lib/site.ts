/**
 * Single source of truth for public site identity (SEO, sitemap, social cards).
 *
 * IMPORTANT: point SITE_URL at the production domain before launch, either via
 * the NEXT_PUBLIC_SITE_URL environment variable or by editing the fallback
 * below. Canonical URLs, sitemap entries, and Open Graph images all derive
 * from it — Google ignores them when they point at the wrong host.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://portofolio-joshua.vercel.app";

export const SITE_NAME = "Joshua Abdiel";
export const SITE_TAGLINE = "Frontend Engineer & Information Systems";
export const SITE_DESCRIPTION =
  "Personal engineering portfolio and technical dossier of Joshua Abdiel — frontend engineer and Information Systems student at Universitas Tarumanagara, currently building climate-tech interfaces at CarbonEthics.";
export const SITE_LOCALE = "en_US";
export const SITE_GITHUB = "https://github.com/SwithinHalee";
export const SITE_LINKEDIN = "https://www.linkedin.com/in/joshua-abdiel-773965282/";

/** Paste the Google Search Console HTML-tag code here (or via env) after verifying ownership. */
export const GOOGLE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "";

import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";
import { CustomCursor } from "@/components/custom-cursor";
import { ScrollMemory } from "@/components/scroll-memory";
import { WeightedScroll } from "@/components/weighted-scroll";
import { PortfolioProvider } from "@/components/portfolio-provider";
import { SplashProvider } from "@/components/splash-intro";
import { Navbar } from "@/components/navbar";
import {
  GOOGLE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_GITHUB,
  SITE_INSTAGRAM,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Joshua Abdiel",
    "Joshua Abdiel portfolio",
    "Frontend Engineer Indonesia",
    "Frontend Developer Tangerang",
    "Frontend Developer Jakarta",
    "Information Systems UNTAR",
    "Tarumanagara University Information Systems",
    "CarbonEthics frontend",
    "Next.js developer",
    "React TypeScript portfolio",
    "TypeScript engineer",
    "Tailwind CSS",
    "Climate tech web",
    "Web performance Indonesia",
  ],
  authors: [{ name: SITE_NAME, url: SITE_GITHUB }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "portfolio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: `${SITE_NAME} · Engineering Portfolio`,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: SITE_LOCALE,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} | ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  ...(GOOGLE_VERIFICATION
    ? { verification: { google: GOOGLE_VERIFICATION } }
    : {}),
};

function structuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_NAME,
        url: SITE_URL,
        jobTitle: "Frontend Engineer",
        description: SITE_DESCRIPTION,
        sameAs: [SITE_GITHUB, SITE_INSTAGRAM],
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Tarumanagara University",
        },
        worksFor: {
          "@type": "Organization",
          name: "CarbonEthics",
          url: "https://www.carbonethics.co/",
        },
        knowsAbout: [
          "TypeScript",
          "React",
          "Next.js",
          "Tailwind CSS",
          "Web Performance",
          "Systems Architecture",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${SITE_NAME} · Engineering Portfolio`,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        author: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}

const SPLASH_BOOT_SCRIPT = `(function(){try{if(window.location.pathname.indexOf("/admin")===0)return;if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.documentElement.classList.add("splash-pending");window.setTimeout(function(){document.documentElement.classList.remove("splash-pending");},2500);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${hankenGrotesk.variable} ${jetbrainsMono.variable} ${newsreader.variable} scroll-smooth antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-[#FFFFFF] text-[#111111] selection:bg-[#111111] selection:text-[#FFFFFF]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[4px] focus:bg-[#111111] focus:px-4 focus:py-2 focus:font-sans focus:text-xs focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        <PortfolioProvider>
          <SplashProvider>
            <Navbar />
            {children}
          </SplashProvider>
        </PortfolioProvider>
        <WeightedScroll />
        <ScrollMemory />
        <CustomCursor />
      </body>
    </html>
  );
}

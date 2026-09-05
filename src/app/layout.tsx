import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
  title: "Joshua Abdiel — Frontend Engineer & Information Systems",
  description:
    "Personal engineering portfolio and technical dossier of Joshua Abdiel. Frontend engineer and Information Systems student at Universitas Tarumanagara, currently building climate-tech interfaces at CarbonEthics.",
  keywords: [
    "Joshua Abdiel",
    "Frontend Engineer",
    "Information Systems",
    "Universitas Tarumanagara",
    "CarbonEthics",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
  ],
  authors: [{ name: "Joshua Abdiel", url: "https://github.com/SwithinHalee" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#FFFFFF] text-[#111111] selection:bg-[#111111] selection:text-[#FFFFFF]">
        {children}
      </body>
    </html>
  );
}
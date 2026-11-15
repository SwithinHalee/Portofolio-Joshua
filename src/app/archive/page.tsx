"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  DownloadSimple,
  GithubLogo,
  Globe,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { Colophon } from "@/components/colophon";

interface ArchiveEntry {
  year: string;
  title: string;
  category: string;
  context: string;
  tech: string[];
  link?: string;
  github?: string;
  download?: string;
  slug?: string;
}

const ARCHIVE_ITEMS: ArchiveEntry[] = [
  {
    year: "2026",
    title: "CarbonEthics Web Platform",
    category: "Climate Tech / Web Platform",
    context: "CarbonEthics (Internship)",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "TanStack Query", "REST API"],
    link: "https://www.carbonethics.co/",
    slug: "carbonethics-platform",
  },
  {
    year: "2026",
    title: "StatShark War Thunder Exporter",
    category: "Desktop Utility / Direct API Automation",
    context: "Open Source Tool",
    tech: ["Python", "Tkinter", "curl_cffi", "WebSockets / CDP", "PyInstaller", "CSV / JSON"],
    github: "https://github.com/SwithinHalee/statshark-exporter",
    slug: "statshark-exporter",
  },
  {
    year: "2026",
    title: "@SwithinHalee YouTube Lab",
    category: "Content Creation / Defense & Armored Media",
    context: "YouTube Channel",
    tech: ["Content Creation", "Video Editing", "YouTube", "Research", "Scripting"],
    link: "https://www.youtube.com/@SwithinHalee",
    slug: "swithinhalee-youtube",
  },
  {
    year: "2026",
    title: "Xpense Ledger",
    category: "Mobile / Local-first Finance",
    context: "Open Source Tool",
    tech: ["Flutter", "Dart", "Provider (MVVM)", "SQLite", "Frankfurter API", "fl_chart"],
    link: "https://youtube.com/shorts/I1ZCUK5RzLQ?feature=share",
    github: "https://github.com/SwithinHalee/Xpense",
    slug: "xpense-ledger",
  },
  {
    year: "2025",
    title: "PokeAPI Virtual Explorer",
    category: "Data Caching & Visualization",
    context: "Engineering Prototype",
    tech: ["React", "TypeScript", "TanStack Query", "PokeAPI", "Tailwind CSS"],
    link: "https://pokemon-app-sigma-blond.vercel.app/",
    github: "https://github.com/SwithinHalee/pokemon-app",
    download: "https://github.com/SwithinHalee/pokemon-app/releases/download/v1.0.0/Pokedex.apk",
    slug: "pokemon-explorer",
  },
  {
    year: "2025",
    title: "GNS3 Network Topology & Data Sharing Simulation",
    category: "Systems & Network Architecture",
    context: "UNTAR Systems Lab",
    tech: ["GNS3", "Computer Networks", "Packet Routing", "VLANs", "Wireshark"],
    github: "https://github.com/SwithinHalee/Data-Sharing-GNS3",
    slug: "gns3-data-sharing",
  },
  {
    year: "2024",
    title: "Enterprise Information Systems Architecture",
    category: "Academic Systems Analysis",
    context: "Tarumanagara University",
    tech: ["UML", "Database Normalization", "System Modeling"],
  },
  {
    year: "2023",
    title: "Relational Database Schema Design Labs",
    category: "Database Engineering",
    context: "UNTAR Academic Track",
    tech: ["PostgreSQL", "SQL Queries", "Entity-Relationship Diagrams"],
  },
];

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ARCHIVE_ITEMS.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.year.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.context.toLowerCase().includes(q) ||
      item.tech.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]">
      <main id="main-content" className="flex-1 pt-20 pb-20 sm:pt-24 sm:pb-24 xl:pt-14 xl:pb-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          {/* Back Link */}
          <div className="mb-7 sm:mb-10">
            <Link
              href="/"
              className="link-hug inline-flex min-h-[36px] items-center gap-2 rounded-[2px] -mx-1.5 px-1.5 font-sans text-xs font-medium text-[#525252]"
            >
              <ArrowLeft size={13} weight="bold" />
              <span>Return to Portfolio Home</span>
            </Link>
          </div>

          {/* Header */}
          <div className="border-b border-[#EAEAEA] pb-7 sm:pb-10 mb-7 sm:mb-12">
            <h1
              className="text-[2rem] leading-[1.08] sm:text-5xl font-serif text-[#111111] tracking-[-0.03em] mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Complete Engineering Archive
            </h1>

            <p className="text-sm leading-relaxed sm:text-base text-[#555555] max-w-2xl mb-6 sm:mb-8 font-sans">
              An exhaustive catalog of production platforms, open-source repositories, university
              systems research, and technical explorations spanning 2023 to present.
            </p>

            {/* Filter Search Input (client-side only, nothing is sent or stored) */}
            <div className="relative w-full sm:max-w-md">
              <label htmlFor="archive-filter" className="sr-only">
                Filter archive entries by keyword, technology, or year
              </label>
              <input
                id="archive-filter"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword, tech, or year..."
                aria-label="Filter archive entries"
                aria-describedby="archive-result-count"
                autoComplete="off"
                className="w-full rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] py-2.5 pl-10 pr-10 text-base sm:text-sm font-sans text-[#111111] placeholder:text-[#555555] focus:border-[#111111] focus:outline-none"
              />
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#616161]">
                <MagnifyingGlass size={15} weight="bold" />
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear filter"
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-[#616161] hover:text-[#111111] transition-colors"
                >
                  <X size={15} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Result Count */}
          <div
            id="archive-result-count"
            aria-live="polite"
            className="mb-4 font-sans text-xs uppercase tracking-wider text-[#525252]"
          >
            Showing {filtered.length} of {ARCHIVE_ITEMS.length}{" "}
            {ARCHIVE_ITEMS.length === 1 ? "entry" : "entries"}
            {searchQuery.trim() && (
              <span className="text-[#525252]">
                {" "}
                · filtered by &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
          </div>

          {/* Mobile Stacked Archive List (< 640px) */}
          {filtered.length > 0 && (
            <div className="sm:hidden divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
              {filtered.map((item) => {
                const hasActions = Boolean(item.slug || item.github || item.link || item.download);
                return (
                  <article key={item.title} className="py-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-medium tracking-wider text-[#525252]">
                        {item.year}
                      </span>
                      <span className="truncate text-right font-mono text-[11px] text-[#616161]">
                        {item.context}
                      </span>
                    </div>

                    <h2 className="font-sans text-[15px] font-medium leading-snug text-[#111111]">
                      {item.slug ? (
                        <Link
                          href={`/work/${item.slug}`}
                          className="link-hug-inline inline rounded-[2px]"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h2>

                    <p className="mt-1 font-sans text-xs leading-relaxed text-[#555555]">
                      {item.category}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-[#111111] border border-[#111111] px-2 py-1 text-[11px] leading-none font-sans text-[#FFFFFF]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {hasActions && (
                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        {item.slug && (
                          <Link
                            href={`/work/${item.slug}`}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[4px] border border-[#111111] bg-[#FFFFFF] px-3 py-1.5 font-mono text-[11px] font-medium text-[#111111] active:scale-[0.98]"
                          >
                            <span>Case Study</span>
                            <ArrowUpRight size={12} weight="bold" />
                          </Link>
                        )}
                        {item.github && (
                          <a
                            href={item.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-2.5 py-1.5 font-mono text-[11px] text-[#4A4A4A] active:scale-[0.98]"
                          >
                            <GithubLogo size={14} weight="regular" />
                            <span>Repo</span>
                          </a>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-2.5 py-1.5 font-mono text-[11px] text-[#4A4A4A] active:scale-[0.98]"
                          >
                            <Globe size={14} weight="regular" />
                            <span>Live</span>
                          </a>
                        )}
                        {item.download && (
                          <a
                            href={item.download}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-2.5 py-1.5 font-mono text-[11px] text-[#4A4A4A] active:scale-[0.98]"
                          >
                            <DownloadSimple size={14} weight="regular" />
                            <span>APK</span>
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* Desktop & Tablet Tabular Archive Table (>= 640px) */}
          {filtered.length > 0 && (
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left font-sans text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-[#EAEAEA] text-[#525252] text-xs uppercase tracking-wider">
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Year
                    </th>
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Project / Entry
                    </th>
                    <th scope="col" className="py-3 pr-4 font-medium hidden md:table-cell">
                      Context
                    </th>
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Stack
                    </th>
                    <th scope="col" className="py-3 font-medium text-right">
                      Links
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {filtered.map((item) => (
                    <tr
                      key={item.title}
                      className="hover:bg-[#FBFBFA] transition-colors group"
                    >
                      <td className="py-4 pr-4 font-mono text-xs text-[#525252] font-medium align-top whitespace-nowrap">
                        {item.year}
                      </td>

                      <td className="py-4 pr-4 align-top">
                        <div className="font-sans font-medium text-sm text-[#111111]">
                          {item.slug ? (
                            <Link href={`/work/${item.slug}`} className="link-hug-inline inline rounded-[2px]">
                              {item.title}
                            </Link>
                          ) : (
                            item.title
                          )}
                        </div>
                        <div className="text-xs text-[#555555] font-sans mt-0.5">
                          {item.category}
                        </div>
                        {/* Tablet fallback: show context below category before md breakpoint */}
                        <div className="mt-1 text-xs text-[#616161] font-mono md:hidden">
                          {item.context}
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-[#555555] align-top hidden md:table-cell">
                        {item.context}
                      </td>

                      <td className="py-4 pr-4 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {item.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-[#111111] border border-[#111111] px-2 py-1 text-xs font-sans text-[#FFFFFF]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 text-right align-top">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.slug && (
                            <Link
                              href={`/work/${item.slug}`}
                              className="link-hug rounded-[2px] text-[#111111] font-medium text-xs whitespace-nowrap"
                            >
                              Case Study
                            </Link>
                          )}
                          {item.github && (
                            <a
                              href={item.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-[2px] p-1 text-[#616161]"
                              title="GitHub Repo"
                              aria-label={`${item.title} GitHub repository`}
                            >
                              <GithubLogo size={14} weight="regular" />
                            </a>
                          )}
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-[2px] p-1 text-[#616161]"
                              title="Live Site"
                              aria-label={`${item.title} live link`}
                            >
                              <Globe size={14} weight="regular" />
                            </a>
                          )}
                          {item.download && (
                            <a
                              href={item.download}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-[2px] p-1 text-[#616161]"
                              title="Download APK"
                              aria-label={`Download ${item.title} APK`}
                            >
                              <DownloadSimple size={14} weight="regular" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] px-5 py-10 sm:px-6 sm:py-12 text-center">
              <p className="font-sans text-sm text-[#111111] font-medium mb-1">
                No entries match &ldquo;{searchQuery.trim()}&rdquo;
              </p>
              <p className="font-sans text-xs text-[#555555] mb-4">
                Try a project title, year, category, or stack keyword.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="min-h-[36px] rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] px-4 py-2 font-sans text-xs font-medium text-[#111111] hover:bg-[#F0F0EE] transition-colors active:scale-[0.98]"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </main>

      <Colophon />
    </div>
  );
}
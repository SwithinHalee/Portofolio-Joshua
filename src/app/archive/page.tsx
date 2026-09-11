"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, DownloadSimple, GithubLogo, Globe, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Navbar } from "@/components/navbar";
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
    link: "https://web-staging.carbonethics.co/",
    slug: "carbonethics-platform",
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
    context: "Universitas Tarumanagara",
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
      <Navbar />

      <main id="main-content" className="flex-1 pt-8 md:pt-12 pb-24 md:pb-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          {/* Back Link */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#616161] hover:text-[#111111] transition-colors"
            >
              <ArrowLeft size={13} weight="bold" />
              <span>Return to Portfolio Home</span>
            </Link>
          </div>

          {/* Header */}
          <div className="border-b border-[#EAEAEA] pb-10 mb-12">
            <div className="flex items-center gap-2 font-mono text-xs text-[#616161] uppercase tracking-wider mb-3">
              <span>DOSSIER ARCHIVE</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>COMPLETE CHRONOLOGICAL RECORD</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-serif text-[#111111] tracking-[-0.03em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Complete Engineering Archive
            </h1>

            <p className="text-base text-[#555555] max-w-2xl mb-8">
              An exhaustive catalog of production platforms, open-source repositories, university
              systems research, and technical explorations spanning 2023 to present.
            </p>

            {/* Filter Search Input — client-side only, nothing is sent or stored */}
            <div className="relative max-w-md">
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
                className="w-full rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] py-2.5 pl-9 pr-9 text-xs font-mono text-[#111111] placeholder:text-[#616161] focus:border-[#111111] focus:outline-none"
              />
              <MagnifyingGlass
                size={14}
                weight="bold"
                className="absolute left-3 top-3 text-[#616161]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear filter"
                  className="absolute right-2.5 top-2.5 text-[#616161] hover:text-[#111111] transition-colors"
                >
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>

          {/* Result Count */}
          <div
            id="archive-result-count"
            aria-live="polite"
            className="mb-4 font-mono text-[11px] uppercase tracking-wider text-[#616161]"
          >
            Showing {filtered.length} of {ARCHIVE_ITEMS.length}{" "}
            {ARCHIVE_ITEMS.length === 1 ? "entry" : "entries"}
            {searchQuery.trim() && (
              <span className="text-[#616161]">
                {" "}
                — filtered by &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
          </div>

          {/* Tabular Archive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-[#616161] text-[11px] uppercase tracking-wider">
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Year
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Project / Entry
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal hidden md:table-cell">
                    Context
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal hidden sm:table-cell">
                    Stack
                  </th>
                  <th scope="col" className="py-3 font-normal text-right">
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
                    <td className="py-4 pr-4 text-[#616161] font-medium align-top whitespace-nowrap">
                      {item.year}
                    </td>

                    <td className="py-4 pr-4 align-top">
                      <div className="font-sans font-medium text-sm text-[#111111] group-hover:text-[#444444]">
                        {item.slug ? (
                          <Link href={`/work/${item.slug}`} className="hover:underline">
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </div>
                      <div className="text-[11px] text-[#616161] font-mono mt-0.5">
                        {item.category}
                      </div>
                      {/* Mobile fallback: context + stack (columns hidden on small screens) */}
                      <div className="mt-1.5 text-[11px] text-[#666666] sm:hidden">
                        {item.context}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1 sm:hidden">
                        {item.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-1.5 py-0.5 text-[10px] text-[#666666]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 pr-4 text-[#666666] align-top hidden md:table-cell">
                      {item.context}
                    </td>

                    <td className="py-4 pr-4 align-top hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {item.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-1.5 py-0.5 text-[10px] text-[#666666]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 text-right align-top">
                      <div className="flex items-center justify-end gap-3">
                        {item.slug && (
                          <Link
                            href={`/work/${item.slug}`}
                            className="text-[#111111] font-medium hover:underline text-[11px]"
                          >
                            Case Study
                          </Link>
                        )}
                        {item.github && (
                          <a
                            href={item.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#616161] hover:text-[#111111]"
                            title="GitHub Repo"
                          >
                            <GithubLogo size={14} weight="regular" />
                          </a>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#616161] hover:text-[#111111]"
                            title="Live Site"
                          >
                            <Globe size={14} weight="regular" />
                          </a>
                        )}
                        {item.download && (
                          <a
                            href={item.download}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#616161] hover:text-[#111111]"
                            title="Download APK"
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

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] px-6 py-12 text-center">
                <p className="font-mono text-xs text-[#111111] font-medium mb-1">
                  No entries match &ldquo;{searchQuery.trim()}&rdquo;
                </p>
                <p className="font-mono text-[11px] text-[#616161] mb-4">
                  Try a project title, year, category, or stack keyword.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] px-4 py-2 font-mono text-[11px] text-[#111111] hover:bg-[#F0F0EE] transition-colors"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Colophon />
    </div>
  );
}
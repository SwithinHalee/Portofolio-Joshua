"use client";

import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Code,
  PlugsConnected,
  ShareNetwork,
  TerminalWindow,
} from "@phosphor-icons/react";
import { TECH_CATEGORIES, TechCategory } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import {
  Reveal,
  StaggerContainer,
  StaggerItem,
  useStickyBottomPin,
} from "@/components/motion-wrapper";

type SkillEntry = TechCategory["skills"][number];

const VSCODE_SVG_URL =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg";

/** Brand marks that default to pure/near black and require light ink on `#141414`. */
const LIGHT_ON_DARK_SLUGS = new Set([
  "nextdotjs",
  "github",
  "vercel",
  "express",
  "prisma",
  "shadcnui",
  "drizzle",
  "apple",
  "notion",
  "linear",
  "markdown",
]);

const SKILL_URL_PATTERNS: [string, string][] = [
  ["typescript", "https://www.typescriptlang.org/docs/"],
  ["next.js", "https://nextjs.org/docs"],
  ["nextdotjs", "https://nextjs.org/docs"],
  ["react", "https://react.dev/"],
  ["tailwind", "https://tailwindcss.com/docs"],
  ["tanstack", "https://tanstack.com/query/latest"],
  ["framer", "https://motion.dev/docs"],
  ["restful", "https://developer.mozilla.org/en-US/docs/Web/HTTP"],
  ["rest api", "https://developer.mozilla.org/en-US/docs/Web/HTTP"],
  ["node", "https://nodejs.org/en/docs"],
  ["postgresql", "https://www.postgresql.org/docs/"],
  ["gns3", "https://docs.gns3.com/"],
  ["network", "https://docs.gns3.com/"],
  ["vs code", "https://code.visualstudio.com/docs"],
  ["vscode", "https://code.visualstudio.com/docs"],
  ["postman", "https://www.postman.com/"],
  ["github", "https://docs.github.com/en"],
  ["git", "https://git-scm.com/doc"],
  ["figma", "https://www.figma.com/"],
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function scrollToFile(idx: number): void {
  document
    .getElementById(`dossier-file-${idx}`)
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resolveSlugUrl(slug: string): string {
  if (slug === "vscode" || slug === "visualstudiocode") {
    return VSCODE_SVG_URL;
  }
  if (LIGHT_ON_DARK_SLUGS.has(slug)) {
    return `https://cdn.simpleicons.org/${slug}/FFFFFF`;
  }
  return `https://cdn.simpleicons.org/${slug}`;
}

function skillFallbackKind(label: string, kbd?: string): "vscode" | "rest" | "network" | "terminal" {
  const haystack = `${label} ${kbd ?? ""}`.toLowerCase();
  if (
    haystack.includes("vs code") ||
    haystack.includes("vscode") ||
    kbd?.trim().toUpperCase() === "IDE"
  ) {
    return "vscode";
  }
  if (haystack.includes("rest") || haystack.includes("api") || haystack.includes("http")) {
    return "rest";
  }
  if (haystack.includes("network") || haystack.includes("gns3") || haystack.includes("tcp")) {
    return "network";
  }
  return "terminal";
}

function resolveSkillUrl(skill: SkillEntry): string | null {
  const explicit = skill.url?.trim() ?? "";
  if (/^https?:\/\//i.test(explicit)) {
    return explicit;
  }

  const haystack = [skill.name, skill.kbd ?? "", ...(skill.logos ?? [])]
    .join(" ")
    .toLowerCase();

  for (const [needle, docsUrl] of SKILL_URL_PATTERNS) {
    if (haystack.includes(needle)) {
      return docsUrl;
    }
  }
  return null;
}

/**
 * Containerless brand mark for a skill: full color visible by default with a
 * transparent background and automatic light tinting for dark-only brand marks.
 */
function SkillMark({
  logos,
  label,
  kbd,
  wideSlot = false,
}: {
  logos?: string[];
  label: string;
  kbd?: string;
  wideSlot?: boolean;
}) {
  const [failed, setFailed] = useState<Record<string, true>>({});
  const [vscodeFailed, setVscodeFailed] = useState(false);
  const live = (logos ?? []).map((s) => s.trim().toLowerCase()).filter((s) => s && !failed[s]);
  const slotWidthClass = wideSlot ? "w-12" : "w-6";
  const slotJustifyClass = wideSlot ? "justify-center" : "justify-start";

  if (live.length === 0) {
    const kind = skillFallbackKind(label, kbd);
    return (
      <span
        aria-hidden="true"
        className={`inline-flex ${slotWidthClass} shrink-0 items-center ${slotJustifyClass} transition-transform duration-200 group-hover/skill:scale-105`}
      >
        {kind === "vscode" ? (
          vscodeFailed ? (
            <Code
              size={20}
              weight="duotone"
              className="text-[#38BDF8] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:text-[#111111] group-focus-visible/skill:text-[#111111]"
            />
          ) : (
            <img
              src={VSCODE_SVG_URL}
              alt=""
              width={20}
              height={20}
              draggable={false}
              loading="lazy"
              className="h-5 w-5 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:brightness-0 group-focus-visible/skill:brightness-0"
              onError={() => setVscodeFailed(true)}
            />
          )
        ) : kind === "rest" ? (
          <PlugsConnected
            size={20}
            weight="duotone"
            className="text-[#34D399] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:text-[#111111] group-focus-visible/skill:text-[#111111]"
          />
        ) : kind === "network" ? (
          <ShareNetwork
            size={20}
            weight="duotone"
            className="text-[#38BDF8] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:text-[#111111] group-focus-visible/skill:text-[#111111]"
          />
        ) : (
          <TerminalWindow
            size={20}
            weight="duotone"
            className="text-[#4ADE80] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:text-[#111111] group-focus-visible/skill:text-[#111111]"
          />
        )}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex ${slotWidthClass} shrink-0 items-center ${slotJustifyClass} gap-2`}
      aria-hidden="true"
    >
      {live.map((slug) => (
        <img
          key={slug}
          src={resolveSlugUrl(slug)}
          alt=""
          width={20}
          height={20}
          draggable={false}
          loading="lazy"
          className="h-5 w-5 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:scale-105 group-hover/skill:brightness-0 group-focus-visible/skill:brightness-0"
          onError={() => setFailed((prev) => ({ ...prev, [slug]: true }))}
        />
      ))}
    </span>
  );
}

export function Dossier() {
  const { data } = usePortfolio();
  const categories = data.techCategories ?? TECH_CATEGORIES;
  const instrumentCount = categories.reduce((n, c) => n + c.skills.length, 0);
  const sectionRef = useRef<HTMLElement>(null);

  // Keep the sticky pin exact: the section stays pinned showing its bottom
  // slice only after the reader has scrolled through its full height. The
  // offset is measured live so the whole dossier is readable before
  // Principles slides over it.
  useStickyBottomPin(sectionRef, categories);

  return (
    <section ref={sectionRef} id="dossier" className="dark-section pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#222222] bg-[#0E0E0E] text-[#FFFFFF] md:sticky md:top-[calc(100dvh-995px)] lg:top-[calc(100dvh-943px)] z-0">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <h2
              className="text-3xl sm:text-4xl font-serif text-white tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Technical Stack & Tooling Discipline
            </h2>
            <p className="text-sm sm:text-base text-[#B3B3B3] font-sans">
              A transparent inventory of frameworks, libraries, systems, and workflow utilities
              leveraged in day-to-day software development and system architecture.
            </p>
          </div>
        </Reveal>

        {/* Meta ledger */}
        <Reveal delay={0.05}>
          <dl className="mb-12 grid grid-cols-3 border-y border-[#242424] font-mono text-xs">
            <div className="py-3 pr-4">
              <dt className="block font-sans text-[11px] font-medium uppercase tracking-wider text-[#B3B3B3]">Files</dt>
              <dd className="font-semibold text-white">{pad(categories.length)} categories</dd>
            </div>
            <div className="border-l border-[#242424] px-4 py-3">
              <dt className="block font-sans text-[11px] font-medium uppercase tracking-wider text-[#B3B3B3]">Instruments</dt>
              <dd className="font-semibold text-white">{pad(instrumentCount)} entries</dd>
            </div>
            <div className="border-l border-[#242424] py-3 pl-4">
              <dt className="block font-sans text-[11px] font-medium uppercase tracking-wider text-[#B3B3B3]">Audit</dt>
              <dd className="font-semibold text-white">2026 edition</dd>
            </div>
          </dl>
        </Reveal>

        {/* Mobile file index */}
        <div
          role="navigation"
          aria-label="Dossier files"
          className="mb-8 flex gap-2 overflow-x-auto pb-1 md:hidden"
        >
          {categories.map((category, i) => (
            <button
              key={category.title}
              type="button"
              onClick={() => scrollToFile(i)}
              className="inline-flex shrink-0 items-center gap-2 rounded-[4px] border border-[#2A2A2A] bg-[#141414] px-3 py-2 font-sans text-xs font-medium text-[#D4D4D4] transition-colors hover:border-[#3D3D3D] hover:text-white active:scale-[0.98]"
            >
              <span className="font-mono text-[#A3A3A3]">{pad(i + 1)}</span>
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Sticky filing index */}
          <div className="hidden md:col-span-4 md:block">
            <div className="sticky top-24">
              <ol aria-label="Category index" className="border-t border-[#242424]">
                {categories.map((category, i) => (
                  <li key={category.title} className="border-b border-[#242424]">
                    <button
                      type="button"
                      onClick={() => scrollToFile(i)}
                      className="group flex w-full items-center gap-4 py-4 text-left transition-colors"
                    >
                      <span
                        className="w-8 shrink-0 font-serif text-[28px] leading-none tabular-nums text-[#A3A3A3] transition-colors group-hover:text-white"
                        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
                      >
                        {pad(i + 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-sans text-xs font-semibold uppercase tracking-wider leading-snug text-[#E5E5E5] group-hover:text-white">
                          {category.title}
                        </span>
                        <span className="mt-0.5 block font-sans text-xs leading-snug text-[#A3A3A3]">
                          {category.skills.length} instruments
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* File ledgers */}
          <StaggerContainer className="md:col-span-8 flex flex-col gap-8">
            {categories.map((category, i) => {
              const hasWideMark = category.skills.some(
                (s) => (s.logos ?? []).filter(Boolean).length > 1
              );

              return (
                <StaggerItem key={category.title}>
                  <article
                    id={`dossier-file-${i}`}
                    className="scroll-mt-28 rounded-[8px] border border-[#242424] bg-[#141414] transition-colors duration-150 hover:border-[#383838]"
                  >
                    <div className="p-6 sm:p-7">
                      <div className="mb-2 flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="font-serif text-xl leading-none tabular-nums text-[#A3A3A3]"
                          style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
                        >
                          {pad(i + 1)}
                        </span>
                        <h3 className="font-sans text-sm font-semibold uppercase tracking-wide leading-none text-white">
                          {category.title}
                        </h3>
                      </div>
                      <p className="mb-6 font-sans text-[13px] leading-relaxed text-[#B3B3B3]">
                        {category.description}
                      </p>

                      {/* Ledger rows */}
                      <ol>
                        {category.skills.map((skill) => {
                          const docsUrl = resolveSkillUrl(skill);
                          const rowClass =
                            "group/skill grid grid-cols-[auto_1fr_auto] items-center gap-x-3.5 px-2.5 -mx-2.5 py-3 rounded-[6px]";
                          const rowBody = (
                            <>
                              <SkillMark
                                logos={skill.logos}
                                label={skill.name}
                                kbd={skill.kbd}
                                wideSlot={hasWideMark}
                              />
                              <span className="min-w-0">
                                <span className="block truncate font-sans text-[13px] font-medium text-white transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:text-[#111111] group-focus-visible/skill:text-[#111111]">
                                  {skill.name}
                                </span>
                                <span className="mt-0.5 block font-sans text-xs sm:text-[13px] leading-relaxed text-[#B3B3B3] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:text-[#4A4A4A] group-focus-visible/skill:text-[#4A4A4A]">
                                  {skill.detail}
                                </span>
                              </span>
                              <span className="inline-flex shrink-0 items-center gap-2">
                                {skill.kbd && (
                                  <kbd className="rounded border border-[#2A2A2A] bg-[#202020] px-2 py-0.5 font-mono text-[11px] text-[#E5E5E5] shadow-none transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:border-[#111111]">
                                    {skill.kbd}
                                  </kbd>
                                )}
                                {docsUrl && (
                                  <ArrowUpRight
                                    size={13}
                                    weight="bold"
                                    aria-hidden="true"
                                    className="text-[#787774] opacity-55 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/skill:opacity-100 group-hover/skill:text-[#111111] group-focus-visible/skill:opacity-100 group-focus-visible/skill:text-[#111111] group-hover/skill:translate-x-0.5 group-hover/skill:-translate-y-0.5"
                                  />
                                )}
                              </span>
                            </>
                          );

                          return (
                            <li
                              key={skill.name}
                              className="border-t border-[#242424] last:border-b"
                            >
                              {docsUrl ? (
                                <a
                                  href={docsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-cursor-label="Open docs"
                                  aria-label={`${skill.name} — open documentation or homepage in a new tab`}
                                  className={`${rowClass} cursor-pointer`}
                                >
                                  {rowBody}
                                </a>
                              ) : (
                                <div className={rowClass}>{rowBody}</div>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

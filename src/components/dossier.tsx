"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { TECH_CATEGORIES } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function scrollToFile(idx: number): void {
  document
    .getElementById(`dossier-file-${idx}`)
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Brand mark for a skill: official logos (grayscale, color on hover) with a
 * monogram fallback when no logo slug is set or the CDN is unreachable.
 */
function SkillMark({ logos, label, kbd }: { logos?: string[]; label: string; kbd?: string }) {
  const [failed, setFailed] = useState<Record<string, true>>({});
  const live = (logos ?? []).map((s) => s.trim().toLowerCase()).filter((s) => s && !failed[s]);

  if (live.length === 0) {
    const mono = (kbd && kbd.trim()) || label.trim().slice(0, 2).toUpperCase() || "··";
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[#2A2A2A] bg-[#1B1B1B] font-mono text-[10px] font-semibold text-[#CCCCCC]"
      >
        {mono}
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5" aria-hidden="true">
      {live.map((slug) => (
        <span
          key={slug}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#2A2A2A] bg-[#EDEDED] transition-colors group-hover/skill:border-[#3D3D3D]"
        >
          {/* Plain img: next/image refuses to optimize remote SVGs, so the
              optimizer endpoint 400s and every logo falls back to monogram. */}
          <img
            src={`https://cdn.simpleicons.org/${slug}`}
            alt=""
            width={18}
            height={18}
            draggable={false}
            loading="lazy"
            className="grayscale transition-all duration-300 group-hover/skill:grayscale-0"
            onError={() => setFailed((prev) => ({ ...prev, [slug]: true }))}
          />
        </span>
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
  // offset is measured live (content is admin-editable and responsive) so
  // the whole dossier is readable before Principles slides over it.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      if (!mq.matches) {
        el.style.top = "";
        return;
      }
      const h = Math.ceil(el.getBoundingClientRect().height);
      el.style.top = `calc(100dvh - ${h}px)`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply);
    window.addEventListener("load", apply);
    if (document.fonts) {
      document.fonts.ready.then(apply).catch(() => {});
    }
    const t = window.setTimeout(apply, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      window.removeEventListener("load", apply);
      window.clearTimeout(t);
    };
  }, [categories]);

  return (
    <section ref={sectionRef} id="dossier" className="dark-section pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#222222] bg-[#0E0E0E] text-[#FFFFFF] md:sticky md:top-[calc(100dvh-995px)] lg:top-[calc(100dvh-943px)] z-0">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#888888] uppercase tracking-wider mb-2">
              <span>04 / TECHNICAL DOSSIER</span>
              <span className="text-[#333333]">•</span>
              <span>CAPABILITY MATRIX</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-white tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Technical Stack & Tooling Discipline
            </h2>
            <p className="text-sm sm:text-base text-[#AAAAAA]">
              A transparent inventory of frameworks, libraries, systems, and workflow utilities
              leveraged in day-to-day software development and system architecture.
            </p>
          </div>
        </Reveal>

        {/* Meta ledger */}
        <Reveal delay={0.05}>
          <dl className="mb-12 grid grid-cols-3 border-y border-[#242424] font-mono text-xs">
            <div className="py-3 pr-4">
              <dt className="block text-[10px] uppercase tracking-wider text-[#9A9A9A]">Files</dt>
              <dd className="font-semibold text-white">{pad(categories.length)} categories</dd>
            </div>
            <div className="border-l border-[#242424] px-4 py-3">
              <dt className="block text-[10px] uppercase tracking-wider text-[#9A9A9A]">Instruments</dt>
              <dd className="font-semibold text-white">{pad(instrumentCount)} entries</dd>
            </div>
            <div className="border-l border-[#242424] py-3 pl-4">
              <dt className="block text-[10px] uppercase tracking-wider text-[#9A9A9A]">Audit</dt>
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
              className="inline-flex shrink-0 items-center gap-2 rounded-[4px] border border-[#2A2A2A] bg-[#141414] px-3 py-2 font-mono text-xs text-[#CCCCCC] transition-colors hover:border-[#3D3D3D] hover:text-white active:scale-[0.98]"
            >
              <span className="text-[#9A9A9A]">{pad(i + 1)}</span>
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Sticky filing index */}
          <div className="hidden md:col-span-4 md:block">
            <div className="sticky top-24">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-[#9A9A9A]">
                Filing index
              </p>
              <ol className="border-t border-[#242424]">
                {categories.map((category, i) => (
                  <li key={category.title} className="border-b border-[#242424]">
                    <button
                      type="button"
                      onClick={() => scrollToFile(i)}
                      className="group flex w-full items-baseline gap-4 py-4 text-left transition-colors"
                    >
                      <span
                        className="font-serif text-3xl text-[#3D3D3D] transition-colors group-hover:text-white"
                        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
                      >
                        {pad(i + 1)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-xs font-semibold uppercase tracking-wider text-[#CCCCCC] group-hover:text-white">
                          {category.title}
                        </span>
                        <span className="mt-0.5 block font-mono text-[11px] text-[#9A9A9A]">
                          {category.skills.length} instruments
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-[#555555]">
                Select a file number to jump to its ledger.
              </p>
            </div>
          </div>

          {/* File ledgers */}
          <StaggerContainer className="md:col-span-8 flex flex-col gap-8">
            {categories.map((category, i) => (
              <StaggerItem key={category.title}>
                <article
                  id={`dossier-file-${i}`}
                  className="scroll-mt-28 rounded-[8px] border border-[#242424] bg-[#141414] transition-colors duration-150 hover:border-[#383838]"
                >
                  {/* Folder tab */}
                  <div className="flex items-center justify-between gap-3 border-b border-[#242424] px-6 py-3 sm:px-7">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9A9A9A]">
                      File · {pad(i + 1)} / {pad(categories.length)}
                    </span>
                    <span className="rounded-[3px] border border-[#2A2A2A] bg-[#1B1B1B] px-1.5 py-0.5 font-mono text-[10px] text-[#AAAAAA]">
                      {category.skills.length} entries
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="mb-2 flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className="font-serif text-xl text-[#555555]"
                        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
                      >
                        {pad(i + 1)}
                      </span>
                      <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                        {category.title}
                      </h3>
                    </div>
                    <p className="mb-6 text-xs leading-relaxed text-[#888888]">
                      {category.description}
                    </p>

                    {/* Ledger rows */}
                    <ol>
                      {category.skills.map((skill, k) => (
                        <li
                          key={skill.name}
                          className="group/skill grid cursor-default grid-cols-[auto_auto_1fr_auto] items-center gap-x-3 border-t border-[#242424] py-3 transition-colors last:border-b hover:bg-[#181818]"
                        >
                          <span className="font-mono text-[10px] text-[#555555]">
                            {pad(i + 1)}.{pad(k + 1)}
                          </span>
                          <SkillMark logos={skill.logos} label={skill.name} kbd={skill.kbd} />
                          <span className="min-w-0">
                            <span className="block truncate font-sans text-[13px] font-medium text-white transition-colors group-hover/skill:text-[#4ADE80]">
                              {skill.name}
                            </span>
                            <span className="mt-0.5 block font-mono text-[11px] leading-relaxed text-[#999999]">
                              {skill.detail}
                            </span>
                          </span>
                          {skill.kbd ? (
                            <kbd className="shrink-0 rounded border border-[#2A2A2A] bg-[#202020] px-1.5 py-0.5 font-mono text-[10px] text-[#CCCCCC] shadow-none">
                              {skill.kbd}
                            </kbd>
                          ) : (
                            <span aria-hidden="true" />
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Protocol strip */}
        <Reveal delay={0.05}>
          <div className="mt-12 flex flex-col gap-3 border-t border-[#242424] pt-5 font-mono text-[11px] text-[#9A9A9A] sm:flex-row sm:items-center sm:justify-between">
            <span className="uppercase tracking-wider">
              Protocol — strict typing · perf budgets · hairline precision
            </span>
            <a
              href="#principles"
              className="inline-flex items-center gap-1.5 uppercase tracking-wider text-[#AAAAAA] transition-colors hover:text-white"
            >
              <span>Read the tenets</span>
              <ArrowRight size={12} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

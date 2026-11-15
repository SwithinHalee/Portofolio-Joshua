"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  DownloadSimple,
  GithubLogo,
  Globe,
  ListBullets,
  Rows,
  SlidersHorizontal,
  SquaresFour,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { PROJECTS, ProjectItem } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { Reveal } from "@/components/motion-wrapper";
import { ProjectMedia } from "@/components/project-media";
import { scrollWithWeight } from "@/components/weighted-scroll";

type ViewMode = "grid" | "detail" | "list";

const VIEW_MODES: { id: ViewMode; label: string; icon: PhosphorIcon }[] = [
  { id: "grid", label: "Bento grid", icon: SquaresFour },
  { id: "detail", label: "Detail rows", icon: Rows },
  { id: "list", label: "Index list", icon: ListBullets },
];

const PROJECTS_PER_PAGE = 5;

function projectYear(project: ProjectItem): string {
  return project.caseStudy.timeline.match(/\d{4}/)?.[0] ?? "-";
}

function padTwo(n: number): string {
  return String(n).padStart(2, "0");
}

function ProjectsPagination({
  currentPage,
  totalPages,
  onPageChange,
  placement,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  placement: "bottom" | "inline";
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);
  const isInline = placement === "inline";
  const buttonHeight = isInline ? "h-7 sm:h-8" : "h-9 sm:h-8";
  const pageSize = isInline ? "h-7 min-w-7 sm:h-8 sm:min-w-8" : "h-9 min-w-9 sm:h-8 sm:min-w-8";
  const navPad = isInline ? "px-1.5 sm:px-2.5" : "px-3 sm:px-2.5";

  return (
    <nav
      aria-label={`Projects pagination (${placement})`}
      className={
        isInline
          ? "flex shrink-0 items-center font-sans"
          : "flex flex-wrap items-center justify-center sm:justify-end gap-2 mt-10 border-t border-[#EAEAEA] pt-6 font-sans"
      }
    >
      <div className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous projects page"
          className={`inline-flex ${buttonHeight} items-center gap-1 rounded-[14px] border-0 bg-transparent ${navPad} font-mono text-xs text-[#6B6B6B] transition-colors hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-[#6B6B6B] active:scale-[0.98] cursor-pointer`}
        >
          <CaretLeft size={12} weight="bold" aria-hidden="true" />
          <span className={isInline ? "hidden sm:inline" : undefined}>Prev</span>
        </button>

        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <button
              key={`${placement}-page-${page}`}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={`inline-flex ${pageSize} items-center justify-center rounded-[14px] border-0 px-2 sm:px-2.5 font-mono text-xs tabular-nums transition-colors active:scale-[0.98] cursor-pointer ${
                isCurrent
                  ? "bg-[#111111] font-semibold text-[#FFFFFF]"
                  : "bg-transparent text-[#6B6B6B] hover:text-[#111111]"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next projects page"
          className={`inline-flex ${buttonHeight} items-center gap-1 rounded-[14px] border-0 bg-transparent ${navPad} font-mono text-xs text-[#6B6B6B] transition-colors hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-[#6B6B6B] active:scale-[0.98] cursor-pointer`}
        >
          <span className={isInline ? "hidden sm:inline" : undefined}>Next</span>
          <CaretRight size={12} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

export function Projects() {
  const { data } = usePortfolio();
  const projects = data.projects ?? PROJECTS;
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [filterTag, setFilterTag] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedBlueprints, setExpandedBlueprints] = useState<string[]>([]);

  const scrollToProjectsTop = () => {
    scrollWithWeight(() => {
      const el = sectionRef.current;
      if (!el) return window.scrollY;
      return Math.max(0, Math.ceil(el.getBoundingClientRect().top + window.scrollY) + 1);
    });
  };

  const handleViewModeChange = (nextMode: ViewMode) => {
    if (nextMode === viewMode) return;
    setViewMode(nextMode);
    setExpandedBlueprints([]);
    scrollToProjectsTop();
  };

  const handleFilterTagChange = (nextTag: string) => {
    if (nextTag === filterTag) return;
    setFilterTag(nextTag);
    setCurrentPage(1);
    setExpandedBlueprints([]);
    scrollToProjectsTop();
  };

  const handleBlueprintToggle = (projectId: string, expanded: boolean) => {
    setExpandedBlueprints((prev) =>
      expanded
        ? prev.includes(projectId)
          ? prev
          : [...prev, projectId]
        : prev.filter((id) => id !== projectId)
    );
  };

  const allTags = ["ALL", "Next.js", "TypeScript", "React", "Python", "Tailwind CSS", "Systems / GNS3"];

  const filteredProjects =
    filterTag === "ALL"
      ? projects
      : projects.filter((p) =>
          filterTag === "Systems / GNS3"
            ? p.tags.includes("GNS3") || p.tags.includes("Computer Networks")
            : p.tags.includes(filterTag)
        );

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const handlePageChange = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    if (clamped === safePage) return;
    setCurrentPage(clamped);
    setExpandedBlueprints([]);
    scrollToProjectsTop();
  };

  const hasExpandedBlueprint = expandedBlueprints.some((id) =>
    paginatedProjects.some((p) => p.id === id)
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="pb-24 md:pb-28 border-b border-[#EAEAEA] bg-[#FFFFFF]"
    >
      {/* Sticky Section Header: Title, Layout Switcher & Category Filter */}
      <div className="sticky top-0 z-20 bg-[#FFFFFF]/95 backdrop-blur-md pt-14 sm:pt-16 xl:pt-10 pb-3">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <div className="flex items-end justify-between gap-3 sm:gap-4 mb-3">
              <h2
                className="text-[24px] leading-[1.15] sm:text-4xl font-serif text-[#111111] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                Architected for Performance & Utility
              </h2>

              <div
                role="group"
                aria-label="Change projects layout"
                className="flex shrink-0 items-center gap-2 sm:gap-2.5 pb-0.5"
              >
                {VIEW_MODES.map((mode) => {
                  const isSelected = viewMode === mode.id;
                  const Icon = mode.icon;
                  const activeWeight = mode.id === "list" ? "bold" : "fill";
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleViewModeChange(mode.id)}
                      aria-pressed={isSelected}
                      title={mode.label}
                      aria-label={`${mode.label} layout`}
                      className={`inline-flex items-center justify-center p-1 border-0 bg-transparent shadow-none transition-colors active:scale-[0.95] cursor-pointer ${
                        isSelected
                          ? "text-[#111111]"
                          : "text-[#787774] hover:text-[#111111]"
                      }`}
                    >
                      <Icon
                        size={18}
                        weight={isSelected ? activeWeight : "regular"}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="min-w-0 flex-1">
                <LayoutGroup id="project-category-tabs">
                  <motion.div
                    layoutScroll
                    role="group"
                    aria-label="Filter projects by technology"
                    className="flex max-w-full scroll-auto items-center gap-1 overflow-x-auto whitespace-nowrap px-1 -mx-1 py-1.5 -my-1.5 font-sans"
                  >
                    {allTags.map((tag) => {
                      const isSelected = filterTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleFilterTagChange(tag)}
                          aria-pressed={isSelected}
                          aria-label={`Show ${tag === "ALL" ? "all projects" : `${tag} projects`}`}
                          className={`group/tab relative shrink-0 px-3.5 py-1.5 border-0 bg-transparent rounded-[14px] text-[13px] leading-4 tracking-[-0.01em] font-medium transition-colors duration-200 cursor-pointer ${
                            isSelected
                              ? "text-[#FFFFFF]"
                              : "text-[#6B6B6B] hover:text-[#111111]"
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="project-category-pill"
                              aria-hidden="true"
                              style={{ borderRadius: 14 }}
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : {
                                      type: "spring",
                                      stiffness: 380,
                                      damping: 32,
                                      mass: 0.8,
                                    }
                              }
                              className="pointer-events-none absolute inset-0 bg-[#111111] rounded-[14px]"
                            />
                          )}
                          <span className="relative z-10 inline-block transition-transform duration-150 group-active/tab:scale-[0.97]">
                            {tag}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                </LayoutGroup>
              </div>

              <ProjectsPagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                placement="inline"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 sm:px-8 pt-8 md:pt-10">
        {/* Layout & Category-aware Results Transition */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${viewMode}-${filterTag}-${safePage}`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.16,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={
              viewMode === "grid"
                ? `grid grid-cols-12 gap-6 ${hasExpandedBlueprint ? "items-start" : "items-stretch"}`
                : viewMode === "detail"
                  ? "flex flex-col gap-6"
                  : "flex flex-col border-t border-[#EAEAEA]"
            }
          >
            {paginatedProjects.map((project, idx) =>
              viewMode === "grid" ? (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  stretchHeight={!hasExpandedBlueprint}
                  onBlueprintToggle={handleBlueprintToggle}
                />
              ) : viewMode === "detail" ? (
                <ProjectDetailRow key={project.id} project={project} index={startIndex + idx} />
              ) : (
                <ProjectListRow key={project.id} project={project} index={startIndex + idx} />
              )
            )}
          </motion.div>
        </AnimatePresence>

        <ProjectsPagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          placement="bottom"
        />
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  stretchHeight,
  onBlueprintToggle,
}: {
  project: ProjectItem;
  index: number;
  stretchHeight: boolean;
  onBlueprintToggle: (projectId: string, expanded: boolean) => void;
}) {
  const isLarge = project.gridSpan === "col-span-12";
  const [blueprintExpanded, setBlueprintExpanded] = useState(false);

  const toggleBlueprint = () => {
    const next = !blueprintExpanded;
    setBlueprintExpanded(next);
    onBlueprintToggle(project.id, next);
  };

  return (
    <Reveal delay={index * 0.08} className={`${project.gridSpan} ${stretchHeight ? "h-full" : ""}`}>
      <div
        className={`group relative flex ${
          stretchHeight ? "h-full" : ""
        } flex-col rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 sm:p-8 transition-colors duration-200 hover:border-[#CCCCCC]`}
      >
        <div>
          {/* Card Category Header */}
          <div className="mb-4">
            <span className="font-sans text-xs font-medium uppercase tracking-wider text-[#525252]">
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-2xl sm:text-3xl font-serif leading-[1.15] tracking-tight mb-2.5"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            <Link
              href={`/work/${project.slug}`}
              className="group/title link-hug-serif inline rounded-[2px] text-[#111111] transition-colors duration-300 hover:text-[#FFFFFF] focus-visible:text-[#FFFFFF]"
            >
              <span>{project.title}</span>
              <ArrowRight
                size={17}
                weight="bold"
                className="ml-2 inline-block align-baseline relative -top-[0.07em] text-[#616161] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover/title:opacity-100 group-hover/title:text-[#FFFFFF] group-focus-visible/title:opacity-100 group-focus-visible/title:text-[#FFFFFF]"
              />
            </Link>
          </h3>

          {/* Narrative Summary */}
          <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6 font-sans">
            {project.summary}
          </p>

          {/* Plain 16:9 Media Preview */}
          <Link
            href={`/work/${project.slug}`}
            data-link-fill="off"
            data-cursor-label="Open case"
            className="mb-5 block relative aspect-[16/9] w-full overflow-hidden rounded-[6px] border border-[#EAEAEA] bg-[#F5F5F3]"
          >
            <ProjectMedia
              src={project.image}
              poster={project.previewImage}
              alt={`${project.title} interface preview`}
              sizes={isLarge ? "(max-width: 1024px) 100vw, 1024px" : "(max-width: 1024px) 100vw, 560px"}
            />
          </Link>
        </div>

        {/* Bottom Stack: Metrics + Single-hairline Architecture Drawer + Card Footer locked together */}
        <div className="mt-auto">
          {/* Metrics Spec Strip */}
          {project.metrics && (
            <dl
              className={`grid gap-y-2.5 border-t border-[#EAEAEA] py-3.5 ${
                isLarge
                  ? "grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-[#EAEAEA]"
                  : "grid-cols-2 divide-x divide-[#EAEAEA]"
              }`}
            >
              {project.metrics.map((m, mIdx) => (
                <div
                  key={m.label}
                  className={
                    isLarge
                      ? `${mIdx > 0 ? "sm:pl-4" : ""} sm:pr-4`
                      : mIdx % 2 === 1
                      ? "pl-4"
                      : "pr-4"
                  }
                >
                  <dt className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#525252]">
                    {m.label}
                  </dt>
                  <dd className="font-mono text-xs sm:text-[13px] font-semibold text-[#111111]">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Expandable Architecture Blueprint Drawer */}
          <div className="border-t border-[#EAEAEA] overflow-hidden">
            <button
              type="button"
              onClick={toggleBlueprint}
              aria-expanded={blueprintExpanded}
              aria-controls={`blueprint-${project.id}`}
              aria-label={`${blueprintExpanded ? "Collapse" : "Expand"} system architecture blueprint for ${project.title}`}
              className={`w-full flex items-center justify-between py-3 text-left text-xs font-sans transition-colors duration-150 ${
                blueprintExpanded
                  ? "text-[#111111] font-semibold"
                  : "text-[#525252] hover:text-[#111111]"
              }`}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={13}
                  weight={blueprintExpanded ? "fill" : "bold"}
                  className={blueprintExpanded ? "text-[#111111]" : "text-[#525252]"}
                />
                <span className="font-medium">System Architecture Blueprint</span>
              </div>
              <motion.div
                animate={{ rotate: blueprintExpanded ? 180 : 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <CaretDown size={12} weight="bold" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {blueprintExpanded && (
                <motion.div
                  key="blueprint-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.25, delay: 0.08, ease: "easeOut" },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.16, ease: "easeIn" },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div
                    id={`blueprint-${project.id}`}
                    className="border-t border-[#EAEAEA] py-4 font-sans text-xs space-y-3.5"
                  >
                    <div>
                      <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#525252] block mb-1">
                        Problem Context
                      </span>
                      <p className="text-xs sm:text-[13px] text-[#444444] font-sans leading-relaxed">
                        {project.caseStudy.challenge}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#525252] block mb-1">
                        Technical Highlights
                      </span>
                      <div className="space-y-1.5">
                        {project.technicalHighlights.map((th, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs sm:text-[13px] text-[#4A4A4A] font-sans">
                            <span className="text-[#346538] font-bold font-mono">›</span>
                            <span>{th}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card Footer: Tags & External Links (single top divider, zero redundant hairline) */}
          <div className="pt-4 border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="flex flex-wrap items-center gap-1.5 font-sans text-[11px]">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-[#111111] bg-[#111111] px-2.5 py-1 text-[#FFFFFF] whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <Link
                href={`/work/${project.slug}`}
                className="link-hug gap-1 rounded-[2px] font-sans text-xs text-[#111111] font-semibold whitespace-nowrap shrink-0"
              >
                <span>Case Study</span>
                <ArrowRight size={12} weight="bold" />
              </Link>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hug gap-1 rounded-[2px] font-sans text-xs font-medium text-[#525252] whitespace-nowrap shrink-0"
                >
                  <GithubLogo size={13} weight="regular" />
                  <span>Source</span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hug gap-1 rounded-[2px] font-sans text-xs font-medium text-[#525252] whitespace-nowrap shrink-0"
                >
                  <Globe size={13} weight="regular" />
                  <span>Live</span>
                  <ArrowUpRight size={11} weight="bold" />
                </a>
              )}

              {project.downloadUrl && (
                <a
                  href={project.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-2.5 py-1.5 font-sans text-xs font-semibold text-white whitespace-nowrap shrink-0"
                >
                  <DownloadSimple size={13} weight="bold" />
                  <span>Download APK</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ProjectDetailRow({ project, index }: { project: ProjectItem; index: number }) {
  const year = projectYear(project);

  return (
    <Reveal delay={Math.min(index % PROJECTS_PER_PAGE, 3) * 0.06}>
      <div className="group grid grid-cols-1 gap-8 rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 transition-colors duration-200 hover:border-[#CCCCCC] sm:p-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-4">
            <span className="font-sans text-xs font-medium uppercase tracking-wider text-[#525252]">
              {project.category}
            </span>
          </div>

          <h3
            className="mb-3 font-serif text-2xl leading-[1.15] tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            <Link
              href={`/work/${project.slug}`}
              className="link-hug-serif inline rounded-[2px] text-[#111111]"
            >
              {project.title}
            </Link>
          </h3>

          <p className="mb-3 font-sans text-sm leading-relaxed text-[#111111]">
            {project.summary}
          </p>
          <p className="mb-5 font-sans text-sm leading-relaxed text-[#4A4A4A]">
            {project.description}
          </p>

          <ul className="mb-5 space-y-1.5">
            {project.technicalHighlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-1.5 font-sans text-[13px] text-[#4A4A4A]">
                <span className="font-mono font-bold text-[#346538]">›</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          {project.metrics && (
            <dl className="grid grid-cols-2 gap-y-2.5 border-t border-[#EAEAEA] py-3.5 sm:grid-cols-3 sm:divide-x sm:divide-[#EAEAEA]">
              {project.metrics.map((m, mIdx) => (
                <div
                  key={m.label}
                  className={`${mIdx > 0 ? "sm:pl-4" : ""} ${mIdx % 2 === 1 ? "border-l border-[#EAEAEA] pl-4 sm:border-l-0" : "pr-4"}`}
                >
                  <dt className="block font-sans text-[11px] font-medium uppercase tracking-wider text-[#525252]">
                    {m.label}
                  </dt>
                  <dd className="font-mono text-xs sm:text-[13px] font-semibold text-[#111111]">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-[#EAEAEA] pt-4">
            <div className="flex flex-wrap items-center gap-1.5 font-sans text-[11px]">
              {project.tags.map((t) => (
                <span key={t} className="rounded border border-[#111111] bg-[#111111] px-2.5 py-1 text-[#FFFFFF] whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <Link
                href={`/work/${project.slug}`}
                className="link-hug gap-1 rounded-[2px] font-sans text-xs font-semibold text-[#111111] whitespace-nowrap shrink-0"
              >
                <span>Case Study</span>
                <ArrowRight size={12} weight="bold" />
              </Link>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hug gap-1 rounded-[2px] font-sans text-xs font-medium text-[#525252] whitespace-nowrap shrink-0"
                >
                  <GithubLogo size={13} weight="regular" />
                  <span>Source</span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hug gap-1 rounded-[2px] font-sans text-xs font-medium text-[#525252] whitespace-nowrap shrink-0"
                >
                  <Globe size={13} weight="regular" />
                  <span>Live</span>
                  <ArrowUpRight size={11} weight="bold" />
                </a>
              )}

              {project.downloadUrl && (
                <a
                  href={project.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-2.5 py-1.5 font-sans text-xs font-semibold text-white whitespace-nowrap shrink-0"
                >
                  <DownloadSimple size={13} weight="bold" />
                  <span>Download APK</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Link
            href={`/work/${project.slug}`}
            data-link-fill="off"
            className="relative block aspect-[16/9] w-full overflow-hidden rounded-[6px] border border-[#EAEAEA] bg-[#F5F5F3]"
          >
            <ProjectMedia
              src={project.image}
              poster={project.previewImage}
              alt={`${project.title} interface preview`}
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </Link>

          <div className="mt-2 flex items-center justify-between font-sans text-[11px] font-medium uppercase tracking-wider text-[#525252]">
            <span>FIG·{padTwo(index + 1)}</span>
            <span className="font-mono">{year}</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ProjectListRow({ project, index }: { project: ProjectItem; index: number }) {
  const year = projectYear(project);

  return (
    <Reveal delay={Math.min(index % PROJECTS_PER_PAGE, 5) * 0.04}>
      <div className="-mx-2 grid grid-cols-12 items-center gap-x-4 gap-y-2 rounded-[4px] border-b border-[#EAEAEA] px-2 py-4 transition-colors hover:bg-[#FBFBFA]">
        <span className="col-span-2 font-mono text-xs text-[#525252] sm:col-span-1">
          {padTwo(index + 1)}
        </span>

        <div className="col-span-10 sm:col-span-5 lg:col-span-4">
          <Link
            href={`/work/${project.slug}`}
            className="link-hug-inline inline rounded-[2px] font-serif text-lg leading-tight text-[#111111]"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            {project.title}
          </Link>
          <div className="mt-0.5 font-sans text-[11px] font-medium uppercase tracking-wider text-[#525252]">
            {project.category}
          </div>
        </div>

        <div className="hidden flex-wrap gap-1.5 lg:col-span-3 lg:flex">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded border border-[#111111] bg-[#111111] px-2 py-1 font-sans text-[11px] text-[#FFFFFF]"
            >
              {t}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="self-center font-sans text-[11px] text-[#525252]">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        <span className="hidden font-mono text-xs text-[#525252] sm:col-span-2 sm:block sm:text-right lg:col-span-1">
          {year}
        </span>

        <div className="col-span-12 flex flex-wrap items-center gap-1.5 sm:col-span-4 sm:justify-end lg:col-span-3">
          <Link
            href={`/work/${project.slug}`}
            aria-label={`Open ${project.title} case study`}
            className="inline-flex items-center gap-1 rounded-[4px] p-1 font-sans text-xs font-semibold text-[#111111]"
          >
            <span className="sm:hidden lg:hidden">Case Study</span>
            <ArrowRight size={13} weight="bold" />
          </Link>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source repository`}
              className="inline-flex items-center justify-center rounded-[4px] p-1 text-[#525252]"
            >
              <GithubLogo size={14} weight="regular" />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="inline-flex items-center justify-center rounded-[4px] p-1 text-[#525252]"
            >
              <Globe size={14} weight="regular" />
            </a>
          )}

          {project.downloadUrl && (
            <a
              href={project.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Download ${project.title} APK`}
              title={`Download ${project.title} APK`}
              className="inline-flex items-center gap-1 rounded-[4px] bg-[#111111] px-2 py-1 font-sans text-[11px] font-semibold text-white"
            >
              <DownloadSimple size={13} weight="bold" />
              <span>APK</span>
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}
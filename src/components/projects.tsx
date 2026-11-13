"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
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

type ViewMode = "grid" | "detail" | "list";

const VIEW_MODES: { id: ViewMode; label: string; icon: PhosphorIcon }[] = [
  { id: "grid", label: "Bento grid", icon: SquaresFour },
  { id: "detail", label: "Detail rows", icon: Rows },
  { id: "list", label: "Index list", icon: ListBullets },
];

function projectYear(project: ProjectItem): string {
  return project.caseStudy.timeline.match(/\d{4}/)?.[0] ?? "—";
}

export function Projects() {
  const { data } = usePortfolio();
  const projects = data.projects ?? PROJECTS;
  const [filterTag, setFilterTag] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [expandedBlueprints, setExpandedBlueprints] = useState<string[]>([]);

  const handleBlueprintToggle = (projectId: string, expanded: boolean) => {
    setExpandedBlueprints((prev) =>
      expanded
        ? prev.includes(projectId)
          ? prev
          : [...prev, projectId]
        : prev.filter((id) => id !== projectId)
    );
  };

  const allTags = ["ALL", "Next.js", "TypeScript", "React", "Tailwind CSS", "Systems / GNS3"];

  const filteredProjects =
    filterTag === "ALL"
      ? projects
      : projects.filter((p) =>
          filterTag === "Systems / GNS3"
            ? p.tags.includes("GNS3") || p.tags.includes("Computer Networks")
            : p.tags.includes(filterTag)
        );

  const hasExpandedBlueprint = expandedBlueprints.some((id) =>
    filteredProjects.some((p) => p.id === id)
  );

  return (
    <section id="projects" className="pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                Architected for Performance & Utility
              </h2>
            </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-[#525252]">
                  Layout
                </span>
                <div
                  role="group"
                  aria-label="Change projects layout"
                  className="flex items-center gap-1 font-sans text-xs p-1 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA]"
                >
                  {VIEW_MODES.map((mode) => {
                    const isSelected = viewMode === mode.id;
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setViewMode(mode.id);
                          setExpandedBlueprints([]);
                        }}
                        aria-pressed={isSelected}
                        title={mode.label}
                        aria-label={`${mode.label} layout`}
                        className={`relative p-2 transition-colors rounded-[4px] ${
                          isSelected ? "text-white" : "text-[#616161] hover:text-[#111111]"
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="view-mode-pill"
                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 bg-[#111111] rounded-[4px] -z-0"
                          />
                        )}
                        <Icon
                          size={14}
                          weight={isSelected ? "fill" : "regular"}
                          className="relative z-10 block"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <motion.div
              layoutScroll
              role="group"
              aria-label="Filter projects by technology"
              className="flex max-w-full scroll-auto items-center gap-1.5 overflow-x-auto whitespace-nowrap p-1 font-sans text-xs rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA]"
            >
              {allTags.map((tag) => {
                const isSelected = filterTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setFilterTag(tag);
                      setExpandedBlueprints([]);
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Show ${tag === "ALL" ? "all projects" : `${tag} projects`}`}
                    className={`relative shrink-0 px-3 py-1 text-xs transition-colors rounded-[4px] ${
                      isSelected ? "text-white font-medium" : "text-[#525252] hover:text-[#111111]"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="project-tab-pill"
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 bg-[#111111] rounded-[4px] -z-0"
                      />
                    )}
                    <span className="relative z-10">{tag}</span>
                  </button>
                );
              })}
            </motion.div>
          </div>
        </Reveal>

        {/* Layout-aware Results with Cross-fade */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={
              viewMode === "grid"
                ? `grid grid-cols-12 gap-6 ${hasExpandedBlueprint ? "items-start" : "items-stretch"}`
                : viewMode === "detail"
                  ? "flex flex-col gap-6"
                  : "flex flex-col border-t border-[#EAEAEA]"
            }
          >
            {filteredProjects.map((project, idx) =>
              viewMode === "grid" ? (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  stretchHeight={!hasExpandedBlueprint}
                  onBlueprintToggle={handleBlueprintToggle}
                />
              ) : viewMode === "detail" ? (
                <ProjectDetailRow key={project.id} project={project} index={idx} />
              ) : (
                <ProjectListRow key={project.id} project={project} index={idx} />
              )
            )}
          </motion.div>
        </AnimatePresence>
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
          <Link href={`/work/${project.slug}`} className="group-hover:text-[#444444] transition-colors block mb-2.5">
            <h3
              className="text-2xl sm:text-3xl font-serif text-[#111111] tracking-tight flex items-center justify-between"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              <span>{project.title}</span>
              <ArrowRight
                size={18}
                weight="bold"
                className="text-[#616161] group-hover:text-[#111111] transition-colors opacity-0 group-hover:opacity-100"
              />
            </h3>
          </Link>

          {/* Narrative Summary */}
          <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6 font-sans">
            {project.summary}
          </p>

          {/* Seamless Mockup with Faux-OS Window Chrome */}
          <div className="mb-5 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] overflow-hidden">
            {/* Window Bar */}
            <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-3.5 py-2 gap-2">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              </div>
              <span className="font-mono text-xs text-[#525252] truncate min-w-0 text-center px-1">
                {project.title.toLowerCase().replace(/\s+/g, "-")}.app
              </span>
              <span className="text-[11px] font-sans font-medium text-[#525252] whitespace-nowrap shrink-0">
                16:9 PREVIEW
              </span>
            </div>

            {/* Clickable Image Container */}
            <Link
              href={`/work/${project.slug}`}
              data-cursor-label="Open case"
              className="block relative aspect-[16/9] w-full bg-[#F5F5F3] overflow-hidden"
            >
              <ProjectMedia
                src={project.image}
                alt={`${project.title} interface preview mockup`}
                sizes={isLarge ? "(max-width: 1024px) 100vw, 1024px" : "(max-width: 1024px) 100vw, 560px"}
              />
              <div className="absolute inset-0 bg-[#000000]/[0.015] pointer-events-none"></div>
            </Link>
          </div>
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
            <div className="flex flex-wrap items-center gap-1.5 font-sans text-[11px] text-[#4A4A4A]">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-2.5 py-1 whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/work/${project.slug}`}
                className="inline-flex items-center gap-1 font-sans text-xs text-[#111111] hover:underline underline-offset-4 font-semibold whitespace-nowrap shrink-0"
              >
                <span>Case Study</span>
                <ArrowRight size={12} weight="bold" />
              </Link>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-sans text-xs font-medium text-[#525252] hover:text-[#111111] transition-colors whitespace-nowrap shrink-0"
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
                  className="inline-flex items-center gap-1 font-sans text-xs font-medium text-[#525252] hover:text-[#111111] transition-colors whitespace-nowrap shrink-0"
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
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-2.5 py-1.5 font-sans text-xs font-semibold text-white transition-colors hover:bg-[#2A2A2A] whitespace-nowrap shrink-0"
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
    <Reveal delay={Math.min(index, 3) * 0.06}>
      <div className="group grid grid-cols-1 gap-8 rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 transition-colors duration-200 hover:border-[#CCCCCC] sm:p-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-4">
            <span className="font-sans text-xs font-medium uppercase tracking-wider text-[#525252]">
              {project.category}
            </span>
          </div>

          <Link href={`/work/${project.slug}`} className="mb-3 block">
            <h3
              className="font-serif text-2xl tracking-tight text-[#111111] transition-colors group-hover:text-[#444444] sm:text-3xl"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              {project.title}
            </h3>
          </Link>

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
            <div className="flex flex-wrap items-center gap-1.5 font-sans text-[11px] text-[#4A4A4A]">
              {project.tags.map((t) => (
                <span key={t} className="rounded border border-[#EAEAEA] bg-[#F7F6F3] px-2.5 py-1 whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/work/${project.slug}`}
                className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#111111] underline-offset-4 hover:underline whitespace-nowrap shrink-0"
              >
                <span>Case Study</span>
                <ArrowRight size={12} weight="bold" />
              </Link>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-sans text-xs font-medium text-[#525252] transition-colors hover:text-[#111111] whitespace-nowrap shrink-0"
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
                  className="inline-flex items-center gap-1 font-sans text-xs font-medium text-[#525252] transition-colors hover:text-[#111111] whitespace-nowrap shrink-0"
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
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-2.5 py-1.5 font-sans text-xs font-semibold text-white transition-colors hover:bg-[#2A2A2A] whitespace-nowrap shrink-0"
                >
                  <DownloadSimple size={13} weight="bold" />
                  <span>Download APK</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA]">
            <div className="flex items-center justify-between gap-2 border-b border-[#EAEAEA] bg-[#FFFFFF] px-3.5 py-2">
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#E5E5E5]"></span>
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#E5E5E5]"></span>
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#E5E5E5]"></span>
              </div>
              <span className="min-w-0 flex-1 truncate px-1 text-center font-mono text-xs text-[#525252]">
                {project.title.toLowerCase().replace(/\s+/g, "-")}.app
              </span>
              <span className="shrink-0 whitespace-nowrap font-sans text-[11px] font-medium text-[#525252]">
                16:9 PREVIEW
              </span>
            </div>

            <Link
              href={`/work/${project.slug}`}
              className="relative block aspect-[16/9] w-full overflow-hidden bg-[#F5F5F3]"
            >
              <ProjectMedia
                src={project.image}
                alt={`${project.title} interface preview mockup`}
                sizes="(max-width: 1024px) 100vw, 560px"
              />
              <div className="pointer-events-none absolute inset-0 bg-[#000000]/[0.015]"></div>
            </Link>
          </div>

          <div className="mt-2 flex items-center justify-between font-sans text-[11px] font-medium uppercase tracking-wider text-[#525252]">
            <span>FIG·0{index + 1}</span>
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
    <Reveal delay={Math.min(index, 5) * 0.04}>
      <div className="-mx-2 grid grid-cols-12 items-center gap-x-4 gap-y-2 rounded-[4px] border-b border-[#EAEAEA] px-2 py-4 transition-colors hover:bg-[#FBFBFA]">
        <span className="col-span-2 font-mono text-xs text-[#525252] sm:col-span-1">
          0{index + 1}
        </span>

        <div className="col-span-10 sm:col-span-5 lg:col-span-4">
          <Link
            href={`/work/${project.slug}`}
            className="font-serif text-lg text-[#111111] underline-offset-4 hover:underline"
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
              className="rounded border border-[#EAEAEA] bg-[#F7F6F3] px-2 py-1 font-sans text-[11px] text-[#4A4A4A]"
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

        <div className="col-span-12 flex flex-wrap items-center gap-2 sm:col-span-4 sm:justify-end lg:col-span-3">
          <Link
            href={`/work/${project.slug}`}
            aria-label={`Open ${project.title} case study`}
            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#111111] underline-offset-4 hover:underline"
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
              className="text-[#525252] transition-colors hover:text-[#111111]"
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
              className="text-[#525252] transition-colors hover:text-[#111111]"
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
              className="inline-flex items-center gap-1 rounded-[4px] bg-[#111111] px-2 py-1 font-sans text-[11px] font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
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
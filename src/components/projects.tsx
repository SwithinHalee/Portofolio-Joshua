"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  GithubLogo,
  Globe,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { PROJECTS, ProjectItem } from "@/data/portfolio";
import { Reveal } from "@/components/motion-wrapper";

export function Projects() {
  const [filterTag, setFilterTag] = useState<string>("ALL");

  const allTags = ["ALL", "Next.js", "TypeScript", "React", "Tailwind CSS", "Systems / GNS3"];

  const filteredProjects =
    filterTag === "ALL"
      ? PROJECTS
      : PROJECTS.filter((p) =>
          filterTag === "Systems / GNS3"
            ? p.tags.includes("GNS3") || p.tags.includes("Computer Networks")
            : p.tags.includes(filterTag)
        );

  return (
    <section id="projects" className="py-24 md:py-32 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-2">
                <span>01 / DOSSIER INDEX</span>
                <span className="text-[#EAEAEA]">•</span>
                <span>SELECTED ENGINEERING WORKS</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                Architected for Performance & Utility
              </h2>
            </div>

            {/* Tactile Filter Tabs with LayoutId */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs p-1 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA]">
              {allTags.map((tag) => {
                const isSelected = filterTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`relative px-3 py-1 text-xs transition-colors rounded-[4px] ${
                      isSelected ? "text-white font-medium" : "text-[#787774] hover:text-[#111111]"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="project-tab-pill"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 bg-[#111111] rounded-[4px] -z-0"
                      />
                    )}
                    <span className="relative z-10">{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const isLarge = project.gridSpan === "col-span-12";
  const [blueprintExpanded, setBlueprintExpanded] = useState(false);

  return (
    <Reveal delay={index * 0.08} className={project.gridSpan}>
      <div className="group relative flex flex-col justify-between rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 sm:p-8 transition-colors duration-200 hover:border-[#CCCCCC]">
        <div>
          {/* Card Header & Category Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#787774]">
              {project.category}
            </span>

            {project.badge && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wider font-medium ${
                  project.badge.variant === "green"
                    ? "bg-[#EDF3EC] text-[#346538] border border-[#D5E8D4]"
                    : project.badge.variant === "blue"
                    ? "bg-[#E1F3FE] text-[#1F6C9F] border border-[#CDE7FB]"
                    : "bg-[#FBF3DB] text-[#956400] border border-[#F4E3B5]"
                }`}
              >
                {project.badge.text}
              </span>
            )}
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
                className="text-[#888888] group-hover:text-[#111111] transition-colors opacity-0 group-hover:opacity-100"
              />
            </h3>
          </Link>

          {/* Narrative Summary */}
          <p className="text-sm text-[#555555] leading-relaxed mb-6 font-sans">
            {project.summary}
          </p>

          {/* Seamless Mockup with Faux-OS Window Chrome */}
          <div className="my-5 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] overflow-hidden">
            {/* Window Bar */}
            <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-3.5 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              </div>
              <span className="font-mono text-[11px] text-[#787774] truncate max-w-[240px]">
                {project.title.toLowerCase().replace(/\s+/g, "-")}.app
              </span>
              <span className="text-[10px] font-mono text-[#999999]">16:9 PREVIEW</span>
            </div>

            {/* Clickable Image Container */}
            <Link
              href={`/work/${project.slug}`}
              className="block relative aspect-[16/9] w-full bg-[#F5F5F3] overflow-hidden"
            >
              <Image
                src={project.image}
                alt={`${project.title} interface preview mockup`}
                fill
                className="object-cover"
                sizes={isLarge ? "(max-width: 1024px) 100vw, 1024px" : "(max-width: 1024px) 100vw, 560px"}
              />
              <div className="absolute inset-0 bg-[#000000]/[0.015] pointer-events-none"></div>
            </Link>
          </div>

          {/* Metrics Grid */}
          {project.metrics && (
            <div className={`grid gap-2 mb-5 ${isLarge ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded border border-[#EAEAEA] bg-[#FBFBFA] p-2.5"
                >
                  <span className="block text-[10px] font-mono uppercase text-[#787774]">
                    {m.label}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#111111]">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Expandable Architecture Blueprint Drawer */}
          <div className="mb-5 border border-[#EAEAEA] rounded-[6px] bg-[#FBFBFA] overflow-hidden">
            <button
              onClick={() => setBlueprintExpanded(!blueprintExpanded)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-left text-xs font-mono text-[#666666] hover:text-[#111111] transition-colors"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={13} weight="bold" className="text-[#888888]" />
                <span className="font-medium text-[#111111]">System Architecture Blueprint</span>
              </div>
              <motion.div
                animate={{ rotate: blueprintExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <CaretDown size={12} weight="bold" />
              </motion.div>
            </button>

            <AnimatePresence>
              {blueprintExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-[#EAEAEA] bg-white p-4 font-mono text-xs space-y-3"
                >
                  <div>
                    <span className="text-[10px] uppercase text-[#888888] block mb-1">
                      Problem Context
                    </span>
                    <p className="text-[11px] text-[#444444] font-sans leading-relaxed">
                      {project.caseStudy.challenge}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#888888] block mb-1">
                      Technical Highlights
                    </span>
                    <div className="space-y-1">
                      {project.technicalHighlights.map((th, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#555555]">
                          <span className="text-[#346538] font-bold">›</span>
                          <span>{th}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Card Footer: Tags & External Links */}
        <div className="pt-4 border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-[#787774]">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-1 font-mono text-xs text-[#111111] hover:underline underline-offset-4 font-semibold"
            >
              <span>Case Study</span>
              <ArrowRight size={12} weight="bold" />
            </Link>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-[#787774] hover:text-[#111111] transition-colors"
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
                className="inline-flex items-center gap-1 font-mono text-xs text-[#787774] hover:text-[#111111] transition-colors"
              >
                <Globe size={13} weight="regular" />
                <span>Live</span>
                <ArrowUpRight size={11} weight="bold" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
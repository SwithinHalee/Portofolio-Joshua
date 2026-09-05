"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, GithubLogo, Globe } from "@phosphor-icons/react";
import { PROJECTS, ProjectItem } from "@/data/portfolio";

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

          {/* Minimalist Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`rounded px-2.5 py-1 transition-colors ${
                  filterTag === tag
                    ? "bg-[#111111] text-white"
                    : "bg-[#F7F6F3] text-[#787774] hover:text-[#111111] border border-[#EAEAEA]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const isLarge = project.gridSpan === "col-span-12";

  return (
    <div
      className={`${project.gridSpan} group relative flex flex-col justify-between rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 sm:p-8 transition-all duration-300 hover:border-[#BBBBBB] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)]`}
    >
      <div>
        {/* Card Header & Badge */}
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
        <Link href={`/work/${project.slug}`} className="group-hover:text-[#444444] transition-colors">
          <h3
            className="text-2xl sm:text-3xl font-serif text-[#111111] tracking-tight mb-2.5 flex items-center justify-between"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            <span>{project.title}</span>
            <ArrowRight
              size={18}
              weight="bold"
              className="text-[#888888] group-hover:translate-x-1 group-hover:text-[#111111] transition-all opacity-0 group-hover:opacity-100"
            />
          </h3>
        </Link>

        {/* Narrative description */}
        <p className="text-sm text-[#555555] leading-relaxed mb-6 font-sans">
          {project.summary}
        </p>

        {/* Seamless Image Mockup with Faux-OS Window Chrome */}
        <div className="my-5 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] overflow-hidden">
          {/* Top Faux Window Bar */}
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

          {/* Embedded Image */}
          <Link href={`/work/${project.slug}`} className="block relative aspect-[16/9] w-full bg-[#F5F5F3] overflow-hidden">
            <Image
              src={project.image}
              alt={`${project.title} interface preview mockup`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes={isLarge ? "(max-width: 1024px) 100vw, 1024px" : "(max-width: 1024px) 100vw, 560px"}
            />
            {/* Subtle grain/vignette */}
            <div className="absolute inset-0 bg-[#000000]/[0.015] pointer-events-none"></div>
          </Link>
        </div>

        {/* Metrics Bar */}
        {project.metrics && (
          <div className={`grid gap-2 mb-6 ${isLarge ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
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
      </div>

      {/* Footer Actions & Links */}
      <div className="pt-4 border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-4">
        {/* Tags */}
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

        {/* Action Hub */}
        <div className="flex items-center gap-3">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1 font-mono text-xs text-[#111111] hover:underline underline-offset-4 font-semibold"
          >
            <span>Read Case Study</span>
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
              <span>Live Site</span>
              <ArrowUpRight size={11} weight="bold" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
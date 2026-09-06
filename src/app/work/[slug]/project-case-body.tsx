"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, GithubLogo, Globe } from "@phosphor-icons/react";
import type { ProjectItem } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { DossierTag } from "@/components/dossier-tag";

const PROJECT_IMAGE_FALLBACK = "/images/projects/xpense.jpg";

function resolveProjectImage(src: string | undefined | null): string {
  if (!src || !src.trim()) return PROJECT_IMAGE_FALLBACK;
  const t = src.trim();
  if (t.startsWith("/") || t.startsWith("https://") || t.startsWith("http://")) return t;
  return PROJECT_IMAGE_FALLBACK;
}

interface Props {
  slug: string;
  initialProject?: ProjectItem;
  initialIndex?: number;
  initialPrev?: ProjectItem;
  initialNext?: ProjectItem;
  initialCount?: number;
}

export function ProjectCaseBody({ slug, initialProject, initialIndex, initialPrev, initialNext, initialCount }: Props) {
  const { data, hydrated } = usePortfolio();

  // Before hydration, render exactly what the server rendered to avoid mismatch.
  // After hydration, resolve from live (localStorage) data so /admin additions work.
  const liveList = hydrated ? data.projects : null;
  const liveProject = liveList?.find((p) => p.slug === slug);
  const project = (liveProject ?? initialProject) as ProjectItem | undefined;

  useEffect(() => {
    if (project) document.title = `${project.title} — Case Study | Joshua Abdiel`;
  }, [project]);

  if (!project) {
    if (!hydrated) {
      return (
        <main id="main-content" className="flex-1 py-12 md:py-20">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-[#616161]">Loading project…</p>
          </div>
        </main>
      );
    }
    return (
      <main id="main-content" className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-[#616161]">404 / Missing dossier</p>
          <h1
            className="mb-4 font-serif text-4xl tracking-tight text-[#111111]"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            Project not found
          </h1>
          <p className="mb-8 max-w-xl text-sm leading-relaxed text-[#555555]">
            No project with slug <code className="rounded border border-[#EAEAEA] bg-[#FBFBFA] px-1 font-mono text-xs">/{slug}</code> exists
            in the shipped data or in this browser&apos;s local edits. If you just added it in Portfolio Studio, make sure you are
            opening it in the same browser.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-4 py-2.5 font-mono text-xs text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.98]"
            >
              <ArrowLeft size={13} weight="bold" />
              <span>Return to Selected Works</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-2.5 font-mono text-xs text-[#111111] transition-all hover:bg-[#F0F0EE] active:scale-[0.98]"
            >
              <span>Open Portfolio Studio</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const list = liveList ?? (initialProject ? [initialProject] : []);
  const liveIndex = list.findIndex((p) => p.slug === slug);
  const safeIndex = liveIndex >= 0 ? liveIndex : (initialIndex ?? 0);
  const count = liveList ? liveList.length : (initialCount ?? 1);
  const prevProject = liveList
    ? liveList[(safeIndex - 1 + liveList.length) % liveList.length]
    : initialPrev ?? project;
  const nextProject = liveList
    ? liveList[(safeIndex + 1) % liveList.length]
    : initialNext ?? project;

  return (
    <main id="main-content" className="flex-1 py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mb-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#616161] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft size={13} weight="bold" />
            <span>Return to Selected Works Index</span>
          </Link>
        </div>

        <div className="border-b border-[#EAEAEA] pb-10 mb-12">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-[#616161] uppercase tracking-wider mb-4">
            <span>{project.category}</span>
            {project.badge && (
              <DossierTag tone={project.badge.variant} customColor={project.badge.customColor} code={`REF·0${safeIndex + 1}`}>
                {project.badge.text}
              </DossierTag>
            )}
          </div>

          <h1
            className="text-4xl sm:text-5xl font-serif text-[#111111] tracking-[-0.03em] mb-6"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            {project.title}
          </h1>

          <p className="text-lg text-[#444444] font-sans leading-relaxed max-w-3xl mb-8">
            {project.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-4 font-mono text-xs">
            <div>
              <span className="text-[#616161] block text-[10px] uppercase">Context</span>
              <span className="text-[#111111] font-medium">{project.caseStudy.clientOrContext}</span>
            </div>
            <div>
              <span className="text-[#616161] block text-[10px] uppercase">Timeline</span>
              <span className="text-[#111111] font-medium">{project.caseStudy.timeline}</span>
            </div>
            <div>
              <span className="text-[#616161] block text-[10px] uppercase">Role</span>
              <span className="text-[#111111] font-medium">{project.caseStudy.role}</span>
            </div>
            <div className="flex items-center gap-3 self-end sm:justify-end">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#111111] hover:underline"
                >
                  <GithubLogo size={13} weight="bold" />
                  <span>Repo</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#111111] hover:underline"
                >
                  <Globe size={13} weight="bold" />
                  <span>Live</span>
                  <ArrowUpRight size={10} weight="bold" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mb-16 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
            </div>
            <span className="font-mono text-[11px] text-[#616161]">
              {project.slug} — architectural-preview [16:9 verified]
            </span>
            <div className="w-8"></div>
          </div>

          <div className="relative aspect-[16/9] w-full bg-[#F5F5F3]">
            <Image
              src={resolveProjectImage(project.image)}
              alt={`${project.title} Interface Preview`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        </div>

        <div className="space-y-14">
          <section className="border-b border-[#EAEAEA] pb-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#616161] mb-3">
              01. The Problem & Engineering Challenge
            </h2>
            <p className="text-base text-[#333333] leading-relaxed">{project.caseStudy.challenge}</p>
          </section>

          <section className="border-b border-[#EAEAEA] pb-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#616161] mb-3">
              02. Architectural Solution
            </h2>
            <p className="text-base text-[#333333] leading-relaxed mb-6">{project.caseStudy.architectureSolution}</p>

            <div className="rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#111111] mb-3 font-semibold">
                Key Deliverables
              </h3>
              <ul className="space-y-2 font-mono text-xs text-[#555555]">
                {project.caseStudy.deliverables.map((deliv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#346538] font-bold">›</span>
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="border-b border-[#EAEAEA] pb-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#616161] mb-6">
              03. Technical Decisions & Tradeoffs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.caseStudy.technicalDecisions.map((dec) => (
                <div
                  key={dec.title}
                  className="rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] p-5 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-sans font-medium text-sm text-[#111111] mb-2">{dec.title}</h4>
                    <p className="font-mono text-xs text-[#666666] leading-relaxed">{dec.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-[#EAEAEA] pb-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#616161] mb-4">
              04. Technologies Leveraged
            </h2>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {project.tags.map((t) => (
                <span key={t} className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-3 py-1 text-[#111111]">
                  {t}
                </span>
              ))}
            </div>
          </section>
        </div>

        {count > 1 && prevProject && nextProject && (
          <div className="pt-12 grid grid-cols-2 gap-4 font-mono text-xs">
            <Link
              href={`/work/${prevProject.slug}`}
              className="rounded-[6px] border border-[#EAEAEA] p-4 hover:bg-[#FBFBFA] transition-colors"
            >
              <span className="text-[#616161] block text-[10px]">PREVIOUS WORK</span>
              <span className="font-serif text-sm font-medium text-[#111111] truncate block">{prevProject.title}</span>
            </Link>

            <Link
              href={`/work/${nextProject.slug}`}
              className="rounded-[6px] border border-[#EAEAEA] p-4 hover:bg-[#FBFBFA] transition-colors text-right"
            >
              <span className="text-[#616161] block text-[10px]">NEXT WORK</span>
              <span className="font-serif text-sm font-medium text-[#111111] truncate block">{nextProject.title}</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

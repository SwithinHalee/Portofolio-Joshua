"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, DownloadSimple, GithubLogo, Globe } from "@phosphor-icons/react";
import type { ProjectItem } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { ProjectMedia } from "@/components/project-media";

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
    if (project) document.title = `${project.title} · Case Study | Joshua Abdiel`;
  }, [project]);

  if (!project) {
    if (!hydrated) {
      return (
        <main id="main-content" className="flex-1 pt-20 sm:pt-24 xl:pt-14 pb-16 md:pb-24">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-[#616161]">Loading project…</p>
          </div>
        </main>
      );
    }
    return (
      <main id="main-content" className="flex-1 pt-20 sm:pt-24 xl:pt-14 pb-16 md:pb-24">
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
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-4 py-2.5 font-mono text-xs text-white active:scale-[0.98]"
            >
              <ArrowLeft size={13} weight="bold" />
              <span>Return to Selected Works</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-2.5 font-mono text-xs text-[#111111] active:scale-[0.98]"
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
    <main id="main-content" className="flex-1 pt-20 sm:pt-24 xl:pt-14 pb-16 md:pb-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mb-10">
          <Link
            href="/#projects"
            className="link-hug gap-2 rounded-[2px] -mx-1.5 font-sans text-xs font-medium text-[#525252]"
          >
            <ArrowLeft size={13} weight="bold" />
            <span>Return to Selected Works Index</span>
          </Link>
        </div>

        <div className="border-b border-[#EAEAEA] pb-10 mb-12">
          <div className="font-sans text-xs font-medium text-[#525252] uppercase tracking-wider mb-4">
            <span>{project.category}</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-serif text-[#111111] tracking-[-0.03em] mb-6"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            {project.title}
          </h1>

          <p className="text-lg text-[#444444] font-sans leading-relaxed mb-8">
            {project.description}
          </p>

          <div className="flex flex-col gap-4 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-4 font-sans text-xs md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="grid flex-1 min-w-0 grid-cols-2 gap-4 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
              {[
                { label: "Context", value: project.caseStudy.clientOrContext, mono: false },
                { label: "Timeline", value: project.caseStudy.timeline, mono: true },
                { label: "Role", value: project.caseStudy.role, mono: false },
              ].map((meta) => (
                <div key={meta.label} className="min-w-0">
                  <span className="mb-1.5 block text-[11px] font-medium uppercase leading-none tracking-wider text-[#525252]">
                    {meta.label}
                  </span>
                  <span
                    className={`block font-medium leading-snug text-[#111111] ${meta.mono ? "font-mono" : ""}`}
                  >
                    {meta.value}
                  </span>
                </div>
              ))}
            </div>
            {(project.githubUrl || project.liveUrl || project.downloadUrl) && (
              <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-[#EAEAEA] pt-3 md:justify-end md:border-t-0 md:pt-0">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-hug shrink-0 gap-1 whitespace-nowrap rounded-[2px] -my-[0.25em] font-medium text-[#111111]"
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
                    className="link-hug shrink-0 gap-1 whitespace-nowrap rounded-[2px] -my-[0.25em] font-medium text-[#111111]"
                  >
                    <Globe size={13} weight="bold" />
                    <span>Live</span>
                    <ArrowUpRight size={10} weight="bold" />
                  </a>
                )}
                {project.downloadUrl && (
                  <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[4px] bg-[#111111] px-2.5 py-1.5 font-medium leading-none text-white"
                  >
                    <DownloadSimple size={13} weight="bold" />
                    <span>Download APK</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-16 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
            </div>
            <span className="font-mono text-xs text-[#525252]">
              {project.slug} · architectural-preview [16:9 verified]
            </span>
            <div className="w-8"></div>
          </div>

          <div className="relative aspect-[16/9] w-full bg-[#F5F5F3]">
            <ProjectMedia
              src={project.image}
              alt={`${project.title} Interface Preview`}
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        </div>

        <div className="space-y-14">
          <section className="border-b border-[#EAEAEA] pb-12">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#525252] mb-3">
              01. The Problem & Engineering Challenge
            </h2>
            <p className="text-base text-[#333333] leading-relaxed">{project.caseStudy.challenge}</p>
          </section>

          <section className="border-b border-[#EAEAEA] pb-12">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#525252] mb-3">
              02. Architectural Solution
            </h2>
            <p className="text-base text-[#333333] leading-relaxed mb-6">{project.caseStudy.architectureSolution}</p>

            <div className="w-full rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-5">
              <h3 className="font-sans text-xs uppercase tracking-wider text-[#111111] mb-3 font-semibold">
                Key Deliverables
              </h3>
              <ul className="space-y-2 font-sans text-sm text-[#4A4A4A]">
                {project.caseStudy.deliverables.map((deliv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#346538] font-bold font-mono">›</span>
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="border-b border-[#EAEAEA] pb-12">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#525252] mb-6">
              03. Technical Decisions & Tradeoffs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.caseStudy.technicalDecisions.map((dec) => (
                <div
                  key={dec.title}
                  className="rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-sans font-semibold text-sm text-[#111111] mb-2">{dec.title}</h3>
                    <p className="font-sans text-[13px] text-[#4A4A4A] leading-relaxed">{dec.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-[#EAEAEA] pb-12">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#525252] mb-4">
              04. Technologies Leveraged
            </h2>
            <div className="flex flex-wrap gap-2 font-sans text-xs font-medium">
              {project.tags.map((t) => (
                <span key={t} className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-3 py-1.5 text-[#111111]">
                  {t}
                </span>
              ))}
            </div>
          </section>
        </div>

        {count > 1 && prevProject && nextProject && (
          <div className="pt-12 grid grid-cols-2 gap-4 font-sans text-xs">
            <Link
              href={`/work/${prevProject.slug}`}
              className="group rounded-[6px] border border-[#EAEAEA] p-4"
            >
              <span className="text-[#525252] transition-colors duration-300 group-hover:text-[#CCCCCC] group-focus-visible:text-[#CCCCCC] block text-[11px] font-medium tracking-wider uppercase mb-1">
                PREVIOUS WORK
              </span>
              <span className="font-serif text-base font-medium text-[#111111] transition-colors duration-300 group-hover:text-[#FFFFFF] group-focus-visible:text-[#FFFFFF] truncate block">
                {prevProject.title}
              </span>
            </Link>

            <Link
              href={`/work/${nextProject.slug}`}
              className="group rounded-[6px] border border-[#EAEAEA] p-4 text-right"
            >
              <span className="text-[#525252] transition-colors duration-300 group-hover:text-[#CCCCCC] group-focus-visible:text-[#CCCCCC] block text-[11px] font-medium tracking-wider uppercase mb-1">
                NEXT WORK
              </span>
              <span className="font-serif text-base font-medium text-[#111111] transition-colors duration-300 group-hover:text-[#FFFFFF] group-focus-visible:text-[#FFFFFF] truncate block">
                {nextProject.title}
              </span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

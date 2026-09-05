import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, GithubLogo, Globe } from "@phosphor-icons/react/dist/ssr";
import { PROJECTS } from "@/data/portfolio";
import { Navbar } from "@/components/navbar";
import { Colophon } from "@/components/colophon";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Case Study | Joshua Abdiel`,
    description: project.summary,
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const project = PROJECTS[projectIndex];

  if (!project) {
    notFound();
  }

  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(projectIndex - 1 + PROJECTS.length) % PROJECTS.length];

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          {/* Back Navigation */}
          <div className="mb-10">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#787774] hover:text-[#111111] transition-colors"
            >
              <ArrowLeft size={13} weight="bold" />
              <span>Return to Selected Works Index</span>
            </Link>
          </div>

          {/* Header Metadata */}
          <div className="border-b border-[#EAEAEA] pb-10 mb-12">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-[#787774] uppercase tracking-wider mb-4">
              <span>{project.category}</span>
              {project.badge && (
                <>
                  <span>•</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      project.badge.variant === "green"
                        ? "bg-[#EDF3EC] text-[#346538]"
                        : project.badge.variant === "blue"
                        ? "bg-[#E1F3FE] text-[#1F6C9F]"
                        : "bg-[#FBF3DB] text-[#956400]"
                    }`}
                  >
                    {project.badge.text}
                  </span>
                </>
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

            {/* Quick Links & Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-4 font-mono text-xs">
              <div>
                <span className="text-[#888888] block text-[10px] uppercase">Context</span>
                <span className="text-[#111111] font-medium">{project.caseStudy.clientOrContext}</span>
              </div>
              <div>
                <span className="text-[#888888] block text-[10px] uppercase">Timeline</span>
                <span className="text-[#111111] font-medium">{project.caseStudy.timeline}</span>
              </div>
              <div>
                <span className="text-[#888888] block text-[10px] uppercase">Role</span>
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

          {/* High-Resolution Mockup Showcase */}
          <div className="mb-16 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              </div>
              <span className="font-mono text-[11px] text-[#787774]">
                {project.slug} — architectural-preview [16:9 verified]
              </span>
              <div className="w-8"></div>
            </div>

            <div className="relative aspect-[16/9] w-full bg-[#F5F5F3]">
              <Image
                src={project.image}
                alt={`${project.title} Interface Preview`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          </div>

          {/* Case Study Narrative Sections */}
          <div className="space-y-14">
            {/* The Challenge */}
            <section className="border-b border-[#EAEAEA] pb-12">
              <h2 className="font-mono text-xs uppercase tracking-wider text-[#787774] mb-3">
                01. The Problem & Engineering Challenge
              </h2>
              <p className="text-base text-[#333333] leading-relaxed">
                {project.caseStudy.challenge}
              </p>
            </section>

            {/* The Architecture Solution */}
            <section className="border-b border-[#EAEAEA] pb-12">
              <h2 className="font-mono text-xs uppercase tracking-wider text-[#787774] mb-3">
                02. Architectural Solution
              </h2>
              <p className="text-base text-[#333333] leading-relaxed mb-6">
                {project.caseStudy.architectureSolution}
              </p>

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

            {/* Technical Decisions */}
            <section className="border-b border-[#EAEAEA] pb-12">
              <h2 className="font-mono text-xs uppercase tracking-wider text-[#787774] mb-6">
                03. Technical Decisions & Tradeoffs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.caseStudy.technicalDecisions.map((dec) => (
                  <div
                    key={dec.title}
                    className="rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] p-5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-sans font-medium text-sm text-[#111111] mb-2">
                        {dec.title}
                      </h4>
                      <p className="font-mono text-xs text-[#666666] leading-relaxed">
                        {dec.rationale}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech Stack Matrix */}
            <section className="border-b border-[#EAEAEA] pb-12">
              <h2 className="font-mono text-xs uppercase tracking-wider text-[#787774] mb-4">
                04. Technologies Leveraged
              </h2>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-3 py-1 text-[#111111]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Next / Previous Project Navigation */}
          <div className="pt-12 grid grid-cols-2 gap-4 font-mono text-xs">
            <Link
              href={`/work/${prevProject.slug}`}
              className="rounded-[6px] border border-[#EAEAEA] p-4 hover:bg-[#FBFBFA] transition-colors"
            >
              <span className="text-[#888888] block text-[10px]">PREVIOUS WORK</span>
              <span className="font-serif text-sm font-medium text-[#111111] truncate block">
                {prevProject.title}
              </span>
            </Link>

            <Link
              href={`/work/${nextProject.slug}`}
              className="rounded-[6px] border border-[#EAEAEA] p-4 hover:bg-[#FBFBFA] transition-colors text-right"
            >
              <span className="text-[#888888] block text-[10px]">NEXT WORK</span>
              <span className="font-serif text-sm font-medium text-[#111111] truncate block">
                {nextProject.title}
              </span>
            </Link>
          </div>
        </div>
      </main>

      <Colophon />
    </div>
  );
}
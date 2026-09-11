import type { Metadata } from "next";
import { PROJECTS } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";
import { Navbar } from "@/components/navbar";
import { Colophon } from "@/components/colophon";
import { ProjectCaseBody } from "./project-case-body";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project Case Study | Joshua Abdiel" };

  const url = `${SITE_URL}/work/${project.slug}`;
  const isVideo = /\.mp4($|\?)/i.test(project.image.trim());
  const image = !isVideo && project.image.startsWith("/")
    ? `${SITE_URL}${project.image}`
    : !isVideo && project.image.startsWith("http")
      ? project.image
      : undefined;

  return {
    title: `${project.title} — Case Study | Joshua Abdiel`,
    description: project.summary,
    keywords: [...project.tags, project.title, "case study", "Joshua Abdiel"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} — Case Study | Joshua Abdiel`,
      description: project.summary,
      ...(image ? { images: [{ url: image, alt: `${project.title} interface preview` }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study | Joshua Abdiel`,
      description: project.summary,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const project = projectIndex >= 0 ? PROJECTS[projectIndex] : undefined;
  const nextProject =
    projectIndex >= 0 ? PROJECTS[(projectIndex + 1) % PROJECTS.length] : undefined;
  const prevProject =
    projectIndex >= 0
      ? PROJECTS[(projectIndex - 1 + PROJECTS.length) % PROJECTS.length]
      : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]">
      <Navbar />
      <ProjectCaseBody
        slug={slug}
        initialProject={project}
        initialIndex={projectIndex >= 0 ? projectIndex : undefined}
        initialPrev={prevProject}
        initialNext={nextProject}
        initialCount={PROJECTS.length}
      />
      <Colophon />
    </div>
  );
}

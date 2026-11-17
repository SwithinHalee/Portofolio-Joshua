import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { AboutMe } from "@/components/about-me";
import { Projects } from "@/components/projects";
import { CertificatesSection } from "@/components/certificates";
import { Dossier } from "@/components/dossier";
import { Principles } from "@/components/principles";
import { Workspace } from "@/components/workspace";
import { Experience } from "@/components/experience";
import { Colophon } from "@/components/colophon";
import { ScrollMilestone } from "@/components/scroll-milestone";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

function profilePageSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema()) }}
      />
      <ScrollMilestone />
      <main id="main-content" className="flex-1">
        <Hero />
        <AboutMe />
        <Projects />
        <CertificatesSection />
        {/* Stacking overlap: Principles slides over pinned Dossier as you scroll */}
        <div id="dossier-stack" className="relative overflow-x-clip">
          <Dossier />
          <Principles />
          <div aria-hidden="true" className="hidden md:block md:h-[115dvh]" />
        </div>
        {/* Stacking overlap: Experience slides over pinned Workspace as you scroll */}
        <div id="workspace-stack" className="relative overflow-x-clip">
          <Workspace />
          <Experience />
          <div aria-hidden="true" className="hidden md:block md:h-[115dvh]" />
        </div>
      </main>
      <Colophon />
    </div>
  );
}
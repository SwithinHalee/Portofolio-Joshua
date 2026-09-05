import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AboutMe } from "@/components/about-me";
import { Projects } from "@/components/projects";
import { StackingCardsSection } from "@/components/stacking-cards";
import { Dossier } from "@/components/dossier";
import { Principles } from "@/components/principles";
import { Workspace } from "@/components/workspace";
import { Experience } from "@/components/experience";
import { Colophon } from "@/components/colophon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AboutMe />
        <Projects />
        <StackingCardsSection />
        <Dossier />
        <Principles />
        <Workspace />
        <Experience />
      </main>
      <Colophon />
    </div>
  );
}
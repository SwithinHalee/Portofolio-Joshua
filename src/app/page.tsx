import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Dossier } from "@/components/dossier";
import { Principles } from "@/components/principles";
import { Experience } from "@/components/experience";
import { Colophon } from "@/components/colophon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Dossier />
        <Principles />
        <Experience />
      </main>
      <Colophon />
    </div>
  );
}
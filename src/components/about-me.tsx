"use client";

import Image from "next/image";
import { MapPin } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion-wrapper";
import { DossierGallery } from "@/components/dossier-gallery";
import { PERSONAL_INFO } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";

const STANDARDS = [
  {
    num: "01",
    topic: "Maintainability",
    note: "Code is read ten times more than written: optimize boundaries, types, and naming for the next reader.",
  },
  {
    num: "02",
    topic: "Performance & Attention",
    note: "Sub-second interfaces respect the visitor's time and battery through lean bundles and minimal layout churn.",
  },
  {
    num: "03",
    topic: "Systems Perspective",
    note: "Understanding HTTP caching, relational schemas, and packet routing makes every frontend architecture more resilient.",
  },
];

export function AboutMe() {
  const { data } = usePortfolio();
  const personalInfo = data.personalInfo ?? PERSONAL_INFO;

  return (
    <section
      id="about"
      className="dark-section border-b border-[#222222] bg-[#111111] py-24 md:py-32 text-[#FAFAFA]"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left Column: Transparent Monochrome Portrait Centerpiece + Bottom-Aligned Metadata */}
          <Reveal className="flex flex-col lg:col-span-5">
            <div className="relative flex w-full flex-1 items-end justify-center min-h-[340px]">
              {/* Subtle ambient radial key behind portrait so curls separate naturally on #111111 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_62%_at_50%_46%,rgba(255,255,255,0.06),transparent_72%)]"
              />

              <div className="relative aspect-[896/1200] w-full max-w-[380px] overflow-hidden">
                <Image
                  src="/images/about/joshua-bw-portrait.png"
                  alt="Monochrome editorial portrait of Joshua Abdiel"
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 1024px) 92vw, 380px"
                  priority={false}
                />
                {/* Soft edge dissolves on lower coat shoulders & bottom waist into #111111 */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#111111] via-[#111111]/65 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#111111] to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#111111] to-transparent"
                />
              </div>
            </div>

            <dl className="mt-6 shrink-0 divide-y divide-[#262626] border-y border-[#262626] font-sans text-xs">
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wider text-[#A3A3A3]">
                  Role
                </dt>
                <dd className="text-right font-medium text-[#FAFAFA]">
                  FE Intern @ CarbonEthics
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wider text-[#A3A3A3]">
                  Location
                </dt>
                <dd className="inline-flex items-center gap-1.5 text-right font-medium text-[#FAFAFA]">
                  <MapPin size={12} weight="bold" className="text-[#A3A3A3]" aria-hidden="true" />
                  <span>Tangerang, ID</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wider text-[#A3A3A3]">
                  Timezone
                </dt>
                <dd className="font-mono text-xs font-medium text-[#FAFAFA]">
                  {personalInfo.timezone}
                </dd>
              </div>
            </dl>
          </Reveal>

          {/* Right Column: Editorial Narrative + Core Engineering Standards */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <Reveal delay={0.05}>
              <h2
                className="mb-6 whitespace-nowrap font-serif text-[21px] tracking-[-0.025em] leading-[1.15] text-[#FAFAFA] sm:text-[32px] lg:text-[33px]"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                The flesh is weak,{" "}
                <span className="text-[25px] text-[#B93836] sm:text-[38px] lg:text-[39px]">
                  but deeds endure
                </span>
              </h2>

              <div className="space-y-4 font-sans text-sm leading-relaxed text-[#C8C8C8] sm:text-base max-w-[60ch]">
                <p>
                  I am an Information Systems undergraduate at Universitas Tarumanagara and
                  currently work as a Frontend Engineering Intern at{" "}
                  <span className="font-medium text-[#FFFFFF]">CarbonEthics</span>, building
                  responsive climate-tech workflows, emission calculators, and modular UI token
                  systems.
                </p>
                <p>
                  My technical focus spans strict TypeScript, React and Next.js application
                  architecture, relational SQLite/PostgreSQL modeling, and network topology testing.
                  Away from the editor, I unwind with badminton, weekend camping, colony-sim games,
                  and exploring PC hardware.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 lg:mt-12">
              <ol className="divide-y divide-[#262626] border-y border-[#262626]">
                {STANDARDS.map((item) => (
                  <li
                    key={item.num}
                    className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-6 sm:items-baseline"
                  >
                    <div className="flex items-baseline gap-2.5 sm:col-span-5">
                      <span className="font-mono text-xs font-semibold text-[#A3A3A3]">
                        {item.num}
                      </span>
                      <h3 className="font-sans text-sm font-medium text-[#FAFAFA]">
                        {item.topic}
                      </h3>
                    </div>
                    <p className="font-sans text-xs leading-relaxed text-[#B3B3B3] sm:col-span-7 sm:text-[13px]">
                      {item.note}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 empty:hidden"><DossierGallery /></div>
      </div>
    </section>
  );
}

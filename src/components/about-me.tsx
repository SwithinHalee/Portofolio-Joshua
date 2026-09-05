"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion-wrapper";

export function AboutMe() {
  const profileDetails = [
    { label: "Legal Name", value: "Joshua Abdiel" },
    { label: "Preferred Callsign", value: "Josh / Joshua" },
    { label: "Current Role", value: "FE Intern @ CarbonEthics" },
    { label: "Undergraduate", value: "UNTAR (Information Systems)" },
    { label: "Academic Roots", value: "Santo Fransiskus Asisi" },
    { label: "Homebase", value: "Tangerang Kota, Banten, ID" },
    { label: "Local Timezone", value: "WIB (UTC+7)" },
    { label: "Language Proficiency", value: "Indonesian (Native), English" },
  ];

  const horizonCards = [
    {
      marker: "ACTIVE NOW",
      title: "Climate Tech at CarbonEthics",
      description:
        "Developing responsive carbon calculator interfaces, dynamic tree-planting monitors, and modular design tokens with Next.js App Router and strict TypeScript.",
      accent: "green",
    },
    {
      marker: "EXPLORING",
      title: "Design Engineering & Networks",
      description:
        "Investigating motion physics (sticky scroll, stacking parallax), type-level programming, and enterprise packet routing topology in GNS3.",
      accent: "blue",
    },
    {
      marker: "HORIZON",
      title: "Post-Internship Engagement",
      description:
        "Graduating internship in Q4 2026. Actively open for select full-time frontend engineering roles and systems architecture teams that prize deliberate craft.",
      accent: "amber",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-2">
              <span>02 / BIOGRAPHIC DOSSIER</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>IDENTITY & CONVICTIONS</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Between Systems Theory & Frontend Craft
            </h2>
            <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-sans">
              An honest account of who I am, the analytical disciplines that shape my engineering,
              and the standards I uphold when building software.
            </p>
          </div>
        </Reveal>

        {/* Asymmetrical Profile Layout (Portrait + Dossier Narrative) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-16">
          {/* Left: Editorial Portrait Specimen Frame (5 Columns) */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              {/* Window Chrome Bar */}
              <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FBFBFA] px-3.5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#E5E5E5] inline-block"></span>
                  <span className="h-2 w-2 rounded-full bg-[#E5E5E5] inline-block"></span>
                  <span className="h-2 w-2 rounded-full bg-[#E5E5E5] inline-block"></span>
                </div>
                <span className="font-mono text-[11px] text-[#787774]">
                  joshua-abdiel.profile — 35mm
                </span>
                <span className="h-2 w-2 rounded-full bg-[#346538]"></span>
              </div>

              {/* Portrait Image Container */}
              <div className="relative aspect-[4/3] w-full bg-[#F5F5F3] overflow-hidden">
                <Image
                  src="/images/joshua.jpg"
                  alt="Joshua Abdiel in studio environment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-[#111111]/[0.02] pointer-events-none"></div>
              </div>

              {/* Caption Metadata */}
              <div className="p-4 bg-[#FFFFFF] border-t border-[#EAEAEA] font-mono text-[11px] text-[#787774] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#999999]">Coordinates</span>
                  <span className="text-[#111111] font-medium">6.1783° S, 106.6319° E</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#999999]">Location</span>
                  <span className="text-[#111111] font-medium">Tangerang, Banten, ID</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#999999]">Status</span>
                  <span className="text-[#346538] font-medium bg-[#EDF3EC] px-1.5 py-0.2 rounded border border-[#D5E8D4]">
                    ACTIVE INTERNSHIP
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: Narrative Dossier & Matrix (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal delay={0.12}>
              <div className="space-y-4 text-sm sm:text-base text-[#444444] font-sans leading-relaxed">
                <p>
                  I am an undergraduate in <strong>Information Systems</strong> at{" "}
                  <strong>Universitas Tarumanagara (UNTAR)</strong>, based in Tangerang, Banten.
                  My early analytical discipline was forged at <em>Santo Fransiskus Asisi</em>, where
                  I developed an enduring curiosity for how complex systems are structured and made resilient.
                </p>

                <p>
                  Currently, I serve as a <strong>Frontend Engineering Intern at CarbonEthics</strong>,
                  building modern web platforms that translate ecological and carbon offset calculations
                  into clear, responsive client applications. This work demands zero compromise: calculations
                  must be mathematically exact, components must hydrate seamlessly, and interfaces must feel
                  weightless across all viewports.
                </p>

                <p>
                  My engineering philosophy is rooted in <em>restraint and deliberate craft</em>. I reject
                  AI slop, bloated dependencies, and superficial eye-candy in favor of strict type contracts,
                  sub-second paint times, and enduring editorial aesthetics that genuinely respect human attention.
                </p>
              </div>
            </Reveal>

            {/* Key-Value Identity Matrix */}
            <Reveal delay={0.16}>
              <div className="mt-6 rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] p-5 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {profileDetails.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between border-b border-[#EAEAEA] pb-1.5"
                    >
                      <span className="text-[#888888] text-[11px]">{item.label}</span>
                      <span className="font-medium text-[#111111] text-[11px] text-right">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Triptych Parameters: Now, Exploring & Horizon */}
        <Reveal delay={0.2}>
          <div className="border-t border-[#EAEAEA] pt-12">
            <div className="mb-6 font-mono text-xs uppercase tracking-wider text-[#787774]">
              {"// HORIZON PARAMETERS & ENGAGEMENTS"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {horizonCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between transition-colors hover:border-[#CCCCCC]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-mono tracking-wider font-medium ${
                          card.accent === "green"
                            ? "bg-[#EDF3EC] text-[#346538] border border-[#D5E8D4]"
                            : card.accent === "blue"
                            ? "bg-[#E1F3FE] text-[#1F6C9F] border border-[#CDE7FB]"
                            : "bg-[#FBF3DB] text-[#956400] border border-[#F4E3B5]"
                        }`}
                      >
                        {card.marker}
                      </span>
                    </div>

                    <h3
                      className="text-lg font-serif text-[#111111] font-medium tracking-tight mb-2.5"
                      style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
                    >
                      {card.title}
                    </h3>

                    <p className="text-xs text-[#555555] leading-relaxed font-sans">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
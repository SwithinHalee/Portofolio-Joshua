"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fingerprint,
  MapPin,
  Quotes,
  TerminalWindow,
} from "@phosphor-icons/react";
import { Reveal } from "@/components/motion-wrapper";

type DossierLens = "philosophy" | "trajectory" | "terminal";

export function AboutMe() {
  const [activeLens, setActiveLens] = useState<DossierLens>("philosophy");
  const [activeTerminalCmd, setActiveTerminalCmd] = useState<string>("whoami");

  const terminalOutputs: Record<string, string> = {
    whoami: `// Identity & Affiliation Record
{
  "name": "Joshua Abdiel",
  "callsign": "Josh",
  "title": "Frontend Engineer & Systems Undergraduate",
  "institution": "Universitas Tarumanagara (UNTAR)",
  "degree": "Bachelor of Science, Information Systems",
  "current_engagement": "Frontend Engineering Intern @ CarbonEthics",
  "location": "Tangerang Kota, Banten, ID [6.1783° S, 106.6319° E]",
  "timezone": "WIB (UTC+7)",
  "status": "Available for select full-time roles starting Q4 2026"
}`,
    "cat carbonethics.md": `# CarbonEthics Engagement Brief
Role: Frontend Engineering Intern (Feb 2026 – Oct 2026)
Domain: Climate Tech, Blue Carbon, & Enterprise Sustainability

Core Responsibilities:
- Engineered responsive client interfaces for Carbon Offset Estimator
- Built dynamic tree-planting monitoring modules with live coordinates
- Implemented modular design-token system eliminating style drift
- Audited client bundle sizes ensuring sub-second Largest Contentful Paint`,
    "cat stack.json": `// Engineering Instrument Cluster
{
  "languages": ["TypeScript (Strict)", "JavaScript (ESNext)", "SQL"],
  "frontend": ["React 19", "Next.js 16 (App Router)", "Tailwind CSS v4", "TanStack Query", "Framer Motion"],
  "systems": ["Node.js", "PostgreSQL", "REST APIs", "GNS3 Network Topology"],
  "tooling": ["VS Code", "Postman", "Git / GitHub", "Figma", "Google Antigravity"]
}`,
    "cat contact.sh": `#!/bin/sh
# Direct Channel Protocol
echo "Primary: joshuaabdiel365@gmail.com"
echo "GitHub:  https://github.com/SwithinHalee"
echo "LinkedIn: https://www.linkedin.com/in/joshua-abdiel-773965282/"
echo "Location: Tangerang / Jakarta / Remote"`,
  };

  return (
    <section id="about" className="py-24 md:py-32 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-2">
                <span>02 / BIOGRAPHIC DOSSIER</span>
                <span className="text-[#EAEAEA]">•</span>
                <span>THE SPECIMEN ARCHIVE</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                Deliberate Craft, Not Default Output
              </h2>
            </div>

            {/* Interactive Perspective Lens Switcher */}
            <div className="flex flex-wrap items-center gap-1 font-mono text-xs p-1 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA]">
              <button
                type="button"
                onClick={() => setActiveLens("philosophy")}
                className={`px-3 py-1.5 rounded-[4px] transition-colors ${
                  activeLens === "philosophy"
                    ? "bg-[#111111] text-white font-medium"
                    : "text-[#787774] hover:text-[#111111]"
                }`}
              >
                [01] Ethos & Philosophy
              </button>
              <button
                type="button"
                onClick={() => setActiveLens("trajectory")}
                className={`px-3 py-1.5 rounded-[4px] transition-colors ${
                  activeLens === "trajectory"
                    ? "bg-[#111111] text-white font-medium"
                    : "text-[#787774] hover:text-[#111111]"
                }`}
              >
                [02] Trajectory & Roots
              </button>
              <button
                type="button"
                onClick={() => setActiveLens("terminal")}
                className={`px-3 py-1.5 rounded-[4px] transition-colors flex items-center gap-1.5 ${
                  activeLens === "terminal"
                    ? "bg-[#111111] text-white font-medium"
                    : "text-[#787774] hover:text-[#111111]"
                }`}
              >
                <TerminalWindow size={13} weight="bold" />
                <span>[03] Live Terminal</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Main Asymmetric Grid: Physical Security Clearance Badge + Interactive Lens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column (5 Cols): The Physical Clearance Badge & Specimen Card */}
          <Reveal delay={0.06} className="lg:col-span-5">
            <div className="rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              {/* Badge Top Header */}
              <div className="border-b border-[#EAEAEA] bg-[#FBFBFA] p-3.5 flex items-center justify-between font-mono text-[10px] text-[#787774]">
                <div className="flex items-center gap-2">
                  <Fingerprint size={16} weight="bold" className="text-[#111111]" />
                  <span className="font-semibold text-[#111111] tracking-wider">
                    SPECIMEN ID: JSH-2026
                  </span>
                </div>
                <span className="text-[#346538] bg-[#EDF3EC] px-1.5 py-0.5 rounded border border-[#D5E8D4]">
                  ACTIVE INTERN
                </span>
              </div>

              {/* Portrait Photo Container */}
              <div className="relative aspect-[4/3] w-full bg-[#F5F5F3] overflow-hidden">
                <Image
                  src="/images/joshua.jpg"
                  alt="Joshua Abdiel portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 440px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-[#111111]/[0.02] pointer-events-none"></div>

                {/* Subtle Authentic Postal / Watermark Stamp in Corner */}
                <div className="absolute top-3 right-3 rounded border border-white/60 bg-black/40 backdrop-blur-md px-2 py-1 font-mono text-[9px] text-white tracking-widest uppercase">
                  UNTAR SI • 2027
                </div>
              </div>

              {/* Physical Clearance Parameters Table */}
              <div className="p-4 bg-[#FFFFFF] border-t border-[#EAEAEA] font-mono text-[11px] text-[#555555] space-y-2">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-1.5">
                  <span className="text-[#888888] text-[10px] uppercase">Subject</span>
                  <span className="font-semibold text-[#111111]">Joshua Abdiel [Josh]</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-1.5">
                  <span className="text-[#888888] text-[10px] uppercase">Engagement</span>
                  <span className="text-[#111111]">FE Intern @ CarbonEthics</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-1.5">
                  <span className="text-[#888888] text-[10px] uppercase">Coordinates</span>
                  <span className="text-[#111111]">6.1783° S, 106.6319° E</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-1.5">
                  <span className="text-[#888888] text-[10px] uppercase">Homebase</span>
                  <span className="text-[#111111]">Tangerang Kota, Banten</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[#888888] text-[10px] uppercase">Barcode Verification</span>
                  <span className="font-mono text-[10px] tracking-tighter text-[#444444]">
                    ||| | |||| | || | |||| ||
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column (7 Cols): Dynamic Lens Views */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeLens === "philosophy" && (
                <motion.div
                  key="philosophy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Narrative paragraphs */}
                  <div className="space-y-4 text-sm sm:text-base text-[#444444] font-sans leading-relaxed">
                    <p>
                      I build web interfaces that treat <strong>performance as an ethical duty</strong>{" "}
                      and <strong>type safety as an immutable contract</strong>. Currently pursuing{" "}
                      <strong>Information Systems at Universitas Tarumanagara</strong> while interning as a{" "}
                      <strong>Frontend Engineer at CarbonEthics</strong>.
                    </p>

                    <p>
                      In a web ecosystem overwhelmed by generic AI templates and bloated dependencies,
                      I favor <em>deliberate craft</em>. Whether architecting carbon footprint calculators or
                      testing distributed packet routing in GNS3, my goal is straightforward: build systems
                      that load instantaneously, communicate transparently, and remain maintainable years from now.
                    </p>
                  </div>

                  {/* 3 Non-Negotiable Tenets */}
                  <div className="border-t border-[#EAEAEA] pt-5 space-y-3 font-mono text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                      {"// THREE NON-NEGOTIABLE STANDARDS"}
                    </span>

                    <div className="space-y-2.5">
                      <div className="rounded border border-[#EAEAEA] bg-[#FBFBFA] p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#346538] font-bold">01</span>
                          <span className="font-semibold text-[#111111]">
                            Type Contracts Before Pixel Painting
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666666] font-sans">
                          Every API response and state machine must have strict immutable TypeScript
                          interfaces before UI code is touched. Runtime undefined is unacceptable.
                        </p>
                      </div>

                      <div className="rounded border border-[#EAEAEA] bg-[#FBFBFA] p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#346538] font-bold">02</span>
                          <span className="font-semibold text-[#111111]">
                            Sub-Second Painting & Minimalist Dependencies
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666666] font-sans">
                          Speed is a design feature. We aggressively audit bundle footprints, isolate client
                          hydration boundaries, and respect the user&apos;s bandwidth.
                        </p>
                      </div>

                      <div className="rounded border border-[#EAEAEA] bg-[#FBFBFA] p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#346538] font-bold">03</span>
                          <span className="font-semibold text-[#111111]">
                            Utilitarian Restraint Over Eye-Candy
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666666] font-sans">
                          Interfaces exist to convey truth and facilitate action, not to show off flashy
                          gratuitous animations. 1px hairline precision outlasts seasonal trends.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeLens === "trajectory" && (
                <motion.div
                  key="trajectory"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <p className="text-sm sm:text-base text-[#444444] font-sans leading-relaxed">
                    My engineering trajectory combines disciplined schooling, university systems theory,
                    and production climate-tech delivery:
                  </p>

                  {/* Vertical Roadmap Specimen */}
                  <div className="border border-[#EAEAEA] rounded-[8px] bg-[#FBFBFA] p-5 font-mono text-xs divide-y divide-[#EAEAEA]">
                    <div className="pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#111111] text-sm font-sans">
                          CarbonEthics — Frontend Engineering Intern
                        </span>
                        <span className="text-[10px] text-[#346538] bg-[#EDF3EC] px-1.5 py-0.5 rounded border border-[#D5E8D4]">
                          FEB 2026 — OCT 2026
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                        Shipping production features for Indonesia&apos;s leading carbon and mangrove
                        restoration platform. Translating complex emission conversion equations into
                        lightning-fast reactive components.
                      </p>
                    </div>

                    <div className="py-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#111111] text-sm font-sans">
                          Universitas Tarumanagara (UNTAR)
                        </span>
                        <span className="text-[10px] text-[#787774]">2023 — PRESENT</span>
                      </div>
                      <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                        Majoring in Information Systems (Sistem Informasi). Exploring enterprise
                        architecture, database schemas, systems analysis, and distributed networking.
                      </p>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#111111] text-sm font-sans">
                          Santo Fransiskus Asisi
                        </span>
                        <span className="text-[10px] text-[#787774]">PRIMARY — SENIOR HIGH</span>
                      </div>
                      <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                        Where logical curiosity, scientific inquiry, and a habit of rigorous daily
                        discipline were originally established.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#787774]">
                    <MapPin size={14} weight="bold" className="text-[#111111]" />
                    <span>Based in Poris, Cipondoh Indah, Tangerang Kota, Banten, Indonesia</span>
                  </div>
                </motion.div>
              )}

              {activeLens === "terminal" && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[8px] border border-[#EAEAEA] bg-[#111111] text-[#E0E0E0] font-mono text-xs overflow-hidden shadow-sm"
                >
                  {/* Terminal Header */}
                  <div className="border-b border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] inline-block"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] inline-block"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F] inline-block"></span>
                      <span className="text-[11px] text-[#888888] ml-2">
                        joshua@tangerang:~ (zsh)
                      </span>
                    </div>
                    <span className="text-[10px] text-[#666666]">INTERACTIVE TELEMETRY</span>
                  </div>

                  {/* Interactive Command Tabs */}
                  <div className="border-b border-[#222222] bg-[#161616] px-3 py-1.5 flex flex-wrap gap-1 text-[11px]">
                    {Object.keys(terminalOutputs).map((cmd) => (
                      <button
                        key={cmd}
                        type="button"
                        onClick={() => setActiveTerminalCmd(cmd)}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          activeTerminalCmd === cmd
                            ? "bg-[#2E2E2E] text-white font-semibold"
                            : "text-[#888888] hover:text-white"
                        }`}
                      >
                        $ {cmd}
                      </button>
                    ))}
                  </div>

                  {/* Terminal Screen Body */}
                  <div className="p-5 font-mono text-[11px] leading-relaxed overflow-x-auto min-h-[260px] bg-[#0E0E0E]">
                    <div className="flex items-center gap-2 text-[#27C93F] mb-3">
                      <span>➜</span>
                      <span className="text-[#888888]">~</span>
                      <span className="text-white">{activeTerminalCmd}</span>
                    </div>

                    <pre className="text-[#CCCCCC] whitespace-pre-wrap">
                      {terminalOutputs[activeTerminalCmd]}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Section: Three Contrarian Axioms (Unique Editorial Index Cards) */}
        <Reveal delay={0.15}>
          <div className="border-t border-[#EAEAEA] pt-12">
            <div className="mb-6 font-mono text-xs uppercase tracking-wider text-[#787774] flex items-center justify-between">
              <span>{"// CONTRARIAN AXIOMS & CONVICTIONS"}</span>
              <span className="text-[#999999] text-[10px]">STANDARDS HELD HIGH</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between transition-colors hover:border-[#CCCCCC]">
                <Quotes size={22} weight="fill" className="text-[#CCCCCC] mb-3" />
                <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-sans mb-4">
                  &ldquo;Software is read ten times more often than it is written. Optimize for the
                  second reader, not the cleverness of the first writer.&rdquo;
                </p>
                <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">
                  — ON MAINTAINABILITY
                </span>
              </div>

              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between transition-colors hover:border-[#CCCCCC]">
                <Quotes size={22} weight="fill" className="text-[#CCCCCC] mb-3" />
                <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-sans mb-4">
                  &ldquo;Sub-second interfaces feel like telepathy. Respecting the user&apos;s attention
                  and device battery is the highest form of respect.&rdquo;
                </p>
                <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">
                  — ON SPEED & LCP
                </span>
              </div>

              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between transition-colors hover:border-[#CCCCCC]">
                <Quotes size={22} weight="fill" className="text-[#CCCCCC] mb-3" />
                <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-sans mb-4">
                  &ldquo;Understanding network routing and database indexing makes you ten times better
                  at building reliable, bulletproof client applications.&rdquo;
                </p>
                <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">
                  — ON SYSTEMS THINKING
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
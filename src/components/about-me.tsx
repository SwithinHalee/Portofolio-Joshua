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
        {/* Main 2-Column Grid: Left Title & Context / Right Unified Specimen Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column (5 Cols): Headline, Bio, and Lens Navigation */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <Reveal>
              <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-3">
                <span>02 / BIOGRAPHIC DOSSIER</span>
                <span className="text-[#EAEAEA]">•</span>
                <span>PROFILE</span>
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-[40px] font-serif text-[#111111] tracking-[-0.03em] leading-[1.12] mb-5"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                Deliberate Craft, Not Default Output
              </h2>

              <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-sans mb-6">
                I build web software with architectural rigor, strict type safety, and utilitarian
                restraint. Navigating between systems theory at <strong>Universitas Tarumanagara</strong> and
                production climate-tech platforms at <strong>CarbonEthics</strong>.
              </p>

              {/* Vertical Perspective Selector */}
              <div className="border border-[#EAEAEA] rounded-[8px] bg-[#FBFBFA] p-2 space-y-1 font-mono text-xs">
                <span className="text-[10px] uppercase text-[#888888] px-2.5 py-1 block">
                  Select Inspection Lens
                </span>

                <button
                  type="button"
                  onClick={() => setActiveLens("philosophy")}
                  className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors flex items-center justify-between ${
                    activeLens === "philosophy"
                      ? "bg-[#111111] text-white font-medium"
                      : "text-[#666666] hover:text-[#111111] hover:bg-[#F3F3F0]"
                  }`}
                >
                  <span>[01] Ethos & Philosophy</span>
                  <span className="text-[10px] opacity-70">Standards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLens("trajectory")}
                  className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors flex items-center justify-between ${
                    activeLens === "trajectory"
                      ? "bg-[#111111] text-white font-medium"
                      : "text-[#666666] hover:text-[#111111] hover:bg-[#F3F3F0]"
                  }`}
                >
                  <span>[02] Trajectory & Roots</span>
                  <span className="text-[10px] opacity-70">Timeline</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLens("terminal")}
                  className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors flex items-center justify-between ${
                    activeLens === "terminal"
                      ? "bg-[#111111] text-white font-medium"
                      : "text-[#666666] hover:text-[#111111] hover:bg-[#F3F3F0]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <TerminalWindow size={13} weight="bold" />
                    <span>[03] Live Terminal</span>
                  </div>
                  <span className="text-[10px] opacity-70">Interactive</span>
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right Column (7 Cols): Unified Master Specimen Card */}
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <div className="rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                {/* 1. Master Specimen Barcode & Clearance Top Bar */}
                <div className="border-b border-[#EAEAEA] bg-[#FBFBFA] px-4 py-3 flex items-center justify-between font-mono text-[11px] text-[#787774]">
                  <div className="flex items-center gap-2">
                    <Fingerprint size={16} weight="bold" className="text-[#111111]" />
                    <span className="font-semibold text-[#111111] tracking-wider">
                      SPECIMEN ID: JSH-2026
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-[#111111] font-mono text-[10px] tracking-tighter">
                      ||| | |||| | || | |||| ||
                    </span>
                    <span className="text-[#346538] bg-[#EDF3EC] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#D5E8D4]">
                      ACTIVE INTERN
                    </span>
                  </div>
                </div>

                {/* 2. Unified Specimen Identity Grid (Portrait + Parameters Unified) */}
                <div className="p-4 sm:p-5 border-b border-[#EAEAEA] bg-[#FFFFFF]">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    {/* Compact Portrait Frame */}
                    <div className="sm:col-span-4">
                      <div className="relative aspect-[4/3] w-full rounded-[6px] border border-[#EAEAEA] bg-[#F5F5F3] overflow-hidden">
                        <Image
                          src="/images/joshua.jpg"
                          alt="Joshua Abdiel portrait"
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 200px"
                          priority={false}
                        />
                        <div className="absolute inset-0 bg-[#111111]/[0.02] pointer-events-none"></div>
                        <div className="absolute top-2 right-2 rounded border border-white/60 bg-black/40 backdrop-blur-md px-1.5 py-0.5 font-mono text-[8px] text-white tracking-wider uppercase">
                          UNTAR SI
                        </div>
                      </div>
                    </div>

                    {/* Integrated Identity Parameters Table */}
                    <div className="sm:col-span-8 font-mono text-xs space-y-1.5">
                      <div className="flex items-baseline justify-between border-b border-[#EAEAEA] pb-1">
                        <span className="text-[#888888] text-[10px] uppercase">Subject</span>
                        <span className="font-semibold text-[#111111] text-xs">Joshua Abdiel [Josh]</span>
                      </div>
                      <div className="flex items-baseline justify-between border-b border-[#EAEAEA] pb-1">
                        <span className="text-[#888888] text-[10px] uppercase">Engagement</span>
                        <span className="text-[#111111] text-xs">FE Intern @ CarbonEthics</span>
                      </div>
                      <div className="flex items-baseline justify-between border-b border-[#EAEAEA] pb-1">
                        <span className="text-[#888888] text-[10px] uppercase">Coordinates</span>
                        <span className="text-[#111111] text-xs">6.1783° S, 106.6319° E</span>
                      </div>
                      <div className="flex items-baseline justify-between border-b border-[#EAEAEA] pb-1">
                        <span className="text-[#888888] text-[10px] uppercase">Homebase</span>
                        <span className="text-[#111111] text-xs">Tangerang Kota, Banten</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-[#888888] text-[10px] uppercase">Barcode Verification</span>
                        <span className="font-mono text-[10px] tracking-tighter text-[#555555]">
                          ||| | |||| | || | |||| ||
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Dynamic Lens Content Unified Under the Specimen ID */}
                <div className="p-5 sm:p-6 bg-[#FFFFFF]">
                  <AnimatePresence mode="wait">
                    {activeLens === "philosophy" && (
                      <motion.div
                        key="philosophy"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2 font-mono text-[11px] text-[#787774]">
                          <span className="uppercase text-[10px] text-[#111111] font-semibold">
                            LENS [01]: CORE ENGINEERING ETHOS
                          </span>
                          <span>STANDARDS ENFORCED</span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#444444] font-sans leading-relaxed">
                          In an era flooded with boilerplate AI templates, I build software that treats
                          performance as an ethical duty and type safety as an immutable contract.
                        </p>

                        {/* Standards Stack */}
                        <div className="space-y-2.5 font-mono text-xs">
                          <div className="rounded border border-[#EAEAEA] bg-[#FBFBFA] p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[#346538] font-bold">01</span>
                              <span className="font-semibold text-[#111111]">
                                Type Contracts Before Pixel Painting
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                              Immutable TypeScript interfaces established prior to component creation.
                              Eliminating runtime defects at compile-time.
                            </p>
                          </div>

                          <div className="rounded border border-[#EAEAEA] bg-[#FBFBFA] p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[#346538] font-bold">02</span>
                              <span className="font-semibold text-[#111111]">
                                Sub-Second Painting & Minimalist Dependencies
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                              Speed is a design feature. Auditing bundle sizes and isolating client hydration
                              boundaries to preserve battery and attention.
                            </p>
                          </div>

                          <div className="rounded border border-[#EAEAEA] bg-[#FBFBFA] p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[#346538] font-bold">03</span>
                              <span className="font-semibold text-[#111111]">
                                Utilitarian Restraint Over Eye-Candy
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                              Interfaces exist to convey truth and facilitate action. 1px hairline precision
                              outlasts superficial animation trends.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeLens === "trajectory" && (
                      <motion.div
                        key="trajectory"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2 font-mono text-[11px] text-[#787774]">
                          <span className="uppercase text-[10px] text-[#111111] font-semibold">
                            LENS [02]: CHRONOLOGICAL ROOTS
                          </span>
                          <span>ACADEMIC & PRODUCTION</span>
                        </div>

                        {/* Trajectory Timeline in Master Card */}
                        <div className="border border-[#EAEAEA] rounded-[8px] bg-[#FBFBFA] p-4 font-mono text-xs divide-y divide-[#EAEAEA]">
                          <div className="pb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[#111111] text-xs font-sans">
                                CarbonEthics — Frontend Engineering Intern
                              </span>
                              <span className="text-[9px] text-[#346538] bg-[#EDF3EC] px-1.5 py-0.5 rounded border border-[#D5E8D4]">
                                FEB 2026 — OCT 2026
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                              Shipping production interfaces for Indonesia&apos;s carbon and mangrove restoration
                              platform with responsive calculators and modular design tokens.
                            </p>
                          </div>

                          <div className="py-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[#111111] text-xs font-sans">
                                Universitas Tarumanagara (UNTAR)
                              </span>
                              <span className="text-[9px] text-[#787774]">2023 — PRESENT</span>
                            </div>
                            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                              Information Systems (Sistem Informasi). Enterprise ERP, database modeling,
                              systems analysis, and distributed networking.
                            </p>
                          </div>

                          <div className="pt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[#111111] text-xs font-sans">
                                Santo Fransiskus Asisi
                              </span>
                              <span className="text-[9px] text-[#787774]">PRIMARY — SENIOR HIGH</span>
                            </div>
                            <p className="text-[11px] text-[#666666] font-sans leading-relaxed">
                              Analytical discipline, mathematical reasoning, and logical foundational training.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-[#787774]">
                          <MapPin size={13} weight="bold" className="text-[#111111]" />
                          <span>Poris, Cipondoh Indah, Tangerang Kota, Banten, Indonesia</span>
                        </div>
                      </motion.div>
                    )}

                    {activeLens === "terminal" && (
                      <motion.div
                        key="terminal"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-[8px] border border-[#2A2A2A] bg-[#111111] text-[#E0E0E0] font-mono text-xs overflow-hidden"
                      >
                        {/* Terminal Header */}
                        <div className="border-b border-[#2A2A2A] bg-[#1A1A1A] px-3.5 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#FF5F56] inline-block"></span>
                            <span className="h-2 w-2 rounded-full bg-[#FFBD2E] inline-block"></span>
                            <span className="h-2 w-2 rounded-full bg-[#27C93F] inline-block"></span>
                            <span className="text-[10px] text-[#888888] ml-2">
                              joshua@tangerang:~ (zsh)
                            </span>
                          </div>
                          <span className="text-[9px] text-[#666666]">CLI TELEMETRY</span>
                        </div>

                        {/* Interactive Command Tabs */}
                        <div className="border-b border-[#222222] bg-[#161616] px-3 py-1.5 flex flex-wrap gap-1 text-[10px]">
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
                        <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto min-h-[220px] bg-[#0E0E0E]">
                          <div className="flex items-center gap-1.5 text-[#27C93F] mb-2 text-[10px]">
                            <span>➜</span>
                            <span className="text-[#888888]">~</span>
                            <span className="text-white">{activeTerminalCmd}</span>
                          </div>

                          <pre className="text-[#CCCCCC] whitespace-pre-wrap text-[11px]">
                            {terminalOutputs[activeTerminalCmd]}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom Section: Three Contrarian Axioms */}
        <Reveal delay={0.15}>
          <div className="border-t border-[#EAEAEA] pt-12">
            <div className="mb-6 font-mono text-xs uppercase tracking-wider text-[#787774] flex items-center justify-between">
              <span>{"// CONTRARIAN AXIOMS & CONVICTIONS"}</span>
              <span className="text-[#999999] text-[10px]">STANDARDS HELD HIGH</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between transition-colors hover:border-[#CCCCCC]">
                <Quotes size={20} weight="fill" className="text-[#CCCCCC] mb-3" />
                <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-sans mb-4">
                  &ldquo;Software is read ten times more often than it is written. Optimize for the
                  second reader, not the cleverness of the first writer.&rdquo;
                </p>
                <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">
                  — ON MAINTAINABILITY
                </span>
              </div>

              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between transition-colors hover:border-[#CCCCCC]">
                <Quotes size={20} weight="fill" className="text-[#CCCCCC] mb-3" />
                <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-sans mb-4">
                  &ldquo;Sub-second interfaces feel like telepathy. Respecting the user&apos;s attention
                  and device battery is the highest form of respect.&rdquo;
                </p>
                <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">
                  — ON SPEED & LCP
                </span>
              </div>

              <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between transition-colors hover:border-[#CCCCCC]">
                <Quotes size={20} weight="fill" className="text-[#CCCCCC] mb-3" />
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
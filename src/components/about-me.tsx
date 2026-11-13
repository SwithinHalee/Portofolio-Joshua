"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fingerprint,
  MapPin,
  Quotes,
  TerminalWindow,
} from "@phosphor-icons/react";
import { Reveal } from "@/components/motion-wrapper";
import { DossierGallery } from "@/components/dossier-gallery";

type DossierLens = "philosophy" | "trajectory" | "terminal";

const LENSES_CYCLE: { id: DossierLens; duration: number }[] = [
  { id: "philosophy", duration: 7500 },
  { id: "trajectory", duration: 7500 },
  { id: "terminal", duration: 24000 },
];

const TERMINAL_COMMANDS = [
  "whoami",
  "cat carbonethics.md",
  "cat stack.json",
  "cat contact.sh",
];

export function AboutMe() {
  const [activeLens, setActiveLens] = useState<DossierLens>("philosophy");
  const [isLensAutoPaused, setIsLensAutoPaused] = useState<boolean>(false);
  const [activeTerminalCmd, setActiveTerminalCmd] = useState<string>("whoami");
  const [isTerminalAutoPaused, setIsTerminalAutoPaused] = useState<boolean>(false);

  // Auto-switch lens on timer with smart pause on hover
  useEffect(() => {
    if (isLensAutoPaused) return;

    const currentLensObj =
      LENSES_CYCLE.find((l) => l.id === activeLens) || LENSES_CYCLE[0];
    const duration = currentLensObj.duration;

    const timer = setTimeout(() => {
      setActiveLens((prev) => {
        const idx = LENSES_CYCLE.findIndex((l) => l.id === prev);
        const nextIdx = (idx + 1) % LENSES_CYCLE.length;
        return LENSES_CYCLE[nextIdx].id;
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [activeLens, isLensAutoPaused]);

  const terminalOutputs: Record<string, string> = {
    whoami: `// Identity & Affiliation Record
{
  "name": "Joshua Abdiel",
  "callsign": "Josh",
  "title": "Frontend Developer & Information System Undergraduate",
  "institution": "Universitas Tarumanagara (UNTAR)",
  "degree": "Bachelor of Science, Information Systems",
  "current_engagement": "Frontend Engineering Intern @ CarbonEthics",
  "location": "Tangerang Kota, Banten, ID [6.175722° S, 106.686231° E]",
  "timezone": "WIB (UTC+7)",
  "status": "Q4 2026 plans open — possible CarbonEthics extension, unconfirmed"
}`,
    "cat carbonethics.md": `# CarbonEthics Engagement Brief
Role: Frontend Engineering Intern (Feb 2026 – Oct 2026)
Domain: Climate Tech, Blue Carbon, & Enterprise Sustainability

Core Responsibilities:
- Engineered responsive client interfaces for Carbon Offset Estimator
- Built dynamic tree-planting monitoring modules with live coordinates
- Implemented modular design-token system eliminating style drift
- Audited client bundle sizes against Largest Contentful Paint budgets`,
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

  const [typedCmd, setTypedCmd] = useState<string>("whoami");
  const [typedOutput, setTypedOutput] = useState<string>(terminalOutputs["whoami"]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (activeLens !== "terminal") return;

    const targetCmd = activeTerminalCmd;
    const targetOutput = terminalOutputs[targetCmd] || "";

    const initTimer = setTimeout(() => {
      setIsTyping(true);
      setTypedCmd("");
      setTypedOutput("");
    }, 0);

    let isCancelled = false;
    let cmdIndex = 0;
    let outputIndex = 0;

    // Phase 1: Type the shell command
    const cmdInterval = setInterval(() => {
      if (isCancelled) return;
      cmdIndex++;
      setTypedCmd(targetCmd.slice(0, cmdIndex));

      if (cmdIndex >= targetCmd.length) {
        clearInterval(cmdInterval);

        // Phase 2: Short 60ms pause as "Enter" is struck
        const enterTimeout = setTimeout(() => {
          if (isCancelled) return;

          // Phase 3: Fast terminal output streaming (5 chars per tick)
          const outputInterval = setInterval(() => {
            if (isCancelled) return;
            outputIndex += 5;
            setTypedOutput(targetOutput.slice(0, outputIndex));

            if (outputIndex >= targetOutput.length) {
              setTypedOutput(targetOutput);
              setIsTyping(false);
              clearInterval(outputInterval);
            }
          }, 14);
        }, 60);

        return () => clearTimeout(enterTimeout);
      }
    }, 18);

    return () => {
      isCancelled = true;
      clearTimeout(initTimer);
      clearInterval(cmdInterval);
    };
  }, [activeTerminalCmd, activeLens]);

  // Auto-switch terminal command tabs when on terminal lens
  useEffect(() => {
    if (activeLens !== "terminal" || isTerminalAutoPaused || isLensAutoPaused) return;
    if (isTyping) return;

    const timer = setTimeout(() => {
      setActiveTerminalCmd((prev) => {
        const idx = TERMINAL_COMMANDS.indexOf(prev);
        const nextIdx = (idx + 1) % TERMINAL_COMMANDS.length;
        return TERMINAL_COMMANDS[nextIdx];
      });
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeLens, activeTerminalCmd, isTyping, isTerminalAutoPaused, isLensAutoPaused]);

  return (
    <section id="about" className="dark-section pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#222222] bg-[#0E0E0E] text-[#FFFFFF]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Main 2-Column Grid: Left Title & Context / Right Unified Specimen Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column (5 Cols): Headline, Bio, and Lens Navigation */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal>
              <h2
                className="text-3xl sm:text-4xl lg:text-[40px] font-serif text-[#FFFFFF] tracking-[-0.03em] leading-[1.12] mb-5"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                If this was a fairy tale, passion would awake dormant power, to grant you
                the ability to defeat me. But this is reality. Nothing so perfect would happen.
              </h2>

              <p className="text-sm sm:text-base text-[#B3B3B3] leading-relaxed font-sans mb-6">
                - Ainz Ooal Gown
              </p>

              {/* Vertical Perspective Selector with Auto-Cycle Animation (Inverted Colors) */}
              <div
                onMouseEnter={() => setIsLensAutoPaused(true)}
                onMouseLeave={() => setIsLensAutoPaused(false)}
                className="border border-[#262626] rounded-[8px] bg-[#141414] p-2 space-y-1 font-sans text-xs"
              >
                <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-[#A3A3A3] px-2.5 py-1">
                  <span>Select Inspection Lens</span>
                  <div
                    className="flex items-center"
                    title={isLensAutoPaused ? "Auto-cycle paused" : "Auto-cycling lenses"}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-[1px] ${
                        isLensAutoPaused ? "bg-[#737373]" : "bg-[#4ADE80]"
                      }`}
                    />
                    <span className="sr-only">
                      {isLensAutoPaused ? "Auto-cycle paused" : "Auto-cycling lenses"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveLens("philosophy")}
                  className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors flex items-center justify-between relative overflow-hidden ${
                    activeLens === "philosophy"
                      ? "bg-[#FFFFFF] text-[#111111] font-semibold"
                      : "text-[#B3B3B3] hover:text-white hover:bg-[#202020]"
                  }`}
                >
                  <span>
                    <span className="font-mono">[01]</span> Personal Loadout
                  </span>
                  <span className={`text-[11px] ${activeLens === "philosophy" ? "text-[#4A4A4A]" : "text-[#A3A3A3]"}`}>
                    Off-duty
                  </span>
                  {activeLens === "philosophy" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/15 overflow-hidden">
                      <motion.div
                        key={`timer-philosophy-${isLensAutoPaused}`}
                        initial={{ width: "0%" }}
                        animate={{ width: isLensAutoPaused ? undefined : "100%" }}
                        transition={{
                          duration: isLensAutoPaused ? 0 : 7.5,
                          ease: "linear",
                        }}
                        className="h-full bg-[#111111]/70"
                      />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLens("trajectory")}
                  className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors flex items-center justify-between relative overflow-hidden ${
                    activeLens === "trajectory"
                      ? "bg-[#FFFFFF] text-[#111111] font-semibold"
                      : "text-[#B3B3B3] hover:text-white hover:bg-[#202020]"
                  }`}
                >
                  <span>
                    <span className="font-mono">[02]</span> Trajectory & Roots
                  </span>
                  <span className={`text-[11px] ${activeLens === "trajectory" ? "text-[#4A4A4A]" : "text-[#A3A3A3]"}`}>
                    Timeline
                  </span>
                  {activeLens === "trajectory" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/15 overflow-hidden">
                      <motion.div
                        key={`timer-trajectory-${isLensAutoPaused}`}
                        initial={{ width: "0%" }}
                        animate={{ width: isLensAutoPaused ? undefined : "100%" }}
                        transition={{
                          duration: isLensAutoPaused ? 0 : 7.5,
                          ease: "linear",
                        }}
                        className="h-full bg-[#111111]/70"
                      />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLens("terminal")}
                  className={`w-full text-left px-3 py-2 rounded-[4px] transition-colors flex items-center justify-between relative overflow-hidden ${
                    activeLens === "terminal"
                      ? "bg-[#FFFFFF] text-[#111111] font-semibold"
                      : "text-[#B3B3B3] hover:text-white hover:bg-[#202020]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <TerminalWindow size={13} weight="bold" />
                    <span>
                      <span className="font-mono">[03]</span> Live Terminal
                    </span>
                  </div>
                  <span className={`text-[11px] ${activeLens === "terminal" ? "text-[#4A4A4A]" : "text-[#A3A3A3]"}`}>
                    Interactive
                  </span>
                  {activeLens === "terminal" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/15 overflow-hidden">
                      <motion.div
                        key={`timer-terminal-${isLensAutoPaused}`}
                        initial={{ width: "0%" }}
                        animate={{ width: isLensAutoPaused ? undefined : "100%" }}
                        transition={{
                          duration: isLensAutoPaused ? 0 : 11,
                          ease: "linear",
                        }}
                        className="h-full bg-[#111111]/70"
                      />
                    </div>
                  )}
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right Column (7 Cols): Unified Master Specimen Card */}
          <div
            className="lg:col-span-7"
            onMouseEnter={() => setIsLensAutoPaused(true)}
            onMouseLeave={() => setIsLensAutoPaused(false)}
          >
            <Reveal delay={0.08}>
              <div>
                {/* 1. Master Specimen Barcode & Clearance Top Bar */}
                <div className="border-b border-[#242424] py-3 flex items-center justify-between font-mono text-xs text-[#A3A3A3]">
                  <div className="flex items-center gap-2">
                    <Fingerprint size={16} weight="bold" className="text-white" />
                    <span className="font-semibold text-white tracking-wider">
                      SPECIMEN ID: JSH-2026
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-[#B3B3B3] font-mono text-xs tracking-tighter">
                      ||| | |||| | || | |||| ||
                    </span>
                    <span className="font-sans text-[#4ADE80] bg-[#14331C] px-2.5 py-1 rounded-[3px] text-[11px] leading-none font-semibold border border-[#22542B]">
                      ACTIVE INTERN
                    </span>
                  </div>
                </div>

                {/* 2. Unified Specimen Identity Grid (Portrait + Parameters Unified) */}
                <div className="py-6 border-b border-[#242424]">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    {/* Compact Portrait Frame */}
                    <div className="sm:col-span-4">
                      <div className="relative aspect-[4/3] w-full rounded-[6px] overflow-hidden">
                        <Image
                          src="/images/about/joshua-2.jpg"
                          alt="Joshua Abdiel portrait"
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 200px"
                          priority={false}
                        />
                        <div className="absolute inset-0 bg-[#111111]/[0.02] pointer-events-none"></div>
                        <div className="absolute top-2 right-2 rounded border border-white/20 bg-black/75 backdrop-blur-md px-2 py-0.5 font-mono text-[11px] text-white tracking-wider uppercase">
                          UNTAR SI
                        </div>
                      </div>
                    </div>

                    {/* Integrated Identity Parameters Table */}
                    <div className="sm:col-span-8 font-sans text-xs space-y-1.5">
                      <div className="flex items-baseline justify-between border-b border-[#242424] pb-1">
                        <span className="text-[#A3A3A3] text-[11px] uppercase tracking-wider">Subject</span>
                        <span className="font-semibold text-white text-xs">Joshua Abdiel [Josh]</span>
                      </div>
                      <div className="flex items-baseline justify-between border-b border-[#242424] pb-1">
                        <span className="text-[#A3A3A3] text-[11px] uppercase tracking-wider">Engagement</span>
                        <span className="text-white text-xs">FE Intern @ CarbonEthics</span>
                      </div>
                      <div className="flex items-baseline justify-between border-b border-[#242424] pb-1">
                        <span className="text-[#A3A3A3] text-[11px] uppercase tracking-wider">Coordinates</span>
                        <span className="font-mono text-[#D4D4D4] text-xs">6.175722° S, 106.686231° E</span>
                      </div>
                      <div className="flex items-baseline justify-between border-b border-[#242424] pb-1">
                        <span className="text-[#A3A3A3] text-[11px] uppercase tracking-wider">Homebase</span>
                        <span className="text-[#D4D4D4] text-xs">Tangerang Kota, Banten</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-[#A3A3A3] text-[11px] uppercase tracking-wider">Barcode Verification</span>
                        <span className="font-mono text-xs tracking-tighter text-[#B3B3B3]">
                          ||| | |||| | || | |||| ||
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Dynamic Lens Content Unified Under the Specimen ID */}
                <div data-lens-panel className="pt-6 min-h-[536px] sm:min-h-[412px]">
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
                        <div className="flex items-center justify-between border-b border-[#242424] pb-2 font-sans text-[11px] text-[#B3B3B3]">
                          <span className="uppercase text-[11px] text-white font-semibold tracking-wider">
                            LENS [01]: PERSONAL LOADOUT
                          </span>
                          <span className="font-mono text-[#B3B3B3]">OFF-DUTY LOG</span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#CCCCCC] font-sans leading-relaxed max-w-[28rem]">
                          Off-duty rotation: games, side-quest coding, badminton, and camping.
                          Baseline fuel is noodles in any form, with PC hardware and alutsista talk on the side.
                        </p>

                        {/* Personal Loadout */}
                        <div className="divide-y divide-[#242424] font-sans text-xs">
                          <div className="py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[#4ADE80] font-bold">01</span>
                              <span className="font-semibold text-white">
                                Off-Duty Rotation
                              </span>
                            </div>
                            <p className="text-xs sm:text-[13px] text-[#B3B3B3] font-sans leading-relaxed max-w-[28rem]">
                              Gaming, coding side quests, badminton rallies, and camping trips.
                              Movement and fresh air balance the screen hours.
                            </p>
                          </div>

                          <div className="py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[#4ADE80] font-bold">02</span>
                              <span className="font-semibold text-white">
                                Active Barracks
                              </span>
                            </div>
                            <p className="text-xs sm:text-[13px] text-[#B3B3B3] font-sans leading-relaxed max-w-[28rem]">
                              RimWorld, War Thunder, Minecraft, Delta Force, and Clash of Clans.
                              Colony sims, armor doctrine, sandbox builds, tactical FPS, and clan&nbsp;raids.
                            </p>
                          </div>

                          <div className="py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[#4ADE80] font-bold">03</span>
                              <span className="font-semibold text-white">
                                AI Toolchain & Mess Hall
                              </span>
                            </div>
                            <p className="text-xs sm:text-[13px] text-[#B3B3B3] font-sans leading-relaxed max-w-[28rem]">
                              Daily drivers: Gemini (Antigravity), Muse Spark, DeepSeek, and 9Router.
                              Routed by task across drafting, debugging, and model comparison.
                              Off-screen topics: noodle variants, PC specs, and alutsista deep dives.
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
                        <div className="flex items-center justify-between border-b border-[#242424] pb-2 font-sans text-[11px] text-[#B3B3B3]">
                          <span className="uppercase text-[11px] text-white font-semibold tracking-wider">
                            LENS [02]: CHRONOLOGICAL ROOTS
                          </span>
                          <span className="font-mono text-[#B3B3B3]">ACADEMIC & PRODUCTION</span>
                        </div>

                        {/* Trajectory Timeline in Master Card */}
                        <div className="font-sans text-xs divide-y divide-[#242424]">
                          <div className="pb-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-semibold text-white text-[13px] font-sans">
                                CarbonEthics — Frontend Engineering Intern
                              </span>
                              <span className="font-mono text-[11px] text-[#4ADE80] bg-[#14331C] px-2 py-0.5 rounded-[3px] border border-[#22542B] shrink-0">
                                FEB 2026 — OCT 2026
                              </span>
                            </div>
                            <p className="text-xs sm:text-[13px] text-[#B3B3B3] font-sans leading-relaxed max-w-[28rem]">
                              Shipping production interfaces for Indonesia&apos;s carbon and mangrove restoration
                              platform with responsive calculators and modular design tokens.
                            </p>
                          </div>

                          <div className="py-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-semibold text-white text-[13px] font-sans">
                                Universitas Tarumanagara (UNTAR)
                              </span>
                              <span className="font-mono text-[11px] text-[#B3B3B3] shrink-0">2023 — PRESENT</span>
                            </div>
                            <p className="text-xs sm:text-[13px] text-[#B3B3B3] font-sans leading-relaxed max-w-[28rem]">
                              Information Systems (Sistem Informasi). Enterprise ERP, database modeling,
                              systems analysis, and distributed networking.
                            </p>
                          </div>

                          <div className="pt-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-semibold text-white text-[13px] font-sans">
                                Santo Fransiskus Asisi
                              </span>
                              <span className="font-mono text-[11px] text-[#B3B3B3] shrink-0">2020 — 2023 · IPS</span>
                            </div>
                            <p className="text-xs sm:text-[13px] text-[#B3B3B3] font-sans leading-relaxed max-w-[28rem]">
                              Senior high in the social sciences (IPS) track — economics, sociology, and geography grounding before moving into information systems.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-sans text-[#B3B3B3]">
                          <MapPin size={13} weight="bold" className="text-white" />
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
                        className="text-[#E0E0E0] font-mono text-xs"
                      >
                        {/* Terminal Header */}
                        <div className="px-1 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#FF5F56] inline-block"></span>
                            <span className="h-2 w-2 rounded-full bg-[#FFBD2E] inline-block"></span>
                            <span className="h-2 w-2 rounded-full bg-[#27C93F] inline-block"></span>
                            <span className="text-[11px] text-[#B3B3B3] ml-2">
                              joshua@tangerang:~ (zsh)
                            </span>
                          </div>
                          <span className="text-[11px] text-[#B3B3B3]">CLI TELEMETRY</span>
                        </div>

                        {/* Interactive Command Tabs with Auto-Cycle and Progress Indicator */}
                        <div
                          onMouseEnter={() => setIsTerminalAutoPaused(true)}
                          onMouseLeave={() => setIsTerminalAutoPaused(false)}
                          className="border-b border-[#222222] px-1 py-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs"
                        >
                          {TERMINAL_COMMANDS.map((cmd) => (
                            <button
                              key={cmd}
                              type="button"
                              onClick={() => setActiveTerminalCmd(cmd)}
                              className={`transition-colors ${
                                activeTerminalCmd === cmd
                                  ? "text-white font-semibold underline underline-offset-4"
                                  : "text-[#B3B3B3] hover:text-white"
                              }`}
                            >
                              <span>$ {cmd}</span>
                            </button>
                          ))}

                          <div
                            className="flex items-center ml-auto"
                            title={
                              isTerminalAutoPaused || isLensAutoPaused
                                ? "Auto-cycle paused"
                                : "Auto-cycling commands"
                            }
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-[1px] ${
                                isTerminalAutoPaused || isLensAutoPaused
                                  ? "bg-[#737373]"
                                  : "bg-[#27C93F]"
                              }`}
                            />
                            <span className="sr-only">
                              {isTerminalAutoPaused || isLensAutoPaused
                                ? "Auto-cycle paused"
                                : "Auto-cycling commands"}
                            </span>
                          </div>
                        </div>

                        {/* Terminal Screen Body */}
                        <div
                          onMouseEnter={() => setIsTerminalAutoPaused(true)}
                          onMouseLeave={() => setIsTerminalAutoPaused(false)}
                          className="px-1 py-4 font-mono text-xs leading-relaxed overflow-x-auto min-h-[240px]"
                        >
                          {/* Active Prompt & Typed Command */}
                          <div className="flex items-center gap-1.5 text-[#4ADE80] mb-2 text-xs">
                            <span>➜</span>
                            <span className="text-[#B3B3B3]">~</span>
                            <span className="text-white font-semibold">
                              {typedCmd}
                              {isTyping && typedOutput.length === 0 && (
                                <span className="inline-block w-1.5 h-3 bg-[#4ADE80] ml-1 align-middle" />
                              )}
                            </span>
                          </div>

                          {/* Streaming Output Body */}
                          {typedOutput && (
                            <pre className="text-[#D4D4D4] whitespace-pre-wrap text-xs font-mono leading-relaxed">
                              {typedOutput}
                              {isTyping && (
                                <span className="inline-block w-1.5 h-3 bg-[#4ADE80] ml-1 align-middle" />
                              )}
                            </pre>
                          )}

                          {/* Prompt Line When Execution Completes */}
                          {!isTyping && (
                            <div className="flex items-center gap-1.5 text-[#4ADE80] mt-3 text-xs">
                              <span>➜</span>
                              <span className="text-[#B3B3B3]">~</span>
                              <span className="inline-block w-1.5 h-3 bg-[#4ADE80]" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <DossierGallery />

        {/* Bottom Section: Three Contrarian Axioms */}
        <Reveal delay={0.15}>
          <div className="border-t border-[#222222] pt-12">
            <div className="mb-6 font-sans text-xs uppercase tracking-wider text-[#B3B3B3] flex items-center justify-between">
              <span>Contrarian Axioms & Convictions</span>
              <span className="font-mono text-[#A3A3A3] text-[11px]">STANDARDS HELD HIGH</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[8px] border border-[#242424] bg-[#141414] p-6 flex flex-col justify-between transition-colors hover:border-[#383838]">
                <Quotes size={20} weight="fill" className="text-[#666666] mb-3" />
                <p className="text-sm text-[#E5E5E5] leading-relaxed font-sans mb-4">
                  &ldquo;Software is read ten times more often than it is written. Optimize for the
                  second reader, not the cleverness of the first writer.&rdquo;
                </p>
                <span className="font-sans text-[11px] font-medium text-[#A3A3A3] uppercase tracking-wider">
                  — ON MAINTAINABILITY
                </span>
              </div>

              <div className="rounded-[8px] border border-[#242424] bg-[#141414] p-6 flex flex-col justify-between transition-colors hover:border-[#383838]">
                <Quotes size={20} weight="fill" className="text-[#666666] mb-3" />
                <p className="text-sm text-[#E5E5E5] leading-relaxed font-sans mb-4">
                  &ldquo;Sub-second interfaces feel like telepathy. Respecting the user&apos;s attention
                  and device battery is the highest form of respect.&rdquo;
                </p>
                <span className="font-sans text-[11px] font-medium text-[#A3A3A3] uppercase tracking-wider">
                  — ON SPEED & LCP
                </span>
              </div>

              <div className="rounded-[8px] border border-[#242424] bg-[#141414] p-6 flex flex-col justify-between transition-colors hover:border-[#383838]">
                <Quotes size={20} weight="fill" className="text-[#666666] mb-3" />
                <p className="text-sm text-[#E5E5E5] leading-relaxed font-sans mb-4">
                  &ldquo;Understanding network routing and database indexing makes you ten times better
                  at building reliable, bulletproof client applications.&rdquo;
                </p>
                <span className="font-sans text-[11px] font-medium text-[#A3A3A3] uppercase tracking-wider">
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
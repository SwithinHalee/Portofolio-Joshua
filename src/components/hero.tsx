"use client";

import { useState } from "react";
import {
  ArrowDown,
  Check,
  Copy,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { PERSONAL_INFO } from "@/data/portfolio";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="pt-20 pb-24 md:pt-28 md:pb-32 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Availability Dossier Tag */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5E8D4] bg-[#EDF3EC] px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#346538]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#346538] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#346538]"></span>
            </span>
            <span>{PERSONAL_INFO.availability.status}</span>
          </div>

          <span className="hidden sm:inline text-xs font-mono text-[#787774]">
            UNTAR Information Systems • Class of 2027
          </span>
        </div>

        {/* Editorial Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#111111] tracking-[-0.03em] leading-[1.1] max-w-3xl mb-8"
          style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
        >
          {PERSONAL_INFO.headline}
        </h1>

        {/* Human, Grounded Sub-copy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-12">
          <p className="md:col-span-8 text-base sm:text-lg text-[#444444] leading-relaxed font-sans font-normal">
            {PERSONAL_INFO.bio}
          </p>

          <div className="md:col-span-4 border-l border-[#EAEAEA] pl-5 font-mono text-xs text-[#787774] space-y-2">
            <div>
              <span className="text-[#111111] font-medium block">Current Engagement:</span>
              <span>Frontend Intern at CarbonEthics</span>
            </div>
            <div>
              <span className="text-[#111111] font-medium block">Specialization:</span>
              <span>Next.js, TypeScript, Systems Architecture</span>
            </div>
          </div>
        </div>

        {/* Action Controls & External Handles */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-4 py-2.5 text-xs font-mono text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.98]"
          >
            <span>Inspect Selected Works</span>
            <ArrowDown size={13} weight="bold" />
          </a>

          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-2.5 text-xs font-mono text-[#111111] transition-all hover:bg-[#F0F0EE] active:scale-[0.98]"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check size={13} weight="bold" className="text-[#346538]" />
                <span className="text-[#346538]">Email Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy size={13} weight="regular" />
                <span>{PERSONAL_INFO.email}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] transition-colors hover:bg-[#F7F6F3]"
              aria-label="GitHub Profile"
            >
              <GithubLogo size={16} weight="regular" />
            </a>

            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] transition-colors hover:bg-[#F7F6F3]"
              aria-label="LinkedIn Profile"
            >
              <LinkedinLogo size={16} weight="regular" />
            </a>

            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] transition-colors hover:bg-[#F7F6F3]"
              aria-label="Send direct email"
            >
              <EnvelopeSimple size={16} weight="regular" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { COLOPHON_SPECS, PERSONAL_INFO } from "@/data/portfolio";
import { Reveal } from "@/components/motion-wrapper";

export function Colophon() {
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
    <footer id="colophon" className="pt-24 pb-16 bg-[#FBFBFA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Contact Directive */}
        <Reveal>
          <div id="contact" className="mb-20 rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-8 sm:p-12 transition-all hover:border-[#CCCCCC] hover:shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-3">
              <span>06 / INITIATION</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>DIRECT ENGAGEMENT</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Initiate Conversation
            </h2>

            <p className="text-sm sm:text-base text-[#555555] max-w-2xl mb-8 leading-relaxed font-sans">
              Open for technical dialogue, prospective engineering roles upon completion of current
              internship in Q4 2026, or collaborative discussions around climate tech and type-safe systems.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-5 py-3 text-xs font-mono text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.98] shadow-sm"
              >
                <EnvelopeSimple size={15} weight="bold" />
                <span>Send Direct Email</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-5 py-3 text-xs font-mono text-[#111111] transition-all hover:bg-[#F0F0EE] active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check size={14} weight="bold" className="text-[#346538]" />
                    <span className="text-[#346538]">Copied: {PERSONAL_INFO.email}</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} weight="regular" />
                    <span>Copy Address ({PERSONAL_INFO.email})</span>
                  </>
                )}
              </button>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] px-4 py-3 text-xs font-mono text-[#111111] hover:bg-[#F7F6F3] active:scale-[0.98] transition-all"
              >
                <GithubLogo size={15} weight="regular" />
                <span>GitHub</span>
                <ArrowUpRight size={11} weight="bold" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] px-4 py-3 text-xs font-mono text-[#111111] hover:bg-[#F7F6F3] active:scale-[0.98] transition-all"
              >
                <LinkedinLogo size={15} weight="regular" />
                <span>LinkedIn</span>
                <ArrowUpRight size={11} weight="bold" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Colophon Specs */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-[#EAEAEA] pt-12 mb-12 font-mono text-xs text-[#787774]">
            <div className="md:col-span-4">
              <span className="text-[#111111] font-semibold block mb-2">COLOPHON SPECIFICATION</span>
              <p className="leading-relaxed text-[11px]">
                Document archive design derived from Leonxlnx/taste-skill taste architecture.
                Constrained by warm monochrome tones, hairline borders, and strict zero-placeholder rules.
              </p>
            </div>

            <div className="md:col-span-4 space-y-1.5 text-[11px]">
              <span className="text-[#111111] font-semibold block mb-2">TYPOGRAPHY STACK</span>
              {COLOPHON_SPECS.typography.map((t) => (
                <div key={t} className="text-[#666666]">
                  • {t}
                </div>
              ))}
            </div>

            <div className="md:col-span-4 space-y-1.5 text-[11px]">
              <span className="text-[#111111] font-semibold block mb-2">INFRASTRUCTURE</span>
              <div>• Runtime: {COLOPHON_SPECS.framework}</div>
              <div>• Engine: {COLOPHON_SPECS.styling}</div>
              <div>• Geometry: {COLOPHON_SPECS.icons}</div>
            </div>
          </div>
        </Reveal>

        {/* Copyright & Meta */}
        <div className="border-t border-[#EAEAEA] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#888888]">
          <div>
            <span>{PERSONAL_INFO.name} — All systems nominal.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Tangerang, Banten, Indonesia</span>
            <span className="text-[#CCCCCC]">/</span>
            <span>{COLOPHON_SPECS.year} Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
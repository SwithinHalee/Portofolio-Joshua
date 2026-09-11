"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { COLOPHON_SPECS, PERSONAL_INFO } from "@/data/portfolio";
import { cleanEmail } from "@/lib/portfolio-store";
import { usePortfolio } from "@/components/portfolio-provider";
import { Reveal } from "@/components/motion-wrapper";

export function Colophon() {
  const { data } = usePortfolio();
  const personalInfo = data.personalInfo ?? PERSONAL_INFO;
  const colophon = data.colophon ?? COLOPHON_SPECS;
  const email = cleanEmail(personalInfo.email);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  return (
    <footer id="colophon" className="pt-8 md:pt-12 pb-16 bg-[#FBFBFA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Contact Directive */}
        <Reveal>
          <div id="contact" className="dark-section mb-20 rounded-[8px] border border-[#262626] bg-[#0E0E0E] p-8 sm:p-12 transition-colors duration-150 hover:border-[#383838]">
            <div className="flex items-center gap-2 font-mono text-xs text-[#888888] uppercase tracking-wider mb-3">
              <span>08 / INITIATION</span>
              <span className="text-[#333333]">•</span>
              <span>DIRECT ENGAGEMENT</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-serif text-[#FFFFFF] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Initiate Conversation
            </h2>

            <p className="text-sm sm:text-base text-[#AAAAAA] max-w-2xl mb-8 leading-relaxed font-sans">
              Open for technical dialogue, prospective engineering roles upon completion of current
              internship in Q4 2026, or collaborative discussions around climate tech and type-safe systems.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-[4px] bg-[#FFFFFF] px-5 py-3 text-xs font-mono text-[#111111] font-semibold transition-all hover:bg-[#E5E5E5] active:scale-[0.98] shadow-sm"
              >
                <EnvelopeSimple size={15} weight="bold" />
                <span>Send Direct Email</span>
              </a>

              <button
                onClick={handleCopyEmail}
                type="button"
                aria-label="Copy email address to clipboard"
                className="inline-flex items-center gap-2 rounded-[4px] border border-[#282828] bg-[#171717] px-5 py-3 text-xs font-mono text-[#E5E5E5] transition-all hover:bg-[#222222] hover:border-[#3E3E3E] active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check size={14} weight="bold" className="text-[#4ADE80]" />
                    <span className="text-[#4ADE80]">Copied: {email}</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} weight="regular" />
                    <span>Copy Address ({email})</span>
                  </>
                )}
              </button>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#282828] bg-[#171717] px-4 py-3 text-xs font-mono text-[#E5E5E5] hover:bg-[#222222] hover:border-[#3E3E3E] hover:text-white active:scale-[0.98] transition-all"
              >
                <GithubLogo size={15} weight="regular" />
                <span>GitHub</span>
                <ArrowUpRight size={11} weight="bold" />
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#282828] bg-[#171717] px-4 py-3 text-xs font-mono text-[#E5E5E5] hover:bg-[#222222] hover:border-[#3E3E3E] hover:text-white active:scale-[0.98] transition-all"
              >
                <LinkedinLogo size={15} weight="regular" />
                <span>LinkedIn</span>
                <ArrowUpRight size={11} weight="bold" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Legal & Operator Details */}
        <nav
          aria-label="Legal policies"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#EAEAEA] pt-6 font-mono text-[11px] text-[#616161]"
        >
          <Link href="/privacy" className="transition-colors hover:text-[#111111] hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-[#111111] hover:underline underline-offset-4">
            Terms and Conditions
          </Link>
          <Link href="/cookies" className="transition-colors hover:text-[#111111] hover:underline underline-offset-4">
            Cookie Policy
          </Link>
          <Link href="/refunds" className="transition-colors hover:text-[#111111] hover:underline underline-offset-4">
            Refund Policy
          </Link>
        </nav>

        <p className="mt-4 text-center font-mono text-[11px] leading-relaxed text-[#616161]">
          Personal portfolio of {personalInfo.name} — {personalInfo.location}.
          No tracking cookies. No analytics. Contact: {email}
        </p>

        {/* Copyright & Meta */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#616161]">
          <div>
            <span>
              © {colophon.year} {personalInfo.name}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Tangerang, Banten, Indonesia</span>
            <span className="text-[#6B6B6B]">/</span>
            <span>{colophon.year} Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
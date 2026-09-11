"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  Check,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { PERSONAL_INFO } from "@/data/portfolio";
import { cleanEmail } from "@/lib/portfolio-store";
import { usePortfolio } from "@/components/portfolio-provider";
import { Reveal } from "@/components/motion-wrapper";

export function Hero() {
  const { data } = usePortfolio();
  const personalInfo = data.personalInfo ?? PERSONAL_INFO;
  const email = cleanEmail(personalInfo.email);
  const [copied, setCopied] = useState(false);

  const handleEmailClick = () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section id="hero" className="min-h-[calc(100dvh-57px)] flex flex-col justify-between border-b border-[#EAEAEA] relative overflow-hidden py-6 sm:py-8 md:py-10">
      {/* Full-bleed photographic backdrop with restrained legibility veil */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/hero/hero-1.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/90 to-[#FFFFFF]/45" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 w-full flex-1 flex flex-col justify-between">
        {/* Main Content Cluster (Centered Vertically in Viewport) */}
        <div className="my-auto py-2 sm:py-4">
          {/* Editorial Headline */}
          <Reveal delay={0.12}>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#111111] tracking-[-0.03em] leading-[1.1] max-w-3xl mb-8"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              {personalInfo.headline}
            </h1>
          </Reveal>

          {/* Human, Grounded Sub-copy */}
          <Reveal delay={0.18}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-12">
              <p className="md:col-span-8 text-base sm:text-lg text-[#444444] leading-relaxed font-sans font-normal">
                {personalInfo.bio}
              </p>

              <div className="md:col-span-4 border-l border-[#EAEAEA] pl-5 font-mono text-xs text-[#616161] space-y-2">
                <div>
                  <span className="text-[#111111] font-medium block">{personalInfo.engagementLabel}</span>
                  <span>{personalInfo.engagementValue}</span>
                </div>
                <div>
                  <span className="text-[#111111] font-medium block">{personalInfo.focusLabel}</span>
                  <span>{personalInfo.focusValue}</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Action Controls & External Handles */}
          <Reveal delay={0.24}>
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-4 py-2.5 text-xs font-mono text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                <span>{personalInfo.ctaLabel}</span>
                <ArrowDown size={13} weight="bold" />
              </a>

              <a
                href={`mailto:${email}`}
                onClick={handleEmailClick}
                aria-label={`Send direct email to ${email}`}
                className="inline-flex items-center gap-2 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-2.5 text-xs font-mono text-[#111111] transition-all hover:bg-[#F0F0EE] active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check size={13} weight="bold" className="text-[#346538]" />
                    <span className="text-[#346538]">Opening Mail Client • Copied</span>
                  </>
                ) : (
                  <>
                    <EnvelopeSimple size={13} weight="regular" />
                    <span>{email}</span>
                  </>
                )}
              </a>

              <div className="flex items-center gap-2 ml-auto">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] transition-all hover:bg-[#F7F6F3] active:scale-[0.96]"
                  aria-label="GitHub Profile"
                >
                  <GithubLogo size={16} weight="regular" />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] transition-all hover:bg-[#F7F6F3] active:scale-[0.96]"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinLogo size={16} weight="regular" />
                </a>

                <a
                  href={`mailto:${email}`}
                  onClick={handleEmailClick}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] transition-all hover:bg-[#F7F6F3] active:scale-[0.96]"
                  aria-label="Send direct email"
                  title={copied ? "Email copied to clipboard" : `Send email to ${email}`}
                >
                  {copied ? (
                    <Check size={16} weight="bold" className="text-[#346538]" />
                  ) : (
                    <EnvelopeSimple size={16} weight="regular" />
                  )}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Micro-dossier Quick Metrics Bar (Anchored at Bottom of Screen) */}
        <Reveal delay={0.3}>
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[#EAEAEA] pt-4 sm:pt-6 font-mono text-xs mt-auto" aria-label="Quick profile facts">
            {personalInfo.quickFacts.map((fact, i) => {
              const last = i === personalInfo.quickFacts.length - 1;
              return (
                <div
                  key={`${fact.label}-${i}`}
                  className={`py-2 ${i % 2 === 0 ? "pr-4 border-r border-[#EAEAEA]" : "pl-4"} sm:px-4 ${i === 0 ? "sm:pl-0" : ""} ${last ? "sm:pr-0" : "sm:border-r sm:border-[#EAEAEA]"}`}
                >
                  <span className="text-[#616161] block text-[10px] uppercase">{fact.label}</span>
                  <span className="text-[#111111] font-medium">{fact.value}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  EnvelopeSimple,
  GithubLogo,
  InstagramLogo,
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
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      setCopied(true);
      copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
    }
  };

  return (
    <footer id="colophon" className="dark-section pt-16 md:pt-24 pb-16 bg-[#111111] text-[#FAFAFA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Contact Directive */}
        <Reveal>
          <div
            id="contact"
            data-theme="light"
            className="relative mb-20 overflow-hidden rounded-[8px] border border-[#FFFFFF]/10 bg-[#FFFFFF] p-8 sm:p-12 text-[#111111] transition-colors duration-150"
          >
            {/* Background-level monogram in the open right field */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-5 z-0 rotate-6 select-none font-sans text-[88px] font-semibold leading-[0.85] tracking-[-0.04em] text-[#111111]/[0.07] sm:right-8 sm:top-1/2 sm:-translate-y-1/2 sm:text-[180px] md:text-[220px] lg:right-10 lg:text-[260px]"
            >
              JA
            </span>

            <div className="relative z-10">
              <h2
                className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
                style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
              >
                Initiate Conversation
              </h2>

              <p className="text-sm sm:text-base text-[#525252] max-w-[54ch] mb-8 leading-relaxed font-sans">
                Open for technical dialogue, prospective engineering roles upon completion of current
                internship in Q4 2026, or collaborative discussions around climate tech and type-safe&nbsp;systems.
              </p>

              <div className="-ml-1.5 flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
                <a
                  href={`mailto:${email}`}
                  className="link-hug gap-2 rounded-[2px] border-0 bg-transparent font-sans text-xs font-semibold text-[#111111] shadow-none active:scale-[0.98]"
                >
                  <EnvelopeSimple size={15} weight="bold" />
                  <span>Send Direct Email</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  type="button"
                  data-link-fill="on"
                  aria-label={
                    copied
                      ? `Copied ${email} to clipboard`
                      : "Copy email address to clipboard"
                  }
                  className={`link-hug group/btn cursor-pointer gap-2 rounded-[2px] border-0 bg-transparent font-sans text-xs font-medium shadow-none transition-colors duration-200 active:scale-[0.98] ${
                    copied ? "text-[#111111]" : "text-[#525252]"
                  }`}
                >
                  <span className="relative inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center">
                    <Copy
                      size={14}
                      weight="regular"
                      aria-hidden="true"
                      className={`absolute transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        copied ? "scale-75 opacity-0" : "scale-100 opacity-100"
                      }`}
                    />
                    <Check
                      size={14}
                      weight="bold"
                      aria-hidden="true"
                      className={`absolute transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        copied ? "scale-100 opacity-100" : "scale-75 opacity-0"
                      }`}
                    />
                  </span>
                  <span>Copy Address ({email})</span>
                  <span className="sr-only" aria-live="polite">
                    {copied ? "Email address copied to clipboard." : ""}
                  </span>
                </button>

                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hug group/ext gap-1.5 rounded-[2px] border-0 bg-transparent font-sans text-xs font-medium text-[#525252] shadow-none active:scale-[0.98]"
                >
                  <GithubLogo size={15} weight="regular" />
                  <span>GitHub</span>
                  <ArrowUpRight
                    size={11}
                    weight="bold"
                    className="transition-transform duration-200 group-hover/ext:translate-x-0.5 group-hover/ext:-translate-y-0.5"
                  />
                </a>

                <a
                  href={personalInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hug group/ext gap-1.5 rounded-[2px] border-0 bg-transparent font-sans text-xs font-medium text-[#525252] shadow-none active:scale-[0.98]"
                >
                  <InstagramLogo size={15} weight="regular" />
                  <span>Instagram</span>
                  <ArrowUpRight
                    size={11}
                    weight="bold"
                    className="transition-transform duration-200 group-hover/ext:translate-x-0.5 group-hover/ext:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Legal & Operator Details */}
        <nav
          aria-label="Legal policies"
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-t border-[#262626] pt-6 font-sans text-xs text-[#A3A3A3] sm:gap-x-2.5"
        >
          <Link href="/privacy" className="link-hug rounded-[2px]">
            Privacy Policy
          </Link>
          <Link href="/terms" className="link-hug rounded-[2px]">
            Terms and Conditions
          </Link>
          <Link href="/cookies" className="link-hug rounded-[2px]">
            Cookie Policy
          </Link>
          <Link href="/refunds" className="link-hug rounded-[2px]">
            Refund Policy
          </Link>
        </nav>

        <p className="mt-4 text-center font-sans text-xs leading-relaxed text-[#A3A3A3]">
          Personal portfolio of {personalInfo.name}, {personalInfo.location}.
          No tracking cookies. No analytics. Contact: {email}
        </p>

        {/* Copyright & Meta */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[#A3A3A3]">
          <div>
            <span>
              © {colophon.year} {personalInfo.name}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Tangerang, Banten, Indonesia</span>
            <span className="text-[#525252]">/</span>
            <span>{colophon.year} Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
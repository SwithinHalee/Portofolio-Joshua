"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowCounterClockwise, ArrowLeft } from "@phosphor-icons/react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Segment runtime error:", error);
  }, [error]);

  const message =
    error.message && error.message.trim().length > 0
      ? error.message.slice(0, 280)
      : "An unexpected fault interrupted rendering of this section.";

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]">
      <header className="border-b border-[#EAEAEA] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
          <Link
            href="/"
            className="font-sans text-sm font-medium tracking-tight text-[#111111] transition-colors hover:text-[#444444]"
          >
            Joshua Abdiel
          </Link>
          <span className="font-mono text-xs text-[#616161]">INDEX / FAULT</span>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 items-center py-16 md:py-24">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-[#9F2F2D]">
              Runtime fault · Section failed to render
            </p>
            <h1
              className="mb-4 font-serif text-4xl tracking-[-0.02em] text-[#111111] sm:text-5xl"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Something interrupted this dossier.
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-[#555555] sm:text-base">
              The rest of the archive is intact. Retry the section, or return to the verified
              index while the fault is inspected.
            </p>
          </div>

          <div className="mb-8 max-w-2xl overflow-hidden rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA]">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-4 py-2.5">
              <span className="font-mono text-[11px] text-[#616161]">fault-report.log</span>
              {error.digest && (
                <span className="font-mono text-[11px] text-[#616161]">digest {error.digest}</span>
              )}
            </div>
            <pre className="max-h-40 overflow-auto p-4 font-mono text-xs leading-relaxed text-[#8C2A2B]">
              {message}
            </pre>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-5 py-3 font-mono text-xs text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.98]"
            >
              <ArrowCounterClockwise size={14} weight="bold" />
              <span>Retry section</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-5 py-3 font-mono text-xs text-[#111111] transition-all hover:bg-[#F0F0EE] active:scale-[0.98]"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Return to index</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

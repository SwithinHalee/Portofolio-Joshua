import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "404 — Dossier Not Found | Joshua Abdiel",
  description: "The requested page is not part of this portfolio archive.",
};

export default function NotFound() {
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
          <span className="font-mono text-xs text-[#616161]">INDEX / 404</span>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 items-center py-16 md:py-24">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-[#616161]">
              Error 404 · Dossier not found
            </p>
            <h1
              className="mb-4 font-serif text-4xl tracking-[-0.02em] text-[#111111] sm:text-5xl"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              This page is not in the archive.
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-[#555555] sm:text-base">
              The route you requested was never filed, was moved, or was removed. The index below
              points back to verified sections of the portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/"
              className="group rounded-[8px] border border-[#111111] bg-[#111111] p-5 text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.99]"
            >
              <span className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#B5B5B5]">
                <ArrowLeft size={12} weight="bold" />
                <span>Ref 01</span>
              </span>
              <span className="block font-serif text-lg">Return to index</span>
              <span className="mt-1 block font-mono text-[11px] text-[#CCCCCC]">
                Homepage dossier
              </span>
            </Link>

            <Link
              href="/#projects"
              className="group rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] p-5 transition-colors hover:border-[#CCCCCC] hover:bg-[#F0F0EE]"
            >
              <span className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#616161]">
                <span>Ref 02</span>
                <ArrowUpRight size={12} weight="bold" />
              </span>
              <span className="block font-serif text-lg text-[#111111]">Selected works</span>
              <span className="mt-1 block font-mono text-[11px] text-[#616161]">
                Engineering case index
              </span>
            </Link>

            <Link
              href="/archive"
              className="group rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] p-5 transition-colors hover:border-[#CCCCCC] hover:bg-[#F0F0EE]"
            >
              <span className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#616161]">
                <span>Ref 03</span>
                <ArrowUpRight size={12} weight="bold" />
              </span>
              <span className="block font-serif text-lg text-[#111111]">Full archive</span>
              <span className="mt-1 block font-mono text-[11px] text-[#616161]">
                Chronological record
              </span>
            </Link>
          </div>

          <p className="mt-10 border-t border-[#EAEAEA] pt-4 font-mono text-[11px] text-[#616161]">
            If you followed a link from this site and landed here, the reference is stale — the
            canonical index lives at <span className="text-[#111111]">/</span>.
          </p>
        </div>
      </main>
    </div>
  );
}

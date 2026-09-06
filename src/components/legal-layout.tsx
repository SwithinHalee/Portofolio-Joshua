import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Navbar } from "@/components/navbar";
import { Colophon } from "@/components/colophon";
import { PERSONAL_INFO } from "@/data/portfolio";

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LEGAL_LAST_UPDATED = "September 6, 2026";

export function LegalLayout({
  eyebrow,
  title,
  description,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]">
      <Navbar />
      <main id="main-content" className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#616161] transition-colors hover:text-[#111111]"
            >
              <ArrowLeft size={13} weight="bold" aria-hidden="true" />
              <span>Return to Portfolio Home</span>
            </Link>
          </div>

          <div className="border-b border-[#EAEAEA] pb-10 mb-10">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#616161]">
              <span>{eyebrow}</span>
            </div>
            <h1
              className="mb-4 text-4xl font-serif tracking-[-0.03em] text-[#111111] sm:text-5xl"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              {title}
            </h1>
            <p className="mb-6 max-w-2xl font-sans text-base leading-relaxed text-[#444444]">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#616161]">
              <span className="rounded border border-[#EAEAEA] bg-[#F7F6F3] px-2 py-0.5">
                Last updated: {lastUpdated}
              </span>
              <span className="rounded border border-[#EAEAEA] bg-[#F7F6F3] px-2 py-0.5">
                Operator: {PERSONAL_INFO.name}
              </span>
            </div>
          </div>

          <article className="space-y-10 font-sans text-[15px] leading-relaxed text-[#333333]">
            {children}
          </article>

          <div className="mt-14 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-5">
            <h2 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Questions about this page?
            </h2>
            <p className="mb-3 font-sans text-sm leading-relaxed text-[#555555]">
              Contact the site operator directly. Emailing is voluntary — your
              email client will open and you choose what personal information to
              include.
            </p>
            <a
              href={`mailto:${PERSONAL_INFO.email}?subject=Question%20about%20site%20policy`}
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-4 py-2.5 font-mono text-xs font-medium text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.98]"
            >
              <span>Email: {PERSONAL_INFO.email}</span>
            </a>
          </div>
        </div>
      </main>
      <Colophon />
    </div>
  );
}

export function LegalSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-b border-[#EAEAEA] pb-10">
      <h2
        id={id}
        className="mb-3 font-mono text-xs uppercase tracking-wider text-[#616161]"
      >
        {index}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Colophon } from "@/components/colophon";
import { PERSONAL_INFO } from "@/data/portfolio";

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LEGAL_LAST_UPDATED = "November 16, 2026";

export function LegalLayout({
  eyebrow,
  title,
  description,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111111]">
      <main id="main-content" className="flex-1 pt-20 sm:pt-24 xl:py-20 pb-16 md:pb-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="mb-10">
            <Link
              href="/"
              scroll={false}
              data-restore-scroll="true"
              className="link-hug gap-2 rounded-[2px] -mx-1.5 font-sans text-xs font-medium text-[#525252]"
            >
              <ArrowLeft size={13} weight="bold" aria-hidden="true" />
              <span>Return to Portfolio Home</span>
            </Link>
          </div>

          <div className="border-b border-[#EAEAEA] pb-10 mb-10">
            <h1
              className="mb-4 text-4xl font-serif tracking-[-0.03em] text-[#111111] sm:text-5xl"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              {title}
            </h1>
            <p className="mb-6 font-sans text-base leading-relaxed text-[#444444]">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-2 font-sans text-xs text-[#FFFFFF]">
              <span className="rounded border border-[#111111] bg-[#111111] px-2.5 py-1 uppercase tracking-wider text-[#FFFFFF]">
                {eyebrow}
              </span>
              <span className="rounded border border-[#111111] bg-[#111111] px-2.5 py-1 text-[#FFFFFF]">
                Last updated: {lastUpdated}
              </span>
              <span className="rounded border border-[#111111] bg-[#111111] px-2.5 py-1 text-[#FFFFFF]">
                Operator: {PERSONAL_INFO.name}
              </span>
            </div>
          </div>

          <article className="space-y-10 font-sans text-[15px] leading-relaxed text-[#333333]">
            {children}
          </article>

          <div className="mt-14 rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-5">
            <h2 className="mb-2 font-sans text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Questions about this page?
            </h2>
            <p className="mb-3 font-sans text-sm leading-relaxed text-[#555555]">
              Contact the site operator directly. Emailing is voluntary; your
              email client will open and you choose what personal information to
              include.
            </p>
            <a
              href={`mailto:${PERSONAL_INFO.email}?subject=Question%20about%20site%20policy`}
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#111111] px-4 py-2.5 font-sans text-xs font-medium text-white active:scale-[0.98]"
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
        className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-[#525252]"
      >
        <span className="font-mono">{index}.</span> {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

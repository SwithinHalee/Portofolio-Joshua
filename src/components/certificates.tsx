"use client";

import Image from "next/image";
import { ArrowUpRight, SealCheck } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion-wrapper";

interface CertificateItem {
  number: string;
  title: string;
  course: string;
  version: string;
  badgeSrc: string;
  badgeAlt: string;
  pdfHref: string;
  credlyHref: string;
  focus: string[];
}

/**
 * Red Hat Academy course-attendance record. Labelled honestly as attendance
 * (not RHCSA professional certification). Badges pair with their PDFs by
 * upload order: RH124 v8.2, RH124 v9.3, RH134 v9.3.
 */
const CERTIFICATES: CertificateItem[] = [
  {
    number: "01",
    title: "System Administration I",
    course: "RH124 · Red Hat Academy",
    version: "RHA ver 8.2",
    badgeSrc: "/images/stacking-mechanics/red-hat-system-administration-i-rh124-rha-ver-8-2.png",
    badgeAlt: "Red Hat Academy course attendance badge: System Administration I",
    pdfHref: "/images/stacking-mechanics/CourseAttendance20260911-20-3k7ht9.pdf",
    credlyHref: "https://www.credly.com/badges/313e5ff8-3902-48bd-b57a-d6e94e873045",
    focus: ["Command line essentials", "Users, groups & file permissions", "Services & process control"],
  },
  {
    number: "02",
    title: "System Administration I",
    course: "RH124 · Red Hat Academy",
    version: "RHA ver 9.3",
    badgeSrc: "/images/stacking-mechanics/red-hat-system-administration-i-rh124-rha-ver-9-3.png",
    badgeAlt: "Red Hat Academy course attendance badge: System Administration I",
    pdfHref: "/images/stacking-mechanics/CourseAttendance20260911-20-9kuzav.pdf",
    credlyHref: "https://www.credly.com/badges/06f192e5-c8f2-4688-9ad4-e45637add843",
    focus: ["Core administration on RHEL 9", "Storage & network basics", "System monitoring"],
  },
  {
    number: "03",
    title: "System Administration II",
    course: "RH134 · Red Hat Academy",
    version: "RHA ver 9.3",
    badgeSrc: "/images/stacking-mechanics/red-hat-system-administration-ii-rh134-rha-ver-9-3.png",
    badgeAlt: "Red Hat Academy course attendance badge: System Administration II",
    pdfHref: "/images/stacking-mechanics/CourseAttendance20260911-20-hvb735.pdf",
    credlyHref: "https://www.credly.com/badges/76cf6465-be66-4ed6-9181-bbc57c2fb9ef",
    focus: ["Automation & scheduling", "Advanced storage & networking", "Security hardening"],
  },
];

export function CertificatesSection() {
  return (
    <section
      id="stacking-mechanics"
      className="relative pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#EAEAEA] bg-[#FBFBFA]"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <Reveal>
          <div className="mb-12">
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Verified Training Record
            </h2>
            <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-sans">
              Red Hat Academy course-attendance record for systems administration.
              Each entry pairs its verified Credly badge with the matching attendance
              PDF, labelled as attendance, not professional certification.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {CERTIFICATES.map((cert, i) => (
            <Reveal key={cert.number} delay={Math.min(i, 3) * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 transition-colors duration-200 hover:border-[#CCCCCC]">
                <div className="mb-5">
                  <span className="font-mono text-sm font-semibold text-[#111111]">
                    [{cert.number}]
                  </span>
                </div>

                <div className="relative mx-auto mb-5 h-36 w-36 overflow-hidden rounded-[8px] border border-[#EAEAEA] bg-[#F7F6F3]">
                  <Image
                    src={cert.badgeSrc}
                    alt={cert.badgeAlt}
                    fill
                    className="object-contain p-2"
                    sizes="144px"
                  />
                </div>

                <h3
                  className="text-xl font-serif text-[#111111] tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
                >
                  {cert.title}
                </h3>
                <p className="font-sans text-xs font-medium uppercase tracking-wider text-[#525252] mb-1">
                  {cert.course}
                </p>
                <p className="font-mono text-xs text-[#616161] mb-4">
                  {cert.version}
                </p>

                <ul className="mb-5 space-y-1.5 flex-1">
                  {cert.focus.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[13px] text-[#4A4A4A] font-sans leading-relaxed">
                      <span className="text-[#346538] font-bold font-mono">›</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[#EAEAEA] flex flex-wrap items-center gap-2">
                  <a
                    href={cert.pdfHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-3 py-2 font-sans text-xs font-semibold text-white active:scale-[0.98]"
                  >
                    <SealCheck size={13} weight="bold" />
                    <span>View PDF</span>
                    <ArrowUpRight size={11} weight="bold" />
                  </a>

                  <a
                    href={cert.credlyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${cert.title} (${cert.version}) badge on Credly`}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#EAEAEA] bg-[#FBFBFA] px-3 py-2 font-sans text-xs font-semibold text-[#111111] transition-colors hover:border-[#111111] active:scale-[0.98]"
                  >
                    <span>Credly Badge</span>
                    <ArrowUpRight size={11} weight="bold" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Back-compat alias: home page still imports the old section name. */
export const StackingCardsSection = CertificatesSection;

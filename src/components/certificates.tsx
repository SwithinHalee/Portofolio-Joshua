"use client";

import Image from "next/image";
import { ArrowUpRight, SealCheck } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion-wrapper";
import { DossierTag } from "@/components/dossier-tag";

interface CertificateItem {
  number: string;
  title: string;
  course: string;
  version: string;
  badgeSrc: string;
  badgeAlt: string;
  pdfHref: string;
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
    badgeAlt: "Red Hat Academy course attendance badge — System Administration I",
    pdfHref: "/images/stacking-mechanics/CourseAttendance20260911-20-3k7ht9.pdf",
    focus: ["Command line essentials", "Users, groups & file permissions", "Services & process control"],
  },
  {
    number: "02",
    title: "System Administration I",
    course: "RH124 · Red Hat Academy",
    version: "RHA ver 9.3",
    badgeSrc: "/images/stacking-mechanics/red-hat-system-administration-i-rh124-rha-ver-9-3.png",
    badgeAlt: "Red Hat Academy course attendance badge — System Administration I",
    pdfHref: "/images/stacking-mechanics/CourseAttendance20260911-20-9kuzav.pdf",
    focus: ["Core administration on RHEL 9", "Storage & network basics", "System monitoring"],
  },
  {
    number: "03",
    title: "System Administration II",
    course: "RH134 · Red Hat Academy",
    version: "RHA ver 9.3",
    badgeSrc: "/images/stacking-mechanics/red-hat-system-administration-ii-rh134-rha-ver-9-3.png",
    badgeAlt: "Red Hat Academy course attendance badge — System Administration II",
    pdfHref: "/images/stacking-mechanics/CourseAttendance20260911-20-hvb735.pdf",
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
          <div className="mb-12 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#616161] uppercase tracking-wider mb-2">
              <span>03 / CERTIFICATIONS</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>RED HAT ACADEMY · COURSE ATTENDANCE</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Verified Training Record
            </h2>
            <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-sans">
              Red Hat Academy course-attendance record for systems administration.
              Each entry pairs its Credly-style badge with the matching attendance
              PDF — labelled as attendance, not professional certification.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {CERTIFICATES.map((cert, i) => (
            <Reveal key={cert.number} delay={Math.min(i, 3) * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 transition-colors duration-200 hover:border-[#CCCCCC]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <span className="font-mono text-sm font-semibold text-[#111111]">
                    [{cert.number}]
                  </span>
                  <DossierTag tone="red" code={cert.number}>
                    ATTENDANCE
                  </DossierTag>
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
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#616161] mb-1">
                  {cert.course}
                </p>
                <p className="font-mono text-[11px] text-[#616161] mb-4">
                  {cert.version}
                </p>

                <ul className="mb-5 space-y-1.5 flex-1">
                  {cert.focus.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[12px] text-[#555555] font-sans leading-relaxed">
                      <span className="text-[#346538] font-bold font-mono">›</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[#EAEAEA]">
                  <a
                    href={cert.pdfHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-3 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98]"
                  >
                    <SealCheck size={13} weight="bold" />
                    <span>View Certificate (PDF)</span>
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

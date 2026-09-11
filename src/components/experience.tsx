"use client";

import { motion } from "framer-motion";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { EXPERIENCES, EDUCATION_HISTORY } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { Reveal, StaggerContainer, StaggerItem, useStackSlide } from "@/components/motion-wrapper";
import { DossierTag } from "@/components/dossier-tag";

function validImage(src: string | undefined): src is string {
  if (!src) return false;
  const t = src.trim();
  return t.startsWith("/") || t.startsWith("https://") || t.startsWith("http://");
}

export function Experience() {
  const { data } = usePortfolio();
  const experiences = data.experiences ?? EXPERIENCES;
  const education = data.education ?? EDUCATION_HISTORY;
  const { x: slideX, wide: slideWide } = useStackSlide("workspace-stack");
  return (
    <motion.section
      id="experience"
      style={slideWide ? { x: slideX } : undefined}
      className="relative z-10 bg-white rounded-tr-[16px] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#EAEAEA] overflow-x-clip md:sticky md:top-[59px]"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#616161] uppercase tracking-wider mb-2">
              <span>07 / CHRONOLOGY</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>EXPERIENCE & FORMAL EDUCATION</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Milestones & Trajectory
            </h2>
            <p className="text-sm sm:text-base text-[#555555]">
              Professional engineering engagements, industry contributions, and academic background
              in Information Systems.
            </p>
          </div>
        </Reveal>

        {/* Experience Timeline */}
        <div className="mb-16">
          <Reveal delay={0.05}>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#616161] mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#111111]"></span>
              <span>{"// INDUSTRY ENGAGEMENT"}</span>
            </h3>
          </Reveal>

          <StaggerContainer className="border-t border-[#EAEAEA] divide-y divide-[#EAEAEA]">
            {experiences.map((exp) => (
              <StaggerItem key={exp.company}>
                <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group">
                  <div className="md:col-span-3 font-mono text-xs text-[#616161]">
                    <span className="font-medium text-[#111111]">{exp.period}</span>
                    <div className="mt-1 text-[11px] text-[#616161]">{exp.location}</div>
                  </div>

                  <div className="md:col-span-9">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2.5">
                      <span className="text-lg sm:text-xl font-serif font-medium text-[#111111]">
                        {exp.role}
                      </span>
                      <span className="text-sm text-[#616161]">@</span>
                      <span className="text-sm font-semibold text-[#111111]">{exp.company}</span>
                      <DossierTag tone="green" className="ml-2">
                        {exp.type}
                      </DossierTag>
                    </div>

                    <p className="text-sm text-[#555555] leading-relaxed mb-4 font-sans">
                      {exp.impact}
                    </p>

                    {validImage(exp.image) && (
                      <figure className="mb-4 sm:max-w-md">
                        {exp.imageLink?.trim() ? (
                          <a
                            href={exp.imageLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-label="Open link"
                            aria-label={`Open link for ${exp.company}`}
                            className="group/fig relative block overflow-hidden rounded-[8px] border border-[#EAEAEA] bg-[#F7F6F3] transition-colors hover:border-[#CCCCCC]"
                          >
                            <span className="block aspect-[16/10] w-full overflow-hidden">
                              <img
                                src={exp.image}
                                alt={exp.imageAlt?.trim() || `${exp.company} visual`}
                                loading="lazy"
                                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover/fig:scale-[1.02] group-hover/fig:grayscale-0"
                              />
                            </span>
                            <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-white/90 text-[#111111]">
                              <ArrowSquareOut size={13} weight="regular" />
                            </span>
                          </a>
                        ) : (
                          <span className="block overflow-hidden rounded-[8px] border border-[#EAEAEA] bg-[#F7F6F3]">
                            <span className="block aspect-[16/10] w-full overflow-hidden">
                              <img
                                src={exp.image}
                                alt={exp.imageAlt?.trim() || `${exp.company} visual`}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            </span>
                          </span>
                        )}
                        <figcaption className="pt-1.5 font-mono text-[10px] uppercase tracking-wider text-[#6B6B6B]">
                          Fig · {exp.company}
                        </figcaption>
                      </figure>
                    )}

                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-[#616161]">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Education Timeline */}
        <div>
          <Reveal delay={0.1}>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#616161] mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#787774]"></span>
              <span>{"// ACADEMIC FOUNDATION"}</span>
            </h3>
          </Reveal>

          <StaggerContainer className="border-t border-[#EAEAEA] divide-y divide-[#EAEAEA]">
            {education.map((edu) => (
              <StaggerItem key={edu.institution}>
                <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#616161]">
                    {edu.period}
                  </div>

                  <div className="md:col-span-9">
                    <div className="text-base font-medium text-[#111111] mb-1">
                      {edu.institution}
                    </div>
                    <div className="text-xs font-mono text-[#616161] mb-2">{edu.degree}</div>
                    <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                      {edu.details}
                    </p>

                    {validImage(edu.image) && (
                      <figure className="mt-4 sm:max-w-md">
                        {edu.imageLink?.trim() ? (
                          <a
                            href={edu.imageLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-label="Open link"
                            aria-label={`Open link for ${edu.institution}`}
                            className="group/fig relative block overflow-hidden rounded-[8px] border border-[#EAEAEA] bg-[#F7F6F3] transition-colors hover:border-[#CCCCCC]"
                          >
                            <span className="block aspect-[16/10] w-full overflow-hidden">
                              <img
                                src={edu.image}
                                alt={edu.imageAlt?.trim() || `${edu.institution} visual`}
                                loading="lazy"
                                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover/fig:scale-[1.02] group-hover/fig:grayscale-0"
                              />
                            </span>
                            <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#EAEAEA] bg-white/90 text-[#111111]">
                              <ArrowSquareOut size={13} weight="regular" />
                            </span>
                          </a>
                        ) : (
                          <span className="block overflow-hidden rounded-[8px] border border-[#EAEAEA] bg-[#F7F6F3]">
                            <span className="block aspect-[16/10] w-full overflow-hidden">
                              <img
                                src={edu.image}
                                alt={edu.imageAlt?.trim() || `${edu.institution} visual`}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            </span>
                          </span>
                        )}
                        <figcaption className="pt-1.5 font-mono text-[10px] uppercase tracking-wider text-[#6B6B6B]">
                          Fig · {edu.institution}
                        </figcaption>
                      </figure>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </motion.section>
  );
}
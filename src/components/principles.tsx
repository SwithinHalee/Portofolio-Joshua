"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { ENGINEERING_PRINCIPLES } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { Reveal, StaggerContainer, StaggerItem, useStackSlide } from "@/components/motion-wrapper";

export function Principles() {
  const { data } = usePortfolio();
  const principles = data.principles ?? ENGINEERING_PRINCIPLES;
  const [activePrinciple, setActivePrinciple] = useState<string | null>("01");
  const { x: slideX, wide: slideWide } = useStackSlide("dossier-stack");

  return (
    <motion.section
      id="principles"
      style={slideWide ? { x: slideX } : undefined}
      className="relative z-10 bg-white rounded-tr-[16px] md:rounded-none shadow-[0_-8px_24px_rgba(0,0,0,0.06)] pt-12 md:pt-[108px] pb-24 md:pb-28 border-b border-[#EAEAEA] overflow-x-clip md:sticky md:top-0"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Single one-shot entrance: header + rows reveal together, at once */}
        <Reveal>
          <div className="mb-14">
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Engineering Tenets & Values
            </h2>
            <p className="text-sm sm:text-base text-[#555555] font-sans">
              Non-negotiable architectural tenets governing code clarity, performance budgets,
              and interface reliability across every project.
            </p>
          </div>
        </Reveal>

        {/* Principles Rows with staggered entrance (same pattern as Dossier/Experience) */}
        <StaggerContainer className="divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
            {principles.map((principle) => {
              const isExpanded = activePrinciple === principle.number;

              return (
                <StaggerItem key={principle.number} xOffset={48} yOffset={0}>
                  <button
                    type="button"
                    onClick={() =>
                      setActivePrinciple(isExpanded ? null : principle.number)
                    }
                    aria-expanded={isExpanded}
                    aria-controls={`principle-panel-${principle.number}`}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} principle ${principle.number}: ${principle.title}`}
                  className={`group/row w-full text-left py-7 -mx-4 px-4 rounded-[6px] transition-colors cursor-pointer ${
                    isExpanded ? "bg-[#FBFBFA]" : "hover:bg-[#FDFDFD]"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start md:items-stretch">
                    <div className="md:col-span-2 flex items-center md:self-stretch select-none">
                      <span
                        className={`font-mono text-5xl sm:text-6xl md:text-[76px] font-light leading-[0.82] tracking-[-0.06em] tabular-nums transition-colors duration-200 ${
                          isExpanded
                            ? "text-[#111111]"
                            : "text-[#C4C3BE] group-hover/row:text-[#787774]"
                        }`}
                      >
                        {principle.number}
                      </span>
                    </div>

                    <div className="md:col-span-4 flex items-start justify-between gap-2">
                      <h3
                        className={`text-lg font-serif transition-colors tracking-tight ${
                          isExpanded ? "text-[#111111] font-medium" : "text-[#444444]"
                        }`}
                        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
                      >
                        {principle.title}
                      </h3>
                      <motion.span
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.18 }}
                        className="mt-1.5 shrink-0"
                      >
                        <CaretRight size={12} weight="bold" className="text-[#616161]" />
                      </motion.span>
                    </div>

                    <div className="md:col-span-6 text-sm text-[#555555] leading-relaxed">
                      {principle.statement}

                      <div
                        className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden" aria-hidden={!isExpanded}>
                          <div
                            id={`principle-panel-${principle.number}`}
                            className="mt-3 pt-3 border-t border-[#EAEAEA] font-sans text-xs text-[#525252] flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#346538]"></span>
                            <span>Strictly enforced in code reviews & CI pipelines</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </button>
                </StaggerItem>
              );
            })}
        </StaggerContainer>
      </div>
    </motion.section>
  );
}
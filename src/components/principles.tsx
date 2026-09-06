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
      className="relative z-10 bg-white rounded-tr-[16px] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#EAEAEA] overflow-x-clip md:sticky md:top-[59px]"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Single one-shot entrance: header + rows reveal together, at once */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#616161] uppercase tracking-wider mb-2">
              <span>05 / SYSTEM ARCHITECTURE</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>ENGINEERING PRINCIPLES</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Engineering Tenets & Values
            </h2>
            <p className="text-sm sm:text-base text-[#555555]">
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
                  className={`w-full text-left py-7 -mx-4 px-4 rounded-[6px] transition-colors cursor-pointer ${
                    isExpanded ? "bg-[#FBFBFA]" : "hover:bg-[#FDFDFD]"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                    <div className="md:col-span-2 font-mono text-xs text-[#616161] flex items-center gap-2">
                      <span className="font-semibold text-[#111111]">[{principle.number}]</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <CaretRight size={12} weight="bold" className="text-[#616161]" />
                      </motion.span>
                    </div>

                    <div className="md:col-span-4">
                      <h3
                        className={`text-lg font-serif transition-colors tracking-tight ${
                          isExpanded ? "text-[#111111] font-medium" : "text-[#444444]"
                        }`}
                        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
                      >
                        {principle.title}
                      </h3>
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
                            className="mt-3 pt-3 border-t border-[#EAEAEA] font-mono text-xs text-[#616161] flex items-center gap-2"
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
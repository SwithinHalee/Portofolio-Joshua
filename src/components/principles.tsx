"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { ENGINEERING_PRINCIPLES } from "@/data/portfolio";
import { Reveal } from "@/components/motion-wrapper";

export function Principles() {
  const [activePrinciple, setActivePrinciple] = useState<string | null>("01");

  return (
    <section id="principles" className="py-24 md:py-32 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-2">
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

        {/* Principles Rows with Interactive Focus State */}
        <Reveal delay={0.1}>
          <div className="divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
            {ENGINEERING_PRINCIPLES.map((principle) => {
              const isExpanded = activePrinciple === principle.number;

              return (
                <div
                  key={principle.number}
                  onClick={() =>
                    setActivePrinciple(isExpanded ? null : principle.number)
                  }
                  className={`py-7 -mx-4 px-4 rounded-[6px] transition-all cursor-pointer ${
                    isExpanded ? "bg-[#FBFBFA]" : "hover:bg-[#FDFDFD]"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                    <div className="md:col-span-2 font-mono text-xs text-[#787774] flex items-center gap-2">
                      <span className="font-semibold text-[#111111]">[{principle.number}]</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <CaretRight size={12} weight="bold" className="text-[#999999]" />
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

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-[#EAEAEA] font-mono text-xs text-[#787774] flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#346538]"></span>
                              <span>Strictly enforced in code reviews & CI pipelines</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
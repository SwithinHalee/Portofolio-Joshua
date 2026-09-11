"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowsOut, X } from "@phosphor-icons/react";
import { WORKSPACE_SETUP } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

export function Workspace() {
  const { data } = usePortfolio();
  const setup = data.workspaceSetup ?? WORKSPACE_SETUP;
  const [modalOpen, setModalOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close the lightbox with Escape, lock background scroll, and move focus to the dialog when opened
  useEffect(() => {
    if (!modalOpen) return;
    closeButtonRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen]);

  return (
    <section id="workspace" className="pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#EAEAEA] bg-[#FBFBFA] md:sticky md:top-[calc(100dvh-1260px)] lg:top-[calc(100dvh-1334px)]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#616161] uppercase tracking-wider mb-2">
              <span>06 / PHYSICAL & DIGITAL ENVIRONMENT</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>OPERATIONAL RIGOR</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Engineering Studio & Operational Setup
            </h2>
            <p className="text-sm sm:text-base text-[#555555]">
              A deliberate workspace built for sustained focus, rapid prototyping, and architectural
              precision. Combining ergonomic hardware with strict software tooling.
            </p>
          </div>
        </Reveal>

        {/* Editorial Photo Display with Faux-OS Window Chrome */}
        <Reveal delay={0.1}>
          <div className="mb-14 rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              </div>
              <span className="font-mono text-[11px] text-[#616161]">
                workspace-environment.raw — studio-interior [calm focus]
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                data-cursor-label="Enlarge"
                className="font-mono text-[11px] text-[#555555] hover:text-[#111111] flex items-center gap-1 transition-colors"
                aria-label="Enlarge workspace photo"
              >
                <ArrowsOut size={12} weight="bold" />
                <span className="hidden sm:inline">Enlarge</span>
              </button>
            </div>

            <div
              onClick={() => setModalOpen(true)}
              data-cursor-label="Enlarge"
              className="relative aspect-[16/9] w-full bg-[#F7F6F3] cursor-pointer overflow-hidden"
            >
              <Image
                src="/images/workspace/setup.png"
                alt="Joshua Abdiel engineering desk and workspace setup"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority={false}
              />
              <div className="absolute inset-0 bg-[#111111]/[0.02] pointer-events-none"></div>
            </div>
          </div>
        </Reveal>

        {/* Setup Inventory Grid with Stagger */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {setup.map((group) => (
            <StaggerItem key={group.category}>
              <div className="h-full rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between transition-all duration-200 hover:border-[#CCCCCC]">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold mb-4 pb-2 border-b border-[#EAEAEA]">
                    {group.category}
                  </h3>

                  <div className="space-y-4">
                    {group.items.map((item) => (
                      <div key={item.name} className="text-xs">
                        <span className="font-medium text-[#111111] block mb-0.5">
                          {item.name}
                        </span>
                        <span className="font-mono text-[11px] text-[#666666] leading-relaxed block">
                          {item.spec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Lightbox / Modal with AnimatePresence */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Workspace photo enlarged view"
              className="relative max-w-5xl w-full rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-4 py-3">
                <span className="font-mono text-xs text-[#111111]">
                  Joshua Abdiel — Physical Workspace Environment
                </span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close enlarged workspace photo"
                  className="p-1 rounded hover:bg-[#F7F6F3] text-[#111111] transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="relative aspect-[16/9] w-full bg-[#000000]">
                <Image
                  src="/images/workspace/setup.png"
                  alt="Joshua Abdiel engineering desk and workspace setup full view"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
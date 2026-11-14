"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { Reveal, useStickyBottomPin } from "@/components/motion-wrapper";

export function Workspace() {
  const [modalOpen, setModalOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useStickyBottomPin(sectionRef);

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
    <section
      ref={sectionRef}
      id="workspace"
      className="dark-section pt-20 md:pt-28 pb-16 md:pb-24 border-b border-[#222222] bg-[#111111] text-[#FAFAFA] md:sticky md:top-[calc(100dvh-1327px)]"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Centered Editorial Header crowning the Studio Setup */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-3xl sm:text-5xl font-serif text-[#FFFFFF] tracking-[-0.025em] leading-[1.08] mb-3.5"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Engineering Studio &amp; Operational Setup
            </h2>
            <p className="text-xs sm:text-sm text-[#A3A3A3] font-sans max-w-xl mx-auto leading-relaxed">
              A deliberate workspace built for sustained focus, rapid prototyping, and architectural
              precision. Combining ergonomic hardware with strict software tooling.
            </p>
          </div>
        </Reveal>

        {/* Transparent Rear-View Composite Stage seamlessly integrated onto #111111 */}
        <Reveal delay={0.08}>
          <div className="relative mx-auto mt-6 sm:mt-8 max-w-4xl">
            {/* Subtle ambient studio key light behind subject & display */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_50%_at_50%_46%,rgba(255,255,255,0.065),transparent_72%)]"
            />

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              data-cursor-label="Enlarge"
              aria-label="Enlarge Joshua Abdiel engineering studio setup view"
              className="relative block w-full aspect-[1159/667] overflow-hidden border-0 bg-transparent p-0 focus-visible:outline-white cursor-pointer"
            >
              <Image
                src="/images/workspace/setup-studio.png"
                alt="Rear view of Joshua Abdiel seated at his engineering desk and operational setup"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 896px) 100vw, 896px"
                priority={false}
              />
              {/* Subtle bottom dissolve so chair base anchors organically into #111111 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent"
              />
            </button>
          </div>
        </Reveal>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
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
              className="dark-section relative max-w-4xl w-full rounded-[10px] border border-[#262626] bg-[#111111] overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#262626] bg-[#111111] px-4 py-3">
                <span className="font-mono text-xs text-[#FAFAFA]">
                  Joshua Abdiel | Physical Workspace Environment
                </span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close enlarged workspace photo"
                  className="p-1 rounded hover:bg-[#222222] text-[#FAFAFA] transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="relative aspect-[1159/667] w-full bg-[#111111] p-4 sm:p-8">
                <Image
                  src="/images/workspace/setup-studio.png"
                  alt="Rear view of Joshua Abdiel seated at his engineering desk and operational setup"
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
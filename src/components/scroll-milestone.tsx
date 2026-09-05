"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface MilestoneItem {
  id: string;
  num: string;
  shortLabel: string;
  fullLabel: string;
}

const MILESTONES: MilestoneItem[] = [
  { id: "hero", num: "00", shortLabel: "INTRO", fullLabel: "Overview & Status" },
  { id: "about", num: "01", shortLabel: "BIO", fullLabel: "Biographic Dossier" },
  { id: "projects", num: "02", shortLabel: "WORKS", fullLabel: "Selected Works" },
  { id: "stacking-mechanics", num: "03", shortLabel: "PARALLAX", fullLabel: "Design Mechanics" },
  { id: "dossier", num: "04", shortLabel: "STACK", fullLabel: "Technical Stack" },
  { id: "principles", num: "05", shortLabel: "ARCH", fullLabel: "System Architecture" },
  { id: "workspace", num: "06", shortLabel: "STUDIO", fullLabel: "Engineering Studio" },
  { id: "experience", num: "07", shortLabel: "CHRONO", fullLabel: "Milestones & Record" },
  { id: "contact", num: "08", shortLabel: "CONNECT", fullLabel: "Direct Initiation" },
];

export function ScrollMilestone() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [milestoneProgress, setMilestoneProgress] = useState<number>(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [trackMetrics, setTrackMetrics] = useState<{ top: number; height: number }>({
    top: 10,
    height: 320,
  });

  const listRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Measure exact vertical centers of first and last dot
  const updateTrackMetrics = useCallback(() => {
    if (!listRef.current) return;
    const firstDot = dotRefs.current[0];
    const lastDot = dotRefs.current[MILESTONES.length - 1];

    if (firstDot && lastDot) {
      const listRect = listRef.current.getBoundingClientRect();
      const firstRect = firstDot.getBoundingClientRect();
      const lastRect = lastDot.getBoundingClientRect();

      // Exact center Y relative to listRef container
      const top = firstRect.top + firstRect.height / 2 - listRect.top;
      const bottom = lastRect.top + lastRect.height / 2 - listRect.top;
      const height = Math.max(bottom - top, 0);

      setTrackMetrics({ top, height });
    }
  }, []);

  useEffect(() => {
    updateTrackMetrics();
    window.addEventListener("resize", updateTrackMetrics);
    return () => window.removeEventListener("resize", updateTrackMetrics);
  }, [updateTrackMetrics]);

  // Section-synchronized scroll tracking
  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportH = window.innerHeight;
          const totalDocH = document.documentElement.scrollHeight;
          const maxScroll = totalDocH - viewportH;

          // 1. If at top edge, snap to start
          if (scrollY <= 15) {
            setActiveId(MILESTONES[0].id);
            setMilestoneProgress(0);
            ticking = false;
            return;
          }

          // 2. If at bottom edge of document, snap to end
          if (scrollY + viewportH >= totalDocH - 25) {
            setActiveId(MILESTONES[MILESTONES.length - 1].id);
            setMilestoneProgress(1);
            ticking = false;
            return;
          }

          // 3. Compute absolute top position of each section
          const sectionTops: number[] = [];
          for (let i = 0; i < MILESTONES.length; i++) {
            const el = document.getElementById(MILESTONES[i].id);
            if (el) {
              const rect = el.getBoundingClientRect();
              sectionTops[i] = rect.top + scrollY;
            } else {
              sectionTops[i] = (i / (MILESTONES.length - 1)) * maxScroll;
            }
          }

          // Dynamic detection threshold (middle/upper portion of screen)
          const threshold = viewportH * 0.32;
          const probeY = scrollY + threshold;

          // Find which section is currently active
          let currentIdx = 0;
          for (let i = 0; i < sectionTops.length; i++) {
            if (probeY >= sectionTops[i]) {
              currentIdx = i;
            }
          }

          setActiveId(MILESTONES[currentIdx].id);

          // Interpolate progress smoothly between current section and next section
          const numSegments = MILESTONES.length - 1;
          if (currentIdx >= numSegments) {
            setMilestoneProgress(1);
          } else {
            const startY = sectionTops[currentIdx];
            const endY = sectionTops[currentIdx + 1] || startY + 400;
            const segmentDist = Math.max(endY - startY, 1);
            const localProgress = Math.min(
              Math.max((probeY - startY) / segmentDist, 0),
              1
            );

            const calculatedProgress = (currentIdx + localProgress) / numSegments;
            setMilestoneProgress(Math.min(Math.max(calculatedProgress, 0), 1));
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeIndex = MILESTONES.findIndex((m) => m.id === activeId);
  const currentIdx = activeIndex === -1 ? 0 : activeIndex;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const percentage = Math.round(milestoneProgress * 100);

  return (
    <>
      {/* 1. Desktop & Widescreen Milestone Rail (Borderless, Pure Architectural Track) */}
      <nav
        aria-label="Document Section Milestones"
        className="fixed left-4 2xl:left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-start select-none py-2"
      >
        <div className="flex flex-col items-start group">
          {/* Top Rail Header */}
          <div className="flex items-center gap-2 pb-2 mb-3 font-mono text-[10px] uppercase tracking-wider text-[#787774]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#346538] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#346538]"></span>
            </span>
            <span className="font-semibold text-[#111111]">DOSSIER RAIL</span>
            <span className="text-[#CCCCCC]">•</span>
            <span className="tabular-nums text-[10px] font-mono text-[#888888]">
              {MILESTONES[currentIdx]?.num}/08
            </span>
          </div>

          {/* Milestone Nodes Track & Continuous Fill Line */}
          <div ref={listRef} className="relative py-1">
            {/* Background Static Hairline Track (Mathematically centered on dot axis) */}
            <div
              className="absolute left-2.5 -translate-x-1/2 w-[1.5px] bg-[#EAEAEA] rounded-full z-0 pointer-events-none"
              style={{
                top: `${trackMetrics.top}px`,
                height: `${trackMetrics.height}px`,
              }}
            />

            {/* Dynamic Active Fill Track (Strictly synchronized with dot positions) */}
            <div
              className="absolute left-2.5 -translate-x-1/2 w-[1.5px] bg-[#111111] rounded-full z-0 pointer-events-none transition-[height] duration-100 ease-out"
              style={{
                top: `${trackMetrics.top}px`,
                height: `${milestoneProgress * trackMetrics.height}px`,
              }}
            />

            {/* List of Milestones */}
            <div className="flex flex-col space-y-6 2xl:space-y-7 relative z-10">
              {MILESTONES.map((item, idx) => {
                const isActive = item.id === activeId;
                // Dot is passed as soon as fill line reaches it
                const dotThreshold = idx / (MILESTONES.length - 1) - 0.005;
                const isPassed = milestoneProgress >= dotThreshold || idx <= currentIdx;
                const isHovered = hoveredId === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className="group/btn flex items-center gap-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] rounded py-0.5"
                      aria-label={`Scroll to ${item.fullLabel}`}
                    >
                      {/* Node Bullet / Marker (Exact 20px w-5 container centered with track) */}
                      <div
                        ref={(el) => {
                          dotRefs.current[idx] = el;
                        }}
                        className="relative flex items-center justify-center w-5 h-5 flex-shrink-0"
                      >
                        {isActive ? (
                          <motion.div
                            layoutId="active-milestone-marker"
                            className="w-3.5 h-3.5 rounded-full bg-[#111111] ring-2 ring-[#346538]/30 flex items-center justify-center z-10"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          >
                            <span className="w-1 h-1 rounded-full bg-white block" />
                          </motion.div>
                        ) : isPassed ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#111111] transition-colors duration-150 z-10" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full border border-[#CCCCCC] bg-[#FFFFFF] transition-colors duration-150 group-hover/btn:border-[#111111] z-10" />
                        )}
                      </div>

                      {/* Number Tag */}
                      <span
                        className={`font-mono text-[11px] tabular-nums tracking-wider transition-colors duration-150 ${
                          isActive
                            ? "font-bold text-[#111111]"
                            : isPassed
                            ? "text-[#444444] font-medium"
                            : "text-[#999999]"
                        }`}
                      >
                        {item.num}
                      </span>

                      {/* Compact Label */}
                      <span
                        className={`font-mono text-[11px] tracking-tight transition-colors duration-150 ${
                          isActive
                            ? "text-[#111111] font-semibold"
                            : isPassed
                            ? "text-[#666666]"
                            : "text-[#AAAAAA]"
                        }`}
                      >
                        {item.shortLabel}
                      </span>
                    </button>

                    {/* Floating Tooltip Pill (Slide Out on Hover) */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-full ml-3 px-2.5 py-1 rounded-[4px] bg-[#111111] text-white font-mono text-[10px] uppercase tracking-wider whitespace-nowrap z-50 pointer-events-none shadow-md border border-[#333333]"
                      >
                        <span>
                          {item.num} // {item.fullLabel}
                        </span>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Live Digital Meter */}
          <div className="mt-3 pt-2 flex items-center gap-2 font-mono text-[10px] text-[#787774]">
            <span className="uppercase text-[#888888]">PROGRESS</span>
            <span className="font-semibold text-[#111111] tabular-nums">
              {percentage}%
            </span>
          </div>
        </div>
      </nav>

      {/* 2. Mobile & Tablet Minimal Floating Status (Borderless) */}
      <aside
        aria-label="Mobile reading progress"
        className="fixed bottom-4 left-4 z-40 xl:hidden select-none"
      >
        <button
          type="button"
          onClick={() => {
            const nextIdx = (currentIdx + 1) % MILESTONES.length;
            scrollTo(MILESTONES[nextIdx].id);
          }}
          className="flex items-center gap-2 font-mono text-[10px] text-[#111111] active:scale-95 transition-transform"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#346538] animate-pulse" />
          <span className="font-semibold">
            {MILESTONES[currentIdx]?.num} {MILESTONES[currentIdx]?.shortLabel}
          </span>
          <span className="text-[#CCCCCC]">•</span>
          <span className="tabular-nums text-[#787774]">{percentage}%</span>
        </button>
      </aside>
    </>
  );
}
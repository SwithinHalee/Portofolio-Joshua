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
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMobileDark, setIsMobileDark] = useState<boolean>(false);
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

  // Section-synchronized scroll tracking & dark section detection
  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportH = window.innerHeight;
          const totalDocH = document.documentElement.scrollHeight;
          const maxScroll = totalDocH - viewportH;

          // Detect whether milestone rail overlaps a dark architectural section (e.g. about, dossier)
          const railCenterY = viewportH / 2;
          const darkSectionIds = ["about", "dossier"];
          let overDark = false;
          for (const darkId of darkSectionIds) {
            const el = document.getElementById(darkId);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= railCenterY + 160 && rect.bottom >= railCenterY - 160) {
                overDark = true;
                break;
              }
            }
          }
          const mobileProbeY = viewportH - 40;
          let mobileOverDark = false;
          for (const darkId of darkSectionIds) {
            const el = document.getElementById(darkId);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= mobileProbeY && rect.bottom >= mobileProbeY) {
                mobileOverDark = true;
                break;
              }
            }
          }
          setIsDark(overDark);
          setIsMobileDark(mobileOverDark);

          // 1. If at top edge, snap strictly to 0
          if (scrollY <= 5) {
            setActiveId(MILESTONES[0].id);
            setMilestoneProgress(0);
            ticking = false;
            return;
          }

          // 2. If at bottom edge of document, snap strictly to 1
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

          const numSegments = MILESTONES.length - 1;
          const aboutSectionTop = sectionTops[1] || viewportH;

          // Special smooth handling for Section 00 (Hero to About transition)
          // Avoids any artificial threshold offset at the top of the page
          if (scrollY < aboutSectionTop - 80) {
            setActiveId(MILESTONES[0].id);
            const heroProgress = Math.min(
              Math.max(scrollY / Math.max(aboutSectionTop - 80, 1), 0),
              1
            );
            setMilestoneProgress(heroProgress / numSegments);
            ticking = false;
            return;
          }

          // Standard smooth section tracking for Sections 01 to 08
          const navOffset = 85;
          const probeY = scrollY + navOffset;

          let currentIdx = 1;
          for (let i = 1; i < sectionTops.length; i++) {
            if (probeY >= sectionTops[i]) {
              currentIdx = i;
            }
          }

          setActiveId(MILESTONES[currentIdx].id);

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
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 65;
      const elTop = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, elTop), behavior: "smooth" });
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
          <div className="flex items-center gap-2 pb-2 mb-3 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isDark ? "bg-[#4ADE80]" : "bg-[#346538]"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  isDark ? "bg-[#4ADE80]" : "bg-[#346538]"
                }`}
              />
            </span>
            <span
              className={`font-semibold transition-colors duration-200 ${
                isDark ? "text-white" : "text-[#111111]"
              }`}
            >
              DOSSIER RAIL
            </span>
            <span className={isDark ? "text-[#444444]" : "text-[#CCCCCC]"}>•</span>
            <span
              className={`tabular-nums text-[10px] font-mono transition-colors duration-200 ${
                isDark ? "text-[#AAAAAA]" : "text-[#888888]"
              }`}
            >
              {MILESTONES[currentIdx]?.num}/08
            </span>
          </div>

          {/* Milestone Nodes Track & Continuous Fill Line */}
          <div ref={listRef} className="relative py-1">
            {/* Background Static Hairline Track (Mathematically centered on dot axis) */}
            <div
              className={`absolute left-2.5 -translate-x-1/2 w-[1.5px] rounded-full z-0 pointer-events-none transition-colors duration-200 ${
                isDark ? "bg-[#282828]" : "bg-[#EAEAEA]"
              }`}
              style={{
                top: `${trackMetrics.top}px`,
                height: `${trackMetrics.height}px`,
              }}
            />

            {/* Dynamic Active Fill Track (Strictly synchronized with dot positions) */}
            <div
              className={`absolute left-2.5 -translate-x-1/2 w-[1.5px] rounded-full z-0 pointer-events-none transition-[height,background-color] duration-100 ease-out ${
                isDark ? "bg-white" : "bg-[#111111]"
              }`}
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
                      className={`group/btn flex items-center gap-3 text-left focus:outline-none focus-visible:ring-1 ${
                        isDark ? "focus-visible:ring-white" : "focus-visible:ring-[#111111]"
                      } rounded py-0.5`}
                      aria-label={`Scroll to ${item.fullLabel}`}
                    >
                      {/* Node Bullet / Marker (Permanent stable dot, never disappears) */}
                      <div
                        ref={(el) => {
                          dotRefs.current[idx] = el;
                        }}
                        className="relative flex items-center justify-center w-5 h-5 flex-shrink-0"
                      >
                        <div
                          className={`rounded-full transition-all duration-200 ease-out z-10 flex items-center justify-center ${
                            isActive
                              ? isDark
                                ? "w-3.5 h-3.5 bg-white ring-2 ring-[#4ADE80]/50 shadow-[0_0_12px_rgba(74,222,128,0.35)] scale-100"
                                : "w-3.5 h-3.5 bg-[#111111] ring-2 ring-[#346538]/40 shadow-sm scale-100"
                              : isPassed
                              ? isDark
                                ? "w-2.5 h-2.5 bg-white"
                                : "w-2.5 h-2.5 bg-[#111111]"
                              : isDark
                              ? "w-2.5 h-2.5 border border-[#444444] bg-[#161616] group-hover/btn:border-white"
                              : "w-2.5 h-2.5 border border-[#CCCCCC] bg-[#FFFFFF] group-hover/btn:border-[#111111]"
                          }`}
                        >
                          {isActive && (
                            <span
                              className={`w-1 h-1 rounded-full block ${
                                isDark ? "bg-[#111111]" : "bg-white"
                              }`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Number Tag */}
                      <span
                        className={`font-mono text-[11px] tabular-nums tracking-wider transition-colors duration-200 ${
                          isActive
                            ? isDark
                              ? "font-bold text-white"
                              : "font-bold text-[#111111]"
                            : isPassed
                            ? isDark
                              ? "text-[#D1D5DB] font-medium"
                              : "text-[#444444] font-medium"
                            : isDark
                            ? "text-[#666666]"
                            : "text-[#999999]"
                        }`}
                      >
                        {item.num}
                      </span>

                      {/* Compact Label */}
                      <span
                        className={`font-mono text-[11px] tracking-tight transition-colors duration-200 ${
                          isActive
                            ? isDark
                              ? "text-white font-semibold"
                              : "text-[#111111] font-semibold"
                            : isPassed
                            ? isDark
                              ? "text-[#9CA3AF]"
                              : "text-[#666666]"
                            : isDark
                            ? "text-[#555555]"
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
                        className={`absolute left-full ml-3 px-2.5 py-1 rounded-[4px] font-mono text-[10px] uppercase tracking-wider whitespace-nowrap z-50 pointer-events-none shadow-md border ${
                          isDark
                            ? "bg-[#1C1C1C] text-white border-[#383838]"
                            : "bg-[#111111] text-white border-[#333333]"
                        }`}
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
          <div className="mt-3 pt-2 flex items-center gap-2 font-mono text-[10px] transition-colors duration-200">
            <span
              className={`uppercase transition-colors duration-200 ${
                isDark ? "text-[#777777]" : "text-[#888888]"
              }`}
            >
              PROGRESS
            </span>
            <span
              className={`font-semibold tabular-nums transition-colors duration-200 ${
                isDark ? "text-white" : "text-[#111111]"
              }`}
            >
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
          className={`flex items-center gap-2 font-mono text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md transition-all active:scale-95 ${
            isMobileDark
              ? "bg-black/80 border border-[#333333] text-white shadow-lg"
              : "bg-white/80 border border-[#EAEAEA] text-[#111111] shadow-sm"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              isMobileDark ? "bg-[#4ADE80]" : "bg-[#346538]"
            }`}
          />
          <span className="font-semibold">
            {MILESTONES[currentIdx]?.num} {MILESTONES[currentIdx]?.shortLabel}
          </span>
          <span className={isMobileDark ? "text-[#555555]" : "text-[#CCCCCC]"}>•</span>
          <span
            className={`tabular-nums ${
              isMobileDark ? "text-[#AAAAAA]" : "text-[#787774]"
            }`}
          >
            {percentage}%
          </span>
        </button>
      </aside>
    </>
  );
}
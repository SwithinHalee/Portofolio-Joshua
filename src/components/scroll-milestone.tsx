"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface MilestoneItem {
  id: string;
  num: string;
  shortLabel: string;
  fullLabel: string;
}

interface SegmentMetric {
  top: number;
  height: number;
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

  // Per-node physical dark evaluation (supports 50/50 split cleanly across boundaries)
  const [headerDark, setHeaderDark] = useState<boolean>(false);
  const [itemsDark, setItemsDark] = useState<boolean[]>(() => MILESTONES.map(() => false));
  const [segmentsDark, setSegmentsDark] = useState<boolean[]>(() =>
    MILESTONES.slice(0, -1).map(() => false)
  );
  const [meterDark, setMeterDark] = useState<boolean>(false);
  const [isMobileDark, setIsMobileDark] = useState<boolean>(false);

  // Segment metrics for segmented track rendering
  const [segmentMetrics, setSegmentMetrics] = useState<SegmentMetric[]>(() => {
    const defaultSegs: SegmentMetric[] = [];
    for (let i = 0; i < MILESTONES.length - 1; i++) {
      defaultSegs.push({ top: 10 + i * 44, height: 44 });
    }
    return defaultSegs;
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Measure exact vertical centers of each dot and compute segment bounds
  const updateTrackMetrics = useCallback(() => {
    if (!listRef.current) return;
    const listRect = listRef.current.getBoundingClientRect();
    const dotCenters: number[] = [];

    for (let i = 0; i < MILESTONES.length; i++) {
      const dotEl = dotRefs.current[i];
      if (dotEl) {
        const r = dotEl.getBoundingClientRect();
        dotCenters[i] = r.top + r.height / 2 - listRect.top;
      }
    }

    const segments: SegmentMetric[] = [];
    for (let i = 0; i < MILESTONES.length - 1; i++) {
      const top = dotCenters[i] ?? 10 + i * 44;
      const nextTop = dotCenters[i + 1] ?? 10 + (i + 1) * 44;
      segments.push({
        top,
        height: Math.max(nextTop - top, 0),
      });
    }
    setSegmentMetrics(segments);
  }, []);

  useEffect(() => {
    updateTrackMetrics();
    window.addEventListener("resize", updateTrackMetrics);
    return () => window.removeEventListener("resize", updateTrackMetrics);
  }, [updateTrackMetrics]);

  // Section-synchronized scroll tracking & per-node dark section detection
  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportH = window.innerHeight;
          const totalDocH = document.documentElement.scrollHeight;
          const maxScroll = totalDocH - viewportH;

          // Multi-node physical coordinate inspection:
          // Check exactly which DOM elements overlap dark architectural sections (e.g. about, dossier)
          // Even when the rail is 50/50 split across light and dark sections, each node adapts individually.
          const darkSectionIds = ["about", "dossier"];
          const darkRects = darkSectionIds
            .map((id) => document.getElementById(id)?.getBoundingClientRect())
            .filter((r): r is DOMRect => !!r);

          const isCoordDark = (y: number) =>
            darkRects.some((r) => y >= r.top && y <= r.bottom);

          // 1. Header node
          const headerEl = headerRef.current;
          const headerY = headerEl
            ? headerEl.getBoundingClientRect().top + 8
            : viewportH / 2 - 200;
          setHeaderDark(isCoordDark(headerY));

          // 2. Each milestone item (0 to 8)
          const newItemsDark: boolean[] = [];
          for (let i = 0; i < MILESTONES.length; i++) {
            const dotEl = dotRefs.current[i];
            const dotY = dotEl
              ? dotEl.getBoundingClientRect().top + dotEl.getBoundingClientRect().height / 2
              : viewportH / 2 - 160 + i * 40;
            newItemsDark[i] = isCoordDark(dotY);
          }
          setItemsDark(newItemsDark);

          // 3. Each rail track segment (0 to 7)
          const newSegmentsDark: boolean[] = [];
          for (let i = 0; i < MILESTONES.length - 1; i++) {
            const dotA = dotRefs.current[i];
            const dotB = dotRefs.current[i + 1];
            let midY = viewportH / 2 - 140 + i * 40;
            if (dotA && dotB) {
              const rA = dotA.getBoundingClientRect();
              const rB = dotB.getBoundingClientRect();
              midY = (rA.top + rB.top + rA.height) / 2;
            }
            newSegmentsDark[i] = isCoordDark(midY);
          }
          setSegmentsDark(newSegmentsDark);

          // 4. Progress meter node
          const meterEl = meterRef.current;
          const meterY = meterEl
            ? meterEl.getBoundingClientRect().top + 8
            : viewportH / 2 + 200;
          setMeterDark(isCoordDark(meterY));

          // 5. Mobile status probe
          const mobileProbeY = viewportH - 35;
          setIsMobileDark(isCoordDark(mobileProbeY));

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
          {/* Top Rail Header (Independently evaluated based on physical screen position) */}
          <div
            ref={headerRef}
            className="flex items-center gap-2 pb-2 mb-3 font-mono text-[10px] uppercase tracking-wider transition-colors duration-150"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  headerDark ? "bg-[#4ADE80]" : "bg-[#346538]"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  headerDark ? "bg-[#4ADE80]" : "bg-[#346538]"
                }`}
              />
            </span>
            <span
              className={`font-semibold transition-colors duration-150 ${
                headerDark ? "text-white" : "text-[#111111]"
              }`}
            >
              DOSSIER RAIL
            </span>
            <span className={headerDark ? "text-[#444444]" : "text-[#CCCCCC]"}>•</span>
            <span
              className={`tabular-nums text-[10px] font-mono transition-colors duration-150 ${
                headerDark ? "text-[#AAAAAA]" : "text-[#888888]"
              }`}
            >
              {MILESTONES[currentIdx]?.num}/08
            </span>
          </div>

          {/* Milestone Nodes Track & Continuous Segmented Fill Line */}
          <div ref={listRef} className="relative py-1">
            {/* Segmented Hairline Tracks (Supports 50/50 split across light and dark boundaries) */}
            {segmentMetrics.map((seg, i) => {
              const isSegDark = segmentsDark[i] ?? false;
              const numSegments = MILESTONES.length - 1;
              const segStart = i / numSegments;
              const segEnd = (i + 1) / numSegments;
              const segFill = Math.min(
                Math.max((milestoneProgress - segStart) / (segEnd - segStart), 0),
                1
              );

              return (
                <div key={`seg-${i}`} className="pointer-events-none">
                  {/* Background Static Hairline for this segment */}
                  <div
                    className={`absolute left-2.5 -translate-x-1/2 w-[1.5px] rounded-full z-0 pointer-events-none transition-colors duration-150 ${
                      isSegDark ? "bg-[#282828]" : "bg-[#EAEAEA]"
                    }`}
                    style={{
                      top: `${seg.top}px`,
                      height: `${seg.height}px`,
                    }}
                  />

                  {/* Dynamic Active Fill for this segment */}
                  {segFill > 0 && (
                    <div
                      className={`absolute left-2.5 -translate-x-1/2 w-[1.5px] rounded-full z-0 pointer-events-none transition-[height,background-color] duration-75 ease-out ${
                        isSegDark ? "bg-white" : "bg-[#111111]"
                      }`}
                      style={{
                        top: `${seg.top}px`,
                        height: `${segFill * seg.height}px`,
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* List of Milestones */}
            <div className="flex flex-col space-y-6 2xl:space-y-7 relative z-10">
              {MILESTONES.map((item, idx) => {
                const isActive = item.id === activeId;
                // Dot is passed as soon as fill line reaches it
                const dotThreshold = idx / (MILESTONES.length - 1) - 0.005;
                const isPassed = milestoneProgress >= dotThreshold || idx <= currentIdx;
                const isHovered = hoveredId === item.id;
                const isItemDark = itemsDark[idx] ?? false;

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
                        isItemDark ? "focus-visible:ring-white" : "focus-visible:ring-[#111111]"
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
                              ? isItemDark
                                ? "w-3.5 h-3.5 bg-white ring-2 ring-[#4ADE80]/50 shadow-[0_0_12px_rgba(74,222,128,0.35)] scale-100"
                                : "w-3.5 h-3.5 bg-[#111111] ring-2 ring-[#346538]/40 shadow-sm scale-100"
                              : isPassed
                              ? isItemDark
                                ? "w-2.5 h-2.5 bg-white"
                                : "w-2.5 h-2.5 bg-[#111111]"
                              : isItemDark
                              ? "w-2.5 h-2.5 border border-[#444444] bg-[#161616] group-hover/btn:border-white"
                              : "w-2.5 h-2.5 border border-[#CCCCCC] bg-[#FFFFFF] group-hover/btn:border-[#111111]"
                          }`}
                        >
                          {isActive && (
                            <span
                              className={`w-1 h-1 rounded-full block ${
                                isItemDark ? "bg-[#111111]" : "bg-white"
                              }`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Number Tag */}
                      <span
                        className={`font-mono text-[11px] tabular-nums tracking-wider transition-colors duration-150 ${
                          isActive
                            ? isItemDark
                              ? "font-bold text-white"
                              : "font-bold text-[#111111]"
                            : isPassed
                            ? isItemDark
                              ? "text-[#D1D5DB] font-medium"
                              : "text-[#444444] font-medium"
                            : isItemDark
                            ? "text-[#666666]"
                            : "text-[#999999]"
                        }`}
                      >
                        {item.num}
                      </span>

                      {/* Compact Label */}
                      <span
                        className={`font-mono text-[11px] tracking-tight transition-colors duration-150 ${
                          isActive
                            ? isItemDark
                              ? "text-white font-semibold"
                              : "text-[#111111] font-semibold"
                            : isPassed
                            ? isItemDark
                              ? "text-[#9CA3AF]"
                              : "text-[#666666]"
                            : isItemDark
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
                          isItemDark
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
          <div
            ref={meterRef}
            className="mt-3 pt-2 flex items-center gap-2 font-mono text-[10px] transition-colors duration-150"
          >
            <span
              className={`uppercase transition-colors duration-150 ${
                meterDark ? "text-[#777777]" : "text-[#888888]"
              }`}
            >
              PROGRESS
            </span>
            <span
              className={`font-semibold tabular-nums transition-colors duration-150 ${
                meterDark ? "text-white" : "text-[#111111]"
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
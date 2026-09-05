"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface MilestoneItem {
  id: string;
  num: string;
  shortLabel: string;
  fullLabel: string;
}

interface MilestoneContentProps {
  mode: "light-bg" | "dark-bg";
  activeId: string;
  currentIdx: number;
  milestoneProgress: number;
  hoveredId: string | null;
  setHoveredId?: (id: string | null) => void;
  scrollTo?: (id: string) => void;
  percentage: number;
  listRef?: React.RefObject<HTMLDivElement | null>;
  dotRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
  trackMetrics: { top: number; height: number };
  renderTooltips?: boolean;
}

function MilestoneContent({
  mode,
  activeId,
  currentIdx,
  milestoneProgress,
  hoveredId,
  setHoveredId,
  scrollTo,
  percentage,
  listRef,
  dotRefs,
  trackMetrics,
  renderTooltips = true,
}: MilestoneContentProps) {
  const isDark = mode === "dark-bg";

  return (
    <div className="flex flex-col items-start group">
      {/* Top Rail Header */}
      <div className="flex items-center gap-2 pb-2 mb-3 font-mono text-[10px] uppercase tracking-wider">
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
        <span className={`font-semibold ${isDark ? "text-white" : "text-[#111111]"}`}>
          DOSSIER RAIL
        </span>
        <span className={isDark ? "text-[#444444]" : "text-[#CCCCCC]"}>•</span>
        <span className={`tabular-nums text-[10px] font-mono ${isDark ? "text-[#AAAAAA]" : "text-[#888888]"}`}>
          {MILESTONES[currentIdx]?.num}/08
        </span>
      </div>

      {/* Milestone Nodes Track & Continuous Fill Line */}
      <div ref={listRef} className="relative py-1">
        {/* Background Static Hairline Track */}
        <div
          className={`absolute left-2.5 -translate-x-1/2 w-[1.5px] rounded-full z-0 pointer-events-none ${
            isDark ? "bg-[#282828]" : "bg-[#EAEAEA]"
          }`}
          style={{
            top: `${trackMetrics.top}px`,
            height: `${trackMetrics.height}px`,
          }}
        />

        {/* Dynamic Active Fill Track */}
        <div
          className={`absolute left-2.5 -translate-x-1/2 w-[1.5px] rounded-full z-0 pointer-events-none transition-[height] duration-75 ease-out ${
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
            const dotThreshold = idx / (MILESTONES.length - 1) - 0.005;
            const isPassed = milestoneProgress >= dotThreshold || idx <= currentIdx;
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                className="relative flex items-center"
                onMouseEnter={() => setHoveredId?.(item.id)}
                onMouseLeave={() => setHoveredId?.(null)}
              >
                <button
                  type="button"
                  onClick={() => scrollTo?.(item.id)}
                  tabIndex={isDark ? -1 : 0}
                  className={`group/btn flex items-center gap-3 text-left focus:outline-none focus-visible:ring-1 ${
                    isDark ? "focus-visible:ring-white" : "focus-visible:ring-[#111111]"
                  } rounded py-0.5`}
                  aria-label={`Scroll to ${item.fullLabel}`}
                >
                  {/* Node Bullet / Marker */}
                  <div
                    ref={(el) => {
                      if (dotRefs) dotRefs.current[idx] = el;
                    }}
                    className="relative flex items-center justify-center w-5 h-5 flex-shrink-0"
                  >
                    <div
                      className={`rounded-full transition-all duration-150 ease-out z-10 flex items-center justify-center ${
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
                    className={`font-mono text-[11px] tabular-nums tracking-wider ${
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
                    className={`font-mono text-[11px] tracking-tight ${
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

                {/* Floating Tooltip Pill (Only rendered on base layer) */}
                {renderTooltips && isHovered && (
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
      <div className="mt-3 pt-2 flex items-center gap-2 font-mono text-[10px]">
        <span className={`uppercase ${isDark ? "text-[#777777]" : "text-[#888888]"}`}>
          PROGRESS
        </span>
        <span className={`font-semibold tabular-nums ${isDark ? "text-white" : "text-[#111111]"}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

interface MobileContentProps {
  mode: "light-bg" | "dark-bg";
  currentIdx: number;
  percentage: number;
  onClick?: () => void;
}

function MobileContent({
  mode,
  currentIdx,
  percentage,
  onClick,
}: MobileContentProps) {
  const isDark = mode === "dark-bg";

  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={isDark ? -1 : 0}
      className={`flex items-center gap-2 font-mono text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md transition-transform active:scale-95 ${
        isDark
          ? "bg-[#0E0E0E]/90 border border-[#333333] text-white shadow-lg"
          : "bg-white/90 border border-[#EAEAEA] text-[#111111] shadow-sm"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          isDark ? "bg-[#4ADE80]" : "bg-[#346538]"
        }`}
      />
      <span className="font-semibold">
        {MILESTONES[currentIdx]?.num} {MILESTONES[currentIdx]?.shortLabel}
      </span>
      <span className={isDark ? "text-[#555555]" : "text-[#CCCCCC]"}>•</span>
      <span className={`tabular-nums ${isDark ? "text-[#AAAAAA]" : "text-[#787774]"}`}>
        {percentage}%
      </span>
    </button>
  );
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

  // Sub-pixel clip path states for real-time boundary splitting
  const [clipPath, setClipPath] = useState<string>("inset(0 0 100% 0)");
  const [isClipVisible, setIsClipVisible] = useState<boolean>(false);
  const [mobileClipPath, setMobileClipPath] = useState<string>("inset(0 0 100% 0)");
  const [isMobileClipVisible, setIsMobileClipVisible] = useState<boolean>(false);

  const [trackMetrics, setTrackMetrics] = useState<{ top: number; height: number }>({
    top: 10,
    height: 320,
  });

  const railRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLElement>(null);
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

  // Section-synchronized scroll tracking & real-time split clipping across boundaries
  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportH = window.innerHeight;
          const totalDocH = document.documentElement.scrollHeight;
          const maxScroll = totalDocH - viewportH;

          // 1. Calculate Real-Time Sub-Pixel Clip Paths for Dark Section Overlaps
          const darkSectionIds = ["about", "dossier"];

          // Desktop Rail Sub-Pixel Clip
          if (railRef.current) {
            const railRect = railRef.current.getBoundingClientRect();
            let matched = false;

            for (const darkId of darkSectionIds) {
              const el = document.getElementById(darkId);
              if (el) {
                const secRect = el.getBoundingClientRect();
                const overlapTop = Math.max(railRect.top, secRect.top);
                const overlapBottom = Math.min(railRect.bottom, secRect.bottom);

                if (overlapBottom > overlapTop) {
                  const clipTop = Math.max(0, overlapTop - railRect.top);
                  const clipBottom = Math.min(railRect.height, overlapBottom - railRect.top);
                  const bottomInset = Math.max(0, railRect.height - clipBottom);

                  setClipPath(`inset(${clipTop.toFixed(1)}px 0px ${bottomInset.toFixed(1)}px 0px)`);
                  setIsClipVisible(true);
                  matched = true;
                  break;
                }
              }
            }

            if (!matched) {
              setIsClipVisible(false);
            }
          }

          // Mobile Floating Indicator Sub-Pixel Clip
          if (mobileRef.current) {
            const mRect = mobileRef.current.getBoundingClientRect();
            let mMatched = false;

            for (const darkId of darkSectionIds) {
              const el = document.getElementById(darkId);
              if (el) {
                const secRect = el.getBoundingClientRect();
                const overlapTop = Math.max(mRect.top, secRect.top);
                const overlapBottom = Math.min(mRect.bottom, secRect.bottom);

                if (overlapBottom > overlapTop) {
                  const clipTop = Math.max(0, overlapTop - mRect.top);
                  const clipBottom = Math.min(mRect.height, overlapBottom - mRect.top);
                  const bottomInset = Math.max(0, mRect.height - clipBottom);

                  setMobileClipPath(`inset(${clipTop.toFixed(1)}px 0px ${bottomInset.toFixed(1)}px 0px)`);
                  setIsMobileClipVisible(true);
                  mMatched = true;
                  break;
                }
              }
            }

            if (!mMatched) {
              setIsMobileClipVisible(false);
            }
          }

          // 2. Section Active ID and Progress Tracking
          if (scrollY <= 5) {
            setActiveId(MILESTONES[0].id);
            setMilestoneProgress(0);
            ticking = false;
            return;
          }

          if (scrollY + viewportH >= totalDocH - 25) {
            setActiveId(MILESTONES[MILESTONES.length - 1].id);
            setMilestoneProgress(1);
            ticking = false;
            return;
          }

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
      {/* 1. Desktop & Widescreen Milestone Rail */}
      <nav
        ref={railRef}
        aria-label="Document Section Milestones"
        className="fixed left-4 2xl:left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-start select-none py-2"
      >
        {/* Base Layer: Dark typography & markers (Optimized for light canvas) */}
        <MilestoneContent
          mode="light-bg"
          activeId={activeId}
          currentIdx={currentIdx}
          milestoneProgress={milestoneProgress}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          scrollTo={scrollTo}
          percentage={percentage}
          listRef={listRef}
          dotRefs={dotRefs}
          trackMetrics={trackMetrics}
          renderTooltips={true}
        />

        {/* Overlay Layer: White typography & markers (Clipped sub-pixel in real time over dark sections) */}
        {isClipVisible && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden"
            style={{ clipPath }}
          >
            <MilestoneContent
              mode="dark-bg"
              activeId={activeId}
              currentIdx={currentIdx}
              milestoneProgress={milestoneProgress}
              hoveredId={hoveredId}
              percentage={percentage}
              trackMetrics={trackMetrics}
              renderTooltips={false}
            />
          </div>
        )}
      </nav>

      {/* 2. Mobile & Tablet Minimal Floating Status */}
      <aside
        ref={mobileRef}
        aria-label="Mobile reading progress"
        className="fixed bottom-4 left-4 z-40 xl:hidden select-none"
      >
        {/* Base Layer */}
        <MobileContent
          mode="light-bg"
          currentIdx={currentIdx}
          percentage={percentage}
          onClick={() => {
            const nextIdx = (currentIdx + 1) % MILESTONES.length;
            scrollTo(MILESTONES[nextIdx].id);
          }}
        />

        {/* Overlay Layer (Real-time sub-pixel clipped over dark sections) */}
        {isMobileClipVisible && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden"
            style={{ clipPath: mobileClipPath }}
          >
            <MobileContent
              mode="dark-bg"
              currentIdx={currentIdx}
              percentage={percentage}
            />
          </div>
        )}
      </aside>
    </>
  );
}
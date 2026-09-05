"use client";

import { useEffect, useState, useMemo } from "react";
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
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Calculate overall scroll progress (0 to 1)
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = docHeight > 0 ? Math.min(Math.max(currentScroll / docHeight, 0), 1) : 0;
          setScrollProgress(progress);

          // Find current active section
          const scrollPos = currentScroll + window.innerHeight * 0.35;
          let current = MILESTONES[0].id;

          for (const item of MILESTONES) {
            const el = document.getElementById(item.id);
            if (el) {
              const top = el.offsetTop;
              if (scrollPos >= top) {
                current = item.id;
              }
            }
          }
          setActiveId(current);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = useMemo(() => {
    const idx = MILESTONES.findIndex((m) => m.id === activeId);
    return idx === -1 ? 0 : idx;
  }, [activeId]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const percentage = Math.round(scrollProgress * 100);

  return (
    <>
      {/* 1. Desktop & Widescreen Milestone Rail (Floating in Left Margin Gutter) */}
      <nav
        aria-label="Document Section Milestones"
        className="fixed left-3 2xl:left-7 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-start select-none"
      >
        <div className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF]/90 backdrop-blur-md p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] group transition-all duration-200 hover:border-[#CCCCCC]">
          {/* Top Rail Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#EAEAEA] pb-2.5 mb-3 font-mono text-[9px] uppercase tracking-wider text-[#787774] w-full">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#346538] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#346538]"></span>
              </span>
              <span className="font-semibold text-[#111111]">DOSSIER RAIL</span>
            </div>
            <span className="tabular-nums text-[9px] font-mono text-[#888888]">
              {MILESTONES[activeIndex]?.num}/08
            </span>
          </div>

          {/* Milestone Nodes Track & Continuous Fill Line */}
          <div className="relative py-1">
            {/* Background Static Track */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-[#EAEAEA] rounded-full" />

            {/* Dynamic Active Fill Track */}
            <div
              className="absolute left-[7px] top-2 w-[1.5px] bg-[#111111] rounded-full transition-all duration-150 ease-out"
              style={{
                height: `${scrollProgress * 100}%`,
                maxHeight: "calc(100% - 16px)",
              }}
            />

            {/* List of Milestones */}
            <div className="flex flex-col space-y-3.5 relative">
              {MILESTONES.map((item, idx) => {
                const isActive = item.id === activeId;
                const isPassed = idx <= activeIndex;
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
                      className="group/btn flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] rounded py-0.5"
                      aria-label={`Scroll to ${item.fullLabel}`}
                    >
                      {/* Node Bullet / Marker */}
                      <div className="relative flex items-center justify-center w-[15px] h-[15px] z-10">
                        {isActive ? (
                          <motion.div
                            layoutId="active-milestone-marker"
                            className="w-3 h-3 rounded-full bg-[#111111] ring-2 ring-[#346538]/30 flex items-center justify-center shadow-sm"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          >
                            <span className="w-1 h-1 rounded-full bg-white block" />
                          </motion.div>
                        ) : isPassed ? (
                          <div className="w-2 h-2 rounded-full bg-[#111111] transition-colors duration-150" />
                        ) : (
                          <div className="w-2 h-2 rounded-full border border-[#CCCCCC] bg-[#FFFFFF] transition-colors duration-150 group-hover/btn:border-[#111111]" />
                        )}
                      </div>

                      {/* Number Tag */}
                      <span
                        className={`font-mono text-[10px] tabular-nums tracking-wider transition-colors duration-150 ${
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
                        className={`font-mono text-[10px] tracking-tight transition-colors duration-150 ${
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
                        <span>{item.num} // {item.fullLabel}</span>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Live Digital Meter */}
          <div className="mt-3 pt-2.5 border-t border-[#EAEAEA] flex items-center justify-between font-mono text-[9px] text-[#787774] w-full">
            <span className="uppercase text-[#888888]">PROGRESS</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#111111] tabular-nums">{percentage}%</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Mobile & Tablet Minimal Floating Status Pill (Bottom Left) */}
      <aside
        aria-label="Mobile reading progress"
        className="fixed bottom-4 left-4 z-40 xl:hidden"
      >
        <button
          type="button"
          onClick={() => {
            const nextIdx = (activeIndex + 1) % MILESTONES.length;
            scrollTo(MILESTONES[nextIdx].id);
          }}
          className="flex items-center gap-2 rounded-full border border-[#EAEAEA] bg-[#FFFFFF]/95 backdrop-blur-md px-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-mono text-[11px] text-[#111111] active:scale-95 transition-transform"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#346538] animate-pulse" />
          <span className="font-semibold text-[10px]">
            {MILESTONES[activeIndex]?.num} {MILESTONES[activeIndex]?.shortLabel}
          </span>
          <span className="text-[#CCCCCC]">•</span>
          <span className="tabular-nums text-[10px] text-[#787774]">{percentage}%</span>
        </button>
      </aside>
    </>
  );
}
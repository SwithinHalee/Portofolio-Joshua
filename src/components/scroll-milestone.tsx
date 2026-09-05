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
      {/* 1. Desktop & Widescreen Milestone Rail (Borderless & Container-free) */}
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
              {MILESTONES[activeIndex]?.num}/08
            </span>
          </div>

          {/* Milestone Nodes Track & Continuous Fill Line */}
          <div className="relative py-1">
            {/* Background Static Track */}
            <div className="absolute left-[7px] top-[9px] bottom-[9px] w-[1.5px] bg-[#EAEAEA] rounded-full" />

            {/* Dynamic Active Fill Track */}
            <div
              className="absolute left-[7px] top-[9px] w-[1.5px] bg-[#111111] rounded-full transition-all duration-150 ease-out"
              style={{
                height: `calc(${scrollProgress * 100}% - ${scrollProgress * 18}px)`,
                maxHeight: "calc(100% - 18px)",
              }}
            />

            {/* List of Milestones (Taller Spacing) */}
            <div className="flex flex-col space-y-6 2xl:space-y-7 relative">
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
                      className="group/btn flex items-center gap-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] rounded py-0.5"
                      aria-label={`Scroll to ${item.fullLabel}`}
                    >
                      {/* Node Bullet / Marker */}
                      <div className="relative flex items-center justify-center w-[15px] h-[15px] z-10">
                        {isActive ? (
                          <motion.div
                            layoutId="active-milestone-marker"
                            className="w-3.5 h-3.5 rounded-full bg-[#111111] ring-2 ring-[#346538]/30 flex items-center justify-center"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          >
                            <span className="w-1 h-1 rounded-full bg-white block" />
                          </motion.div>
                        ) : isPassed ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#111111] transition-colors duration-150" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full border border-[#CCCCCC] bg-[#FFFFFF] transition-colors duration-150 group-hover/btn:border-[#111111]" />
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
                        className="absolute left-full ml-3.5 px-2.5 py-1 rounded-[4px] bg-[#111111] text-white font-mono text-[10px] uppercase tracking-wider whitespace-nowrap z-50 pointer-events-none shadow-md border border-[#333333]"
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
          <div className="mt-3 pt-2 flex items-center gap-2 font-mono text-[10px] text-[#787774]">
            <span className="uppercase text-[#888888]">PROGRESS</span>
            <span className="font-semibold text-[#111111] tabular-nums">{percentage}%</span>
          </div>
        </div>
      </nav>

      {/* 2. Mobile & Tablet Minimal Floating Status (Borderless & Container-free) */}
      <aside
        aria-label="Mobile reading progress"
        className="fixed bottom-4 left-4 z-40 xl:hidden select-none"
      >
        <button
          type="button"
          onClick={() => {
            const nextIdx = (activeIndex + 1) % MILESTONES.length;
            scrollTo(MILESTONES[nextIdx].id);
          }}
          className="flex items-center gap-2 font-mono text-[10px] text-[#111111] active:scale-95 transition-transform"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#346538] animate-pulse" />
          <span className="font-semibold">
            {MILESTONES[activeIndex]?.num} {MILESTONES[activeIndex]?.shortLabel}
          </span>
          <span className="text-[#CCCCCC]">•</span>
          <span className="tabular-nums text-[#787774]">{percentage}%</span>
        </button>
      </aside>
    </>
  );
}
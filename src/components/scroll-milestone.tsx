"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getStackRange } from "@/components/motion-wrapper";
import { scrollWithWeight } from "@/components/weighted-scroll";

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
  { id: "stacking-mechanics", num: "03", shortLabel: "CERTS", fullLabel: "Certifications" },
  { id: "dossier", num: "04", shortLabel: "STACK", fullLabel: "Technical Stack" },
  { id: "principles", num: "05", shortLabel: "ARCH", fullLabel: "System Architecture" },
  { id: "workspace", num: "06", shortLabel: "STUDIO", fullLabel: "Engineering Studio" },
  { id: "experience", num: "07", shortLabel: "CHRONO", fullLabel: "Milestones & Record" },
  { id: "contact", num: "08", shortLabel: "CONNECT", fullLabel: "Direct Initiation" },
];

interface SectionGeometry {
  clickY: number;
  activateY: number;
}

const STACK_PAIR: Record<string, { wrapId: string; pinnedId: string; role: "pinned" | "slide" }> = {
  dossier: { wrapId: "dossier-stack", pinnedId: "dossier", role: "pinned" },
  principles: { wrapId: "dossier-stack", pinnedId: "dossier", role: "slide" },
  workspace: { wrapId: "workspace-stack", pinnedId: "workspace", role: "pinned" },
  experience: { wrapId: "workspace-stack", pinnedId: "workspace", role: "slide" },
};

function measureSectionGeometry(
  id: string,
  scrollY: number,
  viewportH: number,
  navOffset = 85
): SectionGeometry | null {
  const header = document.querySelector("header");
  const headerH = header ? header.getBoundingClientRect().height : 59;
  const wide = window.matchMedia("(min-width: 768px)").matches;

  if (id === "hero") {
    return { clickY: 0, activateY: 0 };
  }

  const stackInfo = STACK_PAIR[id];
  if (stackInfo) {
    const wrap = document.getElementById(stackInfo.wrapId);
    const pinned = document.getElementById(stackInfo.pinnedId);
    if (wrap) {
      if (stackInfo.role === "pinned") {
        const top = wrap.offsetTop;
        return {
          clickY: Math.max(0, top - headerH + 1),
          activateY: top - navOffset,
        };
      }
      if (wide) {
        const sharedRange = getStackRange(stackInfo.wrapId);
        const fallbackDockY = pinned
          ? wrap.offsetTop + pinned.offsetHeight - headerH
          : wrap.offsetTop - headerH;
        const dockY =
          sharedRange && Number.isFinite(sharedRange[0]) ? sharedRange[0] : fallbackDockY;
        const endY =
          sharedRange && Number.isFinite(sharedRange[1]) ? sharedRange[1] : dockY + viewportH;
        return {
          // +4px ensures subpixel zoom/exponential settle crosses endY with x === 0vw.
          clickY: Math.max(0, endY + 4),
          // Switch active rail indicator when the horizontal slide crosses the screen midpoint.
          activateY: dockY + viewportH * 0.5,
        };
      }
      if (pinned) {
        const top = wrap.offsetTop + pinned.offsetHeight;
        return {
          clickY: Math.max(0, top - headerH + 1),
          activateY: top - navOffset,
        };
      }
    }
  }

  const el = document.getElementById(id);
  if (!el) return null;
  const docTop = el.getBoundingClientRect().top + scrollY;
  return {
    clickY: Math.max(0, docTop - headerH + 1),
    activateY: docTop - navOffset,
  };
}

export function ScrollMilestone() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [milestoneProgress, setMilestoneProgress] = useState<number>(0);

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

          // 3. Measure milestone activation thresholds synchronized with horizontal slides.
          const navOffset = 85;
          const activateYs: number[] = [];
          for (let i = 0; i < MILESTONES.length; i++) {
            const geom = measureSectionGeometry(
              MILESTONES[i].id,
              scrollY,
              viewportH,
              navOffset
            );
            activateYs[i] = geom
              ? geom.activateY
              : (i / (MILESTONES.length - 1)) * maxScroll;
          }

          const numSegments = MILESTONES.length - 1;
          const aboutActivateY = activateYs[1] ?? viewportH - navOffset;

          // Special smooth handling for Section 00 (Hero to About transition)
          if (scrollY < aboutActivateY) {
            setActiveId(MILESTONES[0].id);
            const heroProgress = Math.min(
              Math.max(scrollY / Math.max(aboutActivateY, 1), 0),
              1
            );
            setMilestoneProgress(heroProgress / numSegments);
            ticking = false;
            return;
          }

          // 3b. Lock CONNECT to the black 08/INITIATION container itself.
          const contactEl = document.getElementById("contact");
          if (contactEl) {
            const cRect = contactEl.getBoundingClientRect();
            if (cRect.top <= viewportH * 0.65 && cRect.bottom >= 120) {
              setActiveId(MILESTONES[MILESTONES.length - 1].id);
              setMilestoneProgress(1);
              ticking = false;
              return;
            }
          }

          // Standard section tracking for Sections 01 to 08
          let currentIdx = 1;
          for (let i = 1; i < activateYs.length; i++) {
            if (scrollY >= activateYs[i]) {
              currentIdx = i;
            }
          }

          setActiveId(MILESTONES[currentIdx].id);

          if (currentIdx >= numSegments) {
            setMilestoneProgress(1);
          } else {
            const startY = activateYs[currentIdx];
            const endY = activateYs[currentIdx + 1] ?? startY + 400;
            const segmentDist = Math.max(endY - startY, 1);
            const localProgress = Math.min(
              Math.max((scrollY - startY) / segmentDist, 0),
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

    const ro = new ResizeObserver(handleScroll);
    ro.observe(document.body);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    window.addEventListener("portfolio:hydrated", handleScroll);
    handleScroll();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("portfolio:hydrated", handleScroll);
    };
  }, []);

  const activeIndex = MILESTONES.findIndex((m) => m.id === activeId);
  const currentIdx = activeIndex === -1 ? 0 : activeIndex;

  const scrollTo = (id: string) => {
    scrollWithWeight(() => {
      const geom = measureSectionGeometry(id, window.scrollY, window.innerHeight);
      return geom ? geom.clickY : window.scrollY;
    });
  };

  const percentage = Math.round(milestoneProgress * 100);

  return (
    <>
      {/* 1. Desktop & Widescreen Milestone Rail (Native Real-Time Pixel-Level Difference Blending) */}
      <nav
        aria-label="Document Section Milestones"
        className="fixed left-4 2xl:left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-start select-none py-2 bg-transparent mix-blend-difference pointer-events-auto"
      >
        <div className="flex flex-col items-start group">
          {/* Milestone Nodes Track & Continuous Fill Line */}
          <div ref={listRef} className="relative py-1">
            {/* Background Static Hairline Track */}
            <div
              className="absolute left-2.5 -translate-x-1/2 w-[1.5px] bg-white/35 rounded-full z-0 pointer-events-none"
              style={{
                top: `${trackMetrics.top}px`,
                height: `${trackMetrics.height}px`,
              }}
            />

            {/* Dynamic Active Fill Track */}
            <div
              className="absolute left-2.5 -translate-x-1/2 w-[1.5px] bg-white rounded-full z-0 pointer-events-none transition-[height] duration-75 ease-out"
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

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center"
                  >
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      className="group/btn flex items-center gap-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded py-0.5"
                      aria-label={`Scroll to ${item.fullLabel}`}
                    >
                      {/* Node Bullet / Marker */}
                      <div
                        ref={(el) => {
                          dotRefs.current[idx] = el;
                        }}
                        className="relative flex items-center justify-center w-5 h-5 flex-shrink-0"
                      >
                        <div
                          className={`rounded-full transition-all duration-150 ease-out z-10 flex items-center justify-center ${
                            isActive
                              ? "w-3.5 h-3.5 bg-white ring-2 ring-white/55 scale-100"
                              : isPassed
                              ? "w-2.5 h-2.5 bg-white"
                              : "w-2.5 h-2.5 border border-white/75 bg-black group-hover/btn:border-white"
                          }`}
                        >
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black block" />
                          )}
                        </div>
                      </div>

                      {/* Number Tag */}
                      <span
                        className={`font-mono text-[11px] tabular-nums tracking-wider ${
                          isActive
                            ? "font-bold text-white"
                            : isPassed
                            ? "text-white/90 font-medium"
                            : "text-white/70"
                        }`}
                      >
                        {item.num}
                      </span>

                      {/* Compact Label */}
                      <span
                        className={`font-sans text-[11px] tracking-tight ${
                          isActive
                            ? "text-white font-semibold"
                            : isPassed
                            ? "text-white/90 font-medium"
                            : "text-white/70"
                        }`}
                      >
                        {item.shortLabel}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Mobile & Tablet Minimal Floating Status */}
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
          className="flex items-center gap-2 font-sans text-[11px] px-3 py-1.5 rounded-[4px] border border-[#EAEAEA] bg-white/95 text-[#111111] backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.08)] active:scale-95 transition-transform"
        >
          <span className="w-1.5 h-1.5 rounded-[1px] bg-[#346538] inline-block" />
          <span className="font-mono font-semibold text-[#111111]">
            {MILESTONES[currentIdx]?.num}
          </span>
          <span className="font-semibold text-[#111111]">
            {MILESTONES[currentIdx]?.shortLabel}
          </span>
          <span className="text-[#999999]">•</span>
          <span className="font-mono tabular-nums text-[#525252]">{percentage}%</span>
        </button>
      </aside>
    </>
  );
}
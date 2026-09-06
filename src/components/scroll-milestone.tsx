"use client";

import { useEffect, useState, useRef, useCallback } from "react";

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

          // 3. Compute absolute top position of each section.
          // Stack sections are sticky-pinned (md+) while the next section
          // overlaps them, so their bounding rects drift with scroll — anchor
          // via wrapper-relative stable tops instead (smooth progress).
          const stackWrap = document.getElementById("dossier-stack");
          const studioWrap = document.getElementById("workspace-stack");
          const dossierEl = document.getElementById("dossier");
          const workspaceEl = document.getElementById("workspace");
          const stableTop = (id: string): number | null => {
            if (id === "dossier" && stackWrap) return stackWrap.offsetTop;
            if (id === "principles" && stackWrap && dossierEl)
              return stackWrap.offsetTop + dossierEl.offsetHeight;
            if (id === "workspace" && studioWrap) return studioWrap.offsetTop;
            if (id === "experience" && studioWrap && workspaceEl)
              return studioWrap.offsetTop + workspaceEl.offsetHeight;
            return null;
          };
          const sectionTops: number[] = [];
          for (let i = 0; i < MILESTONES.length; i++) {
            const id = MILESTONES[i].id;
            const stable = stableTop(id);
            if (stable !== null) {
              sectionTops[i] = stable;
              continue;
            }
            const el = document.getElementById(id);
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

          // 3b. Lock CONNECT to the black 08/INITIATION container itself.
          // The footer content below the container is shorter than one viewport
          // on desktop, so the probe (scrollY + 85) can never reach the
          // container top before max-scroll. Detect container visibility
          // directly so 100% lands exactly on the container, not page bottom.
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
    const header = document.querySelector("header");
    const headerH = header ? header.getBoundingClientRect().height : 59;

    // Smooth-glide with guaranteed arrival: re-assert the destination until
    // reached, the user takes over (wheel / touch / key / pointer), or the
    // budget runs out. This heals glides that get aborted or clamped
    // mid-flight and would otherwise strand the user in the wrong section.
    const smoothTo = (target: number) => {
      const dest = Math.max(0, target);
      window.scrollTo({ top: dest, behavior: "smooth" });
      let tries = 0;
      let done = false;
      const cancel = () => {
        if (done) return;
        done = true;
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchmove", cancel);
        window.removeEventListener("keydown", cancel);
        window.removeEventListener("pointerdown", cancel);
      };
      window.addEventListener("wheel", cancel, { passive: true });
      window.addEventListener("touchmove", cancel, { passive: true });
      window.addEventListener("keydown", cancel);
      window.addEventListener("pointerdown", cancel);
      const tick = () => {
        if (done) return;
        tries += 1;
        if (Math.abs(window.scrollY - dest) <= 4 || tries > 20) {
          cancel();
          return;
        }
        window.scrollTo({ top: dest, behavior: "smooth" });
        window.setTimeout(tick, 350);
      };
      window.setTimeout(tick, 450);
    };

    if (id === "hero") {
      smoothTo(0);
      return;
    }
    if (id === "dossier" || id === "principles" || id === "workspace" || id === "experience") {
      // Stack sections are sticky-pinned (md+) while overlapping, so their
      // bounding rects drift — anchor via wrapper-relative stable tops
      // measured fresh at click time (never a cached range).
      const dWrap = document.getElementById("dossier-stack");
      const sWrap = document.getElementById("workspace-stack");
      let top: number | null = null;
      if (id === "dossier" && dWrap) top = dWrap.offsetTop;
      if (id === "principles" && dWrap) {
        const d = document.getElementById("dossier");
        if (d) top = dWrap.offsetTop + d.offsetHeight;
      }
      if (id === "workspace" && sWrap) top = sWrap.offsetTop;
      if (id === "experience" && sWrap) {
        const w = document.getElementById("workspace");
        if (w) top = sWrap.offsetTop + w.offsetHeight;
      }
      if (top === null) {
        top = (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY;
      }
      if (id === "principles" || id === "experience") {
        // These sections slide in horizontally (md+): landing on their natural
        // top would leave the card off-screen right (sweep start). Land one
        // viewport past the dock point instead, so the slide value is settled
        // at 0 on arrival. Mobile has no sweep: natural top as usual.
        const wide = window.matchMedia("(min-width: 768px)").matches;
        if (wide) {
          smoothTo(top - headerH + window.innerHeight + 1);
          return;
        }
      }
      smoothTo(top - headerH + 1);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      // Subtract header height minus 1px so the section's top border aligns flush beneath the navbar,
      // completely hiding the previous section above it.
      const elTop = el.getBoundingClientRect().top + window.scrollY - headerH + 1;
      smoothTo(elTop);
    }
  };

  const percentage = Math.round(milestoneProgress * 100);

  return (
    <>
      {/* 1. Desktop & Widescreen Milestone Rail (Native Real-Time Pixel-Level Difference Blending) */}
      <nav
        aria-label="Document Section Milestones"
        className="fixed left-4 2xl:left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-start select-none py-2 mix-blend-difference pointer-events-auto"
      >
        <div className="flex flex-col items-start group">
          {/* Top Rail Header */}
          <div className="flex items-center gap-2 pb-2 mb-3 font-mono text-[10px] uppercase tracking-wider text-white">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            <span className="font-semibold text-white">DOSSIER RAIL</span>
            <span className="text-white/40">•</span>
            <span className="tabular-nums text-[10px] font-mono text-white/70">
              {MILESTONES[currentIdx]?.num}/08
            </span>
          </div>

          {/* Milestone Nodes Track & Continuous Fill Line */}
          <div ref={listRef} className="relative py-1">
            {/* Background Static Hairline Track */}
            <div
              className="absolute left-2.5 -translate-x-1/2 w-[1.5px] bg-white/30 rounded-full z-0 pointer-events-none"
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
                              ? "w-3.5 h-3.5 bg-white ring-2 ring-white/50 scale-100 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                              : isPassed
                              ? "w-2.5 h-2.5 bg-white"
                              : "w-2.5 h-2.5 border border-white/40 bg-transparent group-hover/btn:border-white"
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
                            ? "text-white/85 font-medium"
                            : "text-white/50"
                        }`}
                      >
                        {item.num}
                      </span>

                      {/* Compact Label */}
                      <span
                        className={`font-mono text-[11px] tracking-tight ${
                          isActive
                            ? "text-white font-semibold"
                            : isPassed
                            ? "text-white/80"
                            : "text-white/45"
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

          {/* Bottom Live Digital Meter */}
          <div className="mt-3 pt-2 flex items-center gap-2 font-mono text-[10px] text-white">
            <span className="uppercase text-white/60">PROGRESS</span>
            <span className="font-semibold tabular-nums text-white">
              {percentage}%
            </span>
          </div>
        </div>
      </nav>

      {/* 2. Mobile & Tablet Minimal Floating Status */}
      <aside
        aria-label="Mobile reading progress"
        className="fixed bottom-4 left-4 z-40 xl:hidden select-none mix-blend-difference"
      >
        <button
          type="button"
          onClick={() => {
            const nextIdx = (currentIdx + 1) % MILESTONES.length;
            scrollTo(MILESTONES[nextIdx].id);
          }}
          className="flex items-center gap-2 font-mono text-[10px] px-3 py-1.5 rounded-full border border-white/40 text-white backdrop-blur-md active:scale-95 transition-transform"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="font-semibold text-white">
            {MILESTONES[currentIdx]?.num} {MILESTONES[currentIdx]?.shortLabel}
          </span>
          <span className="text-white/40">•</span>
          <span className="tabular-nums text-white/70">{percentage}%</span>
        </button>
      </aside>
    </>
  );
}
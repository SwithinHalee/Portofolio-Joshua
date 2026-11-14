"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Exponential damping constant (1/s): lower values feel heavier with longer inertia.
const WEIGHT_LAMBDA = 4.6;
// Scales raw wheel notches slightly down to convey physical scroll mass.
const WHEEL_MULTIPLIER = 0.84;
// Line-mode multiplier for wheel devices (e.g. Firefox discrete lines).
const LINE_PX = 32;
// Maximum frame delta (seconds) so tab switching never causes a scroll jump.
const MAX_DT = 0.05;
const SETTLE_THRESHOLD_PX = 0.75;

type ScrollTargetResolver = () => number;
type GuidedDriver = (resolveTarget: ScrollTargetResolver) => void;

let activeGuidedDriver: GuidedDriver | null = null;

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Navigates to a dynamic target Y through the active `WeightedScroll` physics loop so
 * section jumps carry the same takeoff resistance and exponential inertia as manual scroll.
 */
export function scrollWithWeight(resolveTarget: ScrollTargetResolver): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !activeGuidedDriver) {
    window.dispatchEvent(new Event("portfolio:programmatic-scroll"));
    window.scrollTo({ top: Math.max(0, resolveTarget()), behavior: "instant" });
    return;
  }
  activeGuidedDriver(resolveTarget);
}

function normalizeWheelDeltaY(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * LINE_PX;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  return e.deltaY;
}

function hasScrollableAncestor(target: EventTarget | null, deltaY: number): boolean {
  let node = target instanceof Element ? target : null;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      if (deltaY < 0 && node.scrollTop > 0) return true;
      if (deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1) {
        return true;
      }
    }
    node = node.parentElement;
  }
  return false;
}

function isBodyScrollLocked(): boolean {
  const docOverflow = window.getComputedStyle(document.documentElement).overflowY;
  const bodyOverflow = window.getComputedStyle(document.body).overflowY;
  return docOverflow === "hidden" || bodyOverflow === "hidden";
}

function getMaxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

/**
 * Adds damped inertial resistance to desktop wheel and trackpad scrolling, plus shared
 * guided section transitions via `scrollWithWeight`, while keeping native `position: sticky`,
 * `IntersectionObserver`, touch gestures, and keyboard scrolling untouched.
 */
export function WeightedScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/admin")) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) return;

    let rafId = 0;
    let lastTime = 0;
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let lastAppliedY = window.scrollY;
    let lastDocH = document.documentElement.scrollHeight;
    let isStepping = false;

    // Guided jump ramp state so section clicks overcome inertia before handing off to decay.
    let guided: {
      resolveTarget: ScrollTargetResolver;
      startY: number;
      startTime: number;
      rampMs: number;
    } | null = null;

    const stopLoop = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      lastTime = 0;
      guided = null;
    };

    const syncToNative = () => {
      stopLoop();
      currentY = window.scrollY;
      targetY = window.scrollY;
      lastAppliedY = window.scrollY;
      lastDocH = document.documentElement.scrollHeight;
    };

    const step = (now: number) => {
      if (reducedMotionQuery.matches || isBodyScrollLocked()) {
        syncToNative();
        return;
      }

      if (!lastTime) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, MAX_DT);
      lastTime = now;

      const maxScroll = getMaxScroll();
      if (guided) {
        if (!guided.startTime) guided.startTime = now;
        const elapsed = now - guided.startTime;
        const liveDest = Math.max(0, Math.min(guided.resolveTarget(), maxScroll));
        const u = Math.min(elapsed / guided.rampMs, 1);
        targetY = guided.startY + (liveDest - guided.startY) * easeInOutQuad(u);
      } else {
        targetY = Math.max(0, Math.min(targetY, maxScroll));
      }

      const diff = targetY - currentY;
      const rampActive = guided !== null && now - guided.startTime < guided.rampMs;
      if (!rampActive && Math.abs(diff) <= SETTLE_THRESHOLD_PX) {
        const finalY = guided
          ? Math.max(0, Math.min(Math.ceil(guided.resolveTarget()), maxScroll))
          : Math.round(targetY);
        isStepping = true;
        window.scrollTo({ top: finalY, behavior: "instant" });
        currentY = window.scrollY;
        targetY = currentY;
        lastAppliedY = currentY;
        lastDocH = document.documentElement.scrollHeight;
        isStepping = false;
        stopLoop();
        return;
      }

      const alpha = 1 - Math.exp(-WEIGHT_LAMBDA * dt);
      currentY += diff * alpha;

      isStepping = true;
      window.scrollTo({ top: currentY, behavior: "instant" });
      lastAppliedY = window.scrollY;
      lastDocH = document.documentElement.scrollHeight;
      isStepping = false;

      rafId = window.requestAnimationFrame(step);
    };

    const startGuided: GuidedDriver = (resolveTarget) => {
      if (reducedMotionQuery.matches || isBodyScrollLocked()) {
        window.scrollTo({ top: Math.max(0, resolveTarget()), behavior: "instant" });
        return;
      }
      if (rafId === 0) {
        currentY = window.scrollY;
      }
      const maxScroll = getMaxScroll();
      const dest = Math.max(0, Math.min(resolveTarget(), maxScroll));
      const distance = Math.abs(dest - currentY);
      if (distance <= 2) {
        syncToNative();
        window.scrollTo({ top: Math.round(dest), behavior: "instant" });
        return;
      }
      const rampMs = Math.min(460, Math.max(200, distance * 0.04));
      guided = {
        resolveTarget,
        startY: currentY,
        startTime: 0,
        rampMs,
      };
      targetY = currentY;
      if (!rafId) {
        lastTime = 0;
        rafId = window.requestAnimationFrame(step);
      }
    };
    activeGuidedDriver = startGuided;

    const onWheel = (e: WheelEvent) => {
      if (reducedMotionQuery.matches) return;
      // Preserve browser pinch-zoom, horizontal trackpad swipes, and open modal locks.
      if (e.ctrlKey || e.metaKey || isBodyScrollLocked()) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const deltaPx = normalizeWheelDeltaY(e);
      if (deltaPx === 0) return;
      if (hasScrollableAncestor(e.target, deltaPx)) return;

      const maxScroll = getMaxScroll();
      if (maxScroll <= 0) return;

      // User wheel input overrides any in-flight sidepanel transition smoothly.
      if (guided) {
        guided = null;
        targetY = currentY;
      }

      // Do not trap wheel input when already settled at the document boundary.
      if (rafId === 0) {
        currentY = window.scrollY;
        targetY = currentY;
      }
      if (
        (currentY <= 0.5 && deltaPx < 0) ||
        (currentY >= maxScroll - 0.5 && deltaPx > 0)
      ) {
        return;
      }

      e.preventDefault();
      targetY = Math.max(0, Math.min(targetY + deltaPx * WHEEL_MULTIPLIER, maxScroll));

      if (!rafId) {
        lastTime = 0;
        rafId = window.requestAnimationFrame(step);
      }
    };

    const onScroll = () => {
      if (isStepping) return;
      const docH = document.documentElement.scrollHeight;
      if (rafId !== 0) {
        const drift = window.scrollY - lastAppliedY;
        if (Math.abs(drift) > 6) {
          const docDelta = Math.abs(docH - lastDocH);
          // Absorb browser scroll anchoring when layout heights shift mid-glide,
          // otherwise yield cleanly to true external jumps (scrollbar drag, Find-in-page).
          if (Math.abs(drift) <= docDelta + 24) {
            currentY = window.scrollY;
            lastAppliedY = window.scrollY;
            lastDocH = docH;
            if (guided) {
              guided.startY = window.scrollY;
              guided.startTime = 0;
            } else {
              targetY = Math.max(0, Math.min(targetY + drift, getMaxScroll()));
            }
          } else {
            syncToNative();
          }
        }
      } else {
        currentY = window.scrollY;
        targetY = window.scrollY;
        lastAppliedY = window.scrollY;
        lastDocH = docH;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) {
        if (rafId !== 0) syncToNative();
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      const onScrollbar =
        e.clientX >= document.documentElement.clientWidth ||
        e.clientY >= document.documentElement.clientHeight;
      if ((e.button === 1 || onScrollbar) && rafId !== 0) syncToNative();
    };

    const onMotionPrefChange = () => {
      if (reducedMotionQuery.matches) syncToNative();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("touchstart", syncToNative, { passive: true });
    window.addEventListener("portfolio:programmatic-scroll", syncToNative);
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", onMotionPrefChange);
    }

    return () => {
      if (activeGuidedDriver === startGuided) activeGuidedDriver = null;
      stopLoop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("touchstart", syncToNative);
      window.removeEventListener("portfolio:programmatic-scroll", syncToNative);
      if (typeof reducedMotionQuery.removeEventListener === "function") {
        reducedMotionQuery.removeEventListener("change", onMotionPrefChange);
      }
    };
  }, [pathname]);

  return null;
}

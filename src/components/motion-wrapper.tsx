"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, RefObject, useEffect, useState } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  yOffset = 14,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  xOffset = 0,
  yOffset = 12,
}: {
  children: ReactNode;
  className?: string;
  xOffset?: number;
  yOffset?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: xOffset, y: yOffset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Shared sweep ranges, written by useStackSlide and read by rail/scroll
 * navigation. Landing on a shared range guarantees the slide value is
 * exactly clamped to 0, even if layout shifted after measuring (font
 * swap, expand/collapse), because the same numbers drive both the sweep
 * and the landing target.
 */
const stackRanges = new Map<string, [number, number]>();

export function getStackRange(stackId: string): [number, number] | undefined {
  return stackRanges.get(stackId);
}

/**
 * Scroll-linked horizontal slide for stacking sections (md+ only).
 * The sliding section (2nd child of the stack wrapper) travels from
 * 100vw (fully off-screen right, invisible while rising into place) to
 * 0vw across exactly one viewport of scrolling after it docks, clamped
 * on both ends. All geometry is measured live so it stays exact across
 * breakpoints, font loading, and resize. Returns a MotionValue `x` plus
 * a `wide` flag; apply `style={wide ? { x } : undefined}` so mobile
 * keeps normal vertical flow.
 */
/**
 * Keeps a tall sticky section (`#dossier`, `#workspace`) pinned with its
 * bottom edge flush against the viewport bottom once scrolled through,
 * while never pinning lower than right beneath the fixed navbar on ultra-tall screens.
 */
export function useStickyBottomPin(
  ref: RefObject<HTMLElement | null>,
  triggerKey?: unknown
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      if (!mq.matches) {
        el.style.top = "";
        return;
      }
      const h = Math.floor(el.getBoundingClientRect().height);
      const header = document.querySelector<HTMLElement>("header[data-navbar-header]");
      const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
      const pinTop = Math.min(headerH, window.innerHeight - h + 2);
      el.style.top = `${pinTop}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply);
    window.addEventListener("load", apply);
    window.addEventListener("portfolio:hydrated", apply);
    if (document.fonts) {
      document.fonts.ready.then(apply).catch(() => {});
    }
    const t = window.setTimeout(apply, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      window.removeEventListener("load", apply);
      window.removeEventListener("portfolio:hydrated", apply);
      window.clearTimeout(t);
    };
  }, [ref, triggerKey]);
}

export function useStackSlide(stackId: string) {
  const { scrollY } = useScroll();
  const [range, setRange] = useState<[number, number]>([
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  ]);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    let ro: ResizeObserver | null = null;
    let rafId = 0;

    const detachObservers = () => {
      ro?.disconnect();
      ro = null;
      window.removeEventListener("resize", compute);
      window.removeEventListener("load", compute);
      window.removeEventListener("portfolio:hydrated", scheduleCompute);
    };

    const compute = () => {
      setWide(mq.matches);
      if (!mq.matches) return;
      const wrap = document.getElementById(stackId);
      if (!wrap) return;
      const pinned = wrap.querySelector(":scope > section:first-child") as HTMLElement | null;
      if (!pinned) return;
      const vh = window.innerHeight;
      const header = document.querySelector<HTMLElement>("header[data-navbar-header]");
      const headerH = header ? header.getBoundingClientRect().height : 0;
      // Scroll position where the sliding section finishes docking cleanly
      // at the viewport top; the horizontal sweep runs for one viewport after.
      const dockY = wrap.offsetTop + pinned.offsetHeight - headerH;
      const computed: [number, number] = [dockY, dockY + vh];
      stackRanges.set(stackId, computed);
      setRange((prev) =>
        prev[0] === computed[0] && prev[1] === computed[1] ? prev : computed
      );
    };

    const scheduleCompute = () => {
      if (!mq.matches) return;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        compute();
      });
    };

    const attachObservers = () => {
      if (ro) return;
      ro = new ResizeObserver(compute);
      ro.observe(document.body);
      const wrap = document.getElementById(stackId);
      if (wrap) ro.observe(wrap);
      const pinned = wrap?.querySelector(":scope > section:first-child");
      if (pinned) ro.observe(pinned);
      const header = document.querySelector("header");
      if (header) ro.observe(header);

      window.addEventListener("resize", compute);
      window.addEventListener("load", compute);
      window.addEventListener("portfolio:hydrated", scheduleCompute);
    };

    const syncBreakpoint = () => {
      if (mq.matches) {
        compute();
        attachObservers();
      } else {
        setWide(false);
        detachObservers();
      }
    };

    syncBreakpoint();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", syncBreakpoint);
    }
    if (document.fonts && mq.matches) {
      document.fonts.ready.then(compute).catch(() => {});
    }
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      detachObservers();
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", syncBreakpoint);
      }
    };
  }, [stackId]);

  const x = useTransform(scrollY, [range[0], range[1]], ["100vw", "0vw"]);
  return { x, wide };
}
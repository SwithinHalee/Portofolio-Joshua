"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

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
 * exactly clamped to 0 — even if layout shifted after measuring (font
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
 * a `wide` flag — apply `style={wide ? { x } : undefined}` so mobile
 * keeps normal vertical flow.
 */
export function useStackSlide(stackId: string) {
  const { scrollY } = useScroll();
  const [range, setRange] = useState<[number, number]>([
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  ]);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const compute = () => {
      setWide(mq.matches);
      const wrap = document.getElementById(stackId);
      if (!wrap) return;
      const pinned = wrap.querySelector(":scope > section:first-child") as HTMLElement | null;
      if (!pinned) return;
      const vh = window.innerHeight;
      const header = document.querySelector("header");
      const headerH = header ? header.getBoundingClientRect().height : 59;
      // Scroll position where the sliding section finishes docking flush
      // beneath the navbar (its sticky top) — the horizontal sweep runs
      // for exactly one viewport after this point.
      const dockY = wrap.offsetTop + pinned.offsetHeight - headerH;
      const computed: [number, number] = [dockY, dockY + vh];
      stackRanges.set(stackId, computed);
      setRange(computed);
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("load", compute);
    window.addEventListener("portfolio:hydrated", compute);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", compute);
    }
    if (document.fonts) {
      document.fonts.ready.then(compute).catch(() => {});
    }
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("load", compute);
      window.removeEventListener("portfolio:hydrated", compute);
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", compute);
      }
    };
  }, [stackId]);

  const x = useTransform(scrollY, [range[0], range[1]], ["100vw", "0vw"]);
  return { x, wide };
}
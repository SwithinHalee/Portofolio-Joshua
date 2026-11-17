"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { PERSONAL_INFO } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";

export type SplashStage = "hold" | "compress" | "expand" | "reveal" | "handoff" | "done";

interface SplashContextValue {
  stage: SplashStage;
  isBrandVisible: boolean;
  isChromeVisible: boolean;
}

const SplashContext = createContext<SplashContextValue>({
  stage: "done",
  isBrandVisible: true,
  isChromeVisible: true,
});

export function useSplash() {
  return useContext(SplashContext);
}

interface FlightCoords {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  targetScale: number;
  brandFontPx: number;
  nativeFirstRestWidth: number;
  nativeWordSpaceWidth: number;
  nativeSecondRestWidth: number;
}

const MONOGRAM_FONT_PX = 56;
const MONOGRAM_LINE_HEIGHT = 1.15;
const FEATHER_MASK =
  "linear-gradient(to right, #000 0%, #000 50%, transparent 66%, transparent 100%)";
// Weighted ease-in-out curve so the ~2s transition glides visibly instead of finishing early.
const EASE_GLIDE: [number, number, number, number] = [0.45, 0.02, 0.16, 1];
const EASE_UNFOLD: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Split full name into primary monogram halves ("Joshua" / "Abdiel"). */
function splitMonogramParts(fullName: string): {
  firstInitial: string;
  firstRest: string;
  wordSpace: string;
  secondInitial: string;
  secondRest: string;
} {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const first = words[0] ?? "Joshua";
  const second = words.slice(1).join(" ");

  if (!second) {
    return {
      firstInitial: first.slice(0, 1) || "J",
      firstRest: first.slice(1),
      wordSpace: "",
      secondInitial: "",
      secondRest: "",
    };
  }

  return {
    firstInitial: first.slice(0, 1) || "J",
    firstRest: first.slice(1),
    wordSpace: " ",
    secondInitial: second.slice(0, 1) || "A",
    secondRest: second.slice(1),
  };
}

export function SplashProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data } = usePortfolio();
  const fullName = data.personalInfo?.name || PERSONAL_INFO.name;
  const parts = useMemo(() => splitMonogramParts(fullName), [fullName]);

  const [stage, setStage] = useState<SplashStage>(() => {
    if (pathname?.startsWith("/admin")) return "done";
    return "hold";
  });
  const [coords, setCoords] = useState<FlightCoords | null>(null);
  const centeredMonoRef = useRef<HTMLDivElement | null>(null);
  const fullNameMeasureRef = useRef<HTMLSpanElement | null>(null);
  const fullFirstMeasureRef = useRef<HTMLSpanElement | null>(null);
  const fullSecondMeasureRef = useRef<HTMLSpanElement | null>(null);
  const initFirstMeasureRef = useRef<HTMLSpanElement | null>(null);
  const initSecondMeasureRef = useRef<HTMLSpanElement | null>(null);
  const firstMeasureRef = useRef<HTMLSpanElement | null>(null);
  const spaceMeasureRef = useRef<HTMLSpanElement | null>(null);
  const secondMeasureRef = useRef<HTMLSpanElement | null>(null);
  const expandStartedRef = useRef(false);
  const revealTimerRef = useRef<number | null>(null);
  const doneTimerRef = useRef<number | null>(null);

  // Release the pre-hydration veil synchronously as React's identical JA frame takes over.
  useLayoutEffect(() => {
    document.documentElement.classList.remove("splash-pending");
  }, []);

  const isDone = stage === "done";

  const startExpand = useCallback(() => {
    if (expandStartedRef.current) return;
    expandStartedRef.current = true;

    const brandEl = document.querySelector<HTMLElement>("[data-navbar-brand]");
    const brandRect = brandEl?.getBoundingClientRect();
    const fullBrandW =
      brandRect && brandRect.width > 0
        ? brandRect.width
        : fullNameMeasureRef.current?.getBoundingClientRect().width ?? 0;
    const fullFirstW = fullFirstMeasureRef.current?.getBoundingClientRect().width ?? 0;
    const fullSecondW = fullSecondMeasureRef.current?.getBoundingClientRect().width ?? 0;
    const initFirstW = initFirstMeasureRef.current?.getBoundingClientRect().width ?? 0;
    const initSecondW = initSecondMeasureRef.current?.getBoundingClientRect().width ?? 0;

    const fallbackFirst = firstMeasureRef.current?.getBoundingClientRect().width;
    const fallbackSpace = spaceMeasureRef.current?.getBoundingClientRect().width;
    const fallbackSecond = secondMeasureRef.current?.getBoundingClientRect().width;

    // Measure character slices directly inside the unbroken text node so J, A, and right edge
    // land at exact pixel offsets of the stationary navbar brand (0px kerning/tracking drift).
    let calibratedFirst = fullFirstW > initFirstW ? fullFirstW - initFirstW : fallbackFirst;
    let calibratedSecond = fullSecondW > initSecondW ? fullSecondW - initSecondW : fallbackSecond;
    let calibratedSpace =
      fullBrandW > 0 && fullFirstW > 0 && fullSecondW > 0
        ? Math.max(2, fullBrandW - fullFirstW - fullSecondW)
        : fallbackSpace;

    const rangeHost =
      brandEl?.firstChild?.nodeType === Node.TEXT_NODE
        ? brandEl
        : fullNameMeasureRef.current;
    const rangeTextNode = rangeHost?.firstChild;
    if (
      rangeTextNode &&
      rangeTextNode.nodeType === Node.TEXT_NODE &&
      typeof document.createRange === "function" &&
      parts.secondInitial
    ) {
      const fullStr = rangeTextNode.textContent ?? "";
      const firstWordLen = parts.firstInitial.length + parts.firstRest.length;
      const secondInitStart = firstWordLen + parts.wordSpace.length;
      if (secondInitStart + parts.secondInitial.length <= fullStr.length) {
        const rFull = document.createRange();
        rFull.setStart(rangeTextNode, 0);
        rFull.setEnd(rangeTextNode, fullStr.length);
        const fullRangeRect = rFull.getBoundingClientRect();

        const rFirstWord = document.createRange();
        rFirstWord.setStart(rangeTextNode, 0);
        rFirstWord.setEnd(rangeTextNode, firstWordLen);
        const firstWordRect = rFirstWord.getBoundingClientRect();

        const rSecondInit = document.createRange();
        rSecondInit.setStart(rangeTextNode, secondInitStart);
        rSecondInit.setEnd(rangeTextNode, secondInitStart + parts.secondInitial.length);
        const secondInitRect = rSecondInit.getBoundingClientRect();

        const rangeFirst = firstWordRect.right - fullRangeRect.left - initFirstW;
        const rangeSpace = secondInitRect.left - firstWordRect.right;
        const rangeSecond = fullRangeRect.right - secondInitRect.left - initSecondW;

        if (rangeFirst > 0 && rangeSpace > 0 && rangeSecond >= 0) {
          calibratedFirst = rangeFirst;
          calibratedSpace = rangeSpace;
          calibratedSecond = rangeSecond;
        }
      }
    }

    setCoords((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        targetX: brandRect && brandRect.width > 0 ? brandRect.left : prev.targetX,
        targetY: brandRect && brandRect.height > 0 ? brandRect.top : prev.targetY,
        nativeFirstRestWidth:
          calibratedFirst && calibratedFirst > 0 ? calibratedFirst : prev.nativeFirstRestWidth,
        nativeWordSpaceWidth:
          calibratedSpace && calibratedSpace > 0 ? calibratedSpace : prev.nativeWordSpaceWidth,
        nativeSecondRestWidth:
          calibratedSecond && calibratedSecond > 0
            ? calibratedSecond
            : prev.nativeSecondRestWidth,
      };
    });
    setStage("expand");

    revealTimerRef.current = window.setTimeout(() => {
      setStage("reveal");
    }, 660);

    doneTimerRef.current = window.setTimeout(() => {
      setStage("done");
    }, 1140);
  }, [parts]);

  useEffect(() => {
    if (isDone) return;

    expandStartedRef.current = false;

    // Timeline (~2.14s transition after 400ms hold):
    // 400ms..~1420ms (compress): JA glides smoothly on solid #FFFFFF until 100% settled at target.
    // onAnimationComplete (expand): Monogram unfolds at exact native brandFontPx with kerning-matched widths.
    // +660ms (reveal): Solid white surface dissolves; feather mask drops cleanly for crisp handoff.
    // +1140ms (done): Atomic swap to identical fixed Navbar brand.
    const compressTimer = window.setTimeout(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const brandEl = document.querySelector<HTMLElement>("[data-navbar-brand]");

      const brandRect = brandEl?.getBoundingClientRect();
      const brandFontPx = brandEl
        ? parseFloat(window.getComputedStyle(brandEl).fontSize) || 19
        : 19;
      const targetScale = brandFontPx / MONOGRAM_FONT_PX;
      const monoRect = centeredMonoRef.current?.getBoundingClientRect();

      const fallbackLeft = vw >= 1536 ? 32 : vw >= 1280 ? 16 : vw >= 640 ? 24 : 16;
      const fallbackTop = vw >= 1280 ? 24 : vw >= 640 ? 20 : 16;
      const startX = monoRect && monoRect.width > 0 ? monoRect.left : Math.round((vw - 64) / 2);
      const startY =
        monoRect && monoRect.height > 0
          ? monoRect.top
          : Math.round((vh - MONOGRAM_FONT_PX * MONOGRAM_LINE_HEIGHT) / 2);

      setCoords({
        startX,
        startY,
        targetX: brandRect && brandRect.width > 0 ? brandRect.left : fallbackLeft,
        targetY: brandRect && brandRect.height > 0 ? brandRect.top : fallbackTop,
        targetScale,
        brandFontPx,
        nativeFirstRestWidth: 62,
        nativeWordSpaceWidth: 5,
        nativeSecondRestWidth: 48,
      });
      setStage("compress");
    }, 400);

    // Safety fallback if background throttling skips onAnimationComplete after compress duration.
    const expandFallbackTimer = window.setTimeout(startExpand, 1750);

    return () => {
      window.clearTimeout(compressTimer);
      window.clearTimeout(expandFallbackTimer);
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      if (doneTimerRef.current !== null) {
        window.clearTimeout(doneTimerRef.current);
        doneTimerRef.current = null;
      }
    };
  }, [isDone, startExpand]);

  const contextValue = useMemo<SplashContextValue>(
    () => ({
      stage,
      isBrandVisible: stage === "done",
      isChromeVisible: stage === "reveal" || stage === "done",
    }),
    [stage]
  );

  const isRevealing = stage === "reveal" || stage === "done";
  const isExpanding = stage === "expand" || stage === "reveal" || stage === "done";

  return (
    <SplashContext.Provider value={contextValue}>
      {children}

      {stage !== "done" && (
        <>
          {/* Hidden exact-size ruler measured at native brandFontPx for 0px width/kerning diff */}
          {coords && (
            <div
              aria-hidden="true"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                visibility: "hidden",
                pointerEvents: "none",
                fontSize: `${coords.brandFontPx}px`,
                lineHeight: MONOGRAM_LINE_HEIGHT,
                letterSpacing: "-0.025em",
              }}
              className="flex flex-col items-start whitespace-pre font-sans font-medium"
            >
              <span ref={fullNameMeasureRef}>{fullName}</span>
              <span ref={fullFirstMeasureRef}>{parts.firstInitial + parts.firstRest}</span>
              <span ref={fullSecondMeasureRef}>{parts.secondInitial + parts.secondRest}</span>
              <span ref={initFirstMeasureRef}>{parts.firstInitial}</span>
              <span ref={initSecondMeasureRef}>{parts.secondInitial}</span>
              <div className="inline-flex items-center">
                <span>{parts.firstInitial}</span>
                <span ref={firstMeasureRef}>{parts.firstRest}</span>
                <span ref={spaceMeasureRef}>{parts.wordSpace}</span>
                <span>{parts.secondInitial}</span>
                <span ref={secondMeasureRef}>{parts.secondRest}</span>
              </div>
            </div>
          )}

          {/* Full-screen white splash canvas: stays 100% solid white during flight & expand,
              then dissolves cleanly at reveal once Joshua Abdiel is settled at top-left */}
          <motion.div
            data-splash-surface
            aria-hidden="true"
            initial={{ opacity: 1 }}
            animate={{ opacity: isRevealing ? 0 : 1 }}
            transition={{
              opacity: { duration: 0.48, ease: EASE_UNFOLD },
            }}
            className="fixed inset-0 z-[90] bg-[#FFFFFF] pointer-events-none"
          />

          {/* Stage 1 (Hold): Centered minimalist JA monogram matching pre-hydration ::after */}
          {stage === "hold" && (
            <div
              aria-hidden="true"
              className="fixed inset-0 z-[92] flex items-center justify-center pointer-events-none bg-transparent mix-blend-difference antialiased"
            >
              <div
                ref={centeredMonoRef}
                data-splash-monogram
                style={{
                  fontSize: `${MONOGRAM_FONT_PX}px`,
                  lineHeight: MONOGRAM_LINE_HEIGHT,
                  letterSpacing: "-0.025em",
                }}
                className="inline-flex items-center whitespace-pre font-sans font-medium text-[#FFFFFF]"
              >
                <span>{parts.firstInitial}</span>
                {parts.secondInitial && <span>{parts.secondInitial}</span>}
              </div>
            </div>
          )}

          {/* Stage 2 (Compress): JA glides across solid white from center to exact top-left target */}
          {stage === "compress" && coords && (
            <motion.div
              aria-hidden="true"
              data-splash-monogram
              initial={{
                x: coords.startX,
                y: coords.startY,
                scale: 1,
              }}
              animate={{
                x: coords.targetX,
                y: coords.targetY,
                scale: coords.targetScale,
              }}
              transition={{
                x: { duration: 1.0, ease: EASE_GLIDE },
                y: { duration: 1.0, ease: EASE_GLIDE },
                scale: { duration: 1.0, ease: EASE_GLIDE },
              }}
              onAnimationComplete={startExpand}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 92,
                transformOrigin: "top left",
                fontSize: `${MONOGRAM_FONT_PX}px`,
                lineHeight: MONOGRAM_LINE_HEIGHT,
                height: `${MONOGRAM_FONT_PX * MONOGRAM_LINE_HEIGHT}px`,
                letterSpacing: "-0.025em",
              }}
              className="pointer-events-none inline-flex items-center whitespace-pre font-sans font-medium bg-transparent mix-blend-difference antialiased text-[#FFFFFF]"
            >
              <span className="inline-flex shrink-0 items-center h-full">{parts.firstInitial}</span>
              {parts.secondInitial && (
                <span className="inline-flex shrink-0 items-center h-full">
                  {parts.secondInitial}
                </span>
              )}
            </motion.div>
          )}

          {/* Stages 3-4 (Expand & Reveal): matches Navbar's mix-blend-difference + antialiased layer
              so glyphs invert pixel-by-pixel during reveal with zero stroke/weight shift at handoff */}
          {isExpanding && coords && (
            <div
              aria-hidden="true"
              data-splash-monogram
              style={{
                position: "fixed",
                top: coords.targetY,
                left: coords.targetX,
                zIndex: 92,
                fontSize: `${coords.brandFontPx}px`,
                lineHeight: MONOGRAM_LINE_HEIGHT,
                letterSpacing: "-0.025em",
              }}
              className="pointer-events-none inline-flex items-center whitespace-pre font-sans font-medium bg-transparent mix-blend-difference antialiased text-[#FFFFFF]"
            >
              <span className="inline-flex shrink-0 items-center">{parts.firstInitial}</span>
              {parts.firstRest && (
                <motion.span
                  initial={{ width: 0, opacity: 0, maskPosition: "100% 0%" }}
                  animate={{
                    width: coords.nativeFirstRestWidth,
                    opacity: 1,
                    maskPosition: "0% 0%",
                  }}
                  transition={{
                    width: { duration: 0.6, ease: EASE_UNFOLD },
                    maskPosition: { duration: 0.62, ease: EASE_UNFOLD },
                    opacity: { duration: 0.2, delay: 0, ease: "easeOut" },
                  }}
                  style={
                    isRevealing
                      ? undefined
                      : {
                          maskImage: FEATHER_MASK,
                          WebkitMaskImage: FEATHER_MASK,
                          maskSize: "300% 100%",
                          WebkitMaskSize: "300% 100%",
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                        }
                  }
                  className="inline-flex shrink-0 items-center overflow-hidden whitespace-pre"
                >
                  {parts.firstRest}
                </motion.span>
              )}
              {parts.wordSpace && (
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: coords.nativeWordSpaceWidth }}
                  transition={{
                    width: { duration: 0.32, ease: EASE_UNFOLD },
                  }}
                  className="inline-flex shrink-0 items-center overflow-hidden whitespace-pre"
                >
                  {parts.wordSpace}
                </motion.span>
              )}
              {parts.secondInitial && (
                <span className="inline-flex shrink-0 items-center">{parts.secondInitial}</span>
              )}
              {parts.secondRest && (
                <motion.span
                  initial={{ width: 0, opacity: 0, maskPosition: "100% 0%" }}
                  animate={{
                    width: coords.nativeSecondRestWidth,
                    opacity: 1,
                    maskPosition: "0% 0%",
                  }}
                  transition={{
                    width: { duration: 0.6, delay: 0.04, ease: EASE_UNFOLD },
                    maskPosition: { duration: 0.62, delay: 0.04, ease: EASE_UNFOLD },
                    opacity: { duration: 0.2, delay: 0.04, ease: "easeOut" },
                  }}
                  style={
                    isRevealing
                      ? undefined
                      : {
                          maskImage: FEATHER_MASK,
                          WebkitMaskImage: FEATHER_MASK,
                          maskSize: "300% 100%",
                          WebkitMaskSize: "300% 100%",
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                        }
                  }
                  className="inline-flex shrink-0 items-center overflow-hidden whitespace-pre"
                >
                  {parts.secondRest}
                </motion.span>
              )}
            </div>
          )}
        </>
      )}
    </SplashContext.Provider>
  );
}

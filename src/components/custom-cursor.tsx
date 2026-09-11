"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type CursorVariant = "default" | "hover" | "label" | "hidden";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="link"], label, summary, details, [data-cursor]';
const TEXT_ENTRY_SELECTOR =
  'input, textarea, select, [contenteditable="true"], [contenteditable=""]';
const LABEL_SELECTOR = "[data-cursor-label]";

interface PointerCapability {
  capable: boolean;
  reducedMotion: boolean;
}

interface CustomCursorDebugInfo extends PointerCapability {
  pointerFine: boolean;
  mouseSeen: boolean;
  variant: CursorVariant;
  label: string;
  visible: boolean;
  pressed: boolean;
  autoScroll: boolean;
  classApplied: boolean;
}

declare global {
  interface Window {
    __customCursor?: () => CustomCursorDebugInfo;
  }
}

const SERVER_POINTER_CAPABILITY: PointerCapability = {
  capable: false,
  reducedMotion: false,
};

let pointerListeners: Set<() => void> | null = null;
let pointerSnapshot: PointerCapability | null = null;
let mouseSeen = false;
let globalPointerListenerAttached = false;

function readPointerCapability(): PointerCapability {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // A physically connected mouse/pen enables the cursor even when the OS
  // reports a coarse primary pointer (common on touchscreen laptops).
  return { capable: finePointer || mouseSeen, reducedMotion };
}

function getPointerSnapshot(): PointerCapability {
  const next = readPointerCapability();
  if (
    !pointerSnapshot ||
    pointerSnapshot.capable !== next.capable ||
    pointerSnapshot.reducedMotion !== next.reducedMotion
  ) {
    pointerSnapshot = next;
  }
  return pointerSnapshot;
}

function getServerPointerSnapshot(): PointerCapability {
  return SERVER_POINTER_CAPABILITY;
}

function emitPointerChange(): void {
  if (pointerListeners) {
    pointerListeners.forEach((listener) => listener());
  }
}

function handleGlobalPointer(e: PointerEvent): void {
  if (!mouseSeen && (e.pointerType === "mouse" || e.pointerType === "pen")) {
    mouseSeen = true;
    emitPointerChange();
  }
}

function subscribePointerStore(onChange: () => void): () => void {
  if (!pointerListeners) pointerListeners = new Set();
  pointerListeners.add(onChange);

  if (!globalPointerListenerAttached) {
    globalPointerListenerAttached = true;
    window.addEventListener("pointermove", handleGlobalPointer, { passive: true });
    window.addEventListener("pointerdown", handleGlobalPointer, { passive: true });
  }

  const fineQuery = window.matchMedia("(pointer: fine)");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  fineQuery.addEventListener("change", onChange);
  motionQuery.addEventListener("change", onChange);

  return () => {
    pointerListeners?.delete(onChange);
    fineQuery.removeEventListener("change", onChange);
    motionQuery.removeEventListener("change", onChange);
  };
}

function resolveVariant(target: EventTarget | null): {
  variant: CursorVariant;
  label: string;
} {
  if (!(target instanceof Element)) return { variant: "default", label: "" };
  if (target.closest(TEXT_ENTRY_SELECTOR)) return { variant: "hidden", label: "" };
  const labelled = target.closest(LABEL_SELECTOR);
  if (labelled instanceof HTMLElement) {
    return {
      variant: "label",
      label: (labelled.dataset.cursorLabel ?? "").trim().slice(0, 12),
    };
  }
  if (target.closest(INTERACTIVE_SELECTOR)) return { variant: "hover", label: "" };
  return { variant: "default", label: "" };
}

export function CustomCursor() {
  const pointer = useSyncExternalStore(
    subscribePointerStore,
    getPointerSnapshot,
    getServerPointerSnapshot
  );
  const enabled = pointer.capable;

  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ variant: "default" as CursorVariant, label: "" });
  const visibleRef = useRef(false);
  const pressedRef = useRef(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const autoScrollRef = useRef(false);
  const suppressAuxRef = useRef(false);
  const autoRef = useRef<{ anchorX: number; anchorY: number; x: number; y: number } | null>(null);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const burstIdRef = useRef(0);
  const burstTimersRef = useRef<number[]>([]);

  useEffect(() => {
    // Fullscreen content renders in the browser top layer, above the fixed
    // custom cursor. Restore the native pointer while any element is
    // fullscreen so the user never ends up with no visible cursor.
    const handleFs = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (fs) {
        document.documentElement.classList.remove("custom-cursor-enabled");
      } else if (enabled) {
        document.documentElement.classList.add("custom-cursor-enabled");
      }
    };
    handleFs();
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    if (!document.fullscreenElement) {
      document.documentElement.classList.add("custom-cursor-enabled");
    }

    const place = (x: number, y: number) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const setVisibility = (value: boolean) => {
      visibleRef.current = value;
      setVisible(value);
    };

    const handleMove = (e: MouseEvent) => {
      place(e.clientX, e.clientY);
      setVisibility(true);
      if (autoRef.current) {
        autoRef.current.x = e.clientX;
        autoRef.current.y = e.clientY;
      }
    };

    const handleOver = (e: MouseEvent) => {
      const next = resolveVariant(e.target);
      const prev = stateRef.current;
      if (next.variant !== prev.variant || next.label !== prev.label) {
        stateRef.current = next;
        setVariant(next.variant);
        setLabel(next.label);
      }
    };

    let scrollRaf = 0;
    const stopAuto = () => {
      autoRef.current = null;
      if (autoScrollRef.current) {
        autoScrollRef.current = false;
        setAutoScroll(false);
      }
      cancelAnimationFrame(scrollRaf);
    };
    const autoStep = () => {
      const anchor = autoRef.current;
      if (!anchor) return;
      const DEADZONE = 5;
      const FACTOR = 0.4;
      const MAX_STEP = 48;
      const axis = (delta: number) => {
        const abs = Math.abs(delta);
        if (abs <= DEADZONE) return 0;
        return Math.sign(delta) * Math.min(MAX_STEP, (abs - DEADZONE) * FACTOR);
      };
      const sx = axis(anchor.x - anchor.anchorX);
      const sy = axis(anchor.y - anchor.anchorY);
      if (sx !== 0 || sy !== 0) window.scrollBy(sx, sy);
      scrollRaf = requestAnimationFrame(autoStep);
    };
    const startAuto = (x: number, y: number) => {
      autoRef.current = { anchorX: x, anchorY: y, x, y };
      autoScrollRef.current = true;
      setAutoScroll(true);
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(autoStep);
    };

    const handleDown = (e: MouseEvent) => {
      place(e.clientX, e.clientY);
      pressedRef.current = true;
      setPressed(true);
      setVisibility(true);
      if (e.button === 1) {
        // Middle click is a TOGGLE for autoscroll (not press-and-hold).
        // First click turns it on, second click (anywhere) turns it off.
        if (autoRef.current) {
          e.preventDefault();
          suppressAuxRef.current = true;
          stopAuto();
          return;
        }
        // Not autoscrolling: try to toggle ON. Links are excluded so
        // new-tab opening keeps working untouched.
        suppressAuxRef.current = false;
        const onLink =
          e.target instanceof Element && e.target.closest("a[href]") !== null;
        if (
          !onLink &&
          document.documentElement.scrollHeight > window.innerHeight + 1
        ) {
          e.preventDefault();
          startAuto(e.clientX, e.clientY);
        }
      } else {
        // Any other button press terminates autoscroll, mirroring the browser.
        stopAuto();
        if (e.button === 0) {
          burstIdRef.current += 1;
          const burst = { id: burstIdRef.current, x: e.clientX, y: e.clientY };
          setBursts((prev) => [...prev.slice(-7), burst]);
          const timer = window.setTimeout(() => {
            setBursts((prev) => prev.filter((b) => b.id !== burst.id));
          }, 500);
          burstTimersRef.current.push(timer);
        }
      }
    };
    const handleUp = () => {
      pressedRef.current = false;
      setPressed(false);
      // Toggle mode: deliberately keep autoscroll running after the
      // middle button is released. It only stops on the next
      // middle-click, another button press, wheel, key, or blur.
    };
    const handleAux = (e: MouseEvent) => {
      // Swallow the auxclick that follows a toggle-OFF middle-click so
      // stopping autoscroll over a link never opens a new tab.
      if (e.button === 1 && suppressAuxRef.current) {
        e.preventDefault();
        e.stopPropagation();
        suppressAuxRef.current = false;
      }
    };
    const handleWheel = () => {
      stopAuto();
    };
    const handleKey = () => {
      stopAuto();
    };
    const handleBlur = () => {
      stopAuto();
    };
    const handleLeave = () => setVisibility(false);
    const handleEnter = () => setVisibility(true);

    // Console diagnostic: run `window.__customCursor()` in devtools
    // to inspect why the cursor is or isn't active.
    window.__customCursor = (): CustomCursorDebugInfo => ({
      capable: getPointerSnapshot().capable,
      reducedMotion: getPointerSnapshot().reducedMotion,
      pointerFine: window.matchMedia("(pointer: fine)").matches,
      mouseSeen,
      variant: stateRef.current.variant,
      label: stateRef.current.label,
      visible: visibleRef.current,
      pressed: pressedRef.current,
      autoScroll: autoScrollRef.current,
      classApplied: document.documentElement.classList.contains(
        "custom-cursor-enabled"
      ),
    });

    document.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("auxclick", handleAux);
    document.addEventListener("wheel", handleWheel, { passive: true });
    document.addEventListener("keydown", handleKey);
    window.addEventListener("blur", handleBlur);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    return () => {
      stopAuto();
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("auxclick", handleAux);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("blur", handleBlur);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.__customCursor = undefined;
    };
  }, [enabled]);

  if (!enabled) return null;
  if (isFullscreen) return null;

  const showVisuals = visible && variant !== "hidden";
  const showHand = variant === "hover" || variant === "label";
  const showAuto = autoScroll && visible;
  const pressScale = pressed ? 0.9 : 1;

  return (
    <>
      {bursts.map((burst) => (
        <div
          key={burst.id}
          aria-hidden="true"
          className="custom-cursor-burst pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
          style={{ left: burst.x, top: burst.y }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block overflow-visible"
          >
            <g stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round">
              <line x1="28" y1="6" x2="28" y2="12" />
              <line x1="28" y1="44" x2="28" y2="50" />
              <line x1="6" y1="28" x2="12" y2="28" />
              <line x1="44" y1="28" x2="50" y2="28" />
              <line x1="12.4" y1="12.4" x2="16.6" y2="16.6" />
              <line x1="39.4" y1="39.4" x2="43.6" y2="43.6" />
              <line x1="43.6" y1="12.4" x2="39.4" y2="16.6" />
              <line x1="16.6" y1="39.4" x2="12.4" y2="43.6" />
            </g>
          </svg>
        </div>
      ))}
      <div
        ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[9999] transition-opacity duration-150 ${
        showVisuals ? "opacity-100" : "opacity-0"
      }`}
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      <div className="relative h-0 w-0">
        <div
          className={`absolute left-0 top-0 transition-all duration-100 ease-out ${
            showHand && !showAuto ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: `translate(-10px, -2px) scale(${(showHand && !showAuto ? 1 : 0.7) * pressScale})`,
            transformOrigin: "10px 2px",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block overflow-visible"
          >
            <path
              d="M28.376,7.062l4.247,0.177c0,0,1.716,0.081,2.114,2.334s2.98,17.876,2.98,17.876l13.809,1.539c4.07,0,7.056,3.285,7.056,7.336v20.179c0,4.051-2.674,6.08-6.742,6.08H33.578c-4.07,0-20.369-11.316-21.369-14.303c-0.361-1.08-0.592-1.718-0.739-2.489c-0.261-1.363-0.261-2.019-0.261-2.019l2.316,0.386l12.684,1.725c0,0,0.588-34.573,0.588-36.657S28.376,7.062,28.376,7.062"
              fill="#FFFFFF"
              stroke="#111111"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          className={`absolute left-0 top-0 transition-all duration-100 ease-out ${
            !showHand && !showAuto ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: `translate(-4.5px, -2px) scale(${(!showHand && !showAuto ? 1 : 0.7) * pressScale})`,
            transformOrigin: "4.5px 2px",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block overflow-visible"
          >
            <path
              d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36Z"
              fill="#FFFFFF"
              stroke="#111111"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          className={`absolute left-0 top-0 transition-all duration-100 ease-out ${
            showAuto ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: `translate(-12px, -12px) scale(${(showAuto ? 1 : 0.7) * pressScale})`,
            transformOrigin: "12px 12px",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block overflow-visible"
          >
            <circle cx="12" cy="12" r="8.5" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
            <path d="M12 6.2 L15.2 10.4 L8.8 10.4 Z" fill="#111111" />
            <path d="M12 17.8 L8.8 13.6 L15.2 13.6 Z" fill="#111111" />
          </svg>
        </div>

        {variant === "label" && label && !showAuto && (
          <span className="absolute left-[24px] top-[12px] whitespace-nowrap rounded-[4px] border border-white/25 bg-[#111111] px-2 py-1 font-mono text-[9px] font-medium uppercase leading-none tracking-wider text-white">
            {label}
          </span>
        )}
      </div>
    </div>
    </>
  );
}

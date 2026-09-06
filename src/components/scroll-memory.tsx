"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "joshua-portfolio:scroll-memory:v1";
const REALIGN_DELAY_MS = 350;
const TRANSITION_GUARD_MS = 2500;
const SAVE_THROTTLE_MS = 100;

type ScrollMemoryMap = Record<string, number>;

function readMemory(): ScrollMemoryMap {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as ScrollMemoryMap;
  } catch {
    // Storage unavailable or corrupted — fall back to no memory.
  }
  return {};
}

function savePosition(pathname: string, y: number): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readMemory(), [pathname]: y }));
  } catch {
    // Private mode etc. — memory simply stays in-page.
  }
}

// Instantly jumps without triggering the site's smooth-scroll behavior.
function jumpTo(y: number): number {
  const root = document.documentElement;
  const prevBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  void root.offsetHeight;
  root.style.scrollBehavior = prevBehavior;
  return window.scrollY;
}

// Remembers the last scroll position of every visited page (per tab) and
// restores it on back/forward traversal, so returning never drops the user
// at the top of the page. Programmatic scrolls emitted by the router while
// a transition is in flight are deliberately ignored so they can never
// overwrite the memorized position with 0.
export function ScrollMemory() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const wentBackRef = useRef(false);
  const transitioningRef = useRef(false);
  const guardTimerRef = useRef(0);
  const lastSaveRef = useRef(0);

  const openGuard = useCallback(() => {
    transitioningRef.current = true;
    window.clearTimeout(guardTimerRef.current);
    guardTimerRef.current = window.setTimeout(() => {
      transitioningRef.current = false;
      pathnameRef.current = window.location.pathname;
    }, TRANSITION_GUARD_MS);
  }, []);

  const closeGuard = useCallback(() => {
    transitioningRef.current = false;
    window.clearTimeout(guardTimerRef.current);
  }, []);

  // Back/forward traversal: authoritatively memorize the page being left,
  // then guard the transition window (fires before the route swaps).
  useEffect(() => {
    try {
      window.history.scrollRestoration = "manual";
    } catch {
      // Older engines — the browser default still applies.
    }
    const onPopState = () => {
      savePosition(pathnameRef.current, window.scrollY);
      wentBackRef.current = true;
      openGuard();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [openGuard]);

  // Memorize genuine user scrolls; capture link clicks synchronously before
  // the router moves; persist on page hide for reloads and tab closes.
  useEffect(() => {
    const onScroll = () => {
      if (transitioningRef.current) return;
      const now = Date.now();
      if (now - lastSaveRef.current < SAVE_THROTTLE_MS) return;
      lastSaveRef.current = now;
      savePosition(pathnameRef.current, window.scrollY);
    };
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!(e.target instanceof Element)) return;
      const anchor = e.target.closest("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // In-page anchors never change route — nothing to memorize or guard.
      if (url.pathname === window.location.pathname && url.hash) return;
      savePosition(pathnameRef.current, window.scrollY);
      openGuard();
    };
    const onHide = () => {
      savePosition(pathnameRef.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", onHide);
    };
  }, [openGuard]);

  // On arrival, restore the memorized position for back/forward traversals
  // and full reloads (the browser default is disabled via scrollRestoration).
  // The restore is re-asserted over a window: late assets, reveal passes,
  // and the router's own scroll handling can otherwise leave the user
  // clamped mid-page (e.g. dropped at the dossier instead of the footer).
  useEffect(() => {
    pathnameRef.current = pathname;

    const navEntries = window.performance?.getEntriesByType?.("navigation") ?? [];
    const navType = navEntries.length > 0 ? (navEntries[0] as PerformanceNavigationTiming).type : "";
    const shouldRestore =
      (wentBackRef.current || navType === "back_forward" || navType === "reload") &&
      window.location.hash === "";
    wentBackRef.current = false;
    if (!shouldRestore) {
      closeGuard();
      return;
    }

    const savedRaw = readMemory()[pathname] ?? 0;
    if (savedRaw <= 0) {
      closeGuard();
      return;
    }

    // Keep the guard open for the whole restore window so router-driven
    // scrolls can never overwrite memory with intermediate positions.
    openGuard();

    let cancelled = false;
    const onUserIntent = () => {
      cancelled = true;
    };
    window.addEventListener("wheel", onUserIntent, { passive: true });
    window.addEventListener("touchmove", onUserIntent, { passive: true });
    window.addEventListener("keydown", onUserIntent);
    window.addEventListener("pointerdown", onUserIntent);

    const targetY = () =>
      Math.max(0, Math.min(savedRaw, document.documentElement.scrollHeight - window.innerHeight));
    const attempt = () => {
      if (cancelled) return;
      const t = targetY();
      if (Math.abs(window.scrollY - t) > 2) jumpTo(t);
    };

    attempt();
    const timers = [REALIGN_DELAY_MS, 600, 1200].map((ms) =>
      window.setTimeout(attempt, ms)
    );
    const done = window.setTimeout(() => {
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("touchmove", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
      window.removeEventListener("pointerdown", onUserIntent);
      closeGuard();
    }, 1500);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(done);
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("touchmove", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
      window.removeEventListener("pointerdown", onUserIntent);
    };
  }, [pathname, closeGuard, openGuard]);

  return null;
}

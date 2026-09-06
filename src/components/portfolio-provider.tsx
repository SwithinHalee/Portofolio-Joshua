"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PORTFOLIO,
  loadPortfolioData,
  resetPortfolioData,
  sanitizePortfolio,
  savePortfolioData,
  type PortfolioData,
} from "@/lib/portfolio-store";

export type SyncStatus = "idle" | "loading" | "synced" | "saving" | "error" | "local";

interface PortfolioContextValue {
  data: PortfolioData;
  setData: (next: PortfolioData) => void;
  update: (patch: (prev: PortfolioData) => PortfolioData) => void;
  reset: () => void;
  hydrated: boolean;
  syncStatus: SyncStatus;
  syncError: string | null;
  /** True when this browser holds an admin session AND Redis is reachable. */
  isGlobal: boolean;
  /** True when the server reports Upstash Redis env vars are configured. */
  redisAvailable: boolean;
  /** True when this browser holds a valid admin session. */
  isAdmin: boolean;
  refreshGlobal: () => Promise<void>;
  pushGlobal: () => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextValue>({
  data: DEFAULT_PORTFOLIO,
  setData: () => {},
  update: () => {},
  reset: () => {},
  hydrated: false,
  syncStatus: "idle",
  syncError: null,
  isGlobal: false,
  redisAvailable: false,
  isAdmin: false,
  refreshGlobal: async () => {},
  pushGlobal: async () => false,
});

function hydrateState(next: PortfolioData): void {
  savePortfolioData(next);
  window.dispatchEvent(new Event("portfolio:hydrated"));
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<PortfolioData>(DEFAULT_PORTFOLIO);
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [redisAvailable, setRedisAvailable] = useState(false);
  const dataRef = useRef<PortfolioData>(data);
  dataRef.current = data;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGlobal = redisAvailable && isAdmin;

  const pushNow = useCallback(async (payload: PortfolioData): Promise<boolean> => {
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        setIsAdmin(false);
        return false;
      }
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  const refreshGlobal = useCallback(async () => {
    setSyncStatus("loading");
    setSyncError(null);
    try {
      const [portRes, sessRes] = await Promise.all([
        fetch("/api/portfolio", { cache: "no-store" }),
        fetch("/api/admin/session", { cache: "no-store" }),
      ]);
      const admin =
        sessRes.ok && ((await sessRes.json()) as { authenticated?: boolean }).authenticated === true;
      setIsAdmin(admin);
      if (!portRes.ok) throw new Error(`Server responded ${portRes.status}`);
      const body = (await portRes.json()) as {
        data?: unknown;
        exists?: boolean;
        redisConfigured?: boolean;
      };
      const available = body.redisConfigured === true;
      setRedisAvailable(available);
      const clean = body.data !== undefined ? sanitizePortfolio(body.data) : null;
      if (!clean) throw new Error("Invalid portfolio data from server.");

      if (available && body.exists === true) {
        // Global record exists: it is the source of truth for every device.
        setDataState(clean);
        hydrateState(clean);
      } else if (available && admin) {
        // First run: seed the empty Redis key from this admin browser, then keep it.
        const local = loadPortfolioData();
        const ok = await pushNow(local);
        setDataState(local);
        hydrateState(local);
        if (!ok) {
          setSyncError("Redis is reachable but the seed write failed. Retry with Sync now.");
        }
      } else {
        const local = loadPortfolioData();
        setDataState(local);
        hydrateState(local);
      }
      setSyncStatus(available ? "synced" : "local");
    } catch {
      // Offline or API unavailable: fall back to local storage.
      const local = loadPortfolioData();
      setDataState(local);
      hydrateState(local);
      setRedisAvailable(false);
      setSyncStatus("local");
    } finally {
      setHydrated(true);
    }
  }, [pushNow]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshGlobal();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshGlobal]);

  // Local persistence (immediate) + debounced global push (admin sessions only).
  useEffect(() => {
    if (!hydrated) return;
    savePortfolioData(data);
    if (!(redisAvailable && isAdmin)) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSyncStatus("saving");
      setSyncError(null);
      const ok = await pushNow(dataRef.current);
      if (ok) {
        setSyncStatus("synced");
      } else {
        setSyncStatus("error");
        setSyncError("Could not sync to global store. Changes are saved in this browser.");
      }
    }, 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, hydrated, redisAvailable, isAdmin, pushNow]);

  const setData = useCallback((next: PortfolioData) => {
    setDataState(next);
  }, []);

  const update = useCallback((patch: (prev: PortfolioData) => PortfolioData) => {
    setDataState((prev) => patch(prev));
  }, []);

  const reset = useCallback(() => {
    setDataState(resetPortfolioData());
  }, []);

  const pushGlobal = useCallback(async (): Promise<boolean> => {
    setSyncStatus("saving");
    setSyncError(null);
    const ok = await pushNow(dataRef.current);
    if (ok) {
      setSyncStatus("synced");
    } else {
      setSyncStatus("error");
      setSyncError("Sync failed. Check the admin session and Redis connection, then retry.");
    }
    return ok;
  }, [pushNow]);

  const value = useMemo(
    () => ({
      data,
      setData,
      update,
      reset,
      hydrated,
      syncStatus,
      syncError,
      isGlobal,
      redisAvailable,
      isAdmin,
      refreshGlobal,
      pushGlobal,
    }),
    [
      data,
      setData,
      update,
      reset,
      hydrated,
      syncStatus,
      syncError,
      isGlobal,
      redisAvailable,
      isAdmin,
      refreshGlobal,
      pushGlobal,
    ]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

/** Live portfolio data (global store when reachable, localStorage fallback). Safe during SSR. */
export function usePortfolio(): PortfolioContextValue {
  return useContext(PortfolioContext);
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_PORTFOLIO,
  loadPortfolioData,
  resetPortfolioData,
  savePortfolioData,
  type PortfolioData,
} from "@/lib/portfolio-store";

interface PortfolioContextValue {
  data: PortfolioData;
  setData: (next: PortfolioData) => void;
  update: (patch: (prev: PortfolioData) => PortfolioData) => void;
  reset: () => void;
  hydrated: boolean;
}

const PortfolioContext = createContext<PortfolioContextValue>({
  data: DEFAULT_PORTFOLIO,
  setData: () => {},
  update: () => {},
  reset: () => {},
  hydrated: false,
});

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<PortfolioData>(DEFAULT_PORTFOLIO);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDataState(loadPortfolioData());
    setHydrated(true);
    // Stacking sections measure live geometry (pin offsets, slide ranges).
    // Notify them that local edits just landed so they re-measure instead
    // of keeping numbers taken from the shipped defaults.
    window.dispatchEvent(new Event("portfolio:hydrated"));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePortfolioData(data);
  }, [data, hydrated]);

  const setData = useCallback((next: PortfolioData) => {
    setDataState(next);
  }, []);

  const update = useCallback((patch: (prev: PortfolioData) => PortfolioData) => {
    setDataState((prev) => patch(prev));
  }, []);

  const reset = useCallback(() => {
    setDataState(resetPortfolioData());
  }, []);

  const value = useMemo(
    () => ({ data, setData, update, reset, hydrated }),
    [data, setData, update, reset, hydrated]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

/** Live portfolio data (localStorage override when present, defaults otherwise). Safe during SSR. */
export function usePortfolio(): PortfolioContextValue {
  return useContext(PortfolioContext);
}

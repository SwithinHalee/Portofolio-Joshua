import type { CSSProperties, ReactNode } from "react";

export type DossierTagTone = "green" | "blue" | "amber" | "red" | "neutral" | "custom";

interface DossierTagProps {
  tone?: DossierTagTone;
  /** Base hex (e.g. "#7C3AED") — used when tone is "custom". */
  customColor?: string;
  code?: string;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
}

const TONES: Record<Exclude<DossierTagTone, "custom">, { frame: string; spine: string }> = {
  green: {
    frame: "border-[#C4DCC3] bg-[#EFF4EE] text-[#2C5A33]",
    spine: "bg-[#3E7C4F]",
  },
  blue: {
    frame: "border-[#BEDDF1] bg-[#EEF5FB] text-[#1D5D8C]",
    spine: "bg-[#2F7CB3]",
  },
  amber: {
    frame: "border-[#E7D5A9] bg-[#FAF3DF] text-[#775200]",
    spine: "bg-[#B3801D]",
  },
  red: {
    frame: "border-[#EEC3C5] bg-[#FAEDED] text-[#8C2A2B]",
    spine: "bg-[#AE3839]",
  },
  neutral: {
    frame: "border-[#DFDFDC] bg-[#F4F4F2] text-[#383838]",
    spine: "bg-[#111111]",
  },
};

function clamp(n: number, min = 0, max = 255): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function normalizeHex(input: string | undefined | null, fallback = "#3E7C4F"): string {
  if (!input) return fallback;
  let h = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h.split("").map((c) => c + c).join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return fallback;
  return `#${h.toUpperCase()}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = normalizeHex(hex).slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => clamp(n).toString(16).padStart(2, "0").toUpperCase();
  return `#${to(r)}${to(g)}${to(b)}`;
}

function mix(hexA: string, hexB: string, weightA: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const w = Math.min(1, Math.max(0, weightA));
  return rgbToHex(a.r * w + b.r * (1 - w), a.g * w + b.g * (1 - w), a.b * w + b.b * (1 - w));
}

/** Derive the muted pastel badge palette from any base color. */
export function customToneStyles(baseHex: string): { frame: CSSProperties; spine: CSSProperties } {
  const base = normalizeHex(baseHex);
  return {
    frame: {
      borderColor: mix(base, "#FFFFFF", 0.32),
      backgroundColor: mix(base, "#FFFFFF", 0.12),
      color: mix(base, "#000000", 0.62),
    },
    spine: { backgroundColor: base },
  };
}

// Filing tag from the engineering archive: sharp 3px corners, hairline
// border, solid folder-tab spine, and a square status pip instead of the
// ubiquitous round pastel dot.
export function DossierTag({
  tone = "neutral",
  customColor,
  code,
  pulse = false,
  size = "sm",
  className = "",
  children,
}: DossierTagProps) {
  const textSize = size === "md" ? "text-[11px]" : "text-[10px]";
  const isCustom = tone === "custom" || (customColor !== undefined && customColor !== "");
  const custom = isCustom ? customToneStyles(customColor ?? "#3E7C4F") : null;

  return (
    <span
      className={`inline-flex items-stretch overflow-hidden rounded-[3px] border font-mono font-medium uppercase ${custom ? "" : TONES[tone === "custom" ? "neutral" : tone].frame} ${className}`}
      style={custom?.frame}
    >
      <span
        aria-hidden="true"
        className={`w-[3px] shrink-0 ${custom ? "" : TONES[tone === "custom" ? "neutral" : tone].spine}`}
        style={custom?.spine}
      />
      <span className={`inline-flex items-center gap-1.5 px-2 py-[3px] ${textSize}`}>
        {code && (
          <span aria-hidden="true" className="opacity-55">
            {code}
          </span>
        )}
        {pulse ? (
          <span aria-hidden="true" className="relative flex h-[7px] w-[7px]">
            <span className="absolute inline-flex h-full w-full animate-ping bg-current opacity-50" />
            <span className="relative inline-flex h-[7px] w-[7px] bg-current" />
          </span>
        ) : (
          <span aria-hidden="true" className="h-[6px] w-[6px] shrink-0 bg-current" />
        )}
        <span className="tracking-[0.08em]">{children}</span>
      </span>
    </span>
  );
}

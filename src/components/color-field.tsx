"use client";

import { useState } from "react";
import { ArrowCounterClockwise, Shuffle } from "@phosphor-icons/react";
import { customToneStyles, DossierTag, normalizeHex } from "@/components/dossier-tag";

export const TONE_PRESETS: { id: string; label: string; swatch: string }[] = [
  { id: "green", label: "Green", swatch: "#3E7C4F" },
  { id: "blue", label: "Blue", swatch: "#2F7CB3" },
  { id: "amber", label: "Amber", swatch: "#B3801D" },
  { id: "red", label: "Red", swatch: "#AE3839" },
  { id: "neutral", label: "Ink", swatch: "#111111" },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = normalizeHex(hex).slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, "0").toUpperCase();
  return `#${to(r)}${to(g)}${to(b)}`;
}

function randomHex(): string {
  const h = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase();
  return `#${h}`;
}

interface ColorFieldProps {
  value: string;
  onChange: (hex: string) => void;
  previewText?: string;
}

export function ColorField({ value, onChange, previewText = "Sample tag" }: ColorFieldProps) {
  const safe = normalizeHex(value);
  const [hashDraft, setHashDraft] = useState<string | null>(null);
  const rgb = hexToRgb(safe);
  const styles = customToneStyles(safe);

  const setChannel = (channel: "r" | "g" | "b", v: number) => {
    const next = { ...rgb, [channel]: v };
    onChange(rgbToHex(next.r, next.g, next.b));
  };

  return (
    <div className="rounded-[6px] border border-[#EAEAEA] bg-[#FBFBFA] p-3">
      {/* Live preview */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <DossierTag tone="custom" customColor={safe}>
          {previewText}
        </DossierTag>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#616161]">
          <span
            aria-hidden="true"
            className="inline-block h-3.5 w-3.5 rounded-[3px] border border-black/10"
            style={{ backgroundColor: safe }}
          />
          <span>{safe}</span>
        </span>
      </div>

      {/* Wheel + hash */}
      <div className="mb-3 flex items-center gap-2.5">
        <label
          className="relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[6px] border border-[#EAEAEA] bg-white"
          title="Open color wheel"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-1 rounded-[4px] border border-black/10"
            style={{ backgroundColor: safe }}
          />
          <input
            type="color"
            value={safe}
            aria-label="Pick color from wheel"
            onChange={(e) => {
              setHashDraft(null);
              onChange(normalizeHex(e.target.value));
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <div className="flex flex-1 items-center gap-1.5">
          <span className="font-mono text-sm text-[#616161]">#</span>
          <input
            value={hashDraft ?? safe.slice(1)}
            spellCheck={false}
            maxLength={6}
            aria-label="Hex color hash"
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
              setHashDraft(raw);
              if (raw.length === 6) onChange(`#${raw.toUpperCase()}`);
              if (raw.length === 3) onChange(normalizeHex(raw));
            }}
            onBlur={() => setHashDraft(null)}
            className="w-full rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] px-2.5 py-2 font-mono text-[13px] uppercase tracking-wider text-[#111111] outline-none focus:border-[#111111]"
            placeholder="3E7C4F"
          />
        </div>
        <button
          type="button"
          title="Random color"
          aria-label="Random color"
          onClick={() => {
            setHashDraft(null);
            onChange(randomHex());
          }}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#EAEAEA] bg-white text-[#616161] transition-colors hover:bg-[#F0F0EE] hover:text-[#111111]"
        >
          <Shuffle size={15} weight="regular" />
        </button>
        <button
          type="button"
          title="Reset to default green"
          aria-label="Reset color"
          onClick={() => {
            setHashDraft(null);
            onChange("#3E7C4F");
          }}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#EAEAEA] bg-white text-[#616161] transition-colors hover:bg-[#F0F0EE] hover:text-[#111111]"
        >
          <ArrowCounterClockwise size={15} weight="regular" />
        </button>
      </div>

      {/* Bars */}
      <div className="space-y-2">
        {(["r", "g", "b"] as const).map((ch) => (
          <div key={ch} className="flex items-center gap-2.5">
            <span className="w-4 font-mono text-[11px] uppercase text-[#616161]">{ch}</span>
            <input
              type="range"
              min={0}
              max={255}
              value={rgb[ch]}
              aria-label={`${ch.toUpperCase()} channel`}
              onChange={(e) => setChannel(ch, Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, ${rgbToHex(
                  ch === "r" ? 0 : rgb.r,
                  ch === "g" ? 0 : rgb.g,
                  ch === "b" ? 0 : rgb.b
                )}, ${rgbToHex(
                  ch === "r" ? 255 : rgb.r,
                  ch === "g" ? 255 : rgb.g,
                  ch === "b" ? 255 : rgb.b
                )})`,
              }}
            />
            <span className="w-8 text-right font-mono text-[11px] text-[#111111]">{rgb[ch]}</span>
          </div>
        ))}
      </div>

      {/* Derived pastel readout */}
      <div className="mt-3 flex items-center gap-2 border-t border-[#EAEAEA] pt-2.5 font-mono text-[10px] text-[#616161]">
        <span
          aria-hidden="true"
          className="inline-block h-3 w-3 rounded-[2px] border border-black/10"
          style={{ backgroundColor: (styles.frame.backgroundColor as string) ?? "#fff" }}
        />
        <span>bg {(styles.frame.backgroundColor as string) ?? ""}</span>
        <span aria-hidden="true" className="text-[#D5D5D5]">
          /
        </span>
        <span>text {(styles.frame.color as string) ?? ""}</span>
      </div>
    </div>
  );
}

interface TonePickerProps {
  tone: string;
  customColor: string;
  onTone: (tone: "green" | "blue" | "amber" | "red" | "custom") => void;
  onCustomColor: (hex: string) => void;
  previewText?: string;
}

/** Preset swatches + custom color wheel in one control. */
export function TonePicker({ tone, customColor, onTone, onCustomColor, previewText }: TonePickerProps) {
  const tones = ["green", "blue", "amber", "red"] as const;
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {tones.map((t) => {
          const active = tone === t;
          const swatch = TONE_PRESETS.find((p) => p.id === t)?.swatch ?? "#111111";
          return (
            <button
              key={t}
              type="button"
              onClick={() => onTone(t)}
              aria-pressed={active}
              title={t}
              className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1.5 font-mono text-[11px] transition-all active:scale-[0.97] ${
                active ? "border-[#111111] bg-[#111111] text-white" : "border-[#EAEAEA] bg-white text-[#616161] hover:bg-[#F7F6F3]"
              }`}
            >
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 rounded-[2px] border border-black/15"
                style={{ backgroundColor: swatch }}
              />
              <span className="capitalize">{t}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onTone("custom")}
          aria-pressed={tone === "custom"}
          title="Custom color"
          className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1.5 font-mono text-[11px] transition-all active:scale-[0.97] ${
            tone === "custom" ? "border-[#111111] bg-[#111111] text-white" : "border-[#EAEAEA] bg-white text-[#616161] hover:bg-[#F7F6F3]"
          }`}
        >
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 rounded-[2px] border border-black/15"
            style={{
              background: "conic-gradient(from 0deg, #E5484D, #E5A13D, #46A758, #3E63DD, #8E4EC6, #E5484D)",
            }}
          />
          <span>Custom</span>
        </button>
      </div>
      {tone === "custom" && <ColorField value={customColor} onChange={onCustomColor} previewText={previewText} />}
    </div>
  );
}

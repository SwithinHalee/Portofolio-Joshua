"use client";

import Image from "next/image";
import type { GalleryPlate } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { Reveal } from "@/components/motion-wrapper";

interface PlateView {
  src: string;
  alt: string;
  title: string;
  detail: string;
  ratio: string;
  sizes: string;
  position?: string;
}

function isRenderableSrc(src: string | undefined | null): src is string {
  if (!src || !src.trim()) return false;
  const t = src.trim();
  return t.startsWith("/") || t.startsWith("https://") || t.startsWith("http://");
}

function toView(plate: GalleryPlate): PlateView | null {
  if (!isRenderableSrc(plate.src)) return null;
  switch (plate.span) {
    case "tall":
      return {
        src: plate.src.trim(),
        alt: plate.alt,
        title: plate.title,
        detail: plate.detail,
        ratio: "aspect-[3/4]",
        sizes: "(max-width: 768px) 100vw, 480px",
      };
    case "trio":
      return {
        src: plate.src.trim(),
        alt: plate.alt,
        title: plate.title,
        detail: plate.detail,
        ratio: "aspect-square",
        sizes: "(max-width: 768px) 100vw, 320px",
      };
    case "wide":
      return {
        src: plate.src.trim(),
        alt: plate.alt,
        title: plate.title,
        detail: plate.detail,
        ratio: "aspect-[21/9]",
        sizes: "(max-width: 1024px) 100vw, 960px",
      };
    case "half":
    default:
      return {
        src: plate.src.trim(),
        alt: plate.alt,
        title: plate.title,
        detail: plate.detail,
        ratio: "aspect-[4/3]",
        sizes: "(max-width: 768px) 100vw, 480px",
        position: "object-top",
      };
  }
}

function plateColSpan(span: GalleryPlate["span"]): string {
  switch (span) {
    case "wide":
      return "md:col-span-12";
    case "trio":
      return "md:col-span-4";
    case "tall":
    case "half":
    default:
      return "md:col-span-6";
  }
}

function PlateFigure({ plate, index }: { plate: PlateView; index: string }) {
  return (
    <figure className="group min-w-0">
      <div className="overflow-hidden rounded-[6px] border border-[#262626] transition-colors duration-300 group-hover:border-[#3D3D3D]">
        <div className={`relative w-full ${plate.ratio}`}>
          <Image
            src={plate.src}
            alt={plate.alt}
            fill
            sizes={plate.sizes}
            className={`object-cover ${plate.position ?? ""} grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0`}
          />
        </div>
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 pt-3 font-mono text-[11px]">
        <span className="min-w-0 truncate">
          <span className="mr-2 text-[#9A9A9A]">{index}</span>
          <span className="uppercase tracking-wider text-[#E0E0E0]">{plate.title}</span>
        </span>
        <span className="shrink-0 uppercase tracking-wider text-[#9A9A9A]">{plate.detail}</span>
      </figcaption>
    </figure>
  );
}

// Contact-sheet plates for the dossier: border-only hairline frames on the
// bare section background, archival grayscale that develops into color on
// hover, and a mono caption ledger under each exposure.
// Gallery is sourced exclusively from the database (admin studio → global
// store). Plates without a usable image are skipped instead of falling back
// to a hardcoded picture; an empty gallery hides the whole section.
export function DossierGallery() {
  const { data } = usePortfolio();
  const views = (data.gallery ?? [])
    .map((plate) => ({ plate, view: toView(plate) }))
    .filter((e): e is { plate: GalleryPlate; view: PlateView } => e.view !== null);
  if (views.length === 0) return null;
  const pad = (n: number) => `PLATE ${String(n).padStart(2, "0")}`;

  return (
    <Reveal delay={0.1}>
      <div className="mb-16 border-t border-[#222222] pt-12">
        <div className="mb-8 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#888888]">
          <span>{"// VISUAL RECORD — FIELD PLATES"}</span>
          <span className="text-[10px] text-[#9A9A9A]">
            {String(views.length).padStart(2, "0")} EXPOSURES
          </span>
        </div>

        {/* Sequential flow in admin order: wide takes a full row, halves
            and talls share a row in pairs, trios group in threes.
            Stacks on mobile. */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {views.map(({ plate, view }, i) => (
            <div key={`${plate.src}-${i}`} className={plateColSpan(plate.span)}>
              <PlateFigure plate={view} index={pad(i + 1)} />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

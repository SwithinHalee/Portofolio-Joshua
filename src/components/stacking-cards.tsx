"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  ArrowUpRight,
  Code,
} from "@phosphor-icons/react";
import { DossierTag } from "@/components/dossier-tag";

interface StackingCardItem {
  number: string;
  badge: string;
  category: string;
  title: string;
  concept: string;
  description: string;
  codeSnippet: string;
  specs: { label: string; value: string }[];
  citationUrl?: string;
  citationLabel?: string;
  accent: "green" | "blue" | "amber" | "charcoal";
}

const STACKING_CARDS: StackingCardItem[] = [
  {
    number: "01",
    badge: "CSS POSITION: STICKY",
    category: "Spatial Motion Technique",
    title: "Sticky Scroll Animation",
    concept: "Spatial Navigation & Viewport Pinning",
    description:
      "Memanfaatkan properti native CSS position: sticky agar elemen kartu menempel di batas atas viewport saat container induk di-scroll. Mengurangi overhead scroll listener JavaScript berat, menjaga eksekusi mulus di GPU rendering thread secara native.",
    codeSnippet: `/* Sticky Viewport Pinning */
.stacking-card {
  position: sticky;
  top: calc(100px + var(--stack-offset));
  transform-origin: top center;
  will-change: transform;
}`,
    specs: [
      { label: "Rendering Thread", value: "Native Browser GPU" },
      { label: "Layout Impact", value: "Minimal Shift by Design" },
      { label: "Scroll Reference", value: "Framer Community Standard" },
    ],
    citationUrl: "https://www.framer.community/c/support/sticky-scroll-effect",
    citationLabel: "Framer Community — Sticky Scroll",
    accent: "green",
  },
  {
    number: "02",
    badge: "3D DEPTH ILLUSION",
    category: "Visual Perception & Optics",
    title: "Cards Parallax / Scroll Parallax",
    concept: "Velocity Differentiation & Dimensional Scaling",
    description:
      "Menciptakan ilusi kedalaman spasial 3D dengan memberikan perbedaan kecepatan gerak (velocity) dan transformasi skala (scale-down progresif) saat kartu baru menumpuk di atas kartu sebelumnya, sebagaimana dirumuskan pada standar Hello-Mat design engineering.",
    codeSnippet: `// Scroll Parallax Scale Interpolation
const scale = useTransform(
  scrollYProgress,
  [cardStart, 1],
  [1, 1 - (total - index) * 0.04]
);`,
    specs: [
      { label: "Depth Dynamics", value: "Progressive Scale (1.0 → 0.88)" },
      { label: "Layer Occlusion", value: "Subtle Tonal Dimming" },
      { label: "Motion Curve", value: "Physical Easing (Cubic-Bezier)" },
    ],
    citationUrl: "https://hello-mat.com/design-engineering/stacking-cards",
    citationLabel: "Hello-Mat — Stacking Cards",
    accent: "blue",
  },
  {
    number: "03",
    badge: "SYSTEM ARCHITECTURE",
    category: "Reliability & Contract Safety",
    title: "Type-Safe State Contracts",
    concept: "Compile-Time Immutability & Mathematical Soundness",
    description:
      "Menjaga integritas data mulai dari network payload hingga reactive UI boundary. Kontrak antarmuka TypeScript ketat mengurangi risiko runtime bug tak terduga dan membuat kalkulasi metriks emisi karbon lebih dapat diandalkan secara matematis.",
    codeSnippet: `interface CarbonMetricContract {
  readonly co2Tons: number;
  readonly emissionFactor: EmissionFactor;
  readonly confidenceScore: number;
}`,
    specs: [
      { label: "Type Coverage", value: "Strict Interfaces Throughout" },
      { label: "Runtime Safety", value: "Typed Boundaries, No Any Leaks" },
      { label: "State Predictability", value: "Deterministic State Machines" },
    ],
    accent: "amber",
  },
  {
    number: "04",
    badge: "CORE WEB VITALS",
    category: "Performance Engineering",
    title: "Sub-Second Hydration Budget",
    concept: "Server Components & Stateless Client Islands",
    description:
      "Memisahkan rendering server statis dengan pulau interaktif (client islands). Halaman tersaji instan dengan Time-To-First-Byte minimal, sementara hidrasi JavaScript client-side hanya dieksekusi secara terisolasi pada kalkulator jejak karbon.",
    codeSnippet: `// Server Pre-Render with Client Island
export default async function Page() {
  const data = await fetchEmissionsData();
  return <CalculatorIsland initialData={data} />;
}`,
    specs: [
      { label: "Largest Contentful Paint", value: "Sub-second Budget (Lab)" },
      { label: "First Input Delay", value: "Responsive Input Budget" },
      { label: "Bundle Discipline", value: "Lean Dependency Set" },
    ],
    accent: "charcoal",
  },
];

export function StackingCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="stacking-mechanics"
      ref={containerRef}
      className="relative pt-8 md:pt-12 pb-24 md:pb-28 border-b border-[#EAEAEA] bg-[#FBFBFA]"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <div className="flex items-center gap-2 font-mono text-xs text-[#616161] uppercase tracking-wider mb-2">
            <span>03 / DESIGN ENGINEERING MECHANICS</span>
            <span className="text-[#EAEAEA]">•</span>
            <span>ISTILAH POPULER & EFEK PENDUKUNG</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            Sticky Scroll & Stacking Cards Parallax
          </h2>
          <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-sans">
            Demonstrasi interaktif prinsip <strong>Sticky Scroll Animation</strong> dan{" "}
            <strong>Cards Parallax</strong>. Kartu menempel di batas atas layar dan saling menumpuk
            dengan ilusi kedalaman 3D (*depth*) seiring pergerakan scroll Anda.
          </p>
        </div>

        {/* Stacking Cards Deck Container */}
        <div className="relative pb-24 space-y-12 sm:space-y-16">
          {STACKING_CARDS.map((card, i) => {
            const targetScale = 1 - (STACKING_CARDS.length - 1 - i) * 0.035;
            const startRange = i / STACKING_CARDS.length;

            return (
              <SingleStackingCard
                key={card.number}
                card={card}
                index={i}
                progress={scrollYProgress}
                range={[startRange, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SingleStackingCard({
  card,
  index,
  progress,
  range,
  targetScale,
}: {
  card: StackingCardItem;
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  // Top offset so cards cascade with neat header tabs
  const topOffset = 80 + index * 24;

  return (
    <div
      style={{ top: `${topOffset}px` }}
      className="sticky will-change-transform"
    >
      <motion.div
        style={{ scale }}
        className="rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-colors origin-top"
      >
        {/* Card Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAEAEA] pb-5 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-[#111111]">
              [{card.number}]
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#616161]">
              {card.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DossierTag
              tone={card.accent === "charcoal" ? "neutral" : card.accent}
              code={card.number}
            >
              {card.badge}
            </DossierTag>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Explanations & Citations */}
          <div className="lg:col-span-7 space-y-4">
            <h3
              className="text-2xl sm:text-3xl font-serif text-[#111111] tracking-tight"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              {card.title}
            </h3>

            <div className="font-mono text-xs text-[#111111] font-medium flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#111111]"></span>
              <span>{card.concept}</span>
            </div>

            <p className="text-sm text-[#555555] leading-relaxed font-sans">
              {card.description}
            </p>

            {/* Citations if present */}
            {card.citationUrl && (
              <div className="pt-2">
                <a
                  href={card.citationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-[#111111] hover:underline underline-offset-4"
                >
                  <span className="text-[#616161]">Reference:</span>
                  <span className="font-medium">{card.citationLabel}</span>
                  <ArrowUpRight size={11} weight="bold" />
                </a>
              </div>
            )}

            {/* Spec tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">
              {card.specs.map((s) => (
                <div
                  key={s.label}
                  className="rounded border border-[#EAEAEA] bg-[#FBFBFA] p-2.5 font-mono"
                >
                  <span className="block text-[10px] text-[#616161] uppercase">
                    {s.label}
                  </span>
                  <span className="text-xs font-medium text-[#111111] block mt-0.5">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Technical Code Chrome */}
          <div className="lg:col-span-5 rounded-[6px] border border-[#EAEAEA] bg-[#F7F6F3] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-3 py-2 font-mono text-[11px] text-[#616161]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2 w-2 rounded-full bg-[#E5E5E5] inline-block"></span>
                <span className="h-2 w-2 rounded-full bg-[#E5E5E5] inline-block"></span>
              </div>
              <span>mechanics-spec.ts</span>
              <Code size={12} weight="bold" />
            </div>

            <pre className="p-4 font-mono text-[11px] text-[#222222] overflow-x-auto leading-relaxed whitespace-pre-wrap">
              <code>{card.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
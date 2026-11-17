"use client";

import { useEffect, useRef } from "react";
import { PERSONAL_INFO } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";

const MATRIX_ROWS = 7;
const MATRIX_COLS_DESKTOP = 48;
const MATRIX_COLS_TABLET = 32;
const MATRIX_COLS_MOBILE = 20;

const GLYPH_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=~^/\\|<>[]{}():;.,?!";

interface GlyphCell {
  char: string;
  phaseOffset: number;
}

function buildMatrix(): GlyphCell[][] {
  const grid: GlyphCell[][] = [];
  for (let r = 0; r < MATRIX_ROWS; r++) {
    const row: GlyphCell[] = [];
    for (let c = 0; c < MATRIX_COLS_DESKTOP; c++) {
      // Deterministic pseudo-random seed so initial SSR/CSR frame matches cleanly.
      const seed = (r * 73 + c * 41 + 19) % GLYPH_POOL.length;
      row.push({
        char: GLYPH_POOL[seed],
        phaseOffset: ((r * 17 + c * 29) % 31) / 31,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function Hero() {
  const { data } = usePortfolio();
  const personalInfo = data.personalInfo ?? PERSONAL_INFO;

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0.5,
    y: 0.5,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!canvas || !stage || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const matrix = buildMatrix();

    const motionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let reducedMotion = motionQuery?.matches ?? false;

    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    motionQuery?.addEventListener?.("change", onMotionChange);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let rafId: number | null = null;
    const startTime = performance.now();
    let smoothX = 0.5;
    let smoothY = 0.5;
    let smoothInfluence = 0;

    const monoFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-jetbrains-mono")
        .trim() || "ui-monospace, SFMono-Regular, Menlo, monospace";

    const updateSize = () => {
      const rect = stage.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = (now: number) => {
      // Animate smoothly across all platforms and operating systems.
      // If reduced motion is requested, run at a calm, serene tempo (0.4x)
      // rather than freezing or halting the canvas.
      const speedMultiplier = reducedMotion ? 0.4 : 1;
      const elapsed = (now - startTime) * 0.001 * speedMultiplier;
      const isHovering = pointerRef.current.active;

      const targetInfluence = isHovering ? (reducedMotion ? 0.45 : 1) : 0;
      smoothInfluence += (targetInfluence - smoothInfluence) * 0.14;
      smoothX += (pointerRef.current.x - smoothX) * 0.25;
      smoothY += (pointerRef.current.y - smoothY) * 0.25;

      ctx.clearRect(0, 0, width, height);

      const cols =
        width >= 1024
          ? MATRIX_COLS_DESKTOP
          : width >= 640
            ? MATRIX_COLS_TABLET
            : MATRIX_COLS_MOBILE;

      const fontSize = width >= 1024 ? 12.5 : width >= 640 ? 11.5 : 10.5;
      ctx.font = `400 ${fontSize}px ${monoFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const padX = Math.max(12, Math.min(28, width * 0.015));
      const usableW = Math.max(1, width - padX * 2);
      const colStep = cols > 1 ? usableW / (cols - 1) : 0;

      const amplitudePrimary = Math.min(44, Math.max(18, height * 0.072));
      const amplitudeSecondary = Math.min(18, Math.max(6, height * 0.028));
      const verticalPad = amplitudePrimary + amplitudeSecondary + 16;
      const usableH = Math.max(120, height - verticalPad * 2);
      const rowStep = MATRIX_ROWS > 1 ? usableH / (MATRIX_ROWS - 1) : 0;

      const pointerPxX = smoothX * width;
      const pointerPxY = smoothY * height;
      const rippleRadiusSq = 160 * 160;

      for (let r = 0; r < MATRIX_ROWS; r++) {
        const baseY = verticalPad + r * rowStep;
        const rowPhase = r * 0.16;

        for (let c = 0; c < cols; c++) {
          const cell = matrix[r][c];
          const x = padX + c * colStep;
          const waveRatio = c / Math.max(1, cols - 1);

          const wave1 =
            Math.sin(waveRatio * Math.PI * 2.55 - elapsed * 0.65 + rowPhase) *
            amplitudePrimary;
          const wave2 =
            Math.cos(waveRatio * Math.PI * 1.3 + elapsed * 0.38 - r * 0.11) *
            amplitudeSecondary;

          let y = baseY + wave1 + wave2;
          let alpha = 0.56;

          if (smoothInfluence > 0.01) {
            const dx = x - pointerPxX;
            const dy = y - pointerPxY;
            const distSq = dx * dx + dy * dy;
            if (distSq < rippleRadiusSq) {
              const falloff = 1 - distSq / rippleRadiusSq;
              const smoothFalloff = falloff * falloff;
              if (isHovering) {
                cell.char = GLYPH_POOL[Math.floor(Math.random() * GLYPH_POOL.length)];
              }
              y += Math.sin(elapsed * 8.5 + c * 0.45) * 15 * smoothFalloff * smoothInfluence;
              alpha = Math.min(0.95, alpha + 0.36 * smoothFalloff * smoothInfluence);
            }
          }

          ctx.fillStyle = `rgba(38, 38, 35, ${alpha.toFixed(3)})`;
          ctx.fillText(cell.char, x, y);
        }
      }

      if (isVisible) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const startLoop = () => {
      if (rafId !== null) return;
      if (isVisible) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      if (isVisible && rafId === null) {
        drawFrame(performance.now());
      }
    });
    resizeObserver.observe(stage);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(section);

    startLoop();

    document.fonts?.ready
      .then(() => {
        if (isVisible && rafId === null) {
          drawFrame(performance.now());
        }
      })
      .catch(() => {});

    return () => {
      stopLoop();
      motionQuery?.removeEventListener?.("change", onMotionChange);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    pointerRef.current = {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onPointerDown={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
      className="relative flex min-h-[100svh] sm:min-h-[100dvh] flex-col justify-center overflow-hidden border-b border-[#EAEAEA] bg-[#FFFFFF] pt-16 pb-6 sm:pt-20 sm:pb-8 xl:pt-[76px]"
      style={{ touchAction: "pan-y" }}
    >
      {/* Central Interactive Glyph Matrix + Monumental Roman/Italic Serif Display */}
      <div
        ref={stageRef}
        className="relative my-auto flex min-h-[380px] w-full flex-1 items-center justify-center sm:min-h-[460px] lg:min-h-[540px]"
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <h1
            className="font-serif text-[clamp(3.15rem,11.5vw,8.5rem)] leading-[0.95] tracking-[-0.03em] text-[#111111]"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              textShadow: "0 0 28px rgba(255, 255, 255, 0.72)",
            }}
          >
            <span className="sr-only">Joshua Abdiel: </span>
            <span className="font-semibold not-italic">Type</span>{" "}
            <span className="font-normal italic tracking-[-0.025em]">Systems</span>
          </h1>
          <p className="sr-only">
            {personalInfo.name}, {personalInfo.role}. {personalInfo.headline}{" "}
            {personalInfo.bio}
          </p>
        </div>
      </div>
    </section>
  );
}

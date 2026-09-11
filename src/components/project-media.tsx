"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowsOut } from "@phosphor-icons/react";

const PROJECT_MEDIA_FALLBACK = "/images/projects/pokemon-app.jpg";

export function isVideoSrc(src: string | undefined | null): boolean {
  return !!src && /\.mp4($|\?)/i.test(src.trim());
}

export function resolveProjectImage(src: string | undefined | null): string {
  if (!src || !src.trim()) return PROJECT_MEDIA_FALLBACK;
  const t = src.trim();
  if (t.startsWith("/") || t.startsWith("https://") || t.startsWith("http://")) return t;
  return PROJECT_MEDIA_FALLBACK;
}

interface ProjectMediaProps {
  src: string | undefined | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

/** Image cover with mp4 support (autoplay, muted, loop + fullscreen without cropping). */
export function ProjectMedia({ src, alt, sizes, priority }: ProjectMediaProps) {
  const resolved = resolveProjectImage(src);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    if (!isVideoSrc(resolved)) return;
    const onChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFs(fs);
      // Native controls only in fullscreen so the inline card stays clean.
      if (videoRef.current) videoRef.current.controls = fs;
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [resolved]);

  if (isVideoSrc(resolved)) {
    const openFullscreen = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const video = videoRef.current;
      if (!video) return;
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => {});
        return;
      }
      // Fullscreen the frame (not the video alone) so the 16:9 box becomes a
      // full-viewport stage and the video fits with contain — no cropping.
      const frame = video.parentElement ?? video;
      frame.classList.add("pm-frame");
      if (frame.requestFullscreen) {
        void frame.requestFullscreen().catch(() => {
          video.requestFullscreen?.();
        });
      } else {
        (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.();
      }
    };

    return (
      <>
        <style>{`.pm-frame:fullscreen{width:100vw!important;height:100vh!important;max-width:none!important;aspect-ratio:auto!important;background:#000!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;margin:0!important;border-radius:0!important}.pm-frame:fullscreen video{position:static!important;width:100vw!important;height:100vh!important;object-fit:contain!important;background:#000!important}video:fullscreen{object-fit:contain!important;background:#000!important}`}</style>
        <video
          ref={videoRef}
          src={resolved}
          className="absolute inset-0 h-full w-full bg-black object-contain"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
        <button
          type="button"
          onClick={openFullscreen}
          aria-label={isFs ? `Exit ${alt} fullscreen` : `View ${alt} fullscreen`}
          title={isFs ? "Exit fullscreen" : "View fullscreen"}
          className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-[4px] border border-white/20 bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/80"
        >
          <ArrowsOut size={12} weight="bold" />
          <span>{isFs ? "Exit" : "Fullscreen"}</span>
        </button>
      </>
    );
  }
  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      priority={priority}
    />
  );
}

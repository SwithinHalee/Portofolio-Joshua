"use client";

import { useRef } from "react";
import Image from "next/image";
import { Reveal, useStickyBottomPin } from "@/components/motion-wrapper";

export function Workspace() {
  const sectionRef = useRef<HTMLElement>(null);

  useStickyBottomPin(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="workspace"
      className="dark-section z-0 pt-20 md:pt-28 pb-16 md:pb-24 border-b border-[#222222] md:border-b-0 md:shadow-[0_6px_0_#111111] bg-[#111111] text-[#FAFAFA] md:min-h-[100dvh] md:flex md:flex-col md:justify-center md:sticky md:top-[calc(100dvh-1327px)]"
    >
      <div className="w-full mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-8 xl:px-10">
        <div className="relative">
          {/* Editorial Header: centered above on mobile/tablet, layered upper-right at a higher z-level on desktop */}
          <Reveal className="relative z-20 mx-auto max-w-3xl text-center lg:absolute lg:top-0 lg:right-0 lg:mx-0 lg:max-w-none lg:text-right">
            <h2
              className="text-3xl sm:text-5xl lg:text-[2.15rem] xl:text-[2.65rem] font-serif text-[#FFFFFF] tracking-[-0.025em] leading-[1.08] mb-3.5 lg:[text-shadow:0_2px_16px_rgba(17,17,17,0.92)]"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              <span className="lg:whitespace-nowrap">Engineering Studio &amp;</span>{" "}
              <br className="hidden lg:inline" />
              <span className="lg:whitespace-nowrap">Operational Setup</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A3A3A3] font-sans max-w-xl lg:max-w-[320px] xl:max-w-[340px] mx-auto lg:ml-auto lg:mr-0 leading-relaxed lg:[text-shadow:0_2px_14px_rgba(17,17,17,0.95)]">
              A deliberate workspace built for sustained focus, rapid prototyping, and architectural
              precision. Combining ergonomic hardware with strict software tooling.
            </p>
          </Reveal>

          {/* Transparent Rear-View Composite Stage seamlessly integrated onto #111111 */}
          <Reveal delay={0.08} className="relative z-10 mx-auto mt-6 sm:mt-8 lg:mt-8 max-w-4xl">
            {/* Subtle ambient studio key light behind subject & display */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_50%_at_50%_46%,rgba(255,255,255,0.065),transparent_72%)]"
            />

            <div className="relative w-full aspect-[1159/667] overflow-hidden">
              <Image
                src="/images/workspace/setup-studio.png"
                alt="Rear view of Joshua Abdiel seated at his engineering desk and operational setup"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 896px) 100vw, 896px"
                priority={false}
              />
              {/* Subtle bottom dissolve so chair base anchors organically into #111111 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
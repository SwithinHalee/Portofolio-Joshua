import Image from "next/image";
import { WORKSPACE_SETUP } from "@/data/portfolio";

export function Workspace() {
  return (
    <section id="workspace" className="py-24 md:py-32 border-b border-[#EAEAEA] bg-[#FBFBFA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-2">
            <span>04 / PHYSICAL & DIGITAL ENVIRONMENT</span>
            <span className="text-[#EAEAEA]">•</span>
            <span>OPERATIONAL RIGOR</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            Engineering Studio & Operational Setup
          </h2>
          <p className="text-sm sm:text-base text-[#555555]">
            A deliberate workspace built for sustained focus, rapid prototyping, and architectural
            precision. Combining ergonomic hardware with strict software tooling.
          </p>
        </div>

        {/* Editorial Photo Display with Faux-OS Window Chrome */}
        <div className="mb-14 rounded-[10px] border border-[#EAEAEA] bg-[#FFFFFF] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] bg-[#FFFFFF] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5] inline-block"></span>
            </div>
            <span className="font-mono text-[11px] text-[#787774]">
              workspace-environment.raw — studio-interior [calm focus]
            </span>
            <span className="font-mono text-[11px] text-[#346538] bg-[#EDF3EC] px-2 py-0.5 rounded border border-[#D5E8D4]">
              ONLINE
            </span>
          </div>

          <div className="relative aspect-[16/9] w-full bg-[#F7F6F3]">
            <Image
              src="/images/workspace.jpg"
              alt="Joshua Abdiel engineering desk and workspace setup"
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.01]"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={false}
            />
            {/* Subtle warm grain / film overlay */}
            <div className="absolute inset-0 bg-[#111111]/[0.02] pointer-events-none"></div>
          </div>
        </div>

        {/* Setup Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WORKSPACE_SETUP.map((group) => (
            <div
              key={group.category}
              className="rounded-[8px] border border-[#EAEAEA] bg-[#FFFFFF] p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold mb-4 pb-2 border-b border-[#EAEAEA]">
                  {group.category}
                </h3>

                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.name} className="text-xs">
                      <span className="font-medium text-[#111111] block mb-0.5">
                        {item.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#666666] leading-relaxed block">
                        {item.spec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
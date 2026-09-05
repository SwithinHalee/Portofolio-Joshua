import { TECH_CATEGORIES } from "@/data/portfolio";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

export function Dossier() {
  return (
    <section id="dossier" className="py-24 md:py-32 border-b border-[#222222] bg-[#0E0E0E] text-[#FFFFFF]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#888888] uppercase tracking-wider mb-2">
              <span>04 / TECHNICAL DOSSIER</span>
              <span className="text-[#333333]">•</span>
              <span>CAPABILITY MATRIX</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-white tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Technical Stack & Tooling Discipline
            </h2>
            <p className="text-sm sm:text-base text-[#AAAAAA]">
              A transparent inventory of frameworks, libraries, systems, and workflow utilities
              leveraged in day-to-day software development and system architecture.
            </p>
          </div>
        </Reveal>

        {/* Dossier Grid with Stagger */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TECH_CATEGORIES.map((category) => (
            <StaggerItem key={category.title}>
              <div className="h-full flex flex-col justify-between rounded-[8px] border border-[#242424] bg-[#141414] p-6 sm:p-7 transition-colors duration-150 hover:border-[#383838] hover:bg-[#181818]">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#888888] mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Skill Items */}
                  <div className="space-y-3.5">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="border-t border-[#242424] pt-3 text-xs flex flex-col gap-1 group/skill cursor-default"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white font-sans group-hover/skill:text-[#4ADE80] transition-colors">
                            {skill.name}
                          </span>
                          {skill.kbd && (
                            <kbd className="border border-[#2A2A2A] bg-[#202020] text-[#CCCCCC] shadow-none font-mono text-[10px] px-1.5 py-0.5 rounded">
                              {skill.kbd}
                            </kbd>
                          )}
                        </div>
                        <span className="text-[11px] text-[#999999] font-mono leading-relaxed">
                          {skill.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
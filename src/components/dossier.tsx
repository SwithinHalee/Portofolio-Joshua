import { TECH_CATEGORIES } from "@/data/portfolio";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

export function Dossier() {
  return (
    <section id="dossier" className="py-24 md:py-32 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-2">
              <span>02 / TECHNICAL DOSSIER</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>CAPABILITY MATRIX</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Technical Stack & Tooling Discipline
            </h2>
            <p className="text-sm sm:text-base text-[#555555]">
              A transparent inventory of frameworks, libraries, systems, and workflow utilities
              leveraged in day-to-day software development and system architecture.
            </p>
          </div>
        </Reveal>

        {/* Dossier Grid with Stagger */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TECH_CATEGORIES.map((category) => (
            <StaggerItem key={category.title}>
              <div className="h-full flex flex-col justify-between rounded-[8px] border border-[#EAEAEA] bg-[#FBFBFA] p-6 sm:p-7 transition-all duration-200 hover:border-[#CCCCCC] hover:bg-[#FFFFFF] hover:shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#787774] mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Skill Items */}
                  <div className="space-y-3.5">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="border-t border-[#EAEAEA] pt-3 text-xs flex flex-col gap-1 group/skill cursor-default"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#111111] font-sans group-hover/skill:text-[#000000]">
                            {skill.name}
                          </span>
                          {skill.kbd && (
                            <kbd className="transition-transform group-hover/skill:scale-105">
                              {skill.kbd}
                            </kbd>
                          )}
                        </div>
                        <span className="text-[11px] text-[#666666] font-mono leading-relaxed">
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
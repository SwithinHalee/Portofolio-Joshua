import { EXPERIENCES, EDUCATION_HISTORY } from "@/data/portfolio";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

export function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-2">
              <span>05 / CHRONOLOGY</span>
              <span className="text-[#EAEAEA]">•</span>
              <span>EXPERIENCE & FORMAL EDUCATION</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              Milestones & Trajectory
            </h2>
            <p className="text-sm sm:text-base text-[#555555]">
              Professional engineering engagements, industry contributions, and academic background
              in Information Systems.
            </p>
          </div>
        </Reveal>

        {/* Experience Timeline */}
        <div className="mb-16">
          <Reveal delay={0.05}>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#787774] mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#111111]"></span>
              <span>{"// INDUSTRY ENGAGEMENT"}</span>
            </h3>
          </Reveal>

          <StaggerContainer className="border-t border-[#EAEAEA] divide-y divide-[#EAEAEA]">
            {EXPERIENCES.map((exp) => (
              <StaggerItem key={exp.company}>
                <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group">
                  <div className="md:col-span-3 font-mono text-xs text-[#787774]">
                    <span className="font-medium text-[#111111]">{exp.period}</span>
                    <div className="mt-1 text-[11px] text-[#888888]">{exp.location}</div>
                  </div>

                  <div className="md:col-span-9">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2.5">
                      <span className="text-lg sm:text-xl font-serif font-medium text-[#111111]">
                        {exp.role}
                      </span>
                      <span className="text-sm text-[#787774]">@</span>
                      <span className="text-sm font-semibold text-[#111111]">{exp.company}</span>
                      <span className="rounded-full bg-[#EDF3EC] px-2.5 py-0.5 text-[10px] font-mono text-[#346538] border border-[#D5E8D4] ml-2">
                        {exp.type}
                      </span>
                    </div>

                    <p className="text-sm text-[#555555] leading-relaxed mb-4 font-sans">
                      {exp.impact}
                    </p>

                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-[#787774]">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Education Timeline */}
        <div>
          <Reveal delay={0.1}>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#787774] mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#787774]"></span>
              <span>{"// ACADEMIC FOUNDATION"}</span>
            </h3>
          </Reveal>

          <StaggerContainer className="border-t border-[#EAEAEA] divide-y divide-[#EAEAEA]">
            {EDUCATION_HISTORY.map((edu) => (
              <StaggerItem key={edu.institution}>
                <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#787774]">
                    {edu.period}
                  </div>

                  <div className="md:col-span-9">
                    <div className="text-base font-medium text-[#111111] mb-1">
                      {edu.institution}
                    </div>
                    <div className="text-xs font-mono text-[#787774] mb-2">{edu.degree}</div>
                    <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                      {edu.details}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
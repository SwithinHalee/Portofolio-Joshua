import { ENGINEERING_PRINCIPLES } from "@/data/portfolio";

export function Principles() {
  return (
    <section id="principles" className="py-24 md:py-32 border-b border-[#EAEAEA]">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <div className="flex items-center gap-2 font-mono text-xs text-[#787774] uppercase tracking-wider mb-2">
            <span>03 / SYSTEM ARCHITECTURE</span>
            <span className="text-[#EAEAEA]">•</span>
            <span>ENGINEERING PRINCIPLES</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-serif text-[#111111] tracking-[-0.02em] mb-4"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            Engineering Tenets & Values
          </h2>
          <p className="text-sm sm:text-base text-[#555555]">
            Non-negotiable architectural tenets governing code clarity, performance budgets,
            and interface reliability across every project.
          </p>
        </div>

        {/* Principles Rows */}
        <div className="divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
          {ENGINEERING_PRINCIPLES.map((principle) => (
            <div
              key={principle.number}
              className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group hover:bg-[#FBFBFA] transition-colors -mx-4 px-4 rounded-[4px]"
            >
              <div className="md:col-span-2 font-mono text-sm text-[#787774] font-medium">
                [{principle.number}]
              </div>
              <div className="md:col-span-4">
                <h3 className="text-lg font-serif text-[#111111] font-medium tracking-tight">
                  {principle.title}
                </h3>
              </div>
              <div className="md:col-span-6 text-sm text-[#555555] leading-relaxed">
                {principle.statement}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
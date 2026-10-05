import { BrandChevron, SectionLabel } from "@/components/brand/marks";
import { AmbientOrbs } from "@/components/motion/ambient";
import { Reveal } from "@/components/motion/scroll-effects";
import { site } from "@/content/site";

/** Тёмная секция с медленными «орбами» — белая «галочка» врезается сверху, как на визитке из гайда */
export function Risks() {
  const { risks } = site;
  return (
    <section
      aria-labelledby="risks-title"
      data-header-theme="dark"
      className="grain relative overflow-hidden bg-night pb-(--section-space) pt-[calc(var(--section-space)+6vw)] text-white clip-chevron-top"
    >
      <AmbientOrbs />

      <div className="container-brand relative">
        <Reveal>
          <SectionLabel index="04" tone="dark">
            {risks.label}
          </SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="risks-title" className="mt-6 max-w-4xl font-heading text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {risks.title}
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-px bg-white/10 md:grid-cols-2">
          {risks.items.map((risk, index) => (
            <li key={risk.title} className="bg-night/80 backdrop-blur-sm">
              <Reveal delay={0.06 * (index % 2)} className="h-full p-8 md:p-12">
                <BrandChevron className="h-3 text-brand-red" />
                <p className="mt-6 flex items-baseline gap-3 font-condensed font-bold leading-none">
                  <span className="text-7xl md:text-8xl">{risk.value}</span>
                  <span className="text-2xl text-white/60 md:text-3xl">{risk.unit}</span>
                </p>
                <h3 className="mt-8 font-heading text-2xl font-bold leading-tight">{risk.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-white/70">{risk.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

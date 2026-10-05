import { Logo } from "@/components/brand/logo";
import { SectionLabel } from "@/components/brand/marks";
import { Counter, DotGrid } from "@/components/motion/ambient";
import { Reveal } from "@/components/motion/scroll-effects";
import { StickyMediaList } from "@/components/motion/sticky-media-list";
import { site } from "@/content/site";

export function Services() {
  const { services } = site;
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      data-header-theme="light"
      className="bg-white pb-(--section-space)"
    >
      <div className="container-brand">
        <div className="border-t border-ink/15 pt-[calc(var(--section-space)*0.7)]">
          <Reveal>
            <SectionLabel index="06">{services.label}</SectionLabel>
            <h2 id="services-title" className="mt-6 max-w-3xl font-heading text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
              {services.title}
            </h2>
          </Reveal>
        </div>
        <StickyMediaList items={services.items} className="mt-14" />
      </div>
    </section>
  );
}

export function Facts() {
  const { facts } = site;
  return (
    <section
      aria-labelledby="facts-title"
      data-header-theme="dark"
      className="relative overflow-hidden bg-pattern-red py-(--section-space) text-white"
    >
      <div className="container-brand relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionLabel index="07" tone="red">
              {facts.label}
            </SectionLabel>
            <h2 id="facts-title" className="mt-6 max-w-3xl font-heading text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              {facts.title}
            </h2>
          </Reveal>
          <Logo variant="inverse" className="h-12 md:h-14" />
        </div>

        <ul className="mt-14 grid gap-px bg-white/20 sm:grid-cols-2 xl:grid-cols-4">
          {facts.items.map((fact) => (
            <li key={fact.label} className="relative flex min-h-60 flex-col justify-end overflow-hidden bg-brand-maroon/40 p-8">
              <DotGrid rgb="255, 255, 255" baseAlpha={0.12} />
              <p className="relative whitespace-nowrap font-condensed text-6xl font-bold leading-none tabular-nums md:text-7xl xl:text-6xl 2xl:text-7xl">
                <Counter value={fact.value} suffix={fact.suffix} />
              </p>
              <p className="relative mt-4 max-w-[16rem] text-base leading-snug text-white/85">{fact.label}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-white/90">{facts.note}</p>
      </div>
    </section>
  );
}

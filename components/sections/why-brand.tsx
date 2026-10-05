import { Gem, Languages, Network, Scale, ShieldCheck, Store, type LucideIcon } from "lucide-react";
import { SectionLabel } from "@/components/brand/marks";
import { OpposingWords, Reveal, ScrollHighlightText } from "@/components/motion/scroll-effects";
import { site } from "@/content/site";

export function Manifesto() {
  const { manifesto } = site;
  return (
    <section
      id="why"
      aria-labelledby="manifesto-title"
      data-header-theme="light"
      className="bg-white pb-(--section-space) pt-[calc(var(--section-space)*0.6)]"
    >
      <div className="container-brand">
        <SectionLabel index="02" as="h2" id="manifesto-title">
          {manifesto.label}
        </SectionLabel>
        <ScrollHighlightText
          text={manifesto.text}
          accent={manifesto.accent}
          className="mt-10 max-w-6xl font-heading text-[clamp(2rem,1.1rem+3.6vw,4.75rem)] font-bold leading-[1.08] tracking-tight"
        />
      </div>
    </section>
  );
}

const BENEFIT_ICONS: readonly LucideIcon[] = [ShieldCheck, Gem, Store, Scale, Network, Languages];

export function Benefits() {
  const { benefits } = site;
  return (
    <section aria-labelledby="benefits-title" data-header-theme="light" className="relative bg-brand-mist py-(--section-space)">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-pattern-light opacity-60" />

      <div className="container-brand relative">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <SectionLabel index="03">{benefits.label}</SectionLabel>
            <h2 id="benefits-title" className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
              {benefits.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:pt-14">
            <p className="text-lg leading-relaxed text-brand-graphite">{benefits.lead}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid border-l border-t border-ink/15 md:grid-cols-2 lg:grid-cols-3">
          {benefits.items.map((item, index) => {
            const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];
            return (
              <li key={item.title} className="group relative border-b border-r border-ink/15 bg-white/75">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-grad-red opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
                />
                <Reveal delay={0.06 * (index % 3)} className="relative flex h-full flex-col p-8 md:p-10">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="font-condensed text-sm font-semibold tabular-nums text-brand-red transition-colors duration-200 group-hover:text-white/80"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon aria-hidden="true" className="size-7 text-brand-graphite transition-colors duration-200 group-hover:text-white" />
                  </div>
                  <h3 className="mt-12 font-heading text-2xl font-bold leading-tight text-ink transition-colors duration-200 group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-brand-graphite transition-colors duration-200 group-hover:text-white/85">
                    {item.text}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** «Ваше право / быть брендом» — гигантские слова, разъезжающиеся при прокрутке */
export function SloganBand() {
  return (
    <div data-header-theme="light" className="bg-white py-12 md:py-20">
      <OpposingWords top={site.opposingWords.top} bottom={site.opposingWords.bottom} />
    </div>
  );
}

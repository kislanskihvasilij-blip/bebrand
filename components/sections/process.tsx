import { SectionLabel } from "@/components/brand/marks";
import { Reveal, ScrollProgressLine } from "@/components/motion/scroll-effects";
import { site } from "@/content/site";

export function Process() {
  const { process } = site;
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      data-header-theme="light"
      className="bg-white py-(--section-space)"
    >
      <div className="container-brand grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionLabel index="05">{process.label}</SectionLabel>
              <h2 id="process-title" className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
                {process.title}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-graphite">{process.lead}</p>
              <p className="mt-8 max-w-md border-l-4 border-brand-red bg-brand-mist px-5 py-4 text-base leading-relaxed text-ink">
                {process.note}
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="relative lg:col-span-6 lg:col-start-7">
          <ScrollProgressLine className="bottom-3 left-[1.375rem] top-3 md:left-[1.875rem]" />
          {process.steps.map((step, index) => (
            <li key={step.title} className="relative grid grid-cols-[auto_1fr] gap-6 pb-14 last:pb-0 md:gap-10">
              <span
                aria-hidden="true"
                className="relative z-10 flex size-11 items-center justify-center bg-white font-condensed text-lg font-bold tabular-nums text-brand-red ring-1 ring-ink/15 md:size-15 md:text-2xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <Reveal className="pt-1 md:pt-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">{step.duration}</p>
                <h3 className="mt-2 font-heading text-2xl font-bold leading-tight text-ink md:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-brand-graphite">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

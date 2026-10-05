import { BrandChevron, SectionLabel } from "@/components/brand/marks";
import { Marquee } from "@/components/motion/ambient";
import { ParallaxImage, Reveal } from "@/components/motion/scroll-effects";
import { site } from "@/content/site";

/** Красная лента с городами ЮФО — бегущая строка 75 px/с, как на auros.global */
export function RegionsBand() {
  return (
    <section aria-labelledby="regions-title" data-header-theme="dark" className="relative bg-pattern-red py-6 text-white md:py-8">
      <h2 id="regions-title" className="sr-only">
        Работаю в Краснодаре и по всему Южному федеральному округу
      </h2>
      <Marquee
        items={site.regions.map((city) => (
          <span key={city} className="flex items-center gap-12 font-heading text-3xl font-bold italic md:text-5xl">
            {city}
            <BrandChevron className="h-4 text-white/45 md:h-5" />
          </span>
        ))}
      />
    </section>
  );
}

export function About() {
  const { about } = site;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      data-header-theme="light"
      className="relative overflow-clip bg-white py-(--section-space)"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-pattern-light opacity-70 [mask-image:linear-gradient(to_left,#000_15%,transparent)] lg:block"
      />

      <div className="container-brand relative grid gap-16 lg:grid-cols-12 lg:gap-16">
        <div className="relative self-start lg:sticky lg:top-28 lg:col-span-5">
          <ParallaxImage
            src={about.photo}
            alt={about.photoAlt}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="aspect-[4/5] w-full bg-brand-mist"
          />
          <div aria-hidden="true" className="absolute -bottom-10 -right-4 w-36 md:-right-8 md:w-52">
            <div className="aspect-[231/167] bg-pattern-red clip-chevron" />
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-8">
          <Reveal>
            <SectionLabel index="01">{about.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="about-title" className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
              {about.title}
            </h2>
          </Reveal>

          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-brand-graphite">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={0.05 * index}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <dl className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-3">
              {about.highlights.map((highlight) => (
                <div key={highlight.label} className="flex flex-col-reverse justify-end gap-2 bg-white p-6">
                  <dt className="text-sm leading-snug text-brand-graphite">{highlight.label}</dt>
                  <dd className="font-condensed text-5xl font-bold leading-none text-brand-red">{highlight.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <blockquote className="mt-12 max-w-2xl border-l-4 border-brand-red pl-6 font-heading text-2xl font-bold italic leading-snug text-brand-red md:text-3xl">
              «{about.quote}»
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

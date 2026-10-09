import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SectionLabel } from "@/components/brand/marks";
import { Reveal } from "@/components/motion/scroll-effects";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { FooterNav } from "./footer-nav";

const NEW_TAB_HINT = "(откроется в новой вкладке)";

/** Контакты в духе оборота визитки из гайда: белая «галочка» врезается в красное поле */
export function Contact() {
  const { contact } = site;
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      data-header-theme="dark"
      className="relative overflow-hidden bg-pattern-red pb-(--section-space) pt-[calc(var(--section-space)+7vw)] text-white clip-chevron-top"
    >
      <div className="container-brand relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <SectionLabel index="09" tone="red">
            {contact.label}
          </SectionLabel>
          <h2 id="contact-title" className="mt-6 font-heading text-5xl font-bold italic leading-[0.98] tracking-tight md:text-7xl">
            {contact.title}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/85">{contact.text}</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/90">{contact.area}</p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <ul className="space-y-3">
            {contact.channels.map((channel, index) => (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center justify-between gap-6 px-6 py-5 transition-colors duration-200",
                    index === 0
                      ? "bg-white text-brand-red hover:bg-brand-mist"
                      : "border border-white/40 text-white hover:border-white hover:bg-white hover:text-brand-red",
                  )}
                >
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] opacity-90">{channel.label}</span>
                    <span className="mt-1 block font-heading text-2xl font-bold">{channel.value}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                  <span className="sr-only">{NEW_TAB_HINT}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-white/25 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">{contact.hotline.label}</p>
            <a
              href={contact.hotline.href}
              className="mt-3 block whitespace-nowrap font-condensed text-4xl font-bold leading-none tracking-tight sm:text-5xl xl:text-6xl"
            >
              {contact.hotline.value}
            </a>
            <a
              href={contact.website.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-5 inline-block text-base text-white/85"
            >
              {contact.website.label}: {contact.website.value}
              <span className="sr-only"> {NEW_TAB_HINT}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Год считает серверный page.tsx: клиентский new Date() в рендере расходится с пререндером при смене года */
export function SiteFooter({ year }: { year: number }) {
  const { footer, contact, nav, person } = site;
  const telegram = contact.channels[0];

  return (
    <footer data-header-theme="dark" className="bg-night text-white/70">
      <div className="container-brand grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo variant="inverse" className="h-12" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{footer.tagline}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">{footer.headOffice}</p>
          <a
            href={contact.website.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white"
          >
            {contact.website.label}: {contact.website.value}
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only"> {NEW_TAB_HINT}</span>
          </a>
        </div>

        <FooterNav items={nav} />

        <div className="space-y-3 text-sm md:col-span-4">
          <p className="font-heading text-lg font-bold italic text-white">{person.name}</p>
          <p>{person.role}</p>
          <a href={telegram.href} target="_blank" rel="noopener noreferrer" className="link-underline block w-fit hover:text-white">
            {telegram.label}: {telegram.value}
            <span className="sr-only"> {NEW_TAB_HINT}</span>
          </a>
          <a href={contact.hotline.href} className="link-underline block w-fit hover:text-white">
            {contact.hotline.value}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-brand flex flex-col gap-3 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {year} {person.name}</p>
          <p className="max-w-2xl md:text-right">{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}

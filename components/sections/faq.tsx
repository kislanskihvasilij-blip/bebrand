import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/brand/marks";
import { Reveal } from "@/components/motion/scroll-effects";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { site } from "@/content/site";

export function Faq() {
  const { faq, contact } = site;
  const telegram = contact.channels[0];

  return (
    <section id="faq" aria-labelledby="faq-title" data-header-theme="light" className="bg-white py-(--section-space)">
      <div className="container-brand grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionLabel index="08">{faq.label}</SectionLabel>
              <h2 id="faq-title" className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
                {faq.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 bg-brand-mist p-6 md:p-8">
                <p className="font-heading text-xl font-bold italic text-ink">Не нашли ответ?</p>
                <p className="mt-2 text-base leading-relaxed text-brand-graphite">
                  Спросите напрямую — отвечу в течение рабочего дня.
                </p>
                <a
                  href={telegram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sweep mt-6 inline-flex items-center gap-2 whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                >
                  Написать в {telegram.label}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                  <span className="sr-only">(откроется в новой вкладке)</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Раскрытие — 0.6 с на кривой cubic-bezier(.625,.05,0,1), как аккордеон на auros.global.
            Только переменные анимации: transition-duration на панели Base UI считает конфликтом.
            hiddenUntilFound: закрытые ответы остаются в HTML (их видят поисковики, находит Ctrl+F) */}
        <Accordion
          hiddenUntilFound
          className="border-t border-ink/15 lg:col-span-7 lg:col-start-6 **:data-[slot=accordion-content]:[--tw-animation-duration:600ms] **:data-[slot=accordion-content]:[--tw-ease:cubic-bezier(0.625,0.05,0,1)]">
          {faq.items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`} className="border-b border-ink/15">
              <AccordionTrigger className="gap-6 rounded-none py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red focus-visible:outline-solid font-heading text-xl font-bold leading-snug text-ink transition-colors duration-200 hover:text-brand-red hover:no-underline md:py-7 md:text-2xl **:data-[slot=accordion-trigger-icon]:mt-1 **:data-[slot=accordion-trigger-icon]:size-6 **:data-[slot=accordion-trigger-icon]:text-brand-red">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-2xl pb-7 text-base leading-relaxed text-brand-graphite md:text-lg">
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

import { About, RegionsBand } from "@/components/sections/about";
import { Contact, SiteFooter } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Risks } from "@/components/sections/risks";
import { Facts, Services } from "@/components/sections/services";
import { SiteHeader } from "@/components/sections/site-header";
import { Benefits, Manifesto, SloganBand } from "@/components/sections/why-brand";
import { site } from "@/content/site";

// Структурированные данные для поиска по региону (Яндекс / Google): услуга, город, зона обслуживания
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${site.person.name} — ${site.person.role}`,
  description: site.meta.description,
  areaServed: [
    { "@type": "City", name: "Краснодар" },
    { "@type": "AdministrativeArea", name: "Южный федеральный округ" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Краснодар", addressCountry: "RU" },
  telephone: "+7-800-250-88-61",
  sameAs: site.contact.channels.map((channel) => channel.href),
  parentOrganization: { "@type": "Organization", name: "BEBRAND", url: "https://biz-brand.ru/" },
  employee: { "@type": "Person", name: site.person.name, jobTitle: site.person.role },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <RegionsBand />
        <About />
        <Manifesto />
        <Benefits />
        <SloganBand />
        <Risks />
        <Process />
        <Services />
        <Facts />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}

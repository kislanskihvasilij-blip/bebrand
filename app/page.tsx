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
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const absoluteUrl = (path: string) => new URL(path, siteUrl).href;
// Профили для sameAs — без MAX: его ссылка содержит одноразовый токен, а не постоянный профиль
const profileLinks = site.contact.channels.filter((channel) => channel.id !== "max").map((channel) => channel.href);

// Структурированные данные для поиска по региону (Яндекс / Google): услуга, город, зона обслуживания.
// Федеральная горячая линия — в contactPoint, чтобы не выдавать её за местный номер.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": absoluteUrl("/#business"),
      name: `${site.person.name} — ${site.person.role}`,
      description: site.meta.description,
      url: siteUrl.href,
      image: absoluteUrl("/opengraph-image.jpg"),
      brand: { "@type": "Brand", name: "BEBRAND" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Краснодар",
        addressRegion: "Краснодарский край",
        addressCountry: "RU",
      },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Южный федеральный округ" },
        ...site.regions.map((city) => ({ "@type": "City", name: city })),
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+7-800-250-88-61",
        contactType: "customer service",
        contactOption: "TollFree",
        areaServed: "RU",
        availableLanguage: "ru",
      },
      sameAs: profileLinks,
    },
    {
      "@type": "Person",
      "@id": absoluteUrl("/#person"),
      name: site.person.name,
      jobTitle: site.person.role,
      image: absoluteUrl(site.about.photo),
      worksFor: { "@id": absoluteUrl("/#business") },
      memberOf: { "@type": "Organization", name: "BEBRAND", url: "https://biz-brand.ru/" },
      sameAs: profileLinks,
    },
  ],
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
      <SiteFooter year={new Date().getFullYear()} />
    </>
  );
}

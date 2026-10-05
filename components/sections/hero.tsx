"use client";

import { useCallback } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Logo } from "@/components/brand/logo";
import { BrandChevron } from "@/components/brand/marks";
import { useAnchorNavigation, useScrollLock } from "@/components/providers/smooth-scroll";
import { site } from "@/content/site";

const HERO_LOCK_ID = "hero";

/** Первый экран: фото «раскрывается» прокруткой, пока плавный скролл страницы заморожен */
export function Hero() {
  const { setLock } = useScrollLock();
  const handleExpandedChange = useCallback(
    (isExpanded: boolean) => setLock(HERO_LOCK_ID, !isExpanded),
    [setLock],
  );
  const { hero } = site;

  return (
    <div id="top" data-header-theme="dark" className="bg-night text-white">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={hero.media}
        mediaAlt={hero.mediaAlt}
        bgImageSrc={hero.background}
        title={hero.title}
        date={hero.date}
        scrollToExpand={hero.scrollHint}
        mediaPosition="50% 28%"
        mediaOverlay={<HeroOverlay />}
        onExpandedChange={handleExpandedChange}
      >
        <HeroIntro />
      </ScrollExpandMedia>
    </div>
  );
}

function HeroOverlay() {
  return (
    <div className="flex w-full items-end justify-between gap-6 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 pt-24 md:p-10 md:pt-32">
      <div>
        <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/80 md:text-xs">
          <BrandChevron className="h-3 text-brand-red" />
          {site.hero.overlayLabel}
        </p>
        <p className="mt-3 font-heading text-4xl font-bold italic leading-[0.95] text-white md:text-7xl">
          {site.person.name}
        </p>
      </div>
      <Logo variant="inverse" className="hidden h-11 md:block" />
    </div>
  );
}

function HeroIntro() {
  const { intro } = site.hero;
  const handleAnchorClick = useAnchorNavigation();

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-14">
      <p className="font-heading text-2xl font-semibold leading-snug text-white md:col-span-7 md:text-4xl md:leading-tight">
        {intro.lead}
      </p>
      <div className="md:col-span-5">
        <ul className="space-y-4">
          {intro.points.map((point) => (
            <li key={point} className="flex gap-3 text-base leading-relaxed text-white/80">
              <BrandChevron className="mt-1.5 h-3 text-brand-red" />
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={intro.primaryCta.href}
            onClick={handleAnchorClick}
            className="btn-sweep px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white"
          >
            {intro.primaryCta.label}
          </a>
          <a
            href={intro.secondaryCta.href}
            onClick={handleAnchorClick}
            className="border border-white/30 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink"
          >
            {intro.secondaryCta.label}
          </a>
        </div>
      </div>
    </div>
  );
}

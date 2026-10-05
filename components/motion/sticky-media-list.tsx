"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

export type StickyMediaItem = {
  id: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  meta?: string;
};

type StickyMediaListProps = { items: readonly StickyMediaItem[]; className?: string };

/**
 * Список услуг + «прилипшее» изображение, которое меняется при наведении на строку.
 * Тайминги — из раздела Explore на auros.global: кроссфейд 130 мс, подсветка строки 200 мс.
 */
export function StickyMediaList({ items, className }: StickyMediaListProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const active = items.find((item) => item.id === activeId) ?? items[0];
  if (!active) return null;

  return (
    <div className={cn("grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16", className)}>
      <ol className="border-b border-ink/15">
        {items.map((item, index) => {
          const isActive = item.id === active.id;
          return (
            <li
              key={item.id}
              onPointerEnter={() => setActiveId(item.id)}
              onFocusCapture={() => setActiveId(item.id)}
              data-active={isActive}
              className="group relative border-t border-ink/15 transition-colors duration-200 hover:border-transparent [li:hover+&]:border-transparent"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-grad-mist opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 group-data-[active=true]:opacity-60"
              />
              <div className="relative grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 px-1 py-7 sm:px-4 md:gap-x-8">
                <span className="pt-1.5 font-condensed text-sm font-semibold tabular-nums text-brand-red">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="flex items-start justify-between gap-4 font-heading text-2xl font-bold leading-tight text-ink md:text-[1.75rem]">
                    {item.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 size-6 shrink-0 text-brand-red transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </h3>
                  {item.meta && (
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-graphite">{item.meta}</p>
                  )}
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-brand-graphite">{item.text}</p>
                  <div className="relative mt-5 aspect-[16/10] overflow-hidden lg:hidden">
                    <Image src={item.image} alt={item.alt} fill sizes="100vw" className="object-cover" />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-[150px] aspect-[4/3.4] overflow-hidden bg-brand-mist">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.13, ease: EASE.quadOut }}
            >
              <Image src={active.image} alt={active.alt} fill sizes="45vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          <span
            aria-hidden="true"
            className="absolute -bottom-px left-0 h-16 w-28 bg-brand-red clip-chevron"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
 * Тайминги — из раздела Explore на auros.global: смена картинки 130 мс, подсветка строки 200 мс.
 * Картинки лежат стопкой и проявляются через opacity — настоящий кроссфейд без пустого кадра.
 */
export function StickyMediaList({ items, className }: StickyMediaListProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  if (items.length === 0) return null;
  const activeKey = items.some((item) => item.id === activeId) ? activeId : items[0].id;

  return (
    <div className={cn("grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16", className)}>
      <ol className="border-b border-ink/15">
        {items.map((item, index) => {
          const isActive = item.id === activeKey;
          return (
            <li
              key={item.id}
              onPointerEnter={() => setActiveId(item.id)}
              data-active={isActive}
              className="group relative border-t border-ink/15 transition-colors duration-200 hover:border-transparent [li:hover+&]:border-transparent"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-brand-mist opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 group-data-[active=true]:opacity-70"
              />
              <div className="relative grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 px-1 py-7 sm:px-4 md:gap-x-8">
                <span aria-hidden="true" className="pt-1.5 font-condensed text-sm font-semibold tabular-nums text-brand-red">
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

      {/* Десктопная картинка декоративна: клавиатурой её не переключить, подписи есть у мобильных версий */}
      <div aria-hidden="true" className="hidden lg:block">
        <div className="sticky top-[150px] aspect-[4/3.4] overflow-hidden bg-brand-mist">
          {items.map((item) => (
            <Image
              key={item.id}
              src={item.image}
              alt=""
              fill
              sizes="45vw"
              className={cn(
                "object-cover transition-opacity duration-[130ms] ease-out",
                item.id === activeKey ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <span className="absolute -bottom-px left-0 h-16 w-28 bg-brand-red clip-chevron" />
        </div>
      </div>
    </div>
  );
}

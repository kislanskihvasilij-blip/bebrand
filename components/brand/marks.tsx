import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ELEMENT_PATH, ELEMENT_VIEWBOX } from "./brand-paths";

/** Фирменная асимметричная «галочка» (п. 1.10 гайда) — цвет задаётся через text-* */
export function BrandChevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${ELEMENT_VIEWBOX.width} ${ELEMENT_VIEWBOX.height}`}
      aria-hidden="true"
      className={cn("h-4 w-auto shrink-0 fill-current", className)}
    >
      <path d={ELEMENT_PATH} />
    </svg>
  );
}

type SectionLabelTone = "light" | "dark" | "red";

// Номер на тёмном — белый: красный #AE1613 на #111 даёт лишь 2.6:1. «Галочка» декоративна и остаётся красной.
const LABEL_TONES: Record<SectionLabelTone, { text: string; chevron: string; index: string }> = {
  light: { text: "text-brand-graphite", chevron: "text-brand-red", index: "text-brand-red" },
  dark: { text: "text-white/70", chevron: "text-brand-red", index: "text-white" },
  red: { text: "text-white/90", chevron: "text-white", index: "text-white" },
};

type SectionLabelProps = {
  index: string;
  children: ReactNode;
  tone?: SectionLabelTone;
  /** h2 — когда надзаголовок и есть заголовок секции */
  as?: "p" | "h2";
  id?: string;
  className?: string;
};

/** Надзаголовок секции в духе нумерации гайда: «1.1 ЛОГОТИП» */
export function SectionLabel({ index, children, tone = "light", as: Tag = "p", id, className }: SectionLabelProps) {
  const colors = LABEL_TONES[tone];
  return (
    <Tag
      id={id}
      className={cn(
        "flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] md:text-xs",
        colors.text,
        className,
      )}
    >
      <BrandChevron className={cn("h-3", colors.chevron)} />
      <span aria-hidden="true" className={cn("font-condensed text-sm tabular-nums", colors.index)}>
        {index}
      </span>
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </Tag>
  );
}

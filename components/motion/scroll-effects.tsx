"use client";

import { Fragment, useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE, staggerWindow } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/* ───────── Появление блока при входе в экран ───────── */

type RevealProps = { children: ReactNode; className?: string; delay?: number; y?: number };

export function Reveal({ children, className, delay = 0, y = 40 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: DURATION.reveal, ease: EASE.signature, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── Подсветка текста по мере прокрутки — фирменный приём auros.global ───────── */

type ScrollHighlightTextProps = {
  text: string;
  className?: string;
  /** Цвет «непрочитанного» текста */
  from?: string;
  /** Цвет прочитанного текста */
  to?: string;
  /** Слова, которые загораются фирменным красным */
  accent?: readonly string[];
  accentColor?: string;
};

const normalizeWord = (word: string) => word.toLowerCase().replace(/[.,!?;:«»"()—–]/g, "");

export function ScrollHighlightText({
  text,
  className,
  // #8a8a8a — 3.45:1 на белом: «непрочитанный» крупный текст остаётся читаемым (WCAG 1.4.3)
  from = "#8a8a8a",
  to = "#1b1b1a",
  accent = [],
  accentColor = "#ae1613",
}: ScrollHighlightTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const words = text.split(" ");
  const accentWords = new Set(accent.map(normalizeWord));
  const finalColor = (word: string) => (accentWords.has(normalizeWord(word)) ? accentColor : to);

  if (prefersReducedMotion) {
    return (
      <p ref={ref} className={className}>
        {words.map((word, index) => (
          <Fragment key={index}>
            <span style={{ color: finalColor(word) }}>{word}</span>{" "}
          </Fragment>
        ))}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <HighlightWord
          key={index}
          progress={scrollYProgress}
          range={staggerWindow(index, words.length)}
          from={from}
          to={finalColor(word)}
        >
          {word}
        </HighlightWord>
      ))}
    </p>
  );
}

type HighlightWordProps = {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  from: string;
  to: string;
};

function HighlightWord({ children, progress, range, from, to }: HighlightWordProps) {
  const color = useTransform(progress, range, [from, to]);
  return (
    <>
      <motion.span style={{ color }}>{children}</motion.span>{" "}
    </>
  );
}

/* ───────── Два гигантских слова, разъезжающихся при прокрутке ───────── */

type OpposingWordsProps = { top: string; bottom: string; className?: string };

export function OpposingWords({ top, bottom, className }: OpposingWordsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end start"] });
  // Центр слова проходит от правого края экрана к левому (и наоборот) — как ScrollTrigger на auros
  const xTop = useTransform(scrollYProgress, (value) => `calc(${(1 - value) * 100}vw - 50%)`);
  const xBottom = useTransform(scrollYProgress, (value) => `calc(${value * 100}vw - 50%)`);
  // Без движения слова стоят по краям и мельче — чтобы целиком помещались в экран
  const wordClass = cn(
    "w-max whitespace-nowrap font-heading font-extrabold italic leading-[0.92] tracking-tight",
    prefersReducedMotion ? "text-[clamp(3rem,10vw,12rem)]" : "text-[clamp(4.5rem,16vw,20rem)] will-change-transform",
  );

  return (
    <div ref={ref} aria-hidden="true" className={cn("relative select-none overflow-hidden py-[2vw]", className)}>
      <motion.div
        style={prefersReducedMotion ? undefined : { x: xTop }}
        className={cn(wordClass, "bg-grad-red bg-clip-text pr-[0.1em] text-transparent", prefersReducedMotion && "pl-(--gutter)")}
      >
        {top}
      </motion.div>
      {/* Контур (text-stroke) на вариативном Bitter показывает перекрытия контуров — берём градиент 5→4 */}
      <motion.div
        style={prefersReducedMotion ? undefined : { x: xBottom }}
        className={cn(wordClass, "bg-grad-steel bg-clip-text pr-[0.1em] text-transparent", prefersReducedMotion && "ml-auto pr-(--gutter)")}
      >
        {bottom}
      </motion.div>
    </div>
  );
}

/* ───────── Вертикальная линия, которая заполняется по мере прокрутки списка ───────── */

export function ScrollProgressLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  return (
    <div ref={ref} aria-hidden="true" className={cn("absolute w-px bg-ink/15", className)}>
      <motion.div
        style={{ scaleY: prefersReducedMotion ? 1 : scrollYProgress }}
        className="h-full w-full origin-top bg-brand-red"
      />
    </div>
  );
}

/* ───────── Фото со «шторкой» и параллаксом ───────── */

type ParallaxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
};

export function ParallaxImage({ src, alt, sizes, className, imageClassName }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: EASE.signature }}
    >
      <motion.div style={prefersReducedMotion ? undefined : { y }} className="absolute inset-x-0 -inset-y-[9%]">
        <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", imageClassName)} />
      </motion.div>
    </motion.div>
  );
}

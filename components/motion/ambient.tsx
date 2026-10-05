"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/* ───────── Свечение на тёмном фоне (auros: gradient-canvas) ───────── */

// Орбы стоят на месте и только проявляются за 3 с: бесконечное движение без кнопки паузы
// нарушало бы WCAG 2.2.2, а на скорости одного оборота в минуту оно почти незаметно
const ORBS = [
  { id: "red", size: "95vmin", x: "-22vmin", y: "-12vmin", core: "rgba(174,22,19,0.85)", mid: "rgba(174,22,19,0.45)" },
  { id: "maroon", size: "80vmin", x: "26vmin", y: "14vmin", core: "rgba(108,17,3,0.9)", mid: "rgba(108,17,3,0.5)" },
  { id: "shadow", size: "70vmin", x: "4vmin", y: "22vmin", core: "rgba(0,0,0,0.9)", mid: "rgba(0,0,0,0.55)" },
] as const;

export function AmbientOrbs({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden animate-ambient-in", className)}>
      {ORBS.map((orb) => {
        const style: CSSProperties = {
          width: orb.size,
          height: orb.size,
          marginLeft: `calc(${orb.size} / -2)`,
          marginTop: `calc(${orb.size} / -2)`,
          transform: `translate(${orb.x}, ${orb.y})`,
          background: `radial-gradient(circle, ${orb.core} 0%, ${orb.mid} 44%, transparent 70%)`,
        };
        return <div key={orb.id} className="absolute left-1/2 top-1/2 blur-2xl" style={style} />;
      })}
    </div>
  );
}

/* ───────── Шестиугольная сетка точек, «оживающая» под курсором ───────── */

const DOT_STEP = 22;
const DOT_BASE_RADIUS = 1;
const DOT_MAX_RADIUS = 5;
const POINTER_REACH = 100;
const POINTER_SMOOTHING = 0.15;
const FADE_SECONDS = 0.25;

type DotGridProps = { className?: string; rgb?: string; baseAlpha?: number };

export function DotGrid({ className, rgb = "174, 22, 19", baseAlpha = 0.15 }: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -999, y: -999, targetX: -999, targetY: -999 };
    let width = 0;
    let height = 0;
    let intensity = 0;
    let targetIntensity = 0;
    let frame = 0;
    let lastTime = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const rowHeight = DOT_STEP * 0.866;
      for (let row = 0, y = DOT_STEP / 2; y < height; row++, y += rowHeight) {
        const offset = row % 2 === 0 ? 0 : DOT_STEP / 2;
        for (let x = DOT_STEP / 2 + offset; x < width; x += DOT_STEP) {
          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          const influence = Math.max(0, 1 - distance / POINTER_REACH) * intensity;
          const radius = DOT_BASE_RADIUS + (DOT_MAX_RADIUS - DOT_BASE_RADIUS) * influence * influence;
          ctx.fillStyle = `rgba(${rgb}, ${baseAlpha + influence * 0.55})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = (time: number) => {
      const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;
      pointer.x += (pointer.targetX - pointer.x) * POINTER_SMOOTHING;
      pointer.y += (pointer.targetY - pointer.y) * POINTER_SMOOTHING;
      const step = dt / FADE_SECONDS;
      intensity = targetIntensity > intensity ? Math.min(1, intensity + step) : Math.max(0, intensity - step);
      draw();
      if (targetIntensity > 0 || intensity > 0) frame = requestAnimationFrame(tick);
      else frame = 0;
    };

    const start = () => {
      if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const handleEnter = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = pointer.targetX = event.clientX - rect.left;
      pointer.y = pointer.targetY = event.clientY - rect.top;
      targetIntensity = 1;
      start();
    };
    const handleMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
    };
    const handleLeave = () => {
      targetIntensity = 0;
      start();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const isInteractive = canHover && !reduceMotion;
    if (isInteractive) {
      host.addEventListener("pointerenter", handleEnter);
      host.addEventListener("pointermove", handleMove);
      host.addEventListener("pointerleave", handleLeave);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      if (isInteractive) {
        host.removeEventListener("pointerenter", handleEnter);
        host.removeEventListener("pointermove", handleMove);
        host.removeEventListener("pointerleave", handleLeave);
      }
    };
  }, [rgb, baseAlpha]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}

/* ───────── Бегущая строка: постоянная скорость, пауза вне экрана ───────── */

const MARQUEE_SPEED_PX_PER_SECOND = 75;

type MarqueeProps = {
  items: readonly ReactNode[];
  className?: string;
  itemClassName?: string;
  pauseLabel?: string;
};

export function Marquee({ items, className, itemClassName, pauseLabel = "Пауза бегущей строки" }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [duration, setDuration] = useState(40);
  const [isOnScreen, setIsOnScreen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    // Округляем: иначе каждое дробное изменение ширины перезапускает анимацию рывком
    const resizeObserver = new ResizeObserver(() => {
      setDuration(Math.round(track.scrollWidth / 2 / MARQUEE_SPEED_PX_PER_SECOND));
    });
    const visibilityObserver = new IntersectionObserver((entries) => {
      const latest = entries[entries.length - 1];
      if (latest) setIsOnScreen(latest.isIntersecting);
    });
    resizeObserver.observe(track);
    visibilityObserver.observe(root);
    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [prefersReducedMotion]);

  // Без движения — обычный перенесённый список: глобальный CSS заморозил бы строку на первом кадре
  if (prefersReducedMotion) {
    return (
      <ul className={cn("flex flex-wrap justify-center gap-x-12 gap-y-3 px-(--gutter)", className)}>
        {items.map((item, index) => (
          <li key={index} className={itemClassName}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const style = {
    "--marquee-duration": `${duration}s`,
    "--marquee-gap": "3rem",
    animationPlayState: isOnScreen && !isPaused ? "running" : "paused",
  } as CSSProperties;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={rootRef}
        className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      >
        <div ref={trackRef} className="flex w-max animate-marquee gap-(--marquee-gap)" style={style}>
          {[...items, ...items].map((item, index) => (
            <div key={index} aria-hidden={index >= items.length} className={cn("shrink-0", itemClassName)}>
              {item}
            </div>
          ))}
        </div>
      </div>
      {/* WCAG 2.2.2: бесконечное движение должно останавливаться по желанию пользователя */}
      <button
        type="button"
        onClick={() => setIsPaused((paused) => !paused)}
        aria-pressed={isPaused}
        className="absolute right-(--gutter) top-1/2 flex size-10 -translate-y-1/2 items-center justify-center bg-black/35 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/55"
      >
        {isPaused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
        <span className="sr-only">{pauseLabel}</span>
      </button>
    </div>
  );
}

/* ───────── Счётчик, который досчитывает до значения при появлении ───────── */

type CounterProps = { value: number; prefix?: string; suffix?: string; className?: string };

const formatNumber = (value: number) => new Intl.NumberFormat("ru-RU").format(value);

export function Counter({ value, prefix = "", suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => `${prefix}${formatNumber(Math.round(latest))}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    // MotionConfig не покрывает императивный animate() — без движения сразу показываем итог
    if (prefersReducedMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.6, ease: EASE.out });
    return () => controls.stop();
  }, [isInView, count, value, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${prefix}${formatNumber(value)}${suffix}`}</span>
      <motion.span aria-hidden="true">{display}</motion.span>
    </span>
  );
}

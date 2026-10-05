"use client";

import {
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Глобальное событие: раскрыть hero сразу (навигация по якорям, skip-link) */
export const HERO_EXPAND_EVENT = "scroll-expand-media:expand";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
  /** object-position медиа: портретное фото в широком кадре держит лицо в центре */
  mediaPosition?: string;
  /** Подпись поверх медиа — проявляется на последней трети раскрытия */
  mediaOverlay?: ReactNode;
  mediaAlt?: string;
  /** Сообщает, раскрыт ли блок, — чтобы синхронизировать внешний плавный скролл */
  onExpandedChange?: (isExpanded: boolean) => void;
  className?: string;
}

type HeroState = { progress: number; isExpanded: boolean; isContentVisible: boolean };
type HeroAction =
  | { type: "advance"; delta: number }
  | { type: "expand" }
  | { type: "collapse" }
  | { type: "reset" };

const INITIAL_STATE: HeroState = { progress: 0, isExpanded: false, isContentVisible: false };
const WHEEL_SENSITIVITY = 0.0009;
const TOUCH_SENSITIVITY_FORWARD = 0.005;
const TOUCH_SENSITIVITY_BACK = 0.008; // назад на тач-экранах чувствительнее, как в оригинале
const TOUCH_COLLAPSE_THRESHOLD_PX = 20;
const KEY_STEP = 0.2;
const CONTENT_HIDE_THRESHOLD = 0.75;
const OVERLAY_START = 0.7;
const TOP_TOLERANCE_PX = 5;
const LINE_HEIGHT_PX = 16;
const MOBILE_QUERY = "(max-width: 767px)";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

function heroReducer(state: HeroState, action: HeroAction): HeroState {
  switch (action.type) {
    case "advance": {
      const progress = clamp01(state.progress + action.delta);
      if (progress >= 1) return { progress: 1, isExpanded: true, isContentVisible: true };
      return {
        progress,
        isExpanded: state.isExpanded,
        isContentVisible: progress < CONTENT_HIDE_THRESHOLD ? false : state.isContentVisible,
      };
    }
    case "expand":
      return { progress: 1, isExpanded: true, isContentVisible: true };
    case "collapse":
      return { ...state, isExpanded: false };
    case "reset":
      return INITIAL_STATE;
  }
}

/** Пиксели независимо от deltaMode: Firefox может присылать прокрутку строками */
function normalizeWheelDelta(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * LINE_HEIGHT_PX;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    target.closest("a, button, input, textarea, select, summary, [role='button'], [contenteditable='true']") !== null
  );
}

function subscribeToMobileQuery(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
  mediaPosition = "center",
  mediaOverlay,
  mediaAlt,
  onExpandedChange,
  className,
}: ScrollExpandMediaProps) => {
  const [state, dispatch] = useReducer(heroReducer, INITIAL_STATE);
  const [trackedMediaType, setTrackedMediaType] = useState(mediaType);
  const prefersReducedMotion = useReducedMotion();
  const isMobileState = useSyncExternalStore(
    subscribeToMobileQuery,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef(state);
  const touchStartYRef = useRef(0);

  // Смена типа медиа сбрасывает прогресс (как в оригинале) — без лишнего эффекта
  if (trackedMediaType !== mediaType) {
    setTrackedMediaType(mediaType);
    dispatch({ type: "reset" });
  }

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    onExpandedChange?.(state.isExpanded);
  }, [state.isExpanded, onExpandedChange]);

  // Без «прокрутки-раскрытия», если пользователь просит меньше движения,
  // пришёл по якорю или браузер восстановил позицию прокрутки
  useEffect(() => {
    const shouldStartExpanded =
      prefersReducedMotion === true || window.location.hash !== "" || window.scrollY > TOP_TOLERANCE_PX;
    if (!shouldStartExpanded) return;
    const frame = requestAnimationFrame(() => dispatch({ type: "expand" }));
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const { isExpanded } = stateRef.current;
      const deltaY = normalizeWheelDelta(e);
      if (isExpanded && deltaY < 0 && window.scrollY <= TOP_TOLERANCE_PX) {
        dispatch({ type: "collapse" });
        e.preventDefault();
      } else if (!isExpanded) {
        e.preventDefault();
        dispatch({ type: "advance", delta: deltaY * WHEEL_SENSITIVITY });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      if (!startY) return;
      const touchY = e.touches[0]?.clientY ?? startY;
      const deltaY = startY - touchY;
      const { isExpanded } = stateRef.current;

      if (isExpanded && deltaY < -TOUCH_COLLAPSE_THRESHOLD_PX && window.scrollY <= TOP_TOLERANCE_PX) {
        dispatch({ type: "collapse" });
        e.preventDefault();
      } else if (!isExpanded) {
        e.preventDefault();
        const factor = deltaY < 0 ? TOUCH_SENSITIVITY_BACK : TOUCH_SENSITIVITY_FORWARD;
        dispatch({ type: "advance", delta: deltaY * factor });
        touchStartYRef.current = touchY;
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = 0;
    };

    const handleScroll = () => {
      if (!stateRef.current.isExpanded) window.scrollTo(0, 0);
    };

    // В оригинале клавиатура не раскрывала блок — пользователь без мыши застревал наверху
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const isSpace = e.key === " ";
      if (isSpace && isInteractiveTarget(e.target)) return;
      const isForward = ["ArrowDown", "PageDown", "End"].includes(e.key) || (isSpace && !e.shiftKey);
      const isBackward = ["ArrowUp", "PageUp", "Home"].includes(e.key) || (isSpace && e.shiftKey);
      const { isExpanded } = stateRef.current;

      if (!isExpanded && (isForward || isBackward)) {
        e.preventDefault();
        const step = e.key === "End" ? 1 : KEY_STEP;
        dispatch({ type: "advance", delta: isForward ? step : -step });
      } else if (isExpanded && isBackward && window.scrollY <= TOP_TOLERANCE_PX) {
        e.preventDefault();
        dispatch({ type: "collapse" });
        dispatch({ type: "advance", delta: -KEY_STEP });
      }
    };

    const handleExpandRequest = () => dispatch({ type: "expand" });

    const nonPassive: AddEventListenerOptions = { passive: false };
    window.addEventListener("wheel", handleWheel, nonPassive);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, nonPassive);
    window.addEventListener("touchmove", handleTouchMove, nonPassive);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("hashchange", handleExpandRequest);
    window.addEventListener(HERO_EXPAND_EVENT, handleExpandRequest);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hashchange", handleExpandRequest);
      window.removeEventListener(HERO_EXPAND_EVENT, handleExpandRequest);
    };
  }, []);

  const scrollProgress = state.progress;
  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);
  const overlayOpacity = clamp01((scrollProgress - OVERLAY_START) / (1 - OVERLAY_START));

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div
      ref={sectionRef}
      className={cn("transition-colors duration-700 ease-in-out overflow-x-hidden", className)}
    >
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt=""
              width={1920}
              height={1080}
              className="w-screen h-screen"
              style={{ objectFit: "cover", objectPosition: "center" }}
              preload
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-[2px]"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                }}
              >
                {mediaType === "video" ? (
                  mediaSrc.includes("youtube.com") ? (
                    <div className="relative w-full h-full pointer-events-none">
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          mediaSrc.includes("embed")
                            ? mediaSrc +
                              (mediaSrc.includes("?") ? "&" : "?") +
                              "autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1"
                            : mediaSrc.replace("watch?v=", "embed/") +
                              "?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=" +
                              mediaSrc.split("v=")[1]
                        }
                        className="w-full h-full rounded-[2px]"
                        title={mediaAlt ?? title ?? "Видео"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 z-10" style={{ pointerEvents: "none" }}></div>

                      <motion.div
                        className="absolute inset-0 bg-black/30 rounded-[2px]"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full pointer-events-none">
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover rounded-[2px]"
                        style={{ objectPosition: mediaPosition }}
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div className="absolute inset-0 z-10" style={{ pointerEvents: "none" }}></div>

                      <motion.div
                        className="absolute inset-0 bg-black/30 rounded-[2px]"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt={mediaAlt ?? title ?? "Media content"}
                      width={1280}
                      height={720}
                      sizes="(max-width: 767px) 95vw, 1550px"
                      className="w-full h-full object-cover rounded-[2px]"
                      style={{ objectPosition: mediaPosition }}
                      preload
                    />

                    <motion.div
                      className="absolute inset-0 bg-black/50 rounded-[2px]"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                {mediaOverlay && (
                  <div
                    className="absolute inset-0 z-20 flex items-end"
                    style={{ opacity: overlayOpacity, pointerEvents: overlayOpacity > 0.9 ? "auto" : "none" }}
                    aria-hidden={overlayOpacity < 0.5}
                  >
                    {mediaOverlay}
                  </div>
                )}

                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                  {date && (
                    <p
                      className="font-heading text-xl md:text-2xl italic text-white/90"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="mt-1 text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-brand-mist/90 text-center"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              <h1
                className={`flex items-center justify-center text-center gap-2 md:gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                <motion.span
                  className="block font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold italic leading-[0.95] tracking-tight text-white transition-none"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.span>
                <motion.span
                  className="block font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold italic leading-[0.95] tracking-tight text-center text-white transition-none"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.span>
              </h1>
            </div>

            <motion.div
              className="flex flex-col w-full px-4 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: state.isContentVisible ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              inert={!state.isContentVisible}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;

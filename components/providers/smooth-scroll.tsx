"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import { HERO_EXPAND_EVENT } from "@/components/ui/scroll-expansion-hero";

/**
 * Плавный скролл как на auros.global: Lenis 1.3, lerp 0.1, уважает prefers-reduced-motion.
 * Несколько частей страницы (hero, мобильное меню) могут временно «замораживать» скролл —
 * Lenis останавливается, пока активна хотя бы одна блокировка.
 */

type ScrollLockApi = {
  setLock: (id: string, isLocked: boolean) => void;
  /** Плавно прокручивает к якорю, когда скролл разблокирован */
  scrollToAnchor: (hash: string) => void;
};

const ScrollLockContext = createContext<ScrollLockApi | null>(null);

// Отступ под фиксированную шапку задаёт scroll-padding-top у html (globals.css) — Lenis его учитывает сам
const MAX_WAIT_FRAMES = 30;

function ScrollLockProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const locksRef = useRef(new Set<string>());

  const sync = useCallback(() => {
    if (!lenis) return;
    if (locksRef.current.size > 0) lenis.stop();
    else lenis.start();
  }, [lenis]);

  useEffect(sync, [sync]);

  const setLock = useCallback(
    (id: string, isLocked: boolean) => {
      if (isLocked) locksRef.current.add(id);
      else locksRef.current.delete(id);
      sync();
    },
    [sync],
  );

  const scrollToAnchor = useCallback(
    (hash: string) => {
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      // Ждём, пока hero раскроется и снимет блокировку, — иначе Lenis проигнорирует scrollTo
      let frames = 0;
      const attempt = () => {
        const isStopped = lenis?.isStopped ?? false;
        if (isStopped && frames++ < MAX_WAIT_FRAMES) {
          requestAnimationFrame(attempt);
          return;
        }
        if (lenis && !isStopped) lenis.scrollTo(target);
        else target.scrollIntoView({ block: "start" });
        // Секция не фокусируема сама по себе — без tabindex фокус остался бы на ссылке меню
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      };
      requestAnimationFrame(attempt);
    },
    [lenis],
  );

  const api = useMemo(() => ({ setLock, scrollToAnchor }), [setLock, scrollToAnchor]);

  return <ScrollLockContext.Provider value={api}>{children}</ScrollLockContext.Provider>;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <MotionConfig reducedMotion="user">
        <ScrollLockProvider>{children}</ScrollLockProvider>
      </MotionConfig>
    </ReactLenis>
  );
}

export function useScrollLock(): ScrollLockApi {
  const api = useContext(ScrollLockContext);
  if (!api) throw new Error("useScrollLock должен вызываться внутри <SmoothScroll>");
  return api;
}

/** Переход по якорю: сначала раскрываем hero (он держит скролл), затем плавно едем к секции */
export function useAnchorNavigation(onNavigate?: () => void) {
  const { scrollToAnchor } = useScrollLock();
  return (event: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Shift-клик — «открыть в новой вкладке/окне»: решение пользователя, не перехватываем
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = event.currentTarget.hash;
    if (!hash) return;
    event.preventDefault();
    onNavigate?.();
    window.dispatchEvent(new Event(HERO_EXPAND_EVENT));
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    scrollToAnchor(hash);
  };
}

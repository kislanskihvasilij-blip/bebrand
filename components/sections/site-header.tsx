"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Logo } from "@/components/brand/logo";
import { useAnchorNavigation, useScrollLock } from "@/components/providers/smooth-scroll";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

type HeaderTheme = "dark" | "light";

const SCROLLED_THRESHOLD_PX = 12;
const MENU_LOCK_ID = "mobile-menu";

export function SiteHeader() {
  const [theme, setTheme] = useState<HeaderTheme>("dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setLock } = useScrollLock();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setIsScrolled(latest > SCROLLED_THRESHOLD_PX));

  // Тема шапки = тема секции, которая сейчас под ней
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-header-theme]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTheme(entry.target.getAttribute("data-header-theme") === "light" ? "light" : "dark");
          }
        }
      },
      { rootMargin: "0px 0px -94% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setLock(MENU_LOCK_ID, isMenuOpen);
    // Пока меню открыто, страница за оверлеем недоступна для Tab и скринридеров
    const background = [document.getElementById("main-content"), document.querySelector("footer")];
    background.forEach((element) => element?.toggleAttribute("inert", isMenuOpen));
    if (!isMenuOpen) return;
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      setLock(MENU_LOCK_ID, false);
      background.forEach((element) => element?.removeAttribute("inert"));
    };
  }, [isMenuOpen, setLock]);

  // Повернули планшет и вышли на десктопную ширину — бургер скрыт, меню нужно закрыть, иначе скролл застынет
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };
    desktopQuery.addEventListener("change", handleChange);
    return () => desktopQuery.removeEventListener("change", handleChange);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);
  const handleAnchorClick = useAnchorNavigation(closeMenu);
  const isDark = theme === "dark" || isMenuOpen;

  return (
    <header
      data-focus-theme={isDark ? "dark" : "light"}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        isMenuOpen && "bg-night",
        isScrolled && !isMenuOpen && "backdrop-blur-md",
        isScrolled && !isMenuOpen && (isDark ? "bg-night/70" : "border-b border-ink/10 bg-white/85"),
      )}
    >
      <a
        href="#main-content"
        onClick={handleAnchorClick}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-brand-red focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержанию
      </a>

      <div className="container-brand flex h-[72px] items-center justify-between gap-6">
        <a
          href="#top"
          onClick={handleAnchorClick}
          className="flex items-center gap-4"
          aria-label={`BEBRAND. ${site.header.roleLine1}, ${site.header.roleLine2} — в начало страницы`}
        >
          <Logo variant={isDark ? "inverse" : "color"} className="h-8 md:h-9" />
          <span
            className={cn(
              "hidden border-l pl-4 text-[0.68rem] font-medium uppercase leading-snug tracking-[0.16em] sm:block",
              isDark ? "border-white/25 text-white/90" : "border-ink/15 text-brand-graphite",
            )}
          >
            {site.header.roleLine1}
            <br />
            {site.header.roleLine2}
          </span>
        </a>

        <nav aria-label="Основная навигация" className="hidden items-center gap-8 xl:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleAnchorClick}
              className={cn(
                "link-underline whitespace-nowrap py-1 text-sm font-medium transition-colors",
                isDark ? "text-white/85 hover:text-white" : "text-ink/80 hover:text-ink",
              )}
            >
              {item.label}
            </a>
          ))}
          <a
            href={site.header.cta.href}
            onClick={handleAnchorClick}
            className="btn-sweep whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
          >
            {site.header.cta.label}
          </a>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls={isMenuOpen ? "mobile-menu" : undefined}
          aria-label="Меню"
          className="relative flex size-11 items-center justify-center xl:hidden"
        >
          {[-1, 0, 1].map((position) => (
            <motion.span
              key={position}
              aria-hidden="true"
              className={cn("absolute h-[2px] w-7", isDark ? "bg-white" : "bg-ink")}
              initial={false}
              animate={
                isMenuOpen
                  ? { rotate: position * 45, y: 0, opacity: position === 0 ? 0 : 1 }
                  : { rotate: 0, y: position * 8, opacity: 1 }
              }
              transition={{ duration: position === 0 ? 0.2 : 0.3, ease: EASE.out }}
            />
          ))}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          // data-lenis-prevent: остановленный Lenis глушит колесо и тач — без него меню не прокрутить
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            data-lenis-prevent
            className="fixed inset-0 top-[72px] z-40 flex flex-col justify-between overflow-y-auto overscroll-contain bg-night/90 px-(--gutter) pb-10 pt-8 backdrop-blur-[15px] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE.out }}
          >
            <nav aria-label="Мобильная навигация">
              <ul className="space-y-1">
                {site.nav.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE.signature, delay: 0.05 * index }}
                  >
                    <a
                      href={item.href}
                      onClick={handleAnchorClick}
                      className="block py-2 font-heading text-4xl font-bold italic text-white"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-10 space-y-4">
              <a
                href={site.header.cta.href}
                onClick={handleAnchorClick}
                className="btn-sweep block px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white"
              >
                {site.header.cta.label}
              </a>
              <p className="text-sm text-white/60">{site.header.menuNote}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

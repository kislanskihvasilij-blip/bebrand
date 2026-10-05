/**
 * Язык движения сайта. Кривые взяты из разбора auros.global:
 * signature — их единственная кастомная кривая (аккордеон), out/inOut — аппроксимации power2 из GSAP.
 */
export const EASE = {
  signature: [0.625, 0.05, 0, 1],
  out: [0.215, 0.61, 0.355, 1],
  inOut: [0.645, 0.045, 0.355, 1],
  quadOut: [0.25, 0.46, 0.45, 0.94],
  expo: [0.16, 1, 0.3, 1],
} as const;

export const DURATION = {
  hover: 0.2,
  ui: 0.3,
  accordion: 0.6,
  reveal: 0.9,
  ambient: 3,
} as const;

/** Окно подсветки i-го элемента из n — как stagger .3 / duration .5 в GSAP-таймлайне auros */
export function staggerWindow(index: number, count: number, stagger = 0.3, duration = 0.5): [number, number] {
  const total = stagger * Math.max(count - 1, 0) + duration;
  const start = (stagger * index) / total;
  return [start, Math.min(start + duration / total, 1)];
}

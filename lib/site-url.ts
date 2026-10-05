/**
 * Публичный адрес сайта — для canonical, Open Graph, sitemap.xml и robots.txt.
 * Порядок: явный NEXT_PUBLIC_SITE_URL → продакшен-домен Vercel → локальная разработка.
 */
let hasWarnedAboutLocalhost = false;

export function getSiteUrl(): URL {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicitUrl) {
    try {
      return new URL(explicitUrl);
    } catch {
      throw new Error(
        `NEXT_PUBLIC_SITE_URL должен быть полным адресом вида https://example.ru, получено: «${explicitUrl}»`,
      );
    }
  }

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelDomain) return new URL(`https://${vercelDomain}`);

  // Предупреждение, а не ошибка: иначе ломается обычная локальная `npm run build`.
  // В логах деплоя вне Vercel его будет видно.
  if (process.env.NODE_ENV === "production" && !hasWarnedAboutLocalhost) {
    hasWarnedAboutLocalhost = true;
    console.warn(
      "[site-url] Не задан NEXT_PUBLIC_SITE_URL: canonical, sitemap.xml, robots.txt и превью ссылок укажут на localhost.",
    );
  }
  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}

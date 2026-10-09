import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Next.js встраивает данные гидрации inline-скриптами — без 'unsafe-inline' сайт потеряет интерактив.
// 'unsafe-eval' нужен только dev-режиму React. Все шрифты и картинки — свои, внешних источников нет.
// style-src не ужесточаем до style-src-attr: старые Safari его не знают и сломали бы инлайн-стили анимаций.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

// `npm run build:static` собирает обычные статические файлы в out/ — их можно залить на любой хостинг,
// в том числе российский (адреса *.vercel.app блокируются частью провайдеров). В статике нет серверных
// заголовков — их задаёт config/apache.htaccess, — а картинки отдаются как есть: они уже сжаты в WebP.
const isStaticExport = process.env.npm_lifecycle_event === "build:static";

const nextConfig: NextConfig = isStaticExport
  ? { poweredByHeader: false, output: "export", images: { unoptimized: true } }
  : {
      poweredByHeader: false,
      async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
      },
    };

export default nextConfig;

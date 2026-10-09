import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

// Явно статический роут — без этого не собирается статическая версия (npm run build:static)
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Яндекс игнорирует группу «*», если есть своя, — поэтому allow повторяем.
      // Clean-param склеивает дубли страниц с рекламными метками.
      {
        userAgent: "Yandex",
        allow: "/",
        other: { "Clean-param": "utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid /" },
      },
    ],
    sitemap: new URL("/sitemap.xml", getSiteUrl()).href,
  };
}

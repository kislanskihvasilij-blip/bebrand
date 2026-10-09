import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

// Явно статический роут — без этого не собирается статическая версия (npm run build:static)
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getSiteUrl().href,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

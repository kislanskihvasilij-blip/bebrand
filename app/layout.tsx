import type { Metadata, Viewport } from "next";
import { Bitter, Roboto } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

// Фирменные шрифты (п. 1.9 гайда): Roboto — для текста, Bitter — для заголовков и важных сообщений.
// Ось ширины Roboto даёт «Roboto Condensed» для крупных цифр — как нумерация страниц в гайде.
const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: "--font-roboto",
  display: "swap",
});

const bitter = Bitter({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-bitter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  alternates: { canonical: "/" },
  title: { default: site.meta.title, template: `%s · ${site.meta.shortTitle}` },
  description: site.meta.description,
  keywords: [...site.meta.keywords],
  authors: [{ name: site.person.name }],
  creator: site.person.name,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: site.meta.title,
    description: site.meta.description,
    siteName: site.meta.shortTitle,
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ae1613",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${roboto.variable} ${bitter.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

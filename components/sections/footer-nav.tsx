"use client";

import { useAnchorNavigation } from "@/components/providers/smooth-scroll";

type FooterNavProps = { items: readonly { label: string; href: string }[] };

/** Единственная интерактивная часть подвала — переходы по якорям через плавный скролл */
export function FooterNav({ items }: FooterNavProps) {
  const handleAnchorClick = useAnchorNavigation();
  return (
    <nav aria-label="Навигация в подвале" className="md:col-span-3">
      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} onClick={handleAnchorClick} className="link-underline transition-colors hover:text-white">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

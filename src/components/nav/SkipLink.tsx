"use client";

import { usePathname } from "next/navigation";

export function SkipLink() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/eu-importers");

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
    >
      {isEn ? "Skip to content" : "İçeriğe atla"}
    </a>
  );
}

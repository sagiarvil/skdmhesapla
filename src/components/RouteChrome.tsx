"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

function SkipLink({ english = false }: { english?: boolean }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
    >
      {english ? "Skip to content" : "İçeriğe atla"}
    </a>
  );
}

export function RouteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const englishStandalone = pathname === "/eu-importers" || pathname?.startsWith("/eu-importers/");
  const partnerStandalone = pathname === "/is-ortakligi" || pathname?.startsWith("/is-ortakligi/");

  if (englishStandalone) {
    return (
      <>
        <SkipLink english />
        {children}
      </>
    );
  }

  if (partnerStandalone) {
    return (
      <>
        <SkipLink />
        <link rel="alternate" type="text/markdown" href="https://skdmhesapla.com/is-ortakligi/index.md" />
        <link rel="describedby" href="https://skdmhesapla.com/llms.txt" />
        {children}
      </>
    );
  }

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}

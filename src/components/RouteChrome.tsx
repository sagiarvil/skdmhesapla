"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const standaloneRoutes = ["/eu-importers", "/is-ortakligi"];

export function RouteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = standaloneRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const partnerAiLinks = pathname === "/is-ortakligi" || pathname.startsWith("/is-ortakligi/");

  if (standalone) {
    return (
      <>
        {partnerAiLinks ? (
          <>
            <link rel="alternate" type="text/markdown" href="https://skdmhesapla.com/is-ortakligi/index.md" />
            <link rel="describedby" href="https://skdmhesapla.com/llms.txt" />
          </>
        ) : null}
        {children}
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}

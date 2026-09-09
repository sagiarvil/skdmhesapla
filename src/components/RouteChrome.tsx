"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const standaloneRoutes = ["/eu-importers", "/is-ortakligi"];

export function RouteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = standaloneRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (standalone) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}

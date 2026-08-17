import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";

export const metadata: Metadata = pageMetadata({
  path: "/basla/",
  title: "Başla",
  description: "GTİP / CN ile SKDM kapsam kontrolü",
});

export default function BaslaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RegistryJsonLd route="/basla/" />
      {children}
    </>
  );
}

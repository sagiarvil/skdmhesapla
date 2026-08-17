import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { YonlendirKarbonRaporu } from "./YonlendirKarbonRaporu";

export const metadata: Metadata = pageMetadata({
  path: "/tedarikci-verisi/hazirla/",
  title: "Tedarikçi karbon dosyası hazırla",
  description:
    "SKDM Kademe A dışındaki alıcı talepleri için ürün karbon ayak izi raporu. SKDM kapsam hükmü değildir.",
});

export default function TedarikciHazirlaPage() {
  return (
    <>
      <RegistryJsonLd route="/tedarikci-verisi/hazirla/" />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#def0e6] py-10 sm:py-16">
        <YonlendirKarbonRaporu />
      </article>
    </>
  );
}

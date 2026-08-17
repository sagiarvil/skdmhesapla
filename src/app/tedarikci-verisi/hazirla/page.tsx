import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { HazirlaIcerik } from "./HazirlaIcerik";

export const metadata: Metadata = pageMetadata({
  path: "/tedarikci-verisi/hazirla/",
  title: "Tedarikçi karbon dosyası hazırla",
  description:
    "SKDM Kademe A dışındaki alıcı talepleri için ISO 14067 tedarikçi veri dosyası. SKDM kapsam hükmü değildir.",
});

export default function TedarikciHazirlaPage() {
  return (
    <>
      <RegistryJsonLd route="/tedarikci-verisi/hazirla/" />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#def0e6] py-10 sm:py-16">
        <Suspense
          fallback={
            <p className="px-5 py-16 text-center text-sm font-bold text-ink-700">Dosya yönü yükleniyor</p>
          }
        >
          <HazirlaIcerik />
        </Suspense>
      </article>
    </>
  );
}

import type { Metadata } from "next";
import { MaritimeConversionHero } from "@/components/maritime/MaritimeConversionHero";
import { MaritimeLanding } from "@/components/maritime/MaritimeLanding";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/",
  title: "Denizcilik Karbon Uyum — EU ETS, MRV ve FuelEU Maritime",
  description:
    "AB limanlarına sefer yapan denizcilik firmaları için EU MRV, EU ETS, FuelEU Maritime kapsam kontrolü, karbon maliyet yönetimi ve doğrulamaya hazırlık otomasyonu.",
});

export default function DenizcilikPage() {
  return (
    <>
      <MaritimeConversionHero />
      <div className="[&>section:first-child]:hidden">
        <MaritimeLanding />
      </div>
    </>
  );
}

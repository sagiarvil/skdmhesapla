import type { Metadata } from "next";
import { MaritimeConversionLanding } from "@/components/maritime/MaritimeConversionLanding";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/",
  title: "Denizcilik Karbon Uyum — EU ETS, MRV ve FuelEU Maritime",
  description:
    "AB limanlarına sefer yapan gemi sahipleri ve ISM/DOC şirketleri için EU MRV, EU ETS ve FuelEU Maritime kapsam, hesaplama, kanıt kontrolü ve verifier-ready hazırlık dosyası.",
});

export default function DenizcilikPage() {
  return <MaritimeConversionLanding />;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import { BaslaPage } from "@/components/basla/BaslaPage";

/**
 * GATE-R (RM-006): /basla/ kendi metadata'sına sahiptir — anasayfa
 * metadata'sını (canonical "/") miras almaz.
 */
export const metadata: Metadata = pageMetadata({
  path: "/basla/",
  title: "Dosyanızı başlatın",
  description:
    "GTİP arayarak kapsamı kontrol edin veya sektörünüzü seçin. Mühür öncesi tüm veri girişi ve kalite kontrolleri ücretsizdir.",
});

export default function BaslaRoute() {
  return <BaslaPage />;
}

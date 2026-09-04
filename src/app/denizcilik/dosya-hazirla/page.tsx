import type { Metadata } from "next";
import { MaritimePreparationWorkbench } from "@/components/maritime/MaritimePreparationWorkbench";

export const metadata: Metadata = {
  title: "Denizcilik Karbon Uyum Hazırlık Dosyası — SKDMhesapla",
  description: "EU MRV, EU ETS ve FuelEU Maritime için gemi bazında veri, sefer, yakıt, enerji, kanıt ve doğrulamaya hazırlık çalışma alanı.",
  alternates: { canonical: "https://skdmhesapla.com/denizcilik/dosya-hazirla/" },
  robots: { index: false, follow: false },
};

export default function MaritimePreparationPage() {
  return <MaritimePreparationWorkbench />;
}

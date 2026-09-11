import type { Metadata } from "next";
import { MaritimePreparationWorkbench } from "@/components/maritime/MaritimePreparationWorkbench";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";

export const metadata: Metadata = {
  title: "Denizcilik Karbon Uyum Hazırlık Dosyası — SKDMhesapla",
  description: "EU MRV, EU ETS ve FuelEU Maritime için gemi bazında veri, sefer, yakıt, enerji, kanıt ve doğrulamaya hazırlık çalışma alanı.",
  alternates: { canonical: "https://skdmhesapla.com/denizcilik/dosya-hazirla/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function MaritimePreparationPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <RegistryJsonLd route="/denizcilik/dosya-hazirla/" />
      <h1 className="sr-only">Klas Denetimine Hazır Gemi Uyum Paketi Oluşturucu</h1>
      <MaritimePreparationWorkbench />
    </main>
  );
}

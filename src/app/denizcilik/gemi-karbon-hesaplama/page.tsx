import { Suspense } from "react";
import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { MaritimeWaveDivider } from "@/components/maritime/MaritimeWaveDivider";
import { GemiKarbonHesaplayiciClient } from "@/components/maritime/GemiKarbonHesaplayiciClient";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/gemi-karbon-hesaplama/",
  title: "Gemi Karbon Hesaplama: Sefer Başına EU ETS ve FuelEU Simülasyonu | SKDMHesapla",
  description:
    "Sefer rotanızı ve yakıt tüketiminizi girerek 2026 %100 EU ETS teslim yükümlülüğü ve FuelEU uyum dengesini anında hesaplayın.",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Gemi karbon hesaplama aracı hangi emisyon rejimlerini kapsar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hesaplayıcı; Direktif 2003/87/EC (EU ETS Maritime) kapsamındaki karbon tahsisatı (EUA) yükümlülüğünü ve Tüzük (AB) 2023/1805 (FuelEU Maritime) kapsamındaki Well-to-Wake sera gazı yoğunluğu ve uyum dengesini (Compliance Balance) hesaplar.",
      },
    },
    {
      "@type": "Question",
      name: "Türkiye-AB seferlerinde %50 kuralı nasıl uygulanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Türkiye limanları ile AB limanları arasındaki tek yönlü seferlerde toplam seyir yakıt tüketimi ve emisyonunun %50'si hesaplamaya dahil edilir.",
      },
    },
  ],
};

export default function GemiKarbonHesaplamaPage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/gemi-karbon-hesaplama/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sky-950/40 bg-gradient-to-b from-[#020b14] via-[#05192d] to-[#082942] pt-14 pb-16 text-white">
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-sky-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-cyan-300 shadow-md">
            <Calculator className="h-3.5 w-3.5 text-cyan-400" />
            <span>SEFER BAZLI EU ETS &amp; FUELEU EMİSYON SİMÜLATÖRÜ</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl text-white">
            Gemi Karbon Hesaplama: Sefer Başına EU ETS ve FuelEU Simülasyonu
          </h1>

          <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-sky-200/90">
            Sefer rotanızı, yakıt tüketiminizi ve raporlama yılını seçerek Direktif 2003/87/EC (ETS) ve Tüzük (AB) 2023/1805 (FuelEU) kapsamındaki tahmini karbon maliyetinizi ve uyum dengesini anında hesaplayın.
          </p>
        </div>
      </section>

      <MaritimeWaveDivider variant="slate" />

      {/* Calculator Main Section with Suspense Boundary */}
      <section className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <Suspense fallback={
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 font-mono text-sm">
              <span className="animate-pulse">Hesaplama motoru ve radar telemetrisi yükleniyor...</span>
            </div>
          }>
            <GemiKarbonHesaplayiciClient />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

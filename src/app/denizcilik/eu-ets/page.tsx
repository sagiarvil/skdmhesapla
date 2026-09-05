import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Scale, Ship, Anchor, HelpCircle, CheckCircle2 } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { MaritimeWaveDivider } from "@/components/maritime/MaritimeWaveDivider";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/eu-ets/",
  title: "EU ETS Denizcilik: Gemi Karbon Tahsisatı ve 2026 %100 Teslim Yükümlülüğü | SKDMHesapla",
  description:
    "Türkiye-AB limanları arasında çalışan 5.000 GT üzeri gemiler için EU ETS kuralları, 2026 %100 tam teslim oranı, %50 coğrafi kapsam kuralı ve akredite doğrulayıcı dosya hazırlığı.",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "2026 yılı itibarıyla gemiler için EU ETS teslim yükümlülüğü oranı nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2024 (%40) ve 2025 (%70) kademeli geçiş katsayıları sona ermiştir. 1 Ocak 2026 itibarıyla Türkiye-AB limanları arasındaki seferlerde raporlanan doğrulanmış emisyonların %50'si için %100 oranında karbon tahsisatı (EUA) teslim edilmelidir. Ayrıca 2026 ile birlikte karbondioksit (CO₂) yanında metan (CH₄) ve diazot monoksit (N₂O) sera gazları da sisteme dahil edilmiştir.",
      },
    },
    {
      "@type": "Question",
      name: "Türkiye limanlarından kalkan gemilerde %50 kuralı nasıl uygulanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Direktif 2003/87/EC (Direktif (AB) 2023/959 ile tadil edilen) uyarınca, AB üyesi olmayan bir ülke limanı (örn. Türkiye) ile bir AB limanı arasındaki tek yönlü seferlerde toplam seyir emisyonunun %50'si ETS kapsamına girer. İki AB limanı arasındaki seferlerde ve AB limanındaki rıhtım operasyonlarında ise emisyonların %100'ü sisteme tabidir.",
      },
    },
    {
      "@type": "Question",
      name: "EU ETS yasal sorumlusu kimdir? Kiracı mı yoksa armatör mü?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yasal olarak AB idaresine karşı sorumlu taraf, geminin Güvenli Yönetim Belgesi'ne (DoC) sahip tüzel işletmecisidir (ISM Company). Ancak ticari sözleşmelerde (BIMCO ETS clauses vb.) tahsisat satın alma ve temin maliyeti genellikle zaman çartererına (time charterer) yansıtılır.",
      },
    },
  ],
};

const phaseInTimeline = [
  {
    year: "2024",
    percentage: "%40",
    scope: "Raporlanan doğrulanmış CO₂ emisyonlarının %40'ı için EUA teslimi yapıldı.",
    status: "Tamamlandı",
    bg: "bg-slate-100 text-slate-700",
  },
  {
    year: "2025",
    percentage: "%70",
    scope: "Raporlanan doğrulanmış CO₂ emisyonlarının %70'i için EUA teslimi yapıldı.",
    status: "Geçiş Tamamlandı",
    bg: "bg-slate-100 text-slate-700",
  },
  {
    year: "2026+",
    percentage: "%100",
    scope: "Tam teslim zorunludur. Ayrıca CO₂ yanında Metan (CH₄) ve N₂O gazları kapsama alınmıştır.",
    status: "Aktif Yürürlük",
    bg: "bg-emerald-700 text-white font-black",
  },
];

export default function EuEtsMaritimePage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/eu-ets/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sky-950/40 bg-gradient-to-b from-[#020b14] via-[#05192d] to-[#082942] pt-14 pb-16 text-white">
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-sky-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-cyan-300 shadow-md">
            <Anchor className="h-3.5 w-3.5 text-cyan-400" />
            <span>DİREKTİF (AB) 2023/959 · AB EMİSYON TİCARET SİSTEMİ</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl text-white">
            EU ETS Denizcilik: Gemi Karbon Tahsisatı ve 2026 %100 Teslim Yükümlülüğü
          </h1>

          <div className="mt-6 max-w-3xl rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-[#071e33]/95 via-[#092944]/85 to-[#04121f]/90 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-400 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
                Sade Türkçe Mevzuat Özeti
              </span>
              <span className="text-[11px] font-bold text-cyan-200 font-mono">
                DİREKTİF 2003/87/EC (2023/959 TADİLİ)
              </span>
            </div>
            <p className="mt-3 text-sm font-medium leading-relaxed text-sky-100">
              Avrupa Karbon Piyasası Emisyon Tahsisat Sistemi (EU ETS Maritime); Türkiye-AB arasında sefer yapan 5.000 GT üzeri tüm ticari yük ve yolcu gemilerini kapsar. 1 Ocak 2026 itibarıyla geçiş indirimi bitmiştir; sefer emisyonlarının %50&apos;si için %100 tam EUA tahsisatı satın alınıp teslim edilmelidir. Ayrıca karbondioksit yanında metan (CH₄) ve diazot monoksit (N₂O) de hesaba katılmaktadır.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/denizcilik/dosya-hazirla/#form-section"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg hover:from-sky-300 hover:to-cyan-200 transition-all"
            >
              <span>Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/denizcilik/#simulator"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              <span>İhracatçı Navlun Sürşarjı Simülatörüne İn ↓</span>
            </Link>
          </div>
        </div>
      </section>

      <MaritimeWaveDivider variant="slate" />

      {/* Main Content */}
      <section className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              EU ETS Denizcilik Uygulama Kuralları
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Armatörlerin ve işletmecilerin 2026 yılında bilmesi gereken yasal zorunluluklar.
            </p>
          </div>

          {/* Phase-in Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-12">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-cyan-600" />
              <span>Yıllara Göre Tahsisat Teslim Oranları (Phase-In Takvimi)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {phaseInTimeline.map((item) => (
                <div key={item.year} className="rounded-xl border border-slate-200 p-5 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">{item.year}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-md ${item.bg}`}>{item.status}</span>
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900">{item.percentage}</div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{item.scope}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold mb-4">
                %50
              </div>
              <h4 className="text-base font-bold text-slate-900">Coğrafi Kapsam ve %50 Kuralı</h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Türkiye (veya herhangi bir AB dışı ülke) limanı ile bir AB limanı arasındaki tek yönlü seferlerde toplam seyir emisyonunun %50&apos;si EU ETS kapsamına girer. İki AB limanı arasındaki seferlerde ve AB limanındaki rıhtım operasyonlarında ise oran %100&apos;dür.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                3 Gaz
              </div>
              <h4 className="text-base font-bold text-slate-900">2026 Sera Gazı Kapsamı</h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                2024 ve 2025 yıllarında yalnızca karbondioksit (CO₂) hesaba katılırken; 1 Ocak 2026&apos;dan itibaren metan (CH₄, GWP=28) ve diazot monoksit (N₂O, GWP=265) gazları da EU ETS emisyon hesabı ve teslimine zorunlu olarak dahil edilmiştir.
              </p>
            </div>
          </div>

          {/* Cross Link to Other Regimes */}
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">FuelEU Maritime ve THETIS-MRV ile İlişki</h4>
              <p className="mt-1 text-xs text-slate-600">
                EU ETS karbon tahsisatı alımını zorunlu kılarken, FuelEU Maritime yakıtın sera gazı yoğunluğuna limit koyar.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/denizcilik/fueleu-maritime/"
                className="text-xs font-bold text-cyan-900 bg-cyan-200 hover:bg-cyan-300 px-4 py-2 rounded-lg transition-colors"
              >
                FuelEU Kuralları &rarr;
              </Link>
              <Link
                href="/denizcilik/mrv-thetis/"
                className="text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
              >
                THETIS-MRV Rehberi &rarr;
              </Link>
            </div>
          </div>

          {/* Alt Aksiyon Alanı */}
          <div className="mt-12 rounded-3xl border-2 border-cyan-400/30 bg-gradient-to-br from-[#061826] via-[#092942] to-[#04121d] p-8 text-center text-white shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Klas Denetimine Hazır Gemi Karbon Dosyanızı Oluşturun
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-sky-100/80 max-w-xl mx-auto">
              5.000 GT+ gemiler için AB ETS, FuelEU ve MRV uyum dosyanızı hazırlayın veya navlun sürşarjını simüle edin.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <Link
                href="/denizcilik/dosya-hazirla/#form-section"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300 px-7 text-sm font-black text-slate-950 transition hover:from-sky-300 hover:to-cyan-200 shadow-lg shadow-cyan-500/25"
              >
                Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD) <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/denizcilik/#simulator"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/20 transition"
              >
                İhracatçı Navlun Sürşarjı Simülatörüne İn ↓
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

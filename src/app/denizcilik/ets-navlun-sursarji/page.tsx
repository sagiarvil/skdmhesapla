import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, Scale, Calculator, ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { MaritimeWaveDivider } from "@/components/maritime/MaritimeWaveDivider";
import { MaritimeSurchargeSimulator } from "@/components/maritime/MaritimeSurchargeSimulator";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/ets-navlun-sursarji/",
  title: "ETS Navlun Sürşarjı Hesaplama ve CBAM Sınır Ayrımı | İhracatçı Rehberi | SKDMHesapla",
  description:
    "Türk ihracatçıları için gemi navlun faturalarındaki ETS sürşarjı hesaplama simülatörü, CBAM fabrika kapısı yasal sınır ayrımı ve doğru emisyon beyan rehberi.",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Navlun faturasındaki ETS sürşarjı (karbon ek ücreti) CBAM beyanına eklenebilir mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HAYIR, KESİNLİKLE EKLENEMEZ. Tüzük (AB) 2023/956 ve Kesin Dönem Uygulama Tüzüğü (AB) 2025/2547 gereğince CBAM sistem sınırı fabrika kapısında (ex-works / gate) sona erer. Deniz yoluyla taşıma emisyonları armatörün EU ETS yükümlülüğüdür. Navlundaki karbon bedeli bir lojistik gideridir; CBAM ürün gömülü emisyon (SEE) formülüne yazılamaz.",
      },
    },
    {
      "@type": "Question",
      name: "Armatörün talep ettiği TEU başına ETS sürşarjının adil olduğunu nasıl kontrol ederim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Navlun sürşarjı; geminin yakıt tüketimi, rotanın deniz mili mesafesi (örn. Ambarlı-Cenova veya Mersin-Valencia), taşınan toplam TEU adedi ve güncel EUA karbon tahsisat fiyatı (yaklaşık 65-80 EUR/ton) üzerinden hesaplanır. Sayfamızdaki canlı sürşarj simülatörüyle hattın talep ettiği bedeli anında doğrulayabilirsiniz.",
      },
    },
    {
      "@type": "Question",
      name: "İhracatçı olarak denizcilik için herhangi bir resmi AB portalına kayıt olmam gerekir mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. EU MRV, EU ETS Maritime ve FuelEU rejimlerinde doğrudan yasal muhatap armatör veya gemi işletmecisidir (ISM Company). İhracatçı yalnızca kendi fabrikasındaki üretim emisyonları için CBAM Geçiş Kayıt Defteri veya CBAM Beyan Sahibi üzerinden sorumludur.",
      },
    },
  ],
};

export default function EtsNavlunSursarjiPage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/ets-navlun-sursarji/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sky-950/40 bg-gradient-to-b from-[#020b14] via-[#05192d] to-[#082942] pt-14 pb-16 text-white">
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-amber-300 shadow-md">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            <span>İHRACATÇI VE YÜK SAHİPLERİ İÇİN NAVLUN MALİYET REHBERİ</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl text-white">
            İhracatçılar İçin ETS Navlun Sürşarjı ve CBAM Yasal Sınır Ayrımı
          </h1>

          <div className="mt-6 max-w-3xl rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-[#071e33]/95 via-[#092944]/85 to-[#04121f]/90 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
                Kritik Hukuki Sınır Uyarısı
              </span>
              <span className="text-[11px] font-bold text-amber-200 font-mono">
                TÜZÜK (AB) 2023/956 &amp; UYGULAMA TÜZÜĞÜ (AB) 2025/2547
              </span>
            </div>
            <p className="mt-3 text-sm font-medium leading-relaxed text-sky-100">
              Avrupa&apos;ya deniz yoluyla ihracat yapan sanayicilerin navlun faturalarında gördüğü &ldquo;ETS Surcharge&rdquo; (karbon payı), armatörün EU ETS maliyetini konteyner başına yansıtmasıdır. <strong>YASAL KURAL:</strong> CBAM sistemi fabrika kapısında (ex-works) sona erer. Navlun faturasındaki karbon bedeli CBAM ürün gömülü emisyonuna (SEE) <strong>ASLA EKLENEMEZ</strong>; aksi halde CBAM beyanınız hatalı kabul edilerek cezai yaptırım riski doğar.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/denizcilik/dosya-hazirla/#form-section"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg hover:from-amber-300 hover:to-yellow-300 transition-all"
            >
              <span>Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#hesaplayici"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              <span>İhracatçı Navlun Sürşarjı Simülatörüne İn ↓</span>
            </a>
          </div>
        </div>
      </section>

      <MaritimeWaveDivider variant="slate" />

      {/* Simulator Section */}
      <section id="hesaplayici" className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Konteyner Başına Tahmini ETS Sürşarj Simülatörü
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Türkiye çıkışlı ana hat ve koridorlarda konteyner (TEU) başına düşen tahmini karbon maliyetini hesaplayın.
            </p>
          </div>

          <MaritimeSurchargeSimulator />

          {/* Comparison Matrix */}
          <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-amber-600" />
              <span>İhracatçı İçin İki Ayrı Rejimin Karşılaştırma Matrisi</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
                  <tr>
                    <th className="py-3 px-4">Kriter</th>
                    <th className="py-3 px-4 bg-emerald-50 text-emerald-950 font-black">CBAM (SKDM)</th>
                    <th className="py-3 px-4 bg-sky-50 text-sky-950 font-black">Denizcilik EU ETS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-700">Yasal Dayanak</td>
                    <td className="py-3.5 px-4 text-slate-800">Tüzük (AB) 2023/956 &amp; 2025/2547</td>
                    <td className="py-3.5 px-4 text-slate-800">Direktif 2003/87/EC (2023/959 Tadili)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-700">Yasal Sorumlu</td>
                    <td className="py-3.5 px-4 text-slate-800">AB İthalatçısı (Yetkili CBAM Beyan Sahibi)</td>
                    <td className="py-3.5 px-4 text-slate-800">Armatör / Gemi İşletmecisi (ISM Company)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-700">Sistem Sınırı</td>
                    <td className="py-3.5 px-4 text-emerald-800 font-bold">Fabrika Kapısı Çıkışı (Ex-Works / Gate)</td>
                    <td className="py-3.5 px-4 text-sky-800 font-bold">Liman-Liman Deniz Seyri &amp; Rıhtım</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-700">Maliyetin Yansıması</td>
                    <td className="py-3.5 px-4 text-slate-800">CBAM Sertifikası Satın Alımı</td>
                    <td className="py-3.5 px-4 text-slate-800">Navlun Faturasında &ldquo;ETS Surcharge&rdquo; Kalemi</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-700">Birbirine Dahil Edilebilir mi?</td>
                    <td className="py-3.5 px-4 text-rose-700 font-black">KESİNLİKLE HAYIR (Yasak)</td>
                    <td className="py-3.5 px-4 text-rose-700 font-black">CBAM Beyanına Eklenemez</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Alt Aksiyon Alanı */}
          <div className="mt-12 rounded-3xl border-2 border-amber-400/30 bg-gradient-to-br from-[#061826] via-[#092942] to-[#04121d] p-8 text-center text-white shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Denizcilik Karbon Uyum Dosyası ve Navlun Simülatörü
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-amber-100/80 max-w-xl mx-auto">
              Armatörler için akredite klas denetimine hazır paket üretin; ihracatçılar için navlun faturalarındaki ETS sürşarjını hesaplayın.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <Link
                href="/denizcilik/dosya-hazirla/#form-section"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-7 text-sm font-black text-slate-950 transition hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/25"
              >
                Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD) <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#hesaplayici"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/20 transition"
              >
                İhracatçı Navlun Sürşarjı Simülatörüne İn ↓
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

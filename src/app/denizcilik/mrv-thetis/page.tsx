import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, FileCode, CheckCircle2, AlertCircle, Ship } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { MaritimeWaveDivider } from "@/components/maritime/MaritimeWaveDivider";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/mrv-thetis/",
  title: "THETIS-MRV ve EU MRV: Gemi Emisyon Takip, XML Raporu ve 400-5000 GT Kapsamı | SKDMHesapla",
  description:
    "Tüzük (AB) 2015/757 ve 2023/957 uyarınca 400-4.999 GT genel kargo ve 5.000+ GT gemiler için EU MRV raporlama kuralları, THETIS-MRV XML veri hazırlığı ve akredite doğrulayıcı inceleme paketi.",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "400 ile 4.999 GT arasındaki gemiler EU MRV kapsamında mıdır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Tüzük (AB) 2023/957 ile getirilen güncelleme uyarınca 1 Ocak 2025 tarihinden itibaren 400 ile 4.999 GT arasındaki genel kargo gemileri ve 400 GT üzeri açık deniz (offshore) gemileri EU MRV emisyon izleme ve raporlama yükümlülüğüne tabidir. Ancak bu tonaj aralığı için EU ETS karbon tahsisatı teslim yükümlülüğü henüz zorunlu kılınmamıştır.",
      },
    },
    {
      "@type": "Question",
      name: "THETIS-MRV portalına raporlar nasıl yüklenir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gemi işletmecileri veya yetkili teknik temsilcileri, sefer ve yakıt tüketim verilerini EMSA THETIS-MRV portalına doğrudan arayüzden veya standartlaştırılmış XML aktarım dosyası yükleyerek girer. Bu veriler ardından armatörün atadığı bağımsız akredite doğrulayıcı tarafından sistem üzerinden onaylanır.",
      },
    },
    {
      "@type": "Question",
      name: "İzleme Planı (Monitoring Plan) neleri içermelidir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "İzleme planı; yakıt ölçüm metodolojisini (Yöntem A: BDN ve periyodik tank sondajı, Yöntem B: bunker tank sondajı, Yöntem C: akışölçerler veya Yöntem D: doğrudan emisyon ölçümü), cihaz kalibrasyon prosedürlerini, ölçüm belirsizlik analizini ve veri boşluğu yönetim yöntemlerini içermek zorundadır.",
      },
    },
  ],
};

export default function MrvThetisPage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/mrv-thetis/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sky-950/40 bg-gradient-to-b from-[#020b14] via-[#05192d] to-[#082942] pt-14 pb-16 text-white">
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-sky-300 shadow-md">
            <FileCode className="h-3.5 w-3.5 text-sky-400" />
            <span>TÜZÜK (AB) 2015/757 &amp; TÜZÜK (AB) 2023/957 · EU MRV</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl text-white">
            EU MRV ve THETIS-MRV: Gemi Emisyon Takip Sistemi ve Doğrulama Hazırlığı
          </h1>

          <div className="mt-6 max-w-3xl rounded-2xl border-2 border-sky-500/30 bg-gradient-to-br from-[#071e33]/95 via-[#092944]/85 to-[#04121f]/90 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-400 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
                Sade Türkçe Mevzuat Özeti
              </span>
              <span className="text-[11px] font-bold text-sky-200 font-mono">
                TÜZÜK (AB) 2023/957
              </span>
            </div>
            <p className="mt-3 text-sm font-medium leading-relaxed text-sky-100">
              EU MRV (İzleme, Raporlama ve Doğrulama); AB limanlarına uğrayan ticari gemilerin sera gazı emisyonlarını kayıt altına alan yasal altyapıdır. 1 Ocak 2025 itibarıyla 400-4.999 GT arasındaki genel kargo ve 400 GT üzeri offshore gemileri de izleme kapsamına dahil edilmiştir. Platformumuz sefer kütüklerinizi ve BDN verilerinizi EMSA THETIS-MRV portalına uygun XML formatına dönüştürerek akredite doğrulayıcı incelemesine hazırlar.
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
              Tonaj Kapsamı ve 2025 Genişlemesi
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Hangi gemiler için hangi rejim zorunlu? 400 GT ve 5.000 GT ayrımı.
            </p>
          </div>

          {/* Scope Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-6 shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-200 text-amber-900 text-xs font-bold mb-3">
                1 Ocak 2025&apos;ten İtibaren Yeni Kapsam
              </div>
              <h3 className="text-lg font-bold text-slate-900">400 – 4.999 GT Genel Kargo &amp; Offshore</h3>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>EU MRV:</strong> Emisyon izleme, sefer kütüğü ve yıllık raporlama ZORUNLU.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>İzleme Planı:</strong> Akredite doğrulayıcı onaylı izleme planı gereklidir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>EU ETS:</strong> Karbon tahsisatı teslimi henüz zorunlu DEĞİLDİR.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>FuelEU:</strong> Yakıt yoğunluğu kısıtlaması henüz uygulanmamaktadır.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-sky-300 bg-sky-50/40 p-6 shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-200 text-sky-900 text-xs font-bold mb-3">
                Tam Kapsam Yürürlükte
              </div>
              <h3 className="text-lg font-bold text-slate-900">5.000+ GT Ticari Yük ve Yolcu Gemileri</h3>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>EU MRV:</strong> THETIS-MRV emisyon raporu ZORUNLU.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>EU ETS:</strong> 2026 itibarıyla %100 tam EUA tahsisat teslimi ZORUNLU.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>FuelEU:</strong> 89.34 gCO₂eq/MJ yoğunluk sınırı ve ceza rejimi ZORUNLU.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Gaz Kapsamı:</strong> CO₂ + CH₄ (metan) + N₂O zorunlu raporlanır.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3 Steps Pipeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              THETIS-MRV Veri Hazırlık Süreci (3 Aşamalı Akış)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-mono font-bold text-sky-700">ADIM 1</span>
                <h4 className="mt-1 font-bold text-slate-900 text-sm">Sefer &amp; BDN Kütüğü</h4>
                <p className="mt-2 text-xs text-slate-600">
                  Gemi kalkış/varış limanları, yakıt tüketimleri ve teslim makbuzları (BDN) sisteme girilir.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-mono font-bold text-sky-700">ADIM 2</span>
                <h4 className="mt-1 font-bold text-slate-900 text-sm">Kütle Denkliği &amp; Doğrulama</h4>
                <p className="mt-2 text-xs text-slate-600">
                  Yakıt kütle korunum denetimi ve IEEE-754 emisyon hesapları deterministik olarak çalıştırılır.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-mono font-bold text-sky-700">ADIM 3</span>
                <h4 className="mt-1 font-bold text-slate-900 text-sm">THETIS Destekli XML &amp; Mühür</h4>
                <p className="mt-2 text-xs text-slate-600">
                  EMSA formatında XML ve SHA-256 kriptografik denetim paketi akredite doğrulayıcı için indirilir.
                </p>
              </div>
            </div>
          </div>

          {/* Alt Aksiyon Alanı */}
          <div className="mt-12 rounded-3xl border-2 border-sky-400/30 bg-gradient-to-br from-[#061826] via-[#092942] to-[#04121d] p-8 text-center text-white shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              THETIS-MRV Uyumlu Doğrulama Paketini Hazırlayın
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-sky-100/80 max-w-xl mx-auto">
              Sefer kütüğünüzü, BDN yakıt kayıtlarınızı ve MRV emisyon izleme planınızı akredite doğrulayıcıya (klas) hazır 6 parçalı pakete dönüştürün.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <a
                href="/denizcilik/dosya-hazirla/#form-section"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300 px-7 text-sm font-black text-slate-950 transition hover:from-sky-300 hover:to-cyan-200 shadow-lg shadow-cyan-500/25"
              >
                Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD) <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/denizcilik/#simulator"
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

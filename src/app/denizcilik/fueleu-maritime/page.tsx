import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Scale, AlertTriangle, CheckCircle2, Flame } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { MaritimeWaveDivider } from "@/components/maritime/MaritimeWaveDivider";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/fueleu-maritime/",
  title: "FuelEU Maritime Nedir? Yakıt Yoğunluğu Sınırı ve Ceza Hesaplama | SKDMHesapla",
  description:
    "Tüzük (AB) 2023/1805 kapsamında 5.000 GT üzeri gemiler için Well-to-Wake sera gazı yoğunluk sınırları, Compliance Balance hesabı, banking/borrowing kuralları ve ceza simülatörü.",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "FuelEU Maritime nedir ve hangi gemileri kapsar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FuelEU Maritime (Tüzük (AB) 2023/1805), 1 Ocak 2025'ten itibaren AB limanlarına uğrak yapan 5.000 GT ve üzeri ticari yük ve yolcu gemilerini kapsar. Gemide tüketilen tüm yakıtların kuyu-pervane (Well-to-Wake) sera gazı yoğunluğunun referans değere (91.16 gCO₂eq/MJ) kıyasla kademeli olarak düşürülmesini şart koşar.",
      },
    },
    {
      "@type": "Question",
      name: "FuelEU ceza formülü nasıl çalışır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bir gemi hedef yoğunluk sınırını aşarsa uyum açığı (negatif Compliance Balance) oluşur. Ceza; bu açığın VLSFO enerji denkliğine (41.000 MJ/t) bölünmesi ve kanuni ceza birim maliyeti olan 2.400 EUR ile çarpılmasıyla hesaplanır. Üst üste uyumsuzluk halinde ceza çarpanı 1 + (yıl-1)/10 oranında artar.",
      },
    },
    {
      "@type": "Question",
      name: "Uyum fazlalığı devredilebilir mi (Banking) veya borçlanılabilir mi (Borrowing)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Madde 20 uyarınca pozitif uyum dengesi akredite doğrulayıcı incelemesi sonrasında bir sonraki raporlama yılına devredilebilir. Madde 21 uyarınca ise azami %2 tavanıyla bir sonraki yıldan borçlanma yapılabilir; borçlanan miktar bir sonraki yıl 1.1 çarpanıyla geri ödenir.",
      },
    },
  ],
};

const reductionTargets = [
  { year: "2025 – 2029", reduction: "-%2", limit: "89.34 gCO₂eq/MJ", note: "İlk uyum eşiği yürürlüktedir." },
  { year: "2030 – 2034", reduction: "-%6", limit: "85.69 gCO₂eq/MJ", note: "Biyoyakıt veya LNG karışımı kritik hale gelir." },
  { year: "2035 – 2039", reduction: "-%14.5", limit: "77.94 gCO₂eq/MJ", note: "Alternatif yakıt veya rüzgar destekli sevk gerekir." },
  { year: "2040 – 2044", reduction: "-%31", limit: "62.90 gCO₂eq/MJ", note: "Düşük karbonlu yakıt zorunluluğu." },
  { year: "2050+", reduction: "-%80", limit: "18.23 gCO₂eq/MJ", note: "Tam dekarbonizasyon hedefi." },
];

export default function FuelEuMaritimePage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/fueleu-maritime/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sky-950/40 bg-gradient-to-b from-[#020b14] via-[#05192d] to-[#082942] pt-14 pb-16 text-white">
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-sky-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-teal-300 shadow-md">
            <Flame className="h-3.5 w-3.5 text-teal-400" />
            <span>TÜZÜK (AB) 2023/1805 · FUELEU MARITIME YAKIT STANDARDI</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl text-white">
            FuelEU Maritime: Denizcilik Yakıtı Sera Gazı Yoğunluğu ve Ceza Mekanizması
          </h1>

          <div className="mt-6 max-w-3xl rounded-2xl border-2 border-teal-500/30 bg-gradient-to-br from-[#071e33]/95 via-[#092944]/85 to-[#04121f]/90 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-400 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
                Sade Türkçe Mevzuat Özeti
              </span>
              <span className="text-[11px] font-bold text-teal-200 font-mono">
                TÜZÜK (AB) 2023/1805
              </span>
            </div>
            <p className="mt-3 text-sm font-medium leading-relaxed text-sky-100">
              FuelEU Maritime, 1 Ocak 2025&apos;ten itibaren 5.000 GT üzeri gemilerin AB seferlerinde tükettiği yakıtın Well-to-Wake sera gazı yoğunluğuna sınır getirir. Standart fosil yakıtlar (VLSFO/MGO) hedef yoğunluğun (89.34 gCO₂eq/MJ) üzerinde kaldığı için uyumsuzluk durumunda ton eşdeğeri başına 2.400 EUR ceza tahakkuk eder. Fazlalıklar gelecek yıla devredilebilir (banking) veya filo genelinde havuzlanabilir (pooling).
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/denizcilik/dosya-hazirla/#form-section"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg hover:from-teal-300 hover:to-cyan-200 transition-all"
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
              FuelEU Kademeli Yoğunluk Düşüş Tablosu
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Referans emisyon yoğunluğu (91.16 gCO₂eq/MJ) baz alınarak belirlenen 2025-2050 takvimi.
            </p>
          </div>

          {/* Target Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm mb-12">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Dönem</th>
                  <th className="py-3.5 px-4 sm:px-6">Azaltım Hedefi</th>
                  <th className="py-3.5 px-4 sm:px-6">Azami Sera Gazı Yoğunluğu</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden sm:table-cell">Operasyonel Etki</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reductionTargets.map((row, idx) => (
                  <tr key={row.year} className={idx === 0 ? "bg-teal-50/40 font-semibold" : ""}>
                    <td className="py-4 px-4 sm:px-6 font-mono text-slate-900">{row.year}</td>
                    <td className="py-4 px-4 sm:px-6 text-teal-700 font-bold">{row.reduction}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-slate-800">{row.limit}</td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-slate-600 hidden sm:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Flexibility Mechanisms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-base font-bold text-slate-900">1. Devretme (Banking - Madde 20)</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Geminiz hedeften daha temiz yakıt kullanarak pozitif bir uyum dengesi sağlarsa, akredite doğrulayıcının onayıyla bu fazlalığı bir sonraki raporlama dönemine aktarabilirsiniz.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-base font-bold text-slate-900">2. Borçlanma (Borrowing - Madde 21)</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Uyum açığı yaşayan gemiler, hedefin en fazla %2&apos;si kadarını bir sonraki yıldan borçlanabilir. Borçlanılan tutar sonraki yıl 1.1 katı cezai çarpanla kapatılmalıdır.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-base font-bold text-slate-900">3. Havuzlama (Fleet Pooling - Madde 21)</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Aynı veya farklı armatörlerin birden fazla gemisi tek bir havuzda birleştirilebilir. Fazlalığı olan yeşil gemi, eksikliği olan konvansiyonel geminin açığını dengeler.
              </p>
            </div>
          </div>

          {/* Alt Aksiyon Alanı */}
          <div className="mt-12 rounded-3xl border-2 border-teal-400/30 bg-gradient-to-br from-[#061826] via-[#092942] to-[#04121d] p-8 text-center text-white shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              FuelEU &amp; ETS Uyumlu Gemi Karbon Paketini Hazırlayın
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-teal-100/80 max-w-xl mx-auto">
              FuelEU sera gazı yoğunluk kütüğü, BDN yakıt kayıtları ve ceza hesaplarını akredite klas doğrulayıcısına hazır mühürlü pakete dönüştürün.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <a
                href="/denizcilik/dosya-hazirla/#form-section"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 px-7 text-sm font-black text-slate-950 transition hover:from-teal-300 hover:to-cyan-200 shadow-lg shadow-teal-500/25"
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

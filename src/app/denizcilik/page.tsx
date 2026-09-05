import type { Metadata } from "next";
import Link from "next/link";
import {
  Ship,
  Anchor,
  ArrowRight,
  ShieldCheck,
  Scale,
  TrendingDown,
  Compass,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { MaritimeSurchargeSimulator } from "@/components/maritime/MaritimeSurchargeSimulator";
import { MaritimeHeroVisual } from "@/components/maritime/MaritimeHeroVisual";
import { MaritimeHeroBackgroundDrawing } from "@/components/maritime/MaritimeHeroBackgroundDrawing";
import { MaritimeWaveDivider } from "@/components/maritime/MaritimeWaveDivider";
import { MaritimeProcessInfographic } from "@/components/maritime/MaritimeProcessInfographic";
import { MaritimeRegulatoryMatchBanner } from "@/components/maritime/MaritimeRegulatoryMatchBanner";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/",
  title: "AB Denizcilik Karbon Rejimi: EU ETS, FuelEU ve THETIS-MRV Uyum Portalı | SKDMHesapla",
  description:
    "Türkiye-AB seferlerinde gemi işletmecileri için 2026 %100 tam kapsam EU ETS, FuelEU ve akredite doğrulayıcı inceleme paketi (599 USD). İhracatçılar için ETS navlun sürşarjı kontrolü.",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Gemi navlunundaki karbon sürşarjı (ETS Freight Surcharge) CBAM beyanına eklenebilir mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. AB 2023/956 ve Kesin Dönem Uygulama Tüzüğü (AB) 2025/2547 uyarınca CBAM hesaplama sınırı fabrika kapısında (ex-works / gate) sona erer. Deniz yoluyla taşıma emisyonları armatörün EU ETS yükümlülüğüdür. Navlun faturasındaki karbon bedeli bir lojistik gideridir; CBAM Özgül Gömülü Emisyon (SEE) formülüne yazılamaz.",
      },
    },
    {
      "@type": "Question",
      name: "5.000 GT altındaki genel kargo ve feeder gemileri EU ETS ve FuelEU kapsamında mıdır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EU ETS (Direktif (AB) 2023/959) ve FuelEU (Tüzük (AB) 2023/1805) kapsamında 5.000 GT ve üzeri ticari yük ve yolcu gemileri için karbon tahsisatı ve yakıt yoğunluk sınırı zorunludur. Ancak Tüzük (AB) 2023/957 uyarınca, 1 Ocak 2025'ten itibaren 400 ile 4.999 GT arasındaki genel kargo ve 400 GT üzeri offshore gemileri de EU MRV emisyon izleme ve THETIS-MRV raporlama kapsamına alınmıştır.",
      },
    },
    {
      "@type": "Question",
      name: "skdmhesapla.com resmi bir klas kuruluşu veya akredite doğrulayıcı (verifier) mıdır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. Platformumuz resmi bir akredite doğrulayıcı (verifier) veya klas kuruluşu değildir. Platformumuz; armatörün sefer, yakıt ve BDN verilerini analiz ederek EMSA THETIS-MRV XML formatına ve FuelEU kütüğüne dönüştüren, denetçinin önüne sıfır veri eksiğiyle sunulmasını sağlayan teknik uyum ve dosya hazırlık yazılımıdır.",
      },
    },
    {
      "@type": "Question",
      name: "2026 yılı itibarıyla denizcilikte EU ETS teslim yükümlülüğü oranı nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2024 yılındaki %40 ve 2025 yılındaki %70 aşamalı geçiş (phase-in) dönemi tamamlanmıştır. 1 Ocak 2026 itibarıyla Türkiye-AB limanları arasındaki seferlerde raporlanan emisyonların %50'si için %100 oranında EUA teslimi zorunludur. Ayrıca 2026 ile birlikte karbondioksit (CO₂) yanında metan (CH₄) ve diazot monoksit (N₂O) sera gazları da sisteme dahil edilmiştir.",
      },
    },
  ],
};

const phaseInTimeline = [
  {
    year: "2024",
    percentage: "%40",
    scope: "Raporlanan doğrulanmış CO₂ emisyonlarının %40'ı için EUA teslim yükümlülüğü uygulandı.",
    status: "Tamamlandı",
    statusBg: "bg-slate-200 text-slate-700 font-bold",
    cardStyle: "border border-slate-300 bg-slate-50/80 shadow-xs",
    percentColor: "text-slate-600",
  },
  {
    year: "2025",
    percentage: "%70",
    scope: "Raporlanan doğrulanmış CO₂ emisyonlarının %70'i için EUA teslim yükümlülüğü uygulandı.",
    status: "Geçiş Tamamlandı",
    statusBg: "bg-slate-200 text-slate-700 font-bold",
    cardStyle: "border border-slate-300 bg-slate-50/80 shadow-xs",
    percentColor: "text-slate-600",
  },
  {
    year: "2026+",
    percentage: "%100",
    scope: "Tüm emisyonların %100 tam teslimi. Ayrıca metan (CH₄) ve diazot monoksit (N₂O) sera gazları sisteme dahil edilmiştir.",
    status: "Aktif Yürürlük",
    statusBg: "bg-emerald-600 text-white font-black",
    cardStyle: "border-2 border-emerald-600 bg-gradient-to-b from-emerald-50 via-white to-emerald-50/50 shadow-md ring-2 ring-emerald-500/20 relative",
    percentColor: "text-emerald-950",
    activeBadge: "Tam Kapsam Yürürlükte",
  },
] as const;

const portCorridors = [
  {
    hub: "Ambarlı Liman Kompleksi (İstanbul)",
    terminals: "Marport, Kumport, Mardaş",
    tradeFlow: "Marmara ve Trakya sanayisinin konteyner ihracatı (İtalya, İspanya, Pire aktarmalı Kuzey Avrupa).",
    etsImpact: "Ambarlı-AB limanları arası tek yönlü seferlerde toplam seyir emisyonunun %50'si ETS teslimine tabidir.",
    regionBadge: "Marmara & Trakya Havzası",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
    cardBorder: "border-2 border-sky-300/80 bg-gradient-to-br from-sky-50/80 via-white to-sky-50/30",
    iconBg: "bg-sky-900 text-sky-200",
  },
  {
    hub: "Mersin Uluslararası Limanı (MIP)",
    terminals: "MIP Rıhtımları, Doğu Akdeniz Terminali",
    tradeFlow: "Gaziantep OSB, Adana, İskenderun ve İç Anadolu çelik, tekstil ve kimya ihracatı.",
    etsImpact: "Doğu Akdeniz-Güney Avrupa feeder ve direkt hatlarında sefer başına %50 ETS tahakkuku uygulanır.",
    regionBadge: "Doğu Akdeniz & Güneydoğu",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
    cardBorder: "border-2 border-teal-300/80 bg-gradient-to-br from-teal-50/80 via-white to-teal-50/30",
    iconBg: "bg-teal-900 text-teal-200",
  },
  {
    hub: "Kocaeli & İzmit Körfezi Limanları",
    terminals: "Evyapport, Yılport Gebze, DP World Yarımca",
    tradeFlow: "Ağır sanayi, çelik rulo/profil, kimyasal madde ve otomotiv sevkiyatları.",
    etsImpact: "Genel kargo ve dökme yük taşımacılığında navlun başına yansıtılan EUA sürşarjı kritik maliyet unsurudur.",
    regionBadge: "Sanayi & Kimya Koridoru",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    cardBorder: "border-2 border-indigo-300/80 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/30",
    iconBg: "bg-indigo-900 text-indigo-200",
  },
  {
    hub: "Aliağa & Nemrut Körfezi Limanları (İzmir)",
    terminals: "Nemport, TCEEGE, Batıçim, Ege Gübre",
    tradeFlow: "Ege Bölgesi inşaat demiri, kütük demir, alüminyum profil ve çimento sevkiyatları.",
    etsImpact: "Dökme yük ve hurda/demir gemilerinde 5.000 GT üstü armatörler için doğrudan MRV & ETS takip zorunluluğu.",
    regionBadge: "Ege Dökme Çelik & Çimento",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    cardBorder: "border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30",
    iconBg: "bg-amber-900 text-amber-200",
  },
] as const;

const comparisonMatrix = [
  {
    parameter: "Hukuki Temel",
    cbam: "AB Tüzüğü 2023/956 & 2025/2547",
    maritimeEts: "Direktif 2003/87/EC (2023/959 Tadili)",
    fueleu: "AB Tüzüğü 2023/1805",
  },
  {
    parameter: "Yükümlü Taraf",
    cbam: "AB İthalatçısı (Yetkili CBAM Beyan Sahibi)",
    maritimeEts: "Gemi İşletmecisi / Armatör (ISM Company)",
    fueleu: "Gemi İşletmecisi / Armatör (ISM Company)",
  },
  {
    parameter: "Kapsanan Faaliyet",
    cbam: "İthal edilen ürünün üretimindeki gömülü emisyon (SEE)",
    maritimeEts: "5.000 GT+ gemilerin sefer ve liman emisyonları",
    fueleu: "Gemide tüketilen enerjinin sera gazı yoğunluğu (Well-to-Wake)",
  },
  {
    parameter: "Türk İhracatçısına Yansıması",
    cbam: "Resmi CBAM beyanı için doğrudan/dolaylı emisyon hesabı",
    maritimeEts: "Navlun faturasında 'ETS Surcharge' (karbon ek ücreti)",
    fueleu: "Uyumsuz gemiler için navlun cezası veya yeşil yakıt primi",
  },
  {
    parameter: "Doğrulama Merci",
    cbam: "Akredite Bağımsız CBAM Doğrulayıcısı",
    maritimeEts: "Akredite Denizcilik MRV Doğrulayıcısı (Accredited Verifier)",
    fueleu: "Akredite FuelEU Doğrulayıcısı (Accredited Verifier)",
  },
] as const;

export default function DenizcilikPage() {
  return (
    <main className="min-h-screen bg-white text-ink-900">
      <RegistryJsonLd route="/denizcilik/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-sky-950/40 bg-gradient-to-b from-[#020b14] via-[#05192d] to-[#082942] pt-12 sm:pt-16 pb-0 text-white">
        {/* Ambient Oceanic Glow & Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.25),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Architectural Blueprint Silhouette Drawing */}
        <MaritimeHeroBackgroundDrawing />

        <div className="relative mx-auto max-w-5xl px-5 sm:px-6 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-sky-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-cyan-300 shadow-md backdrop-blur-xs">
            <Anchor className="h-3.5 w-3.5 text-cyan-400" />
            <span>AB DENİZCİLİK KARBON REJİMİ · 2026 TAM KAPSAM (%100 TESLİM) · FUELEU MARITIME</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
            AB Denizcilik Karbon Rejimi:{" "}
            <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              EU ETS, FuelEU ve THETIS-MRV
            </span>{" "}
            Uyum Portalı
          </h1>

          {/* Denizcilik Mevzuat ve Yasal Sınır Tanımı */}
          <div className="hero-answer-engine mt-6 max-w-3xl rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-[#071e33]/95 via-[#092944]/85 to-[#04121f]/90 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-400 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
                Mevzuat Çerçevesi &amp; Yasal Sınır
              </span>
              <span className="text-[11px] font-bold text-cyan-200/90 font-mono tracking-wider">
                DİREKTİF (AB) 2023/959, TÜZÜK (AB) 2023/957 &amp; TÜZÜK (AB) 2023/1805
              </span>
            </div>
            <p className="mt-2.5 text-sm font-medium leading-relaxed text-sky-100/95">
              1 Ocak 2026 itibarıyla Türkiye-AB arasındaki 5.000 GT üzeri ticari seferlerde doğrulanmış emisyonların %50&apos;si için %100 tam EUA teslimi zorunludur (CO₂ yanında metan CH₄ ve N₂O sisteme dahil edilmiştir). Ayrıca 1 Ocak 2025&apos;ten itibaren 400-4.999 GT genel kargo ve offshore gemileri de EU MRV izleme kapsamındadır. Platformumuz; armatörler için akredite doğrulayıcılara sunulacak 9 klasörlük mühürlü veri paketini üretir, ihracatçılar için navlun sürşarjını ayrıştırarak fabrika kapısı CBAM beyanınızı cezai risklerden korur.
            </p>
          </div>

          {/* 4'lü Status Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
              <span className="block text-[10px] font-mono text-cyan-300 uppercase tracking-wider">EMİSYON KAPSAMI</span>
              <strong className="block mt-1 text-sm font-black text-white">5.000+ GT (&amp; 400+ MRV)</strong>
              <span className="block text-[10px] text-slate-300">Tüzük (AB) 2023/957</span>
            </div>
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-950/40 p-3 backdrop-blur-xs">
              <span className="block text-[10px] font-mono text-emerald-300 uppercase tracking-wider">2026 ETS REJİMİ</span>
              <strong className="block mt-1 text-sm font-black text-emerald-200">%100 Tam Teslim</strong>
              <span className="block text-[10px] text-emerald-300/80">CO₂ + Metan (CH₄) + N₂O</span>
            </div>
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-950/40 p-3 backdrop-blur-xs">
              <span className="block text-[10px] font-mono text-cyan-300 uppercase tracking-wider">FUELEU MARITIME</span>
              <strong className="block mt-1 text-sm font-black text-cyan-200">89.34 gCO₂e/MJ</strong>
              <span className="block text-[10px] text-cyan-300/80">Well-to-Wake Sınırı</span>
            </div>
            <div className="rounded-xl border border-sky-400/20 bg-sky-950/40 p-3 backdrop-blur-xs">
              <span className="block text-[10px] font-mono text-sky-300 uppercase tracking-wider">DENETİM STANDARDI</span>
              <strong className="block mt-1 text-sm font-black text-sky-200">Akredite Doğrulayıcı</strong>
              <span className="block text-[10px] text-sky-300/80">EMSA THETIS-MRV</span>
            </div>
          </div>

          {/* Persona Gate: Armatör vs. İhracatçı Giriş Kapıları */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-cyan-400/40 bg-gradient-to-br from-[#061d31]/95 to-[#041525]/95 p-5 text-white shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 text-[11px] font-black uppercase">
                <Ship className="h-3.5 w-3.5" />
                <span>1. Armatör &amp; Gemi İşletmecisi</span>
              </div>
              <h3 className="mt-2 text-base font-black text-white">
                Akredite Doğrulayıcı İnceleme Dosyası (599 USD)
              </h3>
              <p className="mt-1.5 text-xs text-sky-100/90 leading-relaxed">
                9 yasal klasör, THETIS-MRV uyumlu XML ve FuelEU Madde 15 kütüğü ile doğrulamaya sıfır açıkla girin.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/denizcilik/dosya-hazirla/#form-section"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-cyan-300 transition"
                >
                  <span>Dosya Hazırla (599 USD)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/denizcilik/gemi-karbon-hesaplama/"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  <span>Hızlı Sefer Simülatörü</span>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-[#241a06]/95 to-[#171004]/95 p-5 text-white shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
                <Scale className="h-3.5 w-3.5" />
                <span>2. Türk İhracatçısı &amp; Yük Sahibi</span>
              </div>
              <h3 className="mt-2 text-base font-black text-white">
                ETS Navlun Sürşarjı &amp; CBAM Sınır Ayrımı
              </h3>
              <p className="mt-1.5 text-xs text-amber-100/90 leading-relaxed">
                Navlundaki &ldquo;ETS Surcharge&rdquo; bedelini kontrol edin. Karbon maliyeti fabrika kapısı CBAM&apos;e eklenemez.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/denizcilik/ets-navlun-sursarji/"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-300 transition"
                >
                  <span>Navlun Sürşarjını Hesapla</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/cbam-hesaplama"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  <span>Fabrika Kapısı CBAM</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Özel Rota Navigasyon Linkleri */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
            <Link
              href="/denizcilik/eu-ets/"
              className="rounded-lg border border-sky-400/30 bg-sky-950/60 px-3 py-1.5 text-sky-200 hover:bg-sky-900 transition"
            >
              EU ETS Denizcilik Kuralları &rarr;
            </Link>
            <Link
              href="/denizcilik/fueleu-maritime/"
              className="rounded-lg border border-teal-400/30 bg-teal-950/60 px-3 py-1.5 text-teal-200 hover:bg-teal-900 transition"
            >
              FuelEU Yoğunluk &amp; Ceza &rarr;
            </Link>
            <Link
              href="/denizcilik/mrv-thetis/"
              className="rounded-lg border border-indigo-400/30 bg-indigo-950/60 px-3 py-1.5 text-indigo-200 hover:bg-indigo-900 transition"
            >
              THETIS-MRV &amp; 400-5000 GT &rarr;
            </Link>
            <Link
              href="/denizcilik/gemi-karbon-hesaplama/"
              className="rounded-lg border border-cyan-400/30 bg-cyan-950/60 px-3 py-1.5 text-cyan-200 hover:bg-cyan-900 transition"
            >
              Sefer Hesaplama Aracı &rarr;
            </Link>
            <Link
              href="/denizcilik/ets-navlun-sursarji/"
              className="rounded-lg border border-amber-400/30 bg-amber-950/60 px-3 py-1.5 text-amber-200 hover:bg-amber-900 transition"
            >
              İhracatçı Sürşarj Simülatörü &rarr;
            </Link>
          </div>

          {/* Hero Visual Artwork (SVG Container Vessel & Multi-Layer Ocean Waves) */}
          <MaritimeHeroVisual />
        </div>

        {/* Ocean Wave Transition to Next Section */}
        <MaritimeWaveDivider />
      </section>

      {/* 3 Temel Sütun & Mevzuat Sözleşmesi */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 space-y-10">
          {/* AB Mevzuat Eşleşme ve Doğru Ürün Teyit Kartı */}
          <MaritimeRegulatoryMatchBanner />

          <div className="grid gap-5 md:grid-cols-3">
            <article className="group relative rounded-2xl border-2 border-sky-400/40 bg-gradient-to-b from-sky-50/90 via-sky-50/30 to-white p-6 shadow-sm hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-sky-950 text-sky-200 shadow-md shadow-sky-900/20 group-hover:scale-105 transition">
                <Ship className="h-6 w-6 text-sky-300" />
              </div>
              <span className="mt-4 inline-block rounded-md bg-sky-100 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-sky-900 border border-sky-300/60">
                DİREKTİF (AB) 2023/959
              </span>
              <h2 className="mt-2 text-lg font-black text-sky-950">1. Maritime ETS (2024+)</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                5.000 GT ve üzeri kargo ve yolcu gemilerinin Türkiye-AB arasındaki seferlerinde emisyonların %50&apos;si kademeli olarak (%40 → %70 → %100) ETS&apos;ye tabidir.
              </p>
            </article>

            <article className="group relative rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-b from-emerald-50/90 via-emerald-50/30 to-white p-6 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 text-emerald-200 shadow-md shadow-emerald-900/20 group-hover:scale-105 transition">
                <TrendingDown className="h-6 w-6 text-emerald-300" />
              </div>
              <span className="mt-4 inline-block rounded-md bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-900 border border-emerald-300/60">
                AB TÜZÜĞÜ 2023/1805
              </span>
              <h2 className="mt-2 text-lg font-black text-emerald-950">2. FuelEU Maritime (2025+)</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                Gemide tüketilen yakıtların Well-to-Wake (kuyudan-pervaneye) sera gazı yoğunluğu sınırlandırılır. Uyumsuzluk durumunda gemi başına cezai yaptırım doğar.
              </p>
            </article>

            <article className="group relative rounded-2xl border-2 border-amber-400/40 bg-gradient-to-b from-amber-50/90 via-amber-50/30 to-white p-6 shadow-sm hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-950 text-amber-200 shadow-md shadow-amber-900/20 group-hover:scale-105 transition">
                <Scale className="h-6 w-6 text-amber-300" />
              </div>
              <span className="mt-4 inline-block rounded-md bg-amber-100 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-900 border border-amber-300/60">
                HUKUKİ SINIR HATTI
              </span>
              <h2 className="mt-2 text-lg font-black text-amber-950">3. CBAM &amp; Navlun Ayrımı</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">
                SKDM tesis sınırı ile deniz taşımacılığı yasal olarak ayrı rejimlerdir. Navlun emisyonu CBAM beyanına değil, CIF/DDP navlun ek maliyetine yansır.
              </p>
            </article>
          </div>

          {/* İnteraktif Sürşarj Simülatörü (Exclusive Tool & Monetization Hook) */}
          <div id="simulator" className="mt-12 scroll-mt-20">
            <MaritimeSurchargeSimulator />
          </div>
        </div>
      </section>

      {/* Bölüm 1: EU ETS Kademeli Geçiş Takvimi */}
      <section className="border-y border-line bg-[#f8faf9] py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-800">
              Direktif (AB) 2023/959
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
              EU ETS Denizcilik Kademeli Geçiş Takvimi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Deniz taşımacılığı sektörünün karbon piyasasına uyum sağlaması amacıyla Avrupa Birliği 3 yıllık aşamalı geçiş
              takvimi uygulamaktadır. Teslim yükümlülüğü her yıl Eylül ayı sonunda bir önceki yılın doğrulanmış emisyonları için gerçekleşir.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {phaseInTimeline.map((item) => (
              <div key={item.year} className={`rounded-2xl p-6 ${item.cardStyle}`}>
                {"activeBadge" in item && (
                  <span className="absolute -top-3 right-4 rounded-full bg-sky-900 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-sky-100 shadow-xs">
                    {item.activeBadge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-ink-900">{item.year}</span>
                  <span className={`rounded-lg px-2.5 py-1 text-xs ${item.statusBg}`}>{item.status}</span>
                </div>
                <div className={`mt-4 text-3xl font-black ${item.percentColor}`}>{item.percentage}</div>
                <p className="mt-2 text-xs font-medium leading-5 text-ink-700">{item.scope}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border-2 border-sky-800/30 bg-gradient-to-br from-sky-900/[0.05] via-sky-900/[0.02] to-white p-6 shadow-sm border-l-8 border-l-sky-900">
            <h3 className="text-sm font-black uppercase tracking-wide text-sky-950">
              Coğrafi Kapsam ve Sefer Paylaşım Kuralı (%50 / %100)
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-800">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 rounded bg-sky-900 px-1.5 py-0.5 text-[10px] font-black text-sky-100">%100</span>
                <span><strong>İki AB limanı arası seferler:</strong> Emisyonların %100&apos;ü ETS teslim yükümlülüğündedir.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 rounded bg-amber-800 px-1.5 py-0.5 text-[10px] font-black text-amber-100">%50</span>
                <span><strong>Türkiye limanı ile AB limanı arası seferler:</strong> Sefer boyunca oluşan emisyonun tam %50&apos;si ETS kapsamındadır.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 rounded bg-sky-900 px-1.5 py-0.5 text-[10px] font-black text-sky-100">%100</span>
                <span><strong>AB limanında demirleme / rıhtımda bekleme:</strong> Limanda tüketilen enerjiden kaynaklanan emisyonların %100&apos;ü ETS&apos;ye tabidir.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bölüm 2: Türk Limanları & GEO Lojistik Havzaları */}
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-800">
              Türkiye İhracat Koridorları &amp; Liman Ekosistemi
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
              Türk Limanlarından AB&apos;ye Navlun ve Karbon Akışı
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Türkiye&apos;nin önde gelen konteyner, dökme yük ve Ro-Ro limanları AB deniz ticaretinde doğrudan
              ETS ve FuelEU düzenlemeleriyle temas halindedir. Armatörlerin ve hat operatörlerinin (feeder) uyguladığı karbon sürşarjları
              ihracatçının navlun tekliflerine yansımaktadır.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {portCorridors.map((port) => (
              <article key={port.hub} className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition ${port.cardBorder}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-xs ${port.iconBg}`}>
                      <Compass className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-black text-ink-900">{port.hub}</h3>
                  </div>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${port.badgeColor}`}>
                    {port.regionBadge}
                  </span>
                </div>
                <div className="mt-3 text-xs font-bold text-sky-950">Terminaller: {port.terminals}</div>
                <p className="mt-2 text-xs leading-relaxed text-ink-700"><strong>Yük Akışı:</strong> {port.tradeFlow}</p>
                <div className="mt-3 rounded-xl border border-sky-900/15 bg-white/95 p-3 text-xs leading-relaxed text-ink-800 shadow-xs">
                  <strong className="text-sky-950">ETS &amp; Navlun Etkisi:</strong> {port.etsImpact}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Karşılaştırma Matrisi: CBAM vs ETS Maritime vs FuelEU */}
      <section className="border-t border-line bg-[#f8faf9] py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-800">
              Teknik Uyum ve Düzenleme Ayrımı
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
              CBAM, EU ETS Denizcilik ve FuelEU Karşılaştırma Matrisi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              Üç düzenleme sıklıkla birbirine karıştırılmaktadır. Aşağıdaki matris yükümlü tarafları, yasal dayanakları
              ve Türk ihracatçısının finansal sorumluluk sınırlarını netleştirmektedir.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border-2 border-line bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="border-b-2 border-line text-ink-900">
                <tr>
                  <th className="p-3.5 sm:p-4 font-black bg-slate-100 text-slate-900 w-1/4">Parametre</th>
                  <th className="p-3.5 sm:p-4 font-black bg-amber-100/90 text-amber-950 border-l-2 border-amber-300 w-1/4">
                    <span className="block text-[10px] uppercase tracking-wider text-amber-800">Fabrika Kapısı</span>
                    CBAM (SKDM)
                  </th>
                  <th className="p-3.5 sm:p-4 font-black bg-sky-100/90 text-sky-950 border-l-2 border-sky-300 w-1/4">
                    <span className="block text-[10px] uppercase tracking-wider text-sky-800">Sefer Karbonu</span>
                    EU ETS Denizcilik
                  </th>
                  <th className="p-3.5 sm:p-4 font-black bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-300 w-1/4">
                    <span className="block text-[10px] uppercase tracking-wider text-emerald-800">Yakıt Yoğunluğu</span>
                    FuelEU Maritime
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-700">
                {comparisonMatrix.map((row) => (
                  <tr key={row.parameter} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-ink-900 whitespace-nowrap bg-slate-50/50">{row.parameter}</td>
                    <td className="p-3.5 sm:p-4 border-l border-amber-100 bg-amber-50/15 leading-relaxed">{row.cbam}</td>
                    <td className="p-3.5 sm:p-4 border-l border-sky-100 bg-sky-50/15 leading-relaxed font-medium">{row.maritimeEts}</td>
                    <td className="p-3.5 sm:p-4 border-l border-emerald-100 bg-emerald-50/15 leading-relaxed">{row.fueleu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sorumluluk Sınırı & E-E-A-T */}
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="rounded-3xl border-2 border-sky-900/15 bg-gradient-to-br from-[#06151f] to-[#0a2333] p-6 text-white sm:p-10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-sky-400" />
              <h2 className="text-xl font-black sm:text-2xl">Yasal Sınırlar ve E-E-A-T Metodoloji Beyanı</h2>
            </div>
            <p className="mt-4 text-sm font-normal leading-relaxed text-slate-300">
              SKDMHesapla, AB Direktifi 2023/957 (Maritime ETS) veya AB Tüzüğü 2023/1805 (FuelEU Maritime) kapsamında
              akredite bir denizcilik doğrulayıcısı (klas kuruluşu veya MRV verifier) değildir. Platformumuz, ihracatçılar, armatörler
              ve lojistik operasyonları için deterministik emisyon hesabı, sefer karbon payı modellemesi ve Kapsam 3 tedarik zinciri veri
              hazırlık araçları sunar.
            </p>
            <p className="mt-3 text-sm font-normal leading-relaxed text-slate-300">
              İçerik ve hesaplama mantığı, <strong>Barış Bağırlar</strong> (ISO 14064-1 Sera Gazı Baş Denetçisi, GSO-MEM Karbon Danışma Kurulu Üyesi)
              liderliğinde incelenmiş ve yasal kaynaklarla sınırlandırılmıştır. Resmi THETIS-MRV doğrulama raporları IACS üyesi yetkili klas kuruluşları tarafından düzenlenir.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <Link
                href="/uzmanlik/baris-bagirlar/"
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-300 hover:text-white"
              >
                Baş Denetçi ve Metodoloji Sorumlusu <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/kaynak-politikasi/"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Resmi Kaynak Hiyerarşisi Politikası <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Adımlı Uçtan Uca Süreç İnfografiği */}
      <MaritimeProcessInfographic />

      {/* İhracatçının 4 Adımlı Korunma ve Tasarruf Stratejisi (Conversion & Monetization) */}
      <section className="border-t border-line bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-brand-900">
              Mali Risk Yönetimi &amp; Hukuki Ayrım
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
              Fazladan Karbon Vergisi Ödememek İçin İhracatçı Yol Haritası
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              AB alıcıları, deniz taşımacılığındaki ETS sürşarjları nedeniyle Türk tedarikçilerinden gelen her faturayı
              ve karbon raporunu mercek altına almaktadır. Mükerrer maliyet ödememek ve pazar payınızı korumak için izlemeniz gereken 4 adım:
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/20 p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-xs font-black text-white shadow-xs">
                01
              </span>
              <h3 className="mt-3 text-base font-black text-ink-900">GTİP Kapsamını Doğrulayın</h3>
              <p className="mt-2 text-xs leading-5 text-ink-700">
                Ürününüzün 569 resmi CN/GTİP kodu içinde olup olmadığını kontrol edin. Kapsam dışıysa boşuna CBAM masrafı yapmayın.
              </p>
              <Link href="/basla/" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-emerald-800 hover:underline">
                Ücretsiz Kontrol <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-sky-500/30 bg-gradient-to-b from-sky-50/70 via-white to-sky-50/20 p-5 shadow-sm hover:border-sky-500 hover:shadow-md transition">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-800 text-xs font-black text-white shadow-xs">
                02
              </span>
              <h3 className="mt-3 text-base font-black text-ink-900">Gerçek SEE&apos;yi Sunun</h3>
              <p className="mt-2 text-xs leading-5 text-ink-700">
                Cezai varsayılan (default) değerler yerine fabrikanızın gerçek tesis ve elektrik verileriyle hesaplanmış düşük emisyonu beyan edin.
              </p>
              <Link href="/cbam-hesaplama/" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-sky-800 hover:underline">
                Hesaplama Motoru <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/20 p-5 shadow-sm hover:border-amber-500 hover:shadow-md transition">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-800 text-xs font-black text-white shadow-xs">
                03
              </span>
              <h3 className="mt-3 text-base font-black text-ink-900">Navlunu CBAM&apos;dan Ayırın</h3>
              <p className="mt-2 text-xs leading-5 text-ink-700">
                Armatörün navluna kestiği ETS sürşarjını faturada net belirtin; CBAM Communication Template&apos;e dahil edilmesini engelleyin.
              </p>
              <Link href="/metodoloji/" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-amber-800 hover:underline">
                Metodoloji Ayrımı <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-sky-500 bg-gradient-to-b from-[#061d2d] via-[#092b43] to-[#041420] p-5 text-white shadow-xl relative ring-2 ring-sky-400/40 hover:ring-sky-400 transition">
              <span className="inline-block rounded-full bg-sky-400 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950 tracking-wider shadow-xs">
                ÖNERİLEN ÇÖZÜM · 599 USD
              </span>
              <h3 className="mt-2.5 text-base font-black text-white">Denizcilik Uyum Dosyası</h3>
              <p className="mt-2 text-xs leading-5 text-sky-100/90">
                1 gemi · 1 raporlama yılı · tek seferlik (599 USD). EU MRV, ETS ve FuelEU kanıt omurgasıyla klas doğrulayıcısına hazır paket.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/denizcilik/dosya-hazirla/#form-section"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-sky-400 py-2.5 text-xs font-black text-slate-950 transition hover:bg-sky-300 shadow-md"
                >
                  Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD) <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="#simulator"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 py-2 text-xs font-bold text-sky-200 hover:bg-white/15 transition"
                >
                  İhracatçı Navlun Sürşarjı Simülatörüne İn ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular */}
      <section className="border-t border-line bg-gradient-to-b from-[#f4f8fb] via-white to-[#f4f8fb] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-100 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-sky-900 border border-sky-300">
                <HelpCircle className="h-3.5 w-3.5 text-sky-700" />
                Sıkça Sorulan Sorular
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl text-ink-900">
                Denizcilik Karbonu &amp; ETS Sık Sorulan Sorular
              </h2>
            </div>
            <p className="text-xs text-ink-600 font-medium max-w-sm">
              Armatör, lojistik operasyon ve ihracatçıların en sık karşılaştığı 4 kritik ayrım noktası
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {/* Card 1 */}
            <article className="group rounded-2xl border-2 border-sky-400/30 bg-gradient-to-br from-white via-sky-50/25 to-sky-50/60 p-6 shadow-sm hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300">
              <div className="flex items-center justify-between gap-2 border-b border-sky-100 pb-3">
                <span className="inline-block rounded-md bg-sky-900 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-sky-100">
                  CBAM &amp; Navlun Sınırı
                </span>
                <span className="text-[10px] font-mono font-bold text-sky-800">AB 2023/956 &amp; 2025/2547</span>
              </div>
              <div className="mt-3 flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-sky-900 text-white shadow-md shadow-sky-900/20 group-hover:scale-105 transition">
                  <Ship className="h-5 w-5 text-sky-200" />
                </div>
                <div>
                  <h3 className="text-base font-black text-ink-900 group-hover:text-sky-950 transition">
                    Deniz navlunu CBAM beyanına eklenir mi?
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700">
                    <strong className="text-sky-950">Hayır.</strong> AB 2023/956 ve 2025/2547 uyarınca CBAM gömülü emisyonu (SEE) yalnızca üretim tesisindeki doğrudan (Kapsam 1) ve elektrik (Kapsam 2) emisyonları ile öncül maddeleri kapsar. Deniz yoluyla yapılan uluslararası nakliye CBAM formülüne girmez; ancak navlun faturasındaki ETS ek ücreti olarak ithalatçının toplam CIF maliyetine yansır.
                  </p>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="group rounded-2xl border-2 border-amber-400/30 bg-gradient-to-br from-white via-amber-50/25 to-amber-50/60 p-6 shadow-sm hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
              <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-3">
                <span className="inline-block rounded-md bg-amber-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-100">
                  %50 Sefer Paylaşım Kuralı
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-800">Direktif 2023/957</span>
              </div>
              <div className="mt-3 flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition">
                  <Anchor className="h-5 w-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="text-base font-black text-ink-900 group-hover:text-amber-950 transition">
                    Türkiye-AB seferlerinde neden %50 emisyon dikkate alınır?
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700">
                    Direktif 2023/957 kuralına göre, bir ucu AB limanında olan üçüncü ülke seferlerinde yetki paylaşımı ve çifte vergilendirmeyi önlemek amacıyla emisyonların <strong className="text-amber-950">%50&apos;si AB ETS kapsamına</strong> alınır. Diğer %50 ise bayrak devleti veya kalkış ülkesinin olası karbon düzenlemelerine bırakılmıştır.
                  </p>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="group rounded-2xl border-2 border-emerald-400/30 bg-gradient-to-br from-white via-emerald-50/25 to-emerald-50/60 p-6 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                <span className="inline-block rounded-md bg-emerald-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-100">
                  2026 Tam Kapsam Rejimi
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800">%100 EUA + CH₄ / N₂O</span>
              </div>
              <div className="mt-3 flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition">
                  <TrendingDown className="h-5 w-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base font-black text-ink-900 group-hover:text-emerald-950 transition">
                    2026 yılı itibarıyla denizcilikte EU ETS teslim yükümlülüğü oranı nedir?
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700">
                    2024 yılındaki %40 ve 2025 yılındaki %70 aşamalı geçiş (phase-in) dönemi tamamlanmıştır. <strong className="text-emerald-950">1 Ocak 2026 itibarıyla</strong> Türkiye-AB limanları arasındaki seferlerde raporlanan emisyonların %50&apos;si için <strong>%100 oranında EUA teslimi zorunludur</strong>. Ayrıca 2026 ile birlikte karbondioksit (CO₂) yanında metan (CH₄) ve diazot monoksit (N₂O) sera gazları da sisteme dahil edilmiştir.
                  </p>
                </div>
              </div>
            </article>

            {/* Card 4 */}
            <article className="group rounded-2xl border-2 border-indigo-400/30 bg-gradient-to-br from-white via-indigo-50/25 to-indigo-50/60 p-6 shadow-sm hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="flex items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                <span className="inline-block rounded-md bg-indigo-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-100">
                  Hukuki Sınır &amp; Akreditasyon
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-800">Ready for Verification</span>
              </div>
              <div className="mt-3 flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-900 text-white shadow-md shadow-indigo-900/20 group-hover:scale-105 transition">
                  <ShieldCheck className="h-5 w-5 text-indigo-200" />
                </div>
                <div>
                  <h3 className="text-base font-black text-ink-900 group-hover:text-indigo-950 transition">
                    skdmhesapla.com resmi bir klas kuruluşu veya akredite doğrulayıcı mıdır?
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-700">
                    <strong className="text-indigo-950">Hayır.</strong> Platformumuz resmi bir akredite doğrulayıcı (DNV, RINA, BV, ABS vb.) veya onaylanmış klas kuruluşu değildir. Platformumuz; armatörün sefer, yakıt ve BDN verilerini analiz ederek EMSA THETIS-MRV XML formatına ve FuelEU kütüğüne dönüştüren, denetçinin önüne sıfır veri eksiğiyle sunulmasını sağlayan teknik uyum ve dosya hazırlık yazılımıdır.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA / Dönüşüm */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="rounded-3xl border-2 border-sky-400/30 bg-gradient-to-br from-[#061826] via-[#092942] to-[#04121d] p-8 text-center text-white sm:p-12 shadow-2xl relative overflow-hidden ring-1 ring-sky-400/20">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/60 px-4 py-1.5 text-xs font-black text-sky-300 shadow-xs">
              <Ship className="h-4 w-4" /> 1 Gemi · 1 Raporlama Yılı · Tek Seferlik 599 USD
            </div>
            <h2 className="mt-4 text-2xl font-black sm:text-4xl text-white tracking-tight">
              Denizcilik Karbon Uyum Hazırlık Dosyanızı Şimdi Oluşturun
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-sky-100/85 leading-relaxed font-normal">
              EU MRV, EU ETS Maritime ve FuelEU Maritime için voyage, bunker yakıt ve BDN kanıt omurgasını tek dosyada toplayın;
              akredite doğrulayıcılara (DNV, Bureau Veritas, RINA vb.) hazır ve değişmez snapshot güvencesiyle teslim edin.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/denizcilik/dosya-hazirla/#form-section"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300 px-8 text-sm font-black text-slate-950 transition hover:from-sky-300 hover:to-cyan-200 shadow-lg hover:shadow-sky-400/25"
              >
                Klas Denetimine Hazır Gemi Paketini Oluşturun (599 USD) <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#simulator"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-black text-white hover:bg-white/20 transition"
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

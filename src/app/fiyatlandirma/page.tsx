import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileCheck,
  FileCode2,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Lock,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";
import { ISLETMECI } from "@/config/isletmeci";
import { PLATFORM_STATS, PERSON_ENTITY } from "@/lib/skdm/constants";
import {
  SEALED_PACKAGE_FILES,
  type PackageAudience,
} from "@/lib/skdm/package-manifest";
import { REG_REF } from "@/lib/skdm/regulatoryRefs";

// GATE-E (RM-006): paket listesi package-manifest'ten runtime render edilir (INV-3).
function iconForFile(filename: string): LucideIcon {
  if (filename === "BUTUNLIK-MANIFESTOSU.json") return Lock;
  if (filename === "Hesaplama-Izi.json") return FileCode2;
  if (filename.endsWith(".xlsx")) return FileSpreadsheet;
  if (filename.endsWith(".pdf")) return FileText;
  return FileCheck;
}

function extForFile(filename: string): string {
  if (filename.endsWith(".xlsx")) return "XLSX";
  if (filename.endsWith(".pdf")) return "PDF";
  if (filename.endsWith(".json")) return "JSON";
  if (filename.endsWith(".zip")) return "ZIP";
  return "DOC";
}

const AUDIENCE_LABEL: Record<PackageAudience, string> = {
  all: "Alıcı + Doğrulayıcı",
  verifier: "Yalnızca Doğrulayıcı",
  buyer: "Alıcı",
};

export const metadata: Metadata = pageMetadata({
  path: "/fiyatlandirma/",
  title: "Fiyatlandırma — Şeffaf Tek Fiyat, Mühür Öncesi Tamamen Ücretsiz",
  description: `SKDM denetime hazırlık dosyanızı hazırlamak tamamen ücretsizdir. Yalnızca nihai mühürlü paket üretiminde tek fiyat: ${ISLETMECI.muhurFiyatiEtiket} (KDV dahil).`,
});

const SSS_LISTESI = [
  {
    id: "01",
    s: "Mühürleme öncesinde herhangi bir ücret veya kredi kartı gerekir mi?",
    c: `Kesinlikle hayır. Sektör seçimi, 8 haneli GTİP tespiti, ${PLATFORM_STATS.layerCount} katmanlı veri girişi, rehberli ipucu panelleri, taslak kaydı ve maliyet projeksiyonu %100 ücretsizdir. Kredi kartı bilgisi dahi istenmez. Yalnızca dosyanızı kilitleyip mühürlü paketi indirmek istediğinizde tek seferlik ödeme alınır.`,
  },
  {
    id: "02",
    s: "Doğrulayıcı veya Avrupalı alıcım bu dosyayı kabul eder mi?",
    c: `Dosyalar AB Komisyonu'nun kesin dönem uygulama tüzüğü (${REG_REF["ir-2025-2547"]}) yapısında ve resmi iletişim şablonu (Communication Template) formatında üretilir; denetime hazırlık kanıt kütüğü pakete dahildir. Nihai kabul kararı her zaman alıcınıza ve akredite bağımsız doğrulayıcıya aittir.`,
  },
  {
    id: "03",
    s: "Fatura kesiliyor mu ve KDV dahil mi?",
    c: `Evet. ${ISLETMECI.muhurFiyatiEtiket} bedel KDV dahildir. Ödeme uluslararası ödeme operatörümüz Paddle (Merchant of Record) üzerinden güvenle alınır; resmî ödeme ve fatura belgesi e-posta adresinize anında iletilir.`,
  },
  {
    id: "04",
    s: "Mühürleme sonrası dosyada bir düzeltme yapmam gerekirse ek ücret öder miyim?",
    c: ISLETMECI.yenidenMuhurlemePolitikasi,
  },
];

export default function FiyatlandirmaPage() {
  const fiyat = ISLETMECI.muhurFiyatiTl.toLocaleString("tr-TR");

  return (
    <article className="min-h-screen bg-[#fafcf9] py-8 sm:py-14 text-ink-900 antialiased">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
        {/* Üst Navigasyon & Durum Bandı */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GeriLink />
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-3.5 py-1 text-xs font-mono font-bold text-brand-900 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            STANDART: IR 2025/2547 &amp; ISO 14064-1
          </div>
        </div>

        {/* Başlık Alanı (Hero Typography) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-brand-50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-900 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            ŞEFFAF VE SABİT FİYATLANDIRMA
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl leading-tight">
            Mühür öncesi her şey ücretsiz.{" "}
            <span className="block sm:inline text-brand-800">
              Yalnızca hazır dosyanız için tek fiyat.
            </span>
          </h1>
          <p className="text-base sm:text-lg font-medium text-ink-700 leading-relaxed">
            Verilerinizi girin, emisyon formül izini ve maliyet projeksiyonunu tam şeffaflıkla görün.
            Yalnızca dosyanızı kilitleyip mühürlü paketi indirmek istediğinizde tek seferlik ödeme yaparsınız.
          </p>
        </div>

        <DisclaimerBanner />

        {/* 2 Sütunlu Dünya Standardı Fiyatlandırma Kartları (Free vs Paid) */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch pt-2">
          {/* Kart 1: Ücretsiz Ön Analiz & Taslak */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border-2 border-line bg-white p-7 sm:p-8 shadow-sm hover:border-brand-800/30 transition-all">
            <div className="space-y-6">
              <div className="space-y-2 border-b border-line pb-5">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Aşama 1 · Ön Analiz &amp; Taslak
                </span>
                <h2 className="text-2xl font-black text-ink-900">Ücretsiz Başlangıç</h2>
                <p className="text-xs sm:text-sm text-ink-600 leading-relaxed font-medium">
                  Sektörünüzü seçin, GTİP eşleştirmesini yapın ve formül izini hiçbir taahhüt olmadan test edin.
                </p>
                <div className="pt-2">
                  <div className="text-4xl font-black text-ink-900">0 ₺</div>
                  <div className="text-xs font-semibold text-ink-500 mt-0.5">Kredi kartı gerekmez · Süre sınırı yok</div>
                </div>
              </div>

              {/* Özellik Listesi */}
              <ul className="space-y-3 text-sm font-medium text-ink-800">
                {[
                  "8 haneli GTİP ve resmi AB kapsam kontrolü",
                  "10 katmanlı veri girişi ve parametrik sihirbaz",
                  "Resmî varsayılan katsayılarla ön hesaplama",
                  "Sınırsız taslak kaydı ve kalite kapısı (QC) denetimi",
                  "Tahmini SKDM sertifika maliyet projeksiyonu",
                  "(i) Veri kaynağı kılavuzları ve yardım panelleri",
                ].map((madde) => (
                  <li key={madde} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 shrink-0 text-brand-700 mt-0.5" />
                    <span>{madde}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-line">
              <Link
                href="/basla/"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-800/20 bg-white px-6 text-sm font-black text-ink-900 shadow-2xs hover:bg-brand-50 hover:border-brand-800/40 transition"
              >
                <span>Hemen Ücretsiz Başla</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Kart 2: Mühürlü Denetime Hazırlık Paketi (Hero Paid Tier) */}
          <div className="lg:col-span-7 relative flex flex-col justify-between rounded-3xl border-2 border-brand-500/40 bg-gradient-to-b from-[#091a14] via-[#071510] to-[#040d0a] p-7 sm:p-9 text-white shadow-2xl overflow-hidden">
            {/* Arka Plan Işık Vurgusu */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/15 pb-6">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-brand-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                    Aşama 2 · Resmî Çıktı Standardı
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Mühürlü Çalışma Paketi
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal">
                    AB kesin dönem ({REG_REF["ir-2025-2547"]}) şablonunda alıcıya ve doğrulayıcıya doğrudan sunulabilir dosya seti.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums">
                    {fiyat} ₺
                  </div>
                  <div className="text-xs font-bold text-brand-400 uppercase tracking-wide mt-0.5">
                    KDV Dahil · Tek Seferlik
                  </div>
                </div>
              </div>

              {/* Dahil Olan Teknik Özellikler */}
              <ul className="space-y-3 text-sm font-medium text-slate-200">
                {[
                  `${PLATFORM_STATS.fileCount} dosyadan oluşan doğrulanabilir mühürlü ZIP arşivi`,
                  "Resmî AB İletişim Şablonu (Communication Template XLSX) çıktısı",
                  "SHA-256 kriptografik dijital bütünlük imzası ve iz kütüğü",
                  "Alıcı, bağımsız doğrulayıcı ve tesis için ayrı paket görünümleri",
                  "Aynı dosyada sınırsız ve tamamen ücretsiz yeniden mühürleme güvencesi",
                  "Frankfurt (Almanya / AB) güvenli sunucularında veri barındırma",
                  "Süresiz erişim ve anında dijital paket teslimatı",
                ].map((madde) => (
                  <li key={madde} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400 mt-0.5" />
                    <span>{madde}</span>
                  </li>
                ))}
              </ul>

              {/* Şeffaf İzlenebilirlik Kutusu */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-xs space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between text-slate-300 font-bold border-b border-white/10 pb-1.5">
                  <span>Ödediğiniz Bedel Neyin Karşılığıdır?</span>
                  <span className="text-brand-400 font-mono">DENETİM KANIT KÜTÜĞÜ</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-normal">
                  Danışmanlık komisyonu değil; verinizin kilitlenmiş sürümü, açık kaynak formül izi, AB şablonu uyumluluğu ve SHA-256 dijital orijinallik mührü karşılığıdır.
                </p>
                <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Metodoloji Sorumluluğu: <strong>{PERSON_ENTITY.name}</strong></span>
                  <Link href="/uzmanlik/baris-bagirlar/" className="text-brand-300 underline hover:text-brand-200">
                    Yetkinlik Profili →
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/15">
              <Link
                href="/basla/"
                className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-brand-500 px-6 text-base sm:text-lg font-black text-brand-950 shadow-xl hover:bg-brand-400 hover:scale-[1.01] transition"
              >
                <span>Hemen Başla — Dosyanızı Hazırlayın</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-2.5 text-center text-[11px] text-slate-400">
                Hesaplama ve ön adımlar %100 ücretsizdir. Ödeme yalnızca nihai mühür anında güvenli Paddle altyapısıyla gerçekleşir.
              </p>
            </div>
          </div>
        </div>

        {/* PAKET İÇERİĞİ: Geliştirici & Mühendislik Manifest Görünümü (GATE-E / RM-006 Uyumlu) */}
        <section className="rounded-3xl border-2 border-line bg-white p-7 sm:p-9 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-line pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-brand-50 px-3 py-0.5 text-xs font-mono font-bold text-brand-900">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                DİJİTAL PAKET MANİFESTOSU
              </div>
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">
                Mühürlü Pakette Teslim Edilen Dosyalar ({PLATFORM_STATS.fileCount} Parça)
              </h2>
              <p className="text-sm font-medium text-ink-600">
                Ödeme tamamlandığında sistemimiz bu {PLATFORM_STATS.fileCount} dosyayı tek bir mühürlü ZIP arşivi içinde sunar:
              </p>
            </div>
            <div className="shrink-0 text-xs font-mono font-bold text-ink-500">
              STANDART: ZIP + SHA-256
            </div>
          </div>

          {/* Dosya Kartları Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SEALED_PACKAGE_FILES.map((d, i) => {
              const Icon = iconForFile(d.filename);
              const ext = extForFile(d.filename);
              return (
                <div
                  key={d.filename}
                  className="flex flex-col justify-between rounded-2xl border border-line bg-[#f8faf7] p-5 hover:border-brand-800/40 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-brand-800 bg-white border border-line px-2 py-0.5 rounded">
                        [{String(i + 1).padStart(2, "0")}] · {ext}
                      </span>
                      <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-bold text-ink-600">
                        {AUDIENCE_LABEL[d.audience]}
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1">
                      <Icon className="h-5 w-5 text-brand-800 shrink-0 mt-0.5" />
                      <h3 className="font-bold text-ink-900 text-sm leading-snug">{d.label}</h3>
                    </div>

                    <p className="text-xs text-ink-700 font-medium leading-relaxed">{d.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line/60">
                    <code className="block font-mono text-[10px] text-ink-500 truncate" title={d.filename}>
                      {d.filename}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SSS — Swiss Accordion Tasarımı */}
        <section className="space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-brand-900">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              ÖDEME VE TESLİMAT SSS
            </div>
            <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">Sıkça Sorulan Sorular</h2>
            <p className="text-sm font-medium text-ink-600">
              Fiyatlandırma, lisanslama, faturalandırma ve mühür süreçleri hakkında merak edilenler.
            </p>
          </div>

          <div className="grid gap-3">
            {SSS_LISTESI.map((item) => (
              <details
                key={item.id}
                className="group rounded-2xl border-2 border-line bg-white p-5 shadow-2xs transition-all open:border-brand-800/40"
              >
                <summary className="cursor-pointer list-none text-base font-black text-ink-900 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-brand-800 bg-brand-50 border border-brand-800/15 px-2 py-0.5 rounded">
                      {item.id}
                    </span>
                    <span>{item.s}</span>
                  </span>
                  <span className="text-brand-800 transition-transform group-open:rotate-45 text-2xl leading-none font-light">
                    +
                  </span>
                </summary>
                <p className="mt-3 pl-9 text-sm leading-relaxed text-ink-700 font-medium">
                  {item.c}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Alt Kapanış CTA */}
        <div className="rounded-3xl border-2 border-brand-800/20 bg-brand-950 p-8 sm:p-12 text-center text-white shadow-xl space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Karbon Emisyonunuzu ve Dosyanızı Ücretsiz Hesaplayın
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-mist leading-relaxed font-normal">
            Sihirbazı hemen başlatın, adımları tamamlayın ve mühür öncesi tüm analizlerinizi hiçbir ücret ödemeden görün.
          </p>
          <div className="pt-2">
            <Link
              href="/basla/"
              className="inline-flex min-h-14 items-center gap-2.5 rounded-xl bg-brand-500 px-9 text-lg font-black text-brand-950 shadow-lg hover:bg-brand-400 hover:scale-[1.02] transition"
            >
              <span>Hesaplamayı Hemen Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

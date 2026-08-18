import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";
import Link from "next/link";
import {
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Lock,
  FileSpreadsheet,
  FileCode2,
  FileText,
  HelpCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/legal/SiteChrome";
import { GeriLink } from "@/components/nav/GeriLink";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";
import { PLATFORM_STATS, PERSON_ENTITY } from "@/lib/skdm/constants";
import { SITE } from "@/lib/skdm/site-config";
import {
  SEALED_PACKAGE_FILES,
  type PackageAudience,
} from "@/lib/skdm/package-manifest";
import { REG_REF } from "@/lib/skdm/regulatoryRefs";

// GATE-E (RM-006): fiyatlandırma sayfası paket listesi package-manifest'ten
// runtime render edilir — elle yazılmış statik liste yoktur (INV-3).
function iconForFile(filename: string): LucideIcon {
  if (filename === "BUTUNLIK-MANIFESTOSU.json") return Lock;
  if (filename === "Hesaplama-Izi.json") return FileCode2;
  if (filename.endsWith(".xlsx")) return FileSpreadsheet;
  if (filename.endsWith(".pdf")) return FileText;
  return FileCheck;
}

const AUDIENCE_LABEL: Record<PackageAudience, string> = {
  all: "Alıcı + Doğrulayıcı",
  verifier: "Yalnızca doğrulayıcı",
  buyer: "Alıcı",
};

export const metadata: Metadata = pageMetadata({
  path: "/fiyatlandirma/",
  title: "Fiyatlandırma — Şeffaf Tek Fiyat, Mühür Öncesi Tamamen Ücretsiz",
  description: "SKDM denetime hazırlık dosyanızı hazırlamak tamamen ücretsizdir. Yalnızca nihai mühürlü paket üretiminde tek fiyat: 9.900 ₺ (KDV dahil).",
});

const SSS_LISTESI = [
  {
    s: "Mühürleme öncesinde herhangi bir ücret öder miyim?",
    c: `Hayır. Sektör seçimi, GTİP arama, ${PLATFORM_STATS.layerCount} katmanlı veri girişi, ipucu panelleri, taslak kaydı ve maliyet projeksiyonu tamamen ücretsizdir. Kredi kartı bilgisi dahi istenmez. Yalnızca dosyanızı kilitleyip mühürlü paketi indirmek istediğinizde tek seferlik ödeme alınır.`,
  },
  {
    s: "Doğrulayıcı veya alıcım bu dosyayı kabul eder mi?",
    c: `Dosyalar AB Komisyonu'nun kesin dönem uygulama tüzüğü (${REG_REF["ir-2025-2547"]}) yapısında ve resmi iletişim şablonu formatında üretilir; akredite doğrulayıcının ihtiyaç duyacağı denetim kanıtları pakete dahildir. Nihai kabul kararı her zaman alıcınıza ve doğrulayıcıya aittir.`,
  },
  {
    s: "Fatura kesiliyor mu ve KDV dahil mi?",
    c: "Evet. 9.900 ₺ bedel KDV dahildir. Ödeme Paddle (Merchant of Record) üzerinden alınır; faturayı Paddle e-posta adresinize iletir.",
  },
  {
    s: "Mühürleme sonrası dosyada bir düzeltme yapmam gerekirse?",
    c: `${SITE.resealPublicCopy} Yeni bir tesis veya yeni bir dönem için yeni dosya ve yeni ödeme gerekir.`,
  },
];

export default function FiyatlandirmaPage() {
  const fiyat = PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR");

  return (
    <article className="pasaport-zemin-acik min-h-screen bg-[#edf4f1] py-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <GeriLink />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-800/20 bg-white/80 px-3 py-1 text-xs font-bold text-brand-900 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            2026 CBAM Uyumlu
          </span>
        </div>

        {/* ÜST BAŞLIK — COMPACT & PREMIUM */}
        <div className="space-y-2.5 text-left">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-800 bg-brand-800/10 px-3 py-1 rounded-md inline-block">
            Şeffaf ve Sabit Fiyatlandırma
          </span>
          <h1 className="text-2xl font-black leading-tight tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
            Mühür Öncesi Her Şey Ücretsiz.{" "}
            <span className="text-brand-800 font-extrabold block sm:inline">
              Yalnızca Hazır Dosyanız İçin Tek Fiyat.
            </span>
          </h1>
          <p className="max-w-3xl text-sm font-medium leading-relaxed text-ink-700 sm:text-base">
            Mühür öncesi tüm adımlar ücretsizdir; kredi kartı istenmez. Gerekli belgeler elinizdeyse veri girişini aynı oturumda tamamlayabilirsiniz.
          </p>
        </div>

        <DisclaimerBanner />

        {/* ANA FİYATLANDIRMA KARTI */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between rounded-card border-2 border-brand-500 bg-white p-7 shadow-xl">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                <div>
                  <span className="rounded-pill bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-900 border border-brand-500/30">
                    Çıktı Standardı
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-ink-900 sm:text-[24px]">
                    Mühürlü Denetime Hazırlık Paketi
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-4xl sm:text-5xl font-black text-ink-900 tabular-nums">
                    {fiyat} ₺
                  </div>
                  <div className="text-xs font-bold text-brand-800 uppercase tracking-wide">
                    KDV Dahil · Tek Seferlik
                  </div>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm font-semibold text-ink-900">
                {[
                  `${REG_REF["ir-2025-2547"]} formatında izleme planı ve emisyon raporu`,
                  `${PLATFORM_STATS.fileCount} dosyadan oluşan mühürlü ZIP paketi`,
                  "AB iletişim şablonu (Communication Template) çıktısı",
                  "Alıcı, doğrulayıcı ve işletmeci için ayrı paket görünümleri",
                  "Versiyonlanmış CBAM metodolojisi (CBAM-2026.08.1)",
                  "ISO 14064-1 hesaplama eğitimi temelli metodoloji sorumluluğu",
                  "SHA-256 dijital bütünlük imzası ve izlenebilirlik kütüğü",
                  "Sınırsız ön-kontrol ve kalite kapısı (QC) doğrulaması",
                  "Anında indirilebilir dijital teslimat",
                ].map((madde) => (
                  <li key={madde} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-green" />
                    <span>{madde}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PRE-CHECKOUT TRUST PANEL (§29 Mandate) */}
            <div className="mt-6 rounded-2xl border border-line bg-[#f8faf9] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-extrabold text-ink-900 text-sm">Ödediğiniz şey nedir?</h3>
                <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wide">Risk Azaltım Garantisi</span>
              </div>
              <ul className="grid gap-1.5 text-xs font-medium text-ink-800 sm:grid-cols-2">
                <li>• Hesaplama dosyasının kilitlenmiş sürümü</li>
                <li>• Metodoloji ve kaynak kayıtları</li>
                <li>• Veri izlenebilirliği (Audit Trail)</li>
                <li>• SHA-256 bütünlük doğrulaması</li>
              </ul>
              <div className="pt-2 border-t border-line/60 flex flex-wrap items-center justify-between text-xs gap-2">
                <span className="font-medium text-ink-700">
                  Metodoloji sorumluluğu: <strong className="font-bold text-ink-900">{PERSON_ENTITY.name} — ISO 14064-1 Eğitimi</strong>
                </span>
                <Link href="/uzmanlik/baris-bagirlar/" className="font-bold text-brand-900 underline">
                  Yetkinliği Doğrula →
                </Link>
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <Link
                href="/basla/"
                className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-ctl bg-brand-500 px-6 text-lg font-bold text-brand-900 shadow-md transition hover:bg-brand-400 hover:shadow-lg"
              >
                <span>Hemen Ücretsiz Başla</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-2 text-center text-xs font-medium text-ink-600">
                Hesaplama ve taslak ücretsizdir. Ödeme yalnızca mühürleme anında Paddle overlay ile alınır.
              </p>
            </div>
          </div>

          {/* SAĞ SÜTUN */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-card border-2 border-line bg-brand-900 p-7 text-white shadow-xl">
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-brand-500" />
                <span>Neden SKDMHesapla?</span>
              </h3>
              <div className="space-y-4 text-sm text-brand-mist font-medium leading-relaxed">
                <div className="rounded-ctl border border-brand-500/25 bg-brand-950/60 p-4">
                  <div className="font-bold text-white mb-1">Proje bazlı dış destek:</div>
                  <p className="text-xs text-brand-tint">
                    Genelde yüksek bedel, uzun yazışma ve veri paylaşımı gerektiren süreçler.
                  </p>
                </div>

                <div className="rounded-ctl border border-accent-green/40 bg-accent-green/10 p-4">
                  <div className="font-bold text-accent-green mb-1">SKDMHesapla Self-Servis:</div>
                  <p className="text-xs text-white">
                    {fiyat} ₺ sabit tek fiyat (KDV dahil). Belgeler hazırsa aynı oturumda ilerleyebilirsiniz.
                    Verileriniz hesabınıza bağlı olarak saklanır; erişim kontrolü uygulanır.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-brand-800/80 pt-4 flex items-center justify-between text-xs text-brand-tint">
              <span>Kurumsal E-Fatura Düzenlenir</span>
              <span>•</span>
              <span>HTTPS / TLS ile güvenli erişim</span>
            </div>
          </div>
        </div>

        {/* PAKET İÇERİĞİ */}
        <section className="space-y-6 rounded-card border-2 border-line bg-white p-7 shadow-card">
          <div>
            <span className="rounded-pill bg-brand-100 px-3 py-1 text-xs font-bold text-brand-900 border border-brand-500/20">
              Paket İçeriği
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-ink-900">
              Mühürlü Pakette Neler Var? ({PLATFORM_STATS.fileCount} Dosya)
            </h2>
            <p className="text-sm font-medium text-ink-700 mt-1">
              Ödeme yapıldığında sistemimiz bu {PLATFORM_STATS.fileCount} dosyayı tek bir ZIP arşivi
              içinde teslim eder:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SEALED_PACKAGE_FILES.map((d, i) => {
              const Icon = iconForFile(d.filename);
              return (
                <div
                  key={d.filename}
                  className="rounded-ctl border border-line bg-soft-section p-4 space-y-2 hover:border-brand-500 transition-colors"
                >
                  <div className="flex items-center gap-2.5 font-bold text-ink-900 text-sm">
                    <Icon className="h-5 w-5 shrink-0 text-brand-800" />
                    <span>
                      {i + 1}. {d.label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-ink-700 font-medium">{d.desc}</p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="truncate font-mono text-[10px] text-ink-500">{d.filename}</span>
                    <span className="shrink-0 rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-bold text-ink-600">
                      {AUDIENCE_LABEL[d.audience]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SIKÇA SORULAN SORULAR */}
        <section className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-ink-900">Sıkça Sorulan Sorular</h2>
            <p className="text-sm font-medium text-ink-700 mt-1">
              Fiyatlandırma ve ödeme süreçleri hakkında merak edilenler.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SSS_LISTESI.map((item) => (
              <div
                key={item.s}
                className="rounded-card border-2 border-line bg-white p-5 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-ink-900 text-base flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 shrink-0 text-brand-800 mt-0.5" />
                  <span>{item.s}</span>
                </h3>
                <p className="text-sm leading-relaxed text-ink-700 font-medium pl-7">{item.c}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ALT CTA */}
        <div className="rounded-card border-2 border-brand-500/40 bg-brand-950 p-8 text-center text-white shadow-xl space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Karbon Maliyetinizi ve Dosyanızı Ücretsiz Hesaplayın
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-mist">
            Sihirbazı hemen başlatın, adımları tamamlayın ve mühür öncesi tüm analizlerinizi görün.
          </p>
          <div>
            <Link
              href="/basla/"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-ctl bg-brand-500 px-8 text-lg font-bold text-brand-900 hover:bg-brand-400 shadow-md transition"
            >
              <span>Hesaplamayı Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

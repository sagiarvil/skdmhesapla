import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileCode2,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  Lock,
  Ship,
  ShieldAlert,
  ShieldCheck,
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
import {
  CBAM_COMMERCIAL_RELEASE_BLOCKERS,
  CBAM_COMMERCIAL_RELEASE_READY,
} from "@/lib/skdm/product-readiness";

const MARITIME_PRICE_USD = 399;

function iconForFile(filename: string): LucideIcon {
  if (filename === "BUTUNLIK-MANIFESTOSU.json") return Lock;
  if (filename === "Hesaplama-Izi.json") return FileCode2;
  if (filename.endsWith(".xlsx")) return FileSpreadsheet;
  return FileText;
}

const AUDIENCE_LABEL: Record<PackageAudience, string> = {
  all: "Alıcı + doğrulayıcı",
  verifier: "Doğrulayıcı",
  buyer: "Alıcı",
};

export const metadata: Metadata = pageMetadata({
  path: "/fiyatlandirma/",
  title: "Fiyatlandırma — SKDM / CBAM ve Denizcilik Karbon Uyum",
  description: CBAM_COMMERCIAL_RELEASE_READY
    ? `SKDM doğrulamaya hazırlık dosyanızı ücretsiz hazırlayın; nihai sunucu-mühürlü paket ${ISLETMECI.muhurFiyatiEtiket} (KDV dahil). Denizcilik Karbon Uyum Hazırlık Dosyası 399 USD / gemi / raporlama yılıdır.`
    : "SKDM kapsam, veri toplama, hesaplama ve kalite kontrol adımları ücretsizdir. Denizcilik Karbon Uyum Hazırlık Dosyası 399 USD / gemi / raporlama yılıdır.",
});

const SSS_LISTESI = [
  {
    s: "Başlamak için ücret veya kredi kartı gerekir mi?",
    c: "Hayır. GTİP/CN kapsam kontrolü, veri toplama, taslak kaydı, hesap izi ve kalite kontrolleri ücretsiz çalışır.",
  },
  {
    s: "Bu sistem akredite doğrulama yapar mı?",
    c: "Hayır. SKDMHesapla akredite doğrulama görüşü veya gümrük onayı vermez; alıcı ve bağımsız doğrulayıcı için izlenebilir çalışma dosyasını hazırlar.",
  },
  {
    s: "Denizcilik fiyatı nasıl uygulanır?",
    c: "399 USD tek seferlik bedel; 1 gemi + 1 raporlama yılı + 1 değişmez hazırlık snapshot'ı içindir. Aynı snapshot yeniden indirilebilir; veri değişirse yeni dosya oluşur.",
  },
  {
    s: "Ücretli SKDM mühürlü paket şu anda satın alınabilir mi?",
    c: CBAM_COMMERCIAL_RELEASE_READY
      ? `Evet. ${ISLETMECI.muhurFiyatiEtiket} KDV dahil tek seferlik bedeldir; ödeme yetkisi doğrulandıktan sonra sunucu-otoriteli paket üretilir.`
      : "Hayır. CBAM ücretli teslim kapısı fail-closed durumdadır; kalite ve ödeme→indirme E2E kapıları tamamlanmadan ödeme alınmaz.",
  },
  {
    s: "Dosyayı Avrupalı alıcıma veya doğrulayıcıya gönderebilir miyim?",
    c: `Çalışma dosyası ${REG_REF["ir-2025-2547"]} metodoloji yapısını ve Communication Template alanlarını izler. Nihai kabul kararı alıcıya ve akredite bağımsız doğrulayıcıya aittir.`,
  },
];

export default function FiyatlandirmaPage() {
  const fiyat = ISLETMECI.muhurFiyatiTl.toLocaleString("tr-TR");

  return (
    <article className="min-h-screen bg-[#fafcf9] py-8 text-ink-900 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GeriLink />
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-4 py-2 text-xs font-bold text-brand-900 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            {REG_REF["ir-2025-2547"]} · ISO 14064-1 metodoloji desteği
          </div>
        </div>

        <header className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-brand-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-brand-900">
            Şeffaf fiyatlandırma · dosya başı teslim
          </div>
          <h1 className="mt-4 text-[30px] font-black leading-[1.12] tracking-tight sm:text-[38px] lg:text-[44px]">
            Önce çalışmayı hazırlayın. Ücret yalnız nihai teslim dosyasında alınır.
          </h1>
          <p className="mx-auto mt-4 max-w-4xl text-base font-medium leading-7 text-ink-700">
            Hesaplama ve hazırlık akışını tamamlayın; sistem ödeme sonrasında ilgili değişmez çıktı setini açar. Akredite doğrulama ve resmî kurum işlemleri kapsam dışıdır.
          </p>
        </header>

        <div className="text-base [&>div]:py-4">
          <DisclaimerBanner />
        </div>

        {!CBAM_COMMERCIAL_RELEASE_READY && (
          <section className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 shadow-sm sm:px-6" aria-labelledby="commercial-gate-title">
            <div className="flex items-start gap-4">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-800" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-800">CBAM ücretli teslim kapısı kapalı</p>
                  <h2 id="commercial-gate-title" className="text-base font-black text-amber-950">Ücretsiz hazırlık akışı kullanılabilir.</h2>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-amber-950/80">Eksik veya doğrulanamayan veriyle ücretli çıktı üretmemek için fail-closed kalite kapısı uygulanır.</p>
                <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm font-semibold leading-6 text-amber-950/75 md:grid-cols-2">
                  {CBAM_COMMERCIAL_RELEASE_BLOCKERS.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-5 lg:grid-cols-3" aria-label="Fiyat seçenekleri">
          <div className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-7">
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-800">Ücretsiz hazırlık</span>
            <div className="mt-4 flex items-end justify-between gap-4">
              <h2 className="text-xl font-black leading-tight">SKDM çalışma alanı</h2>
              <div className="text-4xl font-black">0 ₺</div>
            </div>
            <ul className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-ink-800">
              {["GTİP / CN kapsam kontrolü", `${PLATFORM_STATS.stepCount} kontrollü mikro adım`, "Tesis, üretim, enerji ve kanıt verisi", "Hesap izi + QC + maliyet projeksiyonu"].map((item) => (
                <li key={item} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-brand-700" /><span>{item}</span></li>
              ))}
            </ul>
            <Link href="/basla/" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-brand-800/20 px-4 text-sm font-black text-brand-900 hover:bg-brand-50">
              Ücretsiz başlat <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col rounded-2xl border border-brand-500/35 bg-[#071510] p-6 text-white shadow-md sm:p-7">
            <span className="w-fit rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-brand-300">SKDM-CBAM teslim</span>
            <div className="mt-4 flex items-end justify-between gap-4">
              <h2 className="text-xl font-black leading-tight">Sunucu-mühürlü paket</h2>
              <div className="whitespace-nowrap text-4xl font-black">{fiyat} ₺</div>
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-brand-400">KDV dahil · tek seferlik</p>
            <ul className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-slate-200">
              {[`${PLATFORM_STATS.fileCount} dosyalı paket`, "Communication Template XLSX", "Hesaplama izi + kanıt kayıtları", "SHA-256 bütünlük kaydı"].map((item) => (
                <li key={item} className="flex gap-2.5"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-400" /><span>{item}</span></li>
              ))}
            </ul>
            {CBAM_COMMERCIAL_RELEASE_READY ? (
              <Link href="/basla/" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-black text-brand-950">Dosyanızı hazırlayın <ArrowRight className="h-4 w-4" /></Link>
            ) : (
              <div className="mt-5 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-black text-slate-200">Ödeme kapalı · kalite kapısı aktif</div>
            )}
          </div>

          <div className="flex flex-col rounded-2xl border border-brand-800/20 bg-white p-6 shadow-sm sm:p-7">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-brand-900"><Ship className="h-4 w-4" /> Denizcilik</span>
            <div className="mt-4 flex items-end justify-between gap-4">
              <h2 className="text-xl font-black leading-tight">Karbon Uyum Hazırlık Dosyası</h2>
              <div className="whitespace-nowrap text-4xl font-black">${MARITIME_PRICE_USD}</div>
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-brand-800">1 gemi · 1 raporlama yılı · tek seferlik</p>
            <ul className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-ink-800">
              {["EU MRV + EU ETS + FuelEU Maritime", "Voyage + fuel + evidence veri omurgası", "READY FOR VERIFICATION hazırlık kapısı", "Değişmez snapshot + yeniden indirme"].map((item) => (
                <li key={item} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-brand-700" /><span>{item}</span></li>
              ))}
            </ul>
            <Link href="/denizcilik/dosya-hazirla/" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-900 px-4 text-sm font-black text-white">Denizcilik dosyasını hazırlayın <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-800/20 bg-white p-6 shadow-sm sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black text-brand-900"><FolderArchive className="h-4 w-4" /> CBAM paket manifestosu</div>
              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">Teslim mimarisi: {PLATFORM_STATS.fileCount} dosya</h2>
            </div>
            <span className="rounded-xl border border-brand-800/20 bg-[#f8fbf9] px-3 py-2 text-xs font-black text-brand-900">ZIP + SHA-256</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SEALED_PACKAGE_FILES.map((d, i) => {
              const Icon = iconForFile(d.filename);
              return (
                <div key={d.filename} className="rounded-2xl border border-line bg-[#fbfdfb] p-5 sm:p-6">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800"><Icon className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-wide text-ink-500">{String(i + 1).padStart(2, "0")} · {AUDIENCE_LABEL[d.audience]}</p>
                      <h3 className="mt-1 text-base font-black leading-6 text-ink-900">{d.label}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6 text-ink-700">{d.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-800/20 bg-brand-950 px-5 py-4 text-white">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
            <p className="text-sm font-medium leading-6 text-slate-300"><b className="text-white">Bütünlük kontrolü doğrulama görüşü değildir.</b> SHA-256 yalnız paketin sonradan değiştirilmediğini kontrol eder.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black">Sıkça Sorulan Sorular</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {SSS_LISTESI.map((item) => (
              <details key={item.s} className="group rounded-2xl border border-line bg-white px-5 py-4 open:border-brand-800/35">
                <summary className="cursor-pointer list-none text-base font-black leading-6 text-ink-900">{item.s}</summary>
                <p className="mt-3 text-sm font-medium leading-6 text-ink-700">{item.c}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-800/20 bg-brand-950 px-6 py-5 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-brand-300">Metodoloji sorumluluğu</p>
            <h2 className="mt-1.5 text-lg font-black">{PERSON_ENTITY.name}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-300">Ürün veri ve hesaplama izini düzenler; akredite doğrulayıcının bağımsız görüşünün yerini almaz.</p>
          </div>
          <Link href="/uzmanlik/baris-bagirlar/" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-black">Yetkinlik profilini inceleyin <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </article>
  );
}

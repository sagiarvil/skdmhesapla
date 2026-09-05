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
  ShieldAlert,
  ShieldCheck,
  Ship,
  Anchor,
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
  title: "Fiyatlandırma — SKDM / CBAM ve Denizcilik Doğrulamaya Hazırlık",
  description:
    "İhracatçılar için CBAM kapsam kontrolü ücretsizdir. Gemi işletmecileri için EU MRV, ETS ve FuelEU uyum dosyası tek seferlik 599 USD bedelle doğrulayıcıya hazır sunulur.",
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
    s: "Ücretli mühürlü paket şu anda satın alınabilir mi?",
    c: CBAM_COMMERCIAL_RELEASE_READY
      ? `Evet. ${ISLETMECI.muhurFiyatiEtiket} KDV dahil tek seferlik bedeldir; ödeme yetkisi doğrulandıktan sonra sunucu-otoriteli paket üretilir.`
      : "Hayır. CBAM ücretli teslim kapısı fail-closed durumdadır; ürünün sunucu-otoriteli mühür, resmî default-value veri seti, Communication Template regresyonu ve ödeme→indirme E2E kapıları tamamlanmadan ödeme alınmaz.",
  },
  {
    s: "Dosyayı Avrupalı alıcıma veya doğrulayıcıya doğrudan gönderebilir miyim?",
    c: `Çalışma dosyası ${REG_REF["ir-2025-2547"]} metodoloji yapısını ve Communication Template alanlarını izler. Nihai kabul kararı her zaman alıcıya ve akredite bağımsız doğrulayıcıya aittir.`,
  },
  {
    s: "Denizcilik Karbon Uyum Dosyası (599 USD) neleri kapsar ve ödeme nasıl yapılır?",
    c: "Denizcilik paketi, 1 geminin 1 takvim yılına ait tüm sefer (voyage), bunker yakıt (BDN) ve liman sürelerini EU MRV (2015/757), EU ETS Maritime (2023/957) ve FuelEU Maritime (2023/1805) standartlarında tek dosyada birleştirir. 599 USD tek seferlik bedeldir; abonelik veya gizli taahhüt yoktur. Ödeme Paddle güvencesiyle kredi kartı veya kurumsal havale/EFT ile alınır.",
  },
  {
    s: "Hazırlanan denizcilik dosyası doğrudan klas kuruluşlarına (DNV, BV, RINA) sunulabilir mi?",
    c: "Evet. Dosya, IACS üyesi yetkili klas kuruluşları ve akredite bağımsız verifier'ların doğrudan denetleyebileceği kriptografik sefer kanıt zinciri (SHA-256) ve THETIS-MRV uyumlu XML veri çıktısıyla üretilir.",
  },
  {
    s: "Veri girişi kaç katmandan oluşmaktadır?",
    c: `Veri toplama ve doğrulama hazırlığı süreci ${PLATFORM_STATS.layerCount} katmanlı veri girişi yapısı üzerinden yönetilir; her katman izlenebilirlik kontrollerinden geçer.`,
  },
];

export default function FiyatlandirmaPage() {
  const fiyat = ISLETMECI.muhurFiyatiTl.toLocaleString("tr-TR");

  return (
    <article className="min-h-screen bg-[#fafcf9] py-8 text-ink-900 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GeriLink />
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-3.5 py-1 text-xs font-bold text-brand-900 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            {REG_REF["ir-2025-2547"]} · ISO 14064-1 metodoloji desteği
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-brand-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-brand-900">
            Şeffaf fiyatlandırma · regülasyon güvencesi
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Önce dosyanızı hazırlayın. Ücret yalnız doğrulanmış teslim kapısında alınır.
          </h1>
          <p className="text-base font-medium leading-7 text-ink-700 sm:text-lg">
            İhracatçılar için CBAM kapsam ve hesaplama adımları ücretsizdir. Gemi işletmecileri için EU MRV, ETS ve FuelEU uyum hazırlık dosyası tek seferlik 599 USD bedelle klas doğrulayıcısına hazır sunulur.
          </p>
        </div>

        <DisclaimerBanner />

        {!CBAM_COMMERCIAL_RELEASE_READY && (
          <section className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 shadow-sm sm:p-8" aria-labelledby="commercial-gate-title">
            <div className="flex items-start gap-4">
              <ShieldAlert className="mt-1 h-7 w-7 shrink-0 text-amber-800" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.13em] text-amber-800">Sanayi CBAM Teslim Kapısı Durumu</p>
                <h2 id="commercial-gate-title" className="mt-2 text-2xl font-black text-amber-950">
                  Şu anda sanayi CBAM mühürlü paketi kalite kapısındadır (Denizcilik paketi açıktır).
                </h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-amber-950/80">
                  Sanayi tesisleri için ücretsiz hazırlık akışı serbestçe kullanılabilir; resmi default-value veri seti ve Communication Template regresyon kapıları tamamlanana kadar sanayi mühürlemesinde ödeme alınmaz. Denizcilik modülü ise tam operasyoneldir.
                </p>
                <ul className="mt-4 grid gap-2 text-sm font-semibold text-amber-950/80 md:grid-cols-2">
                  {CBAM_COMMERCIAL_RELEASE_BLOCKERS.map((item) => (
                    <li key={item} className="flex gap-2"><span>•</span><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Kart 1: SKDM Ücretsiz Hazırlık */}
          <section className="flex flex-col justify-between rounded-3xl border-2 border-line bg-white p-6 shadow-sm sm:p-7">
            <div>
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-800">
                Aşama 1 · Sanayi / İhracatçı
              </span>
              <h2 className="mt-3 text-2xl font-black text-ink-900">SKDM Doğrulamaya Hazırlık</h2>
              <p className="mt-1.5 text-xs text-ink-600 font-medium">
                İhracatçılar için {REG_REF["cbam-2023-956"]} ve {REG_REF["ir-2025-2547"]} metodolojisine tam uyumlu çalışma alanı.
              </p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-ink-900">0 ₺</span>
                <span className="text-xs font-bold text-ink-500">/ Ücretsiz başlangıç</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-xs sm:text-sm font-semibold text-ink-800">
                {[
                  "GTİP / CN resmi kapsam kontrolü",
                  `4 ana faz ve ${PLATFORM_STATS.stepCount} kontrollü mikro adım`,
                  "Tesis, üretim, enerji ve kanıt verisi toplama",
                  "Emisyon hesap izi ve QC kontrolleri",
                  "Tahmini karbon maliyeti projeksiyonu",
                  "Taslak kaydı ve veri kaynağı yardım katmanı",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/basla/"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-brand-800/25 bg-white px-5 text-xs font-black text-brand-900 hover:bg-brand-50 transition shadow-xs"
            >
              Ücretsiz Hazırlığı Başlat <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* Kart 2: Denizcilik Karbon Uyum Hazırlık Dosyası (599 USD) - ÖNE ÇIKAN AKTİF SATIŞ */}
          <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-sky-400 bg-gradient-to-b from-[#061c2c] via-[#092c44] to-[#041421] p-6 text-white shadow-xl sm:p-7 ring-2 ring-sky-400/30">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
                  <Anchor className="h-3.5 w-3.5" /> ÖZEL DENİZCİLİK PAKETİ
                </span>
                <span className="rounded-md bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-300">
                  ✓ Satış Açık
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-black text-white">Denizcilik Karbon Uyum Dosyası</h2>
              <p className="mt-1.5 text-xs text-sky-200/90 font-medium">
                Armatörler ve ISM işletmecileri için EU MRV, ETS ve FuelEU kanıt omurgası.
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white sm:text-5xl">599 USD</span>
                <span className="text-xs font-semibold text-slate-300">/ 1 gemi · 1 raporlama yılı</span>
              </div>
              <p className="mt-1 text-[11px] text-sky-300 font-medium">
                Tek seferlik ödeme · Sıfır abonelik · Gizli taahhüt yok
              </p>

              <ul className="mt-5 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-200">
                {[
                  "EU MRV + EU ETS + FuelEU Maritime tek omurgada",
                  "Sefer (Voyage), bunker yakıt ve BDN kanıt zinciri",
                  "DNV, Bureau Veritas, RINA klas denetimine hazır format",
                  "THETIS-MRV uyumlu doğrulanmış XML çıktısı",
                  "Kriptografik SHA-256 veri bütünlüğü ve mühür",
                  "Değişmez snapshot & dilediğiniz an arşivden indirme",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 space-y-2.5">
              <Link
                href="/denizcilik/dosya-hazirla/"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 text-xs sm:text-sm font-black text-slate-950 hover:bg-sky-300 transition shadow-lg hover:shadow-sky-400/25"
              >
                Denizcilik Dosyasını Hazırlayın (599 USD) <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <Lock className="h-3 w-3 text-sky-400" />
                <span>Paddle güvencesiyle kart veya havale/EFT ile tek seferlik ödeme</span>
              </div>
            </div>
          </section>

          {/* Kart 3: Sunucu-Mühürlü SKDM Paketi */}
          <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-brand-500/35 bg-[#071510] p-6 text-white shadow-xl sm:p-7">
            <div>
              <span className="inline-flex rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-brand-300">
                Aşama 2 · Sanayi / İhracatçı
              </span>
              <h2 className="mt-3 text-2xl font-black text-white">Sunucu-Mühürlü SKDM Paketi</h2>
              <p className="mt-1.5 text-xs text-slate-300 font-medium">
                Alıcı, tesis ve bağımsız doğrulayıcı için ayrıştırılmış kurumsal teslim seti.
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{fiyat} ₺</span>
                <span className="text-xs font-bold text-brand-400">KDV dahil · tek seferlik</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-200">
                {[
                  `${PLATFORM_STATS.fileCount} dosyalı mühürlü paket manifestosu`,
                  "Communication Template XLSX çalışma çıktısı",
                  "Hesaplama izi ve kanıt kayıtları",
                  "SHA-256 dosya bütünlüğü",
                  "Alıcı / doğrulayıcı ayrıştırılmış paket görünümü",
                  "Sunucu tarafında ödeme yetkisi ve paket kimliği doğrulaması",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {CBAM_COMMERCIAL_RELEASE_READY ? (
              <Link
                href="/basla/"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-xs sm:text-sm font-black text-brand-950 hover:bg-brand-400 transition"
              >
                Dosyanızı Hazırlayın <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="mt-7 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-xs font-black text-slate-300">
                Ödeme kapalı · kalite kapıları tamamlanınca otomatik açılacak
              </div>
            )}
          </section>
        </div>

        <section className="rounded-3xl border-2 border-brand-800/20 bg-white p-7 shadow-lg sm:p-9">
          <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-900"><FolderArchive className="h-4 w-4" /> Paket manifestosu</div>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">Teslim mimarisi: {PLATFORM_STATS.fileCount} dosya</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-ink-700">Bu liste ürün manifestosunun gerçek dosya kaynağından render edilir; ödeme kapalı olsa da hangi çalışma çıktılarının hedeflendiği şeffaf biçimde görülebilir.</p>
            </div>
            <span className="rounded-xl border border-brand-800/20 bg-[#f8fbf9] px-3 py-2 text-xs font-black text-brand-900">ZIP + SHA-256</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SEALED_PACKAGE_FILES.map((d, i) => {
              const Icon = iconForFile(d.filename);
              return (
                <div key={d.filename} className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800"><Icon className="h-5 w-5" /></span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-ink-500">{String(i + 1).padStart(2, "0")} · {AUDIENCE_LABEL[d.audience]}</p>
                      <h3 className="mt-1 text-sm font-black text-ink-900">{d.label}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium leading-5 text-ink-700">{d.desc}</p>
                  <p className="mt-3 truncate rounded-lg border border-line bg-white px-2.5 py-1.5 font-mono text-[10px] font-semibold text-ink-600" title={d.filename}>{d.filename}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-800/20 bg-brand-950 p-5 text-white">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
            <div>
              <p className="font-black">Bütünlük kontrolü, doğrulama görüşü değildir.</p>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-300">SHA-256 paketin sonradan değiştirilmediğini kontrol eder. Emisyon hesabının akredite doğrulamasını veya hukuki kabulünü garanti etmez.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black">Sıkça Sorulan Sorular</h2>
          <div className="mt-4 grid gap-3">
            {SSS_LISTESI.map((item) => (
              <details key={item.s} className="group rounded-2xl border-2 border-line bg-white p-5 open:border-brand-800/35">
                <summary className="cursor-pointer list-none font-black text-ink-900">{item.s}</summary>
                <p className="mt-3 text-sm font-medium leading-6 text-ink-700">{item.c}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border-2 border-brand-800/20 bg-brand-950 p-8 text-center text-white sm:p-10">
          <p className="text-xs font-black uppercase tracking-wider text-brand-300">Metodoloji sorumluluğu</p>
          <h2 className="mt-2 text-2xl font-black">{PERSON_ENTITY.name}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">Ürün, veri ve hesaplama izini düzenler; akredite doğrulayıcının bağımsız görüşünün yerini almaz.</p>
          <Link href="/uzmanlik/baris-bagirlar/" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-black">Yetkinlik ve metodoloji profilini inceleyin <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </article>
  );
}

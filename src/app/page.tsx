import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Layers,
  Search,
  ShieldCheck,
  Sprout,
  Zap,
} from "lucide-react";
import GtipArama from "@/components/GtipArama";
import { HomeCbamFourStepFlow } from "@/components/HomeCbamFourStepFlow";
import { MethodologyTrustBar } from "@/components/credential/MethodologyTrustBar";
import { RegulatoryUpdatesSection } from "@/components/RegulatoryUpdatesSection";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { UcYolunuzVarKarsilastirma } from "@/components/UcYolunuzVarKarsilastirma";
import { pageMetadata } from "@/lib/skdm/seo";
import { PLATFORM_STATS } from "@/lib/skdm/constants";
import { CBAM_COMMERCIAL_RELEASE_READY } from "@/lib/skdm/product-readiness";
import { SEARCH_FAQS } from "@/lib/skdm/search-faq";
import { REGULATORY_UPDATES } from "@/lib/skdm/regulatory-updates";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "CBAM / SKDM Hesaplama Türkiye — GTİP, Rapor ve Excel",
  description:
    "AB müşteriniz CBAM raporu mu istedi? GTİP kapsamını kontrol edin, üretim ve kanıt verisini toplayın, gömülü emisyon hesabını izlenebilir biçimde oluşturun ve doğrulamaya hazır SKDM-CBAM çalışma dosyanızı hazırlayın.",
});

const sectors = [
  { slug: "demir-celik", label: "Demir-Çelik", icon: Layers },
  { slug: "aluminyum", label: "Alüminyum", icon: Building2 },
  { slug: "cimento", label: "Çimento", icon: Building2 },
  { slug: "gubre", label: "Gübre", icon: Sprout },
  { slug: "elektrik", label: "Elektrik", icon: Zap },
  { slug: "hidrojen", label: "Hidrojen", icon: Zap },
] as const;

const homeFaqIds = [
  "cbam-raporu",
  "cbam-hesaplama",
  "gtip-kapsam",
  "50-ton",
  "dogrulama-zorunlu",
  "cbam-excel",
  "sertifika-fiyati",
  "alici-ne-ister",
] as const;

export default function HomePage() {
  const homeFaqs = homeFaqIds
    .map((id) => SEARCH_FAQS.find((item) => item.id === id))
    .filter((item): item is (typeof SEARCH_FAQS)[number] => Boolean(item));

  const latestUpdate = REGULATORY_UPDATES[0];
  const latestUpdateDateStr = latestUpdate
    ? new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(new Date(`${latestUpdate.officialPublishedAt}T12:00:00+03:00`))
    : "";

  return (
    <>
      <RegistryJsonLd route="/" />
      <main className="bg-white text-ink-900">
        {latestUpdate && (
          <div className="bg-brand-50 border-b border-brand-800/10 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold text-brand-950 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/25 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900">Son Güncelleme</span>
            <span><strong>{latestUpdateDateStr}:</strong> {latestUpdate.shortTitle} yayımlandı.</span>
            <Link href={`/sozluk/#${latestUpdate.slug}`} className="text-brand-900 underline hover:text-brand-800">
              Detayları sözlükte gör →
            </Link>
          </div>
        )}
        <section className="border-b border-line bg-gradient-to-b from-[#f2f8ed] via-[#f8fbf6] to-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-brand-900 shadow-sm sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                Türk ihracatçı için CBAM / SKDM 2026
              </div>
              <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">
                AB müşteriniz <span className="text-brand-800">CBAM raporu</span> mu istedi?
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-7 text-ink-700 sm:text-xl sm:leading-8">
                GTİP/CN kapsamını kontrol edin; tesis, üretim, enerji, precursor ve kanıt verisini doğru kaynaktan toplayın; gömülü emisyon hesabını ve hesap izini tek akışta oluşturun.
              </p>
            </div>

            <div className="mx-auto mt-9 max-w-3xl rounded-3xl border-2 border-brand-800/20 bg-white p-5 shadow-xl sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-sm font-black text-ink-900">
                <Search className="h-5 w-5 text-brand-700" />
                İlk kontrol: ürününüz CBAM kapsamında mı?
              </div>
              <GtipArama />
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/basla/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-brand-500 px-7 text-base font-black text-brand-950 shadow-lg transition hover:bg-brand-400">
                GTİP ile ücretsiz kontrol et <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/cbam-hesaplama/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-brand-800/20 bg-white px-7 text-base font-black text-brand-900 transition hover:bg-brand-50">
                CBAM hesaplama nasıl yapılır?
              </Link>
            </div>
            <p className="mt-4 text-center text-sm font-bold text-ink-600">
              {CBAM_COMMERCIAL_RELEASE_READY
                ? "Kapsam ve veri hazırlığı ücretsizdir; ücret yalnız sunucu-otoriteli nihai paket üretiminde alınır."
                : "Kapsam, veri hazırlığı ve kalite kontrolleri ücretsizdir. Ücretli CBAM teslim kapısı kalite kapıları tamamlanana kadar ödeme almadan kapalıdır."}
            </p>
          </div>
        </section>

        <MethodologyTrustBar />
        <HomeCbamFourStepFlow />

        <section className="border-b border-line bg-[#f7faf6] py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Kapsam</span>
                <h2 className="mt-2 text-3xl font-black tracking-tight">6 temel CBAM sektör ailesi</h2>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-ink-700">
                  Sektör adı yalnız başlangıçtır. Nihai kapsam kontrolü ürününüzün doğrulanmış CN/GTİP koduna göre yapılır.
                </p>
              </div>
              <Link href="/basla/" className="inline-flex items-center gap-2 text-sm font-black text-brand-900">
                GTİP kontrolüne git <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {sectors.map((sector) => {
                const Icon = sector.icon;
                return (
                  <Link key={sector.slug} href={`/sektor/${sector.slug}/`} className="group rounded-2xl border border-line bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-800/35 hover:shadow-md">
                    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-800"><Icon className="h-5 w-5" /></span>
                    <span className="mt-3 block text-sm font-black text-ink-900">{sector.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <RegulatoryUpdatesSection />

        <section className="border-b border-line bg-[#071812] py-14 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-300">Çıktı mimarisi</span>
                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tek PDF değil, {PLATFORM_STATS.fileCount} dosyalı doğrulamaya hazırlık yapısı</h2>
                <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
                  Hesap izi, CBAM Communication Template veri eşleme özeti, izleme planı, kanıt kayıtları ve alıcı/doğrulayıcı için ayrıştırılmış çalışma dosyaları aynı manifestten hazırlanır. Avrupa Komisyonu'nun Communication Template XLSX'i ayrı resmî kaynaktır; sistemdeki eşleme özeti bu resmî dosyanın birebir kopyası değildir.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/fiyatlandirma/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-black text-brand-950">Teslim yapısını ve fiyatı gör <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/cbam-dogrulama/" className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-5 text-sm font-black text-white">Doğrulama sürecini gör</Link>
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/[0.05] p-6">
                <h3 className="text-lg font-black">Ürün sınırı</h3>
                <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-slate-300">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> Veri, hesap izi ve kanıt zincirini düzenler.</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> Resmî Communication Template'e aktarımı kolaylaştıran alan eşleme özeti üretir.</li>
                  <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> SHA-256 yalnız dosya bütünlüğünü teyit eder.</li>
                  <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> Akredite doğrulama görüşü veya gümrük onayı vermez.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <UcYolunuzVarKarsilastirma />

        <section className="border-b border-line bg-[#f4f8f3] py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Aranan sorular</span>
                <h2 className="mt-2 text-3xl font-black tracking-tight">CBAM / SKDM hakkında en kritik sorular</h2>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-ink-700">Arama motoruna yazılan kullanıcı diliyle kısa cevap veriyoruz; ayrıntı gerektiğinde tek sahibi olan ilgili sayfaya yönlendiriyoruz.</p>
              </div>
              <Link href="/sss/" className="inline-flex items-center gap-2 text-sm font-black text-brand-900">Tüm soruları gör <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-7 space-y-3">
              {homeFaqs.map((item) => (
                <details key={item.id} className="group rounded-2xl border border-line bg-white p-5 shadow-sm open:border-brand-800/35">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-black text-ink-900 sm:text-lg">
                    <span>{item.question}</span><span className="text-2xl font-light text-brand-800 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-7 text-ink-700 sm:text-base">{item.answer}</p>
                  {item.ownerUrl !== "/sss/" && (
                    <Link href={item.ownerUrl} className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 hover:underline">Ayrıntılı sayfa <ArrowRight className="h-3.5 w-3.5" /></Link>
                  )}
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-950 py-14 text-center text-white sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Önce kapsamı görün; sonra doğru veriyi toplayın.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-brand-mist">GTİP/CN kontrolü ve doğrulamaya hazırlık adımları ücretsizdir. Kart bilgisi istenmez.</p>
            <Link href="/basla/" className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-brand-500 px-8 text-base font-black text-brand-950 shadow-lg">Ücretsiz başla <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </section>
      </main>
    </>
  );
}

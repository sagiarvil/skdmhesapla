import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { VerificationGuidanceNotice } from "@/components/regulatory/VerificationGuidanceNotice";
import { RegulatoryImplementationStatus } from "@/components/regulatory/RegulatoryImplementationStatus";
import { absoluteUrl, pageMetadata } from "@/lib/skdm/seo";
import { REGULATORY_UPDATES, regulatoryUpdatePath } from "@/lib/skdm/regulatory-updates";
import { MARKET_UPDATES } from "@/lib/skdm/market-updates";

type Props = { params: Promise<{ slug: string }> };

const dateTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

const VERIFIER_GUIDANCE_SLUG = "cbam-accreditation-guidance-2026";

export type CombinedUpdate = ((typeof REGULATORY_UPDATES)[number] | (typeof MARKET_UPDATES)[number]) & {
  legalBasis?: string;
  implementation?: {
    status: string;
    calculationImpact: string;
    engineState: string;
    uiState: string;
    blockingGaps: readonly string[];
    surfaces: readonly string[];
  };
};

const ALL_UPDATES: CombinedUpdate[] = [
  ...REGULATORY_UPDATES,
  ...MARKET_UPDATES.map(item => ({
    ...item,
    implementation: {
      status: item.productStatus,
      calculationImpact: "NONE" as const,
      engineState: "NONE" as const,
      uiState: "NONE" as const,
      blockingGaps: [] as readonly string[],
      surfaces: [] as readonly string[]
    }
  }))
];

export function getCombinedUpdate(slug: string): CombinedUpdate | undefined {
  return ALL_UPDATES.find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return ALL_UPDATES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getCombinedUpdate(slug);
  if (!item) return {};
  return pageMetadata({
    path: regulatoryUpdatePath(item.slug),
    title: `${item.shortTitle} — ${item.officialPublishedAt} | SKDMHesapla`,
    description: `${item.summary.slice(0, 145)} Türk ihracatçıya etkisi ve yapılacak kontroller.`,
  });
}

export default async function RegulatoryUpdatePage({ params }: Props) {
  const { slug } = await params;
  const item = getCombinedUpdate(slug);
  if (!item) notFound();

  const route = regulatoryUpdatePath(item.slug);
  const relatedUpdates = [...ALL_UPDATES]
    .filter((update) => update.slug !== item.slug)
    .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt))
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(route)}#article`,
    headline: item.title,
    description: item.summary,
    datePublished: item.officialPublishedAt,
    dateModified: item.humanReviewedAt,
    inLanguage: "tr-TR",
    url: absoluteUrl(route),
    mainEntityOfPage: absoluteUrl(route),
    author: { "@type": "Organization", name: "SKDMHesapla", url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "SKDMHesapla", url: absoluteUrl("/") },
    citation: item.sourceUrl,
    isBasedOn: item.sourceUrl,
    about: ["CBAM", "SKDM", item.sourceTypeLabel, item.relevantPeriod],
  };

  return (
    <main className="min-h-screen bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-6">
          <a
            href="/mevzuat-guncellemeleri/"
            className="inline-flex items-center gap-2 text-sm font-black text-brand-900 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> Tüm güncellemeleri gör
          </a>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-900">
            <ListChecks className="h-3.5 w-3.5" /> Mevzuat güncellemeleri merkezi
          </span>
        </div>
      </div>

      <section className="border-b border-line bg-gradient-to-b from-[#f5faf6] via-white to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-800">
              {item.priority}
            </span>
            <span className="rounded-full border border-brand-800/20 bg-white px-3 py-1 text-xs font-bold text-brand-900">
              {item.sourceTypeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-600">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateTr.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{item.title}</h1>
          <p className="mt-5 max-w-4xl text-base font-medium leading-relaxed text-ink-700 sm:text-lg">{item.summary}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-black text-white hover:bg-brand-700"
            >
              Resmî kaynağı aç <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="/mevzuat-guncellemeleri/"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-800/20 bg-white px-5 text-sm font-black text-brand-900 hover:bg-brand-50"
            >
              Diğer güncellemeleri incele <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {item.sourceType !== "MARKET_SIGNAL" && <RegulatoryImplementationStatus item={item} />}

      {item.slug === VERIFIER_GUIDANCE_SLUG && (
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <VerificationGuidanceNotice />
          </div>
        </section>
      )}

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 sm:px-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-7">
            <h2 className="text-xl font-black">Türk ihracatçıya etkisi</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">{item.exporterImpact}</p>
          </article>
          <article className="rounded-3xl border border-sky-200 bg-sky-50/60 p-6 sm:p-7">
            <h2 className="text-xl font-black">İlgili dönem</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">{item.relevantPeriod}</p>
            {item.sourceType !== "MARKET_SIGNAL" && (
              <>
                <h3 className="mt-5 text-sm font-black uppercase tracking-wide text-ink-700">Ürün durumu</h3>
                <p className="mt-2 text-sm font-medium text-ink-700">
                  {item.productStatus === "IMPLEMENTED"
                    ? "SKDMHesapla'ya işlendi"
                    : item.productStatus === "ACTION_REQUIRED"
                      ? "Ürün kontrolü / aksiyon gerekli"
                      : "İzlemede"}
                </p>
                <div className="mt-4 grid gap-2 text-xs font-semibold text-ink-600 sm:grid-cols-2">
                  <p>Hesap etkisi: <b>{item.implementation?.calculationImpact}</b></p>
                  <p>Motor: <b>{item.implementation?.engineState}</b></p>
                  <p>Kullanıcı ekranı: <b>{item.implementation?.uiState}</b></p>
                  <p>Açık madde: <b>{item.implementation?.blockingGaps.length}</b></p>
                </div>
              </>
            )}
          </article>
        </div>
      </section>

      <section className="border-y border-line bg-[#f8faf8] py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <h2 className="text-2xl font-black">Ne yapmalısınız?</h2>
            <ul className="mt-5 space-y-3">
              {item.userActions.map((action) => (
                <li key={action} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm font-medium leading-relaxed text-ink-700">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> {action}
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-3xl border border-line bg-white p-6 sm:p-7">
            <h2 className="text-xl font-black">SKDMHesapla üzerindeki etkisi</h2>
            <ul className="mt-4 space-y-2 text-sm font-medium leading-relaxed text-ink-700">
              {item.affectedModules.map((module) => (
                <li key={module}>• {module}</li>
              ))}
            </ul>
            {item.legalBasis && (
              <>
                <h3 className="mt-6 text-sm font-black uppercase tracking-wide">Hukuki dayanak</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{item.legalBasis}</p>
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="py-12 sm:py-16" aria-labelledby="other-regulatory-updates">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Mevzuat radarı</span>
              <h2 id="other-regulatory-updates" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Diğer güncellemeleri de kontrol edin
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-ink-600">
                Tek bir mevzuat kaydına bağlı kalmayın. Son değişiklikleri tarih, öncelik ve Türk ihracatçıya etkisiyle birlikte izleyin.
              </p>
            </div>
            <a
              href="/mevzuat-guncellemeleri/"
              className="inline-flex items-center gap-2 text-sm font-black text-brand-900 hover:text-brand-700"
            >
              Tüm güncellemeleri gör <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedUpdates.map((update) => (
              <article key={update.slug} className="flex h-full flex-col rounded-2xl border border-line bg-[#fbfdfb] p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand-900">
                    {update.priority}
                  </span>
                  <span className="text-[11px] font-semibold text-ink-500">
                    {dateTr.format(new Date(`${update.officialPublishedAt}T12:00:00+03:00`))}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-black leading-snug text-ink-900">{update.shortTitle}</h3>
                <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-ink-600">{update.summary}</p>
                <a
                  href={regulatoryUpdatePath(update.slug)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-900 hover:text-brand-700"
                >
                  Etkisini incele <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 sm:pb-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="rounded-3xl border-2 border-brand-800/15 bg-[#071812] p-6 text-white sm:p-8">
            <h2 className="text-xl font-black">Kaynak otoritesi ve sınır</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">{item.authorityNote}</p>
            <p className="mt-4 text-xs font-medium leading-relaxed text-slate-400">
              SKDMHesapla hukuki görüş, akredite doğrulama görüşü veya gümrük onayı vermez. Bağlayıcı uygulamada resmi AB mevzuatı ve yetkili kurum kaynakları esas alınır.
            </p>
            <a
              href="/mevzuat-guncellemeleri/"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-brand-900 hover:bg-brand-50"
            >
              Güncellemeler merkezine dön <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

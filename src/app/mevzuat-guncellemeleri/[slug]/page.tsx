import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, ShieldCheck } from "lucide-react";
import { absoluteUrl, pageMetadata } from "@/lib/skdm/seo";
import { REGULATORY_UPDATES, getRegulatoryUpdate } from "@/lib/skdm/regulatory-updates";

type Props = { params: Promise<{ slug: string }> };

const dateTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

export function generateStaticParams() {
  return REGULATORY_UPDATES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getRegulatoryUpdate(slug);
  if (!item) return {};
  return pageMetadata({
    path: `/mevzuat-guncellemeleri/${item.slug}/`,
    title: `${item.shortTitle} — ${item.officialPublishedAt} | SKDMHesapla`,
    description: `${item.summary.slice(0, 145)} Türk ihracatçıya etkisi ve yapılacak kontroller.`,
  });
}

export default async function RegulatoryUpdatePage({ params }: Props) {
  const { slug } = await params;
  const item = getRegulatoryUpdate(slug);
  if (!item) notFound();

  const route = `/mevzuat-guncellemeleri/${item.slug}/`;
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

      <section className="border-b border-line bg-gradient-to-b from-[#f5faf6] via-white to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <Link href="/mevzuat-guncellemeleri/" className="inline-flex items-center gap-2 text-sm font-black text-brand-900 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" /> Tüm mevzuat güncellemeleri
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-800">{item.priority}</span>
            <span className="rounded-full border border-brand-800/20 bg-white px-3 py-1 text-xs font-bold text-brand-900">{item.sourceTypeLabel}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-600"><CalendarDays className="h-3.5 w-3.5" /> {dateTr.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{item.title}</h1>
          <p className="mt-5 max-w-4xl text-base font-medium leading-relaxed text-ink-700 sm:text-lg">{item.summary}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-black text-white hover:bg-brand-700">
              Resmî kaynağı aç <ExternalLink className="h-4 w-4" />
            </a>
            <Link href="/basla/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-800/20 bg-white px-5 text-sm font-black text-brand-900 hover:bg-brand-50">
              Kapsamınızı kontrol edin <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 sm:px-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-7">
            <h2 className="text-xl font-black">Türk ihracatçıya etkisi</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">{item.exporterImpact}</p>
          </article>
          <article className="rounded-3xl border border-sky-200 bg-sky-50/60 p-6 sm:p-7">
            <h2 className="text-xl font-black">İlgili dönem</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">{item.relevantPeriod}</p>
            <h3 className="mt-5 text-sm font-black uppercase tracking-wide text-ink-700">Ürün durumu</h3>
            <p className="mt-2 text-sm font-medium text-ink-700">{item.productStatus === "IMPLEMENTED" ? "SKDMHesapla'ya işlendi" : item.productStatus === "ACTION_REQUIRED" ? "Ürün kontrolü / aksiyon gerekli" : "İzlemede"}</p>
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
              {item.affectedModules.map((module) => <li key={module}>• {module}</li>)}
            </ul>
            {item.legalBasis && <><h3 className="mt-6 text-sm font-black uppercase tracking-wide">Hukuki dayanak</h3><p className="mt-2 text-sm leading-relaxed text-ink-700">{item.legalBasis}</p></>}
          </aside>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="rounded-3xl border-2 border-brand-800/15 bg-[#071812] p-6 text-white sm:p-8">
            <h2 className="text-xl font-black">Kaynak otoritesi ve sınır</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">{item.authorityNote}</p>
            <p className="mt-4 text-xs font-medium leading-relaxed text-slate-400">SKDMHesapla hukuki görüş, akredite doğrulama görüşü veya gümrük onayı vermez. Bağlayıcı uygulamada resmi AB mevzuatı ve yetkili kurum kaynakları esas alınır.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

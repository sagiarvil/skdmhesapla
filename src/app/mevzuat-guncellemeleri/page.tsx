import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { pageMetadata, absoluteUrl } from "@/lib/skdm/seo";
import { REGULATORY_UPDATES } from "@/lib/skdm/regulatory-updates";

export const metadata: Metadata = pageMetadata({
  path: "/mevzuat-guncellemeleri/",
  title: "AB SKDM Mevzuat Güncellemeleri — SKDMHesapla",
  description:
    "AB CBAM/SKDM mevzuatı, uygulama tüzükleri, varsayılan değerler, rehberler, doğrulama ve Registry değişikliklerini ürün etkisiyle takip edin.",
});

const dateTr = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Istanbul" });
const detectedTr = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });

export default function RegulatoryUpdatesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/mevzuat-guncellemeleri/")}#collection`,
    name: "AB SKDM Mevzuat Güncellemeleri",
    inLanguage: "tr-TR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: REGULATORY_UPDATES.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${absoluteUrl("/mevzuat-guncellemeleri/")}#${item.slug}`,
        name: item.title,
      })),
    },
  };

  return (
    <main className="bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <section className="border-b border-line bg-gradient-to-b from-[#f5f9f2] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-800">Resmî kaynak izleme merkezi</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">AB SKDM mevzuat güncellemeleri</h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
            Avrupa Komisyonu ve EUR-Lex değişikliklerini; resmî yayın tarihi, uygulama tarihi, etkilenen modül ve SKDMHesapla&apos;da gereken aksiyonla birlikte izliyoruz.
          </p>
          <div className="mt-6 rounded-2xl border-2 border-brand-800/15 bg-white p-5 text-sm font-semibold leading-relaxed text-ink-700">
            “Tespit zamanı”, SKDMHesapla izleme kaydının sisteme alındığı zamandır; “resmî yayın” ise kaynağın kendi yayın tarihidir. Hukuken bağlayıcı metin her zaman EUR-Lex veya ilgili Komisyon düzenlemesidir.
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-8 px-5 sm:px-6">
          {REGULATORY_UPDATES.map((item) => (
            <article id={item.slug} key={item.slug} className="scroll-mt-24 rounded-3xl border-2 border-line bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-black">
                <span className={item.priority === "P0" ? "rounded-full bg-red-50 px-3 py-1.5 text-red-800" : "rounded-full bg-amber-50 px-3 py-1.5 text-amber-900"}>{item.priority}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{item.status === "IMPLEMENTED" ? "Sistemde uygulandı" : "Aksiyon gerekli"}</span>
              </div>

              <h2 className="mt-4 text-2xl font-black tracking-tight text-ink-900">{item.title}</h2>
              <p className="mt-3 text-base font-medium leading-relaxed text-ink-700">{item.summary}</p>

              <dl className="mt-6 grid gap-4 rounded-2xl bg-[#f7faf8] p-5 sm:grid-cols-3">
                <div><dt className="text-xs font-black uppercase text-ink-500">Tespit</dt><dd className="mt-1 text-sm font-bold">{detectedTr.format(new Date(item.detectedAt))}</dd></div>
                <div><dt className="text-xs font-black uppercase text-ink-500">Resmî yayın</dt><dd className="mt-1 text-sm font-bold">{dateTr.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</dd></div>
                <div><dt className="text-xs font-black uppercase text-ink-500">Uygulama</dt><dd className="mt-1 text-sm font-bold">{dateTr.format(new Date(`${item.effectiveFrom}T12:00:00+03:00`))}</dd></div>
              </dl>

              <div className="mt-7 grid gap-7 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-ink-900">Etkilenen modüller</h3>
                  <ul className="mt-3 space-y-2 text-sm font-semibold text-ink-700">
                    {item.affectedModules.map((module) => <li key={module}>• {module}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-ink-900">Gerekli değişiklik</h3>
                  <ul className="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-ink-700">
                    {item.requiredActions.map((action) => <li key={action}>• {action}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-4 border-t border-line pt-5">
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-black text-brand-900 hover:text-brand-700">
                  Resmî kaynağı aç <ExternalLink className="h-4 w-4" />
                </a>
                <Link href="/basla/" className="inline-flex items-center gap-2 font-black text-ink-800 hover:text-brand-900">
                  Bu değişikliğin dosyanıza etkisini kontrol edin <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

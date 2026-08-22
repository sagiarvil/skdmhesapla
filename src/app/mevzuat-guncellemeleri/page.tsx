import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, ShieldCheck } from "lucide-react";
import { pageMetadata, absoluteUrl } from "@/lib/skdm/seo";
import { REGULATORY_UPDATES } from "@/lib/skdm/regulatory-updates";
import { RegulatoryIndexClient } from "@/components/regulatory/RegulatoryIndexClient";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = pageMetadata({
  path: "/mevzuat-guncellemeleri/",
  title: "AB SKDM Mevzuat Güncellemeleri ve İhracatçı Etkisi — SKDMHesapla",
  description:
    "AB CBAM/SKDM güncellemelerini yalnız haber olarak değil; kaynak türü, hukuki ağırlığı, Türk ihracatçıya etkisi ve yapılacak kontrolle birlikte izleyin.",
});

const detectedTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});

export default function RegulatoryUpdatesPage() {
  const latest = [...REGULATORY_UPDATES].sort(
    (a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt),
  )[0];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/mevzuat-guncellemeleri/")}#collection`,
    url: absoluteUrl("/mevzuat-guncellemeleri/"),
    name: "AB SKDM Mevzuat Güncellemeleri ve İhracatçı Etkisi",
    description:
      "AB CBAM/SKDM güncellemelerinin kaynak türü, hukuki ağırlığı ve Türk ihracatçıya etkisiyle sınıflandırıldığı güncelleme merkezi.",
    inLanguage: "tr-TR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: REGULATORY_UPDATES.length,
      itemListElement: REGULATORY_UPDATES.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${absoluteUrl("/mevzuat-guncellemeleri/")}#${item.slug}`,
        item: {
          "@type": "Article",
          headline: item.title,
          datePublished: item.detectedAt,
          dateModified: item.detectedAt,
          description: item.summary,
          inLanguage: "tr-TR",
          citation: item.sourceUrl,
          isBasedOn: item.sourceUrl,
        },
      })),
    },
  };

  return (
    <main className="bg-white text-ink-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <section className="border-b border-line bg-gradient-to-b from-[#f1f7ed] via-[#f8fbf6] to-white py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 space-y-6">
          <GeriLink />

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              SKDM Mevzuat Radarı &amp; Güncelleme İndeksi
            </div>
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Mevzuat değiştiğinde, Türk ihracatçı için neyin değiştiğini gösteriyoruz.
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
              Avrupa Komisyonu ve EUR-Lex yayınlarını yalnızca sıralamıyoruz. Kaynağın hukuki ağırlığını,
              hangi dönemi etkilediğini, sizin dosyanızda neyi kontrol etmeniz gerektiğini ve SKDMHesapla&apos;nın
              bu değişikliğe verdiği ürün karşılığını ayrı ayrı sınıflandırıp indeksliyoruz.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-ink-500">Kayıtlı Güncelleme</div>
              <div className="mt-2 text-3xl font-black text-ink-900">{REGULATORY_UPDATES.length}</div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-ink-500">Son Tespit Zamanı</div>
              <div className="mt-2 text-base font-black text-ink-900">
                {latest ? detectedTr.format(new Date(latest.detectedAt)) : "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-ink-500">Kaynak Doğrulama</div>
              <div className="mt-2 text-base font-black text-emerald-800">Resmî AB Kaynağı Doğrulandı</div>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border-2 border-brand-800/15 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-800" />
              <div>
                <h2 className="text-sm font-black text-ink-900">Kaynakların hukuki ağırlığı ayrılır</h2>
                <p className="mt-1 text-sm font-medium leading-relaxed text-ink-700">
                  Uygulama tüzüğü, Komisyon rehberi, Excel veri seti ve Registry kullanıcı kılavuzu aynı şey değildir.
                  Her kayıt kendi kaynak türüyle etiketlenir.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-800" />
              <div>
                <h2 className="text-sm font-black text-ink-900">Tespit zamanı yayın tarihi değildir</h2>
                <p className="mt-1 text-sm font-medium leading-relaxed text-ink-700">
                  “Tespit” SKDMHesapla izleme kaydının sisteme alındığı saattir. “Resmî yayın” kaynağın kendi tarihidir.
                  Hukuki etki ayrıca ilgili düzenlemenin metninden değerlendirilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOAJ Index & Faceted Catalog Section */}
      <section className="bg-[#fbfcfa] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <RegulatoryIndexClient updates={REGULATORY_UPDATES} />
        </div>
      </section>

      <section className="border-t border-line bg-brand-950 py-14 text-white sm:py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Mevzuat değişikliğini dosyanızdan bağımsız okumayın.</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-brand-mist sm:text-base">
              Etki; ürününüzün CN/GTİP koduna, kullandığınız actual/default değer yöntemine ve dosyanızın hangi aşamada olduğuna göre değişir.
            </p>
          </div>
          <Link
            href="/basla/"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-black text-brand-950 hover:bg-brand-400 transition"
          >
            Kapsam ve dosya kontrolünü başlat <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

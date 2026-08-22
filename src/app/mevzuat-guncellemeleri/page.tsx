import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, Info, ShieldCheck } from "lucide-react";
import { pageMetadata, absoluteUrl } from "@/lib/skdm/seo";
import { REGULATORY_UPDATES } from "@/lib/skdm/regulatory-updates";

export const metadata: Metadata = pageMetadata({
  path: "/mevzuat-guncellemeleri/",
  title: "AB SKDM Mevzuat Güncellemeleri ve İhracatçı Etkisi — SKDMHesapla",
  description:
    "AB CBAM/SKDM güncellemelerini yalnız haber olarak değil; kaynak türü, hukuki ağırlığı, Türk ihracatçıya etkisi ve yapılacak kontrolle birlikte izleyin.",
});

const dateTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});

const detectedTr = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});

const productStatusLabel = {
  IMPLEMENTED: "SKDMHesapla'ya işlendi",
  ACTION_REQUIRED: "Ürün kontrolü / uygulama gerekli",
  MONITORING: "İzlemede",
} as const;

const priorityLabel = {
  P0: "Yüksek kontrol önceliği",
  P1: "Operasyonel kontrol",
  P2: "İzleme",
} as const;

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

      <section className="border-b border-line bg-gradient-to-b from-[#f1f7ed] via-[#f8fbf6] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/15 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              SKDM mevzuat radarı
            </div>
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Mevzuat değiştiğinde, Türk ihracatçı için neyin değiştiğini gösteriyoruz.
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
              Avrupa Komisyonu ve EUR-Lex yayınlarını yalnızca sıralamıyoruz. Kaynağın hukuki ağırlığını,
              hangi dönemi etkilediğini, sizin dosyanızda neyi kontrol etmeniz gerektiğini ve SKDMHesapla&apos;nın
              bu değişikliğe verdiği ürün karşılığını ayrı ayrı gösteriyoruz.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-ink-500">Kayıtlı güncelleme</div>
              <div className="mt-2 text-3xl font-black text-ink-900">{REGULATORY_UPDATES.length}</div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-ink-500">Son tespit</div>
              <div className="mt-2 text-base font-black text-ink-900">
                {latest ? detectedTr.format(new Date(latest.detectedAt)) : "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-ink-500">Kaynak kuralı</div>
              <div className="mt-2 text-base font-black text-ink-900">Resmî AB kaynağı zorunlu</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-3xl border-2 border-brand-800/15 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
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

      <section className="border-b border-line bg-white py-8">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-ink-600">
            <span className="mr-1 font-black text-ink-900">Kaynak sınıfları:</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Bağlayıcı düzenleme</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Resmî veri seti</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Komisyon rehberi</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Operasyon kılavuzu</span>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfcfa] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-5 sm:px-6">
          {REGULATORY_UPDATES.map((item) => (
            <article
              id={item.slug}
              key={item.slug}
              className="scroll-mt-24 overflow-hidden rounded-3xl border-2 border-line bg-white shadow-sm"
            >
              <div className="border-b border-line bg-[#f8faf7] p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wide">
                  <span className={item.priority === "P0" ? "rounded-full bg-red-50 px-3 py-1.5 text-red-800" : "rounded-full bg-amber-50 px-3 py-1.5 text-amber-900"}>
                    {priorityLabel[item.priority]}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-slate-700 ring-1 ring-line">
                    {item.sourceTypeLabel}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-900">
                    Kaynak doğrulandı
                  </span>
                </div>

                <h2 className="mt-5 max-w-4xl text-2xl font-black leading-tight tracking-tight text-ink-900 sm:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-4 max-w-4xl text-base font-medium leading-relaxed text-ink-700">
                  {item.summary}
                </p>

                <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-line bg-white p-4">
                    <dt className="text-[11px] font-black uppercase tracking-wide text-ink-500">Tespit zamanı</dt>
                    <dd className="mt-1.5 text-sm font-black text-ink-900">{detectedTr.format(new Date(item.detectedAt))}</dd>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-4">
                    <dt className="text-[11px] font-black uppercase tracking-wide text-ink-500">Resmî yayın</dt>
                    <dd className="mt-1.5 text-sm font-black text-ink-900">{dateTr.format(new Date(`${item.officialPublishedAt}T12:00:00+03:00`))}</dd>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-4">
                    <dt className="text-[11px] font-black uppercase tracking-wide text-ink-500">İlgili dönem</dt>
                    <dd className="mt-1.5 text-sm font-black text-ink-900">{item.relevantPeriod}</dd>
                  </div>
                </dl>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 sm:p-8 lg:border-r lg:border-line">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-brand-800">Türk ihracatçı için etkisi</span>
                  <p className="mt-3 text-base font-semibold leading-relaxed text-ink-800">{item.exporterImpact}</p>

                  <h3 className="mt-7 text-sm font-black uppercase tracking-wide text-ink-900">Şimdi neyi kontrol edin?</h3>
                  <ul className="mt-4 space-y-3">
                    {item.userActions.map((action) => (
                      <li key={action} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-ink-700">
                        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-700" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="bg-[#fcfdfb] p-6 sm:p-8">
                  <div className="text-xs font-black uppercase tracking-[0.12em] text-ink-500">Kaynak ve otorite</div>
                  <div className="mt-3 text-sm font-black text-ink-900">{item.sourceLabel}</div>
                  {item.legalBasis ? (
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-ink-700">Hukuki temel: {item.legalBasis}</p>
                  ) : null}
                  <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">{item.authorityNote}</p>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-900 hover:text-brand-700"
                  >
                    Avrupa Komisyonu kaynağını aç <ExternalLink className="h-4 w-4" />
                  </a>

                  <div className="mt-7 border-t border-line pt-5">
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-ink-500">SKDMHesapla durumu</div>
                    <div className="mt-2 text-sm font-black text-ink-900">{productStatusLabel[item.productStatus]}</div>
                  </div>

                  <details className="mt-5 rounded-2xl border border-line bg-white p-4">
                    <summary className="cursor-pointer list-none text-sm font-black text-ink-900">
                      Teknik etki kaydını göster
                    </summary>
                    <div className="mt-4 space-y-4 border-t border-line pt-4">
                      <div>
                        <div className="text-xs font-black uppercase text-ink-500">Etkilenen modüller</div>
                        <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-700">{item.affectedModules.join(" · ")}</p>
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase text-ink-500">Ürün aksiyonu</div>
                        <ul className="mt-2 space-y-2 text-xs font-semibold leading-relaxed text-ink-700">
                          {item.requiredActions.map((action) => <li key={action}>• {action}</li>)}
                        </ul>
                      </div>
                    </div>
                  </details>
                </aside>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-white px-6 py-5 sm:px-8">
                <p className="max-w-2xl text-xs font-semibold leading-relaxed text-ink-500">
                  Bu özet hukuki görüş değildir. Kesin uygulama için bağlayıcı AB metni, doğrulanmış CN/GTİP ve dosyanızda kullanılan veri yöntemi birlikte değerlendirilmelidir.
                </p>
                <Link href="/basla/" className="inline-flex items-center gap-2 text-sm font-black text-brand-900 hover:text-brand-700">
                  Dosyanızdaki etkiyi kontrol edin <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
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
          <Link href="/basla/" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-black text-brand-950 hover:bg-brand-400">
            Kapsam ve dosya kontrolünü başlat <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

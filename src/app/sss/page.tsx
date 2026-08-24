import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { absoluteUrl, pageMetadata } from "@/lib/skdm/seo";
import { SEARCH_FAQS, SEARCH_FAQ_GROUPS } from "@/lib/skdm/search-faq";

export const metadata: Metadata = pageMetadata({
  path: "/sss/",
  title: "CBAM / SKDM Sık Sorulan Sorular 2026 — Türkiye",
  description:
    "CBAM raporu, SKDM hesaplama, 50 ton muafiyeti, GTİP, Communication Template, doğrulama, Registry ve sertifika maliyeti hakkında Türk ihracatçının en sık sorduğu sorular.",
});

export default function SssPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/sss/")}#page`,
    url: absoluteUrl("/sss/"),
    name: "CBAM / SKDM Sık Sorulan Sorular 2026 — Türkiye",
    inLanguage: "tr-TR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: SEARCH_FAQS.length,
      itemListElement: SEARCH_FAQS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${absoluteUrl("/sss/")}#${item.id}`,
        name: item.question,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <section className="border-b border-line bg-gradient-to-b from-[#f3f8ef] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Türkiye · 2026 kesin dönem</span>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">CBAM / SKDM sık sorulan sorular</h1>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-ink-700">
            Google’da ve ihracatçı ekiplerinde tekrar eden soruları resmi kaynak sınırlarıyla tek yerde topladık. Kısa cevap önce gelir; teknik detay gerekiyorsa ilgili hesaplama, rehber veya resmi kaynağa geçebilirsiniz.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {SEARCH_FAQ_GROUPS.map((group) => (
              <a key={group.id} href={`#${group.id}`} className="rounded-full border border-brand-800/20 bg-white px-3 py-1.5 text-xs font-black text-brand-900 hover:bg-brand-50">
                {group.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-12 px-5 sm:px-6">
          {SEARCH_FAQ_GROUPS.map((group) => {
            const items = SEARCH_FAQS.filter((item) => item.group === group.id);
            return (
              <section key={group.id} id={group.id} className="scroll-mt-24">
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{group.label}</h2>
                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <article key={item.id} id={item.id} className="scroll-mt-24 rounded-2xl border border-line bg-[#fbfdfb] p-5 sm:p-6">
                      <h3 className="text-lg font-black leading-snug sm:text-xl">{item.question}</h3>
                      <p className="mt-3 text-sm font-medium leading-7 text-ink-700 sm:text-base">{item.answer}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold">
                        {item.ownerUrl !== "/sss/" && (
                          <Link href={item.ownerUrl} className="inline-flex items-center gap-1.5 text-brand-900 hover:underline">
                            İlgili sayfayı aç <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        {item.sourceUrl && (
                          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink-600 hover:text-brand-900 hover:underline">
                            {item.sourceLabel ?? "Resmî kaynak"} <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="border-t border-line bg-[#071812] py-12 text-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <h2 className="text-2xl font-black">Sorunuz kapsam veya hesaplama ise doğrudan test edin</h2>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">GTİP/CN kapsam kontrolü ve hesaplama akışı mühür aşamasına kadar ücretsizdir. Bu sayfadaki cevaplar hukuki görüş veya akredite doğrulama görüşü değildir.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/basla/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-black text-brand-950">GTİP ile kontrol et <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/cbam-hesaplama/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-black text-white">CBAM hesaplama akışı</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { pageMetadata, absoluteUrl } from "@/lib/skdm/seo";
import { REGULATORY_UPDATES } from "@/lib/skdm/regulatory-updates";
import { RegulatoryIndexClient } from "@/components/regulatory/RegulatoryIndexClient";

export const metadata: Metadata = pageMetadata({
  path: "/mevzuat-guncellemeleri/",
  title: "AB SKDM Mevzuat Güncellemeleri ve İhracatçı Etkisi — SKDMHesapla",
  description: "AB CBAM/SKDM güncellemelerini kaynak türü, hukuki ağırlığı, Türk ihracatçıya etkisi ve yapılacak kontrolle birlikte izleyin.",
});

export default function RegulatoryUpdatesPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/mevzuat-guncellemeleri/")}#collection`,
    url: absoluteUrl("/mevzuat-guncellemeleri/"),
    name: "AB SKDM Mevzuat Güncellemeleri ve İhracatçı Etkisi",
    description: "AB CBAM/SKDM güncellemelerinin kaynak türü, hukuki ağırlığı ve Türk ihracatçıya etkisiyle sınıflandırıldığı güncelleme merkezi.",
    inLanguage: "tr-TR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: REGULATORY_UPDATES.length,
      itemListElement: REGULATORY_UPDATES.map((item, index) => {
        const url = absoluteUrl(`/mevzuat-guncellemeleri/${item.slug}/`);
        return {
          "@type": "ListItem",
          position: index + 1,
          url,
          item: {
            "@type": "Article",
            "@id": `${url}#article`,
            url,
            headline: item.title,
            datePublished: item.officialPublishedAt,
            dateModified: item.humanReviewedAt,
            description: item.summary,
            inLanguage: "tr-TR",
            citation: item.sourceUrl,
            isBasedOn: item.sourceUrl,
          },
        };
      }),
    },
  };

  return (
    <main className="min-h-screen bg-white text-[#202124]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <h1 className="sr-only">AB SKDM Mevzuat Güncellemeleri ve İhracatçı Etkisi</h1>
      <RegulatoryIndexClient updates={REGULATORY_UPDATES} />
    </main>
  );
}

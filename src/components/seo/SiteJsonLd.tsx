import { organizationNode, websiteNode } from "@/lib/seo/jsonld";

/** Layout kimliği: tek @graph, Organization + WebSite. Sayfa tipi RegistryJsonLd ile eklenir. */
export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), websiteNode()],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

import {
  organizationJsonLd,
  personJsonLd,
  softwareJsonLd,
  websiteJsonLd,
} from "@/lib/skdm/seo";

/** Ana layout JSON-LD — Person + Organization + WebSite + SoftwareApplication. */
export function SiteJsonLd() {
  const blobs = [personJsonLd(), organizationJsonLd(), websiteJsonLd(), softwareJsonLd()];
  return (
    <>
      {blobs.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}

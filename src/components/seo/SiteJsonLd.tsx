import {
  organizationJsonLd,
  softwareJsonLd,
  websiteJsonLd,
} from "@/lib/skdm/seo";

/** Ana layout JSON-LD — Organization + WebSite + SoftwareApplication. */
export function SiteJsonLd() {
  const blobs = [organizationJsonLd(), websiteJsonLd(), softwareJsonLd()];
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

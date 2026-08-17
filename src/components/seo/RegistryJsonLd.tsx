import { jsonLdDocument } from "@/lib/seo/jsonld";

export function RegistryJsonLd({ route }: { route: string }) {
  const data = jsonLdDocument(route);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

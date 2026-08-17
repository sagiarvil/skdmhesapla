import { jsonLdDocument } from "@/lib/seo/jsonld";
import { SITE_ORIGIN } from "@/lib/skdm/seo";
import { markdownAbsoluteUrl } from "@/lib/seo/ai-surface";
import aiResources from "../../../data/seo/ai-resources.json";

const MD_ROUTES = new Set(
  (aiResources.resources as { route?: string; markdownEnabled?: boolean }[])
    .filter((r) => r.markdownEnabled && r.route)
    .map((r) => r.route as string),
);

export function RegistryJsonLd({ route }: { route: string }) {
  const data = jsonLdDocument(route);
  const markdown = MD_ROUTES.has(route);
  return (
    <>
      {markdown ? (
        <link
          rel="alternate"
          type="text/markdown"
          href={markdownAbsoluteUrl(SITE_ORIGIN, route)}
        />
      ) : null}
      {markdown ? (
        <link rel="describedby" href={`${SITE_ORIGIN}/llms.txt`} />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </>
  );
}

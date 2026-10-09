import React from 'react';
import { SEO_REGISTRY } from '../seo/registry';
import { buildCompleteJsonLdGraph } from '../seo/schema-builder';

// Bu bileşen Mandate V9.0'ın "14KB First-Packet @graph JSON-LD" kuralını uygular.
export function MandateSchema({ route = '/' }: { route?: string }) {
  const pageRecord = SEO_REGISTRY[route];
  if (!pageRecord) return null;

  const jsonLdString = buildCompleteJsonLdGraph(pageRecord, 'skdmhesapla.com');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}

import React from "react";
import { findRegulatorySourceByTitle } from "@/seo/regulatory-sources";

interface SourceFooterProps {
  sourceName: string;
  sourceUrl: string;
  sourceVersion?: string;
  /** @deprecated Use registry-backed adopted/published/review dates instead. */
  sourceDate?: string;
  adoptedAt?: string;
  publishedAt?: string;
  effectiveAt?: string;
  lastHumanReviewAt?: string;
  reviewerName: string;
  methodologyVersion: string;
  relatedRegulation?: string;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", { timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function SourceFooter(props: SourceFooterProps) {
  const {
    sourceName,
    sourceUrl,
    sourceVersion,
    sourceDate,
    adoptedAt,
    publishedAt,
    effectiveAt,
    lastHumanReviewAt,
    reviewerName,
    methodologyVersion,
    relatedRegulation,
  } = props;

  const registrySource = findRegulatorySourceByTitle(sourceName);
  const resolvedSourceUrl = registrySource?.sourceUrl ?? sourceUrl;
  const resolvedAdoptedAt = registrySource?.adoptedAt ?? adoptedAt;
  const resolvedPublishedAt = registrySource?.publishedAt ?? publishedAt;
  const resolvedEffectiveAt = registrySource?.effectiveAt ?? effectiveAt;
  const resolvedReviewAt = registrySource?.lastHumanReviewAt ?? lastHumanReviewAt;

  // Legacy sourceDate is intentionally ignored for registry-known regulations.
  // It remains only as a backwards-compatible fallback for non-registry sources.
  const legacySourceDate = registrySource ? undefined : sourceDate?.slice(0, 10);

  return (
    <footer className="source-provenance-footer mt-12 pt-6 border-t border-gray-200 text-sm text-gray-600 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Kaynak ve Doğrulama Bilgileri</h3>
      <ul className="space-y-2">
        <li>
          <strong>Resmi Kaynak:</strong>{" "}
          <a href={resolvedSourceUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {sourceName}
          </a>
          {sourceVersion && <span> (Sürüm: {sourceVersion})</span>}
        </li>
        {resolvedAdoptedAt && (
          <li>
            <strong>Kabul Tarihi:</strong>{" "}
            <time dateTime={resolvedAdoptedAt}>{formatDate(resolvedAdoptedAt)}</time>
          </li>
        )}
        {resolvedPublishedAt && (
          <li>
            <strong>Resmi Gazete Yayın Tarihi:</strong>{" "}
            <time dateTime={resolvedPublishedAt}>{formatDate(resolvedPublishedAt)}</time>
          </li>
        )}
        {resolvedEffectiveAt && (
          <li>
            <strong>Yürürlük Tarihi:</strong>{" "}
            <time dateTime={resolvedEffectiveAt}>{formatDate(resolvedEffectiveAt)}</time>
          </li>
        )}
        {legacySourceDate && (
          <li>
            <strong>Kaynak Tarihi:</strong>{" "}
            <time dateTime={legacySourceDate}>{formatDate(legacySourceDate)}</time>
          </li>
        )}
        <li>
          <strong>İlgili Düzenleme:</strong>{" "}
          {relatedRegulation ?? registrySource?.context ?? "Regulation (EU) 2025/2083 & 2025/2547 (Kesin Dönem)"}
        </li>
        <li>
          <strong>Son İnsan İncelemesi:</strong>{" "}
          {resolvedReviewAt ? <time dateTime={resolvedReviewAt}>{formatDate(resolvedReviewAt)}</time> : reviewerName}
          {resolvedReviewAt && <span> — {reviewerName}</span>}
        </li>
        <li>
          <strong>Metodoloji Sürümü:</strong> {methodologyVersion}
        </li>
      </ul>
      <p className="mt-4 text-xs text-gray-500">
        Bu bilgiler SKDMHesapla tarafından otomatik veya yapay zeka aracılığıyla değil, ilgili AB tüzüklerine ve metodoloji kurallarına dayanılarak hazırlanmıştır.
      </p>
    </footer>
  );
}

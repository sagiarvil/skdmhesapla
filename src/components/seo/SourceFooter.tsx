import React from "react";

interface SourceFooterProps {
  sourceName: string;
  sourceUrl: string;
  sourceVersion?: string;
  sourceDate: string;
  reviewerName: string;
  methodologyVersion: string;
  relatedRegulation?: string;
}

export function SourceFooter(props: SourceFooterProps) {
  const {
    sourceName,
    sourceUrl,
    sourceVersion,
    sourceDate,
    reviewerName,
    methodologyVersion,
    relatedRegulation
  } = props;

  return (
    <footer className="source-provenance-footer mt-12 pt-6 border-t border-gray-200 text-sm text-gray-600 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Kaynak ve Doğrulama Bilgileri</h3>
      <ul className="space-y-2">
        <li>
          <strong>Resmi Kaynak:</strong> <a href={sourceUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{sourceName}</a>
          {sourceVersion && <span> (Sürüm: {sourceVersion})</span>}
        </li>
        <li>
          <strong>Kaynak Tarihi:</strong> <time dateTime={sourceDate}>{new Date(sourceDate).toLocaleDateString('tr-TR')}</time>
        </li>
        <li>
          <strong>İlgili Düzenleme:</strong> {relatedRegulation || "Regulation (EU) 2025/2083 & 2025/2547 (Kesin Dönem)"}
        </li>
        <li>
          <strong>Son İnsan İncelemesi:</strong> {reviewerName}
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

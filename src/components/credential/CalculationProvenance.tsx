"use client";

import Link from "next/link";
import { methodology, credential } from "@/lib/skdm/credential";
import { track } from "@/lib/skdm/analytics";

export type CalculationProvenanceProps = {
  calculationId: string;
  methodologyVersion?: string;
  engineVersion?: string;
  regulatorySnapshot?: string;
  sha256?: string;
  className?: string;
};

export function CalculationProvenance({
  calculationId,
  methodologyVersion = methodology.version,
  engineVersion = methodology.calculationEngineVersion,
  regulatorySnapshot = methodology.regulatorySnapshot,
  sha256,
  className = "",
}: CalculationProvenanceProps) {
  return (
    <aside
      className={`rounded-3xl border-2 border-line bg-white p-6 shadow-xs space-y-4 ${className}`}
    >
      <div className="space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-800">
          Metodoloji & İzlenebilirlik
        </span>
        <h3 className="text-lg font-black text-ink-900">Rakamın arkasını görün.</h3>
        <p className="text-xs font-medium leading-relaxed text-ink-700">
          Bu sonuç SKDMHesapla&apos;nın versiyonlanmış hesaplama metodolojisi kullanılarak üretilmiştir.
          Kullanılan metodoloji, kaynak tarihi ve uzmanlık sorumluluğu aşağıda kayıtlıdır.
        </p>
      </div>

      <dl className="grid gap-3 text-xs sm:grid-cols-2 bg-[#f8faf9] p-4 rounded-2xl border border-line">
        <div>
          <dt className="font-bold text-ink-500">Hesaplama ID</dt>
          <dd className="font-mono font-bold text-ink-900 truncate">{calculationId}</dd>
        </div>

        <div>
          <dt className="font-bold text-ink-500">Metodoloji Sürümü</dt>
          <dd className="font-semibold text-brand-900">{methodologyVersion}</dd>
        </div>

        <div>
          <dt className="font-bold text-ink-500">Motor Sürümü</dt>
          <dd className="font-mono font-medium text-ink-800">{engineVersion}</dd>
        </div>

        <div>
          <dt className="font-bold text-ink-500">Mevzuat Snapshot Tarihi</dt>
          <dd className="font-medium text-ink-800">{regulatorySnapshot}</dd>
        </div>

        {sha256 && (
          <div className="sm:col-span-2">
            <dt className="font-bold text-ink-500">SHA-256 Bütünlük Özeti</dt>
            <dd className="font-mono text-[11px] text-ink-700 break-all bg-white p-1.5 rounded border border-line mt-0.5">
              {sha256}
            </dd>
          </div>
        )}

        <div className="sm:col-span-2 pt-2 border-t border-line/60">
          <dt className="font-bold text-ink-500">Metodoloji Sorumluluğu</dt>
          <dd className="font-semibold text-ink-900 mt-0.5">
            {credential.holder.name} — {credential.credential.name}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
        <Link
          href={methodology.canonicalUrl}
          onClick={() => track("methodology_open", { source: "calculation_provenance" })}
          className="inline-flex items-center text-brand-900 hover:text-brand-700 underline underline-offset-4"
        >
          Metodolojiyi incele →
        </Link>

        <Link
          href={credential.holder.profileUrl}
          onClick={() => track("credential_open", { placement: "calculation_provenance" })}
          className="inline-flex items-center text-ink-600 hover:text-ink-900 underline underline-offset-4"
        >
          Yetkinliği doğrula →
        </Link>

        <Link
          href={`/v/${calculationId}`}
          className="inline-flex items-center text-emerald-800 hover:text-emerald-950 underline underline-offset-4 ml-auto"
        >
          ✓ Mühür Bütünlüğü Sayfası →
        </Link>
      </div>
    </aside>
  );
}

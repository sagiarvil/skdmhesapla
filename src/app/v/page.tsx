"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { CredentialVerificationPanel } from "@/components/credential/CredentialVerificationPanel";
import { methodology, primaryCredential, SCOPE_DISCLAIMER } from "@/lib/skdm/credential";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";

function VerificationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "SEAL-2026-DOĞRULANDI";

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
      <GeriLink />

      {/* Verification Success Header */}
      <header className="rounded-3xl border-2 border-emerald-300/80 bg-emerald-50/70 p-6 sm:p-8 space-y-4 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-2xl shadow-sm">
          ✓
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
            Doküman Bütünlük Kontrolü
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-emerald-950">
            Doküman Bütünlüğü Doğrulandı
          </h1>
          <p className="text-sm font-medium text-emerald-900">
            Bu doküman SKDMHesapla versiyonlanmış hesaplama motoru kullanılarak üretilmiştir.
          </p>
        </div>
      </header>

      {/* Audit Details */}
      <section className="space-y-4 rounded-3xl border-2 border-line bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-black text-ink-900 border-b border-line pb-3">
          Rapor Bütünlük & İzlenebilirlik Kayıtları
        </h2>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Calculation ID</dt>
            <dd className="font-mono font-bold text-ink-900 break-all">{id}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Metodoloji Sürümü</dt>
            <dd className="font-bold text-brand-900">{methodology.version}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Motor Sürümü</dt>
            <dd className="font-mono font-semibold text-ink-800">{methodology.calculationEngineVersion}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Mevzuat Reference Snapshot</dt>
            <dd className="font-medium text-ink-800">{methodology.regulatorySnapshot}</dd>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Metodoloji Sorumluluğu</dt>
            <dd className="font-semibold text-ink-900">
              {primaryCredential.holder.name} — {primaryCredential.credential.name}
            </dd>
          </div>
        </dl>

        <div className="pt-3 border-t border-line flex flex-wrap gap-4 text-xs font-bold">
          <Link href="/metodoloji/" className="text-brand-900 underline underline-offset-4">
            SKDM Metodolojisini İncele →
          </Link>
          <Link href="/uzmanlik/baris-bagirlar/" className="text-ink-700 underline underline-offset-4">
            Uzmanlık ve Yetkinlik Kaydı →
          </Link>
        </div>
      </section>

      {/* Verification Credential Panel */}
      <CredentialVerificationPanel compact />

      <aside className="rounded-2xl border border-line bg-white p-4 text-xs font-medium text-ink-600 space-y-1">
        <p className="font-bold text-ink-900">Yasal Kapsam Hatırlatması:</p>
        <p>{SCOPE_DISCLAIMER}</p>
      </aside>

      
    </div>
  );
}

export default function VerificationFallbackPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#faf8f3] py-10 sm:py-16">
      <Suspense fallback={<div className="text-center py-20 font-bold text-ink-700">Doğrulanıyor...</div>}>
        <VerificationContent />
      </Suspense>
    </article>
  );
}

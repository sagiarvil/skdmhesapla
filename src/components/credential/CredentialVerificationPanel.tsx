"use client";

import { credential } from "@/lib/skdm/credential";
import { track } from "@/lib/skdm/analytics";

export function CredentialVerificationPanel({
  compact = false,
}: {
  compact?: boolean;
}) {
  const handleVerifyClick = () => {
    track("credential_verified", { credentialId: credential.id });
  };

  return (
    <section
      id="credential"
      className={`scroll-mt-24 rounded-3xl border-2 border-line bg-white shadow-xs ${
        compact ? "p-4 sm:p-6 space-y-4" : "p-6 sm:p-8 space-y-6"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-800">
            Metodoloji ve Yetkinlik Doğrulaması
          </span>
          <h2 className="text-xl font-black text-ink-900">Yetkinlik Doğrulama Panel</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Aktif Mesleki Eğitim
        </span>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="space-y-1">
          <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Belge Sahibi</dt>
          <dd className="font-extrabold text-ink-900 text-base">{credential.holder.name}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Eğitim Standardı</dt>
          <dd className="font-bold text-ink-900">{credential.credential.name}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Veren Kuruluş</dt>
          <dd className="font-semibold text-ink-800">{credential.credential.issuingOrganization}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">SKDMHesapla Rolü</dt>
          <dd className="font-bold text-brand-900">{credential.holder.role}</dd>
        </div>

        {credential.credential.credentialId && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Belge / Kayıt No</dt>
            <dd className="font-mono font-medium text-ink-700">{credential.credential.credentialId}</dd>
          </div>
        )}

        <div className="space-y-1">
          <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Eğitim Kapsamı</dt>
          <dd className="text-xs font-medium text-ink-700">
            {credential.scope.join(" • ")}
          </dd>
        </div>
      </dl>

      <aside className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs font-medium leading-relaxed text-amber-900 space-y-1">
        <p className="font-bold text-amber-950">Önemli Kapsam Notu:</p>
        <p onClick={handleVerifyClick}>{credential.disclaimer}</p>
      </aside>
    </section>
  );
}

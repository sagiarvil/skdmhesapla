"use client";

import { useState } from "react";
import { ZoomIn, X, ExternalLink } from "lucide-react";
import { credential } from "@/lib/skdm/credential";
import { track } from "@/lib/skdm/analytics";

export function CredentialVerificationPanel({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerifyClick = () => {
    track("credential_verified", { credentialId: credential.id });
  };

  const openModal = () => {
    setIsModalOpen(true);
    track("credential_open", { credentialId: credential.id, target: "certificate_modal" });
  };

  return (
    <>
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
            <h2 className="text-xl font-black text-ink-900">Yetkinlik Doğrulama Paneli</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Aktif Mesleki Eğitim
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Kompakt Sertifika Önizleme Kartı (Devasa değil, kompakt & tıklanabilir) */}
          <div className="w-full md:w-48 shrink-0 flex flex-col items-center gap-2 rounded-2xl border border-line bg-[#faf8f3] p-3 text-center">
            <div
              role="button"
              tabIndex={0}
              onClick={openModal}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openModal();
              }}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-line/80 bg-white shadow-2xs transition-all hover:shadow-md hover:border-brand-800/40"
              title="Sertifikayı tam boyut incelemek için tıklayın"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={credential.credential.certificateAsset}
                alt={`${credential.holder.name} - ${credential.credential.name} Katılım Sertifikası`}
                width={170}
                height={246}
                className="w-36 sm:w-40 h-auto object-cover transition duration-200 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/40 opacity-0 backdrop-blur-[1px] transition duration-200 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-ink-900 shadow-sm">
                  <ZoomIn className="h-3 w-3 text-brand-800" /> Büyüt
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-brand-900 bg-brand-800/10 px-2 py-0.5 rounded">
                GSO-MEM Onaylı
              </span>
              <p className="text-[11px] font-semibold text-ink-600">
                Katılım Sertifikası
              </p>
              <button
                type="button"
                onClick={openModal}
                className="text-[11px] font-bold text-brand-900 underline underline-offset-2 hover:text-brand-700"
              >
                Belgeyi İncele →
              </button>
            </div>
          </div>

          {/* Doğrulanmış Detaylar */}
          <dl className="flex-1 min-w-0 grid gap-4 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Belge Sahibi</dt>
              <dd className="font-extrabold text-ink-900 text-base">{credential.holder.name}</dd>
            </div>

            <div className="space-y-1">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">SKDMHesapla Rolü</dt>
              <dd className="font-bold text-brand-900">{credential.holder.role}</dd>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Eğitim Standardı ve Programı</dt>
              <dd className="font-bold text-ink-900 leading-snug">
                {credential.credential.officialTitle || credential.credential.name}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Veren Kuruluş</dt>
              <dd className="font-semibold text-ink-800">{credential.credential.issuingOrganization}</dd>
            </div>

            <div className="space-y-1">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Eğitim Tarihleri</dt>
              <dd className="font-semibold text-ink-800">{credential.credential.trainingDates || "21/11/2024 - 23/11/2024"}</dd>
            </div>

            {credential.credential.instructor && (
              <div className="space-y-1">
                <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Eğitmen</dt>
                <dd className="font-medium text-ink-800">{credential.credential.instructor}</dd>
              </div>
            )}

            {credential.credential.signatory && (
              <div className="space-y-1">
                <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Onaylayan Yetkili</dt>
                <dd className="font-medium text-ink-800">{credential.credential.signatory}</dd>
              </div>
            )}

            <div className="space-y-1 sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">Eğitim Kapsamı</dt>
              <dd className="text-xs font-medium text-ink-700 leading-relaxed">
                {credential.scope.join(" • ")}
              </dd>
            </div>
          </dl>
        </div>

        <aside className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs font-medium leading-relaxed text-amber-900 space-y-1">
          <p className="font-bold text-amber-950">Önemli Kapsam Notu:</p>
          <p onClick={handleVerifyClick}>{credential.disclaimer}</p>
        </aside>
      </section>

      {/* Lightbox / Büyütme Modalı */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-h-[92vh] max-w-xl w-full overflow-auto rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border-2 border-line space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-ink-900">
                  TS EN ISO 14064-1 Katılım Sertifikası
                </h3>
                <p className="text-xs text-ink-600 font-medium">
                  Gaziantep Sanayi Odası Mesleki Eğitim Merkezi (GSO-MEM)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-ink-500 hover:bg-neutral-100 hover:text-ink-900 transition"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center bg-[#faf8f3] p-2 rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={credential.credential.certificateAsset}
                alt={`${credential.holder.name} - ${credential.credential.name}`}
                className="max-h-[68vh] w-auto rounded-xl shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
              <span className="text-ink-600 font-medium">
                21/11/2024 - 23/11/2024 • Dr. Fatih BALCI
              </span>
              <a
                href={credential.credential.certificateAsset}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-brand-900 underline underline-offset-4"
              >
                Yeni Sekmede Tam Boyut <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

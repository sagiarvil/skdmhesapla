"use client";

import { useEffect } from "react";
import Link from "next/link";
import { track } from "@/lib/skdm/analytics";
import { credential } from "@/lib/skdm/credential";
import { RegulatoryUpdatesSection } from "@/components/RegulatoryUpdatesSection";

export function MethodologyTrustBar() {
  useEffect(() => {
    track("credential_impression", { placement: "homepage_trust_bar" });
  }, []);

  return (
    <>
      <section
        className="w-full bg-[#f8faf9] border-y border-line py-5 sm:py-6"
        aria-labelledby="methodology-trust-title"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-800 bg-brand-800/10 px-2 py-0.5 rounded-md">
                  Hesaplama Metodolojisi
                </span>
                <span className="text-xs font-semibold text-ink-500 hidden sm:inline">
                  • CBAM 2026 Uyumlu
                </span>
              </div>

              <h2 id="methodology-trust-title" className="text-base sm:text-lg font-black text-ink-900 leading-snug">
                Uzmanlık temelli karbon hesaplama altyapısı
              </h2>

              <p className="text-xs sm:text-sm font-medium leading-relaxed text-ink-700">
                SKDMHesapla&apos;nın karbon hesaplama altyapısı,{" "}
                <strong className="font-bold text-ink-900">
                  {credential.credential.standard}
                </strong>{" "}
                kapsamında sera gazı emisyon hesaplama eğitimi sahibi ürün sorumlusunun metodolojik gözetiminde geliştirilmektedir.
              </p>
            </div>

            <div className="flex flex-wrap items-center md:flex-col md:items-end gap-3 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-line/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-800" aria-label="Yetkinlikler">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-line shadow-2xs text-[11px]">
                  ISO 14064-1 Eğitimi
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-line shadow-2xs text-[11px]">
                  CBAM Metodolojisi
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-line shadow-2xs text-[11px]">
                  Kaynaklı Hesaplama
                </span>
              </div>

              <Link
                href={credential.holder.profileUrl}
                onClick={() => track("credential_open", { placement: "homepage_trust_bar" })}
                className="inline-flex items-center text-xs font-bold text-brand-900 hover:text-brand-700 underline underline-offset-4 group transition-colors"
              >
                Yetkinliği doğrula
                <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <RegulatoryUpdatesSection />
    </>
  );
}

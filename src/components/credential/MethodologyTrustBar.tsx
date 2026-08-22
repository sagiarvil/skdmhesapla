"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, FileCode2, ShieldCheck } from "lucide-react";
import { track } from "@/lib/skdm/analytics";
import { credential } from "@/lib/skdm/credential";

export function MethodologyTrustBar() {
  useEffect(() => {
    track("credential_impression", { placement: "homepage_trust_bar" });
  }, []);

  return (
    <section
      className="w-full border-b border-line bg-gradient-to-r from-[#f4f8f3] via-[#eef6ec] to-[#f4f8f3] py-4 sm:py-5"
      aria-labelledby="methodology-trust-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Sol: Yetkinlik & Otorite Özeti */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-800 text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-900 bg-brand-800/15 px-2 py-0.5 rounded">
                  HESAPLAMA METODOLOJİSİ
                </span>
                <span className="text-xs font-bold text-ink-600">
                  AB Resmî Tüzüğü (IR 2025/2547) &amp; {credential.credential.standard}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-medium text-ink-800 leading-snug">
                Sera gazı emisyon hesaplama eğitimi sahibi metodoloji sorumlusu gözetiminde, 10 katmanlı deterministik kurallarla geliştirilir.
              </p>
            </div>
          </div>

          {/* Sağ: Yetkinlik Rozetleri ve Doğrulama Butonu */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-line/60">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-ink-700">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-brand-800/15 px-2.5 py-1 shadow-2xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                ISO 14064-1
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-brand-800/15 px-2.5 py-1 shadow-2xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                CBAM 2026
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-brand-800/15 px-2.5 py-1 shadow-2xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Açık Formül İzi
              </span>
            </div>

            <Link
              href={credential.holder.profileUrl}
              onClick={() => track("credential_open", { placement: "homepage_trust_bar" })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-brand-800/25 px-3.5 py-1.5 text-xs font-black text-brand-900 shadow-2xs hover:bg-brand-800 hover:text-white transition group"
            >
              <span>Yetkinliği ve Kanıtı Doğrula</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

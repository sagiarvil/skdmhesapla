"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import {
  searchLexicon,
  sectorToSlug,
  type LexiconRecord,
} from "@/data/gtip-search-engine";

export default function GtipArama() {
  const [sorgu, setSorgu] = useState("");
  const [seciliRecord, setSeciliRecord] = useState<LexiconRecord | null>(null);

  const { genericGuard, matches } = searchLexicon(sorgu);

  function formatCn(cn: string) {
    const clean = cn.replace(/\s+/g, "");
    if (clean.length === 8) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)}`;
    }
    return cn;
  }

  return (
    <div className="w-full">
      {/* Üst Etiket */}
      <label
        htmlFor="gtip-arama"
        className="mb-3 block text-base font-extrabold text-ink-900 sm:text-lg"
      >
        GTİP kodunuzu veya ürününüzü yazın:
      </label>

      {/* Arama Input Çubuğu (İç Çerçeve Çizgisi Korunmuş) */}
      <div className="relative flex items-center rounded-2xl border-2 border-brand-800/30 bg-white p-2 shadow-2xl transition-all focus-within:border-brand-800 focus-within:ring-4 focus-within:ring-brand-500/25">
        <div className="pointer-events-none flex items-center pl-3 pr-2 text-brand-800">
          <Search className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <input
          id="gtip-arama"
          type="text"
          value={sorgu}
          onChange={(e) => {
            setSorgu(e.target.value);
            setSeciliRecord(null);
          }}
          placeholder="Örnek: İnşaat demiri, çelik profil, külçe alüminyum, üre gübre, cam balkon…"
          className="w-full appearance-none border-0 bg-transparent px-3 py-2 text-lg font-bold text-ink-900 shadow-none outline-none ring-0 placeholder:font-normal placeholder:text-ink-600/70 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:text-xl"
          style={{ outline: "none", boxShadow: "none", border: "none" }}
        />

        {sorgu && (
          <button
            type="button"
            onClick={() => {
              setSorgu("");
              setSeciliRecord(null);
            }}
            className="mr-2 rounded-full p-1.5 text-xs font-bold text-ink-600 hover:bg-slate-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* 1. GENERIC QUERY GUARD (Geniş Aramalar İçin Intent Yönlendirme) */}
      {genericGuard && (
        <div className="mt-3 rounded-2xl border-2 border-brand-500/50 bg-brand-100/70 p-5 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-base font-black text-brand-950">
            <HelpCircle className="h-5 w-5 text-brand-800 shrink-0" />
            <span>{genericGuard.title}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {genericGuard.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSorgu(opt.query)}
                className="rounded-xl border border-brand-800/30 bg-white px-3.5 py-2 text-sm font-bold text-ink-900 shadow-sm transition hover:bg-brand-500 hover:text-brand-950 hover:border-brand-500 hover:scale-105"
              >
                {opt.label} &rarr;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. ARAMA SONUÇLARI LİSTESİ */}
      {matches.length > 0 && !genericGuard && (
        <ul className="mt-3 divide-y divide-line rounded-2xl border-2 border-brand-800/25 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {matches.map((item) => {
            const isSelected = seciliRecord?.id === item.id;
            const slug = sectorToSlug(item.sector);
            const isCbamIn = item.cbam_scope_candidate === "IN";
            const isAmbiguous = item.cbam_scope_candidate === "AMBIGUOUS" || item.base_confidence !== "high";
            const isLikelyOut = item.cbam_scope_candidate === "LIKELY_OUT" || item.cbam_scope_candidate === "OUT";

            return (
              <li key={item.id} className="p-2">
                <div
                  className={`rounded-xl p-4 transition-all ${
                    isSelected ? "bg-brand-100/60 border border-brand-500" : "hover:bg-brand-500/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg font-black text-ink-900">
                          {item.canonical_product_tr}
                        </span>
                        {isCbamIn && (
                          <span className="rounded-md bg-accent-green/20 px-2.5 py-0.5 text-xs font-black text-ink-900 border border-accent-green/40">
                            SKDM Kapsamında
                          </span>
                        )}
                        {isLikelyOut && (
                          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-300">
                            Muhtemelen Kapsam Dışı
                          </span>
                        )}
                        {isAmbiguous && (
                          <span className="rounded-md bg-accent-yellow/25 px-2.5 py-0.5 text-xs font-black text-ink-900 border border-accent-yellow/50">
                            Teknik Detay Gerekli
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs font-medium text-ink-600">
                        Resmi Tanım: <em>{item.official_heading_summary}</em>
                      </p>
                    </div>

                    {/* CN Kodu ve Seçim Butonu */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {item.candidate_cn.length > 0 && (
                        <div className="rounded-lg bg-brand-100 px-3 py-1.5 font-mono text-sm font-black text-brand-950 border border-brand-500/30">
                          CN: {formatCn(item.candidate_cn[0])}
                        </div>
                      )}
                      
                      <Link
                        href={`/hesapla/${slug}/`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-black text-brand-950 hover:bg-brand-400 shadow-sm transition"
                      >
                        <span>Hesapla</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Ayırt Edici Sorular (Disambiguation) */}
                  {item.disambiguation_questions.length > 0 && (
                    <div className="mt-3 rounded-xl border border-brand-800/20 bg-white/80 p-3 text-xs text-ink-900 font-medium">
                      <div className="font-bold text-brand-900 flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="h-4 w-4 text-accent-yellow" />
                        <span>Ayırt Edici Sınıflandırma Kriteri:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-ink-700">
                        {item.disambiguation_questions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Hariç Kalma Uyarısı (Exclusions) */}
                  {item.exclusion_or_alt_triggers.length > 0 && (
                    <div className="mt-2 text-[11px] font-semibold text-slate-600">
                      ⚠️ Alternatif Sınıflandırma: {item.exclusion_or_alt_triggers.join(" · ")}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Alt Hukuki Uyarı */}
      <p className="mt-2.5 text-xs font-semibold text-ink-600 leading-relaxed sm:text-sm">
        💡 <strong>Bilgi Notu:</strong> Gösterilen kodlar aday niteliğindedir; nihai GTİP doğrulaması gümrük beyannameniz ve ticari faturanızla yapılmalıdır.
      </p>
    </div>
  );
}

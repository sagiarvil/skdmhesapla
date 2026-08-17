"use client";

import { useEffect, useState } from "react";
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
import { HighlightText } from "@/lib/skdm/search-highlight";
import { sihirbazAkisi } from "@/lib/skdm/siniflandirma";
import { SiniflandirmaSihirbazi } from "@/components/SiniflandirmaSihirbazi";

export default function GtipArama() {
  const [sorgu, setSorgu] = useState("");
  const [seciliRecord, setSeciliRecord] = useState<LexiconRecord | null>(null);
  const [baslangicAdim, setBaslangicAdim] = useState(0);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("sinif") === "AMB-001") {
      setSorgu("cam balkon");
      const adim = Number(p.get("adim") || "1");
      setBaslangicAdim(Number.isFinite(adim) && adim > 0 ? Math.min(adim, 3) : 1);
    }
  }, []);

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
      {matches.length > 0 && !genericGuard && (() => {
        const sihirbazlar = matches.filter((m) => sihirbazAkisi(m.id));
        const belirsiz = matches.filter(
          (m) => m.cbam_scope_candidate === "AMBIGUOUS" && !sihirbazAkisi(m.id)
        );
        const birincil = sihirbazlar.length ? sihirbazlar : belirsiz;
        const birincilId = new Set(birincil.map((m) => m.id));
        const diger = matches.filter((m) => !birincilId.has(m.id));
        const hesaplaKilit = birincil.length > 0;

        return (
          <div className="mt-3 space-y-3">
            {birincil.map((item) => {
              const akis = sihirbazAkisi(item.id);
              if (akis) {
                return (
                  <div
                    key={item.id}
                    className="rounded-[14px] border border-[#E9E4D6] bg-white p-[22px] shadow-2xl"
                  >
                    <div className="mb-1.5 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-extrabold text-[#2B2A24]">
                        <HighlightText text={item.canonical_product_tr} query={sorgu} />
                      </h3>
                      <span className="shrink-0 rounded-full bg-[#F6ECD6] px-2.5 py-1 text-xs font-bold text-[#946A1E]">
                        Sınıflandırma netleştirilmeli
                      </span>
                    </div>
                    <p className="mb-3 text-[13.5px] text-[#8C8A7C]">{akis.defTr}</p>
                    <div className="mb-3.5 flex flex-wrap items-center gap-2 text-sm">
                      <span>Olası kod:</span>
                      <span className="rounded-md bg-[#EEF1E3] px-2.5 py-0.5 font-bold text-[#4E5F35]">
                        CN {akis.cnHintCode}
                      </span>
                      <span className="text-[13px] text-[#8C8A7C]">{akis.cnHintLabel}</span>
                    </div>
                    <SiniflandirmaSihirbazi
                      akis={akis}
                      urunAdi={item.canonical_product_tr}
                      baslangicAdim={baslangicAdim}
                    />
                  </div>
                );
              }
              return (
                <div
                  key={item.id}
                  className="rounded-[14px] border border-[#E9E4D6] bg-white p-[22px] shadow-xl"
                >
                  <div className="mb-1.5 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-extrabold">{item.canonical_product_tr}</h3>
                    <span className="shrink-0 rounded-full bg-[#F6ECD6] px-2.5 py-1 text-xs font-bold text-[#946A1E]">
                      Sınıflandırma netleştirilmeli
                    </span>
                  </div>
                  <p className="text-sm text-[#5C4310]">
                    Bu ürün için doğrudan hesaplamaya geçilemez — birden fazla CN adayı var. Aşağıdaki
                    soruları gümrük müşavirinizle netleştirin.
                  </p>
                  {item.disambiguation_questions.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-700">
                      {item.disambiguation_questions.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {diger.length > 0 && (
              <ul className="divide-y divide-line rounded-2xl border-2 border-brand-800/25 bg-white p-2 shadow-lg">
                {hesaplaKilit && (
                  <li className="px-4 py-3 text-xs font-bold text-[#946A1E]">
                    Önce yukarıdaki sınıflandırmayı netleştirin — bu adaylara Hesapla açılmaz.
                  </li>
                )}
                {diger.map((item) => {
                  const isSelected = seciliRecord?.id === item.id;
                  const slug = sectorToSlug(item.sector);
                  const isCbamIn = item.cbam_scope_candidate === "IN";
                  const isAmbiguous =
                    item.cbam_scope_candidate === "AMBIGUOUS" || item.base_confidence !== "high";
                  const isLikelyOut =
                    item.cbam_scope_candidate === "LIKELY_OUT" || item.cbam_scope_candidate === "OUT";
                  return (
                    <li key={item.id} className="p-2">
                      <div
                        className={`rounded-xl p-4 ${
                          isSelected ? "border border-brand-500 bg-brand-100/60" : ""
                        }`}
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg font-black text-ink-900">
                                <HighlightText text={item.canonical_product_tr} query={sorgu} />
                              </span>
                              {isCbamIn && (
                                <span className="rounded-md border border-accent-green/40 bg-accent-green/20 px-2.5 py-0.5 text-xs font-black">
                                  SKDM Kapsamında
                                </span>
                              )}
                              {isLikelyOut && (
                                <span className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-bold">
                                  Muhtemelen Kapsam Dışı
                                </span>
                              )}
                              {isAmbiguous && (
                                <span className="rounded-md border border-accent-yellow/50 bg-accent-yellow/25 px-2.5 py-0.5 text-xs font-black">
                                  Teknik detay gerekli
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs font-medium text-ink-600">
                              Resmi Tanım:{" "}
                              <em>
                                <HighlightText text={item.official_heading_summary} query={sorgu} />
                              </em>
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2.5">
                            {item.candidate_cn.length > 0 && (
                              <div className="rounded-lg border border-brand-500/30 bg-brand-100 px-3 py-1.5 font-mono text-sm font-black">
                                CN: {formatCn(item.candidate_cn[0]!)}
                              </div>
                            )}
                            {!hesaplaKilit && (
                              <Link
                                href={`/hesapla/${slug}/`}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-black text-brand-950 hover:bg-brand-400"
                              >
                                <span>Hesapla</span>
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                        {item.disambiguation_questions.length > 0 && (
                          <div className="mt-3 rounded-xl border border-brand-800/20 bg-white/80 p-3 text-xs">
                            <div className="mb-1 flex items-center gap-1.5 font-bold text-brand-900">
                              <AlertTriangle className="h-4 w-4 text-accent-yellow" />
                              <span>Ayırt Edici Sınıflandırma Kriteri:</span>
                            </div>
                            <ul className="list-disc space-y-1 pl-4 text-ink-700">
                              {item.disambiguation_questions.map((q) => (
                                <li key={q}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })()}

      {/* Alt Hukuki Uyarı */}
      <p className="mt-2.5 text-xs font-semibold text-ink-600 leading-relaxed sm:text-sm">
        💡 <strong>Bilgi Notu:</strong> Gösterilen kodlar aday niteliğindedir; nihai GTİP doğrulaması gümrük beyannameniz ve ticari faturanızla yapılmalıdır.
      </p>
    </div>
  );
}

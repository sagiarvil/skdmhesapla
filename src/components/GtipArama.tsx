"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  FileSearch,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { searchLexicon, type LexiconRecord } from "@/data/gtip-search-engine";
import { hesaplaUrlFromLexicon, pickCnForScope, routeVerdict } from "@/lib/skdm/resolve-scope";
import { HighlightText } from "@/lib/skdm/search-highlight";
import { sihirbazAkisi } from "@/lib/skdm/siniflandirma";
import { SiniflandirmaSihirbazi } from "@/components/SiniflandirmaSihirbazi";
import { emitFunnelEvent } from "@/lib/seo/funnel-events";

const QUICK_SEARCHES = [
  "İnşaat demiri",
  "Çelik profil",
  "Alüminyum profil",
  "Üre gübre",
  "Cam balkon",
] as const;

function formatCn(cn: string) {
  const clean = cn.replace(/\s+/g, "");
  if (clean.length === 8) return `${clean.slice(0, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)}`;
  return cn;
}

function resultTone(item: LexiconRecord) {
  const ambiguous = item.cbam_scope_candidate === "AMBIGUOUS" || item.base_confidence !== "high";
  if (ambiguous) {
    return {
      card: "border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50/60 hover:border-amber-300",
      icon: "bg-amber-100 text-amber-700 ring-amber-200",
      badge: "border-amber-200 bg-amber-100 text-amber-900",
      label: "Teknik detay gerekli",
    };
  }
  if (item.cbam_scope_candidate === "IN") {
    return {
      card: "border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50/60 hover:border-emerald-300",
      icon: "bg-emerald-100 text-emerald-700 ring-emerald-200",
      badge: "border-emerald-200 bg-emerald-100 text-emerald-900",
      label: "SKDM kapsamında",
    };
  }
  return {
    card: "border-sky-200 bg-gradient-to-r from-sky-50 via-white to-slate-50 hover:border-sky-300",
    icon: "bg-sky-100 text-sky-700 ring-sky-200",
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    label: "Muhtemelen kapsam dışı",
  };
}

export default function GtipArama() {
  const [sorgu, setSorgu] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [seciliRecord, setSeciliRecord] = useState<LexiconRecord | null>(null);
  const [baslangicAdim, setBaslangicAdim] = useState(0);
  const funnelQ = useRef("");

  const { genericGuard, matches } = searchLexicon(sorgu);
  const hasQuery = sorgu.trim().length >= 2;
  const showPanel = isFocused || hasQuery;

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("sinif") === "AMB-001") {
      setSorgu("cam balkon");
      setIsFocused(true);
      const adim = Number(p.get("adim") || "1");
      setBaslangicAdim(Number.isFinite(adim) && adim > 0 ? Math.min(adim, 3) : 1);
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFocused(false);
        setSeciliRecord(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const q = sorgu.trim();
    if (q.length < 2 || q === funnelQ.current) return;
    if (!genericGuard && matches.length === 0) return;
    funnelQ.current = q;
    emitFunnelEvent("organic_scope_check_started", { q: q.slice(0, 64) });
    const rec = matches[0];
    const cn = rec ? pickCnForScope(rec.candidate_cn, q) : null;
    if (cn) emitFunnelEvent("candidate_cn_selected", { cn });
    if (rec) emitFunnelEvent("scope_result_viewed", { scope: rec.cbam_scope_candidate });
  }, [sorgu, matches, genericGuard]);

  return (
    <div className="w-full">
      <label htmlFor="gtip-arama" className="mb-2 block text-xs font-black uppercase tracking-[0.13em] text-ink-500">
        Ürün / GTİP / CN araması
      </label>

      <div className="relative">
        <div
          className={`relative flex min-h-14 items-center overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
            isFocused
              ? "border-brand-600 shadow-[0_18px_55px_rgba(20,83,45,0.18)] ring-4 ring-brand-500/10"
              : "border-slate-200 shadow-[0_12px_35px_rgba(15,23,42,0.09)] hover:border-brand-800/35"
          }`}
        >
          <div className="pointer-events-none flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-emerald-50 text-brand-800 ml-2 ring-1 ring-brand-800/10">
            <Search className="h-5 w-5" strokeWidth={2.4} />
          </div>

          <input
            id="gtip-arama"
            type="text"
            value={sorgu}
            maxLength={64}
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              setSorgu(e.target.value.slice(0, 64));
              setSeciliRecord(null);
            }}
            placeholder="Ürün adı veya GTİP yazın: örn. inşaat demiri, 7214, alüminyum profil…"
            className="min-w-0 flex-1 appearance-none border-0 bg-transparent px-4 py-3 text-[15px] font-bold text-ink-900 outline-none ring-0 placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:text-base"
          />

          <div className="mr-2 flex items-center gap-1.5">
            {sorgu ? (
              <button
                type="button"
                onClick={() => {
                  setSorgu("");
                  setSeciliRecord(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Aramayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${sorgu ? "bg-brand-800 text-white shadow-md" : "bg-slate-100 text-slate-400"}`}>
              {sorgu ? <Send className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </span>
          </div>
        </div>

        {showPanel && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_22px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {!hasQuery && (
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Hızlı örnekler
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_SEARCHES.map((quick, index) => {
                    const tone = [
                      "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
                      "border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100",
                      "border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100",
                      "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
                      "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100",
                    ][index];
                    return (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setSorgu(quick)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-black shadow-sm transition ${tone}`}
                      >
                        {quick}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-400">
                  <span>Ürün adı veya 4–8 haneli CN/GTİP yazabilirsiniz.</span>
                  <span className="hidden sm:inline">ESC ile kapat</span>
                </div>
              </div>
            )}

            {hasQuery && genericGuard && (
              <div className="p-4 sm:p-5">
                <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 ring-1 ring-violet-200">
                      <CircleHelp className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-ink-900">{genericGuard.title}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">Doğru GTİP ailesini daraltmak için bir seçeneğe dokunun.</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {genericGuard.options.map((opt, index) => {
                      const tones = [
                        "border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900",
                        "border-sky-200 hover:bg-sky-50 hover:text-sky-900",
                        "border-violet-200 hover:bg-violet-50 hover:text-violet-900",
                        "border-amber-200 hover:bg-amber-50 hover:text-amber-900",
                      ];
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setSorgu(opt.query)}
                          className={`flex items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-left text-xs font-black text-slate-700 shadow-sm transition ${tones[index % tones.length]}`}
                        >
                          <span>{opt.label}</span><ArrowRight className="h-3.5 w-3.5 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {hasQuery && !genericGuard && matches.length === 0 && (
              <div className="p-5">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200">
                    <FileSearch className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-ink-900">Eşleşen ürün bulunamadı</p>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">Ürün adını sadeleştirin veya GTİP/CN kodunun ilk 4–8 hanesini yazın.</p>
                    <Link href="/rehber/gtip-bulma/" className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-brand-900 hover:underline">
                      GTİP kodumu bulmama yardım et <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {hasQuery && !genericGuard && matches.length > 0 && (() => {
              const wizardMatches = matches.filter((m) => Boolean(sihirbazAkisi(m.id)));
              const ambiguousMatches = matches.filter((m) => m.cbam_scope_candidate === "AMBIGUOUS" && !sihirbazAkisi(m.id));
              const primary = wizardMatches.length ? wizardMatches : ambiguousMatches;
              const primaryIds = new Set(primary.map((m) => m.id));
              const secondary = matches.filter((m) => !primaryIds.has(m.id));
              const calculationLocked = primary.length > 0;

              return (
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Arama sonuçları</p>
                      <p className="mt-0.5 text-xs font-medium text-slate-400">{matches.length} eşleşme bulundu</p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-brand-900">Resmî CN mantığı</span>
                  </div>

                  <div className="space-y-3 p-3 sm:p-4">
                    {primary.map((record) => {
                      const flow = sihirbazAkisi(record.id);
                      return (
                        <div key={record.id} className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50/60 p-4 shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                              <AlertTriangle className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-black text-ink-900 sm:text-base"><HighlightText text={record.canonical_product_tr} query={sorgu} /></h3>
                                <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-900">Sınıflandırma netleştirilmeli</span>
                              </div>
                              <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{flow?.defTr || record.official_heading_summary}</p>
                              {flow ? (
                                <div className="mt-4 rounded-xl border border-amber-100 bg-white/90 p-3">
                                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                                    <span>Olası kod</span>
                                    <span className="rounded-lg bg-amber-100 px-2.5 py-1 font-mono text-amber-900">CN {flow.cnHintCode}</span>
                                    <span>{flow.cnHintLabel}</span>
                                  </div>
                                  <SiniflandirmaSihirbazi akis={flow} urunAdi={record.canonical_product_tr} baslangicAdim={baslangicAdim} />
                                </div>
                              ) : (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Link href="/rehber/gtip-bulma/" className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-black text-amber-900 hover:bg-amber-50">GTİP kodunu netleştir</Link>
                                  <Link href="/karbon-raporu/" className="rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-900 hover:bg-sky-50">Karbon verisini hazırlamaya başla</Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {secondary.map((record) => {
                      const tone = resultTone(record);
                      const cnForRoute = pickCnForScope(record.candidate_cn, sorgu);
                      const calculationHref = hesaplaUrlFromLexicon(record.candidate_cn, record.cbam_scope_candidate, record.sector, sorgu);
                      const isIn = record.cbam_scope_candidate === "IN";
                      const isLikelyOut = record.cbam_scope_candidate === "OUT" || record.cbam_scope_candidate === "LIKELY_OUT";
                      const selected = seciliRecord?.id === record.id;

                      return (
                        <div key={record.id} className={`group rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${tone.card}`}>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button type="button" onClick={() => setSeciliRecord(selected ? null : record)} className="min-w-0 flex-1 text-left">
                              <div className="flex items-start gap-3">
                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${tone.icon}`}>
                                  {isIn ? <ShieldCheck className="h-5 w-5" /> : isLikelyOut ? <FileSearch className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-sm font-black text-ink-900 sm:text-base"><HighlightText text={record.canonical_product_tr} query={sorgu} /></h3>
                                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${tone.badge}`}>{tone.label}</span>
                                  </div>
                                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-500"><HighlightText text={record.official_heading_summary} query={sorgu} /></p>
                                </div>
                              </div>
                            </button>

                            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                              {(cnForRoute || record.candidate_cn[0]) && (
                                <span className="rounded-xl border border-slate-200 bg-white/85 px-3 py-2 font-mono text-xs font-black text-slate-700 shadow-sm">CN {formatCn(cnForRoute || record.candidate_cn[0]!)}</span>
                              )}
                              {!calculationLocked && calculationHref && (
                                <Link href={calculationHref} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-800 px-3.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-brand-700">
                                  Hesapla <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              )}
                              {!calculationLocked && !calculationHref && isIn && (
                                <Link href="/rehber/gtip-bulma/" className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-black text-amber-900 hover:bg-amber-50">GTİP'i netleştir</Link>
                              )}
                            </div>
                          </div>

                          {selected && record.disambiguation_questions.length > 0 && (
                            <div className="mt-3 rounded-xl border border-white/80 bg-white/90 p-3 animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="flex items-center gap-2 text-xs font-black text-slate-700"><CircleHelp className="h-4 w-4 text-amber-600" /> Ayırt edici kontrol noktaları</div>
                              <ul className="mt-2 space-y-1.5 text-xs font-medium leading-5 text-slate-600">
                                {record.disambiguation_questions.map((question) => <li key={question}>• {question}</li>)}
                              </ul>
                            </div>
                          )}

                          {!calculationLocked && isLikelyOut && (
                            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200/70 pt-3">
                              {routeVerdict(cnForRoute ?? "").ctas.map((cta) => (
                                <Link
                                  key={cta.href}
                                  href={cta.href}
                                  className={cta.variant === "primary"
                                    ? "inline-flex items-center rounded-xl bg-sky-700 px-3 py-2 text-xs font-black text-white hover:bg-sky-600"
                                    : "inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"}
                                >
                                  {cta.labelTr}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {calculationLocked && secondary.length > 0 && (
                      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-900">
                        <AlertTriangle className="h-4 w-4 shrink-0" /> Önce yukarıdaki sınıflandırmayı netleştirin; diğer adaylarda hesaplama bu aşamada açılmaz.
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[11px] font-semibold text-slate-400 sm:px-5">
                    <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Kapsam kararı ürün adına değil CN/GTİP'e göre kesinleşir.</span>
                    <span className="hidden sm:inline">ESC ile kapat</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

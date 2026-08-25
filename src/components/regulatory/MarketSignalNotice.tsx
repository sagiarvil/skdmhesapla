import { ExternalLink, TrendingUp } from "lucide-react";
import type { MarketUpdate } from "@/lib/skdm/market-updates";
import { EUA_MARKET_SCENARIOS } from "@/lib/skdm/market-scenarios";

export function MarketSignalNotice({ update }: { update: MarketUpdate }) {
  return (
    <section className="border-b border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50" aria-labelledby="market-signal-title">
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-6 sm:py-6">
        <div className="rounded-3xl border border-amber-200 bg-white/90 p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-amber-800">
                <TrendingUp className="h-4 w-4" /> EU ETS piyasa alarmı
              </div>
              <h2 id="market-signal-title" className="mt-2 text-xl font-black tracking-tight text-ink-900 sm:text-2xl">{update.title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-ink-700">{update.summary}</p>
            </div>
            <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">{update.priority} · Piyasa sinyali</span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {EUA_MARKET_SCENARIOS.map((scenario) => (
              <div key={scenario.id} className={`rounded-xl border px-3 py-2 ${scenario.id === "central" ? "border-amber-400 bg-amber-100/70" : "border-amber-200 bg-[#fffdf8]"}`}>
                <p className="text-[10px] font-black uppercase tracking-wide text-amber-800">{scenario.label} senaryo</p>
                <p className="mt-1 text-lg font-black text-ink-900">€{scenario.priceEurPerTco2}/tCO₂</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-amber-900">SKDMHesapla etkisi</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink-700">{update.exporterImpact}</p>
            </div>
            <div className="rounded-2xl border border-line bg-[#fbfdfb] p-4">
              <p className="text-xs font-black uppercase tracking-wide text-ink-700">Metodoloji sınırı</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-ink-600">{update.authorityNote}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-900 px-4 text-xs font-black text-white hover:bg-amber-800">
              Piyasa kaynağını aç <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {update.supportingSources?.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 text-xs font-black text-amber-950 hover:bg-amber-50">
                {source.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

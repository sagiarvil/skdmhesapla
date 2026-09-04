"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Ship, ShieldCheck } from "lucide-react";
import { assessMaritimeScope, levelLabel } from "@/lib/maritime/scope";
import type { MaritimeRole } from "@/lib/maritime/types";

const roles: { value: MaritimeRole; label: string }[] = [
  { value: "gemi-sahibi", label: "Gemi sahibi" },
  { value: "ism-doc-company", label: "ISM / DOC Company" },
  { value: "gemi-isletmecisi", label: "Gemi işletmecisi" },
  { value: "charterer", label: "Charterer" },
  { value: "forwarder", label: "Forwarder / NVOCC" },
  { value: "liman-acente", label: "Liman / acente" },
  { value: "ihracatci", label: "İhracatçı" },
];

function badgeClass(level: string) {
  if (level === "critical") return "bg-red-50 text-red-800 border-red-200";
  if (level === "likely") return "bg-amber-50 text-amber-900 border-amber-200";
  if (level === "review") return "bg-sky-50 text-sky-900 border-sky-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function MaritimeScopeWizard() {
  const [role, setRole] = useState<MaritimeRole>("gemi-sahibi");
  const [grossTonnage, setGrossTonnage] = useState(5000);
  const [euPortCallsPerYear, setEuPortCallsPerYear] = useState(6);
  const [carriesCbamGoods, setCarriesCbamGoods] = useState(true);
  const [hasFuelRecords, setHasFuelRecords] = useState(false);
  const [hasVoyageRecords, setHasVoyageRecords] = useState(false);
  const [hasMonitoringPlan, setHasMonitoringPlan] = useState(false);

  const result = useMemo(() => assessMaritimeScope({
    role,
    grossTonnage,
    euPortCallsPerYear,
    carriesCbamGoods,
    hasFuelRecords,
    hasVoyageRecords,
    hasMonitoringPlan,
  }), [role, grossTonnage, euPortCallsPerYear, carriesCbamGoods, hasFuelRecords, hasVoyageRecords, hasMonitoringPlan]);

  return (
    <section className="border-b border-line bg-[#f6faf3] py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_.9fr]">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-800"><Ship className="h-5 w-5" /></span>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Ücretsiz denizcilik kapsam kontrolü</h2>
              <p className="mt-1 text-sm font-semibold text-ink-600">Ön sinyal üretir; nihai hukuki/doğrulayıcı görüş yerine geçmez.</p>
            </div>
          </div>

          <label className="block text-sm font-black text-ink-900">Firma rolü</label>
          <select value={role} onChange={(e) => setRole(e.target.value as MaritimeRole)} className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold outline-none focus:border-brand-700">
            {roles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-black text-ink-900">Gross tonnage
              <input type="number" min="0" value={grossTonnage} onChange={(e) => setGrossTonnage(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 text-sm font-bold outline-none focus:border-brand-700" />
            </label>
            <label className="block text-sm font-black text-ink-900">Yıllık AB/EEA liman uğrağı
              <input type="number" min="0" value={euPortCallsPerYear} onChange={(e) => setEuPortCallsPerYear(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 text-sm font-bold outline-none focus:border-brand-700" />
            </label>
          </div>

          <div className="mt-6 grid gap-3">
            {[
              ["CBAM kapsamlı ihracatçı yükü taşıyorum", carriesCbamGoods, setCarriesCbamGoods],
              ["Yakıt / BDN kayıtları hazır", hasFuelRecords, setHasFuelRecords],
              ["Sefer / liman uğrak kayıtları hazır", hasVoyageRecords, setHasVoyageRecords],
              ["Monitoring Plan hazır", hasMonitoringPlan, setHasMonitoringPlan],
            ].map(([label, checked, setter]) => (
              <label key={String(label)} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-sm font-bold text-ink-800">
                <input type="checkbox" checked={Boolean(checked)} onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)} className="h-4 w-4" />
                {label as string}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-brand-800/20 bg-[#071812] p-6 text-white shadow-xl sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-300">Ön sonuç</p>
              <h3 className="text-2xl font-black">{result.headline}</h3>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ["EU MRV", result.mrv],
              ["EU ETS", result.ets],
              ["FuelEU", result.fueleu],
              ["CBAM kanal", result.cbamPartnerPotential],
            ].map(([label, value]) => (
              <div key={label} className={`rounded-2xl border px-4 py-4 ${badgeClass(String(value))}`}>
                <p className="text-xs font-black uppercase tracking-[0.1em]">{label}</p>
                <p className="mt-1 text-sm font-black">{levelLabel(value as never)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm font-black"><span>Veri hazırlığı</span><span>%{result.readinessScore}</span></div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-400" style={{ width: `${result.readinessScore}%` }} /></div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-black">Eksik kanıtlar</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-300">
              {(result.missingEvidence.length ? result.missingEvidence : ["İlk kontrol için kritik eksik görünmüyor."]).map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>

          <a href="/iletisim/" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950 shadow-lg">
            Detaylı uyum analizi iste <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

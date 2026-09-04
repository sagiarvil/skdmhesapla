"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator, CircleHelp, Ship, ShieldCheck } from "lucide-react";
import { assessMaritimeScope, levelLabel, MARITIME_RULESET_REVIEWED_AT } from "@/lib/maritime/scope";
import type { MaritimePortRegion, MaritimeRole, MaritimeShipType } from "@/lib/maritime/types";

const roles: { value: MaritimeRole; label: string }[] = [
  { value: "gemi-sahibi", label: "Gemi sahibi" },
  { value: "ism-doc-company", label: "ISM / DOC Company" },
  { value: "gemi-isletmecisi", label: "Gemi işletmecisi" },
  { value: "charterer", label: "Charterer" },
  { value: "forwarder", label: "Forwarder / NVOCC" },
  { value: "liman-acente", label: "Liman / acente" },
  { value: "ihracatci", label: "İhracatçı" },
];
const shipTypes: { value: MaritimeShipType; label: string }[] = [
  { value: "cargo", label: "Yük gemisi" }, { value: "general-cargo", label: "General cargo" },
  { value: "passenger", label: "Yolcu gemisi" }, { value: "offshore", label: "Offshore gemisi" },
  { value: "other", label: "Diğer / emin değilim" },
];
const portRegions: { value: MaritimePortRegion; label: string }[] = [
  { value: "eu", label: "AB liman bağlantısı var" }, { value: "norway-iceland", label: "Norveç / İzlanda bağlantısı var" },
  { value: "none", label: "AB/AEA liman bağlantısı yok" }, { value: "unknown", label: "Emin değilim" },
];

function badgeClass(level: string) {
  if (level === "critical") return "bg-emerald-50 text-emerald-900 border-emerald-200";
  if (level === "likely") return "bg-lime-50 text-lime-900 border-lime-200";
  if (level === "review") return "bg-amber-50 text-amber-950 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}
function money(value: number) { return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value); }

export function MaritimeScopeWizard() {
  const [role, setRole] = useState<MaritimeRole>("gemi-sahibi");
  const [shipType, setShipType] = useState<MaritimeShipType>("cargo");
  const [grossTonnage, setGrossTonnage] = useState(5000);
  const [portRegion, setPortRegion] = useState<MaritimePortRegion>("eu");
  const [euPortCallsPerYear, setEuPortCallsPerYear] = useState(6);
  const [emissionsYear, setEmissionsYear] = useState(2026);
  const [carriesCbamGoods, setCarriesCbamGoods] = useState(true);
  const [hasFuelRecords, setHasFuelRecords] = useState(false);
  const [hasVoyageRecords, setHasVoyageRecords] = useState(false);
  const [hasMonitoringPlan, setHasMonitoringPlan] = useState(false);
  const [etsEmissions, setEtsEmissions] = useState("");
  const [euaPrice, setEuaPrice] = useState("");

  const result = useMemo(() => assessMaritimeScope({
    role, shipType, grossTonnage, portRegion, euPortCallsPerYear, emissionsYear, carriesCbamGoods,
    hasFuelRecords, hasVoyageRecords, hasMonitoringPlan,
    etsScopeEmissionsTco2e: etsEmissions === "" ? undefined : Number(etsEmissions),
    euaPriceEur: euaPrice === "" ? undefined : Number(euaPrice),
  }), [role, shipType, grossTonnage, portRegion, euPortCallsPerYear, emissionsYear, carriesCbamGoods, hasFuelRecords, hasVoyageRecords, hasMonitoringPlan, etsEmissions, euaPrice]);

  const decisions = [
    ["EU MRV", result.mrv, result.decisionReasons.mrv], ["EU ETS", result.ets, result.decisionReasons.ets],
    ["FuelEU", result.fueleu, result.decisionReasons.fueleu], ["CBAM kanal", result.cbamPartnerPotential, result.decisionReasons.partner],
  ] as const;

  return (
    <section className="border-b border-line bg-[#f6faf3] py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_.95fr]">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-800"><Ship className="h-5 w-5" /></span><div><h2 className="text-2xl font-black tracking-tight">Ücretsiz denizcilik kapsam kontrolü</h2><p className="mt-1 text-sm font-semibold text-ink-600">Kural seti inceleme tarihi: {MARITIME_RULESET_REVIEWED_AT}</p></div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-black">Firma rolü<select value={role} onChange={(e) => setRole(e.target.value as MaritimeRole)} className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold">{roles.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}</select></label>
            <label className="text-sm font-black">Gemi tipi<select value={shipType} onChange={(e) => setShipType(e.target.value as MaritimeShipType)} className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold">{shipTypes.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}</select></label>
            <label className="text-sm font-black">Gross tonnage<input type="number" min="0" value={grossTonnage} onChange={(e) => setGrossTonnage(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 text-sm font-bold" /></label>
            <label className="text-sm font-black">Liman / rota<select value={portRegion} onChange={(e) => setPortRegion(e.target.value as MaritimePortRegion)} className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold">{portRegions.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}</select></label>
            <label className="text-sm font-black">Yıllık AB/AEA liman uğrağı<input type="number" min="0" value={euPortCallsPerYear} onChange={(e) => setEuPortCallsPerYear(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 text-sm font-bold" /></label>
            <label className="text-sm font-black">Emisyon yılı<select value={emissionsYear} onChange={(e) => setEmissionsYear(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold"><option>2024</option><option>2025</option><option>2026</option><option>2027</option></select></label>
          </div>
          <div className="mt-6 grid gap-3">
            {[["CBAM kapsamlı ihracatçı yükü / müşterisi var", carriesCbamGoods, setCarriesCbamGoods], ["Yakıt / BDN kayıtları hazır", hasFuelRecords, setHasFuelRecords], ["Sefer / liman uğrak kayıtları hazır", hasVoyageRecords, setHasVoyageRecords], ["Monitoring Plan hazır", hasMonitoringPlan, setHasMonitoringPlan]].map(([label, checked, setter]) => <label key={String(label)} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-sm font-bold"><input type="checkbox" checked={Boolean(checked)} onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)} className="h-4 w-4" />{label as string}</label>)}
          </div>
          <div className="mt-6 rounded-2xl border border-brand-800/15 bg-brand-50/60 p-4"><div className="flex items-center gap-2 text-sm font-black"><Calculator className="h-4 w-4" /> Opsiyonel EU ETS maliyet ön tahmini</div><p className="mt-1 text-xs font-semibold leading-5 text-ink-600">Toplam filo emisyonu değil, ETS coğrafi kapsamına girdikten sonra kalan tCO2e değerini ve seçtiğiniz EUA fiyatını girin.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><input inputMode="decimal" value={etsEmissions} onChange={(e) => setEtsEmissions(e.target.value)} placeholder="ETS kapsam tCO2e" className="rounded-xl border border-line bg-white px-3 py-3 text-sm font-bold" /><input inputMode="decimal" value={euaPrice} onChange={(e) => setEuaPrice(e.target.value)} placeholder="EUA EUR/t" className="rounded-xl border border-line bg-white px-3 py-3 text-sm font-bold" /></div></div>
        </div>

        <div className="rounded-3xl border border-brand-800/20 bg-[#071812] p-6 text-white shadow-xl sm:p-8">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.14em] text-brand-300">Ön sonuç</p><h3 className="text-2xl font-black">{result.headline}</h3></div></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{decisions.map(([label, value, reason]) => <div key={label} className={`rounded-2xl border px-4 py-4 ${badgeClass(value)}`}><p className="text-xs font-black uppercase tracking-[0.1em]">{label}</p><p className="mt-1 text-sm font-black">{levelLabel(value)}</p><p className="mt-2 text-xs font-semibold leading-5 opacity-90">{reason}</p></div>)}</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">ETS phase-in</p><p className="mt-1 text-2xl font-black">%{Math.round(result.etsCoverageFactor * 100)}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Tahmini ETS maliyeti</p><p className="mt-1 text-2xl font-black">{result.estimatedEtsCostEur === null ? "Veri girin" : money(result.estimatedEtsCostEur)}</p></div></div>
          <div className="mt-6"><div className="flex justify-between text-sm font-black"><span>Veri hazırlığı</span><span>%{result.readinessScore}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-400" style={{ width: `${result.readinessScore}%` }} /></div></div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-sm font-black">Eksik kanıtlar</p><ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-300">{(result.missingEvidence.length ? result.missingEvidence : ["İlk kontrol için kritik eksik görünmüyor."]).map((item) => <li key={item}>• {item}</li>)}</ul></div>
          {result.warnings.length > 0 && <div className="mt-4 space-y-2">{result.warnings.map((w) => <div key={w} className="flex gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs font-semibold leading-5 text-amber-50"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />{w}</div>)}</div>}
          <a href="/iletisim/" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950 shadow-lg">Detaylı uyum analizi iste <ArrowRight className="h-4 w-4" /></a>
          <p className="mt-4 text-xs font-semibold leading-5 text-slate-400">Ön değerlendirmedir; hukuki görüş, yetkili makam kararı veya akredite verifier görüşü değildir.</p>
        </div>
      </div>
    </section>
  );
}

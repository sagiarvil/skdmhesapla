"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator, CircleHelp, Ship, ShieldCheck } from "lucide-react";
import { assessMaritimeScope, levelLabel, MARITIME_RULESET_REVIEWED_AT } from "@/lib/maritime/scope";
import type { MaritimePortRegion, MaritimeRole, MaritimeShipType } from "@/lib/maritime/types";

const roles: Array<[MaritimeRole, string]> = [
  ["gemi-sahibi", "Registered owner / gemi sahibi"],
  ["ism-doc-company", "ISM / DOC Company"],
  ["gemi-isletmecisi", "Gemi işletmecisi"],
  ["charterer", "Charterer"],
  ["forwarder", "Forwarder / NVOCC"],
  ["liman-acente", "Liman / acente"],
  ["ihracatci", "İhracatçı"],
];
const shipTypes: Array<[MaritimeShipType, string]> = [
  ["cargo", "Cargo ship"],
  ["general-cargo", "General cargo ship"],
  ["passenger", "Passenger ship"],
  ["offshore", "Offshore ship"],
  ["other", "Diğer / kategori net değil"],
];
const portRegions: Array<[MaritimePortRegion, string]> = [
  ["eu", "AB liman bağlantısı var"],
  ["norway-iceland", "Norveç / İzlanda bağlantısı var"],
  ["none", "AB/AEA liman bağlantısı yok"],
  ["unknown", "Henüz net değil"],
];

function badgeClass(level: string) {
  if (level === "critical") return "border-accent-green/30 bg-accent-green/10 text-white";
  if (level === "likely") return "border-brand-500/30 bg-brand-500/10 text-white";
  if (level === "review") return "border-accent-yellow/40 bg-accent-yellow/10 text-white";
  return "border-white/10 bg-white/[0.04] text-slate-200";
}
function money(value: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export function MaritimeScopeWizard() {
  const [role, setRole] = useState<MaritimeRole>("gemi-sahibi");
  const [shipType, setShipType] = useState<MaritimeShipType>("cargo");
  const [grossTonnage, setGrossTonnage] = useState(6000);
  const [portRegion, setPortRegion] = useState<MaritimePortRegion>("eu");
  const [euPortCallsPerYear, setEuPortCallsPerYear] = useState(6);
  const [emissionsYear, setEmissionsYear] = useState(2026);
  const [carriesCbamGoods, setCarriesCbamGoods] = useState(false);
  const [hasFuelRecords, setHasFuelRecords] = useState(false);
  const [hasVoyageRecords, setHasVoyageRecords] = useState(false);
  const [hasMonitoringPlan, setHasMonitoringPlan] = useState(false);
  const [hasFormalMandate, setHasFormalMandate] = useState(false);
  const [etsEmissions, setEtsEmissions] = useState("");
  const [euaPrice, setEuaPrice] = useState("");

  const result = useMemo(() => assessMaritimeScope({
    role,
    shipType,
    grossTonnage,
    portRegion,
    euPortCallsPerYear,
    emissionsYear,
    carriesCbamGoods,
    hasFuelRecords,
    hasVoyageRecords,
    hasMonitoringPlan,
    hasFormalResponsibilityMandate: role === "gemi-sahibi" ? true : hasFormalMandate,
    etsScopeEmissionsTco2e: etsEmissions === "" ? undefined : Number(etsEmissions),
    euaPriceEur: euaPrice === "" ? undefined : Number(euaPrice),
  }), [role, shipType, grossTonnage, portRegion, euPortCallsPerYear, emissionsYear, carriesCbamGoods, hasFuelRecords, hasVoyageRecords, hasMonitoringPlan, hasFormalMandate, etsEmissions, euaPrice]);

  const startHref = `/denizcilik/dosya-hazirla/?year=${emissionsYear}&role=${role}&shipType=${shipType}&gt=${grossTonnage}`;
  const decisions = [
    ["EU MRV", result.mrv, result.decisionReasons.mrv],
    ["EU ETS", result.ets, result.decisionReasons.ets],
    ["FuelEU Maritime", result.fueleu, result.decisionReasons.fueleu],
  ] as const;

  return <section className="border-b border-line bg-[#f4f7ef] py-12 sm:py-16">
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-800">Adım 1 · Kapsam motoru</span>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">Geminin hangi AB denizcilik karbon kurallarına girdiğini belirleyin.</h1>
        <p className="mt-4 text-base font-semibold leading-7 text-ink-600">Kural seti {MARITIME_RULESET_REVIEWED_AT} tarihinde resmî EU MRV, EU ETS ve FuelEU kaynaklarına göre gözden geçirilmiştir. Sonuç, tam dosya akışındaki gerekli alanları otomatik açar.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.03fr_.97fr]">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-xl sm:p-8">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-900"><Ship className="h-5 w-5" /></span><div><h2 className="text-xl font-black">Kapsam girdileri</h2><p className="mt-1 text-sm font-semibold text-ink-600">Gemi + sorumlu şirket + rota.</p></div></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-black">Firma rolü<select value={role} onChange={(e) => setRole(e.target.value as MaritimeRole)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-bold">{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="text-sm font-black">Gemi kategorisi<select value={shipType} onChange={(e) => setShipType(e.target.value as MaritimeShipType)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-bold">{shipTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="text-sm font-black">Gross Tonnage (GT)<input type="number" min="0" value={grossTonnage} onChange={(e) => setGrossTonnage(Number(e.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-line px-4 text-sm font-bold" /></label>
            <label className="text-sm font-black">Liman / rota bağlantısı<select value={portRegion} onChange={(e) => setPortRegion(e.target.value as MaritimePortRegion)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-bold">{portRegions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="text-sm font-black">Yıllık AB/AEA port call<input type="number" min="0" value={euPortCallsPerYear} onChange={(e) => setEuPortCallsPerYear(Number(e.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-line px-4 text-sm font-bold" /></label>
            <label className="text-sm font-black">Raporlama yılı<select value={emissionsYear} onChange={(e) => setEmissionsYear(Number(e.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-bold">{[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
          </div>

          {role !== "gemi-sahibi" && <label className="mt-5 flex items-start gap-3 rounded-2xl border border-accent-yellow/40 bg-accent-yellow/10 p-4 text-sm font-bold text-ink-900"><input type="checkbox" checked={hasFormalMandate} onChange={(e) => setHasFormalMandate(e.target.checked)} className="mt-1 h-4 w-4" /><span><b>Formal responsibility mandate var.</b><br /><span className="font-semibold text-ink-600">Registered owner dışındaki şirket için resmî mandate/delegation kanıtı tam dosyada istenir.</span></span></label>}

          <div className="mt-5 grid gap-3">
            <CheckRow label="Yakıt / BDN kayıtları hazır" checked={hasFuelRecords} set={setHasFuelRecords} />
            <CheckRow label="Sefer / port call kayıtları hazır" checked={hasVoyageRecords} set={setHasVoyageRecords} />
            <CheckRow label="Monitoring Plan mevcut" checked={hasMonitoringPlan} set={setHasMonitoringPlan} />
            <CheckRow label="CBAM kapsamlı ihracatçı müşterisi/yükü var" checked={carriesCbamGoods} set={setCarriesCbamGoods} />
          </div>

          <div className="mt-6 rounded-2xl border border-brand-800/15 bg-brand-100/40 p-4"><div className="flex items-center gap-2 text-sm font-black"><Calculator className="h-4 w-4" /> Opsiyonel EU ETS maliyet ön tahmini</div><p className="mt-1 text-xs font-semibold leading-5 text-ink-600">Canlı piyasa fiyatı otomatik varsayılmaz; kullanıcı EUA senaryo fiyatını girer.</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><input inputMode="decimal" value={etsEmissions} onChange={(e) => setEtsEmissions(e.target.value)} placeholder="ETS kapsam tCO₂e" className="min-h-12 rounded-xl border border-line bg-white px-3 text-sm font-bold" /><input inputMode="decimal" value={euaPrice} onChange={(e) => setEuaPrice(e.target.value)} placeholder="EUA EUR/t" className="min-h-12 rounded-xl border border-line bg-white px-3 text-sm font-bold" /></div></div>
        </div>

        <aside className="rounded-3xl border border-brand-500/20 bg-brand-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-500"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.14em] text-brand-500">Otomatik kapsam sonucu</p><h2 className="mt-1 text-xl font-black">{result.headline}</h2></div></div>
          <div className="mt-6 grid gap-3">{decisions.map(([label, value, reason]) => <div key={label} className={`rounded-2xl border p-4 ${badgeClass(value)}`}><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.1em]">{label}</p><span className="rounded-full border border-current/20 px-2.5 py-1 text-xs font-black">{levelLabel(value)}</span></div><p className="mt-2 text-sm font-semibold leading-6 opacity-90">{reason}</p></div>)}</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-400">ETS phase-in</p><p className="mt-1 text-2xl font-black">%{Math.round(result.etsCoverageFactor * 100)}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Tahmini ETS maliyeti</p><p className="mt-1 text-2xl font-black">{result.estimatedEtsCostEur === null ? "Veri girin" : money(result.estimatedEtsCostEur)}</p></div></div>
          <div className="mt-5"><div className="flex justify-between text-sm font-black"><span>İlk veri hazırlığı</span><span>%{result.readinessScore}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-brand-500" style={{ width: `${result.readinessScore}%` }} /></div></div>
          {result.missingEvidence.length > 0 && <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-sm font-black">Tam dosya için ilk eksikler</p><ul className="mt-2 space-y-1 text-sm font-semibold leading-6 text-slate-300">{result.missingEvidence.map((item) => <li key={item}>• {item}</li>)}</ul></div>}
          {result.warnings.map((warning) => <div key={warning} className="mt-3 flex gap-2 rounded-xl border border-accent-yellow/30 bg-accent-yellow/10 p-3 text-xs font-semibold leading-5 text-white"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />{warning}</div>)}
          <a href={startHref} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-base font-black text-brand-900 shadow-lg">Denizcilik dosyasını hazırla <ArrowRight className="h-5 w-5" /></a>
          <p className="mt-4 text-xs font-semibold leading-5 text-slate-400">Bu ekran kapsam ve hazırlık triyajıdır. Nihai resmî doğrulama, akredite verifier ve ilgili AB sistemleri üzerinden ayrı yürütülür.</p>
        </aside>
      </div>
    </div>
  </section>;
}

function CheckRow({ label, checked, set }: { label: string; checked: boolean; set: (value: boolean) => void }) {
  return <label className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm font-bold"><input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="h-4 w-4" />{label}</label>;
}

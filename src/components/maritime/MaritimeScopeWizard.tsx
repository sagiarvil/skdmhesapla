'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, CheckCircle2, CircleHelp, Ship, XCircle } from 'lucide-react';
import {
  evaluateMaritimeScope,
  MARITIME_RULESET_REVIEWED_AT,
  type MaritimePortRegion,
  type MaritimeShipType,
  type ScopeDecision,
} from '@/lib/maritime/scope';

const shipTypes: Array<{ value: MaritimeShipType; label: string }> = [
  { value: 'cargo', label: 'Yük gemisi' },
  { value: 'general-cargo', label: 'General cargo' },
  { value: 'passenger', label: 'Yolcu gemisi' },
  { value: 'offshore', label: 'Offshore gemisi' },
  { value: 'other', label: 'Diğer / emin değilim' },
];

const portRegions: Array<{ value: MaritimePortRegion; label: string }> = [
  { value: 'eu', label: 'AB limanına sefer / liman çağrısı var' },
  { value: 'norway-iceland', label: 'Norveç / İzlanda bağlantısı var' },
  { value: 'none', label: 'AB/AEA liman bağlantısı yok' },
  { value: 'unknown', label: 'Emin değilim' },
];

function DecisionCard({ title, decision }: { title: string; decision: ScopeDecision }) {
  const Icon = decision.status === 'yes' ? CheckCircle2 : decision.status === 'review' ? AlertTriangle : XCircle;
  const classes = decision.status === 'yes'
    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
    : decision.status === 'review'
      ? 'border-amber-200 bg-amber-50/80 text-amber-950'
      : 'border-slate-200 bg-slate-50 text-slate-800';

  return (
    <article className={`rounded-2xl border p-5 ${classes}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 shrink-0" />
        <h3 className="text-sm font-black uppercase tracking-[0.08em]">{title}</h3>
      </div>
      <p className="mt-3 text-lg font-black">{decision.label}</p>
      <p className="mt-2 text-sm font-medium leading-6 opacity-90">{decision.reason}</p>
    </article>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export function MaritimeScopeWizard() {
  const [shipType, setShipType] = useState<MaritimeShipType>('cargo');
  const [grossTonnage, setGrossTonnage] = useState('5000');
  const [portRegion, setPortRegion] = useState<MaritimePortRegion>('eu');
  const [commercialUse, setCommercialUse] = useState(true);
  const [emissionsYear, setEmissionsYear] = useState('2026');
  const [etsEmissions, setEtsEmissions] = useState('');
  const [euaPrice, setEuaPrice] = useState('');

  const result = useMemo(() => evaluateMaritimeScope({
    shipType,
    grossTonnage: Number(grossTonnage) || 0,
    portRegion,
    commercialUse,
    emissionsYear: Number(emissionsYear) || 2026,
    etsScopeEmissionsTco2e: etsEmissions === '' ? undefined : Number(etsEmissions),
    euaPriceEur: euaPrice === '' ? undefined : Number(euaPrice),
  }), [shipType, grossTonnage, portRegion, commercialUse, emissionsYear, etsEmissions, euaPrice]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <section className="rounded-3xl border border-line bg-white p-5 shadow-xl shadow-black/[0.04] sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-900"><Ship className="h-5 w-5" /></span>
          <div>
            <h2 className="text-xl font-black">2 dakikalık kapsam kontrolü</h2>
            <p className="text-xs font-bold text-ink-500">Kural seti inceleme tarihi: {MARITIME_RULESET_REVIEWED_AT}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2 text-sm font-black text-ink-900">
            Gemi tipi
            <select value={shipType} onChange={(e) => setShipType(e.target.value as MaritimeShipType)} className="min-h-12 rounded-xl border border-line bg-white px-3 font-semibold outline-none focus:border-brand-700">
              {shipTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-black text-ink-900">
            Gross Tonnage (GT)
            <input inputMode="numeric" min="0" value={grossTonnage} onChange={(e) => setGrossTonnage(e.target.value)} className="min-h-12 rounded-xl border border-line px-3 font-semibold outline-none focus:border-brand-700" />
          </label>

          <label className="grid gap-2 text-sm font-black text-ink-900">
            Liman / rota durumu
            <select value={portRegion} onChange={(e) => setPortRegion(e.target.value as MaritimePortRegion)} className="min-h-12 rounded-xl border border-line bg-white px-3 font-semibold outline-none focus:border-brand-700">
              {portRegions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-line bg-[#fbfdfb] p-3 text-sm font-black text-ink-900">
            <input type="checkbox" checked={commercialUse} onChange={(e) => setCommercialUse(e.target.checked)} className="h-4 w-4" />
            Ticari amaçlı operasyon
          </label>

          <label className="grid gap-2 text-sm font-black text-ink-900">
            Emisyon yılı
            <select value={emissionsYear} onChange={(e) => setEmissionsYear(e.target.value)} className="min-h-12 rounded-xl border border-line bg-white px-3 font-semibold outline-none focus:border-brand-700">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </label>

          <div className="rounded-2xl border border-brand-800/15 bg-brand-50/60 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-brand-950"><Calculator className="h-4 w-4" /> Opsiyonel ETS maliyet ön tahmini</div>
            <p className="mt-1 text-xs font-medium leading-5 text-ink-600">Toplam filo emisyonunu değil, ETS coğrafi kapsamına girdikten sonra kalan CO2e değerini girin.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-black text-ink-800">ETS kapsam emisyonu (tCO2e)
                <input inputMode="decimal" value={etsEmissions} onChange={(e) => setEtsEmissions(e.target.value)} placeholder="Örn. 1200" className="min-h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none focus:border-brand-700" />
              </label>
              <label className="grid gap-1.5 text-xs font-black text-ink-800">EUA fiyatı (EUR/t)
                <input inputMode="decimal" value={euaPrice} onChange={(e) => setEuaPrice(e.target.value)} placeholder="Piyasa fiyatını girin" className="min-h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none focus:border-brand-700" />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-[#071812] p-5 text-white shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.12em] text-brand-300">Ön değerlendirme</span>
            <h2 className="mt-2 text-2xl font-black">Denizcilik karbon kapsam sonucu</h2>
          </div>
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-black text-slate-200">{result.dataQuality === 'ready' ? 'Veri yeterli' : result.dataQuality === 'partial' ? 'Manuel kontrol olabilir' : 'Eksik veri'}</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <DecisionCard title="EU MRV" decision={result.mrv} />
          <DecisionCard title="EU ETS" decision={result.ets} />
          <DecisionCard title="FuelEU" decision={result.fueleu} />
        </div>

        <div className="mt-5 rounded-2xl border border-white/15 bg-white/[0.05] p-5">
          <div className="flex items-center gap-2 text-sm font-black"><Calculator className="h-4 w-4 text-brand-300" /> EU ETS maliyet maruziyeti</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Kapsama alınan oran</p>
              <p className="mt-1 text-2xl font-black">%{Math.round(result.etsCoverageFactor * 100)}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">Seçilen emisyon yılı için phase-in oranı.</p>
            </div>
            <div className="rounded-xl bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Tahmini maliyet</p>
              <p className="mt-1 text-2xl font-black">{result.estimatedEtsCostEur === null ? 'Veri girin' : currency(result.estimatedEtsCostEur)}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">EUA fiyatı canlı olarak çekilmez; sizin girdiğiniz fiyat kullanılır.</p>
            </div>
          </div>
        </div>

        {result.warnings.length > 0 && (
          <div className="mt-5 space-y-2">
            {result.warnings.map((warning) => (
              <div key={warning} className="flex items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs font-medium leading-5 text-amber-50">
                <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" /> {warning}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-xs font-medium leading-5 text-slate-300">
          Bu araç hukuki görüş veya akredite doğrulama sonucu üretmez. Amaç yanlış mevzuat yoluna girmeden kapsamı daraltmak, veri eksiğini görmek ve maliyet maruziyetini önceden hesaplamaktır.
        </div>
      </section>
    </div>
  );
}

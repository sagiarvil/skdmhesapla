"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Download, FileCheck2, Printer, ShieldCheck } from "lucide-react";
import { calculateMaritimePreparation } from "@/lib/maritime/calculator";
import { downloadPaidMaritimeJson, loadPaidMaritimeDossier, MARITIME_DOSSIER_PRICE_USD } from "@/lib/maritime/commerce-client";
import type { MaritimePreparationFile } from "@/lib/maritime/types";

type Props = { year: number; snapshotHash: string };
type PaidDossier = {
  product?: string;
  sku?: string;
  generatedAt?: string;
  snapshotHash?: string;
  transactionId?: string;
  rulesetId?: string;
  readiness?: { ready?: boolean; score?: number; missing?: string[]; warnings?: string[] };
  evidence?: { manifestHash?: string | null; chainHead?: string | null; documentCount?: number };
  file?: MaritimePreparationFile;
  legalBoundary?: string;
};

function tr(value: number, digits = 2) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: digits }).format(value);
}
function signed(value: number, digits = 0) {
  const text = tr(Math.abs(value), digits);
  return `${value >= 0 ? "+" : "−"}${text}`;
}

export function MaritimePaidDossierView({ year, snapshotHash }: Props) {
  const [dossier, setDossier] = useState<PaidDossier | null>(null);
  const [note, setNote] = useState("Satın alınan değişmez dosya yükleniyor…");

  useEffect(() => {
    let live = true;
    void loadPaidMaritimeDossier(year, snapshotHash)
      .then((x) => {
        if (!live) return;
        setDossier(x as PaidDossier);
        setNote("");
      })
      .catch((error) => live && setNote(error instanceof Error ? error.message : "Satın alınan dosya açılamadı."));
    return () => { live = false; };
  }, [snapshotHash, year]);

  const calc = useMemo(() => dossier?.file ? calculateMaritimePreparation(dossier.file) : null, [dossier]);

  if (!dossier?.file || !calc) {
    return <div className="min-h-[65vh] bg-[#f4f7ef] px-5 py-16"><div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-8"><p className="font-black">{note}</p></div></div>;
  }

  const f = dossier.file;
  const fuelVariance = calc.fuelConsumptionVariancePercent === null ? "—" : `${tr(calc.fuelConsumptionVariancePercent, 3)}%`;
  const balance = calc.fueleuComplianceBalanceGco2e === null ? "Enerji verisi yok" : `${signed(calc.fueleuComplianceBalanceGco2e, 0)} gCO₂eq`;
  const etsUnit = calc.etsGasBasis === "CO2" ? "tCO₂" : "tCO₂e";
  const etsBasisText = calc.etsGasBasis === "CO2" ? "CO₂ yalnız" : "CO₂ + CH₄ + N₂O";
  const readinessScore = dossier.readiness?.ready ? 100 : Number(dossier.readiness?.score || 0);

  return <main className="min-h-screen bg-[#f4f7ef] text-ink-900">
    <section className="bg-brand-900 px-5 py-12 text-white print:bg-white print:text-black">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.14em] text-brand-500 print:text-black">Kriptografik bütünlük mühürlü · ön doğrulama çıktısı</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">AB Denizcilik Karbon Uyum Hazırlık Dosyası</h1>
            <p className="mt-3 text-sm font-semibold text-slate-300 print:text-black">1 gemi · 1 raporlama yılı · EU MRV + EU ETS + FuelEU Maritime</p>
          </div>
          <div className="max-w-sm rounded-2xl border border-white/15 bg-white/5 p-4 text-right print:border-black">
            <p className="text-xs font-black">{dossier.readiness?.ready ? "INTERNAL 100/100 · PRE-VERIFICATION" : `INTERNAL ${readinessScore}/100 · BLOCKED`}</p>
            <p className="mt-1 break-all text-[10px] text-slate-300 print:text-black">Snapshot SHA-256: {dossier.snapshotHash || snapshotHash}</p>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-wrap gap-3 print:hidden">
        <button onClick={() => void downloadPaidMaritimeJson(year, snapshotHash)} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-900 px-5 text-sm font-black text-white"><Download className="h-4 w-4"/>Makine-okunur paket</button>
        <button onClick={() => window.print()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-black text-brand-950"><Printer className="h-4 w-4"/>Ön doğrulama raporu PDF</button>
      </div>

      <section className="rounded-3xl border border-line bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wider text-brand-800">01 · MRV fiziksel sera gazı köprüsü</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="CO₂" value={`${tr(calc.totalReportedCo2Tonnes)} tCO₂`}/>
          <Metric label="CH₄" value={`${tr(calc.totalReportedCh4Co2eTonnes)} tCO₂e`}/>
          <Metric label="N₂O" value={`${tr(calc.totalReportedN2oCo2eTonnes)} tCO₂e`}/>
          <Metric label="Toplam fiziksel GHG" value={`${tr(calc.totalReportedCo2eTonnes)} tCO₂e`}/>
        </div>
        <p className="mt-3 text-xs font-semibold text-ink-600">Toplam fiziksel GHG değeri CO₂ + CH₄ + N₂O toplamından deterministik üretilir; CO₂ değeri tCO₂e etiketiyle tekrar kullanılamaz.</p>
      </section>

      <section className="mt-5 rounded-3xl border border-line bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wider text-brand-800">02 · EU ETS kapsam ve phase-in köprüsü</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={`Kapsamdaki gaz · ${etsBasisText}`} value={`${tr(calc.etsGeographicCo2eTonnes, 3)} ${etsUnit}`}/>
          <Metric label="Phase-in" value={`%${tr(calc.etsPhaseIn * 100, 0)}`}/>
          <Metric label="Ön yükümlülük · unrounded" value={`${tr(calc.estimatedEuaObligation, 3)} ${etsUnit}`}/>
          <Metric label="Tam EUA operasyonel planlama" value={`${tr(calc.estimatedWholeEuaPlanningQuantity, 0)} EUA`}/>
        </div>
        <p className="mt-3 text-xs font-semibold text-ink-600">Tam EUA adedi yalnız operasyonel planlama için ceiling ile gösterilir. Nihai doğrulanmış emisyon ve Union Registry surrender sonucu dış düzenlenmiş süreçtedir.</p>
      </section>

      <section className="mt-5 rounded-3xl border border-line bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wider text-brand-800">03 · FuelEU deterministik enerji ve WtW hesabı</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Kapsamdaki enerji" value={`${tr(calc.fueleuEnergyMj, 0)} MJ`}/>
          <Metric label="Gerçekleşen WtW yoğunluğu" value={calc.fueleuIntensityGco2ePerMj === null ? "Enerji verisi yok" : `${tr(calc.fueleuIntensityGco2ePerMj, 4)} gCO₂e/MJ`}/>
          <Metric label="Yasal yoğunluk hedefi" value={`${tr(calc.fueleuLimitGco2ePerMj, 4)} gCO₂e/MJ`}/>
          <Metric label="Uyum bakiyesi" value={balance}/>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead><tr className="border-b border-line"><Th>Yakıt / enerji</Th><Th>Kategori</Th><Th>Scope</Th><Th>Fiziksel enerji</Th><Th>Kapsamdaki enerji</Th><Th>WtW yoğunluk</Th><Th>Enerji payı</Th></tr></thead>
            <tbody>{calc.fueleuBreakdown.map((row) => <tr key={row.fuelId} className="border-b border-line/70">
              <Td>{row.fuelType || row.fuelId}</Td><Td>{row.category}</Td><Td>{tr(row.scopeFactor * 100, 0)}%</Td><Td>{tr(row.physicalEnergyMj, 0)} MJ</Td><Td>{tr(row.scopedEnergyMj, 0)} MJ</Td><Td>{row.intensityGco2ePerMj === null ? "—" : `${tr(row.intensityGco2ePerMj, 4)} g/MJ`}</Td><Td>{tr(row.energySharePercent, 2)}%</Td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-semibold text-ink-600">Enerji payları: fosil %{tr(calc.fueleuEnergySharesPercent.fossil, 2)} · biyoyakıt %{tr(calc.fueleuEnergySharesPercent.biofuel, 2)} · RFNBO %{tr(calc.fueleuEnergySharesPercent.rfnbo, 2)} · OPS %{tr(calc.fueleuEnergySharesPercent.ops, 2)} · diğer %{tr(calc.fueleuEnergySharesPercent.other, 2)}. Toplam = %100.</p>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card title="04 · Gemi ve raporlama">
          <Line a="Gemi" b={f.ship.shipName || "—"}/><Line a="IMO" b={f.ship.imoNumber || "—"}/><Line a="Raporlama yılı" b={String(f.reportingYear)}/><Line a="Gross Tonnage" b={tr(f.ship.grossTonnage, 0)}/><Line a="Kategori" b={f.ship.officialCategory || "—"}/>
        </Card>
        <Card title="05 · Şirket ve sorumluluk">
          <Line a="Shipping company" b={f.company.companyName || "—"}/><Line a="IMO company" b={f.company.imoCompanyNumber || "—"}/><Line a="Registered owner" b={f.company.registeredOwnerName || "—"}/><Line a="Registered owner IMO" b={f.company.registeredOwnerImoNumber || "—"}/><Line a="Administering authority" b={f.company.administeringAuthority || "—"}/>
        </Card>
        <Card title="06 · Operasyonel veri ve mutabakat">
          <Line a="Voyage kaydı" b={String(f.voyages.length)}/><Line a="Fuel / energy kaydı" b={String(f.fuels.length)}/><Line a="Toplam mesafe" b={`${tr(calc.totalDistanceNm, 0)} nm`}/><Line a="Denizde süre" b={`${tr(calc.totalTimeAtSeaHours, 1)} saat`}/><Line a="Taşıma işi" b={`${tr(calc.totalTransportWorkTonneNm, 0)} tonne-nm`}/><Line a="CO₂ / transport work" b={calc.transportWorkCo2IntensityGco2PerTonneNm === null ? "—" : `${tr(calc.transportWorkCo2IntensityGco2PerTonneNm, 4)} gCO₂/tonne-nm`}/><Line a="Fuel register tüketimi" b={`${tr(calc.fuelRegisterConsumptionTonnes, 3)} t`}/><Line a="Voyage register tüketimi" b={`${tr(calc.voyageFuelConsumptionTonnes, 3)} t`}/><Line a="Yakıt mutabakat farkı" b={fuelVariance}/>
        </Card>
        <Card title="07 · Kanıt zinciri ve ruleset">
          <Line a="Evidence document" b={String(dossier.evidence?.documentCount || 0)}/><HashLine a="Manifest SHA-256" b={dossier.evidence?.manifestHash || "—"}/><HashLine a="Evidence chain head" b={dossier.evidence?.chainHead || "—"}/><Line a="Ruleset" b={dossier.rulesetId || "—"}/><Line a="İç hazırlık kapısı" b={dossier.readiness?.ready ? "100/100 · PRE-VERIFICATION READY" : "BLOCKED"}/>
        </Card>
      </div>

      {Array.isArray(dossier.readiness?.missing) && dossier.readiness!.missing!.length > 0 && <section className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-5"><h2 className="font-black">Blocking açıklar</h2><ul className="mt-3 space-y-1 text-sm font-semibold">{dossier.readiness!.missing!.map((item) => <li key={item}>• {item}</li>)}</ul></section>}

      <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm font-semibold leading-7">
        <ShieldCheck className="mr-2 inline h-4 w-4"/><b>Kapsam sınırı:</b> {dossier.legalBoundary || "Bu çıktı akredite doğrulayıcı incelemesine hazırlık dosyasıdır; resmî doğrulama görüşü, FuelEU Document of Compliance ve EUA surrender harici düzenlenmiş süreçlerdir."}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-ink-600"><FileCheck2 className="h-4 w-4"/>Aynı snapshot hash için yeniden indirme ek ücret gerektirmez. {MARITIME_DOSSIER_PRICE_USD} USD ödeme değişmez snapshot'a bağlıdır.</div>
    </section>
  </main>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-line bg-[#f8faf6] p-4"><p className="text-xs font-black uppercase tracking-wider text-ink-600">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>; }
function Card({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border border-line bg-white p-5"><h2 className="text-lg font-black">{title}</h2><div className="mt-4 space-y-2">{children}</div></section>; }
function Line({ a, b }: { a: string; b: string }) { return <div className="flex justify-between gap-4 border-b border-line/70 py-2 text-sm"><span className="font-semibold text-ink-600">{a}</span><span className="text-right font-black">{b}</span></div>; }
function HashLine({ a, b }: { a: string; b: string }) { return <div className="border-b border-line/70 py-2 text-sm"><span className="font-semibold text-ink-600">{a}</span><p className="mt-1 break-all font-mono text-[11px] font-bold">{b}</p></div>; }
function Th({ children }: { children: ReactNode }) { return <th className="px-2 py-2 font-black">{children}</th>; }
function Td({ children }: { children: ReactNode }) { return <td className="whitespace-nowrap px-2 py-2 font-semibold">{children}</td>; }
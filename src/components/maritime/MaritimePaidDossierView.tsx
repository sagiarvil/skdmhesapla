"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Download, FileCheck2, Printer, ShieldCheck } from "lucide-react";
import { calculateMaritimePreparation } from "@/lib/maritime/calculator";
import { downloadPaidMaritimeJson, loadPaidMaritimeDossier } from "@/lib/maritime/commerce-client";
import type { MaritimePreparationFile } from "@/lib/maritime/types";

type Props = { year: number; snapshotHash: string };
type PaidDossier = {
  product?: string;
  sku?: string;
  generatedAt?: string;
  snapshotHash?: string;
  transactionId?: string;
  rulesetId?: string;
  readiness?: { ready?: boolean; missing?: string[] };
  evidence?: { manifestHash?: string | null; chainHead?: string | null; documentCount?: number };
  file?: MaritimePreparationFile;
  legalBoundary?: string;
};

function tr(value: number, digits = 2) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: digits }).format(value);
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
  return <main className="min-h-screen bg-[#f4f7ef] text-ink-900">
    <section className="bg-brand-900 px-5 py-12 text-white print:bg-white print:text-black">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div><p className="text-xs font-black uppercase tracking-[.14em] text-brand-500 print:text-black">Ödeme sonrası değişmez çıktı</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">Denizcilik Karbon Uyum Hazırlık Dosyası</h1><p className="mt-3 text-sm font-semibold text-slate-300 print:text-black">1 gemi · 1 raporlama yılı · EU MRV + EU ETS + FuelEU Maritime</p></div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-right print:border-black"><p className="text-xs font-black">349 USD · tek sefer</p><p className="mt-1 max-w-[280px] break-all text-[10px] text-slate-300 print:text-black">SHA-256 {dossier.snapshotHash}</p></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-wrap gap-3 print:hidden">
        <button onClick={() => void downloadPaidMaritimeJson(year, snapshotHash)} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-900 px-5 text-sm font-black text-white"><Download className="h-4 w-4"/>Makine-okunur paket</button>
        <button onClick={() => window.print()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-black text-brand-950"><Printer className="h-4 w-4"/>Preparation report PDF</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="MRV GHG" value={`${tr(calc.totalReportedCo2eTonnes)} tCO₂e`}/>
        <Metric label="ETS geographic GHG" value={`${tr(calc.etsGeographicCo2eTonnes)} tCO₂e`}/>
        <Metric label="EUA ön yükümlülük" value={`${tr(calc.estimatedEuaObligation)} EUA`}/>
        <Metric label="FuelEU intensity" value={calc.fueleuIntensityGco2ePerMj === null ? "Enerji verisi yok" : `${tr(calc.fueleuIntensityGco2ePerMj, 3)} gCO₂e/MJ`}/>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card title="Gemi ve raporlama"><Line a="Gemi" b={f.ship.shipName || "—"}/><Line a="IMO" b={f.ship.imoNumber || "—"}/><Line a="Raporlama yılı" b={String(f.reportingYear)}/><Line a="Gross Tonnage" b={tr(f.ship.grossTonnage, 0)}/><Line a="Kategori" b={f.ship.officialCategory || "—"}/></Card>
        <Card title="Şirket ve sorumluluk"><Line a="Shipping company" b={f.company.companyName || "—"}/><Line a="IMO company" b={f.company.imoCompanyNumber || "—"}/><Line a="Registered owner" b={f.company.registeredOwnerName || "—"}/><Line a="Ülke" b={f.company.country || "—"}/></Card>
        <Card title="Veri omurgası"><Line a="Voyage kaydı" b={String(f.voyages.length)}/><Line a="Fuel / energy kaydı" b={String(f.fuels.length)}/><Line a="Ruleset" b={dossier.rulesetId || "—"}/><Line a="Transaction" b={dossier.transactionId || "—"}/></Card>
        <Card title="Kanıt zinciri"><Line a="Evidence document" b={String(dossier.evidence?.documentCount || 0)}/><Line a="Manifest hash" b={(dossier.evidence?.manifestHash || "—").slice(0, 20)}/><Line a="Chain head" b={(dossier.evidence?.chainHead || "—").slice(0, 20)}/><Line a="Hazırlık" b={dossier.readiness?.ready ? "READY FOR VERIFICATION · preparation gate" : "Gözden geçirin"}/></Card>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm font-semibold leading-7"><ShieldCheck className="mr-2 inline h-4 w-4"/><b>Kapsam sınırı:</b> {dossier.legalBoundary || "Bu çıktı hazırlık dosyasıdır; akredite doğrulama ve resmî teslim süreçleri haricidir."}</div>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-ink-600"><FileCheck2 className="h-4 w-4"/>Aynı snapshot hash için yeniden indirme ek ücret gerektirmez.</div>
    </section>
  </main>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-line bg-white p-4"><p className="text-xs font-black uppercase tracking-wider text-ink-600">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>; }
function Card({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border border-line bg-white p-5"><h2 className="text-lg font-black">{title}</h2><div className="mt-4 space-y-2">{children}</div></section>; }
function Line({ a, b }: { a: string; b: string }) { return <div className="flex justify-between gap-4 border-b border-line/70 py-2 text-sm"><span className="font-semibold text-ink-600">{a}</span><span className="text-right font-black">{b}</span></div>; }

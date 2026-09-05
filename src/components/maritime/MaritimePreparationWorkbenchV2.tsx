"use client";

import type { ComponentType, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Anchor, ArrowRight, CheckCircle2, Download, FileCheck2, Fuel, Printer, Route, ShieldCheck, Ship } from "lucide-react";
import { calculateMaritimePreparation } from "@/lib/maritime/calculator";
import { assessMaritimeReadiness } from "@/lib/maritime/readiness";
import { MARITIME_RULESET_ID, MARITIME_RULESET_REVIEWED_AT, MARITIME_SOURCES, NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS, VERIFIER_EVIDENCE_CHECKLIST } from "@/lib/maritime/regulatory";
import type { MaritimeFuelRecord, MaritimePreparationFile, MaritimeRole, MaritimeShipType, MaritimeVoyageRecord, VoyageScope } from "@/lib/maritime/types";
import { MaritimeEvidenceVault } from "./MaritimeEvidenceVault";

const STORAGE_KEY = "skdmhesapla-maritime-preparation-v2";

const roleOptions: Array<[MaritimeRole, string]> = [
  ["gemi-sahibi", "Registered owner / gemi sahibi"],
  ["ism-doc-company", "ISM / DOC Company"],
  ["gemi-isletmecisi", "Gemi işletmecisi"],
  ["charterer", "Bareboat charterer / charterer"],
];
const shipTypeOptions: Array<[MaritimeShipType, string]> = [
  ["cargo", "Cargo ship"],
  ["general-cargo", "General cargo ship"],
  ["passenger", "Passenger ship"],
  ["offshore", "Offshore ship"],
  ["other", "Other"],
];
const categoryOptions: Array<[string, string]> = [
  "Passenger ship", "Ro-ro ship", "Container ship", "Oil tanker", "Chemical tanker", "LNG carrier", "Gas carrier", "Bulk carrier", "General cargo ship", "Refrigerated cargo carrier", "Vehicle carrier", "Combination carrier", "Ro-pax ship", "Container/ro-ro cargo ship", "Other ship types",
].map((x): [string, string] => [x, x]);
const scopeOptions: Array<[VoyageScope, string]> = [
  ["intra-eu-eea", "AB/AEA ↔ AB/AEA — %100"],
  ["eu-eea-third", "AB/AEA ↔ üçüncü ülke — %50"],
  ["at-eu-eea-port", "AB/AEA liman içi / berth — %100"],
  ["outside", "AB/AEA kapsamı dışı"],
  ["excluded", "Port-of-call tanımı dışında / istisna"],
];
const sourceOptions = ["Main engines", "Auxiliary engines", "Gas turbines", "Boilers", "Inert gas generators", "Fuel cells", "Waste incinerators"];

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}
function toNumber(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function trNumber(v: number, digits = 2) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: digits }).format(v);
}
function eur(v: number | null) {
  return v === null ? "EUA fiyatı girilmedi" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
}

function newVoyage(): MaritimeVoyageRecord {
  return {
    id: uid(), departurePort: "", departureUnlocode: "", departureAt: "", arrivalPort: "", arrivalUnlocode: "", arrivalAt: "",
    scope: "eu-eea-third", portCallPurpose: "Commercial cargo/passenger", exclusionReason: "", distanceNm: 0, timeAtSeaHours: 0,
    timeAtBerthHours: 0, anchorageHours: 0, cargoTonnes: 0, passengers: 0, transportWorkTonneNm: 0, co2Tonnes: 0,
    ch4TonnesCo2e: 0, n2oTonnesCo2e: 0, fuelTonnes: 0, dataGap: false, dataGapReason: "",
  };
}
function newFuel(): MaritimeFuelRecord {
  return {
    id: uid(), scope: "eu-eea-third", portName: "", portUnlocode: "", terminalBerth: "", fuelType: "", fuelConsumer: "",
    bdnReference: "", sustainabilityCertificate: "", quantityTonnes: 0, lowerCalorificValueMjPerTonne: 0, energyMj: 0, atBerthEnergyMj: 0,
    wellToTankFactorGco2ePerMj: 0, tankToWakeCo2Factor: 0, tankToWakeCh4Factor: 0, tankToWakeN2oFactor: 0, slipFactor: 0,
    wellToWakeEmissionsGco2e: 0, opsElectricityKwh: 0, opsConnectionHours: 0, opsPeakPowerKw: 0, opsExceptionReference: "",
    zeroEmissionEnergyMj: 0, substituteEnergyMj: 0, windRewardFactor: 1, rfNboEnergyMj: 0, measurementMethod: "",
    calibrationReference: "", factorSourceReference: "",
  };
}
function initialFile(): MaritimePreparationFile {
  return {
    reportingYear: 2026,
    company: {
      companyName: "", role: "gemi-sahibi", imoCompanyNumber: "", registeredOwnerName: "", registeredOwnerImoNumber: "",
      country: "Türkiye", address: "", contactName: "", contactEmail: "", telephone: "", administeringAuthority: "",
      formalMandateReference: "", responsibilityFrom: "2026-01-01", responsibilityTo: "2026-12-31",
    },
    verifier: { verifierName: "", accreditationNumber: "", address: "", contactEmail: "" },
    ship: {
      shipName: "", imoNumber: "", portOfRegistry: "", homePort: "", flagState: "", shipType: "cargo", officialCategory: "Container ship",
      deadweightTonnes: 0, grossTonnage: 0, classificationSociety: "", iceClass: "", technicalEfficiencyType: "none",
      technicalEfficiencyValue: "", description: "",
    },
    monitoring: {
      monitoringPlanVersion: "", monitoringPlanReferenceDate: "", monitoringPlanAssessed: false, monitoringPlanApproved: false,
      revisionNotes: "", fuelMonitoringMethod: "", densityMethod: "", uncertaintyMethod: "", uncertaintyPercent: 0,
      emissionFactorMethod: "", dataGapMethod: "", voyageCompletenessProcedure: "", emissionSources: [], measurementEquipment: "",
      itSystem: "", proceduresReference: "",
    },
    voyages: [newVoyage()],
    fuels: [newFuel()],
    ice: { exclusionClaimed: false, entryUtc: "", exitUtc: "", distanceInIceNm: 0, fuelInIceTonnes: 0, totalDistanceNm: 0, evidenceReference: "" },
    flexibility: { bankingRequested: false, borrowingRequested: false, poolingPlanned: false, previousBankedSurplusReference: "", poolReference: "" },
    evidence: {},
    evidenceReferences: {},
  };
}

type TabKey = "company" | "ship" | "voyage" | "fuel" | "evidence" | "result";

export function MaritimePreparationWorkbenchV2() {
  const [file, setFile] = useState<MaritimePreparationFile>(initialFile);
  const [tab, setTab] = useState<TabKey>("company");
  const [euaPrice, setEuaPrice] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setFile(JSON.parse(stored) as MaritimePreparationFile); return; } catch { /* ignore malformed draft */ }
    }
    const q = new URLSearchParams(window.location.search);
    setFile((s) => ({
      ...s,
      reportingYear: toNumber(q.get("year") || "2026") || 2026,
      company: { ...s.company, role: (q.get("role") as MaritimeRole) || s.company.role },
      ship: { ...s.ship, shipType: (q.get("shipType") as MaritimeShipType) || s.ship.shipType, grossTonnage: toNumber(q.get("gt") || "0") },
    }));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(file));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 900);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [file]);

  useEffect(() => {
    const onEvidenceCoverage = (event: Event) => {
      const detail = (event as CustomEvent<{ coverage?: Record<string, number>; references?: Record<string, string> }>).detail;
      if (!detail?.coverage) return;
      const evidence = Object.fromEntries(Object.entries(detail.coverage).map(([key, count]) => [key, Number(count) > 0]));
      setFile((state) => ({
        ...state,
        evidence: { ...state.evidence, ...evidence },
        evidenceReferences: { ...state.evidenceReferences, ...(detail.references || {}) },
      }));
    };
    window.addEventListener("maritime-evidence-coverage", onEvidenceCoverage);
    return () => window.removeEventListener("maritime-evidence-coverage", onEvidenceCoverage);
  }, []);

  const calc = useMemo(() => calculateMaritimePreparation(file, euaPrice === "" ? undefined : Number(euaPrice)), [file, euaPrice]);
  const readiness = useMemo(() => assessMaritimeReadiness(file), [file]);

  const updateCompany = <K extends keyof MaritimePreparationFile["company"]>(key: K, value: MaritimePreparationFile["company"][K]) =>
    setFile((s) => ({ ...s, company: { ...s.company, [key]: value } }));
  const updateVerifier = <K extends keyof MaritimePreparationFile["verifier"]>(key: K, value: MaritimePreparationFile["verifier"][K]) =>
    setFile((s) => ({ ...s, verifier: { ...s.verifier, [key]: value } }));
  const updateShip = <K extends keyof MaritimePreparationFile["ship"]>(key: K, value: MaritimePreparationFile["ship"][K]) =>
    setFile((s) => ({ ...s, ship: { ...s.ship, [key]: value } }));
  const updateMonitoring = <K extends keyof MaritimePreparationFile["monitoring"]>(key: K, value: MaritimePreparationFile["monitoring"][K]) =>
    setFile((s) => ({ ...s, monitoring: { ...s.monitoring, [key]: value } }));
  const updateVoyage = <K extends keyof MaritimeVoyageRecord>(id: string, key: K, value: MaritimeVoyageRecord[K]) =>
    setFile((s) => ({ ...s, voyages: s.voyages.map((x) => x.id === id ? { ...x, [key]: value } : x) }));
  const updateFuel = <K extends keyof MaritimeFuelRecord>(id: string, key: K, value: MaritimeFuelRecord[K]) =>
    setFile((s) => ({ ...s, fuels: s.fuels.map((x) => x.id === id ? { ...x, [key]: value } : x) }));

  const exportJson = () => {
    const payload = {
      product: "SKDMhesapla Maritime Carbon Compliance Preparation File",
      ruleset: MARITIME_RULESET_ID,
      reviewedAt: MARITIME_RULESET_REVIEWED_AT,
      generatedAt: new Date().toISOString(),
      file,
      calculated: calc,
      readiness,
      sources: Object.values(MARITIME_SOURCES),
      legalBoundary: "Preparation output only; accredited verification, official Document of Compliance and EUA surrender remain external regulated processes.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${file.ship.imoNumber || "ship"}-${file.reportingYear}-maritime-preparation.json`;
    a.click();
    URL.revokeObjectURL(href);
  };

  const tabs: Array<[TabKey, string, string]> = [
    ["company", "01", "Şirket & sorumluluk"], ["ship", "02", "Gemi & plan"], ["voyage", "03", "Sefer"],
    ["fuel", "04", "Yakıt & enerji"], ["evidence", "05", "Kanıt & verifier"], ["result", "06", "Kontrol & çıktı"],
  ];

  return <div className="min-h-screen bg-[#f4f7ef] text-ink-900">
    <div className="print:hidden">
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="absolute inset-0 opacity-10" aria-hidden style={{ backgroundImage: "url('/desen/guilloche-mesh-koyu.svg')", backgroundSize: "900px" }} />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-brand-500"><Anchor className="h-4 w-4" /> 1 gemi · 1 raporlama yılı</div>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Denizcilik Karbon Uyum Hazırlık Dosyası</h1>
              <p className="mt-2 text-sm font-black text-brand-500">Maritime Carbon Compliance Preparation File · EU MRV + EU ETS + FuelEU Maritime</p>
              <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-slate-300">Gemi, şirket, sefer, yakıt, enerji ve verifier kanıtlarını tek dosyada toplayın. Kritik alanlar kapanmadan sistem hazırlık statüsünü READY durumuna taşımaz.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Ruleset</p><p className="mt-1 text-sm font-black text-brand-500">{MARITIME_RULESET_ID}</p><p className="mt-1 text-xs text-slate-400">{saved ? "Taslak kaydedildi" : "Otomatik taslak aktif"}</p></div>
          </div>
        </div>
      </section>

      <nav className="sticky top-20 z-20 border-b border-line bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 sm:px-6">{tabs.map(([key, no, label]) => <button key={key} onClick={() => setTab(key)} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-black ${tab === key ? "bg-brand-900 text-white" : "border border-line bg-white text-ink-600"}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${tab === key ? "bg-brand-500 text-brand-900" : "bg-brand-100 text-brand-900"}`}>{no}</span>{label}</button>)}</div></nav>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          {tab === "company" && <Panel icon={ShieldCheck} eyebrow="Responsibility chain" title="Shipping company ve registered owner">
            <Grid>
              <Field label="Shipping company adı" value={file.company.companyName} set={(v) => updateCompany("companyName", v)} required />
              <Select label="Company role" value={file.company.role} set={(v) => updateCompany("role", v as MaritimeRole)} options={roleOptions} />
              <Field label="IMO Unique Company & Registered Owner ID" value={file.company.imoCompanyNumber} set={(v) => updateCompany("imoCompanyNumber", v)} required />
              <Field label="Registered owner adı" value={file.company.registeredOwnerName} set={(v) => updateCompany("registeredOwnerName", v)} required />
              <Field label="Registered owner IMO ID" value={file.company.registeredOwnerImoNumber} set={(v) => updateCompany("registeredOwnerImoNumber", v)} required />
              <Field label="Country" value={file.company.country} set={(v) => updateCompany("country", v)} required />
              <Field label="Contact person" value={file.company.contactName} set={(v) => updateCompany("contactName", v)} required />
              <Field label="E-mail" type="email" value={file.company.contactEmail} set={(v) => updateCompany("contactEmail", v)} required />
              <Field label="Telephone" value={file.company.telephone} set={(v) => updateCompany("telephone", v)} required />
              <Field label="Administering Authority" value={file.company.administeringAuthority} set={(v) => updateCompany("administeringAuthority", v)} />
              <Field label="Responsibility from" type="date" value={file.company.responsibilityFrom} set={(v) => updateCompany("responsibilityFrom", v)} required />
              <Field label="Responsibility to" type="date" value={file.company.responsibilityTo} set={(v) => updateCompany("responsibilityTo", v)} />
              <div className="sm:col-span-2"><Field label="Address" value={file.company.address} set={(v) => updateCompany("address", v)} required /></div>
              {file.company.role !== "gemi-sahibi" && <div className="sm:col-span-2"><Field label="Formal mandate / delegation reference" value={file.company.formalMandateReference} set={(v) => updateCompany("formalMandateReference", v)} required /></div>}
            </Grid>
          </Panel>}

          {tab === "ship" && <Panel icon={Ship} eyebrow="Ship identity + Monitoring Plan" title="Gemi kimliği ve izleme planı">
            <Grid>
              <Field label="Ship name" value={file.ship.shipName} set={(v) => updateShip("shipName", v)} required />
              <Field label="IMO ship number" value={file.ship.imoNumber} set={(v) => updateShip("imoNumber", v)} required />
              <Field label="Port of registry" value={file.ship.portOfRegistry} set={(v) => updateShip("portOfRegistry", v)} required />
              <Field label="Home port" value={file.ship.homePort} set={(v) => updateShip("homePort", v)} />
              <Field label="Flag State" value={file.ship.flagState} set={(v) => updateShip("flagState", v)} required />
              <Select label="Scope ship type" value={file.ship.shipType} set={(v) => updateShip("shipType", v as MaritimeShipType)} options={shipTypeOptions} />
              <Select label="Official ship category" value={file.ship.officialCategory} set={(v) => updateShip("officialCategory", v)} options={categoryOptions} />
              <NumberField label="Gross Tonnage" value={file.ship.grossTonnage} set={(v) => updateShip("grossTonnage", v)} />
              <NumberField label="Deadweight tonnes" value={file.ship.deadweightTonnes} set={(v) => updateShip("deadweightTonnes", v)} />
              <Field label="Classification Society" value={file.ship.classificationSociety} set={(v) => updateShip("classificationSociety", v)} />
              <Field label="Ice class" value={file.ship.iceClass} set={(v) => updateShip("iceClass", v)} />
              <Select label="Technical efficiency" value={file.ship.technicalEfficiencyType} set={(v) => updateShip("technicalEfficiencyType", v as MaritimePreparationFile["ship"]["technicalEfficiencyType"])} options={[["none", "N/A"], ["EEDI", "EEDI"], ["EEXI", "EEXI"], ["EIV", "EIV"]]} />
              <Field label="EEDI / EEXI / EIV value" value={file.ship.technicalEfficiencyValue} set={(v) => updateShip("technicalEfficiencyValue", v)} />
              <div className="sm:col-span-2"><Field label="Ship description" value={file.ship.description} set={(v) => updateShip("description", v)} /></div>
            </Grid>
            <div className="my-7 border-t border-line" />
            <Grid>
              <Field label="Monitoring Plan version" value={file.monitoring.monitoringPlanVersion} set={(v) => updateMonitoring("monitoringPlanVersion", v)} required />
              <Field label="Reference date" type="date" value={file.monitoring.monitoringPlanReferenceDate} set={(v) => updateMonitoring("monitoringPlanReferenceDate", v)} required />
              <Field label="Fuel monitoring method" value={file.monitoring.fuelMonitoringMethod} set={(v) => updateMonitoring("fuelMonitoringMethod", v)} required />
              <Field label="Density determination method" value={file.monitoring.densityMethod} set={(v) => updateMonitoring("densityMethod", v)} />
              <Field label="Uncertainty procedure" value={file.monitoring.uncertaintyMethod} set={(v) => updateMonitoring("uncertaintyMethod", v)} required />
              <NumberField label="Uncertainty (%)" value={file.monitoring.uncertaintyPercent} set={(v) => updateMonitoring("uncertaintyPercent", v)} />
              <Field label="Emission factor method/source" value={file.monitoring.emissionFactorMethod} set={(v) => updateMonitoring("emissionFactorMethod", v)} required />
              <Field label="Measurement equipment" value={file.monitoring.measurementEquipment} set={(v) => updateMonitoring("measurementEquipment", v)} />
              <div className="sm:col-span-2"><Field label="Voyage completeness procedure" value={file.monitoring.voyageCompletenessProcedure} set={(v) => updateMonitoring("voyageCompletenessProcedure", v)} required /></div>
              <div className="sm:col-span-2"><Field label="Data-gap / surrogate-data procedure" value={file.monitoring.dataGapMethod} set={(v) => updateMonitoring("dataGapMethod", v)} required /></div>
              <Field label="IT / data-flow system" value={file.monitoring.itSystem} set={(v) => updateMonitoring("itSystem", v)} />
              <Field label="Procedures reference" value={file.monitoring.proceduresReference} set={(v) => updateMonitoring("proceduresReference", v)} required />
              <div className="sm:col-span-2"><Field label="Revision notes" value={file.monitoring.revisionNotes} set={(v) => updateMonitoring("revisionNotes", v)} /></div>
            </Grid>
            <p className="mt-5 text-sm font-black">On-board emission sources</p>
            <div className="mt-2 flex flex-wrap gap-2">{sourceOptions.map((source) => <Check key={source} label={source} checked={file.monitoring.emissionSources.includes(source)} set={(checked) => updateMonitoring("emissionSources", checked ? [...file.monitoring.emissionSources, source] : file.monitoring.emissionSources.filter((x) => x !== source))} />)}</div>
            <div className="mt-4 flex flex-wrap gap-2"><Check label="Monitoring Plan verifier assessed" checked={file.monitoring.monitoringPlanAssessed} set={(v) => updateMonitoring("monitoringPlanAssessed", v)} /><Check label="Monitoring Plan approval durumu işlenmiş" checked={file.monitoring.monitoringPlanApproved} set={(v) => updateMonitoring("monitoringPlanApproved", v)} /></div>
          </Panel>}

          {tab === "voyage" && <Panel icon={Route} eyebrow="Voyage register" title="Sefer ve port-call veri defteri">
            {file.voyages.map((voyage, index) => <div key={voyage.id} className="mb-5 rounded-2xl border border-line bg-[#f8faf6] p-4">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-black">Sefer {index + 1}</h3><button onClick={() => setFile((s) => ({ ...s, voyages: s.voyages.filter((x) => x.id !== voyage.id) }))} className="text-xs font-black text-ink-600">Kaldır</button></div>
              <Grid>
                <Field label="Departure port" value={voyage.departurePort} set={(v) => updateVoyage(voyage.id, "departurePort", v)} required />
                <Field label="Departure UN/LOCODE" value={voyage.departureUnlocode} set={(v) => updateVoyage(voyage.id, "departureUnlocode", v)} required />
                <Field label="Departure UTC" type="datetime-local" value={voyage.departureAt} set={(v) => updateVoyage(voyage.id, "departureAt", v)} required />
                <Field label="Arrival port" value={voyage.arrivalPort} set={(v) => updateVoyage(voyage.id, "arrivalPort", v)} required />
                <Field label="Arrival UN/LOCODE" value={voyage.arrivalUnlocode} set={(v) => updateVoyage(voyage.id, "arrivalUnlocode", v)} required />
                <Field label="Arrival UTC" type="datetime-local" value={voyage.arrivalAt} set={(v) => updateVoyage(voyage.id, "arrivalAt", v)} required />
                <div className="sm:col-span-2"><Select label="EU geographic scope" value={voyage.scope} set={(v) => updateVoyage(voyage.id, "scope", v as VoyageScope)} options={scopeOptions} /></div>
                <Field label="Port-call purpose" value={voyage.portCallPurpose} set={(v) => updateVoyage(voyage.id, "portCallPurpose", v)} required />
                <Field label="Exclusion reason" value={voyage.exclusionReason} set={(v) => updateVoyage(voyage.id, "exclusionReason", v)} />
                <NumberField label="Distance (nm)" value={voyage.distanceNm} set={(v) => updateVoyage(voyage.id, "distanceNm", v)} />
                <NumberField label="Time at sea (h)" value={voyage.timeAtSeaHours} set={(v) => updateVoyage(voyage.id, "timeAtSeaHours", v)} />
                <NumberField label="Time at berth (h)" value={voyage.timeAtBerthHours} set={(v) => updateVoyage(voyage.id, "timeAtBerthHours", v)} />
                <NumberField label="Anchorage (h)" value={voyage.anchorageHours} set={(v) => updateVoyage(voyage.id, "anchorageHours", v)} />
                <NumberField label="Cargo (t)" value={voyage.cargoTonnes} set={(v) => updateVoyage(voyage.id, "cargoTonnes", v)} />
                <NumberField label="Passengers" value={voyage.passengers} set={(v) => updateVoyage(voyage.id, "passengers", v)} />
                <NumberField label="Transport work (t·nm)" value={voyage.transportWorkTonneNm} set={(v) => updateVoyage(voyage.id, "transportWorkTonneNm", v)} />
                <NumberField label="Fuel consumed (t)" value={voyage.fuelTonnes} set={(v) => updateVoyage(voyage.id, "fuelTonnes", v)} />
                <NumberField label="CO₂ (t)" value={voyage.co2Tonnes} set={(v) => updateVoyage(voyage.id, "co2Tonnes", v)} />
                <NumberField label="CH₄ (tCO₂e)" value={voyage.ch4TonnesCo2e} set={(v) => updateVoyage(voyage.id, "ch4TonnesCo2e", v)} />
                <NumberField label="N₂O (tCO₂e)" value={voyage.n2oTonnesCo2e} set={(v) => updateVoyage(voyage.id, "n2oTonnesCo2e", v)} />
              </Grid>
              <div className="mt-4"><Check label="Data gap / surrogate data kullanıldı" checked={voyage.dataGap} set={(v) => updateVoyage(voyage.id, "dataGap", v)} />{voyage.dataGap && <div className="mt-3"><Field label="Data-gap circumstances and method" value={voyage.dataGapReason} set={(v) => updateVoyage(voyage.id, "dataGapReason", v)} required /></div>}</div>
            </div>)}
            <button onClick={() => setFile((s) => ({ ...s, voyages: [...s.voyages, newVoyage()] }))} className="min-h-12 rounded-xl border border-brand-900 px-4 text-sm font-black text-brand-900">+ Sefer ekle</button>
          </Panel>}

          {tab === "fuel" && <Panel icon={Fuel} eyebrow="FuelEU energy register" title="Yakıt, BDN, OPS ve WtW veri defteri">
            {file.fuels.map((fuel, index) => <div key={fuel.id} className="mb-5 rounded-2xl border border-line bg-[#f8faf6] p-4">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-black">Yakıt / enerji {index + 1}</h3><button onClick={() => setFile((s) => ({ ...s, fuels: s.fuels.filter((x) => x.id !== fuel.id) }))} className="text-xs font-black text-ink-600">Kaldır</button></div>
              <Grid>
                <div className="sm:col-span-2"><Select label="FuelEU geographic scope" value={fuel.scope} set={(v) => updateFuel(fuel.id, "scope", v as VoyageScope)} options={scopeOptions} /></div>
                <Field label="Fuel / energy type" value={fuel.fuelType} set={(v) => updateFuel(fuel.id, "fuelType", v)} required />
                <Field label="Fuel consumer / conversion system" value={fuel.fuelConsumer} set={(v) => updateFuel(fuel.id, "fuelConsumer", v)} required />
                <Field label="BDN reference" value={fuel.bdnReference} set={(v) => updateFuel(fuel.id, "bdnReference", v)} />
                <Field label="Sustainability / fuel certificate" value={fuel.sustainabilityCertificate} set={(v) => updateFuel(fuel.id, "sustainabilityCertificate", v)} />
                <NumberField label="Quantity (t)" value={fuel.quantityTonnes} set={(v) => updateFuel(fuel.id, "quantityTonnes", v)} />
                <NumberField label="LCV (MJ/t)" value={fuel.lowerCalorificValueMjPerTonne} set={(v) => updateFuel(fuel.id, "lowerCalorificValueMjPerTonne", v)} />
                <NumberField label="Energy (MJ)" value={fuel.energyMj} set={(v) => updateFuel(fuel.id, "energyMj", v)} />
                <NumberField label="At-berth energy (MJ)" value={fuel.atBerthEnergyMj} set={(v) => updateFuel(fuel.id, "atBerthEnergyMj", v)} />
                <NumberField label="WtT factor (gCO₂e/MJ)" value={fuel.wellToTankFactorGco2ePerMj} set={(v) => updateFuel(fuel.id, "wellToTankFactorGco2ePerMj", v)} />
                <NumberField label="TtW CO₂ factor" value={fuel.tankToWakeCo2Factor} set={(v) => updateFuel(fuel.id, "tankToWakeCo2Factor", v)} />
                <NumberField label="TtW CH₄ factor" value={fuel.tankToWakeCh4Factor} set={(v) => updateFuel(fuel.id, "tankToWakeCh4Factor", v)} />
                <NumberField label="TtW N₂O factor" value={fuel.tankToWakeN2oFactor} set={(v) => updateFuel(fuel.id, "tankToWakeN2oFactor", v)} />
                <NumberField label="CSlip (%)" value={fuel.slipFactor} set={(v) => updateFuel(fuel.id, "slipFactor", v)} />
                <NumberField label="Prepared WtW total (gCO₂e)" value={fuel.wellToWakeEmissionsGco2e} set={(v) => updateFuel(fuel.id, "wellToWakeEmissionsGco2e", v)} />
                <Field label="Measurement method" value={fuel.measurementMethod} set={(v) => updateFuel(fuel.id, "measurementMethod", v)} required />
                <Field label="Factor source/reference" value={fuel.factorSourceReference} set={(v) => updateFuel(fuel.id, "factorSourceReference", v)} required />
                <Field label="Calibration reference" value={fuel.calibrationReference} set={(v) => updateFuel(fuel.id, "calibrationReference", v)} />
                <NumberField label="RFNBO energy (MJ)" value={fuel.rfNboEnergyMj} set={(v) => updateFuel(fuel.id, "rfNboEnergyMj", v)} />
                <NumberField label="Zero-emission energy (MJ)" value={fuel.zeroEmissionEnergyMj} set={(v) => updateFuel(fuel.id, "zeroEmissionEnergyMj", v)} />
                <NumberField label="Substitute energy (MJ)" value={fuel.substituteEnergyMj} set={(v) => updateFuel(fuel.id, "substituteEnergyMj", v)} />
                <NumberField label="Wind reward factor" value={fuel.windRewardFactor} set={(v) => updateFuel(fuel.id, "windRewardFactor", v)} />
                <Field label="OPS port" value={fuel.portName} set={(v) => updateFuel(fuel.id, "portName", v)} />
                <Field label="OPS port UN/LOCODE" value={fuel.portUnlocode} set={(v) => updateFuel(fuel.id, "portUnlocode", v)} />
                <Field label="Terminal / berth" value={fuel.terminalBerth} set={(v) => updateFuel(fuel.id, "terminalBerth", v)} />
                <NumberField label="OPS electricity (kWh)" value={fuel.opsElectricityKwh} set={(v) => updateFuel(fuel.id, "opsElectricityKwh", v)} />
                <NumberField label="OPS connection hours" value={fuel.opsConnectionHours} set={(v) => updateFuel(fuel.id, "opsConnectionHours", v)} />
                <NumberField label="OPS peak power (kW)" value={fuel.opsPeakPowerKw} set={(v) => updateFuel(fuel.id, "opsPeakPowerKw", v)} />
                <div className="sm:col-span-2"><Field label="OPS exception reference" value={fuel.opsExceptionReference} set={(v) => updateFuel(fuel.id, "opsExceptionReference", v)} /></div>
              </Grid>
            </div>)}
            <button onClick={() => setFile((s) => ({ ...s, fuels: [...s.fuels, newFuel()] }))} className="min-h-12 rounded-xl border border-brand-900 px-4 text-sm font-black text-brand-900">+ Yakıt / enerji ekle</button>
            <div className="mt-6 rounded-2xl border border-line bg-[#f8faf6] p-4"><p className="font-black">FuelEU flexibility / ice preparation</p><div className="mt-3 flex flex-wrap gap-2"><Check label="Ice exclusion claimed" checked={file.ice.exclusionClaimed} set={(v) => setFile((s) => ({ ...s, ice: { ...s.ice, exclusionClaimed: v } }))} /><Check label="Banking planned" checked={file.flexibility.bankingRequested} set={(v) => setFile((s) => ({ ...s, flexibility: { ...s.flexibility, bankingRequested: v } }))} /><Check label="Borrowing planned" checked={file.flexibility.borrowingRequested} set={(v) => setFile((s) => ({ ...s, flexibility: { ...s.flexibility, borrowingRequested: v } }))} /><Check label="Pooling planned" checked={file.flexibility.poolingPlanned} set={(v) => setFile((s) => ({ ...s, flexibility: { ...s.flexibility, poolingPlanned: v } }))} /></div>{file.ice.exclusionClaimed && <div className="mt-4"><Grid><Field label="Ice entry UTC" type="datetime-local" value={file.ice.entryUtc} set={(v) => setFile((s) => ({ ...s, ice: { ...s.ice, entryUtc: v } }))} /><Field label="Ice exit UTC" type="datetime-local" value={file.ice.exitUtc} set={(v) => setFile((s) => ({ ...s, ice: { ...s.ice, exitUtc: v } }))} /><NumberField label="Distance in ice (nm)" value={file.ice.distanceInIceNm} set={(v) => setFile((s) => ({ ...s, ice: { ...s.ice, distanceInIceNm: v } }))} /><NumberField label="Total voyage distance (nm)" value={file.ice.totalDistanceNm} set={(v) => setFile((s) => ({ ...s, ice: { ...s.ice, totalDistanceNm: v } }))} /><NumberField label="Fuel in ice (t)" value={file.ice.fuelInIceTonnes} set={(v) => setFile((s) => ({ ...s, ice: { ...s.ice, fuelInIceTonnes: v } }))} /><Field label="Ice evidence reference" value={file.ice.evidenceReference} set={(v) => setFile((s) => ({ ...s, ice: { ...s.ice, evidenceReference: v } }))} /></Grid></div>}</div>
          </Panel>}

          {tab === "evidence" && <Panel icon={FileCheck2} eyebrow="Evidence vault" title="Binary belge, checksum ve verifier kanıt zinciri">
            <MaritimeEvidenceVault />
            <div className="mt-6 rounded-2xl border border-line bg-[#f8faf6] p-4"><h3 className="font-black">Accredited verifier identity</h3><Grid><Field label="Verifier name" value={file.verifier.verifierName} set={(v) => updateVerifier("verifierName", v)} /><Field label="Accreditation number" value={file.verifier.accreditationNumber} set={(v) => updateVerifier("accreditationNumber", v)} /><Field label="Verifier e-mail" value={file.verifier.contactEmail} set={(v) => updateVerifier("contactEmail", v)} /><Field label="Verifier address" value={file.verifier.address} set={(v) => updateVerifier("address", v)} /></Grid></div>
          </Panel>}

          {tab === "result" && <Panel icon={CheckCircle2} eyebrow="Preparation release gate" title="Hesap ve verifier-ready hazırlık çıktısı">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="MRV GHG" value={`${trNumber(calc.totalReportedCo2eTonnes)} tCO₂e`} /><Metric label="ETS geographic GHG" value={`${trNumber(calc.etsGeographicCo2eTonnes)} tCO₂e`} /><Metric label="EUA ön yükümlülük" value={`${trNumber(calc.estimatedEuaObligation)} EUA`} /><Metric label="FuelEU intensity pre-check" value={calc.fueleuIntensityGco2ePerMj === null ? "Enerji verisi gerekli" : `${trNumber(calc.fueleuIntensityGco2ePerMj, 3)} gCO₂e/MJ`} /></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-line bg-[#f8faf6] p-4"><label className="text-sm font-black">EUA scenario price (EUR/t)</label><input value={euaPrice} onChange={(e) => setEuaPrice(e.target.value)} inputMode="decimal" className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 font-bold" /><p className="mt-3 text-2xl font-black">{eur(calc.estimatedEtsCostEur)}</p><p className="mt-1 text-xs text-ink-600">ETS phase-in %{Math.round(calc.etsPhaseIn * 100)}</p></div><div className="rounded-2xl border border-line bg-[#f8faf6] p-4"><p className="text-sm font-black">FuelEU limit · {file.reportingYear}</p><p className="mt-3 text-2xl font-black">{trNumber(calc.fueleuLimitGco2ePerMj, 3)} gCO₂e/MJ</p><p className="mt-1 text-xs text-ink-600">Included energy {trNumber(calc.fueleuEnergyMj, 0)} MJ · RFNBO {trNumber(calc.rfNboEnergyMj, 0)} MJ · OPS {trNumber(calc.opsElectricityKwh, 0)} kWh</p></div></div>
            <div className="mt-5 rounded-2xl border border-line p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-brand-800">Internal readiness</p><p className="mt-1 text-3xl font-black">%{readiness.score}</p></div><span className="rounded-full bg-brand-100 px-3 py-1.5 text-xs font-black text-brand-900">{readiness.blocking.length ? `${readiness.blocking.length} kritik açık` : "READY FOR VERIFICATION · preparation gate"}</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-brand-100"><div className="h-full bg-brand-500" style={{ width: `${readiness.score}%` }} /></div>{readiness.blocking.length > 0 && <ul className="mt-4 grid gap-2 sm:grid-cols-2">{readiness.blocking.map((x) => <li key={x} className="rounded-xl border border-line bg-[#f8faf6] p-3 text-sm font-semibold">{x}</li>)}</ul>}</div>
            <div className="mt-5 flex flex-wrap gap-3"><button onClick={exportJson} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-900 px-5 text-sm font-black text-white"><Download className="h-4 w-4" />Makine-okunur paket</button><button onClick={() => window.print()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-black text-brand-900"><Printer className="h-4 w-4" />Preparation report PDF</button></div>
            <p className="mt-4 text-xs font-semibold leading-6 text-ink-600">Bu çıktı hazırlık ve evidence-readiness çıktısıdır. Accredited verification, official MRV/FuelEU Document of Compliance, administering-authority kararı ve EUA surrender değildir.</p>
          </Panel>}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start"><div className="rounded-3xl border border-line bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-wider text-brand-800">Dosya hazırlığı</p><span className="text-2xl font-black">%{readiness.score}</span></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-brand-100"><div className="h-full bg-brand-500" style={{ width: `${readiness.score}%` }} /></div><p className="mt-3 text-sm font-semibold leading-6 text-ink-600">{readiness.blocking.length ? `${readiness.blocking.length} kritik alan/kanıt açık.` : "İç hazırlık kapıları tamamlandı."}</p><button onClick={() => setTab("result")} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-900 text-sm font-black text-brand-900">Kontrole git <ArrowRight className="h-4 w-4" /></button></div><div className="rounded-3xl bg-brand-900 p-5 text-white"><p className="text-xs font-black uppercase tracking-wider text-brand-500">Special port watch</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-300">Neighbouring container transhipment port listesi port-of-call sınıflamasını etkileyebilir.</p>{NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS.map((p) => <div key={p.name} className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs font-black">{p.name} · {p.country}</div>)}</div></aside>
      </main>
    </div>

    <article className="hidden bg-white p-8 text-black print:block"><p className="text-xs font-bold">SKDMHESAPLA.COM · DENİZCİLİK KARBON UYUM</p><h1 className="mt-2 text-2xl font-black">Denizcilik Karbon Uyum Hazırlık Dosyası</h1><p className="mt-1 text-sm font-bold">Maritime Carbon Compliance Preparation File · EU MRV + EU ETS + FuelEU Maritime</p><p className="mt-2 text-xs">Ruleset {MARITIME_RULESET_ID} · reviewed {MARITIME_RULESET_REVIEWED_AT}</p><div className="mt-6 grid grid-cols-2 gap-4 text-sm"><PrintValue label="Ship" value={`${file.ship.shipName} · IMO ${file.ship.imoNumber}`} /><PrintValue label="Shipping company" value={file.company.companyName} /><PrintValue label="MRV GHG" value={`${trNumber(calc.totalReportedCo2eTonnes)} tCO₂e`} /><PrintValue label="EUA obligation" value={`${trNumber(calc.estimatedEuaObligation)} EUA`} /><PrintValue label="FuelEU pre-check" value={calc.fueleuIntensityGco2ePerMj === null ? "-" : `${trNumber(calc.fueleuIntensityGco2ePerMj, 3)} gCO₂e/MJ`} /><PrintValue label="Readiness" value={`%${readiness.score}`} /></div><h2 className="mt-6 border-b border-black pb-2 font-black">Open preparation items</h2><ul className="mt-3 space-y-1 text-xs">{readiness.blocking.map((x) => <li key={x}>• {x}</li>)}</ul><h2 className="mt-6 border-b border-black pb-2 font-black">Evidence manifest</h2><table className="mt-3 w-full border-collapse text-left text-xs"><thead><tr><th className="border p-2">Evidence</th><th className="border p-2">Status</th><th className="border p-2">Reference</th></tr></thead><tbody>{VERIFIER_EVIDENCE_CHECKLIST.map((e) => <tr key={e.key}><td className="border p-2">{e.label}</td><td className="border p-2">{file.evidence[e.key] ? "YES" : "OPEN"}</td><td className="border p-2">{file.evidenceReferences[e.key] || "-"}</td></tr>)}</tbody></table><p className="mt-6 border-t border-black pt-4 text-[10px] leading-4">LEGAL BOUNDARY: Preparation and evidence-readiness output only. It is not accredited verification, an official Document of Compliance or proof of EUA surrender.</p></article>
  </div>;
}

function Panel({ icon: Icon, eyebrow, title, children }: { icon: ComponentType<{ className?: string }>; eyebrow: string; title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-900"><Icon className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-widest text-brand-800">{eyebrow}</p><h2 className="mt-1 text-2xl font-black tracking-tight">{title}</h2></div></div>{children}</section>;
}
function Grid({ children }: { children: ReactNode }) { return <div className="grid gap-4 sm:grid-cols-2">{children}</div>; }
function Field({ label, value, set, type = "text", required = false }: { label: string; value: string; set: (v: string) => void; type?: string; required?: boolean }) { return <label className="block text-sm font-black">{label}{required && <span className="ml-1 text-brand-800">*</span>}<input type={type} value={value} onChange={(e) => set(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-3 text-sm font-bold outline-none focus:border-brand-800" /></label>; }
function NumberField({ label, value, set }: { label: string; value: number; set: (v: number) => void }) { return <label className="block text-sm font-black">{label}<input type="number" step="any" value={value} onChange={(e) => set(toNumber(e.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-3 text-sm font-bold outline-none focus:border-brand-800" /></label>; }
function Select({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: ReadonlyArray<readonly [string, string]> }) { return <label className="block text-sm font-black">{label}<select value={value} onChange={(e) => set(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-3 text-sm font-bold">{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>; }
function Check({ label, checked, set }: { label: string; checked: boolean; set: (v: boolean) => void }) { return <label className="flex items-start gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-bold"><input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="mt-0.5 h-4 w-4" />{label}</label>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-line bg-[#f8faf6] p-4"><p className="text-xs font-black uppercase tracking-wider text-ink-600">{label}</p><p className="mt-2 text-xl font-black tabular-nums">{value}</p></div>; }
function PrintValue({ label, value }: { label: string; value: string }) { return <div><b>{label}</b><div>{value || "-"}</div></div>; }

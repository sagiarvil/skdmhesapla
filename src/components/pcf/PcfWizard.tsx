"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FieldHelp } from "@/components/fieldhelp/FieldHelp";
import { GeriLink } from "@/components/nav/GeriLink";
import { FlowViewport } from "@/components/navigation/FlowViewport";
import { SealModal } from "@/components/seal/SealModal";
import { PackageDownloads } from "@/components/seal/PackageDownloads";
import { getField } from "@/lib/skdm/fieldhelp";
import { newSessionId } from "@/lib/skdm/session-store";
import { calculatePcf } from "@/lib/pcf/calculator";
import { createPcfSealedPackage } from "@/lib/pcf/package-seal";
import { PCF_SEALED_PACKAGE_FILE_COUNT } from "@/lib/pcf/package-manifest";
import type { PcfFuelInput, PcfInput, PcfSupplierFactor } from "@/lib/pcf/types";
import { stableScrollToField, queueStableScrollToField } from "@/lib/ui/stable-scroll";
import {
  PcfMaterialRegister,
  emptyPcfMaterialDraft,
  newPcfMaterialDraft,
  type PcfMaterialDraft,
} from "./PcfMaterialRegister";

const PCF_FINDING_FIELD: Record<string, string> = {
  PCF_COMPANY: "pcfCompanyName",
  PCF_FACILITY: "pcfFacilityName",
  PCF_PRODUCT: "pcfProductName",
  PCF_FUNCTIONAL_UNIT: "pcfFunctionalUnit",
  PCF_PERIOD: "pcfPeriodStart",
  PCF_PRODUCTION_ZERO: "pcfProductionQty",
  PCF_ALLOCATION_SHARE: "pcfAllocationShare",
  PCF_ALLOCATION_METHOD: "pcfAllocationMethod",
  PCF_ELECTRICITY_CONNECTION_UNKNOWN: "pcfElectricityKwh",
};

function pcfFieldStep(fieldId: string): number {
  if (
    fieldId.startsWith("pcfCompany") ||
    fieldId.startsWith("pcfFacility") ||
    fieldId.startsWith("pcfProduct") ||
    fieldId === "pcfFunctionalUnit" ||
    fieldId === "pcfBuyerName" ||
    fieldId === "pcfCnCode"
  ) {
    return 1;
  }
  if (
    fieldId === "pcfProductionQty" ||
    fieldId.startsWith("pcfAllocation") ||
    fieldId.startsWith("pcfPeriod")
  ) {
    return 2;
  }
  return 4;
}

const STEPS = ["Başlangıç", "Firma ve ürün", "Üretim ve tahsis", "Malzemeler", "Enerji", "Kontrol ve rapor"] as const;

const FIELD_IDS = [
  "pcfCompanyName",
  "pcfFacilityName",
  "pcfBuyerName",
  "pcfProductName",
  "pcfCnCode",
  "pcfFunctionalUnit",
  "pcfPeriodStart",
  "pcfPeriodEnd",
  "pcfProductionQty",
  "pcfAllocationShare",
  "pcfAllocationMethod",
  "pcfElectricityKwh",
] as const;

type FieldId = (typeof FIELD_IDS)[number];

type FuelDraft = {
  id: string;
  fuelId: string;
  label: string;
  quantity: number;
  unit: "Nm3" | "litre" | "kg_fuel";
};

const DEFAULT_FIELDS: Record<FieldId, string> = {
  pcfCompanyName: "",
  pcfFacilityName: "",
  pcfBuyerName: "",
  pcfProductName: "",
  pcfCnCode: "",
  pcfFunctionalUnit: "1 adet",
  pcfPeriodStart: "2026-01-01",
  pcfPeriodEnd: "2026-12-31",
  pcfProductionQty: "",
  pcfAllocationShare: "1",
  pcfAllocationMethod: "Kütle bazlı tahsis; tek ürün hattında %100 tahsis",
  pcfElectricityKwh: "",
};

function supplierFactorFromDraft(row: PcfMaterialDraft): PcfSupplierFactor | undefined {
  const value = Number(row.supplierFactorValue);
  if (!(value >= 0) || !row.supplierFactorValue.trim()) return undefined;
  return {
    valueKgCo2ePerKg: value,
    sourceTitle: row.supplierSourceTitle,
    sourceDocumentId: row.supplierDocumentId,
    issuedAt: row.supplierIssuedAt,
    thirdPartyVerified: row.supplierThirdPartyVerified,
    boundary: "cradle-to-gate",
    evidenceRef: row.supplierEvidenceRef,
  };
}

function dateStamp() {
  const d = new Date();
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function PcfWizard({ sectorSlug }: { sectorSlug?: string }) {
  const search = useSearchParams();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<Record<FieldId, string>>(DEFAULT_FIELDS);
  const [materials, setMaterials] = useState<PcfMaterialDraft[]>([emptyPcfMaterialDraft("MAT-1")]);
  const [packaging, setPackaging] = useState<PcfMaterialDraft[]>([]);
  const [connectionType, setConnectionType] = useState<"distribution" | "transmission" | "unknown">("unknown");
  const [fuels, setFuels] = useState<FuelDraft[]>([]);
  const [productionEvidence, setProductionEvidence] = useState(false);
  const [electricityEvidence, setElectricityEvidence] = useState(false);
  const [fuelEvidence, setFuelEvidence] = useState(false);
  const [materialEvidenceCount, setMaterialEvidenceCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [reportId, setReportId] = useState("PCF-PENDING");
  const [createdAt, setCreatedAt] = useState("1970-01-01T00:00:00.000Z");
  const [sealModalOpen, setSealModalOpen] = useState(false);
  const [sealBusy, setSealBusy] = useState(false);
  const [sealedName, setSealedName] = useState<string | null>(null);
  const [sealedHash, setSealedHash] = useState<string | undefined>();

  const storageKey = `skdmhesapla:pcf-draft:v1:${sectorSlug || "generic"}`;

  useEffect(() => {
    if (hydrated) return;
    const cn = search.get("cn");
    const product = search.get("urun");
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const d = JSON.parse(raw) as {
          step?: number;
          fields?: Record<FieldId, string>;
          materials?: PcfMaterialDraft[];
          packaging?: PcfMaterialDraft[];
          connectionType?: "distribution" | "transmission" | "unknown";
          fuels?: FuelDraft[];
          productionEvidence?: boolean;
          electricityEvidence?: boolean;
          fuelEvidence?: boolean;
          materialEvidenceCount?: number;
          sessionId?: string;
          reportId?: string;
          createdAt?: string;
        };
        if (d.fields) setFields({ ...DEFAULT_FIELDS, ...d.fields });
        if (Array.isArray(d.materials) && d.materials.length) setMaterials(d.materials);
        if (Array.isArray(d.packaging)) setPackaging(d.packaging);
        if (d.connectionType) setConnectionType(d.connectionType);
        if (Array.isArray(d.fuels)) setFuels(d.fuels);
        if (typeof d.step === "number") setStep(Math.min(5, Math.max(0, d.step)));
        setProductionEvidence(Boolean(d.productionEvidence));
        setElectricityEvidence(Boolean(d.electricityEvidence));
        setFuelEvidence(Boolean(d.fuelEvidence));
        setMaterialEvidenceCount(Math.max(0, Number(d.materialEvidenceCount) || 0));
        if (d.sessionId) setSessionId(d.sessionId);
        if (d.reportId) setReportId(d.reportId);
        if (d.createdAt) setCreatedAt(d.createdAt);
      }
    } catch (err) {
      console.warn("pcf-draft-read", err);
    }
    setFields((prev) => ({
      ...prev,
      pcfCnCode: cn || prev.pcfCnCode,
      pcfProductName: product || prev.pcfProductName,
    }));
    setSessionId((prev) => prev || newSessionId());
    setReportId((prev) =>
      prev && prev !== "PCF-PENDING"
        ? prev
        : `PCF-${dateStamp()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    );
    setCreatedAt((prev) => (prev && prev !== "1970-01-01T00:00:00.000Z" ? prev : new Date().toISOString()));
    setHydrated(true);
  }, [hydrated, search, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    const payload = {
      step,
      fields,
      materials,
      packaging,
      connectionType,
      fuels,
      productionEvidence,
      electricityEvidence,
      fuelEvidence,
      materialEvidenceCount,
      sessionId,
      reportId,
      createdAt,
    };
    const t = window.setTimeout(() => localStorage.setItem(storageKey, JSON.stringify(payload)), 500);
    return () => window.clearTimeout(t);
  }, [hydrated, step, fields, materials, packaging, connectionType, fuels, productionEvidence, electricityEvidence, fuelEvidence, materialEvidenceCount, storageKey, sessionId, reportId, createdAt]);

  const input: PcfInput = useMemo(() => {
    const fuelInputs: PcfFuelInput[] = fuels.map((f) => ({
      id: f.id,
      fuelId: f.fuelId,
      label: f.label,
      quantityForPeriod: f.quantity,
      activityUnit: f.unit,
      geography: "TR",
    }));
    return {
      reportId,
      createdAt,
      companyName: fields.pcfCompanyName.trim(),
      facilityName: fields.pcfFacilityName.trim(),
      country: "TR",
      buyerName: fields.pcfBuyerName.trim() || undefined,
      productName: fields.pcfProductName.trim(),
      cnCode: fields.pcfCnCode.trim() || undefined,
      reportingPeriodStart: fields.pcfPeriodStart,
      reportingPeriodEnd: fields.pcfPeriodEnd,
      functionalUnit: fields.pcfFunctionalUnit.trim(),
      productionQuantityForPeriod: Number(fields.pcfProductionQty) || 0,
      allocationShare: Number(fields.pcfAllocationShare),
      allocationMethod: fields.pcfAllocationMethod.trim(),
      materials: materials.map((m) => ({
        id: m.id,
        materialId: m.materialId,
        label: m.label || m.materialId,
        quantityKgPerFunctionalUnit: m.quantityKgPerFunctionalUnit,
        origin: m.origin,
        supplierFactor: supplierFactorFromDraft(m),
      })),
      packaging: packaging.map((m) => ({
        id: m.id,
        materialId: m.materialId,
        label: m.label || m.materialId,
        quantityKgPerFunctionalUnit: m.quantityKgPerFunctionalUnit,
        origin: m.origin,
        supplierFactor: supplierFactorFromDraft(m),
      })),
      electricity: Number(fields.pcfElectricityKwh) > 0
        ? {
            consumptionKwhForPeriod: Number(fields.pcfElectricityKwh),
            connectionType,
            geography: "TR",
          }
        : undefined,
      fuels: fuelInputs,
      evidence: {
        productionRecord: productionEvidence,
        electricityInvoice: electricityEvidence,
        fuelInvoice: fuelEvidence,
        materialEvidenceCount,
      },
    };
  }, [fields, materials, packaging, fuels, connectionType, productionEvidence, electricityEvidence, fuelEvidence, materialEvidenceCount, reportId, createdAt]);

  const result = useMemo(() => calculatePcf(input), [input]);

  const field = (id: FieldId) => {
    const cfg = getField(id);
    if (!cfg) {
      return (
        <div className="rounded-2xl border border-accent-yellow/50 bg-accent-yellow/10 p-4 text-sm font-semibold text-ink-900">
          {id} yardım tanımı tamamlanmalıdır.
        </div>
      );
    }
    return (
      <FieldHelp
        id={id}
        cfg={cfg}
        value={fields[id]}
        onChange={(_, value) => setFields((prev) => ({ ...prev, [id]: value }))}
      />
    );
  };

  const downloadSealed = async (transactionId: string) => {
    if (result.status === "blocked" || !sessionId) return;
    setSealBusy(true);
    try {
      const pkg = createPcfSealedPackage(input, result, { sessionId, createdAt });
      const res = await fetch("/api/seal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.packageId,
          sessionId,
          paddleTransactionId: transactionId,
          packageType: "PCF_SEAL_PACKAGE_9900",
          workflowType: "pcf",
          resultStatus: result.status,
          masterHash: pkg.masterHash,
          manifesto: pkg.manifesto,
          zipFilename: pkg.zipFilename,
          files: pkg.files.map((f) => ({
            filename: f.filename,
            mimeType: f.mimeType,
            sizeBytes: f.sizeBytes,
            sha256: f.sha256,
          })),
        }),
      });
      if (!res.ok) return;
      const copy = new Uint8Array(pkg.zipBytes.byteLength);
      copy.set(pkg.zipBytes);
      const blob = new Blob([copy], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pkg.zipFilename;
      a.click();
      URL.revokeObjectURL(url);
      setSealedName(pkg.zipFilename);
      setSealedHash(pkg.masterHash);
    } finally {
      setSealBusy(false);
      setSealModalOpen(false);
    }
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(5, s + 1));

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-5 py-8 sm:px-6 sm:py-12">
      <GeriLink />
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Karbon raporu</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Alıcınıza göndereceğiniz ürün karbon raporunu hazırlayın.</h1>
        <p className="max-w-3xl text-base font-medium leading-relaxed text-ink-700">
          Siz yalnız fabrikanızdaki gerçek verileri girin. Emisyon faktörlerini, kaynak künyelerini ve kalite durumunu sistem yönetir. Bu akış SKDM raporu değildir.
        </p>
      </header>

      <nav aria-label="Karbon raporu adımları" className="overflow-x-auto rounded-2xl border border-line bg-white p-2">
        <ol className="flex min-w-max gap-2 text-xs font-bold">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button type="button" onClick={() => setStep(i)} className={`rounded-xl px-3 py-2 ${i === step ? "bg-brand-800 text-white" : "text-ink-700 hover:bg-brand-100"}`} aria-current={i === step ? "step" : undefined}>
                {i}. {label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div id="pcf-start" data-scroll-target>
      <FlowViewport activeKey={step}>
      {step === 0 && (
        <section className="rounded-3xl border-2 border-brand-800/20 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold text-ink-900">Tek hedef: alıcıya gönderilebilir tek PDF.</h2>
          <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-ink-700">
            <li>✓ Mevzuat seçmeniz gerekmez.</li>
            <li>✓ Genel emisyon faktörü girmeniz gerekmez.</li>
            <li>✓ Kaynağı veya kapsamı net olmayan faktör kullanılırsa sistem kesin sonuç üretmez.</li>
            <li>✓ Tedarikçinizden EPD/PCF varsa ilgili malzeme satırına ekleyebilirsiniz.</li>
          </ul>
          <div className="mt-6 flex justify-end"><button type="button" onClick={next} className="rounded-2xl bg-brand-800 px-6 py-3 font-bold text-white">Raporu hazırlamaya başla →</button></div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-ink-900">Firma ve ürün</h2>
          {field("pcfCompanyName")}
          {field("pcfFacilityName")}
          {field("pcfBuyerName")}
          {field("pcfProductName")}
          {field("pcfCnCode")}
          {field("pcfFunctionalUnit")}
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-ink-900">Üretim dönemi ve tahsis</h2>
          {field("pcfPeriodStart")}
          {field("pcfPeriodEnd")}
          {field("pcfProductionQty")}
          {field("pcfAllocationShare")}
          {field("pcfAllocationMethod")}
        </section>
      )}

      {step === 3 && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-ink-900">Ürünün malzemeleri</h2>
            <p className="mt-2 text-sm font-medium text-ink-700">Miktarı fonksiyonel birim başına kg olarak girin. Örneğin 1 adet ürün 4,2 kg alüminyum içeriyorsa 4,2 yazın.</p>
            <div className="mt-4"><PcfMaterialRegister rows={materials} onChange={setMaterials} /></div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-ink-900">Ambalaj</h3>
            <p className="mt-2 text-sm font-medium text-ink-700">Ürünle birlikte alıcıya giden ambalajı ekleyin.</p>
            <div className="mt-4"><PcfMaterialRegister kind="packaging" rows={packaging} onChange={setPackaging} /></div>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-extrabold text-ink-900">Tesis enerjisi</h2>
          {field("pcfElectricityKwh")}
          <fieldset className="rounded-3xl border-2 border-line bg-white p-5">
            <legend className="px-2 text-base font-bold text-ink-900">Elektrik bağlantı tipi</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {(["distribution", "transmission", "unknown"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold">
                  <input type="radio" name="connection" value={v} checked={connectionType === v} onChange={() => setConnectionType(v)} />
                  {v === "distribution" ? "Dağıtım" : v === "transmission" ? "İletim" : "Bilmiyorum"}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border-2 border-line bg-white p-5">
            <legend className="px-2 text-base font-bold text-ink-900">Yakıtlar</legend>
            <p className="mb-4 text-sm font-medium text-ink-700">Yakıt kullanmıyorsanız boş bırakın. Sistem yalnız güncel kaynaklı faktör bulunduğunda hesaplar.</p>
            <div className="space-y-3">
              {fuels.map((fuel, i) => (
                <div key={fuel.id} className="grid gap-2 rounded-2xl border border-line p-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
                  <select className="min-h-[44px] rounded-xl border border-line bg-white px-3" value={fuel.fuelId} onChange={(e) => { const next = [...fuels]; const id = e.target.value; const label = id === "natural-gas" ? "Doğalgaz" : id === "diesel" ? "Dizel" : id === "lpg" ? "LPG" : "Yakıt"; next[i] = { ...fuel, fuelId: id, label, unit: id === "natural-gas" ? "Nm3" : "litre" }; setFuels(next); }} aria-label={`${fuel.label || "yakıt"} türü`}>
                    <option value="">Yakıt seçin</option>
                    <option value="natural-gas">Doğalgaz</option>
                    <option value="diesel">Dizel</option>
                    <option value="lpg">LPG</option>
                  </select>
                  <input type="number" min="0" step="0.001" className="min-h-[44px] rounded-xl border border-line px-3" value={fuel.quantity || ""} onChange={(e) => { const next = [...fuels]; next[i] = { ...fuel, quantity: Math.max(0, Number(e.target.value) || 0) }; setFuels(next); }} aria-label={`${fuel.label || "yakıt"} miktarı`} />
                  <select className="min-h-[44px] rounded-xl border border-line bg-white px-3" value={fuel.unit} onChange={(e) => { const next = [...fuels]; next[i] = { ...fuel, unit: e.target.value as FuelDraft["unit"] }; setFuels(next); }} aria-label={`${fuel.label || "yakıt"} birimi`}>
                    <option value="Nm3">Nm³</option>
                    <option value="litre">litre</option>
                    <option value="kg_fuel">kg</option>
                  </select>
                  <button type="button" className="rounded-xl border border-line px-3 py-2 font-semibold" onClick={() => setFuels(fuels.filter((_, j) => j !== i))}>Kaldır</button>
                </div>
              ))}
            </div>
            <button type="button" className="mt-4 rounded-xl border-2 border-brand-800 px-4 py-2 text-sm font-bold text-brand-800" onClick={() => setFuels([...fuels, { id: `F-${crypto.randomUUID().slice(0, 8)}`, fuelId: "natural-gas", label: "Doğalgaz", quantity: 0, unit: "Nm3" }])}>+ Yakıt ekle</button>
          </fieldset>
        </section>
      )}

      {step === 5 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-extrabold text-ink-900">Kontrol ve rapor</h2>
          <fieldset className="rounded-3xl border-2 border-line bg-white p-5">
            <legend className="px-2 text-base font-bold text-ink-900">Kanıtlar</legend>
            <div className="mt-3 grid gap-3 text-sm font-semibold sm:grid-cols-2">
              <label className="flex items-center gap-2"><input type="checkbox" checked={productionEvidence} onChange={(e) => setProductionEvidence(e.target.checked)} /> Üretim kaydı mevcut</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={electricityEvidence} onChange={(e) => setElectricityEvidence(e.target.checked)} /> Elektrik faturası / sayaç kaydı mevcut</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={fuelEvidence} onChange={(e) => setFuelEvidence(e.target.checked)} /> Yakıt faturası / sayaç kaydı mevcut</label>
              <label className="flex items-center gap-2">Malzeme kanıt adedi <input type="number" min="0" className="w-24 rounded-xl border border-line px-3 py-2" value={materialEvidenceCount} onChange={(e) => setMaterialEvidenceCount(Math.max(0, Number(e.target.value) || 0))} aria-label="Malzeme kanıt adedi" /></label>
            </div>
          </fieldset>

          <div className="rounded-3xl border-2 border-brand-800/20 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Rapor statüsü</p>
                <h3 className="mt-1 text-2xl font-extrabold text-ink-900">
                  {result.status === "buyer_ready" ? "Alıcıya gönderime hazır" : result.status === "estimated" ? "Tahmini ürün karbon raporu" : "Tamamlanması gereken alanlar var"}
                </h3>
              </div>
              {result.status !== "blocked" && (
                <div className="rounded-2xl bg-brand-100 px-5 py-3 text-right">
                  <div className="text-xs font-bold text-ink-600">Toplam</div>
                  <div className="font-mono text-xl font-black text-brand-950">{result.totalKgCo2ePerFunctionalUnit.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} kg CO₂e / {input.functionalUnit}</div>
                </div>
              )}
            </div>
            <div className="mt-5 space-y-2">
              {result.findings.map((f, i) => {
                const fieldId = PCF_FINDING_FIELD[f.code];
                return (
                <div key={`${f.code}-${i}`} className="rounded-xl border border-line bg-neutral-50 p-3 text-sm font-medium text-ink-800">
                  <strong>{f.severity === "blocking" ? "Tamamlanmalı" : f.severity === "warning" ? "Gözden geçirin" : "Not"}:</strong> {f.messageTr}
                  {fieldId ? (
                    <button
                      type="button"
                      className="mt-2 block text-xs font-bold text-brand-800 underline"
                      onClick={() => {
                        const targetStep = pcfFieldStep(fieldId);
                        if (step === targetStep) {
                          void stableScrollToField(fieldId, {
                            behavior: "smooth",
                            timeoutMs: 1800,
                          });
                          return;
                        }
                        queueStableScrollToField(fieldId, {
                          behavior: "smooth",
                          timeoutMs: 1800,
                        });
                        setStep(targetStep);
                      }}
                    >
                      Bu alanı düzelt
                    </button>
                  ) : null}
                </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                data-testid="pcf-seal-cta"
                disabled={result.status === "blocked" || sealBusy || !sessionId}
                onClick={() => setSealModalOpen(true)}
                className="rounded-2xl bg-brand-800 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Karbon Raporunu Mühürle & Paketi İndir
              </button>
              <button type="button" onClick={() => setStep(1)} className="rounded-2xl border-2 border-brand-800 px-6 py-3 font-bold text-brand-800">Verileri gözden geçir</button>
            </div>
            <p className="mt-3 text-xs font-medium text-ink-600">
              Veri girişi ve ön kontrol ücretsizdir. Ücret yalnızca nihai mühürlü paketi oluşturup indirmek istediğinizde alınır.
            </p>
            {sealedName && (
              <div className="mt-6">
                <PackageDownloads
                  varyant="pcf"
                  zipName={sealedName}
                  calculationId={reportId}
                  sha256={sealedHash}
                />
              </div>
            )}
          </div>
        </section>
      )}
      </FlowViewport>
      </div>

      {step > 0 && step < 5 && (
        <div className="flex items-center justify-between border-t border-line pt-5">
          <button type="button" onClick={prev} className="rounded-2xl border-2 border-line bg-white px-5 py-3 font-bold text-ink-800">← Geri</button>
          <span className="text-sm font-bold text-ink-600">Adım {step} / 5</span>
          <button type="button" onClick={next} className="rounded-2xl bg-brand-800 px-6 py-3 font-bold text-white">Devam →</button>
        </div>
      )}
      <SealModal
        open={sealModalOpen}
        sessionId={sessionId}
        sectorSlug={sectorSlug || "product-carbon-footprint"}
        workflowType="pcf"
        packageType="PCF_SEAL_PACKAGE_9900"
        fileCount={PCF_SEALED_PACKAGE_FILE_COUNT}
        onClose={() => setSealModalOpen(false)}
        onPaid={(txn) => void downloadSealed(txn)}
      />
    </main>
  );
}

"use client";

import { RegisterColumnHelp } from "@/components/fieldhelp/RegisterColumnHelp";
import { PCF_MATERIALS } from "@/lib/pcf/material-taxonomy";

export interface PcfMaterialDraft {
  id: string;
  materialId: string;
  label: string;
  quantityKgPerFunctionalUnit: number;
  origin: "primary" | "recycled" | "unknown";
  supplierFactorValue: string;
  supplierSourceTitle: string;
  supplierDocumentId: string;
  supplierIssuedAt: string;
  supplierEvidenceRef: string;
  supplierThirdPartyVerified: boolean;
}

type Props = {
  rows: PcfMaterialDraft[];
  onChange: (rows: PcfMaterialDraft[]) => void;
  kind?: "material" | "packaging";
};

export function emptyPcfMaterialDraft(id: string): PcfMaterialDraft {
  return {
    id,
    materialId: "",
    label: "",
    quantityKgPerFunctionalUnit: 0,
    origin: "unknown",
    supplierFactorValue: "",
    supplierSourceTitle: "",
    supplierDocumentId: "",
    supplierIssuedAt: "",
    supplierEvidenceRef: "",
    supplierThirdPartyVerified: false,
  };
}

/** Yalnız tıklama işleyicilerinde çağırın; SSR/hydration UUID üretmez. */
export function newPcfMaterialDraft(prefix = "M"): PcfMaterialDraft {
  return emptyPcfMaterialDraft(`${prefix}-${crypto.randomUUID().slice(0, 8)}`);
}

export function PcfMaterialRegister({ rows, onChange, kind = "material" }: Props) {
  const noun = kind === "packaging" ? "ambalaj" : "malzeme";
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-brand-100/40 font-bold text-ink-800">
              <th className="p-3">{kind === "packaging" ? "Ambalaj" : "Malzeme"} <RegisterColumnHelp columnKey="pcf_material" /></th>
              <th className="p-3">kg / fonksiyonel birim <RegisterColumnHelp columnKey="pcf_qty" /></th>
              <th className="p-3">Menşe <RegisterColumnHelp columnKey="pcf_origin" /></th>
              <th className="p-3">Tedarikçi PCF/EPD <RegisterColumnHelp columnKey="pcf_supplier_factor" /></th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-b border-line/60 align-top">
                <td className="p-3">
                  <label className="sr-only" htmlFor={`${row.id}-material`}>{noun}</label>
                  <select
                    id={`${row.id}-material`}
                    className="min-h-[44px] w-full rounded-xl border border-line bg-white px-3 font-medium text-ink-900"
                    value={row.materialId}
                    onChange={(e) => {
                      const def = PCF_MATERIALS.find((m) => m.id === e.target.value);
                      const next = [...rows];
                      next[index] = { ...row, materialId: e.target.value, label: def?.labelTr || row.label };
                      onChange(next);
                    }}
                  >
                    <option value="">Seçin</option>
                    {PCF_MATERIALS.map((m) => (
                      <option key={m.id} value={m.id}>{m.labelTr}</option>
                    ))}
                  </select>
                  <label className="sr-only" htmlFor={`${row.id}-label`}>Malzeme özel adı</label>
                  <input
                    id={`${row.id}-label`}
                    className="mt-2 min-h-[40px] w-full rounded-xl border border-line px-3 text-sm"
                    value={row.label}
                    placeholder="Örn. 6063-T6 alüminyum profil"
                    onChange={(e) => {
                      const next = [...rows];
                      next[index] = { ...row, label: e.target.value };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <label className="sr-only" htmlFor={`${row.id}-qty`}>Miktar</label>
                  <input
                    id={`${row.id}-qty`}
                    type="number"
                    min="0"
                    step="0.001"
                    inputMode="decimal"
                    className="min-h-[44px] w-36 rounded-xl border border-line px-3 font-mono"
                    value={row.quantityKgPerFunctionalUnit || ""}
                    onChange={(e) => {
                      const next = [...rows];
                      next[index] = { ...row, quantityKgPerFunctionalUnit: Math.max(0, Number(e.target.value) || 0) };
                      onChange(next);
                    }}
                  />
                </td>
                <td className="p-3">
                  <label className="sr-only" htmlFor={`${row.id}-origin`}>Menşe</label>
                  <select
                    id={`${row.id}-origin`}
                    className="min-h-[44px] rounded-xl border border-line bg-white px-3"
                    value={row.origin}
                    onChange={(e) => {
                      const next = [...rows];
                      next[index] = { ...row, origin: e.target.value as PcfMaterialDraft["origin"] };
                      onChange(next);
                    }}
                  >
                    <option value="unknown">Bilmiyorum</option>
                    <option value="primary">Birincil</option>
                    <option value="recycled">Geri dönüştürülmüş</option>
                  </select>
                </td>
                <td className="p-3">
                  <details className="rounded-xl border border-line bg-neutral-50 p-3">
                    <summary className="cursor-pointer font-semibold text-brand-900">Varsa tedarikçi belgesini kullan</summary>
                    <div className="mt-3 grid gap-2">
                      <label className="text-xs font-semibold" htmlFor={`${row.id}-sfv`}>kg CO2e / kg</label>
                      <input id={`${row.id}-sfv`} type="number" min="0" step="0.000001" className="min-h-[40px] rounded-xl border border-line px-3" value={row.supplierFactorValue} onChange={(e) => { const next = [...rows]; next[index] = { ...row, supplierFactorValue: e.target.value }; onChange(next); }} />
                      <label className="text-xs font-semibold" htmlFor={`${row.id}-sft`}>Belge adı</label>
                      <input id={`${row.id}-sft`} className="min-h-[40px] rounded-xl border border-line px-3" value={row.supplierSourceTitle} onChange={(e) => { const next = [...rows]; next[index] = { ...row, supplierSourceTitle: e.target.value }; onChange(next); }} />
                      <label className="text-xs font-semibold" htmlFor={`${row.id}-sfd`}>Belge / EPD / PCF no</label>
                      <input id={`${row.id}-sfd`} className="min-h-[40px] rounded-xl border border-line px-3" value={row.supplierDocumentId} onChange={(e) => { const next = [...rows]; next[index] = { ...row, supplierDocumentId: e.target.value }; onChange(next); }} />
                      <label className="text-xs font-semibold" htmlFor={`${row.id}-sfi`}>Belge tarihi</label>
                      <input id={`${row.id}-sfi`} type="date" className="min-h-[40px] rounded-xl border border-line px-3" value={row.supplierIssuedAt} onChange={(e) => { const next = [...rows]; next[index] = { ...row, supplierIssuedAt: e.target.value }; onChange(next); }} />
                      <label className="text-xs font-semibold" htmlFor={`${row.id}-sfe`}>Kanıt referansı / dosya adı</label>
                      <input id={`${row.id}-sfe`} className="min-h-[40px] rounded-xl border border-line px-3" value={row.supplierEvidenceRef} onChange={(e) => { const next = [...rows]; next[index] = { ...row, supplierEvidenceRef: e.target.value }; onChange(next); }} />
                      <label className="flex items-center gap-2 text-xs font-semibold">
                        <input type="checkbox" checked={row.supplierThirdPartyVerified} onChange={(e) => { const next = [...rows]; next[index] = { ...row, supplierThirdPartyVerified: e.target.checked }; onChange(next); }} />
                        Belgede bağımsız üçüncü taraf doğrulaması belirtiliyor
                      </label>
                    </div>
                  </details>
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    className="rounded-xl border border-line px-3 py-2 font-semibold text-ink-700 hover:bg-neutral-100"
                    onClick={() => onChange(rows.filter((_, i) => i !== index))}
                    aria-label={`${row.label || noun} satırını kaldır`}
                  >
                    Kaldır
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="rounded-2xl border-2 border-brand-800 bg-white px-5 py-2.5 text-sm font-bold text-brand-800 shadow-sm hover:bg-brand-50"
        onClick={() => onChange([...rows, newPcfMaterialDraft(kind === "packaging" ? "PKG" : "MAT")])}
      >
        + {kind === "packaging" ? "Ambalaj" : "Malzeme"} ekle
      </button>
    </div>
  );
}

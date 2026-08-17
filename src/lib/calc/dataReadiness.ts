/**
 * Maliyet gösterimi — veri bütünlüğü (P0 dürüstlük kapısı).
 * Hiçbir Euro rakamı, bu kontrolden geçmeden "tahmini sertifika maliyeti" olamaz.
 *
 * Girdi eşlemesi (SkdmWizard adımları, RM-004 katmanları):
 * - productCategory  → Adım 2 mallar kaydı (goods)
 * - productionStep   → Adım 3 süreç kaydı (processes)
 * - energySource     → Adım 4 kaynak akışı (streams)
 * - totalProductionQty → Adım 5 D_Processes (e) toplamı (dA)
 */
export interface RequiredCostInputs {
  productCategory: string | null;
  productionStep: string | null;
  energySource: string | null;
  totalProductionQty: number | null;
}

export type CostReadiness =
  | { state: "no_data"; missingFields: string[] }
  | { state: "partial"; missingFields: string[] }
  | { state: "ready" };

const REQUIRED: Array<[keyof RequiredCostInputs, string]> = [
  ["productCategory", "Ürün kategorisi"],
  ["productionStep", "Üretim adımı"],
  ["energySource", "Enerji/yakıt kaynağı"],
  ["totalProductionQty", "Toplam üretim miktarı"],
];

function isMissing(v: RequiredCostInputs[keyof RequiredCostInputs]): boolean {
  return v === null || v === undefined || v === "" || (typeof v === "number" && !(v > 0));
}

export function assessCostReadiness(inputs: RequiredCostInputs): CostReadiness {
  const missing = REQUIRED.filter(([key]) => isMissing(inputs[key])).map(([, label]) => label);
  if (missing.length === REQUIRED.length) return { state: "no_data", missingFields: missing };
  if (missing.length > 0) return { state: "partial", missingFields: missing };
  return { state: "ready" };
}

/** Wizard kayıtlarından maliyet girdileri — sessiz varsayılan yok. */
export function wizardCostInputs(args: {
  goodsCount: number;
  processCount: number;
  streamCount: number;
  totalProductionQty: number;
}): RequiredCostInputs {
  return {
    productCategory: args.goodsCount > 0 ? "set" : null,
    productionStep: args.processCount > 0 ? "set" : null,
    energySource: args.streamCount > 0 ? "set" : null,
    totalProductionQty: args.totalProductionQty > 0 ? args.totalProductionQty : null,
  };
}

/**
 * Tahmini sertifika maliyeti — TEK gösterim kapısı.
 *
 * MİMARİ KURAL — ihlal edilemez:
 * Sektöre özel kopya (demir-celik/estimateCost.ts vb.) OLUŞTURULAMAZ.
 * CBAM matematiği burada yeniden yazılmaz; RM-003 yükümlülük
 * `calculateSkdmLiability` (Tüzük (AB) 2023/956 Md. 6–7, uygulama 2023/1773,
 * Omnibus 2025/2083 çürüme/de minimis) üzerinden gelir.
 *
 * Bu fonksiyon yalnız: readiness !== ready ise null; aksi halde motorun
 * importerCostEur değerini döner. Varsayılan tonaj (1000) sızdırılamaz.
 */
import { calculateSkdmLiability, type SkdmCalculationInput } from "@/lib/skdm/calculator";
import { assessCostReadiness, type RequiredCostInputs } from "./dataReadiness";

export type EstimateCostRest = Omit<SkdmCalculationInput, "sectorId" | "productionVolume">;

export function estimateCertificateCost(
  sectorId: string,
  inputs: RequiredCostInputs,
  rest: EstimateCostRest,
): number | null {
  const readiness = assessCostReadiness(inputs);
  if (readiness.state !== "ready") return null;
  const qty = inputs.totalProductionQty;
  if (qty === null || !(qty > 0)) return null;
  return calculateSkdmLiability({
    ...rest,
    sectorId,
    productionVolume: qty,
  }).importerCostEur;
}

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

export type CertificateLifecycleState = "PURCHASE" | "HOLDING" | "SURRENDER" | "REPURCHASE";

export interface CertificateCostLifecycleBreakdown {
  pureCertificateCostEur: number | null;
  /** Taslak Delegated Regulation uyarınca sertifika fiyatından ayrı tutulan platform işlem ücreti */
  estimatedPlatformFeeEur: number | null;
  /** Toplam tahmini finansal taahhüt (sertifika maliyeti + işlem ücreti) */
  totalFinancialCommitmentEur: number | null;
  lifecyclePhase: CertificateLifecycleState;
  draftNotice: "DRAFT_NOT_YET_IN_FORCE";
}

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

/**
 * Yaşam döngüsü (purchase / holding / surrender / repurchase) ve platform ücreti ayrıştırma desteği.
 *
 * MİMARİ KURAL:
 * Taslak (Delegated Regulation) yürürlüğe girmediği için üretim hesaplama motorunun
 * sertifika fiyatı formülü değiştirilmez. Platform işlem ücreti sertifika fiyatına
 * gömülmez, bağımsız bir kalem olarak modellenir.
 */
export function estimateCertificateLifecycleCost(
  sectorId: string,
  inputs: RequiredCostInputs,
  rest: EstimateCostRest,
  options?: {
    platformFeePerCertEur?: number;
    platformFlatFeeEur?: number;
    lifecyclePhase?: CertificateLifecycleState;
  },
): CertificateCostLifecycleBreakdown {
  const baseCost = estimateCertificateCost(sectorId, inputs, rest);
  if (baseCost === null) {
    return {
      pureCertificateCostEur: null,
      estimatedPlatformFeeEur: null,
      totalFinancialCommitmentEur: null,
      lifecyclePhase: options?.lifecyclePhase ?? "PURCHASE",
      draftNotice: "DRAFT_NOT_YET_IN_FORCE",
    };
  }

  const perCertFee = options?.platformFeePerCertEur ?? 0;
  const flatFee = options?.platformFlatFeeEur ?? 0;
  const platformFee = perCertFee > 0 || flatFee > 0
    ? (inputs.totalProductionQty ?? 0) * perCertFee + flatFee
    : 0;

  return {
    pureCertificateCostEur: baseCost,
    estimatedPlatformFeeEur: platformFee > 0 ? platformFee : null,
    totalFinancialCommitmentEur: baseCost + platformFee,
    lifecyclePhase: options?.lifecyclePhase ?? "PURCHASE",
    draftNotice: "DRAFT_NOT_YET_IN_FORCE",
  };
}


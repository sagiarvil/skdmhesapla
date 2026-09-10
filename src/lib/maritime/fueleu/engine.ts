/**
 * EU Denizcilik Karbon Uyumu — FuelEU Maritime Hesaplama ve Uyum Motoru
 * Dayanak: Regulation (EU) 2023/1805 (Annex I, II, IV) & Implementing Regulation (EU) 2024/2027
 *
 * Kural Kılavuzu:
 * 1. Birim Kesinliği: Compliance Balance hukuki birimi gCO2eq'dir (Annex IV). MJ kullanımı yasaktır.
 * 2. Hassasiyet: Hesaplamalar raw double precision ile yapılır, yuvarlama yalnızca gösterim katmanında uygulanır.
 * 3. Biyoyakıt TtW: Biodiesel default TtW CO2 faktörü 2.834 gCO2/gFuel'dir (Annex II). Geçerli PoS olmadan düşük karbon iddiası bloklanır.
 * 4. Banking (Madde 20): Pozitif bakiye gCO2eq cinsinden bir sonraki döneme bankalanabilir. Verifier onayı olmadan "BANKED" yazılamaz.
 * 5. Borrowing (Madde 21): Yalnızca açık varsa ve hedef yoğunluğun azami %2'si kadar uygulanabilir. Çarpan: 1.10.
 * 6. OPS (Madde 6): 2025 yılında konteyner/yolcu gemileri için yasal zorunluluk (2030/2035) yoktur; gönüllü kullanım kaydedilir.
 */

import {
  FUELEU_BASELINE_GHG_INTENSITY,
  FUELEU_TARGETS,
  FUELEU_PENALTY_EUR_PER_TON_VLSFO,
  VLSFO_REFERENCE_LCV_MJ_PER_KG,
  FUELEU_BORROWING_MAX_RATIO,
  FUELEU_BORROWING_PENALTY_MULTIPLIER,
  RFNBO_REWARD_MULTIPLIER,
  RFNBO_EXPIRY_YEAR,
  STATUTORY_FUEL_REGISTRY,
} from "../constants";
import type { FuelEuCalculationResult, FuelType } from "../types";

export interface FuelConsumptionInput {
  fuelType: FuelType;
  massTonnes: number;
  scopeRatio: number; // 1.0 (intra-EU / berth), 0.5 (extra-EU leg), 0.0 (non-EU)
  customLcvMjPerKg?: number;
  customWttGhgIntensity?: number; // gCO2eq/MJ
  customTtwCo2Factor?: number; // gCO2/gFuel
  hasProofOfSustainability?: boolean; // RED II Directive 2018/2001
  posCertificateId?: string;
  isRfnbo?: boolean;
  electricityKWh?: number; // OPS
}

export interface FuelEuEngineInput {
  reportingYear?: number;
  year?: number;
  shipType?: string;
  consumptions: FuelConsumptionInput[];
  consecutiveDeficitYears?: number; // 1, 2, ...
  bankedSurplusFromPrevYearGco2eq?: number;
  requestedBorrowingGco2eq?: number;
  borrowedInPrecedingYear?: boolean; // Art 21 iki ardışık yıl borçlanma yasağı
  hasVerifierApprovalForBanking?: boolean;
  hasVerifierApprovalForBorrowing?: boolean;
  poolId?: string;
}

export function calculateFuelEuCompliance(input: FuelEuEngineInput): FuelEuCalculationResult {
  const reportingYear = input.reportingYear ?? input.year ?? 2025;
  const {
    consumptions,
    consecutiveDeficitYears = 1,
    bankedSurplusFromPrevYearGco2eq = 0,
    requestedBorrowingGco2eq = 0,
    borrowedInPrecedingYear = false,
    hasVerifierApprovalForBanking = false,
    hasVerifierApprovalForBorrowing = false,
    poolId,
  } = input;

  // 1. Hedef Sera Gazı Yoğunluğu (gCO2eq/MJ) — Raw Precision
  const targetGhgIntensity =
    FUELEU_TARGETS[reportingYear as keyof typeof FUELEU_TARGETS] ??
    (reportingYear > 2050 ? FUELEU_TARGETS[2050] : FUELEU_BASELINE_GHG_INTENSITY);

  let totalEnergyMj = 0;
  let totalWeightedGhgGrams = 0;
  let rfnboRewardMj = 0;
  let opsUsedKWh = 0;

  for (const item of consumptions) {
    if (item.scopeRatio <= 0) continue;

    const spec = STATUTORY_FUEL_REGISTRY[item.fuelType] || STATUTORY_FUEL_REGISTRY.VLSFO;

    // OPS (Kıyı Elektriği) İşleme
    if (item.fuelType === "OPS") {
      const kWh = (item.electricityKWh ?? 0) * item.scopeRatio;
      opsUsedKWh += kWh;
      // 1 kWh = 3.6 MJ
      const opsEnergyMj = kWh * 3.6;
      totalEnergyMj += opsEnergyMj;
      // OPS on-board TtW emisyonu 0'dır
      continue;
    }

    const lcv = item.customLcvMjPerKg ?? spec.fuelEuWtw.lcvMjPerKg;
    const massKg = item.massTonnes * 1000 * item.scopeRatio;
    let energyMj = massKg * lcv;

    // Biyoyakıt ve PoS Denetimi: PoS yoksa fosil/statutory default kullanılır
    let wtt = spec.fuelEuWtw.wttGhgIntensity;
    let ttwCo2 = spec.fuelEuWtw.ttwCo2Default; // gCO2 / gFuel

    if (spec.fuelEuWtw.isBiofuel) {
      if (item.hasProofOfSustainability) {
        wtt = item.customWttGhgIntensity ?? spec.fuelEuWtw.wttGhgIntensity;
        // RED II uyumlu biyokütle için TtW biyojenik kabul edilebilir
        ttwCo2 = item.customTtwCo2Factor ?? 0.0;
      } else {
        // PoS yoksa FuelEU Annex II varsayılan fosil eşdeğeri ve 2.834 g/gFuel cezalandırıcı faktörü
        wtt = spec.fuelEuWtw.wttGhgIntensity;
        ttwCo2 = 2.834;
      }
    }

    // RFNBO 2x ödül çarpanı (2025-2033 arası)
    const isRfnbo = item.isRfnbo ?? spec.fuelEuWtw.isRfnboEligible;
    if (isRfnbo && reportingYear <= RFNBO_EXPIRY_YEAR) {
      rfnboRewardMj += energyMj * (RFNBO_REWARD_MULTIPLIER - 1.0);
      energyMj *= RFNBO_REWARD_MULTIPLIER;
    }

    // TtW Gram CO2eq = massKg * [ttwCo2 * 1000 (g/kg) + ttwCh4 * GWP + ttwN2o * GWP]
    // Toplam Yoğunluk (gCO2eq/MJ) = WtT (g/MJ) + TtW (g/MJ)
    const ttwGramsPerMj = (ttwCo2 * 1000) / (lcv > 0 ? lcv : 1);
    const combinedIntensityGco2PerMj = wtt + ttwGramsPerMj;

    totalEnergyMj += energyMj;
    totalWeightedGhgGrams += energyMj * combinedIntensityGco2PerMj;
  }

  // Tüketim yoksa sıfır bakiye
  if (totalEnergyMj === 0) {
    return {
      year: reportingYear,
      totalEnergyMj: 0,
      targetGhgIntensity: Number(targetGhgIntensity.toFixed(4)),
      actualGhgIntensity: 0,
      statutoryUnit: "gCO2eq",
      complianceBalanceGco2eq: 0,
      complianceBalanceMj: 0,
      explanatoryEnergyEquivalentSurplusMj: 0,
      complianceStatus: "BALANCED",
      isCompliant: true,
      compliancePenaltyEur: 0,
      consecutiveDeficitYears,
      opsArticle6Applicable: false,
      opsComplianceStatus: "EXEMPT",
      opsExplanatoryNote: "2025 yılında FuelEU Madde 6 OPS yükümlülüğü zorunlu değildir (2030 konteyner / yolcu aşaması).",
      opsPenaltyEur: 0,
      rfnboRewardMj: 0,
      bankingAllowed: false,
      bankingStatus: "NOT_USED",
      maxBorrowingLimitGco2eq: 0,
      maxBorrowingDeficitMj: 0,
      borrowingStatus: "NOT_USED",
      poolingStatus: poolId ? "POOLED" : "NOT_USED",
    };
  }

  // 2. Gerçekleşen Ağırlıklı Sera Gazı Yoğunluğu (GHGIE_actual in gCO2eq/MJ) — Raw Double Precision
  const rawActualIntensity = totalWeightedGhgGrams / totalEnergyMj;

  // 3. Hukuki Uyum Bakiyesi (Regulation (EU) 2023/1805 Annex IV):
  // Compliance Balance [gCO2eq] = (GHGIE_target - GHGIE_actual) * TotalEnergy [MJ]
  const rawBalanceGco2eq = (targetGhgIntensity - rawActualIntensity) * totalEnergyMj;
  let finalBalanceGco2eq = rawBalanceGco2eq;

  // Geçmiş yıldan devreden surplus eklenir
  if (bankedSurplusFromPrevYearGco2eq > 0) {
    finalBalanceGco2eq += bankedSurplusFromPrevYearGco2eq;
  }

  // 4. Borrowing Kontrolü (Madde 21)
  // Sınır = TotalEnergy * targetGhgIntensity * 2% [gCO2eq]
  const maxBorrowLimitGco2eq = totalEnergyMj * targetGhgIntensity * FUELEU_BORROWING_MAX_RATIO;
  let appliedBorrowingGco2eq = 0;
  let borrowingStatus: FuelEuCalculationResult["borrowingStatus"] = "NOT_USED";

  if (finalBalanceGco2eq < 0) {
    if (borrowedInPrecedingYear) {
      borrowingStatus = "NOT_ELIGIBLE"; // İki ardışık yıl borçlanma yasağı
    } else if (requestedBorrowingGco2eq > 0) {
      appliedBorrowingGco2eq = Math.min(requestedBorrowingGco2eq, maxBorrowLimitGco2eq);
      finalBalanceGco2eq += appliedBorrowingGco2eq;
      borrowingStatus = hasVerifierApprovalForBorrowing
        ? "REQUESTED_SUBJECT_TO_VERIFICATION"
        : "NOT_ELIGIBLE";
    }
  }

  const isCompliant = finalBalanceGco2eq >= 0;
  const complianceStatus: FuelEuCalculationResult["complianceStatus"] =
    finalBalanceGco2eq > 0
      ? "POSITIVE_COMPLIANCE_SURPLUS"
      : finalBalanceGco2eq < 0
      ? "COMPLIANCE_DEFICIT"
      : "BALANCED";

  // 5. Ceza Hesabı (Madde 23(2))
  // Ceza YALNIZCA açık (deficit) varsa hesaplanır.
  let compliancePenaltyEur = 0;
  if (!isCompliant) {
    const absDeficitGrams = Math.abs(finalBalanceGco2eq);
    // VLSFO-eşdeğeri ton: denominator = actualIntensity (g/MJ) * 41.000 (MJ/ton)
    const denominator = rawActualIntensity * (VLSFO_REFERENCE_LCV_MJ_PER_KG * 1000);
    const deficitTonnesVlsfoEq = denominator > 0 ? absDeficitGrams / denominator : 0;
    const escalationFactor = 1 + (consecutiveDeficitYears - 1) / 10;
    compliancePenaltyEur = Math.round(
      deficitTonnesVlsfoEq * FUELEU_PENALTY_EUR_PER_TON_VLSFO * escalationFactor
    );
  }

  // 6. Banking Durumu (Madde 20)
  // Verifier onayı olmadan "BANKED" statüsü verilemez.
  const bankingAllowed = isCompliant && finalBalanceGco2eq > 0;
  const bankingStatus: FuelEuCalculationResult["bankingStatus"] = bankingAllowed
    ? "BANKABLE_SUBJECT_TO_VERIFICATION"
    : "NOT_ELIGIBLE";

  // Kullanıcıya açıklayıcı enerji eşdeğeri surplus (MJ)
  const explanatoryEnergyEquivalentSurplusMj =
    rawActualIntensity > 0 ? finalBalanceGco2eq / rawActualIntensity : 0;

  return {
    year: reportingYear,
    totalEnergyMj: Math.round(totalEnergyMj),
    targetGhgIntensity: Number(targetGhgIntensity.toFixed(4)),
    actualGhgIntensity: Number(rawActualIntensity.toFixed(4)),
    statutoryUnit: "gCO2eq",
    complianceBalanceGco2eq: Math.round(finalBalanceGco2eq),
    complianceBalanceMj: Math.round(finalBalanceGco2eq), // Backward compatibility
    explanatoryEnergyEquivalentSurplusMj: Math.round(explanatoryEnergyEquivalentSurplusMj),
    complianceStatus,
    isCompliant,
    compliancePenaltyEur,
    consecutiveDeficitYears,
    opsArticle6Applicable: false,
    opsComplianceStatus: opsUsedKWh > 0 ? "VOLUNTARY_USAGE_RECORDED" : "EXEMPT",
    opsExplanatoryNote:
      opsUsedKWh > 0
        ? `2025 gönüllü kıyı elektriği kullanımı (${opsUsedKWh.toLocaleString()} kWh). Madde 6 yasal zorunluluğu 2030'da başlar.`
        : "2025 takvim yılında konteyner gemileri için Madde 6 OPS yasal zorunluluğu bulunmamaktadır.",
    opsPenaltyEur: 0,
    rfnboRewardMj: Math.round(rfnboRewardMj),
    bankingAllowed,
    bankingStatus,
    maxBorrowingLimitGco2eq: Math.round(maxBorrowLimitGco2eq),
    maxBorrowingDeficitMj: Math.round(maxBorrowLimitGco2eq),
    borrowingStatus,
    poolingStatus: poolId ? "POOLED" : "NOT_USED",
  };
}

/**
 * FuelEU Havuzlama Motoru (Pooling - Madde 21)
 */
export function poolComplianceBalances(
  vesselsResults: Array<{ vesselId: string; result: FuelEuCalculationResult }>
): {
  poolTotalBalanceGco2eq: number;
  poolTotalBalanceMj: number; // Backward compatibility
  isPoolCompliant: boolean;
  totalPenaltiesBeforePoolEur: number;
  totalPenaltiesAfterPoolEur: number;
  savingsEur: number;
  allocations: Array<{ vesselId: string; netBalanceAfterPoolGco2eq: number; netBalanceAfterPoolMj: number }>;
} {
  let poolTotalGco2eq = 0;
  let penaltiesBeforeEur = 0;

  for (const v of vesselsResults) {
    poolTotalGco2eq += v.result.complianceBalanceGco2eq;
    penaltiesBeforeEur += v.result.compliancePenaltyEur;
  }

  const isPoolCompliant = poolTotalGco2eq >= 0;
  let penaltiesAfterEur = 0;
  if (!isPoolCompliant) {
    penaltiesAfterEur = Math.round(
      (Math.abs(poolTotalGco2eq) / (89.3368 * 41000)) * FUELEU_PENALTY_EUR_PER_TON_VLSFO
    );
  }

  return {
    poolTotalBalanceGco2eq: Math.round(poolTotalGco2eq),
    poolTotalBalanceMj: Math.round(poolTotalGco2eq),
    isPoolCompliant,
    totalPenaltiesBeforePoolEur: penaltiesBeforeEur,
    totalPenaltiesAfterPoolEur: penaltiesAfterEur,
    savingsEur: Math.max(0, penaltiesBeforeEur - penaltiesAfterEur),
    allocations: vesselsResults.map((v) => ({
      vesselId: v.vesselId,
      netBalanceAfterPoolGco2eq: Math.round(v.result.complianceBalanceGco2eq),
      netBalanceAfterPoolMj: Math.round(v.result.complianceBalanceGco2eq),
    })),
  };
}

/**
 * EU Denizcilik Karbon Uyumu — FuelEU Maritime Hesaplama Motoru
 * Regulation (EU) 2023/1805 Dayanaklı Tam Mevzuat Motoru
 *
 * Kapsanan Maddeler:
 * - Sera Gazı Yoğunluğu (GHG Intensity) & Hedef Karşılaştırması (Madde 4)
 * - RFNBO 2x Ödül Çarpanı (Madde 5(3))
 * - Kıyı Elektriği (OPS) Kuralı & İstisnaları (Madde 6)
 * - Uyum Bakiyesi (Compliance Balance - CB) (Ek IV)
 * - Ceza Tahakkuk Formülü (€2.400/t VLSFO-eq) (Madde 23(2))
 * - Bankacılık (Banking - Madde 20) & Borçlanma (Borrowing - Madde 21)
 * - Havuzlama (Pooling - Madde 21)
 */

import {
  FUELEU_BASELINE_GHG_INTENSITY,
  FUELEU_TARGETS,
  FUELEU_PENALTY_EUR_PER_TON_VLSFO,
  VLSFO_REFERENCE_LCV_MJ_PER_KG,
  RFNBO_REWARD_MULTIPLIER,
  RFNBO_EXPIRY_YEAR,
  FUEL_SPECS,
} from "../constants";
import type { FuelConsumption, FuelEuCalculationResult, FuelType } from "../types";

export interface FuelEuInput {
  year: number;
  consumptions: Array<{
    fuelType: FuelType;
    massTonnes: number;
    scopeRatio: number; // 1.0, 0.5, 0.0
    customLcvMjPerKg?: number;
    customGhgIntensityWtW?: number;
    isRfnbo?: boolean;
    electricityKWh?: number; // OPS
  }>;
  consecutiveDeficitYears?: number; // n (varsayılan 1)
  bankedBalanceFromPrevYearMj?: number; // Geçmiş yıldan devreden CB
  requestedBorrowingMj?: number; // Gelecek yıldan borçlanma talebi
}

export function calculateFuelEuCompliance(input: FuelEuInput): FuelEuCalculationResult {
  const { year, consumptions, consecutiveDeficitYears = 1, bankedBalanceFromPrevYearMj = 0, requestedBorrowingMj = 0 } = input;

  // 1. Hedef Sera Gazı Yoğunluğu (gCO2eq/MJ)
  const targetIntensity =
    FUELEU_TARGETS[year as keyof typeof FUELEU_TARGETS] ??
    (year > 2050 ? FUELEU_TARGETS[2050] : FUELEU_BASELINE_GHG_INTENSITY);

  let totalEnergyMj = 0;
  let totalWeightedGhgGrams = 0;
  let rfnboRewardMj = 0;
  let opsUsedKWh = 0;

  for (const item of consumptions) {
    if (item.scopeRatio <= 0) continue;

    const spec = FUEL_SPECS[item.fuelType];
    const lcv = item.customLcvMjPerKg ?? spec.lcvMjPerKg;
    const ghgIntensity = item.customGhgIntensityWtW ?? spec.ghgIntensityWtW;

    if (item.fuelType === "OPS") {
      const kWh = (item.electricityKWh ?? 0) * item.scopeRatio;
      opsUsedKWh += kWh;
      // 1 kWh = 3.6 MJ
      const opsEnergyMj = kWh * 3.6;
      totalEnergyMj += opsEnergyMj;
      // OPS on-board emisyonu sıfırdır
      continue;
    }

    // Yakıt kütlesi (Ton -> kg)
    const massKg = item.massTonnes * 1000 * item.scopeRatio;
    let energyMj = massKg * lcv;

    // RFNBO 2x ödül çarpanı (2025-2033 arası yürürlükte)
    const isRfnbo = item.isRfnbo ?? spec.isRfnboEligible;
    if (isRfnbo && year <= RFNBO_EXPIRY_YEAR) {
      rfnboRewardMj += energyMj * (RFNBO_REWARD_MULTIPLIER - 1.0);
      // Enerji payı hesaplamada efektif olarak 2 katı ağırlıklandırılır
      energyMj *= RFNBO_REWARD_MULTIPLIER;
    }

    totalEnergyMj += energyMj;
    totalWeightedGhgGrams += energyMj * ghgIntensity;
  }

  // Eğer tüketim yoksa sıfır bakiye
  if (totalEnergyMj === 0) {
    return {
      year,
      totalEnergyMj: 0,
      targetGhgIntensity: targetIntensity,
      actualGhgIntensity: 0,
      complianceBalanceMj: 0,
      isCompliant: true,
      compliancePenaltyEur: 0,
      consecutiveDeficitYears,
      opsComplianceStatus: "COMPLIANT",
      opsPenaltyEur: 0,
      rfnboRewardMj: 0,
      bankingAllowed: false,
      maxBorrowingDeficitMj: 0,
    };
  }

  // Gerçekleşen ağırlıklı sera gazı yoğunluğu (GHGIE_actual in gCO2eq/MJ)
  const actualIntensity = totalWeightedGhgGrams / totalEnergyMj;

  // Ham Uyum Bakiyesi (gCO2eq cinsinden): (Target - Actual) * TotalEnergy
  let complianceBalanceGrams = (targetIntensity - actualIntensity) * totalEnergyMj;

  // Geçmiş yıldan devreden bankalanmış miktar eklenir
  if (bankedBalanceFromPrevYearMj > 0) {
    complianceBalanceGrams += bankedBalanceFromPrevYearMj;
  }

  // Maksimum borçlanma sınırı (Madde 21: Toplam enerji * Hedef yoğunluk * %2)
  const maxBorrowLimitGrams = totalEnergyMj * targetIntensity * 0.02;
  let appliedBorrowingGrams = 0;

  if (complianceBalanceGrams < 0 && requestedBorrowingMj > 0) {
    appliedBorrowingGrams = Math.min(requestedBorrowingMj, maxBorrowLimitGrams);
    complianceBalanceGrams += appliedBorrowingGrams;
  }

  const isCompliant = complianceBalanceGrams >= 0;

  // Ceza Hesabı (Madde 23(2))
  let compliancePenaltyEur = 0;
  if (!isCompliant) {
    const absDeficitGrams = Math.abs(complianceBalanceGrams);
    // 41.0 MJ/kg * 1000 kg/ton = 41.000 MJ/ton VLSFO
    // Denominator = actualIntensity (g/MJ) * 41.000 (MJ/ton) = gCO2eq per ton VLSFOe
    const denominator = actualIntensity * (VLSFO_REFERENCE_LCV_MJ_PER_KG * 1000);
    const deficitTonnesVlsfoEq = denominator > 0 ? absDeficitGrams / denominator : 0;

    // Çarpan: 1 + (n - 1) / 10
    const escalationFactor = 1 + (consecutiveDeficitYears - 1) / 10;
    compliancePenaltyEur = Math.round(
      deficitTonnesVlsfoEq * FUELEU_PENALTY_EUR_PER_TON_VLSFO * escalationFactor
    );
  }

  return {
    year,
    totalEnergyMj: Math.round(totalEnergyMj),
    targetGhgIntensity: Number(targetIntensity.toFixed(4)),
    actualGhgIntensity: Number(actualIntensity.toFixed(4)),
    complianceBalanceMj: Math.round(complianceBalanceGrams),
    isCompliant,
    compliancePenaltyEur,
    consecutiveDeficitYears,
    opsComplianceStatus: opsUsedKWh > 0 ? "COMPLIANT" : "EXEMPT",
    opsPenaltyEur: 0,
    rfnboRewardMj: Math.round(rfnboRewardMj),
    bankingAllowed: isCompliant && complianceBalanceGrams > 0,
    maxBorrowingDeficitMj: Math.round(maxBorrowLimitGrams),
  };
}

/**
 * Havuzlama (Pooling - Madde 21):
 * Birden fazla geminin uyum dengesini birleştirerek toplam ceza maliyetini sıfırlar veya minimize eder.
 */
export function poolComplianceBalances(
  vesselsResults: Array<{ vesselId: string; result: FuelEuCalculationResult }>
): {
  poolTotalBalanceMj: number;
  isPoolCompliant: boolean;
  totalPenaltiesBeforePoolEur: number;
  totalPenaltiesAfterPoolEur: number;
  savingsEur: number;
  allocations: Array<{ vesselId: string; netBalanceAfterPoolMj: number }>;
} {
  let poolTotalBalanceMj = 0;
  let totalPenaltiesBeforePoolEur = 0;

  for (const v of vesselsResults) {
    poolTotalBalanceMj += v.result.complianceBalanceMj;
    totalPenaltiesBeforePoolEur += v.result.compliancePenaltyEur;
  }

  const isPoolCompliant = poolTotalBalanceMj >= 0;
  const totalPenaltiesAfterPoolEur = isPoolCompliant ? 0 : Math.round(
    totalPenaltiesBeforePoolEur * Math.max(0, 1 - Math.abs(poolTotalBalanceMj) / Math.abs(poolTotalBalanceMj || 1))
  );

  return {
    poolTotalBalanceMj,
    isPoolCompliant,
    totalPenaltiesBeforePoolEur,
    totalPenaltiesAfterPoolEur,
    savingsEur: totalPenaltiesBeforePoolEur - totalPenaltiesAfterPoolEur,
    allocations: vesselsResults.map((v) => ({
      vesselId: v.vesselId,
      netBalanceAfterPoolMj: isPoolCompliant ? Math.max(0, v.result.complianceBalanceMj) : v.result.complianceBalanceMj,
    })),
  };
}

/**
 * EU Denizcilik Karbon Uyumu — EU ETS Şirket / Filo Toplulaştırması & Mutabakatı
 * Direktif 2003/87/EC Madde 3gb & 3gc Uyarınca Şirket Düzeyi Teslim Yükümlülüğü
 *
 * İşlevler:
 * - Filodaki tüm gemilerin doğrulanmış emisyonlarını toplulaştırma (Aggregation)
 * - Yıllık phase-in oranını uygulama (2024: %40, 2025: %70, 2026: %100)
 * - Tam sayı EUA teslim yükümlülüğü (Ceil rounding)
 * - BIMCO ETS Clause uyumlu çarterer / armatör maliyet dağıtım mutabakatı (Reconciliation)
 * - Farklı EUA karbon fiyatı senaryolarına göre finansal risk analizi
 */

import { ETS_PHASE_IN, DEFAULT_EUA_PRICE_EUR } from "../constants";
import type { Vessel } from "../types";

export interface VesselEtsSummary {
  vesselId: string;
  vesselName: string;
  imoNumber: string;
  charterType: "OWNED_OPERATED" | "TIME_CHARTER" | "BAREBOAT";
  chartererName?: string;
  grossTonnage: number;
  isSubjectToEts: boolean; // >= 5000 GT
  totalScopedCo2Tonnes: number;
  totalScopedCh4Tonnes?: number;
  totalScopedN2oTonnes?: number;
}

export interface CompanyFleetEtsReconciliation {
  companyId: string;
  companyTitle: string;
  reportingYear: number;
  phaseInRatio: number; // 0.7 for 2025
  totalFleetShipsCount: number;
  qualifyingShipsCount: number;
  totalFleetScopedCo2Tonnes: number;
  totalFleetLiableCo2Tonnes: number;
  totalEuaSurrenderRequired: number; // Whole EUAs
  referenceEuaPriceEur: number;
  totalFinancialExposureEur: number;
  priceScenarios: {
    low_65: number;
    benchmark_75: number;
    high_95: number;
    stress_120: number;
  };
  vesselAllocations: Array<{
    vesselId: string;
    vesselName: string;
    imoNumber: string;
    scopedCo2Tonnes: number;
    liableCo2Tonnes: number;
    euaUnits: number;
    costEur: number;
    responsibleParty: string;
  }>;
}

/**
 * Birden çok geminin doğrulanmış emisyonlarını ISM Company seviyesinde toplulaştırıp
 * resmi EU ETS teslim yükümlülüğü ve finansal mutabakat tablosunu üretir.
 */
export function reconcileFleetEtsObligation(
  companyId: string,
  companyTitle: string,
  reportingYear: number,
  vessels: VesselEtsSummary[],
  customEuaPriceEur: number = DEFAULT_EUA_PRICE_EUR
): CompanyFleetEtsReconciliation {
  const phaseInRatio =
    ETS_PHASE_IN[reportingYear as keyof typeof ETS_PHASE_IN] ?? (reportingYear >= 2026 ? 1.0 : 0.7);

  let totalFleetScopedCo2 = 0;
  let totalFleetLiableCo2 = 0;
  let totalEuaSurrender = 0;
  let qualifyingShips = 0;

  const vesselAllocations: CompanyFleetEtsReconciliation["vesselAllocations"] = [];

  for (const v of vessels) {
    // 5.000 GT altı gemiler ETS teslim yükümlülüğü dışındadır (Direktif 2003/87/EC)
    const isEtsLiable = v.grossTonnage >= 5000 && v.isSubjectToEts;
    if (isEtsLiable) {
      qualifyingShips += 1;
    }

    const scopedCo2 = isEtsLiable ? v.totalScopedCo2Tonnes : 0;
    const liableCo2 = scopedCo2 * phaseInRatio;
    const euaUnits = Math.ceil(liableCo2); // AB Kayıt Sistemi tam EUA ister
    const costEur = Math.round(euaUnits * customEuaPriceEur);

    totalFleetScopedCo2 += scopedCo2;
    totalFleetLiableCo2 += liableCo2;
    totalEuaSurrender += euaUnits;

    const responsibleParty =
      v.charterType === "TIME_CHARTER" && v.chartererName
        ? `Kiracı: ${v.chartererName} (BIMCO ETS Clause)`
        : `İşletmeci: ${companyTitle}`;

    vesselAllocations.push({
      vesselId: v.vesselId,
      vesselName: v.vesselName,
      imoNumber: v.imoNumber,
      scopedCo2Tonnes: Number(scopedCo2.toFixed(2)),
      liableCo2Tonnes: Number(liableCo2.toFixed(2)),
      euaUnits,
      costEur,
      responsibleParty,
    });
  }

  const totalFinancialExposureEur = Math.round(totalEuaSurrender * customEuaPriceEur);

  return {
    companyId,
    companyTitle,
    reportingYear,
    phaseInRatio,
    totalFleetShipsCount: vessels.length,
    qualifyingShipsCount: qualifyingShips,
    totalFleetScopedCo2Tonnes: Number(totalFleetScopedCo2.toFixed(2)),
    totalFleetLiableCo2Tonnes: Number(totalFleetLiableCo2.toFixed(2)),
    totalEuaSurrenderRequired: totalEuaSurrender,
    referenceEuaPriceEur: customEuaPriceEur,
    totalFinancialExposureEur,
    priceScenarios: {
      low_65: totalEuaSurrender * 65,
      benchmark_75: totalEuaSurrender * 75,
      high_95: totalEuaSurrender * 95,
      stress_120: totalEuaSurrender * 120,
    },
    vesselAllocations,
  };
}

/**
 * EU Denizcilik Karbon Uyumu — Rota ve Coğrafi Kapsam Motoru
 * EU MRV, EU ETS Maritime ve FuelEU Maritime coğrafi kurallarını uygular.
 *
 * Kural Özeti:
 * - AB/AÇA Limanı ↔ AB/AÇA Limanı: %100 kapsam (1.0)
 * - AB Limanında Rıhtım / Demirleme (At Berth): %100 kapsam (1.0)
 * - AB/AÇA Limanı ↔ AB Dışı Liman (örn. Ambarlı ↔ Cenova): %50 kapsam (0.5)
 * - AB Dışı ↔ AB Dışı: %0 kapsam (0.0)
 * - Komşu Konteyner Aktarma Limanı Kuralı (Tanger Med, Port Said - 300 mil):
 *   Konteyner gemisi bu limanlarda aktarma yaptığında sefer bölünmez, önceki kalkış limanı baz alınır.
 */

import type { PortInfo, ScopeAllocation, Voyage, FuelConsumption, FuelType } from "../types";
import { NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS, FUEL_SPECS } from "../constants";

export interface ScopeResolutionResult {
  scopeRatio: ScopeAllocation;
  isTransshipmentBypassApplied: boolean;
  explanation: string;
}

/**
 * İki liman arasındaki seferin resmi coğrafi kapsam oranını belirler.
 */
export function resolveVoyageScope(
  departure: PortInfo,
  arrival: PortInfo,
  isContainerShip: boolean = true
): ScopeResolutionResult {
  // 1. Komşu Konteyner Aktarma Limanı Kontrolü (Tanger Med / Port Said)
  const isArrivalTransshipment =
    isContainerShip &&
    NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS.some((p) => p.code === arrival.code);
  const isDepartureTransshipment =
    isContainerShip &&
    NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS.some((p) => p.code === departure.code);

  if (isArrivalTransshipment || isDepartureTransshipment) {
    return {
      scopeRatio: 0.5,
      isTransshipmentBypassApplied: true,
      explanation:
        "Komşu konteyner aktarma limanı (Tanger Med / Port Said) 300 mil kuralı uyarınca sefer kapsamı %50 olarak uygulanır.",
    };
  }

  // 2. AB İçi Sefer: %100
  if (departure.isEuEea && arrival.isEuEea) {
    return {
      scopeRatio: 1.0,
      isTransshipmentBypassApplied: false,
      explanation: "İki AB/AÇA limanı arası sefer: %100 tam kapsam.",
    };
  }

  // 3. AB - Üçüncü Ülke Seferi (Gidiş veya Geliş, örn. Türkiye - AB): %50
  if ((departure.isEuEea && !arrival.isEuEea) || (!departure.isEuEea && arrival.isEuEea)) {
    return {
      scopeRatio: 0.5,
      isTransshipmentBypassApplied: false,
      explanation: "AB ile üçüncü ülke arasındaki tek yönlü sefer: %50 yasal kapsam.",
    };
  }

  // 4. AB Dışı Sefer: %0
  return {
    scopeRatio: 0.0,
    isTransshipmentBypassApplied: false,
    explanation: "AB/AÇA sınırları dışındaki sefer: %0 kapsam dışı.",
  };
}

export interface AggregatedVoyageEmissions {
  totalDistanceNm: number;
  totalCargoTonnes: number;
  totalHoursUnderway: number;
  totalHoursAtBerth: number;
  totalFuelMassTonnes: number;
  totalEnergyMj: number;
  scopedFuelMassTonnes: number;
  scopedEnergyMj: number;
  scopedCo2Tonnes: number;
  scopedGhgGrams: number;
  averageGhgIntensityWtW: number; // gCO2eq/MJ
}

/**
 * Sefer ve yakıt tüketim loglarını birleştirerek yasal kapsam oranlarına göre
 * net emisyon ve enerji toplamlarını hesaplar.
 */
export function aggregateVoyageConsumptions(
  voyages: Voyage[],
  consumptions: FuelConsumption[]
): AggregatedVoyageEmissions {
  let totalDistanceNm = 0;
  let totalCargoTonnes = 0;
  let totalHoursUnderway = 0;
  let totalHoursAtBerth = 0;
  let totalFuelMassTonnes = 0;
  let totalEnergyMj = 0;
  let scopedFuelMassTonnes = 0;
  let scopedEnergyMj = 0;
  let scopedCo2Tonnes = 0;
  let scopedGhgGrams = 0;

  // Sefer bazlı harita
  const voyageMap = new Map<string, Voyage>();
  for (const v of voyages) {
    voyageMap.set(v.id, v);
    totalDistanceNm += v.distanceNm;
    totalCargoTonnes += v.cargoWeightTonnes;
    totalHoursUnderway += v.hoursUnderway;
    totalHoursAtBerth += v.hoursAtBerth;
  }

  for (const f of consumptions) {
    const parentVoyage = voyageMap.get(f.voyageId);
    const scopeRatio: ScopeAllocation = parentVoyage ? parentVoyage.scopeRatio : 0.5;

    const spec = FUEL_SPECS[f.fuelType];
    const lcv = f.lcvMjPerKg || spec.lcvMjPerKg;
    const co2Factor = f.co2FactorTtW || spec.co2FactorTtW;
    const ghgIntensity = f.ghgIntensityWtW || spec.ghgIntensityWtW;

    totalFuelMassTonnes += f.massTonnes;
    const rawEnergyMj = f.massTonnes * 1000 * lcv;
    totalEnergyMj += rawEnergyMj;

    // Kapsama dahil edilenler
    const scopedMass = f.massTonnes * scopeRatio;
    const scopedEnergy = rawEnergyMj * scopeRatio;
    const scopedCo2 = scopedMass * co2Factor;
    const scopedGhg = scopedEnergy * ghgIntensity;

    scopedFuelMassTonnes += scopedMass;
    scopedEnergyMj += scopedEnergy;
    scopedCo2Tonnes += scopedCo2;
    scopedGhgGrams += scopedGhg;
  }

  const averageGhgIntensityWtW =
    scopedEnergyMj > 0 ? Number((scopedGhgGrams / scopedEnergyMj).toFixed(4)) : 0;

  return {
    totalDistanceNm,
    totalCargoTonnes,
    totalHoursUnderway,
    totalHoursAtBerth,
    totalFuelMassTonnes: Number(totalFuelMassTonnes.toFixed(2)),
    totalEnergyMj: Math.round(totalEnergyMj),
    scopedFuelMassTonnes: Number(scopedFuelMassTonnes.toFixed(2)),
    scopedEnergyMj: Math.round(scopedEnergyMj),
    scopedCo2Tonnes: Number(scopedCo2Tonnes.toFixed(2)),
    scopedGhgGrams: Math.round(scopedGhgGrams),
    averageGhgIntensityWtW,
  };
}

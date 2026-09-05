import type {
  MaritimeCalculatedResult,
  MaritimeEnergyCategory,
  MaritimeFuelRecord,
  MaritimePreparationFile,
  VoyageScope,
} from "./types";
import { etsPhaseIn, FUELEU_GWP100, fueleuIntensityLimit } from "./regulatory";

/** Directive 2003/87/EC maritime geography: intra EU/EEA and in-port 100%; EU/EEA↔third country 50%. */
export function etsGeographicFactor(scope: VoyageScope): number {
  switch (scope) {
    case "intra-eu-eea": return 1;
    case "eu-eea-third": return 0.5;
    case "at-eu-eea-port": return 1;
    default: return 0;
  }
}

/** Regulation (EU) 2023/1805 Article 2(1): in-port and EU↔EU energy 100%; EU↔third-country energy 50%. */
export function fueleuGeographicFactor(scope: VoyageScope): number {
  return etsGeographicFactor(scope);
}

/** MRV includes CO2, CH4 and N2O from reporting period 2024; EU ETS adds CH4/N2O from 2026. */
export function voyageEtsCo2e(reportingYear: number, co2: number, ch4Co2e: number, n2oCo2e: number): number {
  return reportingYear >= 2026 ? co2 + ch4Co2e + n2oCo2e : co2;
}

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
function looksNonFossil(value: string): boolean {
  return /(bio|methanol|ammonia|hydrogen|rfnbo|renewable|e-fuel|synthetic)/i.test(value || "");
}
function energyCategory(item: MaritimeFuelRecord): MaritimeEnergyCategory {
  if (nonNegative(item.opsElectricityKwh) > 0 || /(ops|shore power|electric)/i.test(item.fuelType || "")) return "ops";
  if (nonNegative(item.rfNboEnergyMj) > 0 || /(rfnbo|e-fuel|synthetic hydrogen|renewable hydrogen)/i.test(item.fuelType || "")) return "rfnbo";
  if (looksNonFossil(item.fuelType) || Boolean(item.sustainabilityCertificate?.trim())) return "biofuel";
  if (item.fuelType?.trim()) return "fossil";
  return "other";
}

/**
 * Regulation (EU) 2023/1805 Annex I — Mi × LCV is the canonical fuel-energy basis when fuel mass exists.
 * Explicit energy is retained only for energy carriers without a physical fuel mass (for example OPS electricity).
 */
export function fuelEnergyMj(item: MaritimeFuelRecord): number {
  const mass = nonNegative(item.quantityTonnes);
  const lcv = nonNegative(item.lowerCalorificValueMjPerTonne);
  if (mass > 0 && lcv > 0) return mass * lcv;
  if (Number.isFinite(item.energyMj) && item.energyMj > 0) return item.energyMj;
  return 0;
}

/** Regulation (EU) 2023/1805 Annex I, Equations (1) and (2). */
export function fuelWtWEmissionsGco2e(item: MaritimeFuelRecord): number {
  const energyMj = fuelEnergyMj(item);
  const massG = nonNegative(item.quantityTonnes) * 1_000_000;
  const slipFraction = Math.min(1, nonNegative(item.slipFactor) / 100);
  const combustedTtwCo2ePerGFuel =
    nonNegative(item.tankToWakeCo2Factor) * FUELEU_GWP100.CO2
    + nonNegative(item.tankToWakeCh4Factor) * FUELEU_GWP100.CH4
    + nonNegative(item.tankToWakeN2oFactor) * FUELEU_GWP100.N2O;
  const slippedTtwCo2ePerGFuel = FUELEU_GWP100.CH4;
  const ttwPerGFuel = (1 - slipFraction) * combustedTtwCo2ePerGFuel + slipFraction * slippedTtwCo2ePerGFuel;
  return energyMj * nonNegative(item.wellToTankFactorGco2ePerMj) + massG * ttwPerGFuel;
}

/** Internal reconciliation control; not a statutory tolerance rule. */
export function relativeDifferencePercent(a: number, b: number): number | null {
  const denominator = Math.max(Math.abs(a), Math.abs(b));
  if (denominator === 0) return 0;
  return (Math.abs(a - b) / denominator) * 100;
}

/**
 * Preparation-only calculation authority. Every report/UI value must derive from this function or the mirrored
 * server audit implementation. It does not replace verifier calculations, a verified FuelEU compliance balance,
 * a Document of Compliance or Union Registry surrender.
 */
export function calculateMaritimePreparation(file: MaritimePreparationFile, euaPriceEur?: number): MaritimeCalculatedResult {
  let totalReportedCo2Tonnes = 0;
  let totalReportedCh4Co2eTonnes = 0;
  let totalReportedN2oCo2eTonnes = 0;
  let etsGeographicCo2eTonnes = 0;
  let voyageFuelConsumptionTonnes = 0;
  let totalDistanceNm = 0;
  let totalTimeAtSeaHours = 0;
  let totalTimeAtBerthHours = 0;
  let totalTransportWorkTonneNm = 0;

  for (const voyage of file.voyages) {
    const co2 = nonNegative(voyage.co2Tonnes);
    const ch4 = nonNegative(voyage.ch4TonnesCo2e);
    const n2o = nonNegative(voyage.n2oTonnesCo2e);
    totalReportedCo2Tonnes += co2;
    totalReportedCh4Co2eTonnes += ch4;
    totalReportedN2oCo2eTonnes += n2o;
    voyageFuelConsumptionTonnes += nonNegative(voyage.fuelTonnes);
    totalDistanceNm += nonNegative(voyage.distanceNm);
    totalTimeAtSeaHours += nonNegative(voyage.timeAtSeaHours);
    totalTimeAtBerthHours += nonNegative(voyage.timeAtBerthHours);
    totalTransportWorkTonneNm += nonNegative(voyage.transportWorkTonneNm);
    const etsGasCo2e = voyageEtsCo2e(file.reportingYear, co2, ch4, n2o);
    etsGeographicCo2eTonnes += etsGasCo2e * etsGeographicFactor(voyage.scope);
  }

  const totalReportedCo2eTonnes = totalReportedCo2Tonnes + totalReportedCh4Co2eTonnes + totalReportedN2oCo2eTonnes;
  const etsGasBasis: MaritimeCalculatedResult["etsGasBasis"] = file.reportingYear >= 2026 ? "CO2_CH4_N2O" : "CO2";
  const phase = etsPhaseIn(file.reportingYear);
  const estimatedEuaObligation = etsGeographicCo2eTonnes * phase;
  const estimatedWholeEuaPlanningQuantity = estimatedEuaObligation > 0 ? Math.ceil(estimatedEuaObligation) : 0;
  const estimatedEtsCostEur = typeof euaPriceEur === "number" && Number.isFinite(euaPriceEur) && euaPriceEur >= 0
    ? estimatedEuaObligation * euaPriceEur
    : null;

  let fueleuEnergyMj = 0;
  let fueleuWtWEmissionsGco2e = 0;
  let rfNboEnergyMj = 0;
  let opsElectricityKwh = 0;
  let fuelRegisterConsumptionTonnes = 0;
  const fuelWtWReconciliation = [] as MaritimeCalculatedResult["fuelWtWReconciliation"];
  const breakdownWithoutShares: Omit<MaritimeCalculatedResult["fueleuBreakdown"][number], "energySharePercent">[] = [];

  for (const item of file.fuels) {
    const geo = fueleuGeographicFactor(item.scope);
    const energy = fuelEnergyMj(item);
    const deterministicWtW = fuelWtWEmissionsGco2e(item);
    const scopedEnergy = nonNegative(energy) * geo;
    const scopedWtW = nonNegative(deterministicWtW) * geo;
    const reportedComparator = Number.isFinite(item.wellToWakeEmissionsGco2e) && item.wellToWakeEmissionsGco2e > 0
      ? item.wellToWakeEmissionsGco2e
      : null;
    const difference = reportedComparator === null ? null : deterministicWtW - reportedComparator;
    fuelWtWReconciliation.push({
      fuelId: item.id,
      calculatedGco2e: deterministicWtW,
      reportedComparatorGco2e: reportedComparator,
      differenceGco2e: difference,
      differencePercent: reportedComparator === null ? null : relativeDifferencePercent(deterministicWtW, reportedComparator),
    });
    breakdownWithoutShares.push({
      fuelId: item.id,
      fuelType: item.fuelType,
      category: energyCategory(item),
      scopeFactor: geo,
      physicalEnergyMj: nonNegative(energy),
      scopedEnergyMj: scopedEnergy,
      calculatedWtWEmissionsGco2e: deterministicWtW,
      scopedWtWEmissionsGco2e: scopedWtW,
      intensityGco2ePerMj: energy > 0 ? deterministicWtW / energy : null,
    });

    fueleuEnergyMj += scopedEnergy;
    fueleuWtWEmissionsGco2e += scopedWtW;
    rfNboEnergyMj += nonNegative(item.rfNboEnergyMj) * geo;
    opsElectricityKwh += nonNegative(item.opsElectricityKwh) * geo;
    fuelRegisterConsumptionTonnes += nonNegative(item.quantityTonnes);
  }

  const fueleuBreakdown = breakdownWithoutShares.map((row) => ({
    ...row,
    energySharePercent: fueleuEnergyMj > 0 ? row.scopedEnergyMj / fueleuEnergyMj * 100 : 0,
  }));
  const fueleuEnergySharesPercent: MaritimeCalculatedResult["fueleuEnergySharesPercent"] = {
    fossil: 0, biofuel: 0, rfnbo: 0, ops: 0, other: 0,
  };
  for (const row of fueleuBreakdown) fueleuEnergySharesPercent[row.category] += row.energySharePercent;

  const fuelConsumptionVarianceTonnes = fuelRegisterConsumptionTonnes - voyageFuelConsumptionTonnes;
  const fuelConsumptionVariancePercent = relativeDifferencePercent(fuelRegisterConsumptionTonnes, voyageFuelConsumptionTonnes);
  const fueleuIntensityGco2ePerMj = fueleuEnergyMj > 0 ? fueleuWtWEmissionsGco2e / fueleuEnergyMj : null;
  const fueleuLimitGco2ePerMj = fueleuIntensityLimit(file.reportingYear);
  const fueleuIntensityGap = fueleuIntensityGco2ePerMj === null ? null : fueleuIntensityGco2ePerMj - fueleuLimitGco2ePerMj;
  const fueleuComplianceBalanceGco2e = fueleuIntensityGco2ePerMj === null
    ? null
    : (fueleuLimitGco2ePerMj - fueleuIntensityGco2ePerMj) * fueleuEnergyMj;
  const transportWorkCo2IntensityGco2PerTonneNm = totalTransportWorkTonneNm > 0
    ? totalReportedCo2Tonnes * 1_000_000 / totalTransportWorkTonneNm
    : null;

  return {
    totalReportedCo2Tonnes,
    totalReportedCh4Co2eTonnes,
    totalReportedN2oCo2eTonnes,
    totalReportedCo2eTonnes,
    etsGasBasis,
    etsGeographicCo2eTonnes,
    etsPhaseIn: phase,
    estimatedEuaObligation,
    estimatedWholeEuaPlanningQuantity,
    estimatedEtsCostEur,
    fuelRegisterConsumptionTonnes,
    voyageFuelConsumptionTonnes,
    fuelConsumptionVarianceTonnes,
    fuelConsumptionVariancePercent,
    fueleuEnergyMj,
    fueleuWtWEmissionsGco2e,
    fueleuIntensityGco2ePerMj,
    fueleuLimitGco2ePerMj,
    fueleuIntensityGap,
    fueleuComplianceBalanceGco2e,
    fuelWtWReconciliation,
    fueleuBreakdown,
    fueleuEnergySharesPercent,
    totalDistanceNm,
    totalTimeAtSeaHours,
    totalTimeAtBerthHours,
    totalTransportWorkTonneNm,
    transportWorkCo2IntensityGco2PerTonneNm,
    rfNboEnergyMj,
    opsElectricityKwh,
  };
}
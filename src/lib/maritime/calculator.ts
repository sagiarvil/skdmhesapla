import type { MaritimeCalculatedResult, MaritimeFuelRecord, MaritimePreparationFile, VoyageScope } from "./types";
import { etsPhaseIn, fueleuIntensityLimit } from "./regulatory";

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

/**
 * FuelEU report-preparation WtW total. Where a verified/calculated row total is supplied, that value is authoritative
 * inside the preparation file. Otherwise the engine derives a transparent pre-check from WtT + TtW factors.
 * Sources: Regulation (EU) 2023/1805 Annex I; GWP100 values referenced there to Directive (EU) 2018/2001.
 */
export function fuelWtWEmissionsGco2e(item: MaritimeFuelRecord): number {
  if (item.wellToWakeEmissionsGco2e > 0) return item.wellToWakeEmissionsGco2e;
  const energyMj = item.energyMj > 0
    ? item.energyMj
    : Math.max(0, item.quantityTonnes) * Math.max(0, item.lowerCalorificValueMjPerTonne);
  const massG = Math.max(0, item.quantityTonnes) * 1_000_000;
  const ttwCo2ePerGFuel = Math.max(0, item.tankToWakeCo2Factor)
    + Math.max(0, item.tankToWakeCh4Factor) * 25
    + Math.max(0, item.tankToWakeN2oFactor) * 298;
  return energyMj * Math.max(0, item.wellToTankFactorGco2ePerMj) + massG * ttwCo2ePerGFuel;
}

/**
 * Preparation-only calculation. It does not replace verifier calculations, the verified FuelEU compliance balance,
 * a Document of Compliance or Union Registry surrender.
 * Sources: Directive 2003/87/EC maritime scope; Regulation (EU) 2023/1805 Articles 2 and 4 + Annex I.
 */
export function calculateMaritimePreparation(file: MaritimePreparationFile, euaPriceEur?: number): MaritimeCalculatedResult {
  let totalReportedCo2eTonnes = 0;
  let etsGeographicCo2eTonnes = 0;

  for (const voyage of file.voyages) {
    const mrvCo2e = Math.max(0, voyage.co2Tonnes) + Math.max(0, voyage.ch4TonnesCo2e) + Math.max(0, voyage.n2oTonnesCo2e);
    totalReportedCo2eTonnes += mrvCo2e;
    const etsGasCo2e = voyageEtsCo2e(file.reportingYear, voyage.co2Tonnes, voyage.ch4TonnesCo2e, voyage.n2oTonnesCo2e);
    etsGeographicCo2eTonnes += Math.max(0, etsGasCo2e) * etsGeographicFactor(voyage.scope);
  }

  const phase = etsPhaseIn(file.reportingYear);
  const estimatedEuaObligation = etsGeographicCo2eTonnes * phase;
  const estimatedEtsCostEur = typeof euaPriceEur === "number" && euaPriceEur >= 0
    ? estimatedEuaObligation * euaPriceEur
    : null;

  let fueleuEnergyMj = 0;
  let fueleuWtWEmissionsGco2e = 0;
  let rfNboEnergyMj = 0;
  let opsElectricityKwh = 0;
  for (const item of file.fuels) {
    const geo = fueleuGeographicFactor(item.scope);
    const energy = item.energyMj > 0
      ? item.energyMj
      : Math.max(0, item.quantityTonnes) * Math.max(0, item.lowerCalorificValueMjPerTonne);
    fueleuEnergyMj += Math.max(0, energy) * geo;
    fueleuWtWEmissionsGco2e += Math.max(0, fuelWtWEmissionsGco2e(item)) * geo;
    rfNboEnergyMj += Math.max(0, item.rfNboEnergyMj) * geo;
    opsElectricityKwh += Math.max(0, item.opsElectricityKwh) * geo;
  }

  const fueleuIntensityGco2ePerMj = fueleuEnergyMj > 0 ? fueleuWtWEmissionsGco2e / fueleuEnergyMj : null;
  const fueleuLimitGco2ePerMj = fueleuIntensityLimit(file.reportingYear);
  const fueleuIntensityGap = fueleuIntensityGco2ePerMj === null ? null : fueleuIntensityGco2ePerMj - fueleuLimitGco2ePerMj;

  return {
    totalReportedCo2eTonnes,
    etsGeographicCo2eTonnes,
    etsPhaseIn: phase,
    estimatedEuaObligation,
    estimatedEtsCostEur,
    fueleuEnergyMj,
    fueleuWtWEmissionsGco2e,
    fueleuIntensityGco2ePerMj,
    fueleuLimitGco2ePerMj,
    fueleuIntensityGap,
    rfNboEnergyMj,
    opsElectricityKwh,
  };
}

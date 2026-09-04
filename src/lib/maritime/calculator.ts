import type { MaritimeCalculatedResult, MaritimePreparationFile, VoyageScope } from "./types";
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

/** MRV includes CO2, CH4 and N2O from reporting period 2024; EU ETS adds CH4/N2O from 2026. */
export function voyageEtsCo2e(reportingYear: number, co2: number, ch4Co2e: number, n2oCo2e: number): number {
  return reportingYear >= 2026 ? co2 + ch4Co2e + n2oCo2e : co2;
}

/**
 * Preparation-only calculation. It does not replace verifier calculations or Union Registry surrender.
 * Sources: Directive 2003/87/EC maritime scope; Regulation (EU) 2023/1805 Article 4.
 */
export function calculateMaritimePreparation(file: MaritimePreparationFile, euaPriceEur?: number): MaritimeCalculatedResult {
  let totalReportedCo2eTonnes = 0;
  let etsGeographicCo2eTonnes = 0;

  for (const voyage of file.voyages) {
    const mrvCo2e = voyage.co2Tonnes + voyage.ch4TonnesCo2e + voyage.n2oTonnesCo2e;
    totalReportedCo2eTonnes += mrvCo2e;
    const etsGasCo2e = voyageEtsCo2e(file.reportingYear, voyage.co2Tonnes, voyage.ch4TonnesCo2e, voyage.n2oTonnesCo2e);
    etsGeographicCo2eTonnes += etsGasCo2e * etsGeographicFactor(voyage.scope);
  }

  const phase = etsPhaseIn(file.reportingYear);
  const estimatedEuaObligation = etsGeographicCo2eTonnes * phase;
  const estimatedEtsCostEur = typeof euaPriceEur === "number" && euaPriceEur >= 0
    ? estimatedEuaObligation * euaPriceEur
    : null;

  const fueleuEnergyMj = file.fuels.reduce((sum, item) => sum + Math.max(0, item.energyMj), 0);
  const fueleuWtWEmissionsGco2e = file.fuels.reduce((sum, item) => sum + Math.max(0, item.wellToWakeEmissionsGco2e), 0);
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
  };
}

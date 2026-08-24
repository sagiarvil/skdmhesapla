export const CBAM_DEFAULT_VALUES_RULESET = {
  version: "2026-08-10-corrected.1",
  datasetPublishedAt: "2026-08-10",
  correctingAct: "Commission Implementing Regulation (EU) 2026/1740",
  baseAct: "Commission Implementing Regulation (EU) 2025/2621",
  methodologyAct: "Commission Implementing Regulation (EU) 2025/2547",
  freeAllocationAct: "Commission Implementing Regulation (EU) 2025/2620",
  commissionPageUrl:
    "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en",
  correctingActUrl: "https://eur-lex.europa.eu/eli/reg_impl/2026/1740/oj/eng",
  status: "CURRENT_CORRECTED_DATASET",
  corrections: {
    calcinedKaolinicClayTaric: "2507008080",
    whiteClinkerTaric: "2523100010",
    otherClinkerTaric: "2523100090",
    whiteHydraulicCementTaric: "2523900010",
    otherHydraulicCementTaric: "2523900090",
    productionRouteRule:
      "8 haneli CN için benchmark production route tanımlı değilse CBAM benchmark üretim rotasından bağımsızdır.",
    unitsClarified: true,
  },
  markUpBySector: {
    cement: { 2026: 0.1, 2027: 0.2, defaultFrom2028: 0.3 },
    "iron-steel": { 2026: 0.1, 2027: 0.2, defaultFrom2028: 0.3 },
    aluminum: { 2026: 0.1, 2027: 0.2, defaultFrom2028: 0.3 },
    hydrogen: { 2026: 0.1, 2027: 0.2, defaultFrom2028: 0.3 },
    fertilizer: { 2026: 0.01, defaultFrom2027: 0.01 },
  },
  engineBoundary:
    "Komisyon default values ülke/territory + ürün CN/TARIC + doğrudan/dolaylı değer bazında çözülmelidir. Sektör seviyesindeki fallback yoğunlukları resmî Commission default value değildir.",
} as const;

export type CbamDefaultValueSector = keyof typeof CBAM_DEFAULT_VALUES_RULESET.markUpBySector;

export function cbamDefaultValueMarkup(sector: CbamDefaultValueSector, year: number): number {
  const y = Math.max(2026, Math.trunc(year));
  if (sector === "fertilizer") return 0.01;
  if (y === 2026) return 0.1;
  if (y === 2027) return 0.2;
  return 0.3;
}

/**
 * 2026/1740 ile 2507 00 80 genel CN satırı yerine yalnız kalsine kaolinitik kil
 * için TARIC 2507 00 80 80 kullanılmalıdır. 8 haneli giriş tek başına nihai
 * default-value seçimi için yeterli değildir.
 */
export function requiresCalcinedClayTaric(raw: string): boolean {
  const cn = (raw ?? "").replace(/[^0-9]/g, "");
  return cn === "25070080";
}

export function isCorrectedCalcinedClayTaric(raw: string): boolean {
  const cn = (raw ?? "").replace(/[^0-9]/g, "");
  return cn === CBAM_DEFAULT_VALUES_RULESET.corrections.calcinedKaolinicClayTaric;
}

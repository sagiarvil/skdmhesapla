export const EUA_MARKET_SCENARIO_VERSION = "2026-08-25.1";
export const EUA_MARKET_OBSERVED_AT = "2026-08-24";
export const EUA_MARKET_REFERENCE_CLOSE_EUR = 83.8;
export const EUA_MARKET_REFERENCE_INTRADAY_HIGH_EUR = 84.43;

/**
 * Piyasa duyarlılık senaryoları. Bunlar CBAM sertifika fiyatı değildir ve
 * calculateSkdmLiability içindeki hukuki/finansal fiyat ruleset'ini değiştirmez.
 */
export const EUA_MARKET_SCENARIOS = [
  { id: "low", label: "Düşük", priceEurPerTco2: 75 },
  { id: "central", label: "Merkez", priceEurPerTco2: 85 },
  { id: "high", label: "Yüksek", priceEurPerTco2: 100 },
] as const;

export type EuaMarketScenario = (typeof EUA_MARKET_SCENARIOS)[number];

export function calculateEuaMarketSensitivity(input: {
  totalEmissions: number;
  liableEmissions: number;
}) {
  const totalEmissions = Math.max(0, input.totalEmissions || 0);
  const liableEmissions = Math.max(0, input.liableEmissions || 0);

  return {
    version: EUA_MARKET_SCENARIO_VERSION,
    observedAt: EUA_MARKET_OBSERVED_AT,
    referenceCloseEurPerTco2: EUA_MARKET_REFERENCE_CLOSE_EUR,
    referenceIntradayHighEurPerTco2: EUA_MARKET_REFERENCE_INTRADAY_HIGH_EUR,
    centerScenarioEurPerTco2: 85,
    methodologyBoundary:
      "EUA spot/futures fiyatı CBAM sertifika fiyatı değildir. Bu katman yalnız piyasa duyarlılığı gösterir; CBAM sertifika fiyatlama metodolojisi, free allocation adjustment ve üçüncü ülkede ödenmiş karbon fiyatı ayrıca uygulanır.",
    scenarios: EUA_MARKET_SCENARIOS.map((scenario) => ({
      ...scenario,
      grossMarketSensitivityEur: totalEmissions * scenario.priceEurPerTco2,
      adjustedLiabilitySensitivityEur: liableEmissions * scenario.priceEurPerTco2,
    })),
  };
}

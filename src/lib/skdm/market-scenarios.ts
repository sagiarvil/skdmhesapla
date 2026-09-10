export const EUA_MARKET_SCENARIO_VERSION = "2026-09-01.1";
export const EUA_MARKET_OBSERVED_AT = "2026-09-01";
export const EUA_MARKET_REFERENCE_CLOSE_EUR = 82.68;
export const EUA_MARKET_REFERENCE_INTRADAY_HIGH_EUR = 84.72;
export const EUA_MARKET_LATEST_INDICATOR_EUR = 82.71;

/** 1 Eylül 2026 EEX 2026 EU ETS1 açık artırma yapısı parametreleri */
export const EUA_AUCTION_VOLUME_SEP_DEC_2026 = 3699000;
export const EUA_AUCTION_FEE_EUR_PER_500_EUA = 1.73;
export const EUA_AUCTION_PREV_FEE_EUR_PER_500_EUA = 2.38;

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
    latestIndicatorEurPerTco2: EUA_MARKET_LATEST_INDICATOR_EUR,
    auctionVolumeSepDec2026: EUA_AUCTION_VOLUME_SEP_DEC_2026,
    auctionFeeEurPer500Eua: EUA_AUCTION_FEE_EUR_PER_500_EUA,
    centerScenarioEurPerTco2: 85,
    methodologyBoundary:
      "EUA spot/futures fiyatı veya EEX açık artırma takvim parametreleri CBAM sertifika fiyatı değildir. Bu katman yalnız piyasa duyarlılığı ve birincil arz göstergesi sunar; CBAM sertifika fiyatlama metodolojisi, free allocation adjustment ve üçüncü ülkede ödenmiş karbon fiyatı ayrıca uygulanır.",
    scenarios: EUA_MARKET_SCENARIOS.map((scenario) => ({
      ...scenario,
      grossMarketSensitivityEur: totalEmissions * scenario.priceEurPerTco2,
      adjustedLiabilitySensitivityEur: liableEmissions * scenario.priceEurPerTco2,
    })),
  };
}

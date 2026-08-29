import assert from "node:assert/strict";
import {
  EUA_MARKET_REFERENCE_CLOSE_EUR,
  EUA_MARKET_REFERENCE_INTRADAY_HIGH_EUR,
  EUA_MARKET_LATEST_INDICATOR_EUR,
  EUA_MARKET_SCENARIOS,
  calculateEuaMarketSensitivity,
} from "../../src/lib/skdm/market-scenarios";

assert.deepEqual(EUA_MARKET_SCENARIOS.map((x) => x.priceEurPerTco2), [75, 85, 100]);
assert.equal(EUA_MARKET_REFERENCE_CLOSE_EUR, 82.68);
assert.equal(EUA_MARKET_REFERENCE_INTRADAY_HIGH_EUR, 84.72);
assert.equal(EUA_MARKET_LATEST_INDICATOR_EUR, 82.71);

const sensitivity = calculateEuaMarketSensitivity({
  totalEmissions: 100,
  liableEmissions: 2.5,
});

const low = sensitivity.scenarios.find((x) => x.id === "low");
const central = sensitivity.scenarios.find((x) => x.id === "central");
const high = sensitivity.scenarios.find((x) => x.id === "high");

assert.ok(low && central && high);
assert.equal(low.grossMarketSensitivityEur, 7500);
assert.equal(central.grossMarketSensitivityEur, 8500);
assert.equal(high.grossMarketSensitivityEur, 10000);
assert.equal(central.grossMarketSensitivityEur - low.grossMarketSensitivityEur, 1000);
assert.equal(low.adjustedLiabilitySensitivityEur, 187.5);
assert.equal(central.adjustedLiabilitySensitivityEur, 212.5);
assert.equal(high.adjustedLiabilitySensitivityEur, 250);
assert.match(sensitivity.methodologyBoundary, /CBAM sertifika fiyatı değildir/i);

console.log("EUA MARKET SCENARIO REGRESSION PASS — €75 / €85 / €100 sensitivity isolated from CBAM certificate pricing");

/**
 * Faz 0.4 — Annex II + TR-ETS + CN yönlendirme regresyon kapısı.
 * CI: npm run test:regression
 */
import { calculateSkdmLiability } from "../../src/lib/skdm/calculator";
import {
  ANNEX_II_SADECE_DIREKT,
  resolveTrEtsNettingEur,
  SKDM_SECTORS,
} from "../../src/lib/skdm/config";
import {
  hesaplaUrlFromLexicon,
  resolveScopeFromCn,
} from "../../src/lib/skdm/resolve-scope";

let failed = 0;

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ ${msg}`);
    failed++;
  }
}

console.log("=== REGRESSION: Annex II + TR-ETS + CN scope ===\n");

for (const sectorId of ANNEX_II_SADECE_DIREKT) {
  const r = calculateSkdmLiability({
    sectorId,
    productionVolume: 1000,
    year: 2026,
    useCustomEmissions: true,
    customDirectEmission: 1.775,
    customIndirectEmission: 0.475,
    trEtsNettingEur: 22,
    etsQuarter: "2026-Q1",
  });
  assert(
    Math.abs(r.totalEmissions - 1775) < 0.01,
    `${sectorId}: faturaEdilen total=${r.totalEmissions}, expected 1775 (1775+475 değil)`
  );
  assert(r.scope2TotalEmissions === 0, `${sectorId}: scope2 must be 0 for billing`);
  assert(
    SKDM_SECTORS[sectorId]?.scope2DefaultApplicable === false,
    `${sectorId}: scope2DefaultApplicable must be false`
  );
}

for (const sectorId of ["cement", "fertilizer"] as const) {
  const r = calculateSkdmLiability({
    sectorId,
    productionVolume: 1000,
    year: 2026,
    useCustomEmissions: true,
    customDirectEmission: 0.72,
    customIndirectEmission: 0.08,
  });
  assert(
    Math.abs(r.totalEmissions - 800) < 0.01,
    `${sectorId}: both scopes billed, total=${r.totalEmissions}`
  );
}

assert(resolveTrEtsNettingEur(2026, 22) === 0, "TR-ETS 2026 mahsup must be 0");
assert(resolveTrEtsNettingEur(2027, 99) === 0, "TR-ETS 2027 mahsup must be 0");
assert(resolveTrEtsNettingEur(2028, 22) === 22, "TR-ETS 2028 must accept user value");

const alu = resolveScopeFromCn("7610");
assert(
  alu.status === "resolved" && alu.sectorSlug === "aluminyum",
  "CN 7610 → aluminyum"
);

const steel = resolveScopeFromCn("7308");
assert(
  steel.status === "resolved" && steel.sectorSlug === "demir-celik",
  "CN 7308 → demir-celik"
);

const unknown = resolveScopeFromCn("9999");
assert(unknown.status === "out_of_scope", "CN 9999 must not resolve to a sector");

const karmaUrl = hesaplaUrlFromLexicon(["7610"], "AMBIGUOUS", "Karma");
assert(karmaUrl === null, "AMBIGUOUS + Karma must not link to /hesapla/");

const aluUrl = hesaplaUrlFromLexicon(["7610"], "IN", "Karma");
assert(
  aluUrl === "/hesapla/aluminyum/?cn=7610",
  `7610 IN → aluminyum URL, got ${aluUrl}`
);

if (failed > 0) {
  console.error(`\n❌ REGRESSION FAILED: ${failed} assertion(s)`);
  process.exit(1);
}

console.log("\n✅ REGRESSION PASSED: Annex II + TR-ETS + CN scope");

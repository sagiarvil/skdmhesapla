/**
 * Resmi Communication Template Parameters_CNCodes mutabakatı.
 * isClean: false → process.exit(1) → deploy blok.
 */
import official from "../../data/skdm/parameters-cn-codes.json";
import {
  reconcileWithOfficialList,
  matchPrefix,
  SECTORS,
} from "../../src/lib/skdm/annex-ruleset";
import { resolveScopeFromCn } from "../../src/lib/skdm/resolve-scope";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ ${msg}`);
    failed++;
  }
}

console.log("=== CN OFFICIAL RECONCILE (Parameters_CNCodes) ===\n");

assert(official.count === 569, `official.count ${official.count} ≠ 569`);
assert(official.codes.length === 569, `codes.length ${official.codes.length} ≠ 569`);
assert(official.source.sheet === "Parameters_CNCodes", "sheet adı Parameters_CNCodes olmalı");

const report = reconcileWithOfficialList(official.codes, official.knownOutOfScopeSamples);

console.log(`ruleset ${report.rulesetVersion}`);
console.log(`official ${report.officialCount} matched ${report.matchedCount}`);
console.log(`missing ${report.missingFromRuleset.length} extra ${report.extraInRuleset.length}`);
console.log(`isClean ${report.isClean}`);

if (report.missingFromRuleset.length) {
  console.error("missingFromRuleset", report.missingFromRuleset.slice(0, 20));
}
if (report.extraInRuleset.length) {
  console.error("extraInRuleset", report.extraInRuleset);
}

assert(report.isClean, "reconcileWithOfficialList isClean=false — deploy blok");

const alu = resolveScopeFromCn("76109090");
assert(alu.status === "resolved" && alu.sectorSlug === "aluminyum", "7610 → aluminyum");
assert(
  (resolveScopeFromCn("26011200") as { sectorId?: string }).sectorId === "iron-steel",
  "26011200 sinter → iron-steel",
);
assert(resolveScopeFromCn("72041000").status === "out_of_scope", "7204 hurda kapsam dışı");
assert(resolveScopeFromCn("31056000").status === "out_of_scope", "31056000 kapsam dışı");
assert(resolveScopeFromCn("70052980").status === "out_of_scope", "cam kapsam dışı");
assert(matchPrefix("72142000")?.sector === "iron-steel", "7214 → iron-steel");
assert(SECTORS.aluminum.annexIIDirectOnly === true, "alüminyum Annex II direkt-only");
assert(SECTORS.cement.annexIIDirectOnly === false, "çimento endirekt fiyatlanır");

if (failed > 0 || !report.isClean) {
  console.error("\n❌ CN OFFICIAL RECONCILE FAILED");
  process.exit(1);
}
console.log("\n✅ CN OFFICIAL RECONCILE PASSED");

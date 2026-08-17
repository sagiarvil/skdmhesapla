/**
 * Maliyet gösterimi — veri olmadan rakam üretilmez.
 */
import { assessCostReadiness } from "../../src/lib/calc/dataReadiness";
import { estimateCertificateCost } from "../../src/lib/calc/estimateCost";
import { calculateSkdmLiability } from "../../src/lib/skdm/calculator";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL ${msg}`);
    failed++;
  } else {
    console.log(`PASS ${msg}`);
  }
}

const empty = {
  productCategory: null as string | null,
  productionStep: null as string | null,
  energySource: null as string | null,
  totalProductionQty: null as number | null,
};

assert(assessCostReadiness(empty).state === "no_data", "hicbir alan doldurulmadan no_data doner");

const partial = { ...empty, productCategory: "AMB-001" };
assert(assessCostReadiness(partial).state === "partial", "1/4 alan partial");
assert(
  estimateCertificateCost("aluminum", partial, { year: 2026, etsQuarter: "2026-Q1" }) === null,
  "eksik veriyle maliyet hesaplanmaz (onceki hatada 3110.25 donuyordu)",
);

const full = {
  productCategory: "AMB-001",
  productionStep: "EAF",
  energySource: "dogalgaz",
  totalProductionQty: 1000,
};
assert(assessCostReadiness(full).state === "ready", "4/4 ready");

const al = estimateCertificateCost("aluminum", full, { year: 2026, etsQuarter: "2026-Q1", trEtsNettingEur: 0 });
const alOracle = calculateSkdmLiability({
  sectorId: "aluminum",
  productionVolume: 1000,
  year: 2026,
  etsQuarter: "2026-Q1",
  trEtsNettingEur: 0,
}).importerCostEur;
assert(al !== null && Math.abs(al - alOracle) < 0.01, `tam veriyle motor sonucu (${alOracle})`);
assert(Math.abs(alOracle - 3110.25) < 0.01, "alüminyum 1000t varsayılan emisyon = 3110.25 (sessiz 1000 kanıtı)");

const qtyOnly = { ...empty, totalProductionQty: 1000 };
assert(assessCostReadiness(qtyOnly).state === "partial", "yalnız miktar (URL ?tonaj=) partial");
assert(
  estimateCertificateCost("aluminum", qtyOnly, { year: 2026, etsQuarter: "2026-Q1" }) === null,
  "URL tonaj tek basina Euro acmaz",
);

const steel = estimateCertificateCost("iron-steel", full, { year: 2026, etsQuarter: "2026-Q1", trEtsNettingEur: 0 });
assert(steel !== null && Math.abs(steel - 3393) < 0.01, "demir-celik 1000t = 3393.00 (motor, sahte 4241.25 degil)");

if (failed) {
  console.error(`dataReadiness: ${failed} FAIL`);
  process.exit(1);
}
console.log("dataReadiness: PASS");

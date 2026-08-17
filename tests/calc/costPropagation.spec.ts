/**
 * 6 sektörün TAMAMI — tek sektör atlanırsa kırmızı.
 * Motor: calculateSkdmLiability. Gösterim kapısı: estimateCertificateCost.
 */
import fs from "node:fs";
import path from "node:path";
import { estimateCertificateCost } from "../../src/lib/calc/estimateCost";
import { calculateSkdmLiability } from "../../src/lib/skdm/calculator";

const ALL_SECTORS = [
  "iron-steel",
  "aluminum",
  "cement",
  "fertilizer",
  "hydrogen",
  "electricity",
] as const;

const EMPTY = {
  productCategory: null as string | null,
  productionStep: null as string | null,
  energySource: null as string | null,
  totalProductionQty: null as number | null,
};

const PARTIAL = { ...EMPTY, productCategory: "AMB-001" };

const FULL = {
  productCategory: "X",
  productionStep: "Y",
  energySource: "Z",
  totalProductionQty: 1000,
};

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL ${msg}`);
    failed++;
  } else {
    console.log(`PASS ${msg}`);
  }
}

console.log("=== Maliyet gösterimi - 6 sektör ===\n");

for (const sectorId of ALL_SECTORS) {
  const emptyCost = estimateCertificateCost(sectorId, EMPTY, { year: 2026, etsQuarter: "2026-Q1" });
  assert(emptyCost === null, `${sectorId}: boş girdiyle null`);

  const partialCost = estimateCertificateCost(sectorId, PARTIAL, { year: 2026, etsQuarter: "2026-Q1" });
  assert(partialCost === null, `${sectorId}: kısmi girdiyle null`);

  const fullCost = estimateCertificateCost(sectorId, FULL, {
    year: 2026,
    etsQuarter: "2026-Q1",
    trEtsNettingEur: 0,
  });
  const oracle = calculateSkdmLiability({
    sectorId,
    productionVolume: 1000,
    year: 2026,
    etsQuarter: "2026-Q1",
    trEtsNettingEur: 0,
  }).importerCostEur;
  assert(fullCost !== null && typeof fullCost === "number", `${sectorId}: tam girdiyle sayı`);
  assert(fullCost !== null && Math.abs(fullCost - oracle) < 0.01, `${sectorId}: kapı = motor (${oracle})`);
}

const ROOT = process.cwd();
const page = fs.readFileSync(path.join(ROOT, "src/app/hesapla/[sector]/page.tsx"), "utf8");
const wizard = fs.readFileSync(path.join(ROOT, "src/components/wizard/SkdmWizard.tsx"), "utf8");
const fields = JSON.parse(fs.readFileSync(path.join(ROOT, "src/lib/skdm/fieldhelp/fields.json"), "utf8"));
const TIER_A_SLUGS = ["demir-celik", "aluminyum", "cimento", "gubre", "elektrik", "hidrojen"];
for (const slug of TIER_A_SLUGS) {
  assert(page.includes(`"${slug}"`), `/hesapla/${slug}/ TIER_A listesinde`);
}
assert(page.includes("SkdmWizard"), "Kademe A SkdmWizard kullanır");
assert(wizard.includes("EstimatedCostCard"), "sihirbaz EstimatedCostCard bağlar");
assert(!/fmt\(result\.importerCostEur\)/.test(wizard), "mühürde kapısız importerCostEur yok");
assert(!/\|\|\s*1000/.test(wizard), "sihirbazda || 1000 yok");
assert(fields.fields?.tonaj?.default !== 1000, "fields.json tonaj default 1000 değil");

if (failed) {
  console.error(`\ncostPropagation: ${failed} FAIL`);
  process.exit(1);
}
console.log("\ncostPropagation: PASS (6/6 sektör)");

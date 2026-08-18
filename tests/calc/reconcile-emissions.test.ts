/**
 * GATE-A (RM-006) — Emisyon Mutabakatı.
 *
 * 1) Rastgele 20 senaryo: her birinde Σ(satır hesapları) === totalEmissions (kuruşu kuruşuna).
 * 2) SEAL-2026-DC-7782 senaryosu satır satır yeniden üretilir — 1.775,00 sayısı
 *    artık akış register'ından türetilen düzeltilmiş sayıyla değiştirilmiştir.
 * 3) Fail-closed: mutabakatı bozulmuş sonuçla mühürleme ATMALI.
 *
 * Deterministik: sabit tohumlu PRNG — aynı koşumda aynı senaryolar.
 */
import {
  calculateSkdmLiability,
  type StreamInput,
} from "../../src/lib/skdm/calculator";
import {
  createSealedAuditPackage,
  sealedFileBytes,
} from "../../src/lib/skdm/package-seal";
import { getTestSealedPackage } from "../../src/lib/skdm/test-user-packages";

const SECTORS = [
  "iron-steel",
  "aluminum",
  "cement",
  "fertilizer",
  "hydrogen",
  "electricity",
] as const;

const FUELS = ["Doğalgaz", "Kok / kömür", "Taş kömürü", "Motorin", "LPG"] as const;
const PRECURSOR_POOL = [
  { name: "Demir cevheri pelet", see: 0.08 },
  { name: "Hurda çelik", see: 0.02 },
  { name: "Ferroalyaj", see: 1.15 },
  { name: "Alumina", see: 0.45 },
  { name: "Klinker", see: 0.6 },
  { name: "Amonyak", see: 2.9 },
] as const;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rnd: () => number, min: number, max: number): number {
  return Math.floor(rnd() * (max - min + 1)) + min;
}

function randomStreams(rnd: () => number, count: number): StreamInput[] {
  const out: StreamInput[] = [];
  for (let i = 0; i < count; i++) {
    const r = rnd();
    if (r < 0.5) {
      const fuel = FUELS[randInt(rnd, 0, FUELS.length - 1)];
      out.push({
        method: "Combustion",
        name: fuel,
        ad: randInt(rnd, 100, 3000),
        unit: "GJ",
        ncv: (25 + rnd() * 25).toFixed(1),
        processId: `p${i + 1}`,
      });
    } else if (r < 0.7) {
      out.push({
        method: "MassBalance",
        name: "Proses emisyonu",
        ad: randInt(rnd, 50, 800),
        unit: "tCO2e",
        ncv: "-",
        processId: `p${i + 1}`,
      });
    } else {
      out.push({
        method: "PurchasedElectricity",
        name: "Şebeke elektriği",
        ad: randInt(rnd, 100, 4000),
        unit: "MWh",
        ncv: "-",
        processId: `p${i + 1}`,
      });
    }
  }
  return out;
}

function runScenario(seed: number, streamCount: number, precursorCount: number) {
  const rnd = mulberry32(seed);
  const sectorId = SECTORS[randInt(rnd, 0, SECTORS.length - 1)];
  const volume = randInt(rnd, 50, 5000);
  const streams = randomStreams(rnd, streamCount);
  const precursors = Array.from({ length: precursorCount }, () => {
    const p = PRECURSOR_POOL[randInt(rnd, 0, PRECURSOR_POOL.length - 1)];
    return { name: p.name, total: randInt(rnd, 10, 2000), see: p.see };
  });
  return calculateSkdmLiability({
    sectorId,
    productionVolume: volume,
    year: 2026,
    importerAnnualVolumeStatus: "over50",
    useCustomEmissions: true,
    hasVerificationEvidence: true,
    streams,
    precursors,
  });
}

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL ${msg}`);
    failed++;
  } else {
    console.log(`PASS ${msg}`);
  }
}

// --- 1) 20 rastgele senaryoda mutabakat ---
for (let i = 0; i < 20; i++) {
  const streamCount = i % 5; // 0-4 akış (0 → varsayılan fallback dahil)
  const precursorCount = i % 4;
  const res = runScenario(i * 7919 + 1, streamCount, precursorCount);
  const sum = res.emissionSteps.reduce((a, s) => a + s.emissions, 0);
  const exact = Math.abs(sum - res.totalEmissions) < 1e-9;
  assert(
    res.emissionSteps.length > 0,
    `senaryo ${i + 1} (${res.sector.id}, ${streamCount} akış): steps üretildi`
  );
  assert(
    exact,
    `senaryo ${i + 1}: Σ(steps)=${sum.toFixed(2)} === total=${res.totalEmissions.toFixed(2)}`
  );
  const kindsOk = res.emissionSteps.every((s) =>
    ["combustion", "process", "electricity", "precursor", "benchmark"].includes(s.kind)
  );
  assert(kindsOk, `senaryo ${i + 1}: adım türleri geçerli`);
}

// --- 2) SEAL-2026-DC-7782 satır satır yeniden üretim ---
const pkg = getTestSealedPackage("SEAL-2026-DC-7782");
assert(pkg !== null, "SEAL-2026-DC-7782 paketi üretilebildi");
if (!pkg) process.exit(1);
const file5 = pkg.files.find((f) => f.filename === "Hesaplama-Izi.json");
assert(Boolean(file5), "Hesaplama-Izi.json pakette mevcut");
if (!file5) process.exit(1);
const izi = JSON.parse(new TextDecoder().decode(sealedFileBytes(file5)));
assert(
  izi.reconciliation?.equals === true,
  `Hesaplama-Izi mutabakatı equals=true (Σ=${izi.reconciliation?.stepSumTco2e})`
);
assert(Array.isArray(izi.steps) && izi.steps.length >= 4, `steps[] dolu (${izi.steps?.length} adım)`);
assert(
  izi.outputs.totalEmissions !== 1775,
  `düzeltilmiş toplam artık 1775 değil (${izi.outputs.totalEmissions} tCO2e)`
);
assert(
  izi.outputs.emissionDataQuality === "dogrudan-olcum",
  "veri kalitesi: doğrudan ölçüm (akışlardan türetildi)"
);
console.log("\n--- SEAL-2026-DC-7782 SATIR BAZLI MUTABAKAT ---");
for (const s of izi.steps) {
  console.log(`  [${s.stepNo}] ${s.kind} | ${s.stream} | ${s.formula} => ${s.resultTco2e} tCO2e`);
  console.log(`        kaynak: ${s.factorSource}`);
}
console.log(`  TOPLAM: ${izi.outputs.totalEmissions} tCO2e (Σ=${izi.reconciliation.stepSumTco2e})`);
console.log(`  ÖNCÜL GÖMÜLÜ: ${izi.outputs.precursorEmbeddedEmissions} tCO2e`);
console.log(`  AB varsayılanı: ${pkg.manifesto.usedEtsPrice} EUR/tCO2e | paket: ${pkg.packageId}\n`);

// --- 3) Fail-closed: mutabakatı bozulmuş sonuç mühürlenemez ---
const base = runScenario(4242, 3, 2);
const tampered = { ...base, totalEmissions: base.totalEmissions + 10 };
let threw = false;
try {
  createSealedAuditPackage(tampered, {
    sessionId: "sess-failclosed",
    sectorSlug: "demir-celik",
    fieldValues: { vFirma: "Fail Kapali Metal A.Ş.", vkn: "1000036109" },
    goods: [{ id: "g1", category: "test", cn: "7208 39 00", route: "BF-BOF" }],
    processes: [{ id: "p1", name: "test", included: [] }],
    streams: [],
    precs: [],
    dProcesses: { a: 1, b: 1, c: 0, d: 0 },
  });
} catch {
  threw = true;
}
assert(threw, "fail-closed: mutabakatsız sonuç mühürlenmeyi reddeder");

if (failed > 0) {
  console.error(`\n${failed} kontrol BAŞARISIZ`);
  process.exit(1);
}
console.log("\nreconcile-emissions: TÜM KONTROLLER GEÇTİ (GATE-A)");

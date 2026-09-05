import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import type { MaritimePreparationFile, MaritimeFuelRecord, MaritimeVoyageRecord } from "../../src/lib/maritime/types";

const requireFromFunctions = createRequire(new URL("../../functions/package.json", import.meta.url));
const { initializeApp, cert, getApps } = requireFromFunctions("firebase-admin/app");
const { getAuth } = requireFromFunctions("firebase-admin/auth");
const { getFirestore } = requireFromFunctions("firebase-admin/firestore");
const { getStorage } = requireFromFunctions("firebase-admin/storage");
const { canonicalHash, buildEvidenceChainHash, buildRetention, EVIDENCE_BY_KEY } = requireFromFunctions("./maritime-evidence-core.js");
const { auditPreparationFile, RULESET_ID } = requireFromFunctions("./maritime-compliance-audit-v1.js");

const PROJECT_ID = "carbon-web-1265b";
const BUCKET = "carbon-web-1265b-maritime-evidence";
const TEST_EMAIL = process.env.TEB232_TEST_EMAIL || "teb232@gmail.com";
const SEED_KEY = "teb232-visible-regression-scenarios-v1";
const YEAR = 2026 as const;
const REQUIRED_EVIDENCE = [
  "ship-registry", "tonnage-certificate", "class-certificate", "company-registry",
  "administering-authority", "union-registry-moha", "verifier-accreditation",
  "monitoring-plan", "voyage-list", "port-call-register", "rob-register", "logbook",
  "bdn", "distance-time", "factors",
] as const;

type Scenario = {
  id: string;
  name: string;
  imo: string;
  expectedMissing: string;
  mutateFile?: (file: MaritimePreparationFile) => void;
  omitEvidence?: string[];
  corruptEvidence?: string[];
  extraEvidence?: string[];
};

function sha256(value: string | Buffer) { return crypto.createHash("sha256").update(value).digest("hex"); }
function nowIso() { return new Date().toISOString(); }

function baseVoyage(): MaritimeVoyageRecord {
  return {
    id: "V-2026-1", departurePort: "Ambarli", departureUnlocode: "TRAMB", departureAt: "2026-01-01T00:00:00Z",
    arrivalPort: "Genoa", arrivalUnlocode: "ITGOA", arrivalAt: "2026-01-04T00:00:00Z", scope: "eu-eea-third",
    portCallPurpose: "Commercial cargo operation", exclusionReason: "", distanceNm: 1250, timeAtSeaHours: 72, timeAtBerthHours: 12,
    anchorageHours: 0, cargoTonnes: 7500, passengers: 0, transportWorkTonneNm: 9375000,
    co2Tonnes: 100, ch4TonnesCo2e: 10, n2oTonnesCo2e: 5, fuelTonnes: 100, dataGap: false, dataGapReason: "",
  };
}

function baseFuel(): MaritimeFuelRecord {
  return {
    id: "F-2026-1", scope: "eu-eea-third", portName: "", portUnlocode: "", terminalBerth: "", fuelType: "VLSFO",
    fuelConsumer: "Main engines", bdnReference: "BDN-TEB232-SCN-001", sustainabilityCertificate: "", quantityTonnes: 100,
    lowerCalorificValueMjPerTonne: 41000, energyMj: 4100000, atBerthEnergyMj: 0, wellToTankFactorGco2ePerMj: 13.5,
    tankToWakeCo2Factor: 3.114, tankToWakeCh4Factor: 0, tankToWakeN2oFactor: 0, slipFactor: 0,
    wellToWakeEmissionsGco2e: 366750000, opsElectricityKwh: 0, opsConnectionHours: 0, opsPeakPowerKw: 0,
    opsExceptionReference: "", zeroEmissionEnergyMj: 0, substituteEnergyMj: 0, windRewardFactor: 1, rfNboEnergyMj: 0,
    measurementMethod: "BDN + tank", calibrationReference: "", factorSourceReference: "EU-2023-1805 Annex II",
  };
}

function fixture(name: string, imo: string): MaritimePreparationFile {
  return {
    reportingYear: YEAR,
    company: {
      companyName: "TEB232 Test Shipping A.Ş.", role: "gemi-sahibi", imoCompanyNumber: "IMO-COMP-TEB232",
      registeredOwnerName: "TEB232 Test Shipping A.Ş.", registeredOwnerImoNumber: "IMO-COMP-TEB232", country: "TR",
      address: "İstanbul, Türkiye", contactName: "TEB232 Test Operator", contactEmail: TEST_EMAIL, telephone: "+90 212 000 0232",
      administeringAuthority: "TEB232 TEST — evidence-backed administering authority", formalMandateReference: "",
      responsibilityFrom: "2026-01-01", responsibilityTo: "2026-12-31",
    },
    verifier: { verifierName: "TEB232 Test Verifier Legal Entity", accreditationNumber: "TEST-ACC-232", address: "EU", contactEmail: "verifier-test@example.invalid" },
    ship: {
      shipName: name, imoNumber: imo, portOfRegistry: "Istanbul", homePort: "Istanbul", flagState: "TR", shipType: "cargo",
      officialCategory: "Container ship", deadweightTonnes: 10000, grossTonnage: 12000, classificationSociety: "TEB232 Test Class",
      iceClass: "", technicalEfficiencyType: "EEXI", technicalEfficiencyValue: "18.70",
      description: `[${SEED_KEY}] durable blocked-regression scenario; synthetic QA only`,
    },
    monitoring: {
      monitoringPlanVersion: "MP-2026-TEB232-SCN-v1", monitoringPlanReferenceDate: "2026-01-01", monitoringPlanAssessed: false, monitoringPlanApproved: false,
      revisionNotes: "Durable visible regression scenario", fuelMonitoringMethod: "BDN + tank", densityMethod: "BDN density at 15°C",
      uncertaintyMethod: "annual reconciliation", uncertaintyPercent: 0.5, emissionFactorMethod: "EU legal factors",
      dataGapMethod: "surrogate procedure", voyageCompletenessProcedure: "port-call reconciliation", emissionSources: ["Main engines"],
      measurementEquipment: "Tank sounding tables", itSystem: "SKDMhesapla test evidence chain", proceduresReference: "PROC-2026-TEB232-SCN",
    },
    voyages: [baseVoyage()],
    fuels: [baseFuel()],
    ice: { exclusionClaimed: false, entryUtc: "", exitUtc: "", distanceInIceNm: 0, fuelInIceTonnes: 0, totalDistanceNm: 0, evidenceReference: "" },
    flexibility: { bankingRequested: false, borrowingRequested: false, poolingPlanned: false, previousBankedSurplusReference: "", poolReference: "" },
    evidence: {}, evidenceReferences: {},
  };
}

const scenarios: Scenario[] = [
  { id: "teb232-scn-missing-registry", name: "SCN 01 · BLOCK · Ship Registry Eksik", imo: "1111117", expectedMissing: "Binary evidence: ship-registry", omitEvidence: ["ship-registry"] },
  { id: "teb232-scn-fuel-reconcile", name: "SCN 02 · BLOCK · Yakıt Mutabakatı", imo: "2222224", expectedMissing: "Annual fuel reconciliation", mutateFile: (f) => { f.voyages[0].fuelTonnes = 95; } },
  { id: "teb232-scn-wtw-mismatch", name: "SCN 03 · BLOCK · WtW Uyuşmazlığı", imo: "3333331", expectedMissing: "WtW comparator", mutateFile: (f) => { f.fuels[0].wellToWakeEmissionsGco2e = 1; } },
  { id: "teb232-scn-energy-mismatch", name: "SCN 04 · BLOCK · Quantity×LCV Uyuşmazlığı", imo: "4444448", expectedMissing: "quantity × LCV", mutateFile: (f) => { f.fuels[0].energyMj = 4000000; } },
  { id: "teb232-scn-moha-missing", name: "SCN 05 · BLOCK · MOHA Kanıtı Eksik", imo: "5555555", expectedMissing: "Binary evidence: union-registry-moha", omitEvidence: ["union-registry-moha"] },
  { id: "teb232-scn-entity-collision", name: "SCN 06 · BLOCK · Tüzel Kişi Çakışması", imo: "6666662", expectedMissing: "Distinct legal names sharing one IMO", mutateFile: (f) => { f.company.registeredOwnerName = "Different Registered Owner Ltd."; } },
  { id: "teb232-scn-duplicate-voyage", name: "SCN 07 · BLOCK · Duplicate Voyage ID", imo: "7777779", expectedMissing: "unique voyage ID", mutateFile: (f) => { const v = { ...baseVoyage(), departurePort: "Genoa", departureUnlocode: "ITGOA", departureAt: "2026-01-05T00:00:00Z", arrivalPort: "Ambarli", arrivalUnlocode: "TRAMB", arrivalAt: "2026-01-08T00:00:00Z", fuelTonnes: 0, co2Tonnes: 0, ch4TonnesCo2e: 0, n2oTonnesCo2e: 0, transportWorkTonneNm: 0 }; f.voyages.push(v); } },
  { id: "teb232-scn-ops-mismatch", name: "SCN 08 · BLOCK · OPS kWh↔MJ", imo: "8888886", expectedMissing: "OPS kWh must reconcile", extraEvidence: ["electricity"], mutateFile: (f) => { f.fuels.push({ ...baseFuel(), id: "OPS-2026-1", scope: "at-eu-eea-port", fuelType: "OPS electricity", fuelConsumer: "Shore connection", bdnReference: "", quantityTonnes: 0, lowerCalorificValueMjPerTonne: 0, energyMj: 1000, wellToTankFactorGco2ePerMj: 0, tankToWakeCo2Factor: 0, tankToWakeCh4Factor: 0, tankToWakeN2oFactor: 0, slipFactor: 0, wellToWakeEmissionsGco2e: 0, opsElectricityKwh: 100, opsConnectionHours: 1, portName: "Genoa", portUnlocode: "ITGOA", terminalBerth: "T1", measurementMethod: "meter", factorSourceReference: "electricity evidence" }); } },
  { id: "teb232-scn-integrity-fail", name: "SCN 09 · BLOCK · Evidence Integrity", imo: "9999993", expectedMissing: "Binary evidence: ship-registry", corruptEvidence: ["ship-registry"] },
];

async function main() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON required");
  const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(JSON.parse(raw)), projectId: PROJECT_ID, storageBucket: BUCKET });
  const auth = getAuth(app), db = getFirestore(app), bucket = getStorage(app).bucket(BUCKET);
  const user = await auth.getUserByEmail(TEST_EMAIL);
  const homeRef = db.collection("maritimeUserHomes").doc(user.uid);
  const homeSnap = await homeRef.get();
  assert.ok(homeSnap.exists, "TEB232 maritime home must exist before scenario seeding");
  const companyId = String(homeSnap.data()?.companyId || "");
  const fleetId = String(homeSnap.data()?.fleetId || "primary");
  assert.ok(companyId, "TEB232 companyId missing");
  const ts = nowIso();
  const shipsRef = db.collection("companies").doc(companyId).collection("maritimeFleets").doc(fleetId).collection("ships");

  const created: Array<{ shipId: string; name: string; score: number; missing: string[] }> = [];
  for (const spec of scenarios) {
    const existingRef = shipsRef.doc(spec.id);
    await bucket.deleteFiles({ prefix: `maritime-evidence/records/${companyId}/${fleetId}/${spec.id}/` }).catch(() => {});
    await bucket.deleteFiles({ prefix: `maritime-evidence/_tmp/${companyId}/${fleetId}/${spec.id}/` }).catch(() => {});
    await db.recursiveDelete(existingRef).catch(() => {});

    const file = fixture(spec.name, spec.imo);
    spec.mutateFile?.(file);
    const shipRef = shipsRef.doc(spec.id);
    const yearRef = shipRef.collection("reportingYears").doc(String(YEAR));
    const syncId = `scenario-${spec.id}-v1`;
    const dataHash = canonicalHash({ schemaVersion: "maritime-enterprise-v2", rulesetId: RULESET_ID, file });

    await shipRef.set({ ...file.ship, schemaVersion: "maritime-enterprise-v2", status: "active", currentReportingYear: YEAR, demoSeedKey: SEED_KEY, demoScenario: spec.name, visibleInTestAccount: true, expectedState: "blocked", updatedAt: ts, updatedBy: user.uid }, { merge: false });
    await yearRef.set({ schemaVersion: "maritime-enterprise-v2", rulesetId: RULESET_ID, reportingYear: YEAR, status: "draft", revision: 1, legalHold: false, activeSyncId: syncId, dataHash, companySnapshot: file.company, verifierSnapshot: file.verifier, shipSnapshot: file.ship, monitoring: file.monitoring, ice: file.ice, flexibility: file.flexibility, rowCounts: { voyages: file.voyages.length, fuels: file.fuels.length, evidence: 0 }, createdAt: ts, createdBy: user.uid, updatedAt: ts, updatedBy: user.uid }, { merge: false });

    for (const [index, row] of file.voyages.entries()) await yearRef.collection("voyages").doc(`${syncId}-v-${index + 1}`).set({ syncId, orderIndex: index, sourceId: row.id, payload: row, recordHash: canonicalHash(row), createdAt: ts, createdBy: user.uid, immutable: true });
    for (const [index, row] of file.fuels.entries()) await yearRef.collection("fuels").doc(`${syncId}-f-${index + 1}`).set({ syncId, orderIndex: index, sourceId: row.id, payload: row, recordHash: canonicalHash(row), createdAt: ts, createdBy: user.uid, immutable: true });

    const evidenceTypes = [...REQUIRED_EVIDENCE, ...(spec.extraEvidence || [])].filter((key, index, list) => !spec.omitEvidence?.includes(key) && list.indexOf(key) === index);
    let chainHead: string | null = null;
    const evidenceDocs: any[] = [];
    for (const [index, documentType] of evidenceTypes.entries()) {
      const registry = EVIDENCE_BY_KEY.get(documentType);
      assert.ok(registry, `evidence registry missing ${documentType}`);
      const evidenceId = `scenario-${spec.id}-${String(index + 1).padStart(2, "0")}-${documentType}`;
      const originalName = `${documentType}-${YEAR}.txt`;
      const body = Buffer.from(`TEB232 DURABLE REGRESSION SCENARIO\nSeed ${SEED_KEY}\nScenario ${spec.name}\nType ${documentType}\nSynthetic QA only\n`, "utf8");
      const objectPath = `maritime-evidence/records/${companyId}/${fleetId}/${spec.id}/${YEAR}/${evidenceId}/${originalName}`;
      const hash = sha256(body);
      await bucket.file(objectPath).save(body, { resumable: false, metadata: { contentType: "text/plain", cacheControl: "private, max-age=0, no-store" } });
      const baseRecord = { schemaVersion: "maritime-evidence-v3", rulesetId: RULESET_ID, evidenceId, immutable: true, companyId, fleetId, shipId: spec.id, reportingYear: YEAR, documentType, documentLabel: registry.label, legalBasis: registry.legalBasis, criticality: registry.criticality, originalName, contentType: "text/plain", size: body.length, documentDate: `${YEAR}-01-04`, sourceName: "TEB232 durable regression fixture", sourceReference: `${SEED_KEY}:${spec.id}:${documentType}`, notes: "Synthetic QA evidence; test account only.", supports: registry.defaultSupports || [], linkedVoyageIds: [], linkedFuelIds: [], supportRevision: 1, supportDataHash: dataHash, finalizedAgainstRevision: 1, finalizedAgainstDataHash: dataHash, sha256: hash, crc32c: null, md5Hash: null, storageGeneration: null, storageMetageneration: null, objectPath, storageBucket: BUCKET, contentValidation: "seeded-test-fixture+sha256", integrityStatus: spec.corruptEvidence?.includes(documentType) ? "failed" : "verified-at-ingest", retention: buildRetention(YEAR), previousEvidenceChainHash: chainHead, finalizedAt: ts, finalizedBy: user.uid };
      const evidenceChainHash = buildEvidenceChainHash(chainHead, baseRecord);
      const record = { ...baseRecord, evidenceChainHash };
      await yearRef.collection("evidenceDocuments").doc(evidenceId).set(record);
      evidenceDocs.push(record);
      chainHead = evidenceChainHash;
    }

    const audit = auditPreparationFile(file, evidenceDocs);
    assert.equal(audit.ready, false, `${spec.id} unexpectedly became ready`);
    assert.ok(audit.score <= 49, `${spec.id} score must stay fail-closed`);
    assert.ok(audit.missing.some((x: string) => x.includes(spec.expectedMissing)), `${spec.id} missing expected blocker: ${spec.expectedMissing}\n${JSON.stringify(audit.missing)}`);
    const manifestHash = canonicalHash(evidenceDocs.map((doc) => ({ evidenceId: doc.evidenceId, documentType: doc.documentType, sha256: doc.sha256, evidenceChainHash: doc.evidenceChainHash, integrityStatus: doc.integrityStatus })));
    const snapshotHash = canonicalHash({ product: "SKDMhesapla Maritime Regression Scenario", schemaVersion: "maritime-enterprise-v2", rulesetId: RULESET_ID, sourceRevision: 1, sourceHash: dataHash, evidenceManifestHash: manifestHash, evidenceChainHead: chainHead, file, scenario: spec.id, type: "checkpoint" });
    const versionId = `checkpoint-${spec.id}`;
    await yearRef.collection("versions").doc(versionId).set({ versionId, type: "checkpoint", immutable: true, schemaVersion: "maritime-enterprise-v2", rulesetId: RULESET_ID, snapshotHash, sourceHash: dataHash, sourceRevision: 1, activeSyncId: syncId, companySnapshot: file.company, verifierSnapshot: file.verifier, shipSnapshot: file.ship, monitoring: file.monitoring, ice: file.ice, flexibility: file.flexibility, rowCounts: { voyages: file.voyages.length, fuels: file.fuels.length, evidence: evidenceDocs.length }, evidenceManifestHash: manifestHash, evidenceChainHead: chainHead, evidenceDocumentCount: evidenceDocs.length, readiness: { ready: false, score: audit.score, missing: audit.missing, strictAudit: audit }, createdAt: ts, createdBy: user.uid });
    await yearRef.set({ evidenceChainHead: chainHead, evidenceDocumentCount: evidenceDocs.length, lastSnapshotVersion: versionId, lastSnapshotHash: snapshotHash, strictAudit: audit, expectedScenarioState: "blocked", updatedAt: ts, updatedBy: user.uid }, { merge: true });
    created.push({ shipId: spec.id, name: spec.name, score: audit.score, missing: audit.missing });
  }

  console.log(JSON.stringify({ ok: true, seedKey: SEED_KEY, account: TEST_EMAIL, created }, null, 2));
}

main().catch((error) => { console.error("[TEB232 VISIBLE REGRESSION SCENARIOS]", error?.stack || error); process.exitCode = 1; });

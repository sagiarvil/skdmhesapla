import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import type { MaritimePreparationFile } from "../../src/lib/maritime/types";

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
const SEED_KEY = "teb232-visible-strict-reports-v2-stable";
const FLEET_ID = "teb232-visible-fleet";
const REQUIRED_EVIDENCE = [
  "ship-registry", "tonnage-certificate", "class-certificate", "company-registry",
  "administering-authority", "union-registry-moha", "verifier-accreditation",
  "monitoring-plan", "voyage-list", "port-call-register", "rob-register", "logbook",
  "bdn", "distance-time", "factors",
] as const;

function sha256(value: string | Buffer) { return crypto.createHash("sha256").update(value).digest("hex"); }
function nowIso() { return new Date().toISOString(); }

function fixture(year: 2025 | 2026, shipName: string, imoNumber: string): MaritimePreparationFile {
  return {
    reportingYear: year,
    company: {
      companyName: "TEB232 Test Shipping A.Ş.", role: "gemi-sahibi", imoCompanyNumber: "IMO-COMP-TEB232",
      registeredOwnerName: "TEB232 Test Shipping A.Ş.", registeredOwnerImoNumber: "IMO-COMP-TEB232", country: "TR",
      address: "İstanbul, Türkiye", contactName: "TEB232 Test Operator", contactEmail: TEST_EMAIL, telephone: "+90 212 000 0232",
      administeringAuthority: "TEB232 TEST — evidence-backed administering authority", formalMandateReference: "",
      responsibilityFrom: `${year}-01-01`, responsibilityTo: `${year}-12-31`,
    },
    verifier: { verifierName: "TEB232 Test Verifier Legal Entity", accreditationNumber: "TEST-ACC-232", address: "EU", contactEmail: "verifier-test@example.invalid" },
    ship: {
      shipName, imoNumber, portOfRegistry: "Istanbul", homePort: "Istanbul", flagState: "TR", shipType: "cargo",
      officialCategory: "Container ship", deadweightTonnes: 10000, grossTonnage: 12000, classificationSociety: "TEB232 Test Class",
      iceClass: "", technicalEfficiencyType: "EEXI", technicalEfficiencyValue: "18.70",
      description: `[${SEED_KEY}] stable visible 100/100 pre-verification QA fixture`,
    },
    monitoring: {
      monitoringPlanVersion: `MP-${year}-TEB232-v2`, monitoringPlanReferenceDate: `${year}-01-01`, monitoringPlanAssessed: false, monitoringPlanApproved: false,
      revisionNotes: "Stable visible strict QA fixture", fuelMonitoringMethod: "BDN + tank", densityMethod: "BDN density at 15°C",
      uncertaintyMethod: "annual reconciliation", uncertaintyPercent: 0.5, emissionFactorMethod: "EU legal factors",
      dataGapMethod: "surrogate procedure", voyageCompletenessProcedure: "port-call reconciliation", emissionSources: ["Main engines"],
      measurementEquipment: "Tank sounding tables", itSystem: "SKDMhesapla test evidence chain", proceduresReference: `PROC-${year}-TEB232`,
    },
    voyages: [{
      id: `V-${year}-1`, departurePort: "Ambarli", departureUnlocode: "TRAMB", departureAt: `${year}-01-01T00:00:00Z`,
      arrivalPort: "Genoa", arrivalUnlocode: "ITGOA", arrivalAt: `${year}-01-04T00:00:00Z`, scope: "eu-eea-third",
      portCallPurpose: "Commercial cargo operation", exclusionReason: "", distanceNm: 1250, timeAtSeaHours: 72, timeAtBerthHours: 12,
      anchorageHours: 0, cargoTonnes: 7500, passengers: 0, transportWorkTonneNm: 9375000,
      co2Tonnes: 100, ch4TonnesCo2e: 10, n2oTonnesCo2e: 5, fuelTonnes: 100, dataGap: false, dataGapReason: "",
    }],
    fuels: [{
      id: `F-${year}-1`, scope: "eu-eea-third", portName: "", portUnlocode: "", terminalBerth: "", fuelType: "VLSFO",
      fuelConsumer: "Main engines", bdnReference: `BDN-TEB232-${year}-001`, sustainabilityCertificate: "", quantityTonnes: 100,
      lowerCalorificValueMjPerTonne: 41000, energyMj: 4100000, atBerthEnergyMj: 0, wellToTankFactorGco2ePerMj: 13.5,
      tankToWakeCo2Factor: 3.114, tankToWakeCh4Factor: 0, tankToWakeN2oFactor: 0, slipFactor: 0,
      wellToWakeEmissionsGco2e: 366750000, opsElectricityKwh: 0, opsConnectionHours: 0, opsPeakPowerKw: 0,
      opsExceptionReference: "", zeroEmissionEnergyMj: 0, substituteEnergyMj: 0, windRewardFactor: 1, rfNboEnergyMj: 0,
      measurementMethod: "BDN + tank", calibrationReference: "", factorSourceReference: "EU-2023-1805 Annex II",
    }],
    ice: { exclusionClaimed: false, entryUtc: "", exitUtc: "", distanceInIceNm: 0, fuelInIceTonnes: 0, totalDistanceNm: 0, evidenceReference: "" },
    flexibility: { bankingRequested: false, borrowingRequested: false, poolingPlanned: false, previousBankedSurplusReference: "", poolReference: "" },
    evidence: {}, evidenceReferences: {},
  };
}

async function main() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON required");
  const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(JSON.parse(raw)), projectId: PROJECT_ID, storageBucket: BUCKET });
  const auth = getAuth(app), db = getFirestore(app), bucket = getStorage(app).bucket(BUCKET);
  const user = await auth.getUserByEmail(TEST_EMAIL);
  const companyId = `teb232-visible-${sha256(user.uid).slice(0, 20)}`;
  const fleetId = FLEET_ID;
  const ts = nowIso();

  const companyRef = db.collection("companies").doc(companyId);
  await companyRef.set({ schemaVersion: "maritime-enterprise-v2", name: "TEB232 Visible Maritime QA Workspace", ownerId: user.uid, members: [user.uid], status: "active", durableVisibleTestWorkspace: true, updatedAt: ts, updatedBy: user.uid }, { merge: true });
  await companyRef.collection("members").doc(user.uid).set({ uid: user.uid, role: "owner", active: true, durableVisibleTestWorkspace: true, updatedAt: ts, updatedBy: user.uid }, { merge: true });
  const fleetRef = companyRef.collection("maritimeFleets").doc(fleetId);
  await fleetRef.set({ schemaVersion: "maritime-enterprise-v2", name: "TEB232 Visible Test Fleet", status: "active", durableVisibleTestWorkspace: true, updatedAt: ts, updatedBy: user.uid }, { merge: true });
  const shipsRef = fleetRef.collection("ships");

  const specs = [
    { year: 2025 as const, shipId: "teb232-strict-2025", shipName: "TEB232 STRICT 2025", imo: "1234567", scenario: "2025 ETS phase-in + MRV + FuelEU" },
    { year: 2026 as const, shipId: "teb232-strict-2026", shipName: "TEB232 STRICT 2026", imo: "7654329", scenario: "2026 full ETS + MRV + FuelEU" },
  ];

  const created: Array<{ shipId: string; year: number; shipName: string; score: number; snapshotHash: string }> = [];
  for (const spec of specs) {
    const shipRef = shipsRef.doc(spec.shipId);
    await bucket.deleteFiles({ prefix: `maritime-evidence/records/${companyId}/${fleetId}/${spec.shipId}/` }).catch(() => {});
    await bucket.deleteFiles({ prefix: `maritime-evidence/_tmp/${companyId}/${fleetId}/${spec.shipId}/` }).catch(() => {});
    await db.recursiveDelete(shipRef).catch(() => {});

    const file = fixture(spec.year, spec.shipName, spec.imo);
    const yearRef = shipRef.collection("reportingYears").doc(String(spec.year));
    const syncId = `seed-${spec.year}-stable-v2`;
    const dataHash = canonicalHash({ schemaVersion: "maritime-enterprise-v2", rulesetId: RULESET_ID, file });

    await shipRef.set({ ...file.ship, schemaVersion: "maritime-enterprise-v2", status: "active", currentReportingYear: spec.year, demoSeedKey: SEED_KEY, demoScenario: spec.scenario, visibleInTestAccount: true, expectedState: "ready", updatedAt: ts, updatedBy: user.uid }, { merge: false });
    await yearRef.set({ schemaVersion: "maritime-enterprise-v2", rulesetId: RULESET_ID, reportingYear: spec.year, status: "draft", revision: 1, legalHold: false, activeSyncId: syncId, dataHash, companySnapshot: file.company, verifierSnapshot: file.verifier, shipSnapshot: file.ship, monitoring: file.monitoring, ice: file.ice, flexibility: file.flexibility, rowCounts: { voyages: 1, fuels: 1, evidence: REQUIRED_EVIDENCE.length }, createdAt: ts, createdBy: user.uid, updatedAt: ts, updatedBy: user.uid }, { merge: false });
    await yearRef.collection("voyages").doc(`${syncId}-v-1`).set({ syncId, orderIndex: 0, sourceId: file.voyages[0].id, payload: file.voyages[0], recordHash: canonicalHash(file.voyages[0]), createdAt: ts, createdBy: user.uid, immutable: true });
    await yearRef.collection("fuels").doc(`${syncId}-f-1`).set({ syncId, orderIndex: 0, sourceId: file.fuels[0].id, payload: file.fuels[0], recordHash: canonicalHash(file.fuels[0]), createdAt: ts, createdBy: user.uid, immutable: true });

    let chainHead: string | null = null;
    const evidenceDocs: any[] = [];
    for (const [index, documentType] of REQUIRED_EVIDENCE.entries()) {
      const registry = EVIDENCE_BY_KEY.get(documentType);
      assert.ok(registry, `evidence registry missing ${documentType}`);
      const evidenceId = `seed-${spec.year}-${String(index + 1).padStart(2, "0")}-${documentType}`;
      const originalName = `${documentType}-${spec.year}.txt`;
      const body = Buffer.from(`TEB232 STABLE VISIBLE STRICT TEST EVIDENCE\nSeed ${SEED_KEY}\nType ${documentType}\nShip ${spec.shipName}\nIMO ${spec.imo}\nYear ${spec.year}\nSynthetic QA only\n`, "utf8");
      const objectPath = `maritime-evidence/records/${companyId}/${fleetId}/${spec.shipId}/${spec.year}/${evidenceId}/${originalName}`;
      const hash = sha256(body);
      await bucket.file(objectPath).save(body, { resumable: false, metadata: { contentType: "text/plain", cacheControl: "private, max-age=0, no-store" } });
      const baseRecord = { schemaVersion: "maritime-evidence-v3", rulesetId: RULESET_ID, evidenceId, immutable: true, companyId, fleetId, shipId: spec.shipId, reportingYear: spec.year, documentType, documentLabel: registry.label, legalBasis: registry.legalBasis, criticality: registry.criticality, originalName, contentType: "text/plain", size: body.length, documentDate: `${spec.year}-01-04`, sourceName: "TEB232 stable visible strict fixture", sourceReference: `${SEED_KEY}:${spec.year}:${documentType}`, notes: "Synthetic QA evidence; test account only.", supports: registry.defaultSupports || [], linkedVoyageIds: [], linkedFuelIds: [], supportRevision: 1, supportDataHash: dataHash, finalizedAgainstRevision: 1, finalizedAgainstDataHash: dataHash, sha256: hash, crc32c: null, md5Hash: null, storageGeneration: null, storageMetageneration: null, objectPath, storageBucket: BUCKET, contentValidation: "seeded-test-fixture+sha256", integrityStatus: "verified-at-ingest", retention: buildRetention(spec.year), previousEvidenceChainHash: chainHead, finalizedAt: ts, finalizedBy: user.uid };
      const evidenceChainHash = buildEvidenceChainHash(chainHead, baseRecord);
      const record = { ...baseRecord, evidenceChainHash };
      await yearRef.collection("evidenceDocuments").doc(evidenceId).set(record);
      evidenceDocs.push(record);
      chainHead = evidenceChainHash;
    }

    const audit = auditPreparationFile(file, evidenceDocs);
    assert.equal(audit.ready, true, JSON.stringify(audit.missing));
    assert.equal(audit.score, 100);
    const manifestHash = canonicalHash(evidenceDocs.map((doc) => ({ evidenceId: doc.evidenceId, documentType: doc.documentType, sha256: doc.sha256, evidenceChainHash: doc.evidenceChainHash, supports: doc.supports, linkedVoyageIds: doc.linkedVoyageIds, linkedFuelIds: doc.linkedFuelIds })));
    const snapshotHash = canonicalHash({ product: "SKDMhesapla Maritime Carbon Compliance Preparation File", schemaVersion: "maritime-enterprise-v2", rulesetId: RULESET_ID, sourceRevision: 1, sourceHash: dataHash, evidenceManifestHash: manifestHash, evidenceChainHead: chainHead, file, type: "checkpoint" });
    const versionId = `checkpoint-${spec.year}-teb232-visible-stable`;
    await yearRef.collection("versions").doc(versionId).set({ versionId, type: "checkpoint", immutable: true, schemaVersion: "maritime-enterprise-v2", rulesetId: RULESET_ID, snapshotHash, sourceHash: dataHash, sourceRevision: 1, activeSyncId: syncId, companySnapshot: file.company, verifierSnapshot: file.verifier, shipSnapshot: file.ship, monitoring: file.monitoring, ice: file.ice, flexibility: file.flexibility, rowCounts: { voyages: 1, fuels: 1, evidence: evidenceDocs.length }, evidenceManifestHash: manifestHash, evidenceChainHead: chainHead, evidenceDocumentCount: evidenceDocs.length, readiness: { ready: true, missing: [], strictAudit: audit }, createdAt: ts, createdBy: user.uid });
    await yearRef.set({ evidenceChainHead: chainHead, evidenceDocumentCount: evidenceDocs.length, evidenceUpdatedAt: ts, evidenceUpdatedBy: user.uid, lastSnapshotVersion: versionId, lastSnapshotHash: snapshotHash, strictAudit: audit, updatedAt: ts, updatedBy: user.uid }, { merge: true });
    created.push({ shipId: spec.shipId, year: spec.year, shipName: spec.shipName, score: audit.score, snapshotHash });
  }

  await db.collection("maritimeUserHomes").doc(user.uid).set({ schemaVersion: "maritime-enterprise-v2", companyId, fleetId, shipId: "teb232-strict-2026", year: 2026, durableVisibleTestWorkspace: true, updatedAt: ts, activeReportChangedAt: ts }, { merge: false });
  console.log(JSON.stringify({ ok: true, seedKey: SEED_KEY, account: TEST_EMAIL, companyId, fleetId, created }, null, 2));
}

main().catch((error) => { console.error("[TEB232 STABLE VISIBLE STRICT REPORTS]", error?.stack || error); process.exitCode = 1; });

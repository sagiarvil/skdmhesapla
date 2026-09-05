import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { calculateMaritimePreparation } from "../../src/lib/maritime/calculator";
import { assessMaritimeReadiness } from "../../src/lib/maritime/readiness";
import type { MaritimePreparationFile, MaritimeVoyageRecord, MaritimeFuelRecord } from "../../src/lib/maritime/types";

const requireFromFunctions = createRequire(new URL("../../functions/package.json", import.meta.url));
const { initializeApp, cert, getApps } = requireFromFunctions("firebase-admin/app");
const { getAuth } = requireFromFunctions("firebase-admin/auth");
const { getFirestore } = requireFromFunctions("firebase-admin/firestore");
const { getStorage } = requireFromFunctions("firebase-admin/storage");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_DIR = path.join(ROOT, "e2e-artifacts");
const REPORT_PATH = path.join(OUT_DIR, "teb232-maritime-live-e2e-report.json");
const SUMMARY_PATH = path.join(OUT_DIR, "teb232-maritime-live-e2e-summary.md");
const BASE_URL = String(process.env.MARITIME_E2E_BASE_URL || "https://skdmhesapla.com").replace(/\/+$/, "");
const TEST_EMAIL = "teb232@gmail.com";
const PROJECT_ID = "carbon-web-1265b";
const STORAGE_BUCKET = "carbon-web-1265b.firebasestorage.app";
const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || "AIzaSyCUQ0jDeUQPAr3xfSk-aOO4OqcrNwM3mD0";
const RUN_ID = `teb232-maritime-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
const REPORTING_YEAR = 2026;

function sha256(value: string | Buffer) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).sort().reduce<Record<string, unknown>>((out, key) => {
      out[key] = stable((value as Record<string, unknown>)[key]);
      return out;
    }, {});
  }
  return value;
}
function canonical(value: unknown) { return JSON.stringify(stable(value)); }
function nowIso() { return new Date().toISOString(); }
function logStep(report: any, name: string, details: Record<string, unknown> = {}) {
  report.steps.push({ name, at: nowIso(), ...details });
  console.log(`[TEB232 E2E] ${name}`, Object.keys(details).length ? details : "");
}
function bodyText(title: string, lines: string[]) {
  return Buffer.from([`SKDMhesapla TEB232 Maritime E2E — ${title}`, `Run: ${RUN_ID}`, `Date: 2026-09-05`, ...lines, ""].join("\n"), "utf8");
}

const evidencePlan = [
  { key: "monitoring-plan", links: "none", title: "Monitoring Plan", supports: ["mrv-monitoring", "fueleu-monitoring"] },
  { key: "voyage-list", links: "voyage", title: "Voyage List", supports: ["mrv-activity-data", "ets-geographic-scope", "fueleu-voyage-scope"] },
  { key: "logbook", links: "voyage", title: "Official Logbook Extract", supports: ["mrv-activity-data", "fueleu-voyage-scope"] },
  { key: "oil-record-book", links: "fuel", title: "Oil Record Book Extract", supports: ["mrv-fuel-consumption", "fueleu-fuel-energy"] },
  { key: "bdn", links: "fuel", title: "Bunker Delivery Notes", supports: ["mrv-fuel-consumption", "ets-emissions", "fueleu-fuel-energy"] },
  { key: "distance-time", links: "voyage", title: "Distance and Time Evidence", supports: ["mrv-activity-data", "ets-geographic-scope", "fueleu-voyage-scope"] },
  { key: "factors", links: "fuel", title: "Emission Factor Source Memo", supports: ["mrv-emission-factor", "ets-emissions", "fueleu-fuel-factor", "fueleu-ghg-intensity"] },
  { key: "it-flow", links: "none", title: "IT Data Flow", supports: ["verifier-data-flow"] },
  { key: "tank-readings", links: "fuel", title: "Tank Reading Extract", supports: ["mrv-fuel-consumption", "fueleu-fuel-energy"] },
] as const;

function voyage(id: string, departurePort: string, departureCode: string, departureAt: string, arrivalPort: string, arrivalCode: string, arrivalAt: string, scope: MaritimeVoyageRecord["scope"], distanceNm: number, hours: number, cargo: number, co2: number, ch4: number, n2o: number, fuel: number): MaritimeVoyageRecord {
  return {
    id, departurePort, departureUnlocode: departureCode, departureAt, arrivalPort, arrivalUnlocode: arrivalCode, arrivalAt,
    scope, portCallPurpose: "Commercial cargo operation", exclusionReason: "", distanceNm, timeAtSeaHours: hours,
    timeAtBerthHours: 8, anchorageHours: 1, cargoTonnes: cargo, passengers: 0, transportWorkTonneNm: cargo * distanceNm,
    co2Tonnes: co2, ch4TonnesCo2e: ch4, n2oTonnesCo2e: n2o, fuelTonnes: fuel, dataGap: false, dataGapReason: "",
  };
}
function fuel(id: string, scope: MaritimeFuelRecord["scope"], quantityTonnes: number, energyMj: number, wtwGco2e: number, voyageId: string): MaritimeFuelRecord {
  return {
    id, scope, portName: "", portUnlocode: "", terminalBerth: "", fuelType: "MGO", fuelConsumer: "Main engines",
    bdnReference: `BDN-${RUN_ID}-${id}`, sustainabilityCertificate: "", quantityTonnes, lowerCalorificValueMjPerTonne: 42700,
    energyMj, atBerthEnergyMj: 0, wellToTankFactorGco2ePerMj: 13.5, tankToWakeCo2Factor: 3.206,
    tankToWakeCh4Factor: 0.00005, tankToWakeN2oFactor: 0.00018, slipFactor: 0, wellToWakeEmissionsGco2e: wtwGco2e,
    opsElectricityKwh: 0, opsConnectionHours: 0, opsPeakPowerKw: 0, opsExceptionReference: "", zeroEmissionEnergyMj: 0,
    substituteEnergyMj: 0, windRewardFactor: 1, rfNboEnergyMj: 0, measurementMethod: "BDN + tank readings",
    calibrationReference: "", factorSourceReference: `EU MRV/FuelEU factor set · ${voyageId}`,
  };
}

function buildScenario(): MaritimePreparationFile {
  const voyages = [
    voyage("V001", "Istanbul", "TRIST", "2026-02-03T05:00", "Piraeus", "GRPIR", "2026-02-05T08:00", "eu-eea-third", 365, 51, 11200, 120, 3.0, 0.5, 40),
    voyage("V002", "Piraeus", "GRPIR", "2026-02-07T06:00", "Rotterdam", "NLRTM", "2026-02-12T14:00", "intra-eu-eea", 1550, 128, 10900, 90, 2.0, 0.4, 30),
    voyage("V003", "Rotterdam", "NLRTM", "2026-02-14T10:00", "Istanbul", "TRIST", "2026-02-20T17:00", "eu-eea-third", 1800, 151, 10750, 110, 2.5, 0.5, 38),
  ];
  const fuels = [
    fuel("F001", "eu-eea-third", 40, 1_708_000, 155_428_000, "V001"),
    fuel("F002", "intra-eu-eea", 30, 1_281_000, 116_571_000, "V002"),
    fuel("F003", "eu-eea-third", 38, 1_622_600, 147_656_600, "V003"),
  ];
  const evidence = Object.fromEntries(evidencePlan.map((x) => [x.key, true]));
  const evidenceReferences = Object.fromEntries(evidencePlan.map((x) => [x.key, `E2E-${RUN_ID}-${x.key}`]));
  return {
    reportingYear: REPORTING_YEAR,
    company: {
      companyName: "TEB232 Maritime E2E Shipping A.Ş.", role: "gemi-sahibi", imoCompanyNumber: "IMO-COMP-TEB232-E2E",
      registeredOwnerName: "TEB232 Maritime E2E Shipping A.Ş.", registeredOwnerImoNumber: "IMO-COMP-TEB232-E2E",
      country: "Türkiye", address: "İstanbul, Türkiye", contactName: "TEB232 E2E Operator", contactEmail: TEST_EMAIL,
      telephone: "+90 212 555 0232", administeringAuthority: "E2E test value — verifier handoff field",
      formalMandateReference: "", responsibilityFrom: "2026-01-01", responsibilityTo: "2026-12-31",
    },
    verifier: { verifierName: "E2E Accredited Verifier Placeholder", accreditationNumber: "E2E-ACC-232", address: "EU", contactEmail: "verifier-e2e@example.invalid" },
    ship: {
      shipName: "TEB232 E2E CONTAINER", imoNumber: "9900232", portOfRegistry: "Istanbul", homePort: "Istanbul", flagState: "Türkiye",
      shipType: "cargo", officialCategory: "Container ship", deadweightTonnes: 26500, grossTonnage: 18500, classificationSociety: "E2E Class",
      iceClass: "", technicalEfficiencyType: "EEXI", technicalEfficiencyValue: "18.70", description: `Temporary full-stack E2E vessel ${RUN_ID}`,
    },
    monitoring: {
      monitoringPlanVersion: "MP-E2E-2026-v1", monitoringPlanReferenceDate: "2026-01-01", monitoringPlanAssessed: true,
      monitoringPlanApproved: true, revisionNotes: "E2E scenario", fuelMonitoringMethod: "BDN + periodic tank readings",
      densityMethod: "BDN density at 15°C", uncertaintyMethod: "BDN reconciliation + independent tank sounding control", uncertaintyPercent: 1,
      emissionFactorMethod: "Applicable EU MRV / FuelEU factor source register", dataGapMethod: "Conservative surrogate data procedure; no data gap in this scenario",
      voyageCompletenessProcedure: "Port-call register reconciled to official logbook and noon reports", emissionSources: ["Main engines", "Auxiliary engines", "Boilers"],
      measurementEquipment: "Tank sounding tables and approved shipboard meters", itSystem: "SKDMhesapla maritime evidence chain",
      proceduresReference: `PROC-${RUN_ID}`,
    },
    voyages,
    fuels,
    ice: { exclusionClaimed: false, entryUtc: "", exitUtc: "", distanceInIceNm: 0, fuelInIceTonnes: 0, totalDistanceNm: 0, evidenceReference: "" },
    flexibility: { bankingRequested: false, borrowingRequested: false, poolingPlanned: false, previousBankedSurplusReference: "", poolReference: "" },
    evidence,
    evidenceReferences,
  };
}

async function fetchJson(url: string, init: RequestInit, expected: number[] = [200]) {
  const res = await fetch(url, init);
  const text = await res.text();
  let parsed: any = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
  if (!expected.includes(res.status)) {
    throw new Error(`HTTP ${res.status} ${url}: ${typeof parsed === "string" ? parsed.slice(0, 1200) : JSON.stringify(parsed).slice(0, 1200)}`);
  }
  return { status: res.status, body: parsed, headers: res.headers };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawServiceAccount) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON secret is required for real TEB232 E2E");
  const serviceAccount = JSON.parse(rawServiceAccount);
  const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
  const auth = getAuth(app);
  const db = getFirestore(app);
  const bucket = getStorage(app).bucket(STORAGE_BUCKET);

  const report: any = {
    runId: RUN_ID,
    startedAt: nowIso(),
    baseUrl: BASE_URL,
    testIdentity: TEST_EMAIL,
    mode: "real Firebase Auth token + live production APIs + isolated temporary workspace + synthetic no-charge commerce entitlement",
    passed: false,
    cleanupPassed: false,
    calculations: {},
    steps: [],
    warnings: ["No real Paddle charge is created. External payment completion is replaced by a service-account E2E entitlement only for this ephemeral test run."],
  };

  let userRecord: any = null;
  let createdUser = false;
  let originalDisabled = false;
  let originalHomeExists = false;
  let originalHome: any = null;
  let context: any = null;
  let intentId: string | null = null;
  let transactionId: string | null = null;
  let entitlementId: string | null = null;
  const tempCompanyId = `e2e-mco-${sha256(RUN_ID).slice(0, 20)}`;
  const tempFleetId = "teb232-e2e-fleet";
  const evidenceIds: string[] = [];

  try {
    try {
      userRecord = await auth.getUserByEmail(TEST_EMAIL);
      originalDisabled = Boolean(userRecord.disabled);
      if (originalDisabled) await auth.updateUser(userRecord.uid, { disabled: false });
    } catch (error: any) {
      if (error?.code !== "auth/user-not-found") throw error;
      userRecord = await auth.createUser({ email: TEST_EMAIL, emailVerified: true, displayName: "TEB232 Maritime E2E" });
      createdUser = true;
    }
    logStep(report, "Firebase Auth TEB232 identity resolved", { uid: userRecord.uid, createdUser, temporarilyEnabled: originalDisabled });

    const homeRef = db.collection("maritimeUserHomes").doc(userRecord.uid);
    const originalHomeSnap = await homeRef.get();
    originalHomeExists = originalHomeSnap.exists;
    originalHome = originalHomeSnap.exists ? originalHomeSnap.data() : null;

    const companyRef = db.collection("companies").doc(tempCompanyId);
    const memberRef = companyRef.collection("members").doc(userRecord.uid);
    const fleetRef = companyRef.collection("maritimeFleets").doc(tempFleetId);
    const ts = nowIso();
    await companyRef.set({ schemaVersion: "maritime-enterprise-v2", name: `TEB232 E2E Workspace ${RUN_ID}`, ownerId: userRecord.uid, members: [userRecord.uid], status: "active", e2eRunId: RUN_ID, createdAt: ts, createdBy: userRecord.uid, updatedAt: ts, updatedBy: userRecord.uid });
    await memberRef.set({ uid: userRecord.uid, role: "owner", active: true, e2eRunId: RUN_ID, createdAt: ts, createdBy: userRecord.uid, updatedAt: ts, updatedBy: userRecord.uid });
    await fleetRef.set({ schemaVersion: "maritime-enterprise-v2", name: "TEB232 E2E Fleet", status: "active", e2eRunId: RUN_ID, createdAt: ts, createdBy: userRecord.uid, updatedAt: ts, updatedBy: userRecord.uid });
    await homeRef.set({ schemaVersion: "maritime-enterprise-v2", companyId: tempCompanyId, fleetId: tempFleetId, e2eRunId: RUN_ID, createdAt: ts, updatedAt: ts }, { merge: false });
    logStep(report, "Temporary isolated owner workspace installed", { companyId: tempCompanyId, fleetId: tempFleetId, previousHomePreserved: originalHomeExists });

    async function mintIdToken() {
      const custom = await auth.createCustomToken(userRecord.uid, { maritimeE2E: true, e2eRunId: RUN_ID });
      const exchange = await fetchJson(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${encodeURIComponent(FIREBASE_WEB_API_KEY)}`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: custom, returnSecureToken: true }),
      });
      assert.ok(exchange.body?.idToken, "Firebase custom-token exchange must return ID token");
      return String(exchange.body.idToken);
    }
    let idToken = await mintIdToken();
    const authHeaders = () => ({ authorization: `Bearer ${idToken}` });
    const jsonHeaders = () => ({ ...authHeaders(), "content-type": "application/json" });

    const anonymousBoundary = await fetchJson(`${BASE_URL}/api/maritime/health`, { method: "GET" }, [401]);
    assert.equal(anonymousBoundary.status, 401);
    logStep(report, "Unauthenticated maritime API boundary rejects access", { status: anonymousBoundary.status });

    const created = await fetchJson(`${BASE_URL}/api/maritime/files`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ year: REPORTING_YEAR }) }, [201]);
    context = created.body?.context;
    assert.equal(context.companyId, tempCompanyId);
    assert.equal(context.fleetId, tempFleetId);
    assert.ok(context.shipId);
    assert.equal(Number(context.year), REPORTING_YEAR);
    logStep(report, "Live API created real ship/reporting-year file", context);

    const scenario = buildScenario();
    const localCalc = calculateMaritimePreparation(scenario, 80);
    const localReadiness = assessMaritimeReadiness(scenario);
    assert.equal(localReadiness.score, 100, `Local verifier-preparation readiness expected 100, got ${localReadiness.score}`);
    assert.equal(localReadiness.blocking.length, 0, `Local readiness has blockers: ${localReadiness.blocking.join(" | ")}`);
    assert.ok(localCalc.totalReportedCo2eTonnes > 0);
    assert.ok(localCalc.estimatedEuaObligation > 0);
    report.calculations = { ...localCalc, localReadinessScore: localReadiness.score, localWarnings: localReadiness.warnings };
    logStep(report, "Deterministic maritime calculation + local readiness passed", { totalReportedCo2eTonnes: localCalc.totalReportedCo2eTonnes, estimatedEuaObligation: localCalc.estimatedEuaObligation, estimatedEtsCostEur: localCalc.estimatedEtsCostEur, fueleuIntensity: localCalc.fueleuIntensityGco2ePerMj, readiness: localReadiness.score });

    const sync = await fetchJson(`${BASE_URL}/api/maritime/file`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ context, file: scenario, expectedRevision: 0 }) });
    assert.equal(sync.body?.revision, 1);
    assert.match(String(sync.body?.dataHash || ""), /^[a-f0-9]{64}$/);
    const authoritativeDataHash = String(sync.body.dataHash);
    logStep(report, "Real persistence sync committed", { revision: sync.body.revision, dataHash: authoritativeDataHash });

    const wrongTenant = await fetchJson(`${BASE_URL}/api/maritime/file?companyId=forbidden-company&fleetId=${encodeURIComponent(context.fleetId)}&shipId=${encodeURIComponent(context.shipId)}&year=${REPORTING_YEAR}`, { method: "GET", headers: authHeaders() }, [403]);
    assert.equal(wrongTenant.status, 403);
    logStep(report, "Tenant isolation blocks foreign company context", { status: wrongTenant.status });

    const conflictScenario = structuredClone(scenario);
    conflictScenario.ship.description = `${scenario.ship.description} stale-write-probe`;
    const stale = await fetchJson(`${BASE_URL}/api/maritime/file`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ context, file: conflictScenario, expectedRevision: 0 }) }, [409]);
    assert.equal(stale.body?.code, "REVISION_CONFLICT");
    logStep(report, "Optimistic concurrency rejects stale revision", { status: stale.status, code: stale.body?.code });

    const evidenceApi = `${BASE_URL}/api/maritime/evidence`;
    for (const [index, spec] of evidencePlan.entries()) {
      const linkedVoyageIds = spec.links === "voyage" ? scenario.voyages.map((v) => v.id) : [];
      const linkedFuelIds = spec.links === "fuel" ? scenario.fuels.map((f) => f.id) : [];
      const bytes = bodyText(spec.title, [
        `Document type: ${spec.key}`,
        `Ship: ${scenario.ship.shipName} · IMO ${scenario.ship.imoNumber}`,
        `Reporting year: ${REPORTING_YEAR}`,
        `Linked voyages: ${linkedVoyageIds.join(",") || "none"}`,
        `Linked fuels: ${linkedFuelIds.join(",") || "none"}`,
        "Synthetic E2E evidence; not a real operational record and never leaves the isolated test workspace.",
      ]);
      const upload = await fetchJson(`${evidenceApi}/uploads`, {
        method: "POST", headers: jsonHeaders(), body: JSON.stringify({
          context, documentType: spec.key, originalName: `${spec.key}-${RUN_ID}.txt`, contentType: "text/plain", size: bytes.length,
          documentDate: "2026-02-20", sourceName: "TEB232 E2E Scenario Generator", sourceReference: `${RUN_ID}:${spec.key}`,
          notes: "Ephemeral synthetic evidence used only for full-stack automated verification.", supports: spec.supports,
          linkedVoyageIds, linkedFuelIds,
        }),
      }, [201]);
      const evidenceId = String(upload.body.evidenceId);
      evidenceIds.push(evidenceId);
      const chunkUrl = `${evidenceApi}/uploads/${encodeURIComponent(evidenceId)}/chunks/0`;
      const chunkHeaders = {
        ...authHeaders(), "content-type": "application/octet-stream",
        "x-maritime-company-id": context.companyId, "x-maritime-fleet-id": context.fleetId,
        "x-maritime-ship-id": context.shipId, "x-maritime-year": String(context.year),
      };
      const firstChunk = await fetchJson(chunkUrl, { method: "PUT", headers: chunkHeaders, body: bytes });
      assert.equal(firstChunk.body?.idempotent, false);
      if (index === 0) {
        const duplicateChunk = await fetchJson(chunkUrl, { method: "PUT", headers: chunkHeaders, body: bytes });
        assert.equal(duplicateChunk.body?.idempotent, true);
        const altered = Buffer.from(bytes);
        altered[altered.length - 2] = altered[altered.length - 2] === 65 ? 66 : 65;
        const conflict = await fetchJson(chunkUrl, { method: "PUT", headers: chunkHeaders, body: altered }, [409]);
        assert.equal(conflict.body?.code, "CHUNK_CONFLICT");
      }
      const finalized = await fetchJson(`${evidenceApi}/uploads/${encodeURIComponent(evidenceId)}/finalize`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ context }) });
      assert.match(String(finalized.body?.evidence?.sha256 || ""), /^[a-f0-9]{64}$/);
      const finalizedAgain = await fetchJson(`${evidenceApi}/uploads/${encodeURIComponent(evidenceId)}/finalize`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ context }) });
      assert.equal(finalizedAgain.body?.idempotent, true);
      const verified = await fetchJson(`${evidenceApi}/documents/${encodeURIComponent(evidenceId)}/verify`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ context }) });
      assert.equal(verified.body?.match, true);
    }
    logStep(report, "Binary evidence upload/finalize/hash verification passed", { finalizedDocuments: evidenceIds.length });

    const evidenceList = await fetchJson(`${evidenceApi}/documents?companyId=${encodeURIComponent(context.companyId)}&fleetId=${encodeURIComponent(context.fleetId)}&shipId=${encodeURIComponent(context.shipId)}&year=${REPORTING_YEAR}`, { method: "GET", headers: authHeaders() });
    assert.equal(evidenceList.body?.documents?.length, evidencePlan.length);
    for (const required of ["monitoring-plan", "voyage-list", "logbook", "bdn", "distance-time", "factors"]) {
      assert.ok(Number(evidenceList.body?.coverage?.[required] || 0) >= 1, `Missing evidence coverage: ${required}`);
    }
    const firstEvidenceId = String(evidenceList.body.documents[0].evidenceId);
    const downloadedEvidence = await fetch(`${evidenceApi}/documents/${encodeURIComponent(firstEvidenceId)}/content?companyId=${encodeURIComponent(context.companyId)}&fleetId=${encodeURIComponent(context.fleetId)}&shipId=${encodeURIComponent(context.shipId)}&year=${REPORTING_YEAR}`, { headers: authHeaders() });
    assert.equal(downloadedEvidence.status, 200);
    assert.ok((await downloadedEvidence.arrayBuffer()).byteLength > 0);
    logStep(report, "Evidence manifest coverage + authenticated evidence download passed", { manifestHash: evidenceList.body?.manifestHash, chainHead: evidenceList.body?.chainHead });

    const checkpoint = await fetchJson(`${BASE_URL}/api/maritime/checkpoint`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ context }) });
    assert.equal(checkpoint.body?.readiness?.ready, true, `Backend readiness blocked: ${checkpoint.body?.readiness?.missing?.join(" | ")}`);
    assert.equal(checkpoint.body?.readiness?.missing?.length, 0);
    assert.match(String(checkpoint.body?.snapshotHash || ""), /^[a-f0-9]{64}$/);
    const checkpointVersionId = String(checkpoint.body.versionId);
    const snapshotHash = String(checkpoint.body.snapshotHash);
    logStep(report, "Server-authoritative READY checkpoint created", { checkpointVersionId, snapshotHash, evidenceDocumentCount: checkpoint.body?.readiness?.evidenceDocumentCount });

    const commerceIntent = await fetchJson(`${BASE_URL}/api/maritime-commerce/intent`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ context, checkpointVersionId, snapshotHash }) }, [201]);
    assert.equal(commerceIntent.body?.alreadyPaid, false);
    intentId = String(commerceIntent.body.intentId);
    const intentRef = db.collection("maritimePurchaseIntents").doc(intentId);
    const intentSnap = await intentRef.get();
    assert.ok(intentSnap.exists);
    const intent = intentSnap.data() || {};
    transactionId = `e2e_txn_${sha256(RUN_ID).slice(0, 28)}`;
    entitlementId = sha256(`${userRecord.uid}:${snapshotHash}`).slice(0, 56);
    const entRef = db.collection("maritimeEntitlements").doc(entitlementId);
    const orderRef = db.collection("maritimeOrders").doc(transactionId);
    const paidAt = nowIso();
    await orderRef.set({ schemaVersion: "maritime-commerce-v1", transactionId, intentId, ownerUid: userRecord.uid, context, checkpointVersionId, snapshotHash, sourceHash: intent.sourceHash, sourceRevision: intent.sourceRevision, sku: intent.sku, priceId: "E2E-NO-CHARGE", currency: "USD", amountMinor: 0, status: "completed", completedAt: paidAt, immutable: true, testMode: true, e2eRunId: RUN_ID });
    await entRef.set({ schemaVersion: "maritime-commerce-v1", entitlementId, ownerUid: userRecord.uid, context, checkpointVersionId, snapshotHash, sourceHash: intent.sourceHash, sourceRevision: intent.sourceRevision, activeSyncId: intent.activeSyncId, evidenceManifestHash: intent.evidenceManifestHash, evidenceChainHead: intent.evidenceChainHead, evidenceDocumentCount: intent.evidenceDocumentCount, rulesetId: intent.rulesetId, sku: intent.sku, transactionId, status: "active", activatedAt: paidAt, redownloadPolicy: "same-snapshot-unlimited", testMode: true, e2eRunId: RUN_ID });
    await intentRef.set({ status: "completed", transactionId, completedAt: paidAt, entitlementId, testMode: true, e2eRunId: RUN_ID }, { merge: true });
    logStep(report, "No-charge E2E commerce entitlement injected with service account", { intentId, transactionId, entitlementId });

    const finalizedCommerce = await fetchJson(`${BASE_URL}/api/maritime-commerce/finalize`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ intentId }) });
    assert.equal(finalizedCommerce.body?.snapshotHash, snapshotHash);
    const paidStatus = await fetchJson(`${BASE_URL}/api/maritime-commerce/status?year=${REPORTING_YEAR}`, { method: "GET", headers: authHeaders() });
    assert.equal(paidStatus.body?.paid, true);
    const dossierDownload = await fetch(`${BASE_URL}/api/maritime-commerce/download?year=${REPORTING_YEAR}&snapshotHash=${encodeURIComponent(snapshotHash)}`, { headers: authHeaders() });
    assert.equal(dossierDownload.status, 200);
    const dossierText = await dossierDownload.text();
    const dossier = JSON.parse(dossierText);
    assert.equal(dossier.snapshotHash, snapshotHash);
    assert.equal(dossier.file?.ship?.imoNumber, scenario.ship.imoNumber);
    assert.equal(dossier.file?.voyages?.length, scenario.voyages.length);
    assert.equal(dossier.file?.fuels?.length, scenario.fuels.length);
    logStep(report, "Paid dossier finalize/status/download passed without real charge", { snapshotHash, dossierBytes: Buffer.byteLength(dossierText) });

    const locked = await fetchJson(`${BASE_URL}/api/maritime/lock`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ context }) });
    assert.equal(locked.body?.readiness?.ready, true);
    assert.equal(locked.body?.status, "locked");
    const lockedMutation = structuredClone(scenario);
    lockedMutation.ship.description = "should never persist after lock";
    const afterLockWrite = await fetchJson(`${BASE_URL}/api/maritime/file`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ context, file: lockedMutation, expectedRevision: 1 }) }, [423]);
    assert.equal(afterLockWrite.body?.code, "FILE_LOCKED");
    const evidenceAfterLockBytes = bodyText("post-lock probe", ["must be rejected"]);
    const evidenceAfterLock = await fetchJson(`${evidenceApi}/uploads`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ context, documentType: "previous-report", originalName: `post-lock-${RUN_ID}.txt`, contentType: "text/plain", size: evidenceAfterLockBytes.length, documentDate: "2026-02-20", sourceName: "E2E", sourceReference: RUN_ID, notes: "lock probe", supports: ["verifier-handoff"], linkedVoyageIds: [], linkedFuelIds: [] }) }, [423]);
    assert.equal(evidenceAfterLock.body?.code, "FILE_LOCKED");
    logStep(report, "Immutable lock blocks file mutation and new evidence", { lockVersionId: locked.body?.versionId, lockSnapshotHash: locked.body?.snapshotHash });

    idToken = await mintIdToken();
    const reloaded = await fetchJson(`${BASE_URL}/api/maritime/file?companyId=${encodeURIComponent(context.companyId)}&fleetId=${encodeURIComponent(context.fleetId)}&shipId=${encodeURIComponent(context.shipId)}&year=${REPORTING_YEAR}`, { method: "GET", headers: authHeaders() });
    assert.equal(reloaded.body?.dataHash, authoritativeDataHash);
    assert.equal(reloaded.body?.status, "locked");
    assert.equal(reloaded.body?.file?.ship?.imoNumber, scenario.ship.imoNumber);
    assert.equal(reloaded.body?.file?.voyages?.length, scenario.voyages.length);
    assert.equal(reloaded.body?.file?.fuels?.length, scenario.fuels.length);
    assert.equal(canonical(reloaded.body?.file?.voyages), canonical(scenario.voyages));
    logStep(report, "Fresh Firebase session reload preserved exact server state", { status: reloaded.body?.status, revision: reloaded.body?.revision, dataHash: reloaded.body?.dataHash });

    const versions = await fetchJson(`${BASE_URL}/api/maritime/versions?companyId=${encodeURIComponent(context.companyId)}&fleetId=${encodeURIComponent(context.fleetId)}&shipId=${encodeURIComponent(context.shipId)}&year=${REPORTING_YEAR}`, { method: "GET", headers: authHeaders() });
    const audit = await fetchJson(`${BASE_URL}/api/maritime/audit?companyId=${encodeURIComponent(context.companyId)}&fleetId=${encodeURIComponent(context.fleetId)}&shipId=${encodeURIComponent(context.shipId)}&year=${REPORTING_YEAR}`, { method: "GET", headers: authHeaders() });
    const actions = new Set((audit.body?.events || []).map((x: any) => String(x.action || "")));
    for (const requiredAction of ["FILE_SYNC", "EVIDENCE_FINALIZED", "CHECKPOINT_CREATED", "PAID_DOSSIER_LOCKED", "FILE_LOCKED_PREPARATION", "EVIDENCE_INTEGRITY_VERIFIED"]) {
      assert.ok(actions.has(requiredAction), `Audit action missing: ${requiredAction}`);
    }
    assert.ok((versions.body?.versions || []).length >= 2);
    logStep(report, "Versions + immutable audit chain contain required lifecycle events", { versions: versions.body?.versions?.length, auditEvents: audit.body?.events?.length, requiredActions: [...actions].filter((x) => x) });

    report.passed = true;
    report.completedAt = nowIso();
  } finally {
    const cleanupErrors: string[] = [];
    try {
      if (context) {
        const prefixBase = `${context.companyId}/${context.fleetId}/${context.shipId}/${context.year}/`;
        await bucket.deleteFiles({ prefix: `maritime-evidence/records/${prefixBase}` }).catch(() => {});
        await bucket.deleteFiles({ prefix: `maritime-evidence/_tmp/${prefixBase}` }).catch(() => {});
        const shipRef = db.collection("companies").doc(context.companyId).collection("maritimeFleets").doc(context.fleetId).collection("ships").doc(context.shipId);
        await db.recursiveDelete(shipRef).catch((e: Error) => { cleanupErrors.push(`ship:${e.message}`); });
      }
      if (intentId) await db.collection("maritimePurchaseIntents").doc(intentId).delete().catch((e: Error) => cleanupErrors.push(`intent:${e.message}`));
      if (transactionId) await db.collection("maritimeOrders").doc(transactionId).delete().catch((e: Error) => cleanupErrors.push(`order:${e.message}`));
      if (entitlementId) await db.collection("maritimeEntitlements").doc(entitlementId).delete().catch((e: Error) => cleanupErrors.push(`entitlement:${e.message}`));
      await db.recursiveDelete(db.collection("companies").doc(tempCompanyId)).catch((e: Error) => cleanupErrors.push(`company:${e.message}`));
      if (userRecord?.uid) {
        const homeRef = db.collection("maritimeUserHomes").doc(userRecord.uid);
        if (originalHomeExists) await homeRef.set(originalHome, { merge: false }); else await homeRef.delete().catch(() => {});
        if (originalDisabled && !createdUser) await auth.updateUser(userRecord.uid, { disabled: true }).catch((e: Error) => cleanupErrors.push(`restore-disabled:${e.message}`));
        if (createdUser) await auth.deleteUser(userRecord.uid).catch((e: Error) => cleanupErrors.push(`delete-created-user:${e.message}`));
      }
      const [remainingRecords] = context ? await bucket.getFiles({ prefix: `maritime-evidence/records/${context.companyId}/${context.fleetId}/${context.shipId}/${context.year}/`, maxResults: 1 }) : [[]];
      assert.equal(remainingRecords.length, 0, "Temporary evidence objects must be removed");
      const tempCompanySnap = await db.collection("companies").doc(tempCompanyId).get();
      assert.equal(tempCompanySnap.exists, false, "Temporary E2E company must be removed");
      report.cleanupPassed = cleanupErrors.length === 0;
      report.cleanupErrors = cleanupErrors;
      logStep(report, "E2E cleanup restored TEB232 account state and removed temporary data", { cleanupPassed: report.cleanupPassed, cleanupErrors });
    } catch (error: any) {
      cleanupErrors.push(error?.stack || error?.message || String(error));
      report.cleanupPassed = false;
      report.cleanupErrors = cleanupErrors;
    }
    report.finishedAt = nowIso();
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    const summary = [
      "# TEB232 Maritime Live E2E",
      "",
      `- Run: \`${RUN_ID}\``,
      `- Identity: \`${TEST_EMAIL}\``,
      `- Live base: ${BASE_URL}`,
      `- Test passed: **${report.passed ? "YES" : "NO"}**`,
      `- Cleanup passed: **${report.cleanupPassed ? "YES" : "NO"}**`,
      `- Evidence documents finalized: **${evidenceIds.length}**`,
      `- MRV total: **${report.calculations.totalReportedCo2eTonnes ?? "—"} tCO2e**`,
      `- EUA preliminary obligation: **${report.calculations.estimatedEuaObligation ?? "—"} EUA**`,
      `- ETS scenario cost @ EUR80: **EUR ${report.calculations.estimatedEtsCostEur ?? "—"}**`,
      "",
      "This E2E uses real Firebase Authentication and live SKDMhesapla maritime APIs. It creates an isolated temporary TEB232-owned company/fleet/ship, uploads real binary evidence objects, checkpoints, simulates a no-charge paid entitlement using the service account, downloads the paid dossier, locks the file, re-authenticates and verifies persistence/audit, then removes the entire temporary workspace and restores the original TEB232 home pointer.",
    ].join("\n");
    fs.writeFileSync(SUMMARY_PATH, summary);
  }

  assert.equal(report.passed, true, "TEB232 live E2E scenario did not complete");
  assert.equal(report.cleanupPassed, true, `TEB232 live E2E cleanup failed: ${(report.cleanupErrors || []).join(" | ")}`);
  console.log(`[TEB232 E2E RESULT] passed=${report.passed} cleanup=${report.cleanupPassed} steps=${report.steps.length} run=${report.runId}`);
}

main().catch((error) => {
  console.error("[TEB232 E2E FATAL]", error?.stack || error);
  process.exitCode = 1;
});

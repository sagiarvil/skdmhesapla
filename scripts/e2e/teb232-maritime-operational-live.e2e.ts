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

const BASE_URL = String(process.env.MARITIME_E2E_BASE_URL || "https://skdmhesapla.com").replace(/\/+$/, "");
const PROJECT_ID = "carbon-web-1265b";
const BUCKET = "carbon-web-1265b.firebasestorage.app";
const WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || "AIzaSyCUQ0jDeUQPAr3xfSk-aOO4OqcrNwM3mD0";
const TEST_EMAIL = "teb232@gmail.com";
const YEAR = 2026;
const RUN_ID = `teb232-op-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ARTIFACT_DIR = path.join(ROOT, "e2e-artifacts");

const evidencePlan = [
  { key: "monitoring-plan", link: "none", supports: ["mrv-monitoring", "fueleu-monitoring"] },
  { key: "voyage-list", link: "voyage", supports: ["mrv-activity-data", "ets-geographic-scope", "fueleu-voyage-scope"] },
  { key: "logbook", link: "voyage", supports: ["mrv-activity-data", "fueleu-voyage-scope"] },
  { key: "bdn", link: "fuel", supports: ["mrv-fuel-consumption", "ets-emissions", "fueleu-fuel-energy"] },
  { key: "distance-time", link: "voyage", supports: ["mrv-activity-data", "ets-geographic-scope"] },
  { key: "factors", link: "fuel", supports: ["mrv-emission-factor", "ets-emissions", "fueleu-fuel-factor", "fueleu-ghg-intensity"] },
  { key: "it-flow", link: "none", supports: ["verifier-data-flow"] },
  { key: "tank-readings", link: "fuel", supports: ["mrv-fuel-consumption", "fueleu-fuel-energy"] },
] as const;

function sha256(v: string | Buffer) { return crypto.createHash("sha256").update(v).digest("hex"); }
function now() { return new Date().toISOString(); }
function canonical(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  if (v && typeof v === "object") return `{${Object.keys(v as Record<string, unknown>).sort().map(k => `${JSON.stringify(k)}:${canonical((v as Record<string, unknown>)[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
function voyage(id: string, from: string, fromCode: string, depart: string, to: string, toCode: string, arrive: string, scope: MaritimeVoyageRecord["scope"], distance: number, hours: number, cargo: number, co2: number, ch4: number, n2o: number, fuel: number): MaritimeVoyageRecord {
  return { id, departurePort: from, departureUnlocode: fromCode, departureAt: depart, arrivalPort: to, arrivalUnlocode: toCode, arrivalAt: arrive, scope, portCallPurpose: "Commercial cargo operation", exclusionReason: "", distanceNm: distance, timeAtSeaHours: hours, timeAtBerthHours: 8, anchorageHours: 1, cargoTonnes: cargo, passengers: 0, transportWorkTonneNm: cargo * distance, co2Tonnes: co2, ch4TonnesCo2e: ch4, n2oTonnesCo2e: n2o, fuelTonnes: fuel, dataGap: false, dataGapReason: "" };
}
function fuel(id: string, scope: MaritimeFuelRecord["scope"], qty: number, energy: number, wtw: number): MaritimeFuelRecord {
  return { id, scope, portName: "", portUnlocode: "", terminalBerth: "", fuelType: "MGO", fuelConsumer: "Main engines", bdnReference: `BDN-${RUN_ID}-${id}`, sustainabilityCertificate: "", quantityTonnes: qty, lowerCalorificValueMjPerTonne: 42700, energyMj: energy, atBerthEnergyMj: 0, wellToTankFactorGco2ePerMj: 13.5, tankToWakeCo2Factor: 3.206, tankToWakeCh4Factor: 0.00005, tankToWakeN2oFactor: 0.00018, slipFactor: 0, wellToWakeEmissionsGco2e: wtw, opsElectricityKwh: 0, opsConnectionHours: 0, opsPeakPowerKw: 0, opsExceptionReference: "", zeroEmissionEnergyMj: 0, substituteEnergyMj: 0, windRewardFactor: 1, rfNboEnergyMj: 0, measurementMethod: "BDN + tank readings", calibrationReference: "", factorSourceReference: "Official EU maritime factor register used by scenario" };
}
function scenario(): MaritimePreparationFile {
  const voyages = [
    voyage("V001", "Istanbul", "TRIST", "2026-02-03T05:00", "Piraeus", "GRPIR", "2026-02-05T08:00", "eu-eea-third", 365, 51, 11200, 120, 3, 0.5, 40),
    voyage("V002", "Piraeus", "GRPIR", "2026-02-07T06:00", "Rotterdam", "NLRTM", "2026-02-12T14:00", "intra-eu-eea", 1550, 128, 10900, 90, 2, 0.4, 30),
    voyage("V003", "Rotterdam", "NLRTM", "2026-02-14T10:00", "Istanbul", "TRIST", "2026-02-20T17:00", "eu-eea-third", 1800, 151, 10750, 110, 2.5, 0.5, 38),
  ];
  const fuels = [fuel("F001", "eu-eea-third", 40, 1_708_000, 155_428_000), fuel("F002", "intra-eu-eea", 30, 1_281_000, 116_571_000), fuel("F003", "eu-eea-third", 38, 1_622_600, 147_656_600)];
  return {
    reportingYear: YEAR,
    company: { companyName: "TEB232 Maritime E2E Shipping A.Ş.", role: "gemi-sahibi", imoCompanyNumber: "IMO-COMP-TEB232-E2E", registeredOwnerName: "TEB232 Maritime E2E Shipping A.Ş.", registeredOwnerImoNumber: "IMO-COMP-TEB232-E2E", country: "Türkiye", address: "İstanbul, Türkiye", contactName: "TEB232 E2E Operator", contactEmail: TEST_EMAIL, telephone: "+90 212 555 0232", administeringAuthority: "E2E test authority field", formalMandateReference: "", responsibilityFrom: "2026-01-01", responsibilityTo: "2026-12-31" },
    verifier: { verifierName: "E2E Verifier Placeholder", accreditationNumber: "E2E-ACC-232", address: "EU", contactEmail: "verifier-e2e@example.invalid" },
    ship: { shipName: "TEB232 E2E CONTAINER", imoNumber: "9900232", portOfRegistry: "Istanbul", homePort: "Istanbul", flagState: "Türkiye", shipType: "cargo", officialCategory: "Container ship", deadweightTonnes: 26500, grossTonnage: 18500, classificationSociety: "E2E Class", iceClass: "", technicalEfficiencyType: "EEXI", technicalEfficiencyValue: "18.70", description: `Ephemeral live E2E ${RUN_ID}` },
    monitoring: { monitoringPlanVersion: "MP-E2E-2026-v1", monitoringPlanReferenceDate: "2026-01-01", monitoringPlanAssessed: true, monitoringPlanApproved: true, revisionNotes: "E2E", fuelMonitoringMethod: "BDN + periodic tank readings", densityMethod: "BDN density at 15°C", uncertaintyMethod: "BDN reconciliation + tank sounding control", uncertaintyPercent: 1, emissionFactorMethod: "Applicable EU MRV / FuelEU source register", dataGapMethod: "Conservative surrogate data method; none used", voyageCompletenessProcedure: "Port-call register reconciled to official logbook", emissionSources: ["Main engines", "Auxiliary engines", "Boilers"], measurementEquipment: "Tank sounding tables and shipboard meters", itSystem: "SKDMhesapla maritime evidence chain", proceduresReference: `PROC-${RUN_ID}` },
    voyages, fuels,
    ice: { exclusionClaimed: false, entryUtc: "", exitUtc: "", distanceInIceNm: 0, fuelInIceTonnes: 0, totalDistanceNm: 0, evidenceReference: "" },
    flexibility: { bankingRequested: false, borrowingRequested: false, poolingPlanned: false, previousBankedSurplusReference: "", poolReference: "" },
    evidence: Object.fromEntries(evidencePlan.map(x => [x.key, true])),
    evidenceReferences: Object.fromEntries(evidencePlan.map(x => [x.key, `E2E-${RUN_ID}-${x.key}`])),
  };
}
async function json(url: string, init: RequestInit, expected = [200]) {
  const res = await fetch(url, init); const text = await res.text(); let body: any;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!expected.includes(res.status)) throw new Error(`HTTP ${res.status} ${url}: ${typeof body === "string" ? body.slice(0, 1000) : JSON.stringify(body).slice(0, 1000)}`);
  return { status: res.status, body };
}

async function main() {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON required");
  const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(JSON.parse(raw)), projectId: PROJECT_ID, storageBucket: BUCKET });
  const auth = getAuth(app), db = getFirestore(app), bucket = getStorage(app).bucket(BUCKET);
  const report: any = { runId: RUN_ID, identity: TEST_EMAIL, startedAt: now(), passed: false, cleanupPassed: false, steps: [], commerceBoundary: "excluded: external Paddle payment is not required to validate maritime regulatory preparation; covered separately" };
  const step = (name: string, data: any = {}) => { report.steps.push({ name, at: now(), ...data }); console.log(`[TEB232 OP E2E] ${name}`, data); };
  let user: any, createdUser = false, originalDisabled = false, originalHomeExists = false, originalHome: any = null, ctx: any = null;
  const companyId = `e2e-mco-${sha256(RUN_ID).slice(0, 20)}`, fleetId = "teb232-e2e-fleet";
  try {
    try { user = await auth.getUserByEmail(TEST_EMAIL); originalDisabled = !!user.disabled; if (originalDisabled) await auth.updateUser(user.uid, { disabled: false }); }
    catch (e: any) { if (e?.code !== "auth/user-not-found") throw e; user = await auth.createUser({ email: TEST_EMAIL, emailVerified: true, displayName: "TEB232 Maritime E2E" }); createdUser = true; }
    step("Real Firebase TEB232 identity resolved", { createdUser, temporarilyEnabled: originalDisabled });

    const homeRef = db.collection("maritimeUserHomes").doc(user.uid), homeSnap = await homeRef.get();
    originalHomeExists = homeSnap.exists; originalHome = homeSnap.exists ? homeSnap.data() : null;
    const ts = now(), companyRef = db.collection("companies").doc(companyId);
    await companyRef.set({ schemaVersion: "maritime-enterprise-v2", name: `TEB232 E2E ${RUN_ID}`, ownerId: user.uid, members: [user.uid], status: "active", e2eRunId: RUN_ID, createdAt: ts, createdBy: user.uid, updatedAt: ts, updatedBy: user.uid });
    await companyRef.collection("members").doc(user.uid).set({ uid: user.uid, role: "owner", active: true, e2eRunId: RUN_ID, createdAt: ts, createdBy: user.uid, updatedAt: ts, updatedBy: user.uid });
    await companyRef.collection("maritimeFleets").doc(fleetId).set({ schemaVersion: "maritime-enterprise-v2", name: "TEB232 E2E Fleet", status: "active", e2eRunId: RUN_ID, createdAt: ts, createdBy: user.uid, updatedAt: ts, updatedBy: user.uid });
    await homeRef.set({ schemaVersion: "maritime-enterprise-v2", companyId, fleetId, e2eRunId: RUN_ID, createdAt: ts, updatedAt: ts });
    step("Ephemeral owner workspace installed", { companyId, fleetId, previousHomePreserved: originalHomeExists });

    async function token() {
      const custom = await auth.createCustomToken(user.uid, { maritimeE2E: true, e2eRunId: RUN_ID });
      const x = await json(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${encodeURIComponent(WEB_API_KEY)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: custom, returnSecureToken: true }) });
      assert.ok(x.body?.idToken); return String(x.body.idToken);
    }
    let idToken = await token();
    const ah = () => ({ authorization: `Bearer ${idToken}` }), jh = () => ({ ...ah(), "content-type": "application/json" });
    assert.equal((await json(`${BASE_URL}/api/maritime/health`, { method: "GET" }, [401])).status, 401);
    step("Anonymous boundary correctly denied");

    const created = await json(`${BASE_URL}/api/maritime/files`, { method: "POST", headers: jh(), body: JSON.stringify({ year: YEAR }) }, [201]);
    ctx = created.body.context; assert.equal(ctx.companyId, companyId); assert.equal(ctx.fleetId, fleetId); assert.ok(ctx.shipId);
    step("Real ship/reporting-year file created", ctx);

    const file = scenario(), calc = calculateMaritimePreparation(file, 80), readiness = assessMaritimeReadiness(file);
    assert.equal(readiness.score, 100); assert.equal(readiness.blocking.length, 0); assert.ok(calc.estimatedEuaObligation > 0);
    report.calculations = calc; report.localReadiness = readiness;
    step("Deterministic calculation and 100% local readiness passed", { mrv: calc.totalReportedCo2eTonnes, eua: calc.estimatedEuaObligation, fuelEu: calc.fueleuIntensityGco2ePerMj });

    const sync = await json(`${BASE_URL}/api/maritime/file`, { method: "PUT", headers: jh(), body: JSON.stringify({ context: ctx, file, expectedRevision: 0 }) });
    assert.equal(sync.body.revision, 1); assert.match(sync.body.dataHash, /^[a-f0-9]{64}$/); const dataHash = sync.body.dataHash;
    step("Persistence revision/hash committed", { revision: 1, dataHash });
    assert.equal((await json(`${BASE_URL}/api/maritime/file?companyId=forbidden&fleetId=${ctx.fleetId}&shipId=${ctx.shipId}&year=${YEAR}`, { headers: ah() }, [403])).status, 403);
    const stale = structuredClone(file); stale.ship.description = "stale";
    assert.equal((await json(`${BASE_URL}/api/maritime/file`, { method: "PUT", headers: jh(), body: JSON.stringify({ context: ctx, file: stale, expectedRevision: 0 }) }, [409])).body.code, "REVISION_CONFLICT");
    step("Tenant isolation + revision conflict gates passed");

    const eapi = `${BASE_URL}/api/maritime/evidence`;
    for (const [index, spec] of evidencePlan.entries()) {
      const linkedVoyageIds = spec.link === "voyage" ? file.voyages.map(v => v.id) : [], linkedFuelIds = spec.link === "fuel" ? file.fuels.map(f => f.id) : [];
      const bytes = Buffer.from(`TEB232 E2E ${spec.key}\nRun ${RUN_ID}\nShip ${file.ship.imoNumber}\nYear ${YEAR}\n`, "utf8");
      const createdEvidence = await json(`${eapi}/uploads`, { method: "POST", headers: jh(), body: JSON.stringify({ context: ctx, documentType: spec.key, originalName: `${spec.key}-${RUN_ID}.txt`, contentType: "text/plain", size: bytes.length, documentDate: "2026-02-20", sourceName: "TEB232 E2E", sourceReference: `${RUN_ID}:${spec.key}`, notes: "Ephemeral synthetic E2E evidence", supports: spec.supports, linkedVoyageIds, linkedFuelIds }) }, [201]);
      const evidenceId = createdEvidence.body.evidenceId;
      const ch = { ...ah(), "content-type": "application/octet-stream", "x-maritime-company-id": ctx.companyId, "x-maritime-fleet-id": ctx.fleetId, "x-maritime-ship-id": ctx.shipId, "x-maritime-year": String(ctx.year) };
      const chunkUrl = `${eapi}/uploads/${evidenceId}/chunks/0`;
      assert.equal((await json(chunkUrl, { method: "PUT", headers: ch, body: bytes })).body.idempotent, false);
      if (index === 0) {
        assert.equal((await json(chunkUrl, { method: "PUT", headers: ch, body: bytes })).body.idempotent, true);
        const altered = Buffer.from(bytes); altered[0] = altered[0] === 84 ? 85 : 84;
        assert.equal((await json(chunkUrl, { method: "PUT", headers: ch, body: altered }, [409])).body.code, "CHUNK_CONFLICT");
      }
      const fin = await json(`${eapi}/uploads/${evidenceId}/finalize`, { method: "POST", headers: jh(), body: JSON.stringify({ context: ctx }) });
      assert.match(fin.body.evidence.sha256, /^[a-f0-9]{64}$/);
      assert.equal((await json(`${eapi}/uploads/${evidenceId}/finalize`, { method: "POST", headers: jh(), body: JSON.stringify({ context: ctx }) })).body.idempotent, true);
      assert.equal((await json(`${eapi}/documents/${evidenceId}/verify`, { method: "POST", headers: jh(), body: JSON.stringify({ context: ctx }) })).body.match, true);
    }
    const docs = await json(`${eapi}/documents?companyId=${ctx.companyId}&fleetId=${ctx.fleetId}&shipId=${ctx.shipId}&year=${YEAR}`, { headers: ah() });
    assert.equal(docs.body.documents.length, evidencePlan.length);
    for (const k of ["monitoring-plan", "voyage-list", "logbook", "bdn", "distance-time", "factors"]) assert.ok(Number(docs.body.coverage[k]) >= 1);
    const first = docs.body.documents[0].evidenceId;
    const content = await fetch(`${eapi}/documents/${first}/content?companyId=${ctx.companyId}&fleetId=${ctx.fleetId}&shipId=${ctx.shipId}&year=${YEAR}`, { headers: ah() });
    assert.equal(content.status, 200); assert.ok((await content.arrayBuffer()).byteLength > 0);
    step("Binary evidence chain upload/idempotency/conflict/hash/download passed", { documents: docs.body.documents.length, manifestHash: docs.body.manifestHash, chainHead: docs.body.chainHead });

    const checkpoint = await json(`${BASE_URL}/api/maritime/checkpoint`, { method: "POST", headers: jh(), body: JSON.stringify({ context: ctx }) });
    assert.equal(checkpoint.body.readiness.ready, true); assert.deepEqual(checkpoint.body.readiness.missing, []); assert.match(checkpoint.body.snapshotHash, /^[a-f0-9]{64}$/);
    step("Server-authoritative READY checkpoint passed", { versionId: checkpoint.body.versionId, snapshotHash: checkpoint.body.snapshotHash });

    const locked = await json(`${BASE_URL}/api/maritime/lock`, { method: "POST", headers: jh(), body: JSON.stringify({ context: ctx }) });
    assert.equal(locked.body.status, "locked"); assert.equal(locked.body.readiness.ready, true);
    const afterLock = structuredClone(file); afterLock.ship.description = "must fail";
    assert.equal((await json(`${BASE_URL}/api/maritime/file`, { method: "PUT", headers: jh(), body: JSON.stringify({ context: ctx, file: afterLock, expectedRevision: 1 }) }, [423])).body.code, "FILE_LOCKED");
    const postLockBytes = Buffer.from("must be rejected");
    assert.equal((await json(`${eapi}/uploads`, { method: "POST", headers: jh(), body: JSON.stringify({ context: ctx, documentType: "previous-report", originalName: `post-lock-${RUN_ID}.txt`, contentType: "text/plain", size: postLockBytes.length, documentDate: "2026-02-20", sourceName: "TEB232 E2E", sourceReference: RUN_ID, notes: "lock probe", supports: ["verifier-handoff"], linkedVoyageIds: [], linkedFuelIds: [] }) }, [423])).body.code, "FILE_LOCKED");
    step("Immutable lock blocks data and evidence mutation", { snapshotHash: locked.body.snapshotHash });

    idToken = await token();
    const reload = await json(`${BASE_URL}/api/maritime/file?companyId=${ctx.companyId}&fleetId=${ctx.fleetId}&shipId=${ctx.shipId}&year=${YEAR}`, { headers: ah() });
    assert.equal(reload.body.status, "locked"); assert.equal(reload.body.dataHash, dataHash); assert.equal(canonical(reload.body.file.voyages), canonical(file.voyages)); assert.equal(canonical(reload.body.file.fuels), canonical(file.fuels));
    step("Fresh Firebase session preserved exact server state", { revision: reload.body.revision, dataHash: reload.body.dataHash });

    const versions = await json(`${BASE_URL}/api/maritime/versions?companyId=${ctx.companyId}&fleetId=${ctx.fleetId}&shipId=${ctx.shipId}&year=${YEAR}`, { headers: ah() });
    const audit = await json(`${BASE_URL}/api/maritime/audit?companyId=${ctx.companyId}&fleetId=${ctx.fleetId}&shipId=${ctx.shipId}&year=${YEAR}`, { headers: ah() });
    const actions = new Set((audit.body.events || []).map((x: any) => String(x.action || "")));
    for (const required of ["FILE_SYNC", "EVIDENCE_FINALIZED", "CHECKPOINT_CREATED", "FILE_LOCKED_PREPARATION", "EVIDENCE_INTEGRITY_VERIFIED"]) assert.ok(actions.has(required), `Missing audit event ${required}`);
    assert.ok(versions.body.versions.length >= 3);
    step("Version history + immutable audit lifecycle passed", { versions: versions.body.versions.length, auditEvents: audit.body.events.length });
    report.passed = true; report.completedAt = now();
  } finally {
    const errors: string[] = [];
    try {
      if (ctx) {
        const p = `${ctx.companyId}/${ctx.fleetId}/${ctx.shipId}/${ctx.year}/`;
        await bucket.deleteFiles({ prefix: `maritime-evidence/records/${p}` }).catch(() => {});
        await bucket.deleteFiles({ prefix: `maritime-evidence/_tmp/${p}` }).catch(() => {});
        const sref = db.collection("companies").doc(ctx.companyId).collection("maritimeFleets").doc(ctx.fleetId).collection("ships").doc(ctx.shipId);
        await db.recursiveDelete(sref).catch((e: Error) => errors.push(`ship:${e.message}`));
      }
      await db.recursiveDelete(db.collection("companies").doc(companyId)).catch((e: Error) => errors.push(`company:${e.message}`));
      if (user?.uid) {
        const href = db.collection("maritimeUserHomes").doc(user.uid);
        if (originalHomeExists) await href.set(originalHome, { merge: false }); else await href.delete().catch(() => {});
        if (originalDisabled && !createdUser) await auth.updateUser(user.uid, { disabled: true }).catch((e: Error) => errors.push(`disabled:${e.message}`));
        if (createdUser) await auth.deleteUser(user.uid).catch((e: Error) => errors.push(`user:${e.message}`));
      }
      const company = await db.collection("companies").doc(companyId).get(); assert.equal(company.exists, false);
      report.cleanupPassed = errors.length === 0; report.cleanupErrors = errors;
      step("Cleanup restored original TEB232 state and removed all E2E data", { cleanupPassed: report.cleanupPassed, errors });
    } catch (e: any) { errors.push(e?.message || String(e)); report.cleanupPassed = false; report.cleanupErrors = errors; }
    report.finishedAt = now();
    fs.writeFileSync(path.join(ARTIFACT_DIR, "teb232-maritime-operational-live-e2e-report.json"), JSON.stringify(report, null, 2));
    fs.writeFileSync(path.join(ARTIFACT_DIR, "teb232-maritime-operational-live-e2e-summary.md"), `# TEB232 Maritime Operational Live E2E\n\n- Run: ${RUN_ID}\n- Authenticated live core: ${report.passed ? "PASS" : "FAIL"}\n- Cleanup: ${report.cleanupPassed ? "PASS" : "FAIL"}\n- Paddle/payment: intentionally excluded from this operational test; no production charge performed.\n`);
  }
  assert.equal(report.passed, true);
  assert.equal(report.cleanupPassed, true);
  console.log(`[TEB232 OP E2E RESULT] PASS run=${RUN_ID}`);
}

main().catch(e => { console.error("[TEB232 OP E2E FATAL]", e?.stack || e); process.exitCode = 1; });

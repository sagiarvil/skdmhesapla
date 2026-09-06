import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const requireFromFunctions = createRequire(new URL("../../functions/package.json", import.meta.url));
const { initializeApp, cert, getApps } = requireFromFunctions("firebase-admin/app");
const { getAuth } = requireFromFunctions("firebase-admin/auth");
const { getFirestore } = requireFromFunctions("firebase-admin/firestore");

const PROJECT_ID = "carbon-web-1265b";
const TEST_EMAIL = process.env.TEB232_TEST_EMAIL || "teb232@gmail.com";
const STABLE_FLEET_ID = "teb232-visible-fleet";
const ACTIVE_SHIP_ID = "teb232-strict-2026";
const ACTIVE_YEAR = 2026;

const BASELINES = [
  { shipId: "teb232-strict-2025", year: 2025 },
  { shipId: "teb232-strict-2026", year: 2026 },
] as const;

const SCENARIOS = [
  "teb232-scn-missing-registry",
  "teb232-scn-fuel-reconcile",
  "teb232-scn-wtw-mismatch",
  "teb232-scn-energy-mismatch",
  "teb232-scn-moha-missing",
  "teb232-scn-entity-collision",
  "teb232-scn-duplicate-voyage",
  "teb232-scn-ops-mismatch",
  "teb232-scn-integrity-fail",
] as const;

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function nowIso() {
  return new Date().toISOString();
}

async function main() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON required");

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert(JSON.parse(raw)), projectId: PROJECT_ID });

  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = await auth.getUserByEmail(TEST_EMAIL);
  const companyId = `teb232-visible-${sha256(user.uid).slice(0, 20)}`;
  const fleetId = STABLE_FLEET_ID;
  const ts = nowIso();
  const verify = process.argv.includes("--verify");

  const companyRef = db.collection("companies").doc(companyId);
  const fleetRef = companyRef.collection("maritimeFleets").doc(fleetId);
  const homeRef = db.collection("maritimeUserHomes").doc(user.uid);

  await companyRef.set({
    schemaVersion: "maritime-enterprise-v2",
    name: "TEB232 Visible Maritime QA Workspace",
    ownerId: user.uid,
    members: [user.uid],
    status: "active",
    durableVisibleTestWorkspace: true,
    updatedAt: ts,
    updatedBy: user.uid,
  }, { merge: true });

  await companyRef.collection("members").doc(user.uid).set({
    uid: user.uid,
    role: "owner",
    active: true,
    durableVisibleTestWorkspace: true,
    updatedAt: ts,
    updatedBy: user.uid,
  }, { merge: true });

  await fleetRef.set({
    schemaVersion: "maritime-enterprise-v2",
    name: "TEB232 Visible Test Fleet",
    status: "active",
    durableVisibleTestWorkspace: true,
    updatedAt: ts,
    updatedBy: user.uid,
  }, { merge: true });

  // TEB232 is an explicit QA account. Its visible scenario workspace must never depend on
  // whichever ephemeral E2E tenant happened to own maritimeUserHomes during a concurrent run.
  await homeRef.set({
    schemaVersion: "maritime-enterprise-v2",
    companyId,
    fleetId,
    shipId: ACTIVE_SHIP_ID,
    year: ACTIVE_YEAR,
    durableVisibleTestWorkspace: true,
    activeReportChangedAt: ts,
    updatedAt: ts,
  }, { merge: false });

  if (!verify) {
    console.log(JSON.stringify({ ok: true, action: "pinned", account: TEST_EMAIL, companyId, fleetId, activeShipId: ACTIVE_SHIP_ID, activeYear: ACTIVE_YEAR }, null, 2));
    return;
  }

  const shipsRef = fleetRef.collection("ships");
  const shipSnap = await shipsRef.get();
  const shipIds = new Set(shipSnap.docs.map((doc: any) => doc.id));

  for (const baseline of BASELINES) {
    assert.ok(shipIds.has(baseline.shipId), `Visible baseline missing: ${baseline.shipId}`);
    const yearSnap = await shipsRef.doc(baseline.shipId).collection("reportingYears").doc(String(baseline.year)).get();
    assert.ok(yearSnap.exists, `Visible baseline year missing: ${baseline.shipId}/${baseline.year}`);
    const year = yearSnap.data() || {};
    assert.equal(year.strictAudit?.ready, true, `Baseline not ready: ${baseline.shipId}`);
    assert.equal(year.strictAudit?.score, 100, `Baseline score drift: ${baseline.shipId}`);
  }

  for (const scenarioId of SCENARIOS) {
    assert.ok(shipIds.has(scenarioId), `Visible scenario missing: ${scenarioId}`);
    const ship = await shipsRef.doc(scenarioId).get();
    assert.equal(ship.data()?.visibleInTestAccount, true, `Scenario visibility flag missing: ${scenarioId}`);
    assert.equal(ship.data()?.expectedState, "blocked", `Scenario expectedState drift: ${scenarioId}`);
    const yearSnap = await shipsRef.doc(scenarioId).collection("reportingYears").doc(String(ACTIVE_YEAR)).get();
    assert.ok(yearSnap.exists, `Scenario year missing: ${scenarioId}/${ACTIVE_YEAR}`);
    const year = yearSnap.data() || {};
    assert.equal(year.strictAudit?.ready, false, `Scenario unexpectedly ready: ${scenarioId}`);
    assert.ok(Number(year.strictAudit?.score) <= 49, `Scenario score must remain blocked <=49: ${scenarioId}`);
    assert.ok(Array.isArray(year.strictAudit?.missing) && year.strictAudit.missing.length > 0, `Scenario missing-list empty: ${scenarioId}`);
  }

  const expectedIds = new Set([...BASELINES.map(x => x.shipId), ...SCENARIOS]);
  const visibleIds = shipSnap.docs
    .filter((doc: any) => doc.data()?.visibleInTestAccount === true)
    .map((doc: any) => doc.id);
  for (const id of expectedIds) assert.ok(visibleIds.includes(id), `Expected visible report absent: ${id}`);

  const finalHome = await homeRef.get();
  assert.equal(finalHome.data()?.companyId, companyId);
  assert.equal(finalHome.data()?.fleetId, fleetId);
  assert.equal(finalHome.data()?.shipId, ACTIVE_SHIP_ID);
  assert.equal(Number(finalHome.data()?.year), ACTIVE_YEAR);

  console.log(JSON.stringify({
    ok: true,
    action: "verified",
    account: TEST_EMAIL,
    companyId,
    fleetId,
    activeShipId: ACTIVE_SHIP_ID,
    activeYear: ACTIVE_YEAR,
    baselineCount: BASELINES.length,
    scenarioCount: SCENARIOS.length,
    visibleReportCount: visibleIds.length,
    visibleIds: visibleIds.sort(),
  }, null, 2));
}

main().catch((error) => {
  console.error("[TEB232 VISIBLE WORKSPACE PIN]", error?.stack || error);
  process.exitCode = 1;
});

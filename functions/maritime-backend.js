"use strict";

/**
 * SKDMhesapla Maritime Enterprise Backend
 * ----------------------------------------
 * Server-authoritative persistence for one ship + one reporting year preparation files.
 * Browser is never owner/role/revision/audit/hash authority.
 *
 * Regulatory storage design basis:
 * - EU MRV 2015/757 Art. 4(4): transparent, reproducible monitoring data trail.
 * - Delegated Regulation (EU) 2023/2917 Art. 10: verifier supporting information,
 *   data-flow/primary-source evidence and retention by MARPOL/SOLAS periods.
 * - FuelEU Regulation (EU) 2023/1805 Art. 15: timely/transparent ship-specific recording.
 * - Implementing Regulation (EU) 2024/2027 Art. 11(5): FuelEU supporting information
 *   retained for at least five years; Arts. 15-16 require traceability/reconciliation.
 *
 * IMPORTANT: this service prepares data for independent verification. It is not an
 * accredited verifier and never creates an official Document of Compliance.
 */
const crypto = require("node:crypto");
const { onRequest } = require("firebase-functions/v2/https");
const { getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

if (!getApps().length) initializeApp();
const db = getFirestore();

const SCHEMA_VERSION = "maritime-backend-v1";
const RULESET_ID = "eu-maritime-2026-09-04";
const MAX_BODY_BYTES = 5 * 1024 * 1024;
const MAX_VOYAGES = 5000;
const MAX_FUELS = 1000;
const MAX_EVIDENCE = 250;
const ROLES = new Set(["owner", "admin", "compliance_manager", "editor", "viewer"]);
const WRITE_ROLES = new Set(["owner", "admin", "compliance_manager", "editor"]);
const LOCK_ROLES = new Set(["owner", "admin", "compliance_manager"]);
const ADMIN_ROLES = new Set(["owner", "admin"]);
const REQUIRED_EVIDENCE_KEYS = new Set([
  "monitoring-plan", "voyage-list", "data-gaps", "logbook", "bdn",
  "fuel-certificates", "distance-time", "factors",
]);

const RETENTION_POLICY = Object.freeze({
  version: "maritime-retention-v1",
  fuelEuMinimumYears: 5,
  fuelEuLegalBasis: "Commission Implementing Regulation (EU) 2024/2027 Article 11(5); Regulation (EU) 2023/1805 Article 7(4)",
  mrvLegalBasis: "Commission Delegated Regulation (EU) 2023/2917 Article 10(5): MARPOL/SOLAS retention periods",
  automaticPurge: false,
  legalHoldSupported: true,
});

function nowIso() { return new Date().toISOString(); }
function fail(res, status, message, code, extra) {
  res.status(status).json({ ok: false, code: code || "MARITIME_ERROR", message, ...(extra || {}) });
}
function safeText(v, max = 500) { return String(v == null ? "" : v).trim().slice(0, max); }
function safeNumber(v, min = -1e18, max = 1e18) {
  const n = Number(v); return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : 0;
}
function safeBool(v) { return v === true; }
function safeId(v, fallback = "") {
  const s = String(v || "").replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 120);
  return s || fallback;
}
function hashText(v) { return crypto.createHash("sha256").update(String(v)).digest("hex"); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((o, k) => { o[k] = stable(value[k]); return o; }, {});
  }
  return value;
}
function canonicalJson(value) { return JSON.stringify(stable(value)); }
function canonicalHash(value) { return hashText(canonicalJson(value)); }
function randomId(prefix) { return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`; }

async function requireRegisteredUser(req) {
  const h = String(req.get("authorization") || "");
  const match = /^Bearer\s+(.+)$/i.exec(h);
  if (!match) { const e = new Error("Üye girişi gerekli"); e.http = 401; e.code = "AUTH_REQUIRED"; throw e; }
  try {
    const decoded = await getAuth().verifyIdToken(match[1].trim(), true);
    if (decoded.firebase?.sign_in_provider === "anonymous") {
      const e = new Error("Denizcilik çalışma dosyası için kayıtlı kullanıcı hesabı gerekli"); e.http = 401; e.code = "REGISTERED_USER_REQUIRED"; throw e;
    }
    return { uid: decoded.uid, email: decoded.email || null, name: decoded.name || null };
  } catch (err) {
    if (err && err.http) throw err;
    const e = new Error("Kimlik doğrulaması geçersiz veya süresi dolmuş"); e.http = 401; e.code = "AUTH_INVALID"; throw e;
  }
}

function companyRef(companyId) { return db.collection("companies").doc(companyId); }
function memberRef(companyId, uid) { return companyRef(companyId).collection("members").doc(uid); }
function fleetRef(companyId, fleetId) { return companyRef(companyId).collection("maritimeFleets").doc(fleetId); }
function shipRef(ctx) { return fleetRef(ctx.companyId, ctx.fleetId).collection("ships").doc(ctx.shipId); }
function yearRef(ctx) { return shipRef(ctx).collection("reportingYears").doc(String(ctx.year)); }
function homeRef(uid) { return db.collection("maritimeUserHomes").doc(uid); }

async function ensureWorkspace(user) {
  const home = homeRef(user.uid);
  const companyId = `mco_${hashText(user.uid).slice(0, 24)}`;
  const fleetId = "primary";
  await db.runTransaction(async (tx) => {
    const homeSnap = await tx.get(home);
    if (homeSnap.exists) return;
    const cRef = companyRef(companyId);
    const mRef = memberRef(companyId, user.uid);
    const fRef = fleetRef(companyId, fleetId);
    const ts = nowIso();
    tx.set(cRef, {
      schemaVersion: SCHEMA_VERSION, name: user.name || "Denizcilik Çalışma Alanı", ownerId: user.uid,
      members: [user.uid], status: "active", createdAt: ts, createdBy: user.uid, updatedAt: ts,
      retentionPolicy: RETENTION_POLICY,
    }, { merge: true });
    tx.set(mRef, { uid: user.uid, role: "owner", active: true, createdAt: ts, createdBy: user.uid });
    tx.set(fRef, { schemaVersion: SCHEMA_VERSION, name: "Ana Filo", status: "active", createdAt: ts, createdBy: user.uid, updatedAt: ts });
    tx.set(home, { companyId, fleetId, createdAt: ts, updatedAt: ts, schemaVersion: SCHEMA_VERSION });
  });
  return (await home.get()).data();
}

async function getRole(companyId, uid) {
  const m = await memberRef(companyId, uid).get();
  if (m.exists && m.data().active !== false && ROLES.has(m.data().role)) return m.data().role;
  const c = await companyRef(companyId).get();
  if (c.exists && String(c.data().ownerId || "") === uid) return "owner";
  return null;
}
async function authorize(companyId, uid, allowed) {
  const role = await getRole(companyId, uid);
  if (!role || !allowed.has(role)) { const e = new Error("Bu denizcilik çalışma alanına erişim yetkiniz yok"); e.http = 403; e.code = "RBAC_DENIED"; throw e; }
  return role;
}

function normalizeCompany(v = {}) {
  return {
    companyName: safeText(v.companyName, 240), role: safeText(v.role, 40), imoCompanyNumber: safeText(v.imoCompanyNumber, 80),
    registeredOwnerName: safeText(v.registeredOwnerName, 240), registeredOwnerImoNumber: safeText(v.registeredOwnerImoNumber, 80),
    country: safeText(v.country, 120), address: safeText(v.address, 800), contactName: safeText(v.contactName, 180),
    contactEmail: safeText(v.contactEmail, 254).toLowerCase(), telephone: safeText(v.telephone, 80),
    administeringAuthority: safeText(v.administeringAuthority, 240), formalMandateReference: safeText(v.formalMandateReference, 500),
  };
}
function normalizeShip(v = {}) {
  return {
    shipName: safeText(v.shipName, 240), imoNumber: safeText(v.imoNumber, 40), portOfRegistry: safeText(v.portOfRegistry, 180),
    homePort: safeText(v.homePort, 180), flagState: safeText(v.flagState, 120), shipType: safeText(v.shipType, 60),
    officialCategory: safeText(v.officialCategory, 120), deadweightTonnes: safeNumber(v.deadweightTonnes, 0), grossTonnage: safeNumber(v.grossTonnage, 0),
    classificationSociety: safeText(v.classificationSociety, 180), iceClass: safeText(v.iceClass, 80),
    technicalEfficiencyType: safeText(v.technicalEfficiencyType, 20), technicalEfficiencyValue: safeText(v.technicalEfficiencyValue, 80),
    description: safeText(v.description, 1200),
  };
}
function normalizeMonitoring(v = {}) {
  return {
    monitoringPlanVersion: safeText(v.monitoringPlanVersion, 80), monitoringPlanReferenceDate: safeText(v.monitoringPlanReferenceDate, 40),
    monitoringPlanAssessed: safeBool(v.monitoringPlanAssessed), monitoringPlanApproved: safeBool(v.monitoringPlanApproved),
    revisionNotes: safeText(v.revisionNotes, 3000), fuelMonitoringMethod: safeText(v.fuelMonitoringMethod, 500),
    densityMethod: safeText(v.densityMethod, 500), uncertaintyMethod: safeText(v.uncertaintyMethod, 500),
    emissionFactorMethod: safeText(v.emissionFactorMethod, 500), dataGapMethod: safeText(v.dataGapMethod, 1500),
    emissionSources: Array.isArray(v.emissionSources) ? v.emissionSources.slice(0, 100).map(x => safeText(x, 180)).filter(Boolean) : [],
    measurementEquipment: safeText(v.measurementEquipment, 1500), itSystem: safeText(v.itSystem, 1500), proceduresReference: safeText(v.proceduresReference, 1500),
  };
}
function normalizeVoyage(v = {}, index = 0) {
  return {
    id: safeId(v.id, `voyage-${index + 1}`), orderIndex: index,
    departurePort: safeText(v.departurePort, 180), departureUnlocode: safeText(v.departureUnlocode, 20), departureAt: safeText(v.departureAt, 60),
    arrivalPort: safeText(v.arrivalPort, 180), arrivalUnlocode: safeText(v.arrivalUnlocode, 20), arrivalAt: safeText(v.arrivalAt, 60),
    scope: safeText(v.scope, 40), portCallPurpose: safeText(v.portCallPurpose, 180), exclusionReason: safeText(v.exclusionReason, 1000),
    distanceNm: safeNumber(v.distanceNm, 0), timeAtSeaHours: safeNumber(v.timeAtSeaHours, 0), timeAtBerthHours: safeNumber(v.timeAtBerthHours, 0),
    cargoTonnes: safeNumber(v.cargoTonnes, 0), passengers: safeNumber(v.passengers, 0), transportWorkTonneNm: safeNumber(v.transportWorkTonneNm, 0),
    co2Tonnes: safeNumber(v.co2Tonnes, 0), ch4TonnesCo2e: safeNumber(v.ch4TonnesCo2e, 0), n2oTonnesCo2e: safeNumber(v.n2oTonnesCo2e, 0),
    fuelTonnes: safeNumber(v.fuelTonnes, 0), dataGap: safeBool(v.dataGap), dataGapReason: safeText(v.dataGapReason, 2000),
  };
}
function normalizeFuel(v = {}, index = 0) {
  return {
    id: safeId(v.id, `fuel-${index + 1}`), orderIndex: index, fuelType: safeText(v.fuelType, 180), fuelConsumer: safeText(v.fuelConsumer, 180),
    bdnReference: safeText(v.bdnReference, 500), sustainabilityCertificate: safeText(v.sustainabilityCertificate, 500),
    quantityTonnes: safeNumber(v.quantityTonnes, 0), lowerCalorificValueMjPerTonne: safeNumber(v.lowerCalorificValueMjPerTonne, 0),
    energyMj: safeNumber(v.energyMj, 0), atBerthEnergyMj: safeNumber(v.atBerthEnergyMj, 0), wellToTankFactorGco2ePerMj: safeNumber(v.wellToTankFactorGco2ePerMj, -1e9),
    tankToWakeCo2Factor: safeNumber(v.tankToWakeCo2Factor, -1e9), tankToWakeCh4Factor: safeNumber(v.tankToWakeCh4Factor, -1e9),
    tankToWakeN2oFactor: safeNumber(v.tankToWakeN2oFactor, -1e9), slipFactor: safeNumber(v.slipFactor, -1e9),
    wellToWakeEmissionsGco2e: safeNumber(v.wellToWakeEmissionsGco2e, 0), opsElectricityKwh: safeNumber(v.opsElectricityKwh, 0),
    measurementMethod: safeText(v.measurementMethod, 1000), calibrationReference: safeText(v.calibrationReference, 500), factorSourceReference: safeText(v.factorSourceReference, 1000),
  };
}
function normalizeEvidence(v = {}) {
  const out = {};
  for (const [key, value] of Object.entries(v || {}).slice(0, MAX_EVIDENCE)) out[safeId(key)] = value === true;
  return out;
}
function normalizeFile(raw = {}) {
  const bytes = Buffer.byteLength(JSON.stringify(raw || {}));
  if (bytes > MAX_BODY_BYTES) { const e = new Error("Çalışma dosyası tek senkronizasyon için 5 MB sınırını aşıyor"); e.http = 413; e.code = "PAYLOAD_TOO_LARGE"; throw e; }
  const year = Math.trunc(safeNumber(raw.reportingYear, 2024, 2100));
  const voyages = Array.isArray(raw.voyages) ? raw.voyages : [];
  const fuels = Array.isArray(raw.fuels) ? raw.fuels : [];
  if (voyages.length > MAX_VOYAGES || fuels.length > MAX_FUELS) { const e = new Error("Kayıt adedi güvenli işlem sınırını aşıyor"); e.http = 413; e.code = "ROW_LIMIT"; throw e; }
  return { reportingYear: year, company: normalizeCompany(raw.company), ship: normalizeShip(raw.ship), monitoring: normalizeMonitoring(raw.monitoring), voyages: voyages.map(normalizeVoyage), fuels: fuels.map(normalizeFuel), evidence: normalizeEvidence(raw.evidence) };
}

async function createFile(user, year) {
  const home = await ensureWorkspace(user);
  await authorize(home.companyId, user.uid, WRITE_ROLES);
  const sRef = fleetRef(home.companyId, home.fleetId).collection("ships").doc();
  const ctx = { companyId: home.companyId, fleetId: home.fleetId, shipId: sRef.id, year: Math.trunc(safeNumber(year, 2024, 2100)) || 2026 };
  const ts = nowIso();
  const yRef = yearRef(ctx);
  const batch = db.batch();
  batch.set(sRef, { schemaVersion: SCHEMA_VERSION, status: "active", createdAt: ts, createdBy: user.uid, updatedAt: ts, updatedBy: user.uid, currentReportingYear: ctx.year });
  batch.set(yRef, { schemaVersion: SCHEMA_VERSION, rulesetId: RULESET_ID, reportingYear: ctx.year, status: "draft", revision: 0, legalHold: false, retentionPolicy: RETENTION_POLICY, createdAt: ts, createdBy: user.uid, updatedAt: ts, updatedBy: user.uid });
  batch.set(homeRef(user.uid), { ...ctx, updatedAt: ts }, { merge: true });
  await batch.commit();
  return ctx;
}
async function currentContext(user, requestedYear) {
  const home = await ensureWorkspace(user);
  if (home.shipId && home.year) {
    const ctx = { companyId: home.companyId, fleetId: home.fleetId, shipId: home.shipId, year: Number(home.year) };
    await authorize(ctx.companyId, user.uid, new Set(ROLES));
    return ctx;
  }
  return createFile(user, requestedYear || 2026);
}

async function hydrate(ctx) {
  const ySnap = await yearRef(ctx).get();
  if (!ySnap.exists) return null;
  const y = ySnap.data();
  if (!y.activeSyncId) return { context: ctx, revision: Number(y.revision || 0), status: y.status || "draft", file: null, dataHash: y.dataHash || null };
  const [vSnap, fSnap, eSnap] = await Promise.all([
    yearRef(ctx).collection("voyages").where("syncId", "==", y.activeSyncId).get(),
    yearRef(ctx).collection("fuels").where("syncId", "==", y.activeSyncId).get(),
    yearRef(ctx).collection("evidence").where("syncId", "==", y.activeSyncId).get(),
  ]);
  const voyages = vSnap.docs.map(d => d.data()).sort((a,b) => a.orderIndex - b.orderIndex).map(({syncId,recordHash,createdAt,createdBy,...x}) => x);
  const fuels = fSnap.docs.map(d => d.data()).sort((a,b) => a.orderIndex - b.orderIndex).map(({syncId,recordHash,createdAt,createdBy,...x}) => x);
  const evidence = {};
  eSnap.docs.forEach(d => { const x = d.data(); evidence[x.key] = x.present === true; });
  return {
    context: ctx, revision: Number(y.revision || 0), status: y.status || "draft", dataHash: y.dataHash || null,
    file: { reportingYear: Number(y.reportingYear), company: y.companySnapshot || {}, ship: y.shipSnapshot || {}, monitoring: y.monitoring || {}, voyages, fuels, evidence },
    rulesetId: y.rulesetId || RULESET_ID, lastSnapshotHash: y.lastSnapshotHash || null, lockedAt: y.lockedAt || null,
  };
}

async function syncFile(user, ctx, rawFile, expectedRevision) {
  const role = await authorize(ctx.companyId, user.uid, WRITE_ROLES);
  const file = normalizeFile(rawFile);
  if (file.reportingYear !== Number(ctx.year)) { const e = new Error("Raporlama yılı aktif dosyayla eşleşmiyor"); e.http = 409; e.code = "YEAR_MISMATCH"; throw e; }
  const dataHash = canonicalHash({ schemaVersion: SCHEMA_VERSION, rulesetId: RULESET_ID, file });
  const yRef = yearRef(ctx);
  const before = await yRef.get();
  if (!before.exists) { const e = new Error("Raporlama dosyası bulunamadı"); e.http = 404; e.code = "FILE_NOT_FOUND"; throw e; }
  const current = before.data();
  if (current.status === "locked") { const e = new Error("Dosya kilitli; yeni değişiklik için yeni/superseding çalışma açılmalıdır"); e.http = 423; e.code = "FILE_LOCKED"; throw e; }
  if (current.dataHash === dataHash) return { unchanged: true, revision: Number(current.revision || 0), dataHash, status: current.status || "draft" };
  if (expectedRevision != null && Number(expectedRevision) !== Number(current.revision || 0)) { const e = new Error("Dosya başka bir oturumda değişti; güncel sürümü yeniden yükleyin"); e.http = 409; e.code = "REVISION_CONFLICT"; e.currentRevision = Number(current.revision || 0); throw e; }

  const syncId = randomId("sync");
  const ts = nowIso();
  const writer = db.bulkWriter();
  for (const v of file.voyages) {
    const payload = { ...v, syncId, recordHash: canonicalHash(v), createdAt: ts, createdBy: user.uid };
    writer.create(yRef.collection("voyages").doc(`${syncId}_${hashText(v.id).slice(0,20)}`), payload);
  }
  for (const f of file.fuels) {
    const payload = { ...f, syncId, recordHash: canonicalHash(f), createdAt: ts, createdBy: user.uid };
    writer.create(yRef.collection("fuels").doc(`${syncId}_${hashText(f.id).slice(0,20)}`), payload);
  }
  let ei = 0;
  for (const [key, present] of Object.entries(file.evidence)) {
    const payload = { key, present, orderIndex: ei++, syncId, recordHash: canonicalHash({key,present}), createdAt: ts, createdBy: user.uid };
    writer.create(yRef.collection("evidence").doc(`${syncId}_${hashText(key).slice(0,20)}`), payload);
  }
  await writer.close();

  let revision;
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(yRef);
    const latest = snap.data() || {};
    if (latest.status === "locked") { const e = new Error("Dosya senkronizasyon sırasında kilitlendi"); e.http = 423; e.code = "FILE_LOCKED"; throw e; }
    if (expectedRevision != null && Number(latest.revision || 0) !== Number(expectedRevision)) { const e = new Error("Eşzamanlı değişiklik algılandı"); e.http = 409; e.code = "REVISION_CONFLICT"; e.currentRevision = Number(latest.revision || 0); throw e; }
    revision = Number(latest.revision || 0) + 1;
    const auditId = randomId("audit");
    tx.set(yRef, {
      schemaVersion: SCHEMA_VERSION, rulesetId: RULESET_ID, reportingYear: file.reportingYear,
      companySnapshot: file.company, shipSnapshot: file.ship, monitoring: file.monitoring,
      activeSyncId: syncId, dataHash, revision, status: "draft", rowCounts: { voyages: file.voyages.length, fuels: file.fuels.length, evidence: Object.keys(file.evidence).length },
      updatedAt: ts, updatedBy: user.uid, retentionPolicy: RETENTION_POLICY,
    }, { merge: true });
    tx.set(shipRef(ctx), { ...file.ship, schemaVersion: SCHEMA_VERSION, status: "active", updatedAt: ts, updatedBy: user.uid, currentReportingYear: file.reportingYear }, { merge: true });
    tx.set(yRef.collection("versions").doc(syncId), {
      versionId: syncId, type: "autosave", schemaVersion: SCHEMA_VERSION, rulesetId: RULESET_ID, revision,
      dataHash, activeSyncId: syncId, companySnapshot: file.company, shipSnapshot: file.ship, monitoring: file.monitoring,
      rowCounts: { voyages: file.voyages.length, fuels: file.fuels.length, evidence: Object.keys(file.evidence).length },
      createdAt: ts, createdBy: user.uid, immutable: true,
    });
    tx.set(yRef.collection("auditEvents").doc(auditId), {
      eventId: auditId, action: "FILE_SYNC", actorUid: user.uid, actorRole: role, at: ts,
      fromRevision: Number(latest.revision || 0), toRevision: revision, beforeHash: latest.dataHash || null, afterHash: dataHash,
      rulesetId: RULESET_ID, syncId, immutable: true,
    });
  });
  return { unchanged: false, revision, dataHash, status: "draft", syncId };
}

function readiness(file) {
  const missing = [];
  const req = (ok, label) => { if (!ok) missing.push(label); };
  req(file.company.companyName, "Shipping company adı");
  req(file.company.imoCompanyNumber, "IMO unique company / registered owner identification number");
  req(file.company.registeredOwnerName, "Registered owner adı");
  if (file.company.role !== "gemi-sahibi") req(file.company.formalMandateReference, "Formal mandate/delegation referansı");
  req(file.ship.shipName, "Gemi adı"); req(file.ship.imoNumber, "IMO ship identification number");
  req(file.ship.portOfRegistry, "Port of registry"); req(file.ship.flagState, "Flag State"); req(file.ship.grossTonnage > 0, "Gross Tonnage");
  req(file.monitoring.monitoringPlanVersion, "Monitoring Plan version"); req(file.monitoring.monitoringPlanReferenceDate, "Monitoring Plan reference date");
  req(file.monitoring.fuelMonitoringMethod, "Fuel monitoring method"); req(file.monitoring.dataGapMethod, "Data-gap method");
  req(file.monitoring.emissionSources?.length > 0, "Emission sources listesi"); req(file.voyages.length > 0, "Voyage register"); req(file.fuels.length > 0, "Fuel/energy register");
  file.voyages.forEach((v,i) => { req(v.departurePort && v.arrivalPort, `Sefer ${i+1}: limanlar`); req(v.departureAt && v.arrivalAt, `Sefer ${i+1}: tarih/saat`); if (v.dataGap) req(v.dataGapReason, `Sefer ${i+1}: data-gap gerekçesi`); });
  file.fuels.forEach((f,i) => { req(f.fuelType, `Yakıt ${i+1}: tür`); req(f.bdnReference || f.opsElectricityKwh > 0, `Yakıt ${i+1}: BDN/electricity reference`); req(f.energyMj > 0, `Yakıt ${i+1}: energy MJ`); req(f.measurementMethod, `Yakıt ${i+1}: measurement method`); req(f.factorSourceReference, `Yakıt ${i+1}: factor source`); });
  for (const key of REQUIRED_EVIDENCE_KEYS) req(file.evidence[key] === true, `Kanıt: ${key}`);
  return { ready: missing.length === 0, missing };
}

async function checkpoint(user, ctx, lock) {
  const role = await authorize(ctx.companyId, user.uid, lock ? LOCK_ROLES : WRITE_ROLES);
  const hydrated = await hydrate(ctx);
  if (!hydrated || !hydrated.file) { const e = new Error("Kaydedilmiş çalışma verisi bulunamadı"); e.http = 409; e.code = "NO_DATA"; throw e; }
  if (hydrated.status === "locked") { const e = new Error("Dosya zaten kilitli"); e.http = 423; e.code = "FILE_LOCKED"; throw e; }
  const gate = readiness(hydrated.file);
  if (lock && !gate.ready) { const e = new Error("Kritik hazırlık alanları tamamlanmadan dosya kilitlenemez"); e.http = 422; e.code = "READINESS_BLOCKED"; e.missing = gate.missing; throw e; }
  const versionId = randomId(lock ? "lock" : "checkpoint");
  const ts = nowIso();
  const snapshot = {
    product: "SKDMhesapla Maritime Carbon Compliance Preparation File", disclaimer: "Preparation output only; not accredited verification or official Document of Compliance.",
    schemaVersion: SCHEMA_VERSION, rulesetId: RULESET_ID, context: ctx, file: hydrated.file,
    sourceRevision: hydrated.revision, sourceHash: hydrated.dataHash, checkpointType: lock ? "locked-preparation" : "checkpoint", createdAt: ts,
  };
  const snapshotHash = canonicalHash(snapshot);
  const auditId = randomId("audit");
  await db.runTransaction(async tx => {
    const y = await tx.get(yearRef(ctx)); const d = y.data() || {};
    if (d.status === "locked") { const e = new Error("Dosya kilitli"); e.http = 423; e.code = "FILE_LOCKED"; throw e; }
    tx.set(yearRef(ctx).collection("versions").doc(versionId), {
      versionId, type: lock ? "locked-preparation" : "checkpoint", immutable: true, schemaVersion: SCHEMA_VERSION, rulesetId: RULESET_ID,
      snapshotHash, sourceHash: hydrated.dataHash, sourceRevision: hydrated.revision, activeSyncId: d.activeSyncId,
      companySnapshot: hydrated.file.company, shipSnapshot: hydrated.file.ship, monitoring: hydrated.file.monitoring,
      rowCounts: d.rowCounts || {}, readiness: gate, createdAt: ts, createdBy: user.uid,
    });
    tx.set(yearRef(ctx).collection("auditEvents").doc(auditId), {
      eventId: auditId, action: lock ? "FILE_LOCKED_PREPARATION" : "CHECKPOINT_CREATED", actorUid: user.uid, actorRole: role,
      at: ts, revision: hydrated.revision, dataHash: hydrated.dataHash, snapshotHash, rulesetId: RULESET_ID, immutable: true,
    });
    tx.set(yearRef(ctx), {
      lastSnapshotVersion: versionId, lastSnapshotHash: snapshotHash,
      ...(lock ? { status: "locked", lockedAt: ts, lockedBy: user.uid, lockedPreparationHash: snapshotHash } : {}),
      updatedAt: ts, updatedBy: user.uid,
    }, { merge: true });
  });
  return { versionId, snapshotHash, readiness: gate, status: lock ? "locked" : hydrated.status };
}

async function listVersions(user, ctx) {
  await authorize(ctx.companyId, user.uid, new Set(ROLES));
  const snap = await yearRef(ctx).collection("versions").orderBy("createdAt", "desc").limit(100).get();
  return snap.docs.map(d => d.data());
}
async function listAudit(user, ctx) {
  await authorize(ctx.companyId, user.uid, new Set(ROLES));
  const snap = await yearRef(ctx).collection("auditEvents").orderBy("at", "desc").limit(200).get();
  return snap.docs.map(d => d.data());
}

async function listMembers(user, companyId) {
  await authorize(companyId, user.uid, ADMIN_ROLES);
  const snap = await companyRef(companyId).collection("members").get(); return snap.docs.map(d => d.data());
}
async function upsertMember(user, companyId, body) {
  const actorRole = await authorize(companyId, user.uid, ADMIN_ROLES);
  const targetUid = safeText(body.uid, 128); const role = safeText(body.role, 40);
  if (!targetUid || !ROLES.has(role) || role === "owner") { const e = new Error("Geçerli uid ve owner dışı rol gerekli"); e.http = 400; e.code = "MEMBER_INVALID"; throw e; }
  const ts = nowIso();
  await memberRef(companyId, targetUid).set({ uid: targetUid, role, active: body.active !== false, updatedAt: ts, updatedBy: user.uid, createdAt: ts, createdBy: user.uid }, { merge: true });
  await companyRef(companyId).collection("auditEvents").doc(randomId("audit")).set({ action: "MEMBER_UPSERT", actorUid: user.uid, actorRole, targetUid, role, active: body.active !== false, at: ts, immutable: true });
  return { uid: targetUid, role, active: body.active !== false };
}

function ctxFromBody(home, body) {
  const c = body?.context || {};
  return { companyId: safeId(c.companyId || home.companyId), fleetId: safeId(c.fleetId || home.fleetId), shipId: safeId(c.shipId || home.shipId), year: Math.trunc(safeNumber(c.year || home.year, 2024, 2100)) };
}

exports.maritimeApi = onRequest({ region: "europe-west3", cors: true, memory: "512MiB", timeoutSeconds: 120, maxInstances: 20 }, async (req, res) => {
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  try {
    const user = await requireRegisteredUser(req);
    const path = String(req.path || "").replace(/^\/api\/maritime/, "").replace(/\/+$/, "") || "/";
    const home = await ensureWorkspace(user);

    if (path === "/workspace" && req.method === "GET") {
      const ctx = await currentContext(user, Number(req.query.year) || 2026);
      const role = await authorize(ctx.companyId, user.uid, new Set(ROLES));
      res.json({ ok: true, context: ctx, role, fileState: await hydrate(ctx), retentionPolicy: RETENTION_POLICY }); return;
    }
    if (path === "/files" && req.method === "POST") {
      const ctx = await createFile(user, req.body?.year || 2026);
      res.status(201).json({ ok: true, context: ctx, revision: 0 }); return;
    }
    if (path === "/file" && req.method === "GET") {
      const ctx = ctxFromBody(home, { context: { companyId: req.query.companyId, fleetId: req.query.fleetId, shipId: req.query.shipId, year: req.query.year } });
      if (!ctx.shipId || !ctx.year) { const e = new Error("Aktif denizcilik dosyası bulunamadı"); e.http = 404; e.code = "NO_ACTIVE_FILE"; throw e; }
      await authorize(ctx.companyId, user.uid, new Set(ROLES));
      res.json({ ok: true, ...(await hydrate(ctx)) }); return;
    }
    if (path === "/file" && req.method === "PUT") {
      const ctx = ctxFromBody(home, req.body || {});
      if (!ctx.shipId || !ctx.year) { const e = new Error("Dosya context zorunlu"); e.http = 400; e.code = "CONTEXT_REQUIRED"; throw e; }
      const result = await syncFile(user, ctx, req.body?.file || {}, req.body?.expectedRevision);
      await homeRef(user.uid).set({ ...ctx, updatedAt: nowIso() }, { merge: true });
      res.json({ ok: true, context: ctx, ...result }); return;
    }
    if (path === "/checkpoint" && req.method === "POST") {
      const ctx = ctxFromBody(home, req.body || {}); res.json({ ok: true, ...(await checkpoint(user, ctx, false)) }); return;
    }
    if (path === "/lock" && req.method === "POST") {
      const ctx = ctxFromBody(home, req.body || {}); res.json({ ok: true, ...(await checkpoint(user, ctx, true)) }); return;
    }
    if (path === "/versions" && req.method === "GET") {
      const ctx = ctxFromBody(home, { context: { companyId: req.query.companyId, fleetId: req.query.fleetId, shipId: req.query.shipId, year: req.query.year } });
      res.json({ ok: true, versions: await listVersions(user, ctx) }); return;
    }
    if (path === "/audit" && req.method === "GET") {
      const ctx = ctxFromBody(home, { context: { companyId: req.query.companyId, fleetId: req.query.fleetId, shipId: req.query.shipId, year: req.query.year } });
      res.json({ ok: true, events: await listAudit(user, ctx) }); return;
    }
    if (path === "/members" && req.method === "GET") { res.json({ ok: true, members: await listMembers(user, home.companyId) }); return; }
    if (path === "/members" && req.method === "POST") { res.json({ ok: true, member: await upsertMember(user, home.companyId, req.body || {}) }); return; }
    if (path === "/health" && req.method === "GET") { res.json({ ok: true, service: "maritime-enterprise-backend", schemaVersion: SCHEMA_VERSION, rulesetId: RULESET_ID }); return; }
    fail(res, 404, "Maritime API endpoint bulunamadı", "NOT_FOUND");
  } catch (err) {
    console.error("maritimeApi", err);
    fail(res, Number(err?.http) || 500, err?.message || "Sunucu hatası", err?.code || "MARITIME_INTERNAL", err?.missing ? { missing: err.missing } : err?.currentRevision != null ? { currentRevision: err.currentRevision } : undefined);
  }
});

module.exports._test = { normalizeFile, canonicalHash, readiness, RETENTION_POLICY, RULESET_ID, SCHEMA_VERSION };

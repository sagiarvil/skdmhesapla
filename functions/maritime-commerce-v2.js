"use strict";

const crypto = require("node:crypto");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const legacy = require("./maritime-commerce-v1.js");
const { RULESET_ID, auditPreparationFile } = require("./maritime-compliance-audit-v1.js");

if (!getApps().length) initializeApp();
const db = getFirestore();
const paddleWebhookSecret = defineSecret("PADDLE_WEBHOOK_SECRET");

function safe(value) { return String(value || "").replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 140); }
function sha256(value) { return crypto.createHash("sha256").update(String(value)).digest("hex"); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.keys(value).sort().reduce((out, key) => { out[key] = stable(value[key]); return out; }, {});
  return value;
}
function canonicalHash(value) { return sha256(JSON.stringify(stable(value))); }
function http(status, code, message, extra) { const e = new Error(message); e.http = status; e.code = code; Object.assign(e, extra || {}); return e; }
function fail(res, error) {
  res.status(Number(error?.http) || 500).json({
    ok: false,
    code: error?.code || "MARITIME_COMMERCE_STRICT_AUDIT",
    message: error?.message || "Ödeme öncesi hazırlık kontrolü tamamlanamadı.",
    ...(error?.missing ? { missing: error.missing } : {}),
    ...(Number.isFinite(error?.score) ? { score: error.score } : {}),
  });
}
async function requireUser(req) {
  const match = /^Bearer\s+(.+)$/i.exec(String(req.get("authorization") || ""));
  if (!match) throw http(401, "AUTH_REQUIRED", "Kayıtlı kullanıcı hesabı gerekli.");
  try {
    const decoded = await getAuth().verifyIdToken(match[1].trim(), true);
    if (decoded.firebase?.sign_in_provider === "anonymous") throw http(401, "REGISTERED_USER_REQUIRED", "Kayıtlı kullanıcı hesabı gerekli.");
    return { uid: decoded.uid };
  } catch (error) {
    if (error?.http) throw error;
    throw http(401, "AUTH_INVALID", "Kullanıcı oturumu doğrulanamadı.");
  }
}

const homeRef = uid => db.collection("maritimeUserHomes").doc(uid);
const companyRef = id => db.collection("companies").doc(id);
const fleetRef = (cid, fid) => companyRef(cid).collection("maritimeFleets").doc(fid);
const shipRef = ctx => fleetRef(ctx.companyId, ctx.fleetId).collection("ships").doc(ctx.shipId);
const yearRef = ctx => shipRef(ctx).collection("reportingYears").doc(String(ctx.year));

async function contextFor(user, requested) {
  const homeSnap = await homeRef(user.uid).get();
  if (!homeSnap.exists) throw http(404, "WORKSPACE_NOT_FOUND", "Denizcilik çalışma alanı bulunamadı.");
  const home = homeSnap.data() || {};
  const reqCtx = requested || {};
  const ctx = {
    companyId: safe(reqCtx.companyId || home.companyId), fleetId: safe(reqCtx.fleetId || home.fleetId),
    shipId: safe(reqCtx.shipId || home.shipId), year: Math.trunc(Number(reqCtx.year || home.year || 0)),
  };
  if (!ctx.companyId || !ctx.fleetId || !ctx.shipId || !ctx.year) throw http(400, "CONTEXT_REQUIRED", "Gemi ve raporlama yılı bağlamı gerekli.");
  if (ctx.companyId !== safe(home.companyId) || ctx.fleetId !== safe(home.fleetId) || ctx.shipId !== safe(home.shipId)) throw http(403, "CONTEXT_DENIED", "Bu çalışma alanına erişim yetkiniz yok.");
  return ctx;
}
function rows(snapshot) {
  return snapshot.docs.map(d => d.data()).sort((a,b) => Number(a.orderIndex || 0) - Number(b.orderIndex || 0)).map(x => x.payload || {});
}
function evidenceManifestHash(docs) {
  const valid = docs.filter(x => x && x.immutable === true && x.sha256 && x.evidenceChainHash && x.documentType);
  return canonicalHash(valid.map(doc => ({
    evidenceId: doc.evidenceId,
    documentType: doc.documentType,
    sha256: doc.sha256,
    evidenceChainHash: doc.evidenceChainHash,
    supports: Array.isArray(doc.supports) ? doc.supports : [],
    linkedVoyageIds: Array.isArray(doc.linkedVoyageIds) ? doc.linkedVoyageIds : [],
    linkedFuelIds: Array.isArray(doc.linkedFuelIds) ? doc.linkedFuelIds : [],
  })));
}

async function auditCheckpoint(user, body) {
  const ctx = await contextFor(user, body?.context || {});
  const versionId = safe(body?.checkpointVersionId);
  const snapshotHash = String(body?.snapshotHash || "").trim();
  if (!versionId || !/^[a-f0-9]{64}$/i.test(snapshotHash)) throw http(400, "CHECKPOINT_REQUIRED", "Ödeme öncesi değişmez hazırlık kontrol noktası gerekli.");
  const yRef = yearRef(ctx);
  const versionSnap = await yRef.collection("versions").doc(versionId).get();
  if (!versionSnap.exists) throw http(404, "CHECKPOINT_NOT_FOUND", "Hazırlık kontrol noktası bulunamadı.");
  const version = versionSnap.data() || {};
  if (String(version.snapshotHash || "") !== snapshotHash) throw http(409, "SNAPSHOT_MISMATCH", "Hazırlık snapshot bütünlük kaydı eşleşmiyor.");
  const syncId = String(version.activeSyncId || "");
  if (!syncId) throw http(409, "SNAPSHOT_ROWS_MISSING", "Hazırlık snapshot veri sürümü bulunamadı.");
  const [voyagesSnap, fuelsSnap, evidenceSnap] = await Promise.all([
    yRef.collection("voyages").where("syncId", "==", syncId).get(),
    yRef.collection("fuels").where("syncId", "==", syncId).get(),
    yRef.collection("evidenceDocuments").orderBy("finalizedAt", "asc").get(),
  ]);
  const evidenceDocs = evidenceSnap.docs.map(d => d.data());
  const currentManifest = evidenceManifestHash(evidenceDocs);
  if (!version.evidenceManifestHash || String(version.evidenceManifestHash) !== currentManifest) {
    throw http(409, "EVIDENCE_SNAPSHOT_STALE", "Kanıt paketi kontrol noktasından sonra değişti. Yeni hazırlık kontrol noktası oluşturun.");
  }
  const file = {
    reportingYear: ctx.year,
    company: version.companySnapshot || {}, verifier: version.verifierSnapshot || {}, ship: version.shipSnapshot || {},
    monitoring: version.monitoring || {}, voyages: rows(voyagesSnap), fuels: rows(fuelsSnap), ice: version.ice || {},
    flexibility: version.flexibility || {}, evidence: {}, evidenceReferences: {},
  };
  const audit = auditPreparationFile(file, evidenceDocs);
  if (!audit.ready) throw http(422, "STRICT_READINESS_BLOCKED", "Satın alınacak çalışma 100/100 ön doğrulama hazırlık koşullarını tamamlamadı.", { missing: audit.missing, score: audit.score });
  return audit;
}

exports.maritimeCommerceApi = onRequest({ region: "europe-west3", cors: true, secrets: [paddleWebhookSecret] }, async (req, res) => {
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  const path = (req.path || "").replace(/^\/api\/maritime-commerce/, "") || "/";
  try {
    if (path === "/strict-health" && req.method === "GET") { res.json({ ok: true, service: "maritime-commerce-v2", rulesetId: RULESET_ID, strictAudit: true }); return; }
    if (path === "/intent" && req.method === "POST") {
      const user = await requireUser(req);
      await auditCheckpoint(user, req.body || {});
    }
    return legacy.maritimeCommerceApi(req, res);
  } catch (error) {
    console.error("maritimeCommerceV2", error);
    fail(res, error);
  }
});

module.exports._test = { canonicalHash, evidenceManifestHash, auditPreparationFile, RULESET_ID };

"use strict";

const { onRequest } = require("firebase-functions/v2/https");
const { getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const legacy = require("./maritime-backend-v2.js");
const { RULESET_ID, auditPreparationFile } = require("./maritime-compliance-audit-v1.js");

if (!getApps().length) initializeApp();
const db = getFirestore();

function safe(value) { return String(value || "").replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 140); }
function http(status, code, message, extra) {
  const e = new Error(message); e.http = status; e.code = code; Object.assign(e, extra || {}); return e;
}
function fail(res, error) {
  res.status(Number(error?.http) || 500).json({
    ok: false,
    code: error?.code || "MARITIME_STRICT_AUDIT",
    message: error?.message || "Denizcilik hazırlık kontrolü tamamlanamadı.",
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
  const snap = await homeRef(user.uid).get();
  if (!snap.exists) throw http(404, "WORKSPACE_NOT_FOUND", "Denizcilik çalışma alanı bulunamadı.");
  const home = snap.data() || {};
  const reqCtx = requested || {};
  const ctx = {
    companyId: safe(reqCtx.companyId || home.companyId),
    fleetId: safe(reqCtx.fleetId || home.fleetId),
    shipId: safe(reqCtx.shipId || home.shipId),
    year: Math.trunc(Number(reqCtx.year || home.year || 0)),
  };
  if (!ctx.companyId || !ctx.fleetId || !ctx.shipId || !ctx.year) throw http(400, "CONTEXT_REQUIRED", "Gemi ve raporlama yılı bağlamı gerekli.");
  if (ctx.companyId !== safe(home.companyId) || ctx.fleetId !== safe(home.fleetId) || ctx.shipId !== safe(home.shipId)) {
    throw http(403, "CONTEXT_DENIED", "Bu çalışma alanına erişim yetkiniz yok.");
  }
  return ctx;
}

function rows(snapshot) {
  return snapshot.docs
    .map(d => d.data())
    .sort((a, b) => Number(a.orderIndex || 0) - Number(b.orderIndex || 0))
    .map(x => x.payload || {});
}

async function loadCurrentSnapshot(ctx) {
  const yRef = yearRef(ctx);
  const yearSnap = await yRef.get();
  if (!yearSnap.exists) throw http(404, "FILE_NOT_FOUND", "Raporlama çalışma dosyası bulunamadı.");
  const year = yearSnap.data() || {};
  const syncId = String(year.activeSyncId || "");
  if (!syncId) throw http(409, "NO_DATA", "Kaydedilmiş çalışma verisi bulunamadı.");
  const [voyagesSnap, fuelsSnap, evidenceSnap] = await Promise.all([
    yRef.collection("voyages").where("syncId", "==", syncId).get(),
    yRef.collection("fuels").where("syncId", "==", syncId).get(),
    yRef.collection("evidenceDocuments").orderBy("finalizedAt", "asc").get(),
  ]);
  return {
    file: {
      reportingYear: Number(year.reportingYear || ctx.year),
      company: year.companySnapshot || {},
      verifier: year.verifierSnapshot || {},
      ship: year.shipSnapshot || {},
      monitoring: year.monitoring || {},
      voyages: rows(voyagesSnap),
      fuels: rows(fuelsSnap),
      ice: year.ice || {},
      flexibility: year.flexibility || {},
      evidence: {},
      evidenceReferences: {},
    },
    evidenceDocs: evidenceSnap.docs.map(d => d.data()),
  };
}

async function strictAudit(req) {
  const user = await requireUser(req);
  const ctx = await contextFor(user, req.body?.context || {
    companyId: req.query.companyId,
    fleetId: req.query.fleetId,
    shipId: req.query.shipId,
    year: req.query.year,
  });
  const snapshot = await loadCurrentSnapshot(ctx);
  return { ctx, audit: auditPreparationFile(snapshot.file, snapshot.evidenceDocs) };
}

exports.maritimeApi = onRequest({ region: "europe-west3", cors: true, memory: "512MiB", timeoutSeconds: 120, maxInstances: 20 }, async (req, res) => {
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  const path = String(req.path || "").replace(/^\/api\/maritime/, "").replace(/\/+$/, "") || "/";
  try {
    if (path === "/health" && req.method === "GET") {
      res.json({ ok: true, service: "maritime-enterprise-backend-v3", rulesetId: RULESET_ID, strictAudit: true });
      return;
    }
    if (path === "/strict-audit" && req.method === "GET") {
      const result = await strictAudit(req);
      res.json({ ok: true, context: result.ctx, audit: result.audit });
      return;
    }
    if ((path === "/checkpoint" || path === "/lock") && req.method === "POST") {
      const result = await strictAudit(req);
      if (!result.audit.ready) {
        throw http(422, "STRICT_READINESS_BLOCKED", "Ön doğrulama hazırlık dosyası 100/100 iç kontrol koşullarını tamamlamadı.", {
          missing: result.audit.missing,
          score: result.audit.score,
        });
      }
    }
    return legacy.maritimeApi(req, res);
  } catch (error) {
    console.error("maritimeApiV3", error);
    fail(res, error);
  }
});

module.exports._test = { auditPreparationFile, RULESET_ID };

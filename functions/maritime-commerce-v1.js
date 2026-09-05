"use strict";

/**
 * Maritime Commerce V1
 * Commercial unit: 1 ship + 1 reporting year + 1 immutable preparation snapshot.
 * Price authority: Paddle one-time price, USD 399.00, quantity exactly 1.
 * The browser may start checkout, but only a verified transaction.completed webhook grants entitlement.
 */
const crypto = require("node:crypto");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { verifyPaddleSignature } = require("./security-v2");

if (!getApps().length) initializeApp();
const db = getFirestore();

const paddleWebhookSecret = defineSecret("PADDLE_WEBHOOK_SECRET");

const SKU = "MARITIME_DOSSIER_1Y_399_USD";
const UNIT_AMOUNT_MINOR = 39900;
const CURRENCY = "USD";
const PADDLE_MARITIME_PRICE_ID = "pri_01m1rdd20amd3730r561vckwm3";
const INTENT_TTL_MS = 30 * 60 * 1000;
const RULESET_FALLBACK = "eu-maritime-2026-09-04";

function nowIso() { return new Date().toISOString(); }
function sha256(v) { return crypto.createHash("sha256").update(String(v)).digest("hex"); }
function randomId(prefix) { return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`; }
function safe(v) { return String(v || "").replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 140); }
function httpError(status, code, message, extra) { const e = new Error(message); e.http = status; e.code = code; Object.assign(e, extra || {}); return e; }
function fail(res, error) {
  res.status(Number(error?.http) || 500).json({
    ok: false,
    code: error?.code || "MARITIME_COMMERCE_INTERNAL",
    message: error?.message || "Ticari işlem tamamlanamadı.",
    ...(error?.missing ? { missing: error.missing } : {}),
  });
}

async function requireRegisteredUser(req) {
  const header = String(req.get("authorization") || "");
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) throw httpError(401, "AUTH_REQUIRED", "Kayıtlı kullanıcı hesabı gerekli.");
  try {
    const decoded = await getAuth().verifyIdToken(match[1].trim(), true);
    if (decoded.firebase?.sign_in_provider === "anonymous") throw httpError(401, "REGISTERED_USER_REQUIRED", "Kayıtlı kullanıcı hesabı gerekli.");
    return { uid: decoded.uid, email: decoded.email || null };
  } catch (error) {
    if (error?.http) throw error;
    throw httpError(401, "AUTH_INVALID", "Kullanıcı oturumu doğrulanamadı.");
  }
}

const homeRef = uid => db.collection("maritimeUserHomes").doc(uid);
const companyRef = id => db.collection("companies").doc(id);
const fleetRef = (cid, fid) => companyRef(cid).collection("maritimeFleets").doc(fid);
const shipRef = ctx => fleetRef(ctx.companyId, ctx.fleetId).collection("ships").doc(ctx.shipId);
const yearRef = ctx => shipRef(ctx).collection("reportingYears").doc(String(ctx.year));
const intentRef = id => db.collection("maritimePurchaseIntents").doc(id);
const orderRef = id => db.collection("maritimeOrders").doc(id);
const webhookRef = id => db.collection("maritimeWebhookEvents").doc(id);
const entitlementRef = (uid, snapshotHash) => db.collection("maritimeEntitlements").doc(sha256(`${uid}:${snapshotHash}`).slice(0, 56));

async function userContext(user, requested) {
  const homeSnap = await homeRef(user.uid).get();
  if (!homeSnap.exists) throw httpError(404, "WORKSPACE_NOT_FOUND", "Denizcilik çalışma alanı bulunamadı.");
  const home = homeSnap.data() || {};
  const ctx = {
    companyId: safe(requested?.companyId || home.companyId),
    fleetId: safe(requested?.fleetId || home.fleetId),
    shipId: safe(requested?.shipId || home.shipId),
    year: Math.trunc(Number(requested?.year || home.year || 0)),
  };
  if (!ctx.companyId || !ctx.fleetId || !ctx.shipId || !ctx.year) throw httpError(400, "CONTEXT_REQUIRED", "Gemi ve raporlama yılı bağlamı gerekli.");
  if (ctx.companyId !== safe(home.companyId) || ctx.fleetId !== safe(home.fleetId) || ctx.shipId !== safe(home.shipId)) {
    throw httpError(403, "CONTEXT_DENIED", "Bu çalışma alanına erişim yetkiniz yok.");
  }
  return ctx;
}

function parseCheckoutItem(data) {
  const items = Array.isArray(data?.items) ? data.items : [];
  if (items.length !== 1) throw httpError(422, "CATALOG_MISMATCH", "Ödeme tek denizcilik dosyası içermelidir.");
  const item = items[0] || {};
  if (Number(item.quantity) !== 1) throw httpError(422, "QUANTITY_MISMATCH", "Dosya adedi 1 olmalıdır.");
  const price = item.price || {};
  const priceId = String(price.id || item.price_id || "").trim();
  if (priceId !== PADDLE_MARITIME_PRICE_ID) throw httpError(422, "PRICE_MISMATCH", "Ödeme fiyat kataloğuyla eşleşmiyor.");
  const unitPrice = price.unit_price || {};
  const amount = Number(unitPrice.amount || 0);
  const currency = String(unitPrice.currency_code || data.currency_code || "").trim().toUpperCase();
  if (amount !== UNIT_AMOUNT_MINOR || currency !== CURRENCY) {
    throw httpError(422, "AMOUNT_MISMATCH", "Ödeme 399 USD tek seferlik fiyatla eşleşmiyor.");
  }
  return { priceId, amount, currency };
}

async function createIntent(user, body) {
  const ctx = await userContext(user, body?.context || {});
  const checkpointVersionId = safe(body?.checkpointVersionId);
  const snapshotHash = String(body?.snapshotHash || "").trim();
  if (!checkpointVersionId || !/^[a-f0-9]{64}$/i.test(snapshotHash)) throw httpError(400, "CHECKPOINT_REQUIRED", "Ödeme öncesi hazır çalışma kontrol noktası gerekli.");

  const yRef = yearRef(ctx);
  const [yearSnap, versionSnap] = await Promise.all([
    yRef.get(),
    yRef.collection("versions").doc(checkpointVersionId).get(),
  ]);
  if (!yearSnap.exists || !versionSnap.exists) throw httpError(404, "CHECKPOINT_NOT_FOUND", "Kontrol noktası bulunamadı.");
  const year = yearSnap.data() || {};
  const version = versionSnap.data() || {};
  if (String(version.snapshotHash || "") !== snapshotHash) throw httpError(409, "SNAPSHOT_MISMATCH", "Kontrol noktası bütünlük kaydı eşleşmiyor.");
  if (version.type !== "checkpoint") throw httpError(409, "CHECKPOINT_TYPE", "Ödeme yalnız değişmez hazırlık kontrol noktası için açılabilir.");
  if (version.readiness?.ready !== true) throw httpError(422, "READINESS_BLOCKED", "Kritik hazırlık alanları tamamlanmadan ödeme açılamaz.", { missing: version.readiness?.missing || [] });
  if (String(version.sourceHash || "") !== String(year.dataHash || "") || Number(version.sourceRevision) !== Number(year.revision || 0)) {
    throw httpError(409, "CHECKPOINT_STALE", "Çalışma kontrol noktasından sonra değişti. Yeni kontrol noktası oluşturun.");
  }

  const existingEnt = await entitlementRef(user.uid, snapshotHash).get();
  if (existingEnt.exists && existingEnt.data()?.status === "active") {
    return { alreadyPaid: true, entitlementId: existingEnt.id, snapshotHash };
  }

  const intentId = randomId("mpi");
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + INTENT_TTL_MS).toISOString();
  await intentRef(intentId).create({
    schemaVersion: "maritime-commerce-v1",
    intentId,
    ownerUid: user.uid,
    ownerEmail: user.email,
    context: ctx,
    checkpointVersionId,
    snapshotHash,
    sourceHash: String(version.sourceHash || ""),
    sourceRevision: Number(version.sourceRevision || 0),
    activeSyncId: String(version.activeSyncId || ""),
    evidenceManifestHash: String(version.evidenceManifestHash || ""),
    evidenceChainHead: String(version.evidenceChainHead || ""),
    evidenceDocumentCount: Number(version.evidenceDocumentCount || 0),
    rulesetId: String(version.rulesetId || year.rulesetId || RULESET_FALLBACK),
    sku: SKU,
    price: { amountMinor: UNIT_AMOUNT_MINOR, currency: CURRENCY, quantity: 1, priceId: PADDLE_MARITIME_PRICE_ID },
    status: "pending",
    createdAt,
    expiresAt,
  });
  return { alreadyPaid: false, intentId, snapshotHash, expiresAt, sku: SKU };
}

async function recordCompletedTransaction(payload) {
  const data = payload?.data || {};
  if (String(payload?.event_type || "") !== "transaction.completed" || String(data.status || "") !== "completed") return { ignored: true };
  const transactionId = String(data.id || "").trim();
  const eventId = String(payload.event_id || "").trim();
  if (!transactionId || !eventId) throw httpError(422, "PADDLE_ID_REQUIRED", "Paddle işlem kimliği eksik.");
  const catalog = parseCheckoutItem(data);
  const custom = data.custom_data || {};
  const intentId = safe(custom.maritimePurchaseIntentId);
  const sku = String(custom.sku || "").trim();
  if (!intentId || sku !== SKU) throw httpError(422, "CUSTOM_DATA_MISMATCH", "Denizcilik ödeme bağlamı eşleşmiyor.");

  const iRef = intentRef(intentId);
  const iSnap = await iRef.get();
  if (!iSnap.exists) throw httpError(404, "INTENT_NOT_FOUND", "Satın alma niyeti bulunamadı.");
  const intent = iSnap.data() || {};
  if (intent.sku !== SKU || Number(intent.price?.amountMinor) !== UNIT_AMOUNT_MINOR || intent.price?.currency !== CURRENCY || intent.price?.priceId !== PADDLE_MARITIME_PRICE_ID) {
    throw httpError(422, "INTENT_CATALOG_MISMATCH", "Satın alma niyeti katalogla eşleşmiyor.");
  }
  const entId = entitlementRef(intent.ownerUid, intent.snapshotHash).id;
  const completedAt = nowIso();

  await db.runTransaction(async tx => {
    const seen = await tx.get(webhookRef(eventId));
    if (seen.exists) return;
    const existingOrder = await tx.get(orderRef(transactionId));
    if (existingOrder.exists && existingOrder.data()?.intentId !== intentId) throw httpError(409, "TRANSACTION_REUSED", "Paddle işlemi başka bir dosyayla eşleşmiş.");
    tx.create(webhookRef(eventId), { eventId, eventType: payload.event_type, transactionId, receivedAt: completedAt, immutable: true });
    if (!existingOrder.exists) tx.create(orderRef(transactionId), {
      schemaVersion: "maritime-commerce-v1",
      transactionId,
      intentId,
      ownerUid: intent.ownerUid,
      context: intent.context,
      checkpointVersionId: intent.checkpointVersionId,
      snapshotHash: intent.snapshotHash,
      sourceHash: intent.sourceHash,
      sourceRevision: intent.sourceRevision,
      sku: SKU,
      priceId: catalog.priceId,
      currency: catalog.currency,
      amountMinor: catalog.amount,
      status: "completed",
      completedAt,
      immutable: true,
    });
    tx.set(db.collection("maritimeEntitlements").doc(entId), {
      schemaVersion: "maritime-commerce-v1",
      entitlementId: entId,
      ownerUid: intent.ownerUid,
      context: intent.context,
      checkpointVersionId: intent.checkpointVersionId,
      snapshotHash: intent.snapshotHash,
      sourceHash: intent.sourceHash,
      sourceRevision: intent.sourceRevision,
      activeSyncId: intent.activeSyncId,
      evidenceManifestHash: intent.evidenceManifestHash,
      evidenceChainHead: intent.evidenceChainHead,
      evidenceDocumentCount: intent.evidenceDocumentCount,
      rulesetId: intent.rulesetId,
      sku: SKU,
      transactionId,
      status: "active",
      activatedAt: completedAt,
      redownloadPolicy: "same-snapshot-unlimited",
    }, { merge: false });
    tx.set(iRef, { status: "completed", transactionId, completedAt, entitlementId: entId }, { merge: true });
  });
  return { ignored: false, transactionId, entitlementId: entId };
}

async function getEntitlementForContext(user, ctx) {
  const paid = await yearRef(ctx).collection("paidDossiers").where("ownerUid", "==", user.uid).orderBy("createdAt", "desc").limit(1).get();
  if (paid.empty) return null;
  const dossier = paid.docs[0].data();
  const ent = await entitlementRef(user.uid, dossier.snapshotHash).get();
  if (!ent.exists || ent.data()?.status !== "active") return null;
  return { dossierId: paid.docs[0].id, dossier, entitlement: ent.data() };
}

async function finalize(user, body) {
  const intentId = safe(body?.intentId);
  if (!intentId) throw httpError(400, "INTENT_REQUIRED", "Satın alma niyeti gerekli.");
  const iSnap = await intentRef(intentId).get();
  if (!iSnap.exists) throw httpError(404, "INTENT_NOT_FOUND", "Satın alma niyeti bulunamadı.");
  const intent = iSnap.data() || {};
  if (intent.ownerUid !== user.uid) throw httpError(403, "INTENT_DENIED", "Bu satın alma kaydına erişim yetkiniz yok.");
  if (intent.status !== "completed" || !intent.transactionId) throw httpError(409, "PAYMENT_PENDING", "Paddle ödeme kaydı henüz tamamlanmadı.");
  const ent = await entitlementRef(user.uid, intent.snapshotHash).get();
  if (!ent.exists || ent.data()?.status !== "active") throw httpError(409, "ENTITLEMENT_PENDING", "Ödeme yetkisi henüz oluşmadı.");

  const ctx = intent.context;
  const yRef = yearRef(ctx);
  const versionSnap = await yRef.collection("versions").doc(intent.checkpointVersionId).get();
  if (!versionSnap.exists) throw httpError(404, "CHECKPOINT_NOT_FOUND", "Satın alınan kontrol noktası bulunamadı.");
  const version = versionSnap.data() || {};
  if (version.readiness?.ready !== true || String(version.snapshotHash || "") !== intent.snapshotHash) throw httpError(409, "CHECKPOINT_INVALID", "Satın alınan hazırlık kontrol noktası geçerli değil.");
  const dossierRef = yRef.collection("paidDossiers").doc(intent.snapshotHash);
  const createdAt = nowIso();
  await db.runTransaction(async tx => {
    const existing = await tx.get(dossierRef);
    if (!existing.exists) {
      tx.create(dossierRef, {
        schemaVersion: "maritime-paid-dossier-v1",
        dossierId: intent.snapshotHash,
        ownerUid: user.uid,
        sku: SKU,
        transactionId: intent.transactionId,
        snapshotHash: intent.snapshotHash,
        checkpointVersionId: intent.checkpointVersionId,
        rulesetId: version.rulesetId || intent.rulesetId,
        sourceHash: version.sourceHash || intent.sourceHash,
        sourceRevision: Number(version.sourceRevision || intent.sourceRevision || 0),
        activeSyncId: version.activeSyncId || intent.activeSyncId,
        companySnapshot: version.companySnapshot || {},
        verifierSnapshot: version.verifierSnapshot || {},
        shipSnapshot: version.shipSnapshot || {},
        monitoring: version.monitoring || {},
        ice: version.ice || {},
        flexibility: version.flexibility || {},
        rowCounts: version.rowCounts || {},
        readiness: version.readiness || {},
        evidenceManifestHash: version.evidenceManifestHash || intent.evidenceManifestHash || null,
        evidenceChainHead: version.evidenceChainHead || intent.evidenceChainHead || null,
        evidenceDocumentCount: Number(version.evidenceDocumentCount || intent.evidenceDocumentCount || 0),
        commercialLock: true,
        immutable: true,
        createdAt,
      });
      tx.create(yRef.collection("auditEvents").doc(randomId("audit")), {
        action: "PAID_DOSSIER_LOCKED",
        actorUid: user.uid,
        actorRole: "commercial-owner",
        at: createdAt,
        snapshotHash: intent.snapshotHash,
        transactionId: intent.transactionId,
        sku: SKU,
        immutable: true,
      });
    }
  });
  return { dossierId: intent.snapshotHash, snapshotHash: intent.snapshotHash, transactionId: intent.transactionId };
}

async function hydratePaidDossier(user, ctx, snapshotHash) {
  const dossierSnap = await yearRef(ctx).collection("paidDossiers").doc(snapshotHash).get();
  if (!dossierSnap.exists) throw httpError(404, "DOSSIER_NOT_FOUND", "Satın alınan dosya bulunamadı.");
  const dossier = dossierSnap.data() || {};
  if (dossier.ownerUid !== user.uid) throw httpError(403, "DOSSIER_DENIED", "Bu dosyaya erişim yetkiniz yok.");
  const ent = await entitlementRef(user.uid, snapshotHash).get();
  if (!ent.exists || ent.data()?.status !== "active") throw httpError(402, "ENTITLEMENT_REQUIRED", "Bu çıktı için tamamlanmış ödeme gerekli.");
  const syncId = String(dossier.activeSyncId || "");
  if (!syncId) throw httpError(409, "SNAPSHOT_ROWS_MISSING", "Satın alınan dosyanın veri sürümü bulunamadı.");
  const yRef = yearRef(ctx);
  const [voyagesSnap, fuelsSnap] = await Promise.all([
    yRef.collection("voyages").where("syncId", "==", syncId).get(),
    yRef.collection("fuels").where("syncId", "==", syncId).get(),
  ]);
  const rows = snap => snap.docs.map(d => d.data()).sort((a,b) => Number(a.orderIndex || 0) - Number(b.orderIndex || 0)).map(x => x.payload || {});
  return {
    product: "SKDMhesapla Maritime Carbon Compliance Preparation File",
    commercialUnit: "1 ship + 1 reporting year + 1 immutable preparation snapshot",
    sku: SKU,
    price: { amount: 399, currency: CURRENCY, billing: "one-time", priceId: PADDLE_MARITIME_PRICE_ID },
    generatedAt: dossier.createdAt,
    snapshotHash,
    transactionId: dossier.transactionId,
    rulesetId: dossier.rulesetId,
    readiness: dossier.readiness,
    evidence: {
      manifestHash: dossier.evidenceManifestHash,
      chainHead: dossier.evidenceChainHead,
      documentCount: dossier.evidenceDocumentCount,
    },
    file: {
      reportingYear: ctx.year,
      company: dossier.companySnapshot || {},
      verifier: dossier.verifierSnapshot || {},
      ship: dossier.shipSnapshot || {},
      monitoring: dossier.monitoring || {},
      voyages: rows(voyagesSnap),
      fuels: rows(fuelsSnap),
      ice: dossier.ice || {},
      flexibility: dossier.flexibility || {},
    },
    legalBoundary: "Preparation output only; accredited verification, official MRV/FuelEU Document of Compliance, administering-authority decision and EUA surrender remain external regulated processes.",
  };
}

exports.maritimeCommerceApi = onRequest(
  { region: "europe-west3", cors: true, secrets: [paddleWebhookSecret] },
  async (req, res) => {
    const path = (req.path || "").replace(/^\/api\/maritime-commerce/, "") || "/";
    if (req.method === "OPTIONS") { res.status(204).send(""); return; }
    try {
      if (path === "/webhook" && req.method === "POST") {
        const rawBuf = req.rawBody;
        const raw = Buffer.isBuffer(rawBuf) ? rawBuf.toString("utf8") : String(rawBuf || "");
        const signature = String(req.get("paddle-signature") || "");
        if (!verifyPaddleSignature(raw, signature, paddleWebhookSecret.value())) throw httpError(401, "PADDLE_SIGNATURE", "Paddle imzası doğrulanamadı.");
        const payload = JSON.parse(raw);
        const result = await recordCompletedTransaction(payload);
        res.status(200).json({ ok: true, ...result });
        return;
      }

      const user = await requireRegisteredUser(req);
      if (path === "/intent" && req.method === "POST") {
        res.status(201).json({ ok: true, ...(await createIntent(user, req.body || {})) });
        return;
      }
      if (path === "/intent-status" && req.method === "GET") {
        const id = safe(req.query.intentId);
        const snap = await intentRef(id).get();
        if (!snap.exists || snap.data()?.ownerUid !== user.uid) throw httpError(404, "INTENT_NOT_FOUND", "Satın alma kaydı bulunamadı.");
        const x = snap.data() || {};
        res.json({ ok: true, intentId: id, status: x.status, transactionId: x.transactionId || null, snapshotHash: x.snapshotHash });
        return;
      }
      if (path === "/finalize" && req.method === "POST") {
        res.json({ ok: true, ...(await finalize(user, req.body || {})) });
        return;
      }
      if (path === "/status" && req.method === "GET") {
        const ctx = await userContext(user, { year: Number(req.query.year) || undefined });
        const found = await getEntitlementForContext(user, ctx);
        res.json({ ok: true, paid: Boolean(found), ...(found ? { snapshotHash: found.dossier.snapshotHash, dossierId: found.dossierId, transactionId: found.dossier.transactionId } : {}) });
        return;
      }
      if ((path === "/snapshot" || path === "/download") && req.method === "GET") {
        const ctx = await userContext(user, { year: Number(req.query.year) || undefined });
        const requestedHash = String(req.query.snapshotHash || "").trim();
        let snapshotHash = requestedHash;
        if (!snapshotHash) {
          const found = await getEntitlementForContext(user, ctx);
          snapshotHash = String(found?.dossier?.snapshotHash || "");
        }
        if (!/^[a-f0-9]{64}$/i.test(snapshotHash)) throw httpError(404, "DOSSIER_NOT_FOUND", "Satın alınan dosya bulunamadı.");
        const payload = await hydratePaidDossier(user, ctx, snapshotHash);
        if (path === "/download") {
          const imo = safe(payload.file?.ship?.imoNumber || "ship");
          res.set("Content-Type", "application/json; charset=utf-8");
          res.set("Content-Disposition", `attachment; filename=\"${imo}-${ctx.year}-maritime-preparation-${snapshotHash.slice(0,12)}.json\"`);
          res.status(200).send(JSON.stringify(payload, null, 2));
        } else {
          res.json({ ok: true, dossier: payload });
        }
        return;
      }
      throw httpError(404, "NOT_FOUND", "Maritime commerce endpoint bulunamadı.");
    } catch (error) {
      fail(res, error);
    }
  }
);

module.exports.SKU = SKU;
module.exports.PADDLE_MARITIME_PRICE_ID = PADDLE_MARITIME_PRICE_ID;

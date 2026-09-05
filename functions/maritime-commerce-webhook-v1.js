"use strict";

const crypto = require("node:crypto");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { verifyPaddleSignature } = require("./security-v2");

if (!getApps().length) initializeApp();
const db = getFirestore();

const paddleWebhookSecret = defineSecret("PADDLE_MARITIME_WEBHOOK_SECRET");
const paddleMaritimePriceId = defineSecret("PADDLE_MARITIME_PRICE_ID_349");
const SKU = "MARITIME_DOSSIER_1Y_349_USD";
const UNIT_AMOUNT_MINOR = 34900;
const CURRENCY = "USD";

function sha256(v) { return crypto.createHash("sha256").update(String(v)).digest("hex"); }
function nowIso() { return new Date().toISOString(); }
function safe(v) { return String(v || "").replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 140); }
function entitlementId(uid, snapshotHash) { return sha256(`${uid}:${snapshotHash}`).slice(0, 56); }

function validateTransaction(data) {
  if (!data || String(data.status || "") !== "completed") throw new Error("transaction not completed");
  const items = Array.isArray(data.items) ? data.items : [];
  if (items.length !== 1 || Number(items[0]?.quantity) !== 1) throw new Error("catalog quantity mismatch");
  const price = items[0]?.price || {};
  const configured = String(paddleMaritimePriceId.value() || "").trim();
  const priceId = String(price.id || items[0]?.price_id || "").trim();
  const amount = Number(price.unit_price?.amount || 0);
  const currency = String(price.unit_price?.currency_code || data.currency_code || "").toUpperCase();
  if (!configured.startsWith("pri_") || priceId !== configured) throw new Error("price id mismatch");
  if (amount !== UNIT_AMOUNT_MINOR || currency !== CURRENCY) throw new Error("349 USD price mismatch");
  const custom = data.custom_data || {};
  const intentId = safe(custom.maritimePurchaseIntentId);
  if (!intentId || String(custom.sku || "") !== SKU) throw new Error("custom data mismatch");
  return { intentId, priceId, amount, currency };
}

exports.maritimeCommerceWebhookApi = onRequest(
  { region: "europe-west3", cors: false, secrets: [paddleWebhookSecret, paddleMaritimePriceId] },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
    try {
      const rawBuf = req.rawBody;
      const raw = Buffer.isBuffer(rawBuf) ? rawBuf.toString("utf8") : String(rawBuf || "");
      const signature = String(req.get("paddle-signature") || "");
      if (!verifyPaddleSignature(raw, signature, paddleWebhookSecret.value())) {
        res.status(401).json({ ok: false, code: "PADDLE_SIGNATURE" });
        return;
      }
      const payload = JSON.parse(raw);
      if (String(payload.event_type || "") !== "transaction.completed") {
        res.status(200).json({ ok: true, ignored: true });
        return;
      }
      const data = payload.data || {};
      const transactionId = String(data.id || "").trim();
      const eventId = String(payload.event_id || "").trim();
      if (!transactionId || !eventId) throw new Error("missing paddle ids");
      const catalog = validateTransaction(data);
      const intentRef = db.collection("maritimePurchaseIntents").doc(catalog.intentId);
      const intentSnap = await intentRef.get();
      if (!intentSnap.exists) throw new Error("purchase intent not found");
      const intent = intentSnap.data() || {};
      if (intent.sku !== SKU || Number(intent.price?.amountMinor) !== UNIT_AMOUNT_MINOR || intent.price?.currency !== CURRENCY) throw new Error("intent catalog mismatch");
      const entId = entitlementId(intent.ownerUid, intent.snapshotHash);
      const ts = nowIso();
      const ctx = intent.context || {};
      const yearRef = db.collection("companies").doc(safe(ctx.companyId))
        .collection("maritimeFleets").doc(safe(ctx.fleetId))
        .collection("ships").doc(safe(ctx.shipId))
        .collection("reportingYears").doc(String(Number(ctx.year)));
      const versionRef = yearRef.collection("versions").doc(safe(intent.checkpointVersionId));
      const versionSnap = await versionRef.get();
      if (!versionSnap.exists) throw new Error("checkpoint not found");
      const version = versionSnap.data() || {};
      if (version.readiness?.ready !== true || String(version.snapshotHash || "") !== String(intent.snapshotHash || "")) throw new Error("checkpoint readiness mismatch");
      const dossierRef = yearRef.collection("paidDossiers").doc(String(intent.snapshotHash));
      const eventRef = db.collection("maritimeWebhookEvents").doc(eventId);
      const orderRef = db.collection("maritimeOrders").doc(transactionId);
      const entRef = db.collection("maritimeEntitlements").doc(entId);

      await db.runTransaction(async tx => {
        const [seen, order, dossier] = await Promise.all([tx.get(eventRef), tx.get(orderRef), tx.get(dossierRef)]);
        if (seen.exists) return;
        if (order.exists && order.data()?.intentId !== catalog.intentId) throw new Error("transaction reused");
        tx.create(eventRef, { eventId, eventType: payload.event_type, transactionId, receivedAt: ts, immutable: true });
        if (!order.exists) tx.create(orderRef, {
          schemaVersion: "maritime-commerce-v1", transactionId, intentId: catalog.intentId,
          ownerUid: intent.ownerUid, context: intent.context, checkpointVersionId: intent.checkpointVersionId,
          snapshotHash: intent.snapshotHash, sourceHash: intent.sourceHash, sourceRevision: intent.sourceRevision,
          sku: SKU, priceId: catalog.priceId, currency: catalog.currency, amountMinor: catalog.amount,
          status: "completed", completedAt: ts, immutable: true,
        });
        tx.set(entRef, {
          schemaVersion: "maritime-commerce-v1", entitlementId: entId, ownerUid: intent.ownerUid,
          context: intent.context, checkpointVersionId: intent.checkpointVersionId, snapshotHash: intent.snapshotHash,
          sourceHash: intent.sourceHash, sourceRevision: intent.sourceRevision, activeSyncId: version.activeSyncId || intent.activeSyncId,
          evidenceManifestHash: version.evidenceManifestHash || intent.evidenceManifestHash || null,
          evidenceChainHead: version.evidenceChainHead || intent.evidenceChainHead || null,
          evidenceDocumentCount: Number(version.evidenceDocumentCount || intent.evidenceDocumentCount || 0),
          rulesetId: version.rulesetId || intent.rulesetId, sku: SKU, transactionId, status: "active",
          activatedAt: ts, redownloadPolicy: "same-snapshot-unlimited",
        }, { merge: false });
        if (!dossier.exists) tx.create(dossierRef, {
          schemaVersion: "maritime-paid-dossier-v1", dossierId: intent.snapshotHash, ownerUid: intent.ownerUid,
          sku: SKU, transactionId, snapshotHash: intent.snapshotHash, checkpointVersionId: intent.checkpointVersionId,
          rulesetId: version.rulesetId || intent.rulesetId, sourceHash: version.sourceHash || intent.sourceHash,
          sourceRevision: Number(version.sourceRevision || intent.sourceRevision || 0), activeSyncId: version.activeSyncId || intent.activeSyncId,
          companySnapshot: version.companySnapshot || {}, verifierSnapshot: version.verifierSnapshot || {}, shipSnapshot: version.shipSnapshot || {},
          monitoring: version.monitoring || {}, ice: version.ice || {}, flexibility: version.flexibility || {}, rowCounts: version.rowCounts || {},
          readiness: version.readiness || {}, evidenceManifestHash: version.evidenceManifestHash || null,
          evidenceChainHead: version.evidenceChainHead || null, evidenceDocumentCount: Number(version.evidenceDocumentCount || 0),
          commercialLock: true, immutable: true, createdAt: ts,
        });
        tx.set(intentRef, { status: "completed", transactionId, completedAt: ts, entitlementId: entId }, { merge: true });
        tx.create(yearRef.collection("auditEvents").doc(`audit_${crypto.randomUUID().replace(/-/g, "")}`), {
          action: "PAID_DOSSIER_LOCKED", actorUid: intent.ownerUid, actorRole: "commercial-owner", at: ts,
          snapshotHash: intent.snapshotHash, transactionId, sku: SKU, immutable: true,
        });
      });
      res.status(200).json({ ok: true, transactionId, entitlementId: entId, snapshotHash: intent.snapshotHash });
    } catch (error) {
      console.error("[maritime-commerce-webhook]", error);
      res.status(422).json({ ok: false, code: "MARITIME_WEBHOOK_REJECTED" });
    }
  }
);

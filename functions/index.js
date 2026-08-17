const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const crypto = require("node:crypto");
const { evaluatePaymentStatus, evaluateSealEntitlement } = require("./seal-entitlement");

if (!getApps().length) initializeApp();
const db = getFirestore();
const paddleWebhookSecret = defineSecret("PADDLE_WEBHOOK_SECRET");

function verifyPaddleSignature(rawBody, signatureHeader, secret) {
  if (!rawBody || !signatureHeader || !secret) return false;
  const parts = {};
  for (const piece of String(signatureHeader).split(";")) {
    const idx = piece.indexOf("=");
    if (idx < 1) continue;
    const key = piece.slice(0, idx).trim();
    const value = piece.slice(idx + 1).trim();
    if (key && value) parts[key] = value;
  }
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;
  const computed = crypto.createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex");
  const a = Buffer.from(h1, "hex");
  const b = Buffer.from(computed, "hex");
  if (a.length === 0 || a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * /api/** → api
 * POST /api/skdm-sessions  — G-22 taslak upsert (skdm_sessions)
 * GET  /api/skdm-sessions?sessionId=&sectorSlug= — taslak oku
 * POST /api/webhooks/paddle — Paddle Billing imza doğrulamalı sipariş
 */
exports.api = onRequest(
  { region: "europe-west3", cors: true, secrets: [paddleWebhookSecret] },
  async (req, res) => {
  const path = (req.path || "").replace(/^\/api/, "") || "/";

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    if (path === "/skdm-sessions" || path === "/skdm-sessions/") {
      if (req.method === "POST") {
        const body = req.body || {};
        const sessionId = String(body.sessionId || "").trim();
        const sectorSlug = String(body.sectorSlug || "").trim();
        if (!sessionId || !sectorSlug) {
          res.status(400).json({ ok: false, message: "sessionId ve sectorSlug zorunlu" });
          return;
        }
        const doc = {
          sessionId,
          sectorSlug,
          updatedAt: new Date().toISOString(),
          createdAt: body.createdAt || new Date().toISOString(),
          step: Number(body.step) || 0,
          triage: body.triage || null,
          fieldValues: body.fieldValues || {},
          skippedFields: body.skippedFields || [],
          goods: body.goods || [],
          processes: body.processes || [],
          streams: body.streams || [],
          precs: body.precs || [],
          dProcesses: body.dProcesses || null,
          ePurchPrec: body.ePurchPrec || [],
          ownerUid: body.ownerUid || null,
          status: "draft",
          engineHint: "skdm-calc-v2026.1",
        };
        await db.collection("skdm_sessions").doc(sessionId).set(doc, { merge: true });
        res.status(200).json({ ok: true, sessionId, updatedAt: doc.updatedAt });
        return;
      }

      if (req.method === "GET") {
        const sessionId = String(req.query.sessionId || "").trim();
        if (!sessionId) {
          res.status(400).json({ ok: false, message: "sessionId zorunlu" });
          return;
        }
        const snap = await db.collection("skdm_sessions").doc(sessionId).get();
        if (!snap.exists) {
          res.status(404).json({ ok: false, message: "taslak bulunamadı" });
          return;
        }
        res.status(200).json({ ok: true, draft: snap.data() });
        return;
      }
    }

    if (path === "/orders/status" || path === "/orders/status/") {
      if (req.method !== "GET") {
        res.status(405).json({ ok: false, message: "GET gerekli" });
        return;
      }
      const transactionId = String(req.query.transactionId || "").trim();
      const sessionIdQ = String(req.query.sessionId || "").trim();
      if (!transactionId || !sessionIdQ) {
        res.status(400).json({ ok: false, message: "transactionId ve sessionId zorunlu" });
        return;
      }
      const snap = await db.collection("skdm_orders").doc(transactionId).get();
      const order = snap.exists ? snap.data() : null;
      res.status(200).json(evaluatePaymentStatus(order, sessionIdQ));
      return;
    }

    if (path === "/packages" || path === "/packages/") {
      if (req.method !== "GET") {
        res.status(405).json({ ok: false, message: "GET gerekli" });
        return;
      }
      const packageIdQ = String(req.query.packageId || "").trim();
      const hashQ = String(req.query.hash || "").trim();
      if (!packageIdQ && !hashQ) {
        res.status(400).json({ ok: false, message: "packageId veya hash zorunlu" });
        return;
      }
      let found = null;
      let kind = "cbam";
      if (packageIdQ) {
        const pcfSnap = await db.collection("pcf_sealed_packages").doc(packageIdQ).get();
        if (pcfSnap.exists) {
          found = pcfSnap.data();
          kind = "pcf";
        } else {
          const cbamSnap = await db.collection("skdm_sealed_packages").doc(packageIdQ).get();
          if (cbamSnap.exists) {
            found = cbamSnap.data();
            kind = "cbam";
          }
        }
      }
      if (!found && hashQ) {
        const h = hashQ.startsWith("sha256:") ? hashQ : `sha256:${hashQ}`;
        const pcfQ = await db.collection("pcf_sealed_packages").where("masterHash", "==", h).limit(1).get();
        if (!pcfQ.empty) {
          found = pcfQ.docs[0].data();
          kind = "pcf";
        } else {
          const cbamQ = await db.collection("skdm_sealed_packages").where("masterHash", "==", h).limit(1).get();
          if (!cbamQ.empty) {
            found = cbamQ.docs[0].data();
            kind = "cbam";
          }
        }
      }
      if (!found) {
        res.status(404).json({ ok: false, message: "paket kaydı bulunamadı" });
        return;
      }
      res.status(200).json({
        ok: true,
        packageKind: kind,
        packageId: found.packageId,
        sessionId: found.sessionId,
        createdAt: found.createdAt,
        masterHash: found.masterHash,
        engineVersion: found.engineVersion || (found.manifesto && found.manifesto.engineVersion) || null,
        methodologyVersion: found.methodologyVersion || (found.manifesto && found.manifesto.methodologyVersion) || null,
        factorRegistryVersion: found.factorRegistryVersion || (found.manifesto && found.manifesto.factorRegistryVersion) || null,
        reportStatus: found.reportStatus || (found.manifesto && found.manifesto.reportStatus) || null,
        files: Array.isArray(found.files) ? found.files.map((f) => f.filename) : [],
      });
      return;
    }

    if (path === "/seal" || path === "/seal/") {
      if (req.method !== "POST") {
        res.status(405).json({ ok: false, message: "POST gerekli" });
        return;
      }
      const body = req.body || {};
      const packageId = String(body.packageId || "").trim();
      const sessionId = String(body.sessionId || "").trim();
      const paddleTransactionId = String(body.paddleTransactionId || body.orderId || "").trim();
      const masterHash = String(body.masterHash || "").trim();
      const manifesto = body.manifesto || null;
      const workflowType = String(body.workflowType || "cbam").trim();
      const packageType = String(body.packageType || "CBAM_SEAL_PACKAGE_9900").trim();

      if (!packageId || !sessionId || !masterHash || !manifesto || !paddleTransactionId) {
        res.status(400).json({
          ok: false,
          message: "packageId, sessionId, paddleTransactionId, masterHash, manifesto zorunlu",
        });
        return;
      }

      const orderSnap = await db.collection("skdm_orders").doc(paddleTransactionId).get();
      const order = orderSnap.exists ? orderSnap.data() : null;
      const gate = evaluateSealEntitlement(order, {
        sessionId,
        paddleTransactionId,
        packageType,
        workflowType,
        packageId,
        resultStatus: body.resultStatus,
        readinessScore: body.readinessScore,
      });
      if (!gate.ok) {
        res.status(gate.http).json({ ok: false, message: gate.reason });
        return;
      }

      const createdAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
      const files = Array.isArray(body.files) ? body.files : [];
      const isPcf = gate.entitlement === "pcf_seal";
      const col = isPcf ? "pcf_sealed_packages" : "skdm_sealed_packages";

      const doc = {
        packageId,
        sessionId,
        createdAt,
        expiresAt,
        orderId: paddleTransactionId,
        paddleTransactionId,
        packageType: gate.normalizedPackageType,
        workflowType: isPcf ? "pcf" : "cbam",
        ownerUid: body.ownerUid || null,
        rulesetVersion: manifesto.rulesetVersion || null,
        engineVersion: manifesto.engineVersion || null,
        methodologyVersion: manifesto.methodologyVersion || null,
        factorRegistryVersion: manifesto.factorRegistryVersion || null,
        reportStatus: manifesto.reportStatus || body.resultStatus || null,
        masterHash,
        readinessScore: isPcf ? null : 100,
        files: files.map((f) => ({
          filename: f.filename,
          mimeType: f.mimeType,
          sizeBytes: f.sizeBytes,
          sha256: f.sha256,
          storagePath: null,
        })),
        manifesto,
        delivery: "client-zip",
        zipFilename: body.zipFilename || null,
      };

      await db.collection(col).doc(packageId).set(doc);
      await db.collection("skdm_orders").doc(paddleTransactionId).set(
        {
          consumedByPackageId: packageId,
          consumedPackageType: gate.normalizedPackageType,
          consumedAt: createdAt,
          updatedAt: createdAt,
        },
        { merge: true }
      );
      if (sessionId) {
        const sessionCol = isPcf ? "pcf_sessions" : "skdm_sessions";
        await db.collection(sessionCol).doc(sessionId).set(
          {
            sessionId,
            status: "sealed",
            sealedPackageId: packageId,
            updatedAt: createdAt,
            workflowType: isPcf ? "pcf" : "cbam",
          },
          { merge: true }
        );
      }

      res.status(200).json({ ok: true, packageId, createdAt, expiresAt, masterHash });
      return;
    }

    if (path === "/webhooks/paddle" || path === "/webhooks/paddle/") {
      if (req.method !== "POST") {
        res.status(405).json({ ok: false, message: "POST gerekli" });
        return;
      }
      const rawBuf = req.rawBody;
      const raw = Buffer.isBuffer(rawBuf)
        ? rawBuf.toString("utf8")
        : typeof rawBuf === "string"
          ? rawBuf
          : "";
      const signature = String(req.get("paddle-signature") || "");
      const secret = paddleWebhookSecret.value();
      if (!verifyPaddleSignature(raw, signature, secret)) {
        res.status(401).json({ ok: false, message: "imza dogrulanamadi" });
        return;
      }
      let payload = {};
      try {
        payload = JSON.parse(raw);
      } catch {
        res.status(400).json({ ok: false, message: "govde okunamadi" });
        return;
      }
      const eventType = String(payload.event_type || "");
      const data = payload.data || {};
      const txnId = String(data.id || "").trim();
      if ((eventType === "transaction.completed" || eventType === "transaction.paid") && txnId) {
        const custom = data.custom_data || {};
        const totals = (data.details && data.details.totals) || {};
        const minor = Number(totals.grand_total || totals.total || 0);
        const amountTry = Number.isFinite(minor) && minor > 0 ? minor / 100 : 9900;
        const packageType = String(custom.packageType || "SEAL_PACKAGE_9900");
        const workflowType = String(custom.workflowType || (packageType.includes("PCF") ? "pcf" : "cbam"));
        await db.collection("skdm_orders").doc(txnId).set(
          {
            orderId: txnId,
            updatedAt: new Date().toISOString(),
            sessionId: String(custom.sessionId || ""),
            sectorSlug: String(custom.sectorSlug || ""),
            packageType,
            workflowType,
            amountTry,
            currency: "TRY",
            paymentGateway: "Paddle",
            paddleTransactionId: txnId,
            paddleEventType: eventType,
            paymentStatus: "completed",
          },
          { merge: true }
        );
      }
      if (eventType === "transaction.refunded" && txnId) {
        await db.collection("skdm_orders").doc(txnId).set(
          {
            updatedAt: new Date().toISOString(),
            paddleEventType: eventType,
            paymentStatus: "refunded",
          },
          { merge: true }
        );
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(501).json({
      ok: false,
      message: "Bu API yolu henüz bağlanmadı",
      path,
      hint: "POST /api/skdm-sessions | GET /api/orders/status | GET /api/packages | POST /api/seal | POST /api/webhooks/paddle",
    });
  } catch (err) {
    console.error("api error", err);
    res.status(500).json({ ok: false, message: "sunucu tamamlanmadı — tekrar deneyin" });
  }
});

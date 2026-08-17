const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const crypto = require("node:crypto");

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

    // Plan 20: POST /api/seal — QC %100 + skdm_sealed_packages kaydı (ZIP istemci; Storage Paddle sonrası)
    if (path === "/seal" || path === "/seal/") {
      if (req.method !== "POST") {
        res.status(405).json({ ok: false, message: "POST gerekli" });
        return;
      }
      const body = req.body || {};
      const packageId = String(body.packageId || "").trim();
      const sessionId = String(body.sessionId || "").trim();
      const readinessScore = Number(body.readinessScore);
      const masterHash = String(body.masterHash || "").trim();
      const manifesto = body.manifesto || null;

      if (!packageId || !sessionId || !masterHash || !manifesto) {
        res.status(400).json({
          ok: false,
          message: "packageId, sessionId, masterHash, manifesto zorunlu",
        });
        return;
      }
      if (readinessScore !== 100) {
        res.status(403).json({
          ok: false,
          message: "Hazırlık skoru %100 olmadan mühür kaydı açılamaz",
        });
        return;
      }

      const createdAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
      const files = Array.isArray(body.files) ? body.files : [];

      const doc = {
        packageId,
        sessionId,
        createdAt,
        expiresAt,
        orderId: body.orderId || null,
        ownerUid: body.ownerUid || null,
        rulesetVersion: manifesto.rulesetVersion || null,
        engineVersion: manifesto.engineVersion || null,
        masterHash,
        readinessScore: 100,
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

      await db.collection("skdm_sealed_packages").doc(packageId).set(doc);
      if (sessionId) {
        await db.collection("skdm_sessions").doc(sessionId).set(
          { status: "sealed", sealedPackageId: packageId, updatedAt: createdAt },
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
        await db.collection("skdm_orders").doc(txnId).set(
          {
            orderId: txnId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sessionId: String(custom.sessionId || ""),
            sectorSlug: String(custom.sectorSlug || ""),
            packageType: String(custom.packageType || "SEAL_PACKAGE_9900"),
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
      res.status(200).json({ ok: true });
      return;
    }

    res.status(501).json({
      ok: false,
      message: "Bu API yolu henüz bağlanmadı",
      path,
      hint: "POST /api/skdm-sessions | POST /api/seal | POST /api/webhooks/paddle",
    });
  } catch (err) {
    console.error("api error", err);
    res.status(500).json({ ok: false, message: "sunucu tamamlanmadı — tekrar deneyin" });
  }
});

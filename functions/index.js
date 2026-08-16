const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) initializeApp();
const db = getFirestore();

/**
 * /api/** → api
 * POST /api/skdm-sessions  — G-22 taslak upsert (skdm_sessions)
 * GET  /api/skdm-sessions?sessionId=&sectorSlug= — taslak oku
 */
exports.api = onRequest({ region: "europe-west3", cors: true }, async (req, res) => {
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

    res.status(501).json({
      ok: false,
      message: "Bu API yolu henüz bağlanmadı",
      path,
      hint: "POST /api/skdm-sessions | POST /api/seal",
    });
  } catch (err) {
    console.error("api error", err);
    res.status(500).json({ ok: false, message: "sunucu tamamlanmadı — tekrar deneyin" });
  }
});

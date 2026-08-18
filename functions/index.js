/**
 * SKDMHESAPLA V8 API — sunucu-otorite karar ve teslim zinciri.
 * İstemci kimlik/ödeme/yetki/paket içeriği/hash doğruluğu üretemez.
 *
 * Routes:
 *  POST /api/skdm-sessions            — yetkili taslak yazımı (owner token'dan)
 *  GET  /api/skdm-sessions            — yetkili taslak okuma (owner kontrolü)
 *  POST /api/pcf/snapshot             — yetkili PCF kanonik girdi anlık görüntüsü
 *  GET  /api/pcf/resume               — yetkili PCF devam (snapshot geri yükle)
 *  GET  /api/pcf/feature-flags        — sunucu mühür özellik bayrakları
 *  POST /api/webhooks/paddle          — Paddle imza doğrulamalı (yalnız completed yetki)
 *  GET  /api/orders/status            — yetkili sipariş durumu
 *  POST /api/seal                     — yetkili atomik mühür rezervasyonu + sunucu paket üretimi
 *  GET  /api/packages                 — PII'siz genel bütünlük kaydı
 *  GET  /api/packages/download        — yetkili özel paket indirme
 *  POST /api/veri-talebi/share        — yetkili yetki linki oluşturma (digest saklanır)
 *  GET  /api/veri-talebi/share        — genel link meta okuma
 *  POST /api/veri-talebi/submit       — tek işlemde link tüketimi + alan yazımı
 */
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { evaluateSealEntitlement, evaluatePaymentStatus, normalizePackageType } = require("./seal-entitlement");
const { verifyPaddleSignature, requireUser } = require("./security-v2");
const { validateCompletedTransaction } = require("./paddle-order-v2");
const { computeSnapshotHash, computePackageId, recomputePcf } = require("./core-runtime-v2");
const { buildPcfPackage, zipToBase64, packageFileRecords } = require("./artifact-builder-v2");
const {
  newShareToken,
  tokenDigest,
  buildShareDoc,
  validateSubmission,
} = require("./delegation-v2");

if (!getApps().length) initializeApp();
const db = getFirestore();
const paddleWebhookSecret = defineSecret("PADDLE_WEBHOOK_SECRET");

// Gate 7 — CBAM sentetik veri ve otorite kapıları kapanmadan CBAM seal kapalı.
const CBAM_SEAL_PACKAGE_V2_READY = false;
// PCF sunucu-otorite zinciri (snapshot + sunucu hesaplama + sunucu paket) açık.
const PCF_SEAL_V2_READY = String(process.env.PCF_SEAL_V2_READY || "true") !== "false";
// Paddle fiyat kataloğu bağlamı — secret/run-env yoksa fiyat kimliği eşleşmesi atlanır (belgeli).
const PADDLE_PRICE_ID_9900 = String(process.env.PADDLE_PRICE_ID_9900 || "").trim();

const PACKAGE_EXPIRY_MS = 7 * 24 * 3600 * 1000;
const BUILD_LEASE_MS = 5 * 60 * 1000;
const MAX_PACKAGE_BLOB_BASE64 = 900 * 1024; // Firestore 1MB sınırına karşı fail-closed eşik

function fail(res, http, message, extra) {
  res.status(http).json({ ok: false, message, ...(extra || {}) });
  return null;
}

function iso(d = Date.now()) {
  return new Date(d).toISOString();
}

async function loadSession(workflowType, sessionId) {
  const col = workflowType === "pcf" ? "pcf_sessions" : "skdm_sessions";
  const snap = await db.collection(col).doc(sessionId).get();
  return snap.exists ? snap.data() : null;
}

async function assertSessionOwner(workflowType, sessionId, uid) {
  const session = await loadSession(workflowType, sessionId);
  if (!session) {
    const err = new Error("çalışma bulunamadı");
    err.http = 404;
    throw err;
  }
  if (String(session.ownerUid || "") !== String(uid || "")) {
    const err = new Error("bu çalışmaya erişim yetkiniz yok");
    err.http = 403;
    throw err;
  }
  return session;
}

async function loadOrder(txnId) {
  const snap = await db.collection("skdm_orders").doc(txnId).get();
  return snap.exists ? snap.data() : null;
}

exports.api = onRequest(
  { region: "europe-west3", cors: true, secrets: [paddleWebhookSecret] },
  async (req, res) => {
    const path = (req.path || "").replace(/^\/api/, "") || "/";
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    try {
      /* ------------------------------------------------ skdm-sessions */
      if (path === "/skdm-sessions" || path === "/skdm-sessions/") {
        const auth = await requireUser(req);
        if (req.method === "POST") {
          const body = req.body || {};
          const sessionId = String(body.sessionId || "").trim();
          const sectorSlug = String(body.sectorSlug || "").trim();
          if (!sessionId || !sectorSlug) return fail(res, 400, "sessionId ve sectorSlug zorunlu");
          const existing = await loadSession("cbam", sessionId);
          if (existing && String(existing.ownerUid || "") !== auth.uid) {
            return fail(res, 403, "bu çalışmaya erişim yetkiniz yok");
          }
          const nowIso = iso();
          const doc = {
            sessionId,
            sectorSlug,
            ownerUid: auth.uid, // yalnız token'dan türetilir; gövdede gönderilen sahip kimliği dikkate alınmaz
            updatedAt: nowIso,
            createdAt: body.createdAt || nowIso,
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
            status: "draft",
            engineHint: "skdm-calc-v2026.1",
          };
          await db.collection("skdm_sessions").doc(sessionId).set(doc, { merge: true });
          res.status(200).json({ ok: true, sessionId, updatedAt: doc.updatedAt });
          return;
        }
        if (req.method === "GET") {
          const sessionId = String(req.query.sessionId || "").trim();
          if (!sessionId) return fail(res, 400, "sessionId zorunlu");
          const session = await assertSessionOwner("cbam", sessionId, auth.uid);
          res.status(200).json({ ok: true, draft: session });
          return;
        }
        return fail(res, 405, "POST veya GET gerekli");
      }

      /* ------------------------------------------------ pcf snapshot */
      if (path === "/pcf/snapshot" || path === "/pcf/snapshot/") {
        if (req.method !== "POST") return fail(res, 405, "POST gerekli");
        const auth = await requireUser(req);
        const body = req.body || {};
        const sessionId = String(body.sessionId || "").trim();
        const canonicalInput = body.canonicalInput || null;
        if (!sessionId || !canonicalInput || typeof canonicalInput !== "object") {
          return fail(res, 400, "sessionId ve canonicalInput zorunlu");
        }
        const existing = await loadSession("pcf", sessionId);
        if (existing && String(existing.ownerUid || "") !== auth.uid) {
          return fail(res, 403, "bu çalışmaya erişim yetkiniz yok");
        }
        await db.collection("pcf_sessions").doc(sessionId).set(
          {
            sessionId,
            ownerUid: auth.uid,
            workflowType: "pcf",
            canonicalInput,
            snapshotHash: computeSnapshotHash(canonicalInput),
            updatedAt: iso(),
            status: "draft",
          },
          { merge: true },
        );
        res.status(200).json({ ok: true, sessionId });
        return;
      }

      if (path === "/pcf/resume" || path === "/pcf/resume/") {
        if (req.method !== "GET") return fail(res, 405, "GET gerekli");
        const auth = await requireUser(req);
        const sessionId = String(req.query.sessionId || "").trim();
        if (!sessionId) return fail(res, 400, "sessionId zorunlu");
        const session = await assertSessionOwner("pcf", sessionId, auth.uid);
        res.status(200).json({
          ok: true,
          canonicalInput: session.canonicalInput || null,
          status: session.status || "draft",
          sealedPackageId: session.sealedPackageId || null,
          snapshotHash: session.snapshotHash || null,
        });
        return;
      }

      if (path === "/pcf/feature-flags" || path === "/pcf/feature-flags/") {
        res.status(200).json({
          ok: true,
          pcfSealV2Ready: PCF_SEAL_V2_READY,
          cbamSealV2Ready: CBAM_SEAL_PACKAGE_V2_READY,
        });
        return;
      }

      /* ------------------------------------------------ veri-talebi share */
      if (path === "/veri-talebi/share" || path === "/veri-talebi/share/") {
        if (req.method === "POST") {
          const auth = await requireUser(req);
          const body = req.body || {};
          const sessionId = String(body.sessionId || "").trim();
          const fieldId = String(body.fieldId || "").trim();
          if (!sessionId || !fieldId) return fail(res, 400, "sessionId ve fieldId zorunlu");
          const workflowType = String(body.workflowType || (body.sectorSlug ? "cbam" : "pcf")).trim();
          const session = await assertSessionOwner(workflowType, sessionId, auth.uid);
          const token = newShareToken();
          const share = buildShareDoc({
            token,
            sessionId,
            sectorSlug: String(body.sectorSlug || session.sectorSlug || ""),
            fieldId,
            fieldTitle: body.fieldTitle,
            why: body.why,
            howToEnter: body.howToEnter,
            required: body.required,
            inputType: body.inputType,
          });
          await db.collection("skdm_veri_talebi_shares").doc(share.tokenDigest).set(share);
          res.status(200).json({ ok: true, token, url: `/veri-talebi/?token=${token}` });
          return;
        }
        if (req.method === "GET") {
          const token = String(req.query.token || "").trim();
          if (!token) return fail(res, 400, "token zorunlu");
          const snap = await db.collection("skdm_veri_talebi_shares").doc(tokenDigest(token)).get();
          if (!snap.exists) return fail(res, 404, "link bulunamadı veya süresi doldu");
          const d = snap.data();
          if (d.revokedAt) return fail(res, 410, "link iptal edildi");
          res.status(200).json({
            ok: true,
            share: {
              fieldId: d.fieldId,
              fieldTitle: d.fieldTitle,
              why: d.why || "",
              howToEnter: d.howToEnter || "",
              required: d.required === "zorunlu" ? "zorunlu" : "opsiyonel",
              inputType: d.inputType || "text",
              used: Boolean(d.used),
              submittedAt: d.usedAt || null,
              expiresAt: d.expiresAt || null,
              sectorSlug: d.sectorSlug || null,
            },
          });
          return;
        }
        return fail(res, 405, "POST veya GET gerekli");
      }

      /* ------------------------------------------------ veri-talebi submit */
      if (path === "/veri-talebi/submit" || path === "/veri-talebi/submit/") {
        if (req.method !== "POST") return fail(res, 405, "POST gerekli");
        const body = req.body || {};
        const token = String(body.token || "").trim();
        const value = String(body.value ?? "").trim();
        if (!token) return fail(res, 400, "token zorunlu");
        const digest = tokenDigest(token);
        const result = await db.runTransaction(async (tx) => {
          const shareRef = db.collection("skdm_veri_talebi_shares").doc(digest);
          const shareSnap = await tx.get(shareRef);
          const share = shareSnap.exists ? shareSnap.data() : null;
          const gate = validateSubmission(share, value);
          if (!gate.ok) return { ok: false, http: share ? 410 : 404, reason: gate.reason };
          const sessionId = String(share.sessionId || "");
          const sessionSnap = await tx.get(db.collection("pcf_sessions").doc(sessionId));
          let session = null;
          if (!sessionSnap.exists) {
            const cbamSnap = await tx.get(db.collection("skdm_sessions").doc(sessionId));
            if (cbamSnap.exists) session = cbamSnap.data();
          } else {
            session = sessionSnap.data();
          }
          const fieldValues = { ...(session && session.fieldValues ? session.fieldValues : {}), [share.fieldId]: value };
          const usedAt = iso();
          if (sessionSnap.exists) {
            tx.set(db.collection("pcf_sessions").doc(sessionId), { fieldValues, updatedAt: usedAt }, { merge: true });
          } else {
            tx.set(db.collection("skdm_sessions").doc(sessionId), { fieldValues, updatedAt: usedAt }, { merge: true });
          }
          tx.update(shareRef, { used: true, usedAt, submittedValue: value });
          return { ok: true, fieldId: share.fieldId, fieldTitle: share.fieldTitle };
        });
        if (!result.ok) return fail(res, result.http || 400, result.reason);
        res.status(200).json({ ok: true, fieldId: result.fieldId, fieldTitle: result.fieldTitle });
        return;
      }

      /* ------------------------------------------------ orders/status */
      if (path === "/orders/status" || path === "/orders/status/") {
        if (req.method !== "GET") return fail(res, 405, "GET gerekli");
        const auth = await requireUser(req);
        const transactionId = String(req.query.transactionId || "").trim();
        const sessionIdQ = String(req.query.sessionId || "").trim();
        if (!transactionId || !sessionIdQ) return fail(res, 400, "transactionId ve sessionId zorunlu");
        const order = await loadOrder(transactionId);
        if (order && order.sessionId && order.sessionId === sessionIdQ) {
          const session = await loadSession(order.workflowType === "pcf" ? "pcf" : "cbam", sessionIdQ);
          if (!session || String(session.ownerUid || "") !== auth.uid) {
            return fail(res, 403, "bu siparişe erişim yetkiniz yok");
          }
        }
        const st = evaluatePaymentStatus(order, sessionIdQ);
        if (order && order.entitlementSuspended && st.status === "completed") {
          st.status = "rejected";
          st.reason = "Ödeme iade edilmiş";
        }
        res.status(200).json(st);
        return;
      }

      /* ------------------------------------------------ packages (public) */
      if (path === "/packages" || path === "/packages/") {
        if (req.method !== "GET") return fail(res, 405, "GET gerekli");
        const packageIdQ = String(req.query.packageId || "").trim();
        const hashQ = String(req.query.hash || "").trim();
        if (!packageIdQ && !hashQ) return fail(res, 400, "packageId veya hash zorunlu");
        let found = null;
        let kind = "cbam";
        if (packageIdQ) {
          const pcfSnap = await db.collection("pcf_packages").doc(packageIdQ).get();
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
          const pcfQ = await db.collection("pcf_packages").where("masterHash", "==", h).limit(1).get();
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
        if (!found) return fail(res, 404, "paket kaydı bulunamadı");
        // K-06: sessionId/owner/order iç kimlikleri genel yanıttan çıkarıldı.
        res.status(200).json({
          ok: true,
          packageKind: kind,
          packageId: found.packageId,
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

      /* ------------------------------------------------ packages/download */
      if (path === "/packages/download" || path === "/packages/download/") {
        if (req.method !== "GET") return fail(res, 405, "GET gerekli");
        const auth = await requireUser(req);
        const packageIdQ = String(req.query.packageId || "").trim();
        if (!packageIdQ) return fail(res, 400, "packageId zorunlu");
        const pcfSnap = await db.collection("pcf_packages").doc(packageIdQ).get();
        if (!pcfSnap.exists) return fail(res, 404, "paket kaydı bulunamadı");
        const pkg = pcfSnap.data();
        if (String(pkg.ownerUid || "") !== auth.uid) return fail(res, 403, "bu pakete erişim yetkiniz yok");
        if (pkg.status !== "ready") {
          return fail(res, pkg.status === "building" ? 409 : 410, pkg.status === "building" ? "paket hâlâ oluşturuluyor" : "paket tamamlanmadı");
        }
        if (pkg.expiresAt && pkg.expiresAt < iso()) return fail(res, 410, "paketin indirme süresi doldu");
        if (pkg.paddleTransactionId) {
          const order = await loadOrder(pkg.paddleTransactionId);
          if (order && order.entitlementSuspended) {
            return fail(res, 403, "ödeme iade edildiği için indirme askıda");
          }
        }
        if (!pkg.zipBase64) return fail(res, 500, "paket içeriği eksik");
        const buf = Buffer.from(pkg.zipBase64, "base64");
        const filename = String(pkg.zipFilename || `${packageIdQ}.zip`);
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.status(200).send(buf);
        return;
      }

      /* ------------------------------------------------ seal */
      if (path === "/seal" || path === "/seal/") {
        if (req.method !== "POST") return fail(res, 405, "POST gerekli");
        const auth = await requireUser(req);
        // K-01: istemci yalnız kimlik gönderebilir; paket/hash/manifest istemciden kabul edilmez.
        const body = req.body || {};
        const sessionId = String(body.sessionId || "").trim();
        const paddleTransactionId = String(body.paddleTransactionId || "").trim();
        const workflowType = String(body.workflowType || "").trim();
        if (!sessionId || !paddleTransactionId || !workflowType) {
          return fail(res, 400, "sessionId, paddleTransactionId, workflowType zorunlu");
        }
        if (workflowType !== "pcf" && workflowType !== "cbam") {
          return fail(res, 400, "workflowType geçersiz");
        }
        if (workflowType === "cbam") {
          // Gate 7 — RM otorite + resmî şablon + sentetik veri kapıları kapanmadan kapalı.
          return fail(res, 403, "CBAM mühürleme şu anda devre dışı. Gözden geçirin.");
        }
        if (!PCF_SEAL_V2_READY) {
          return fail(res, 403, "mühür hizmeti şu anda devre dışı");
        }

        const session = await assertSessionOwner("pcf", sessionId, auth.uid);
        const canonicalInput = session.canonicalInput;
        if (!canonicalInput || typeof canonicalInput !== "object") {
          return fail(res, 400, "sunucuda kanonik girdi yok — önce anlık görüntü alınmalı");
        }

        const order = await loadOrder(paddleTransactionId);
        if (!order) return fail(res, 403, "Ödeme kaydı doğrulanamadı");
        if (order.entitlementSuspended) return fail(res, 403, "ödeme iade edildiği için mühür kullanılamaz");

        const recomputed = recomputePcf(canonicalInput);
        if (recomputed.status === "blocked") {
          return fail(res, 403, "PCF sonucu mühürlemeye uygun değil");
        }

        const snapshotHash = computeSnapshotHash(canonicalInput);
        const packageId = computePackageId("pcf", sessionId, paddleTransactionId, snapshotHash);

        const gate = evaluateSealEntitlement(order, {
          sessionId,
          paddleTransactionId,
          packageType: "PCF_SEAL_PACKAGE_9900",
          workflowType: "pcf",
          packageId,
          resultStatus: recomputed.status,
        });
        if (!gate.ok) return fail(res, gate.http || 403, gate.reason);

        // R-01: atomik rezervasyon — tek ödeme tek paket kimliği.
        let reservation;
        try {
          reservation = await db.runTransaction(async (tx) => {
            const orderRef = db.collection("skdm_orders").doc(paddleTransactionId);
            const orderSnap = await tx.get(orderRef);
            const current = orderSnap.exists ? orderSnap.data() : null;
            if (!current) {
              const e = new Error("Ödeme kaydı doğrulanamadı");
              e.http = 403;
              throw e;
            }
            if (current.entitlementSuspended) {
              const e = new Error("ödeme iade edildiği için mühür kullanılamaz");
              e.http = 403;
              throw e;
            }
            if (current.consumedByPackageId && current.consumedByPackageId !== packageId) {
              const e = new Error("Bu ödeme başka bir paket için kullanılmış");
              e.http = 403;
              throw e;
            }
            const resRef = db.collection("seal_reservations").doc(packageId);
            const resSnap = await tx.get(resRef);
            if (resSnap.exists) {
              return { existing: true, status: resSnap.data().status || "building", packageId };
            }
            const createdAt = iso();
            tx.set(orderRef, {
              consumedByPackageId: packageId,
              consumedPackageType: "PCF_SEAL_PACKAGE_9900",
              consumedAt: createdAt,
              updatedAt: createdAt,
            }, { merge: true });
            tx.set(resRef, {
              packageId,
              workflowType: "pcf",
              sessionId,
              ownerUid: auth.uid,
              paddleTransactionId,
              snapshotHash,
              status: "building",
              createdAt,
              buildLeaseExpiresAt: iso(Date.now() + BUILD_LEASE_MS),
              expiresAt: iso(Date.now() + PACKAGE_EXPIRY_MS),
            });
            return { existing: false, status: "building", packageId };
          });
        } catch (err) {
          if (err.http) return fail(res, err.http, err.message);
          throw err;
        }

        if (reservation.existing) {
          const finalSnap = await db.collection("pcf_packages").doc(packageId).get();
          if (finalSnap.exists && finalSnap.data().status === "ready") {
            res.status(200).json({
              ok: true,
              packageId,
              masterHash: finalSnap.data().masterHash,
              status: "ready",
              createdAt: finalSnap.data().createdAt,
              expiresAt: finalSnap.data().expiresAt,
              downloadPath: `/api/packages/download?packageId=${packageId}`,
            });
            return;
          }
          // Hâlâ oluşturuluyor — istemci kısa bekleyip indirmeyi dener.
          res.status(202).json({ ok: true, packageId, status: "building" });
          return;
        }

        // Sunucu tarafı paket üretimi — istemci paket doğruluğu dikkate alınmaz.
        let pkg;
        try {
          pkg = buildPcfPackage(canonicalInput, recomputed, {
            sessionId,
            packageId,
            createdAt: session.updatedAt || iso(),
          });
        } catch (buildErr) {
          await db.collection("seal_reservations").doc(packageId).set(
            { status: "failed", failedAt: iso(), reason: String(buildErr.message || "build").slice(0, 500) },
            { merge: true },
          );
          if (buildErr.code === "PCF_BLOCKED") return fail(res, 403, "PCF sonucu mühürlemeye uygun değil");
          console.error("seal build failed", buildErr);
          return fail(res, 500, "paket oluşturulamadı — tekrar deneyin");
        }

        const zipBase64 = zipToBase64(pkg);
        if (zipBase64.length > MAX_PACKAGE_BLOB_BASE64) {
          await db.collection("seal_reservations").doc(packageId).set(
            { status: "failed", failedAt: iso(), reason: "paket boyutu sunucu sınırını aştı" },
            { merge: true },
          );
          return fail(res, 507, "paket boyutu çok büyük");
        }

        const createdAt = iso();
        const expiresAt = iso(Date.now() + PACKAGE_EXPIRY_MS);
        // K-05: paket + sipariş + oturum durumu tek işlemde sonlandırılır.
        await db.runTransaction(async (tx) => {
          tx.set(db.collection("pcf_packages").doc(packageId), {
            packageId,
            sessionId,
            ownerUid: auth.uid,
            workflowType: "pcf",
            paddleTransactionId,
            snapshotHash,
            createdAt,
            expiresAt,
            status: "ready",
            packageType: "PCF_SEAL_PACKAGE",
            zipFilename: pkg.zipFilename,
            zipBase64,
            masterHash: pkg.masterHash,
            manifesto: pkg.manifesto,
            files: packageFileRecords(pkg),
            engineVersion: recomputed.engineVersion,
            methodologyVersion: recomputed.methodologyVersion,
            factorRegistryVersion: pkg.manifesto.factorRegistryVersion,
            reportStatus: recomputed.status,
            delivery: "server-blob",
            source: "server",
          });
          tx.set(db.collection("seal_reservations").doc(packageId), { status: "ready", readyAt: createdAt }, { merge: true });
          tx.set(db.collection("pcf_sessions").doc(sessionId), {
            status: "sealed",
            sealedPackageId: packageId,
            updatedAt: createdAt,
          }, { merge: true });
        });

        res.status(200).json({
          ok: true,
          packageId,
          masterHash: pkg.masterHash,
          status: "ready",
          createdAt,
          expiresAt,
          downloadPath: `/api/packages/download?packageId=${packageId}`,
        });
        return;
      }

      /* ------------------------------------------------ webhooks/paddle */
      if (path === "/webhooks/paddle" || path === "/webhooks/paddle/") {
        if (req.method !== "POST") return fail(res, 405, "POST gerekli");
        const rawBuf = req.rawBody;
        const raw = Buffer.isBuffer(rawBuf) ? rawBuf.toString("utf8") : String(rawBuf || "");
        const signature = String(req.get("paddle-signature") || "");
        const secret = paddleWebhookSecret.value();
        if (!verifyPaddleSignature(raw, signature, secret)) {
          return fail(res, 401, "imza doğrulanamadı");
        }
        let payload = {};
        try {
          payload = JSON.parse(raw);
        } catch {
          return fail(res, 400, "gövde okunamadı");
        }
        const eventType = String(payload.event_type || "");
        const data = payload.data || {};
        const eventId = String(payload.event_id || "").trim();

        // K-04: yalnız transaction.completed yetki üretir.
        if (eventType === "transaction.completed") {
          const validated = validateCompletedTransaction(data, {
            priceId: PADDLE_PRICE_ID_9900,
            allowedPackageTypes: ["PCF_SEAL_PACKAGE_9900"],
          });
          if (!validated.ok) {
            console.warn(`[paddle] completed reddedildi: ${validated.reason}`, JSON.stringify(validated.detail || {}));
            // İmza geçerli ama katalog bağlamı eksik — tekil idempotency yine de kaydedilir.
            if (eventId) {
              await db.collection("paddle_events").doc(eventId).set(
                { eventId, eventType, status: "rejected", reason: validated.reason, receivedAt: iso() },
                { merge: true },
              );
            }
            return fail(res, 200, validated.reason);
          }
          const session = await loadSession("pcf", validated.sessionId);
          if (!session) {
            return fail(res, 200, "çalışma bulunamadı");
          }
          try {
            await db.runTransaction(async (tx) => {
              const eventRef = db.collection("paddle_events").doc(eventId);
              const eventSnap = await tx.get(eventRef);
              if (eventSnap.exists) return; // idempotent — yan etki yok
              tx.set(eventRef, { eventId, eventType, status: "applied", receivedAt: iso() });
              tx.set(db.collection("skdm_orders").doc(validated.transactionId), {
                orderId: validated.transactionId,
                paddleTransactionId: validated.transactionId,
                updatedAt: iso(),
                sessionId: validated.sessionId,
                sectorSlug: session.sectorSlug || null,
                packageType: validated.packageType,
                workflowType: "pcf",
                amountTry: validated.amountTry,
                currency: validated.currency,
                paymentGateway: "Paddle",
                paddleEventType: eventType,
                paymentStatus: "completed",
                entitlementSuspended: false,
              }, { merge: true });
            });
          } catch (txErr) {
            console.error("[paddle] completed uygulama hatası", txErr);
            return fail(res, 500, "işlem kaydedilemedi");
          }
          res.status(200).json({ ok: true });
          return;
        }

        // Refund / chargeback — yetki askıya alınır, denetim kaydı korunur.
        if (eventType === "transaction.refunded" || eventType === "adjustment.created" || eventType === "adjustment.updated") {
          const txnId = String(data.transaction_id || data.id || "").trim();
          const adjustment = data.adjustment || {};
          const adjustmentStatus = String(adjustment.status || data.status || "").trim();
          const type = String(adjustment.type || data.type || "").trim();
          const isRefundLike =
            eventType === "transaction.refunded" ||
            type === "refund" ||
            type === "chargeback" ||
            adjustmentStatus === "approved";
          if (txnId && isRefundLike) {
            await db.collection("skdm_orders").doc(txnId).set(
              {
                updatedAt: iso(),
                paddleEventType: eventType,
                entitlementSuspended: true,
                suspensionReason: type === "chargeback" ? "chargeback" : "refund",
                suspendedAt: iso(),
              },
              { merge: true },
            );
          }
          if (eventId) {
            await db.collection("paddle_events").doc(eventId).set(
              { eventId, eventType, status: isRefundLike ? "suspended" : "logged", receivedAt: iso() },
              { merge: true },
            );
          }
          res.status(200).json({ ok: true });
          return;
        }

        // Diğer olaylar loglanır; yetki üretmez.
        if (eventId) {
          await db.collection("paddle_events").doc(eventId).set(
            { eventId, eventType, status: "logged", receivedAt: iso() },
            { merge: true },
          );
        }
        res.status(200).json({ ok: true });
        return;
      }

      res.status(501).json({
        ok: false,
        message: "Bu API yolu henüz bağlanmadı",
        path,
      });
    } catch (err) {
      const http = err.http || 500;
      if (http === 500) console.error("api error", err);
      res.status(http).json({ ok: false, message: err.http ? err.message : "sunucu tamamlanmadı — tekrar deneyin" });
    }
  },
);

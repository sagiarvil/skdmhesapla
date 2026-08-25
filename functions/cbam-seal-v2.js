"use strict";

/**
 * CBAM server-authoritative seal gateway.
 * Client yalnız sessionId + Paddle transaction id gönderir. Hesap, register,
 * paket içeriği, hash ve ZIP sunucuda yeniden üretilir.
 *
 * Ticari sınır: Bu sürüm yalnız gerçek tesis/akış verisi ile mühürler.
 * Sektör fallback/ön izleme değerleri ücretli pakete giremez.
 */
const crypto = require("node:crypto");
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const { requireUser } = require("./security-v2");
const { evaluateSealEntitlement } = require("./seal-entitlement");
const { calculateSkdmLiability } = require("./skdm-core/calculator.js");
const { createSealedAuditPackage } = require("./skdm-core/package-seal.js");

if (!getApps().length) initializeApp();
const db = getFirestore();
const bucket = getStorage().bucket();

const PACKAGE_EXPIRY_MS = 7 * 24 * 3600 * 1000;
const BUILD_LEASE_MS = 5 * 60 * 1000;
const MAX_ZIP_BYTES = 20 * 1024 * 1024;

function iso(ms = Date.now()) {
  return new Date(ms).toISOString();
}

function fail(res, http, message, extra) {
  res.status(http).json({ ok: false, message, ...(extra || {}) });
  return null;
}

function normalizePath(req) {
  const p = String(req.path || "/");
  return p.replace(/^\/api\/cbam/, "") || "/";
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

async function loadOwnedSession(sessionId, uid) {
  const snap = await db.collection("skdm_sessions").doc(sessionId).get();
  if (!snap.exists) {
    const err = new Error("çalışma bulunamadı");
    err.http = 404;
    throw err;
  }
  const session = snap.data();
  if (String(session.ownerUid || "") !== String(uid || "")) {
    const err = new Error("bu çalışmaya erişim yetkiniz yok");
    err.http = 403;
    throw err;
  }
  return session;
}

function sectorIdFromSlug(slug) {
  return ({
    "demir-celik": "iron-steel",
    aluminyum: "aluminum",
    cimento: "cement",
    gubre: "fertilizer",
    elektrik: "electricity",
    hidrojen: "hydrogen",
  })[String(slug || "")] || "";
}

function buildServerCalculationInput(session) {
  const fieldValues = session?.fieldValues && typeof session.fieldValues === "object" ? session.fieldValues : {};
  const dProcesses = session?.dProcesses && typeof session.dProcesses === "object" ? session.dProcesses : {};
  const parsedTonaj = Number(String(fieldValues.tonaj ?? "").replace(",", "."));
  const dA = Number(dProcesses.a);
  const productionVolume = Number.isFinite(parsedTonaj) && parsedTonaj > 0
    ? parsedTonaj
    : Number.isFinite(dA) && dA > 0 ? dA : 0;
  const parsedYear = Number(fieldValues.yil);
  const year = Number.isInteger(parsedYear) && parsedYear >= 2026 && parsedYear <= 2034 ? parsedYear : 2026;
  const sectorId = sectorIdFromSlug(session?.sectorSlug);

  const streams = Array.isArray(session?.streams)
    ? session.streams.slice(0, 500).map((row) => ({
        method: String(row?.method || "").slice(0, 80),
        name: String(row?.name || "").slice(0, 200),
        ad: Number(row?.ad) || 0,
        unit: String(row?.unit || "").slice(0, 40),
        ncv: String(row?.ncv || "").slice(0, 80),
        processId: row?.processId ? String(row.processId).slice(0, 120) : undefined,
      }))
    : [];

  const precursors = Array.isArray(session?.precs)
    ? session.precs.slice(0, 500).map((row) => ({
        name: String(row?.name || "").slice(0, 200),
        total: Number(row?.total) || 0,
        see: Number(row?.see) || 0,
      }))
    : [];

  const facilityDeclared = streams.some((row) => Number(row.ad) > 0 && Boolean(String(row.method || "").trim()));
  const importerAnnualVolumeStatus = session?.importerAnnualVolumeStatus === "under50" || session?.importerAnnualVolumeStatus === "over50"
    ? session.importerAnnualVolumeStatus
    : "unknown";
  const noVerifier = session?.noVerifier !== false;
  const hasVerificationEvidence = noVerifier || Boolean(String(fieldValues.vFirma || "").trim());
  const trRaw = Number(fieldValues.mahsup);

  return {
    sectorId,
    productionVolume,
    year,
    importerAnnualVolumeStatus,
    useCustomEmissions: facilityDeclared,
    trEtsNettingEur: Number.isFinite(trRaw) ? trRaw : undefined,
    hasVerificationEvidence,
    streams,
    precursors,
  };
}

function registerSnapshot(session, sessionId) {
  return {
    sessionId,
    sectorSlug: String(session.sectorSlug || ""),
    goods: Array.isArray(session.goods) ? session.goods : [],
    processes: Array.isArray(session.processes) ? session.processes : [],
    streams: Array.isArray(session.streams) ? session.streams : [],
    precs: Array.isArray(session.precs) ? session.precs : [],
    dProcesses: session.dProcesses || undefined,
    fieldValues: session.fieldValues && typeof session.fieldValues === "object" ? session.fieldValues : {},
  };
}

function packageIdFor(sessionId, transactionId, auditHash) {
  return `CBAM-${sha256Text(`${sessionId}|${transactionId}|${auditHash}`).slice(0, 24).toUpperCase()}`;
}

function publicFiles(pkg) {
  return pkg.files.map((file) => ({
    filename: file.filename,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    sha256: file.sha256,
  }));
}

async function loadOrder(transactionId) {
  const snap = await db.collection("skdm_orders").doc(transactionId).get();
  return snap.exists ? snap.data() : null;
}

async function handleSeal(req, res) {
  if (req.method !== "POST") return fail(res, 405, "POST gerekli");
  // Production ödeme→indirme kabulü tamamlanana kadar yalnız UI değil API de fail-closed.
  return fail(res, 503, "Ücretli CBAM teslimi production kabul testi tamamlanana kadar kapalıdır");

  /* c8 ignore next 2 -- release açıldığında bu erken dönüş kaldırılır. */
  const auth = await requireUser(req);
  const body = req.body || {};
  const allowed = new Set(["sessionId", "paddleTransactionId", "workflowType"]);
  const unexpected = Object.keys(body).filter((key) => !allowed.has(key));
  if (unexpected.length) return fail(res, 400, "paket, hash veya hesap sonucu istemciden kabul edilmez");

  const sessionId = String(body.sessionId || "").trim();
  const transactionId = String(body.paddleTransactionId || "").trim();
  if (!sessionId || !transactionId) return fail(res, 400, "sessionId ve paddleTransactionId zorunlu");
  if (body.workflowType && body.workflowType !== "cbam") return fail(res, 400, "workflowType geçersiz");

  const session = await loadOwnedSession(sessionId, auth.uid);
  const input = buildServerCalculationInput(session);
  if (!input.sectorId) return fail(res, 400, "session sektör bilgisi geçersiz");

  const result = calculateSkdmLiability(input);

  // Enterprise fail-closed: resmî ülke+CN/TARIC default dataset hazır olana kadar
  // ücretli CBAM paketi yalnız gerçek, çözümlenebilir tesis kaynak akışından üretilebilir.
  const hasBenchmarkStep = result.emissionSteps.some((step) => step.kind === "benchmark");
  if (!result.isRealDataUsed || result.emissionDataQuality !== "dogrudan-olcum" || hasBenchmarkStep) {
    return fail(res, 403, "Ücretli CBAM paketi için tüm uygulanabilir emisyon bileşenleri gerçek tesis/akış verisinden türetilmelidir; benchmark/fallback adımı mühürlenmez.");
  }
  if (Number(result.readinessScore) !== 100) {
    return fail(res, 403, "Hazırlık skoru %100 olmadan ücretli paket üretilemez");
  }

  const order = await loadOrder(transactionId);
  const packageId = packageIdFor(sessionId, transactionId, result.audit.hash);
  const entitlement = evaluateSealEntitlement(order, {
    sessionId,
    paddleTransactionId: transactionId,
    packageType: "CBAM_SEAL_PACKAGE_9900",
    workflowType: "cbam",
    packageId,
    readinessScore: result.readinessScore,
  });
  if (!entitlement.ok) return fail(res, entitlement.http || 403, entitlement.reason);
  if (order && order.entitlementSuspended) return fail(res, 403, "ödeme iade edildiği için mühür kullanılamaz");

  let reservation;
  try {
    reservation = await db.runTransaction(async (tx) => {
      const orderRef = db.collection("skdm_orders").doc(transactionId);
      const orderSnap = await tx.get(orderRef);
      const current = orderSnap.exists ? orderSnap.data() : null;
      if (!current || current.paymentStatus !== "completed") {
        const err = new Error("Ödeme kaydı doğrulanamadı");
        err.http = 403;
        throw err;
      }
      if (current.entitlementSuspended || current.paymentStatus === "refunded") {
        const err = new Error("ödeme iade edildiği için mühür kullanılamaz");
        err.http = 403;
        throw err;
      }
      if (current.consumedByPackageId && current.consumedByPackageId !== packageId) {
        const err = new Error("Bu ödeme başka bir paket için kullanılmış");
        err.http = 403;
        throw err;
      }

      const reservationRef = db.collection("seal_reservations").doc(packageId);
      const reservationSnap = await tx.get(reservationRef);
      if (reservationSnap.exists) return { existing: true, packageId };

      const createdAt = iso();
      tx.set(orderRef, {
        consumedByPackageId: packageId,
        consumedPackageType: "CBAM_SEAL_PACKAGE_9900",
        consumedAt: createdAt,
        updatedAt: createdAt,
      }, { merge: true });
      tx.set(reservationRef, {
        packageId,
        workflowType: "cbam",
        sessionId,
        ownerUid: auth.uid,
        paddleTransactionId: transactionId,
        auditHash: result.audit.hash,
        status: "building",
        createdAt,
        buildLeaseExpiresAt: iso(Date.now() + BUILD_LEASE_MS),
        expiresAt: iso(Date.now() + PACKAGE_EXPIRY_MS),
      });
      return { existing: false, packageId };
    });
  } catch (err) {
    if (err.http) return fail(res, err.http, err.message);
    throw err;
  }

  if (reservation.existing) {
    const existing = await db.collection("skdm_sealed_packages").doc(packageId).get();
    if (existing.exists && existing.data().status === "ready") {
      const d = existing.data();
      res.status(200).json({
        ok: true,
        packageId,
        masterHash: d.masterHash,
        status: "ready",
        downloadPath: `/api/cbam/download?packageId=${packageId}`,
        expiresAt: d.expiresAt,
      });
      return;
    }
    res.status(202).json({ ok: true, packageId, status: "building" });
    return;
  }

  let pkg;
  try {
    pkg = createSealedAuditPackage(result, registerSnapshot(session, sessionId), {
      packageId,
      timestamp: session.updatedAt || iso(),
    });
  } catch (err) {
    await db.collection("seal_reservations").doc(packageId).set({
      status: "failed",
      failedAt: iso(),
      reason: String(err?.message || "build").slice(0, 1000),
    }, { merge: true });
    return fail(res, 403, String(err?.message || "Paket kalite kontrolünden geçmedi"));
  }

  const zipBytes = pkg.zipBytes ? Buffer.from(pkg.zipBytes) : null;
  if (!zipBytes || zipBytes.length === 0) return fail(res, 500, "paket ZIP içeriği üretilemedi");
  if (zipBytes.length > MAX_ZIP_BYTES) return fail(res, 507, "paket boyutu güvenli sunucu sınırını aştı");

  const storagePath = `private/cbam-packages/${auth.uid}/${packageId}.zip`;
  const file = bucket.file(storagePath);
  await file.save(zipBytes, {
    resumable: false,
    validation: "md5",
    metadata: {
      contentType: "application/zip",
      cacheControl: "private, no-store, max-age=0",
      metadata: {
        packageId,
        masterHash: pkg.masterHash,
        ownerUid: auth.uid,
      },
    },
  });

  const createdAt = iso();
  const expiresAt = iso(Date.now() + PACKAGE_EXPIRY_MS);
  const files = publicFiles(pkg);
  await db.runTransaction(async (tx) => {
    tx.set(db.collection("skdm_sealed_packages").doc(packageId), {
      packageId,
      sessionId,
      ownerUid: auth.uid,
      workflowType: "cbam",
      paddleTransactionId: transactionId,
      createdAt,
      expiresAt,
      status: "ready",
      packageType: "CBAM_SEAL_PACKAGE",
      zipFilename: pkg.zipFilename || `${packageId}.zip`,
      storagePath,
      masterHash: pkg.masterHash,
      manifesto: pkg.manifesto,
      files,
      engineVersion: pkg.engineVersion,
      rulesetVersion: pkg.rulesetVersion,
      reportStatus: "actual-data-only",
      delivery: "private-cloud-storage",
      source: "server",
    });
    tx.set(db.collection("seal_reservations").doc(packageId), { status: "ready", readyAt: createdAt }, { merge: true });
    tx.set(db.collection("skdm_sessions").doc(sessionId), { status: "sealed", sealedPackageId: packageId, updatedAt: createdAt }, { merge: true });
  });

  res.status(200).json({
    ok: true,
    packageId,
    masterHash: pkg.masterHash,
    status: "ready",
    createdAt,
    expiresAt,
    downloadPath: `/api/cbam/download?packageId=${packageId}`,
  });
}

async function handleDownload(req, res) {
  if (req.method !== "GET") return fail(res, 405, "GET gerekli");
  const auth = await requireUser(req);
  const packageId = String(req.query.packageId || "").trim();
  if (!packageId) return fail(res, 400, "packageId zorunlu");

  const snap = await db.collection("skdm_sealed_packages").doc(packageId).get();
  if (!snap.exists) return fail(res, 404, "paket kaydı bulunamadı");
  const pkg = snap.data();
  if (String(pkg.ownerUid || "") !== auth.uid) return fail(res, 403, "bu pakete erişim yetkiniz yok");
  if (pkg.status !== "ready") return fail(res, 409, "paket henüz hazır değil");
  if (pkg.expiresAt && pkg.expiresAt < iso()) return fail(res, 410, "paketin indirme süresi doldu");

  const order = await loadOrder(String(pkg.paddleTransactionId || ""));
  if (!order || order.entitlementSuspended || order.paymentStatus === "refunded") {
    return fail(res, 403, "ödeme yetkisi artık geçerli değil");
  }
  if (!pkg.storagePath) return fail(res, 500, "paket depolama kaydı eksik");

  const file = bucket.file(pkg.storagePath);
  const [exists] = await file.exists();
  if (!exists) return fail(res, 410, "paket dosyası bulunamadı");
  const [bytes] = await file.download();

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Content-Disposition", `attachment; filename="${String(pkg.zipFilename || `${packageId}.zip`).replace(/[\r\n\"]/g, "")}"`);
  res.status(200).send(bytes);
}

exports.cbamApiV2 = onRequest(
  { region: "europe-west3", cors: true, memory: "1GiB", timeoutSeconds: 120 },
  async (req, res) => {
    try {
      const path = normalizePath(req);
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      if (path === "/feature-flags" || path === "/feature-flags/") {
        res.status(200).json({
          ok: true,
          cbamServerAuthoritativeSealReady: true,
          commercialReleaseReady: false,
          paymentToDownloadE2EReady: false,
          paidSealDataPolicy: "actual-data-only",
          officialDefaultValueFallbackSealable: false,
        });
        return;
      }
      if (path === "/seal" || path === "/seal/") return await handleSeal(req, res);
      if (path === "/download" || path === "/download/") return await handleDownload(req, res);
      return fail(res, 404, "CBAM API yolu bulunamadı");
    } catch (err) {
      console.error("cbamApiV2", err);
      return fail(res, err?.http || 500, err?.message || "sunucu hatası");
    }
  },
);

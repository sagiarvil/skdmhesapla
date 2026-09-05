"use strict";

const crypto = require("node:crypto");
const { once } = require("node:events");
const { onRequest } = require("firebase-functions/v2/https");
const { getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const {
  CHUNK_BYTES,
  MAX_FILE_BYTES,
  MAX_CHUNKS,
  EVIDENCE_REGISTRY,
  canonicalHash,
  safeId,
  safeText,
  safeFileName,
  sha256,
  validateMagic,
  validateEvidenceMetadata,
  buildRetention,
  buildEvidenceChainHash,
  expectedChunkSize,
} = require("./maritime-evidence-core.js");

if (!getApps().length) initializeApp();
const db = getFirestore();
const STORAGE_BUCKET = process.env.MARITIME_EVIDENCE_BUCKET || "carbon-web-1265b.firebasestorage.app";
const bucket = getStorage().bucket(STORAGE_BUCKET);
const RULESET_ID = "eu-maritime-2026-09-04";
const SCHEMA_VERSION = "maritime-evidence-v3";
const ROLES = new Set(["owner", "admin", "compliance_manager", "editor", "viewer"]);
const READ_ROLES = new Set(ROLES);
const WRITE_ROLES = new Set(["owner", "admin", "compliance_manager", "editor"]);
const UPLOAD_SESSION_MS = 24 * 60 * 60 * 1000;

function nowIso() { return new Date().toISOString(); }
function randomId(prefix) { return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`; }
function httpError(status, code, message, extra) { const e = new Error(message); e.http = status; e.code = code; Object.assign(e, extra || {}); return e; }
function fail(res, err) {
  res.status(Number(err?.http) || 500).json({
    ok: false,
    code: err?.code || "MARITIME_EVIDENCE_INTERNAL",
    message: err?.message || "Kanıt servisi sunucu hatası",
    ...(err?.missing ? { missing: err.missing } : {}),
  });
}

const companyRef = (id) => db.collection("companies").doc(id);
const memberRef = (cid, uid) => companyRef(cid).collection("members").doc(uid);
const fleetRef = (cid, fid) => companyRef(cid).collection("maritimeFleets").doc(fid);
const homeRef = (uid) => db.collection("maritimeUserHomes").doc(uid);
const shipRef = (ctx) => fleetRef(ctx.companyId, ctx.fleetId).collection("ships").doc(ctx.shipId);
const yearRef = (ctx) => shipRef(ctx).collection("reportingYears").doc(String(ctx.year));
const uploadRef = (ctx, evidenceId) => yearRef(ctx).collection("evidenceUploadSessions").doc(evidenceId);
const evidenceRef = (ctx, evidenceId) => yearRef(ctx).collection("evidenceDocuments").doc(evidenceId);

async function requireUser(req) {
  const header = String(req.get("authorization") || "");
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) throw httpError(401, "AUTH_REQUIRED", "Belge yükleme için üye girişi gerekli");
  try {
    const decoded = await getAuth().verifyIdToken(match[1].trim(), true);
    if (decoded.firebase?.sign_in_provider === "anonymous") throw httpError(401, "REGISTERED_USER_REQUIRED", "Kayıtlı kullanıcı hesabı gerekli");
    return { uid: decoded.uid, email: decoded.email || null, name: decoded.name || null };
  } catch (error) {
    if (error?.http) throw error;
    throw httpError(401, "AUTH_INVALID", "Kimlik doğrulaması geçersiz veya iptal edilmiş");
  }
}

async function roleFor(companyId, uid) {
  const member = await memberRef(companyId, uid).get();
  if (member.exists && member.data().active !== false && ROLES.has(member.data().role)) return member.data().role;
  const company = await companyRef(companyId).get();
  if (company.exists && company.data().ownerId === uid) return "owner";
  return null;
}

async function authorize(companyId, uid, allowed) {
  const role = await roleFor(companyId, uid);
  if (!role || !allowed.has(role)) throw httpError(403, "RBAC_DENIED", "Bu şirketin kanıt kasasına erişim yetkiniz yok");
  return role;
}

function contextFrom(home, input = {}) {
  const c = input.context || input;
  const year = Math.trunc(Number(c.year || home.year || 0));
  return {
    companyId: safeId(c.companyId || home.companyId, 120),
    fleetId: safeId(c.fleetId || home.fleetId, 120),
    shipId: safeId(c.shipId || home.shipId, 120),
    year,
  };
}

async function resolveContext(user, input, allowed = READ_ROLES) {
  const homeSnap = await homeRef(user.uid).get();
  if (!homeSnap.exists) throw httpError(409, "WORKSPACE_REQUIRED", "Önce denizcilik çalışma dosyası oluşturulmalı");
  const home = homeSnap.data();
  const ctx = contextFrom(home, input || {});
  if (!ctx.companyId || !ctx.fleetId || !ctx.shipId || !Number.isInteger(ctx.year) || ctx.year < 2024 || ctx.year > 2100) {
    throw httpError(400, "CONTEXT_REQUIRED", "Şirket, filo, gemi ve raporlama yılı context'i zorunlu");
  }
  const role = await authorize(ctx.companyId, user.uid, allowed);
  const ySnap = await yearRef(ctx).get();
  if (!ySnap.exists) throw httpError(404, "FILE_NOT_FOUND", "Raporlama yılı dosyası bulunamadı");
  return { ctx, role, yearData: ySnap.data() };
}

function tmpChunkPath(ctx, evidenceId, index) {
  return `maritime-evidence/_tmp/${ctx.companyId}/${ctx.fleetId}/${ctx.shipId}/${ctx.year}/${evidenceId}/chunk-${String(index).padStart(4, "0")}`;
}
function finalObjectPath(ctx, evidenceId, originalName) {
  return `maritime-evidence/records/${ctx.companyId}/${ctx.fleetId}/${ctx.shipId}/${ctx.year}/${evidenceId}/${safeFileName(originalName)}`;
}

async function validateLinks(ctx, yearData, metadata) {
  if ((!metadata.linkedVoyageIds.length && !metadata.linkedFuelIds.length) || !yearData.activeSyncId) {
    if ((metadata.linkedVoyageIds.length || metadata.linkedFuelIds.length) && !yearData.activeSyncId) {
      throw httpError(409, "NO_ACTIVE_SYNC", "Hesap satırlarına belge bağlamak için önce çalışma dosyası sunucuya kaydedilmeli");
    }
    return;
  }
  const [voyages, fuels] = await Promise.all([
    metadata.linkedVoyageIds.length ? yearRef(ctx).collection("voyages").where("syncId", "==", yearData.activeSyncId).get() : null,
    metadata.linkedFuelIds.length ? yearRef(ctx).collection("fuels").where("syncId", "==", yearData.activeSyncId).get() : null,
  ]);
  if (voyages) {
    const ids = new Set(voyages.docs.map((d) => String(d.data().sourceId || "")));
    const missing = metadata.linkedVoyageIds.filter((id) => !ids.has(id));
    if (missing.length) throw httpError(409, "VOYAGE_LINK_INVALID", "Belge mevcut aktif sefer kayıtlarından birine bağlanamadı", { missing });
  }
  if (fuels) {
    const ids = new Set(fuels.docs.map((d) => String(d.data().sourceId || "")));
    const missing = metadata.linkedFuelIds.filter((id) => !ids.has(id));
    if (missing.length) throw httpError(409, "FUEL_LINK_INVALID", "Belge mevcut aktif yakıt/enerji kayıtlarından birine bağlanamadı", { missing });
  }
}

async function createUpload(user, input) {
  const { ctx, role, yearData } = await resolveContext(user, input, WRITE_ROLES);
  if (yearData.status === "locked") throw httpError(423, "FILE_LOCKED", "Kilitleme sonrası yeni kanıt yüklenemez; superseding çalışma açılmalıdır");
  const metadata = validateEvidenceMetadata(input || {});
  await validateLinks(ctx, yearData, metadata);
  const evidenceId = randomId("evidence");
  const expectedChunks = Math.ceil(metadata.size / CHUNK_BYTES);
  if (expectedChunks < 1 || expectedChunks > MAX_CHUNKS) throw httpError(413, "EVIDENCE_CHUNK_LIMIT", "Belge güvenli chunk sınırını aşıyor");
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + UPLOAD_SESSION_MS).toISOString();
  const session = {
    schemaVersion: SCHEMA_VERSION,
    rulesetId: RULESET_ID,
    evidenceId,
    status: "uploading",
    ownerUid: user.uid,
    actorRole: role,
    context: ctx,
    metadata,
    expectedChunks,
    chunkBytes: CHUNK_BYTES,
    supportRevision: Number(yearData.revision || 0),
    supportDataHash: yearData.dataHash || null,
    createdAt,
    createdBy: user.uid,
    expiresAt,
  };
  await db.runTransaction(async (tx) => {
    tx.create(uploadRef(ctx, evidenceId), session);
    const auditId = randomId("audit");
    tx.create(yearRef(ctx).collection("auditEvents").doc(auditId), {
      eventId: auditId,
      action: "EVIDENCE_UPLOAD_INITIATED",
      evidenceId,
      documentType: metadata.documentType,
      originalName: metadata.originalName,
      expectedSize: metadata.size,
      actorUid: user.uid,
      actorRole: role,
      at: createdAt,
      immutable: true,
    });
  });
  return { evidenceId, context: ctx, expectedChunks, chunkBytes: CHUNK_BYTES, maxFileBytes: MAX_FILE_BYTES, expiresAt };
}

function rawChunk(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body, "binary");
  return Buffer.alloc(0);
}

async function uploadChunk(user, ctxInput, evidenceId, index, req) {
  const { ctx, role } = await resolveContext(user, ctxInput, WRITE_ROLES);
  const sessionSnap = await uploadRef(ctx, evidenceId).get();
  if (!sessionSnap.exists) throw httpError(404, "UPLOAD_NOT_FOUND", "Belge yükleme oturumu bulunamadı");
  const session = sessionSnap.data();
  if (session.ownerUid !== user.uid && !["owner", "admin", "compliance_manager"].includes(role)) throw httpError(403, "UPLOAD_OWNER_REQUIRED", "Bu yükleme oturumunu değiştirme yetkiniz yok");
  if (session.status === "finalized") return { evidenceId, index, finalized: true, idempotent: true };
  if (session.status !== "uploading") throw httpError(409, "UPLOAD_STATE_INVALID", "Belge yükleme oturumu yazılabilir durumda değil");
  if (Date.parse(session.expiresAt) < Date.now()) throw httpError(410, "UPLOAD_EXPIRED", "Belge yükleme oturumunun süresi doldu");
  if (!Number.isInteger(index) || index < 0 || index >= Number(session.expectedChunks)) throw httpError(400, "CHUNK_INDEX_INVALID", "Chunk sırası geçersiz");

  const body = rawChunk(req);
  const expected = expectedChunkSize(Number(session.metadata.size), index);
  if (expected == null || body.length !== expected) throw httpError(400, "CHUNK_SIZE_INVALID", `Chunk boyutu ${expected} byte olmalı`);
  const chunkHash = sha256(body);
  const cRef = uploadRef(ctx, evidenceId).collection("chunks").doc(String(index).padStart(4, "0"));
  const existing = await cRef.get();
  if (existing.exists) {
    const prior = existing.data();
    if (prior.sha256 === chunkHash && prior.size === body.length && prior.status === "stored") return { evidenceId, index, sha256: chunkHash, size: body.length, idempotent: true };
    throw httpError(409, "CHUNK_CONFLICT", "Aynı chunk sırası farklı içerikle daha önce kaydedilmiş");
  }

  const objectPath = tmpChunkPath(ctx, evidenceId, index);
  const at = nowIso();
  await cRef.create({ index, status: "writing", size: body.length, sha256: chunkHash, objectPath, createdAt: at, createdBy: user.uid, immutablePayload: true });
  try {
    await bucket.file(objectPath).save(body, {
      resumable: false,
      metadata: {
        contentType: "application/octet-stream",
        cacheControl: "private, max-age=0, no-store",
        metadata: { evidenceId, chunkIndex: String(index), sha256: chunkHash, ownerUid: user.uid },
      },
    });
    await cRef.set({ status: "stored", storedAt: nowIso() }, { merge: true });
  } catch (error) {
    await cRef.set({ status: "failed", failureAt: nowIso(), failureCode: safeText(error?.code || error?.message || "storage-write", 300) }, { merge: true }).catch(() => {});
    throw httpError(502, "CHUNK_STORAGE_FAILED", "Belge parçası güvenli depoya yazılamadı");
  }
  return { evidenceId, index, sha256: chunkHash, size: body.length, idempotent: false };
}

async function writeFinalObject(ctx, session, chunkDocs, finalPath) {
  const destination = bucket.file(finalPath);
  const hash = crypto.createHash("sha256");
  let total = 0;
  let firstBytes = Buffer.alloc(0);
  const stream = destination.createWriteStream({
    resumable: false,
    metadata: {
      contentType: session.metadata.contentType,
      cacheControl: "private, max-age=0, no-store",
      contentDisposition: `attachment; filename="${safeFileName(session.metadata.originalName).replace(/"/g, "")}"`,
      metadata: {
        evidenceId: session.evidenceId,
        companyId: ctx.companyId,
        fleetId: ctx.fleetId,
        shipId: ctx.shipId,
        reportingYear: String(ctx.year),
        documentType: session.metadata.documentType,
      },
    },
  });
  const streamError = new Promise((_, reject) => stream.once("error", reject));
  for (const chunk of chunkDocs) {
    const [buffer] = await bucket.file(chunk.objectPath).download();
    if (!firstBytes.length) firstBytes = buffer.subarray(0, Math.min(64, buffer.length));
    hash.update(buffer);
    total += buffer.length;
    if (!stream.write(buffer)) await once(stream, "drain");
  }
  stream.end();
  await Promise.race([once(stream, "finish"), streamError]);
  if (total !== Number(session.metadata.size)) {
    await destination.delete({ ignoreNotFound: true }).catch(() => {});
    throw httpError(409, "EVIDENCE_SIZE_MISMATCH", "Birleştirilen belge boyutu upload manifestiyle eşleşmiyor");
  }
  if (!validateMagic(session.metadata.contentType, firstBytes)) {
    await destination.delete({ ignoreNotFound: true }).catch(() => {});
    throw httpError(415, "EVIDENCE_SIGNATURE_INVALID", "Dosya imzası beyan edilen belge türüyle eşleşmiyor");
  }
  const sha256Hex = hash.digest("hex");
  const [storageMetadata] = await destination.getMetadata();
  return { sha256Hex, total, storageMetadata };
}

function publicEvidence(doc) {
  return {
    evidenceId: doc.evidenceId,
    documentType: doc.documentType,
    documentLabel: doc.documentLabel,
    legalBasis: doc.legalBasis,
    originalName: doc.originalName,
    contentType: doc.contentType,
    size: doc.size,
    documentDate: doc.documentDate,
    sourceName: doc.sourceName,
    sourceReference: doc.sourceReference,
    notes: doc.notes,
    supports: doc.supports,
    linkedVoyageIds: doc.linkedVoyageIds,
    linkedFuelIds: doc.linkedFuelIds,
    supportRevision: doc.supportRevision,
    supportDataHash: doc.supportDataHash,
    sha256: doc.sha256,
    crc32c: doc.crc32c || null,
    md5Hash: doc.md5Hash || null,
    storageGeneration: doc.storageGeneration || null,
    evidenceChainHash: doc.evidenceChainHash,
    previousEvidenceChainHash: doc.previousEvidenceChainHash || null,
    retention: doc.retention,
    finalizedAt: doc.finalizedAt,
    finalizedBy: doc.finalizedBy,
    integrityStatus: doc.integrityStatus || "verified-at-ingest",
  };
}

async function finalizeUpload(user, ctxInput, evidenceId) {
  const { ctx, role, yearData } = await resolveContext(user, ctxInput, WRITE_ROLES);
  const eRef = evidenceRef(ctx, evidenceId);
  const already = await eRef.get();
  if (already.exists) return { evidence: publicEvidence(already.data()), idempotent: true };
  const sessionSnap = await uploadRef(ctx, evidenceId).get();
  if (!sessionSnap.exists) throw httpError(404, "UPLOAD_NOT_FOUND", "Belge yükleme oturumu bulunamadı");
  const session = sessionSnap.data();
  if (session.ownerUid !== user.uid && !["owner", "admin", "compliance_manager"].includes(role)) throw httpError(403, "UPLOAD_OWNER_REQUIRED", "Bu yükleme oturumunu finalize etme yetkiniz yok");
  if (session.status !== "uploading") throw httpError(409, "UPLOAD_STATE_INVALID", "Yükleme finalize edilebilir durumda değil");
  if (Date.parse(session.expiresAt) < Date.now()) throw httpError(410, "UPLOAD_EXPIRED", "Belge yükleme oturumunun süresi doldu");

  const chunkSnap = await uploadRef(ctx, evidenceId).collection("chunks").orderBy("index", "asc").get();
  if (chunkSnap.size !== Number(session.expectedChunks)) throw httpError(409, "UPLOAD_INCOMPLETE", "Tüm belge parçaları yüklenmeden finalize edilemez");
  const chunks = chunkSnap.docs.map((d) => d.data());
  const missing = [];
  for (let i = 0; i < Number(session.expectedChunks); i += 1) {
    const chunk = chunks[i];
    if (!chunk || chunk.index !== i || chunk.status !== "stored" || chunk.size !== expectedChunkSize(Number(session.metadata.size), i)) missing.push(String(i));
  }
  if (missing.length) throw httpError(409, "UPLOAD_INCOMPLETE", "Eksik veya doğrulanmamış belge parçaları var", { missing });

  const finalPath = finalObjectPath(ctx, evidenceId, session.metadata.originalName);
  const assembled = await writeFinalObject(ctx, session, chunks, finalPath);
  const finalizedAt = nowIso();
  const retention = { ...buildRetention(ctx.year), legalHoldAtFinalization: yearData.legalHold === true };
  let finalizedRecord = null;

  await db.runTransaction(async (tx) => {
    const liveYearSnap = await tx.get(yearRef(ctx));
    const liveYear = liveYearSnap.data() || {};
    if (liveYear.status === "locked") throw httpError(423, "FILE_LOCKED", "Dosya finalize sırasında kilitlendi; kanıt zincirine eklenmedi");
    const existing = await tx.get(eRef);
    if (existing.exists) { finalizedRecord = existing.data(); return; }
    const previousEvidenceChainHash = liveYear.evidenceChainHead || null;
    const baseRecord = {
      schemaVersion: SCHEMA_VERSION,
      rulesetId: RULESET_ID,
      evidenceId,
      immutable: true,
      companyId: ctx.companyId,
      fleetId: ctx.fleetId,
      shipId: ctx.shipId,
      reportingYear: ctx.year,
      documentType: session.metadata.documentType,
      documentLabel: session.metadata.documentLabel,
      legalBasis: session.metadata.legalBasis,
      criticality: session.metadata.criticality,
      originalName: session.metadata.originalName,
      contentType: session.metadata.contentType,
      size: assembled.total,
      documentDate: session.metadata.documentDate,
      sourceName: session.metadata.sourceName,
      sourceReference: session.metadata.sourceReference,
      notes: session.metadata.notes,
      supports: session.metadata.supports,
      linkedVoyageIds: session.metadata.linkedVoyageIds,
      linkedFuelIds: session.metadata.linkedFuelIds,
      supportRevision: session.supportRevision,
      supportDataHash: session.supportDataHash || null,
      finalizedAgainstRevision: Number(liveYear.revision || 0),
      finalizedAgainstDataHash: liveYear.dataHash || null,
      sha256: assembled.sha256Hex,
      crc32c: assembled.storageMetadata.crc32c || null,
      md5Hash: assembled.storageMetadata.md5Hash || null,
      storageGeneration: assembled.storageMetadata.generation || null,
      storageMetageneration: assembled.storageMetadata.metageneration || null,
      objectPath: finalPath,
      storageBucket: STORAGE_BUCKET,
      contentValidation: "server-sha256+chunk-sha256+mime-extension+magic-signature",
      integrityStatus: "verified-at-ingest",
      retention,
      previousEvidenceChainHash,
      finalizedAt,
      finalizedBy: user.uid,
    };
    const evidenceChainHash = buildEvidenceChainHash(previousEvidenceChainHash, baseRecord);
    finalizedRecord = { ...baseRecord, evidenceChainHash };
    const auditId = randomId("audit");
    tx.create(eRef, finalizedRecord);
    tx.set(uploadRef(ctx, evidenceId), { status: "finalized", finalizedAt, finalSha256: assembled.sha256Hex, finalObjectPath: finalPath }, { merge: true });
    tx.set(yearRef(ctx), {
      evidenceChainHead: evidenceChainHash,
      evidenceDocumentCount: Number(liveYear.evidenceDocumentCount || 0) + 1,
      evidenceUpdatedAt: finalizedAt,
      evidenceUpdatedBy: user.uid,
    }, { merge: true });
    tx.create(yearRef(ctx).collection("auditEvents").doc(auditId), {
      eventId: auditId,
      action: "EVIDENCE_FINALIZED",
      evidenceId,
      documentType: session.metadata.documentType,
      sha256: assembled.sha256Hex,
      size: assembled.total,
      previousEvidenceChainHash,
      evidenceChainHash,
      supportRevision: session.supportRevision,
      supportDataHash: session.supportDataHash || null,
      actorUid: user.uid,
      actorRole: role,
      at: finalizedAt,
      immutable: true,
    });
  });

  for (const chunk of chunks) {
    bucket.file(chunk.objectPath).delete({ ignoreNotFound: true }).catch(() => {});
  }
  return { evidence: publicEvidence(finalizedRecord), idempotent: false };
}

async function evidenceManifest(ctx) {
  const [docsSnap, ySnap] = await Promise.all([
    yearRef(ctx).collection("evidenceDocuments").orderBy("finalizedAt", "asc").get(),
    yearRef(ctx).get(),
  ]);
  const docs = docsSnap.docs.map((d) => d.data());
  const coverage = {};
  for (const row of EVIDENCE_REGISTRY) coverage[row.key] = 0;
  for (const doc of docs) coverage[doc.documentType] = Number(coverage[doc.documentType] || 0) + 1;
  const manifestHash = canonicalHash(docs.map((doc) => ({
    evidenceId: doc.evidenceId,
    documentType: doc.documentType,
    sha256: doc.sha256,
    evidenceChainHash: doc.evidenceChainHash,
    supports: doc.supports,
    linkedVoyageIds: doc.linkedVoyageIds,
    linkedFuelIds: doc.linkedFuelIds,
  })));
  return { docs, coverage, manifestHash, chainHead: ySnap.data()?.evidenceChainHead || null };
}

async function listEvidence(user, input) {
  const { ctx } = await resolveContext(user, input, READ_ROLES);
  const manifest = await evidenceManifest(ctx);
  return {
    context: ctx,
    documents: manifest.docs.slice().reverse().map(publicEvidence),
    coverage: manifest.coverage,
    manifestHash: manifest.manifestHash,
    chainHead: manifest.chainHead,
    registry: EVIDENCE_REGISTRY,
  };
}

async function verifyIntegrity(user, input, evidenceId) {
  const { ctx, role } = await resolveContext(user, input, READ_ROLES);
  const snap = await evidenceRef(ctx, evidenceId).get();
  if (!snap.exists) throw httpError(404, "EVIDENCE_NOT_FOUND", "Kanıt belgesi bulunamadı");
  const doc = snap.data();
  const hash = crypto.createHash("sha256");
  let total = 0;
  const stream = bucket.file(doc.objectPath).createReadStream();
  stream.on("data", (chunk) => { hash.update(chunk); total += chunk.length; });
  await once(stream, "end");
  const currentSha256 = hash.digest("hex");
  const match = currentSha256 === doc.sha256 && total === Number(doc.size);
  const at = nowIso();
  const auditId = randomId("audit");
  await yearRef(ctx).collection("auditEvents").doc(auditId).create({
    eventId: auditId,
    action: match ? "EVIDENCE_INTEGRITY_VERIFIED" : "EVIDENCE_INTEGRITY_MISMATCH",
    evidenceId,
    expectedSha256: doc.sha256,
    currentSha256,
    expectedSize: doc.size,
    currentSize: total,
    actorUid: user.uid,
    actorRole: role,
    at,
    immutable: true,
  });
  if (!match) throw httpError(409, "EVIDENCE_INTEGRITY_MISMATCH", "Depolanan belge checksum/hash zinciriyle eşleşmiyor");
  return { evidenceId, sha256: currentSha256, size: total, verifiedAt: at, match: true };
}

async function downloadEvidence(user, input, evidenceId, res) {
  const { ctx } = await resolveContext(user, input, READ_ROLES);
  const snap = await evidenceRef(ctx, evidenceId).get();
  if (!snap.exists) throw httpError(404, "EVIDENCE_NOT_FOUND", "Kanıt belgesi bulunamadı");
  const doc = snap.data();
  res.status(200);
  res.set("Content-Type", doc.contentType || "application/octet-stream");
  res.set("Content-Length", String(doc.size || ""));
  res.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(doc.originalName || "evidence")}`);
  res.set("Cache-Control", "private, no-store, max-age=0");
  const stream = bucket.file(doc.objectPath).createReadStream();
  stream.on("error", () => { if (!res.headersSent) res.status(502); res.end(); });
  stream.pipe(res);
}

exports.maritimeEvidenceApi = onRequest({
  region: "europe-west3",
  cors: true,
  memory: "1GiB",
  timeoutSeconds: 300,
  maxInstances: 20,
}, async (req, res) => {
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  try {
    const user = await requireUser(req);
    const pathName = String(req.path || "").replace(/^\/api\/maritime\/evidence/, "").replace(/\/+$/, "") || "/";

    if (pathName === "/health" && req.method === "GET") {
      res.json({ ok: true, service: "maritime-evidence-v3", schemaVersion: SCHEMA_VERSION, rulesetId: RULESET_ID, chunkBytes: CHUNK_BYTES, maxFileBytes: MAX_FILE_BYTES });
      return;
    }
    if (pathName === "/documents" && req.method === "GET") {
      res.json({ ok: true, ...(await listEvidence(user, req.query || {})) });
      return;
    }
    if (pathName === "/uploads" && req.method === "POST") {
      res.status(201).json({ ok: true, ...(await createUpload(user, req.body || {})) });
      return;
    }

    const chunkMatch = /^\/uploads\/([^/]+)\/chunks\/(\d+)$/.exec(pathName);
    if (chunkMatch && req.method === "PUT") {
      const evidenceId = safeId(chunkMatch[1], 160);
      const index = Number(chunkMatch[2]);
      const context = {
        companyId: req.get("x-maritime-company-id"),
        fleetId: req.get("x-maritime-fleet-id"),
        shipId: req.get("x-maritime-ship-id"),
        year: req.get("x-maritime-year"),
      };
      res.json({ ok: true, ...(await uploadChunk(user, context, evidenceId, index, req)) });
      return;
    }

    const finalizeMatch = /^\/uploads\/([^/]+)\/finalize$/.exec(pathName);
    if (finalizeMatch && req.method === "POST") {
      res.json({ ok: true, ...(await finalizeUpload(user, req.body || {}, safeId(finalizeMatch[1], 160))) });
      return;
    }

    const verifyMatch = /^\/documents\/([^/]+)\/verify$/.exec(pathName);
    if (verifyMatch && req.method === "POST") {
      res.json({ ok: true, ...(await verifyIntegrity(user, req.body || {}, safeId(verifyMatch[1], 160))) });
      return;
    }

    const downloadMatch = /^\/documents\/([^/]+)\/content$/.exec(pathName);
    if (downloadMatch && req.method === "GET") {
      await downloadEvidence(user, req.query || {}, safeId(downloadMatch[1], 160), res);
      return;
    }

    throw httpError(404, "NOT_FOUND", "Maritime evidence API endpoint bulunamadı");
  } catch (error) {
    console.error("maritimeEvidenceApi", error);
    if (!res.headersSent) fail(res, error);
    else res.end();
  }
});

module.exports._test = {
  STORAGE_BUCKET,
  RULESET_ID,
  SCHEMA_VERSION,
  publicEvidence,
  tmpChunkPath,
  finalObjectPath,
};

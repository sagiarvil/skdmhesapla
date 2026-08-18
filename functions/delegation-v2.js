/**
 * delegation-v2 — yetki linki sertleştirme.
 * Token: 32 rastgele bayt (base64url). DB'de yalnız SHA-256 digest saklanır.
 * TTL, tek kullanım, iptal — hepsi doküman durumunda.
 */
const crypto = require("node:crypto");

const SHARE_TTL_MS = 30 * 24 * 3600 * 1000; // 30 gün
const MAX_SUBMITTED_VALUE_LENGTH = 20000;

function newShareToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function tokenDigest(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function buildShareDoc({ token, sessionId, sectorSlug, fieldId, fieldTitle, why, howToEnter, required, inputType }) {
  const now = Date.now();
  return {
    tokenDigest: tokenDigest(token),
    sessionId,
    sectorSlug: sectorSlug || null,
    fieldId,
    fieldTitle: String(fieldTitle || fieldId).slice(0, 160),
    why: String(why || "").slice(0, 500),
    howToEnter: String(howToEnter || "").slice(0, 500),
    required: required === "zorunlu" ? "zorunlu" : "opsiyonel",
    inputType: String(inputType || "text").slice(0, 16),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SHARE_TTL_MS).toISOString(),
    used: false,
    revokedAt: null,
    usedAt: null,
    submittedValue: null,
  };
}

/** Gönderim doğrulaması — tek işlem içinde durum kontrolü. */
function validateSubmission(share, value) {
  if (!share) return { ok: false, reason: "link bulunamadı" };
  if (share.used) return { ok: false, reason: "bu link zaten kullanıldı" };
  if (share.revokedAt) return { ok: false, reason: "bu link iptal edildi" };
  if (share.expiresAt && share.expiresAt < new Date().toISOString()) {
    return { ok: false, reason: "bu linkin süresi doldu" };
  }
  if (share.required === "zorunlu" && !String(value || "").trim()) {
    return { ok: false, reason: "bu alan zorunlu — boş gönderilemez" };
  }
  if (String(value || "").length > MAX_SUBMITTED_VALUE_LENGTH) {
    return { ok: false, reason: "gönderim değeri çok uzun" };
  }
  return { ok: true };
}

module.exports = {
  newShareToken,
  tokenDigest,
  buildShareDoc,
  validateSubmission,
  SHARE_TTL_MS,
  MAX_SUBMITTED_VALUE_LENGTH,
};

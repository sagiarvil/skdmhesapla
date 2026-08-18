/**
 * security-v2 — imza doğrulama + Firebase ID token yetkilendirme.
 * Raw-body HMAC, zaman toleransı, timing-safe karşılaştırma.
 */
const { getAuth } = require("firebase-admin/auth");
const crypto = require("node:crypto");

const SIGNATURE_SKEW_MS = 5 * 60 * 1000;

/** `Paddle-Signature: ts=...;h1=...` başlığını ayrıştırır. */
function parsePaddleSignature(header) {
  const parts = {};
  for (const piece of String(header || "").split(";")) {
    const idx = piece.indexOf("=");
    if (idx < 1) continue;
    const key = piece.slice(0, idx).trim();
    const value = piece.slice(idx + 1).trim();
    if (key && value) parts[key] = value;
  }
  const ts = Number(parts.ts);
  const h1 = parts.h1;
  if (!Number.isFinite(ts) || !h1) return null;
  return { ts, h1 };
}

/** Raw body + timestamp + HMAC doğrulaması. JSON'a yeniden serileştirme YOK. */
function verifyPaddleSignature(rawBody, signatureHeader, secret) {
  if (!rawBody || !signatureHeader || !secret) return false;
  const parsed = parsePaddleSignature(signatureHeader);
  if (!parsed) return false;
  const skew = Math.abs(Date.now() - parsed.ts * 1000);
  if (skew > SIGNATURE_SKEW_MS) return false;
  const computed = crypto.createHmac("sha256", secret).update(`${parsed.ts}:${rawBody}`).digest("hex");
  const a = Buffer.from(parsed.h1, "hex");
  const b = Buffer.from(computed, "hex");
  if (a.length === 0 || a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Authorization: Bearer <ID token> → uid.
 * checkRevoked=true. Body alanı asla uid kaynağı değildir.
 */
async function requireUser(req) {
  const header = String(req.get("authorization") || "");
  const m = /^Bearer\s+(.+)$/i.exec(header);
  if (!m) {
    const err = new Error("Kimlik doğrulaması gerekli");
    err.http = 401;
    throw err;
  }
  try {
    const decoded = await getAuth().verifyIdToken(m[1].trim(), true);
    return { uid: decoded.uid };
  } catch {
    const err = new Error("Kimlik doğrulaması geçersiz");
    err.http = 401;
    throw err;
  }
}

module.exports = {
  verifyPaddleSignature,
  requireUser,
  SIGNATURE_SKEW_MS,
};

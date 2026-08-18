/**
 * security-v2 — imza doğrulama testleri.
 */
import assert from "node:assert";
import crypto from "node:crypto";
import { verifyPaddleSignature } from "../../functions/security-v2.js";

const SECRET = "test-secret";

function sign(rawBody, secret = SECRET, ts = Math.floor(Date.now() / 1000)) {
  const h1 = crypto.createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex");
  return `ts=${ts};h1=${h1}`;
}

const raw = JSON.stringify({ event_type: "transaction.completed", data: { id: "txn-1" } });

assert.strictEqual(verifyPaddleSignature(raw, sign(raw), SECRET), true, "geçerli imza kabul");
assert.strictEqual(verifyPaddleSignature(raw + "x", sign(raw), SECRET), false, "gövde değiştiyse red");
assert.strictEqual(verifyPaddleSignature(raw, sign(raw, "wrong-secret"), SECRET), false, "yanlış secret red");
const stale = sign(raw, SECRET, Math.floor(Date.now() / 1000) - 600);
assert.strictEqual(verifyPaddleSignature(raw, stale, SECRET), false, "eski timestamp red");
assert.strictEqual(verifyPaddleSignature(raw, "", SECRET), false, "boş imza red");
assert.strictEqual(verifyPaddleSignature("", sign(raw), SECRET), false, "boş gövde red");
assert.strictEqual(verifyPaddleSignature(raw, sign(raw), ""), false, "boş secret red");

console.log("security-v2.spec: PASS");

/**
 * seal-reservation-v2 — deterministik paket kimliği + yetki linki sertleştirme testleri.
 */
import assert from "node:assert";
import { computePackageId, computeSnapshotHash, recomputePcf } from "../../functions/core-runtime-v2.js";
import {
  newShareToken,
  tokenDigest,
  buildShareDoc,
  validateSubmission,
} from "../../functions/delegation-v2.js";

const snapshot = { sessionId: "ses-1", reportId: "PCF-1", productName: "Ürün" };

const id1 = computePackageId("pcf", "ses-1", "txn-1", computeSnapshotHash(snapshot));
const id2 = computePackageId("pcf", "ses-1", "txn-1", computeSnapshotHash(snapshot));
const id3 = computePackageId("pcf", "ses-1", "txn-2", computeSnapshotHash(snapshot));
assert.strictEqual(id1, id2, "aynı girdi aynı paket kimliği");
assert.notStrictEqual(id1, id3, "farklı işlem farklı paket kimliği");
assert.ok(id1.startsWith("PCF-SEAL-"), "PCF öneki");

const hash1 = computeSnapshotHash(snapshot);
const hash2 = computeSnapshotHash(snapshot);
assert.strictEqual(hash1, hash2, "snapshot hash deterministik");
assert.ok(hash1.startsWith("sha256:"), "snapshot hash sha256 önekli");

// Delegation token: 32 bayt, düz metin saklanmaz, digest saklanır.
const token = newShareToken();
const digest = tokenDigest(token);
assert.strictEqual(digest, tokenDigest(token), "digest deterministik");
assert.strictEqual(digest.length, 64, "sha256 hex uzunluğu");
assert.notStrictEqual(digest, token, "raw token DB'ye yazılmaz");
assert.ok(Buffer.from(token, "base64url").length >= 32, "token en az 32 bayt");

const share = buildShareDoc({
  token,
  sessionId: "ses-1",
  sectorSlug: "cimento",
  fieldId: "F1",
  fieldTitle: "Üretim Kaydı",
  why: "Denetim için",
  howToEnter: "Faturadan alın",
  required: "zorunlu",
  inputType: "text",
});
assert.ok(share.expiresAt > new Date().toISOString(), "TTL gelecekte");
assert.strictEqual(share.tokenDigest, digest, "doküman digest taşır");
assert.strictEqual(validateSubmission(share, "12.5").ok, true, "geçerli gönderim kabul");
assert.strictEqual(validateSubmission({ ...share, used: true }, "12.5").ok, false, "kullanılmış link red");
assert.strictEqual(validateSubmission({ ...share, revokedAt: new Date().toISOString() }, "12.5").ok, false, "iptal link red");
assert.strictEqual(
  validateSubmission({ ...share, expiresAt: new Date(Date.now() - 1000).toISOString() }, "12.5").ok,
  false,
  "süresi dolmuş link red",
);
assert.strictEqual(validateSubmission(share, "").ok, false, "zorunlu alan boş red");

// PCF yeniden hesaplama — saf fonksiyon, istemci değerinden bağımsız.
const pcfInput = {
  reportId: "PCF-R",
  createdAt: "2026-08-18T00:00:00.000Z",
  companyName: "A.Ş.",
  facilityName: "Tesis",
  country: "TR",
  productName: "Ürün",
  functionalUnit: "1 adet",
  reportingPeriodStart: "2026-01-01",
  reportingPeriodEnd: "2026-12-31",
  productionQuantityForPeriod: 100,
  allocationShare: 1,
  allocationMethod: "Kütle bazlı",
  materials: [],
  packaging: [],
  electricity: { consumptionKwhForPeriod: 5000, connectionType: "distribution", geography: "TR" },
  fuels: [],
  evidence: { productionRecord: true, electricityInvoice: true, fuelInvoice: false, materialEvidenceCount: 0 },
};
const r1 = recomputePcf(pcfInput);
const r2 = recomputePcf(pcfInput);
assert.strictEqual(r1.status, r2.status, "yeniden hesaplama deterministik");
assert.strictEqual(r1.totalKgCo2ePerFunctionalUnit, r2.totalKgCo2ePerFunctionalUnit, "sonuç deterministik");

console.log("seal-reservation-v2.spec: PASS");

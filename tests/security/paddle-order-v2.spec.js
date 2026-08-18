/**
 * paddle-order-v2 — tamamlanmış işlem doğrulama testleri.
 */
import assert from "node:assert";
import { validateCompletedTransaction } from "../../functions/paddle-order-v2.js";

const CONFIG = { priceId: "pri_test_9900", allowedPackageTypes: ["PCF_SEAL_PACKAGE_9900"] };

function completed(overrides = {}) {
  return {
    status: "completed",
    id: "txn-1",
    currency_code: "TRY",
    items: [{ price: { id: "pri_test_9900" }, quantity: 1 }],
    details: { totals: { grand_total: 990000 } },
    custom_data: { sessionId: "ses-1", workflowType: "pcf", packageType: "PCF_SEAL_PACKAGE_9900" },
    ...overrides,
  };
}

const ok = validateCompletedTransaction(completed(), CONFIG);
assert.strictEqual(ok.ok, true, "geçerli işlem kabul");
assert.strictEqual(ok.amountTry, 9900, "TRY minor→major dönüşüm");
assert.strictEqual(ok.sessionId, "ses-1", "session bağlamı");

assert.strictEqual(validateCompletedTransaction(completed({ status: "paid" }), CONFIG).ok, false, "paid değil completed red");
assert.strictEqual(validateCompletedTransaction(completed({ id: "" }), CONFIG).ok, false, "id yok red");
assert.strictEqual(
  validateCompletedTransaction(completed({ items: [{ price: { id: "pri_test_9900" }, quantity: 1 }, { price: { id: "pri_test_x" }, quantity: 1 }] }), CONFIG).ok,
  false,
  "ekstra ürün satırı red",
);
assert.strictEqual(
  validateCompletedTransaction(completed({ items: [{ price: { id: "pri_test_9900" }, quantity: 2 }] }), CONFIG).ok,
  false,
  "quantity 2 red",
);
assert.strictEqual(
  validateCompletedTransaction(completed({ items: [{ price: { id: "pri_test_OTHER" }, quantity: 1 }] }), CONFIG).ok,
  false,
  "yanlış fiyat red",
);
assert.strictEqual(
  validateCompletedTransaction(completed({ currency_code: "USD" }), CONFIG).ok,
  false,
  "yanlış para birimi red",
);
assert.strictEqual(
  validateCompletedTransaction(completed({ details: { totals: { grand_total: 0 } } }), CONFIG).ok,
  false,
  "sıfır tutar red",
);
assert.strictEqual(
  validateCompletedTransaction(completed({ custom_data: { sessionId: "" } }), CONFIG).ok,
  false,
  "session yok red",
);
assert.strictEqual(
  validateCompletedTransaction(completed({ custom_data: { sessionId: "ses-1", workflowType: "pcf", packageType: "CBAM_SEAL_PACKAGE_9900" } }), CONFIG).ok,
  false,
  "izin verilmeyen paket türü red",
);

// priceId konfigüre edilmemişse fiyat kimliği eşleşmesi atlanır, diğer kapılar açık kalır.
assert.strictEqual(
  validateCompletedTransaction(completed({ items: [{ price: { id: "pri_anything" }, quantity: 1 }] }), { allowedPackageTypes: ["PCF_SEAL_PACKAGE_9900"] }).ok,
  true,
  "priceId yoksa fiyat eşleşmesi atlanır",
);

console.log("paddle-order-v2.spec: PASS");

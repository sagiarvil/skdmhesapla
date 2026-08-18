import { evaluatePaymentStatus, evaluateSealEntitlement } from "../../src/lib/payment/seal-entitlement";
import fs from "node:fs";
import path from "node:path";

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

const completed = {
  paymentStatus: "completed",
  sessionId: "ses-1",
  packageType: "PCF_SEAL_PACKAGE_9900",
  workflowType: "pcf",
  currency: "TRY",
};

assert(evaluatePaymentStatus(null, "ses-1").status === "pending", "webhook yokken pending");
assert(evaluatePaymentStatus(completed, "ses-1").status === "completed", "completed + session");
assert(
  evaluatePaymentStatus(completed, "ses-1").status === "completed" &&
    evaluatePaymentStatus(completed, "ses-1").status === "completed",
  "entitlement pcf",
);
const paid = evaluatePaymentStatus(completed, "ses-1");
assert(paid.status === "completed" && paid.entitlement === "pcf_seal", "pcf_seal");

assert(evaluatePaymentStatus(completed, "other").status === "rejected", "başka session rejected");
assert(
  evaluatePaymentStatus({ ...completed, paymentStatus: "refunded" }, "ses-1").status === "rejected",
  "refunded rejected",
);

const pcfReq = {
  sessionId: "ses-1",
  paddleTransactionId: "txn-1",
  packageType: "PCF_SEAL_PACKAGE_9900",
  workflowType: "pcf" as const,
  packageId: "PCF-SEAL-1",
  resultStatus: "estimated",
};

assert(evaluateSealEntitlement(null, pcfReq).ok === false, "ödeme yok 403");
assert(evaluateSealEntitlement({ ...completed, paymentStatus: "pending" }, pcfReq).ok === false, "pending 403");
assert(evaluateSealEntitlement({ ...completed, paymentStatus: "refunded" }, pcfReq).ok === false, "refunded 403");
assert(evaluateSealEntitlement(completed, { ...pcfReq, sessionId: "other" }).ok === false, "session mismatch");
assert(
  evaluateSealEntitlement(completed, { ...pcfReq, packageType: "CBAM_SEAL_PACKAGE_9900", workflowType: "cbam" }).ok ===
    false,
  "yanlış packageType",
);
assert(evaluateSealEntitlement(completed, { ...pcfReq, resultStatus: "blocked" }).ok === false, "blocked PCF 403");
assert(evaluateSealEntitlement(completed, pcfReq).ok === true, "estimated PCF mühürlenebilir");
assert(
  evaluateSealEntitlement(completed, { ...pcfReq, resultStatus: "buyer_ready" }).ok === true,
  "buyer_ready PCF mühürlenebilir",
);
assert(
  evaluateSealEntitlement({ ...completed, consumedByPackageId: "OTHER" }, pcfReq).ok === false,
  "transaction başka paket",
);
assert(
  evaluateSealEntitlement({ ...completed, consumedByPackageId: "PCF-SEAL-1" }, pcfReq).ok === true,
  "aynı paket idempotent",
);

const cbamOrder = {
  paymentStatus: "completed",
  sessionId: "ses-a",
  packageType: "SEAL_PACKAGE_9900",
  workflowType: "cbam",
  currency: "TRY",
};
const cbamReq = {
  sessionId: "ses-a",
  paddleTransactionId: "txn-a",
  packageType: "CBAM_SEAL_PACKAGE_9900",
  workflowType: "cbam" as const,
  packageId: "SEAL-1",
  readinessScore: 100,
};
assert(evaluateSealEntitlement(cbamOrder, cbamReq).ok === true, "legacy SEAL_PACKAGE_9900 = CBAM");
assert(evaluateSealEntitlement(cbamOrder, { ...cbamReq, readinessScore: 80 }).ok === false, "CBAM skor 100 şart");

const wizard = fs.readFileSync(path.join(process.cwd(), "src/components/pcf/PcfWizard.tsx"), "utf8");
assert(!wizard.includes("PDF raporu oluştur"), "pre-payment PDF CTA yok");
assert(!wizard.includes("pcfReportPdfBytes"), "PcfWizard doğrudan PDF indirmez");
assert(wizard.includes("Karbon Raporunu Mühürle"), "mühür CTA var");
assert(wizard.includes('data-testid="pcf-seal-cta"'), "seal CTA testid");

const fn = fs.readFileSync(path.join(process.cwd(), "functions/index.js"), "utf8");
assert(fn.includes("paddleTransactionId"), "seal API paddleTransactionId ister");
assert(fn.includes("evaluateSealEntitlement"), "seal API entitlement kullanır");
assert(fn.includes("/orders/status"), "payment status endpoint");
assert(fn.includes("pcf_packages"), "PCF paket koleksiyonu");
assert(fn.includes("defineSecret(\"PADDLE_PRICE_ID_9900\")"), "PADDLE_PRICE_ID_9900 secret tanımlı");
assert(fn.includes("paddlePriceId9900.value()"), "webhook secret değerinden fiyat doğrular");
assert(!fn.includes("body.masterHash"), "seal API istemci hash kabul etmez");
assert(!fn.includes("body.manifesto"), "seal API istemci manifesto kabul etmez");
assert(!fn.includes("body.files"), "seal API istemci dosya listesi kabul etmez");

console.log("seal-entitlement: PASS");

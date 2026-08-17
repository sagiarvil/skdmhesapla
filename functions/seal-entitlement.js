function normalizePackageType(raw) {
  const t = String(raw || "").trim();
  if (t === "PCF_SEAL_PACKAGE_9900") return "PCF_SEAL_PACKAGE_9900";
  if (t === "CBAM_SEAL_PACKAGE_9900" || t === "SEAL_PACKAGE_9900") return "CBAM_SEAL_PACKAGE_9900";
  return null;
}

function evaluatePaymentStatus(order, sessionId) {
  if (!order) return { status: "pending" };
  if (order.paymentStatus === "refunded") {
    return { status: "rejected", reason: "Ödeme iade edilmiş" };
  }
  if (order.paymentStatus !== "completed") return { status: "pending" };
  if (String(order.sessionId || "") !== sessionId) {
    return { status: "rejected", reason: "Sipariş çalışma ile eşleşmiyor" };
  }
  const pkg = normalizePackageType(order.packageType);
  if (!pkg) return { status: "rejected", reason: "Paket türü eşleşmiyor" };
  return {
    status: "completed",
    entitlement: pkg === "PCF_SEAL_PACKAGE_9900" ? "pcf_seal" : "cbam_seal",
  };
}

function evaluateSealEntitlement(order, req) {
  if (!String(req.paddleTransactionId || "").trim() || !String(req.sessionId || "").trim() || !String(req.packageId || "").trim()) {
    return { ok: false, http: 400, reason: "paddleTransactionId, sessionId, packageId zorunlu" };
  }
  if (!order) return { ok: false, http: 403, reason: "Ödeme kaydı doğrulanamadı" };
  if (order.paymentStatus === "refunded") {
    return { ok: false, http: 403, reason: "Ödeme iade edilmiş" };
  }
  if (order.paymentStatus !== "completed") {
    return { ok: false, http: 403, reason: "Ödeme tamamlanmadı" };
  }
  if (String(order.sessionId || "") !== req.sessionId) {
    return { ok: false, http: 403, reason: "Sipariş çalışma ile eşleşmiyor" };
  }
  const orderType = normalizePackageType(order.packageType);
  const reqType = normalizePackageType(req.packageType);
  if (!orderType || !reqType || orderType !== reqType) {
    return { ok: false, http: 403, reason: "Paket türü eşleşmiyor" };
  }
  const expectedWorkflow = orderType === "PCF_SEAL_PACKAGE_9900" ? "pcf" : "cbam";
  if (req.workflowType !== expectedWorkflow) {
    return { ok: false, http: 403, reason: "Paket türü eşleşmiyor" };
  }
  const orderWorkflow = String(order.workflowType || expectedWorkflow);
  if (orderWorkflow && orderWorkflow !== expectedWorkflow) {
    return { ok: false, http: 403, reason: "Paket türü eşleşmiyor" };
  }
  if (order.currency && order.currency !== "TRY") {
    return { ok: false, http: 403, reason: "Para birimi eşleşmiyor" };
  }
  if (req.workflowType === "pcf") {
    if (req.resultStatus === "blocked" || !req.resultStatus) {
      return { ok: false, http: 403, reason: "PCF sonucu mühürlemeye uygun değil" };
    }
    if (req.resultStatus !== "estimated" && req.resultStatus !== "buyer_ready") {
      return { ok: false, http: 403, reason: "PCF sonucu mühürlemeye uygun değil" };
    }
  }
  if (req.workflowType === "cbam" && Number(req.readinessScore) !== 100) {
    return { ok: false, http: 403, reason: "Hazırlık skoru %100 olmadan mühür kaydı açılamaz" };
  }
  if (order.consumedByPackageId && order.consumedByPackageId !== req.packageId) {
    return { ok: false, http: 403, reason: "Bu ödeme başka bir paket için kullanılmış" };
  }
  if (order.consumedPackageType && normalizePackageType(order.consumedPackageType) !== reqType) {
    return { ok: false, http: 403, reason: "Bu ödeme başka bir paket için kullanılmış" };
  }
  return {
    ok: true,
    entitlement: expectedWorkflow === "pcf" ? "pcf_seal" : "cbam_seal",
    normalizedPackageType: reqType,
  };
}

module.exports = { normalizePackageType, evaluatePaymentStatus, evaluateSealEntitlement };

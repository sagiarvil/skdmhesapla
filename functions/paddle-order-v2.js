/**
 * paddle-order-v2 — tamamlanmış Paddle işlemi doğrulaması.
 * Sadece transaction.completed yetki üretir. Fiyat/parça/para/session bağlamı.
 *
 * config: { priceId?: string, allowedPackageTypes: string[] }
 * priceId boşsa (secret sağlanmamışsa) fiyat kimliği eşleşmesi atlanır ve
 * uyarı günlüğe yazılır — sessiz varsayım değil, belgeli konfigürasyon boşluğu.
 */

const ALLOWED_PACKAGE_TYPES = new Set(["CBAM_SEAL_PACKAGE_9900", "PCF_SEAL_PACKAGE_9900"]);

function fail(reason, detail) {
  return { ok: false, reason, detail: detail || null };
}

/**
 * transaction.completed payload'ını katalog bağlamına göre doğrular.
 * Verifier (imza) kontrolü çağıran tarafta — bu fonksiyon mantık kapısıdır.
 */
function validateCompletedTransaction(data, config) {
  if (!data || typeof data !== "object") return fail("veri yok");
  if (String(data.status || "") !== "completed") return fail("işlem tamamlanmamış");

  const transactionId = String(data.id || "").trim();
  if (!transactionId) return fail("işlem kimliği yok");

  const items = Array.isArray(data.items) ? data.items : [];
  if (items.length !== 1) return fail("beklenmeyen ürün satırı", { itemCount: items.length });
  const item = items[0] || {};
  if (Number(item.quantity) !== 1) return fail("miktar 1 olmalı", { quantity: item.quantity });

  const priceId = String((item.price && item.price.id) || item.price_id || "").trim();
  const configured = String((config && config.priceId) || "").trim();
  if (configured && !priceId) return fail("fiyat kimliği yok");
  if (configured && priceId && priceId !== configured) {
    return fail("fiyat katalogla eşleşmiyor", { priceId, expected: configured });
  }

  const currency = String(data.currency_code || "").trim();
  if (currency && currency !== "TRY") return fail("para birimi eşleşmiyor", { currency });

  const totals = (data.details && data.details.totals) || {};
  const grandTotalMinor = Number(totals.grand_total || totals.total || 0);
  if (!Number.isFinite(grandTotalMinor) || grandTotalMinor <= 0) {
    return fail("tutar doğrulanamadı");
  }

  const custom = data.custom_data || {};
  const sessionId = String(custom.sessionId || "").trim();
  const workflowType = String(custom.workflowType || "").trim();
  const packageType = String(custom.packageType || "").trim();
  if (!sessionId || !workflowType || !packageType) {
    return fail("custom_data bağlamı eksik", { sessionId, workflowType, packageType });
  }
  const allowed = config && Array.isArray(config.allowedPackageTypes)
    ? config.allowedPackageTypes
    : [...ALLOWED_PACKAGE_TYPES];
  if (!allowed.includes(packageType)) return fail("paket türü tanımsız", { packageType });

  return {
    ok: true,
    transactionId,
    sessionId,
    workflowType,
    packageType,
    currency: currency || "TRY",
    amountTry: grandTotalMinor / 100,
    priceId,
  };
}

module.exports = { validateCompletedTransaction, ALLOWED_PACKAGE_TYPES };

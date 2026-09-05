#!/usr/bin/env node

/**
 * Idempotent Paddle catalog bootstrap for the maritime dossier.
 * Requires a Paddle API key with product/price/notification-setting read+write permissions.
 * Never writes API keys or webhook secrets to the repository.
 */

const SKU = "MARITIME_DOSSIER_1Y_399_USD";
const PRODUCT_NAME = "SKDMhesapla Maritime Carbon Compliance Preparation File";
const PRODUCT_DESCRIPTION = "One ship, one reporting year, one immutable maritime carbon compliance preparation dossier for EU MRV, EU ETS and FuelEU Maritime. Preparation output only; accredited verification and official regulated submissions remain external.";
const PRICE_NAME = "1 ship · 1 reporting year";
const PRICE_DESCRIPTION = `${SKU} · one-time 399 USD`;
const WEBHOOK_URL = "https://skdmhesapla.com/api/maritime-commerce/webhook";
const WEBHOOK_DESCRIPTION = `SKDMhesapla Maritime · ${SKU}`;
const AMOUNT = "39900";
const CURRENCY = "USD";
const EXPECTED_PRICE_ID = "pri_01m1rdd20amd3730r561vckwm3";

const args = new Set(process.argv.slice(2));
const environment = process.env.PADDLE_ENV === "sandbox" || args.has("--sandbox") ? "sandbox" : "production";
const baseUrl = environment === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";
const apiKey = String(process.env.PADDLE_API_KEY || "").trim();
const knownWebhookSecret = String(process.env.PADDLE_MARITIME_WEBHOOK_SECRET || "").trim();
const jsonOnly = args.has("--json");

if (!apiKey) {
  console.error("PADDLE_API_KEY gerekli.");
  process.exit(2);
}

async function request(method, pathOrUrl, body) {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${baseUrl}${pathOrUrl}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload) {
    const detail = payload?.error?.detail || payload?.error?.code || response.statusText;
    throw new Error(`Paddle ${method} ${url} -> ${response.status}: ${detail}`);
  }
  return payload;
}

async function listAll(path) {
  const out = [];
  let next = `${path}${path.includes("?") ? "&" : "?"}per_page=200`;
  while (next) {
    const payload = await request("GET", next);
    out.push(...(Array.isArray(payload.data) ? payload.data : []));
    const pagination = payload.meta?.pagination;
    next = pagination?.has_more ? pagination.next : null;
  }
  return out;
}

function productMatches(item) {
  return item?.custom_data?.sku === SKU || item?.name === PRODUCT_NAME;
}

function priceMatches(item, productId) {
  return item?.id === EXPECTED_PRICE_ID
    && item?.product_id === productId
    && item?.status === "active"
    && item?.billing_cycle === null
    && String(item?.unit_price?.amount || "") === AMOUNT
    && String(item?.unit_price?.currency_code || "").toUpperCase() === CURRENCY
    && Number(item?.quantity?.minimum) === 1
    && Number(item?.quantity?.maximum) === 1;
}

async function ensureProduct() {
  const products = await listAll("/products?status=active");
  let product = products.find(productMatches) || null;
  const desired = {
    name: PRODUCT_NAME,
    description: PRODUCT_DESCRIPTION,
    tax_category: "saas",
    custom_data: { sku: SKU, commercial_unit: "1_ship_1_reporting_year_1_immutable_snapshot" },
  };
  if (!product) {
    product = (await request("POST", "/products", desired)).data;
    return { product, created: true };
  }
  const needsUpdate = product.name !== desired.name
    || product.description !== desired.description
    || product.tax_category !== desired.tax_category
    || product.custom_data?.sku !== SKU;
  if (needsUpdate) product = (await request("PATCH", `/products/${product.id}`, desired)).data;
  return { product, created: false };
}

async function ensurePrice(productId) {
  const prices = await listAll(`/prices?product_id=${encodeURIComponent(productId)}&status=active`);
  const exact = prices.find((p) => priceMatches(p, productId));
  if (exact) return { price: exact, created: false };

  const expected = await request("GET", `/prices/${EXPECTED_PRICE_ID}`).catch(() => null);
  if (expected?.data) {
    const p = expected.data;
    if (!priceMatches(p, productId)) throw new Error(`Paddle price ${EXPECTED_PRICE_ID} ürün/tutar/para birimi ile eşleşmiyor.`);
    return { price: p, created: false };
  }

  throw new Error(`Beklenen Paddle fiyatı bulunamadı: ${EXPECTED_PRICE_ID}`);
}

async function ensureWebhook() {
  const settings = await listAll("/notification-settings?active=true&traffic_source=platform");
  const existing = settings.find((x) => x.type === "url" && x.destination === WEBHOOK_URL) || null;
  if (existing) {
    const names = new Set((existing.subscribed_events || []).map((x) => x?.name || x));
    if (!names.has("transaction.completed")) {
      const updated = (await request("PATCH", `/notification-settings/${existing.id}`, {
        description: WEBHOOK_DESCRIPTION,
        subscribed_events: ["transaction.completed"],
        active: true,
        traffic_source: "platform",
      })).data;
      return { setting: updated, created: false, endpointSecret: null, secretKnown: Boolean(knownWebhookSecret) };
    }
    return { setting: existing, created: false, endpointSecret: null, secretKnown: Boolean(knownWebhookSecret) };
  }

  const created = (await request("POST", "/notification-settings", {
    description: WEBHOOK_DESCRIPTION,
    type: "url",
    destination: WEBHOOK_URL,
    include_sensitive_fields: false,
    subscribed_events: ["transaction.completed"],
    traffic_source: "platform",
  })).data;
  return {
    setting: created,
    created: true,
    endpointSecret: String(created.endpoint_secret_key || ""),
    secretKnown: Boolean(created.endpoint_secret_key),
  };
}

try {
  const productResult = await ensureProduct();
  const priceResult = await ensurePrice(productResult.product.id);
  const webhookResult = await ensureWebhook();

  if (!webhookResult.secretKnown && !knownWebhookSecret) {
    throw new Error(
      `Webhook destination zaten mevcut (${webhookResult.setting.id}) fakat endpoint secret API listesinde tekrar gösterilmez. ` +
      "PADDLE_MARITIME_WEBHOOK_SECRET mevcut secret ile sağlanmalı veya Paddle Dashboard'da bu destination yeniden oluşturulmalıdır."
    );
  }

  const result = {
    ok: true,
    environment,
    sku: SKU,
    productId: productResult.product.id,
    productCreated: productResult.created,
    priceId: priceResult.price.id,
    priceCreated: priceResult.created,
    price: { amount: 399, currency: CURRENCY, billing: "one-time", quantity: 1 },
    webhookUrl: WEBHOOK_URL,
    notificationSettingId: webhookResult.setting.id,
    notificationSettingCreated: webhookResult.created,
    webhookSecretCreated: Boolean(webhookResult.endpointSecret),
    ...(webhookResult.endpointSecret ? { endpointSecretKey: webhookResult.endpointSecret } : {}),
  };

  if (jsonOnly) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else {
    console.log(JSON.stringify(result, null, 2));
    console.log(`\nNEXT_PUBLIC_PADDLE_MARITIME_PRICE_ID_399=${result.priceId}`);
    if (webhookResult.endpointSecret) {
      console.log("PADDLE_MARITIME_WEBHOOK_SECRET=<endpointSecretKey yukarıdaki JSON çıktısında; yalnız Secret Manager'a yazın>");
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

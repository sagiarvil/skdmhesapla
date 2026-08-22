"use strict";

/**
 * CBAM / SKDM official-source regulatory watcher.
 *
 * Design goals:
 * - Official EU sources only.
 * - First observation creates a baseline; it never emits an alert.
 * - SHA-256 + normalized-content comparison prevents duplicate alerts.
 * - P0/P1 changes alert immediately. P2/P3 are retained for digest delivery.
 * - No regulatory change is deployed into the calculation engine automatically.
 *
 * Source policy: AGENTS1.md §2 / RM-003 G-01.
 */
const crypto = require("node:crypto");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const db = getFirestore();

const telegramBotToken = defineSecret("REG_TELEGRAM_BOT_TOKEN");
const whatsappAccessToken = defineSecret("REG_WHATSAPP_ACCESS_TOKEN");
const resendApiKey = defineSecret("REG_RESEND_API_KEY");

const REGION = "europe-west3";
const USER_AGENT = "SKDMHesapla-Regulatory-Watch/1.0 (+https://skdmhesapla.com)";
const MAX_TEXT = 180000;
const MAX_DIFF = 7000;

const OFFICIAL_TARGETS = Object.freeze([
  {
    id: "ec-cbam-legislation-guidance",
    authority: "DG_TAXUD",
    type: "OFFICIAL_GUIDANCE_INDEX",
    url: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en",
  },
  {
    id: "ec-cbam-registry",
    authority: "DG_TAXUD",
    type: "REGISTRY_GUIDANCE",
    url: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en",
  },
  {
    id: "ec-cbam-definitive-regime",
    authority: "DG_TAXUD",
    type: "OFFICIAL_GUIDANCE",
    url: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en",
  },
  {
    id: "eurlex-2023-956",
    authority: "EUR_LEX",
    type: "LAW",
    url: "https://eur-lex.europa.eu/eli/reg/2023/956/oj/eng",
  },
  {
    id: "eurlex-2025-2083",
    authority: "EUR_LEX",
    type: "LAW",
    url: "https://eur-lex.europa.eu/eli/reg/2025/2083/oj/eng",
  },
]);

function nowIso() {
  return new Date().toISOString();
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT);
}

function meaningfulTokens(text) {
  return new Set(
    String(text || "")
      .toLowerCase()
      .split(/[^\p{L}\p{N}./%-]+/u)
      .filter((x) => x.length >= 3)
      .slice(0, 30000),
  );
}

function buildDiff(previousText, currentText) {
  const before = meaningfulTokens(previousText);
  const after = meaningfulTokens(currentText);
  const added = [];
  const removed = [];
  for (const token of after) {
    if (!before.has(token)) added.push(token);
    if (added.length >= 220) break;
  }
  for (const token of before) {
    if (!after.has(token)) removed.push(token);
    if (removed.length >= 220) break;
  }
  return `ADDED: ${added.join(" ")}\nREMOVED: ${removed.join(" ")}`.slice(0, MAX_DIFF);
}

function classifyChange(target, diffText) {
  const text = `${target.type} ${diffText}`.toLowerCase();
  const has = (...terms) => terms.some((term) => text.includes(term));

  const calculation = has(
    "default value", "default values", "benchmark", "embedded emission",
    "emission factor", "methodology", "calculation", "certificate price",
    "annex iv", "cn code", "combined nomenclature",
  );
  const legal = target.authority === "EUR_LEX" || has(
    "regulation", "implementing regulation", "delegated regulation",
    "official journal", "entry into force", "shall apply",
  );
  const deadline = has("deadline", "date of application", "reporting period", "submission", "surrender");
  const registry = has("registry", "declarant portal", "user manual", "authorised cbam declarant");
  const verification = has("verification", "verifier", "accreditation");

  let severity = "P3";
  if (calculation && legal) severity = "P0";
  else if (legal || deadline || verification) severity = "P1";
  else if (registry || calculation) severity = "P2";

  return {
    severity,
    calculation,
    legal,
    deadline,
    registry,
    verification,
    requiresHumanReview: severity === "P0" || severity === "P1",
    autoDeployAllowed: false,
  };
}

async function fetchOfficial(url) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.text();
  const normalized = stripHtml(body);
  if (normalized.length < 300) throw new Error("official source content too short");
  return {
    normalized,
    hash: sha256(normalized),
    etag: response.headers.get("etag") || null,
    lastModified: response.headers.get("last-modified") || null,
  };
}

function env(name, fallback = "") {
  return String(process.env[name] || fallback).trim();
}

function formatAlert(event) {
  const impact = [];
  if (event.impact.calculation) impact.push("hesaplama/metodoloji");
  if (event.impact.deadline) impact.push("tarih/yükümlülük");
  if (event.impact.verification) impact.push("doğrulama");
  if (event.impact.registry) impact.push("CBAM Registry");
  if (!impact.length) impact.push("resmî içerik");

  return [
    `CBAM ${event.severity} MEVZUAT/GÜNCELLEME ALARMI`,
    `Kaynak: ${event.authority}`,
    `Alan: ${event.targetId}`,
    `Etki: ${impact.join(", ")}`,
    `Tespit: ${event.detectedAt}`,
    "Production değişikliği: OTOMATİK UYGULANMADI",
    event.sourceUrl,
  ].join("\n");
}

async function sendTelegram(text) {
  const token = String(telegramBotToken.value() || "").trim();
  const chatId = env("REG_TELEGRAM_CHAT_ID");
  if (!token || !chatId) return { channel: "telegram", status: "skipped", reason: "not_configured" };
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`telegram HTTP ${response.status}`);
  const body = await response.json();
  if (!body.ok) throw new Error(`telegram ${body.description || "send failed"}`);
  return { channel: "telegram", status: "sent" };
}

async function sendWhatsApp(event) {
  const token = String(whatsappAccessToken.value() || "").trim();
  const phoneNumberId = env("REG_WHATSAPP_PHONE_NUMBER_ID");
  const recipient = env("REG_WHATSAPP_TO");
  const templateName = env("REG_WHATSAPP_TEMPLATE", "cbam_regulatory_alert");
  const languageCode = env("REG_WHATSAPP_TEMPLATE_LANG", "tr");
  const graphVersion = env("REG_WHATSAPP_GRAPH_VERSION", "v23.0");
  if (!token || !phoneNumberId || !recipient) {
    return { channel: "whatsapp", status: "skipped", reason: "not_configured" };
  }

  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipient,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: event.severity },
              { type: "text", text: event.authority },
              { type: "text", text: event.targetId },
              { type: "text", text: event.detectedAt },
              { type: "text", text: event.sourceUrl },
            ],
          },
        ],
      },
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 600);
    throw new Error(`whatsapp HTTP ${response.status}: ${detail}`);
  }
  return { channel: "whatsapp", status: "sent" };
}

async function sendEmail(subject, text) {
  const apiKey = String(resendApiKey.value() || "").trim();
  const from = env("REG_EMAIL_FROM");
  const to = env("REG_EMAIL_TO");
  if (!apiKey || !from || !to) return { channel: "email", status: "skipped", reason: "not_configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from, to: to.split(",").map((x) => x.trim()).filter(Boolean), subject, text }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`email HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`);
  return { channel: "email", status: "sent" };
}

async function dispatchImmediate(event) {
  if (event.severity !== "P0" && event.severity !== "P1") return [];
  const text = formatAlert(event);
  const results = [];
  const senders = [
    () => sendTelegram(text),
    () => sendWhatsApp(event),
    () => sendEmail(`[${event.severity}] CBAM resmî güncelleme`, text),
  ];
  for (const sender of senders) {
    try {
      results.push(await sender());
    } catch (error) {
      results.push({ channel: "unknown", status: "failed", reason: String(error.message || error).slice(0, 500) });
    }
  }
  return results;
}

async function processTarget(target) {
  const ref = db.collection("regulatory_sources").doc(target.id);
  const previousSnap = await ref.get();
  const previous = previousSnap.exists ? previousSnap.data() : null;
  const fetchedAt = nowIso();

  try {
    const current = await fetchOfficial(target.url);
    if (!previous || !previous.hash) {
      await ref.set({
        ...target,
        hash: current.hash,
        normalizedText: current.normalized,
        etag: current.etag,
        lastModified: current.lastModified,
        status: "baseline",
        firstSeenAt: fetchedAt,
        lastCheckedAt: fetchedAt,
        consecutiveFailures: 0,
      }, { merge: true });
      return { targetId: target.id, status: "baseline" };
    }

    if (previous.hash === current.hash) {
      await ref.set({ lastCheckedAt: fetchedAt, status: "ok", consecutiveFailures: 0 }, { merge: true });
      return { targetId: target.id, status: "unchanged" };
    }

    const diff = buildDiff(previous.normalizedText || "", current.normalized);
    const impact = classifyChange(target, diff);
    const eventId = sha256(`${target.id}|${previous.hash}|${current.hash}`).slice(0, 40);
    const eventRef = db.collection("regulatory_events").doc(eventId);
    const eventSnap = await eventRef.get();

    const event = {
      eventId,
      targetId: target.id,
      authority: target.authority,
      authorityType: target.type,
      sourceUrl: target.url,
      previousHash: previous.hash,
      currentHash: current.hash,
      detectedAt: fetchedAt,
      severity: impact.severity,
      impact,
      diff,
      status: impact.requiresHumanReview ? "REVIEW_REQUIRED" : "DETECTED",
      publishStatus: "BLOCKED_PENDING_REVIEW",
      calculationDeployStatus: "BLOCKED",
      autoDeployAllowed: false,
    };

    if (!eventSnap.exists) {
      const notifications = await dispatchImmediate(event);
      event.notifications = notifications;
      event.notifiedAt = notifications.some((x) => x.status === "sent") ? fetchedAt : null;
      await eventRef.set(event);
    }

    await ref.set({
      ...target,
      hash: current.hash,
      normalizedText: current.normalized,
      etag: current.etag,
      lastModified: current.lastModified,
      status: "changed",
      lastChangedAt: fetchedAt,
      lastCheckedAt: fetchedAt,
      consecutiveFailures: 0,
    }, { merge: true });

    return { targetId: target.id, status: "changed", eventId, severity: impact.severity };
  } catch (error) {
    const failures = Number(previous?.consecutiveFailures || 0) + 1;
    await ref.set({
      ...target,
      status: "fetch_failed",
      lastCheckedAt: fetchedAt,
      lastFailureAt: fetchedAt,
      lastFailure: String(error.message || error).slice(0, 800),
      consecutiveFailures: failures,
    }, { merge: true });

    if (failures >= 2) {
      const healthId = sha256(`health|${target.id}|${new Date().toISOString().slice(0, 10)}`).slice(0, 40);
      const healthRef = db.collection("regulatory_events").doc(healthId);
      const healthSnap = await healthRef.get();
      if (!healthSnap.exists) {
        const event = {
          eventId: healthId,
          targetId: target.id,
          authority: target.authority,
          authorityType: "SOURCE_HEALTH",
          sourceUrl: target.url,
          detectedAt: fetchedAt,
          severity: "P1",
          impact: { sourceHealth: true, requiresHumanReview: true, autoDeployAllowed: false },
          diff: `Kaynak ${failures} ardışık kontrolde okunamadı.`,
          status: "REVIEW_REQUIRED",
          publishStatus: "NOT_APPLICABLE",
          calculationDeployStatus: "BLOCKED",
          autoDeployAllowed: false,
        };
        event.notifications = await dispatchImmediate(event);
        await healthRef.set(event);
      }
    }
    return { targetId: target.id, status: "fetch_failed", failures };
  }
}

async function runWatch() {
  const results = [];
  for (const target of OFFICIAL_TARGETS) {
    results.push(await processTarget(target));
  }
  await db.collection("regulatory_runs").add({
    startedBy: "scheduler",
    finishedAt: nowIso(),
    results,
    sourceCount: OFFICIAL_TARGETS.length,
    watcherVersion: "reg-watch-v1.0.0",
  });
  return results;
}

exports.regulatoryWatch15m = onSchedule(
  {
    schedule: "every 15 minutes",
    timeZone: "Europe/Istanbul",
    region: REGION,
    retryCount: 1,
    maxInstances: 1,
    secrets: [telegramBotToken, whatsappAccessToken, resendApiKey],
  },
  async () => {
    await runWatch();
  },
);

exports.regulatoryDigestDaily = onSchedule(
  {
    schedule: "0 9 * * *",
    timeZone: "Europe/Istanbul",
    region: REGION,
    retryCount: 1,
    maxInstances: 1,
    secrets: [telegramBotToken, resendApiKey],
  },
  async () => {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const snap = await db.collection("regulatory_events").where("detectedAt", ">=", since).get();
    const events = snap.docs
      .map((doc) => doc.data())
      .filter((event) => event.severity === "P2" || event.severity === "P3");
    if (!events.length) return;

    const body = [
      `CBAM günlük resmî kaynak özeti (${events.length} olay)`,
      "",
      ...events.map((event) => `${event.severity} | ${event.authority} | ${event.targetId}\n${event.sourceUrl}`),
    ].join("\n\n");

    const results = [];
    try { results.push(await sendTelegram(body)); } catch (error) { results.push({ channel: "telegram", status: "failed", reason: String(error.message || error) }); }
    try { results.push(await sendEmail("CBAM günlük resmî kaynak özeti", body)); } catch (error) { results.push({ channel: "email", status: "failed", reason: String(error.message || error) }); }

    await db.collection("regulatory_digest_runs").add({
      sentAt: nowIso(),
      eventCount: events.length,
      results,
      source: "daily_digest",
      createdAt: FieldValue.serverTimestamp(),
    });
  },
);

// Exported for deterministic unit/integration tests without network side effects.
exports._test = { stripHtml, buildDiff, classifyChange, sha256, OFFICIAL_TARGETS };

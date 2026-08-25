#!/usr/bin/env node

const BASE = (process.env.BASE_URL || "https://skdmhesapla.com").replace(/\/$/, "");
const failures = [];
const passes = [];

function pass(name, detail = "") {
  passes.push(`${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail) {
  failures.push(`${name}: ${detail}`);
}

async function json(url, init) {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => null);
  return { res, body };
}

async function main() {
  console.log(`=== PRODUCTION READINESS SMOKE — ${BASE} ===`);

  const flags = await json(`${BASE}/api/cbam/feature-flags`);
  if (!flags.res.ok) {
    fail("CBAM feature flags", `HTTP ${flags.res.status}`);
  } else if (
    flags.body?.cbamServerAuthoritativeSealReady !== true ||
    flags.body?.paidSealDataPolicy !== "actual-data-only" ||
    flags.body?.officialDefaultValueFallbackSealable !== false
  ) {
    fail("CBAM feature flags", `beklenmeyen politika ${JSON.stringify(flags.body)}`);
  } else {
    pass("CBAM feature flags", "server-authoritative + actual-data-only + fallback fail-closed");
  }

  // Kimliksiz seal isteği paket üretmemeli. 401 beklenir; 2xx güvenlik ihlalidir.
  const unauthSeal = await json(`${BASE}/api/cbam/seal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: "smoke", paddleTransactionId: "smoke", workflowType: "cbam" }),
  });
  if (unauthSeal.res.status === 401) pass("CBAM unauthenticated seal", "401 fail-closed");
  else fail("CBAM unauthenticated seal", `401 bekleniyordu, HTTP ${unauthSeal.res.status}`);

  // Paket indirme de kimliksiz kapalı kalmalı.
  const unauthDownload = await json(`${BASE}/api/cbam/download?packageId=CBAM-SMOKE`);
  if (unauthDownload.res.status === 401) pass("CBAM unauthenticated download", "401 fail-closed");
  else fail("CBAM unauthenticated download", `401 bekleniyordu, HTTP ${unauthDownload.res.status}`);

  const [brief, map] = await Promise.all([
    fetch(`${BASE}/llm.txt`, { redirect: "manual" }),
    fetch(`${BASE}/llms.txt`, { redirect: "manual" }),
  ]);
  const briefText = await brief.text();
  const mapText = await map.text();
  if (brief.status === 200 && map.status === 200 && briefText !== mapText && mapText.includes("2025/2547")) {
    pass("AI authority surfaces", "llm.txt compact + llms.txt full authority map");
  } else {
    fail("AI authority surfaces", `llm=${brief.status}, llms=${map.status}, distinct=${briefText !== mapText}`);
  }

  const slash = await fetch(`${BASE}/llm.txt/`, { redirect: "manual" });
  const location = slash.headers.get("location") || "";
  if ([301, 308].includes(slash.status) && location.includes("/llms.txt")) {
    pass("AI canonical trailing path", `${slash.status} → ${location}`);
  } else {
    fail("AI canonical trailing path", `HTTP ${slash.status}, location=${location || "yok"}`);
  }

  console.log("\n--- PASS ---");
  for (const item of passes) console.log("✓", item);
  console.log("\n--- FAIL ---");
  if (!failures.length) console.log("(yok)");
  else for (const item of failures) console.log("✗", item);
  console.log(`\nÖzet: ${passes.length} geçti, ${failures.length} kaldı`);

  if (failures.length) process.exit(1);
  console.log("PRODUCTION READINESS SMOKE PASSED");
}

main().catch((error) => {
  console.error("PRODUCTION READINESS SMOKE ERROR", error);
  process.exit(1);
});

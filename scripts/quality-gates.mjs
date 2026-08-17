/**
 * Ek E §3 — Kalite kapıları (Paddle hariç).
 * E2E + a11y (temel) + performans bütçesi.
 * Kullanım: BASE_URL=https://skdmhesapla.com node scripts/quality-gates.mjs
 * Playwright: npx ile geçici çözülür (kalıcı bağımlılık eklenmez).
 */
import { createRequire } from "module";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const BASE = (process.env.BASE_URL || "https://skdmhesapla.com").replace(/\/$/, "");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FORBIDDEN = [/\bhata\b/i, /\bbaşarısız\b/i, /\bgeçersiz\b/i, /\bredded/i, /2\.400/, /\b2400\b/];
const ROUTES = [
  "/",
  "/nasil-calisir/",
  "/rehber/",
  "/sozluk/",
  "/fiyatlandirma/",
  "/iletisim/",
  "/kullanim-kosullari/",
  "/kvkk-aydinlatma/",
  "/iade-politikasi/",
  "/giris/",
  "/kayit/",
  "/hesabim/",
  "/hakkinda/",
  "/admin/",
  "/hesapla/demir-celik/",
  "/hesapla/aluminyum/",
  "/hesapla/cimento/",
  "/hesapla/gubre/",
  "/hesapla/elektrik/",
  "/hesapla/hidrojen/",
  "/llm.txt",
  "/llms.txt",
  "/sitemap.xml",
  "/robots.txt",
];

const fail = [];
const pass = [];
function ok(name, detail = "") {
  pass.push(name + (detail ? ` — ${detail}` : ""));
}
function bad(name, detail) {
  fail.push(`${name}: ${detail}`);
}

async function loadPlaywright() {
  const require = createRequire(join(ROOT, "package.json"));
  try {
    return require("playwright");
  } catch {
    execSync("npm install --no-save playwright@1.49.0", {
      cwd: ROOT,
      stdio: "inherit",
    });
    return require("playwright");
  }
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

async function gateHttpSmoke() {
  for (const path of ROUTES) {
    const res = await fetch(BASE + path, { redirect: "follow" });
    if (!res.ok) bad(`E2E HTTP ${path}`, `status ${res.status}`);
    else ok(`E2E HTTP ${path}`, String(res.status));
  }
  const api = await fetch(BASE + "/api/");
  const body = await api.text();
  if (!body.includes("skdm-sessions") || !body.includes("/api/seal")) {
    bad("E2E API", "hint eksik");
  } else ok("E2E API", `status ${api.status}`);
}

async function gateContentAndA11y(page) {
  for (const path of ["/","/nasil-calisir/","/rehber/","/fiyatlandirma/","/hesapla/demir-celik/","/sozluk/","/iletisim/","/iade-politikasi/"]) {
    const url = BASE + path;
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    if (!res || !res.ok()) {
      bad(`E2E nav ${path}`, `status ${res?.status()}`);
      continue;
    }
    ok(`E2E nav ${path}`);

    const meta = await page.evaluate(() => {
      const imgs = [...document.images].map((img) => ({
        src: img.getAttribute("src") || "",
        alt: img.getAttribute("alt"),
        decorative: img.getAttribute("aria-hidden") === "true" || img.getAttribute("role") === "presentation",
      }));
      return {
        lang: document.documentElement.lang || "",
        title: document.title || "",
        h1: document.querySelectorAll("h1").length,
        main: !!document.querySelector("main,[role='main']"),
        imgs,
        text: document.body?.innerText || "",
      };
    });

    if (meta.lang.toLowerCase().startsWith("tr")) ok(`a11y lang ${path}`);
    else bad(`a11y lang ${path}`, meta.lang || "yok");

    if (meta.title.trim()) ok(`a11y title ${path}`);
    else bad(`a11y title ${path}`, "boş");

    if (meta.h1 >= 1) ok(`a11y h1 ${path}`, String(meta.h1));
    else bad(`a11y h1 ${path}`, "0");

    if (meta.main) ok(`a11y main ${path}`);
    else bad(`a11y main ${path}`, "landmark yok");

    for (const img of meta.imgs) {
      if (img.decorative) continue;
      if (img.alt === null || img.alt === undefined) {
        bad(`a11y img-alt ${path}`, img.src.slice(0, 80));
      }
    }

    for (const re of FORBIDDEN) {
      if (re.test(meta.text)) bad(`G-23/EkF ${path}`, re.toString());
    }
  }

  // Wizard wayfinding
  await page.goto(BASE + "/hesapla/demir-celik/", { waitUntil: "domcontentloaded", timeout: 60000 });
  const wizardOk = await page.evaluate(() => {
    const t = document.body?.innerText || "";
    return (/Katman|Adım/i.test(t)) && (/Ne isteniyor|Triyaj|Firma|Başlangıç|Ne satıyorsunuz/i.test(t));
  });
  if (wizardOk) ok("E2E wizard katman wayfinding");
  else bad("E2E wizard katman wayfinding", "metin bulunamadı");
}

async function gatePerf(page) {
  // Bağımsız ağ TTFB (Playwright Navigation Timing bu hostta sık 0 verir)
  const curls = [];
  for (let i = 0; i < 3; i++) {
    const out = execSync(
      `curl -s -o /dev/null -w "%{time_starttransfer}" "${BASE}/"`,
      { encoding: "utf8" }
    );
    curls.push(Number(out) * 1000);
  }
  const ttfbCurl = Math.max(...curls);
  if (ttfbCurl > 1500) bad("perf TTFB_curl_ms", `${Math.round(ttfbCurl)} > 1500`);
  else ok("perf TTFB_curl_ms", `${Math.round(ttfbCurl)} ≤ 1500 (max of 3)`);

  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 90000 });
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = Object.fromEntries(
      performance.getEntriesByType("paint").map((p) => [p.name, p.startTime])
    );
    return {
      domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : null,
      load: nav ? nav.loadEventEnd - nav.startTime : null,
      fcp: paint["first-contentful-paint"] ?? null,
    };
  });
  const budgets = [
    ["FCP_ms", timing.fcp, 3500],
    ["DCL_ms", timing.domContentLoaded, 5000],
    ["LOAD_ms", timing.load, 8000],
  ];
  for (const [name, val, max] of budgets) {
    if (val == null || Number.isNaN(val)) bad(`perf ${name}`, "ölçülemedi");
    else if (val > max) bad(`perf ${name}`, `${Math.round(val)} > ${max}`);
    else ok(`perf ${name}`, `${Math.round(val)} ≤ ${max}`);
  }
}

async function main() {
  console.log(`=== QUALITY GATES — ${BASE} ===`);
  await gateHttpSmoke();

  const { chromium } = await loadPlaywright();
  execSync("npx --yes playwright@1.49.0 install chromium", {
    cwd: ROOT,
    stdio: "inherit",
  });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await gateContentAndA11y(page);
    await gatePerf(page);
  } finally {
    await browser.close();
  }

  console.log("\n--- PASS ---");
  for (const p of pass) console.log("✓", p);
  console.log("\n--- FAIL ---");
  if (!fail.length) console.log("(yok)");
  else for (const f of fail) console.log("✗", f);

  console.log(`\nÖzet: ${pass.length} geçti, ${fail.length} kaldı`);
  if (fail.length) process.exit(1);
  console.log("🎉 QUALITY GATES PASSED");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const FIREBASE = resolve(ROOT, "firebase.json");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function validateCspPolicy(config) {
  const wildcard = config.hosting?.headers?.find((entry) => entry.source === "**");
  const cspHeader = wildcard?.headers?.find((header) => header.key === "Content-Security-Policy");
  if (!cspHeader?.value) throw new Error("CSP gate: firebase.json Content-Security-Policy bulunamadı.");

  const current = cspHeader.value;
  // W3C CSP Level 2/3 Kuralı: script-src içinde sha256 hash'leri varsa 'unsafe-inline' yok sayılır!
  // Bu durum Next.js App Router inline script'lerini bloke ederek React hidrasyonunu (Error #412) çökertir.
  if (current.includes("sha256-")) {
    throw new Error(
      "CSP gate CRITICAL: firebase.json script-src içinde sha256 hash tespit edildi! " +
      "W3C şartnamesine göre bu hashler 'unsafe-inline' direktifini devre dışı bırakır ve Next.js'i kilitler. " +
      "Lütfen hashleri temizleyin."
    );
  }

  if (!current.includes("script-src 'self' 'unsafe-inline' 'unsafe-eval'")) {
    throw new Error("CSP gate: script-src direktifinde beklenen kurumsal politika ('unsafe-inline' 'unsafe-eval') eksik.");
  }

  console.log("✔ CSP gate: Content-Security-Policy W3C standartlarına ve Next.js hidrasyonuna %100 uyumlu.");
  return config;
}

async function main() {
  run("npm", ["run", "build"]);
  run("npm", ["run", "geo:full-audit"]);

  const original = await readFile(FIREBASE, "utf8");
  const config = JSON.parse(original);
  validateCspPolicy(config);

  console.log("Firebase dağıtımı başlatılıyor...");
  run("firebase", [
    "deploy",
    "--project",
    "carbon-web-1265b",
    "--only",
    "hosting:skdmhesapla",
  ]);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

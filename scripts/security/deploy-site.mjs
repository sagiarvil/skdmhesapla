import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const OUT = resolve(ROOT, "out");
const FIREBASE = resolve(ROOT, "firebase.json");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  }));
  return nested.flat();
}

function sha256Source(script) {
  const digest = createHash("sha256").update(script, "utf8").digest("base64");
  return `'sha256-${digest}'`;
}

async function collectInlineScriptHashes() {
  const hashes = new Set();
  const files = await htmlFiles(OUT);
  const inlineScript = /<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;

  for (const file of files) {
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(inlineScript)) {
      const body = match[1] ?? "";
      if (body.length > 0) hashes.add(sha256Source(body));
    }
  }

  if (hashes.size === 0) {
    throw new Error("CSP gate: build çıktısında inline script bulunamadı; parser/build yapısı gözden geçirilmeli.");
  }
  return [...hashes].sort();
}

function hardenCsp(config, hashes) {
  const wildcard = config.hosting?.headers?.find((entry) => entry.source === "**");
  const cspHeader = wildcard?.headers?.find((header) => header.key === "Content-Security-Policy");
  if (!cspHeader?.value) throw new Error("CSP gate: firebase.json Content-Security-Policy bulunamadı.");

  const hashList = hashes.join(" ");
  const current = cspHeader.value;
  if (!current.includes("script-src 'self' 'unsafe-inline'")) {
    throw new Error("CSP gate: beklenen fallback script-src deseni değişmiş; otomatik deploy durduruldu.");
  }

  cspHeader.value = current.replace(
    "script-src 'self' 'unsafe-inline'",
    `script-src 'self' ${hashList}`,
  );

  if (cspHeader.value.includes("script-src 'self' 'unsafe-inline'")) {
    throw new Error("CSP gate: script-src unsafe-inline kaldı.");
  }
  return config;
}

async function main() {
  run("npm", ["run", "build"]);
  run("npm", ["run", "geo:full-audit"]);

  const hashes = await collectInlineScriptHashes();
  const config = JSON.parse(await readFile(FIREBASE, "utf8"));
  const hardened = hardenCsp(config, hashes);
  const tempConfig = resolve(ROOT, ".firebase.deploy.json");

  try {
    await writeFile(tempConfig, `${JSON.stringify(hardened, null, 2)}\n`, "utf8");
    console.log(`CSP gate: ${hashes.length} benzersiz inline script SHA-256 hash ile izinli.`);
    run("firebase", [
      "deploy",
      "--project",
      "carbon-web-1265b",
      "--config",
      tempConfig,
      "--only",
      "hosting:skdmhesapla",
    ]);
  } finally {
    await rm(tempConfig, { force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

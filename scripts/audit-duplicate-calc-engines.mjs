#!/usr/bin/env node
/**
 * Yinelenen maliyet motoru + sessiz varsayılan taraması.
 * Kırmızıysa CI/deploy bloklanır.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
let found = 0;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next" || ent.name === "out") continue;
      walk(p, acc);
    } else if (/\.(ts|tsx|js|mjs)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function rel(p) {
  return path.relative(ROOT, p).replaceAll("\\", "/");
}

console.log("=== Yinelenen hesaplama motoru taramasi ===");

const allowedEstimate = new Set([
  "src/lib/calc/estimateCost.ts",
  "src/components/wizard/EstimatedCostCard.tsx",
  "tests/calc/costPropagation.spec.ts",
  "tests/calc/dataReadiness.spec.ts",
]);

const suspectFn = /(?:export\s+)?function\s+\w*(?:[Cc]alculate|[Ee]stimate|[Hh]esapla)\w*(?:[Cc]ost|[Mm]aliyet)\w*/;
const files = walk(path.join(ROOT, "src"));
for (const file of files) {
  const r = rel(file);
  if (allowedEstimate.has(r)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (suspectFn.test(text) && !r.startsWith("src/lib/skdm/calculator.ts")) {
    console.error(`UYARI: Supheli yinelenen motor: ${r}`);
    found = 1;
  }
}

const sectorDirs = ["demir-celik", "aluminyum", "cimento", "gubre", "hidrojen", "elektrik"];
for (const dir of sectorDirs) {
  const hits = files.filter((f) => {
    const r = rel(f).toLowerCase();
    return r.includes(`/${dir}/`) && /(calc|cost|maliyet)/i.test(path.basename(f));
  });
  for (const h of hits) {
    console.error(`UYARI: '${dir}' altinda bagimsiz hesaplama dosyasi: ${rel(h)}`);
    found = 1;
  }
}

const wizard = path.join(ROOT, "src/components/wizard/SkdmWizard.tsx");
const wizardTxt = fs.readFileSync(wizard, "utf8");
if (/\|\|\s*1000/.test(wizardTxt) || /Math\.max\(\s*1\s*,\s*Number\(fieldValues\.tonaj\)/.test(wizardTxt)) {
  console.error("UYARI: SkdmWizard sessiz tonaj varsayilani (1000 / max(1))");
  found = 1;
}
if (!wizardTxt.includes("EstimatedCostCard")) {
  console.error("UYARI: SkdmWizard EstimatedCostCard kullanmiyor");
  found = 1;
}
if (/fmt\(result\.importerCostEur\)/.test(wizardTxt)) {
  console.error("UYARI: SkdmWizard readiness kapisi olmadan importerCostEur basiyor");
  found = 1;
}

const fields = JSON.parse(fs.readFileSync(path.join(ROOT, "src/lib/skdm/fieldhelp/fields.json"), "utf8"));
if (fields.fields?.tonaj?.default === 1000 || fields.fields?.tonaj?.default === "1000") {
  console.error("UYARI: fields.json tonaj default=1000 (sessiz varsayilan)");
  found = 1;
}

const hesapla = walk(path.join(ROOT, "src/app/hesapla"));
for (const file of hesapla) {
  const text = fs.readFileSync(file, "utf8");
  if (/value=["']1000["']/.test(text) || /tonaj\s*=\s*1000/.test(text) || /qty\s*=\s*1000/.test(text)) {
    console.error(`UYARI: Hard-coded varsayilan miktar ${rel(file)}`);
    found = 1;
  }
}

const page = fs.readFileSync(path.join(ROOT, "src/app/hesapla/[sector]/page.tsx"), "utf8");
for (const slug of sectorDirs) {
  if (!page.includes(`"${slug}"`)) {
    console.error(`UYARI: /hesapla/[sector] TIER_A listesinde ${slug} yok`);
    found = 1;
  }
}
if (!page.includes("SkdmWizard")) {
  console.error("UYARI: Kademe A sayfasi SkdmWizard kullanmiyor");
  found = 1;
}

if (found === 1) {
  console.error("");
  console.error("DENETIM BASARISIZ - deploy engellendi.");
  console.error("Maliyet gosterimi src/lib/calc/estimateCost.ts uzerinden gecmeli.");
  process.exit(1);
}
console.log("OK - Tek motor kurali ihlal edilmemis.");

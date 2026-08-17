import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const violations = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) out.push(p);
  }
  return out;
}

function rel(p) { return path.relative(ROOT, p).replaceAll("\\", "/"); }

const pcfFiles = walk(path.join(ROOT, "src/lib/pcf"));
for (const file of pcfFiles) {
  const text = fs.readFileSync(file, "utf8");
  if (/from\s+["'][^"']*skdm\/(calculator|qc|package-seal|annex-ruleset)/.test(text)) {
    violations.push(`${rel(file)}: PCF çekirdeği CBAM motor katmanına import yapamaz.`);
  }
}

const skdmCalc = path.join(ROOT, "src/lib/skdm/calculator.ts");
if (fs.existsSync(skdmCalc) && /from\s+["'][^"']*pcf\//.test(fs.readFileSync(skdmCalc, "utf8"))) {
  violations.push("src/lib/skdm/calculator.ts: CBAM calculator PCF çekirdeğine import yapamaz.");
}

const pcfWizard = path.join(ROOT, "src/components/pcf/PcfWizard.tsx");
if (fs.existsSync(pcfWizard)) {
  const text = fs.readFileSync(pcfWizard, "utf8");
  if (/skdm\/(calculator|qc|package-seal)/.test(text)) {
    violations.push("src/components/pcf/PcfWizard.tsx: CBAM calculator/qc/seal importu yasaktır.");
  }
}

const skdmWizard = path.join(ROOT, "src/components/wizard/SkdmWizard.tsx");
if (fs.existsSync(skdmWizard) && /lib\/pcf/.test(fs.readFileSync(skdmWizard, "utf8"))) {
  violations.push("src/components/wizard/SkdmWizard.tsx: PCF çekirdeği importu yasaktır.");
}

const newPcfSurface = [
  ...walk(path.join(ROOT, "src/lib/pcf")),
  ...walk(path.join(ROOT, "src/components/pcf")),
  path.join(ROOT, "src/app/karbon-raporu/page.tsx"),
];
for (const file of newPcfSurface) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (/tedarikciKarbonDosyasi|buildTkdGirdisiFromWizard/.test(text)) {
    violations.push(`${rel(file)}: yeni PCF akışı legacy TKD adaptörünü import edemez.`);
  }
}

if (violations.length) {
  console.error("ENGINE BOUNDARY GATE FAILED");
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}
console.log("ENGINE BOUNDARY GATE PASSED");

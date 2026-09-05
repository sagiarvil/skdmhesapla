#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "src/components/maritime/MaritimePreparationWorkbenchV2.tsx");
let src = fs.readFileSync(target, "utf8");
let changed = false;

const importNeedle = 'import type { MaritimeFuelRecord, MaritimePreparationFile, MaritimeRole, MaritimeShipType, MaritimeVoyageRecord, VoyageScope } from "@/lib/maritime/types";\n';
const importLine = 'import { MaritimeEvidenceVault } from "./MaritimeEvidenceVault";\n';
if (!src.includes(importLine)) {
  if (!src.includes(importNeedle)) throw new Error("Workbench import anchor missing");
  src = src.replace(importNeedle, `${importNeedle}${importLine}`);
  changed = true;
}

const calcAnchor = '  const calc = useMemo(() => calculateMaritimePreparation(file, euaPrice === "" ? undefined : Number(euaPrice)), [file, euaPrice]);\n';
const coverageEffect = `  useEffect(() => {\n    const onEvidenceCoverage = (event: Event) => {\n      const detail = (event as CustomEvent<{ coverage?: Record<string, number>; references?: Record<string, string> }>).detail;\n      if (!detail?.coverage) return;\n      const evidence = Object.fromEntries(Object.entries(detail.coverage).map(([key, count]) => [key, Number(count) > 0]));\n      setFile((state) => ({\n        ...state,\n        evidence: { ...state.evidence, ...evidence },\n        evidenceReferences: { ...state.evidenceReferences, ...(detail.references || {}) },\n      }));\n    };\n    window.addEventListener("maritime-evidence-coverage", onEvidenceCoverage);\n    return () => window.removeEventListener("maritime-evidence-coverage", onEvidenceCoverage);\n  }, []);\n\n`;
if (!src.includes("maritime-evidence-coverage")) {
  if (!src.includes(calcAnchor)) throw new Error("Workbench calc anchor missing");
  src = src.replace(calcAnchor, `${coverageEffect}${calcAnchor}`);
  changed = true;
}

const start = '          {tab === "evidence" && <Panel icon={FileCheck2} eyebrow="Evidence manifest" title="Verifier evidence index ve handoff">';
const next = '          {tab === "result" && <Panel icon={CheckCircle2} eyebrow="Preparation release gate" title="Hesap ve verifier-ready hazırlık çıktısı">';
if (!src.includes("<MaritimeEvidenceVault />")) {
  const startAt = src.indexOf(start);
  const nextAt = src.indexOf(next);
  if (startAt < 0 || nextAt < 0 || nextAt <= startAt) throw new Error("Evidence panel anchors missing");
  const replacement = `          {tab === "evidence" && <Panel icon={FileCheck2} eyebrow="Evidence vault" title="Binary belge, checksum ve verifier kanıt zinciri">\n            <MaritimeEvidenceVault />\n            <div className="mt-6 rounded-2xl border border-line bg-[#f8faf6] p-4"><h3 className="font-black">Accredited verifier identity</h3><Grid><Field label="Verifier name" value={file.verifier.verifierName} set={(v) => updateVerifier("verifierName", v)} /><Field label="Accreditation number" value={file.verifier.accreditationNumber} set={(v) => updateVerifier("accreditationNumber", v)} /><Field label="Verifier e-mail" value={file.verifier.contactEmail} set={(v) => updateVerifier("contactEmail", v)} /><Field label="Verifier address" value={file.verifier.address} set={(v) => updateVerifier("address", v)} /></Grid></div>\n          </Panel>}\n\n`;
  src = src.slice(0, startAt) + replacement + src.slice(nextAt);
  changed = true;
}

if (changed) {
  fs.writeFileSync(target, src, "utf8");
  console.log("Maritime evidence UI patch applied.");
} else {
  console.log("Maritime evidence UI already patched.");
}

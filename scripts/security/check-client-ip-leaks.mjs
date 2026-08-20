import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("out/_next/static");

if (!fs.existsSync(ROOT)) {
  console.error("CLIENT IP GATE FAILED: out/_next/static bulunamadı.");
  process.exit(1);
}

const forbidden = [
  "Test123456!",
  "teb232@gmail.com",
  "SEED_TEST_PACKAGES",
  "calculateSkdmLiability",
  "createSealedAuditPackage",
  "customDirectEmission",
  "defaultDirectEmission",
  "defaultIndirectEmission",
  "factorSource",
  "packageSignature",
];

const files = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) walk(full);
    else if (/\.(js|json|txt|map)$/.test(name)) files.push(full);
  }
}

walk(ROOT);

const violations = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");

  for (const marker of forbidden) {
    if (text.includes(marker)) {
      violations.push({
        marker,
        file: path.relative(process.cwd(), file),
      });
    }
  }
}

if (violations.length) {
  console.error("");
  console.error("CLIENT IP GATE FAILED");
  console.error("Proprietary/test implementation production browser bundle'a girdi.");
  console.error("");

  for (const v of violations) {
    console.error(`- ${v.marker} -> ${v.file}`);
  }

  console.error("");
  console.error("DEPLOY YASAK.");
  process.exit(1);
}

console.log("CLIENT IP GATE PASSED");

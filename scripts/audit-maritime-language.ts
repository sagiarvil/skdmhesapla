/**
 * CI / Audit Script: Maritime Language and Statutory Terminology Auditor
 * 
 * Amaç: Denizcilik içeriklerinde mevzuat ve terminoloji hatalarını tespit eder.
 * Yasaklı İfadeler:
 * - "Direktif (AB) 2023/957" (Tüzük olmalı)
 * - "THETIS-MRV v2" (Doğrulanmamış versiyon adı; THETIS-MRV olmalı)
 * - "IACS klas hazır", "klas onayı", "klas denetimi garantisi" (Doğrulayıcı akredite kuruluştur)
 * - "yüksek hacimli arama" (Kanıtsız arama hacmi iddiası)
 */

import fs from "fs";
import path from "path";

interface Violation {
  file: string;
  line: number;
  snippet: string;
  rule: string;
  suggestion: string;
}

const FORBIDDEN_RULES = [
  {
    regex: /Direktif\s*\(AB\)\s*2023\/957/i,
    rule: "STATUTORY_NOMENCLATURE",
    suggestion: "Tüzük (AB) 2023/957 (veya Regulation (EU) 2023/957) kullanılmalıdır.",
  },
  {
    regex: /THETIS-MRV\s*v2|THETIS\s*v2/i,
    rule: "UNVERIFIED_EMSA_SCHEMA",
    suggestion: "'THETIS-MRV' veya 'THETIS-MRV veri hazırlığı / XML aktarım formatı' kullanılmalıdır.",
  },
  {
    regex: /IACS\s*klas\s*(hazır|denetimi|onayı)|klas\s*onayı\s*garantisi/i,
    rule: "ACCREDITED_VERIFIER_CONFUSION",
    suggestion: "Klas kuruluşu yerine 'Akredite Doğrulayıcı İncelemesine Hazırlık' ifadesi kullanılmalıdır.",
  },
  {
    regex: /yüksek\s*hacimli\s*arama/i,
    rule: "UNSUPPORTED_SEARCH_VOLUME_CLAIM",
    suggestion: "Google Search Console veya Keyword Planner verisi olmadan arama hacmi iddiasında bulunulamaz.",
  },
];

const TARGET_DIRECTORIES = [
  "src/app/denizcilik",
  "src/components/maritime",
  "src/data/maritimePlainLanguage.ts",
  "src/seo/maritime-query-map.ts",
];

function scanFile(filePath: string, violations: Violation[]) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((lineText, idx) => {
    // Audit scriptinin kendi kural tanımlarını tarama dışı bırak
    if (filePath.includes("audit-maritime-language")) return;

    const trimmed = lineText.trim();
    // Yorum satırlarını ve yasaklı liste tanımlarını atla
    if (
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("*") ||
      trimmed.includes("forbiddenAliases") ||
      trimmed.includes("suggestion:")
    ) {
      return;
    }

    for (const rule of FORBIDDEN_RULES) {
      if (rule.regex.test(lineText)) {
        violations.push({
          file: path.relative(process.cwd(), filePath),
          line: idx + 1,
          snippet: lineText.trim().substring(0, 100),
          rule: rule.rule,
          suggestion: rule.suggestion,
        });
      }
    }
  });
}

function scanDir(dirPath: string, violations: Violation[]) {
  if (!fs.existsSync(dirPath)) return;
  const stat = fs.statSync(dirPath);
  if (stat.isFile()) {
    scanFile(dirPath, violations);
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, violations);
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      scanFile(fullPath, violations);
    }
  }
}

function runAudit() {
  console.log("⚓ [AUDIT] Denizcilik Mevzuat & Terminoloji Denetimi Başlatılıyor...");
  const violations: Violation[] = [];

  for (const target of TARGET_DIRECTORIES) {
    scanDir(path.resolve(process.cwd(), target), violations);
  }

  if (violations.length > 0) {
    console.error(`\n❌ [BAŞARISIZ] ${violations.length} terminoloji / mevzuat ihlali bulundu:\n`);
    violations.forEach((v, i) => {
      console.error(
        `${i + 1}. [${v.rule}] ${v.file}:${v.line}\n   İhlal: "${v.snippet}"\n   Öneri: ${v.suggestion}\n`,
      );
    });
    process.exit(1);
  } else {
    console.log("✅ [BAŞARILI] Sıfır terminoloji ihlali. Tüm metinler mevzuat standartlarına tam uygun.");
    process.exit(0);
  }
}

runAudit();

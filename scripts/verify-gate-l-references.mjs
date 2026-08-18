/**
 * GATE-L (RM-006) kanıt scripti — referans sihirbaz talimatlarının doğrulanması.
 *
 * 1. SECTORS tek tanım noktası: annex-ruleset.ts (src/ genelinde 1 `export const SECTORS`).
 *    Sihirbaz + triyaj bu kaynağı import eder; kopya tanım yoktur.
 * 2. Sihirbaz akışında alert() yoktur.
 * 3. localStorage yalnızca taslak önbelleği (skdm_session_draft:); gerçek oturum
 *    kalıcılığı Firestore + /api/skdm-sessions (CF yedek) üzerinden yapılır.
 * 4. audit-duplicate-calc-engines.sh → tek motor kuralı ihlal edilmedi.
 *
 * Kullanım: npx tsx scripts/verify-gate-l-references.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) SECTORS tek tanım noktası ────────────────────────────────────────────
const srcFiles = globSync("src/**/*.{ts,tsx}");
const defSites = srcFiles.filter((f) => readFileSync(f, "utf8").includes("export const SECTORS"));
check("SECTORS tek tanım noktası (annex-ruleset.ts)", defSites.length === 1 && defSites[0] === "src/lib/skdm/annex-ruleset.ts");
check("SECTORS tanımında kopya yok (src/app, src/components)", srcFiles.filter((f) => f.startsWith("src/app") || f.startsWith("src/components")).every((f) => !readFileSync(f, "utf8").includes("export const SECTORS")));

const wizard = readFileSync("src/components/wizard/SkdmWizard.tsx", "utf8");
const triage = readFileSync("src/components/wizard/ScopeTriage.tsx", "utf8");
check("Sihirbaz SECTORS'u annex-ruleset'ten import eder", wizard.includes('SECTORS as ANNEX_SECTORS } from "@/lib/skdm/annex-ruleset"') || wizard.includes('from "@/lib/skdm/annex-ruleset"'));
check("Triyaj SECTORS'u annex-ruleset'ten import eder", triage.includes('from "@/lib/skdm/annex-ruleset"'));
check("Kapsam kararı resolveScope/routeVerdict üzerinden (tek yol)", readFileSync("src/lib/skdm/resolve-scope.ts", "utf8").includes("routeVerdict"));

// ── 2) alert() yok (sihirbaz akışı) ─────────────────────────────────────────
const wizardFlow = ["src/components/wizard", "src/app/hesapla"];
let alertHits = 0;
for (const dir of wizardFlow) {
  for (const f of globSync(`${dir}/**/*.{ts,tsx}`)) {
    const lines = readFileSync(f, "utf8").split("\n");
    lines.forEach((l, i) => {
      if (l.includes("alert(")) {
        alertHits++;
        console.log(`   alert: ${f}:${i + 1}`);
      }
    });
  }
}
check("Sihirbaz akışında alert() kalmadı", alertHits === 0);

// ── 3) localStorage = yalnızca taslak önbelleği; gerçek oturum backend ──────
const sessionStore = readFileSync("src/lib/skdm/session-store.ts", "utf8");
check("Taslak önbelleği tek önekle sınırlı (skdm_session_draft:)", sessionStore.includes('const KEY_PREFIX = "skdm_session_draft:"'));
check("Oturum kalıcılığı Firestore'a yazar", sessionStore.includes('doc(db, "skdm_sessions"'));
check("Oturum kalıcılığı CF API yedeği kullanır", sessionStore.includes("/api/skdm-sessions"));
const wizLocal = wizard.includes("localStorage");
check("Sihirbaz doğrudan localStorage çağırmaz (session-store soyutlaması)", !wizLocal);

// ── 4) audit-duplicate-calc-engines.sh ─────────────────────────────────────
const auditOut = execSync("bash scripts/audit-duplicate-calc-engines.sh", { encoding: "utf8" });
console.log(auditOut.trim());
check("Tek motor kuralı ihlal edilmedi", auditOut.includes("OK") && !auditOut.includes("IHLA"));

if (FAIL.length === 0) {
  console.log(`\nGATE-L KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-L KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}

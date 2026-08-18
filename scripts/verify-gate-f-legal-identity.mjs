/**
 * GATE-F (RM-006) kanıt scripti — hukuki kimlik tek config (INV-4).
 *
 * 1. İşletmeci kimliği tek nesneden (SITE → LEGAL_ENTITY) gelir; sayfalarda
 *    elle yazılmış kimlik literalı yoktur.
 * 2. Altı canlı sayfa aynı ortak footer'ı (SiteFooter) kullanır.
 * 3. Sunucu konumu (Frankfurt) işletmeci merkezinden (Türkiye) ayrı ve
 *    etiketli gösterilir; VKN etiketi TCKN olarak düzeltilmiştir.
 * 4. Sitenin kendi vergi kimlik no'su sistemin kendi kontrolünden geçer
 *    (şahıs işletmesi → 11 haneli geçerli TCKN; GATE-H/RM-006 4. madde).
 *
 * Kullanım: npx tsx scripts/verify-gate-f-legal-identity.mjs
 */
import { readFileSync } from "node:fs";
import { SITE } from "../src/lib/skdm/site-config";
import { LEGAL_ENTITY } from "../src/lib/skdm/constants";
import { checkTaxIdField, hasBlockingQc } from "../src/lib/skdm/qc";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Tek config zinciri ───────────────────────────────────────────────────
check(
  "LEGAL_ENTITY tek kaynaktan (SITE) türer",
  LEGAL_ENTITY.companyName === SITE.legalName &&
    LEGAL_ENTITY.vkn === SITE.vkn &&
    LEGAL_ENTITY.operatorLocation === SITE.operatorLocation &&
    LEGAL_ENTITY.serverLocation === SITE.hostingShort
);
check(
  "İşletmeci merkezi sunucu konumundan ayrı tanımlı",
  LEGAL_ENTITY.operatorLocation === "Türkiye" && LEGAL_ENTITY.serverLocation.includes("Frankfurt")
);
check(
  "VKN etiketi TCKN olarak düzeltildi (şahıs işletmesi)",
  LEGAL_ENTITY.vknLabel === "Vergi Kimlik No (TCKN)"
);

// ── 2) Altı canlı sayfa: kimlik bloğu literalı yok ──────────────────────────
const LIVE_PAGES = [
  "src/app/page.tsx",
  "src/app/basla/page.tsx",
  "src/app/hesapla/[sector]/page.tsx",
  "src/app/hakkinda/page.tsx",
  "src/app/dogrula/page.tsx",
  "src/app/fiyatlandirma/page.tsx",
];
// Kimlik bloğuna özgü literal: numara ve sunucu konumu elle yazılamaz.
// Marka/kişi adlarının metin içinde geçmesi meşrudur (E-E-A-T içeriği);
// yasak olan, kimlik bloğunun elle çoğaltılmasıdır.
const IDENTITY_BLOCK_LITERALS = ["25403091318", "Frankfurt"];
for (const page of LIVE_PAGES) {
  const src = readFileSync(page, "utf8");
  const hits = IDENTITY_BLOCK_LITERALS.filter((lit) => src.includes(lit));
  check(
    `${page} kimlik bloğu literalı içermiyor`,
    hits.length === 0
  );
  if (hits.length > 0) console.log("   bulunan literal:", hits.join(", "));
}

// Ortak footer her sayfada (root layout tek SiteFooter)
const rootLayout = readFileSync("src/app/layout.tsx", "utf8");
check(
  "Tüm sayfalar ortak SiteFooter kullanır (root layout)",
  rootLayout.includes("<SiteFooter />") && rootLayout.includes("SiteFooter") && rootLayout.includes("SiteHeader")
);

// SiteChrome'da kimlik literalı yok — yalnızca LEGAL_ENTITY
const chrome = readFileSync("src/components/legal/SiteChrome.tsx", "utf8");
const chromeHits = IDENTITY_BLOCK_LITERALS.filter((lit) => chrome.includes(lit));
check("SiteChrome kimlik literalı içermiyor", chromeHits.length === 0);
check(
  "SiteChrome footer kimlik bloğu LEGAL_ENTITY'den beslenir",
  chrome.includes("LEGAL_ENTITY.vknLabel") &&
    chrome.includes("LEGAL_ENTITY.operatorLocation") &&
    chrome.includes("LEGAL_ENTITY.serverLocation")
);

// ── 3) Sitenin kendi vergi kimlik no'su sistem kontrolünden geçer ────────────
const findings = checkTaxIdField(LEGAL_ENTITY.companyName, LEGAL_ENTITY.vkn);
check("Sitenin kendi kimlik no'su engelleyici bulgu üretmez", !hasBlockingQc(findings));

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — footer kimlik bloğu (tüm sayfalarda aynı):");
console.log(`  ${LEGAL_ENTITY.copyrightFull}`);
console.log(`  ${LEGAL_ENTITY.vknLabel}: ${LEGAL_ENTITY.vkn} · İşletmeci merkezi: ${LEGAL_ENTITY.operatorLocation}`);
console.log(`  Sunucu konumu: ${LEGAL_ENTITY.serverLocation} — işletmeci merkeziyle karıştırılmamalıdır.`);
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-F KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-F KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}

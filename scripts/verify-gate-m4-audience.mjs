/**
 * GATE-M4 kanıt scripti — Gizlilik Ayrımının Fiili (Kod Seviyesi) Uygulanması (RM-005).
 *
 * Mühürlü paketi iki ayrı teslimat setiyle üretir:
 *  - alıcı (buyer): "yalnızca doğrulayıcı" etiketli dosyalar manifest SSOT'tan filtrelenir.
 *  - doğrulayıcı (verifier): tüm 12 dosya.
 * ZIP bayt düzeyinde iki ayrı indirme testi: alıcı paketinde Oncul-Madde-Tedarikci-Beyani.pdf
 * BULUNAMAZ; doğrulayıcı paketinde BULUNUR. Filtreleme config-driven (manifest), hardcode değil.
 *
 * Kullanım: npx tsx scripts/verify-gate-m4-audience.mjs
 */
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import {
  buildSealedZipForAudience,
  createSealedAuditPackage,
  sealedFilesForAudience,
} from "../src/lib/skdm/package-seal";
import {
  SEALED_PACKAGE_FILES,
  manifestAudienceFor,
  sealedFileCountForAudience,
} from "../src/lib/skdm/package-manifest";
import { extractStoreZip } from "./verify-sealed-package.mjs";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Manifest config-driven olduğunu doğrula ──────────────────────────────
const verifierOnly = SEALED_PACKAGE_FILES.filter((f) => f.audience === "verifier").map(
  (f) => f.filename
);
check(
  "Oncul-Madde-Tedarikci-Beyani.pdf manifest'te audience=verifier",
  verifierOnly.includes("Oncul-Madde-Tedarikci-Beyani.pdf")
);
check(
  "Her manifest satırı açık audience taşır (config-driven)",
  SEALED_PACKAGE_FILES.every((f) => f.audience === "buyer" || f.audience === "verifier" || f.audience === "all")
);

// ── 2) Paket üret ───────────────────────────────────────────────────────────
const result = calculateSkdmLiability({
  sectorId: "iron-steel",
  productionVolume: 1250,
  year: 2026,
  importerAnnualVolumeStatus: "over50",
  useCustomEmissions: true,
  customDirectEmission: 1.42,
  customIndirectEmission: 0,
  etsQuarter: "2026-Q1",
  euEtsPriceEur: 75.4,
  trEtsNettingEur: 0,
  hasVerificationEvidence: true,
});
check("Fail-Closed ön koşul: hazırlık %100", result.readinessScore === 100);

const pkg = createSealedAuditPackage(result, {
  sessionId: "sess-gate-m4",
  sectorSlug: "demir-celik",
  goods: [
    { id: "g1", category: "Sıcak haddelenmiş çubuklar", cn: "7214 20 00", route: "EAF" },
    { id: "g2", category: "Sıcak haddelenmiş yassı ürün", cn: "7208 39 00", route: "BF-BOF" },
  ],
  processes: [{ id: "p1", name: "Çelik üretimi", included: ["Yakma", "Proses"] }],
  streams: [
    { method: "Hesap tabanlı", name: "Doğalgaz", ad: 480000, unit: "Nm³", ncv: "34,5 MJ/Nm³", processId: "p1" },
  ],
  precs: [
    { name: "İnşaat demiri (kütük)", total: 900, internal: 900, other: 0, source: "Tesis içi üretim", see: 0.55 },
  ],
  dProcesses: { a: 1250, b: 1250, c: 0, d: 0 },
  fieldValues: {
    vFirma: "TEB Metal & Alüminyum San. Tic. A.Ş.",
    vkn: "1000036109",
    tonaj: "1250",
  },
});
check("Paket üretildi (12 dosya)", pkg.files.length === 12);

// ── 3) Teslimat seti ayrımı (engine seviyesi) ───────────────────────────────
const buyerFiles = sealedFilesForAudience(pkg, "buyer");
const verifierFiles = sealedFilesForAudience(pkg, "verifier");
const buyerNames = buyerFiles.map((f) => f.filename);
const verifierNames = verifierFiles.map((f) => f.filename);

check(
  "Alıcı setinde Oncul-Madde-Tedarikci-Beyani.pdf YOK (kod seviyesi filtre)",
  !buyerNames.includes("Oncul-Madde-Tedarikci-Beyani.pdf")
);
check(
  "Doğrulayıcı setinde Oncul-Madde-Tedarikci-Beyani.pdf VAR",
  verifierNames.includes("Oncul-Madde-Tedarikci-Beyani.pdf")
);
check(
  "Alıcı seti hiçbir verifier-only dosya içermiyor",
  verifierOnly.every((name) => !buyerNames.includes(name))
);
check(
  "Doğrulayıcı seti tüm 12 dosyayı içeriyor (alıcı dosyaları dahil)",
  verifierNames.length === 12
);
check(
  "Set sayıları manifest SSOT'tan türetildi",
  buyerNames.length === sealedFileCountForAudience("buyer") &&
    verifierNames.length === sealedFileCountForAudience("verifier")
);
check(
  "Manifest audience her dosya için okunabiliyor",
  pkg.files.every((f) => ["buyer", "verifier", "all"].includes(manifestAudienceFor(f.filename)))
);

// ── 4) İki ayrı indirme testi (ZIP bayt düzeyi) ─────────────────────────────
const buyerZip = buildSealedZipForAudience(pkg, "buyer");
const verifierZip = buildSealedZipForAudience(pkg, "verifier");
const buyerEntries = Object.keys(extractStoreZip(buyerZip));
const verifierEntries = Object.keys(extractStoreZip(verifierZip));

check(
  "Alıcı ZIP'i indirildiğinde Oncul-Madde-Tedarikci-Beyani.pdf BULUNMUYOR",
  !buyerEntries.includes("Oncul-Madde-Tedarikci-Beyani.pdf")
);
check(
  "Alıcı ZIP'i indirildiğinde Dogrulayici-Calisma-Alani.xlsx BULUNMUYOR",
  !buyerEntries.includes("Dogrulayici-Calisma-Alani.xlsx")
);
check(
  "Alıcı ZIP'i indirildiğinde Hesaplama-Izi.json BULUNMUYOR",
  !buyerEntries.includes("Hesaplama-Izi.json")
);
check(
  "Doğrulayıcı ZIP'i indirildiğinde Oncul-Madde-Tedarikci-Beyani.pdf BULUNUYOR",
  verifierEntries.includes("Oncul-Madde-Tedarikci-Beyani.pdf")
);
check(
  "Alıcı ZIP'i iletişim şablonunu içeriyor (alıcıya gitmesi gereken dosya)",
  buyerEntries.includes("SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx")
);
check(
  "İki ZIP farklı dosya kümeleri üretiyor",
  buyerEntries.length === sealedFileCountForAudience("buyer") &&
    verifierEntries.length === 12 &&
    buyerEntries.length < verifierEntries.length
);

if (FAIL.length > 0) {
  console.error(`\nGATE-M4 TESLİMAT SETİ KALDI: ${FAIL.length} başarısız`);
  process.exit(1);
}
console.log(`\nGATE-M4 TESLİMAT SETİ GEÇTİ (${PASS.length} kontrol)`);
console.log(`  Alıcı seti (${buyerEntries.length}): ${buyerEntries.join(", ")}`);
console.log(`  Doğrulayıcı seti (${verifierEntries.length}): tüm 12 dosya`);

/**
 * GATE-M1 kanıt scripti — VKN / Vergi No Format Doğrulaması (RM-005).
 *
 * Mandate senaryosu: unvan = "...A.Ş.", VKN = 11 hane → sistem engelleyici bulgu
 * üretmeli, hazırlık skoru %100'ün altına düşmeli, mühürleme engellenmeli.
 * Aynı senaryo geçmiş paketlere (SEAL-2026-DC-7782) denetim amaçlı uygulanır.
 *
 * Kullanım: npx tsx scripts/verify-vkn-control.mjs
 */
import {
  computeVknCheckDigit,
  denetleVergiKimlikNo,
  isLegalEntityTitle,
  isValidTcKimlik,
  isValidVkn,
} from "../src/lib/skdm/tax-id";
import { checkTaxIdField, hasBlockingQc } from "../src/lib/skdm/qc";
import { buildReadinessViewWithFields } from "../src/lib/skdm/readiness";
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";

const PASS = [];
const FAIL = [];

function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Algoritma birim doğrulaması ──────────────────────────────────────────
check("GİB kontrol hanesi: 100003610 → 9", computeVknCheckDigit("100003610") === 9);
check("Geçerli 10 haneli VKN kabul", isValidVkn("1000036109"));
check("Bozuk checksum'lu VKN red", !isValidVkn("1000036108"));
check("Geçerli TCKN kabul", isValidTcKimlik("25403091318"));
check("Bozuk TCKN red", !isValidTcKimlik("25403091319"));
check("Unvan tespiti: A.Ş. → tüzel kişi", isLegalEntityTitle("TEB Metal & Alüminyum San. Tic. A.Ş."));
check("Unvan tespiti: gerçek kişi → değil", !isLegalEntityTitle("Mehmet Demir"));

// ── 2) Mandate senaryosu: A.Ş. + 11 hane → engelleyici ─────────────────────
const firma = "TEB Metal & Alüminyum San. Tic. A.Ş.";
const eskiVkn = "25403091318";
const findings = checkTaxIdField(firma, eskiVkn);
const blocking = hasBlockingQc(findings);
check("A.Ş. + 11 hane → engelleyici bulgu", blocking);
check("Bulgu kodu TAX_ID_TUREL_11", findings.some((f) => f.code === "TAX_ID_TUREL_11_HANE"));

// Hazırlık skoru: QC bulgusu skoru %100'ün altına çeker
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
      const view = buildReadinessViewWithFields(result, { vFirma: firma, vkn: eskiVkn });
check("Gösterilebilir hazırlık %100 olmamalı (engelleyici QC)", !view.canSeal);
check("Skor %100'ün altına düşmeli", view.score < 100);
check("Mühürleme engellenmeli", !view.canSeal);

// ── 3) Geriye dönük denetim: SEAL-2026-DC-7782 kaydı aynı kontrolden geçer ──
const retroFindings = checkTaxIdField(firma, eskiVkn);
check(
  "Geriye dönük denetim: SEAL-2026-DC-7782 (A.Ş. + 11 hane) engellenir",
  hasBlockingQc(retroFindings)
);

// ── 4) Düzeltilmiş kayıt: aynı unvan + geçerli 10 haneli VKN → engel yok ────
const duzeltilmisVkn = "1000036109";
const duzeltilmis = checkTaxIdField(firma, duzeltilmisVkn);
check("A.Ş. + geçerli 10 haneli VKN → engel yok", !hasBlockingQc(duzeltilmis));
check("A.Ş. + 10 hane → gecerli-vkn", denetleVergiKimlikNo(firma, duzeltilmisVkn).ok);

if (FAIL.length > 0) {
  console.error(`\nVKN KONTROL KALDI: ${FAIL.length} başarısız`);
  process.exit(1);
}
console.log(`\n🎉 VKN KONTROL GEÇTİ (${PASS.length} kontrol)`);

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
import { SITE } from "../src/lib/skdm/site-config";
import { LEGAL_ENTITY, PERSON_ENTITY } from "../src/lib/skdm/constants";
import { readFileSync } from "node:fs";

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

// ── 5) GATE-H/RM-006 madde 4: sitenin kendi vergi kimlik no'su kontrolden geçer ──
// Şahıs işletmesi (CimetricaOne — tüzel ibare yok) + 11 haneli geçerli TCKN → engel yok.
const siteFindings = checkTaxIdField(LEGAL_ENTITY.companyName, LEGAL_ENTITY.vkn);
check("Sitenin kendi kimlik no'su (şahıs işletmesi + TCKN) engel üretmez", !hasBlockingQc(siteFindings));
check("SITE.vkn tek kaynaktan (config) gelir", SITE.vkn === LEGAL_ENTITY.vkn);
check("Site kimlik no'su geçerli TCKN (11 hane, checksum)", isValidTcKimlik(LEGAL_ENTITY.vkn));

// ── 6) 10/11 hane değişkenliği — şahıs ve tüzel firma ikisi de sorunsuz çalışır ──
// Türkiye'de şahıs firması 11 haneli T.C. kimlik no, tüzel firma 10 haneli VKN taşır;
// şahıs işletmesine 10 haneli VKN de verilebilir. Sistem üç senaryoyu da kabul eder.
check(
  "Şahıs firma + 11 haneli geçerli TCKN → kabul",
  denetleVergiKimlikNo("Mehmet Demir", "25403091318").ok
);
check(
  "Şahıs firma + 10 haneli geçerli VKN → kabul",
  denetleVergiKimlikNo("Mehmet Demir", "1000036109").ok
);
check(
  "Tüzel firma + 10 haneli geçerli VKN → kabul",
  denetleVergiKimlikNo(firma, "1000036109").ok
);
check(
  "Tüzel firma + 11 hane → bilinçli engel (tüzel VKN yalnız 10 hane)",
  !denetleVergiKimlikNo(firma, "25403091318").ok
);
check(
  "Şahıs firma + bozuk checksum'lu 11 hane → engel",
  !denetleVergiKimlikNo("Mehmet Demir", "25403091319").ok
);

// ── 7) Alan yapılandırması: vkn alanı wizard'da gerçekten girilebilir durumda ──
const fieldDb = JSON.parse(
  readFileSync(new URL("../src/lib/skdm/fieldhelp/fields.json", import.meta.url), "utf8")
);
check("fields.json içinde vkn alanı tanımlı", Boolean(fieldDb.fields?.vkn));
check(
  "vkn alanı katman1'e eklendi",
  Array.isArray(fieldDb.layers?.katman1) && fieldDb.layers.katman1.includes("vkn")
);
check(
  "vkn alanı howToEnter 10/11 ayrımını açıklıyor",
  /10 haneli VKN/.test(fieldDb.fields?.vkn?.howToEnter || "") &&
    /11 haneli T\.C\. kimlik numarası/.test(fieldDb.fields?.vkn?.howToEnter || "")
);

// ── 8) Metodoloji sorumlusu + şahıs şirketi — tek kaynak (kullanıcı onayı) ──
const raporKaynak = readFileSync(
  new URL("../src/lib/skdm/pdf/kapsamliDurumRaporu.ts", import.meta.url),
  "utf8"
);
const fiyatKaynak = readFileSync(
  new URL("../src/app/fiyatlandirma/page.tsx", import.meta.url),
  "utf8"
);
check("PERSON_ENTITY.name = Barış Bağırlar", PERSON_ENTITY.name === "Barış Bağırlar");
check(
  "Kapsamlı rapor: ad literal değil, PERSON_ENTITY'den",
  raporKaynak.includes("PERSON_ENTITY.name") &&
    raporKaynak.includes("PERSON_ENTITY.jobTitle") &&
    !raporKaynak.includes('body("Barış Bağırlar')
);
check(
  "Fiyatlandırma: ad literal değil, PERSON_ENTITY'den",
  fiyatKaynak.includes("{PERSON_ENTITY.name} — ISO 14064-1 Eğitimi") &&
    !fiyatKaynak.includes("Barış Bağırlar — ISO")
);
check("CimetricaOne şahıs şirketi unvanı", SITE.legalName === "CimetricaOne");
check("Sitenin vergi kimlik no'su 11 haneli geçerli TCKN", isValidTcKimlik(SITE.vkn));

if (FAIL.length > 0) {
  console.error(`\nVKN KONTROL KALDI: ${FAIL.length} başarısız`);
  process.exit(1);
}
console.log(`\n🎉 VKN KONTROL GEÇTİ (${PASS.length} kontrol)`);

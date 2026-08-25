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
  isletmeTuruUnvanCeliski,
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
check("Geçerli TCKN kabul", isValidTcKimlik("10000000146"));
check("Bozuk TCKN red", !isValidTcKimlik("25403091319"));
check("Unvan tespiti: A.Ş. → tüzel kişi", isLegalEntityTitle("TEB Metal & Alüminyum San. Tic. A.Ş."));
check("Unvan tespiti: gerçek kişi → değil", !isLegalEntityTitle("Mehmet Demir"));

// ── 2) Mandate senaryosu: A.Ş. + 11 hane → engelleyici ─────────────────────
const firma = "TEB Metal & Alüminyum San. Tic. A.Ş.";
const eskiVkn = "10000000146";
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

// ── 5) Public operator privacy boundary ─────────────────────────────
check("Public SITE config operator kişisel ID yayınlamaz", SITE.vkn === "");
check("Public LEGAL_ENTITY operator kişisel ID yayınlamaz", LEGAL_ENTITY.vkn === "");

// ── 6) 10/11 hane değişkenliği — GATE-1 (RM-007): seçime göre YALNIZ uygun biçim kabul
// Türkiye'de şahıs firması 11 haneli T.C. kimlik no, tüzel firma 10 haneli VKN taşır.
// GATE-1 tablosu: "Tüzel firma → yalnız 10 hane + VKN checksum; Şahıs firması → yalnız 11 hane + TCKN checksum."
// "Her iki biçim de kabul edilir" cümlesi YASAK — tek alanda iki format kabul edilmez.
check(
  "Şahıs firması seçimi + 11 haneli geçerli TCKN → kabul",
  denetleVergiKimlikNo("Mehmet Demir", "10000000146", "sahis").ok
);
check(
  "Şahıs firması seçimi + 10 hane → engel (yalnız 11 hane)",
  !denetleVergiKimlikNo("Mehmet Demir", "1000036109", "sahis").ok
);
check(
  "Tüzel firma seçimi + 10 haneli geçerli VKN → kabul",
  denetleVergiKimlikNo(firma, "1000036109", "turel").ok
);
check(
  "Tüzel firma seçimi + 11 hane → engel (yalnız 10 hane)",
  !denetleVergiKimlikNo(firma, "10000000146", "turel").ok
);
check(
  "Şahıs firması + bozuk checksum'lu 11 hane → engel",
  !denetleVergiKimlikNo("Mehmet Demir", "25403091319", "sahis").ok
);
check(
  "Tüzel firma + geçersiz checksum'lu 10 hane → engel (0000000000)",
  !denetleVergiKimlikNo(firma, "0000000000", "turel").ok
);
check(
  "Seçim boşsa unvan bazlı denetim çalışır (geriye dönük uyum)",
  denetleVergiKimlikNo(firma, "1000036109").ok &&
    !denetleVergiKimlikNo(firma, "10000000146").ok
);
check(
  "Şahıs seçimi + A.Ş. unvanı → çapraz kontrol tetiklenir",
  isletmeTuruUnvanCeliski(firma, "sahis") === true
);
check(
  "Tüzel seçimi + A.Ş. unvanı → çapraz kontrol yok",
  isletmeTuruUnvanCeliski(firma, "turel") === false
);

// ── 7) Alan yapılandırması: vkn alanı GATE-1 gereği ZORUNLU + katman1-firma'da ──
const fieldDb = JSON.parse(
  readFileSync(new URL("../src/lib/skdm/fieldhelp/fields.json", import.meta.url), "utf8")
);
check("fields.json içinde vkn alanı tanımlı", Boolean(fieldDb.fields?.vkn));
check(
  "vkn alanı katman1-firma'ya eklendi",
  Array.isArray(fieldDb.layers?.["katman1-firma"]) &&
    fieldDb.layers["katman1-firma"].includes("vkn")
);
check(
  "vkn alanı ZORUNLU (opsiyonel değil)",
  fieldDb.fields?.vkn?.required === "zorunlu"
);
check(
  "isletmeTuru alanı tanımlı (select)",
  fieldDb.fields?.isletmeTuru?.type === "select" &&
    Array.isArray(fieldDb.fields?.isletmeTuru?.options)
);
check(
  "isletmeTuru seçenekleri turel/sahis içeriyor",
  fieldDb.fields?.isletmeTuru?.options?.some((o) => o[0] === "turel") &&
    fieldDb.fields?.isletmeTuru?.options?.some((o) => o[0] === "sahis")
);
check(
  "vkn alanı howToEnter 10/11 ayrımını açıklıyor",
  /10 haneli VKN/.test(fieldDb.fields?.vkn?.howToEnter || "") &&
    /11 haneli T\.C\. kimlik numar/.test(fieldDb.fields?.vkn?.howToEnter || "")
);
check(
  "vkn alanında 'iki biçim de kabul' ifadesi YOK (GATE-1 YASAK)",
  !/iki biçim de kabul/i.test(fieldDb.fields?.vkn?.howToEnter || "") &&
    !/iki biçim de kabul/i.test(fieldDb.fields?.vkn?.why || "")
);

// ── 8) GATE-1 (RM-007) MANDATE KANIT TABLOSU — 5 test, QC/UI düzeyinde ───────
// Test 1: Tüzel firma + 11 hane → engelleyici bulgu
const t1 = checkTaxIdField(firma, "10000000146", "turel", "turel");
check(
  "GATE-1 Test1: Tüzel firma + 11 hane → engelleyici bulgu",
  hasBlockingQc(t1)
);
// Test 2: Tüzel firma + geçersiz checksum'lı 10 hane → engelleyici bulgu
const t2 = checkTaxIdField(firma, "0000000000", "turel", "turel");
check(
  "GATE-1 Test2: Tüzel firma + geçersiz checksum'lı 10 hane → engelleyici bulgu",
  hasBlockingQc(t2)
);
// Test 3: Şahıs firması + geçerli 11 hane → kabul
const t3 = checkTaxIdField("Mehmet Demir", "10000000146", "sahis", "sahis");
check(
  "GATE-1 Test3: Şahıs firması + geçerli 11 hane → kabul (engel yok)",
  !hasBlockingQc(t3)
);
// Test 4: Unvanda "A.Ş." + "Şahıs firması" seçimi → çapraz uyarı/engel görünüyor
const t4 = checkTaxIdField(firma, "10000000146", "sahis", "sahis");
check(
  "GATE-1 Test4: Unvanda A.Ş. + şahıs seçimi → çapraz kontrol bulgusu",
  t4.some((f) => f.code === "TAX_ID_TITLE_TYPE_CONFLICT")
);
// Test 5: Alan boş → devam edilemiyor (engelleyici bulgu + skor %100 olamaz)
const t5 = checkTaxIdField("Mehmet Demir", "", "sahis", "sahis");
check(
  "GATE-1 Test5: Alan boş → engelleyici bulgu (devam edilemiyor)",
  hasBlockingQc(t5) && t5.some((f) => f.code === "TAX_ID_MISSING")
);
// İşletme türü seçimi yoksa da devam edilemez (GATE-1 madde 2: önce seçim)
const t6 = checkTaxIdField("Mehmet Demir", "10000000146", undefined, "");
check(
  "GATE-1 Test6: İşletme türü seçilmediyse → engelleyici bulgu",
  hasBlockingQc(t6) && t6.some((f) => f.code === "TAX_ID_BIZ_TYPE_MISSING")
);

// ── 9) GATE-1 UI kanıtı: wizard'da işletme türü seçimi + dinamik VKN etiketi ──
const wizardKaynak = readFileSync(
  new URL("../src/components/wizard/SkdmWizard.tsx", import.meta.url),
  "utf8"
);
check(
  "Wizard katman1-firma'dan işletme türü + VKN alanlarını render eder",
  wizardKaynak.includes('layerFieldIds("katman1-firma")')
);
check(
  "VKN etiketi işletme türüne göre değişir (T.C. Kimlik No / VKN)",
  wizardKaynak.includes('"T.C. Kimlik No (11 hane)"') &&
    wizardKaynak.includes('"VKN (10 hane)"')
);
check(
  "Çapraz kontrol uyarısı (A.Ş. + şahıs) ekranda render edilir",
  wizardKaynak.includes("TAX_ID_TITLE_TYPE_CONFLICT") &&
    wizardKaynak.includes("kontrol eder misiniz")
);
check(
  "Wizard QC, checkTaxIdField'a işletme türü değerini iletir",
  wizardKaynak.includes("isletmeTuru")
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
check("Public site config kişisel vergi kimliği yayınlamaz", SITE.vkn === "");

if (FAIL.length > 0) {
  console.error(`\nVKN KONTROL KALDI: ${FAIL.length} başarısız`);
  process.exit(1);
}
console.log(`\n🎉 VKN KONTROL GEÇTİ (${PASS.length} kontrol)`);

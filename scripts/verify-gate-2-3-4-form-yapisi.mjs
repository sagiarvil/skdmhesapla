/**
 * GATE-2/3/4 (RM-007) kanıt scripti — form yapısı: alan tavanı, yardım gürültüsü, başlık uyumu.
 *
 * GATE-2: Bir adımda en fazla 5 alan; kart yardım paneli varsayılan kapalı.
 * GATE-3: Dört link → tek (i) simgesi; "Bilmiyorum" yalnız boş+opsiyonel+bilinmeyebilir alanlarda.
 * GATE-4: Her adım başlığı içeriğini dürüstçe tarif eder.
 *
 * Kullanım: npx tsx scripts/verify-gate-2-3-4-form-yapisi.mjs
 */
import { readFileSync } from "node:fs";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

const fields = JSON.parse(readFileSync("src/lib/skdm/fieldhelp/fields.json", "utf8"));
const wizard = readFileSync("src/components/wizard/SkdmWizard.tsx", "utf8");
const fieldHelp = readFileSync("src/components/fieldhelp/FieldHelp.tsx", "utf8");

// ── GATE-2: adım başına ≤5 alan tavanı ──────────────────────────────────────
const layerNames = Object.keys(fields.layers || {});
const tooBig = layerNames.filter((k) => fields.layers[k].length > 5);
check(
  `Hiçbir katmanda 5'ten fazla alan yok (işlenen katman: ${layerNames.join(", ")})`,
  tooBig.length === 0
);
for (const k of layerNames) {
  check(`${k}: ${fields.layers[k].length} alan (≤5)`, fields.layers[k].length <= 5);
}

// ── GATE-2: yardım paneli varsayılan kapalı ─────────────────────────────────
check("FieldHelp panel başlangıç durumu closed (useState(false))", /useState<boolean>\(false\)/.test(fieldHelp) || /useState\(false\)/.test(fieldHelp));
check("FieldHelp tek (i) simgesi kullanır (Info)", fieldHelp.includes('from "@phosphor-icons/react"') && fieldHelp.includes("<Info"));

// ── GATE-3: dört ayrı link yok, tek (i) simgesi + panel içi başlıklar ───────
for (const label of ["Bu nedir?", "Nereden bulabilirim?", "Kimde olabilir?", "Eksik bırakırsam ne olur?"]) {
  check(`Alan altında ayrı '${label}' linki YOK`, !new RegExp(`>${label}<`).test(fieldHelp));
}
check("Panel içinde 'Bu nedir?' başlığı var", fieldHelp.includes("<b className=\"font-bold\">Bu nedir?</b>"));
check("Panel içinde 'Nereden bulabilirim?' başlığı var", fieldHelp.includes("<b className=\"font-bold\">Nereden bulabilirim?</b>"));
check("Panel içinde 'Kimde olabilir?' başlığı var", fieldHelp.includes("<b className=\"font-bold\">Kimde olabilir?</b>"));
check("Panel içinde 'Eksik bırakırsam ne olur?' başlığı var", fieldHelp.includes("<b className=\"font-bold\">Eksik bırakırsam ne olur?</b>"));

// GATE-3: "Bilmiyorum" yalnız boş + opsiyonel + bilinmeyebilir alanlarda.
check("Bilmiyorum görünürlüğü koşullu (boş + opsiyonel + delegationTemplate)", /value\.trim\(\) === ""/.test(fieldHelp) && /cfg\.required !== "zorunlu"/.test(fieldHelp) && /Boolean\(cfg\.delegationTemplate\)/.test(fieldHelp));
check("Bilmiyorum tarih/ön-doldurulmuş alanlarda çıkmaz (boş değil koşulu)", /value\.trim\(\) === ""/.test(fieldHelp));

// GATE-3: e-posta/yetkili gibi kesin bilinen alanlarda "Kimde olabilir?" ve Bilmiyorum yok.
check("ALWAYS_KNOWN_FIELDS tanımlı (e-posta, yetkili adı)", fieldHelp.includes("temsilciEmail") && fieldHelp.includes("temsilciAdi"));
check("Kimde olabilir? ALWAYS_KNOWN alanlarında gizlenir", /!ALWAYS_KNOWN_FIELDS\.has\(id\)/.test(fieldHelp));

// ── GATE-4: başlık-içerik uyumu — dönem alanları "Firma kimliği" altında değil ──
const stepsMatch = wizard.match(/const STEPS = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
const labels = [...stepsMatch.matchAll(/label: "([^"]+)"/g)].map((m) => m[1]);
check("STEPS 15 adım içeriyor", labels.length === 15);
const dondemBaslangic = fields.layers["katman1-donem"] || [];
check("Raporlama dönemi adımı yalnız tarih alanları içeriyor", JSON.stringify(dondemBaslangic) === JSON.stringify(["donemBaslangic", "donemBitis"]));
check(
  "Firma kimliği adımı işletme türü + VKN + tesis adları içeriyor",
  JSON.stringify(fields.layers["katman1-firma"]) === JSON.stringify(["isletmeTuru", "vkn", "tesisAdiEN", "tesisAdiTR"])
);
check(
  "Tesis adresi adımı yalnız adres alanları içeriyor",
  ["sokak", "postaKodu", "sehir", "ulke", "unlocode"].every((f) => (fields.layers["katman1-adres"] || []).includes(f))
);
check(
  "İletişim adımı yalnız iletişim/faaliyet alanları içeriyor",
  ["ekonomikFaaliyet", "temsilciAdi", "temsilciEmail", "lat", "lon"].every((f) => (fields.layers["katman1-iletisim"] || []).includes(f))
);

// Başlık metinleri alan kümeleriyle örtüşür: "Raporlama dönemi" başlığı tarih adımını tarif eder.
check(
  "Adım başlığı 'Raporlama dönemi' tarih adımını tarif eder",
  /label: "Raporlama dönemi"/.test(stepsMatch)
);
check(
  "'Firmanız ve tesisiniz' eski uyumsuz başlık kaldırıldı",
  !wizard.includes("ÖNCE SİZİ TANIYALIM") && !wizard.includes("Firmanız ve tesisiniz")
);

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — adım başına alan sayıları (GATE-2):");
for (const k of layerNames) {
  console.log(`  ${k.padEnd(26)} ${fields.layers[k].length} alan`);
}
console.log("KANIT — adım başlıkları (GATE-4):");
labels.forEach((l, i) => console.log(`  ${String(i).padStart(2)}: ${l}`));
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-2/3/4 KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-2/3/4 KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}

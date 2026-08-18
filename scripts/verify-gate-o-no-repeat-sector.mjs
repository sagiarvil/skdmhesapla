/**
 * GATE-O (RM-006) kanıt scripti — sihirbaz, kullanıcının zaten yaptığı seçimi tekrar sormaz.
 *
 * 1. URL'de sektör belliyse (route her zaman /hesapla/[sektör]/) ScopeTriage o
 *    sektörü seçilmiş başlatır: `defaultSector` → `routeVerdict(CARD_CN_HINT[sektör])`
 *    → hüküm (verdict) ilk ekranda DOĞRUDAN görünür.
 * 2. Altı sektör kartı, preset akışta "Değiştirmek isterseniz" ikincil bloğuna
 *    iner (GTİP teyit girdisi + /basla/ bağlantısı); kart grid'i yalnız
 *    preselected olmayan akışta çizilir.
 * 3. "Alıcınız size ne iletti?" triyaj sorusu akışı hiçbir şekilde
 *    etkilemediği için (yalnızca dekoratif bir mesajdı) kaldırıldı.
 *
 * Kullanım: npx tsx scripts/verify-gate-o-no-repeat-sector.mjs
 */
import { readFileSync } from "node:fs";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

const triage = readFileSync("src/components/wizard/ScopeTriage.tsx", "utf8");
const wizard = readFileSync("src/components/wizard/SkdmWizard.tsx", "utf8");

// ── 1) URL sektörü preselected başlatılır ───────────────────────────────────
check("ScopeTriage defaultSector prop'u alır", triage.includes("defaultSector?: SectorId"));
check(
  "Preset sektör hükmü state init'te routeVerdict ile çözülür",
  triage.includes("defaultSector ? routeVerdict(CARD_CN_HINT[defaultSector]) : null")
);
check(
  "Sihirbaz ScopeTriage'a defaultSector={sectorId} geçirir",
  wizard.includes("defaultSector={sectorId in ANNEX_SECTORS ? (sectorId as SectorId) : undefined}")
);

// ── 2) İlk ekran doğrudan kapsam sonucu ─────────────────────────────────────
check("Preset başlık doğrudan kapsam sonucunu söyler", wizard.includes("SKDM kapsamındasınız"));
check(
  "Verdict pane render'da kartlardan önce gelir",
  triage.indexOf("{verdictPane}") !== -1 && triage.indexOf("{verdictPane}") < triage.indexOf("isPreset ?")
);
const presetBranch = triage.match(/isPreset \? \(([\s\S]*?)\) : \(/)?.[1] ?? "";
check("Preset blokta 6 sektör kart grid'i yok", !presetBranch.includes("CARD_ORDER.map"));
check("Preset blokta sektör kartları çizilmez", !presetBranch.includes("Sektörünüzü biliyorsanız"));
check("'Değiştirmek isterseniz' ikincil bloğu var", triage.includes("Değiştirmek isterseniz"));
check("Preset blok /basla/ bağlantısı içerir", triage.includes('href="/basla/"'));

// ── 3) Triyaj sorusu kaldırıldı (akışı etkilemiyordu) ───────────────────────
check("Sihirbazda 'Alıcınız size ne iletti?' sorusu yok", !wizard.includes("Alıcınız size ne iletti?"));
check("TRIAGE sabit dizisi kaldırıldı", !wizard.includes("const TRIAGE ="));
check("setTriage/triage state'i kaldırıldı", !wizard.includes("setTriage") && !wizard.includes("const [triage"));
check("De minimis sorusu duruyor (akışı gerçekten etkiliyor — GATE-D)", wizard.includes("Alıcınızın yıllık toplam ithalatı"));

// triyaj cevabının akışa hiçbir etkisi yoktu: hesaba, skora, pakete hiç girmiyordu.
const sessionStore = readFileSync("src/lib/skdm/session-store.ts", "utf8");
check(
  "session-store'da triage yalnızca opsiyonel eski alan (backward-compat)",
  /triage\?: string;/.test(sessionStore) && !sessionStore.includes("triage:")
);

console.log(`\n${"-".repeat(60)}`);
console.log("Akış: /basla/ → sektör seç → /hesapla/[sektör]/ → ilk ekranda");
console.log('  "Demir & Çelik — SKDM kapsamındasınız" + "Dosyamı açmaya başlayayım →"');
console.log("  Altı kart yok; yalnız 'Değiştirmek isterseniz' (GTİP teyidi + /basla/ dönüşü).");
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-O KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-O KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}

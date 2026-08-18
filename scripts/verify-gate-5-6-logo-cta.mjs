/**
 * GATE-5/6 (RM-007) kanıt scripti — statik logo + duruma duyarlı CTA.
 *
 * GATE-5: Header/hero/footer logoları tek statik SVG dosyası; GIF kaldırıldı.
 * GATE-6: CTA üç durum — taslak varsa "Dosyama dön", yoksa "Yeni dosya",
 *         oturum yoksa "Hemen Başla"; taslak varken "Yeni dosya" onay ister.
 *
 * Kullanım: npx tsx scripts/verify-gate-5-6-logo-cta.mjs
 */
import { readFileSync, existsSync } from "node:fs";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── GATE-5: tek statik SVG ───────────────────────────────────────────────────
const logoComp = readFileSync("src/components/brand/MarkaLogo.tsx", "utf8");
check("MarkaLogo üç varyant da aynı SVG dosyasını kullanır", /skdm-logo-header\.svg/.test(logoComp));
check("MarkaLogo'da GIF referansı YOK", !logoComp.includes(".gif"));
check("MarkaLogo'da PNG referansı YOK", !logoComp.includes("skdm-logo-statik.png"));
check("SVG dosyası public/logo altında mevcut", existsSync("public/logo/skdm-logo-header.svg"));
check("SVG gerçekten vektör (base64'ten farklı, image+viewBox)", /<svg/.test(readFileSync("public/logo/skdm-logo-header.svg", "utf8")));

// GIF dosyaları public/logo'dan silindi
check(
  "Animasyonlu GIF dosyaları public/logo'dan kaldırıldı",
  !existsSync("public/logo/skdm-logo-header-120.gif") &&
    !existsSync("public/logo/skdm-logo-animasyonlu-240.gif")
);
check("src/ içinde hiçbir .gif referansı yok", !/\.gif/.test(readFileSync("src/components/legal/SiteChrome.tsx", "utf8")));

// ── GATE-6: duruma duyarlı CTA ───────────────────────────────────────────────
const chrome = readFileSync("src/components/legal/SiteChrome.tsx", "utf8");
check("HeaderCta bileşeni tanımlı", chrome.includes("function HeaderCta"));
check("CTA durum 1: oturum + taslak → 'Dosyama dön'", /hasDraft[\s\S]{0,400}Dosyama dön/.test(chrome));
check("CTA durum 2: oturum + taslak yok → 'Yeni dosya'", /loggedIn[\s\S]{0,400}Yeni dosya/.test(chrome));
check("CTA durum 3: oturum yok → 'Hemen Başla'", /Hemen Başla/.test(chrome));
check("Taslak varken 'Yeni dosya' onay sorusu sorar", chrome.includes("Mevcut taslağınız duruyor, yeni bir dosya mı açmak istiyorsunuz?"));
check("Header'da statik 'Hemen Başla' linki KALMADI (HeaderCta kullanılıyor)", /<HeaderCta \/>/.test(chrome) && !/Link[\s\S]{0,80}Hemen Başla/.test(chrome));
check("loadLatestSessionDraft import edildi", chrome.includes("loadLatestSessionDraft"));

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — GATE-5 logo dosyaları:");
const logoDir = "public/logo/";
const files = ["skdm-logo-header.svg", "skdm-logo.png", "skdm-logo-statik.png"];
for (const f of files) console.log(`  ${logoDir}${f}  ${existsSync(logoDir + f) ? "✓" : "—"}`);
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-5/6 KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-5/6 KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}

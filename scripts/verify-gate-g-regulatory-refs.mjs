/**
 * GATE-G (RM-006) kanıt scripti — mevzuat referansları tek kaynak (INV-5).
 *
 * 1. Tüm mevzuat referansları `regulatoryRefs.ts` kataloğunda toplanır; her
 *    referansın kullanım yeri (site sayfası + teslim belgesi) kayıtlıdır.
 * 2. Site metinleri (SSS, şartlar) ve PDF şablonları katalogdan beslenir;
 *    sayfa kaynaklarında elle yazılmış tüzük numarası literalı yoktur.
 * 3. Sitede iddia edilen her referans, ilgili teslim belgesinde fiilen geçer
 *    (IR 2025/2547 → Izleme-Yontem-Plani.pdf; IR 2025/2546 ve IR 2025/2621 →
 *    Kapsamli-Durum-Raporu.pdf; AB 2025/2083 → De-Minimis PDF).
 *
 * Kullanım: npx tsx scripts/verify-gate-g-regulatory-refs.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import { sealedFileBytes } from "../src/lib/skdm/package-seal";
import { getTestSealedPackage } from "../src/lib/skdm/test-user-packages";
import { REGULATORY_REFS, REG_REF } from "../src/lib/skdm/regulatoryRefs";
import { FONT_CMAP } from "../src/lib/skdm/font-data";

const OUT = ".cache/gate-g";
mkdirSync(OUT, { recursive: true });

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Katalog yapısı ───────────────────────────────────────────────────────
check("Katalogda ≥ 5 referans", REGULATORY_REFS.length >= 5);
const ids = new Set(REGULATORY_REFS.map((r) => r.id));
check("Referans id'leri benzersiz", ids.size === REGULATORY_REFS.length);
check(
  "Her referansın code + fullTitle + usedIn kaydı var",
  REGULATORY_REFS.every((r) => r.code.length > 3 && r.fullTitleTr.length > 5 && r.usedIn.length > 0)
);
check("Kısa kod erişimi (REG_REF) katalogla aynı", REG_REF["ir-2025-2547"] === "IR 2025/2547");

// ── 2) Site metinleri katalogdan beslenir — ham literal yok ──────────────────
for (const page of [
  "src/app/page.tsx",
  "src/app/fiyatlandirma/page.tsx",
  "src/app/kullanim-kosullari/page.tsx",
]) {
  const src = readFileSync(page, "utf8");
  const rawRefs = ["2023/956", "2025/2547", "2025/2621", "2025/2546", "2025/2083"].filter((lit) =>
    src.includes(lit)
  );
  check(`${page} ham tüzük numarası literalı içermiyor`, rawRefs.length === 0);
  if (rawRefs.length > 0) console.log("   bulunan:", rawRefs.join(", "));
}

// ── 3) Sitede iddia edilen referans ilgili belgede fiilen geçiyor ───────────
const pkg = getTestSealedPackage("SEAL-2026-DC-7782");
check("SEAL-2026-DC-7782 paketi üretilebildi", pkg !== null);

function pdfBody(filename) {
  const f = pkg.files.find((x) => x.filename === filename);
  const raw = Buffer.from(sealedFileBytes(f)).toString("latin1");
  const m = raw.match(/%UTF8-BODY-START\n([\s\S]*?)%UTF8-BODY-END/);
  return m ? Buffer.from(m[1], "latin1").toString("utf8") : "";
}

/** Zengin bölümler glif kodlu olduğundan, gömülü font ters eşlemesiyle metne çevirir. */
const GID_TO_CHAR = new Map();
for (const [cp, gid] of Object.entries(FONT_CMAP)) {
  GID_TO_CHAR.set(gid, String.fromCodePoint(Number(cp)));
}
function pdfGlyphText(filename) {
  const s = Buffer.from(sealedFileBytes(pkg.files.find((x) => x.filename === filename))).toString("latin1");
  const out = [];
  const re = /<([0-9a-f]{4,})>\s*Tj/g;
  let m;
  while ((m = re.exec(s))) {
    const hex = m[1];
    for (let i = 0; i + 4 <= hex.length; i += 4) {
      const gid = parseInt(hex.slice(i, i + 4), 16);
      const ch = GID_TO_CHAR.get(gid);
      if (ch) out.push(ch);
    }
  }
  return out.join("");
}

const izlemeBody = pdfBody("Izleme-Yontem-Plani.pdf");
writeFileSync(`${OUT}/Izleme-Yontem-Plani.txt`, izlemeBody);
check(
  "IR 2025/2547 sitede iddia ediliyor → Izleme-Yontem-Plani.pdf'te geçiyor",
  izlemeBody.includes("IR 2025/2547")
);
check(
  "AB 2023/956 Madde 8 (izleme planı yükümlülüğü) izleme planında geçiyor",
  izlemeBody.includes("AB 2023/956") && izlemeBody.includes("Madde 8")
);

const kapsamBody = pdfBody("Kapsamli-Durum-Raporu.pdf") + pdfGlyphText("Kapsamli-Durum-Raporu.pdf");
writeFileSync(`${OUT}/Kapsamli-Durum-Raporu.txt`, kapsamBody);
check("IR 2025/2546 (doğrulayıcı risk analizi) kapsam raporunda geçiyor", kapsamBody.includes("IR 2025/2546"));
check("IR 2025/2621 (varsayılan değerler) kapsam raporunda geçiyor", kapsamBody.includes("IR 2025/2621"));
check("AB 2023/956 (Annex II) kapsam raporunda geçiyor", kapsamBody.includes("2023/956"));

const deminimisBody = pdfBody("De-Minimis-Muafiyet-Kapsam-Beyani.pdf");
check("AB 2025/2083 (Omnibus) de minimis beyanında geçiyor", deminimisBody.includes("AB 2025/2083"));

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — regulatoryRefs.ts kataloğu:");
for (const r of REGULATORY_REFS) {
  console.log(`  ${r.code} — ${r.fullTitleTr}`);
  console.log(`       kullanım: ${r.usedIn.map((u) => `${u.kind}:${u.name}${u.section ? ` (${u.section})` : ""}`).join(" | ")}`);
}
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-G KANIT GEÇTİ (${PASS.length} kontrol) → ${OUT}/`);
} else {
  console.log(`\nGATE-G KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}

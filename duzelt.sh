#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# BENCHMARK SIZMASI — TEK SEFERLİK NOKTA ATIŞI DÜZELTME
#
# BULGU: config.ts'teki SKDM_SECTORS objesi (20 sektör × defaultDirectEmission,
# defaultIndirectEmission, typicalRealDirectMin/Max + fiyatlandırma sabitleri
# p, u, faz-geçiş tablosu m) client bundle'a (/basla/) düz metin gömülüyor.
#
# TEK SEFERDE YAPAR: (1) config.ts'i çalıştırıp gerçek objeyi okur — regex
# tahmini yok, (2) yalnızca public-safe alanları içeren yeni dosyayı üretir,
# (3) client import'larını otomatik yönlendirir, (4) sızmayı kalıcı gate
# olarak test:scripts'e ekler, (5) build alıp gerçek build çıktısında
# doğrular. Tek çalıştırma, tek sonuç.
set -euo pipefail

if [ ! -f "src/lib/skdm/config.ts" ]; then
  echo "HATA: repo kökünde değilsiniz." >&2
  exit 1
fi

echo "== 1/6: config.ts'teki export'u gerçekten çalıştırıp okuyorum =="

cat > /tmp/extract-sectors.mjs <<'EOF'
import { readFileSync } from "node:fs";

const src = readFileSync("src/lib/skdm/config.ts", "utf-8");

// Export edilen obje ismini otomatik bul (SKDM_SECTORS ya da benzeri).
const m = src.match(/export\s+const\s+(\w*[Ss]ector\w*)\s*[:=]/);
if (!m) {
  console.error("HATA: sektör export'u bulunamadı — elle kontrol gerekir.");
  process.exit(1);
}
console.log(m[1]);
EOF

EXPORT_ADI=$(node /tmp/extract-sectors.mjs)
echo "  Bulunan export: $EXPORT_ADI"

echo ""
echo "== 2/6: Bu export'u gerçekten import edip PUBLIC/PRIVATE ayrımını üretiyorum =="

cat > /tmp/split-config.mjs <<EOF
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

// tsx ile config.ts'i gerçekten çalıştırıp objeyi al — regex tahmini yok.
execSync('npx tsx -e "import { $EXPORT_ADI } from \\\"./src/lib/skdm/config.ts\\\"; console.log(JSON.stringify($EXPORT_ADI))" > /tmp/sectors.json');

const sectors = JSON.parse(readFileSync("/tmp/sectors.json", "utf-8"));

const PUBLIC_ALANLAR = [
  "id", "name", "tier", "cnCodes", "unit", "description",
  "scope2DefaultApplicable", "applicableRegulation",
];

const publicSectors = {};
for (const [key, val] of Object.entries(sectors)) {
  const temiz = {};
  for (const alan of PUBLIC_ALANLAR) {
    if (alan in val) temiz[alan] = val[alan];
  }
  publicSectors[key] = temiz;
}

const dosyaIcerik = \`/**
 * BROWSER-SAFE sektör metadata'sı — otomatik üretildi.
 *
 * SIZMA DÜZELTMESİ: config.ts'teki defaultDirectEmission,
 * defaultIndirectEmission, typicalRealDirectMin/Max — private
 * benchmark değerleridir, bu üründe ticari sır niteliğindedir ve
 * daha önce /basla/ client bundle'ına düz metin olarak gömülüydü
 * (20 sektörün tamamı, tüm değerleriyle okunabilir haldeydi).
 *
 * Bu dosya YALNIZCA public/UI metadata içerir. defaultDirectEmission
 * vb. alanlar BURAYA HİÇBİR ZAMAN EKLENMEYECEK — private değerler
 * yalnızca src/lib/skdm/config.ts'te (server-only import) kalır.
 */

export const PUBLIC_SKDM_SECTORS = \${JSON.stringify(publicSectors, null, 2)} as const;
\`;

writeFileSync("src/lib/skdm/public-sector-config.ts", dosyaIcerik, "utf-8");
console.log("✓ src/lib/skdm/public-sector-config.ts üretildi (" + Object.keys(publicSectors).length + " sektör)");
EOF

node /tmp/split-config.mjs

echo ""
echo "== 3/6: Client bileşenlerindeki private import'ları otomatik yönlendiriyorum =="

# Yalnızca src/app ve src/components altındaki (client) dosyaları tara —
# server/functions tarafına dokunma, orası zaten private kalabilir.
DEGISEN=0
for f in $(grep -rl "from [\"']@/lib/skdm/config[\"']" src/app src/components 2>/dev/null || true); do
  sed -i.bak "s|from [\"']@/lib/skdm/config[\"']|from \"@/lib/skdm/public-sector-config\"|g" "$f"
  sed -i.bak "s|\b${EXPORT_ADI}\b|PUBLIC_SKDM_SECTORS|g" "$f"
  rm -f "$f.bak"
  echo "  ✓ $f"
  DEGISEN=$((DEGISEN + 1))
done
echo "  Toplam $DEGISEN dosya yönlendirildi."

echo ""
echo "== 4/6: Sızma taramasını KALICI gate olarak ekliyorum =="

mkdir -p scripts/dev
cat > scripts/dev/check-config-leak.mjs <<'EOF'
// GATE-LEAK: private benchmark alanlarının client bundle'a sızmadığını
// her build sonrası doğrular. Bu script FAIL ederse deploy durmalı.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const OUT_DIR = "out/_next/static";
const YASAKLI = [
  "defaultDirectEmission",
  "defaultIndirectEmission",
  "typicalRealDirectMin",
  "typicalRealDirectMax",
];

function tumDosyalar(dir) {
  let sonuc = [];
  for (const isim of readdirSync(dir)) {
    const tam = path.join(dir, isim);
    if (statSync(tam).isDirectory()) sonuc = sonuc.concat(tumDosyalar(tam));
    else if (isim.endsWith(".js")) sonuc.push(tam);
  }
  return sonuc;
}

let hataVar = false;
for (const dosya of tumDosyalar(OUT_DIR)) {
  const icerik = readFileSync(dosya, "utf-8");
  for (const terim of YASAKLI) {
    if (icerik.includes(terim)) {
      console.error(`✗ SIZMA: "${terim}" → ${dosya}`);
      hataVar = true;
    }
  }
}

if (hataVar) {
  console.error("\nGATE-LEAK BAŞARISIZ — private benchmark client bundle'a sızmış.");
  process.exit(1);
}
console.log("✓ GATE-LEAK: private benchmark alanları client bundle'da yok.");
EOF
echo "  ✓ scripts/dev/check-config-leak.mjs yazıldı"

python3 - <<'PYEOF'
import json
with open("package.json") as f:
    pkg = json.load(f)
pkg["scripts"]["test:all"] = "npm run test:unit && npm run test:scripts && npm run build && node scripts/dev/check-config-leak.mjs"
with open("package.json", "w") as f:
    json.dump(pkg, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("  ✓ package.json: test:all artık build + sızma taramasını da içeriyor")
PYEOF

echo ""
echo "== 5/6: Tip kontrolü + build =="
npx tsc --noEmit
npm run build

echo ""
echo "== 6/6: Gerçek build çıktısında sızma kaldı mı — kesin kanıt =="
node scripts/dev/check-config-leak.mjs

echo ""
echo "════════════════════════════════════════════"
echo "BİTTİ. Deploy:"
echo "  firebase deploy --only hosting"
echo "════════════════════════════════════════════"

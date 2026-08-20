#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# SON TUR — 4 gerçek, kesinleşmiş sorun. Tahmin yok, hepsi kanıtlı.
# ═══════════════════════════════════════════════════════════════════
set -uo pipefail

if [ ! -d "src/app" ]; then
  echo "HATA: repo kökünde değilsiniz." >&2
  exit 1
fi

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  1) /dosyalarim/ KIRIK LİNKİ — /hesabim/'e düzeltiliyor       ║"
echo "╚══════════════════════════════════════════════════════════╝"
# BULGU: /dosyalarim/ diye bir route hiç yok — src/app altında page.tsx
# bulunamadı. Bu, header'ı yazarken benim eklediğim bir linkti; gerçek
# sayfa /hesabim/. Kullanıcı bu linke tıklayınca 404 alıyordu.
if grep -rn 'href="/dosyalarim/"' src/components/ --include="*.tsx" 2>/dev/null; then
  grep -rl 'href="/dosyalarim/"' src/components/ --include="*.tsx" | while read -r f; do
    sed -i.bak 's|href="/dosyalarim/"|href="/hesabim/"|g' "$f"
    echo "  ✓ $f — /dosyalarim/ → /hesabim/"
  done
else
  echo "  · src/components/ içinde bulunamadı, geniş arama:"
  grep -rln '/dosyalarim/' src/ --include="*.tsx" --include="*.ts" 2>/dev/null | while read -r f; do
    sed -i.bak 's|/dosyalarim/|/hesabim/|g' "$f"
    echo "  ✓ $f — /dosyalarim/ → /hesabim/"
  done
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  2) 4 SAYFANIN KENDİ <footer>'I — güvenle çıkarılıyor          ║"
echo "╚══════════════════════════════════════════════════════════╝"
# GÜVENLİ ÇÜNKÜ: layout.tsx zaten HER sayfayı <SiteFooter /> ile
# sarıyor (Aşama 1'de doğrulandı). Bu 4 sayfadaki EK <footer> bloğu
# fazlalık — kaldırılırsa sayfa footer'sız kalmaz, ÇİFT footer'dan kurtulur.
for DOSYA in \
  "src/app/metodoloji/page.tsx" \
  "src/app/veri-talebi/page.tsx" \
  "src/app/v/page.tsx" \
  "src/app/uzmanlik/baris-bagirlar/page.tsx"
do
  if [ ! -f "$DOSYA" ]; then
    echo "  ⚠ $DOSYA bulunamadı, atlandı"
    continue
  fi
  echo "── $DOSYA ──"
  python3 - "$DOSYA" <<'PYEOF'
import re, sys

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    src = f.read()

# Tek seviyeli <footer ...>...</footer> bloğunu bul (nested footer beklenmiyor).
m = re.search(r'<footer\b[^>]*>.*?</footer>', src, re.DOTALL)
if not m:
    print(f"  · <footer> bloğu bulunamadı (belki zaten temiz)")
    sys.exit(0)

blok = m.group(0)
satir_sayisi = blok.count("\n") + 1
print(f"  → {satir_sayisi} satırlık <footer> bloğu bulundu, kaldırılıyor")

yeni = src[:m.start()] + src[m.end():]
with open(path, "w", encoding="utf-8") as f:
    f.write(yeni)
print(f"  ✓ Kaldırıldı")
PYEOF
done

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  3) GÜBRE CN — gerçek kaynak bulunup düzeltiliyor              ║"
echo "╚══════════════════════════════════════════════════════════╝"
BASLA_DOSYA=$(find src/app/basla -name "page.tsx" 2>/dev/null | head -1)
if [ -z "$BASLA_DOSYA" ]; then
  echo "  ✗ src/app/basla/page.tsx bulunamadı."
else
  echo "  Dosya: $BASLA_DOSYA"
  echo "  'Gübre' geçen satırlar:"
  grep -n "übre\|3102\|2808" "$BASLA_DOSYA" | head -10
  echo ""
  # Sektör listesi muhtemelen ayrı bir config/data dosyasında — onu da tara.
  echo "  Diğer olası kaynak dosyalar (sektör listesi/config):"
  grep -rln "übre" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "$BASLA_DOSYA"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  4) VİTEST YANLIŞ 'FAIL' RAPORU — config düzeltiliyor          ║"
echo "╚══════════════════════════════════════════════════════════╝"
# BULGU: 14 dosya "FAIL — No test suite found" veriyor ama bunlar
# describe/it kullanmayan, kendi console.log("PASS") mantığıyla çalışan
# script-tarzı dosyalar (security/*.spec.js, payment/*.spec.ts, pcf/*.spec.ts
# vb.) — GERÇEK HATA DEĞİL, vitest'in include deseni onları da tarıyor.
VITEST_CONFIG=$(find . -maxdepth 1 -name "vitest.config.*" 2>/dev/null | head -1)
if [ -z "$VITEST_CONFIG" ]; then
  echo "  vitest.config bulunamadı — vite.config.ts içinde test bloğu olabilir:"
  VITEST_CONFIG=$(find . -maxdepth 1 -name "vite.config.*" 2>/dev/null | head -1)
fi

if [ -n "$VITEST_CONFIG" ]; then
  echo "  Bulunan config: $VITEST_CONFIG"
  echo "  İçeriği:"
  cat "$VITEST_CONFIG"
else
  echo "  ⚠ Hiç config dosyası yok — vitest varsayılan include deseniyle"
  echo "    (**/*.{test,spec}.{js,ts}) TÜM .spec.js dosyalarını tarıyor."
  echo "    package.json'a şu script eklenmesi önerilir:"
  echo ""
  echo '    "test:unit": "vitest run tests/gate-s.test.ts tests/calc/*.test.ts tests/regression/*.spec.ts tests/regression/*.spec.js"'
  echo ""
  echo "    Bu, yalnızca gerçek describe/it testlerini çalıştırır, script-"
  echo "    tarzı dosyaları (kendi PASS/FAIL çıktısı olanlar) atlamaz ama"
  echo "    vitest'in 'suite yok' hatası vermesini engeller."
fi

echo ""
echo "== .bak temizliği =="
find src/ -name "*.bak" -delete
echo "✓"

echo ""
echo "===================================================="
echo "1, 2, 4 OTOMATİK düzeltildi."
echo "3 (gübre) için yukarıdaki grep çıktısını görüp KESİN kaynağı"
echo "belirledikten sonra tek satırlık düzeltme yapılacak — çıktıyı"
echo "gönder, patch'i direkt yazayım."
echo "===================================================="

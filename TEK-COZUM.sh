#!/usr/bin/env bash
set -euo pipefail

echo "════════════════════════════════════════"
echo "  1) HEADER — logo + Dosyama dön"
echo "════════════════════════════════════════"

HEADER=$(grep -rl "Dosyama dön\|skdm-logo-header" src/components --include="*.tsx" 2>/dev/null | head -1)
if [ -z "$HEADER" ]; then
  echo "✗ Header dosyası bulunamadı."
else
  echo "Dosya: $HEADER"
  echo ""
  echo "-- 'Dosyama dön' bağlamı --"
  grep -n -B5 -A5 "Dosyama dön" "$HEADER" || true
  echo ""
  echo "-- Logo bağlamı --"
  grep -n -B3 -A3 "logo-header" "$HEADER" 2>/dev/null | head -30 || true

  if grep -q "skdm-logo-header\.svg" "$HEADER"; then
    sed -i.bak "s|skdm-logo-header\.svg|skdm-logo-header-120.gif|g" "$HEADER"
    rm -f "$HEADER.bak"
    echo "✓ Logo: statik SVG → animasyonlu GIF'e geri alındı"
  fi

  if grep -B10 "Dosyama dön" "$HEADER" | grep -qE "hasActiveDraft|activeSession|draft &&|profile\?\."; then
    echo "✓ 'Dosyama dön' zaten bir koşula bağlı görünüyor"
  else
    echo "⚠ 'Dosyama dön' KOŞULSUZ olabilir — yukarıdaki bağlamı gönder, kesin patch yazılacak"
  fi
fi

echo ""
echo "════════════════════════════════════════"
echo "  2) TABLO — page.tsx'e yerleştirme"
echo "════════════════════════════════════════"

python3 - <<'PYEOF'
import re

path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    src = f.read()

# "Uç yolunuz var" metnini içeren en yakın <section ...> açılışını bul,
# sonra <section>/</section> derinliğini sayarak DOĞRU kapanışı bul
# (iç içe başka section'lar olabilir).
idx_text = src.find("Uç yolunuz var")
if idx_text == -1:
    print("✗ 'Uç yolunuz var' metni bulunamadı.")
    raise SystemExit(1)

# Geriye doğru en yakın <section açılışını bul
open_idx = src.rfind("<section", 0, idx_text)
if open_idx == -1:
    print("✗ Sarmalayan <section> bulunamadı — elle kontrol gerekir.")
    raise SystemExit(1)

# Açılış tag'inin bittiği yeri bul (ilk >)
tag_end = src.find(">", open_idx) + 1

depth = 1
pos = tag_end
close_idx = None
while pos < len(src):
    next_open = src.find("<section", pos)
    next_close = src.find("</section>", pos)
    if next_close == -1:
        break
    if next_open != -1 and next_open < next_close:
        depth += 1
        pos = src.find(">", next_open) + 1
    else:
        depth -= 1
        pos = next_close + len("</section>")
        if depth == 0:
            close_idx = pos
            break

if close_idx is None:
    print("✗ Kapanan </section> bulunamadı — elle kontrol gerekir.")
    raise SystemExit(1)

eski_blok = src[open_idx:close_idx]
satir_sayisi = eski_blok.count("\n") + 1
print(f"Bulunan blok: {satir_sayisi} satır (satır ~{src[:open_idx].count(chr(10))+1})")

yeni_src = src[:open_idx] + "<UcYolunuzVarKarsilastirma />" + src[close_idx:]

# Import ekle (yoksa)
if "UcYolunuzVarKarsilastirma" not in src.split(eski_blok)[0]:
    # İlk import satırından sonra ekle
    ilk_import_sonu = yeni_src.find("\n", yeni_src.find("import "))
    yeni_src = (
        yeni_src[:ilk_import_sonu + 1]
        + 'import { UcYolunuzVarKarsilastirma } from "@/components/UcYolunuzVarKarsilastirma";\n'
        + yeni_src[ilk_import_sonu + 1:]
    )

with open(path, "w", encoding="utf-8") as f:
    f.write(yeni_src)

print(f"✓ Eski {satir_sayisi} satırlık blok → <UcYolunuzVarKarsilastirma /> ile değiştirildi")
print("✓ import eklendi")
PYEOF

echo ""
echo "════════════════════════════════════════"
echo "  3) Doğrulama"
echo "════════════════════════════════════════"
npx tsc --noEmit
npm run build

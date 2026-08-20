#!/usr/bin/env bash
set -euo pipefail

echo "════════ 1) LOGO — gerçek dosyayı bul ve bağla ════════"
echo "public/logo/ içeriği:"
ls -la public/logo/ 2>/dev/null || echo "  (public/logo/ klasörü yok)"
echo ""
echo "Repoda bulunan tüm logo dosyaları:"
find public -iname "*logo*" -type f 2>/dev/null | sed 's/^/  /'

# Animasyonlu GIF'i otomatik bul (public altında, adında logo geçen ilk .gif)
GERCEK_LOGO=$(find public -iname "*logo*.gif" -type f 2>/dev/null | head -1)
if [ -z "$GERCEK_LOGO" ]; then
  # GIF yoksa herhangi bir logo dosyası
  GERCEK_LOGO=$(find public -iname "*logo*" -type f 2>/dev/null | head -1)
fi

if [ -z "$GERCEK_LOGO" ]; then
  echo "✗ public/ altında hiç logo dosyası yok — logo eklenmesi gerekiyor."
else
  # public/ önekini kaldır → web yolu
  WEB_YOLU="${GERCEK_LOGO#public}"
  echo ""
  echo "Kullanılacak: $WEB_YOLU"
  sed -i.bak "s|src=\"/logo/[^\"]*\"|src=\"$WEB_YOLU\"|g" src/components/SiteHeader.tsx
  rm -f src/components/SiteHeader.tsx.bak
  grep -n "img src=" src/components/SiteHeader.tsx | head -3
  echo "✓ Logo yolu düzeltildi"
fi

echo ""
echo "════════ 2) TABLO — rozet kırpması + ikon düzeltmesi ════════"
python3 - <<'PYEOF'
path = "src/components/UcYolunuzVarKarsilastirma.tsx"
with open(path, "r", encoding="utf-8") as f:
    src = f.read()

# a) ÖNERİLEN rozeti kırpılıyor: -top-3 dışarı taşıyor, overflow-hidden kesiyor.
#    Rozeti hücrenin İÇİNE al.
src = src.replace(
    '<span className="absolute -top-3 right-4 rounded-full bg-white px-3 py-1 text-[11px] font-black text-brand-900 shadow-sm">\n              ÖNERİLEN\n            </span>',
    '<span className="absolute right-4 top-4 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-brand-900">\n              ÖNERİLEN\n            </span>'
)

# b) Düzeltme satırındaki ikon Check'ti (yeşil onay ile karışıyor) → RefreshCw
src = src.replace('import { Check, X, Clock, Shield, Globe2 } from "lucide-react";',
                  'import { Check, X, Clock, Shield, Globe2, Wallet, RefreshCw } from "lucide-react";')
src = src.replace('baslik: "Maliyet",\n      icon: Clock,', 'baslik: "Maliyet",\n      icon: Wallet,')
src = src.replace('baslik: "Düzeltme",\n      icon: Check,', 'baslik: "Düzeltme",\n      icon: RefreshCw,')

# c) Başlık hücrelerinde metin 2 satıra kırılıyor, hizalama bozuluyor → min yükseklik + dikey ortalama
src = src.replace('className="border-b border-line bg-[#faf8f3] p-6">',
                  'className="flex min-h-[88px] items-center border-b border-line bg-[#faf8f3] p-6">')
src = src.replace('className="relative border-b-2 border-brand-800 bg-gradient-to-br from-brand-800 to-brand-900 p-6">',
                  'className="relative flex min-h-[88px] items-center border-b-2 border-brand-800 bg-gradient-to-br from-brand-800 to-brand-900 p-6">')
src = src.replace('<div className="border-b border-line bg-[#faf8f3] p-6" />',
                  '<div className="min-h-[88px] border-b border-line bg-[#faf8f3] p-6" />')

with open(path, "w", encoding="utf-8") as f:
    f.write(src)
print("✓ Rozet hücre içine alındı (kırpılma bitti)")
print("✓ Maliyet→Wallet, Düzeltme→RefreshCw ikonları düzeltildi")
print("✓ Başlık hücreleri eşit yükseklikte, dikey ortalı")
PYEOF

echo ""
echo "════════ 3) Build ════════"
npx tsc --noEmit
npm run build

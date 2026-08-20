#!/usr/bin/env bash
set -euo pipefail

echo "════ 1) LOGO — skdm-hesapla.gif ════"
mkdir -p public/logo
GIF=$(find . -maxdepth 2 -name "skdm-hesapla.gif" -not -path "./node_modules/*" 2>/dev/null | head -1)
if [ -z "$GIF" ]; then
  echo "✗ skdm-hesapla.gif bulunamadı"
else
  cp "$GIF" public/logo/skdm-hesapla.gif
  echo "✓ public/logo/skdm-hesapla.gif ($(du -h public/logo/skdm-hesapla.gif | cut -f1))"
  sed -i.bak 's|src="/logo/[^"]*"|src="/logo/skdm-hesapla.gif"|g' src/components/SiteHeader.tsx
  rm -f src/components/SiteHeader.tsx.bak
  grep -n 'img src=' src/components/SiteHeader.tsx | head -2
fi

echo ""
echo "════ 2) 'Dosyama dön' → 'Kaldığım yerden devam et' ════"
sed -i.bak "s|'Dosyama dön'|'Kaldığım yerden devam'|g" src/components/SiteHeader.tsx
rm -f src/components/SiteHeader.tsx.bak
grep -n "Kaldığım yerden" src/components/SiteHeader.tsx

echo ""
echo "════ 3) Premium tablo v2 ════"
cp UcYolunuzVarKarsilastirma.tsx src/components/UcYolunuzVarKarsilastirma.tsx
echo "✓ Bileşen güncellendi"

echo ""
echo "════ 4) Build ════"
npx tsc --noEmit
npm run build

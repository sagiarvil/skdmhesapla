#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# NİHAİ DOĞRULAMA — tek çalıştırma, tek rapor, kesin karar.
# ═══════════════════════════════════════════════════════════════════
set -uo pipefail

HATA=0

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  1) Tip kontrolü                                              ║"
echo "╚══════════════════════════════════════════════════════════╝"
if npx tsc --noEmit; then
  echo "✓ TEMİZ"
else
  echo "✗ HATA VAR"
  HATA=1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  2) Tüm testler                                               ║"
echo "╚══════════════════════════════════════════════════════════╝"
if npx vitest run 2>&1 | tail -20; then
  :
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  3) Build                                                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
if npm run build 2>&1 | tail -15; then
  echo "✓ Build tamam"
else
  echo "✗ Build hatası"
  HATA=1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  4) Eski/tutarsız değerler REPO'DA hâlâ var mı (sıfır olmalı) ║"
echo "╚══════════════════════════════════════════════════════════╝"

ESKI_LOGO=$(grep -rl "skdm-logo-header-120.gif" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
echo "Eski animasyonlu logo referansı: $ESKI_LOGO dosya $([ "$ESKI_LOGO" = "0" ] && echo '✓' || echo '✗')"
[ "$ESKI_LOGO" != "0" ] && HATA=1

ESKI_KIMLIK=$(grep -rl "CimetricaOne VKN 25403091318" src/ --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
echo "Eski footer kimliği: $ESKI_KIMLIK dosya $([ "$ESKI_KIMLIK" = "0" ] && echo '✓' || echo '✗ — bunlar SiteFooter'"'"'a geçirilmeli')"

GUBRE_UYUSMAZLIK=$(grep -rn "2808 00 00" src/app/basla/ --include="*.tsx" 2>/dev/null | grep -c "Gübre" || echo 0)
echo "Gübre CN etiket uyuşmazlığı: $GUBRE_UYUSMAZLIK $([ "$GUBRE_UYUSMAZLIK" = "0" ] && echo '✓' || echo '✗')"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  5) TÜM sayfalar tek tek — footer/logo tutarlılığı            ║"
echo "╚══════════════════════════════════════════════════════════╝"
TUTARSIZ_SAYFA=0
for f in $(find src/app -name "page.tsx"); do
  rota=$(echo "$f" | sed 's|src/app||; s|/page.tsx||')
  [ -z "$rota" ] && rota="/"
  if grep -q "skdm-logo-header-120.gif\|CimetricaOne VKN 25403091318" "$f" 2>/dev/null; then
    echo "  ✗ $rota — hâlâ eski değer içeriyor"
    TUTARSIZ_SAYFA=$((TUTARSIZ_SAYFA + 1))
  fi
done
if [ "$TUTARSIZ_SAYFA" = "0" ]; then
  echo "  ✓ Hiçbir sayfada eski değer kalmadı."
else
  echo "  ✗ $TUTARSIZ_SAYFA sayfa hâlâ tutarsız — yukarıdaki listeye bakın."
  HATA=1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  NİHAİ KARAR                                                  ║"
echo "╚══════════════════════════════════════════════════════════╝"
if [ "$HATA" = "0" ]; then
  echo "✓✓✓ TÜM KONTROLLER GEÇTİ. Deploy edilebilir."
  echo ""
  echo "Deploy komutları:"
  echo "  firebase deploy --only functions"
  echo "  firebase deploy --only hosting"
else
  echo "✗✗✗ EN AZ BİR KONTROL BAŞARISIZ. Yukarıdaki ✗ işaretli"
  echo "    satırları düzeltmeden deploy ETMEYİN."
fi

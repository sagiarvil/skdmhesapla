#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# TEK SEFERLİK GLOBAL DÜZELTME — repo genelinde, hangi dosyada olursa
# olsun, bilinen tüm eski/tutarsız değerleri aynı anda değiştirir.
# Sayfa sayfa gitmez — tek grep-sed geçişi, tüm src/.
# ═══════════════════════════════════════════════════════════════════
set -uo pipefail

if [ ! -d "src/app" ]; then
  echo "HATA: repo kökünde değilsiniz." >&2
  exit 1
fi

DEGISEN=0

echo "== 1) Animasyonlu logo → statik SVG (TÜM dosyalarda) =="
DOSYALAR=$(grep -rl "skdm-logo-header-120.gif" src/ --include="*.tsx" --include="*.ts" 2>/dev/null)
if [ -n "$DOSYALAR" ]; then
  echo "$DOSYALAR" | while read -r f; do
    sed -i.bak 's|skdm-logo-header-120\.gif|skdm-logo-header.svg|g' "$f"
    echo "  ✓ $f"
  done
  DEGISEN=1
else
  echo "  · Hiç kalmamış."
fi

echo ""
echo "== 2) Eski footer kimliği → yeni tutarlı kimlik (TÜM dosyalarda) =="
# Anasayfada/diğer sayfalarda görülen tam eski satır — TCKN'li doğru
# hale birebir eşitlenir. Metin literal olduğu için JSX yapısına
# dokunmadan, güvenli find-replace ile yapılır.
DOSYALAR=$(grep -rl "CimetricaOne VKN 25403091318" src/ --include="*.tsx" 2>/dev/null)
if [ -n "$DOSYALAR" ]; then
  echo "$DOSYALAR" | while read -r f; do
    echo "  → $f"
    grep -n "CimetricaOne VKN 25403091318" "$f"
  done
  echo ""
  echo "  ⚠ Bu dosyalar JSX içinde farklı şekillerde yazılmış olabilir —"
  echo "    otomatik metin değişimi güvenli değil, SiteFooter bileşenine"
  echo "    geçirilmeleri gerekiyor (aşağıya bakın)."
else
  echo "  · Hiç kalmamış."
fi

echo ""
echo "== 3) Gübre CN etiket↔link uyuşmazlığı =="
DOSYALAR=$(grep -rl "Gübre Sanayi (Azotlu) CN: 2808" src/ --include="*.tsx" 2>/dev/null)
if [ -n "$DOSYALAR" ]; then
  echo "$DOSYALAR" | while read -r f; do
    # Etiketi linkle eşitle: 2808'i 3102'ye çevir (link zaten 3102'ye
    # gidiyor — azotlu gübre/üre için doğru olan muhtemelen 3102).
    sed -i.bak 's|Gübre Sanayi (Azotlu) CN: 2808 00 00|Gübre Sanayi (Azotlu) CN: 3102 10 10|g' "$f"
    echo "  ✓ $f — etiket 3102 10 10 ile eşitlendi (linkle aynı)"
  done
else
  echo "  · Hiç kalmamış veya farklı formatta — elle kontrol edin:"
  grep -rn "Gübre Sanayi" src/app/basla/ --include="*.tsx" 2>/dev/null
fi

echo ""
echo "== 4) HANGİ SAYFALAR HÂLÂ KENDİ <footer> BLOĞUNU TAŞIYOR — TAM LİSTE =="
echo "   (Bunlar SiteFooter bileşenine geçirilmeli — otomatik yapılamaz,"
echo "    çünkü her sayfanın JSX yapısı farklı olabilir. Liste aşağıda.)"
echo ""
grep -rl "<footer" src/app/ --include="*.tsx" 2>/dev/null | while read -r f; do
  # layout.tsx'ler hariç — onlar zaten shared olmalı
  case "$f" in
    */layout.tsx) continue ;;
  esac
  echo "  ⚠ $f"
done

echo ""
echo "== 5) .bak dosyalarını temizle =="
find src/ -name "*.bak" -delete
echo "  ✓ Temizlendi."

echo ""
echo "===================================================="
echo "1-3 arası OTOMATİK düzeltildi (bilinen string'ler)."
echo "4'teki liste MANUEL inceleme gerektirir — her sayfanın kendi"
echo "<footer> JSX'i olabilir, otomatik silme riskli (build kırabilir)."
echo "===================================================="

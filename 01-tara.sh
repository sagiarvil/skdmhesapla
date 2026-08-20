#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# TEK SEFERLİK TAM TARAMA — kök nedeni bulur, otomatik listeler,
# tek düzeltme planını üretir. Manuel onay istemez.
# ═══════════════════════════════════════════════════════════════════
#
# NEDEN BÖLÜNMÜŞTÜ: Önceki turlarda "header'ı düzelt" dediğimde yalnızca
# /basla/ ve /hesapla/*'ye baktım, anasayfayı ve /dosyalarim/ gibi diğer
# 40+ sayfayı hiç taramadım. Bu script HEPSİNİ TEK SEFERDE tarar.
#
# Kullanım: repo kökünde  bash tek-seferlik-cozum.sh
set -uo pipefail  # set -e YOK bilerek — bir sayfa hata verse bile tarama devam etsin

if [ ! -d "src/app" ]; then
  echo "HATA: repo kökünde değilsiniz." >&2
  exit 1
fi

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  AŞAMA 1/5 — KÖK NEDEN: kaç ayrı header/footer kopyası var?  ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Her page.tsx dosyasında kendi <header>/<footer> markup'ı var mı,
# yoksa hepsi tek bir shared layout'tan mı geliyor — bunu tek seferde ölçer.
HEADER_KOPYA_SAYISI=$(grep -rl "skdm-logo-header\|CimetricaOne VKN\|Vergi Kimlik No (TCKN)" src/app/ --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
echo "→ Elle yazılmış header/footer içeren sayfa dosyası sayısı: $HEADER_KOPYA_SAYISI"
echo "  (İdeal sayı: 0 — hepsi src/app/layout.tsx'teki TEK kaynaktan gelmeli)"
echo ""
echo "Bu dosyaların listesi:"
grep -rl "skdm-logo-header\|CimetricaOne VKN\|Vergi Kimlik No (TCKN)" src/app/ --include="*.tsx" 2>/dev/null | sed 's/^/  - /'

echo ""
echo "→ src/app/layout.tsx zaten SiteFooter/SiteHeader import ediyor mu?"
grep -n "SiteFooter\|SiteHeader" src/app/layout.tsx 2>/dev/null || echo "  ✗ HİÇBİRİ YOK — bu kök neden."

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  AŞAMA 2/5 — TÜM ROTALARIN TAM LİSTESİ (kaç sayfa gerçekten var) ║"
echo "╚══════════════════════════════════════════════════════════╝"

find src/app -name "page.tsx" | sed 's|src/app||; s|/page.tsx||; s|^$|/|' | sort > /tmp/tum_rotalar.txt
ROTA_SAYISI=$(wc -l < /tmp/tum_rotalar.txt | tr -d ' ')
echo "→ Toplam sayfa sayısı: $ROTA_SAYISI"
cat /tmp/tum_rotalar.txt | sed 's/^/  /'

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  AŞAMA 3/5 — HER SAYFANIN KENDİ header/footer'I VAR MI?      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo "(Bu, GATE-F'nin gerçek kapsamı — tek tek, sayfa sayfa)"
echo ""

BOZUK_SAYFA_SAYISI=0
for rota_dosya in $(find src/app -name "page.tsx"); do
  rota=$(echo "$rota_dosya" | sed 's|src/app||; s|/page.tsx||')
  [ -z "$rota" ] && rota="/"

  if grep -q "skdm-logo-header-120.gif\|CimetricaOne VKN 25403091318·Frankfurt\|<footer" "$rota_dosya" 2>/dev/null; then
    echo "  ✗ $rota — kendi elle yazılmış chrome'u var"
    BOZUK_SAYFA_SAYISI=$((BOZUK_SAYFA_SAYISI + 1))
  fi
done

echo ""
echo "→ Kendi kopyasını taşıyan sayfa sayısı: $BOZUK_SAYFA_SAYISI / $ROTA_SAYISI"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  AŞAMA 4/5 — AUTH-GATED SAYFALAR (dosyalarim, hesabim, admin) ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo "(Bunlar arama motorunda görünmez ama gerçek müşteri deneyimidir)"
echo ""

for AUTH_SAYFA in dosyalarim hesabim admin; do
  DOSYA="src/app/$AUTH_SAYFA/page.tsx"
  if [ -f "$DOSYA" ]; then
    echo "── $AUTH_SAYFA/page.tsx ──"
    # Oturumsuz erişimde ne oluyor: yönlendirme mi, boş ekran mı, hata mı?
    grep -n "redirect\|useAuth\|oturumAcik\|Loader\|useRouter" "$DOSYA" | head -5
    echo ""
  else
    echo "── $AUTH_SAYFA: page.tsx BULUNAMADI ✗ (route var ama dosya yok mu?) ──"
    find src/app -ipath "*$AUTH_SAYFA*" -type f 2>/dev/null | sed 's/^/    /'
    echo ""
  fi
done

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  AŞAMA 5/5 — GÜBRE CN + TÜM SEKTÖR TUTARLILIĞI               ║"
echo "╚══════════════════════════════════════════════════════════╝"

BASLA_FILE=$(grep -rl "Gübre Sanayi" src/app/basla/ --include="*.tsx" 2>/dev/null | head -1)
if [ -n "$BASLA_FILE" ]; then
  echo "Bulunan dosya: $BASLA_FILE"
  echo ""
  echo "Etiket ↔ link karşılaştırması (her sektör satırı):"
  grep -oE '\[[^]]+CN: [^]]+\]\([^)]+\)' "$BASLA_FILE" 2>/dev/null | while read -r satir; do
    echo "  $satir"
  done
else
  echo "✗ /basla/ dosyası bulunamadı — elle kontrol edin."
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ÖZET — TEK RAPOR                                            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo "Toplam sayfa           : $ROTA_SAYISI"
echo "Kendi chrome kopyası   : $BOZUK_SAYFA_SAYISI sayfa"
echo "Elle yazılmış header/footer içeren dosya: $HEADER_KOPYA_SAYISI"
echo ""
echo "SONRAKI ADIM: bu çıktıyı Claude'a yapıştırın — TEK bir patch script'i"
echo "ile TÜM $BOZUK_SAYFA_SAYISI sayfayı aynı anda düzeltecek, sayfa sayfa değil."

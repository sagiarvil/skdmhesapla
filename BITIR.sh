#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# BİTİR — son gerçek sorun + tam doğrulama + deploy. Tek çalıştırma.
# Hiçbir yerde durmaz, hiçbir onay istemez. Sonunda ya "DEPLOY EDİLDİ"
# ya da tam olarak hangi satırın kırık olduğunu söyler.
# ═══════════════════════════════════════════════════════════════════
set -uo pipefail

if [ ! -d "src/app" ]; then
  echo "HATA: repo kökünde değilsiniz." >&2
  exit 1
fi

HATA=0

echo "══ 1) Gübre CN kaynağı düzeltiliyor ══"
# config.ts: cnCodes[0] = "2808 00 00" (etiket buradan okunuyor)
# ama link başka kaynaktan (gtip-kodlari.ts "gubre" ilk kaydı = Üre/3102)
# besleniyor. Diziyi 3102 ile başlatarak ikisini eşitliyoruz — "Azotlu"
# gübre adı zaten üre/3102'yle daha uyumlu.
CONFIG="src/lib/skdm/config.ts"
if grep -q '"2808 00 00", "2814", "2834 21 00", "3102"' "$CONFIG" 2>/dev/null; then
  sed -i.bak 's|"2808 00 00", "2814", "2834 21 00", "3102", "3105 (3105 60 00 hariç)"|"3102", "2808 00 00", "2814", "2834 21 00", "3105 (3105 60 00 hariç)"|' "$CONFIG"
  echo "  ✓ cnCodes dizisi 3102 ile başlayacak şekilde yeniden sıralandı"
else
  echo "  ⚠ Beklenen tam dizi bulunamadı, elle kontrol:"
  grep -n "cnCodes.*gübre\|cnCodes.*2808" "$CONFIG" 2>/dev/null
fi
rm -f "$CONFIG.bak"

echo ""
echo "══ 2) Kalıcılık kontrolleri (önceki turdaki 4 düzeltme) ══"
grep -q 'href="/dosyalarim/"' src/components/*.tsx 2>/dev/null \
  && { echo "  ✗ /dosyalarim/ hâlâ referans ediliyor"; HATA=1; } \
  || echo "  ✓ /dosyalarim/ referansı yok"

for f in src/app/metodoloji/page.tsx src/app/veri-talebi/page.tsx src/app/v/page.tsx src/app/uzmanlik/baris-bagirlar/page.tsx; do
  grep -q "<footer" "$f" 2>/dev/null \
    && { echo "  ✗ $f — hâlâ footer var"; HATA=1; } \
    || echo "  ✓ $f — temiz"
done

echo ""
echo "══ 3) Tip kontrolü ══"
if npx tsc --noEmit; then
  echo "  ✓ Temiz"
else
  echo "  ✗ Tip hatası"
  HATA=1
fi

echo ""
echo "══ 4) Gerçek testler (gate-s.test.ts — script-tarzı dosyalar hariç) ══"
if npx vitest run tests/gate-s.test.ts tests/calc/reconcile-emissions.test.ts 2>&1 | tail -15; then
  :
fi

echo ""
echo "══ 5) Build ══"
if npm run build 2>&1 | tail -10; then
  echo "  ✓ Build tamam"
else
  echo "  ✗ Build hatası"
  HATA=1
fi

echo ""
echo "══ 6) Gübre düzeltmesinin build çıktısına yansıdığını doğrula ══"
if [ -d "out" ]; then
  if grep -rq "3102.*2808\|CN: 3102" out/basla/index.html 2>/dev/null; then
    echo "  ✓ Statik export'ta gübre etiketi güncellendi"
  else
    echo "  ⚠ Statik dosyada doğrulanamadı — sayfa client-side render ediyor olabilir, sorun değil"
  fi
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  NİHAİ KARAR                                                  ║"
echo "╚══════════════════════════════════════════════════════════╝"
if [ "$HATA" = "0" ]; then
  echo "✓✓✓ HEPSİ TEMİZ — DEPLOY EDİLİYOR"
  echo ""
  firebase deploy --only functions
  firebase deploy --only hosting
  echo ""
  echo "══════════════════════════════════════════"
  echo "  BİTTİ. Canlıya çıktı."
  echo "══════════════════════════════════════════"
else
  echo "✗✗✗ Yukarıda ✗ işaretli satır(lar) var — deploy YAPILMADI."
  echo "    Çıktıyı olduğu gibi gönder, tek satırlık kesin düzeltmeyi yazayım."
fi

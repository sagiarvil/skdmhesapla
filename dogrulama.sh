#!/usr/bin/env bash
set -e

echo "== 1/6: Tip kontrolü — TÜM proje =="
npx tsc --noEmit
echo "✓"

echo ""
echo "== 2/6: TÜM testler =="
npx vitest run
echo "✓"

echo ""
echo "== 3/6: Production build =="
npm run build
echo "✓"

echo ""
echo "== 4/6: Kayıt defteri bağlantısı =="
if grep -q "henüz veritabanına bağlanmadı" src/lib/skdm/kayitDefteri.ts 2>/dev/null; then
  echo "✗ DURDU: kayitDefteri.ts hâlâ placeholder throw ediyor."
  echo "  /v/{paketNo} deploy edilirse her tıklamada 500 verir."
  exit 1
fi
echo "✓ kayıt defteri bağlı görünüyor"

echo ""
echo "== 5/6: /dogrula/ metadata gerçekten bağlı mı =="
if ! grep -q "export.*metadata.*from.*'./metadata'" src/app/dogrula/page.tsx 2>/dev/null; then
  echo "⚠ UYARI: src/app/dogrula/page.tsx içinde"
  echo "  export { metadata } from './metadata';"
  echo "  satırı yok — elle kontrol edin."
fi

echo ""
echo "== 6/6: Geliştirme script'leri build dışında mı =="
if [ -f "scripts/gate-a-reconcile.ts" ] || [ -f "scripts/reseal-test-package.ts" ]; then
  echo "⚠ scripts/ kökünde geliştirme dosyaları var:"
  echo "  mkdir -p scripts/dev && mv scripts/gate-a-reconcile.ts scripts/reseal-test-package.ts scripts/dev/ 2>/dev/null"
fi

echo ""
echo "===================================================="
echo "TAMAMLANDI. Kırmızı ✗ yoksa deploy edilebilir."
echo "===================================================="

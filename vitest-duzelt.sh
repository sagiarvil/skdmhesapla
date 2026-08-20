#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# VITEST RAPORLAMA DÜZELTMESİ
#
# SORUN: tests/ altında iki tür dosya karışık duruyor:
#   1) Gerçek vitest testleri — describe()/it() kullanıyor (gate-s.test.ts)
#   2) Script-tarzı dosyalar — kendi console.log("PASS"/"FAIL") mantığıyla
#      çalışıyor, describe/it YOK (security/*.spec.js, regression/*.spec.ts,
#      pcf/*.spec.ts, calc/reconcile-emissions.test.ts vb.)
#
# `vitest run` ikinci gruptaki her dosyayı "No test suite found" diye
# FAIL işaretliyor — içerikleri gerçekte geçmiş olsa bile. Bu, gerçek
# hatalarla yanlış pozitifleri ayırt etmeyi zorlaştırıyor.
#
# ÇÖZÜM: (1) vitest.config.ts ile script-tarzı dosyaları vitest'in
# tarama kapsamından çıkar, (2) ayrı bir "test:scripts" komutuyla
# onları kendi doğal biçimlerinde (node/tsx ile) çalıştır ve exit code'a
# göre gerçek pass/fail belirle, (3) "test:all" ikisini birleştirip
# tek bir doğru sonuç verir.
#
# Kullanım: repo kökünde  bash vitest-duzelt.sh
set -uo pipefail

if [ ! -f "package.json" ]; then
  echo "HATA: repo kökünde değilsiniz." >&2
  exit 1
fi

echo "== 1) Script-tarzı dosyaları otomatik tespit ediyorum =="
echo "   (describe(/it( İÇERMEYEN .spec.js/.spec.ts/.test.ts dosyaları)"
echo ""

SCRIPT_DOSYALAR=()
for f in $(find tests -type f \( -name "*.spec.js" -o -name "*.spec.ts" -o -name "*.test.ts" \) 2>/dev/null); do
  if ! grep -qE "^\s*(describe|it|test)\s*\(" "$f" 2>/dev/null; then
    SCRIPT_DOSYALAR+=("$f")
    echo "  → $f (script-tarzı)"
  fi
done

if [ ${#SCRIPT_DOSYALAR[@]} -eq 0 ]; then
  echo "  Hiç script-tarzı dosya bulunamadı — vitest zaten temiz olabilir."
  exit 0
fi

echo ""
echo "== 2) vitest.config.ts yazılıyor (script dosyaları hariç tutuluyor) =="

# Dışlanacak dosyaları glob deseni olarak hazırla.
EXCLUDE_LISTE=""
for f in "${SCRIPT_DOSYALAR[@]}"; do
  EXCLUDE_LISTE="${EXCLUDE_LISTE}      \"${f}\",\n"
done

if [ -f "vitest.config.ts" ]; then
  cp vitest.config.ts vitest.config.ts.bak
  echo "  (mevcut vitest.config.ts yedeklendi: vitest.config.ts.bak)"
fi

cat > vitest.config.ts <<EOF
import { defineConfig } from "vitest/config";

/**
 * GATE-VT (RM-007): vitest yanlış "FAIL" raporlama düzeltmesi.
 *
 * tests/ altında iki tür dosya var: gerçek describe()/it() testleri
 * VE kendi console.log("PASS"/"FAIL") mantığıyla çalışan script-tarzı
 * dosyalar. İkincisi vitest'in "test suite" beklentisini karşılamıyor,
 * bu yüzden burada AÇIKÇA dışlanıyor — \`npm run test:scripts\` ile
 * kendi doğal biçimlerinde ayrıca çalıştırılıyorlar (bkz. package.json).
 *
 * Bu liste otomatik üretildi (describe/it içermeyen dosyalar taranarak).
 * Yeni bir script-tarzı dosya eklenirse buraya da eklenmesi gerekir —
 * ya da o dosyaya gerçek describe()/it() sarmalayıcısı yazılmalı.
 */
export default defineConfig({
  test: {
    exclude: [
      "node_modules/**",
      "dist/**",
$(echo -e "$EXCLUDE_LISTE")
    ],
  },
});
EOF
echo "  ✓ vitest.config.ts yazıldı (${#SCRIPT_DOSYALAR[@]} dosya dışlandı)"

echo ""
echo "== 3) package.json'a test script'leri ekleniyor =="

python3 - "${SCRIPT_DOSYALAR[@]}" <<'PYEOF'
import json, sys, subprocess

script_dosyalar = sys.argv[1:]

with open("package.json", "r", encoding="utf-8") as f:
    pkg = json.load(f)

pkg.setdefault("scripts", {})

# Script-tarzı dosyaları tek tek node/tsx ile çalıştırıp exit code'ları
# toplayan basit bir runner. .ts dosyalar tsx, .js dosyalar node ister.
dosya_listesi = " ".join(f'"{d}"' for d in script_dosyalar)
pkg["scripts"]["test:scripts"] = (
    "node -e \""
    "const {execSync}=require('child_process');"
    f"const files={json.dumps(script_dosyalar)};"
    "let fail=0;"
    "for(const f of files){"
    "  const runner=f.endsWith('.ts')?'npx tsx':'node';"
    "  try{execSync(`${runner} ${f}`,{stdio:'inherit'});}"
    "  catch(e){fail=1;console.error('FAIL:',f);}"
    "}"
    "process.exit(fail);"
    "\""
)
pkg["scripts"]["test:unit"] = "vitest run"
pkg["scripts"]["test:all"] = "npm run test:unit && npm run test:scripts"

with open("package.json", "w", encoding="utf-8") as f:
    json.dump(pkg, f, indent=2, ensure_ascii=False)
    f.write("\n")

print("  ✓ package.json güncellendi:")
print("    - test:unit    → yalnızca gerçek vitest testleri (describe/it)")
print("    - test:scripts → script-tarzı dosyalar (node/tsx ile, gerçek exit code)")
print("    - test:all     → ikisi birden, TEK doğru sonuç")
PYEOF

echo ""
echo "== 4) Doğrulama — artık ikisi de doğru raporlanıyor mu =="
echo ""
echo "── npm run test:unit ──"
npm run test:unit 2>&1 | tail -15

echo ""
echo "── npm run test:scripts ──"
npm run test:scripts 2>&1 | tail -30

echo ""
echo "===================================================="
echo "Bundan sonra TEK doğru komut: npm run test:all"
echo "CI/deploy script'lerinde 'npx vitest run' yerine bunu kullanın."
echo "===================================================="

#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# VITEST RAPORLAMA DÜZELTMESİ — v2
#
# v1'deki iki hata düzeltildi:
#   1) "node_modules/**" yalnızca kökü dışlıyordu — functions/node_modules
#      içindeki bir paketin kendi test dosyası bile taranmıştı.
#      → "**/node_modules/**" olarak düzeltildi.
#   2) test:scripts komutu tek satırlık `node -e "..."` içine
#      sıkıştırılmıştı; iç içe çift tırnaklar kabuk tarafından erken
#      kapatıldı, dizi bozuldu. → Ayrı bir .js dosyasına taşındı,
#      kaçış sorunu tamamen ortadan kalktı.
#
# Kullanım: repo kökünde  bash vitest-duzelt-v2.sh
set -uo pipefail

if [ ! -f "package.json" ]; then
  echo "HATA: repo kökünde değilsiniz." >&2
  exit 1
fi

echo "== 1) Script-tarzı dosyaları tespit ediyorum (yalnızca kendi tests/ altımız) =="
SCRIPT_DOSYALAR=()
for f in $(find tests -type f \( -name "*.spec.js" -o -name "*.spec.ts" -o -name "*.test.ts" \) 2>/dev/null); do
  if ! grep -qE "^\s*(describe|it|test)\s*\(" "$f" 2>/dev/null; then
    SCRIPT_DOSYALAR+=("$f")
    echo "  → $f"
  fi
done
echo "  Toplam: ${#SCRIPT_DOSYALAR[@]} dosya"

echo ""
echo "== 2) vitest.config.ts düzeltiliyor (node_modules TAMAMEN, her yerde hariç) =="

EXCLUDE_LISTE=""
for f in "${SCRIPT_DOSYALAR[@]}"; do
  EXCLUDE_LISTE="${EXCLUDE_LISTE}      \"${f}\",\n"
done

cat > vitest.config.ts <<EOF
import { defineConfig } from "vitest/config";

/**
 * GATE-VT (RM-007): vitest yanlış "FAIL" raporlama düzeltmesi.
 *
 * "**/node_modules/**" — DİKKAT: yalnızca "node_modules/**" yazmak
 * sadece kök dizini dışlar; functions/, src/ gibi alt paketlerin
 * KENDİ node_modules'ları taranmaya devam eder (bu hataya bir kez
 * düşüldü — functions/node_modules/lru-memoizer/test/*.test.js
 * vitest tarafından "describe is not defined" ile FAIL edildi).
 *
 * Script-tarzı dosyalar (describe/it kullanmayan, kendi console.log
 * PASS/FAIL mantığıyla çalışanlar) burada dışlanır; npm run
 * test:scripts ile kendi doğal biçimlerinde ayrıca çalıştırılırlar.
 */
export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
$(echo -e "$EXCLUDE_LISTE")
    ],
  },
});
EOF
echo "  ✓ vitest.config.ts düzeltildi"

echo ""
echo "== 3) test:scripts runner'ı AYRI DOSYA olarak yazılıyor (kabuk kaçış sorunu yok) =="

mkdir -p scripts/dev
cat > scripts/dev/run-script-tests.mjs <<'EOF'
// Script-tarzı test dosyalarını (describe/it kullanmayanları) kendi
// doğal biçimlerinde çalıştırır — gerçek exit code'a göre pass/fail.
// Ayrı dosya olarak var, çünkü package.json içine inline yazıldığında
// kabuk/JSON tırnak çakışması diziyi bozuyordu.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const dosyalar = JSON.parse(
  readFileSync(new URL("./script-test-listesi.json", import.meta.url), "utf-8")
);

let hataliSayisi = 0;
for (const dosya of dosyalar) {
  const calistirici = dosya.endsWith(".ts") ? "npx tsx" : "node";
  console.log(`\n── ${dosya} ──`);
  try {
    execSync(`${calistirici} ${dosya}`, { stdio: "inherit" });
  } catch {
    hataliSayisi += 1;
    console.error(`✗ FAIL: ${dosya}`);
  }
}

console.log(`\n${dosyalar.length - hataliSayisi}/${dosyalar.length} script dosyası geçti.`);
process.exit(hataliSayisi > 0 ? 1 : 0);
EOF

python3 - "${SCRIPT_DOSYALAR[@]}" <<'PYEOF'
import json, sys
dosyalar = sys.argv[1:]
with open("scripts/dev/script-test-listesi.json", "w", encoding="utf-8") as f:
    json.dump(dosyalar, f, indent=2, ensure_ascii=False)
print(f"  ✓ scripts/dev/script-test-listesi.json yazıldı ({len(dosyalar)} dosya)")
PYEOF

echo "  ✓ scripts/dev/run-script-tests.mjs yazıldı"

echo ""
echo "== 4) package.json script'leri düzeltiliyor =="
python3 - <<'PYEOF'
import json

with open("package.json", "r", encoding="utf-8") as f:
    pkg = json.load(f)

pkg.setdefault("scripts", {})
pkg["scripts"]["test:unit"] = "vitest run"
pkg["scripts"]["test:scripts"] = "node scripts/dev/run-script-tests.mjs"
pkg["scripts"]["test:all"] = "npm run test:unit && npm run test:scripts"

with open("package.json", "w", encoding="utf-8") as f:
    json.dump(pkg, f, indent=2, ensure_ascii=False)
    f.write("\n")

print("  ✓ package.json güncellendi")
PYEOF

echo ""
echo "== 5) Doğrulama =="
echo ""
echo "── npm run test:unit ──"
npm run test:unit 2>&1 | tail -15

echo ""
echo "── npm run test:scripts ──"
npm run test:scripts 2>&1 | tail -40

echo ""
echo "===================================================="
echo "TEK doğru komut: npm run test:all"
echo "===================================================="

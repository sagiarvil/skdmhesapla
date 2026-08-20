#!/usr/bin/env bash
set -euo pipefail
FILE="src/lib/skdm/pdf/kapsamliDurumRaporu.ts"

if [ ! -f "$FILE" ]; then
  echo "HATA: $FILE bulunamadı — repo kökünde çalıştırın." >&2
  exit 1
fi

python3 - "$FILE" <<'PYEOF'
import sys, re

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    src = f.read()

old = '''const round2 = (n: number) => Math.round(n * 100) / 100;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const trNum = (n: number, d = 2) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
const trEur = (n: number) =>
  "€" + n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });'''

new = '''const round2 = (n: number) => Math.round(n * 100) / 100;
const round3 = (n: number) => Math.round(n * 1000) / 1000;

/**
 * GATE-S (RM-007): Son savunma hattı.
 *
 * OLAY: undefined/null bir sayı bu fonksiyonlara ulaştığında tüm mühürleme
 * akışı stack trace ile çöküyordu (register şekli beklenenden farklı
 * geldiğinde) — kullanıcı anlamsız bir hata görüyordu, hiçbir dosya
 * üretilmiyordu. Asıl kaynak createSealedAuditPackage başındaki
 * validateSealRegisterSnapshot() ile kapatıldı (bkz. registerValidation.ts);
 * bu fonksiyonlar SON hat — birinci hat atlanırsa bile burada patlamaz.
 */
function sayiGecerliMi(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

const trNum = (n: number | null | undefined, d = 2): string =>
  sayiGecerliMi(n)
    ? n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d })
    : "—";

const trEur = (n: number | null | undefined): string =>
  sayiGecerliMi(n)
    ? "€" + n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";'''

if old not in src:
    print("UYARI: Beklenen eski blok bulunamadı — dosya farklı olabilir.", file=sys.stderr)
    print("Elle kontrol edin: 'const trNum' etrafındaki tanımı.", file=sys.stderr)
    sys.exit(2)

src = src.replace(old, new, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(src)

print("✓ trNum / trEur savunmalı hale getirildi:", path)
PYEOF

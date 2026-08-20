#!/usr/bin/env bash
set -euo pipefail
FILE="src/lib/skdm/package-seal.ts"

if [ ! -f "$FILE" ]; then
  echo "HATA: $FILE bulunamadı." >&2
  exit 1
fi

python3 - "$FILE" <<'PYEOF'
import sys, re

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    src = f.read()

# 1) import ekle — dosyanın en üstündeki ilk import satırından hemen sonra.
import_line = 'import { validateSealRegisterSnapshot } from "./registerValidation";\n'
if "validateSealRegisterSnapshot" not in src:
    m = re.search(r'^import .+\n', src, flags=re.MULTILINE)
    if not m:
        print("HATA: dosyada import satırı bulunamadı, elle ekleyin.", file=sys.stderr)
        sys.exit(2)
    insert_at = m.end()
    src = src[:insert_at] + import_line + src[insert_at:]
    print("✓ import eklendi")
else:
    print("· import zaten var, atlandı")

# 2) `const reg = registers || {};` satırından hemen sonra doğrulama çağrısı ekle.
anchor = "const reg = registers || {};"
if anchor not in src:
    print("HATA: 'const reg = registers || {};' satırı bulunamadı — elle ekleyin.", file=sys.stderr)
    sys.exit(2)

call = (
    anchor
    + "\n  // GATE-S (RM-007): PDF/XLSX üretimine girmeden önce register'ı doğrula.\n"
    + "  // Birinci savunma hattı — hata burada net bir Türkçe mesajla durur,\n"
    + "  // formatlayıcıların derinliklerinde stack trace olarak patlamaz.\n"
    + "  validateSealRegisterSnapshot(reg);"
)

if "validateSealRegisterSnapshot(reg);" not in src:
    src = src.replace(anchor, call, 1)
    print("✓ validateSealRegisterSnapshot çağrısı eklendi")
else:
    print("· çağrı zaten var, atlandı")

with open(path, "w", encoding="utf-8") as f:
    f.write(src)
PYEOF

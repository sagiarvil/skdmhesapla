#!/usr/bin/env bash
# Tek komut — üçünü sırayla çalıştırır.
set -uo pipefail
cd "$(dirname "$0")"
DIR="$(pwd)"

echo ">>> AŞAMA A: TARAMA"
bash "$DIR/01-tara.sh"

echo ""
echo ">>> AŞAMA B: DÜZELTME"
bash "$DIR/02-duzelt.sh"

echo ""
echo ">>> AŞAMA C: DOĞRULAMA"
bash "$DIR/03-dogrula.sh"

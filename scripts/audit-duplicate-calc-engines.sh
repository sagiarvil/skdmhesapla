#!/usr/bin/env bash
# CI zorunlu. Kırmızıysa deploy bloklanır.
set -euo pipefail
exec node scripts/audit-duplicate-calc-engines.mjs

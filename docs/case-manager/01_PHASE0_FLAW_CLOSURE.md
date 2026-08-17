# Phase 0 — Flaw Closure Report

**Tarih:** 17 Ağustos 2026  
**Amaç:** Baseline denetiminde yürütmeyi kıracak kusurların kalıcı kapatılması

## Yapılanlar

1. `src/lib/skdm/package-manifest.ts` — paket dosya listesi SSOT
2. `PLATFORM_STATS.fileCount` = `SEALED_PACKAGE_FILE_COUNT`
3. `scripts/audit-package-manifest.mjs` + `npm run test:skdm` zinciri
4. `ci-lint` eski 6/11 dosya hard-code yasağı
5. `/basla` Kademe B: CN’siz “kapsamda değilsiniz” hükmü kaldırıldı (§73)
6. Marketing claim yumuşatma: fiyatlandırma + ana sayfa (kanıtsız 50–200k, “yalnızca sizde”, “256-Bit SSL”, kesin “aynı gün”)
7. Doküman drift: firestore-schema + teknik-iskelet “6 dosya” → SSOT atıfı
8. UI hard-code: hesabim/admin/wizard/fiyatlandirma → `PLATFORM_STATS.fileCount`

## Testler

- typecheck, lint:ci, test:skdm (calculator + package audit), build

## Blocking kalan

- `BLOCKED_LEGAL_DOCS`: RM-001…004 repoda yok (hukuki SSOT; Case Manager Phase 1+ için)

# Aktif plan — SKDMHesapla

**Sürüm:** Plan (35) — 17 Ağustos 2026  
**Kaynak klasör:** `feat/pcf-buyer-report-v1`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 35 — Kademe A/B fiziksel ayrım + Buyer PCF V1)

- **Kademe A CBAM motoru değişmedi.** Calculator, Annex/CN ruleset, QC, Communication Template, mühür ve ETS/de-minimis mantığına bu planda dokunulmadı.
- **Kademe B transaction akışı** `/karbon-raporu/` oldu. Kapsam dışı CN `SkdmWizard`/CBAM calculator'a ulaşmaz; `PcfWizard` ayrı domain'dedir.
- **PCF core** `src/lib/pcf/*` fiziksel olarak CBAM calc/qc/seal/annex-ruleset'ten izole. `scripts/assert-engine-boundaries.mjs` kapısı vardır.
- **Factor registry fail-closed:** kaynaksız/sürümsüz/boundary'siz/stale/unit-mismatch faktör seçilmez; bilinmeyen faktör `0` yazılmaz; `blocked` olur.
- **buyer_ready** yalnız SKDMHesapla iç kalite kapısıdır; ISO sertifikası, akredite doğrulama veya CBAM beyanı değildir.
- **Legacy TKD** (`src/lib/skdm/pdf/tedarikciKarbonDosyasi.ts`) bir release rollback için durur; yeni PCF akışı onu import etmez.
- **Premium otomatik faktör coverage (`test:pcf:release`) KAPALI.** 2025 Al/Cam/PVC kayıtları stale/estimate-only tutulur; listedeki diğer malzemeler için kaynaksız sayı eklenmedi. Web'de “tüm bu malzemelerin faktörünü otomatik buluyoruz” iddiası canlıya alınamaz.
- RM-001…004 repo içinde yok; CBAM matematiğine dokunulmadı (governance finding).

## Canlı durum

| Madde | Durum |
|---|---|
| Kademe A CBAM motoru (bit-bit regresyon) | ✓ Plan 35'te değişmedi |
| `/karbon-raporu/` PCF sihirbazı + İngilizce PDF | ✓ |
| Fail-closed factor registry + EVÇED 0.469/0.436 | ✓ |
| Out-of-scope → PCF routing | ✓ |
| Premium auto-factor coverage | KAPALI (release gate kırmızı) |
| Legacy TKD rollback kopyası | ✓ tutuluyor |
| Ek E §4 — Paddle | kullanıcı yapacak; bu ajan dokunmaz |

## Sıradaki İşler

- İnsan kaynak incelemesiyle 2026 açık/resmi malzeme faktörlerini `approved` yapmak (`test:pcf:release` yeşil olmadan otomatik-faktör pazarlaması yok).
- **Ek E §4 — Paddle** (kullanıcı yapacak; bu ajan dokunmaz).
- Storage imzalı indirme URL’si (Paddle sonrası).

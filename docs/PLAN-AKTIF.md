# Aktif plan — SKDMHesapla

**Sürüm:** Plan (35) — 17 Ağustos 2026  
**Kaynak klasör:** `main`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 35 — Kademe A/B + Buyer PCF + V2 mühür ödemesi)

- **Kademe A CBAM motoru değişmedi.** Calculator, Annex/CN ruleset, QC, Communication Template ve ETS/de-minimis formülleri aynıdır. `/api/seal` artık webhook-doğrulanmış `skdm_orders` kaydı ister (Kademe A ve B).
- **Kademe B transaction akışı** `/karbon-raporu/` → `PcfWizard`. Kapsam dışı CN CBAM calculator'a ulaşmaz.
- **PCF core** `src/lib/pcf/*` CBAM calc/qc/package-seal/annex-ruleset'ten izole.
- **V2 teslim:** PCF serbest PDF indirme kapalı. `estimated` / `buyer_ready` → Paddle → `GET /api/orders/status` → `POST /api/seal` → 8 dosyalı PCF ZIP. `blocked` mühürlenemez.
- **PCF paket SSOT:** `src/lib/pcf/package-manifest.ts` (8 dosya). Communication Template / de-minimis / doğrulayıcı çalışma alanı yok.
- **buyer_ready** yalnız iç kalite kapısıdır; ISO sertifikası, akredite doğrulama veya CBAM beyanı değildir.
- **Legacy TKD** rollback için durur; yeni PCF akışı onu import etmez.
- **Premium otomatik faktör coverage (`test:pcf:release`) KAPALI.**
- **Paddle:** aynı 9.900 ₺ fiyat; `packageType` `CBAM_SEAL_PACKAGE_9900` | `PCF_SEAL_PACKAGE_9900`. `checkout.completed` tek başına yetki değildir.

## Canlı durum

| Madde | Durum |
|---|---|
| Kademe A CBAM motoru (bit-bit regresyon) | ✓ değişmedi |
| `/karbon-raporu/` PCF sihirbazı | ✓ (önizleme ücretsiz; ZIP ödeme sonrası) |
| PCF 8 dosyalı mühür + SHA-256 | ✓ `test:payment-seal` |
| `/api/seal` ödeme doğrulama | ✓ A ve B |
| Fail-closed factor registry + EVÇED 0.469/0.436 | ✓ |
| Out-of-scope → PCF routing | ✓ |
| Premium auto-factor coverage | KAPALI |
| Legacy TKD rollback kopyası | ✓ tutuluyor |

## Sıradaki İşler

- İnsan kaynak incelemesiyle 2026 açık/resmi malzeme faktörlerini `approved` yapmak.
- Storage imzalı indirme URL’si (Paddle sonrası).

# Aktif plan — SKDMHesapla

**Sürüm:** Plan (38) — 5 Eylül 2026  
**Kaynak klasör:** `main`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 38 — Fiyatlandırma premium okunabilirlik + Denizcilik 399 USD ticari kilit)

- **Kademe A CBAM motoru değişmedi.** Calculator, Annex/CN ruleset, QC, Communication Template ve ETS/de-minimis formülleri aynıdır. `/api/seal` webhook-doğrulanmış `skdm_orders` kaydı ister.
- **Kademe B PCF akışı değişmedi.** `/karbon-raporu/` → `PcfWizard`; PCF serbest PDF indirme kapalıdır; ödeme sonrası sunucu paketi teslim edilir.
- **Denizcilik ticari birimi:** `1 gemi + 1 raporlama yılı + 1 değişmez preparation snapshot`.
- **Denizcilik SKU:** `MARITIME_DOSSIER_1Y_399_USD`.
- **Denizcilik fiyatı:** **399 USD tek seferlik**. Abonelik, kullanıcı-başı veya aylık ücret yoktur.
- **Paddle price ID:** `pri_01m1rdd20amd3730r561vckwm3` — public catalog identity; istemci ve sunucu fail-closed doğrulamasında aynı SSOT kullanılır.
- **Ücretsiz katman:** kapsam kontrolü, veri girişi, hesaplama ve readiness çalışması ödeme öncesinde kullanılabilir.
- **Ücretli teslim:** kritik hazırlık kapıları tamamlanır → değişmez checkpoint oluşur → Paddle Checkout → yalnız imza-doğrulanmış `transaction.completed` → entitlement → aynı snapshot'ın ticari kilidi → makine-okunur paket + Preparation Report PDF.
- **Yeniden indirme:** aynı snapshot hash için ek ücret yoktur. Veri değişip yeni snapshot oluşursa yeni dosya/yeni ödeme gerekir.
- **Paddle yetki modeli:** `checkout.completed` istemci olayı tek başına yetki değildir. Yetki yalnız dedicated webhook (`/api/maritime-commerce/webhook`) üzerinden doğrulanmış `transaction.completed` ile oluşur.
- **Paddle katalog otoritesi:** quantity=1, one-time, USD 399.00, price ID `pri_01m1rdd20amd3730r561vckwm3` ile birebir doğrulanır.
- **Denizcilik hukuki sınırı:** ticari çıktı hazırlık dosyasıdır; akredite verification, resmî MRV/FuelEU Document of Compliance, administering-authority kararı veya EUA surrender değildir.
- **Fiyatlandırma UX:** `/fiyatlandirma/` artık "tek ekrana mümkün olduğunca çok içerik sığdırma" yaklaşımıyla yönetilmez. Premium okunabilirlik esastır: ana metin 16 px, kart/SSS gövde metni 14 px, meta/etiketler 12 px altına düşmez; başlıklar 16–44 px hiyerarşisindedir. CBAM paket manifestosu masaüstünde en fazla 3 kolondur, açıklamalar kesilmez ve tam okunur.

## Canlı durum

| Madde | Durum |
|---|---|
| Kademe A CBAM motoru (bit-bit regresyon) | ✓ değişmedi |
| `/karbon-raporu/` PCF sihirbazı | ✓ değişmedi |
| PCF ödeme + mühür zinciri | ✓ değişmedi |
| Denizcilik EU MRV + EU ETS + FuelEU çalışma motoru | ✓ |
| Denizcilik server-authoritative revision/checkpoint/evidence chain | ✓ |
| Denizcilik 399 USD dosya-başı entitlement mimarisi | ✓ kodlandı |
| Paddle maritime price ID bağlama | ✓ `pri_01m1rdd20amd3730r561vckwm3` |
| Aynı snapshot yeniden indirme politikası | ✓ |
| `/fiyatlandirma/` premium okunabilir tipografi | ✓ kodlandı; production deploy gate ile doğrulanacak |
| Maritime webhook secret | Firebase Secret Manager / Paddle destination secret gerekli |
| Premium auto-factor coverage | KAPALI |

## Sıradaki İşler

- `/fiyatlandirma/` premium tipografi değişikliğini production build + Firebase Hosting live + canlı URL doğrulamasıyla kapat.
- `PADDLE_MARITIME_WEBHOOK_SECRET` production secret'ının Paddle notification destination ile birebir aynı olduğunu doğrula.
- `maritimeCommerceApi` + `maritimeCommerceWebhookApi` + hosting + Firestore index deploy et.
- Production Paddle test işlemiyle webhook → entitlement → paid dossier → tekrar indirme zincirini doğrula.

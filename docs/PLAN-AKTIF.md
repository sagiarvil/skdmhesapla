# Aktif plan — SKDMHesapla

**Sürüm:** Plan (36) — 5 Eylül 2026  
**Kaynak klasör:** `main`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 36 — Denizcilik dosya-başı ticari kilit + Paddle)

- **Kademe A CBAM motoru değişmedi.** Calculator, Annex/CN ruleset, QC, Communication Template ve ETS/de-minimis formülleri aynıdır. `/api/seal` webhook-doğrulanmış `skdm_orders` kaydı ister.
- **Kademe B PCF akışı değişmedi.** `/karbon-raporu/` → `PcfWizard`; PCF serbest PDF indirme kapalıdır; ödeme sonrası sunucu paketi teslim edilir.
- **Denizcilik ticari birimi:** `1 gemi + 1 raporlama yılı + 1 değişmez preparation snapshot`.
- **Denizcilik SKU:** `MARITIME_DOSSIER_1Y_349_USD`.
- **Denizcilik fiyatı:** **349 USD tek seferlik**. Abonelik, kullanıcı-başı veya aylık ücret yoktur.
- **Ücretsiz katman:** kapsam kontrolü, veri girişi, hesaplama ve readiness çalışması ödeme öncesinde kullanılabilir.
- **Ücretli teslim:** kritik hazırlık kapıları tamamlanır → değişmez checkpoint oluşur → Paddle Checkout → yalnız imza-doğrulanmış `transaction.completed` → entitlement → aynı snapshot'ın ticari kilidi → makine-okunur paket + Preparation Report PDF.
- **Yeniden indirme:** aynı snapshot hash için ek ücret yoktur. Veri değişip yeni snapshot oluşursa yeni dosya/yeni ödeme gerekir.
- **Paddle yetki modeli:** `checkout.completed` istemci olayı tek başına yetki değildir. Yetki yalnız dedicated webhook (`/api/maritime-commerce/webhook`) üzerinden doğrulanmış `transaction.completed` ile oluşur.
- **Paddle katalog otoritesi:** quantity=1, one-time, USD 349.00, price ID server secret ile birebir doğrulanır.
- **Denizcilik hukuki sınırı:** ticari çıktı hazırlık dosyasıdır; akredite verification, resmî MRV/FuelEU Document of Compliance, administering-authority kararı veya EUA surrender değildir.

## Canlı durum

| Madde | Durum |
|---|---|
| Kademe A CBAM motoru (bit-bit regresyon) | ✓ değişmedi |
| `/karbon-raporu/` PCF sihirbazı | ✓ değişmedi |
| PCF ödeme + mühür zinciri | ✓ değişmedi |
| Denizcilik EU MRV + EU ETS + FuelEU çalışma motoru | ✓ |
| Denizcilik server-authoritative revision/checkpoint/evidence chain | ✓ |
| Denizcilik 349 USD dosya-başı entitlement mimarisi | ✓ kodlandı |
| Aynı snapshot yeniden indirme politikası | ✓ |
| Paddle maritime product/price + notification destination | Paddle hesabında catalog ID/secret binding gerekli |
| Premium auto-factor coverage | KAPALI |

## Sıradaki İşler

- Paddle production catalogunda `MARITIME_DOSSIER_1Y_349_USD` ürününü one-time 349 USD olarak bağla; price ID ve maritime webhook secret'ı Firebase/Next environment'a yerleştir.
- `maritimeCommerceApi` + `maritimeCommerceWebhookApi` + hosting + Firestore index deploy et.
- Production Paddle test işlemiyle webhook → entitlement → paid dossier → tekrar indirme zincirini doğrula.

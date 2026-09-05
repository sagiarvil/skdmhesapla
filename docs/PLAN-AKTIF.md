# Aktif plan — SKDMHesapla

**Sürüm:** Plan (40) — 5 Eylül 2026  
**Kaynak klasör:** `main`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 40 — Denizcilik 100/100 iç ön-doğrulama kapısı + 399 USD ticari kilit)

- **Kademe A CBAM motoru değişmedi.** Calculator, Annex/CN ruleset, QC, Communication Template ve ETS/de-minimis formülleri aynıdır. `/api/seal` webhook-doğrulanmış `skdm_orders` kaydı ister.
- **Kademe B PCF akışı değişmedi.** `/karbon-raporu/` → `PcfWizard`; PCF serbest PDF indirme kapalıdır; ödeme sonrası sunucu paketi teslim edilir.
- **Global premium form sözleşmesi:** `src/app/globals.css` içindeki `SKDM_PREMIUM_FORM_V1` tüm siteye root layout üzerinden uygulanır. Text/number/date/e-mail/tel/password/search/url inputları, select, textarea ve file input yüzeyleri ortak premium presentation katmanını kullanır.
- **Denizcilik ticari birimi:** `1 gemi + 1 raporlama yılı + 1 değişmez preparation snapshot`.
- **Denizcilik SKU:** `MARITIME_DOSSIER_1Y_399_USD`.
- **Denizcilik fiyatı:** **399 USD tek seferlik**. Abonelik, kullanıcı-başı veya aylık ücret yoktur.
- **Paddle price ID:** `pri_01m1rdd20amd3730r561vckwm3` — public catalog identity; istemci ve sunucu fail-closed doğrulamasında aynı SSOT kullanılır.
- **Ücretsiz katman:** kapsam kontrolü, veri girişi, hesaplama ve readiness çalışması ödeme öncesinde kullanılabilir.
- **Ücretli teslim:** 100/100 iç hazırlık kapısı tamamlanır → değişmez checkpoint oluşur → Paddle Checkout → yalnız imza-doğrulanmış `transaction.completed` → entitlement → aynı snapshot'ın ticari kilidi → makine-okunur paket + Preparation Report PDF.
- **Yeniden indirme:** aynı snapshot hash için ek ücret yoktur. Veri değişip yeni snapshot oluşursa yeni dosya/yeni ödeme gerekir.
- **Paddle yetki modeli:** `checkout.completed` istemci olayı tek başına yetki değildir. Yetki yalnız dedicated webhook (`/api/maritime-commerce/webhook`) üzerinden doğrulanmış `transaction.completed` ile oluşur.
- **Paddle katalog otoritesi:** quantity=1, one-time, USD 399.00, price ID `pri_01m1rdd20amd3730r561vckwm3` ile birebir doğrulanır.
- **Denizcilik hukuki sınırı:** `100/100`, yalnız SKDMHesapla'nın iç **PRE-VERIFICATION preparation gate** sonucudur. Akredite verifier görüşü, resmî MRV/FuelEU Document of Compliance, administering-authority kararı veya EUA surrender değildir.

### Plan 40 — bağlayıcı denizcilik sertleştirmesi

- **BLOCK-0 kimlik:** IMO check-digit tek başına yeterli değildir. Certificate of Registry + tonnage certificate + şirket/owner primary evidence server-finalized binary kanıt olarak bulunmadan checkpoint/ödeme açılamaz.
- **Master-data uydurma yasağı:** administering authority, Union Registry MOHA ve verifier legal entity/akreditasyonu typed değerle doğrulanmış sayılmaz; ilgili binary primary evidence zorunludur. MOHA numarası formülden/IMO numarasından türetilemez.
- **MRV ayrımı:** fiziksel CO₂ ile CO₂+CH₄+N₂O toplam sera gazı ayrı hesaplanır ve ayrı çıktı alanıdır.
- **ETS 2025:** surrender hazırlığında 2025 phase-in `%70`; 2025 için ETS liability CO₂-only katmanı MRV toplam sera gazından ayrıdır. 2026+ ruleset yürürlükteki gas scope'u uygular.
- **FuelEU GWP:** Annex I / Directive (EU) 2018/2001 bağlantısı uyarınca CH₄=28, N₂O=265 kullanılır; legacy 25/298 yasaktır.
- **FuelEU enerji otoritesi:** fiziksel fuel mass mevcutsa enerji `Mi × LCV` üzerinden yeniden üretilir. Manuel `energyMj` yalnız comparator/non-fuel energy taşıyıcısıdır; uyuşmazlık strict gate'i durdurur.
- **FuelEU WtW otoritesi:** manuel/önceden hazırlanmış WtW toplamı hesap girdisi değildir. WtT + TtW CO₂/CH₄/N₂O + Cslip kaynak faktörlerinden deterministik yeniden hesaplanır; comparator farkı internal tolerance'ı aşarsa gate durur.
- **FuelEU compliance balance:** `gCO₂eq` biriminde hesaplanır; MJ olarak sunulamaz. Banking/borrowing Article 20, pooling Article 21, FuelEU DoC Article 22 SSOT'tur.
- **Yıllık yakıt mutabakatı:** voyage register tüketimi ile fuel register fiziksel tüketimi, Monitoring Plan uncertainty yüzdesi içinde mutabık olmadan checkpoint/ödeme açılamaz.
- **Evidence snapshot bütünlüğü:** checkpoint sonrası evidence manifest değişirse ödeme intent'i reddedilir; yeni checkpoint zorunludur.
- **Blocking skor yaptırımı:** herhangi bir blocking bulgu varsa strict audit skoru **49/100 üstüne çıkamaz**. Tüm internal source/evidence/reconciliation kontrolleri tam ise **100/100** üretilebilir; bu verifier approval anlamına gelmez.
- **Production API routing:** `/api/maritime/**` strict audit wrapper üzerinden; maritime commerce intent ayrıca exact checkpoint + evidence manifest üzerinde ikinci strict audit ile fail-closed çalışır.

## Canlı durum

| Madde | Durum |
|---|---|
| Kademe A CBAM motoru | ✓ regression gate PASS; değişmedi |
| `/karbon-raporu/` PCF sihirbazı | ✓ regression gate PASS; değişmedi |
| PCF ödeme + mühür zinciri | ✓ payment/seal gate PASS; değişmedi |
| Site-geneli premium input/select/textarea/file sistemi | ✓ PRODUCTION LIVE |
| Denizcilik EU MRV + EU ETS + FuelEU çalışma motoru | ✓ strict ruleset implementation |
| Denizcilik server-authoritative revision/checkpoint/evidence chain | ✓ |
| BLOCK-0 primary ship/company identity evidence | ✓ strict gate implementation |
| Annual voyage↔fuel reconciliation | ✓ strict gate implementation |
| FuelEU deterministic Mi×LCV + WtW recalculation | ✓ strict gate implementation |
| Administering authority + MOHA primary evidence | ✓ strict gate implementation |
| Verifier accreditation primary evidence | ✓ strict gate implementation |
| Evidence snapshot stale-payment protection | ✓ strict commerce implementation |
| Denizcilik 399 USD dosya-başı entitlement mimarisi | ✓ kodlandı |
| Paddle maritime price ID bağlama | ✓ `pri_01m1rdd20amd3730r561vckwm3` |
| Aynı snapshot yeniden indirme politikası | ✓ |
| Maritime strict audit production deploy | PR/CI sonrası deploy edilecek |
| Maritime webhook secret | Firebase Secret Manager / Paddle destination secret gerekli |
| Premium auto-factor coverage | KAPALI |

## Sıradaki İşler

- Maritime strict gate PR için `maritime-enterprise-gate` CI PASS olmadan merge/deploy yapılmaz.
- `PADDLE_MARITIME_WEBHOOK_SECRET` production secret'ının Paddle notification destination ile birebir aynı olduğunu doğrula.
- `maritimeApi` + `maritimeCommerceApi` strict wrapper deploy sonrası production health ve 100/100→checkpoint→Paddle intent zincirini canlı test et.
- Production Paddle test işlemiyle webhook → entitlement → paid dossier → tekrar indirme zincirini doğrula.

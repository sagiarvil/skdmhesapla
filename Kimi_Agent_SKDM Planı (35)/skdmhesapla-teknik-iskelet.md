# SKDMHesapla.com — Teknik Yapı İskeleti (Kanonik Proje Ağacı)

**Sürüm:** 1.0 — 16 Ağustos 2026
**Hazırlayan rol:** Principal Architect
**Bağlam:** Branch `main` (yerel, GitHub yok) — Firebase projesi `carbon-web-1265b` — Dağıtım: Firebase CLI (GitHub'suz)
**Yığın:** Next.js (App Router, static export) + Firebase Hosting + Cloud Functions (Node 22, europe-west3) + Firestore (europe-west3) + Cloud Storage + Paddle (MoR)

> Bu dosya, projenin **hedef kanonik yapısıdır**. Antigravity gibi kod ajanlarına "proje bu ağaca göre organize edilir" bağlamı olarak verilir. Kod ajanı farklı bir yapı kurduysa, bu ağaç hakem kabul edilir.

---

## 1. Kök dizin

```
skdmhesapla/                        # PROJE KÖKÜ (cimetrica-one DEĞİL)
├── .firebaserc                     # { "projects": { "default": "carbon-web-1265b" } }
├── firebase.json                   # hosting (public: out, cleanUrls) + functions (node22, europe-west3) + rewrites
├── firestore.rules                 # Firestore güvenlik kuralları
├── firestore.indexes.json          # Kompozit indeksler
├── storage.rules                   # Storage güvenlik kuralları (mühürlü paketler kullanıcıya özel)
├── next.config.ts                  # output: 'export', trailingSlash, i18n yok (sadece TR)
├── package.json                    # scripts: dev, build, typecheck, test:skdm, deploy:site, deploy:api, onizleme
├── tsconfig.json                   # strict: true
├── tailwind.config.ts
├── .env.local                      # ASLA commit/paylaşılmaz — Paddle sandbox anahtarları
├── docs/                           # Proje dokümantasyonu (ajanların bağlam klasörü)
│   ├── skdmhesapla-com-ana-plan.md # Master blueprint (tek doğruluk kaynağı)
│   ├── teknik-iskelet.md           # BU DOSYA
│   ├── firestore-skdm-schema.md    # Koleksiyon şemaları
│   ├── seo-haritasi.md             # seo1.txt'nin yapılandırılmış hali
│   └── tasarim-rehberi.md          # Tasarım Mandate'in yapılandırılmış hali
├── public/
│   ├── llms.txt                    # AI/LLM görünürlük dosyası
│   ├── robots.txt
│   ├── sitemap.xml                 # build'de scripts/generate-sitemap.mjs üretir
│   └── assets/ (görseller, favicon, og-image)
├── scripts/
│   ├── verify-skdm-calculator.mjs  # Hesaplama motoru regresyon testleri (6/6 PASSED şartı)
│   ├── verify-sealed-package.mjs   # Mühürlü ZIP SHA-256 bütünlük denetimi (7/7 PASSED şartı)
│   ├── generate-sitemap.mjs        # Programmatik sayfalardan sitemap üretimi
│   └── seed-rulesets.mjs           # Kural paketlerini Firestore'a/JSON'a yazan tohum scripti
├── functions/                      # Cloud Functions (ayrı package.json, node22)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                # Export hub
│       ├── api/
│       │   ├── calculate.ts        # POST /api/calculate → deterministik motor çağrısı
│       │   ├── seal.ts             # POST /api/seal → QC %100 kontrolü + ZIP üretimi
│       │   ├── paddleWebhook.ts    # Paddle transaction.completed → sipariş + mühür tetikleme (imza doğrulamalı)
│       │   └── etsPriceUpdate.ts   # Cloud Scheduler: haftalık ETS fiyatı çek → "onay bekliyor" yaz
│       ├── pdf/
│       │   ├── denetime-hazirlik.ts# Ana PDF şablonu
│       │   └── emisyon-eki.ts      # Hesaplama eki PDF şablonu
│       ├── xlsx/
│       │   ├── kanit-defteri.ts    # Kanıt Kayıt Defteri üreteci
│       │   └── dogrulayici-alani.ts# Doğrulayıcı Çalışma Alanı üreteci
│       └── lib/
│           ├── storage.ts          # Storage yazma + imzalı URL
│           ├── mailer.ts           # Teslimat e-postası
│           └── orders.ts           # skdm_orders yazma/güncelleme
└── src/
    ├── app/                        # Next.js App Router (aşağıda detay)
    ├── components/                 # UI bileşenleri (aşağıda detay)
    └── lib/
        └── skdm/                   # HESAPLAMA ÇEKİRDEĞİ (framework'süz, saf TypeScript — aşağıda detay)
```

---

## 2. `src/app/` — Sayfa haritası (SEO + dönüşüm hunisi)

```
src/app/
├── layout.tsx                      # Root: header (logo, "Nasıl Çalışır", Fiyatlandırma), footer (5 hukuki sayfa linki ZORUNLU)
├── page.tsx                        # ANA SAYFA = Keşif ekranı: "Ne ihraç ediyorsunuz?" tek soru + örnek vaka + güven sinyalleri
├── hesapla/
│   └── [sector]/
│       └── page.tsx                # Sihirbaz kabuğu (client) — sektör slug'ına göre modül yükler
├── calisma-alani/
│   └── page.tsx                    # Kayıtlı çalışma alanı: veri girişi, kanıt yükleme, hazırlık skoru
├── sonuc/
│   └── page.tsx                    # Sonuç ekranı: alıcının sertifika maliyeti + benchmark + senaryo + mühürleme modalı
├── fiyatlandirma/page.tsx          # Net fiyat tablosu (KDV dahil) — Paddle uyumu
├── kullanim-kosullari/page.tsx     # Paddle zorunlu sayfa 1
├── kvkk-aydinlatma/page.tsx        # Paddle zorunlu sayfa 2
├── iade-politikasi/page.tsx        # Paddle zorunlu sayfa 3
├── iletisim/page.tsx               # Paddle zorunlu sayfa 4 (gerçek adres + e-posta)
├── nasil-calisir/page.tsx          # 7 adımlı akış anlatımı (E-E-A-T)
├── skdm-nedir/page.tsx             # Pillar içerik
├── sektorler/
│   ├── page.tsx                    # 20 sektör haritası (Tier A/B/C)
│   └── [sector]/page.tsx           # 20 programmatik sektör sayfası (SSG; her biri hesaplayıcıya bağlı)
├── rehber/
│   ├── page.tsx                    # İçerik merkezi
│   └── [slug]/page.tsx             # Makaleler (SSG, FAQPage + HowTo schema)
└── sitemap.ts / robots.ts          # (veya public/ üzerinden statik)
```

**Kural:** Hukuki 5 sayfa ve `fiyatlandirma` footer'dan her sayfada erişilebilir olmalı — Paddle incelemesi buna bakar.

---

## 3. `src/lib/skdm/` — Deterministik çekirdek (en kritik klasör)

```
src/lib/skdm/
├── types.ts                        # Tek tip kaynağı: Sector, Tier, CalcInput, CalcResult, QCFinding, Ruleset, ...
├── config.ts                       # MOTOR AYARLARI: engineVersion, aktif ruleset, etsPriceQuarterly {"2026-Q1": 75.4}
├── rulesets/
│   ├── index.ts                    # Registry: versiyona göre ruleset çözümleme
│   ├── eu-2026-q1.ts               # Kural paketi: de minimis (4 sektör), %2,5 ayar faktörü, %50 elde tutma, etsQ
│   └── ...                         # Her mevzuat değişikliği YENİ DOSYA — eski paket ASLA değiştirilmez (tekrarlanabilirlik)
├── sectors/
│   ├── registry.ts                 # 20 sektör × Tier A/B/C haritası + CN kod eşleştirme tablosu
│   ├── demir-celik.ts              # BOF/EAF rotaları, precursor mantığı, varsayılan değerler
│   ├── aluminyum.ts · cimento.ts · gubre.ts · elektrik.ts · hidrojen.ts
│   ├── batarya.ts · ambalaj.ts · gida-eudr.ts · lojistik.ts          # Tier B
│   └── plastik.ts · kimya.ts · cam-seramik.ts · kagit.ts · tekstil.ts
│       · mobilya.ts · otomotiv-yan-sanayi.ts · beyaz-esya.ts
│       · kablo-tel.ts · kaucuk.ts · ahsap.ts                        # Tier C
├── factors/
│   ├── ab-defaults.ts              # AB varsayılan emisyon değerleri (kaynak + versiyon etiketli)
│   ├── grid-electricity.ts         # Ülke bazlı şebeke elektriği faktörleri
│   └── transport-glec.ts           # ISO 14083/GLEC taşıma faktörleri
├── calculator.ts                   # ANA HESAPLAMA: input + ruleset → CalcResult (saf fonksiyon, yan etki YOK)
│                                   #   İçerir: isDeMinimisExempt (elektrik/hidrojen HARİÇ), ayar faktörü,
│                                   #   mahsup (menşe ülke karbon bedeli), sertifika sayısı, €/₺ maliyet
├── qc.ts                           # Fail-closed kalite kontrolleri: blocking / warning / note
├── readiness.ts                    # Denetime Hazırlık Skoru (%0–100) + 4 adımlı kontrol listesi
├── package-seal.ts                 # Mühürleme orkestrasyonu (QC %100 şartı burada zorlanır)
├── manifest.ts                     # SHA-256 Bütünlük Manifestosu üretimi
└── audit.ts                        # Audit kaydı: girdiler, formüller, varsayımlar, engineVersion, ruleset, etsQ, euP, hash
```

**Değişmez kurallar (bu klasör için):**
1. `calculator.ts` saf fonksiyondur: aynı girdi + aynı ruleset = bit-bit aynı çıktı. Tarih/rastgelelik/dış API çağrısı YOK.
2. Hiçbir sabit (ETS fiyatı, faktör, eşik) kod içine gömülmez — hepsi ruleset/config'den okunur.
3. Eski kural paketleri değişmez; değişiklik = yeni paket dosyası.
4. Her çıktı `audit.ts` kaydıyla birlikte üretilir.

---

## 4. `src/components/` — UI bileşenleri

```
src/components/
├── wizard/
│   ├── WizardShell.tsx             # 8 adımlık kabuk: ilerleme çubuğu, kaydet-devam, tek soru/ekran
│   ├── ProductFinder.tsx           # CN kodu / serbest metin → sektör+regülasyon eşleştirme
│   ├── RouteSelector.tsx           # Üretim rotası görsel kartları
│   ├── InputField.tsx              # "Bunu nereden bulurum?" ipucu ikonlu standart alan
│   ├── EvidenceUpload.tsx          # Kanıt PDF yükleme → alan eşleştirme
│   └── DefaultsNotice.tsx          # "Varsayılan değer kullanıldı" işaretleme bileşeni
├── readiness/
│   ├── ReadinessScore.tsx          # % skor halkası + eksik listesi (tek tıkla o adıma git)
│   └── QCList.tsx                  # Blocking/warning/note listesi
├── result/
│   ├── SkdmResultDashboard.tsx     # Sonuç + benchmark + senaryo kaydırıcı + Mühürleme modalı
│   ├── ScenarioSlider.tsx          # "ETS 100 € olursa…" simülatörü
│   └── WhatsAppShare.tsx           # Tek tık özet paylaşımı
├── seal/
│   ├── SealModal.tsx               # Fiyat + paket içeriği + iade koşulları (ödemeden ÖNCE) → Paddle checkout
│   └── PackageDownloads.tsx        # 6 dosyalık mühürlü paket indirme listesi
├── support/
│   ├── HelpSpot.tsx                # "Takıldınız mı?" — adıma özel 60 saniyelik anlatım
│   └── CallbackForm.tsx            # "Sizi Arayalım" formu (yazılım desteği, danışmanlık DEĞİL)
└── legal/
    └── Disclaimer.tsx              # Standart konumlandırma cümlesi (her rapor + ilgili sayfalarda)
```

---

## 5. Firestore şeması (özet — detay `docs/firestore-skdm-schema.md`)

| Koleksiyon | Amaç | Kritik alanlar |
|---|---|---|
| `skdm_sessions` | Çalışma alanı oturumu | sessionId, sector, tier, inputs{}, evidenceRefs[], readinessScore, qcFindings[], engineVersion, rulesetId |
| `skdm_orders` | Paddle sipariş kaydı | orderId, paddleTransactionId, email, packageType (seal/reseal), amountTRY, status, createdAt |
| `skdm_sealed_packages` | Mühürlü paket kaydı | packageId, sessionId, manifestHash, storagePath, expiresAt, downloadCount |
| `skdm_ets_prices` | ETS fiyat beslemesi | quarter, priceEUR, source, status (pending/approved), approvedAt |
| `skdm_leads` | "Sizi arayalım" + e-posta | email/phone, sector, source, createdAt |

---

## 6. Veri akışı (uçtan uca)

```
Tarayıcı (Next.js statik, Firebase Hosting CDN)
  │  1. Ürün bul → sektör + tier + regülasyon (client, sectors/registry.ts)
  │  2. Veri girişi → skdm_sessions (Firestore, kullanıcıya özel)
  │  3. Hesapla → POST /api/calculate (Functions → calculator.ts, saf)
  │  4. QC + skor → readiness.ts + qc.ts (sonuç ekranında canlı)
  ▼
Mühürleme modalı → Paddle Checkout (TRY, Türkçe)
  │  5. transaction.completed → paddleWebhook (imza doğrulama) → skdm_orders
  │  6. seal.ts: QC %100 zorlanır → 6 dosya üretimi (pdf/xlsx) →
  │     manifest.ts (SHA-256) → Storage → skdm_sealed_packages
  ▼
Kullanıcı: imzalı URL + e-posta → 7 gün indirme; hesaptan süresiz yeniden indirme
```

---

## 7. Antigravity'ye bağlam talimatı

Kod ajanına her oturumda şu üç dosyayı bağlam verin: `docs/skdmhesapla-com-ana-plan.md` (ne ve neden), `docs/teknik-iskelet.md` (nerede durur — bu dosya), `docs/firestore-skdm-schema.md` (veri modeli). Ajan farklı yapı önerirse, bu dosyadaki ağaç hakemdir; sapma ancak gerekçesi yazılı olarak onaylanırsa kabul edilir.

# SKDMHesapla — Akıllı Ürün → CN/GTİP Adayı → CBAM Kapsam Motoru

**Sürüm:** 2026-08-16.v1  
**Amaç:** Kullanıcının GTİP bilmeden, Türkiye’de ticarette kullandığı ürün adını yazarak doğru CN/GTİP adaylarına, ayırt edici sorulara ve SKDM kapsam sonucuna yönlendirilmesi.  
**Statü:** Production architecture / verification-ready product specification.  

---

## 1. Nihai ürün kararı

Arama kutusu bir “GTİP sözlük araması” olmamalıdır. Ürün, ticari dilde girilir; motor olası sınıflandırmaları üretir; gerekli olduğunda ayırt edici soruları sorar; ardından resmi CN kapsam tablosu üzerinden SKDM sonucunu verir.

Temel akış:

```text
Serbest ürün adı
    ↓
Türkçe ticari sözlük + yazım normalizasyonu
    ↓
Ürün intent / ürün ailesi
    ↓
CN adayları (1..n)
    ↓
Belirsizlik motoru
    ↓
Ayırt edici sorular
    ↓
CN aday daraltma
    ↓
CBAM Annex I scope engine
    ↓
KAPSAMDA / KAPSAM DIŞI / EK BİLGİ GEREKLİ
    ↓
Hesaplama + Verification-Ready Dossier
```

**Kritik kural:** Kullanıcı “cam balkon”, “metal raf”, “makine parçası”, “PVC pencere” gibi belirsiz ticari isim yazdığında sistem tek GTİP/CN kodunu kesin sonuç gibi gösteremez.

---

## 2. Neden mevcut tek satırlı öneri yeterli değil

Ekrandaki mevcut model:

```text
Kullanıcı: demir
→ İnşaat demiri (nervürlü)
→ CN 7214 20 00
→ Kademe A
```

Bu akış “demir” gibi geniş bir sorguyu gereğinden fazla kesinleştiriyor. “Demir” şu ürün ailelerinden herhangi biri olabilir:

- filmaşin
- nervürlü inşaat demiri
- çelik çubuk
- profil
- sac/rulo
- boru
- fitting
- yapı parçası
- vida/cıvata
- döküm eşya
- makine parçası

Bu nedenle “demir” sorgusunun doğru cevabı **bir kod değil, aday grubu + bir ayırt edici sorudur.**

Önerilen davranış:

```text
"demir" için 6 güçlü eşleşme bulduk.

En olası kullanımınızı seçin:
[ İnşaat demiri ] [ Sac/rulo ] [ Profil ] [ Boru ] [ Vida/cıvata ] [ Diğer ]
```

Kullanıcı “İnşaat demiri” seçtikten sonra 7214 ailesi gösterilebilir.

---

## 3. Resmî dayanak katmanı

Motorun hukuki kaynak sıralaması:

1. Regulation (EU) 2023/956 — consolidated version after Regulation (EU) 2025/2083  
   https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A02023R0956-20251020

2. Commission Implementing Regulation (EU) 2025/2547 — definitive-period embedded-emissions methodology.

3. Commission definitive-period sector guidance documents 5a–5f, first published 14 August 2026.  
   Main legislation/guidance index:  
   https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en

4. 2026 Combined Nomenclature — Commission Implementing Regulation (EU) 2025/1926; applies from 1 January 2026.  
   https://taxation-customs.ec.europa.eu/news/commission-publishes-2026-version-combined-nomenclature-2025-10-31_en

5. Türkiye 2026 İstatistik Pozisyonlarına Bölünmüş Türk Gümrük Tarife Cetveli — Karar No. 10781.  
   https://ggm.ticaret.gov.tr/duyurular/istatistik-pozisyonlarina-bolunmus-turk-gumruk-tarife-cetveli-karar-sayisi-10781-yayimlanmistir

6. AB Binding Tariff Information (BTI/EBTI) — ürün bazında bağlayıcı sınıflandırma emsalleri için.  
   https://taxation-customs.ec.europa.eu/customs/common-customs-tariff-cct/tariff-classification-goods/european-binding-tariff-information-ebti_en

**Source-of-truth kuralı:** Veri setindeki ticari adlar kullanıcı kolaylığı içindir. CBAM kapsam kararı daima mevzuatta yer alan CN/TARIC kapsamı üzerinden yapılır.

---

## 4. Hazırlanan veri seti

Bu çalışma ile iki veri dosyası oluşturuldu:

- `skdm_product_cn_lexicon_2026.json` — 80 canonical ürün-intent kaydı.
- `skdm_product_cn_aliases_2026.csv` — 813 Türkçe ticari isim, eşanlamlı, İngilizce ticaret terimi ve ASCII/yazım varyantı.

Veri kapsamı:

- Demir ve çelik
- Alüminyum
- Çimento
- Gübre
- Hidrojen
- Elektrik
- Yüksek riskli/belirsiz downstream ticari ürünler

Özel olarak eklenen “zor” ticari sorgular:

- cam balkon
- giyotin cam balkon
- PVC pencere / pimapen
- sandviç panel
- çelik raf / depo raf sistemi
- güneş paneli konstrüksiyonu
- sera konstrüksiyonu
- CNC metal parça
- makine parçası
- mobilya metal aksamı
- konteyner / modüler kabin
- panel çit
- ferforje korkuluk
- alüminyum pergola
- ACSR iletken
- aerosol kutusu
- UAN
- CAN gübre
- NPK/NP/NK
- metakaolin
- HBI/DRI
- DKP/CRC/HRC
- HEA/HEB/IPE/NPU/NPI

---

## 5. Veri modeli

Canonical kayıt:

```json
{
  "id": "AMB-001",
  "sector": "Karma",
  "canonical_product_tr": "Cam balkon sistemi",
  "aliases": [
    "cam balkon",
    "katlanır cam balkon",
    "sürgülü cam balkon",
    "giyotin cam balkon"
  ],
  "candidate_cn": ["7610", "7007", "7008"],
  "cbam_scope_candidate": "AMBIGUOUS",
  "base_confidence": "low",
  "disambiguation_questions": [
    "Faturada komple sistem mi, yalnız cam mı yazıyor?",
    "Taşıyıcı çerçeve alüminyum mu?",
    "Cam temperli/lamine/yalıtım camı mı?",
    "Ürün demonte set mi?"
  ],
  "exclusion_or_alt_triggers": [
    "Yalnız güvenlik camı 7007 olabilir ve CBAM kapsamı dışındadır",
    "Yalıtım camı 7008 olabilir ve CBAM kapsamı dışındadır"
  ]
}
```

Bu yapı doğrudan frontend’e verilmemelidir. Sunucu tarafında bir Classification API katmanı kullanılmalıdır.

---

## 6. Arama motoru pipeline’ı

### 6.1 Normalizasyon

Girdi:

```text
"ALUMİNYUM PENCERE   PROFİLİ"
```

Normalize:

```text
aluminyum pencere profili
```

İşlemler:

- lowercase
- trim
- çoklu boşluk temizleme
- Türkçe karakter / ASCII parallel token
- `civata` ↔ `cıvata`
- `aluminyum` ↔ `alüminyum`
- ticari kısaltma genişletme: HRC, CRC, DKP, DRI, HBI, UAN, CAN, NPK, ACSR vb.
- token stemming yalnız kontrollü sözlük üzerinde

**Öneri:** Tam Türkçe stemming kullanmayın. GTİP aramasında agresif stemming yanlış ürün ailelerini eşleştirebilir.

### 6.2 Retrieval skoru

Önerilen skor:

```text
score =
  0.40 * exact_alias_match
+ 0.20 * token_overlap
+ 0.15 * trigram_similarity
+ 0.10 * sector_context_match
+ 0.10 * historical_click_prior
+ 0.05 * spelling_correction_confidence
```

Exact alias bulunduğunda model sonucu yine “kesin GTİP” yapmamalıdır; exact alias yalnız intent güvenini yükseltir.

### 6.3 LLM rolü

LLM şu işleri yapabilir:

- kullanıcının serbest açıklamasından ürün özelliklerini çıkarmak
- eşanlamlı ürün adlarını anlamak
- intent adaylarını sıralamak
- kullanıcıya sorulacak en bilgi kazandırıcı soruyu seçmek

LLM şu işi **tek başına yapmamalıdır:**

- nihai CN/GTİP kodunu hukuken bağlayıcıymış gibi üretmek
- CBAM kapsamını kendi model bilgisinden belirlemek

CBAM kapsamı deterministik tabloda çözülmelidir.

---

## 7. Belirsizlik / soru motoru

Her ürün için sistem “entropy reduction” mantığı ile en değerli soruyu seçmelidir.

### Cam balkon

İlk soru:

```text
Ne ihraç ediyorsunuz?
○ Komple cam balkon sistemi
○ Yalnız alüminyum profil/çerçeve
○ Yalnız temperli/lamine cam
○ Yalnız aksesuar/bağlantı parçaları
```

İkinci soru yalnız gerekirse açılır.

### Sandviç panel

```text
Panelin dış yüzeyleri metal sac mı?
○ Evet, iki yüz metal
○ Tek yüz metal
○ Hayır
```

Ardından:

```text
Ürün bina/yapıya özel hazırlanmış panel olarak mı ihraç ediliyor?
```

### Metal raf

```text
Ürün sabit yapısal depo sistemi mi, yoksa bağımsız mobilya/raf mı?
○ Zemine ankrajlı depo raf sistemi
○ Mağaza/ofis mobilyası
○ Parça/komponent
```

Bu soru 7308 ile 9403 arasındaki riski azaltır.

---

## 8. Güven seviyesi modeli

Frontend’de yüzde vermek yerine dört operasyon seviyesi önerilir:

```text
A — Doğrudan güçlü eşleşme
B — 1 bilgiyle doğrulanabilir
C — Birden fazla CN ailesi mümkün
D — Belge/uzman teyidi gerekli
```

### A
Örnek:

```text
"nitrik asit" → 2808 00 00
```

### B
Örnek:

```text
"inşaat demiri" → 7214 ailesi
```

Kangal/düz boy ayrımı istenebilir.

### C
Örnek:

```text
"cam balkon" → 7610 / 7007 / 7008
```

### D
Örnek:

```text
"CNC işlenmiş makine parçası"
```

7326 / 7616 / belirli makine parçası arasında teknik fonksiyon gerekir.

---

## 9. UI tasarımı

Mevcut başlık korunabilir:

```text
GTİP kodunuzu bilmiyor musunuz? Ürününüzü yazın:
```

Placeholder sabit olmamalı:

```text
Örn: cam balkon
Örn: PVC pencere
Örn: çelik konstrüksiyon
Örn: alüminyum korkuluk
Örn: sandviç panel
Örn: vida
```

### Arama sonucu kartları

Yanlış:

```text
✓ İnşaat demiri — CN 7214 20 00 — Kademe A (Zorunlu)
```

“demir” sorgusunda bu fazla kesin.

Doğru:

```text
“demir” için olası ürünler

1. İnşaat demiri / nervürlü çubuk
   CN ailesi: 7214
   SKDM: Kapsam adayı

2. Filmaşin
   CN ailesi: 7213
   SKDM: Kapsam adayı

3. Çelik profil
   CN ailesi: 7216
   SKDM: Kapsam adayı

4. Çelik boru
   CN aileleri: 7303–7306
   SKDM: Kapsam adayı

[Ürünümü netleştir]
```

### Yüksek güvenli sonuç

```text
Alüminyum pencere
CN: 7610 10 00
SKDM: KAPSAMDA
Güven: A — güçlü eşleşme

[SKDM maliyetini hesapla]
[Belgeyle teyit et]
```

### Belirsiz sonuç

```text
Cam balkon

Bu ticari isim birden fazla gümrük sınıfına girebilir.
3 kısa bilgiyle netleştirelim.

[Devam et]
```

Burada kullanıcıya ilk anda “CN 7610” basmak önerilmez.

---

## 10. Scope Engine

Scope Engine ayrı servis olmalıdır.

```ts
interface ScopeRule {
  cnPrefix: string;
  include: boolean;
  exceptionPrefixes?: string[];
  effectiveFrom: string;
  effectiveTo?: string;
  legalBasis: string;
  sector: string;
  greenhouseGases: string[];
}
```

Örnek:

```json
{
  "cnPrefix": "7610",
  "include": true,
  "effectiveFrom": "2026-01-01",
  "legalBasis": "Regulation (EU) 2023/956 Annex I",
  "sector": "aluminium",
  "greenhouseGases": ["CO2", "PFC where relevant"]
}
```

Gübre gibi exception içeren ailelerde prefix-only mantık yeterli değildir:

```text
3105 → genel olarak scope kontrolü
31056000 → exception / dışarıda
```

Benzer şekilde cement calcined clay için 2507 00 80’in tamamı değil, definitive-period guidance’a göre yalnız calcined kaolinic clay TARIC 2507 00 80 80 kapsamına girer.

---

## 11. “Kapsam dışında” sonucunda gereken disiplin

Kullanıcı ürün ismi üzerinden doğrudan `OUT` almamalı; aşağıdaki üç durum ayrılmalıdır:

```text
OUT_CONFIRMED
LIKELY_OUT
UNKNOWN
```

Örneğin `PVC pencere`:

- esas karakteri PVC ise 3925 ailesine gidebilir ve CBAM Annex I dışında kalması beklenir;
- fakat kullanıcının aslında “alüminyum kaplı/pencere sistemi” tarif etmesi mümkündür;
- dolayısıyla serbest metin aşamasında sonuç `LIKELY_OUT` olmalıdır.

---

## 12. Verification-Ready Dossier bağlantısı

Ürün sınıflandırma sonucu dossier’a şu şekilde kaydedilmelidir:

```json
{
  "classification": {
    "user_original_query": "cam balkon",
    "normalized_query": "cam balkon",
    "selected_product_intent": "Cam balkon sistemi",
    "candidate_cn": ["7610", "7007", "7008"],
    "answers": {
      "export_form": "complete_system",
      "frame_material": "aluminium",
      "glass_included": true
    },
    "selected_cn": "7610xxxx",
    "selection_status": "USER_CONFIRMED_WITH_DOCUMENT",
    "source_document": "customs_declaration",
    "scope_result": "IN",
    "rule_version": "CBAM_SCOPE_2026.1",
    "classified_at": "ISO-8601",
    "audit_hash": "..."
  }
}
```

Bu sayede doğrulayıcı veya müşteri daha sonra “bu CN neden seçildi?” sorusunun izini görebilir.

---

## 13. Zorunlu audit trail

Saklanması gerekenler:

- kullanıcının ilk yazdığı metin
- normalize edilmiş metin
- gösterilen ilk 5 aday
- seçilen aday
- sorulan sorular
- verilen cevaplar
- sistemin önerdiği CN
- kullanıcının manuel değiştirdiği CN
- değişikliğin zamanı
- dayanak belge
- veri seti versiyonu
- scope-rule versiyonu

**Manipülasyon alarmı:** Sistem `IN` önerirken kullanıcı manuel olarak `OUT` bir CN girerse dosya otomatik olarak `CLASSIFICATION_OVERRIDE_REVIEW` durumuna alınmalıdır.

---

## 14. API önerisi

### `/api/classification/search`

Request:

```json
{
  "query": "cam balkon",
  "country": "TR",
  "year": 2026
}
```

Response:

```json
{
  "intent": "AMB-001",
  "status": "NEEDS_DISAMBIGUATION",
  "candidates": [
    {"cn": "7610", "scope": "IN"},
    {"cn": "7007", "scope": "OUT"},
    {"cn": "7008", "scope": "OUT"}
  ],
  "nextQuestion": {
    "id": "export_form",
    "text": "Ne ihraç ediyorsunuz?",
    "options": [
      "Komple sistem",
      "Yalnız alüminyum profil/çerçeve",
      "Yalnız cam",
      "Yalnız aksesuar"
    ]
  }
}
```

### `/api/classification/resolve`

Cevaplara göre aday daraltılır.

### `/api/cbam/scope`

Yalnız CN/TARIC ve tarih alır. LLM çağrısı yapmaz.

---

## 15. Arama indeks önerisi

Production için iki katman önerilir:

### Tier 1 — deterministic lexicon

- exact aliases
- typo aliases
- trade abbreviations
- Turkish/English equivalents

### Tier 2 — semantic fallback

Kullanıcının sorgusu lexicon’da yoksa embedding/LLM ile en yakın 5 intent bulunur.

```text
lexicon exact score >= 0.93
→ semantic modele gitme

0.70–0.93
→ hybrid rerank

<0.70
→ semantic fallback + “ek bilgi gerekli”
```

**LLM hallucination guard:** Semantic motor yalnız mevcut canonical `record_id` listesinden seçim yapabilir. Yeni CN kodu uyduramaz.

---

## 16. Dataset versioning

```text
dataset_version: PRODUCT_LEXICON_2026_08_16_V1
scope_version: CBAM_SCOPE_2026_V1
cn_version: CN_2026_EU_2025_1926
tr_gtip_version: TR_TGTC_2026_10781
```

Her sonuç response’a sürüm bilgisi eklenmelidir.

Mevzuat değişikliğinde eski dosyalar yeniden hesaplanabilmelidir:

```text
classification rule changed
→ find dossiers with affected CN prefix
→ mark RECLASSIFICATION_CHECK_REQUIRED
```

---

## 17. Red-team / failure modes

### Failure 1 — “Demir” yazana 72142000 verilmesi

**Sorun:** aşırı kesin sınıflandırma.  
**Mitigasyon:** generic term blacklist + category-choice step.

Generic trigger listesi başlangıçta:

```text
demir
çelik
metal
alüminyum
profil
parça
sac
boru
konstrüksiyon
ürün
makine parçası
```

Bu kelimeler tek başına kullanılırsa sonuç kartı “tek CN” olamaz.

### Failure 2 — “Cam balkon” = 7610 varsayılması

**Sorun:** yalnız temperli cam ihracatı 7007 olabilir.  
**Mitigasyon:** export form + material + invoice description soruları.

### Failure 3 — 7326 ve 7616’nın gereğinden fazla kullanılması

**Sorun:** “diğer eşya” pozisyonları, özel fonksiyonlu makine/araç/mobilya parçalarını yanlış çekebilir.  
**Mitigasyon:** `is_specialized_part` sorusu + düşük güven + doküman talebi.

### Failure 4 — Türk GTİP 12 hane ile EU CN 8 hanenin birbirine karıştırılması

**Mitigasyon:** veri modelinde alanlar ayrılmalı:

```text
hs6
cn8
tr_gtip12
taric10
```

UI’da “CN” ve “GTİP” aynı etiket altında gösterilmemelidir.

### Failure 5 — Yıllık CN değişikliği

**Mitigasyon:** `year` zorunlu parametre + immutable annual tables.

### Failure 6 — kullanıcı kapsam dışına çıkmak için kodu değiştirir

**Mitigasyon:** override audit + belge zorunluluğu + scope-crossing override alarmı.

---

## 18. Test matrisi

Aşağıdaki sorgular release testinde zorunlu olmalıdır:

```text
cam balkon
pvc pencere
pimapen
alüminyum pencere
çelik pencere
sandviç panel
çelik raf
depo rafı
solar konstrüksiyon
sera konstrüksiyonu
makine parçası
cnc alüminyum parça
vida
cıvata
civata
somun
alüminyum perçin
nervürlü demir
demir
profil
hea
ipe
kutu profil
spiral boru
paslanmaz tank
oksijen tüpü
metakaolin
beyaz çimento
can gübre
npk
uan
hbi
dri
```

Kabul kriteri:

- generic sorguda yanlış “tek kesin kod” oranı: **0%**
- yüksek güvenli canonical sorgularda doğru heading family top-1: **≥98%**
- belirsiz downstream ürünlerde disambiguation tetiklenme oranı: **100%**
- `OUT` sonucu için belge/özellik teyidi olmadan `OUT_CONFIRMED`: **0%**

---

## 19. Search analytics ile veri kendini büyütmeli

Veri tablosu statik kalmamalıdır.

Log tabloları:

```text
search_query_log
unmatched_query_log
candidate_click_log
manual_cn_override_log
scope_conversion_log
```

Her hafta:

```text
Top 100 unmatched queries
→ insan review
→ synonym/intents update
→ regression test
→ lexicon release
```

Örnek:

Kullanıcılar sık sık “pimapen”, “ısıcam balkon”, “sigma profil”, “ferforje”, “trapez sac” yazıyorsa bunlar gerçek kullanıcı dili olarak sözlüğe alınır.

---

## 20. Ticari funnel

Bu modül ücretsiz acquisition katmanı olmalıdır.

```text
Google araması
"cam balkon skdm"
"vida cbam"
"alüminyum pencere cbam"
"gtip skdm kapsamında mı"
        ↓
Ürün arama
        ↓
Kapsam sonucu
        ↓
“AB alıcınızın tahmini CBAM maliyetini hesaplayın”
        ↓
Hızlı hesap
        ↓
Verification-Ready Dossier
        ↓
Ücretli ürün
```

SEO açısından her canonical intent gelecekte landing-page seed’i olabilir:

```text
/skdm-urun/aluminyum-pencere
/skdm-urun/celik-konstruksiyon
/skdm-urun/vida-civata
/skdm-urun/cam-balkon
/skdm-urun/sandvic-panel
```

Ancak sayfa metninde “kesin GTİP” iddiası yapılmamalı; ürün özelliklerine göre aday sınıflandırmalar gösterilmelidir.

---

## 21. Öncelik sırası

### P0

- Scope Engine’i LLM’den ayır.
- Generic term guard ekle.
- Ambiguous product state ekle.
- Audit trail ekle.
- CN8 / GTIP12 veri alanlarını ayır.

### P1

- 813 alias seed dataset’i entegre et.
- Dinamik soru motoru.
- Search analytics.
- Manuel CN doğrulama / belge upload.

### P2

- BTI emsal retrieval.
- Semantic reranking.
- Sektörel landing pages.
- Kullanıcı sorgularından kontrollü synonym learning.

---

## 22. Uygulama kabul kriteri

Motor production-ready sayılmamalıdır, ta ki:

1. 2026 resmi CN scope table versioned olarak yüklenene kadar.
2. 80 canonical intent / 813 alias regression testten geçene kadar.
3. “demir”, “metal”, “profil”, “parça” gibi generic sorgular tek kod üretmeyene kadar.
4. “cam balkon”, “sandviç panel”, “metal raf”, “makine parçası” gibi zor sorgular soru akışına düşene kadar.
5. Kullanıcı manuel kod değiştirirse audit trail tutulana kadar.
6. Scope-crossing override’larda review flag oluşana kadar.
7. Kullanıcının seçtiği CN’nin hangi kaynak/sürümle kapsamda bulunduğu dossier’a yazılana kadar.

---

## 23. Son karar

SKDMHesapla’nın fark yaratacağı katman “GTİP arama” değildir; **Türkiye’de ihracatçının kullandığı gündelik ürün dilini anlayıp, belirsizliği kontrollü sorularla çözen ve sonucu resmi CN/CBAM kapsam motoruna bağlayan doğrulanabilir sınıflandırma katmanıdır.**

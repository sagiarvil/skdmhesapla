# SAGIARVIL SEARCH REVENUE OS — ENTERPRISE / EXCLUSIVE MASTER MANDATE

**Doküman Kodu:** SAGIARVIL-SRO-2026-V1  
**Statü:** SEO / GEO / AEO / LLMS / Sitemap / Crawler / Search Revenue alanında TEK BAĞLAYICI MANDATE  
**Repo:** `sagiarvil/skdmhesapla`  
**Domain:** `https://skdmhesapla.com`  
**Nihai Kalite Hedefi:** Kontrol edilebilir release kapılarında **100/100**. 99 final kabul değildir.  
**Ticari North Star:** **Qualified CBAM Revenue + Authoritative Citation Share** ve portföy seviyesinde **Total Organic Contribution Margin**.

> Bu mandate, bu repodaki önceki SEO/GEO/AEO/LLM-discoverability talimat ve şartname belgelerinin yerini alır. Çalışan `robots.txt`, sitemap dosyaları/üreteçleri, `llms.txt`, `llms-full.txt`, `/llms/**` bilgi düğümleri, schema kodları, mevzuat/sources verisi ve SEO çalışma verileri eski “talimat belgesi” sayılmaz; bunlar bu mandate altında denetlenen runtime/operasyon varlıklarıdır.

---

## 0. OTORİTE VE ÇELİŞKİ HİYERARŞİSİ

SEO/GEO/LLMS/search-growth konusunda öncelik sırası:

1. Kullanıcının bu görevdeki en güncel açık talebi.
2. Bu dosya: `SAGIARVIL_SEARCH_REVENUE_OS_MANDATE.md`.
3. Resmî AB/EUR-Lex/European Commission kaynakları ile resmî arama motoru, schema, HTTP, güvenlik ve platform dokümantasyonu.
4. Repo içindeki güncel ve doğrulanmış runtime/source-of-truth dosyaları.
5. SKDM hesap motoru, mevzuat, veri modeli, tasarım ve güvenlik gibi kendi alanındaki kanonik proje belgeleri.
6. Eski SEO/GEO/LLMS notları ve tarihsel planlar yalnız tarihsel bağlamdır; bu mandate ile çelişemez.

Bir AI ajanı, geliştirici veya otomasyon; sayfa, routing, metadata, canonical, schema, sitemap, robots, LLMS, içerik, internal link, redirect veya search ölçümü değiştirmeden önce bu mandate'i okumak zorundadır.

---

## 1. AMAÇ

Amaç “çok trafik” değildir. Amaç Türkiye pazarında **nitelikli SKDM/CBAM talebini güvenilir bilgi, hesaplama ve hizmet gelirine dönüştüren; resmî kaynaklarla doğrulanabilir; makinece okunabilir; hızlı ve sürdürülebilir bir Search Revenue Operating System** kurmaktır.

Başarı zinciri:

`QUERY → REGULATORY/COMMERCIAL INTENT → AUTHORITY PAGE/TOOL → OFFICIAL EVIDENCE → CONVERSION → QUALIFIED LEAD/SALE → REVENUE`

Kesin ranking, trafik, AI citation veya gelir garantisi iddia edilemez. `%100` hedef, bizim kontrolümüzdeki mimari ve release kapılarının eksiksiz geçmesidir.

---

## 2. SKDMHESAPLA DOMAIN OWNERSHIP

SKDMHesapla'nın primer konu sahipliği:

- CBAM / SKDM
- CN / GTİP kapsam değerlendirmesi
- gömülü emisyonlar
- doğrulama hazırlığı
- üretim/tesis/enerji/precursor/tedarikçi verisi
- CBAM raporlama ve hesaplama metodolojisi
- altı CBAM sektörü
- ilgili AB mevzuatı ve resmî uygulama kaynakları

DRFIN, ExcelArşiv ve Belgin bu primer niyetleri kopyalayarak ayrı ticari otorite kuramaz. Aynı primer ticari intent iki SAGIARVIL domaininde aynı anda sahiplenilemez.

---

## 3. SEARCH SINGLE SOURCE OF TRUTH — REGISTRY

Tüm indexable URL'ler merkezi Search Registry'de kayıtlı olmalıdır. Framework implementasyonu değişebilir; semantic contract değişemez.

Her kayıt en az şunları taşımalıdır:

```yaml
route:
canonical:
status:
indexDirective:
domain:
locale:
pageRole:
primaryIntent:
secondaryIntents:
topicOwner:
primaryEntity:
supportingEntities:
title:
metaDescription:
h1:
schemaTypes:
sitemap:
  include:
  lastModified:
robotsPolicy:
llm:
  tier:
  node:
  parentNode:
evidence:
  sources:
  verifiedAt:
  effectiveDate:
commercial:
  funnelStage:
  conversionAction:
measurement:
  conversionEvents:
```

Registry'de olmayan yeni indexable sayfa final release alamaz.

Metadata, canonical, JSON-LD, sitemap üyeliği, LLMS ilişkisi ve mümkün olan yerde robots policy aynı SSOT'tan türetilmelidir.

---

## 4. MULTI-TIER LLMS KNOWLEDGE GRAPH — ZORUNLU

Tek `llms.txt` yeterli değildir. Kök dosya bir **manifest/router** olmalıdır.

Minimum mimari:

```text
/llms.txt
/llms-full.txt
/llms/core.md
/llms/entities/
/llms/methodologies/
/llms/regulations/
/llms/sectors/
/llms/topics/
/llms/pages/
```

### Roller

- `/llms.txt`: token-ekonomik ana manifest ve en önemli alt-graflara yönlendirme.
- `/llms-full.txt`: kontrollü geniş makine özeti.
- `/llms/core.md`: platform kimliği, ne yaptığı/ne yapmadığı, otorite, kaynak politikası.
- `/llms/entities/**`: platform, uzman, metodoloji ve önemli varlık düğümleri.
- `/llms/methodologies/**`: hesaplama/doğrulama/veri yöntemleri.
- `/llms/regulations/**`: kritik AB mevzuat/uygulama düğümleri.
- `/llms/sectors/**`: demir-çelik, alüminyum, çimento, gübre, hidrojen, elektrik gibi sektör subgraph'ları.
- `/llms/topics/**`: CN/GTİP, 50 ton, precursor, tedarikçi verisi, embedded emissions gibi yüksek değerli bilgi niyetleri.
- `/llms/pages/**`: flagship canonical HTML sayfalarının derin subgraph'ları.

Her LLMS node şu sözleşmeyi taşımalıdır:

```yaml
canonicalWebUrl:
primaryEntity:
primaryIntent:
parentNode:
lastVerified:
officialEvidence:
relatedNodes:
```

Kurallar:

1. Canonical HTML karşılığı olmayan flagship LLMS node oluşturulamaz; saf entity/metodoloji/regulation kayıtları istisnadır.
2. Orphan LLMS node yasaktır.
3. Kök `llms.txt` Tier-1/Tier-2 düğümlere erişim yolu sağlamalıdır.
4. LLMS içeriği HTML ve hesap motoruyla çelişemez.
5. Uydurma mevzuat, tarih, oran, sertifika, kapsam, fiyat veya yetki eklenemez.
6. Resmî kaynak ile piyasa sinyali açıkça ayrılır; piyasa verisi mevzuat gibi sunulamaz.
7. `/llms/**` doğru MIME, UTF-8 ve cache politikasıyla servis edilmelidir.

---

## 5. REGULATORY EVIDENCE GRAPH — SKDM İÇİN HARD GATE

Her kritik mevzuat iddiası mümkün olduğunda aşağıdaki provenance zincirine sahip olmalıdır:

```yaml
claim:
officialSourceUrl:
officialDocumentId:
publicationDate:
effectiveDate:
lastVerified:
affectedSector:
affectedCalculation:
affectedUrls:
affectedLlmsNodes:
```

Zincir:

`EU OFFICIAL SOURCE → REGULATION/IMPLEMENTING ACT → EFFECTIVE DATE → SECTOR/ENTITY → CALCULATION IMPACT → HTML URL → LLMS NODE`

Mevzuat değişikliği geldiğinde etkilenmiş hesaplama veya sayfa sessizce stale bırakılamaz. Doğrulanmamış regulatory claim release alamaz.

---

## 6. ENTITY GRAPH VE STRUCTURED DATA

JSON-LD merkezi builder/registry'den üretilmelidir.

Temel graph:

`Organization → WebSite → WebPage → BreadcrumbList → Page-Specific Entity`

SKDMHesapla için sayfaya göre uygun tipler:

- `Organization`
- `WebSite`
- `WebPage`
- `BreadcrumbList`
- `Service`
- `SoftwareApplication` / `WebApplication`
- `Article` yalnız gerçekten makaleyse
- `Person` yalnız doğrulanabilir uzman/yazar bağında

Schema yalnız görünür ve gerçek içerikle desteklenen iddiaları taşır. `@id` değerleri stabil olmalıdır.

---

## 7. SITEMAP CONTRACT

Sitemap'e yalnız:

`HTTP 200 + canonical + indexable + production URL`

girebilir.

Redirect, 404/410, noindex, staging, preview, duplicate canonical, robots ile yanlışlıkla bloklanan indexable URL ve sahte lastmod yasaktır.

Gerekirse sitemap index; pages, regulatory content, tools/calculators ve supporting content olarak semantik gruplara ayrılır.

---

## 8. ROBOTS VE AI CRAWLER GOVERNANCE

Search/retrieval ile model-training ayrı policy olarak yönetilir.

- Kamuya açık canonical bilgi/hesaplama yüzeyleri: search/retrieval botlarına erişilebilir olmalı.
- Training botları: açıkça tanımlanmış domain policy ile allow/disallow edilir.
- `/admin`, hesap, private API, staging, preview ve hassas endpointler crawl/index dışı kalır.
- Robots duplicate-content çözme aracı değildir.
- Robots ve sitemap arasında kritik çelişki build fail sebebidir.

---

## 9. CONTENT / INFORMATION GAIN CONTRACT

Her yeni indexable sayfa en az bir gerçek bilgi kazancı üretmelidir:

- resmî kaynakların doğru Türkçe açıklaması,
- özgün hesaplama/formül/araç,
- açık metodoloji,
- örnek üretim/veri akışı,
- decision support,
- doğrulanabilir karşılaştırma veya düzenleyici etki açıklaması.

Yasak:

- sırf keyword için düşük değerli seri AI sayfaları,
- kaynakları yeniden yazarak ölçek üretmek,
- sahte freshness,
- yapay backlink/click/review/account ağları,
- resmî dayanağı olmayan mevzuat kesinliği,
- kullanıcı HTML'inde olmayan crawler-only iddialar.

---

## 10. INTENT OWNERSHIP VE CANNIBALIZATION

Her indexable sayfanın tek `primaryIntent` sahibi olmalıdır.

Repo içi duplicate primer intent = kritik hata.  
SAGIARVIL portföyünde cross-domain duplicate ticari intent = kritik hata.

Kararlar:

`KEEP / EXPAND / REFRESH / REPOSITION / MERGE / NOINDEX / DELETE`

---

## 11. INTERNAL LINK GRAPH

- Flagship/regulatory/commercial sayfa orphan olamaz.
- Regulation → methodology → sector/topic → calculator/service bağlantıları anlamlı olmalıdır.
- Anchor metinleri doğal ve açıklayıcı olmalı; keyfî yüzde eşikleri hard rule değildir.
- Broken internal link = release hatası.
- Canonical olmayan/redirect URL'lere sistematik internal link verilmez.

---

## 12. PERFORMANCE / RENDER CONTRACT

Hard production hedefleri:

```yaml
LCP_p75: <= 2.5s
INP_p75: <= 200ms
CLS_p75: <= 0.10
```

Exclusive hedef:

```yaml
LCP_p75: < 2.0s
INP_p75: < 150ms
CLS_p75: < 0.05
```

Field veri yoksa PASS uydurulamaz. SSR/SSG ilk HTML ile hydrated DOM arasında title, H1, canonical, ana indexable içerik ve JSON-LD açısından kritik parity korunmalıdır.

---

## 13. G0–G16 RELEASE GATES

- **G0** Registry integrity
- **G1** HTTP status
- **G2** Canonical integrity
- **G3** Index/noindex integrity
- **G4** Robots ↔ sitemap reconciliation
- **G5** Title/H1/meta requirements
- **G6** SSR/render parity
- **G7** Structured-data validity
- **G8** Entity integrity / stable @id
- **G9** Intra-domain intent collision
- **G10** Cross-domain SAGIARVIL intent collision
- **G11** Internal links / orphan detection
- **G12** Multi-tier LLMS integrity
- **G13** Evidence / regulatory freshness / unsupported-claim control
- **G14** Performance budget
- **G15** Commercial conversion + measurement instrumentation
- **G16** Live production health check

Kritik gate başarısızsa:

`BUILD/RELEASE FAIL → PROD YOK`

Gate'i geçmek için guard/test kapatmak veya doğrulanmamış veriyi doğru varsaymak yasaktır.

---

## 14. DEPLOYMENT CONTRACT

`baseline → branch/change → registry validation → G0–G16 → build/test → diff review → preview → production deploy → live health check → discovery/IndexNow where applicable → measurement`

Yüksek performanslı mevcut URL'ler baseline olmadan toplu rewrite edilmez. IndexNow yalnız başarılı prod deploy sonrası değişen canonical URL'lere uygulanır.

---

## 15. MEASUREMENT & REVENUE LOOP

`query → impression → click → landing → qualified conversion → sale → revenue → gross profit`

Fırsat modeli:

`Expected Search Value = Search Demand × Commercial Intent × Conversion Probability × Ranking Probability × Topical Authority × Information Gain × AI Citation Potential / (Competition × Cost × Risk)`

North Star generic trafik değildir; nitelikli CBAM talebi, gelir ve doğrulanabilir otorite/citation kazanımıdır.

---

## 16. SKDMHESAPLA COMMERCIAL AUTHORITY ARCHITECTURE

Flagship akış:

`SEARCH/REGULATION QUESTION → OFFICIAL SOURCE → TURKISH EXPLANATION → SCOPE/METHOD → CALCULATOR/WORKFLOW → EVIDENCE CHAIN → REPORT/SERVICE CTA`

Her önemli authority page mümkün olduğunca şu özellikleri taşımalıdır:

- net kapsam,
- resmî kaynak,
- son doğrulama tarihi,
- yürürlük/uygulanabilirlik tarihi,
- metodoloji,
- hangi sektör/ürün/veriyi etkilediği,
- ilgili hesaplama/araç,
- related LLMS nodes,
- açık CTA.

---

## 17. HARD PROHIBITIONS

Kesinlikle yasak:

- sahte kullanıcı/hesap/tıklama/review,
- link farm/PBN/manipülatif backlink ağı,
- düşük değerli AI seri üretimi,
- fake freshness,
- sahte mevzuat/sertifika/schema/credential,
- piyasa sinyalini mevzuat diye sunmak,
- robots/sitemap/canonical çatışması,
- preview/staging indexlenmesi,
- ölçülmemiş metriği ölçülmüş gibi raporlamak,
- eski SEO mandate'ini bu dosyanın üzerinde otorite saymak.

---

## 18. 100/100 FINAL ACCEPTANCE CONTRACT

```yaml
brokenCanonical: 0
robotsSitemapConflict: 0
wrongNoindex: 0
orphanIndexable: 0
brokenInternalLinks: 0
schemaCriticalErrors: 0
entityConflicts: 0
undefinedPrimaryIntent: 0
intraDomainIntentCollision: 0
crossDomainIntentCollision: 0
llmsOrphanNodes: 0
llmsBrokenReferences: 0
unsupportedClaims: 0
staleRegulatoryClaims: 0
fakeFreshness: 0
stagingIndexable: 0
previewIndexable: 0
commercialPageWithoutConversionPath: 0
commercialPageWithoutMeasurementContract: 0
```

Field CWV, Search Console, ranking, AI citation veya revenue gibi dış ölçüm verileri yoksa “PASS” uydurulamaz; **UNVERIFIED** kalır.

---

## 19. AJAN ÇALIŞMA PROTOKOLÜ

Her SEO/GEO/LLMS/routing/content görevi öncesinde ajan:

1. Bu mandate'i tamamen oku.
2. Mevcut runtime ve ilgili resmî source durumunu incele.
3. Search Registry kaydını bul/tasarla.
4. Intent owner ve entity owner'ı doğrula.
5. Regulatory claim varsa resmî evidence ve tarihleri doğrula.
6. HTML, schema, sitemap, robots ve LLMS etkisini birlikte değerlendir.
7. G0–G16'yı çalıştır.
8. Fail varsa sebebi düzelt; testi kaldırma.
9. Prod sonrası canlı health-check yap.
10. Yapılmamış testi yapılmış gibi raporlama.

**Durum:** Bu dosya SKDMHesapla'nın SEO/GEO/AEO/LLMS/Search Revenue konularında tek kanonik mandate'idir.

# SKDMHesapla.com — Kurumsal Altyapı Ana Planı (Master Blueprint)

**Doküman türü:** Ürün Gereksinim Dokümanı (PRD) + Teknik Mimari + SEO/AI Stratejisi + Mevzuat Uyum Matrisi + Bütçe ve Yol Haritası
**Sürüm:** 1.0 — 16 Ağustos 2026
**Hazırlayan rol:** Principal Software Architect & SEO/Regulatory Strategy Lead
**Çalışma bağlamı:** Branch `main` — Çalışma dizini `/mnt/agents/output/`

---

## 1. Yönetici Özeti

SKDMHesapla.com, Türkiye'nin AB'ye ihracat yapan sanayi kuruluşlarının **Sınırda Karbon Düzenleme Mekanizması (SKDM/CBAM)** yükümlülüklerini sıfır uzmanlıkla hesaplayıp raporlayabildiği, Türkiye'nin bu alandaki **referans dijital platformu** olacaktır.

**Neden şimdi — zamanlama avantajı:**

- SKDM'nin mali yükümlülük doğuran kesin (definitive) dönemi **1 Ocak 2026'da başladı**; artık sadece raporlama değil, gerçek para (sertifika maliyeti) söz konusu [^1^][^10^].
- AB ithalatçıları, gömülü emisyon verisini Türk ihracatçıdan talep ediyor; veri üretemeyen ihracatçı, AB'nin cezai nitelikteki yüksek **varsayılan (default) emisyon değerleriyle** fiyatlandırılıyor [^12^].
- Türkiye'de İklim Kanunu (Temmuz 2025) yürürlüğe girdi; ulusal ETS pilot dönemi 2026–2027, tam uygulama 2028–2035 — yani iç piyasada da karbon muhasebesi zorunlu hale geliyor [^2^][^4^].
- Türkiye'nin ihracatının yaklaşık %42'si AB'ye; SKDM kapsamı sektör ihracatının %39'u (demir-çelik), %60'ı (alüminyum), %24'ü (çimento) AB'ye yapılıyor [^5^]. Hedef kitle dar ama **yüksek ödeme gücüne sahip ve mecbur** — ideal SaaS nişi.

**Tek cümlelik konumlandırma:** *"CN kodunu seç, 8 adımlık sihirbazı tamamla, SKDM maliyetini ve AB uyumlu emisyon raporunu 5 dakikada al."*

**Kapsam taahhüdü (koşulsuz):** Platform yalnızca SKDM'nin 6 çekirdek sektörünü değil, **20 sanayi sektörünün tamamını** kapsar. Bunun mimari karşılığı Bölüm 4'teki "tek çekirdek + regülasyon bazlı raporlayıcı modüller" yapısıdır: Kullanıcı ürününü seçtiğinde sistem, o ürüne hangi AB kuralının (SKDM, Batarya Tüzüğü, PPWR, EUDR, Kapsam-3 vb.) uygulandığını **kendisi belirler** — kullanıcının mevzuat bilmesi gerekmez.

---

## 2. Hedef Kitle ve Kullanıcı Davranış Modeli

### 2.1 Birincil segmentler

| Segment | Örnek | İhtiyaç | Ödeme eğilimi |
|---|---|---|---|
| İhracatçı üretici (demir-çelik, alüminyum, çimento, gübre) | İsdemir, Erdemir tedarikçileri, alüminyum profil üreticileri | AB müşterisine gömülü emisyon verisi + maliyet projeksiyonu | Yüksek (kurumsal bütçe) |
| Gümrük müşavirleri / dış ticaret firmaları | AB'ye düzenli sevkiyat yöneten müşavirler | Müşterileri adına hızlı, tekrarlanabilir hesaplama | Orta-yüksek (abonelik) |
| Sürdürülebilirlik danışmanlık firmaları | ESG/CBAM danışmanları | White-label raporlama aracı | Yüksek (çok müşterili lisans) |
| KOBİ üreticiler (dolaylı etki) | Büyük tedarikçilere ara mal üretenler | "Müşterim benden karbon verisi istiyor" paniği | Düşük-orta (tek seferlik rapor) |

### 2.2 Türk kullanıcı davranışlarına göre tasarım ilkeleri

Platformun "kullanıcıya soru sorma gereği duyurmayan" yapısı şu davranışsal gerçeklere oturur:

1. **Form korkusu gerçektir.** Türk KOBİ kullanıcısı uzun formu görünce çıkar. Çözüm: tek ekranda tek soru, ilerleme çubuğu, "kaldığın yerden devam et" (tarayıcıda kayıt).
2. **Terim bilmeyebilir ama evrak bilir.** "Gömülü emisyon" demeyin; "faturanızdaki elektrik tüketimi", "GTİP/CN kodunuz", "ürününüzün tonu" deyin. Her alanda "belgenin neresine bakacağını gösteren" mini görsel ipucu.
3. **Akıllı varsayılanlar.** Kullanıcı bilmediği değeri boş bırakabilsin; sistem sektör ortalaması/AB varsayılan değeri ile doldursun ve bunu raporda açıkça "varsayılan değer kullanıldı" olarak işaretlesin (bu aynı zamanda mevzuata uygun davranıştır [^12^]).
4. **Sonuç önce, detay sonra.** İlk ekranda korkutucu tablo değil; net bir cevap: "Bu sevkiyatın tahmini SKDM maliyeti: ~X €". Detay katlanabilir bölümlerde.
5. **Güven görseli.** TÜRKAK akreditasyonu, Ticaret Bakanlığı kaynakları, "Tüzük (AB) 2023/956 Madde X'e dayanır" referansları her raporda görünsün.
6. **WhatsApp kültürü.** Raporu PDF + WhatsApp paylaşım bağlantısı ile verin; Türk iş dünyasında belge WhatsApp'tan dolaşır — bu organik büyüme kanalıdır.
7. **Telefonla aranma beklentisi.** "Sizi arayalım" butonu, her fiyat sayfasında; kurumsal satışın %60+ı telefonda kapanır.
8. **Mobil öncelikli ama masaüstü hesaplamalı.** Keşif mobil, hesaplama masaüstü. Her iki deneyim de birinci sınıf olmalı.

---

## 3. Mevzuat Uyum Matrisi (2026 Gerçekleri)

Platformun hesaplama motoru şu kural setine göre inşa edilecek ve her kural değişikliği **versiyonlanmış kural paketi** olarak yayınlanacaktır:

### 3.1 AB tarafı

| Kural | Güncel durum (Ağustos 2026) | Kaynak |
|---|---|---|
| Temel tüzük | (AB) 2023/956 + değişiklik (AB) 2025/2083 (Omnibus-I) | [^10^][^12^] |
| Kapsam | Çimento, demir-çelik, alüminyum, gübre, elektrik, hidrojen (+ belirli ara mamuller/precursors) | [^1^][^7^] |
| De minimis muafiyeti | Yıllık **50 ton** altı ithalat muaf (elektrik ve hidrojen hariç); eşik aşılırsa tüm yıl kapsama girer | [^9^][^10^] |
| Yetkilendirme | İthalat ancak "yetkilendirilmiş SKDM beyan sahibi" (authorised CBAM declarant) üzerinden | [^1^][^11^] |
| Sertifika satış başlangıcı | 1 Şubat 2027'ye ertelendi; 2026 ithalatlarına ait sertifikalar 2027'de alınacak | [^12^] |
| Sertifika fiyatı | 2026 için **çeyreklik** AB ETS ortalama fiyatı; 2027'den itibaren haftalık ortalama (Q1 2026 ETS ortalaması ≈ 75,4 €/tCO₂ — yön gösterici) | [^1^][^3^] |
| Yıllık beyan tarihi | Ertesi yıl **30 Eylül** (eski tarih 31 Mayıs idi); ilk beyan 2027'de | [^12^] |
| Çeyreklik elde tutma | Çeyrek sonunda yıl başından beri ithal edilen gömülü emisyonun **%50'si** kadar sertifika hesapta bulunmalı (önceden %80) | [^3^][^12^] |
| Doğrulama | Kesin dönemde emisyon verileri **akredite bağımsız doğrulayıcı** tarafından doğrulanmalı | [^7^][^11^] |
| Ücretsiz tahsisat düzeltmesi | AB ETS'deki ücretsiz tahsisatın kademeli kaldırılmasına (2026–2034) paralel ayar faktörü uygulanır | [^12^] |
| Varsayılan değerler | Güvenilir verisi olmayan ülkeler için cezai yüksek varsayılan değerler; demir-çelik/alüminyumda son işlem (finishing) emisyonları artık sayılmıyor | [^12^] |

### 3.2 Türkiye tarafı

| Konu | Durum | Platforma etkisi |
|---|---|---|
| İklim Kanunu | Temmuz 2025'te yürürlükte; ulusal ETS hukuki zemini var [^2^] | "Türkiye ETS hazırlık" modülü 2027 fazında |
| TR ETS pilotu | 2026–2027 pilot; tam dönem 2028–2035; 50.000 tCO₂e altı tesisler (Kategori A) kapsam dışı [^2^][^4^] | Tesislerin "kapsamda mıyım?" testi hesaplayıcısı |
| Karbon bedeli mahsup | Menşe ülkede ödenen karbon bedeli SKDM'den düşülebilir [^1^][^5^] | TR ETS devreye girince "mahsup hesaplayıcı" büyük satış argümanı |
| KVKK | Tesis/emisyon verileri kişisel veri değil ama kullanıcı hesap verileri KVKK + (AB müşterileri için) GDPR kapsamında | Aydınlatma metni, açık rıza, veri saklama politikası zorunlu |

### 3.3 Yasal konumlandırma (kritik!)

Platform **"hesaplama ve bilgilendirme aracı"** olarak konumlanacak, **"resmi beyan/doğrulama hizmeti"** olarak değil. Her raporda şu ifade yer alacak:

> "Bu rapor, (AB) 2023/956 ve 2025/2083 sayılı Tüzükler ile ilgili Uygulama Tüzüklerine dayanan bilgilendirme amaçlı bir hesaplamadır; resmi SKDM beyanı yalnızca yetkilendirilmiş SKDM beyan sahibi tarafından SKDM Kayıt Sistemi üzerinden yapılır ve emisyon verilerinin akredite doğrulayıcı tarafından doğrulanması gerekir."

Bu cümle hem hukuki koruma hem güven sinyalidir — kopyala-yapıştır pazarlama metni değil, dürüstlüktür; Google'ın E-E-A-T ve LLM'lerin kaynak seçim kriterleri bunu ödüllendirir.

---

## 4. Ürün Kapsamı: 20 Sektörü Koşulsuz Kapsayan Mimari

### 4.0 Temel ilke: koşulsuz kapsama, regülasyona göre doğru motor

Tüm sektörler koşulsuz kapsanır; ancak dürüstlük ve hukuki doğruluk gereği her sektör aynı regülasyona tabi değildir. Platformun rekabet üstünlüğü tam da buradadır: **kullanıcının hangi kurala tabi olduğunu bilmesine gerek yoktur — sistem bilir.** Sektörler üç kademede ele alınır:

#### Kademe A — SKDM doğrudan kapsamı (Tüzük 2023/956 + 2025/2083)

| # | Sektör | Yükümlülük |
|---|---|---|
| 1 | Demir ve Çelik | SKDM sertifikası + doğrulanmış gömülü emisyon beyanı |
| 2 | Alüminyum | Aynı (dolaylı emisyon ağırlıklı) |
| 3 | Çimento | Aynı (proses + yakıt emisyonu) |
| 4 | Gübre | Aynı (amonyak/N₂O dahil) |
| 5 | Elektrik | Aynı (yalnız doğrudan emisyon) |
| 6 | Hidrojen | Aynı (üretim rotasına göre) |

#### Kademe B — Doğrudan yükümlülük doğuran komşu AB regülasyonları

| # | Sektör | Uygulanan regülasyon | Platform modülü |
|---|---|---|---|
| 7 | Batarya ve Pil | **Batarya Tüzüğü (AB) 2023/1542:** EV bataryalarında Şubat 2025'ten, >2 kWh endüstriyel ve LMT bataryalarında **Şubat 2026'dan** beri model ve tesis bazında karbon ayak izi beyanı (kg CO₂e/kWh, üçüncü taraf doğrulamalı); Şubat 2027'de Batarya Pasaportu; Ağustos 2027'de tedarik zinciri durum tespiti [^17^][^24^] | Batarya karbon ayak izi hesaplayıcısı + pasaport veri paketi |
| 8 | Ambalaj Sanayi | **PPWR (AB) 2025/40:** **12 Ağustos 2026'dan itibaren yürürlükte** — her ambalaj tipi için AB Uygunluk Beyanı (DoC), Ek VII teknik dosyası, PFAS/ağır metal sınırları, üye ülkelerde EPR kaydı; 2028 harmonize etiket, 2030 geri dönüştürülmüş içerik hedefleri [^13^][^16^] | Ambalaj uygunluk kontrol listesi + DoC/teknik dosya üreteci |
| 9 | Gıda (kakao/çikolata, kahve, soya) | **EUDR (AB) 2023/1115:** büyük/orta operatörler için **30 Aralık 2026**, mikro/küçük için 30 Haziran 2027 — arazi coğrafi konumu + durum tespiti beyanı (DDS); kauçuk ve ahşap da EUDR kapsamında [^19^][^25^] | EUDR hazırlık testi + DDS veri paketi üreteci |
| 10 | Uluslararası Lojistik | Kapsam-3 taşımacılık emisyonu veri talebi (CSRD/VSME zincir baskısı + GLEC/ISO 14083) | Taşıma emisyonu hesaplayıcısı (mod bazlı: kara/deniz/hava/demir) |

#### Kademe C — Dolaylı SKDM etkisi + müşteri veri talebi

Bu sektörler bugün SKDM sertifikası ödemez; ancak (1) çelik/alüminyum girdi kullandıkları için tedarik zinciri üzerinden emisyon verisi talebine "bulaşırlar", (2) AB müşterileri CSRD/Kapsam-3 raporlaması için onlardan ürün karbon ayak izi ister, (3) SKDM kapsamının alt ürünlere (downstream) genişletilmesi AB gündemindedir — hazırlıklı olan kazanır.

| # | Sektör | Birincil ihtiyaç | Platform modülü |
|---|---|---|---|
| 11 | Plastik ve Polimer (granül, PVC boru/profil) | Ürün karbon ayak izi (PCF) + müşteri veri paketi | PCF hesaplayıcı (ISO 14067 mantığı) |
| 12 | Kimya (organik kimyasallar, boya, vernik, endüstriyel gaz) | PCF + tesis enerji yoğunluğu | PCF hesaplayıcı |
| 13 | Cam ve Seramik (şişe cam, düz cam, fayans, vitrifiye) | Fırın ağırlıklı yüksek enerji → PCF | PCF hesaplayıcı (fırın profili) |
| 14 | Kağıt ve Selüloz (karton, oluklu mukavva) | PCF + EUDR-ağaç bağlantısı | PCF hesaplayıcı |
| 15 | Tekstil ve Hazır Giyim (iplik, kumaş, denim, konfeksiyon) | PCF + su/kimyasal ayak izi raporlaması | PCF + su ayak izi modülü |
| 16 | Mobilya (ahşap + metal aksam) | EUDR (ahşap bileşen) + PCF | PCF + EUDR kontrolü |
| 17 | Otomotiv Yan Sanayi (jant, fren, şasi, motor parçaları) | Çelik/alüminyum girdili → dolaylı SKDM + OEM Kapsam-3 talebi | PCF + "girdi SKDM maliyeti" simülatörü |
| 18 | Beyaz Eşya ve Elektronik (OEM) | PCF + marka Kapsam-3 talebi | PCF hesaplayıcı |
| 19 | Kablo ve Tel (bakır/alüminyum yoğun) | Metal girdi emisyon verisi | PCF hesaplayıcı |
| 20 | Kauçuk ve Lastik | PCF + EUDR (doğal kauçuk!) | PCF + EUDR kontrolü |
| — | Ahşap ve Orman Ürünleri (kereste, parke, sunta) | **EUDR doğrudan kapsamı** (ahşap, 7 emtia listesinde) [^19^] | EUDR hazırlık + PCF |

### 4.1 Çekirdek: Deterministik Emisyon Motoru ("SKDM-Engine Core")

Mimari ilke: **hesaplama asla tahmin değildir; versiyonlanmış kural paketi + girdi → bit-bit tekrarlanabilir sonuç.** (Bu, önceki projelerinizdeki FS-008 standardının devamıdır.)

Motor, iki katmandan oluşur:

**Katman 1 — Ortak Çekirdek (tüm 20 sektöre hizmet verir):**

1. **Kural Paketi Kayıt Defteri (Rule Registry):** Her mevzuat değişikliği (ör. 2027'de haftalık fiyatlamaya geçiş, EUDR ertelemesi, PPWR etiket fazı) ayrı versiyon. Her hesaplama hangi kural paketiyle yapıldıysa raporda yazar: `Engine v2.1 / Ruleset EU-2026-Q3`.
2. **Emisyon Faktör Kütüphanesi:** AB SKDM varsayılan değerleri + IPCC + sektörel benchmark'lar + taşıma faktörleri (GLEC/ISO 14083) + elektrik şebeke faktörleri (ülke bazlı); her faktör kaynaklı ve versiyonlu.
3. **Audit Modülü (her raporda):** Girdiler, kullanılan formüller, varsayımlar, uyarılar, kural paketi versiyonu, hesaplama hash'i. Kullanıcı raporu AB ithalatçısına/doğrulayıcıya aynen iletebilmeli.
4. **Doğrulama Katmanı:** Fiziksel tutarsızlıklarda engelleyici uyarı (blocking), şüpheli değerde uyarı (warning), bilgi notu (note). Örnek: "1 ton çelik için 6.000 kWh elektrik girdiniz — sektör aralığı 350–700 kWh; devam edilemez, kontrol edin."

**Katman 2 — Regülasyon Raporlayıcıları (çekirdek çıktısını ilgili AB formatına çevirir):**

| Raporlayıcı | Girdi | Çıktı |
|---|---|---|
| SKDM Raporlayıcı (Kademe A) | Ürün, rota, enerji → gömülü emisyon → sertifika ihtiyacı × çeyreklik ETS fiyatı → €/₺ maliyet | AB iletişim şablonuna uygun emisyon veri paketi + maliyet raporu |
| Batarya CF Raporlayıcı (2023/1542) | Yaşam döngüsü girdileri → kg CO₂e/kWh | Madde 7 uyumlu beyan veri paketi (performans sınıfı hazırlığı) |
| PPWR Raporlayıcı (2025/40) | Ambalaj SKU'su: malzeme, ağırlık, katman | DoC taslağı + Ek VII teknik dosya iskeleti + uygunluk kontrol listesi |
| EUDR Raporlayıcı (2023/1115) | Emtia, menşe, tedarikçi coğrafi konumu | DDS veri paketi iskeleti + risk kontrol listesi |
| PCF Raporlayıcı (Kademe C) | Ürün BOM + enerji + taşıma | ISO 14067 mantığında ürün karbon ayak izi raporu (müşteri talebine hazır format) |
| Kapsam-3 Taşıma Raporlayıcı | Rota, mod, yük, mesafe | ISO 14083/GLEC uyumlu taşıma emisyonu dökümü |

Her raporlayıcıda aynı hukuki konumlandırma geçerlidir: platform **hesaplama/bilgilendirme aracıdır**; resmi beyanlar (SKDM kayıt sistemi, EUDR bilgi sistemi, onaylanmış kuruluş doğrulaması) yetkili aktörlerce yapılır — bu ifade her raporda yer alır.

### 4.2 Yönerge (Wizard) Sistemi — "Soru sormayan" evrensel akış

Tek giriş noktası; sistem regülasyon yönlendirmesini **kullanıcıya hissettirmeden** yapar:

1. **Ürününü bul:** CN/GTİP kodu arama (kodla veya "PVC boru", "araba lastiği", "çikolata" yazarak → akıllı eşleştirme). Kod; sektörü, kademeyi ve uygulanacak regülasyonu otomatik belirler. Kullanıcıya sadece şu söylenir: *"Ürününüz için geçerli kural: SKDM"* veya *"Ürününüz SKDM kapsamında değil; ancak AB müşteriniz sizden ürün karbon ayak izi isteyebilir — işte hazır raporunuz."* (Bu dürüst yönlendirme, Kademe C'de satışın kendisidir.)
2. **Miktar ve dönem:** Kaç ton/adet/kWh, hangi yıl/çeyrek.
3. **Üretim rotası:** Görsel şemayla seçim (örn. "ark ocağı mı, bazik oksijen mi?", "birincil alüminyum mu, hurdadan mı?" — resimli kart).
4. **Enerji ve hammadde girdileri:** Faturadan okunabilir değerler; her alanın yanında "bu değeri nereden bulurum?" ikonu.
5. **Elektrik kaynağı:** Şebeke / YEŞİL tarife / çatı GES — dolaylı emisyonu doğrudan etkiler (satış argümanı).
6. **Bilmediklerin:** Boş bırak → AB varsayılanı/sektör ortalaması ile devam; raporda işaretlenir.
7. **Sonuç ekranı:** Büyük net cevap (Kademe A'da €/t maliyet; Kademe C'de tCO₂e/ürün + "müşterinize gönderin" paketi), benchmark karşılaştırması, senaryo kaydırıcısı ("ETS fiyatı 100 € olursa…").
8. **Rapor al:** Ücretsiz özet PDF / ücretli tam uyum raporu (PDF + Excel + JSON, Audit modüllü) → e-posta + WhatsApp.

### 4.3 Fazlara göre sektör aktivasyon planı

- **Faz 1 (lansman, Ay 1–5):** Kademe A'nın 6 SKDM sektörü (SKDM Raporlayıcı) + Kademe C için **genel PCF hesaplayıcı** (tek motor, sektör şablonları: plastik, kimya, cam-seramik, kağıt, tekstil, mobilya, otomotiv yan sanayi, beyaz eşya, kablo, kauçuk, ahşap). Böylece lansman gününde 20 sektörün tamamı "hesaplanabilir" durumdadır — derin regülasyon modülleri sonradan gelir.
- **Faz 2 (Ay 6–10):** Batarya CF Raporlayıcı (pasaport öncesi pencere!) + PPWR DoC üreteci + EUDR hazırlık modülü (30 Aralık 2026 son tarihine yetişir) + Kapsam-3 taşıma hesaplayıcı + çoklu sevkiyat/portföy paneli + "AB ithalatçıma veri paketi gönder".
- **Faz 3 (Ay 11+):** TR ETS "kapsamda mıyım?" testi + mahsup hesaplayıcı, sektör bazlı derin modüller (tekstil su ayak izi vb.), API (ERP/muhasebe entegrasyonu), white-label danışman lisansı. SKDM kapsamı alt ürünlere genişlerse ilgili Kademe C modülü tek kural paketi güncellemesiyle Kademe A'ya terfi eder — mimari buna hazırdır.

### 4.4 Servis İşleyiş Modeli — Tam Otonom, Danışmansız (cbamvalid.com DNA'sı)

Platform **danışman istihdam etmez**; cbamvalid.com'un yurtdışında kanıtladığı 6 kontrol aynen Türkçe uyarlanır: müşteri kontrollü veri çalışma alanı, deterministik hesaplama motoru, fail-closed kalite kontrolleri, kanıt bağlantılı denetim izi, versiyonlanmış AB kural paketleri, SHA-256 mühürlü dijital teslimat.

**7 durumluk otonom akış:**

```
KEŞİF → ÜRÜN TANIMA → ÇALIŞMA ALANI → HAZIRLIK SKORU → KİLİTLEME (PADDLE) → MÜHÜRLÜ PAKET → DENETİM TESLİMİ
```

1. **Keşif:** Ana sayfada tek soru — "Ne ihraç ediyorsunuz?" (CN kodu veya serbest metin). Sistem regülasyonu kendisi bulur.
2. **Ürün tanıma:** "Ürününüz SKDM kapsamında; 6 adım, belgeleriniz yanınızdaysa ~15 dakika."
3. **Çalışma alanı:** Tek ekranda tek konu; kaldığı yerden devam; bilinmeyen alan boş bırakılır → AB varsayılanıyla devam, raporda işaretli. Fatura/kanıt PDF'i sürüklenir, ilgili alana bağlanır (Faz 1: manuel eşleştirme, Faz 2: OCR).
4. **Hazırlık skoru:** "Case Readiness %" göstergesi; **%100 olmadan kilit açılmaz** (fail-closed). Eksikler tek tıkla listelenir.
5. **Kilitleme + Paddle ödeme:** Fiyat, paket içeriği ve iade koşulları ödeme ekranından **önce** net gösterilir.
6. **Mühürlü paket:** Anında otomatik üretim → indirme + e-posta. İçerik: Denetime Hazırlık Dosyası PDF, Emisyon Hesaplama Eki, Kanıt Kayıt Defteri, Doğrulayıcı Çalışma Alanı XLSX, Hesaplama İzi JSON, Bütünlük Manifestosu (SHA-256).
7. **Denetim teslimi:** Kullanıcı paketi AB ithalatçısına/bağımsız doğrulayıcıya aynen iletir; hesabından süresiz yeniden indirir.

**"Türk kullanıcısı sıkılır" gerçeğine 10 tasarım kuralı:** (1) Ekranda 5'ten fazla alan yok. (2) Her alanda "bunu nereden bulurum?" görsel ipucu. (3) Boş bırak = akıllı varsayılanla devam. (4) Yarım bırakana 24 saat sonra "skorunuz %62, 5 dakikada bitirin" e-postası. (5) Hazır örnek vaka ("Kocaeli çelik tesisi") tek tıkla incelenebilir. (6) Jargon yasağı — teknik terim parantezde. (7) Mobil = keşif/skor, masaüstü = veri girişi. (8) Her ekranda "Takıldınız mı?" → 60 saniyelik anlatım. (9) Telefon beklentisi: "Sizi arayalım" formu — yazılım kullanım desteği, danışmanlık değil. (10) Sonuç büyük ve net: "Dosyanız hazır: 14 belge, 0 engel, 2 uyarı."

**Destek modeli (kararlaştırıldı):** E-posta desteği + ekran içi rehber. Canlı sohbet Faz 2'de değerlendirilir.

**Hukuki konumlandırma (her sayfada ve her raporda):** *"SKDMHesapla, akredite doğrulama görüşü, gümrük onayı veya AB onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır. Resmi SKDM beyanı yalnızca yetkilendirilmiş beyan sahibi tarafından yapılır."*

**Paddle uyum gereksinimleri (Faz 1 zorunlu sayfaları):** Kullanım Koşulları, Gizlilik/KVKK Aydınlatma Metni, İade Politikası, İletişim (gerçek adres + e-posta), şeffaf Fiyatlandırma sayfası. Ürün tanımı her yerde "otomatik dijital teslimatlı self-servis B2B yazılım"; danışmanlık/hukuki tavsiye dili kullanılmaz. Site bu sayfalarla canlıya alınmadan Paddle hesap onayına başvurulmaz.

---

## 5. Teknik Mimari

### 5.1 Önerilen yığın — Firebase-native (proje: `carbon-web-1265b`)

Barındırma kararı: **Firebase Hosting, `carbon-web-1265b` projesi altında.** GitHub reposu açılmayacak; sürüm takibi yerel anlık kopyalarla, dağıtım Firebase CLI ile doğrudan yapılacak.

| Katman | Seçim | Gerekçe |
|---|---|---|
| Frontend | Next.js (App Router, SSG ağırlıklı) → Firebase Hosting | SEO için sunucu tarafı render: programmatik/içerik sayfaları build'de statik üretilir (SSG) — Firebase Hosting bunu CDN üzerinden mükemmel servis eder; dinamik sayfalar Cloud Run üzerinden SSR |
| Hesaplama | Ayrı, saf TypeScript hesaplama paketi (framework'süz) → Cloud Functions (Node 22, 2. nesil) arkasında API | Determinizm, birim testi, versiyonlama; motor frontend'den bağımsız deploy edilir |
| Veritabanı | Cloud Firestore (`europe-west3` Frankfurt bölgesi) | Lead kayıtları, hesaplama oturumları, abonelik durumu; AB bölgesi = GDPR/KVKK veri egemenliği açısından en yakın seçenek |
| Raporlama | Cloud Function içinde sunucu tarafı PDF (şablonlu) + XLSX + JSON → Cloud Storage'a yaz, imzalı URL ile indirt | Audit izi; rapor dosyası kullanıcıya özel, süreli bağlantı |
| Veri güncelleme | Cloud Scheduler + Function: ETS fiyatı haftalık otomatik çekim → Firestore'a "onay bekliyor" yaz, manuel onayla yayına al | Fiyat doğruluğu = itibar; tam otomatik yayın riskli |
| Kimlik/hesap (Faz 2) | Firebase Authentication (e-posta + Google) | Abonelik için hazır altyapı |
| Ödeme | **Paddle (Merchant of Record)** — Türkçe checkout, ₺ gösterimi; webhook'lar Cloud Function'da | KDV'yi Paddle toplar, faturayı Paddle keser; "dijital yazılım, otomatik teslimat" kategorisi AUP uyumu sağlar |
| Analitik | GA4 (Firebase ile native entegre) + Search Console + BigQuery export | SEO ROI ve dönüşüm hunisi ölçümü |
| Ön bellek/CDN | Firebase Hosting'in global CDN'i (Fastly) | Türkiye'den erişimde CDN edge'leri yeterli; ekstra Cloudflare gerekmez |

**Maliyet notu:** Bu mimari lansman ölçeğinde (aylık ~50-100 bin oturum) Firebase Spark (ücretsiz) + düşük Blaze kullanımıyla ayda ~0-100 USD bandında çalışır — bütçeden sunucu kalemi neredeyse sıfırlanır, tasarruf içerik ve SEO'ya aktarılabilir.

### 5.3 Dağıtım süreci (GitHub'suz)

Depo yok; tek dağıtım kaynağı sizin bilgisayarınız. Kurulum bir kez yapılır:

```bash
npm install -g firebase-tools   # bir kez
firebase login                  # bir kez, tarayıcıdan Google hesabınızla
firebase use carbon-web-1265b   # projeyi seç
firebase deploy                 # her yayın: tek komut
```

- `firebase.json` ve tüm proje yapısı deploy'a hazır teslim edilir; `firebase deploy --only hosting` (sadece site) ve `--only functions` (sadece motor) ayrı ayrı çalıştırılabilir.
- Her dağıtımdan önce `firebase hosting:channel:deploy onizleme` ile **canlıya dokunmadan önizleme URL'si** alınır; onayınızdan sonra canlıya alınır.
- Geri dönüş: Firebase konsolundan önceki sürüme tek tıkla rollback (GitHub'a gerek kalmadan sürüm güvenliği).
- Sürüm güvenliği için her deploy öncesi proje klasörünün yerel arşiv kopyası alınır (`YYYYMMDD-surum` adıyla) — Git olmadan da geri dönüş garantisi.

### 5.2 Kalite ve güvenlik standartları

- Hesaplama paketi için **%100 kritik yol birim testi** + AB Komisyonu örnek hesaplamalarıyla regresyon testi (doğruluk kanıtı).
- Her hesaplama **kural paketi versiyonu + girdi hash'i** ile imzalanır; aynı girdi her zaman aynı sonucu verir (denetlenebilirlik).
- OWASP temel seti, rate-limiting, KVKK/GDPR saklama politikaları, erişim logları.
- Hedef: Lighthouse ≥ 90, LCP < 2,0 sn (Türkiye mobil şebeke koşullarına göre optimize).

---

## 6. SEO ve AI/LLM Görünürlük Stratejisi

### 6.1 Anahtar kelime mimarisi (Türkiye'ye özgü)

- **Para kelimeler:** "skdm hesaplama", "sınırda karbon vergisi hesaplama", "cbam hesaplama", "karbon vergisi ne kadar", "skdm raporu nasıl hazırlanır".
- **Sektör uzun kuyruk:** "demir çelik skdm hesaplama", "çimento karbon vergisi 2026", "alüminyum ihracat cbam maliyeti" — her biri için **programmatik açılış sayfası** (6 sektör × alt ürün grupları ≈ 60–120 sayfa, her biri gerçek hesaplayıcıya bağlı).
- **Soru kümeleri (featured snippet + AI cevap hedefi):** "SKDM'yi kim öder?", "50 ton muafiyeti nedir?", "SKDM beyanı ne zaman 2027?" — kısa, net, kaynaklı cevap blokları.

### 6.2 Teknik SEO yapısı

- **Schema.org:** `WebApplication` + `FAQPage` + `HowTo` + `BreadcrumbList`; hesaplayıcı sayfalarında `SoftwareApplication` (aggregateRating yalnızca gerçek veriyle).
- **İçerik hiyerarşisi:** `/skdm-nedir` (pillar) → sektör kılavuzları → CN kodu bazlı alt sayfalar → hesaplayıcı. Tüm sayfalar 3 tıkta ulaşılabilir.
- **Otorite inşası (E-E-A-T):** Her makalede uzman byline'ı, Ticaret Bakanlığı/AB Komisyonu kaynak linkleri, "son güncelleme" tarihi, düzenli mevzuat güncelleme bülteni. Akademik ve resmi kaynaklara atıf — arama motorları ve LLM'ler bunu ayırt edici kalite sinyali olarak okur.
- **LLM görünürlüğü (GEO):** Sayfalarda net tanım paragrafları (LLM'lerin alıntılayacağı 40–60 kelimelik cevap blokları), yapılandırılmış tablolar, `llms.txt` dosyası, orijinal veri (örn. "Türk çelik sektörü ortalama emisyon yoğunluğu" gibi kendi hesapladığınız istatistikler — LLM'ler benzersiz veriyi alıntılar).
- **Hız + mobil:** INP/LCP bütçeleri PRD'ye yazılır, her release'te ölçülür.

### 6.3 İçerik takvimi (ilk 6 ay)

Ayda 8 içerik: 2 sektör derin kılavuzu, 2 mevzuat güncellemesi ("Omnibus sonrası ne değişti"), 2 hesaplayıcı bağlantılı "nasıl hesaplanır" yazısı, 1 karşılaştırma ("varsayılan değer vs. gerçek veri maliyet farkı"), 1 vaka anlatımı.

---

## 7. Gelir Modeli — "Kilit Başına Tek Ödeme" (kararlaştırıldı)

**Temel model (cbamvalid.com DNA'sı):** Platformun tamamı ücretsiz kullanılır — veri girişi, hesaplama, kalite kontrolleri, hazırlık skoru. Ödeme **yalnızca "paketi mühürle ve indir" (lock) anında**, Paddle üzerinden tek seferlik alınır. Bu model: (1) "önce para istedi" güven bariyerini sıfırlar, (2) kullanıcı değeri görmeden ödeme yapmaz, (3) Paddle'a net bir dijital teslimat anı tanımlar.

| Katman | Fiyat önerisi (₺) | İçerik |
|---|---|---|
| Ücretsiz çalışma alanı | 0 | Sınırsız veri girişi, hesaplama, hazırlık skoru, QC uyarıları, özet görünüm |
| Mühürlü Paket (tek dosya) | 4.900–7.900 | Denetime Hazırlık Dosyası PDF + Emisyon Hesaplama Eki + Kanıt Kayıt Defteri + Doğrulayıcı Çalışma Alanı XLSX + Hesaplama İzi JSON + SHA-256 Bütünlük Manifestosu + süresiz yeniden indirme |
| Yeniden mühürleme (veri güncelleme sonrası) | 1.900–2.900 | Aynı dosyanın yeni kural paketi/veriyle güncel mührü |
| Çoklu tesis/ürün paketi (Faz 2) | 14.900–24.900/yıl | 5+ dosya hakkı, portföy paneli — kilit başına ödemenin doğal uzantısı (abonelik değil, hak paketi) |
| White-label (Faz 3) | 60.000–120.000/yıl | Danışmanlık firmaları kendi markasıyla; müşteri fiyatını kendisi belirler |

**İade politikası (Paddle uyumlu, sitede yayınlanır):** "Paket mühürlenip indirildikten sonra iade yoktur (anında ifa edilen dijital içerik); mühürleme öncesi tüm aşamalar ücretsizdir. Teknik hata durumunda 14 gün içinde destek@skdmhesapla.com'a başvurulur."

**12. ay hedefi (gerçekçi senaryo):** 40–60 bin aylık organik oturum → 1.500–2.500 çalışma alanı başlangıcı/ay → %40 tamamlama → 600–1.000 kilitleme eşiği/ay → %15–25 ödeme dönüşümü → aylık 90–700 kilit × ortalama 6.000 ₺ ≈ **aylık 550 bin – 4,2 milyon ₺ bandı** (muhafazakâr senaryo: 300–500 bin ₺/ay).

### 7.1 Rekabet ve Fiyat Araştırması (Deep Research — Ağustos 2026)

**Türkiye pazarındaki oyuncular ve fiyat aralıkları:**

| Oyuncu | Tip | Fiyat (gözlenen) | Kaynak |
|---|---|---|---|
| CASEM ESG (+ SUSTAINES AI yazılımı) | SKDM/CBAM rapor danışmanlığı | **25.000 – 200.000 ₺** (ürün grubu, çeyrek sayısı ve müşteri sayısına göre) | [^32^][^36^] |
| Armut.com pazar yeri firmaları | Karbon ayak izi hesaplama hizmeti | **10.000 – 90.000 ₺** | [^31^] |
| E-Karbon | ISO 14064-1 kurumsal karbon ayak izi yazılımı (abonelik) | USD bazlı kademeli paketler (Class1ka/2ka/3ka); ek kullanıcı +250 USD, ek rapor +100 USD | [^33^] |
| CimpactPro | CBAM beyan yazılımı + kurumsal karbon + ESG paketi | Fiyat gizli — "demo talep et" modeli | [^28^] |
| Climeteo, Alaz Karbon, Escarus (TSKB) vb. | SKDM danışmanlık/içerik firmaları | Fiyat gizli — "teklif alın" modeli | [^8^][^52^][^51^] |
| QSI/DANEM, AURA vb. | Doğrulama (verification) kuruluşları | Teklif bazlı puanlama modeli | [^29^][^48^] |

**Doğrulama pazarı (ayrı ve zorunlu maliyet kalemi — rakip değil, tamamlayıcı):** Akredite SKDM doğrulaması tesis başına **5.000 € – 50.000 €** aralığında (tek ürün/basit süreç 5–12 bin €; çok ürünlü karmaşık tesis 40–50 bin €). İlk dönemde fiziki saha ziyareti zorunlu; doğrulayıcı kapasitesi Avrupa genelinde kıt — 2026 sonu–2027 başında talep patlaması bekleniyor [^45^]. **Stratejik sonuç:** Doğrulayıcılar rakibimiz değil, en doğal iş ortağımızdır — bizim mühürlü paketimiz doğrulayıcının işini kolaylaştırır; karşılıklı yönlendirme (lead) modeli kurulabilir.

**Devlet desteği faktörü (fiyatlandırmayı doğrudan etkiler):** Ticaret Bakanlığı **Responsible® / Yeşil Mutabakata Uyum Projesi Desteği**, son 3 yılda toplam 300 bin USD+ ihracat yapan firmaların yeşil dönüşüm danışmanlığı giderlerini **%50 oranında, 5 yılda 10–13,6 milyon ₺'ye kadar** hibe ile karşılıyor; kapsama yazılım lisansları ve karbon ayak izi hesaplaması da giriyor [^38^][^39^][^40^]. Hizmet ihracatçıları için Sürdürülebilirlik Programı'nda limit 20 milyon ₺ [^37^]. **Sonuç:** Danışmanlık rakiplerimiz "net fiyat = liste fiyatı ÷ 2" diye satış yapabiliyor. Buna karşı hamlemiz: (1) liste fiyatımız zaten danışmanlığın hibe-öncesi fiyatının %3–10'u; (2) Faz 2'de hibe başvurularında geçerli olacak Türk faturası/şartname uyumu değerlendirilmeli (Paddle MoR modelinde Türk KDV faturası Paddle keser — hibe uyumu için ayrıca incelenir).

**Pazar boşlukları (bizim fırsatlarımız):**

1. **Fiyat şeffaflığı yok:** Neredeyse tüm rakipler "teklif alın" diyor — Türk kullanıcısı form doldurup aranmayı sevmez. Sitede yazan net fiyat + tek tık satın alma = doğrudan fark yaratır.
2. **Danışmanlık bağımlılığı:** Rakipler insan emeği satar (haftalar sürer); biz dakikalar içinde mühürlü paket üretiriz. 25–200 bin ₺'ye karşı 4.900–7.900 ₺ = **5–40 kat fiyat avantajı**.
3. **Abonelik dayatması:** Yazılım rakipleri USD bazlı yıllık abonelik satar; KOBİ tek seferlik ₺ ödemeyi sever (pay-at-lock modeli tam buna oturur).
4. **Dil ve odak:** Rakip yazılımlar genel karbon muhasebesi aracı; bizim tek işimiz "SKDM denetime hazır dosya" — arama niyetiyle birebir eşleşen konumlandırma.
5. **Doğrulayıcı kıtlığı dalgası:** 30 Eylül 2027 ilk beyan tarihi yaklaştıkça "doğrulamaya hazır dosya" talebi patlayacak; 2026 sonu–2027 yazı altın satış penceresi [^45^].

---

## 8. 1 Milyon ₺ Bütçe Dağılımı (Önerilen)

| Kalem | Tutar (₺) | Açıklama |
|---|---|---|
| Ürün + teknik tasarım (bu blueprint'in detaylandırılması, UX prototip) | 90.000 | Kullanıcı testleri dahil |
| Hesaplama motoru geliştirme + doğrulama testleri | 220.000 | En kritik yatırım; AB örnek hesaplarıyla regresyon |
| Web platformu (frontend + backend + ödeme + raporlama) | 300.000 | Faz 1 kapsamı |
| Mevzuat danışmanlığı (SKDM uzmanı hukukçu/çevre mühendisi gözden geçirmesi) | 60.000 | "Mevzuata tam uyum" iddiasının kanıtı |
| İçerik üretimi (ilk 6 ay, uzman yazar + SEO editörü) | 120.000 | Programmatik sayfalar dahil |
| SEO teknik kurulum + dijital PR/backlink | 80.000 | Otorite sitelerden bağlantı |
| Marka kimliği + tasarım sistemi | 60.000 | Kurumsal güven görseli |
| Yedek/beklenmedik (değişen mevzuata hızlı uyum payı) | 70.000 | SKDM kuralları 2026–2027'de değişmeye devam edecek |
| **Toplam** | **1.000.000** | |

> Not: Bu bütçe Faz 1'i (lansman + ilk 6 ay) finanse eder. Faz 2–3, gelirden veya ek yatırımla.

---

## 9. 12 Aylık Yol Haritası

| Dönem | Kilometre taşı |
|---|---|
| Ay 1–2 | Detay PRD, UX prototip, hesaplama motoru çekirdeği + uzman mevzuat gözden geçirmesi |
| Ay 3–4 | Platform geliştirme, 6 sektör modülü, kapalı beta (10 ihracatçı + 2 danışman firma ile gerçek veri testi) |
| Ay 5 | Lansman: hesaplayıcılar + 60 programmatik sayfa + pillar içerikler; Search Console, schema, llms.txt |
| Ay 6–8 | İçerik motoru tam hız; ilk ücretli rapor satışları; "AB ithalatçıma veri paketi" özelliği |
| Ay 9–10 | Faz 2: abonelik, portföy paneli, danışman lisansı; **31 Mart 2027 ilk beyan dönemi öncesi** agresif pazarlama |
| Ay 11–12 | Faz 3 hazırlığı: TR ETS modülü tasarımı (pilot 2026–2027'ye yetiştirilecek), API beta |

**Kritik tarih avantajı:** İlk resmi SKDM beyanı 2027'de (30 Eylül) yapılacak ve sertifika satışları Şubat 2027'de başlıyor [^12^] — 2026 sonu–2027 başı, tüm ihracatçıların panikle çözüm aradığı **altın dönem**dir; platformun bu tarihten önce otorite kurmuş olması gerekir.

---

## 10. Başarı Ölçütleri (KPI)

- **SEO:** 6. ayda "skdm hesaplama" ve türevlerinde ilk 3 sıra; 12. ayda 60+ programmatik sayfada ilk sayfa.
- **Dönüşüm:** Hesaplayıcı başlangıç → tamamlama oranı ≥ %40 (wizard tasarımının gerçek testi).
- **Gelir:** Yukarıdaki senaryo bandı; aylık tekrarlayan gelirin (MRR) 12. ayda 250 bin ₺'yi aşması.
- **Güven:** Raporların akredite doğrulayıcı/ithalatçı tarafından kabul edilme oranı (anketle ölçülür) ≥ %90.
- **Teknik:** Hesaplama motoru regresyon testleri her kural güncellemesinde yeşil; uptime ≥ %99,9.

---

## 11. Riskler ve Önlemler

| Risk | Olasılık | Önlem |
|---|---|---|
| Mevzuat değişikliği (SKDM kuralları 2027'de yeniden gözden geçirilecek) | Yüksek | Versiyonlanmış kural paketi + bütçede değişim payı + mevzuat aboneliği |
| Yanlış hesaplama → itibar/hukuki risk | Orta | AB örnek hesap regresyon testleri, uzman gözden geçirme, net sorumluluk reddi |
| Büyük oyuncuların (KPMG vb.) benzer araç çıkarması | Orta | Hız + Türkçe derinlik + fiyat avantajı; onların aracı danışmanlığa kapı, bizimki self-servis |
| Düşük arama hacmi ("skdm hesaplama" niş) | Orta | Uzun kuyruk + İngilizce alt bölüm ("cbam calculator turkey" — AB ithalatçıları da arar) |
| Ücretsiz varsayılan değerlerle kullanıcıların "idare etmesi" | Düşük | Raporlarda "varsayılan değer kullanmanın cezai maliyet farkı"nı gösteren korku-gerçeklik dengesi |

---

## 12. Sonraki Adım Önerisi

Bu blueprint onaylandıktan sonra önerilen sıra:

1. **Detay PRD** (her ekranın tel çerçevesi + her formülün matematiksel tanımı),
2. **Hesaplama motoru prototipi** (tek sektör — demir-çelik — ile uçtan uca kanıt),
3. **Mevzuat uzmanı sözleşmesi** (gözden geçirme + sürekli danışmanlık),
4. Faz 1 geliştirme sprintleri.

---

## Kaynakça

[^1^]: European Commission — Taxation and Customs Union, "CBAM definitive regime" (2026): https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en
[^2^]: Kabine Law, "Emisyon Ticareti Sistemleri ve Türk İklim Kanunu'nun Analizi" (2026): https://www.kabinelaw.com/tr/emisyon-ticareti-sistemleri-ve-turk-iklim-kanununun-analizi/
[^3^]: CBAM Guide, "CBAM Quarterly Holding Requirement: The 50% Rule Explained" (2026): https://cbamguide.com/importers/quarterly-holding/
[^4^]: Green Carbon AI, "ETS (Emisyon Ticaret Sistemi) Nedir? Nasıl Çalışır?" (2026): https://www.greencarbonai.com/blog/ets-emisyon-ticaret-sistemi-nedir-nasil-calisir
[^5^]: Ankara Hacı Bayram Veli Üniversitesi İİBF Dergisi 27/1 (2025), "Sınırda Karbon Düzenleme Mekanizması ve Türkiye'ye Olası Etkileri": https://dergipark.org.tr/tr/download/article-file/4403519
[^7^]: BİNTSO, "İklim Değişikliği, AB Yeşil Mutabakatı ve Sınırda Karbon Düzenleme Mekanizması" bilgilendirme dokümanı: https://www.bintso.org.tr/Portals/304/dosyalar/ihracat-tesvik/2023/9-%20AB%20S%C4%B1n%C4%B1rda%20Karbon%20D%C3%BCzenleme%20Mekanizmas%C4%B1%2018.08.2023.pdf
[^9^]: DEHSt (Alman Emisyon Ticareti Otoritesi), "CBAM Definitive Regime from 2026" (2026): https://www.dehst.de/EN/Topics/CBAM/CBAM-definitive-regime-2026/cbam-definitive-regime-2026_node.html
[^10^]: Reed Smith, "What you need to know as CBAM simplification comes into effect" (2025): https://www.reedsmith.com/our-insights/blogs/viewpoints/102lr9t/what-you-need-to-know-as-cbam-simplification-comes-into-effect/
[^11^]: UİB (Uludağ İhracatçı Birlikleri), "AB SKDM Uygulama Esasları ve Bilgilendirme Dokümanları": https://uib.org.tr/tr/library-download/ab-sinirda-karbon-duzenleme-mekanizmasi-uygulama-esaslari-ve-bilgilendirme-dokumanlari
[^12^]: ICAP (International Carbon Action Partnership), "EU adopts simplifications of CBAM rules ahead of compliance phase starting 2026" (2025): https://icapcarbonaction.com/en/news/eu-adopts-simplifications-cbam-rules-ahead-compliance-phase-starting-2026
[^13^]: business.gov.uk, "Packaging and Packaging Waste Regulation (PPWR) — guidance for businesses" (2026): https://www.business.gov.uk/product-safety-and-requirements/packaging-producer-responsibilities/packaging-and-packaging-waste-regulation-ppwr/
[^16^]: European Commission, "Packaging waste — PPWR (EU) 2025/40 overview": https://environment.ec.europa.eu/topics/waste-and-recycling/packaging-waste_en
[^17^]: Asuene, "EU Battery Regulation: Carbon Footprint Declaration timeline" (2025): https://www.asuene.com/en/blog/eu-battery-regulation-carbon-footprint/
[^19^]: Coolset, "EUDR timeline: application dates for operators and SMEs" (2026): https://www.coolset.com/blog/eudr-deforestation-regulation
[^24^]: PSQR, "EU Battery Regulation 2023/1542 — carbon footprint and battery passport requirements" (2025): https://www.psqr.eu/eu-battery-regulation
[^25^]: EY, "EU Deforestation Regulation — what companies need to know" (2026): https://www.ey.com/en_gl/insights/sustainability/eu-deforestation-regulation
[^28^]: CimpactPro, "Questions About SKDM / CimpactPro CBAM Declaration Software": https://cimpactpro.com/en/faq/questions-about-skdm
[^29^]: QSI Belgelendirme, "SKDM – Sınırda Karbon Düzenleme Mekanizması Doğrulama" (2026): https://www.qsi.com.tr/dogrulama/skdm-sinirda-karbon-duzenleme-mekanizmasi-dogrulama/
[^31^]: Armut.com, "Karbon Ayak İzi Hesaplama Firmaları — fiyat aralıkları" (2026): https://armut.com/karbon-ayak-izi-hesaplama
[^32^]: CASEM ESG, "SKDM (CBAM) Danışmanlığı — ücretleri etkileyen faktörler ve 25.000–200.000 TL bandı" (2025): https://www.casem.com.tr/skdm-ve-cbam-danismanligi/
[^33^]: E-Karbon, "Paketler & Yazılımlar — Class1ka/Class2ka/Class3ka paket içerikleri ve ücret şartları" (2025): https://e-karbon.com/paketlerveyazilimlar/
[^36^]: CASEM ESG, "CBAM - SKDM Yazılımı (SUSTAINES)" (2025): https://www.casem.com.tr/cbam-skdm-yazilimi/
[^37^]: Scale İstanbul, "Ticaret Bakanlığı Sürdürülebilirlik Programı — %50 hibe, 20 milyon TL limit" (2026): https://scaleistanbul.com/ticaret-bakanligi-surdurulebilirlik-programi/
[^38^]: DAKA, "Ticaret Bakanlığı Yeşil Mutabakata Uyum Projesi Desteği (Responsible®) — %50 hibe, 10 milyon TL" (2026): https://www.daka.org.tr/hibefonlar/3299
[^39^]: Ticaret Bakanlığı, "Ticaret Bakanlığından ihracatta yeşil dönüşüme destek paketi" (2024): https://ticaret.gov.tr/haberler/ticaret-bakanligindan-ihracatta-yesil-donusume-destek-paketi
[^40^]: Para Dergisi, "İhracatta yeşil dönüşüme destek — 13.645.000 TL'ye kadar destek" (2025): https://www.paradergi.com.tr/is-dunyasi-kulis/2025/05/05/ihracatta-yesil-donusume-destek
[^45^]: CBAM Guide, "Finding a CBAM Verifier: Costs (€5K–€50K), Requirements, and What to Ask" (2026): https://cbamguide.com/importers/verification/
[^48^]: AURA Doğrulama, "ISO 14064-1 Kurumsal Karbon Ayak İzi Doğrulama Süreleri ve Ücretleri": https://www.seragazidogrulama.com/iso-14064-1-kurumsal-karbon-ayak-izi-dogrulama-sureleri-ve-ucretleri
[^51^]: TSKB / Escarus, "Sustainability Consultancy": https://www.tskb.com.tr/en/services/advisory-services/sustainability-consultancy
[^52^]: Alaz Karbon, "SKDM Uygulama Takvimi: Aşamalı Geçiş" (2026): https://www.alazkarbon.com/tr-TR/blog/skdm-cbam/skdm-uygulama-takvimi-asamali-gecis

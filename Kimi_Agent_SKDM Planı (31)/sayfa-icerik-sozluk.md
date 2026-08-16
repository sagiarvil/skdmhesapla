# SKDM Sözlüğü — Tam Başucu Kaynağı (v3)
**URL:** /sozluk/ · **Kural:** Her terim önce günlük dilde açıklanır, sonra resmi karşılığı ve **nerede kullanıldığı** verilir. Arayüzdeki her `(i)` ipucu penceresi bu sayfadaki tanıma bağlanır (G-21 tek kaynak). Terimler arası bağlantılar "Bkz." ile gösterilir.
**SEO notu:** Başlık: "SKDM Sözlüğü 2026 — CBAM Terimleri, İngilizce-Türkçe Karşılıkları ve Anlamları". Meta: "CBAM/SKDM mevzuatında ve yabancı kaynaklarda geçen tüm İngilizce terimlerin Türkçe karşılığı, anlamı ve kullanım yeri: embedded emissions, default values, authorised declarant, monitoring plan ve daha fazlası."
**Arama:** Sayfa üstünde arama kutusu; Türkçe terim, İngilizce karşılık ve açıklama metni içinde arama yapar (Ek G §21).

---

## Önce buradan başlayın — durumunuza göre yol haritası

**"SKDM'yi ilk kez duyuyorum":** SKDM/CBAM → Alıcı → Kesin dönem → De minimis → SEE → Sertifika. Bu altı terim konunun %80'idir.

**"Alıcım benden veri istedi, ne yapacağımı bilmiyorum":** Alıcı → Tedarikçi veri dosyası → Resmî şablon → Gömülü emisyon → Veri talebi → Triyaj. Sonra /basla/ sayfasından dosyanızı başlatın.

**"Dosyamı hazırlıyorum, formdaki terimleri anlamıyorum":** Faaliyet verisi → Emisyon faktörü → NCV → Kaynak akışı → Süreç emisyonu → Öncü madde → Bubble approach → Kontrol denkliği. Formda her alanın yanındaki `(i)` penceresi de buraya bağlanır.

**"Doğrulayıcıyla çalışacağım":** Akredite doğrulayıcı → Doğrulama → İzleme planı → Emisyon raporu → Site visit (saha ziyareti) → Kayıt saklama → Misstatement.

**"İngilizce kaynak okuyorum, terimler karışık":** Doğrudan aşağıdaki **İngilizce → Türkçe bölümüne** geçin.

---

# BÖLÜM 1 — İngilizce → Türkçe tam karşılıklar
*(Yabancı kaynaklarda, AB metinlerinde ve rakip sitelerde geçen her terim; Türkçe karşılığı, sade anlamı ve nerede kullanıldığıyla.)*

### Temel kavramlar

**CBAM (Carbon Border Adjustment Mechanism) → Sınırda Karbon Düzenleme Mekanizması (SKDM).** AB'ye ithal edilen belirli ürünlerin üretimindeki karbonu fiyatlayan düzenleme. *Nerede kullanılır:* AB resmi metinleri, İngilizce kaynaklar ve teknik dokümanlarda "CBAM"; Türk kullanıcıya dönük metinlerde "SKDM" (terminoloji sabiti, ikisi de doğru).

**Embedded emissions → Gömülü emisyon.** Bir ürünün üretimi sırasında açığa çıkan toplam sera gazı emisyonu. *Nerede kullanılır:* Alıcınızın istediği verinin özü budur; formlarda "gömülü emisyon" olarak geçer.

**SEE (Specific Embedded Emissions) → Spesifik gömülü emisyon.** Bir ton ürün başına düşen ton CO₂e. SKDM'nin kalbi olan sayı; sertifika maliyeti bununla hesaplanır. *Nerede kullanılır:* Sonuç ekranları ve mühürlü pakette; "SEE" kısaltması çevrilmez.

**Direct emissions → Doğrudan emisyon.** Tesisinizde yakıt yakılması veya kimyasal süreçlerden çıkan emisyon (kapsam 1). *Nerede kullanılır:* B_EmInst katmanı, kaynak akışı satırları.

**Indirect emissions → Dolaylı emisyon.** Üretimde kullanılan elektriğin üretiminden doğan emisyon (kapsam 2). *Nerede kullanılır:* Şu an yalnız çimento ve gübrede bedele dahil; diğer sektörlerde bildirim amaçlı (Annex II kuralı, CN seviyesinde).

**Actual emissions → Gerçek (ölçülmüş) emisyon.** Tesisinizin kendi verileriyle hesaplanan emisyon. *Nerede kullanılır:* "Actual vs default" karşılaştırmasında; varsayılan değerin karşıtı.

**Default values → Varsayılan değerler.** Gerçek veri yoksa uygulanan, kasıtlı yüksek tutulmuş resmi değerler. *Nerede kullanılır:* Beyan ekranları; "varsayılan değerle beyan = alıcınız için daha pahalı sertifika" demektir.

**Goods → Mallar/Ürünler.** SKDM kapsamındaki ithal ürünler. *Nerede kullanılır:* Şablonun G1–G10 katmanları "goods" katmanlarıdır.

**Simple goods → Basit mallar.** Üretiminde SKDM kapsamı öncü madde kullanılmayan ürünler; yalnız kendi sürecinin emisyonu hesaplanır. *Nerede kullanılır:* Süreç tanımında; öncü madde bölümünü atlamanızı sağlar.

**Complex goods → Bileşik mallar.** Üretiminde kapsam içi öncü madde kullanılan ürünler; öncünün gömülü emisyonu da hesaba katılır. *Nerede kullanılır:* E_PurchPrec katmanının doldurulma nedenidir.

**Precursor → Öncü madde.** Kendi üretiminizde girdi olarak kullandığınız ve kendisi de SKDM kapsamında olan madde (ör. gübre için amonyak). *Nerede kullanılır:* E_PurchPrec katmanı; tedarikçinizden SEE verisi istemeniz gerekir.

**Bubble approach → Bubble approach (kapsül yaklaşımı).** Bir ara ürünün tamamı tek akışa gitmiyorsa her akışın ayrı üretim süreci sayılması kuralı. Türkçe karşılık icat edilmez (terminoloji sabiti). *Nerede kullanılır:* Gübre/çelik gibi çok akışlı tesislerde süreç tanımında.

**Carbon leakage → Karbon kaçağı.** Üretimin karbon maliyeti nedeniyle AB dışına kayması riski; SKDM'nin varlık nedeni. *Nerede kullanılır:* Mevzuat gerekçelerinde ve analiz yazılarında.

### Oyuncular

**Operator → Operatör (tesis işletmecisi).** Üretim tesisini işleten taraf — sizsiniz. *Nerede kullanılır:* IR 2025/2547 metinlerinde; formlarda "tesis/firma" olarak görünür.

**Installation → Tesis.** Emisyonların doğduğu fiziksel üretim yeri. *Nerede kullanılır:* A_InstData katmanı, UNLOCODE ve koordinat alanlarının ait olduğu birim.

**(Authorised CBAM) Declarant → Yetkili beyan sahibi.** CBAM Registry'de beyan yapma yetkisi verilmiş AB tarafı; genellikle alıcınız. *Nerede kullanılır:* Beyan sorumluluğunun onda olduğunu hatırlatan her ekranda.

**Importer → İthalatçı / alıcı.** Ürününüzü AB'ye ithal eden firma; sertifikayı o satın alır. *Nerede kullanılır:* Triyaj ve alıcı bilgisi alanlarında.

**Accredited verifier → Akredite doğrulayıcı.** Verilerinizi denetleyen bağımsız, AB tanınırlıklı kuruluş. *Nerede kullanılır:* Doğrulama bölümü ve A.3 alanlarında.

**Competent authority → Yetkili otorite.** Her AB ülkesinde SKDM'yi denetleyen resmi kurum. *Nerede kullanılır:* Yaptırım ve bildirim süreçlerinde.

**European Commission / DG TAXUD → Avrupa Komisyonu / TAXUD Genel Müdürlüğü.** SKDM mevzuatını yazan ve işleten birim. *Nerede kullanılır:* Resmi kılavuzların yayıncısı olarak kaynaklarda.

### Hesaplama terimleri

**Activity data → Faaliyet verisi.** Döneme ait ölçülen miktar: yakılan gaz (m³), tüketilen elektrik (MWh), üretilen ürün (ton). *Nerede kullanılır:* B_EmInst satırları ve süreç katmanlarının temel girdisi.

**Emission factor → Emisyon faktörü.** Bir birim faaliyetin kaç ton CO₂e ürettiğini gösteren katsayı. *Nerede kullanılır:* B_EmInst'ta her kaynak akışında; ulusal envanter veya AB değerleri.

**NCV (Net Calorific Value) → Net kalorifik değer.** Birim yakıtın sağladığı enerji (MJ/m³ vb.). *Nerede kullanılır:* B_EmInst'ta faaliyet verisini enerjiye çevirmek için zorunlu alan.

**Source stream → Kaynak akışı.** Emisyona yol açan tek bir yakıt/malzeme akışı (ör. doğalgaz hattı, kok girişi). *Nerede kullanılır:* B_EmInst katmanının satır birimi (≤29 satır).

**Combustion emissions → Yakma emisyonları.** Yakıt yakımından doğan emisyon; yöntem sütununda "Combustion". *Nerede kullanılır:* B_EmInst yöntem seçimi.

**Process emissions → Süreç emisyonları.** Kimyasal reaksiyondan doğan emisyon (ör. kireç taşı → klinker). *Nerede kullanılır:* B_EmInst'ta "Process" yöntemiyle izlenen satırlar.

**Mass balance → Kütle dengesi.** Emisyonun giren-çıkan karbon farkından hesaplandığı yöntem. *Nerede kullanılır:* B_EmInst'ın üçüncü yöntemi; çelik tesislerinde yaygın.

**Functional unit → Fonksiyonel birim.** Sürecin tanımlandığı ölçü birimi (ör. "1 ton sıvı çelik"). *Nerede kullanılır:* IR 2025/2547 Md.4; aynı birime sahip mallar tek süreçte toplanabilir.

**Production process → Üretim süreci.** Bir ürün grubunun üretildiği teknik hat; şablonda P1–P10 katmanları. *Nerede kullanılır:* Süreç tanımları ve emisyon dağıtımında.

**Production level / control equation → Üretim dengesi / kontrol denkliği (a = b+c+d).** Üretilen miktarın satışa, tesis-içi tüketime ve stoka giden payların toplamına eşit olması kuralı. *Nerede kullanılır:* D_Processes katmanı; sağlanmadan mühür engellenir.

**Heat (import/export) → Isı (alım/satım).** Tesise giren veya çıkan ısı enerjisinin emisyon paylaşımı. *Nerede kullanılır:* Isı modülü; demir-çelik ve çimentoda zorunlu.

**Waste gas → Atık gaz.** Süreçte çıkıp yakıt olarak yeniden kullanılan gaz (yüksek fırın gazı vb.). *Nerede kullanılır:* B_EmInst'ta ayrı kaynak akışı; atık gaz modülü.

**Monitoring methodology → İzleme metodolojisi.** Hangi parametrenin nasıl ölçüleceğini tanımlayan plan (sayaçlar, analizler, hesap yöntemleri). *Nerede kullanılır:* İzleme planının gövdesi.

### Belge ve süreç terimleri

**Monitoring Plan → İzleme planı.** Tesisin hangi veriyi, hangi yöntemle, hangi sıklıkla ölçeceğini tanımlayan belge. IR 2025/2547'nin çekirdek belgesi. *Nerede kullanılır:* Kesin dönem dosyasının omurgası; bizim 10 katmanlı yapının hukuki karşılığı.

**(Operator's) Emissions Report → Emisyon raporu.** İzleme planına göre toplanmış yıllık doğrulanmış emisyon verisi. *Nerede kullanılır:* Doğrulayıcıya giden ana belge.

**Communication Template → İletişim şablonu (Resmî şablon).** AB'nin tesis verileri için yayımladığı Excel dosyası. Bizim sistemde **çıktı formatıdır**, veri modelinin kendisi değildir (adapter). *Nerede kullanılır:* Alıcınız bu formatı istediğinde mühürlü pakette üretilir.

**Verification report → Doğrulama raporu.** Akredite doğrulayıcının denetim sonucu belgesi. *Nerede kullanılır:* Alıcınızın beyanına eklenir.

**Site visit → Saha ziyareti.** İlk dönemde doğrulayıcının tesise fiziksel gelmesi zorunluluğu. *Nerede kullanılır:* Doğrulama takvimi planlamasında; 2026 ilk dönem için kapasite darboğazı uyarısı.

**Misstatement → Yanlış beyan/yanlışlık.** Doğrulayıcının bulduğu maddi hata. *Nerede kullanılır:* Doğrulama bulgularında; sistemimizde G-23 diliyle "gözden geçirin" olarak sunulur.

**Correction → Düzeltme.** Beyan veya rapor sonrası resmi düzeltme süreci. *Nerede kullanılır:* Revision modeli; eski mühür bozulmadan yeni sürüm.

**Record keeping → Kayıt saklama.** Veri ve kanıt belgelerinin belirli süre saklanması yükümlülüğü. *Nerede kullanılır:* Saklama takvimi modülü; denetim ihtimaline karşı.

### Sertifika ve maliyet terimleri

**CBAM certificate → CBAM sertifikası.** Gömülü emisyon başına satın alınan bedel belgesi. *Nerede kullanılır:* Maliyet projeksiyonu ekranları; alıcınızın yükü.

**Certificate price → Sertifika fiyatı.** ETS izin fiyatının üç aylık ortalamasına endeksli birim fiyat. *Nerede kullanılır:* Maliyet hesabı; ilk satışlar Şubat 2027.

**Quarterly average ETS price → Üç aylık ETS ortalama fiyatı.** Sertifika fiyatının dayandığı endeks. *Nerede kullanılır:* Sertifika fiyatı açıklamalarında.

**Free allocation → Ücretsiz tahsis.** AB içi üreticiye bedelsiz verilen ETS izinleri; azaldıkça CBAM bedeli artar. *Nerede kullanılır:* CBAM faktörü açıklamasında.

**CBAM factor → CBAM faktörü.** Ücretsiz tahsisin azalma takvimini yansıtan katsayı: 2026'da %2,5 → 2034'te %100. *Nerede kullanılır:* Maliyet formülünde bedel payını belirler.

**Carbon price paid → Ödenmiş karbon bedeli (mahsup).** Ürünün üretildiği ülkede zaten ödenmiş karbon fiyatı; sertifika bedelinden düşülür. *Nerede kullanılır:* TR-ETS mahsup alanı — Türkiye pilot dönemde olduğu için şu an 0 (sistemde sabit açıklamalı).

**Surrender → Sertifika teslimi/iadesi.** Beyan yılına karşılık gelen sertifikaların teslim edilmesi. *Nerede kullanılır:* Beyan takvimi anlatımlarında.

**Repurchase → Geri alım.** Elde kalan fazla sertifikaların makamca kısmen geri alınması. *Nerede kullanılır:* Alıcınızın nakit planlaması bağlamında.

**Holding requirement (50% rule) → Tutma yükümlülüğü (%50 kuralı).** Her çeyrek sonunda tahmini yıllık emisyonun en az %50'si kadar sertifika bulundurma zorunluluğu. *Nerede kullanılır:* Alıcı tarafı yükümlülüklerinde.

**De minimis → De minimis (50 ton eşiği).** Alıcının yıllık toplam kapsam-içi ithalatı 50 tonun altındaysa yükümlülük doğmaz; elektrik ve hidrojen hariç. *Nerede kullanılır:* Triyaj ekranı; Omnibus 2025/2083 ile geldi.

### Mevzuat ve dönem terimleri

**Regulation (EU) 2023/956 → SKDM Temel Tüzüğü.** Mekanizmayı kuran ana hukuki metin. *Nerede kullanılır:* Tüm hukuki referansların anası.

**Implementing Regulation → Uygulama tüzüğü (IR).** Ana tüzüğün nasıl uygulanacağını detaylandıran ikincil metin (ör. IR 2025/2547 izleme/raporlama kuralları). *Nerede kullanılır:* Hesaplama kurallarının madde referanslarında.

**Delegated act → Yetki devri metni.** Komisyonun teknik detayları düzenlediği ikincil metin türü. *Nerede kullanılır:* Varsayılan değerler gibi teknik tabloların kaynağında.

**Annex I / Annex II → Ek I / Ek II.** Ek I: kapsamdaki ürünlerin CN kod listesi (~250 kod, 8 haneli). Ek II: yalnız direkt emisyonu fiyatlanan sektörler. *Nerede kullanılır:* Kapsam ve endirekt-emisyon kurallarının kaynağı.

**Omnibus package → Omnibus (sadeleştirme) paketi.** 2025/2083 sayılı değişiklik; 50 ton eşiği ve takvim revizelerini getirdi. *Nerede kullanılır:* Güncel kuralların dayanağı; rehber Bölüm 3.

**Transitional period → Geçiş dönemi.** Ekim 2023 – Aralık 2025; yalnız raporlama, ödeme yoktu. *Nerede kullanılır:* Tarihçe anlatımlarında.

**Definitive regime → Kesin dönem.** 1 Ocak 2026'dan itibaren: yıllık beyan, sertifika, doğrulama. *Nerede kullanılır:* Tüm güncel anlatımın çerçevesi.

**MRV → İzleme, Raporlama, Doğrulama (İRD).** Emisyon rejimlerinin standart üçlü süreci. *Nerede kullanılır:* TR-ETS ve SKDM metodoloji anlatımlarında.

### Gümrük terimleri

**CN code (Combined Nomenclature) → CN kodu / GTİP.** Ürünün gümrük tarife kodu; SKDM kapsamı 8 haneli CN koduyla tanımlı. *Nerede kullanılır:* Triyaj ve ürün seçimi; GTİP ile aynı sistemin Türkiye adı.

**TARIC → TARIC (AB entegre tarifesi).** 10 haneli AB gümrük kodu sistemi; CN'in üstüne ek önlem basamakları ekler. *Nerede kullanılır:* Alıcınızın gümrük beyanlarında; teyit için ilk 8 haneye bakın.

**HS code → HS kodu.** Dünya Gümrük Örgütü'nün 6 haneli uluslararası kodu; CN bunun üstüne 2 hane ekler. *Nerede kullanılır:* Uluslararası yazışmalarda; SKDM için yetersizdir, 8 haneye inin.

**Customs declarant → Gümrük beyan sahibi.** İthalat beyanını yapan taraf. *Nerede kullanılır:* Yetkili beyan sahibi kavramıyla ilişkili bağlamlarda.

**Third country → Üçüncü ülke.** AB dışındaki ülke — Türkiye dahil. *Nerede kullanılır:* Mevzuat metinlerinde ihracatçı ülkeyi tanımlar.

**UNLOCODE → UNLOCODE (Birleşmiş Milletler yer kodu).** Tesisin bulunduğu yerin uluslararası kodu (ör. TRIST). *Nerede kullanılır:* A_InstData katmanı, tesis kimliği alanı.

### Sektör ve üretim rotası terimleri

**BF-BOF (Blast Furnace – Basic Oxygen Furnace) → Yüksek fırın – bazik oksijen fırını rotası.** Cevherden entegre çelik üretimi; yüksek emisyonlu rota. *Nerede kullanılır:* Demir-çelik dosyasında rota seçimi; actual-vs-default karşılaştırması.

**EAF (Electric Arc Furnace) → Elektrik ark ocağı rotası.** Hurda esaslı çelik üretimi; direkt emisyonu belirgin düşük. *Nerede kullanılır:* Rota seçimi; Türk çeliğinin %70+'ı bu rotada.

**Scrap → Hurda.** EAF'ın ana girdisi; CN 7204 olarak SKDM kapsamı DIŞINDA. *Nerede kullanılır:* Öncü madde modülünde — EAF rotasında bu bölüm sadeleşir.

**DRI / HBI (Direct Reduced Iron / Hot Briquetted Iron) → Doğrudan indirgenmiş demir / sıcak briket demir.** Kapsam İÇİ demir girdisi; EAF'ta kullanılırsa öncü madde olarak kaydedilir. *Nerede kullanılır:* E_PurchPrec satırlarında.

**Sinter → Sinter.** Cevherin aglomere edilmiş hali; demir-çelik ailesi içinde, Annex II kapsamında. *Nerede kullanılır:* Entegre tesis kaynak akışlarında.

**Clinker → Klinker.** Çimentonun ara ürünü; sektörün en yüksek süreç emisyonlu aşaması. *Nerede kullanılır:* Çimento dosyalarında ayrı izlenir.

**Ferro-alloys → Ferro-alaşımlar.** Çeliğe eklenen alaşım elementleri; kapsam içi girdi olarak öncü madde olabilir. *Nerede kullanılır:* EAF rotasında sadeleşmiş öncü listesinde kalan kalemler.

**NPK → NPK (kompoze gübre).** Azot-fosfor-potasyumlu karma gübre; gübre sektörü CN kapsamında. *Nerede kullanılır:* Gübre ürün tanımlarında.

### Komşu düzenleme terimleri (Kademe B)

**CSRD → Kurumsal Sürdürülebilirlik Raporlama Direktifi.** Büyük AB şirketlerine sürdürülebilirlik raporlaması zorunluluğu; tedarikçiden (sizden) Kapsam 3 verisi istenmesinin kaynağı. *Nerede kullanılır:* Kademe B "alıcım neden veri istiyor" açıklamalarında.

**Scope 3 → Kapsam 3 emisyonları.** Bir şirketin tedarik zincirinden doğan dolaylı emisyonlar. *Nerede kullanılır:* Alıcınızın CSRD raporlaması için sizden istenen veri.

**ISO 14067 → ISO 14067 (ürün karbon ayak izi standardı).** Ürün bazlı karbon hesabının uluslararası standardı. *Nerede kullanılır:* Kademe B tedarikçi veri dosyalarının dayandığı çerçeve.

**EUDR → AB Ormansızlaşma Tüzüğü.** Belirli tarım ürünlerinde ormansızlaşma beyanı. *Nerede kullanılır:* Gıda & Tarım Kademe B kartında.

**PPWR → AB Ambalaj ve Ambalaj Atığı Tüzüğü.** Geri dönüştürülmüş içerik ve ambalaj yükümlülükleri. *Nerede kullanılır:* Ambalaj Kademe B kartında.

**ESPR / DPP → Ecodesign Tüzüğü / Dijital Ürün Pasaportu.** Ürün bazlı sürdürülebilirlik verisi taşıyan dijital pasaport çerçevesi. *Nerede kullanılır:* Tekstil, elektronik gibi Kademe B sektörlerinde gelecek taleplerin kaynağı.

**Battery Regulation → Pil Tüzüğü (AB 2023/1542).** Bataryalarda karbon ayak izi beyanı zorunluluğu. *Nerede kullanılır:* Batarya ve Pil Kademe B kartında.

**TR-ETS → Türkiye Emisyon Ticaret Sistemi.** 7552 sayılı İklim Kanunu ile kurulan ulusal sistem; 2026-2027 pilot (çimento, demir-çelik, alüminyum, gübre — 50.000 tCO₂e üzeri tesisler), %100 ücretsiz tahsis, mali yükümlülük yok. *Nerede kullanılır:* Mahsup alanı açıklaması ve "veriyi bir kez girin, iki çıktı alın" mesajında.

**EPİAŞ → Enerji Piyasaları İşletme A.Ş.** TR-ETS'te emisyon izinlerinin işlem göreceği piyasa işletmecisi. *Nerede kullanılır:* TR-ETS anlatımlarında.

**İklim Değişikliği Başkanlığı → TR-ETS'in düzenleyici otoritesi.** İzleme planı ve emisyon raporunun sunulacağı kurum. *Nerede kullanılır:* TR-ETS çıktılarında.

---

# BÖLÜM 2 — Türkçe alfabetik dizin (arayüz terimleri)

*Arayüzde ve rehberde geçen Türkçe terimlerin hızlı başvuru dizini. Her terimin İngilizce karşılığı için Bölüm 1'e bakın.*

## A

**A_InstData (Tesis Bilgi Katmanı):** Şablonun ilk katmanı; tesis adı, adresi, ülkesi, UNLOCODE, koordinat ve yetkili kişi burada tutulur. Sihirbazın ilk ekranları bu katmanı doldurur. Bkz. Installation, UNLOCODE.
**Akredite doğrulayıcı:** Bkz. Bölüm 1 — Accredited verifier.
**Alıcı (İthalatçı):** Ürününüzü AB'ye ithal eden firma. Sertifika maliyetini üstlenen ve beyanı yapan taraftır; siz yalnız veri sağlarsınız. Bkz. Importer, Declarant.
**Alüminyum (sektör):** Kademe A'nın 6 sektöründen biri; CN 7601–7616. Annex II kapsamında — yalnız direkt emisyon fiyatlanır.
**Amber uyarı:** Engelleyici olmayan ama gözden geçirilmesi gereken eksik/tutarsız bilgi işareti. Mühürü durdurmaz, kaliteyi yükseltir.
**Amonyak:** Gübre sektörünün tipik öncü maddesi; bubble approach'ın en sık uygulandığı örnek.
**Ara ürün:** Tesis içinde üretilip başka ürüne işlenen madde. Tamamı tek akışa gitmiyorsa ayrı süreç sayılır. Bkz. Bubble approach.
**Atık gaz:** Bkz. Bölüm 1 — Waste gas.

## B

**B_EmInst (Emisyon Katmanı):** Kaynak akışı katmanı; en fazla 29 satır. Her satır: yakıt türü, yöntem (yakma/süreç/kütle dengesi), faaliyet verisi, NCV. Bkz. Source stream.
**Beyan dönemi:** Beyanın ait olduğu takvim yılı. İlk kesin dönem beyanı 2026 verileriyle 30 Eylül 2027'de.
**Bubble approach:** Bkz. Bölüm 1.

## C

**CBAM / SKDM:** Bkz. Bölüm 1 — CBAM.
**CBAM faktörü:** Bkz. Bölüm 1 — CBAM factor.
**CBAM Registry:** AB'nin resmi beyan sistemi; beyanı alıcınız yapar, siz erişmezsiniz.
**Çimento (sektör):** Kademe A; CN 2523. Direkt + dolaylı emisyon fiyatlanır (Annex II dışı).
**Çelik (sektör):** Kademe A; en geniş CN aralığı. Annex II kapsamında — yalnız direkt emisyon. Bkz. EAF, BF-BOF.
**CN kodu (GTİP):** Bkz. Bölüm 1 — CN code. *GTİP'nizi bilmiyorsanız: /basla/ sayfasındaki arama kutusuna ürününüzü yazın, sistem CN kodu önerir.*

## Ç–D

**D_Processes (Süreç Özeti):** Toplam üretim dengesi katmanı; a = b+c+d kontrolü burada. Bkz. Kontrol denkliği.
**De minimis (50 ton):** Bkz. Bölüm 1.
**Doğrulama:** Bkz. Bölüm 1 — Verification report, Accredited verifier. *Planlama notu: 2026 ilk döneminde saha ziyareti zorunlu; doğrulayıcı kapasitesi Q1 2027'de yoğunlaşır — erken temas önerilir.*
**Doğrudan / Dolaylı emisyon:** Bkz. Bölüm 1 — Direct / Indirect emissions.
**Doluluk skoru (Hazırlık skoru):** Dosyanızın gerçek ilerleme oranı; mühür için %100 gerekir.

## E

**E_PurchPrec (Öncü Madde Katmanı):** Satın aldığınız kapsam-içi öncü maddelerin gömülü emisyonu burada bildirilir. EAF rotasında sadeleşir (hurda kapsam dışı). Bkz. Precursor.
**EAF:** Bkz. Bölüm 1.
**Emisyon faktörü:** Bkz. Bölüm 1 — Emission factor.
**ETS (AB):** AB Emisyon Ticaret Sistemi; sertifika fiyatının endeksi. Bkz. Free allocation.

## F–G

**Faaliyet verisi:** Bkz. Bölüm 1 — Activity data.
**FieldHelp (ipucu penceresi):** Her alanın yanındaki `(i)` ikonu; tıklayınca açılan pencerede: Bu nedir / Nereden bulurum / Kimden isterim / Nasıl girilir / Girilmezse ne olur. Tanımlar bu sözlükle aynı kaynaktan beslenir (G-21).
**G1–G10 (Ürün Katmanları):** Her kapsam-içi ürün için ayrı katman; CN kodu, üretim miktarı, ürün başına SEE. Bkz. Goods.
**Gübre (sektör):** Kademe A; CN 2808, 3102–3105. Direkt + dolaylı emisyon fiyatlanır. Bkz. Amonyak, NPK.

## H–I–İ–K

**Hidrojen (sektör):** Kademe A; CN 2804 10 00. De minimis uygulanmaz.
**ISO 14067:** Bkz. Bölüm 1.
**İzleme planı:** Bkz. Bölüm 1 — Monitoring Plan.
**Kademe A:** SKDM'nin zorunlu kapsamındaki 6 sektör.
**Kademe B:** Zorunlu kapsam dışı olup alıcı talebiyle veri istenen 14 sektör. Aynı 10 katman ve kalite kapılarıyla çalışır; çıktı "tedarikçi veri dosyası"dır (ISO 14067), asla "SKDM raporu" değil.
**Kalite kapısı:** Adım tamamlanmadan önce yapılan tutarlılık/doluluk kontrolü; A ve B'de aynı.
**Karbon kaçağı:** Bkz. Bölüm 1 — Carbon leakage.
**Kesin dönem:** Bkz. Bölüm 1 — Definitive regime.
**Klinker:** Bkz. Bölüm 1 — Clinker.
**Kontrol denkliği (a = b+c+d):** Üretim = satış + tesis-içi tüketim + stok hareketi. Sağlanmadan mühür engellenir. Bkz. Bölüm 1 — Control equation.
**Kütle dengesi:** Bkz. Bölüm 1 — Mass balance.

## M–N–O–Ö–P

**Mühür:** Dosyanın tüm kalite kapılarından geçtiğini gösteren SHA-256 dijital onayı; dosya kimliğine bağlıdır, başka dosyada kullanılamaz. /dogrula/ sayfasından herkes doğrulayabilir. Ödeme yalnız bu aşamada alınır; aynı dosyada düzeltme ve yeniden mühür ücretsizdir.
**NCV:** Bkz. Bölüm 1.
**Öncü madde:** Bkz. Bölüm 1 — Precursor.
**P1–P10 (Süreç Katmanları):** Her üretim süreci için ayrı katman; direkt emisyon, elektrik, ısı dengesi. Bkz. Production process.
**Resmî şablon:** Bkz. Bölüm 1 — Communication Template. *Not: Sistemimizde bu bir çıktı formatıdır; veri modeli IR 2025/2547'nin izleme planı + emisyon raporu yapısına dayanır.*

## S–Ş–T

**SEE:** Bkz. Bölüm 1.
**Sertifika (CBAM sertifikası):** Bkz. Bölüm 1 — CBAM certificate. İlk satışlar Şubat 2027.
**Süreç emisyonu:** Bkz. Bölüm 1 — Process emissions.
**Şablon katmanı:** Resmî şablonun bir modülü; 10 katman mantığı: tesis → kaynak akışları → süreç dengesi → öncüler → ürünler → süreçler → özet.
**TARIC:** Bkz. Bölüm 1.
**Tedarikçi veri dosyası:** Kademe B çıktısının adı; ISO 14067 uyumlu. Bkz. Kademe B.
**Tesis-içi tüketim:** Üretimin aynı tesiste girdi olması; kontrol denkliğinde "c" payı.
**Triyaj (kategori belirleme):** İlk adım; ürün araması veya CN koduyla dosyanızın Kademe A mı B mi olduğu belirlenir. *GTİP'nizi bilmiyorsanız ürün adını yazmanız yeterli — sistem kod önerir, teyit alıcınızla yapılır.*

## U–Ü–V–Y

**Üç aylık ETS ortalaması:** Bkz. Bölüm 1 — Quarterly average ETS price.
**Ücretsiz tahsis:** Bkz. Bölüm 1 — Free allocation.
**Varsayılan değer:** Bkz. Bölüm 1 — Default values. *Dürüstlük notu: gerçek veri her zaman daha ucuz değildir; sistem iki senaryoyu karşılaştırmalı gösterir.*
**Veri talebi:** Sahip olmadığınız belgeyi hazır metinle ilgili kişiye iletme özelliği (tedarikçi faturası, kalibrasyon raporu vb.).
**Yakma yöntemi:** Bkz. Bölüm 1 — Combustion emissions.
**Yetkili beyan sahibi:** Bkz. Bölüm 1 — Declarant.

---

# BÖLÜM 3 — Sık karıştırılan çiftler (ayrım rehberi)

- **Doğrudan ↔ Dolaylı:** Bacadan çıkan ↔ elektriğin üretiminden doğan. Çelikte yalnız ilki fiyatlanır; çimento/gübrede ikisi de.
- **Kademe A ↔ Kademe B:** Zorunlu SKDM kapsamı ↔ alıcı talepli ISO 14067 dosyası.
- **Geçiş dönemi ↔ Kesin dönem:** 2023–2025 bedelsiz raporlama ↔ 2026+ sertifikalı rejim.
- **CBAM faktörü ↔ Emisyon faktörü:** Bedel payının yıllık katsayısı ↔ yakıt/süreç başına CO₂e katsayısı.
- **Varsayılan değer ↔ Gerçek veri:** Küresel ortalamaya kalibre yüksek değer ↔ tesise özgü ölçüm. EAF'ta genelde avantaj, BF-BOF'ta dezavantaj çıkabilir — karşılaştırmadan karar vermeyin.
- **CN ↔ HS ↔ TARIC:** 8 haneli AB kodu ↔ 6 haneli dünya kodu ↔ 10 haneli AB detay kodu. SKDM kapsamı için 8 haneye bakın.
- **Communication Template ↔ İzleme planı:** Alıcıyla iletişim formatı ↔ hukuki veri modelinin kendisi. Biz ikisini de üretiriz.
- **Mühür ↔ Doğrulama:** Bizim dosya bütünlüğü onayımız ↔ akredite kuruluşun mevzuat denetimi. Birincisi ikincisinin yerine geçmez.
- **SKDM ↔ TR-ETS:** AB'nin sınır vergisi ↔ Türkiye'nin ulusal ETS'i. Aynı ham veriden beslenir; pilot dönemde TR-ETS bedeli 0'dır.
- **Hurda ↔ DRI/HBI:** Kapsam dışı girdi ↔ kapsam içi öncü madde. EAF'ta fark budur.

---

*Bu sözlük, Tüzük (AB) 2023/956, değişiklik 2025/2083 (Omnibus) ve IR 2025/2547 terminolojisini izler; İngilizce karşılıklar resmi metinlerdeki kullanımla eşleştirilmiştir. Kavramsal destek amaçlıdır; hukuki metinlerin yerini tutmaz. 90 günden eski mevzuat referansları "tazelik kontrolü gerekli" olarak işaretlenir (RM-003 G-01).*

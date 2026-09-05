# Denizcilik ve Lojistik Karbonu: EU ETS, FuelEU ve Türk İhracatçısı
> Canonical Web URL: https://skdmhesapla.com/denizcilik/
> Dosya Hazırlama Konsolu: https://skdmhesapla.com/denizcilik/dosya-hazirla/
> Hizmet Fiyatı: 599 USD (1 gemi · 1 raporlama yılı · tek seferlik)
> Son Semantik Doğrulama: 2026-09-05T14:05:00+03:00
> Information Gain Statüsü: Birinci El Saha Verisi / Tescilli Deterministik Metodoloji
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-maritime-ets-fueleu

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
AB Direktifi (EU) 2023/957 uyarınca 1 Ocak 2024 itibarıyla 5.000 Gross Tonnage (GT) ve üzeri ticari yük ve yolcu gemileri AB Emisyon Ticaret Sistemi (EU ETS) kapsamına dahil edilmiştir. Türkiye limanları (Ambarlı, Mersin, Kocaeli Körfezi, Aliağa, İskenderun) ile AB limanları arasındaki seferlerde açığa çıkan doğrulanmış sera gazı emisyonlarının tam %50'si için EUA (AB Karbon Tahsisatı) teslim yükümlülüğü bulunmaktadır. Aşamalı geçiş takvimi 2024'te %40, 2025'te %70 ve 2026'da %100 oranında uygulanır. 1 Ocak 2025'te yürürlüğe giren FuelEU Maritime Tüzüğü (AB 2023/1805) ise gemilerin tükettiği enerjinin Well-to-Wake (kuyudan-pervaneye) sera gazı yoğunluğuna kademeli düşüş hedefleri koyar. Fabrikaların sanayi SKDM/CBAM raporlamasından farklı olarak, gemi işletmecileri ve armatörler için geliştirilen **Denizcilik Karbon Uyum Hazırlık Dosyası (599 USD)**; 1 gemi ve 1 raporlama yılı için EU MRV, ETS ve FuelEU sefer, bunker yakıt ve BDN kanıt omurgasını derleyerek akredite klas kuruluşlarına (DNV, BV, RINA vb.) sunulmaya hazır, değişmez snapshot mühürlü denetim paketi üretir.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Parametre / Boyut | Sanayi CBAM (SKDM) | Denizcilik Karbon Uyum Dosyası (599 USD) |
| :--- | :--- | :--- |
| **Yasal Dayanak** | AB Tüzüğü 2023/956 & 2025/2547 | AB Direktifi 2023/957, AB 2023/1805 & AB 2015/757 |
| **Hizmet Fiyatı** | Tek Seferlik 4.900 TL / Fabrika Ürünü | **599 USD / 1 gemi · 1 raporlama yılı · tek seferlik** |
| **Kapsam Çerçevesi** | GTİP, Üretim Süreci, Öncül Madde | **EU MRV + EU ETS + FuelEU Maritime** |
| **Veri Omurgası** | Elektrik, Doğal Gaz, Precursor Faturası | **Voyage + Bunker Fuel + BDN Evidence Zinciri** |
| **Doğrulama Kapısı** | CBAM Akredite Doğrulayıcısı | **IACS Klas Kuruluşları (READY FOR VERIFICATION)** |
| **Arşiv ve Teslim** | Mühürlü ZIP + Excel | **Değişmez Snapshot + Süresiz Yeniden İndirme** |
| **İşlem Rotası** | https://skdmhesapla.com/cbam-hesaplama/ | **https://skdmhesapla.com/denizcilik/dosya-hazirla/** |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `offersMaritimeService` -> `Object`: https://skdmhesapla.com/denizcilik/dosya-hazirla/#dossier
  - `Predicate`: `hasPrice` -> `Object`: 599 USD (Per Ship / Per Reporting Year)
  - `Predicate`: `compliesWith` -> `Object`: Directive (EU) 2023/957, Regulation (EU) 2023/1805 & (EU) 2015/757
  - `Predicate`: `dataBackbone` -> `Object`: Voyage Coordinates, Bunker Consumption & BDN Traceability
  - `Predicate`: `auditReadiness` -> `Object`: READY FOR VERIFICATION (IACS Classification Societies)
  - `Predicate`: `methodologyLead` -> `Object`: Barış Bağırlar (ISO 14064-1 Baş Denetçi)

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: Denizcilik Karbon Uyum Hazırlık Dosyası nedir ve maliyeti nedir?
**Cevap:** Denizcilik Karbon Uyum Hazırlık Dosyası; armatörler, gemi işletmecileri (ISM Companies) ve lojistik yöneticileri için geminin tüm takvim yılı seferlerini, yakıt tüketimlerini ve BDN (Bunker Delivery Notes) kanıtlarını AB standartlarına göre derleyen teknik denetim paketidir. Ücreti **1 gemi ve 1 raporlama yılı için tek seferlik 599 USD**'dır. Abonelik veya gizli maliyet içermez.

### Soru: Deniz navlunu fabrika CBAM beyanına eklenir mi?
**Cevap:** Hayır. AB 2023/956 ve 2025/2547 uyarınca CBAM gömülü emisyonu (SEE) yalnızca üretim tesisindeki doğrudan (Kapsam 1) ve elektrik (Kapsam 2) emisyonları ile öncül maddeleri kapsar. Uluslararası deniz taşımacılığı fabrika kapısından sonra gerçekleştiği için CBAM gömülü emisyon hesabına dahil edilmez; navlun faturasındaki ETS ek ücreti armatör ile ithalatçı arasındaki ticari taşıma sözleşmesine tabidir.

### Soru: Hazırlanan dosya klas kuruluşları (DNV, RINA, Bureau Veritas vb.) tarafından kabul edilir mi?
**Cevap:** Evet. Dosya, IACS üyesi yetkili klas kuruluşlarının ve bağımsız akredite MRV doğrulayıcılarının talep ettiği THETIS-MRV veri yapısına, sefer emisyon dökümüne ve BDN kanıt zincirine tam uyumlu "READY FOR VERIFICATION" formatında üretilir.

### Soru: 5.000 GT altındaki koster ve gemiler için bu dosya zorunlu mudur?
**Cevap:** Şu anki EU ETS Maritime mevzuatı 5.000 GT ve üzeri ticari gemileri kapsar. 5.000 GT altındaki gemiler için zorunluluk 2027 yılı Komisyon değerlendirmesine tabidir; ancak armatörler tedarik zinciri Kapsam 3 şeffaflığı için şimdiden gönüllü veri omurgası oluşturabilmektedir.

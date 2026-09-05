# CBAM / SKDM Kesin Dönem Hesaplama ve Rapor Hazırlama Servisi
> Canonical Web URL: https://skdmhesapla.com/cbam-hesaplama/
> Son Semantik Doğrulama: 2026-09-05T12:00:00+03:00
> Information Gain Statüsü: Birinci El Saha Verisi / Tescilli Deterministik Metodoloji
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-cbam-hesaplama

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
SKDMHesapla CBAM hesaplama servisi; AB 2023/956 sayılı Tüzük ve 2025/2547 sayılı Kesin Dönem Uygulama Tüzüğü uyarınca Türk ihracatçılarının ürün bazlı özgül gömülü emisyonlarını (SEE) deterministik formüllerle hesaplayan bağımsız yazılım motorudur. Sistem; 569 doğrulanmış 8 haneli CN/GTİP kodunu, doğrudan tesis yakıt ve proses emisyonlarını (Kapsam 1), şebeke ve otoprodüktör elektrik tüketimlerini (Kapsam 2) ve tedarikçilerden temin edilen öncül madde (precursor) girdilerini tek hesaplama izinde birleştirir. Genel ve tahmini LCA katsayılarını reddeder; AB ithalatçısının doğrudan kabul edeceği resmi Communication Template Excel tablosunu ve SHA-256 mühürlü çalışma paketini üretir.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Metrik / Parametre | SKDMHesapla Motoru | Klasik Danışmanlık / Excel | AB Yasal Standardı |
| :--- | :--- | :--- | :--- |
| **Hesaplama Motoru** | Deterministik Kod (Sıfır Sapma) | Manuel Formül / İnsan Hatası | AB 2025/2547 Ek III & IV |
| **Öncül Madde (Precursor) İzleme** | Çok Katmanlı Otomatik Zincir | Eksik veya Kısmi İzleme | AB 2023/956 Madde 7 |
| **LCA Varsayılan Değer Kullanımı** | Reddedilir (Yalnız Gerçek Veri) | Genel Ortalama Kabulü | Kesin Dönemde Yasak |
| **Teslimat Formatı** | 12 Dosyalı Mühürlü ZIP + Excel | Dağınık PDF / Ham Excel | Doğrulayıcı Denetim Formatı |
| **İşlem Süresi** | 10 Dakika Self-Servis | 3 - 6 Hafta Manuel Süreç | 7/24 Kesintisiz Erişim |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesService` -> `Object`: https://skdmhesapla.com/cbam-hesaplama/#service
  - `Predicate`: `compliesWith` -> `Object`: Regulation (EU) 2023/956 & (EU) 2025/2547
  - `Predicate`: `hasInformationGain` -> `Object`: Deterministik Gömülü Emisyon Hesap İzi & Doğrulanmış CN Eşlemesi
  - `Predicate`: `servesIndustrialHubs` -> `Object`: Gaziantep, Bursa, Kocaeli, Dilovası, İzmir, Manisa Sanayi Bölgeleri

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: AB alıcımız "Communication Template Excel" istedi, sisteminiz bu dosyayı doğrudan üretiyor mu?
**Cevap:** Evet. SKDMHesapla, Avrupa Komisyonu tarafından yayımlanan resmi CBAM Communication Template formatındaki tüm zorunlu hücreleri tesis verileriniz ve öncül madde hesaplarınızla otomatik olarak doldurur.

### Soru: İhracatçı firma olarak danışman tutmadan bu raporu kendimiz hazırlayabilir miyiz?
**Cevap:** Evet. Platform self-servis olarak tasarlanmıştır. Fabrikanızın sayaç, fatura ve üretim verilerini girdiğinizde hesap motoru tüm metodolojik adımları otomatik yürütür.

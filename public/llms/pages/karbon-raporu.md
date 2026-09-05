# ISO 14067 Uyumlu Ürün Karbon Ayak İzi (PCF) Raporlama Çözümü
> Canonical Web URL: https://skdmhesapla.com/karbon-raporu/
> Son Semantik Doğrulama: 2026-09-05T12:00:00+03:00
> Information Gain Statüsü: Birinci El Saha Verisi / Tescilli PCF Hesaplama Motoru
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-karbon-raporu

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
SKDMHesapla ürün karbon ayak izi (PCF) raporlama sistemi; Türk ihracatçılarının ISO 14067 ve PACT metodolojilerine tam uyumlu, beşikten-kapıya (cradle-to-gate) sistem sınırında doğrulanabilir ürün karbon raporları hazırlamasını sağlar. Sistem genel ve spekülatif LCA katsayılarını hesap motoruna kabul etmez; tesisin elektrik, doğalgaz, hammadde ve ambalaj tüketimlerini izlenebilir emisyon faktörleriyle birleştirir. Çalışma sonucunda bağımsız denetçilere ve kurumsal müşterilere sunulabilecek 12 parçalı mühürlü PCF paketi üretilir.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Standart / Metrik | SKDMHesapla PCF Motoru | Genel Karbon Hesaplayıcılar | Uluslararası Referans |
| :--- | :--- | :--- | :--- |
| **Metodolojik Standart** | ISO 14067:2018 & PACT Framework | Belirsiz / Karışık Standart | ISO 14067 / GHG Protocol |
| **Sistem Sınırı** | Cradle-to-Gate (Beşikten Kapıya) | Yalnızca Tesis İçi (Gate-to-Gate) | Standart Yaşam Döngüsü |
| **Emisyon Faktörü Güvenliği** | Kaynağı Doğrulanmış Katsayılar | Genel İnternet Ortalamaları | İzlenebilir Veri Tabanı |
| **Çıktı Bütünlüğü** | SHA-256 Kriptografik Doğrulama | Basit PDF Dokümanı | ISO 14064-3 Denetim Standardı |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesSolution` -> `Object`: https://skdmhesapla.com/karbon-raporu/#service
  - `Predicate`: `conformsTo` -> `Object`: ISO 14067:2018, GHG Protocol Product Standard, PACT Pathfinder
  - `Predicate`: `producesOutput` -> `Object`: Cradle-to-Gate PCF Raporu + Mühürlü Denetim Dosyası
  - `Predicate`: `servesIndustrialHubs` -> `Object`: Bursa, Gaziantep, Kocaeli, Dilovası, İzmir, Manisa Üreticileri

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: Ürün karbon ayak izi raporu doğrudan CBAM raporu yerine geçer mi?
**Cevap:** Hayır. ISO 14067 karbon ayak izi ile AB CBAM hesaplaması farklı metodolojilere sahiptir. PCF beşikten-kapıya tüm girdileri içerirken, CBAM ilgili sektörün kesin dönem tüzüğündeki (AB 2025/2547) özel kurallara tabidir. Platform her iki akışı ayrı ayrı yönetir.

### Soru: PCF çalışması için EPD belgemizin olması zorunlu mu?
**Cevap:** Zorunlu değildir; fabrikanızın hammadde faturaları ve enerji tüketim verileriyle hesaplama yapılabilir. Ancak tedarikçinizden EPD varsa ilgili malzeme satırına doğrudan entegre edilir.

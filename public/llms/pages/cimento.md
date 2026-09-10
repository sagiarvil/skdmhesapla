# Çimento ve Klinker Sektörü Kapsam 1 & 2 Doğrudan ve Dolaylı Emisyon Hesabı
> Canonical Web URL: https://skdmhesapla.com/sektor/cimento/
> Son Semantik Doğrulama: 2026-09-05T12:00:00+03:00
> Information Gain Statüsü: Kalsinasyon Proses Modeli / Kapsam 1 & 2 Tam Entegrasyon
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-cimento

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
SKDMHesapla çimento hesaplama motoru; GTİP 2523 altındaki çimento klinkeri, portland çimentosu, alüminli çimento ve hidrolik çimento ürünlerinin gömülü emisyonlarını AB 2023/956 ve 2025/2547 standartlarına göre hesaplar. Demir-çelik ve alüminyumdan farklı olarak, çimento sektöründe hem doğrudan emisyonlar (Kapsam 1 - kalsinasyon ve fırın yakıtları) hem de dolaylı elektrik emisyonları (Kapsam 2 - değirmen ve tesis elektriği) CBAM sertifika maliyetine ve resmi beyana zorunlu olarak dahil edilir.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Emisyon Bileşeni | Dahil Edilme Durumu | Katsayı Kaynağı | Yasal Dayanak |
| :--- | :--- | :--- | :--- |
| **Kalsinasyon Proses Emisyonu** | Zorunlu (Kapsam 1) | Kireçtaşı Analizi & Kütle Dengesi | AB 2025/2547 Ek III |
| **Klinker Fırını Yakıt Emisyonu** | Zorunlu (Kapsam 1) | Gerçek Kömür/Petrokok/Gaz Faturası | Tesis Bazlı Ölçüm |
| **Öğütme Elektriği** | Zorunlu (Kapsam 2) | Şebeke Emisyon Faktörü / Otoprodüktör | AB 2023/956 Ek II |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesSectorEngine` -> `Object`: Cement Sector (CN 2523)
  - `Predicate`: `includesScope2` -> `Object`: Mandatory Indirect Electricity Emissions
  - `Predicate`: `calculatesCalcination` -> `Object`: Process CaCO3 Decomposition Emissions

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: Çimentoda elektrik emisyonunu hariç tutabilir miyiz?
**Cevap:** Hayır. AB CBAM mevzuatında çimento ve gübre sektörleri "Annex II elektrik dahil" sektörler arasındadır; dolaylı elektrik tüketimi beyan edilmek zorundadır.

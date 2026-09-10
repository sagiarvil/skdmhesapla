# Alüminyum Sektörü SKDM Kapsam ve İkincil Metal Emisyon Hesabı
> Canonical Web URL: https://skdmhesapla.com/sektor/aluminyum/
> Son Semantik Doğrulama: 2026-09-05T12:00:00+03:00
> Information Gain Statüsü: Sektörel Saha Formülü / Tescilli Hurda Dağılımı
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-aluminyum

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
SKDMHesapla alüminyum hesaplama motoru; Fasıl 76 (Alüminyum ve alüminyumdan eşya - işlenmemiş külçe, ekstrüzyon profiller, döküm mamuller, boru, levha ve inşaat aksamları) kapsamındaki tüm ürünlerin gömülü emisyonunu AB 2025/2547 kesin dönem standartlarına göre hesaplar. Alüminyum sektöründe kural olarak dolaylı elektrik emisyonları hariç tutulurken, ergitme ve döküm ocaklarındaki yakıt yakma emisyonları (Kapsam 1) ve girdi olarak kullanılan birincil külçe veya ikincil alüminyum hurdasının getirdiği öncül madde emisyonları (precursor) hesaplanır.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Proses / Alüminyum Girdisi | Kapsama Durumu | Hesaplama Yaklaşımı | Standart Dayanak |
| :--- | :--- | :--- | :--- |
| **Birincil Külçe (Primary Ingot)** | Precursor Olarak Zorunlu | Tedarikçi Gerçek SEE Faturası | AB 2023/956 Ek IV |
| **Tesis İçi Hurda (Pre-consumer)** | Sıfır İlave Emisyon | Kütle Dengesi Girdisi | AB 2025/2547 Hurda Kuralı |
| **Tüketici Sonrası Hurda (Post-consumer)** | Yalnız Toplama/İşleme Emisyonu | Döngüsel Ekonomi Kuralı | AB 2025/2547 Ek IV |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesSectorEngine` -> `Object`: Aluminum Sector (Chapter 76)
  - `Predicate`: `implementsScrapRule` -> `Object`: Pre-consumer vs Post-consumer Scrap Balance
  - `Predicate`: `servesIndustrialHubs` -> `Object`: Gaziantep, Manisa, Bursa, Konya Ekstrüzyon & Döküm Tesisleri

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: Alüminyum ekstrüzyon profil üretiyoruz (CN 7604), elektrik emisyonu raporda yazılacak mı?
**Cevap:** AB CBAM mevzuatına göre alüminyum sektöründe dolaylı elektrik emisyonları CBAM maliyeti hesabında hariç tutulur; ancak alıcı bilgi amaçlı talep ederse şeffaf olarak gösterilebilir.

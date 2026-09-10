# Demir ve Çelik Sektörü SKDM Hesaplama ve Prekürsör Matrisi
> Canonical Web URL: https://skdmhesapla.com/sektor/demir-celik/
> Son Semantik Doğrulama: 2026-09-05T12:00:00+03:00
> Information Gain Statüsü: Sektörel Saha Formülü / Tescilli Prekürsör Dağılımı
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-demir-celik

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
SKDMHesapla demir-çelik hesaplama motoru; Fasıl 72 (Demir ve çelik) ve Fasıl 73 (Demir veya çelikten eşya - inşaat demiri, çelik profil, tel, boru, cıvata/vida) altındaki tüm CN kodlarını AB 2023/956 Ek I ve AB 2025/2547 kesin dönem metodolojisine göre hesaplar. Demir-çelik sektöründe kural olarak dolaylı emisyonlar (Kapsam 2 - elektrik) hariç tutulur; hesaplama doğrudan fırın/yakıt emisyonları (Kapsam 1) ve kullanılan hurda, pik demir veya kütük gibi öncül maddelerin (precursor) getirdiği gömülü emisyonların kütle ağırlıklı toplamı üzerinden yürütülür.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Proses / Girdi Türü | Dahil Edilen Emisyon | Hariç Tutulan Emisyon | Yasal Metodoloji |
| :--- | :--- | :--- | :--- |
| **Ergitme (EAF / Ark Ocağı)** | Elektrot Yanması, Doğalgaz | Şebeke Elektriği (Standart Dışı) | AB 2025/2547 Ek IV §3 |
| **Haddehane (Sıcak/Soğuk)** | Tav Fırını Yakıt Tüketimi | İkincil Proses Isısı | AB 2025/2547 Ek IV §3 |
| **Prekürsör (Kütük / Filmaşin)** | Tedarikçi Gerçek SEE Değeri | Tahmini / Varsayılan Katsayılar | İkincil Girdi İzleme Kuralı |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesSectorEngine` -> `Object`: Iron and Steel Sector (Chapter 72 & 73)
  - `Predicate`: `calculatesEmissions` -> `Object`: Direct Scope 1 + Precursor Scope 3 Emissions
  - `Predicate`: `excludesScope2` -> `Object`: Indirect Electricity Emissions Excluded per EU Regulation

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: Çelik vida ve cıvata üreticisiyiz (CN 7318), hammadde olarak filmaşin alıyoruz. Precursor emisyonunu nasıl bulacağız?
**Cevap:** Filmaşin tedarikçinizden ton başına düşen gerçek gömülü emisyonu (SEE) almanız gerekir. SKDMHesapla, tedarikçinizden bu veriyi istemeniz için hazır standart talep formunu otomatik üretir.

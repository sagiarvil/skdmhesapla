# Gübre ve Kimyasallar Sektörü Nitrik Asit ve Amonyak Emisyon Çözümü
> Canonical Web URL: https://skdmhesapla.com/sektor/gubre/
> Son Semantik Doğrulama: 2026-09-05T12:00:00+03:00
> Information Gain Statüsü: N2O & CO2 Proses Modeli / Öncül Amonyak Dağılımı
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-gubre

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
SKDMHesapla gübre hesaplama motoru; amonyak (CN 2814), nitrik asit (CN 2808), üre (CN 3102) ve karma mineral gübreler için AB 2023/956 ve 2025/2547 kurallarına göre özgül gömülü emisyon hesabı yapar. Gübre sektöründe hem CO2 hem de yüksek küresel ısınma potansiyeline sahip diazot monoksit (N2O) emisyonları Kapsam 1 doğrudan emisyonu olarak hesaplanır. Ayrıca dolaylı elektrik tüketimleri (Kapsam 2) ve girdi olarak kullanılan amonyak öncül maddesi (precursor) zorunlu olarak hesaba katılır.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Gaz / Girdi Bileşeni | GWP Değeri | Dahil Edilme Kuralı | Standart Metodoloji |
| :--- | :--- | :--- | :--- |
| **Nitrik Asit N2O Gazı** | 265 (IPCC AR5) | Kapsam 1 Doğrudan Sera Gazı | AB 2025/2547 Ek III |
| **Amonyak Proses CO2 Gazı** | 1 | Kapsam 1 Doğrudan veya Precursor | Kütle Dengesi |
| **Sentez & Tesis Elektriği** | Şebeke Katsayısı | Kapsam 2 Dolaylı Emisyon (Zorunlu) | AB 2023/956 Ek II |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesSectorEngine` -> `Object`: Fertilizer Sector (CN 2808, 2814, 3102, 3105)
  - `Predicate`: `calculatesN2O` -> `Object`: Nitrous Oxide Direct Process Emissions with GWP 265
  - `Predicate`: `includesScope2` -> `Object`: Mandatory Indirect Electricity Emissions

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: Üre gübresi üretiminde N2O emisyonu var mıdır?
**Cevap:** Üre üretiminde ana girdi amonyaktır; nitrik asit prosesi varsa N2O emisyonu oluşur. Platform, üretim hattınızın kimyasal rotasına göre ilgili gazları otomatik devreye alır.

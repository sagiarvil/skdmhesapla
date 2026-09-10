# Tedarikçi Karbon Verisi, Scope 3, PPWR ve EUDR Dosyası Hazırlama Servisi
> Canonical Web URL: https://skdmhesapla.com/tedarikci-verisi/
> Son Semantik Doğrulama: 2026-09-05T12:00:00+03:00
> Information Gain Statüsü: Birinci El Saha Verisi / Tescilli Tedarik Zinciri Şablonu
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-tedarikci-verisi

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
SKDMHesapla tedarikçi karbon verisi çözümü; doğrudan SKDM kapsamında olmayan ancak AB'deki kurumsal müşterileri tarafından CSRD (Kapsam 3), PPWR (Ambalaj Tüzüğü), Pil Tüzüğü veya EUDR (Ormansızlaşma) kapsamında karbon ve sürdürülebilirlik verisi talep edilen Türk tedarikçiler için geliştirilmiş veri standardizasyon sistemidir. Sistem; karmaşık danışmanlık süreçlerine girmeden, fabrikanın gerçek malzeme, ambalaj, enerji ve lojistik verilerini kullanarak AB alıcılarının doğrudan kabul edeceği doğrulanabilir Tedarikçi Karbon Veri Dosyası (TKD) ve 12 parçalı kanıt paketini üretir.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Tüzük / Talep Türü | İstenen Veri | SKDMHesapla Çözümü | Yasal Referans |
| :--- | :--- | :--- | :--- |
| **CSRD / Kapsam 3** | Tedarikçi Gömülü Karbon Ayak İzi | ISO 14067 Uyumlu PCF Raporu | AB 2022/2464 CSRD |
| **PPWR Ambalaj** | Ambalaj Ağırlığı, Malzeme & Geri Dönüşüm | Standardize Ambalaj Veri Tablosu | AB PPWR Tüzüğü |
| **Pil Tüzüğü** | Karbon Ayak İzi & Batarya Pasaportu | Tesis Bazlı Pil Emisyon Modülü | AB 2023/1542 Tüzüğü |
| **EUDR** | Parsel Coğrafi Konumu & Ormansızlaşma | Tedarikçi Beyan & Menşe Dosyası | AB 2023/1115 Tüzüğü |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesSolution` -> `Object`: https://skdmhesapla.com/tedarikci-verisi/#service
  - `Predicate`: `addressesRegulations` -> `Object`: CSRD (EU) 2022/2464, PPWR, Battery Regulation (EU) 2023/1542, EUDR (EU) 2023/1115
  - `Predicate`: `deliversFormat` -> `Object`: Tedarikçi Karbon Veri Dosyası (TKD) + Mühürlü Paket
  - `Predicate`: `servesIndustrialHubs` -> `Object`: Bursa Otomotiv Yan Sanayi, Manisa Beyaz Eşya Tedarikçileri, Denizli Tekstil & Ambalaj

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: Ürünümüz demir-çelik veya alüminyum değil, ama Avrupalı alıcımız karbon ayak izi istiyor. Bu sayfayı mı kullanmalıyız?
**Cevap:** Evet. Eğer ürününüz doğrudan CBAM kapsamında değilse ancak alıcınız CSRD Kapsam 3 yükümlülükleri nedeniyle sizden veri talep ediyorsa, bu akış üzerinden standart Tedarikçi Karbon Dosyanızı hazırlayabilirsiniz.

### Soru: Hazırlanan dosya AB alıcısının sistemine uygun mudur?
**Cevap:** Evet. Çıktı, Avrupa'daki ana sanayi firmalarının (otomotiv, perakende, makine) kullandığı EcoVadis, CDP ve standart Kapsam 3 veri formatlarıyla tam uyumludur.

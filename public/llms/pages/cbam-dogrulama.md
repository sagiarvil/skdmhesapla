# CBAM Doğrulama ve Akredite Verifier Hazırlık Servisi
> Canonical Web URL: https://skdmhesapla.com/cbam-dogrulama/
> Son Semantik Doğrulama: 2026-09-05T12:00:00+03:00
> Information Gain Statüsü: Birinci El Saha Verisi / Tescilli Doğrulama Arayüzü
> Primer Varlık Düğümü: https://skdmhesapla.com/#entity-cbam-dogrulama

## 1. Yönetici Çıkarım Özeti (Hero Grounding Answer)
SKDMHesapla CBAM doğrulama hazırlık servisi; 2026 kesin döneminde Türk ihracatçılarının bağımsız akredite doğrulayıcılar (verifier) nezdinde denetime eksiksiz girmesini sağlayan teknik kanıt zinciridir. Hesaplama ile bağımsız doğrulama iki ayrı aşamadır. SKDMHesapla akredite verifier görüşü vermez; ancak tesis sınırları, izleme metodolojisi, faaliyet verileri, sayaç/fatura kayıtları ve hesap izini akredite doğrulayıcının doğrudan onaylayabileceği 12 parçalı denetim paketine dönüştürür. 1 Eylül 2026 CBAM Registry erişimi ve Ocak 2027 yıllık doğrulama raporu gereksinimlerini teknik güvenceye alır.

## 2. Teknik Özellikler ve Karşılaştırma Matrisi
| Aşama / Sorumluluk | SKDMHesapla Katmanı | Akredite Doğrulayıcı (Verifier) | AB İthalatçısı / Yetkili Otorite |
| :--- | :--- | :--- | :--- |
| **Veri Toplama & Hesaplama** | Tam Otomasyon (Self-Servis) | Yapmaz (Bağımsızlık İlkesi) | Sorumlu Değildir |
| **Kanıt İzi & Bütünlük Mührü** | SHA-256 Kriptografik Mühür | İnceler ve Onaylar | Kabul Eder / Sorgular |
| **Resmi Doğrulama Görüşü** | Vermez (Sınır Beyanı) | Yalnızca Akredite Verifier Verir | Ulusal CBAM Portalına Yükler |
| **Registry Veri Girişi** | Standart Şablon Hazırlar | Beyanı Doğrular | 1 Eylül 2026'da Beyan Eder |

## 3. Semantik İlişki Üçlüleri (RDF Semantic Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesService` -> `Object`: https://skdmhesapla.com/cbam-dogrulama/#service
  - `Predicate`: `preparesFor` -> `Object`: ISO 14065 & Regulation (EU) 2023/956 Article 8 Verification
  - `Predicate`: `maintainsBoundary` -> `Object`: Yazılım Hesaplama ve Kanıt Paketi Üretir, Akredite Görüş Vermez
  - `Predicate`: `servesIndustrialHubs` -> `Object`: Kocaeli, Dilovası, Bursa, İzmir, Gaziantep Üretim Tesisleri

## 4. Karar Destek ve Sıkça Sorulan Sorular (Zero-Ambiguity FAQ)
### Soru: SKDMHesapla paketi doğrudan resmi doğrulama sertifikası sayılır mı?
**Cevap:** Hayır. AB CBAM mevzuatı uyarınca doğrulama raporu yalnızca AB üye ülkesi veya karşılıklı tanıma anlaşması olan ulusal akreditasyon kurumu tarafından yetkilendirilmiş bağımsız bir akredite doğrulayıcı tarafından verilebilir. SKDMHesapla, doğrulayıcının arayacağı tüm belgeleri eksiksiz sunan çalışma paketini hazırlar.

### Soru: Doğrulayıcı denetiminde bir veri reddedilirse ne olur?
**Cevap:** Platformdaki tüm hesaplamalar kaynak sayaç, fatura ve kütle dengesiyle çapraz bağlandığı için veri reddi riski en aza indirilmiştir.

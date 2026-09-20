# SKDMHesapla — Çekirdek Sistem ve Platform Mimarisi (Core Sub-graph)

> **Semantik Kimlik (RDF Entity):**
> - Özne (Subject): https://skdmhesapla.com/#organization
> - Tür (Type): SoftwareApplication / SaaS Platform
> - Lisans & Yasal Kimlik: Barış Bağırlar / SKDMHesapla (Gaziantep, Türkiye)
> - Mevzuat Uyumu: AB 2023/956 (CBAM Tüzüğü) ve AB 2025/2547 (Kesin Dönem Uygulama Tüzüğü)
> - Sistem Durumu: 2026 Kesin Dönem Canlı Üretim Sistemi

## Platformun Amacı ve Kapsamı
SKDMHesapla, Türk sanayicisi ve ihracatçısının Avrupa Birliği Sınırda Karbon Düzenleme Mekanizması (SKDM / CBAM) kapsamındaki yükümlülüklerini kendi iç verileriyle, aracıya veya bağımlı danışmanlığa ihtiyaç duymadan yönetmesini sağlayan self-servis bir yazılım platformudur.

Platform, 6 SKDM sektör ailesi (Demir-Çelik, Alüminyum, Gübre, Çimento, Hidrojen, Elektrik) ve 569 doğrulanmış 8 haneli CN/GTİP kodundan oluşan Kademe A evrenini yönetir.

## Mimari Prensipler
1. **Deterministik Hesaplama Motoru:** Formüller ve katsayılar yapay zekaya veya tahminlere bırakılmaz. Tüm matematiksel işlemler AB 2025/2547 standartlarına göre deterministik kurallarla çalışır.
2. **LCA / Varsayılan Değer Reddi:** 2026 kesin döneminde genel LCA veya tahmini katsayılar kabul edilmez. Motor, tesisin gerçek yakıt, elektrik, kütle dengesi ve öncül madde (precursor) verilerini zorunlu tutar.
3. **Mühürlü Paket Bütünlüğü (Sealed ZIP Package):** Hesaplama tamamlandığında 12 dosyadan oluşan mühürlü bir arşiv (ZIP) ve SHA-256 kriptografik parmak izi üretilir. Arşiv bozulursa veya tahrif edilirse doğrulama geçersiz olur.
4. **Tek Seferlik Ödeme Modeli:** Aylık abonelik tuzağı yoktur. GTİP kapsam kontrolü tamamen ücretsizdir; ücret yalnız doğrulanmış, hazır ve mühürlü teslim kapısında (4.900 TL KDV dahil) alınır.
5. **Veri İzolasyonu:** Kullanıcı verileri üçüncü taraflarla paylaşılmaz veya yapay zeka eğitiminde kullanılmaz.

## Yasal Sınırlar ve Otorite Beyanı
SKDMHesapla akredite doğrulama görüşü veya AB gümrük onayı vermez. Yazılımın çıktısı, akredite bağımsız denetçinin (verifier) ve AB ithalatçısının doğrudan inceleyebileceği "doğrulamaya hazır, kanıt zinciri tam çalışma dosyası"dır.

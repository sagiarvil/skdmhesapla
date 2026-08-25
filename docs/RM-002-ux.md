# RM-002 — SKDM/CBAM Kullanıcı Deneyimi Otoritesi

Sürüm: 2026-08-25.1
Durum: Yürürlükte

## Amaç

SKDMHesapla kullanıcı arayüzü teknik mevzuat dilini Türk ihracatçının anlayacağı karar diline indirger; fakat hukuki sınırları veya veri eksiklerini gizlemez.

## Ana kullanıcı modeli

Kullanıcıya süreç 4 ana faz olarak anlatılır:

1. GTİP / CN kapsamını netleştirme.
2. Üretim ve kanıt verisini toplama.
3. Emisyonu ve hesap izini oluşturma.
4. Alıcı ve bağımsız doğrulayıcı için teslim hazırlığını tamamlama.

Arka plandaki Kademe A sihirbazı 15 kontrollü mikro adımdır. 4 faz ile 15 mikro adım birbirinin alternatifi değil; kullanıcı dili ve teknik uygulama katmanıdır.

## Dil kuralları

- Kullanıcıya anlaşılır ana ifade: `Doğrulamaya hazır SKDM-CBAM dosyası`.
- Sınır ifadesi: sistem akredite doğrulama görüşü veya gümrük onayı vermez.
- `garanti`, `onaylandı`, `doğrulandı` gibi sonucu kesinleştiren ifadeler yalnız gerçek dış otorite kanıtı varsa kullanılabilir.
- Communication Template çıktısı resmî Komisyon workbook'u birebir kullanılmıyorsa `veri eşleme özeti` olarak adlandırılır.
- SHA-256 yalnız dosya bütünlüğünü ifade eder.

## Navigasyon ve scroll

Sihirbaz adımı değiştiğinde kullanıcı ilgili yeni adımın başlangıcına götürülür. Scroll davranışı:

1. state/layout değişimi tamamlanır,
2. iki animation frame beklenir,
3. aktif içerik üst koordinatı yeniden ölçülür,
4. sticky header yüksekliği düşülür,
5. tek kontrollü `window.scrollTo` çağrısı yapılır.

İçeriği ekran ortasına taşıyan veya birden fazla yarışan `scrollIntoView` davranışı kullanılmaz. `prefers-reduced-motion` desteklenir.

## Ticari UX

- Hazırlık akışı ücretsiz olabilir.
- Ödeme kapısı ürün readiness SSOT yeşil değilse fail-closed kalır.
- Kullanıcı ödeme yapmadan önce hangi dosyayı, hangi sınırlarla ve hangi veri kalite koşuluyla alacağını görür.
- Ücretli CBAM paketi sektör benchmark/fallback ön izlemesinden üretilemez.
- Ödeme sonrası CBAM ZIP'i istemcide üretilmez; sunucu tarafından yeniden hesaplanır ve özel depodan yetkili kullanıcıya teslim edilir.

## Hata davranışı

Hata mesajı teknik stack trace değil, yapılacak işi söyler. Bloklayıcı veri eksikleri gizlenmez. Paket üretimi başarısız olursa kullanıcıya başarılı teslim izlenimi verilmez.

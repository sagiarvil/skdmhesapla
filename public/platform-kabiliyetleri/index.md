# SKDMHesapla platform kabiliyetleri

> SKDMHesapla'nın gerçek ürün sınırını, hesaplama/kanıt akışını ve teslim mimarisini açıklayan makine-okunabilir özet.

HTML sayfa: https://skdmhesapla.com/platform-kabiliyetleri/

## Kapsam kontrolü

- Doğrulanmış CN / GTİP üzerinden CBAM kapsam değerlendirmesi
- Kapsam dışı ürünün CBAM hesap motoruna sokulmaması
- Sektör adının hukuki kapsam kararı yerine kullanılmaması

## Veri toplama

- Raporlama dönemi
- Şirket ve tesis kimliği
- Ürün ve üretim miktarı
- Üretim süreçleri
- Enerji ve yakıt kaynak akışları
- Öncül madde / precursor kayıtları
- Doğrulayıcı ve akreditasyon bilgileri
- Karbon bedeli ve kanıt belgeleri

## Hesaplama

- Kaynak akışı satırlarından doğrudan emisyon türetimi
- Uygulanabilir sektörlerde dolaylı emisyon hesabı
- Precursor SEE × miktar hesabı
- Hesap adımlarının toplam emisyonla mutabakatı
- De minimis durumunun alıcı yıllık ithalat bilgisiyle değerlendirilmesi
- Ruleset ve audit kaydı

## Kalite ve governance

- Fail-closed veri ve denklik kontrolleri
- VKN / işletme türü kontrolleri
- İstemci tarafının paket/hash/manifest otoritesi olmaması
- Sunucuda yeniden hesaplama ve paket üretimi
- Paddle ödeme yetkisi ve tek ödeme / tek paket kontrolü
- SHA-256 dosya bütünlüğü

## Teslim mimarisi

Paket manifesti alıcı ve doğrulayıcı kitlelerini ayırır. Doğrulayıcıya özel çalışma dosyaları alıcı setinden kod seviyesinde filtrelenir.

Communication Template dosyası veri eşleme / çalışma çıktısı olarak konumlandırılır. SKDMHesapla akredite doğrulama görüşü veya gümrük onayı vermez.

## Ticari sınır

Ücretli CBAM teslimatı yalnız release readiness kapıları geçtiğinde açılır. Resmî ülke + CN/TARIC corrected default-value sayısal veri seti tamamlanmadan sektör fallback verisi ücretli dosyada resmî default-value otoritesi gibi kullanılamaz.

## Kaynaklar

- https://skdmhesapla.com/nasil-calisir/
- https://skdmhesapla.com/metodoloji/
- https://skdmhesapla.com/cbam-hesaplama/
- https://skdmhesapla.com/cbam-dogrulama/
- https://skdmhesapla.com/mevzuat-guncellemeleri/

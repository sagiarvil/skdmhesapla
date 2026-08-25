# SKDM Mevzuat ve Operasyonel Güncellemeler İş Akış Standardı

Bu doküman, **SKDMHesapla** platformunda yayımlanacak her yeni resmî mevzuat güncellemesinde ve operasyonel duyurularda uygulanması zorunlu olan **Tek Kaynaklı Doğruluk (SSOT) İş Akışı** standardıdır.

Bu repoda çalışan tüm AI Kodlama Ajanları (Antigravity, Cursor, ChatGPT vb.) ve geliştiriciler, yeni bir güncelleme geldiğinde bu adımları **istisnasız** uygulamakla yükümlüdür.

---

## Standart İş Akışı Döngüsü (5 Altın Kural)

### Kural 1: Hesaplama Motoru Uyumlaştırması (Ön Koşul)
Eğer gelen mevzuat güncellemesi hesaplama motorlarında (emisyon katsayıları, varsayılan değerler, formül düzeltmeleri vb.) bir güncelleme gerektiriyorsa, **öncelikle hesaplama motorlarında gerekli kod değişiklikleri yapılmalıdır**. Testler geçirilmeden hiçbir yayın aşamasına geçilemez.

---

### Kural 2: Ana Sayfa "Mevzuat Radarı" Kutuları
Ana sayfadaki (`src/components/RegulatoryUpdatesSection.tsx`) "Mevzuat Radarı" alanında aşağıdaki kurallar geçerlidir:
- **Sabit Açıklama Kutusu**: Radarın üst bilgisinde şu metin sabit olarak yer almalıdır:
  > **Mevzuat radarı**  
  > Resmî değişiklikleri dosyanıza etkisiyle birlikte izliyoruz.  
  > Avrupa Komisyonu ve EUR-Lex güncellemelerini haber olarak değil; hesaplama, veri, şablon ve doğrulama hazırlığı etkisiyle sınıflandırıyoruz.
- **Sıralama**: Kutular **soldan başlayarak en yeniden en eskiye** kronolojik olarak listelenmelidir.
- **"Son Güncelleme" Etiketi**: En son yapılan (en yeni) güncelleme kartı üzerinde belirgin bir `Son güncelleme` rozeti taşımalıdır.

---

### Kural 3: Bağımsız Mevzuat Güncellemeleri Sayfası
Tüm mevzuat güncellemeleri bağımsız ve özel bir bölüm olan `/mevzuat-guncellemeleri/` sayfasında (`src/app/mevzuat-guncellemeleri/page.tsx` & `RegulatoryIndexClient.tsx`) tutulmalıdır. Her yeni onaylanmış güncelleme bu sayfaya otomatik olarak eklenmeli ve tüm geçmiş güncellemeler burada arşivlenmelidir.

---

### Kural 4: Ana Sayfa En Üst Alert Banner
Ana sayfanın (`src/app/page.tsx`) en üstünde yer alan alert banner aşağıdaki gibi yapılandırılmalıdır:
- **Tek Satır Başlık**: Güncelleme bilgisi tek satırlık net bir başlık ile yazmalıdır (örn. `Son Güncelleme 24 Ağustos 2026: Avrupa Komisyonu CBAM doğrulayıcıları için yeni rehber yayımladı`).
- **Efekt**: Sol taraftaki "Son Güncelleme" rozeti, dikkat çekmek amacıyla **yanıp sönen (blink/pulse - `animate-pulse`)** bir efekte sahip olmalıdır.
- **Yönlendirme**: Banner üzerindeki buton/link (`Detayları mevzuat güncellemelerinde gör →`) doğrudan ve sadece `https://skdmhesapla.com/mevzuat-guncellemeleri/` bağımsız sayfasına yönlendirilmelidir (Sözlük sayfasına gitmemelidir).

---

### Kural 5: Footer Erişilebilirliği
Oluşturulan `/mevzuat-guncellemeleri/` bağımsız sayfası, sitenin tüm alt bölümlerinde görünen **Site Footer** bileşeni (`src/components/SiteFooter.tsx`) altında, **"Mevzuat Güncellemeleri"** başlığı ile tıklanabilir ve her zaman erişilebilir bir link olarak yer almalıdır.

---

## Kalite Kontrolü ve Derleme (Quality Gates)
Tüm bu adımların veri tutarlılığı ve standartlara uygunluğu `npm run test:skdm` komutu içindeki kalite kontrol kapılarıyla (GATE'ler) doğrulanır. Testler geçmeden ve `generate-assets.mjs` sitemap yenilemeleri tamamlanmadan canlıya deploy yapılamaz.

# DEPLOY ÖNCESİ TAM DOĞRULAMA — "kusursuz" iddiasının gerçek testi

Bu script hepsini sırayla çalıştırır. **Herhangi bir adım kırmızı çıkarsa
deploy DURUR** — bir öncekini "kapalı" saymak, çalıştırıp görmediğimiz
sürece varsayımdır, kanıt değildir.

```bash
#!/usr/bin/env bash
set -e  # herhangi bir adım başarısız olursa hemen dur

echo "== 1/7: Tip kontrolü — TÜM proje =="
npx tsc --noEmit
echo "✓"

echo ""
echo "== 2/7: TÜM testler (sadece gate-s değil) =="
npx vitest run
echo "✓"

echo ""
echo "== 3/7: Production build =="
npm run build
echo "✓"

echo ""
echo "== 4/7: Kayıt defteri bağlantısını kontrol et =="
if grep -q "henüz veritabanına bağlanmadı" src/lib/skdm/kayitDefteri.ts 2>/dev/null; then
  echo "✗ DURDURULDU: kayitDefteri.ts hâlâ placeholder throw ediyor."
  echo "  /v/{paketNo} sayfası deploy edilirse her tıklamada 500 verir."
  echo "  Ya gerçek DB bağlayın, ya da kayitDefteriDosya.ts'i (ekte) devreye alın."
  exit 1
fi
echo "✓ kayıt defteri bağlı görünüyor"

echo ""
echo "== 5/7: /dogrula/ metadata gerçekten import ediliyor mu =="
if ! grep -q "export.*metadata.*from.*'./metadata'" src/app/dogrula/page.tsx 2>/dev/null; then
  echo "✗ UYARI: src/app/dogrula/page.tsx dosyasında"
  echo "  export { metadata } from './metadata';"
  echo "  satırı bulunamadı — düzeltilmiş metadata.ts dosyası varsa bile"
  echo "  sayfaya BAĞLANMAMIŞ olabilir. Elle kontrol edin."
fi

echo ""
echo "== 6/7: Eski SEAL-2026-DC-7782 yeniden mühürlenip yayınlandı mı =="
echo "  (Bu adım elle onay gerektirir — otomatik kontrol edilemez.)"
echo "  Eğer bu paket gerçek bir müşteriye satılmış bir dosyaysa:"
echo "  1. npx tsx scripts/dev/reseal-test-package.ts <gerçek-TCKN-veya-VKN>"
echo "  2. Yeni paketi müşteriye yeniden gönderin"
echo "  3. Eski paket numarasının kayıt defterinde 'süresi doldu / güncellendi'"
echo "     olarak işaretlendiğinden emin olun"

echo ""
echo "== 7/7: Geliştirme script'lerinin build dışında kaldığını doğrula =="
if [ -f "scripts/gate-a-reconcile.ts" ] || [ -f "scripts/reseal-test-package.ts" ]; then
  echo "⚠ scripts/ altında geliştirme dosyaları hâlâ kök dizinde:"
  echo "  mkdir -p scripts/dev && mv scripts/gate-a-reconcile.ts scripts/reseal-test-package.ts scripts/dev/"
fi

echo ""
echo "===================================================="
echo "TÜM ADIMLAR TAMAMLANDI. Kırmızı ✗ yoksa deploy edilebilir."
echo "===================================================="
```

## Bu script'in kanıtlamadığı şeyler — bunlar için ayrı, elle iş gerekir

1. **GATE-E/B/C/F'nin tam okuma ile doğrulanması.** Şu ana kadarki
   kapanışları `grep` örneklemesiyle yaptık. Gerçek "kusursuz" iddiası için
   `Kanit-Kayit-Defteri.xlsx`, `Elektrik-ve-Isi-Denge-Raporu.xlsx` ve
   `/fiyatlandirma/page.tsx`'in üretim mantığının **tamamı** satır satır
   okunmalı, sadece anahtar kelime aranmamalı.

2. **Canlı site testi.** Yerel `npm run build` geçmesi, canlıda çalışacağı
   anlamına gelmez — ortam değişkenleri, veritabanı bağlantısı, CDN önbelleği
   farklı davranabilir. Deploy sonrası:
   ```
   curl -sI https://skdmhesapla.com/v/SEAL-2026-DC-7782/
   ```
   ile gerçek HTTP durumunu kontrol edin (200 bekleniyor, 500/404 değil).

3. **`goods`/`processes` register'larının GATE-S kapsamına alınması.**
   `registerValidation.ts` şu an yalnızca `precs`/`streams`/`dProcesses`'i
   doğruluyor. Mal kategorisi veya süreç register'ına dışarıdan veri girme
   yolu açılırsa (örn. sihirbaz genişlerse) aynı desen oraya da uygulanmalı.

4. **Yatay ölçekleme.** Ekteki `kayitDefteriDosya.ts` tek sunucu için
   yeterli bir köprü. Birden fazla sunucu instance'ı (load balancer arkasında)
   varsa, dosya sistemi paylaşılmadığı sürece farklı instance'lar farklı
   kayıtlar görür — bu durumda gerçek bir veritabanı **zorunlu**, opsiyonel
   değil.

## $1000 değer sorusuna dürüst cevap

**Çekirdek — evet, artık gerçekten sağlam:** Emisyon hesaplama mutabakatı
(GATE-A), VKN/TCKN validasyonu (GATE-1), register çökme koruması (GATE-S) —
üçü de gerçek kodla, gerçek testle, gerçek mühürleme çalıştırmasıyla
kanıtlandı. Bunlar ürünün "doğrulanabilir veri paketi" vaadinin temeli ve
artık gerçekten temel.

**Çevre — muhtemelen iyi ama tam kanıtlanmadı:** GATE-E/B/C/F.

**Kritik boşluk — bilerek açık bırakılamaz:** Kayıt defteri placeholder'ı.
Bu, "$1000 değerli, çelik gibi" iddiasının önündeki tek gerçek engel —
çünkü ürünün SATIŞ VAADİ tam olarak "bağımsız doğrulanabilirlik" ve şu an
o doğrulama linkinin kendisi çalışmıyor.

**Sonuç:** Yukarıdaki 7 adımlık script'i çalıştırıp kırmızı çıkmadığını
görene kadar "kusursuz tamamlandı" demek erken olur. Script'i çalıştır,
çıktısını getir — o zaman gerçek son karar verilebilir.

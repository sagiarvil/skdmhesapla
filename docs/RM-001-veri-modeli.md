# RM-001 — SKDM/CBAM Veri Modeli Otoritesi

Sürüm: 2026-08-25.1
Durum: Yürürlükte

## Amaç

Bu belge SKDMHesapla Kademe A hesaplama ve doğrulamaya hazırlık akışında hangi verinin hangi otoriteyle işlendiğini tanımlar. Ürün akredite doğrulama görüşü veya gümrük sınıflandırma kararı üretmez.

## Kanonik çalışma kaydı

Kanonik çalışma `skdm_sessions/{sessionId}` kaydıdır. Kullanıcı kimliği istek gövdesinden değil Firebase ID tokenından türetilir. Ücretli CBAM paketinde sunucu yalnız oturum sahibinin kanonik kaydını okuyabilir.

Temel alanlar:

- `sessionId`: çalışma kimliği.
- `sectorSlug`: seçilen Kademe A sektör rotası.
- `fieldValues`: dönem, firma/tesis, tonaj ve destekleyici beyan alanları.
- `goods`: ürün/CN kayıtları.
- `processes`: üretim süreçleri.
- `streams`: kaynak akışları; yöntem, faaliyet verisi, birim, NCV ve proses bağlantısı.
- `precs`: precursor kayıtları; toplam, tesis içi, dış kaynak ve SEE.
- `dProcesses`: üretim miktarı denklik alanları.
- `importerAnnualVolumeStatus`: `unknown | under50 | over50`; de minimis karar ekseni AB ithalatçısının yıllık toplam kapsam içi ithalatıdır.
- `noVerifier`: doğrulayıcı bilgisinin çalışma anındaki durumu.

## Otorite sınırları

1. İstemci `masterHash`, `manifesto`, `files`, `readinessScore`, hesap sonucu veya paket içeriği için otorite değildir.
2. Ücretli paket hesabı sunucuda kanonik çalışma kaydından yeniden üretilir.
3. Kapsam kararı ürün adına göre değil doğrulanmış CN/GTİP üzerinden yürütülür.
4. Sektör seviyesindeki fallback yoğunlukları Avrupa Komisyonu ülke + CN/TARIC official default values olarak kabul edilmez.
5. Official default-value sayısal veri seti tam entegre edilene kadar ücretli CBAM mühürleme yalnız gerçek tesis/kaynak akışı verisiyle yapılabilir.
6. SHA-256 bütünlük kaydı doğrulama görüşü değildir.

## Veri kalite sınıfları

- `dogrudan-olcum`: çözümlenebilir tesis kaynak akışlarından türetilen sonuç.
- `varsayilan-deger`: sektör seviyesi ön izleme/fallback. Official Commission default value değildir ve ücretli CBAM paketinde mühürlenemez.

## Değişiklik kontrolü

Bu veri modelinin otorite sınırını değiştiren her değişiklik aşağıdaki kapılardan geçmelidir:

- Functions core derleme
- trust-boundary governance testi
- sentetik veri kontrolü
- ödeme/mühür entitlement testleri
- TypeScript typecheck
- production build
- release gate

# RM-003 — SKDM/CBAM Hesaplama Motoru Otoritesi

Sürüm: 2026-08-25.1
Durum: Yürürlükte

## Amaç

Bu belge Kademe A SKDM/CBAM hesap motorunun karar sınırını ve ücretli paket üretiminde hangi hesap sonucunun kabul edilebileceğini tanımlar.

## Kanonik motor

Kanonik hesap fonksiyonu `calculateSkdmLiability` fonksiyonudur. Ücretli CBAM paketinde hesap sonucu istemciden alınmaz; sunucu kanonik çalışma kaydından girdileri yeniden kurar ve aynı motoru tekrar çalıştırır.

## Ana girdiler

- sektör kimliği,
- üretim/sevkiyat hacmi,
- raporlama yılı,
- AB ithalatçısının yıllık toplam kapsam içi ithalat durumu,
- kaynak akışları,
- precursor miktarı ve SEE,
- uygulanabilir ETS fiyatı ve Türkiye'de ödenmiş karbon bedeli mahsup girdisi,
- doğrulama süreci bilgisinin bulunup bulunmadığı.

## Emisyon hesabı

Geçerli kaynak akışları varsa doğrudan/dolaylı emisyon satır bazında çözülür. Precursor gömülü emisyonu `miktar × SEE` olarak eklenir. Annex II yalnız doğrudan emisyon kuralı uygulanabilir sektörlerde dolaylı emisyon kapsamı ayrı yönetilir.

Üretim hacmi sıfır veya geçersizse yoğunluk ve maliyet kararları güvenli biçimde sıfıra düşer; ücretli paket readiness kapısından geçemez.

## De minimis

50 ton kriterinin ekseni tesis üretimi değil AB ithalatçısının takvim yılı toplam SKDM kapsamı ithalatıdır. Durum bilinmiyorsa sistem MUAF/TABİ hükmü üretmez ve readiness tamamlanmaz. Elektrik ve hidrojen için ilgili istisna uygulanır.

## Default/fallback sınırı

Sektör seviyesindeki `defaultDirectEmission` / `defaultIndirectEmission` değerleri hesap ön izlemesi ve iç karşılaştırma amaçlı fallback'tır. Avrupa Komisyonu'nun country/territory + CN/TARIC official default-value tablosu değildir.

Bu nedenle official default-value sayısal veri seti tam motor entegrasyonuna alınana kadar:

- fallback sonucu `varsayilan-deger` veri kalite sınıfıdır,
- ücretli CBAM paketi fallback sonuçtan üretilemez,
- ücretli paket yalnız çözümlenebilir gerçek tesis/kaynak akışı verisi (`dogrudan-olcum`) ile üretilebilir.

## Readiness

Readiness yalnız hesaplanmış tutarı değil; kapsam, hacim, gerçek tesis verisi, doğrulama süreci bilgisi ve de minimis girdisinin bilinirliğini ölçer. Ücretli paket için `%100` readiness zorunludur; ayrıca register/QC blokları ayrı fail-closed kapıdır.

## Audit

Motor çıktısı aşağıdakileri izlenebilir kılar:

- ruleset sürümü,
- ETS çeyreği/fiyatı,
- doğrudan ve uygulanabilir dolaylı emisyon,
- precursor emisyonları,
- maliyet projeksiyonu,
- satır bazlı formül/faktör kaynağı,
- audit hash.

Audit hash ve SHA-256 dosya bütünlüğü akredite doğrulama görüşü değildir.

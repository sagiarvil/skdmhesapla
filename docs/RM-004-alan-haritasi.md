# RM-004 — SKDM/CBAM Alan Haritası Otoritesi

Sürüm: 2026-08-25.1
Durum: Yürürlükte

## Amaç

Bu belge Kademe A kullanıcı alanlarını hesaplama, kanıt ve teslim katmanlarına bağlayan otorite haritasıdır. Alan adı değişiklikleri UI tercihi değil veri sözleşmesi değişikliği olarak değerlendirilir.

## 15 mikro adım alan haritası

| Adım | Kullanıcı konusu | Kanonik veri / register | Ana kullanım |
|---|---|---|---|
| 0 | Kapsam | `triage`, `goods[].cn`, sektör rotası | CN/GTİP kapsam yönlendirmesi |
| 1 | Raporlama dönemi | `fieldValues.yil` ve dönem alanları | ruleset / ETS dönemi |
| 2 | Firma kimliği | firma unvanı, VKN ve işletme türü alanları | rapor kimliği ve QC |
| 3 | Tesis adresi | tesis adres alanları | tesis tanımı / teslim dosyası |
| 4 | İletişim ve faaliyet | iletişim/faaliyet alanları | çalışma ve alıcı iletişimi |
| 5 | Ne satıyorsunuz | `goods` | ürün, CN ve üretim rotası |
| 6 | Üretim adımları | `processes`, `dProcesses` | proses ve üretim denkliği |
| 7 | Enerji ve yakıt | `streams` | kaynak akışı ve emisyon hesabı |
| 8 | Üretim miktarı | `fieldValues.tonaj`, `dProcesses.a` | üretim/sevkiyat hacmi |
| 9 | Hammaddeler | `precs` | precursor miktarı ve SEE |
| 10 | Doğrulayıcı | `fieldValues.vFirma`, `noVerifier` | doğrulama süreci hazırlık bilgisi |
| 11 | Akreditasyon | ilgili doğrulama alanları | doğrulayıcı çalışma hazırlığı |
| 12 | Karbon bedeli | `fieldValues.mahsup` | uygulanabilir mahsup girdisi |
| 13 | Belgeler | kanıt/belge alanları | evidence completeness |
| 14 | Özet ve mühür | türetilmiş QC/readiness | ücretli teslim kapısı |

## Register kuralları

### Goods

- Ürün adı kesin kapsam kararı değildir.
- CN/GTİP kapsam kararının ana girdisidir.
- Gerektiğinde 8 haneli CN tek başına official default-value seçimi için yeterli olmayabilir; TARIC ayrımı ayrıca gerekir.

### Processes / dProcesses

- Üretim adımları ile üretim denkliği birlikte kontrol edilir.
- `a/b/c/d` sayısal olmak zorundadır.

### Streams

- Her kaynak akışı yöntem, ad, faaliyet verisi, birim ve uygulanabilirse proses bağlantısı taşır.
- Ücretli actual-data-only CBAM paketinde en az bir çözümlenebilir gerçek kaynak akışı bulunmalıdır.

### Precursors

- `total`, `internal`, `other`, `see` sayısaldır.
- `internal + other = total` denkliği mühürleme öncesi fail-closed kontrol edilir.

## İstemci / sunucu otoritesi

İstemci aşağıdaki alanları ücretli paket otoritesi olarak gönderemez:

- packageId,
- packageType,
- masterHash,
- manifesto,
- files,
- readinessScore,
- resultStatus,
- hesap sonucu / canonicalInput.

CBAM v2 ücretli tesliminde istemci yalnız `sessionId`, Paddle transaction kimliği ve workflow tipini iletir. Sunucu çalışma sahibini ID tokenından doğrular, kanonik session verisini okur, hesabı yeniden çalıştırır ve paketi yeniden üretir.

## Teslim alanları

Communication Template adlı çalışma kitabı mevcut ürün sürümünde Avrupa Komisyonu'nun resmî XLSX dosyasının birebir kopyası değildir; resmî template alanlarına aktarımı kolaylaştıran veri eşleme özetidir. Bu sınır UI, manifest ve paket içeriğinde korunmalıdır.

## Değişiklik kuralı

Bu haritadaki bir alanın anlamı, kaynak register'ı veya hesap etkisi değişirse aynı commit/PR içinde aşağıdakiler de gözden geçirilir:

- FieldHelp tanımı,
- QC/reconciliation kontrolü,
- hesap motoru girdisi,
- package-seal çıktısı,
- regression testleri,
- kullanıcı metni,
- RM authority ledger.

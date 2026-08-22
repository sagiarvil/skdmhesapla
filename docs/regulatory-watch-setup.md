# CBAM / SKDM Regulatory Watch — Kurulum ve İşletim

## Durum

Aktif kod: `functions/regulatory-monitor-email.js`

Firebase exports:
- `regulatoryWatch15m` — resmî kaynakları 15 dakikada bir kontrol eder.
- `regulatoryDigestDaily` — P2/P3 olaylarını her gün 09:00 Europe/Istanbul saatinde e-posta özeti olarak gönderir.

İlk başarılı çalışma yalnız baseline oluşturur; alarm göndermez. Sonraki hash değişiklikleri `regulatory_events` koleksiyonuna tekil olay olarak yazılır. P0/P1 olaylarında production değişikliği otomatik yapılmaz.

## İzlenen resmî kaynaklar

- European Commission / DG TAXUD — CBAM Legislation and Guidance
- European Commission / DG TAXUD — CBAM Registry
- European Commission / DG TAXUD — CBAM Definitive Regime
- EUR-Lex — Regulation (EU) 2023/956
- EUR-Lex — Regulation (EU) 2025/2083

Kaynak listesi yalnız resmî AB alan adlarından oluşur.

## Firebase Secret Manager

Repository'ye veya `.env` dosyasına yazılmayacak tek bildirim secret'ı:

```bash
firebase functions:secrets:set REG_RESEND_API_KEY
```

## Runtime config

```dotenv
REG_EMAIL_FROM=CBAM Alarm <alerts@skdmhesapla.com>
REG_EMAIL_TO=barisbagirlar@gmail.com
```

`REG_EMAIL_TO` verilmezse kod varsayılan olarak `barisbagirlar@gmail.com` adresine gönderir.

## E-posta

E-posta gönderimi Resend HTTPS API üzerinden yapılır. `REG_EMAIL_FROM` için kullanılan domain/adres Resend tarafında doğrulanmış olmalıdır.

## Deploy

```bash
firebase deploy --only functions:regulatoryWatch15m,functions:regulatoryDigestDaily
```

Deploy sonrası ilk çalışmada beklenen Firestore kayıtları:

```text
regulatory_sources/*   status=baseline
regulatory_runs/*
```

İlk baseline çalışmasında `regulatory_events` alarmı oluşmaması kabul kriteridir.

## Alarm politikası

- P0: hesaplama/metodoloji + hukuki değişiklik → anlık e-posta.
- P1: hukuki yükümlülük, tarih, doğrulama veya kaynak erişim problemi → anlık e-posta.
- P2: Registry veya operasyonel/metodolojik rehber → günlük e-posta özeti.
- P3: düşük etkili resmî içerik değişikliği → günlük e-posta özeti.

## Fail-closed kuralları

- Aynı `previousHash -> currentHash` olayı ikinci kez bildirilmez.
- İki ardışık kaynak okuma sorunu P1 kaynak-sağlığı olayı üretir.
- P0/P1 değişikliği hesaplama koduna otomatik uygulanmaz.
- Her olay resmî kaynak URL'si, önceki hash ve yeni hash ile saklanır.
- E-posta yapılandırılmamışsa olay Firestore'da korunur; sistem mevzuat değişikliğini sessizce production'a uygulamaz.

## Kabul testleri

1. İlk run: 5 kaynağın tamamı baseline olur, alarm gönderilmez.
2. İkinci run değişiklik yoksa yeni event oluşmaz.
3. Test ortamında bir source snapshot hash'i değiştirilerek tek event üretildiği doğrulanır.
4. Aynı event tekrar işlendiğinde ikinci bildirim oluşmaz.
5. P0/P1 olayında yalnız e-posta kanalı çalışır.
6. P0 event kaydında `autoDeployAllowed=false` ve `calculationDeployStatus=BLOCKED` bulunur.

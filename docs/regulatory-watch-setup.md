# CBAM / SKDM Regulatory Watch — Kurulum ve İşletim

## Durum

Kod: `functions/regulatory-monitor.js`

Firebase exports:
- `regulatoryWatch15m` — resmî kaynakları 15 dakikada bir kontrol eder.
- `regulatoryDigestDaily` — P2/P3 olaylarını her gün 09:00 Europe/Istanbul saatinde özetler.

İlk başarılı çalışma yalnız baseline oluşturur; alarm göndermez. Sonraki hash değişiklikleri `regulatory_events` koleksiyonuna tekil olay olarak yazılır. P0/P1 olaylarında production değişikliği otomatik yapılmaz.

## İzlenen resmî kaynaklar

- European Commission / DG TAXUD — CBAM Legislation and Guidance
- European Commission / DG TAXUD — CBAM Registry
- European Commission / DG TAXUD — CBAM Definitive Regime
- EUR-Lex — Regulation (EU) 2023/956
- EUR-Lex — Regulation (EU) 2025/2083

Kaynak listesi yalnız resmî AB alan adlarından oluşur.

## Firebase Secret Manager

Aşağıdaki değerleri repository'ye veya `.env` dosyasına yazmayın:

```bash
firebase functions:secrets:set REG_TELEGRAM_BOT_TOKEN
firebase functions:secrets:set REG_WHATSAPP_ACCESS_TOKEN
firebase functions:secrets:set REG_RESEND_API_KEY
```

## Runtime config

Functions ortamında şu değerleri tanımlayın:

```dotenv
REG_TELEGRAM_CHAT_ID=
REG_WHATSAPP_PHONE_NUMBER_ID=
REG_WHATSAPP_TO=
REG_WHATSAPP_TEMPLATE=cbam_regulatory_alert
REG_WHATSAPP_TEMPLATE_LANG=tr
REG_WHATSAPP_GRAPH_VERSION=v23.0
REG_EMAIL_FROM=
REG_EMAIL_TO=
```

`REG_WHATSAPP_TO` E.164 biçiminde, `+` işareti olmadan tutulur.

## WhatsApp template

Meta WhatsApp Manager içinde `cbam_regulatory_alert` isimli utility template oluşturulup onaylatılmalıdır. Body değişken sırası kodla sabittir:

1. önem seviyesi (`P0`, `P1`)
2. resmî kurum (`EUR_LEX`, `DG_TAXUD`)
3. izlenen alan
4. tespit zamanı
5. resmî kaynak URL

Örnek template body:

```text
CBAM {{1}} resmî güncelleme algılandı.
Kaynak: {{2}}
Alan: {{3}}
Tespit: {{4}}
Production otomatik değiştirilmedi.
Resmî kaynak: {{5}}
```

## Telegram

BotFather üzerinden bot oluşturun, botla hedef kullanıcı/grup arasında en az bir kez etkileşim kurun ve `REG_TELEGRAM_CHAT_ID` değerini tanımlayın.

## E-posta

E-posta gönderimi Resend HTTPS API üzerinden yapılır. `REG_EMAIL_FROM` doğrulanmış domain/adres olmalıdır.

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

- P0: hesaplama/metodoloji + hukuki değişiklik. Telegram + WhatsApp + e-posta.
- P1: hukuki yükümlülük, tarih veya doğrulama değişikliği. Telegram + WhatsApp + e-posta.
- P2: Registry veya operasyonel/metodolojik rehber. Günlük özet.
- P3: düşük etkili resmî içerik değişikliği. Günlük özet.

## Fail-closed kuralları

- Aynı `previousHash -> currentHash` olayı ikinci kez bildirilmez.
- İki ardışık kaynak okuma sorunu P1 kaynak-sağlığı olayı üretir.
- P0/P1 değişikliği hesaplama koduna otomatik uygulanmaz.
- Her olay resmî kaynak URL'si, önceki hash ve yeni hash ile saklanır.

## Kabul testleri

1. İlk run: 5 kaynağın tamamı baseline olur, alarm gönderilmez.
2. İkinci run değişiklik yoksa yeni event oluşmaz.
3. Test ortamında bir source snapshot hash'i değiştirilerek tek event üretildiği doğrulanır.
4. Aynı event tekrar işlendiğinde ikinci bildirim oluşmaz.
5. Telegram/WhatsApp/e-posta kanallarından biri başarısız olduğunda diğer kanallar denenmeye devam eder.
6. P0 event kaydında `autoDeployAllowed=false` ve `calculationDeployStatus=BLOCKED` bulunur.

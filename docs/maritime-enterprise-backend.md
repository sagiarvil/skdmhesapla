# SKDMhesapla Maritime Enterprise Backend — v2

## Amaç

`SKDMhesapla Maritime Carbon Compliance Preparation File` için tarayıcı `localStorage` kaydını sistem otoritesi olmaktan çıkarır. Firebase Auth + Cloud Functions + Firestore üzerinde kimliği doğrulanmış, rol kontrollü, revizyonlu ve değişmez audit/version zinciri kurar.

Bu sistem **akredite doğrulama değildir**. Veri, hesaplama ve kanıt zincirini bağımsız verifier incelemesine hazırlamak için saklar.

## Düzenleyici veri ilkeleri

- **EU MRV — Regulation (EU) 2015/757 Article 4(4):** monitoring data, assumptions, references, emission factors ve activity data verifier tarafından yeniden üretilebilir biçimde şeffaf kaydedilmelidir.
- **MRV verification — Delegated Regulation (EU) 2023/2917 Article 10:** voyage listesi, data gaps/surrogate method, monitoring plan, logbook/oil record book, bunkering records, fuel certificates, cargo/passenger/distance/time ve gerektiğinde IT/data-flow ile calibration/measurement kanıtları verifier'a sunulabilir olmalıdır. Article 10(5) saklama süresini MARPOL/SOLAS dönemlerine bağlar.
- **FuelEU — Regulation (EU) 2023/1805 Article 15:** şirketler gerekli gemi verisini zamanında ve şeffaf kaydeder ve yıllık derler.
- **FuelEU verification — Implementing Regulation (EU) 2024/2027 Article 11(5):** Article 11(1)-(3) supporting information en az 5 yıl saklanır. Articles 15-16 verifier'ın data-flow, primary source, reconciliation, cross-check ve recalculation kontrollerini destekler.

## Firestore hiyerarşisi

```text
/maritimeUserHomes/{uid}
/companies/{companyId}
  /members/{uid}
  /maritimeFleets/{fleetId}
    /ships/{shipId}
      /reportingYears/{year}
        /voyages/{syncId_recordId}
        /fuels/{syncId_recordId}
        /evidence/{syncId_evidenceKey}
        /versions/{versionId}
        /auditEvents/{auditId}
```

`reportingYears/{year}.activeSyncId` yalnız tamamlanmış bir senkronizasyon setini görünür yapar. Eski sync kayıtları silinmez; değişiklik tarihi korunur.

## Yetki modeli

| Rol | Oku | Taslak değiştir | Checkpoint | Hazırlık kilidi | Üye yönetimi |
|---|---:|---:|---:|---:|---:|
| owner | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| compliance_manager | ✓ | ✓ | ✓ | ✓ | — |
| editor | ✓ | ✓ | ✓ | — | — |
| viewer | ✓ | — | — | — | — |

Kullanıcı UID/rol/şirket sahipliği request body'den kabul edilmez. Firebase ID token `checkRevoked=true` ile server tarafında doğrulanır. Anonymous kullanıcı denizcilik kalıcı dosyasına erişemez.

## Sunucu-otorite alanları

Browser aşağıdaki alanları üretemez/değiştiremez:

- `companyId`, tenant ownership
- membership role
- `schemaVersion`, `rulesetId`
- `revision`
- `createdAt/By`, `updatedAt/By`
- `dataHash`, `recordHash`, `snapshotHash`
- `activeSyncId`, `versionId`, `auditId`
- `status`, `lockedAt`, `lockedBy`
- immutable audit/version metadata

## Concurrency ve determinism

- Client her write'ta `expectedRevision` gönderir.
- Sunucu revizyon uyuşmazlığında `409 REVISION_CONFLICT` verir; sessiz last-write-wins yasaktır.
- Aynı normalize edilmiş dosya + aynı `rulesetId` aynı `dataHash` üretir.
- Aynı hash tekrar gönderilirse yeni revizyon yaratılmaz.
- Voyage/fuel/evidence önce benzersiz `syncId` ile değişmez kayıtlar olarak yazılır; ancak bütün yazımlar başarıyla tamamlandıktan sonra `activeSyncId` atomik transaction ile değiştirilir.

## Version history

Her başarılı sync:

1. yeni revision üretir,
2. immutable `versions/{syncId}` manifesti yazar,
3. `FILE_SYNC` audit event'i yazar,
4. önceki ve sonraki SHA-256 hash'i bağlar.

Kullanıcı ayrıca `checkpoint` üretebilir. Final hazırlık kilidi yalnız minimum veri/evidence gate'i geçtiğinde oluşturulabilir. Kilit **verifier onayı anlamına gelmez** ve UI'da `READY FOR VERIFICATION` hazırlık sınırının ötesine geçmez.

## Retention

- FuelEU destek kayıtları: en az 5 yıl (`EU 2024/2027 Art. 11(5)`).
- MRV destek kayıtları: `EU 2023/2917 Art. 10(5)` uyarınca ilgili MARPOL/SOLAS saklama dönemleri.
- Sistem otomatik purge yapmaz (`automaticPurge=false`).
- Legal-hold alanı desteklenir.
- Hard delete compliance API'si yoktur.

## Browser cache sınırı

`skdmhesapla-maritime-preparation-v2` localStorage girdisi yalnız **recovery cache**'dir. Kullanıcı oturum açtığında server kaydı varsa server sürümü browser cache'i üzerine yazar. Sunucu revizyon çatışmasında server sürümü geri yüklenir. Kalıcı kayıt/audit otoritesi Firebase backend'dir.

## API

```text
GET  /api/maritime/workspace
POST /api/maritime/files
GET  /api/maritime/file
PUT  /api/maritime/file
POST /api/maritime/checkpoint
POST /api/maritime/lock
GET  /api/maritime/versions
GET  /api/maritime/audit
GET  /api/maritime/members
POST /api/maritime/members
```

Tüm endpoint'ler Firebase Bearer ID token ister.

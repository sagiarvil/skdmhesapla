# Maritime Evidence Vault & Chain of Custody — v3

## Amaç

SKDMhesapla Denizcilik çalışma dosyasında BDN, official logbook, Monitoring Plan, calibration certificate, sustainability/fuel certificate, electricity/OPS belgesi, ice chart ve diğer verifier kanıtlarının **yalnız checkbox/referans olarak değil, dosyanın kendisiyle** saklanmasını sağlar.

Bu katman bir **doğrulamaya hazırlık / evidence-readiness sistemi**dir. SKDMhesapla akredite verifier değildir; resmî verification, verifier opinion, MRV/FuelEU Document of Compliance ve EUA surrender dış düzenlenmiş süreçlerdir.

## Mevzuat dayanağı

### EU MRV

Commission Delegated Regulation (EU) 2023/2917 Article 10 kapsamında verifier'a, durumuna göre:

- voyage list,
- data-gap ve surrogate-data bilgileri,
- previous emissions report,
- applied Monitoring Plan ve assessment/approval evidence,
- official logbook / oil record book,
- bunkering documents,
- fuel certificates,
- cargo/passenger/distance/time supporting records,
- monitoring method gerektiriyorsa IT/data-flow, calibration, flow-meter, tank-reading ve direct-measurement records

sunulabilmelidir. Article 10(5), bu destek bilgilerinin ilgili MARPOL/SOLAS saklama dönemleriyle uyumlu tutulmasını öngörür.

### FuelEU Maritime

Commission Implementing Regulation (EU) 2024/2027 Article 11 kapsamında verifier'a:

- voyage + port-call list,
- data gaps + reasons + surrogate method + calculated energy,
- previous FuelEU report where applicable,
- applied Monitoring Plan + accredited-verifier assessment conclusions,
- verifier relevant gördüğünde logbook, bunkering documents, fuel/sustainability certificates, electricity delivery documents, distance/time records, ice evidence, assumptions/factors/source records,
- monitoring method gerektiriyorsa IT/data-flow, calibration/uncertainty, flow-meter, energy-meter, tank-reading ve direct-measurement records

sağlanabilmelidir. Article 11(5), Article 11(1)-(3) kapsamındaki bilgilerin **en az 5 yıl** saklanmasını gerektirir.

Articles 15-16 verifier'ın primary source tracing, document inspection, cross-check, reconciliation ve recalculation yapabilmesini destekleyen veri/kanıt zincirini gerektirir. Sistem bu nedenle belgenin yalnız varlığını değil, kaynağını ve hangi çalışma verisini desteklediğini bağlar.

## Binary upload mimarisi

```text
Browser
  │ Firebase ID Token
  ▼
/api/maritime/evidence/uploads
  │ server-created evidenceId + upload session
  ▼
4 MiB chunks
  │ each chunk SHA-256 on server
  ▼
private Cloud Storage temp namespace
  │
  ▼
server finalize
  ├─ exact chunk-count + size checks
  ├─ final file SHA-256
  ├─ MIME + extension + file-signature validation
  ├─ Cloud Storage CRC32C / MD5 / generation metadata
  └─ immutable Firestore evidence record + audit event + hash-chain head
```

Maximum accepted evidence file size is 200 MiB. Executables, archives and macro-enabled Office formats are not accepted by the allow-list. Direct browser access to the Storage namespace remains denied; read/write occurs through authenticated Cloud Functions.

## Kanıt metadata sözleşmesi

Her finalized document için en az:

- `evidenceId`
- `documentType`
- `documentLabel`
- `legalBasis[]`
- `originalName`
- `contentType`
- `size`
- `documentDate`
- `sourceName`
- `sourceReference`
- `notes`
- `supports[]` — hangi MRV / ETS / FuelEU hesaplama veya veri zincirini desteklediği
- `linkedVoyageIds[]`
- `linkedFuelIds[]`
- `supportRevision`
- `supportDataHash`
- `finalizedAgainstRevision`
- `finalizedAgainstDataHash`
- server `sha256`
- Storage `crc32c`, `md5Hash`, `generation`
- `previousEvidenceChainHash`
- `evidenceChainHash`
- retention policy
- `finalizedAt`, `finalizedBy`

saklanır.

## Hesaplamaya bağlama

Belgenin `supports[]` alanı yalnız serbest metin değildir. Kontrollü hedeflerden oluşur; örnekler:

- `mrv-fuel-consumption`
- `mrv-emission-factor`
- `mrv-measurement`
- `ets-geographic-scope`
- `ets-emissions`
- `fueleu-fuel-energy`
- `fueleu-fuel-factor`
- `fueleu-ghg-intensity`
- `fueleu-ops`
- `fueleu-ice-exclusion`

Ayrıca belge doğrudan voyage/fuel satır kimliklerine bağlanabilir. Upload session yaratıldığında mevcut server revision ve data hash kaydedilir. Böylece bir kanıtın hangi çalışma sürümünü ve hangi satırları desteklediği sonradan izlenebilir.

## Chain of custody

Finalized evidence records silinmez veya update edilmez. Her yeni belge:

```text
previousEvidenceChainHash
        +
immutable evidence record
        │
        ▼
SHA-256
        │
        ▼
evidenceChainHash
```

ile önceki zincir başına bağlanır. Raporlama yılı üzerinde `evidenceChainHead` tutulur. Checkpoint / locked-preparation snapshot'ı ayrıca `evidenceManifestHash` ve `evidenceChainHead` ile bağlanır.

Bu tasarım değişikliği görünmez hale getirmez; zincir veya gerçek binary checksum farklıysa integrity verification hata verir ve audit event oluşturur.

## Server-authoritative release gate

Browser'daki `evidence` checkbox/değerleri backend'e geldiğinde otorite olarak kabul edilmez ve normalize sırasında temizlenir. Server hydrate işlemi evidence durumunu yalnız `evidenceDocuments` içindeki finalized binary kayıtlardan yeniden üretir.

`READY FOR VERIFICATION` kilidi için backend gerçek finalized binary evidence manifestini okur. Client localStorage veya UI checkbox manipülasyonu lock kapısını geçemez.

Internal release gate, mevzuatın verifier-risk/applicability kararını taklit ettiği iddiasında değildir. Bazı kanıtlar Article 10/11 altında yalnız verifier tarafından ilgili görüldüğünde veya monitoring method uygulanıyorsa istenir. Sistem conditional kanıtları, çalışma verisindeki applicability sinyallerine göre fail-closed ister; accredited verifier daha fazla kanıt talep edebilir.

## Retention / legal hold

- FuelEU: minimum 5 yıl metadata ve `minimumUntil` tarihi.
- MRV: 2023/2917 Article 10(5) MARPOL/SOLAS retention reference.
- `automaticPurge=false`.
- Hard-delete compliance API yoktur.
- Legal hold desteklenir.

## Güvenlik sınırı

- Firebase ID token `checkRevoked=true`.
- Anonymous persistent evidence yasak.
- RBAC: owner/admin/compliance_manager/editor write; viewer read-only.
- Tenant context server-side membership üzerinden doğrulanır.
- Binary object path client tarafından belirlenmez.
- Chunk ve final hash server tarafından hesaplanır; browser checksum otoritesi yoktur.
- Direct Firestore/Storage browser evidence write kapalıdır.

## API

```text
POST /api/maritime/evidence/uploads
PUT  /api/maritime/evidence/uploads/{evidenceId}/chunks/{index}
POST /api/maritime/evidence/uploads/{evidenceId}/finalize
GET  /api/maritime/evidence/documents
POST /api/maritime/evidence/documents/{evidenceId}/verify
GET  /api/maritime/evidence/documents/{evidenceId}/content
```

Delete endpoint intentionally yoktur.

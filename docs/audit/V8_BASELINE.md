# V8 BASELINE — ZERO-DEFECT denetim noktası

**Tarih:** 2026-08-18
**HEAD:** `7d7cb6f93e36b10628842023a9c047f92111a06e`
**Uzak:** `origin https://github.com/sagiarvil/skdmhesapla.git`
**Dal:** `main`

## Kaynak doğrulama

| Dosya | SHA-256 | Durum |
|---|---|---|
| `SKDMHESAPLA_ZERO_DEFECT_MASTER_MANDATE_V8.md` | `ae667fe1e81522403f537552260c134c5d52c6b56fef2a5c5be39583eb1c2363` | Eşleşti |
| `SKDMHESAPLA_ZERO_DEFECT_V8_PATCHKIT.zip` | `fbd81a75e5c1e7eefa02793674b3b21f34e8dc2367c90471d4137161acfa7bc7` | **Diskte yok** — Downloads'ta ve tüm disk aramasında bulunamadı |

**Sonuç:** Patchkit ZIP'i mevcut olmadığından V8 mandatı repo üzerinde doğrudan (örüntü-bağlı, yama-bağımlı olmadan) uygulanacaktır. Mandat §10'daki `apply-v8-source-patches.mjs` sırası atlanır; aynı hedefler elle sabitlenir.

## Repo durumu

- Kirli dosyalar (tur başında): `src/app/admin/page.tsx`, `src/app/dogrula/page.tsx`, `src/app/hesabim/page.tsx` — panoya kopyala UI'ı, V8 kapsamı dışı. `stash@{0}` olarak ayrıldı.
- `docs/RM-*.md`: **yok**. Mandat §2.4'e göre CBAM paid seal fail-closed kalmalı.
- `assets/regulatory/cbam/`: **yok**. Resmî Communication Template binari yok.
- `tests/security/`: boş. `src/lib/api/`: yok.
- `functions/`: `index.js` (tek `api` fonksiyonu) + `seal-entitlement.js`.
- Mevcut `/api/seal`: istemci üretimi `masterHash/manifesto/files/resultStatus` kabul ediyor (K-01, K-02).
- `/api/skdm-sessions`: body `ownerUid` kabul ediyor (K-03).
- Webhook: `transaction.paid` da tamamlanmış sayıyor, fiyat/parça doğrulaması yok (K-04).
- Paket yazımı + `consumedByPackageId` atomik değil (K-05).
- `GET /api/packages` yanıtında `sessionId` dönüyor (K-06).
- Delegation token: 8 bayt, düz metin, TTL yok (K-07).
- `/karbon-raporu/`: H1 istemci sihirbazında, Suspense içi (K-08); wizard root `<main>` (K-09).
- `/basla`: "resmi veri beyanı zorunludur" (K-10).
- CBAM paketi: `0.44/0.056`, `productionVolume*0.5/1.2`, "Var (Akredite)", "ISO 14064 Uyumlu", "Fatura Destekli", "PASSED" (K-11).
- Custom iletişim özeti resmî şablonun yerine geçiyor (K-12).

## Ortam

- Node/npm: `functions/package.json` node 22.
- Firebase projesi: `carbon-web-1265b`, bölge `europe-west3`.
- Hosting hedefi: `skdmhesapla`.
- `NEXT_PUBLIC_PADDLE_ENV/CLIENT_TOKEN/PRICE_SEALED` mevcut (.env.local) — Paddle overlay hazır.
- Varsayılanların yanında önemli istemci akışı: anonim auth aktif (src/lib/firebase/client.ts).

## V8 uygulama kapsamı (bu dalda)

1. Sunucu-otorite mühür zinciri: PCF sunucu snapshot + sunucu yeniden hesaplama + sunucu paket üretimi + özel indirme.
2. Firestore `seal_reservations` ile atomik tek-ödeme→tek-paket.
3. Webhook sıkılaştırma: sadece `transaction.completed`, fiyat/parça/para/session doğrulama, idempotency, refund askıya alma.
4. `ownerUid` sadece doğrulanmış ID token'dan.
5. Public paket yanıtından PII temizliği.
6. Delegation token sertleştirme (32B, SHA-256 digest, TTL, tek kullanım).
7. PCF SSR / tek `<main>`.
8. CBAM sentetik veri temizliği + `assert-no-synthetic-seal-data.mjs`.
9. `/basla` yasal kopya düzeltmesi.
10. Governance/release scriptleri + CI.

**Rollback:** seal özelliği kapatılabilir (`CBAM_SEAL_PACKAGE_V2_READY=false`, `PCF_SEAL_V2_READY=false`); güvensiz legacy yol geri getirilmez.

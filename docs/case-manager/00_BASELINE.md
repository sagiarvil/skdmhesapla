# Case Manager — Phase 0 Baseline

**Tarih:** 17 Ağustos 2026  
**Mandate:** `v1.0.0-CASE-MANAGER` §4  
**Repo:** `skdmhesapla` (`/Users/macair1/projects/skdm`)  
**Canlı:** https://skdmhesapla.com · Hosting target `skdmhesapla` · Firebase `carbon-web-1265b`  
**Kod değişikliği:** Yok (salt keşif)

> Bu dosya Case Manager geliştirmeden önceki regressyon dondurma haritasıdır.  
> Kaynak hiyerarşisi: RM-004 → RM-003 → RM-002 → RM-001 → AGENTS1 → AGENTS → mandate.

---

## 1. Framework ve versiyon

| Öğe | Değer |
|---|---|
| Paket adı | `skdmhesapla@1.0.0` |
| Next.js | `15.5.22` (App Router, `output: 'export'`) |
| React | `19.x` |
| Hosting | Firebase Hosting → `out/` static |
| Functions | Node 22, `europe-west3` (`functions/`) |
| Auth / DB | Firebase Auth + Firestore (`europe-west3`) |
| MoR / ödeme | Paddle (Plan 20; ajan dokunmaz — PLAN-AKTIF) |
| UI | Tailwind 3 + Manrope; tasarım: `docs/tasarim-rehberi.md` |

**npm scripts (mevcut):** `dev`, `build`, `typecheck`, `test:skdm`, `test:quality`, `lint:ci`, `generate:sitemap`, `deploy:site`, `deploy:api`, `deploy:live`, `onizleme`  
**Case Manager audit komutu:** henüz yok (`npm run skdm:case-manager-audit` Phase ileride).

---

## 2. Route listesi (App Router)

Public / yarı-public:

| Route | Not |
|---|---|
| `/` | Ana sayfa (marketing + karşılaştırma tablosu) |
| `/basla/` | GTİP arama + Kademe A sektör kartları + Kademe B hub |
| `/hesapla/[sector]/` | Tek `SkdmWizard` — 20 sektör slug (SSG) |
| `/rehber/`, `/sozluk/`, `/nasil-calisir/` | İçerik SSOT: `src/lib/skdm/content/*` |
| `/fiyatlandirma/`, `/dogrula/`, `/hakkinda/` | Ticari / mühür doğrulama / E-E-A-T |
| `/tedarikci-verisi/` (+ 4 alt) | Kademe B hub |
| `/giris/`, `/kayit/`, `/hesabim/`, `/admin/` | Auth + hesap + WIP admin |
| Hukuki | `/kullanim-kosullari/`, `/kvkk-aydinlatma/`, `/iade-politikasi/`, `/iletisim/` |

**Case Manager route’ları (`/case/*` vb.):** yok.

---

## 3. Wizard implementation

| Madde | Durum |
|---|---|
| Tek bileşen | `src/components/wizard/SkdmWizard.tsx` |
| Sektör girişi | `sectorSlug` prop → `SKDM_SECTORS` eşlemesi |
| Adımlar | `step` 0…10 (“Adım N / 10” + üstte 11 etiket: 0 Triyaj…10 Mühür) |
| Register | `RegisterTables.tsx` — G / P / B / E |
| FieldHelp | `FieldHelp.tsx` + `fields.json` |
| Hesap | `calculateSkdmLiability` (`calculator.ts`) |
| QC / mühür kapısı | `qc.ts` — D_Processes, E_PurchPrec, register core; `readinessScore === 100` |
| Paket | `createSealedAuditPackage` → 12 dosya ZIP (istemci) |
| Progress çelişkisi | Mandate §27: “Başlangıç · 1/11” vs “Adım 0/10” riski — UI’da adım 0–10 + 11 etiket |

**Sektöre özel kopyalanmış wizard dosyası:** yok  
`find` `*demir*|aluminyum|cimento…` → 0.  
`/hesapla/[sector]/page.tsx` yalnızca slug listesi + `<SkdmWizard />`.

**Kabul (§4):** “Aynı davranışın 6 farklı dosyada hard-coded wizard’ı” — **şu an yok**; merkezileştirme fırsatı config/FieldHelp/CN tarafında.

---

## 4. Sector-specific duplication

| Katman | Tek kaynak mı? | Not |
|---|---|---|
| Benchmark / scope2 | `config.ts` → `SKDM_SECTORS` | 20 sektör; Annex II flag’leri burada |
| CN örnekleri UI | `cnCodes[0]` basla kartlarında | Hard-coded range hissi (rehber + kart) |
| Lexicon | `src/data/gtip-kodlari.ts`, `skdm_product_cn_lexicon_2026.json` | Arama / sınıflandırma |
| Rehber CN özetleri | `content/rehber.ts` | `7201–7229` vb. metin olarak gömülü |
| Test fixture CN | `test-user-packages.ts`, hesabim/admin | Tekrarlayan string |

**Gap (mandate §5 / §74):** UI’da CN kapsam özeti SSOT `resolveScope(cn)` değil; presentation + content’te dağınık.

---

## 5. Firestore model

Kaynak: `docs/firestore-skdm-schema.md` + `session-store.ts` + `firestore.rules`.

| Koleksiyon | Rol | Case Manager uyumu |
|---|---|---|
| `skdm_sessions` | Taslak oturum (wizard draft) | En yakın “case” adayı — **phase/task/evidence yok** |
| `skdm_orders` | Paddle sipariş | Seal ödemesi |
| `skdm_sealed_packages` | Manifest / hash | Şema metni hâlâ “6 dosya” diyebilir — kod 12 |

**Canlı draft şekli (`SkdmSessionDraft`):**  
`sessionId`, `sectorSlug`, `step`, `triage`, `fieldValues`, `skippedFields`, G/P/B/E, `dProcesses`, `status: "draft"`.  
**Yok:** `intakeReason`, `companyProductRole`, `userWorkRole`, `tasks`, `evidence`, `rulesetVersion` snapshot (yalnız `engineHint`), `phase`.

---

## 6. Autosave sistemi

`session-store.ts` (G-22):

1. `localStorage` anında (`skdm_session_draft:{sectorSlug}`)  
2. Firestore `setDoc` merge (anon `ensureAnonymousUser`)  
3. Yedek `POST /api/skdm-sessions`

**Wizard:** draft değişikliklerinde `saveSessionDraft` (debounce ~10 sn bağlamı AGENTS/G-22).  
**Eksik (mandate §34–36):** field-level save UX (“Kaydediliyor”), version/optimistic concurrency, cross-tab conflict UI.

---

## 7. Authentication

- `src/lib/firebase/auth-context.tsx` — Google + e-posta; anon taslak için  
- `/giris/`, `/kayit/`, `/hesabim/`, `/admin/`  
- Header: oturum dropdown; tenant RBAC case entity’si henüz yok

---

## 8. Payment / sealing akışı

1. QC + `readinessScore === 100` → mühür UI açılır  
2. İstemci `createSealedAuditPackage` (12 dosya + STORE ZIP + SHA-256)  
3. Paddle son kapı (PLAN-AKTIF: kullanıcı; ajan dokunmaz)  
4. `functions` — `/api/seal` notu (Storage imzalı URL Paddle sonrası)  
5. `/dogrula/` — hash doğrulama konsolu  

**Idempotency / webhook double-charge:** Paddle katmanı kısmen; Case Manager stress ST-34/35 için genişletme gerekir.

---

## 9. FieldHelp kaynağı

| Dosya | Rol |
|---|---|
| `src/lib/skdm/fieldhelp/fields.json` | Tek SSOT (~28 field + columns + layers) |
| `index.ts` | `getField`, `layerFieldIds`, glossary bridge |
| `FieldHelp.tsx` | UI: what/where/who/consequence + mahsup kilit metni |

**Gap:** mandate §16 coverage gate yok; `delegationTemplate` / `whoHasIt` alanları kısmen dolu; “Bilmiyorum” → `skippedFields[]` (görev state machine yok).

---

## 10. CN / scope registry

| Kaynak | Kullanım |
|---|---|
| `SKDM_SECTORS` | Hesap + basla kartları |
| `gtip-kodlari.ts` | GtipArama anahtar kelime |
| `skdm_product_cn_lexicon_2026.json` | Geniş ürün→CN lexicon |
| Wizard G register | Kullanıcı CN girişi |

**Yok:** `resolveScope(cnCode, ruleset)` tek kapı; classification confidence / disambiguation config; belge extraction.

**Basla metin riski (§73):** “6 sektör dışındasınız → doğrudan SKDM kapsamında değilsiniz” benzeri Kademe B kartı — CN kontrolü olmadan hüküm hissi.

---

## 11. Package manifest

| Gerçek | Değer |
|---|---|
| Üretim | `package-seal.ts` + `PackageDownloads.SEALED_PACKAGE_FILES` |
| Sayı | **12** (`PLATFORM_STATS.fileCount`) — Kapsamlı Durum Raporu dahil |
| Test | `verify-sealed-package.mjs` 12 dosya + hash |
| Eski yorum | `package-seal.ts` üst yorumunda hâlâ “6 dosyalık” ifadesi |
| Fiyatlandirma UI | Kart listesi marketing 12’ye çekildi; eski claim metinleri (§76) duruyor |

---

## 12. Copy / content kaynakları

| Alan | Yol |
|---|---|
| Rehber / sözlük / nasıl çalışır | `src/lib/skdm/content/*.ts` |
| Nav / yasal / fiyat istatistik | `constants.ts` |
| SEO | `seo.ts`, `public/sitemap.xml`, `llms.txt` |
| Riskli marketing (§45–48, §76) | `/`, `/fiyatlandirma/` — danışmanlık 50–200k, “aynı gün”, “yalnızca sizde”, “256-Bit SSL” |

**Raw markdown link:** `rehber.ts` içinde `[TR-ETS](/sozluk/#tr-ets)` vb. — renderer’a bağlı (§44 audit gerekli).

---

## 13. Analytics

Production analytics SDK **yok** (gtag/plausible/posthog araması boş).  
Mandate §63 event şeması sıfırdan.

---

## 14. Test framework

| Katman | Durum |
|---|---|
| Unit / motor | `scripts/verify-skdm-calculator.mjs` (tsx) |
| Seal integrity | `verify-sealed-package.mjs` |
| Kapsamlı rapor hesap | `verify-kapsamli-durum-raporu.mjs` |
| Dil / claim lint | `scripts/ci-lint.mjs` |
| E2E / a11y / perf | `quality-gates.mjs` + geçici Playwright (`npm install --no-save`) |
| Vitest/Jest | Yok |
| FieldHelp / copy / stress matrix | Yok |

---

## 15. E2E framework

- Kalıcı Playwright bağımlılığı yok  
- `test:quality` canlı `BASE_URL` smoke  
- Case Manager persona E2E (P1–P7) ve ST-01…40: **yok**

---

## 16. Feature flag altyapısı

`caseManagerV2` / feature flag araması: **boş**.  
Rollback için minimal config switch eklenecek (mandate §53; yeni dependency yok).

---

## 17. RM / mandate doküman boşlukları

| Beklenen | Repo durumu |
|---|---|
| `docs/RM-001…004` | **Bulunamadı** (glob 0) |
| `AGENTS1.md` | Var (kök) |
| `docs/PLAN-AKTIF.md` | Plan 34 |
| `docs/skdmhesapla-com-ana-plan.md`, `teknik-iskelet.md`, `tasarim-rehberi.md`, `firestore-skdm-schema.md` | Var |

**Not:** Mandate §1 “kod yazmadan önce RM oku” — RM dosyaları repoda yoksa Phase 1+ için `BLOCKED_LEGAL_DECISION` veya RM’lerin `docs/` altına taşınması gerekir. Hesap/scope için mevcut kod + AGENTS1 + ana plan kullanılabilir; yeni hukuki yorum üretilmez.

---

## 18. Mevcut motor / kapı envanteri (reuse)

| Modül | Dosya | Case Manager karşılığı |
|---|---|---|
| Calculator | `calculator.ts` | Alt katman — dokunulmaz semantik |
| Annex II / TR-ETS | `config.ts` | Scope2 + mahsup pilot |
| QC gates | `qc.ts` | GatePresenter girdisi |
| Seal | `package-seal.ts`, `pdf/kapsamliDurumRaporu.ts` | Package registry |
| Readiness skoru | calculator checklist | ReadinessSnapshot’a genişletilecek |
| Session | `session-store.ts` | SkdmCase migration kaynağı |

---

## 19. Sector duplication planı (önizleme)

1. Wizard zaten tek — **koru**.  
2. CN/kapsam metinlerini `ScopePresentation` adapter + lexicon’tan üret.  
3. `rehber` / `basla` / sektör kartlarındaki hard-coded range’leri kaldır.  
4. `PLATFORM_STATS.fileCount` ↔ manifest assert CI.  
5. Marketing claim registry + copy auditor.

---

## 20. Phase 0 kabul kriteri

| Kriter | Sonuç |
|---|---|
| Repo haritası üretildi | ✓ bu dosya |
| 6× kopya wizard hard-code | Yok — OK |
| Kod değişikliği yok | ✓ |
| Sonraki faz kilidi | Phase 1: SSOT / scope presentation + copy registry; RM dosyaları eksikse hukuki içerik değişikliği blokeli |

---

## 21. Açık riskler (Phase 0)

1. **RM-001…004 dosyaları repoda yok** — mandate hiyerarşisi kısmen uygulanamaz.  
2. **Firestore şema dokümanı “6 dosya”** — kod 12; doküman drift.  
3. **Basla Kademe B “kapsamda değilsiniz”** dili CN’siz hüküm riski.  
4. **Marketing claim’ler** kanıtsız production’da.  
5. **Case domain yok** — task/evidence/intake sıfır; migration hedefi `skdm_sessions`.  
6. **Feature flag yok** — Case Manager V2 açılışı için önce minimal switch.  
7. **Progress çift sayım** wizard UX’te.  
8. **“Bilmiyorum”** = skip listesi, actionable task değil.

---

## 22. Geri dönüş

Phase 0 yalnız doküman → geri alma: bu dosyayı silmek yeterli.  
Sonraki fazlar `[R]` feature flag + additive schema ile planlanacak.

---

## Blocking karar

| ID | Konu | Durum |
|---|---|---|
| `BLOCKED_LEGAL_DOCS` | `docs/RM-001…004` repo’da yok | Phase 1 hukuki/copy SSOT için RM’lerin eklenmesi veya yol bildirimi gerekir |
| — | Paddle / fiyat | Mandate yetki vermez; dokunulmaz |

**Phase 0: COMPLETE.**  
Sonraki: Phase 1 — Tek gerçek kaynak normalizasyonu (scope presentation adapter + package/copy registry + fieldhelp coverage audit script) — RM dosyaları gelmeden yalnızca teknik SSOT ve audit iskeleti.

# SKDMHesapla PCF V1 — Entegrasyon Patch Haritası

Bu dosya mevcut `main` üzerinde kaynak dosyaları körlemesine değiştirmemek için hazırlanmıştır. Uygulanan semantik değişiklikler:

1. `src/app/basla/page.tsx` — Kademe B kartı ürün karbon raporu hunisine sadeleştirildi; CSRD/PPWR/EUDR listesi kaldırıldı; CTA `/karbon-raporu/`.
2. `src/lib/skdm/resolve-scope.ts` — `out_of_scope` ve `needs_cn_code` birincil/ikincil CTA `/karbon-raporu/`; `assertNoDeadEnd` bu yolu kontrol eder. CN kapsam matematiği değişmedi.
3. `src/components/GtipArama.tsx` — belirsiz ürün kartı `/karbon-raporu/`.
4. `src/app/hesapla/[sector]/page.tsx` — Kademe A `SkdmWizard`; A dışı `PcfWizard` (Suspense).
5. `src/app/tedarikci-verisi/hazirla/page.tsx` — kanonik taşıma; Firebase 301.
6. `src/lib/skdm/fieldhelp/fields.json` — PCF alanları merge; CBAM kayıtları silinmedi.
7. `package.json` — `test:pcf`, `test:pcf:release`; `test:engine` PCF core içerir.
8. `data/seo/registry.json` — `/karbon-raporu/` indexable; `/tedarikci-verisi/hazirla/` REDIRECTED.
9. Legacy TKD (`tedarikciKarbonDosyasi.ts`) ilk sürümde durur; yeni PCF import etmez.

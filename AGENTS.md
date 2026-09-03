# SKDMHesapla — ajan kuralları

## Canonical SEO / GEO / LLMS mandate — zorunlu

Her SEO, GEO, AEO, LLMS, sitemap, robots, canonical, structured-data, search-content, internal-link, redirect veya search-measurement değişikliğinden önce `SAGIARVIL_SEARCH_REVENUE_OS_MANDATE.md` tamamen okunur.

Bu kapsamlarda `SAGIARVIL_SEARCH_REVENUE_OS_MANDATE.md` tek kanonik Search Revenue mandate'idir ve eski SEO/GEO/LLMS talimat belgelerinin yerini alır. Runtime `robots.txt`, sitemap üreteçleri/dosyaları, `llms.txt`, `llms-full.txt`, `/llms/**`, schema kodu ve mevzuat/source verileri operasyonel kaynaklardır; silinecek eski talimat belgesi sayılmaz.

Kullanıcının en güncel açık talebi en üst otoritedir. SKDM hesap motoru, resmî mevzuat/source-of-truth, güvenlik ve ürün gerçekliği kendi alanlarında korunur; Search mandate bunları uyduramaz veya ezemez.

## Her oturum — zorunlu

1. **`AGENTS1.md`** (her zaman) — davranış, genel mandate hiyerarşisi, sert kurallar  
2. **`SAGIARVIL_SEARCH_REVENUE_OS_MANDATE.md`** — SEO/GEO/AEO/LLMS/search scope varsa zorunlu ve bu scope'ta tek yetkili mandate  
3. **`DESIGN.md`** — kullanıcıya görünen UI, responsive, component, güven ve conversion sözleşmesi  
4. `docs/PLAN-AKTIF.md` (Plan 34)  
5. `docs/skdmhesapla-com-ana-plan.md`  
6. `docs/teknik-iskelet.md`  
7. `docs/firestore-skdm-schema.md`  
8. `docs/tasarim-rehberi.md`  

Çelişki: kullanıcının en güncel talebi > SEO/GEO/AEO/LLMS/search scope'ta `SAGIARVIL_SEARCH_REVENUE_OS_MANDATE.md` > kendi alanlarında resmî mevzuat/runtime source-of-truth > genel davranışta `AGENTS1.md` + RM-001…004 > görsel scope'ta `DESIGN.md` > bu dosyanın operasyon maddeleri. `docs/tasarim-rehberi.md` ve `src/app/globals.css`, `DESIGN.md` ile birlikte güncel görsel uygulama kaynağıdır.

## Operasyon kilitleri

- Kök: bu repo (`skdm/`). Hakem ağaç: `docs/teknik-iskelet.md` (Plan 20).
- Plan numarası yalnız içerik değişince artar (`docs/skdmhesapla-com-ana-plan.md` Ek C); tek aktif işaret: `docs/PLAN-AKTIF.md`.
- Plan 20 odak: mühürlü ZIP (6 dosya + SHA-256); Paddle son kapı (Ek E).
- Hosting target **yalnızca** `skdmhesapla`. `karbonhesapla` kullanma.
- Animasyonlu logo: yalnız `<img>` (next/image GIF dondurur).
- Zemin: yalnız `public/desen/guilloche-mesh-{acik,koyu}.svg` (Plan 20 §6.3); `pasaport-zemin-*.webp` arşiv.
- FieldHelp tek kaynak: `src/lib/skdm/fieldhelp/fields.json`.
- Motor deterministik; ETS fiyatı ruleset’ten; elektrik/hidrojen de minimis dışı.
- UI Türkçe; “danışmanlık / garantili uyum / resmi onay” dili yok.
- Bağımlılık ekleme / kırıcı API değişikliği: önce onay.
- Minimum token; Enterprise tamamlık; sitemap/llm.txt görev bitince güncelle.
- UI/CSS/layout/component değişikliklerinde `DESIGN.md` zorunludur; dış referans yalnız bilgi mimarisi/kompozisyon/etkileşim için kullanılır, başka markanın görsel kimliği kopyalanmaz.

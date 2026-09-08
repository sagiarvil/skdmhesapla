# SKDMHesapla — ajan kuralları

## Her oturum — zorunlu

1. **`AGENTS1.md`** (her zaman) — davranış, mandate hiyerarşisi, sert kurallar  
2. **`DESIGN.md`** — kullanıcıya görünen UI, responsive, component, güven ve conversion sözleşmesi  
3. `docs/PLAN-AKTIF.md` (Plan 34)  
4. `docs/skdmhesapla-com-ana-plan.md`  
5. `docs/teknik-iskelet.md`  
6. `docs/firestore-skdm-schema.md`  
7. `docs/tasarim-rehberi.md`  

Çelişki: `AGENTS1.md` + RM-001…004 > `DESIGN.md` > bu dosyanın operasyon maddeleri. `docs/tasarim-rehberi.md` ve `src/app/globals.css`, `DESIGN.md` ile birlikte güncel görsel uygulama kaynağıdır.

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
- "TAM CANLIYA AL" dendiğinde: Canlı dağıtım öncesinde veya sürecinde üretilen/değişen tüm dosyalar (SEO baseline, sitemap, hash'ler, kodlar) mutlaka commit edilmelidir; dağıtım commit atılmadan ve çalışma ağacı temizlenmeden tamamlanmış sayılmaz.
- UI/CSS/layout/component değişikliklerinde `DESIGN.md` zorunludur; dış referans yalnız bilgi mimarisi/kompozisyon/etkileşim için kullanılır, başka markanın görsel kimliği kopyalanmaz.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

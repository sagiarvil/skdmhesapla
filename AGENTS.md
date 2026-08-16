# SKDMHesapla — ajan kuralları

## Her oturum — zorunlu

1. **`AGENTS1.md`** (her zaman) — davranış, mandate hiyerarşisi, sert kurallar  
2. `docs/PLAN-AKTIF.md` (Plan 29)  
3. `docs/skdmhesapla-com-ana-plan.md`  
4. `docs/teknik-iskelet.md`  
5. `docs/firestore-skdm-schema.md`  
6. `docs/tasarim-rehberi.md`  

Çelişki: `AGENTS1.md` + RM-001…004 > bu dosyanın operasyon maddeleri.

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

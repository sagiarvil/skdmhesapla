# Aktif plan — SKDMHesapla

**Sürüm:** Plan (28) — 16 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (28)/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 28 / Plan 23 — cimpactpro Manrope Font & Phosphor Duotone İkonlar)

- **Tipografi:** Google Fonts Manrope (200–800) entegre edildi (`src/app/layout.tsx`).
- **Ölçek:** cimpactpro tipografi skalası (17px gövde, clamp'li başlıklar, 1200px max-genişlik) `globals.css`'e uygulandı.
- **İkonlar:** `@phosphor-icons/react` kuruldu; `/basla/` sayfasında `weight="duotone"` premium ikon seti aktif edildi.

## Canlı durum

| Madde | Durum |
|---|---|
| Manrope fontu (`src/app/layout.tsx`) | ✓ |
| Phosphor Duotone İkonlar (`/basla/`) | ✓ |
| Sihirbaz 10 katman + QC mühür | ✓ |
| Mühür ZIP 6 dosya + registers + `/api/seal` | ✓ |
| Ek F tek fiyat 9.900 ₺ (reseal UI’da yok, llms.txt temiz) | ✓ |
| Ücretsiz rozet (hero) | ✓ |
| Aydınlık ferah Hero + Lüks Arama Konsolu | ✓ |
| `/basla/` (GTİP arama + Kademe A & B) | ✓ (200 OK) |
| `/dogrula/` (Mühür & SHA-256 doğrulama) | ✓ (200 OK) |
| `/sozluk/` (Sözlük v3 + Türkçe/İngilizce anlık arama) | ✓ (200 OK) |
| `/rehber/` (Rehber + anlık arama + data-ara) | ✓ (200 OK) |
| `/fiyatlandirma/` (Ultra-premium 6 dosya dökümlü) | ✓ (200 OK) |
| Alt sayfalarda tek satır ince pro footer | ✓ |
| CI Linter (`npm run lint:ci`) | ✓ 0 hata |
| Ek H Anlık Sayaçlı Deploy Motoru (`npm run deploy:live`) | ✓ Aktif |

## Sıradaki İşler

- **Ek E §4 — Paddle** (kullanıcı yapacak; bu ajan dokunmaz).
- Storage imzalı indirme URL’si (Paddle sonrası).

## Kanıt & Canlıya Alma

```bash
npm run typecheck && npm run build && firebase deploy --only hosting:skdmhesapla
git add -A && git commit -m "Manrope + cimpactpro olcegi + Phosphor ikonlar"
```

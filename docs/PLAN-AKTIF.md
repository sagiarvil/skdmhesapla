# Aktif plan — SKDMHesapla

**Sürüm:** Plan (27) — 16 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (27)/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 27 — Tek Kolon Hero & Belirgin Arama)

Ana sayfa `src/app/page.tsx` Plan 27 (`ana-sayfa-yeni-page.tsx`) ile yenilendi:
- Tek kolonlu, odaklanmış ve okunaklı Hero tasarımı.
- Hero içinde doğrudan çalışan büyük `<GtipArama />` arama kutusu.
- 3 adım özeti (1-Ürününüzü seçin, 2-Adımları izleyin, 3-Dosyanızı mühürleyin).
- Bölünmeyen, ekran altına yerleşen temiz kurdele şeridi.

## Canlı durum

| Madde | Durum |
|---|---|
| Sihirbaz 10 katman + QC mühür | ✓ |
| Mühür ZIP 6 dosya + registers + `/api/seal` | ✓ |
| Ek F tek fiyat 9.900 ₺ (reseal UI’da yok, llms.txt temiz) | ✓ |
| Ücretsiz rozet (hero) | ✓ |
| Tek kolon Hero + Ana sayfa GtipArama (Plan 27) | ✓ |
| `/basla/` (GTİP arama + Kademe A & B) | ✓ (200 OK) |
| `/dogrula/` (Mühür & SHA-256 doğrulama) | ✓ (200 OK) |
| `/sozluk/` (Sözlük v3 + Türkçe/İngilizce anlık arama) | ✓ (200 OK) |
| `/rehber/` (Rehber + anlık arama + data-ara) | ✓ (200 OK) |
| Mahsup alanı TR-ETS sabit açıklaması (Ek G §15) | ✓ |
| CI Linter (`npm run lint:ci`) | ✓ 0 hata |
| Ek H Anlık Sayaçlı Deploy Motoru (`npm run deploy:live`) | ✓ Aktif |
| Ek G Blueprint Kabulü (Mimari + TR Katmanları + Direktifler) | ✓ Aktif |

## Sıradaki İşler

- **Ek E §4 — Paddle** (kullanıcı yapacak; bu ajan dokunmaz).
- Storage imzalı indirme URL’si (Paddle sonrası).

## Kanıt & Canlıya Alma

```bash
git add -A && git commit -m "Ana sayfa: tek kolon hero + belirgin arama"
npm run build
firebase deploy --only hosting:skdmhesapla
```

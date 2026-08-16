# Aktif plan — SKDMHesapla

**Sürüm:** Plan (26) — 16 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (26)/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Canlı durum

| Madde | Durum |
|---|---|
| Sihirbaz 10 katman + QC mühür | ✓ |
| Mühür ZIP 6 dosya + registers + `/api/seal` | ✓ |
| Ek F tek fiyat 9.900 ₺ (reseal UI’da yok, llms.txt temiz) | ✓ |
| Ücretsiz rozet (hero) | ✓ |
| Hero "7 adımlık" temizliği (0 eşleşme) | ✓ |
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
# Canlı sayaç ile dağıtım:
npm run deploy:live

# Veya standart zincir:
npm run lint:ci && npm run typecheck && npm run test:skdm && npm run build
firebase deploy --only hosting:skdmhesapla,functions,firestore,storage --force
BASE_URL=https://skdmhesapla.com npm run test:quality
```

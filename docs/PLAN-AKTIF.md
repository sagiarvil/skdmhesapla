# Aktif plan — SKDMHesapla

**Sürüm:** Plan (29) — 17 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (29)/` & `gtip-ek/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 29 — Claude Kritik Düzeltmeler & Akıllı GTİP/CN Motoru)

- **Alüminyum Kapsam 2 Düzeltmesi:** Annex II mevzuatı uyarınca alüminyumda yalnızca doğrudan emisyonların fiyatlandırıldığı kuralı işletildi; `config.ts` alüminyum tanımı ve `scope2DefaultApplicable: false` olarak güncellendi.
- **Dosya Paketi Düzeltmesi:** "6 resmi dosya" iddiaları temizlendi; 11 dosyalık gerçek denetim paketi listesine geçildi.
- **AI-Koku Temizliği:** Jargon çipleri, numaralı adımlar ve yapay rozetler kaldırıldı; yerine insan diliyle yazılmış "Süreç sandığınızdan kısa" bölümü ve Barış Bağırlar imzalı kurucu notu eklendi.
- **Header & Footer:** Header butonu "Hemen Başla" yapıldı; footer düz kenar çizgisine bağlandı ve `🛡️ Doğrula` linki korundu.
- **Akıllı Arama Motoru:** 80 ürün intenti, 813 alias, Generic Query Guard ve Disambiguation (Ayırt Edici Sorular) motoru devrede.

## Canlı durum

| Madde | Durum |
|---|---|
| Alüminyum Kapsam 2 düzeltmesi (Annex II) | ✓ |
| 11 Doğrulama Dosyası Paketi (/fiyatlandirma/) | ✓ |
| Kurucu Notu & Saf İkna Ana Sayfası (v4) | ✓ |
| Akıllı GTİP/CN Motoru (80 intent, 813 alias) | ✓ |
| Header "Hemen Başla" | ✓ |
| Manrope fontu (`src/app/layout.tsx`) | ✓ |
| Phosphor Duotone İkonlar (`/basla/`) | ✓ |
| Mühür ZIP + registers + `/api/seal` | ✓ |
| Ek F tek fiyat 9.900 ₺ (reseal UI’da yok) | ✓ |
| `/basla/` (GTİP arama + Kademe A & B) | ✓ (200 OK) |
| `/dogrula/` (Mühür & SHA-256 doğrulama) | ✓ (200 OK) |
| `/sozluk/` (Sözlük v3 + Türkçe/İngilizce arama + id çapaları) | ✓ (200 OK) |
| `/rehber/` (Rehber + Karar Ağacı + data-ara) | ✓ (200 OK) |
| `/fiyatlandirma/` (11 dosya dökümlü) | ✓ (200 OK) |
| CI Linter (`npm run lint:ci`) | ✓ 0 hata |

## Sıradaki İşler

- **Ek E §4 — Paddle** (kullanıcı yapacak; bu ajan dokunmaz).
- Storage imzalı indirme URL’si (Paddle sonrası).

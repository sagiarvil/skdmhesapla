# Aktif plan — SKDMHesapla

**Sürüm:** Plan (34) — 17 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (34)/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 34 — Tek Doğruluk Kaynağı, /basla/ Hub Kartı & Sürüm Eşitlemesi)

- **Tek Doğruluk Kaynağı (`constants.ts`):** Yasal kimlik (`CimetricaOne - VKN 25403091318`), e-posta ve tüm menü linkleri `src/lib/skdm/constants.ts` dosyasında merkezi olarak tanımlandı. Tüm sayfalar ve footer'lar doğrudan buradan besleniyor.
- **Tek Sütun & Sağ Panel Temizliği:** Sağ panel tamamen kaldırıldı. Kullanıcı bölünmeden, tek sütun ortalanmış Claude okuma ritminde ilerliyor. Eksikler yalnızca son adımda (özet/mühür) *"Mühürlemeden önce şunlar tamamlanmalı"* olarak insan diliyle sunuluyor.
- **/basla/ Konsolu Revizyonu:** Kademe B için 14 ölü link yerine, doğrudan `/tedarikci-verisi/` hub sayfasına yönlendiren zengin ve açıklayıcı tek bir kurumsal kart yerleştirildi.
- **Demir-Çelik ve Tüm Sektörler:** 20 sektörün tamamı (`demir-celik` dahil) aynı 11 adımlı, triyajlı, kağıt zeminli `SkdmWizard` bileşenini kullanmaktadır.

## Canlı durum

| Madde | Durum |
|---|---|
| Tek Doğruluk Kaynağı (`constants.ts`) | ✓ |
| /basla/ Tedarikçi Veri Merkezi Hub Kartı | ✓ |
| SkdmWizard v3 (Tek Sütun, Sade Düzen) | ✓ |
| 20 Sektör Statik Rotası (`/hesapla/...`) | ✓ |
| Kademe B ISO 14067 Uyarı Bandı | ✓ |
| Sözlük Vergi Değildir Maddesi (`#vergi-degil`) | ✓ |
| CimetricaOne - VKN 25403091318 Künye & Footer | ✓ |
| İç Çerçeve Çizgisi Koruması (Safari/Chrome) | ✓ |
| Sade & İkna Edici Hero (v4) | ✓ |
| Akıllı GTİP/CN Motoru (80 intent, 813 alias) | ✓ |
| Tedarikçi Veri Merkezi (`/tedarikci-verisi/`) | ✓ |
| 4 Pillar Mevzuat Sayfası (CSRD, PPWR, Pil, EUDR) | ✓ |
| Alüminyum Kapsam 2 düzeltmesi (Annex II) | ✓ |
| 11 Doğrulama Dosyası Paketi (/fiyatlandirma/) | ✓ |
| Mühür Doğrulama Konsolu (/dogrula/) | ✓ |
| Zero AI / Sober Enterprise Tipografi | ✓ |
| CI Linter (`npm run lint:ci`) | ✓ 0 hata |

## Sıradaki İşler

- **Ek E §4 — Paddle** (kullanıcı yapacak; bu ajan dokunmaz).
- Storage imzalı indirme URL’si (Paddle sonrası).

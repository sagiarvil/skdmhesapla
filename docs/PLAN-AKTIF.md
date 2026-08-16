# Aktif plan — SKDMHesapla

**Sürüm:** Plan (34) — 17 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (34)/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 34 — Tek Sütun Sade Düzen, Sağ Panel & Doluluk Skoru Temizliği)

- **Tek Sütun & Sağ Panel Temizliği:** Sağ panel tamamen kaldırıldı. Kullanıcı her adımda bölünmeden, Claude okuma ritminde tek sütun olarak akışta ilerliyor. Eksikler yalnızca son adımda (özet/mühür) *"Mühürlemeden önce şunlar tamamlanmalı"* olarak insan diliyle sunuluyor.
- **Doluluk Skoru Kaldırıldı:** Boş formda yanıltıcı ve gürültü yaratan doluluk skoru kartı kaldırıldı; ilerleme saf ve zarif ince adım şeritleriyle gösteriliyor.
- **Ham Kodlar Temizlendi:** `B_STREAM_MISSING` gibi teknik kodlar yerine doğrudan anlaşılır Türkçe açıklamalar getirildi.
- **Mühürleme Taahhüdü:** *"Aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir."*

## Canlı durum

| Madde | Durum |
|---|---|
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

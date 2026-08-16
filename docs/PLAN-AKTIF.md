# Aktif plan — SKDMHesapla

**Sürüm:** Plan (31) — 17 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (31)/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 31 — /basla/ 360° Deneyim, 20 Sektör Rotası & Kademe B ISO 14067 Bandı)

- **20 Sektör Prerender & TR Slug Uyumu:** `hesapla/[sector]/page.tsx` rotası 20 sektör için dinamik ve statik olarak üretildi (`generateStaticParams`). 404 hataları giderildi.
- **Kademe B ISO 14067 Uyarısı:** Kademe B sektörlerinde (batarya, ambalaj, plastik, kimya vb.) sihirbaz başlığında *"Tedarikçi veri dosyası (ISO 14067)"* ibaresi ve *"Bu sektör SKDM kapsamında değildir. Çıktınız bir SKDM raporu olmayacak..."* resmi uyarı bandı devreye alındı.
- **Hazırlık Skoru Kapısı:** Gerçek kullanıcı verisi girilmeden önce sihirbaz skorunda yapay rakamlar yerine `—` ve `%0` gösterimi sağlandı.
- **Sözlük Netleştirmesi:** *"SKDM bir vergi değildir"* maddesi A-Z sözlüğe eklendi.
- **Tüm AI / LLM Kalıntılarının Temizlenmesi:** Sitedeki tüm yapay `Sparkles` ikonları ve şablonik hap rozetleri sıfırlandı; Enterprise seviyesinde sober kurumsal üst kategori etiketlerine dönüştürüldü.

## Canlı durum

| Madde | Durum |
|---|---|
| 20 Sektör Statik Rotası (`/hesapla/...`) | ✓ |
| Kademe B ISO 14067 Uyarı Bandı | ✓ |
| Hazırlık Skoru Gerçek Veri Kapısı | ✓ |
| Sözlük Vergi Değildir Maddesi (`#vergi-degil`) | ✓ |
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

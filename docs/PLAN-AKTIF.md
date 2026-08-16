# Aktif plan — SKDMHesapla

**Sürüm:** Plan (30) — 17 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (30)/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 30 — İç Çerçeve Çizgisi Koruması, Sade Hero & Metin Denetimi)

- **İç Çerçeve Çizgisi Temizliği:** Safari ve Chromium tarayıcılarında input alanlarının etrafına çizilen varsayılan iç kenar çizgisi `outline: none`, `boxShadow: none`, `border: none` korumasıyla `GtipArama.tsx` ve `IcerikArama.tsx` bileşenlerinde tek noktadan kalıcı olarak sıfırlandı.
- **Hero Başlığı ve Metni:** Sadeleştirildi: *"AB'ye ihracat yapıyorsanız, SKDM (CBAM) dosyanız hazır olmalı."* ve *"Ürününüzü yazın, sertifika maliyetinizi görün ve denetime hazır dosyanızı kendiniz hazırlayın — danışmana gerek kalmadan."*
- **360° Metin Denetimi:** Yapay, LLM kokan ve abartılı ifadeler temizlendi; doğal, profesyonel kurumsal Türkçeye geçirildi.

## Canlı durum

| Madde | Durum |
|---|---|
| İç Çerçeve Çizgisi Koruması (Safari/Chrome) | ✓ |
| Sade & İkna Edici Hero (v4) | ✓ |
| Akıllı GTİP/CN Motoru (80 intent, 813 alias) | ✓ |
| Tedarikçi Veri Merkezi (`/tedarikci-verisi/`) | ✓ |
| 4 Pillar Mevzuat Sayfası (CSRD, PPWR, Pil, EUDR) | ✓ |
| Alüminyum Kapsam 2 düzeltmesi (Annex II) | ✓ |
| 11 Doğrulama Dosyası Paketi (/fiyatlandirma/) | ✓ |
| Kurucu Notu (Barış Bağırlar) | ✓ |
| CI Linter (`npm run lint:ci`) | ✓ 0 hata |

## Sıradaki İşler

- **Ek E §4 — Paddle** (kullanıcı yapacak; bu ajan dokunmaz).
- Storage imzalı indirme URL’si (Paddle sonrası).

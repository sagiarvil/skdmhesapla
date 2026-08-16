# Aktif plan — SKDMHesapla

**Sürüm:** Plan (33) — 17 Ağustos 2026  
**Kaynak klasör:** `Kimi_Agent_SKDM Planı (33)/`  
**Hosting:** `skdmhesapla` · https://skdmhesapla.com  

> Ek C/D/E/F/G/H bağlayıcı. Tek gerçek kaynak: bu dosya.

## Not (Plan 33 — Sihirbaz: İnsan Dili, Claude Teması & Kusursuz Mühür Akışı)

- **Doğal İnsan Dili:** *"A.4(a) Mal kategorileri"* yerine *"Ne satıyorsunuz?"*, *"B_EmInst Kaynak akışları"* yerine *"Fabrikanız neyle çalışıyor?"*, kontrol denkliğinde *"X ton'un nereye gittiği belirsiz — ihracat, fabrika içi kullanım veya stok kalemlerinden birine eklemeniz gerekebilir"* formatına geçildi.
- **Tek CTA Dili:** *"Devam edelim →"*, *"← Geri"*, *"Özete geçelim →"*.
- **Claude Renk Paleti:** Kağıt zemin (`#FBF9F4`), mürekkep (`#2B2A24`), zeytin yeşili (`#4E5F35`), kil vurgusu (`#BD6A3E`) ve ince adım şeritleri.
- **Mühürleme Taahhüdü:** Geliştirici notları temizlendi; yerine resmi kurumsal garanti yazıldı: *"aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir."*
- **Korunan Altyapı:** 10 katman, B_EmInst register tabloları, FieldHelp beşlisi, QC kapıları, deterministik mühürleme, otomatik taslak kaydı, Kademe B ISO 14067 bandı, 20 Türkçe slug ve gerçek girdi skor kapısı (`hasRealInput`).

## Canlı durum

| Madde | Durum |
|---|---|
| Yeni SkdmWizard v2 (İnsan Dili + Claude Paleti) | ✓ |
| 20 Sektör Statik Rotası (`/hesapla/...`) | ✓ |
| Kademe B ISO 14067 Uyarı Bandı | ✓ |
| Hazırlık Skoru Gerçek Veri Kapısı | ✓ |
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

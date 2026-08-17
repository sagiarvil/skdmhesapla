# PLAN 29 — Sözlük + Rehber Mega-Genişletme ve Dizin Yapısı

## Amaç
/sozluk/ ve /rehber sayfalarını CBAM/SKDM konusunda hiçbir soru işareti bırakmayacak
kapsama çıkarmak; iki sayfayı da arama kutusu + dizin (index) yapısına kavuşturmak.
Sizin yaptığınız tasarım değişiklikleri (zemin renkleri, kart sınıfları, tipografi,
GeriLink, alt CTA) birebir korunmuştur — sadece içerik kaynağı ve dizin bloğu değişti.

## Dosya eşleşmesi (4 dosya)

| Teslim dosyası | Repodaki hedef | İşlem |
|---|---|---|
| yeni-sozluk-icerik.ts | src/lib/skdm/content/sozluk.ts | Üzerine yaz (yeni dosya) |
| yeni-sozluk-page.tsx | src/app/sozluk/page.tsx | Üzerine yaz |
| yeni-rehber-icerik.ts | src/lib/skdm/content/rehber.ts | Üzerine yaz |
| yeni-rehber-page.tsx | src/app/rehber/page.tsx | Üzerine yaz |

## Ne değişti

### Sözlük (src/lib/skdm/content/sozluk.ts)
- Yeni veri modeli: `SozlukTerim { id, en, tr, tanim, nerede, kategori }`
- 11 kategori: Temel kavramlar, Taraflar, Emisyon hesabı, Resmi şablon,
  Sertifika ve fiyat, Doğrulama, Gümrük ve ticaret, Çelik özel,
  Mevzuat referansları, Türkiye, Yeşil iddialar
- ~55 terim; her terimde İngilizce karşılık + Türkçe tanım + "Nerede kullanılır"
- Dışa aktarım: `SOZLUK_KATEGORILERI` + `SOZLUK_TERIMLERI_FINAL`
- ID'ler rehberin derin bağlantılarıyla birebir uyumlu
  (#kontrol-denkligi, #accredited-verifier, #importer, #muhur, #cbam, #de-minimis vb.)

### Sözlük sayfası (src/app/sozluk/page.tsx)
- Tamamen veri güdümlü: içerik dosyadan gelir, JSX'te tek tek terim yok
- Arama kutusu (IcerikArama) aynen korunuyor
- Yeni: kategori dizini (chip nav) → #kat-{id} bağlantıları
- Kart sınıfı birebir sizin mevcut sınıfınız; "Nerede kullanılır" chip'i korunuyor
- Sonda "Aradığınız terim yok mu?" bloğu

### Rehber içeriği (src/lib/skdm/content/rehber.ts)
- Mevcut 7 bölüm kelimesi kelimesine korunuyor
- Yeni BÖLÜM 8–14:
  - BÖLÜM 8 — Sertifika takvimi: gerçek yayımlanmış fiyatlar
    (2026 Q1: 75,36 €/tCO₂e — 7 Nis 2026; Q2: 75,28 € — 6 Tem 2026;
    Q3: 5 Eki 2026'da, Q4: 4 Oca 2027'de açıklanacak), satış başlangıcı 1 Şub 2027,
    üç aylık ≥%50 elde bulundurma, ilk beyan 30 Eyl 2027
  - BÖLÜM 9 — Yetkili beyan sahibi ve Registry (Madde 27A üçüncü ülke işletmeci bölümü)
  - BÖLÜM 10 — Varsayılan değerler ve mark-up tablosu
    (çelik/çimento/alüminyum/hidrojen: 2026 +%10, 2027 +%20, 2028+ +%30; gübre sabit +%1)
  - BÖLÜM 11 — Cezalar (100 €/ton, beyan yükümlülüğü, kaçakçılık önlemleri)
  - BÖLÜM 12 — Mahsup ve TR-ETS (pilot dönem %100 ücretsiz tahsis → mahsup 0)
  - BÖLÜM 13 — 2028 kapsam genişlemesi (~180 alt ürün, makine/otomotiv)
  - BÖLÜM 14 — 14 soruluk hızlı SSS
- Yeni dışa aktarım: `REHBER_SECTIONS_ALL` (eski + yeni birleşik);
  eski `REHBER_SECTIONS` export'u da duruyor, başka sayfa import'u bozulmaz

### Rehber sayfası (src/app/rehber/page.tsx)
- Import: `REHBER_SECTIONS_ALL as REHBER_SECTIONS` (tek satır değişiklik etkisi)
- Yeni: "Rehber Dizini" nav bloğu (arama kutusunun hemen altında, 2 sütunlu
  numaralı bağlantılar) — tasarım kart diliyle uyumlu
- RichText, kart sınıfları, Öncelikli Rota rozeti, alt CTA: birebir aynı

## Uygulama adımları
1. 4 dosyayı tablodaki hedeflere kopyalayın.
2. `npm run build` — TypeScript hatası beklenmez; olursa ilk hata satırını iletin.
3. `firebase deploy` (veya mevcut dağıtım komutunuz).
4. Commit + push:
   `git add -A && git commit -m "Plan 29: sözlük + rehber mega-genişletme ve dizin" && git push`

## Doğrulama (canlıda)
- https://skdmhesapla.com/sozluk/ → kategori dizini görünür, ~55 terim kartı,
  arama kutusunda "mark-up" yazınca ilgili kart filtrelenir
- https://skdmhesapla.com/rehber → Rehber Dizini görünür, BÖLÜM 8–14 sayfada,
  dizindeki bağlantılar doğru bölüme kayar
- /sozluk/#kontrol-denkligi ve /sozluk/#accredited-verifier bağlantıları
  rehberden gelince doğru karta iner

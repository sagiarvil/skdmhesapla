# SKDMHesapla.com — Tasarım Rehberi (Design System v1)

**Sürüm:** 1.0 — 16 Ağustos 2026
**Hazırlayan rol:** Principal Architect & Design Lead
**Referans stil:** cimpactpro.com (kurumsal karbon yazılımı dili) — arka plan, ölçülendirme, ikon/emoji tarzı modellenmiştir
**Logo:** Kullanıcının yüklediği animasyonlu GIF (485×485, 129 kare) — koyu zeytin zeminde fıstık yeşili elmas mozaiği

---

## 1. Logo Kullanım Kuralları

**Temel karar (revize):** Logo opak koyu zeytin (`#213110`) zeminli olduğundan, logonun göründüğü her yüzey aynı renk olur — logo "eriyerek" oturur, renk tutarsızlığı kökten ortadan kalkar. Bunun anlamı: **header, hero ve footer aynı koyu zeytin zemini paylaşır** ve logo bu yüzeylerde animasyonlu GIF olarak çalışır.

Logo üç varyant olarak projeye konur:

| Dosya | Boyut | Kullanım |
|---|---|---|
| `skdm-logo-header-120.gif` (277 KB) | 120×120 | **Header (animasyonlu)** — 44 px görünür yükseklikte, retina için 120px kaynak |
| `skdm-logo-animasyonlu-240.gif` (916 KB) | 240×240 | Hero/ana vitrin, 128–160 px, `loading="lazy"` |
| `skdm-logo-statik.png` (ilk kare) | 485×485 | Favicon kaynağı, PDF rapor kapakları, e-posta, OG image, `prefers-reduced-motion` fallback'i |

**Kurallar:**
1. Logo yalnızca **`#213110` (brand-900) zeminli yüzeylerde** görünür: header, hero, footer. Bu üç yüzey aynı zemini paylaştığı için logo her yerde kesintisiz erir.
2. Açık zeminde logo **hiç kullanılmaz** — metin wordmark ("SKDMHesapla", ink-900) yeterlidir. Rapor PDF'lerinde kapak bandı brand-900 yapılır, logo oraya eriyerek konur.
3. Header'da animasyonlu GIF 44 px; performans için 120px kaynak + `decoding="async"`. Animasyon header'da dikkat dağıtıcı düzeye çıkarsa GIF'in yalnızca ilk 1 döngüsü oynatılıp statik karede durması tercih edilir (CSS/JS ile kontrol gerekmez; kaynak dosya loop'a ayarlıdır — rahatsız edici bulunursa statik PNG'ye düşülür, karar kullanıcı testiyle).
4. `prefers-reduced-motion: reduce` altında her yerde statik PNG.
5. Favicon: statik PNG'den 32/16 px.

## 1A. Renk Tutarlılığı Kuralı (değişmez)

1. **Tek doğruluk kaynağı token'lardır.** Kodda hiçbir yerde ad-hoc hex yazılmaz; her renk `tailwind.config.ts` token'ından gelir. Code review'da token dışı hex = red.
2. **Koyu yüzeyler tek renktir:** header + hero + footer = `brand-900` (hero'da izin verilen tek sapma: `brand-900 → brand-800` yumuşak degrade).
3. **Açık yüzeyler tek ritimdedir:** `bg-base (#ffffff)` ↔ `bg-soft degrade` dönüşümü; arada üçüncü bir zemin rengi üretilmez.
4. **Vurgu tek elden:** birincil vurgu `brand-500` (fıstık); teal/green/yellow yalnızca Bölüm 2.2'deki rollerinde.
5. OG image, e-posta şablonu, PDF kapakları ve Paddle checkout brand ayarları da bu paletten beslenir — marka her temas noktasında aynı görünür.

---

## 2. Renk Sistemi (logo ↔ cimpactpro dengeli)

### 2.1 Marka çekirdeği (logodan türetilmiş)

| Token | Hex | Kullanım |
|---|---|---|
| `--brand-900` | `#213110` | Koyu zeytin — hero/footer zemini, logo karosu, koyu zemin üstü metinlerin kontrastı |
| `--brand-800` | `#2c3f18` | Koyu zemin varyantı (kart, hover) |
| `--brand-500` | `#bdd652` | Fıstık yeşili — birincil CTA zemini (üstüne `#213110` metin), vurgu çizgileri, skor halkası |
| `--brand-100` | `#f0f6da` | Açık fıstık tinti — başarı durumu zemini, badge zemini |

### 2.2 cimpactpro dengesi (ikincil palet)

cimpactpro'nun turkuaz-yeşil-sarı üçlüsü, bizim markayla çakışmadan **destekleyici** olarak kullanılır:

| Token | Hex | Kullanım |
|---|---|---|
| `--accent-teal` | `#2bb3a3` | İkincil CTA outline, linkler, bilgi ikonları, grafik serileri |
| `--accent-green` | `#35c98e` | Başarı/tamamlandı durumları, QC "geçti" işaretleri |
| `--accent-yellow` | `#ffc21c` | **Yalnızca** uyarı rozetleri ve "dikkat" ikonları (cimpactpro'daki SKDM sarısıyla aynı dil) |
| `--ink-900` | `#16324a` | Başlıklar (cimpactpro'nun lacivert-mürekkep başlık rengi) |
| `--ink-600` | `#44545f` | Gövde metni |
| `--bg-base` | `#ffffff` | Ana zemin |
| `--bg-soft` | `#f2f8f5` → `#eef4f7` | Section'lar arası yumuşak degrade (cimpactpro'nun açık yeşil-mavi puslu zemini) |
| `--line` | `#e3ece8` | Kart kenarlıkları, ayraçlar |

**Kontrast kuralları:** `--brand-500` (fıstık) üzerine asla beyaz metin yok — her zaman `--brand-900`. Beyaz zemin üzerinde fıstık metin yok (kontrast yetersiz) — vurgu metni için `--ink-900` veya `--accent-teal`.

---

## 3. Tipografi

| Öğe | Spec |
|---|---|
| Aile | **Inter** (gövde + UI) — sistemde yoksa `system-ui` fallback. Başlıklarda Inter 600/700. (cimpactpro tarzı: temiz geometrik sans) |
| H1 | 44 px / 56 px satır, -0.02em — mobil 30/38 |
| H2 | 32/40 — mobil 24/32 |
| H3 | 22/30 |
| Gövde | 17/28 — mobil 16/26 |
| Küçük/meta | 14/20 |
| Buton | 16/24, 600 weight, letter-spacing 0 |
| Rakam vurgusu (sonuç ekranı büyük € değeri) | 56/64, 700 weight, tabular-nums |

---

## 4. Ölçülendirme ve Boşluk (cimpactpro modeli)

| Token | Değer |
|---|---|
| Container | max-width **1200 px**, yatay padding 24 px (mobil 20 px) |
| Section dikey padding | 96 px masaüstü / 56 px mobil |
| Kart radius | **16 px** |
| Buton/input radius | **12 px** |
| Buton yüksekliği | 52 px birincil (mobil dokunma ≥48 px şart) |
| Input yüksekliği | 52 px — "tembel kullanıcı" kuralı: büyük tıklama alanı |
| Kart gölgesi | `0 8px 30px rgba(22,50,74,.08)` (cimpactpro'nun yumuşak gölgesi) |
| Section ayracı | Kenarlık yok; zemin rengi geçişiyle (`bg-base` ↔ `bg-soft`) |
| Grid | 12 kolon; kart gridleri: masaüstü 3'lü, tablet 2'li, mobil tek |

---

## 5. Emoji / İkon Tarzı (cimpactpro modeli)

cimpactpro'nun kurumsal dilinde **dekoratif emoji yoktur**; düz çizgi (line) illüstrasyon + duotone ikon vardır. Aynen modellenir:

1. **UI'da emoji yasak** — butonlarda, başlıklarda, kartlarda emoji kullanılmaz.
2. İkonlar: **Lucide / Heroicons tarzı düz çizgi ikonlar**, 1.5 px stroke, renk `--accent-teal` veya `--ink-900`; vurgu ikonlarında duotone (teal kontur + fıstık dolgu).
3. **Tek istisna — durum glifleri:** QC/okuma listelerinde `✓` (geçti, accent-green), `!` (uyarı, accent-yellow), `✕` (engelleyici, #d64545) — bunlar emoji değil tipografik glif olarak stillendirilir.
4. Sektör kartları: her sektöre özel düz çizgi ikon (çelik kiriş, alüminyum külçe, çimento silosu, pil, kutu, tır…) — emoji YOK.
5. WhatsApp paylaşımı gibi marka ikonlarında resmi marka glyph'i, tek renk (yeşil #25D366 yalnızca butonda).

---

## 6. Bileşen Spesifikasyonları

### 6.1 Header (koyu zeytin, sticky — logoyla bütünleşik)
- Zemin **`--brand-900` (#213110)** — logonun kendi zemini; logo eriyerek oturur, tutarsızlık yok
- Yükseklik 72 px; scroll'da hafif gölge (`0 4px 20px rgba(0,0,0,.25)`), alt kenarlık yok (zemin geçişi yeterli)
- Sol: **44 px animasyonlu GIF logo** (`skdm-logo-header-120.gif`, `decoding="async"`) + "SKDMHesapla" wordmark (Inter 700, **beyaz**)
- Nav linkleri: `#c8d6a8` (fıstık tinti); hover'da beyaz; aktif sayfa altında 2 px `--brand-500` çizgi
- Sağ CTA: **"Hemen Hesapla"** — `--brand-500` zemin + `--brand-900` metin, 12 px radius (koyu header üzerinde fıstık buton mükemmel kontrast verir)
- Mobil menü: tam ekran `--brand-900` panel, linkler beyaz/fıstık tinti
- Header'dan hero'ya geçiş: aynı zemin devam ettiği için **kesintisiz** — sayfa tek parça koyu blokla açılır, sonra beyaza iner (cimpactpro ritmiyle dengeli: koyu açılış → aydınlık içerik)

### 6.2 Hero (koyu zeytin — logoyla bütünleşik)
- Zemin `--brand-900` → `--brand-800` hafif degrade
- Animasyonlu GIF logo 128–160 px (zemine eriyerek), `loading="lazy"`, `<noscript>`/reduced-motion'da statik PNG
- H1 beyaz; alt başlık `#d9e6b8` (fıstık tinti)
- Tek soru girişi: büyük input (52 px) "Ne ihraç ediyorsunuz?" + birincil buton
- Güven şeridi: "AB 2023/956 & 2025/2083 uyumlu · Deterministik motor · SHA-256 mühürlü" (küçük, fıstık tinti metin)

### 6.3 Section'lar (cimpactpro ritmi)
- Beyaz ↔ yumuşak degrade dönüşümlü; her section tek fikir
- Ürün/modül kartları: beyaz kart, 16 px radius, yumuşak gölge, üstte 3 px fıstık vurgu çizgisi
- Standart rozet şeridi (cimpactpro'nun ISO/IPCC şeridi gibi): "ISO 14067 mantığı · IPCC faktörleri · AB varsayılan değerleri · TÜRKAK doğrulayıcılarına hazır çıktı" — gri logo/rozet satırı

### 6.4 Hazırlık skoru halkası
- SVG daire: iz `--line`, dolgu `--brand-500`; %100'de dolgu `--accent-green`'e döner (küçük kutlama mikro-animasyonu, 300 ms)
- Ortada büyük rakam (tabular-nums), altında "Denetime Hazırlık"

### 6.5 Fiyatlandırma kartları
- cimpactpro dengesi: beyaz kart + üst vurgu çizgisi; fiyat büyük `--ink-900`; CTA fıstık; "KDV dahil" meta satırı `--ink-600`

### 6.6 Footer
- Zemin `--brand-900`, metin `#c8d6a8`; 5 hukuki sayfa linki + iletişim (Paddle uyumu) + standart konumlandırma cümlesi

---

## 7. Performans ve Erişilebilirlik

1. Animasyonlu GIF yalnızca hero'da, lazy; toplam ilk yükleme bütçesi: LCP < 2,0 sn (statik hero metni LCP olmalı, GIF değil).
2. `prefers-reduced-motion: reduce` → GIF yerine statik PNG.
3. Tüm etkileşim öğeleri ≥48 px dokunma hedefi; odak halkası görünür (`--accent-teal` 2 px).
4. Kontrast: tüm metin/zemin çiftleri WCAG AA ≥ 4,5:1 (fıstık üstü beyaz yasağı bu yüzden).

---

## 8. Tailwind Uygulama Eşlemesi

```ts
// tailwind.config.ts → theme.extend.colors
brand: { 900:'#213110', 800:'#2c3f18', 500:'#bdd652', 100:'#f0f6da' },
accent:{ teal:'#2bb3a3', green:'#35c98e', yellow:'#ffc21c' },
ink:   { 900:'#16324a', 600:'#44545f' },
soft:  { from:'#f2f8f5', to:'#eef4f7' },
line:  '#e3ece8'
// borderRadius: card '16px', ctl '12px'
// boxShadow: card '0 8px 30px rgba(22,50,74,.08)'
// fontFamily: sans ['Inter','system-ui','sans-serif']
// maxWidth: container '1200px'
```

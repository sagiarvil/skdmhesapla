# SKDMHesapla.com — Tasarım Rehberi (Design System v1)

**Sürüm:** 1.0 — 16 Ağustos 2026
**Hazırlayan rol:** Principal Architect & Design Lead
**Referans stil:** cimpactpro.com (kurumsal karbon yazılımı dili) — arka plan, ölçülendirme, ikon/emoji tarzı modellenmiştir
**Logo:** Kullanıcının yüklediği animasyonlu GIF (485×485, 129 kare) — koyu zeytin zeminde fıstık yeşili elmas mozaiği

---

## 1. Logo Kullanım Kuralları

Logo iki varyant olarak projeye konur:

| Dosya | Boyut | Kullanım |
|---|---|---|
| `skdm-logo-animasyonlu-240.gif` (916 KB) | 240×240 | **Yalnızca hero/ana vitrin** bölümünde, koyu zeytin zemin üzerinde, `loading="lazy"` |
| `skdm-logo-statik.png` (ilk kare) | 485×485 | Header, footer, favicon kaynağı, PDF rapor kapakları, e-posta şablonları |

**Kurallar:**
1. Logo **asla açık zemine çıplak konmaz** — koyu zeytin karesi çirkin durur. Açık zeminde kullanılacaksa 16 px radius'lu "logo karosu" içinde (karonun zemini logonun kendi rengi `#213110`).
2. Header'da animasyonlu GIF **kullanılmaz** (dikkat dağıtır + ağır) — statik PNG, 40 px yükseklik.
3. Hero'da animasyonlu logo 128–160 px; mobil 96 px. Zeminiyle aynı renk section içinde eriyerek görünür (kesintisiz görünüm).
4. Favicon: statik PNG'den 32/16 px üretilir.
5. GIF'te animasyon **tek döngü + sonda 4 sn duraklama** hissi idealdir; mevcut dosya sürekli döngüdeyse kabul edilebilir, ama hero dışında tekrar etmez.

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

### 6.1 Header (beyaz, sticky)
- Zemin `#ffffff`, alt kenarlık 1 px `--line`; yükseklik 72 px
- Sol: 40 px statik logo (koyu karosuyla) + "SKDMHesapla" wordmark (Inter 700, `--ink-900`)
- Sağ: Nasıl Çalışır · Sektörler · Fiyatlandırma · **"Hemen Hesapla"** birincil butonu (fıstık zemin, zeytin metin, 12 px radius)

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

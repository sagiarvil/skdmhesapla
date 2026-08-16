# SKDMHesapla.com — Tasarım Rehberi (Design System v1)

**Sürüm:** 1.4 — 16 Ağustos 2026 (§6.3/§6.4: kanonik zemin = yoğun guilloche ağı; elmas mozaik kaldırıldı)
**Hazırlayan rol:** Principal Architect & Design Lead
**Referans stil:** cimpactpro.com (kurumsal karbon yazılımı dili) — arka plan, ölçülendirme, ikon/emoji tarzı modellenmiştir
**Logo:** Kullanıcının yüklediği animasyonlu GIF (485×485, 129 kare) — koyu zeytin zeminde fıstık yeşili elmas mozaiği

> **HAKEM KARARI (16.08.2026):** RM-SKDMHESAPLA-002 §4'teki "kil/toprak paleti, border-radius: 0, Georgia başlıklar" hükümleri **skdmhesapla.com için YÜRÜRLÜKTE DEĞİLDİR** — o tasarım dili cbamvalid.com'un mirasıdır. Bu sitenin kanonik görsel sistemi **bu rehberdir**: zeytin/fıstık paleti (logo zemininden türetilmiş), 16/12 px radius, Inter tipografi, pasaport guilloche zemini, animasyonlu GIF logo. RM-002'nin kalan tüm maddeleri (G-20..G-26, 7 adım, dil politikası, faz planı) aynen geçerlidir.

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
- Sol: **56 px animasyonlu GIF logo** (`skdm-logo-header-120.gif`, `decoding="async"`) + "SKDMHesapla" wordmark (Inter 700, 20 px, **beyaz**)
- Nav linkleri: `brand-tint (#c8d6a8)`; hover'da beyaz; aktif sayfa altında 2 px `--brand-500` çizgi
- Sağ CTA: **"Hemen Hesapla"** — `--brand-500` zemin + `--brand-900` metin, 12 px radius (koyu header üzerinde fıstık buton mükemmel kontrast verir)
- Mobil menü: tam ekran `--brand-900` panel, linkler beyaz/fıstık tinti
- Header yüksekliği **80 px** (56 px logo + nefes payı); scroll'da `shadow-header`
- **Header–hero ayrışması:** header zeminini hero'dan ayırmak için header'a `backdrop-blur` + yarı saydamlık (`bg-brand-900/85`) ve altına 1 px `rgba(189,214,82,.12)` hairline verilir — aynı renk ailesinde kalır ama katman hissi yaratır (hero ile düzlemsel birleşme yaşanmaz)

### 6.2 Hero (yaratıcı tasarım — "Elmas Mozaik" konsepti, revize v1.2)

Düz koyu blok hero **yasaktır**. Hero, logodaki elmas mozaiği motifini sahne tasarımına dönüştürür:

**Katmanlar (alttan üste):**

1. **Zemin:** `--brand-900` taban + sağ üstten sol alta çok yumuşak radyal aydınlatma (`radial-gradient(ellipse 60% 50% at 75% 40%, rgba(189,214,82,.10), transparent 70%)`)
2. **Mozaik deseni:** Logodaki elmas motifinden üretilmiş SVG tile, yalnızca sağ yarıda, `%4–6 opacity`, `brand-500` renginde, maske ile kenarlara doğru silinerek (fade-out mask) — "doku" hissi verir, gürültü yaratmaz
3. **İçerik gridi (12 kolon):**
   - **Sol (7 kolon):** Rozet pill ("SKDM / CBAM maliyet hesaplayıcı" — zemin `brand-500/15`, metin `brand-500`, 10 px radius) → H1 beyaz → alt başlık `brand-mist (#d9e6b8)` → çift CTA (birincil fıstık "Hesaplamaya Başla" + ghost "Nasıl Çalışır?" — kenarlık `rgba(189,214,82,.4)`, metin `brand-mist`) → güven şeridi **chip'ler halinde** (her madde ayrı pill: `✓` glifi accent-green + metin; "AB 2023/956 & 2025/2083 uyumlu", "Deterministik motor", "SHA-256 mühürlü")
   - **Sağ (5 kolon):** **Logo sahnesi** — animasyonlu GIF (240 varyantı, 160 px), **tasarlanmış cam karo içinde**: 24 px radius, zemin `rgba(189,214,82,.06)`, 1 px kenarlık `rgba(189,214,82,.25)`, dış ışıma `0 0 80px rgba(189,214,82,.15)`, 4 sn'lik çok hafif süzülme animasyonu (`translateY ±6px ease-in-out infinite`). Kare sınırı artık "kusur" değil, kasıtlı sahne çerçevesi. Karonun altına üst üste binen **mini ürün kartı** (beyaz, 16 px radius, card gölgesi, -24 px overlap): "Denetime Hazırlık %100 · 0 engel · 6 mühürlü dosya" + mini skor halkası — ziyaretçiye ürünün çıktısını daha ilk ekranda gösterir (cbamvalid'deki "Case Readiness" kartının Türkçe karşılığı)
4. **Alt geçiş:** Hero'nun beyaz section'a inişi düz çizgiyle değil, **yumuşak kavis veya hafif diyagonal** (`clip-path` veya SVG divider) ile — sayfa "kesilmez", akar

**Ölçüler:** Hero içerik dikeyde ortalanır, min-height `calc(100vh - 80px)` ama içerik 640 px'i geçmez; boşluk hissi için değil denge için kullanılır. Mobilde logo sahnesi metnin altına iner, mozaik deseni opacity %3'e düşer.

**Yasaklar:** Stok fotoğraf yok, emoji yok, gradyan gökkuşağı yok; yalnızca token renkleri. Animasyonlar `prefers-reduced-motion`'da tamamen kapanır.

### 6.3 Pasaport Zemini (Guilloche) Sistemi — sayfa geneli kimlik katmanı (v1.4 — YOĞUN AĞ REVİZİ)

Markanın "değerli evrak / mühürlü dosya" kimliğini sayfanın tamamına taşıyan imza dokusu: **para, pasaport ve değerli evraklardaki yoğun, iç içe geçen ince dalga ağı (guilloche mesh)** — diploma/banknot zeminlerindeki tam kaplama interferans dokusunun dijital karşılığı. Amaç: ziyaretçi sayfayı kaydırırken "bu site resmi, mühürlü, güvenilir bir belge üretiyor" hissini bilinçaltında alsın.

**KANONİK DOSYALAR (v1.4 — tek doğru kaynak):**
- Açık zemin: `guilloche-mesh-acik.svg` (çizgiler: `#16324a` + `#2bb3a3`)
- Koyu zemin: `guilloche-mesh-koyu.svg` (çizgiler: `#bdd652` + `#8fa83e`)
- Önizleme / dikişsizlik kanıtı: `guilloche-mesh-onizleme.png` (2×2 tile)

> ⚠️ **YÜRÜRLÜKTEN KALDIRILDI:** Rozet/spirograph tarzı `guilloche-acik-zemin.svg` / `guilloche-koyu-zemin.svg` ve her türlü **elmas mozaik / diamond pattern** artık KULLANILMAZ. Sayfada yalnızca yukarıdaki mesh tile'ları bulunur.

**Motif tanımı (üretim parametreleri):**
- Yatay + dikey iki sinüs çizgisi ailesi iç içe geçer; 10 px aralık, genlik 9 px, dalga boyu 80 px, çizgi kalınlığı 0,7 px
- Faz dizisi: yatay aile `(i % 4)·π/2`, dikey aile `(i % 4)·π/2 + π/4` — bu çeyrek-faz kayması banknotlardaki "dokuma" interferansını üretir
- **Dikişsiz tile 400×400 px**: λ=80 olduğundan tile kenarında tam 5 dalga biter; `background-repeat` ile sonsuz döşenir, ek yeri görünmez

**İki renk varyantı:**

| Yüzey | Dosya | Opacity | Görünürlük |
|---|---|---|---|
| Açık section'lar (beyaz / soft degrade) | `guilloche-mesh-acik.svg` | %3,5 | Bilinçaltı doku — metni asla ezmez |
| Koyu yüzeyler (hero, footer) | `guilloche-mesh-koyu.svg` | %6–8 | Belirgin ama içeriği boğmayan gravür parıltısı |

**Dalga (wave) bileşeni — daha etkin ve belirgin (revize):**
- Hero → beyaz geçişinde **çift katmanlı dalga**: önde beyaz dolgulu kavis (section zemini), arkada 24 px yukarı kaydırılmış **guilloche dalga çizgi demeti** (`brand-500` stroke, %40 opacity, 3 paralel sinüs çizgisi 1,2/0,8/0,5 px) — dalga artık sadece kesik değil, "mühür bandı" gibi okunur
- Footer üstünde aynı dalganın ters yönlüsü — sayfa başı ve sonu aynı gravür diliyle kapanır

**Teknik kurallar:**
1. Uygulama: CSS `background-image` data-URI SVG; `pointer-events: none`, `aria-hidden`, `position: fixed` değil section-bazlı (performans).
2. Metin yoğun alanlarda (makale gövdesi, form alanları) doku opacity'si %2'ye düşer veya o blokta kapanır — okunabilirlik her zaman kazanır.
3. WCAG: doku dekoratiftir, kontrast hesaplamasına girmez; ama hiçbir metin dokunun koyu çizgisi üstüne denk gelmemeli (gerekirse metin bloğuna `rgba(255,255,255,.7)` backdrop).
4. Mobil: tile 320 px'e küçülür, opacity sabit.

### 6.4A Hero — İKİ KOLONLU, İKİ TONLU YAPI (v1.6, 16.08.2026 canlıda doğrulandı)

**Yeni token:** `brand-950 #060c04` — yalnızca hero sol panelinde kullanılır (header #213110'dan daha koyu; kullanıcı kararı, hakem onaylı).

**Malik istisnası (16.08.2026):** Hero sağ panelinde kullanıcının kendi ürettiği AB–Türkiye bayraklı el sıkışma **fotoğrafı** kalıcıdır — "stok fotoğraf yok" kuralına kullanıcının bizzat onayladığı tek istisnadır (kullanıcı üretimi olduğundan telif riski yok). Nokta dünya haritası varlığı (`dunya-nokta-harita-koyu.webp`) arşivde kalır, başka yüzeyde kullanılabilir.

Canlı durum: sol panel `brand-950` + negatif pasaport dokusu; sağ panel `brand-mist #d9e6b8` + kırpılmış koyu nokta harita (Afrika/Avrupa odağı, figcaption "Küresel ticaret · SKDM kapsamı"). Hero artık tam ekran değil — kompakt padding, küçültülmüş H1, dalga bandı orantılı (h-16/h-20).

Önceki not (v1.5):

Hero dikey olarak ikiye bölünür ve kolonlar **birbiriyle uyumlu iki farklı ton** taşır (örnek: kullanıcının paylaştığı koyu/açık panel mockup'ı):
- **Sol kolon** = `brand-900 #213110` zemin — premium metin + CTA (başlık: RM-002 §1 değer önerisi), negatif pasaport dokusu üstte kalır
- **Sağ kolon** = `brand-mist #d9e6b8` zemin — nokta-matris dünya haritası `dunya-nokta-harita-koyu.webp` (**koyu zeytin #213110 noktalar**, saydam zemin), dikeyde ortalanmış, metin bloğuyla simetrik dengeli
- İki kolon arasında sert kenar (bölme çizgisi yok); dalga ayırıcı hero'nun alt kenarını iki rengi de kapsayarak imzalar
- Mobil: kolonlar üst üste — metin üstte, harita altta
- **Not:** Mockup'tan yalnızca iki kolon *yerleşimi ve iki ton ilişkisi* alınmıştır; palet ve tipografi bu rehberdeki token'lardır (kil paleti/Georgia YÜRÜRLÜKTE DEĞİL)

### 6.4 Hero yapısı (v1.3 revize — renk sabit, yapı farklı)

**Kural:** Hero zemini `--brand-900` olarak **korunur** (logonun zeminiyle birebir aynı olmak zorunda — bu marka bütünlüğünün temeli, değişmez). Farklılaşma renkle değil **yapıyla** sağlanır:

1. Hero zemini **yalnızca** `guilloche-mesh-koyu.svg` dokusu (%6–8) taşır — elmas mozaik deseni tamamen kaldırılmıştır (v1.4)
2. Radyal aydınlatma korunur; ek olarak sol içerik arkasına çok hafif diagonal ışık süpürmesi (`linear-gradient(115deg, transparent 40%, rgba(189,214,82,.05) 50%, transparent 60%)`)
3. Cam karo + float + overlap mini kart + chip'ler aynen kalır
4. **Çift dalga** (yukarıdaki 6.3) hero'nun alt kenarını imzalar
5. Header'dan ayrışma: header `backdrop-blur` + hairline (6.1) + hero'nun doku zenginliği — artık iki blok asla "düz tek parça" görünmez

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

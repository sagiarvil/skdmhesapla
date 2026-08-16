# Plan 27 — /basla/ 360° Deneyim Denetimi: Hakem Kararı + Düzeltme Paketi

Claude'un 7 bulgusunu canlı site ve repo üzerinde tek tek doğruladım. Üçü gerçek ve kritik,
ikisi bayat deploy ölçümü, biri kısmen doğru, biri isabetsiz. Prototip HTML'sinin kendisinde de
iki sert kural ihlali var — olduğu gibi alınmayacak.

## 1. Bulgu bazında hakem kararı

| # | Claude'un bulgusu | Doğrulama sonucu | Karar |
|---|---|---|---|
| 1 | 14 sektör linkleri 404 | **DOĞRU — canlıda teyit edildi.** `/hesapla/battery/` sert 404. Sebep: `hesapla/[sector]/page.tsx` `generateStaticParams`'ta yalnızca 6 slug var; `/basla/` Kademe B linkleri ayrıca İngilizce id'lere gidiyor. | **Düzeltildi** (20 Türkçe slug + basla slug eşlemesi). |
| 2 | Rehber ≠ gerçek hesaplayıcı | **KISMEN BAYAT.** Sihirbaz sandığı gibi "6-7 alanlık tek form" değil: 10 katman, B_EmInst register'ları, D_Processes a=b+c+d kontrolü, QC kapıları kodda mevcut. Ama haklı taraf: katman dili teknik ("A.4(a)"), Claude'un prototipindeki insan dili daha iyi. | Sihirbaz metin dili Plan 28'de insana çevrilecek; mimari korunur. Prototip birebir alınmaz (aşağıda gerekçe). |
| 3 | /hesapla footer'ında "Cimetrica" | **BAYAT ÖLÇÜM.** Canlıda bugün footer "Barış Bağırlar · VKN 25403091318" — hesapla sayfası dahil (root layout tek footer kullanır). Claude deploy öncesi önbelleği görmüş. | İşlem yok; zaten temiz. |
| 4 | TR/EN slug karışıklığı | **DOĞRU.** Kademe B linkleri `/hesapla/battery/` gibi İngilizce gidiyordu; `gtip-kodlari.ts` zaten Türkçe slug kullanıyor (batarya, ambalaj, yapi…). | **Düzeltildi** — tek standart: Türkçe slug. |
| 5 | "karbon vergisi" terimi | **İSABETSİZ (büyük ölçüde).** Canlı taramada WhatsApp paylaşım slug'ı hiçbir sayfada yok. Tek geçtiği yer sözlükte "karbon kaçağı" tanımının içinde, üstelik tanım gereği doğru kullanım. | Sözlüğe netleştirici bir madde eklenecek (aşağıda); başka işlem yok. |
| 6 | CTA isim tutarsızlığı ("Hemen Hesapla"/"Hemen Başla") | **BAYAT ÖLÇÜM.** Canlıda her yerde "Hemen Başla" (Plan 26 deploy edilmiş). | İşlem yok; zaten temiz. |
| 7 | "%50 hazırlık skoru" boşken görünüyor | **DOĞRU RUHTA.** `uiScore` hiç veri girilmeden sıfırın üstünde başlayabiliyor. | **Düzeltildi** — gerçek girdi yoksa skor "—" gösterir (aşağıdaki sihirbaz düzeltmesi). |

## 2. Prototipin (skdmhesapla_kusursuz_akis.html) hakem incelemesi

**Reddedilenler (sert kural ihlali):**
- Mühür adımında "yeniden mühürleme 2.400 ₺" yazıyor → kullanıcının kilitli kuralıyla çelişir
  (aynı dosyada yeniden mühürleme ÜCRETSİZ; 2.400 ₺ hiçbir yerde geçmeyecek).
- Triyaj yalnızca 3 sektör sunuyor → 6 Kademe A + 14 Kademe B yapısını budar.
- `prompt()` ile veri girişi, emoji ikonlar, zeytin renk paleti → mevcut tasarım sistemi
  (Phosphor duotone, brand token'ları) ve RM kurallarıyla uyumsuz.
- FieldHelp beşlisi (Bu nedir / Nereden bulurum / Kimden isterim / Nasıl girilir / Girilmezse
  ne olur + Talep oluştur) yok; tek soruluk chip'ler var.

**Alınacaklar (Plan 28'de sihirbaza işlenecek):**
- Kontrol denkliği mesaj dili: "1.820 ton'un nereye gittiği belirsiz" gibi insan dili.
- Alan bazlı delegasyon ("bu bilgiyi ondan isteyeceğim → tek alanlık link").
- "Bilmiyorum" kutusu kalıbı (atlama + eksik işaretleme).
- Tek CTA dili: "Devam edelim →".
- EAF karşılaştırması ancak veri girildikten sonra, koşulsuz "avantajınız var" triyajda söylenmez
  (BF-BOF dürüstlük sınırı).

## 3. Değişen dosyalar

| Verilen dosya | Repodaki hedef |
|---|---|
| `yeni-hesapla-sector-page.tsx` | `src/app/hesapla/[sector]/page.tsx` (tam değiştir) |
| `yeni-basla-page-v4.tsx` | `src/app/basla/page.tsx` (tam değiştir) |

## 4. Elle düzeltmeler — src/components/wizard/SkdmWizard.tsx (3 küçük blok)

### 4a. SLUG_TO_ID tablosunu genişlet

Bul:
```
const SLUG_TO_ID: Record<string, string> = {
  "demir-celik": "iron-steel",
  aluminyum: "aluminum",
  cimento: "cement",
  gubre: "fertilizer",
  elektrik: "electricity",
  hidrojen: "hydrogen",
};
```
Değiştir:
```
const SLUG_TO_ID: Record<string, string> = {
  "demir-celik": "iron-steel",
  aluminyum: "aluminum",
  cimento: "cement",
  gubre: "fertilizer",
  elektrik: "electricity",
  hidrojen: "hydrogen",
  // Kademe B/C — Türkçe slug'lar (gtip-kodlari.ts ile birebir aynı)
  batarya: "battery",
  ambalaj: "packaging",
  gida: "food",
  lojistik: "logistics",
  plastik: "plastics",
  kimya: "chemicals",
  cam: "glass",
  tekstil: "textile",
  makine: "machinery",
  otomotiv: "automotive",
  elektronik: "electronics",
  mobilya: "furniture",
  kagit: "paper",
  yapi: "construction",
};
```

### 4b. Kademe B başlık ve uyarı bandı

Bul:
```
          <h1 className="text-2xl font-bold text-ink-900">{sector.name} — SKDM çalışma dosyası</h1>
          <p className="text-sm text-ink-600">{sector.applicableRegulation}</p>
```
Değiştir:
```
          <h1 className="text-2xl font-bold text-ink-900">
            {sector.name} — {sector.tier === "A" ? "SKDM çalışma dosyası" : "Tedarikçi veri dosyası (ISO 14067)"}
          </h1>
          <p className="text-sm text-ink-600">{sector.applicableRegulation}</p>
          {sector.tier !== "A" && (
            <p className="mt-2 rounded-ctl border border-brand-800/25 bg-brand-100/60 px-4 py-2.5 text-sm font-semibold text-ink-800">
              Bu sektör SKDM kapsamında değildir. Çıktınız bir SKDM raporu olmayacak; alıcınızın
              Kapsam 3 hesabına girdi sağlayan, ISO 14067 mantığında bir tedarikçi veri dosyası olacaktır.
              Adımlar ve kalite kontrolleri aynıdır.
            </p>
          )}
```

### 4c. Hazırlık skoru — gerçek girdi yoksa gösterme

`const uiScore = useMemo(...)` bloğunun hemen sonrasına ekle:
```
  const hasRealInput =
    Object.values(fieldValues).some((v) => String(v ?? "").trim() !== "") ||
    goods.length + processes.length + streams.length + precs.length > 0;
```
Bul:
```
            <span className="font-mono text-base font-semibold text-brand-800">{uiScore}%</span>
```
Değiştir:
```
            <span className="font-mono text-base font-semibold text-brand-800">
              {hasRealInput ? `${uiScore}%` : "—"}
            </span>
```
Bul:
```
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${uiScore}%` }} />
```
Değiştir:
```
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${hasRealInput ? uiScore : 0}%` }} />
```

## 5. Elle düzeltme — sözlüğe netleştirme maddesi

`src/app/sozluk/page.tsx` içindeki uygun bölüme ("Taraflar ve Roller" öncesi, kavramlar bloğuna)
bir section daha ekle (mevcut section'ların aynısı formatta):

```
<section id="vergi-degil" data-ara="skdm vergi değildir carbon tax karbon vergisi sertifika cbam tax" className="rounded-card border-2 border-line bg-white p-6 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all">
  <dt className="text-xl font-black text-ink-900">SKDM bir vergi değildir</dt>
  <dd className="mt-2 text-base text-ink-700 font-medium leading-relaxed">
    SKDM (CBAM) gümrük vergisi veya karbon vergisi değildir; ithalatçının satın aldığı emisyon
    sertifikalarına dayanan bir fiyatlandırma mekanizmasıdır. Resmi yazışmalarda ve alıcınızla
    iletişimde "karbon vergisi" ifadesini kullanmayın — "SKDM sertifika maliyeti" doğru terimdir.
  </dd>
</section>
```

## 6. Uygulama sırası

1. İki dosyayı üzerine kopyala; sihirbazdaki 3 bloğu ve sözlük maddesini elle uygula.
2. Kalite süpürmesi: `grep -rni "hesapla/battery\|hesapla/food\|Hemen Hesapla\|2\.400\|karbon-vergisi" src/` → boş dönmeli.
3. `npm run build` → çıktıda 20 `/hesapla/...` rotasının üretildiğini gör (demir-celik … yapi).
4. `firebase deploy --only hosting:skdmhesapla`
5. `git add -A && git commit -m "Plan 27: 404 slug, Kademe B bant, skor kapisi" && git push`
6. Canlıda doğrula: /hesapla/batarya/ açılmalı ve ISO 14067 bandı görünmeli; /basla/ Kademe B
   linkleri Türkçe; sihirbaz boşken skor "—".

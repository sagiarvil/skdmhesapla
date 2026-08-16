# Plan 26 — Claude Kritiği Düzeltme Paketi (Hakem Kararı + Uygulama)

Bu paket Claude'un tespitlerinin tamamını karşılar. Repo dosyaları tek tek tarandı; her hatanın
tam yeri bulundu ve düzeltildi.

## 1. Hakem kararları

| # | Claude'un tespiti | Karar |
|---|---|---|
| 1 | Alüminyum "Kapsam 2 maliyetin ana belirleyicisidir" mevzuat hatası | **KABUL — kritik.** Annex II: alüminyumda yalnızca doğrudan emisyonlar fiyatlandırılır; elektrik (endirekt) SKDM maliyetine girmez. `src/lib/skdm/config.ts` düzeltildi (aşağıda). |
| 2 | "6 resmi dosya" + "resmi" kelimesi | **KABUL.** 11 dosyalık paket listesine geçildi; "resmi" iddiası kaldırıldı. İstisna: AB İletişim Şablonu'na atıf "resmi iletişim şablonu (Communication Template)" olarak kalabilir — bu, Komisyonun yayımladığı şablonun kendisine yapılan doğru bir atıftır; bizim dosyamızın "resmi belge" olduğu iddiası değildir. |
| 3 | Kademe B kapsam kayması endişesi | **REDDEDİLİR.** Kademe B kullanıcının açık stratejik kararıdır; 10 katman metodolojisi korunur, çıktı her yerde "SKDM raporu değildir — ISO 14067 tedarikçi veri dosyası" çerçevesinde sunulur. Ana sayfadan kaldırılması zaten kullanıcı talimatıydı; v4 ana sayfada Kademe A/B listeleri yok. |
| 4 | "Canlı Eşleştirme Motoru" rozeti | **KABUL.** `GtipArama.tsx`'ten kaldırıldı. |
| 5 | Jargon rozetleri ("Deterministik Hesaplama Motoru" vb. 3'lü çip satırı) | **KABUL.** Ana sayfadan kaldırıldı; yerine dürüstlük notu içeren düz metin. |
| 6 | "3 Basit Adımda" numaralı kare deseni | **KABUL.** Numaralı kartlar kaldırıldı; yerine "Süreç sandığınızdan kısa" düz anlatım bölümü. |
| 7 | Footer dalga deseni | **KABUL.** `SiteChrome.tsx`'teki `<CiftDalga>` kaldırıldı; footer düz kenar çizgisiyle başlıyor. (Bileşen dosyası repoda kalabilir, artık hiçbir yerde çağrılmıyor.) |
| 8 | İnsan sesi yok | **KABUL.** Ana sayfaya Barış Bağırlar imzalı kurucu notu eklendi. |
| 9 | Hero'da "resmi dosya paketinizi" iddiası | **KABUL.** v4 hero'da bu ifade yok. |

Ek yakaladığım hata: Header butonu hâlâ "Hemen Hesapla" yazıyordu → **"Hemen Başla"** yapıldı
(mobil menü dahil).

## 2. Değişen dosyalar

| Verilen dosya | Repodaki hedef |
|---|---|
| `yeni-ana-sayfa-v4.tsx` | `src/app/page.tsx` (tam değiştir) |
| `yeni-GtipArama.tsx` | `src/components/GtipArama.tsx` (tam değiştir) |
| `yeni-SiteChrome.tsx` | `src/components/legal/SiteChrome.tsx` (tam değiştir) |
| `yeni-fiyatlandirma-page.tsx` | `src/app/fiyatlandirma/page.tsx` (tam değiştir) |

## 3. Elle düzeltme — src/lib/skdm/config.ts (Alüminyum, tek satır)

`aluminum:` bloğunda şu satırı bul:

```
    description: "Alüminyum biyel, külçe, levha, folyo ve ekstrüzyon profiller. Elektrik tüketimi (Kapsam 2) maliyetin ana belirleyicisidir.",
```

Şununla değiştir:

```
    description: "Alüminyum biyel, külçe, levha, folyo ve ekstrüzyon profiller. Ek II (Annex II) kapsamında yalnızca doğrudan emisyonlar fiyatlandırılır; elektrik tüketimi SKDM sertifika maliyetine girmez.",
```

Aynı blokta hemen altındaki satırı da:

```
    scope2DefaultApplicable: true,
```

→

```
    scope2DefaultApplicable: false,
```

Not: `defaultIndirectEmission: 6.80` değeri kalabilir (bilgi amaçlı); maliyet hesabına girmemesi
gerektiğini artık açıklama ve flag taşıyor.

## 4. Uygulama sırası

1. Dört dosyayı repoda ilgili yolların üzerine kopyala; config.ts'teki iki satırı elle değiştir.
2. Kalite süpürmesi (hiçbir çıktı dönmemeli):
   `grep -rni "resmi dosya\|6 resmi\|Canlı Eşleştirme\|Deterministik Hesaplama\|3 Basit Adımda\|belirleyicisidir\|2\.400" src/ public/`
3. `npm run build`
4. `firebase deploy --only hosting:skdmhesapla`
5. `git add -A && git commit -m "Plan 26: mevzuat ve AI-koku duzeltmeleri" && git push`
6. Canlıda doğrula: / (kurucu notu, numarasız süreç bölümü), /fiyatlandirma/ (11 dosya), header "Hemen Başla".

# AGENTS1.md — skdmhesapla.com

> Bu dosya ajan her oturumda **zorunlu** okur (`AGENTS.md` + `.cursor/rules/agents1.mdc` alwaysApply).
> Amaç: minimum token ile maksimum doğru davranış. Detay burada değil,
> ilgili mandate dosyasında — ajan gerektiğinde onu açar, önceden yüklemez.

## 0. Proje tek cümle
Türk ihracatçılar için SKDM (CBAM) doğrulamaya-hazır çalışma dosyası üreten self-servis SaaS. Kod tabanı cbamvalid.com'dan **ayrı**.

## 1. Kaynak hiyerarşisi (çelişki varsa üsttekine uy)
1. `/docs/RM-004-alan-haritasi.md` — resmi AB alan şeması, tek doğruluk kaynağı
2. `/docs/RM-003-hesaplama-motoru.md` — hesaplama mantığı + madde referansları
3. `/docs/RM-002-ux.md` — UX ilkeleri (wayfinding, dil politikası)
4. `/docs/RM-001-veri-modeli.md` — CN kod evreni, sektör kapsamı
5. Bu dosya — davranış kuralları

Mandate dosyalarını **özetleme, tekrar üretme** — ilgili bölümü aç, oku, uygula.

## 2. Sert kurallar — asla ihlal etme
- CBAM'ın yasal kapsamı 6 sektör ailesi + 569 CN kodu (RM-001 §2). Kapsam dışı sektöre hesaplama **üretme**, reddet.
- Her hesap fonksiyonu bir tüzük maddesine referans vermeden merge edilemez (RM-003 G-27).
- LCA emisyon faktörü asla girdi olarak kabul edilmez (RM-003 §5.11).
- Bir CN kodu = bir üretim süreci; ikiye bölünemez (RM-003 §2, Md.4).
- Varsayılan değer kullanan alan, gerekçesiz mühürlenemez (RM-003 G-08).
- Kontrol denkliği (D_Processes (e), E_PurchPrec (d)) sağlanmadan mühürleme UI'da engellenmiş kalmalı.
- Sistem "akredite doğrulama görüşü" veya "gümrük onayı" verdiği izlenimi **asla** vermez — her ekranda bu sınır açık.
- Arayüz metninde "hata/red/başarısız/geçersiz" kelimeleri yasak (RM-002 G-23). Onaylı kelimeler: eksik, tamamlanmadı, gözden geçirin.
- Durum rengi olarak kırmızı kullanılmaz (RM-002 §1).
- Yeni bir resmi tüzük/rehber yayımlanırsa (taxation-customs.ec.europa.eu) hukuki kaynak kütüğünü güncelle, 90 günden eski referansı "tazelik kontrolü gerekli" işaretle (RM-003 G-01).

## 3. Terminoloji sabitleri (değiştirme)
| Türkçe UI terimi | Kaynak | Not |
|---|---|---|
| SEE | sabit, çevirme | "spesifik gömülü emisyon" ile birlikte kullan |
| CBAM / SKDM | ikisi de kullanılır | CBAM=teknik/hukuki, SKDM=kullanıcıya dönük |
| UNLOCODE, CN kodu, GTİP | sabit, çevirme | GTİP=CN kodu Türkiye karşılığı, aynı sistem |
| bubble approach | sabit, çevirme | Türkçe karşılığı icat etme |
| Kod, commit, slug, değişken adları | **İngilizce** | UI metni Türkçe, teknik katman İngilizce |

## 4. Dizin haritası (varsayım — gerçek yapıya göre güncelle)
```
/docs/            → RM-001..004 mandate'leri (okunur, kopyalanmaz)
/src/schema/       → resmi şablon alan tanımları (A-G sayfa karşılıkları)
/src/calc/         → hesaplama motoru, her fonksiyon RM-003 madde referanslı
/src/ui/wizard/    → 10 katman, katman başına 1 dosya
/src/ui/fieldhelp/ → tek config-driven FieldHelp bileşeni (bkz. §5)
```

## 5. FieldHelp deseni — yeni alan eklerken
Yeni alan = yeni UI kodu **değil**, `FIELD_DB` içine 8 satırlık config:
`title, required, why, whatIsIt, whereToFind[], whoHasIt, howToEnter, consequence, delegationTemplate, anomaly?`
Register (tekrarlanan satır) alanları için `COLUMN_HELP`'e ekle, satır başına değil sütun başına.

## 6. Ajan ne zaman durup sormalı
- Mevzuat yorumunda belirsizlik varsa (madde referansı bulunamıyorsa) — varsayım üretme, sor.
- Fiyatlandırma/ticari karar (RM-004 §4 kalan sorular) — kod yazma, önce netleştir.
- Kapsam genişletme (yeni sektör/CN kodu ekleme) — RM-001'i güncellemeden kod ekleme.

## 7. Ajan ne zaman durmadan devam etmeli
- Mevcut mandate'te net madde referansı olan her değişiklik.
- FieldHelp config ekleme/düzenleme (şema sabit, düşük risk).
- UI kopya/dil düzeltmeleri (RM-002 dil politikasına uyduğu sürece).

## 8. Bilinen tuzaklar (tekrar düşmeyin)
- "6 dosya mühürleme paketi" yeterli değildi — resmi Communication Template'in dolu XLSX'i olmadan paket eksik sayılır (bkz. RM-004 §güncel liste, 11 dosya).
- Katmanları "8" veya "7" gibi sabit bir sayıya sıkıştırmaya çalışma — resmi şablonun gerektirdiği alan sayısı katman sayısını belirler, tersi değil.
- G1-G10/P1-P10 register'larını tekil dropdown'a indirgeme — resmi şablon çoklu kayıt istiyor.

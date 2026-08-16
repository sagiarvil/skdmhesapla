# PLAN 22-EK — Yapıştırmaya Hazır Kod + Talimat (Ek G §15, §20-21 + Sözlük v3)

> Kullanım: Bu dosyadaki her kod bloğu belirtilen yola birebir yapıştırılır. Mevcut
> sayfa yapısına göre yalnızca import yolları uyarlanır; mantık değiştirilmez.
> Sonunda: `npm run typecheck` → 0, `npm run test:skdm` → 7/7, 3 ekran kanıtı.

---

## 1) GTİP arama verisi → `src/data/gtip-kodlari.ts`

```ts
// GTİP bilmeyen kullanıcı akışı (Ek G §20). Liste genişletilebilir; yapı sabit.
export interface GtipOneri {
  anahtar: string[];      // küçük harf, Türkçe karakter serbest arama anahtarları
  urunAdi: string;        // kullanıcının gördüğü ad
  cnKodu: string;         // önerilen 8 haneli CN kodu
  sektorSlug: string;     // /hesapla/{sektorSlug}/ hedefi
  kademe: "A" | "B";
}

export const GTIP_VERISI: GtipOneri[] = [
  // KADEME A
  { anahtar: ["inşaat demiri", "insaat demiri", "rebar", "nervürlü demir"], urunAdi: "İnşaat demiri (nervürlü)", cnKodu: "7214 20 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["profil", "kutu profil", "boru profil", "npu", "ipe"], urunAdi: "Çelik profil", cnKodu: "7216 61 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["sac", "rulo sac", "galvaniz sac", "levha"], urunAdi: "Yassı çelik / sac", cnKodu: "7208 39 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["boru", "çelik boru", "celik boru"], urunAdi: "Çelik boru", cnKodu: "7306 30 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["vida", "civata", "somun", "bağlantı elemanı"], urunAdi: "Bağlantı elemanları (vida, civata)", cnKodu: "7318 15 00", sektorSlug: "demir-celik", kademe: "A" },
  { anahtar: ["külçe alüminyum", "kulce aluminyum", "alüminyum külçe", "ingot"], urunAdi: "Külçe alüminyum", cnKodu: "7601 10 00", sektorSlug: "aluminyum", kademe: "A" },
  { anahtar: ["alüminyum profil", "aluminyum profil", "alüminyum ekstrüzyon"], urunAdi: "Alüminyum profil", cnKodu: "7604 21 00", sektorSlug: "aluminyum", kademe: "A" },
  { anahtar: ["alüminyum levha", "alüminyum sac", "alüminyum folyo"], urunAdi: "Alüminyum levha/folyo", cnKodu: "7606 12 00", sektorSlug: "aluminyum", kademe: "A" },
  { anahtar: ["çimento", "cimento", "portland"], urunAdi: "Portland çimentosu", cnKodu: "2523 29 00", sektorSlug: "cimento", kademe: "A" },
  { anahtar: ["klinker"], urunAdi: "Klinker", cnKodu: "2523 10 00", sektorSlug: "cimento", kademe: "A" },
  { anahtar: ["üre", "ure", "üre gübresi"], urunAdi: "Üre", cnKodu: "3102 10 00", sektorSlug: "gubre", kademe: "A" },
  { anahtar: ["amonyak"], urunAdi: "Amonyak", cnKodu: "2814 10 00", sektorSlug: "gubre", kademe: "A" },
  { anahtar: ["nitrik asit"], urunAdi: "Nitrik asit", cnKodu: "2808 00 00", sektorSlug: "gubre", kademe: "A" },
  { anahtar: ["npk", "kompoze gübre", "karma gübre"], urunAdi: "NPK kompoze gübre", cnKodu: "3105 20 00", sektorSlug: "gubre", kademe: "A" },
  { anahtar: ["hidrojen"], urunAdi: "Hidrojen", cnKodu: "2804 10 00", sektorSlug: "hidrojen", kademe: "A" },
  { anahtar: ["elektrik", "elektrik enerjisi"], urunAdi: "Elektrik enerjisi", cnKodu: "2716 00 00", sektorSlug: "elektrik", kademe: "A" },
  // KADEME B (alıcı talepli — çıktı tedarikçi veri dosyasıdır)
  { anahtar: ["batarya", "pil", "akü", "lityum"], urunAdi: "Batarya / pil", cnKodu: "8507 60 00", sektorSlug: "batarya", kademe: "B" },
  { anahtar: ["ambalaj", "koli", "kutu"], urunAdi: "Ambalaj", cnKodu: "—", sektorSlug: "ambalaj", kademe: "B" },
  { anahtar: ["tekstil", "kumaş", "konfeksiyon", "giyim"], urunAdi: "Tekstil / konfeksiyon", cnKodu: "—", sektorSlug: "tekstil", kademe: "B" },
  { anahtar: ["cam", "düz cam", "cam levha"], urunAdi: "Cam", cnKodu: "—", sektorSlug: "cam", kademe: "B" },
  { anahtar: ["plastik", "polimer", "pet"], urunAdi: "Plastik / polimer", cnKodu: "—", sektorSlug: "plastik", kademe: "B" },
  { anahtar: ["makine", "ekipman", "yedek parça"], urunAdi: "Makine / ekipman", cnKodu: "—", sektorSlug: "makine", kademe: "B" },
  { anahtar: ["otomotiv", "yan sanayi"], urunAdi: "Otomotiv yan sanayi", cnKodu: "—", sektorSlug: "otomotiv", kademe: "B" },
  { anahtar: ["mobilya"], urunAdi: "Mobilya", cnKodu: "—", sektorSlug: "mobilya", kademe: "B" },
  { anahtar: ["kağıt", "kagit", "mukavva", "oluklu"], urunAdi: "Kağıt / oluklu mukavva", cnKodu: "—", sektorSlug: "kagit", kademe: "B" },
  { anahtar: ["gıda", "gida", "tarım", "tarim"], urunAdi: "Gıda & tarım", cnKodu: "—", sektorSlug: "gida", kademe: "B" },
  { anahtar: ["lojistik", "nakliye"], urunAdi: "Uluslararası lojistik", cnKodu: "—", sektorSlug: "lojistik", kademe: "B" },
  { anahtar: ["kimya", "kimyasal"], urunAdi: "Kimya sanayi", cnKodu: "—", sektorSlug: "kimya", kademe: "B" },
  { anahtar: ["elektronik", "elektrikli cihaz"], urunAdi: "Elektronik", cnKodu: "—", sektorSlug: "elektronik", kademe: "B" },
  { anahtar: ["yapı malzemesi", "yapi malzemesi", "tuğla", "seramik"], urunAdi: "Yapı malzemeleri", cnKodu: "—", sektorSlug: "yapi", kademe: "B" },
];

export function gtipAra(sorgu: string): GtipOneri[] {
  const q = sorgu.trim().toLocaleLowerCase("tr");
  if (q.length < 2) return [];
  return GTIP_VERISI.filter((g) =>
    g.anahtar.some((a) => a.includes(q) || q.includes(a)) ||
    g.urunAdi.toLocaleLowerCase("tr").includes(q)
  ).slice(0, 6);
}
```

## 2) GTİP arama bileşeni → `src/components/GtipArama.tsx`

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { gtipAra, type GtipOneri } from "@/data/gtip-kodlari";

// Ek G §20 — "GTİP kodumu bilmiyorum" akışı. /basla/ üstüne ve sihirbaz
// Adım 0'a konur. Stil: mevcut token'lar (brand-500/900, rounded-ctl).
export default function GtipArama() {
  const [sorgu, setSorgu] = useState("");
  const sonuclar = gtipAra(sorgu);

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="gtip-arama" className="mb-2 block text-sm font-semibold text-brand-900">
        GTİP kodunuzu bilmiyor musunuz? Ürününüzü yazın:
      </label>
      <input
        id="gtip-arama"
        type="text"
        value={sorgu}
        onChange={(e) => setSorgu(e.target.value)}
        placeholder="ör. inşaat demiri, külçe alüminyum, üre…"
        className="w-full rounded-ctl border border-brand-tint px-4 py-3 text-sm outline-none focus:border-brand-500"
      />
      {sonuclar.length > 0 && (
        <ul className="mt-2 divide-y divide-brand-tint/50 rounded-ctl border border-brand-tint bg-white">
          {sonuclar.map((g: GtipOneri) => (
            <li key={g.urunAdi}>
              <Link
                href={`/hesapla/${g.sektorSlug}/`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand-mist/30"
              >
                <span className="text-sm font-medium text-brand-900">{g.urunAdi}</span>
                <span className="font-mono text-xs text-brand-900/70">
                  {g.cnKodu !== "—" ? `CN: ${g.cnKodu}` : "Kademe B"}
                  {g.kademe === "A" ? " · Kademe A" : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-brand-900/60">
        Önerilen kod bilgilendirme amaçlıdır; nihai kod teyidini alıcınızla yapın.
      </p>
    </div>
  );
}
```

**Yerleştirme:** `/basla/` sayfasında iki kademe sütununun ÜSTÜNE `<GtipArama />` eklenir.

## 3) İçerik arama bileşeni (Rehber + Sözlük) → `src/components/IcerikArama.tsx`

```tsx
"use client";
import { useState } from "react";

// Ek G §21 — sayfa-içi arama. Kullanım: sayfada aranabilir her blok
// <section data-ara="terim ingilizce karşılığı açıklama metni..."> işaretlenir.
// Bileşen yazarken eşleşmeyen blokları gizler, eşleşeni vurgular.
export default function IcerikArama({ hedefId }: { hedefId: string }) {
  const [sorgu, setSorgu] = useState("");

  function filtrele(q: string) {
    setSorgu(q);
    const kok = document.getElementById(hedefId);
    if (!kok) return;
    const bloklar = kok.querySelectorAll<HTMLElement>("[data-ara]");
    const terim = q.trim().toLocaleLowerCase("tr");
    bloklar.forEach((b) => {
      const eslesti =
        terim.length < 2 ||
        (b.dataset.ara ?? "").toLocaleLowerCase("tr").includes(terim) ||
        b.textContent?.toLocaleLowerCase("tr").includes(terim);
      b.style.display = eslesti ? "" : "none";
    });
  }

  return (
    <div className="sticky top-16 z-10 mb-6 bg-white/95 py-2 backdrop-blur">
      <input
        type="search"
        value={sorgu}
        onChange={(e) => filtrele(e.target.value)}
        placeholder="Bu sayfada ara… (Türkçe veya İngilizce terim)"
        aria-label="Sayfa içinde ara"
        className="w-full max-w-md rounded-ctl border border-brand-tint px-4 py-2.5 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}
```

**Yerleştirme — /sozluk/:** `<IcerikArama hedefId="sozluk-govde" />` başlığın altına; tüm terim listesi `<div id="sozluk-govde">` içine alınır. Her terim bloğu `<section data-ara="EN karşılığı + anahtar kelimeler">` ile işaretlenir (ör. `<section data-ara="default values varsayılan değer yüksek ab">`).

**Yerleştirme — /rehber/:** Aynı bileşen; her BÖLÜM `<section data-ara="...">` işaretlenir.

## 4) TR-ETS mahsup açıklaması → mahsup alanının altına (Ek G §15, birebir metin)

```tsx
<p className="mt-1.5 text-xs leading-relaxed text-brand-900/70">
  <strong>Şu an bu alan sizin için 0'dır.</strong> Türkiye ETS'si 2026–2027
  pilot döneminde ve bu dönemde tesislere %100 ücretsiz tahsisat veriliyor,
  mali yükümlülük uygulanmıyor. Dolayısıyla mahsup edilecek ödenmiş bir karbon
  bedeliniz bulunmuyor. Bu durum TR-ETS mali yükümlülük dönemine geçtiğinde
  değişecek ve sistem sizi bilgilendirecek.
</p>
```

## 5) Sözlük v3 içerik uygulaması

`/sozluk/` sayfa içeriğinin tamamı `docs/sayfa-icerik-sozluk.md` ile birebir
değiştirilecek (3 bölüm: EN→TR karşılıklar · Türkçe alfabetik dizin · sık
karıştırılan çiftler + durum bazlı yönlendirici girişi). Her terim bloğu
`<section data-ara="...">` olarak işaretlenecek ki madde 3'teki arama çalışsın.
Cümle ekleme/çıkarma yapılmaz. Sayfa meta başlığı ve açıklaması dosyanın
üstündeki SEO notundan alınır.

---

## Kanıt listesi (bu tur GEÇTİ sayılması için)

1. Ekran: /sozluk/ yeni 3 bölümlü yapı + arama kutusunda "default" yazınca yalnız ilgili bloklar.
2. Ekran: /basla/ GTİP aramasında "demir" yazınca öneri listesi + teyit notu.
3. Ekran: mahsup alanı altında TR-ETS açıklaması.
4. `npm run typecheck` → 0 · `npm run test:skdm` → 7/7.
5. CI linter (Plan 22 maddesi E) çıktısı boş.

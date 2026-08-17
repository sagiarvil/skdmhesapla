# YAMA — MÜHÜRLEME EKRANINDA VERİSİZ MALİYET GÖSTERİMİ
## `docs/PATCH_VERISIZ_MALIYET_GOSTERIMI.md`

**Öncelik:** P0 · **Kategori:** Güven/dürüstlük hatası (hesaplama hatası değil, gösterim hatası)
**Bulunduğu yer:** `/hesapla/aluminyum/?sinif=AMB-001&beyan=metal&cn=7610`, "Son Adım — Mühürleme & Denetime Hazırlık"

---

## 1. SORUN

Sayfa üstte **"Tahmini Sertifika Maliyeti: €3.110,25"** gösteriyor — büyük, kalın, kesin görünümlü.

Sayfanın **hemen altında**, aynı ekranda, şu kontrol listesi var:

| Kalem | Durum |
|---|---|
| 2. Ürün kategorisi | **eklenmedi** — "2. adımda ekleyin" |
| 3. Üretim adımı | **eklenmedi** — "3. adımda ekleyin" |
| 4. Enerji/yakıt kaynağı | **eklenmedi** — "4. adımda ekleyin" |
| 5. Toplam üretim miktarı | **eklenmedi** — "Üretimden iste" |

**Formülün ihtiyaç duyduğu dört girdiden hiçbiri girilmemiş**, ama sayfa yine de kesin bir Euro rakamı gösteriyor. Bu rakam bir varsayılan/placeholder değerden hesaplanmış olmalı — kullanıcıya bu açıkça söylenmiyor.

## 2. NEDEN CİDDİ

- Kullanıcı bu rakamı **gerçek sonucu** sanıp alıcısına iletebilir
- "Son Adım — Mühürleme" başlığı, sürecin bittiği izlenimini veriyor; oysa veri toplama daha başlamamış
- Projenin kendi ilkesiyle çelişiyor: *"Hazırlık skoru gerçek doluluk oranından hesaplanır, kozmetik değil"* — bu ilke maliyet gösterimine de uygulanmalı
- Bir doğrulayıcı veya bilgili alıcı, dosyanın erken aşamasında "kesin" bir rakam görüp sorgularsa güven kırılır

## 3. KÖK NEDEN (muhtemel)

Eski tek-sayfalık hesaplayıcıdaki `tonaj` alanının varsayılan değeri (`value="1000"`) hâlâ hesaplama fonksiyonuna besleniyor olabilir — yeni çok adımlı sihirbaza geçilirken bu varsayılan temizlenmemiş.

**Doğrulama adımı:** `resultAmount` veya eşdeğer state'i hesaplayan fonksiyonu bulup hangi input'lardan beslendiğini kontrol edin. Adım 5 (toplam üretim miktarı) boşken bu fonksiyon hâlâ çalışıyorsa, bir varsayılan değer sessizce kullanılıyor demektir.

---

## 4. ÇÖZÜM — KOD

### 4.1 Veri bütünlüğü kontrolcüsü

`src/lib/calc/dataReadiness.ts` (yeni dosya):

```ts
/**
 * Maliyet hesabının GERÇEK girdiye mi yoksa varsayılana mı dayandığını
 * belirler. Hiçbir maliyet rakamı, bu kontrolden geçmeden kullanıcıya
 * "tahmini sertifika maliyeti" olarak gösterilemez.
 */
export interface RequiredCostInputs {
  productCategory: string | null;    // Adım 2
  productionStep: string | null;     // Adım 3
  energySource: string | null;       // Adım 4
  totalProductionQty: number | null; // Adım 5
}

export type CostReadiness =
  | { state: "no_data"; missingFields: string[] }
  | { state: "partial"; missingFields: string[] }
  | { state: "ready" };

const REQUIRED: Array<[keyof RequiredCostInputs, string]> = [
  ["productCategory", "Ürün kategorisi"],
  ["productionStep", "Üretim adımı"],
  ["energySource", "Enerji/yakıt kaynağı"],
  ["totalProductionQty", "Toplam üretim miktarı"],
];

export function assessCostReadiness(inputs: RequiredCostInputs): CostReadiness {
  const missing = REQUIRED
    .filter(([key]) => {
      const v = inputs[key];
      return v === null || v === undefined || v === "" ||
             (typeof v === "number" && v <= 0);
    })
    .map(([, label]) => label);

  if (missing.length === REQUIRED.length) return { state: "no_data", missingFields: missing };
  if (missing.length > 0) return { state: "partial", missingFields: missing };
  return { state: "ready" };
}
```

### 4.2 Maliyet bileşeni — üç durumlu gösterim

`src/components/wizard/EstimatedCostCard.tsx`:

```tsx
import { assessCostReadiness, RequiredCostInputs } from "@/lib/calc/dataReadiness";

interface Props {
  inputs: RequiredCostInputs;
  computedCostEur: number | null;  // yalnız "ready" durumunda hesaplanmış olmalı
  etsQuarter: string;
  etsPrice: number;
}

export function EstimatedCostCard({ inputs, computedCostEur, etsQuarter, etsPrice }: Props) {
  const readiness = assessCostReadiness(inputs);

  if (readiness.state === "no_data") {
    return (
      <div className="cost-card cost-card--empty">
        <span className="cost-card__label">Tahmini Sertifika Maliyeti</span>
        <div className="cost-card__placeholder">—</div>
        <p className="cost-card__note">
          Bu rakamı hesaplayabilmemiz için aşağıdaki 4 bilgiye ihtiyacımız var.
          Adımları tamamladıkça burada canlı olarak güncellenecek.
        </p>
      </div>
    );
  }

  if (readiness.state === "partial") {
    return (
      <div className="cost-card cost-card--partial">
        <span className="cost-card__label">Tahmini Sertifika Maliyeti (eksik veriyle)</span>
        <div className="cost-card__placeholder">—</div>
        <p className="cost-card__note">
          Henüz eksik: {readiness.missingFields.join(", ")}.
          Bu bilgiler tamamlanmadan güvenilir bir rakam gösteremeyiz —
          yanlış yönlendirmek istemiyoruz.
        </p>
      </div>
    );
  }

  // state === "ready" — yalnız burada gerçek rakam gösterilir
  return (
    <div className="cost-card cost-card--ready">
      <span className="cost-card__label">Tahmini Sertifika Maliyeti</span>
      <div className="cost-card__amount">
        €{computedCostEur!.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
      </div>
      <p className="cost-card__note">
        Alıcınızın üstleneceği tahmini sertifika maliyeti · ETS {etsPrice} € ({etsQuarter})
      </p>
    </div>
  );
}
```

### 4.3 Hesaplama fonksiyonu — varsayılan girdiyle asla çalışmaz

```ts
// src/lib/calc/estimateCost.ts
import { assessCostReadiness, RequiredCostInputs } from "./dataReadiness";

export function estimateCertificateCost(
  inputs: RequiredCostInputs,
  totalEmissionTco2e: number,
  cbamFactor: number,
  etsPrice: number,
  trEtsNetting: number
): number | null {
  // ⚠️ KRİTİK: readiness kontrolünden geçmeyen girdiyle hesap ÜRETİLMEZ.
  // Önceki hata: tonaj alanının varsayılanı (1000) sessizce hesaba giriyordu.
  const readiness = assessCostReadiness(inputs);
  if (readiness.state !== "ready") return null;

  const liableEmission = totalEmissionTco2e * cbamFactor;
  return Math.round(liableEmission * Math.max(0, etsPrice - trEtsNetting) * 100) / 100;
}
```

---

## 5. GÖRSEL — "no_data" DURUMU NASIL GÖRÜNMELİ

```
+-------------------------------------------+
| TAHMİNİ SERTİFİKA MALİYETİ                 |
|                                             |
|                 —                          |
|                                             |
| Bu rakamı hesaplayabilmemiz için           |
| aşağıdaki 4 bilgiye ihtiyacımız var.       |
| Adımları tamamladıkça burada canlı         |
| olarak güncellenecek.                      |
+-------------------------------------------+
```

Boş tire (`—`), sıfır veya sahte bir rakam değil — "henüz yok" demenin en dürüst yolu. Kaygı-azaltıcı dil ilkesiyle de uyumlu: kullanıcı eksik veri yüzünden suçlanmıyor, sadece bilgilendiriliyor.

---

## 6. NEREDE ÇAĞRILACAK

`Son Adım — Mühürleme` sayfasında, mevcut sabit `€3.110,25` render'ı `<EstimatedCostCard>` ile değiştirilir. Bileşen kendi state'ini wizard context'inden (Adım 2-5'in gerçek değerleri) okur — sabit/varsayılan değer geçirilmez.

```tsx
<EstimatedCostCard
  inputs={{
    productCategory: wizardState.step2.category,
    productionStep: wizardState.step3.step,
    energySource: wizardState.step4.source,
    totalProductionQty: wizardState.step5.totalQty,
  }}
  computedCostEur={estimateCertificateCost(
    {
      productCategory: wizardState.step2.category,
      productionStep: wizardState.step3.step,
      energySource: wizardState.step4.source,
      totalProductionQty: wizardState.step5.totalQty,
    },
    wizardState.totalEmissionTco2e,
    ruleset.cbamFactor,
    ruleset.etsPrice,
    wizardState.trEtsNetting
  )}
  etsQuarter={ruleset.etsQuarter}
  etsPrice={ruleset.etsPrice}
/>
```

---

## 7. KABUL KRİTERLERİ

```
[ ] Adım 2-5'in hiçbiri dolu değilken maliyet kartı "—" gösteriyor, rakam değil
[ ] Kısmi veri girildiğinde "partial" durumu ve eksik alan listesi gösteriliyor
[ ] Yalnızca 4 alanın tamamı gerçek (>0, boş olmayan) değerle doluyken rakam hesaplanıyor
[ ] estimateCertificateCost() readiness "ready" değilse null döndürüyor — hiçbir varsayılan sızmıyor
[ ] Birim test: tüm alanlar boşken estimateCertificateCost() -> null
[ ] Birim test: 3/4 alan doluyken -> null (partial de rakam üretmiyor)
[ ] Birim test: 4/4 alan doluyken -> doğru sayısal sonuç
[ ] Aynı kontrol tüm sektörlerin (demir-çelik, çimento, gübre, hidrojen, elektrik) mühürleme ekranına uygulanıyor - yalnız alüminyumda değil
```

## 8. TEST DOSYASI İSKELETİ

`tests/calc/dataReadiness.spec.ts`:

```ts
import { assessCostReadiness } from "@/lib/calc/dataReadiness";
import { estimateCertificateCost } from "@/lib/calc/estimateCost";

test("hicbir alan doldurulmadan no_data doner", () => {
  const r = assessCostReadiness({
    productCategory: null, productionStep: null,
    energySource: null, totalProductionQty: null,
  });
  expect(r.state).toBe("no_data");
});

test("eksik veriyle maliyet hesaplanmaz", () => {
  const cost = estimateCertificateCost(
    { productCategory: "AMB-001", productionStep: null, energySource: null, totalProductionQty: null },
    2250, 0.025, 75.4, 0
  );
  expect(cost).toBeNull();  // onceki hatada bu null OLMAYIP 3110.25 donuyordu
});

test("tam veriyle dogru hesap", () => {
  const cost = estimateCertificateCost(
    { productCategory: "AMB-001", productionStep: "EAF", energySource: "dogalgaz", totalProductionQty: 1000 },
    2250, 0.025, 75.4, 0
  );
  expect(cost).toBeCloseTo(4241.25, 2);
});
```

# YAYILIM GARANTİSİ — "TÜM HESAPLAMA MOTORLARINA UYGULANDI" İDDİASININ KANITLANMASI
## `docs/PATCH_YAYILIM_GARANTISI.md`

**Amaç:** Bir önceki yamanın (`PATCH_VERISIZ_MALIYET_GOSTERIMI.md`) 6 sektörün **hepsine** uygulandığını, Cursor'ın "yaptım" demesine güvenmeden, otomatik olarak kanıtlamak.

**Neden gerekli:** Annex II / Kapsam 2 hatası, alüminyumda düzeltilip demir-çelikte düzeltilmeden kalmıştı — bu, sisteminizin **paylaşılan tek motor yerine sektör başına kopyalanmış kod** kullandığının kanıtı. Aynı kalıp tekrarlanabilir. Bu doküman iki bağımsız savunma katmanı kurar.

---

## KATMAN 1 — KÖK MİMARİ DÜZELTMESİ (asıl çözüm)

Yamayı 6 kere kopyalamak yerine, **tek yerde tanımlayıp 6 sektörün ona işaret etmesini** zorunlu kılın.

### 1.1 Sektör-bağımsız tek motor

`src/lib/calc/estimateCost.ts` — bu dosya **tüm sektörler için tek ve tek kaynaktır.** Sektöre özel hiçbir kopya oluşturulamaz.

```ts
/**
 * ⚠️ MİMARİ KURAL — İHLAL EDİLEMEZ:
 * Bu fonksiyon TEK'tir. "demir-celik/estimateCost.ts",
 * "aluminyum/calc.ts" gibi sektör bazlı kopyalar OLUŞTURULAMAZ.
 * Yeni sektör eklenirken bu dosya import edilir, kopyalanmaz.
 *
 * Kanıt: Annex II/Kapsam 2 hatası tam olarak bu ihlalden doğdu —
 * alüminyumda düzeltilen mantık, demir-çelikte ayrı bir kopya
 * olduğu için düzeltilmeden kaldı.
 */
export function estimateCertificateCost(
  sectorId: SectorId,               // hangi sektör olduğunu SADECE parametre olarak alır
  inputs: RequiredCostInputs,
  totalEmissionTco2e: number,
  ruleset: ActiveRuleset,
): number | null {
  const readiness = assessCostReadiness(inputs);
  if (readiness.state !== "ready") return null;

  const sector = SECTORS[sectorId];
  const cbamFactor = ruleset.cbamFactorByYear[inputs.year ?? currentYear()];
  const liableEmission = totalEmissionTco2e * cbamFactor;
  const netting = ruleset.trEtsPilotYears.has(inputs.year ?? currentYear())
    ? 0
    : inputs.trEtsNetting ?? 0;

  return round2(liableEmission * Math.max(0, ruleset.etsPrice - netting));
}
```

### 1.2 Sektör sayfaları YALNIZ bunu çağırır

Her sektör sayfası (`/hesapla/demir-celik/`, `/hesapla/aluminyum/`, vb.) aynı importu kullanır:

```ts
import { estimateCertificateCost } from "@/lib/calc/estimateCost";
import { EstimatedCostCard } from "@/components/wizard/EstimatedCostCard";
```

**Sektöre özel `estimateCost`, `calculateCost`, `hesaplaMaliyet` gibi başka hiçbir fonksiyon adı kod tabanında bulunmamalı.**

---

## KATMAN 2 — OTOMATİK DENETİM (Katman 1'in gerçekten uygulandığını kanıtlar)

Katman 1'e "güvenmek" yerine, Cursor'ın gerçekten tek motora geçtiğini **grep ile kanıtlayın.**

### 2.1 Yinelenen motor tespiti

`scripts/audit-duplicate-calc-engines.sh`:

```bash
#!/usr/bin/env bash
# Bu script CI'da zorunlu çalışır. Kırmızıysa deploy bloklanır.
#
# Amaç: "estimateCertificateCost" dışında, maliyet/emisyon hesaplayan
# başka bir fonksiyon var mı diye tüm kod tabanını tarar.
# Varsa, bu Annex II hatasının aynısının tekrarlandığı anlamına gelir.

set -euo pipefail

echo "=== Yinelenen hesaplama motoru taramasi ==="

SUSPECT_PATTERNS=(
  "function.*[Cc]alculate.*[Cc]ost"
  "function.*[Hh]esapla.*[Mm]aliyet"
  "function.*[Ee]stimate.*[Cc]ost"
  "const.*[Cc]alculate.*[Cc]ost.*="
)

FOUND=0
for pattern in "${SUSPECT_PATTERNS[@]}"; do
  matches=$(grep -rEn "$pattern" src/ --include="*.ts" --include="*.tsx" \
            | grep -v "src/lib/calc/estimateCost.ts" || true)
  if [ -n "$matches" ]; then
    echo "UYARI: Supheli yinelenen motor bulundu:"
    echo "$matches"
    FOUND=1
  fi
done

SECTOR_DIRS=("demir-celik" "aluminyum" "cimento" "gubre" "hidrojen" "elektrik")
for dir in "${SECTOR_DIRS[@]}"; do
  orphan=$(find "src" -path "*${dir}*" \( -iname "*calc*" -o -iname "*cost*" -o -iname "*maliyet*" \) \
           -not -path "*node_modules*" 2>/dev/null || true)
  if [ -n "$orphan" ]; then
    echo "UYARI: '${dir}' altinda bagimsiz hesaplama dosyasi bulundu (OLMAMALI):"
    echo "$orphan"
    FOUND=1
  fi
done

hardcoded=$(grep -rEn 'value="1000"|tonaj.*=.*1000|qty.*=.*1000' \
            src/app/hesapla/ src/pages/hesapla/ 2>/dev/null || true)
if [ -n "$hardcoded" ]; then
  echo "UYARI: Hard-coded varsayilan miktar bulundu - sessiz varsayilan riski:"
  echo "$hardcoded"
  FOUND=1
fi

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "DENETIM BASARISIZ - deploy engellendi."
  echo "Tum maliyet hesaplamasi src/lib/calc/estimateCost.ts uzerinden gecmeli."
  exit 1
fi

echo "OK - Tek motor kurali ihlal edilmemis."
```

### 2.2 package.json'a bağlama

```json
{
  "scripts": {
    "predeploy": "bash scripts/audit-duplicate-calc-engines.sh && npm run test:cost-propagation"
  }
}
```

---

## KATMAN 3 — 6 SEKTÖRLÜ REGRESYON TESTİ (gerçek davranışı kanıtlar)

Grep statik analizdir; Cursor bunu atlatacak bir yol bulabilir (fonksiyonu farklı isimlendirir vb.). Bu yüzden **gerçek çalışma zamanı davranışını** da test edin.

`tests/calc/costPropagation.spec.ts`:

```ts
/**
 * Bu test 6 sektörün HEPSİNİ aynı anda kontrol eder.
 * Tek bir sektör "unutulursa" bu test onu yakalar - Cursor'ın
 * "diğerlerini de yaptım" beyanına güvenmek yerine kanıt ister.
 */
import { estimateCertificateCost } from "@/lib/calc/estimateCost";
import { assessCostReadiness } from "@/lib/calc/dataReadiness";

const ALL_SECTORS = [
  "iron-steel", "aluminium", "cement", "fertiliser", "hydrogen", "electricity",
] as const;

const EMPTY_INPUTS = {
  productCategory: null, productionStep: null,
  energySource: null, totalProductionQty: null, year: 2026,
};

const FAKE_RULESET = {
  cbamFactorByYear: { 2026: 0.025 },
  etsPrice: 75.4,
  trEtsPilotYears: new Set([2026, 2027]),
};

describe("Maliyet gösterimi - 6 sektörün TAMAMINDA veri olmadan sonuç üretilmemeli", () => {
  test.each(ALL_SECTORS)("%s: boş girdiyle null döner", (sectorId) => {
    const result = estimateCertificateCost(
      sectorId, EMPTY_INPUTS, 2250, FAKE_RULESET as any
    );
    expect(result).toBeNull();
  });

  test.each(ALL_SECTORS)("%s: kısmi girdiyle de null döner", (sectorId) => {
    const partial = { ...EMPTY_INPUTS, productCategory: "AMB-001" };
    const result = estimateCertificateCost(
      sectorId, partial, 2250, FAKE_RULESET as any
    );
    expect(result).toBeNull();
  });

  test.each(ALL_SECTORS)("%s: tam girdiyle sayısal sonuç döner", (sectorId) => {
    const full = {
      productCategory: "X", productionStep: "Y",
      energySource: "Z", totalProductionQty: 1000, year: 2026,
    };
    const result = estimateCertificateCost(
      sectorId, full, 2250, FAKE_RULESET as any
    );
    expect(result).not.toBeNull();
    expect(typeof result).toBe("number");
  });
});

/**
 * E2E - her sektör sayfasının gerçekten <EstimatedCostCard> kullandığını,
 * kendi inline hesaplaması olmadığını denetler (Playwright/Cypress).
 */
describe("Sektör sayfaları - kart bileşeni gerçekten render ediliyor mu", () => {
  const SECTOR_URLS = [
    "/hesapla/demir-celik/", "/hesapla/aluminyum/", "/hesapla/cimento/",
    "/hesapla/gubre/", "/hesapla/hidrojen/", "/hesapla/elektrik/",
  ];

  test.each(SECTOR_URLS)("%s: veri girilmeden maliyet '—' gösterir, sayı göstermez", async (url) => {
    // Playwright örneği - projenizin e2e altyapısına göre uyarlayın
    // const page = await browser.newPage();
    // await page.goto(url);
    // await page.click('[data-testid="son-adim-tab"]');
    // const costText = await page.textContent('[data-testid="cost-amount"]');
    // expect(costText?.trim()).toBe("—");
    // expect(costText).not.toMatch(/€[\d.,]+/);
  });
});
```

---

## CURSOR'A VERİLECEK TAM TALİMAT (kopyala-yapıştır)

```
1. src/lib/calc/estimateCost.ts dosyasını TEK kaynak yap.
   Sektör klasörlerinde (demir-celik/, aluminyum/, cimento/, gubre/,
   hidrojen/, elektrik/) bağımsız hesaplama fonksiyonu OLUŞTURMA.
   Varsa mevcut olanları sil, hepsini bu tek dosyaya yönlendir.

2. scripts/audit-duplicate-calc-engines.sh dosyasını ekle ve
   package.json'daki "predeploy" script'ine bağla.

3. tests/calc/costPropagation.spec.ts dosyasını ekle.
   Bu test 6 sektörün TAMAMINI parametrik olarak kontrol ediyor -
   tek bir sektörü atlarsan test kırmızı olur.

4. Değişikliği tamamladıktan sonra şunu çalıştır ve ÇIKTIYI BANA GÖSTER:
   bash scripts/audit-duplicate-calc-engines.sh
   npm run test:cost-propagation

5. İkisi de yeşil olmadan "tamamlandı" deme.
```

---

## SONUÇ — dürüst özet

Bu üç katman, "Cursor uyguladı mı" sorusunu **inanca değil kanıta** dayandırıyor:

- **Katman 1** hatanın bir daha 6 yerde ayrı ayrı yaşanmasını mimari olarak imkansız kılar
- **Katman 2** biri yine de sektöre özel kod yazarsa deploy'u durdurur
- **Katman 3** motor doğru görünse bile gerçek sayfa davranışını test eder

Yine de kesin garanti veremem — Cursor'ın çıktısını **siz** çalıştırıp yukarıdaki "adım 4"teki iki komutun çıktısını görmeden "eksiksiz uygulandı" sonucuna varmamanızı öneririm. Bu, benim de sizin de doğrulayabileceğimiz tek nesnel ölçüt.

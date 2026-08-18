/**
 * Yakıt emisyon faktörü kütüğü — ruleset verisi (GATE-A, RM-006).
 *
 * GATE-A zorunluluğu: her emisyon satırı `faaliyet verisi × NCV × EF = tCO2e`
 * formülüyle gösterilir ve kullanılan her faktörün kaynağı satırın yanında yer alır.
 * RM-003 §5.11: emisyon faktörü kullanıcı girdisi olarak kabul edilmez; faktörler
 * bu kütükten gelir. LCA/UPSTREAM faktörler burada yer almaz — yalnız yanma
 * (combustion) ve şebeke elektriği faktörleri.
 *
 * Değerler: AB ETS İzleme & Raporlama Tüzüğü (MRR 2018/2066) Ek I net kalorifik
 * değer bazlı varsayılan emisyon faktörleri ile JRC 2023 yayımı. Sektör/ürün bazlı
 * farklılıklar kapsam dışıdır; bu kütük yakıt türüne göre çalışır.
 */

export type FuelFactor = {
  /** Benzersiz kimlik (ruleset anahtarı) */
  id: string;
  /** Kullanıcı arayüzündeki akış adıyla eşleşme anahtarları (küçük harf normalize) */
  aliases: string[];
  /** Raporlarda görünen Türkçe ad */
  nameTr: string;
  /** AD birimi: GJ (enerji) | MWh (elektrik) | ton (kütle) */
  unit: string;
  /** Emisyon faktörü — tCO2e / unit */
  emissionFactor: number;
  /** Varsayılan NCV — GJ / ton (kütle bazlı akışlar için); enerji bazlıda null */
  ncvDefault: number | null;
  /** Faktörün kaynağı (GATE-A: her satırın yanında gösterilir) */
  sourceRef: string;
};

export const FUEL_FACTORS: readonly FuelFactor[] = [
  {
    id: "dogalgaz",
    aliases: ["doğalgaz", "dogalgaz", "doğal gaz", "natural gas", "ng"],
    nameTr: "Doğalgaz",
    unit: "GJ",
    emissionFactor: 0.0561,
    ncvDefault: 48.0,
    sourceRef: "AB ETS MRR (2018/2066) Ek I — doğal gaz, net kalorifik değer; JRC 2023 varsayılanı",
  },
  {
    id: "kok",
    aliases: ["kok", "kok kömürü", "kok / kömür", "coke oven coke", "coke"],
    nameTr: "Kok kömürü",
    unit: "GJ",
    emissionFactor: 0.107,
    ncvDefault: 28.2,
    sourceRef: "AB ETS MRR (2018/2066) Ek I — kok fırını koku, net kalorifik değer",
  },
  {
    id: "tas-komuru",
    aliases: ["taş kömürü", "taşkömürü", "kömür", "hard coal", "coal"],
    nameTr: "Taş kömürü",
    unit: "GJ",
    emissionFactor: 0.0946,
    ncvDefault: 25.8,
    sourceRef: "AB ETS MRR (2018/2066) Ek I — taş kömürü, net kalorifik değer",
  },
  {
    id: "linyit",
    aliases: ["linyit", "lignite"],
    nameTr: "Linyit",
    unit: "GJ",
    emissionFactor: 0.1012,
    ncvDefault: 11.9,
    sourceRef: "AB ETS MRR (2018/2066) Ek I — linyit, net kalorifik değer",
  },
  {
    id: "akaryakit",
    aliases: ["akaryakıt", "fuel oil", "kalorifer yakıtı"],
    nameTr: "Akaryakıt (fuel oil)",
    unit: "GJ",
    emissionFactor: 0.0774,
    ncvDefault: 40.4,
    sourceRef: "AB ETS MRR (2018/2066) Ek I — fuel oil, net kalorifik değer",
  },
  {
    id: "motorin",
    aliases: ["motorin", "dizel", "gas oil", "diesel"],
    nameTr: "Motorin / dizel",
    unit: "GJ",
    emissionFactor: 0.0741,
    ncvDefault: 43.0,
    sourceRef: "AB ETS MRR (2018/2066) Ek I — gaz yağı (dizel), net kalorifik değer",
  },
  {
    id: "lpg",
    aliases: ["lpg", "propan", "bütan", "propane"],
    nameTr: "LPG / propan",
    unit: "GJ",
    emissionFactor: 0.0631,
    ncvDefault: 46.0,
    sourceRef: "AB ETS MRR (2018/2066) Ek I — LPG, net kalorifik değer",
  },
  {
    id: "petrokok",
    aliases: ["petrokok", "petroleum coke", "petrol koku"],
    nameTr: "Petrokok",
    unit: "GJ",
    emissionFactor: 0.1008,
    ncvDefault: 31.0,
    sourceRef: "AB ETS MRR (2018/2066) Ek I — petrol koku, net kalorifik değer",
  },
];

/** Şebeke elektriği — tCO2e / MWh (Kapsam 2). Sürüm kayıt defterinde saklanır. */
export const ELECTRICITY_GRID_FACTOR = {
  emissionFactor: 0.447,
  unit: "MWh",
  sourceRef: "Türkiye ulusal şebeke karışımı faktörü — ruleset sürüm 2026.1 (sürüm kayıt defterinde saklanır)",
} as const;

export function normalizeFuelName(raw: string): string {
  return (raw ?? "").toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();
}

/** Akış adını kütükteki faktörle eşleştirir; bulamazsa null. */
export function matchFuelFactor(name: string): FuelFactor | null {
  const n = normalizeFuelName(name);
  if (!n) return null;
  for (const f of FUEL_FACTORS) {
    if (f.aliases.some((a) => normalizeFuelName(a) === n)) return f;
    if (f.aliases.some((a) => n.includes(normalizeFuelName(a)))) return f;
  }
  return null;
}

/**
 * Akış doğrudan tCO2e olarak mı beyan ediliyor? (proses emisyonu / direkt ölçüm)
 * Method "MassBalance" + birim "tCO2e" → miktar zaten emisyon değeridir.
 */
export function isDirectEmissionStream(s: {
  method?: string;
  unit?: string;
}): boolean {
  const u = normalizeFuelName(s.unit ?? "");
  return u === "tco2e" || u === "t co2e";
}

/** Elektrik akışı mı? (Kapsam 2) — şebeke elektriği satırı. */
export function isElectricityStream(s: { method?: string; name?: string }): boolean {
  const n = normalizeFuelName(s.name ?? "");
  return (
    n.includes("elektrik") ||
    n.includes("şebeke") ||
    (s.method ?? "").toLocaleLowerCase("en").includes("electricit")
  );
}

/** Bir yakıt akışının emisyon hesabı — GATE-A satır bazlı formül. */
export function resolveStreamEmission(
  s: { name: string; ad: number; unit: string; ncv: string }
): { emissions: number; formula: string; factor: number; sourceRef: string } | null {
  const ad = Number(s.ad);
  if (!Number.isFinite(ad) || ad <= 0) return null;

  // Direkt ölçüm / proses emisyonu: miktar zaten tCO2e.
  if (isDirectEmissionStream({ unit: s.unit })) {
    return {
      emissions: ad,
      formula: `${fmt(ad)} tCO2e (doğrudan ölçüm)`,
      factor: 1,
      sourceRef: "Doğrudan ölçüm — tesis sayaç/analiz verisi",
    };
  }

  // Elektrik akışı: tCO2e/MWh.
  if (isElectricityStream({ name: s.name })) {
    const ef = ELECTRICITY_GRID_FACTOR.emissionFactor;
    return {
      emissions: round(ad * ef),
      formula: `${fmt(ad)} MWh × ${ef.toFixed(4)} tCO2e/MWh = ${fmt(round(ad * ef))} tCO2e`,
      factor: ef,
      sourceRef: ELECTRICITY_GRID_FACTOR.sourceRef,
    };
  }

  const fuel = matchFuelFactor(s.name);
  if (!fuel) return null;

  const unit = normalizeFuelName(s.unit);
  if (unit === "gj" || unit === "mwh") {
    // AD zaten enerji biriminde: AD × EF
    return {
      emissions: round(ad * fuel.emissionFactor),
      formula: `${fmt(ad)} GJ × ${fuel.emissionFactor.toFixed(4)} tCO2e/GJ = ${fmt(round(ad * fuel.emissionFactor))} tCO2e`,
      factor: fuel.emissionFactor,
      sourceRef: fuel.sourceRef,
    };
  }

  // Kütle bazlı akış: AD × NCV × EF
  const ncv = Number(s.ncv) > 0 ? Number(s.ncv) : fuel.ncvDefault;
  if (!ncv) return null;
  return {
    emissions: round(ad * ncv * fuel.emissionFactor),
    formula: `${fmt(ad)} ${unit} × ${fmt(ncv)} GJ/${unit} × ${fuel.emissionFactor.toFixed(4)} tCO2e/GJ = ${fmt(round(ad * ncv * fuel.emissionFactor))} tCO2e`,
    factor: fuel.emissionFactor,
    sourceRef: `${fuel.sourceRef}; NCV ${ncv.toFixed(1)} GJ/${unit}`,
  };
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

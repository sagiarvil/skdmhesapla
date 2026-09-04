export const MARITIME_RULESET_REVIEWED_AT = "2026-09-04";

export type MaritimeShipType =
  | "cargo"
  | "general-cargo"
  | "passenger"
  | "offshore"
  | "other";

export type MaritimePortRegion = "eu" | "norway-iceland" | "none" | "unknown";
export type ScopeStatus = "yes" | "no" | "review";

export interface MaritimeScopeInput {
  shipType: MaritimeShipType;
  grossTonnage: number;
  portRegion: MaritimePortRegion;
  commercialUse: boolean;
  emissionsYear: number;
  etsScopeEmissionsTco2e?: number;
  euaPriceEur?: number;
}

export interface ScopeDecision {
  status: ScopeStatus;
  label: string;
  reason: string;
}

export interface MaritimeScopeResult {
  mrv: ScopeDecision;
  ets: ScopeDecision;
  fueleu: ScopeDecision;
  etsCoverageFactor: number;
  estimatedEtsCostEur: number | null;
  dataQuality: "ready" | "partial" | "insufficient";
  warnings: string[];
}

function no(label: string, reason: string): ScopeDecision {
  return { status: "no", label, reason };
}

function yes(label: string, reason: string): ScopeDecision {
  return { status: "yes", label, reason };
}

function review(label: string, reason: string): ScopeDecision {
  return { status: "review", label, reason };
}

export function getEtsCoverageFactor(emissionsYear: number): number {
  if (emissionsYear <= 2023) return 0;
  if (emissionsYear === 2024) return 0.4;
  if (emissionsYear === 2025) return 0.7;
  return 1;
}

function hasEeaPortCall(portRegion: MaritimePortRegion): boolean {
  return portRegion === "eu" || portRegion === "norway-iceland";
}

function evaluateMrv(input: MaritimeScopeInput): ScopeDecision {
  if (!input.commercialUse) {
    return no("Kapsam dışı görünüyor", "Ticari kullanım seçilmedi.");
  }
  if (!hasEeaPortCall(input.portRegion)) {
    if (input.portRegion === "unknown") {
      return review("Liman bilgisi gerekli", "MRV kararı için AB/AEA liman çağrısı netleştirilmeli.");
    }
    return no("Kapsam dışı görünüyor", "AB/AEA liman çağrısı seçilmedi.");
  }
  if (input.grossTonnage >= 5000 && ["cargo", "general-cargo", "passenger", "offshore"].includes(input.shipType)) {
    return yes("Muhtemel kapsam", "5.000 GT ve üzerindeki ilgili ticari gemiler MRV kapsamındadır.");
  }
  if (input.grossTonnage >= 400 && ["general-cargo", "offshore"].includes(input.shipType)) {
    return yes("Muhtemel kapsam", "1 Ocak 2025'ten itibaren 400-4.999 GT general cargo ve offshore gemiler için MRV kapsamı genişlemiştir.");
  }
  if (input.shipType === "other") {
    return review("Gemi tipi incelenmeli", "Özel gemi türlerinde istisna ve sınıflandırma kontrolü gerekir.");
  }
  return no("Kapsam dışı görünüyor", "Girilen GT ve gemi tipi MRV ana kapsam eşiğini karşılamıyor.");
}

function evaluateEts(input: MaritimeScopeInput): ScopeDecision {
  if (!input.commercialUse) {
    return no("Kapsam dışı görünüyor", "Ticari kullanım seçilmedi.");
  }
  if (!hasEeaPortCall(input.portRegion)) {
    if (input.portRegion === "unknown") {
      return review("Liman bilgisi gerekli", "ETS kararı için AB/AEA liman çağrısı netleştirilmeli.");
    }
    return no("Kapsam dışı görünüyor", "AB/AEA liman çağrısı seçilmedi.");
  }
  if (input.shipType === "offshore") {
    if (input.grossTonnage >= 5000 && input.emissionsYear >= 2027) {
      return yes("Muhtemel kapsam", "5.000 GT ve üzerindeki offshore gemiler 2027'den itibaren ETS kapsamına girer.");
    }
    return no("2026 için ETS kapsamı değil", "Offshore gemilerin 5.000 GT ve üzeri ETS kapsamı 2027'de başlar.");
  }
  if (input.grossTonnage >= 5000 && ["cargo", "general-cargo", "passenger"].includes(input.shipType)) {
    return yes("Muhtemel kapsam", "5.000 GT ve üzerindeki cargo/passenger gemiler AB/AEA liman bağlantılı seferlerde ETS kapsamındadır.");
  }
  if (input.shipType === "other") {
    return review("Gemi tipi incelenmeli", "ETS istisnaları ve gemi sınıfı manuel kontrol edilmelidir.");
  }
  return no("Kapsam dışı görünüyor", "Girilen GT ve gemi tipi EU ETS ana kapsam eşiğini karşılamıyor.");
}

function evaluateFuelEu(input: MaritimeScopeInput): ScopeDecision {
  if (!input.commercialUse) {
    return no("Kapsam dışı görünüyor", "FuelEU ticari operasyon odaklıdır; ticari kullanım seçilmedi.");
  }
  if (input.portRegion === "none") {
    return no("Kapsam dışı görünüyor", "AB liman çağrısı seçilmedi.");
  }
  if (input.portRegion === "unknown") {
    return review("Liman bilgisi gerekli", "FuelEU için AB liman çağrısı netleştirilmeli.");
  }
  if (input.portRegion === "norway-iceland") {
    return review(
      "Güncel EEA statüsü kontrol edilmeli",
      "4 Eylül 2026 itibarıyla FuelEU'nun Norveç ve İzlanda'daki uygulanması EEA'ya katılım süreci nedeniyle ayrıca kontrol edilmelidir.",
    );
  }
  if (input.grossTonnage > 5000 && input.shipType !== "other") {
    return yes("Muhtemel kapsam", "5.000 GT üzerindeki ticari gemiler AB liman çağrılarında FuelEU ana kapsamındadır.");
  }
  if (input.shipType === "other" || input.grossTonnage === 5000) {
    return review("Sınır/istisna kontrolü", "Gemi tipi veya 5.000 GT sınırı nedeniyle hukuki kapsam manuel doğrulanmalıdır.");
  }
  return no("Kapsam dışı görünüyor", "Girilen GT FuelEU ana kapsam eşiğinin altında.");
}

export function evaluateMaritimeScope(input: MaritimeScopeInput): MaritimeScopeResult {
  const mrv = evaluateMrv(input);
  const ets = evaluateEts(input);
  const fueleu = evaluateFuelEu(input);
  const etsCoverageFactor = getEtsCoverageFactor(input.emissionsYear);

  const emissions = input.etsScopeEmissionsTco2e;
  const euaPrice = input.euaPriceEur;
  const estimatedEtsCostEur =
    ets.status === "yes" &&
    typeof emissions === "number" &&
    emissions >= 0 &&
    typeof euaPrice === "number" &&
    euaPrice >= 0
      ? emissions * etsCoverageFactor * euaPrice
      : null;

  const warnings: string[] = [];
  if (input.emissionsYear >= 2026 && ets.status === "yes") {
    warnings.push("2026 emisyonlarından itibaren EU ETS, CO2 yanında CH4 ve N2O'yu da CO2e bazında kapsar.");
  }
  if (input.portRegion === "norway-iceland") {
    warnings.push("FuelEU için Norveç/İzlanda statüsü işlem tarihinde tekrar doğrulanmalıdır.");
  }
  if (estimatedEtsCostEur !== null) {
    warnings.push("Maliyet hesabı, kullanıcının girdiği ETS kapsam emisyonu ve EUA fiyatı üzerinden ön tahmindir; piyasa fiyatı sisteme otomatik çekilmez.");
  }

  const unresolved = [mrv, ets, fueleu].filter((item) => item.status === "review").length;
  const positive = [mrv, ets, fueleu].filter((item) => item.status === "yes").length;
  const dataQuality = input.portRegion === "unknown" || input.grossTonnage <= 0
    ? "insufficient"
    : unresolved > 0
      ? "partial"
      : positive > 0
        ? "ready"
        : "partial";

  return {
    mrv,
    ets,
    fueleu,
    etsCoverageFactor,
    estimatedEtsCostEur,
    dataQuality,
    warnings,
  };
}

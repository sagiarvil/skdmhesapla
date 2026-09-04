import type {
  MaritimeScopeInput,
  MaritimeScopeLevel,
  MaritimeScopeResult,
} from "./types";

export const MARITIME_RULESET_REVIEWED_AT = "2026-09-04";

const complianceRoles = new Set(["gemi-sahibi", "ism-doc-company", "gemi-isletmecisi"]);
const partnerRoles = new Set(["charterer", "forwarder", "liman-acente", "ihracatci"]);

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function hasEeaPortConnection(input: MaritimeScopeInput) {
  return input.euPortCallsPerYear > 0 && (input.portRegion === "eu" || input.portRegion === "norway-iceland");
}

function mrvDecision(input: MaritimeScopeInput): { level: MaritimeScopeLevel; reason: string } {
  if (!complianceRoles.has(input.role)) {
    return { level: "review", reason: "Bu firma rolünde doğrudan MRV yükümlülük sahibi otomatik varsayılmaz; ilgili shipping company / ISM sorumluluğu ayrıca teyit edilmelidir." };
  }
  if (input.portRegion === "unknown") return { level: "review", reason: "AB/AEA liman bağlantısı netleşmeden MRV kapsamı belirlenemez." };
  if (!hasEeaPortConnection(input)) return { level: "out", reason: "Girilen bilgilerde AB/AEA liman bağlantısı bulunmuyor." };
  if (input.grossTonnage >= 5000 && ["cargo", "general-cargo", "passenger", "offshore"].includes(input.shipType)) {
    return { level: "critical", reason: "5.000 GT ve üzerindeki ilgili ticari gemi ile AB/AEA liman bağlantısı MRV ana kapsam sinyali oluşturuyor." };
  }
  if (input.emissionsYear >= 2025 && input.grossTonnage >= 400 && input.grossTonnage < 5000 && ["general-cargo", "offshore"].includes(input.shipType)) {
    return { level: "critical", reason: "1 Ocak 2025'ten itibaren 400–4.999 GT general cargo ve offshore gemiler MRV kapsam genişlemesine dahildir." };
  }
  if (input.shipType === "other" || input.grossTonnage === 400) {
    return { level: "review", reason: "Gemi tipi veya eşik sınırı nedeniyle istisna/sınıflandırma kontrolü gerekir." };
  }
  return { level: "out", reason: "Girilen gemi tipi ve GT, MRV ana kapsam eşiğini karşılamıyor." };
}

function etsDecision(input: MaritimeScopeInput): { level: MaritimeScopeLevel; reason: string } {
  if (!complianceRoles.has(input.role)) {
    return { level: "review", reason: "EU ETS sorumluluğu charterer/forwarder/ihracatçıya otomatik atanamaz; sorumlu shipping company ayrıca belirlenmelidir." };
  }
  if (input.portRegion === "unknown") return { level: "review", reason: "AB/AEA liman bağlantısı netleşmeden ETS kapsamı belirlenemez." };
  if (!hasEeaPortConnection(input)) return { level: "out", reason: "Girilen bilgilerde AB/AEA liman bağlantısı bulunmuyor." };
  if (input.shipType === "offshore") {
    if (input.emissionsYear >= 2027 && input.grossTonnage >= 5000) {
      return { level: "critical", reason: "5.000 GT ve üzeri offshore gemiler için EU ETS kapsamı 2027'den itibaren başlar." };
    }
    return { level: "out", reason: "5.000 GT ve üzeri offshore gemiler için EU ETS kapsam başlangıcı 2027'dir." };
  }
  if (input.grossTonnage >= 5000 && ["cargo", "general-cargo", "passenger"].includes(input.shipType)) {
    return { level: "critical", reason: "5.000 GT ve üzerindeki cargo/passenger gemi ile AB/AEA liman bağlantısı EU ETS ana kapsam sinyali oluşturuyor." };
  }
  if (input.shipType === "other") return { level: "review", reason: "Özel gemi sınıfında ETS istisnaları ayrıca doğrulanmalıdır." };
  return { level: "out", reason: "Girilen gemi tipi ve GT, EU ETS ana kapsam eşiğini karşılamıyor." };
}

function fueleuDecision(input: MaritimeScopeInput): { level: MaritimeScopeLevel; reason: string } {
  if (!complianceRoles.has(input.role)) {
    return { level: "review", reason: "FuelEU yükümlülüğü bu firma rolüne otomatik atanamaz; sorumlu shipping company ve operasyon yapısı doğrulanmalıdır." };
  }
  if (input.portRegion === "unknown") return { level: "review", reason: "AB liman bağlantısı netleşmeden FuelEU kapsamı belirlenemez." };
  if (input.portRegion === "norway-iceland") {
    return { level: "review", reason: "4 Eylül 2026 itibarıyla Norveç/İzlanda FuelEU uygulama statüsü EEA katılım süreci nedeniyle işlem tarihinde yeniden doğrulanmalıdır." };
  }
  if (input.portRegion !== "eu" || input.euPortCallsPerYear <= 0) return { level: "out", reason: "Girilen bilgilerde AB liman çağrısı bulunmuyor." };
  if (input.grossTonnage > 5000 && input.shipType !== "other") {
    return { level: "critical", reason: "5.000 GT üzerindeki ticari gemi ve AB liman çağrısı FuelEU ana kapsam sinyali oluşturuyor." };
  }
  if (input.grossTonnage === 5000 || input.shipType === "other") {
    return { level: "review", reason: "5.000 GT sınırı veya gemi sınıfı nedeniyle kapsam ek veriyle netleştirilmelidir." };
  }
  return { level: "out", reason: "Girilen GT, FuelEU ana kapsam eşiğinin altında." };
}

export function getEtsCoverageFactor(emissionsYear: number) {
  if (emissionsYear <= 2023) return 0;
  if (emissionsYear === 2024) return 0.4;
  if (emissionsYear === 2025) return 0.7;
  return 1;
}

export function assessMaritimeScope(input: MaritimeScopeInput): MaritimeScopeResult {
  const mrv = mrvDecision(input);
  const ets = etsDecision(input);
  const fueleu = fueleuDecision(input);

  const readinessScore = clamp(
    (input.hasFuelRecords ? 25 : 0) +
    (input.hasVoyageRecords ? 25 : 0) +
    (input.hasMonitoringPlan ? 20 : 0) +
    (input.euPortCallsPerYear > 0 ? 15 : 0) +
    (input.grossTonnage > 0 ? 15 : 0),
  );

  const missingEvidence = [
    !input.hasFuelRecords ? "Yakıt / BDN kayıtları" : null,
    !input.hasVoyageRecords ? "Sefer ve liman uğrak kayıtları" : null,
    !input.hasMonitoringPlan ? "MRV Monitoring Plan" : null,
    input.euPortCallsPerYear <= 0 ? "AB/AEA liman uğrak bilgisi" : null,
    input.grossTonnage <= 0 ? "Gross tonnage bilgisi" : null,
  ].filter(Boolean) as string[];

  const cbamPartnerPotential: MaritimeScopeLevel = input.carriesCbamGoods && partnerRoles.has(input.role)
    ? "critical"
    : input.carriesCbamGoods
      ? "likely"
      : partnerRoles.has(input.role)
        ? "review"
        : "out";

  const etsCoverageFactor = getEtsCoverageFactor(input.emissionsYear);
  const emissions = input.etsScopeEmissionsTco2e;
  const price = input.euaPriceEur;
  const estimatedEtsCostEur = ets.level === "critical" && typeof emissions === "number" && emissions >= 0 && typeof price === "number" && price >= 0
    ? emissions * etsCoverageFactor * price
    : null;

  const commercialRoute = cbamPartnerPotential === "critical"
    ? "partner-desk"
    : [mrv.level, ets.level, fueleu.level].includes("critical")
      ? "annual-compliance"
      : [mrv.level, ets.level, fueleu.level].includes("review")
        ? "paid-pre-analysis"
        : "free";

  const headline = commercialRoute === "partner-desk"
    ? "Firmanız yalnız uyum müşterisi değil; CBAM müşteri kanalı olabilir."
    : commercialRoute === "annual-compliance"
      ? "EU MRV / EU ETS / FuelEU tarafında yıllık yönetim gerektiren güçlü kapsam sinyali var."
      : commercialRoute === "paid-pre-analysis"
        ? "Kapsam kararı için gemi, rota veya sorumluluk zincirinde ek veri gerekiyor."
        : "Girilen verilerde ana kapsam sinyali düşük görünüyor.";

  const warnings: string[] = [];
  if (input.emissionsYear >= 2026 && ets.level === "critical") warnings.push("2026 emisyonlarından itibaren EU ETS, CO2 yanında CH4 ve N2O'yu da CO2e bazında kapsar.");
  if (input.portRegion === "norway-iceland") warnings.push("FuelEU Norveç/İzlanda statüsü işlem tarihinde resmî kaynaktan tekrar doğrulanmalıdır.");
  if (estimatedEtsCostEur !== null) warnings.push("ETS maliyeti canlı piyasa fiyatı değildir; kullanıcının girdiği ETS kapsam CO2e ve EUA fiyatı üzerinden otomatik ön tahmindir.");

  return {
    mrv: mrv.level,
    ets: ets.level,
    fueleu: fueleu.level,
    cbamPartnerPotential,
    readinessScore,
    missingEvidence,
    commercialRoute,
    headline,
    decisionReasons: {
      mrv: mrv.reason,
      ets: ets.reason,
      fueleu: fueleu.reason,
      partner: cbamPartnerPotential === "critical"
        ? "CBAM kapsamlı yük + müşteri portföyüne erişen firma rolü, partner dağıtım modeli için güçlü sinyal oluşturuyor."
        : "Partner potansiyeli için CBAM kapsamlı ihracatçı portföyü ve müşteri erişimi birlikte doğrulanmalıdır.",
    },
    etsCoverageFactor,
    estimatedEtsCostEur,
    warnings,
  };
}

export function levelLabel(value: MaritimeScopeLevel) {
  switch (value) {
    case "critical": return "Kapsamda görünüyor";
    case "likely": return "Güçlü sinyal";
    case "review": return "Ek veri gerekiyor";
    default: return "Kapsam dışı görünüyor";
  }
}

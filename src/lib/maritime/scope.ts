import type { MaritimeScopeInput, MaritimeScopeLevel, MaritimeScopeResult } from "./types";
import { etsPhaseIn, MARITIME_RULESET_REVIEWED_AT } from "./regulatory";

export { MARITIME_RULESET_REVIEWED_AT };

const partnerRoles = new Set(["charterer", "forwarder", "liman-acente", "ihracatci"]);

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function hasEeaPortConnection(input: MaritimeScopeInput) {
  return input.euPortCallsPerYear > 0 && (input.portRegion === "eu" || input.portRegion === "norway-iceland");
}

function responsibilityDecision(input: MaritimeScopeInput): { ok: boolean; reason?: string } {
  if (input.role === "gemi-sahibi") return { ok: true };
  if (input.role === "ism-doc-company" || input.role === "gemi-isletmecisi") {
    return input.hasFormalResponsibilityMandate
      ? { ok: true }
      : { ok: false, reason: "Registered owner dışındaki sorumlu şirket için ISM sorumluluğunun devrini gösteren resmî mandate/delegation belgesi gerekir." };
  }
  return { ok: false, reason: "Bu rol doğrudan shipping company sorumlusu olarak varsayılamaz; registered owner veya usulüne uygun yetkilendirilmiş ISM/DOC company belirlenmelidir." };
}

function mrvDecision(input: MaritimeScopeInput): { level: MaritimeScopeLevel; reason: string } {
  const responsibility = responsibilityDecision(input);
  if (!responsibility.ok) return { level: "review", reason: responsibility.reason! };
  if (input.portRegion === "unknown") return { level: "review", reason: "AB/AEA liman bağlantısı netleşmeden MRV kapsamı belirlenemez." };
  if (!hasEeaPortConnection(input)) return { level: "out", reason: "Girilen bilgilerde AB/AEA liman bağlantısı bulunmuyor." };
  if (input.grossTonnage >= 5000 && ["cargo", "general-cargo", "passenger", "offshore"].includes(input.shipType)) {
    return { level: "critical", reason: "5.000 GT ve üzerindeki ilgili ticari gemi ile AB/AEA liman bağlantısı EU MRV ana kapsamına giriyor." };
  }
  if (input.emissionsYear >= 2025 && input.grossTonnage >= 400 && input.grossTonnage < 5000 && ["general-cargo", "offshore"].includes(input.shipType)) {
    return { level: "critical", reason: "1 Ocak 2025'ten itibaren 400–4.999 GT general cargo ve offshore gemiler EU MRV kapsamındadır." };
  }
  if (input.shipType === "other") return { level: "review", reason: "Gemi kategorisi kesinleşmeden MRV kapsamı otomatik kapatılamaz." };
  return { level: "out", reason: "Girilen gemi tipi ve GT, EU MRV ana kapsam eşiğini karşılamıyor." };
}

function etsDecision(input: MaritimeScopeInput): { level: MaritimeScopeLevel; reason: string } {
  const responsibility = responsibilityDecision(input);
  if (!responsibility.ok) return { level: "review", reason: responsibility.reason! };
  if (input.portRegion === "unknown") return { level: "review", reason: "AB/AEA liman bağlantısı netleşmeden EU ETS kapsamı belirlenemez." };
  if (!hasEeaPortConnection(input)) return { level: "out", reason: "Girilen bilgilerde AB/AEA liman bağlantısı bulunmuyor." };
  if (input.shipType === "offshore") {
    return input.emissionsYear >= 2027 && input.grossTonnage >= 5000
      ? { level: "critical", reason: "5.000 GT ve üzeri offshore gemiler EU ETS kapsamına 2027 raporlama döneminden itibaren girer." }
      : { level: "out", reason: "Offshore gemiler için EU ETS kapsam başlangıcı 2027 raporlama dönemidir." };
  }
  if (input.grossTonnage >= 5000 && ["cargo", "general-cargo", "passenger"].includes(input.shipType)) {
    return { level: "critical", reason: "5.000 GT ve üzerindeki cargo/passenger gemi ve AB/AEA rota bağlantısı EU ETS ana kapsamına giriyor." };
  }
  if (input.shipType === "other") return { level: "review", reason: "Özel gemi kategorisinde kapsam/istisna kontrolü gerekir." };
  return { level: "out", reason: "Girilen gemi tipi ve GT, EU ETS ana kapsam eşiğini karşılamıyor." };
}

function fueleuDecision(input: MaritimeScopeInput): { level: MaritimeScopeLevel; reason: string } {
  const responsibility = responsibilityDecision(input);
  if (!responsibility.ok) return { level: "review", reason: responsibility.reason! };
  if (input.portRegion === "unknown") return { level: "review", reason: "AB liman bağlantısı netleşmeden FuelEU kapsamı belirlenemez." };
  if (input.portRegion === "norway-iceland") return { level: "review", reason: "FuelEU için Norveç/İzlanda uygulama statüsü işlem tarihinde resmî kaynaktan yeniden kontrol edilmelidir." };
  if (input.portRegion !== "eu" || input.euPortCallsPerYear <= 0) return { level: "out", reason: "Girilen bilgilerde AB liman çağrısı bulunmuyor." };
  if (input.grossTonnage > 5000 && input.shipType !== "other") return { level: "critical", reason: "5.000 GT üzerindeki ticari cargo/passenger gemi ve AB liman çağrısı FuelEU ana kapsamına giriyor." };
  if (input.grossTonnage === 5000 || input.shipType === "other") return { level: "review", reason: "5.000 GT sınırı veya gemi kategorisi nedeniyle ek kapsam kontrolü gerekir." };
  return { level: "out", reason: "Girilen GT, FuelEU ana kapsam eşiğinin altında." };
}

export function getEtsCoverageFactor(emissionsYear: number) {
  return etsPhaseIn(emissionsYear);
}

export function assessMaritimeScope(input: MaritimeScopeInput): MaritimeScopeResult {
  const mrv = mrvDecision(input);
  const ets = etsDecision(input);
  const fueleu = fueleuDecision(input);
  const readinessScore = clamp(
    (input.hasFuelRecords ? 22 : 0) +
    (input.hasVoyageRecords ? 22 : 0) +
    (input.hasMonitoringPlan ? 18 : 0) +
    (input.euPortCallsPerYear > 0 ? 14 : 0) +
    (input.grossTonnage > 0 ? 14 : 0) +
    (responsibilityDecision(input).ok ? 10 : 0),
  );
  const missingEvidence = [
    !input.hasFuelRecords ? "Yakıt / BDN kayıtları" : null,
    !input.hasVoyageRecords ? "Sefer ve liman uğrak kayıtları" : null,
    !input.hasMonitoringPlan ? "Monitoring Plan" : null,
    input.euPortCallsPerYear <= 0 ? "AB/AEA liman uğrak bilgisi" : null,
    input.grossTonnage <= 0 ? "Gross tonnage bilgisi" : null,
    !responsibilityDecision(input).ok ? "Shipping company sorumluluk / mandate kanıtı" : null,
  ].filter(Boolean) as string[];

  const cbamPartnerPotential: MaritimeScopeLevel = input.carriesCbamGoods && partnerRoles.has(input.role)
    ? "critical"
    : input.carriesCbamGoods ? "likely" : partnerRoles.has(input.role) ? "review" : "out";

  const etsCoverageFactor = etsPhaseIn(input.emissionsYear);
  const emissions = input.etsScopeEmissionsTco2e;
  const price = input.euaPriceEur;
  const estimatedEtsCostEur = ets.level === "critical" && typeof emissions === "number" && emissions >= 0 && typeof price === "number" && price >= 0
    ? emissions * etsCoverageFactor * price : null;

  const commercialRoute = cbamPartnerPotential === "critical" ? "partner-desk"
    : [mrv.level, ets.level, fueleu.level].includes("critical") ? "annual-compliance"
      : [mrv.level, ets.level, fueleu.level].includes("review") ? "paid-pre-analysis" : "free";

  const headline = commercialRoute === "partner-desk"
    ? "Firmanız denizcilik uyumuna ek olarak CBAM ihracatçı kanalı oluşturabilir."
    : commercialRoute === "annual-compliance"
      ? "EU MRV / EU ETS / FuelEU tarafında yıllık uyum dosyası gerektiren kapsam tespit edildi."
      : commercialRoute === "paid-pre-analysis"
        ? "Kapsam kararını tamamlamak için sorumluluk, gemi veya rota verisi eksik."
        : "Girilen verilerde ana kapsam sinyali görünmüyor.";

  const warnings: string[] = [];
  if (input.emissionsYear >= 2026 && ets.level === "critical") warnings.push("2026 emisyonlarından itibaren maritime EU ETS CO₂ yanında CH₄ ve N₂O'yu da kapsar.");
  if (input.portRegion === "norway-iceland") warnings.push("FuelEU Norveç/İzlanda statüsü işlem tarihinde resmî kaynaktan yeniden doğrulanmalıdır.");
  if (estimatedEtsCostEur !== null) warnings.push("ETS maliyeti canlı piyasa fiyatı değildir; kullanıcı girdisi EUA fiyatı üzerinden ön tahmindir.");

  return {
    mrv: mrv.level, ets: ets.level, fueleu: fueleu.level, cbamPartnerPotential,
    readinessScore, missingEvidence, commercialRoute, headline,
    decisionReasons: {
      mrv: mrv.reason,
      ets: ets.reason,
      fueleu: fueleu.reason,
      partner: cbamPartnerPotential === "critical"
        ? "CBAM kapsamlı yük/müşteri erişimi partner dağıtım modeli için güçlü sinyal oluşturuyor."
        : "Partner potansiyeli için CBAM kapsamlı ihracatçı portföyü ayrıca doğrulanmalıdır.",
    },
    etsCoverageFactor, estimatedEtsCostEur, warnings,
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

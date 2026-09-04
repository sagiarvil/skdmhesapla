import type { MaritimeScopeInput, MaritimeScopeResult, MaritimeScopeLevel } from "./types";

function level(score: number): MaritimeScopeLevel {
  if (score >= 80) return "critical";
  if (score >= 55) return "likely";
  if (score >= 25) return "review";
  return "out";
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function assessMaritimeScope(input: MaritimeScopeInput): MaritimeScopeResult {
  const gt = Number.isFinite(input.grossTonnage) ? input.grossTonnage : 0;
  const calls = Number.isFinite(input.euPortCallsPerYear) ? input.euPortCallsPerYear : 0;
  const isShippingOperator = ["gemi-sahibi", "ism-doc-company", "gemi-isletmecisi", "charterer"].includes(input.role);
  const isMarketChannel = ["forwarder", "liman-acente", "ihracatci"].includes(input.role);

  const base = (gt >= 5000 ? 42 : gt >= 400 ? 18 : 0) + (calls > 0 ? 32 : 0) + (isShippingOperator ? 18 : 0);
  const evidenceScore =
    (input.hasFuelRecords ? 22 : 0) +
    (input.hasVoyageRecords ? 22 : 0) +
    (input.hasMonitoringPlan ? 18 : 0) +
    (calls > 0 ? 18 : 0) +
    (gt > 0 ? 20 : 0);

  const missingEvidence = [
    !input.hasFuelRecords ? "Yakıt/BDN kayıtları" : null,
    !input.hasVoyageRecords ? "Sefer ve liman uğrak kayıtları" : null,
    !input.hasMonitoringPlan ? "MRV Monitoring Plan" : null,
    calls <= 0 ? "AB/EEA liman uğrak bilgisi" : null,
    gt <= 0 ? "Gross tonnage bilgisi" : null,
  ].filter(Boolean) as string[];

  const mrvScore = base;
  const etsScore = base + (calls >= 4 ? 8 : 0);
  const fueleuScore = base + (calls >= 1 ? 10 : 0);
  const partnerScore = (input.carriesCbamGoods ? 55 : 0) + (isMarketChannel ? 25 : 0) + (calls > 0 ? 10 : 0);

  const readinessScore = clamp(evidenceScore);
  const mrv = level(mrvScore);
  const ets = level(etsScore);
  const fueleu = level(fueleuScore);
  const cbamPartnerPotential = level(partnerScore);

  const commercialRoute = cbamPartnerPotential === "critical"
    ? "partner-desk"
    : [mrv, ets, fueleu].includes("critical")
      ? "annual-compliance"
      : [mrv, ets, fueleu].includes("likely")
        ? "paid-pre-analysis"
        : "free";

  const headline = commercialRoute === "partner-desk"
    ? "Denizcilik firmanız yalnız uyum müşterisi değil; CBAM müşteri kanalı olabilir."
    : commercialRoute === "annual-compliance"
      ? "EU MRV / EU ETS / FuelEU tarafında yıllık yönetim gerektiren yüksek maruziyet görünüyor."
      : commercialRoute === "paid-pre-analysis"
        ? "Kapsam ihtimali var; veri ve kanıt zinciri netleşmeden karar verilmemeli."
        : "İlk sinyal düşük; yine de sefer ve GT verisi kesinleşmeden nihai yorum yapılmamalı.";

  return { mrv, ets, fueleu, cbamPartnerPotential, readinessScore, missingEvidence, commercialRoute, headline };
}

export function levelLabel(level: MaritimeScopeLevel) {
  switch (level) {
    case "critical": return "Kritik";
    case "likely": return "Kapsamda Görünüyor";
    case "review": return "İnceleme Gerekli";
    default: return "Düşük Sinyal";
  }
}

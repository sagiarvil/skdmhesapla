import { calculateMaritimePreparation, relativeDifferencePercent } from "./calculator";
import type { MaritimePreparationFile, MaritimeReadinessResult } from "./types";
import { VERIFIER_EVIDENCE_CHECKLIST } from "./regulatory";

function text(value?: string) { return typeof value === "string" && value.trim().length > 0; }
function nonNegative(value: number) { return Number.isFinite(value) && value >= 0; }
function positive(value: number) { return Number.isFinite(value) && value > 0; }
function looksNonFossil(fuelType: string) {
  return /(bio|methanol|ammonia|hydrogen|rfnbo|renewable|e-fuel|synthetic)/i.test(fuelType);
}
function etsRelevantScope(scope: string) {
  return scope === "intra-eu-eea" || scope === "eu-eea-third" || scope === "at-eu-eea-port";
}

/** IMO check digit is necessary but never sufficient; binary registry/tonnage evidence is also mandatory. */
export function validImoNumber(value: string): boolean {
  if (!/^\d{7}$/.test(value.trim())) return false;
  const digits = value.trim().split("").map(Number);
  const sum = digits.slice(0, 6).reduce((acc, digit, index) => acc + digit * (7 - index), 0);
  return sum % 10 === digits[6];
}

/**
 * Internal preparation gate only. 100/100 means configured source-data, deterministic calculation,
 * reconciliation and binary-evidence controls are complete. It is not verifier acceptance, a verified report,
 * an official Document of Compliance or EUA surrender.
 */
export function assessMaritimeReadiness(file: MaritimePreparationFile): MaritimeReadinessResult {
  const blocking: string[] = [];
  const warnings: string[] = [];
  const complete: string[] = [];
  const need = (ok: boolean, label: string) => (ok ? complete.push(label) : blocking.push(label));
  const hasEvidence = (key: string) => Boolean(file.evidence[key]);
  const calc = calculateMaritimePreparation(file);

  need(text(file.company.companyName), "Shipping company adı");
  need(text(file.company.imoCompanyNumber), "IMO Unique Company and Registered Owner identification number");
  need(text(file.company.registeredOwnerName), "Registered owner adı");
  need(text(file.company.registeredOwnerImoNumber), "Registered owner IMO company/owner number");
  need(text(file.company.country), "Company registration country");
  need(text(file.company.address), "Company / shipowner address");
  need(text(file.company.contactName), "Company contact person");
  need(text(file.company.contactEmail), "Company contact e-mail");
  need(text(file.company.telephone), "Company contact telephone");
  need(text(file.company.responsibilityFrom), "Ship responsibility start date");
  need(text(file.company.responsibilityTo), "Ship responsibility end date");
  if (file.company.role !== "gemi-sahibi") {
    need(text(file.company.formalMandateReference), "Registered owner dışındaki sorumluluk için mandate/delegation referansı");
    need(hasEvidence("formal-mandate"), "Kanıt: Shipowner mandate / delegation evidence");
  }
  const sameCompanyNumber = file.company.imoCompanyNumber.trim() !== ""
    && file.company.imoCompanyNumber.trim() === file.company.registeredOwnerImoNumber.trim();
  const differentLegalNames = file.company.companyName.trim().toLocaleLowerCase("en") !== file.company.registeredOwnerName.trim().toLocaleLowerCase("en");
  if (sameCompanyNumber && differentLegalNames) {
    need(text(file.company.formalMandateReference) || text(file.company.legalIdentityRelationshipReference),
      "Aynı IMO company/owner numarası altında farklı tüzel unvanlar için ilişki/mandate referansı");
    need(hasEvidence("formal-mandate") || hasEvidence("company-registry"),
      "Kanıt: farklı tüzel unvan / ortak IMO company numarası ilişkisi");
  }

  need(text(file.ship.shipName), "Gemi adı");
  need(text(file.ship.imoNumber), "IMO ship identification number");
  need(validImoNumber(file.ship.imoNumber), "IMO ship identification number checksum");
  need(text(file.ship.portOfRegistry), "Port of registry");
  need(text(file.ship.flagState), "Flag State");
  need(text(file.ship.officialCategory), "Resmî ship category");
  need(positive(file.ship.grossTonnage), "Gross Tonnage");
  need(nonNegative(file.ship.deadweightTonnes), "Deadweight");
  if (file.ship.shipType === "other") warnings.push("Gemi tipi 'other'; resmî ship category üzerinden kapsam ayrıca gözden geçirilmelidir.");

  need(hasEvidence("ship-registry"), "Kanıt: Certificate of Registry / resmî gemi kimliği");
  need(hasEvidence("tonnage-certificate"), "Kanıt: International Tonnage Certificate / GT");
  if (text(file.ship.classificationSociety)) need(hasEvidence("class-certificate"), "Kanıt: Class certificate");
  need(hasEvidence("company-registry"), "Kanıt: Shipping company / registered owner tüzel kişi kaydı");

  need(text(file.monitoring.monitoringPlanVersion), "Monitoring Plan version");
  need(text(file.monitoring.monitoringPlanReferenceDate), "Monitoring Plan reference date");
  need(file.monitoring.emissionSources.length > 0, "On-board emission sources listesi");
  need(text(file.monitoring.fuelMonitoringMethod), "Fuel / energy monitoring method");
  need(text(file.monitoring.uncertaintyMethod), "Measurement uncertainty / control procedure");
  need(nonNegative(file.monitoring.uncertaintyPercent), "Monitoring-method uncertainty (%)");
  need(text(file.monitoring.emissionFactorMethod), "Emission-factor method/source");
  need(text(file.monitoring.voyageCompletenessProcedure), "Voyage completeness procedure");
  need(text(file.monitoring.dataGapMethod), "Data-gap / surrogate-data method");
  need(text(file.monitoring.proceduresReference), "Monitoring procedures / responsibility reference");
  if (!file.monitoring.monitoringPlanAssessed) warnings.push("Monitoring Plan verifier assessment dış düzenlenmiş süreçte henüz tamamlanmamış olabilir.");
  if (!file.monitoring.monitoringPlanApproved) warnings.push("MRV Monitoring Plan approval/assessment statüsü dış düzenlenmiş süreçte teyit edilmelidir.");

  need(file.voyages.length > 0, "Voyage / port-call register");
  const voyageIds = new Set<string>();
  for (const [index, voyage] of file.voyages.entries()) {
    const row = `Sefer ${index + 1}`;
    need(text(voyage.id) && !voyageIds.has(voyage.id.trim()), `${row}: benzersiz voyage ID`);
    voyageIds.add(voyage.id.trim());
    need(text(voyage.departurePort) && text(voyage.arrivalPort), `${row}: departure / arrival port`);
    need(text(voyage.departureUnlocode) && text(voyage.arrivalUnlocode), `${row}: port UN/LOCODE`);
    need(text(voyage.departureAt) && text(voyage.arrivalAt), `${row}: GMT/UTC departure / arrival`);
    const departure = Date.parse(voyage.departureAt);
    const arrival = Date.parse(voyage.arrivalAt);
    need(Number.isFinite(departure) && Number.isFinite(arrival) && departure < arrival, `${row}: kronolojik departure / arrival`);
    if (index > 0) {
      const previous = file.voyages[index - 1];
      const previousArrival = Date.parse(previous.arrivalAt);
      need(!Number.isFinite(previousArrival) || !Number.isFinite(departure) || departure >= previousArrival, `${row}: önceki seferle zaman çakışması yok`);
      need(!text(previous.arrivalUnlocode) || !text(voyage.departureUnlocode) || previous.arrivalUnlocode.trim() === voyage.departureUnlocode.trim(), `${row}: liman zinciri sürekliliği`);
    }
    need(text(voyage.portCallPurpose), `${row}: port-call purpose`);
    if (voyage.scope === "excluded") need(text(voyage.exclusionReason), `${row}: exclusion reason`);
    need(nonNegative(voyage.distanceNm) && nonNegative(voyage.timeAtSeaHours) && nonNegative(voyage.timeAtBerthHours), `${row}: distance / time-at-sea / time-at-berth`);
    need(nonNegative(voyage.co2Tonnes) && nonNegative(voyage.ch4TonnesCo2e) && nonNegative(voyage.n2oTonnesCo2e), `${row}: CO₂ / CH₄ / N₂O data`);
    need(nonNegative(voyage.fuelTonnes), `${row}: fuel consumption`);
    if (voyage.dataGap) need(text(voyage.dataGapReason), `${row}: data-gap reason + surrogate method`);
  }

  need(file.fuels.length > 0, "Fuel / energy register");
  let needsElectricityEvidence = false;
  let needsFuelCertificate = false;
  let needsCalibration = false;
  const fuelIds = new Set<string>();
  for (const [index, fuel] of file.fuels.entries()) {
    const row = `Yakıt/enerji ${index + 1}`;
    need(text(fuel.id) && !fuelIds.has(fuel.id.trim()), `${row}: benzersiz fuel/energy ID`);
    fuelIds.add(fuel.id.trim());
    need(text(fuel.fuelType), `${row}: fuel / energy type`);
    need(text(fuel.fuelConsumer), `${row}: fuel consumer / energy conversion system`);
    need(fuel.scope !== "excluded" || text(fuel.portName), `${row}: FuelEU geographic scope`);
    if (fuel.opsElectricityKwh > 0) {
      needsElectricityEvidence = true;
      need(text(fuel.portName) && text(fuel.portUnlocode) && text(fuel.terminalBerth), `${row}: OPS port / LOCODE / terminal-berth`);
      need(positive(fuel.opsConnectionHours), `${row}: OPS connection hours`);
    } else {
      need(text(fuel.bdnReference), `${row}: BDN reference`);
    }
    if (looksNonFossil(fuel.fuelType)) {
      needsFuelCertificate = true;
      need(text(fuel.sustainabilityCertificate), `${row}: sustainability / fuel certificate`);
    }
    if (text(fuel.calibrationReference)) needsCalibration = true;
    const massLcvEnergy = fuel.quantityTonnes > 0 && fuel.lowerCalorificValueMjPerTonne > 0
      ? fuel.quantityTonnes * fuel.lowerCalorificValueMjPerTonne
      : 0;
    const derivedEnergy = massLcvEnergy > 0 || fuel.energyMj > 0;
    need(derivedEnergy, `${row}: energy basis (quantity × LCV or explicit non-fuel energy)`);
    if (massLcvEnergy > 0 && fuel.energyMj > 0) {
      need((relativeDifferencePercent(massLcvEnergy, fuel.energyMj) ?? Number.POSITIVE_INFINITY) <= 0.05,
        `${row}: girilen Energy (MJ), Quantity × LCV ile mutabık olmalı`);
    }
    if (fuel.opsElectricityKwh > 0 && fuel.energyMj > 0) {
      need((relativeDifferencePercent(fuel.opsElectricityKwh * 3.6, fuel.energyMj) ?? Number.POSITIVE_INFINITY) <= 0.05,
        `${row}: OPS kWh, 3.6 MJ/kWh ile explicit MJ değerine mutabık olmalı`);
    }
    need(nonNegative(fuel.wellToTankFactorGco2ePerMj), `${row}: WtT factor`);
    need(nonNegative(fuel.tankToWakeCo2Factor) && nonNegative(fuel.tankToWakeCh4Factor) && nonNegative(fuel.tankToWakeN2oFactor), `${row}: TtW CO₂ / CH₄ / N₂O factors`);
    need(fuel.slipFactor >= 0 && fuel.slipFactor <= 100, `${row}: CSlip (%)`);
    need(text(fuel.measurementMethod), `${row}: monitoring / measurement method`);
    need(text(fuel.factorSourceReference), `${row}: factor source/reference`);
  }

  if (calc.fuelRegisterConsumptionTonnes > 0 || calc.voyageFuelConsumptionTonnes > 0) {
    const tolerance = Math.max(0, file.monitoring.uncertaintyPercent);
    need(calc.fuelConsumptionVariancePercent !== null && calc.fuelConsumptionVariancePercent <= tolerance,
      `Yakıt mutabakatı: fuel register (${calc.fuelRegisterConsumptionTonnes.toFixed(3)} t) ↔ voyage register (${calc.voyageFuelConsumptionTonnes.toFixed(3)} t), fark ${calc.fuelConsumptionVarianceTonnes.toFixed(3)} t`);
  }

  for (const reconciliation of calc.fuelWtWReconciliation) {
    if (reconciliation.reportedComparatorGco2e !== null) {
      need((reconciliation.differencePercent ?? Number.POSITIVE_INFINITY) <= 0.05,
        `FuelEU WtW mutabakatı ${reconciliation.fuelId}: kaynak faktörlerden yeniden hesaplanan değer ile karşılaştırma değeri eşleşmeli`);
    }
  }
  need(calc.totalReportedCo2eTonnes >= calc.totalReportedCo2Tonnes, "MRV gaz köprüsü: toplam GHG = CO₂ + CH₄ + N₂O");
  if (file.reportingYear === 2025) need(calc.etsGasBasis === "CO2" && Math.abs(calc.etsPhaseIn - 0.7) < 1e-12, "EU ETS 2025: yalnız CO₂ + %70 phase-in");
  if (file.reportingYear >= 2026) need(calc.etsGasBasis === "CO2_CH4_N2O" && calc.etsPhaseIn === 1, "EU ETS 2026+: CO₂+CH₄+N₂O + %100 phase-in");
  need(calc.fueleuEnergyMj > 0 && calc.fueleuIntensityGco2ePerMj !== null, "FuelEU: deterministic scoped energy + WtW intensity");
  need(calc.fueleuComplianceBalanceGco2e !== null && Number.isFinite(calc.fueleuComplianceBalanceGco2e), "FuelEU: compliance balance gCO₂eq");
  const energyShareTotal = Object.values(calc.fueleuEnergySharesPercent).reduce((sum, value) => sum + value, 0);
  need(calc.fueleuEnergyMj <= 0 || Math.abs(energyShareTotal - 100) <= 1e-9, "FuelEU enerji payları OPS dahil %100 olmalı");

  if (file.ice.exclusionClaimed) {
    need(text(file.ship.iceClass), "Ice-class exclusion: ship ice class");
    need(text(file.ice.entryUtc) && text(file.ice.exitUtc), "Ice exclusion: entry / exit UTC");
    need(positive(file.ice.distanceInIceNm) && positive(file.ice.totalDistanceNm), "Ice exclusion: distance in ice / total voyage distance");
    need(text(file.ice.evidenceReference), "Ice exclusion: chart / evidence reference");
  }

  const anyDataGap = file.voyages.some((voyage) => voyage.dataGap === true);
  const anyFuel = file.fuels.some((fuel) => fuel.quantityTonnes > 0 || fuel.energyMj > 0 || text(fuel.bdnReference));
  const etsRelevant = file.reportingYear >= 2024 && file.voyages.some((voyage) => etsRelevantScope(voyage.scope) && (voyage.co2Tonnes > 0 || voyage.ch4TonnesCo2e > 0 || voyage.n2oTonnesCo2e > 0));

  const alwaysCritical = new Set([
    "ship-registry", "tonnage-certificate", "company-registry", "monitoring-plan", "voyage-list",
    "port-call-register", "logbook", "distance-time", "factors", "verifier-accreditation",
  ]);
  for (const evidence of VERIFIER_EVIDENCE_CHECKLIST) {
    const has = hasEvidence(evidence.key);
    const conditionalCritical = (evidence.key === "bdn" && anyFuel)
      || (evidence.key === "rob-register" && anyFuel)
      || (evidence.key === "data-gaps" && anyDataGap)
      || (evidence.key === "fuel-certificates" && needsFuelCertificate)
      || (evidence.key === "electricity" && needsElectricityEvidence)
      || (evidence.key === "ice" && file.ice.exclusionClaimed)
      || (evidence.key === "calibration" && needsCalibration)
      || (evidence.key === "administering-authority" && etsRelevant)
      || (evidence.key === "union-registry-moha" && etsRelevant)
      || (evidence.key === "class-certificate" && text(file.ship.classificationSociety));
    if (has) complete.push(evidence.label);
    else if (alwaysCritical.has(evidence.key) || conditionalCritical) blocking.push(`Kanıt: ${evidence.label}`);
  }

  if (etsRelevant) need(text(file.company.administeringAuthority), "EU ETS administering authority — primary-evidence-backed current legal name");
  need(text(file.verifier.verifierName), "Akredite doğrulayıcı adayının güncel tüzel unvanı");
  need(text(file.verifier.accreditationNumber), "Akredite doğrulayıcı akreditasyon numarası");

  if (file.flexibility.bankingRequested || file.flexibility.borrowingRequested || file.flexibility.poolingPlanned) {
    warnings.push("FuelEU banking / borrowing / pooling nihai olarak verifier approval ve FuelEU Database işlemlerine tabidir; SKDMhesapla yalnız hazırlık verisini kaydeder.");
  }
  warnings.push("Tam EUA adedi yalnız operasyonel planlama için ceiling ile gösterilebilir; resmî surrender sonucu verifier/Union Registry sürecindedir.");

  const totalChecks = complete.length + blocking.length;
  const rawScore = totalChecks === 0 ? 0 : Math.round((complete.length / totalChecks) * 100);
  const score = blocking.length ? Math.min(49, rawScore) : 100;
  return { score, blocking, warnings, complete, status: blocking.length ? "blocked" : "ready" };
}
import { calculateMaritimePreparation } from "./calculator";
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

/** IMO ship identification format + check digit. A valid checksum is necessary but never sufficient identity evidence. */
export function validImoNumber(value: string): boolean {
  if (!/^\d{7}$/.test(value.trim())) return false;
  const digits = value.trim().split("").map(Number);
  const sum = digits.slice(0, 6).reduce((acc, digit, index) => acc + digit * (7 - index), 0);
  return sum % 10 === digits[6];
}

/**
 * Internal preparation gate only. READY means the configured MRV/ETS/FuelEU preparation controls are complete;
 * it is not verifier acceptance, a verified report, an official Document of Compliance or EUA surrender.
 * Basis: Regulation (EU) 2015/757; IR (EU) 2023/2449; DR (EU) 2023/2917;
 * Directive 2003/87/EC; Regulation (EU) 2023/1805; IR (EU) 2024/2027; IR (EU) 2024/2031.
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
  }

  need(text(file.ship.shipName), "Gemi adı");
  need(text(file.ship.imoNumber), "IMO ship identification number");
  need(validImoNumber(file.ship.imoNumber), "IMO ship identification number checksum");
  need(text(file.ship.portOfRegistry), "Port of registry");
  need(text(file.ship.flagState), "Flag State");
  need(text(file.ship.officialCategory), "Resmî ship category");
  need(positive(file.ship.grossTonnage), "Gross Tonnage");
  need(nonNegative(file.ship.deadweightTonnes), "Deadweight");
  if (file.ship.shipType === "other") warnings.push("Kapsam motoru için gemi tipi 'other'; resmî ship category üzerinden kapsam yeniden kontrol edilmelidir.");

  // BLOCK-0 primary identity chain: typed master data cannot establish ship identity by itself.
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
  if (!file.monitoring.monitoringPlanAssessed) warnings.push("Monitoring Plan accredited verifier assessment henüz tamamlanmadı.");
  if (!file.monitoring.monitoringPlanApproved) warnings.push("EU MRV Monitoring Plan Administering Authority approval durumu henüz tamamlanmadı/işlenmedi.");

  need(file.voyages.length > 0, "Voyage / port-call register");
  for (const [index, voyage] of file.voyages.entries()) {
    const row = `Sefer ${index + 1}`;
    need(text(voyage.departurePort) && text(voyage.arrivalPort), `${row}: departure / arrival port`);
    need(text(voyage.departureUnlocode) && text(voyage.arrivalUnlocode), `${row}: port UN/LOCODE`);
    need(text(voyage.departureAt) && text(voyage.arrivalAt), `${row}: GMT/UTC departure / arrival`);
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
  for (const [index, fuel] of file.fuels.entries()) {
    const row = `Yakıt/enerji ${index + 1}`;
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
    const derivedEnergy = fuel.energyMj > 0 || (fuel.quantityTonnes > 0 && fuel.lowerCalorificValueMjPerTonne > 0);
    need(derivedEnergy, `${row}: energy basis (MJ or quantity × LCV)`);
    need(nonNegative(fuel.wellToTankFactorGco2ePerMj), `${row}: WtT factor`);
    need(nonNegative(fuel.tankToWakeCo2Factor) && nonNegative(fuel.tankToWakeCh4Factor) && nonNegative(fuel.tankToWakeN2oFactor), `${row}: TtW CO₂ / CH₄ / N₂O factors`);
    need(fuel.slipFactor >= 0 && fuel.slipFactor <= 100, `${row}: CSlip (%)`);
    need(text(fuel.measurementMethod), `${row}: monitoring / measurement method`);
    need(text(fuel.factorSourceReference), `${row}: factor source/reference`);
  }

  // The two independent activity ledgers must reproduce the same annual consumed fuel quantity.
  if (calc.fuelRegisterConsumptionTonnes > 0 || calc.voyageFuelConsumptionTonnes > 0) {
    const tolerance = Math.max(0, file.monitoring.uncertaintyPercent);
    need(calc.fuelConsumptionVariancePercent !== null && calc.fuelConsumptionVariancePercent <= tolerance,
      `Yakıt mutabakatı: fuel register (${calc.fuelRegisterConsumptionTonnes.toFixed(3)} t) ↔ voyage register (${calc.voyageFuelConsumptionTonnes.toFixed(3)} t), fark ${calc.fuelConsumptionVarianceTonnes.toFixed(3)} t`);
  }

  // A legacy/user-entered WtW total may be retained only as a comparator; material divergence blocks release.
  for (const reconciliation of calc.fuelWtWReconciliation) {
    if (reconciliation.reportedComparatorGco2e !== null) {
      need((reconciliation.differencePercent ?? Number.POSITIVE_INFINITY) <= 0.05,
        `FuelEU WtW mutabakatı ${reconciliation.fuelId}: kaynak faktörlerden yeniden hesaplanan değer ile karşılaştırma değeri eşleşmeli`);
    }
  }

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
    "port-call-register", "logbook", "distance-time", "factors",
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
      || (evidence.key === "formal-mandate" && file.company.role !== "gemi-sahibi")
      || (evidence.key === "administering-authority" && etsRelevant)
      || (evidence.key === "union-registry-moha" && etsRelevant)
      || evidence.key === "verifier-accreditation"
      || (evidence.key === "class-certificate" && text(file.ship.classificationSociety));
    if (has) complete.push(evidence.label);
    else if (alwaysCritical.has(evidence.key) || conditionalCritical) blocking.push(`Kanıt: ${evidence.label}`);
    else warnings.push(`Verifier risk değerlendirmesine/uygulanabilirliğe göre isteyebilir: ${evidence.label}`);
  }

  if (etsRelevant) {
    need(text(file.company.administeringAuthority), "EU ETS administering authority — primary-evidence-backed current legal name");
  }

  need(text(file.verifier.verifierName), "Akredite doğrulayıcı adayının güncel tüzel unvanı");
  need(text(file.verifier.accreditationNumber), "Akredite doğrulayıcı akreditasyon numarası");

  if (file.flexibility.bankingRequested || file.flexibility.borrowingRequested || file.flexibility.poolingPlanned) {
    warnings.push("FuelEU banking / borrowing / pooling nihai olarak verifier approval ve FuelEU Database işlemlerine tabidir; SKDMhesapla yalnız hazırlık verisini kaydeder.");
  }

  const totalChecks = complete.length + blocking.length;
  const rawScore = totalChecks === 0 ? 0 : Math.round((complete.length / totalChecks) * 100);
  // A blocking finding can never be presented as near-ready; 100 is reserved for a clean internal preparation gate.
  const score = blocking.length ? Math.min(49, rawScore) : warnings.length ? Math.min(89, rawScore) : rawScore;
  return { score, blocking, warnings, complete, status: blocking.length ? "blocked" : warnings.length ? "review" : "ready" };
}

import type { MaritimePreparationFile, MaritimeReadinessResult } from "./types";
import { VERIFIER_EVIDENCE_CHECKLIST } from "./regulatory";

function text(value: string) { return value.trim().length > 0; }
function nonNegative(value: number) { return Number.isFinite(value) && value >= 0; }
function positive(value: number) { return Number.isFinite(value) && value > 0; }
function looksNonFossil(fuelType: string) {
  return /(bio|methanol|ammonia|hydrogen|rfnbo|renewable|e-fuel|synthetic)/i.test(fuelType);
}

/**
 * Internal preparation gate only. READY means the configured MRV/FuelEU preparation checklist is complete;
 * it is not verifier acceptance, a verified report, an official Document of Compliance or EUA surrender.
 * Basis: Regulation (EU) 2015/757; IR (EU) 2023/2449; DR (EU) 2023/2917;
 * Regulation (EU) 2023/1805; IR (EU) 2024/2027; IR (EU) 2024/2031.
 */
export function assessMaritimeReadiness(file: MaritimePreparationFile): MaritimeReadinessResult {
  const blocking: string[] = [];
  const warnings: string[] = [];
  const complete: string[] = [];
  const need = (ok: boolean, label: string) => (ok ? complete.push(label) : blocking.push(label));

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
  if (file.company.role !== "gemi-sahibi") {
    need(text(file.company.formalMandateReference), "Registered owner dışındaki sorumluluk için mandate/delegation referansı");
  }
  if (!text(file.company.administeringAuthority)) warnings.push("EU ETS company-level raporu için Administering Authority henüz kaydedilmedi.");

  need(text(file.ship.shipName), "Gemi adı");
  need(text(file.ship.imoNumber), "IMO ship identification number");
  need(text(file.ship.portOfRegistry), "Port of registry");
  need(text(file.ship.flagState), "Flag State");
  need(text(file.ship.officialCategory), "Resmî ship category");
  need(positive(file.ship.grossTonnage), "Gross Tonnage");
  need(nonNegative(file.ship.deadweightTonnes), "Deadweight");
  if (file.ship.shipType === "other") warnings.push("Kapsam motoru için gemi tipi 'other'; resmî ship category üzerinden kapsam yeniden kontrol edilmelidir.");

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
    if (voyage.dataGap) need(text(voyage.dataGapReason), `${row}: data-gap reason + surrogate method`);
  }

  need(file.fuels.length > 0, "Fuel / energy register");
  let needsElectricityEvidence = false;
  let needsFuelCertificate = false;
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
    const derivedEnergy = fuel.energyMj > 0 || (fuel.quantityTonnes > 0 && fuel.lowerCalorificValueMjPerTonne > 0);
    need(derivedEnergy, `${row}: energy basis (MJ or quantity × LCV)`);
    need(nonNegative(fuel.wellToTankFactorGco2ePerMj), `${row}: WtT factor`);
    need(nonNegative(fuel.tankToWakeCo2Factor) && nonNegative(fuel.tankToWakeCh4Factor) && nonNegative(fuel.tankToWakeN2oFactor), `${row}: TtW CO₂ / CH₄ / N₂O factors`);
    need(text(fuel.measurementMethod), `${row}: monitoring / measurement method`);
    need(text(fuel.factorSourceReference), `${row}: factor source/reference`);
  }

  if (file.ice.exclusionClaimed) {
    need(text(file.ship.iceClass), "Ice-class exclusion: ship ice class");
    need(text(file.ice.entryUtc) && text(file.ice.exitUtc), "Ice exclusion: entry / exit UTC");
    need(positive(file.ice.distanceInIceNm) && positive(file.ice.totalDistanceNm), "Ice exclusion: distance in ice / total voyage distance");
    need(text(file.ice.evidenceReference), "Ice exclusion: chart / evidence reference");
  }

  for (const evidence of VERIFIER_EVIDENCE_CHECKLIST) {
    const has = Boolean(file.evidence[evidence.key]);
    const alwaysCritical = ["monitoring-plan", "voyage-list", "data-gaps", "logbook", "bdn", "distance-time", "factors"].includes(evidence.key);
    const conditionalCritical = (evidence.key === "fuel-certificates" && needsFuelCertificate)
      || (evidence.key === "electricity" && needsElectricityEvidence)
      || (evidence.key === "ice" && file.ice.exclusionClaimed);
    if (has) complete.push(evidence.label);
    else if (alwaysCritical || conditionalCritical) blocking.push(`Kanıt: ${evidence.label}`);
    else warnings.push(`Verifier risk değerlendirmesine/uygulanabilirliğe göre isteyebilir: ${evidence.label}`);
  }

  if (file.flexibility.bankingRequested || file.flexibility.borrowingRequested || file.flexibility.poolingPlanned) {
    warnings.push("FuelEU banking / borrowing / pooling nihai olarak verifier approval ve FuelEU Database işlemlerine tabidir; SKDMhesapla yalnız hazırlık verisini kaydeder.");
  }
  if (!text(file.verifier.verifierName) || !text(file.verifier.accreditationNumber)) {
    warnings.push("Seçilen accredited verifier kimliği henüz dosyaya eklenmedi; verification handoff öncesi eklenmelidir.");
  }

  const totalChecks = complete.length + blocking.length;
  const score = totalChecks === 0 ? 0 : Math.round((complete.length / totalChecks) * 100);
  return { score, blocking, warnings, complete, status: blocking.length ? "blocked" : warnings.length ? "review" : "ready" };
}

import type { MaritimePreparationFile, MaritimeReadinessResult } from "./types";
import { VERIFIER_EVIDENCE_CHECKLIST } from "./regulatory";

function present(value: string | number | boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  return value.trim().length > 0;
}

/**
 * Internal preparation gate only. A READY result means the configured preparation checklist is complete;
 * it is not verifier acceptance or an official Document of Compliance.
 * Evidence basis: EU MRV 2015/757 + 2023/2449 and FuelEU verification IR 2024/2027.
 */
export function assessMaritimeReadiness(file: MaritimePreparationFile): MaritimeReadinessResult {
  const blocking: string[] = [];
  const warnings: string[] = [];
  const complete: string[] = [];
  const need = (ok: boolean, label: string) => (ok ? complete.push(label) : blocking.push(label));

  need(present(file.company.companyName), "Shipping company adı");
  need(present(file.company.imoCompanyNumber), "IMO unique company / registered owner identification number");
  need(present(file.company.registeredOwnerName), "Registered owner adı");
  need(present(file.company.contactEmail), "Sorumlu iletişim e-postası");
  if (file.company.role !== "gemi-sahibi") {
    need(present(file.company.formalMandateReference), "Registered owner dışındaki sorumluluk için mandate/delegation referansı");
  }

  need(present(file.ship.shipName), "Gemi adı");
  need(present(file.ship.imoNumber), "IMO ship identification number");
  need(present(file.ship.portOfRegistry), "Port of registry");
  need(present(file.ship.flagState), "Flag State");
  need(file.ship.grossTonnage > 0, "Gross Tonnage");
  if (file.ship.shipType !== "other") complete.push("Gemi kategorisi"); else blocking.push("Gemi kategorisini kesinleştirin");

  need(present(file.monitoring.monitoringPlanVersion), "Monitoring Plan sürümü");
  need(present(file.monitoring.monitoringPlanReferenceDate), "Monitoring Plan reference date");
  need(file.monitoring.emissionSources.length > 0, "On-board emission sources listesi");
  need(present(file.monitoring.fuelMonitoringMethod), "Yakıt/enerji izleme yöntemi");
  need(present(file.monitoring.dataGapMethod), "Data-gap / surrogate-data yöntemi");
  if (!file.monitoring.monitoringPlanAssessed) warnings.push("Monitoring Plan verifier assessment durumu tamamlanmadı.");

  need(file.voyages.length > 0, "Sefer / port call register");
  for (const [index, voyage] of file.voyages.entries()) {
    const row = `Sefer ${index + 1}`;
    need(present(voyage.departurePort) && present(voyage.arrivalPort), `${row}: kalkış/varış limanı`);
    need(present(voyage.departureAt) && present(voyage.arrivalAt), `${row}: tarih/saat`);
    need(voyage.scope !== "outside" || (voyage.co2Tonnes >= 0), `${row}: scope sınıflaması`);
    need(voyage.distanceNm >= 0 && voyage.timeAtSeaHours >= 0, `${row}: mesafe ve süre`);
    if (voyage.dataGap && !present(voyage.dataGapReason)) blocking.push(`${row}: data gap nedeni ve surrogate yöntem açıklaması`);
  }

  need(file.fuels.length > 0, "Yakıt / enerji register");
  for (const [index, fuel] of file.fuels.entries()) {
    const row = `Yakıt ${index + 1}`;
    need(present(fuel.fuelType), `${row}: yakıt/enerji türü`);
    need(present(fuel.bdnReference) || fuel.opsElectricityKwh > 0, `${row}: BDN veya electricity delivery reference`);
    need(fuel.energyMj > 0, `${row}: enerji (MJ)`);
    need(fuel.wellToWakeEmissionsGco2e >= 0, `${row}: WtW GHG emisyonu`);
    need(present(fuel.measurementMethod), `${row}: measurement method`);
  }

  for (const evidence of VERIFIER_EVIDENCE_CHECKLIST) {
    if (file.evidence[evidence.key]) complete.push(evidence.label);
    else if (["monitoring-plan", "voyage-list", "data-gaps", "logbook", "bdn", "fuel-certificates", "distance-time", "factors"].includes(evidence.key)) {
      blocking.push(`Kanıt: ${evidence.label}`);
    } else {
      warnings.push(`Gerekirse verifier isteyebilir: ${evidence.label}`);
    }
  }

  const totalChecks = complete.length + blocking.length;
  const score = totalChecks === 0 ? 0 : Math.round((complete.length / totalChecks) * 100);
  return {
    score,
    blocking,
    warnings,
    complete,
    status: blocking.length ? "blocked" : warnings.length ? "review" : "ready",
  };
}

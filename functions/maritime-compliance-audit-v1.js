"use strict";

/**
 * Maritime strict pre-verification audit core.
 * Internal gate only: 100/100 means the configured preparation/evidence controls are complete.
 * It is NOT an accredited verifier opinion, official DoC or Union Registry surrender result.
 *
 * Legal anchors:
 * - Regulation (EU) 2015/757 + Regulation (EU) 2023/957 (MRV)
 * - Directive 2003/87/EC + Directive (EU) 2023/959 (EU ETS Maritime)
 * - Regulation (EU) 2023/1805 Articles 4, 15, 16, 20, 21, 22 + Annex I/II/IV (FuelEU)
 * - Implementing Regulation (EU) 2024/2027 (FuelEU verification)
 * - Delegated Regulation (EU) 2023/2917 (MRV verification/accreditation)
 */

const RULESET_ID = "eu-maritime-2026-09-05";
const GWP100 = Object.freeze({ CO2: 1, CH4: 28, N2O: 265 });
const WTW_COMPARATOR_TOLERANCE_PERCENT = 0.05;
const ENERGY_COMPARATOR_TOLERANCE_PERCENT = 0.05;

const ALWAYS_REQUIRED_EVIDENCE = Object.freeze([
  "ship-registry",
  "tonnage-certificate",
  "company-registry",
  "monitoring-plan",
  "voyage-list",
  "port-call-register",
  "logbook",
  "distance-time",
  "factors",
  "verifier-accreditation",
]);

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
function txt(value) { return String(value || "").trim(); }
function nonNegative(value) { return Number.isFinite(Number(value)) && Number(value) >= 0; }
function positive(value) { return Number.isFinite(Number(value)) && Number(value) > 0; }
function looksNonFossil(value) { return /(bio|methanol|ammonia|hydrogen|rfnbo|renewable|e-fuel|synthetic)/i.test(String(value || "")); }
function etsScope(scope) { return ["intra-eu-eea", "eu-eea-third", "at-eu-eea-port"].includes(String(scope || "")); }
function relativeDifferencePercent(a, b) {
  const aa = Math.abs(num(a)), bb = Math.abs(num(b));
  const denominator = Math.max(aa, bb);
  return denominator === 0 ? 0 : Math.abs(aa - bb) / denominator * 100;
}
function validImoNumber(value) {
  const raw = txt(value);
  if (!/^\d{7}$/.test(raw)) return false;
  const digits = raw.split("").map(Number);
  const sum = digits.slice(0, 6).reduce((acc, digit, index) => acc + digit * (7 - index), 0);
  return sum % 10 === digits[6];
}
function geographicFactor(scope) {
  if (scope === "intra-eu-eea" || scope === "at-eu-eea-port") return 1;
  if (scope === "eu-eea-third") return 0.5;
  return 0;
}
function massLcvEnergyMj(row) {
  const mass = Math.max(0, num(row?.quantityTonnes));
  const lcv = Math.max(0, num(row?.lowerCalorificValueMjPerTonne));
  return mass > 0 && lcv > 0 ? mass * lcv : 0;
}
function fuelEnergyMj(row) {
  const derived = massLcvEnergyMj(row);
  if (derived > 0) return derived;
  return Math.max(0, num(row?.energyMj));
}

/** Regulation (EU) 2023/1805 Annex I Equations (1)-(2), including Cslip treatment. */
function deterministicWtWGco2e(row) {
  const energy = fuelEnergyMj(row);
  const massG = Math.max(0, num(row?.quantityTonnes)) * 1_000_000;
  const slip = Math.min(1, Math.max(0, num(row?.slipFactor)) / 100);
  const combusted = Math.max(0, num(row?.tankToWakeCo2Factor)) * GWP100.CO2
    + Math.max(0, num(row?.tankToWakeCh4Factor)) * GWP100.CH4
    + Math.max(0, num(row?.tankToWakeN2oFactor)) * GWP100.N2O;
  const slipped = GWP100.CH4;
  return energy * Math.max(0, num(row?.wellToTankFactorGco2ePerMj)) + massG * ((1 - slip) * combusted + slip * slipped);
}

function evidenceCoverage(evidenceDocs) {
  const coverage = {};
  for (const doc of Array.isArray(evidenceDocs) ? evidenceDocs : []) {
    if (!doc || doc.immutable !== true || !txt(doc.documentType) || !/^[a-f0-9]{64}$/i.test(txt(doc.sha256)) || !/^[a-f0-9]{64}$/i.test(txt(doc.evidenceChainHash))) continue;
    const key = txt(doc.documentType);
    coverage[key] = Number(coverage[key] || 0) + 1;
  }
  return coverage;
}

function auditPreparationFile(file, evidenceDocs) {
  const missing = [];
  const warnings = [];
  const passed = [];
  const req = (ok, label) => { if (ok) passed.push(label); else missing.push(label); };
  const c = file?.company || {};
  const s = file?.ship || {};
  const m = file?.monitoring || {};
  const voyages = Array.isArray(file?.voyages) ? file.voyages : [];
  const fuels = Array.isArray(file?.fuels) ? file.fuels : [];
  const coverage = evidenceCoverage(evidenceDocs);
  const hasEvidence = key => Number(coverage[key] || 0) > 0;

  req(Boolean(txt(c.companyName)), "Shipping company adı");
  req(Boolean(txt(c.imoCompanyNumber)), "IMO company / registered-owner identification number");
  req(Boolean(txt(c.registeredOwnerName)), "Registered owner adı");
  req(Boolean(txt(c.registeredOwnerImoNumber)), "Registered owner IMO company/owner number");
  req(Boolean(txt(c.country)), "Company country");
  req(Boolean(txt(c.address)), "Company / shipowner address");
  req(Boolean(txt(c.contactName) && txt(c.contactEmail) && txt(c.telephone)), "Company contact details");
  req(Boolean(txt(c.responsibilityFrom) && txt(c.responsibilityTo)), "Responsibility period");
  if (c.role !== "gemi-sahibi") req(Boolean(txt(c.formalMandateReference)), "Formal mandate/delegation reference");

  req(Boolean(txt(s.shipName)), "Ship name");
  req(validImoNumber(s.imoNumber), "IMO number format + checksum");
  req(Boolean(txt(s.portOfRegistry) && txt(s.flagState) && txt(s.officialCategory)), "Ship registry master data");
  req(positive(s.grossTonnage), "Gross Tonnage");
  req(nonNegative(s.deadweightTonnes), "Deadweight");

  req(Boolean(txt(m.monitoringPlanVersion) && txt(m.monitoringPlanReferenceDate)), "Monitoring Plan identity");
  req(Boolean(txt(m.fuelMonitoringMethod) && txt(m.uncertaintyMethod) && nonNegative(m.uncertaintyPercent)), "Monitoring / uncertainty method");
  req(Boolean(txt(m.emissionFactorMethod) && txt(m.dataGapMethod) && txt(m.voyageCompletenessProcedure) && txt(m.proceduresReference)), "Monitoring procedures");
  req(Array.isArray(m.emissionSources) && m.emissionSources.length > 0, "Emission-source register");

  req(voyages.length > 0, "Voyage register");
  for (let i = 0; i < voyages.length; i += 1) {
    const v = voyages[i] || {};
    const p = `Voyage ${i + 1}`;
    req(Boolean(txt(v.departurePort) && txt(v.arrivalPort)), `${p}: ports`);
    req(Boolean(txt(v.departureUnlocode) && txt(v.arrivalUnlocode)), `${p}: UN/LOCODE`);
    req(Boolean(txt(v.departureAt) && txt(v.arrivalAt)), `${p}: UTC timestamps`);
    req(Boolean(txt(v.portCallPurpose)), `${p}: port-call purpose`);
    req(nonNegative(v.distanceNm) && nonNegative(v.timeAtSeaHours) && nonNegative(v.timeAtBerthHours), `${p}: distance/time`);
    req(nonNegative(v.co2Tonnes) && nonNegative(v.ch4TonnesCo2e) && nonNegative(v.n2oTonnesCo2e), `${p}: CO2/CH4/N2O`);
    req(nonNegative(v.fuelTonnes), `${p}: fuel consumption`);
    if (v.scope === "excluded") req(Boolean(txt(v.exclusionReason)), `${p}: exclusion reason`);
    if (v.dataGap === true) req(Boolean(txt(v.dataGapReason)), `${p}: data-gap reason/method`);
  }

  req(fuels.length > 0, "Fuel/energy register");
  let fuelRegisterTonnes = 0;
  let needsSustainability = false;
  let needsElectricity = false;
  let needsCalibration = false;
  for (let i = 0; i < fuels.length; i += 1) {
    const f = fuels[i] || {};
    const p = `Fuel ${i + 1}`;
    req(Boolean(txt(f.fuelType) && txt(f.fuelConsumer)), `${p}: type/consumer`);
    req(f.scope !== "excluded" || Boolean(txt(f.portName)), `${p}: FuelEU geographic scope`);
    if (num(f.opsElectricityKwh) > 0) {
      needsElectricity = true;
      req(Boolean(txt(f.portName) && txt(f.portUnlocode) && txt(f.terminalBerth) && positive(f.opsConnectionHours)), `${p}: OPS evidence fields`);
    } else {
      req(Boolean(txt(f.bdnReference)), `${p}: BDN reference`);
    }
    if (looksNonFossil(f.fuelType)) {
      needsSustainability = true;
      req(Boolean(txt(f.sustainabilityCertificate)), `${p}: sustainability certificate`);
    }
    if (txt(f.calibrationReference)) needsCalibration = true;
    const derivedEnergy = massLcvEnergyMj(f);
    req(fuelEnergyMj(f) > 0, `${p}: energy basis`);
    if (derivedEnergy > 0 && positive(f.energyMj)) {
      req(relativeDifferencePercent(derivedEnergy, num(f.energyMj)) <= ENERGY_COMPARATOR_TOLERANCE_PERCENT,
        `${p}: entered energy must reconcile to quantity × LCV`);
    }
    req(nonNegative(f.wellToTankFactorGco2ePerMj), `${p}: WtT factor`);
    req(nonNegative(f.tankToWakeCo2Factor) && nonNegative(f.tankToWakeCh4Factor) && nonNegative(f.tankToWakeN2oFactor), `${p}: TtW factors`);
    req(num(f.slipFactor) >= 0 && num(f.slipFactor) <= 100, `${p}: Cslip`);
    req(Boolean(txt(f.measurementMethod) && txt(f.factorSourceReference)), `${p}: measurement/factor source`);
    fuelRegisterTonnes += Math.max(0, num(f.quantityTonnes));

    const comparator = num(f.wellToWakeEmissionsGco2e);
    if (comparator > 0) {
      const calculated = deterministicWtWGco2e(f);
      req(relativeDifferencePercent(calculated, comparator) <= WTW_COMPARATOR_TOLERANCE_PERCENT,
        `${p}: WtW comparator must reconcile to source-factor calculation`);
    }
  }

  const voyageFuelTonnes = voyages.reduce((sum, v) => sum + Math.max(0, num(v?.fuelTonnes)), 0);
  if (fuelRegisterTonnes > 0 || voyageFuelTonnes > 0) {
    const tolerance = Math.max(0, num(m.uncertaintyPercent));
    req(relativeDifferencePercent(fuelRegisterTonnes, voyageFuelTonnes) <= tolerance,
      `Annual fuel reconciliation: fuel register ${fuelRegisterTonnes.toFixed(3)} t vs voyage register ${voyageFuelTonnes.toFixed(3)} t`);
  }

  for (const key of ALWAYS_REQUIRED_EVIDENCE) req(hasEvidence(key), `Binary evidence: ${key}`);
  if (txt(s.classificationSociety)) req(hasEvidence("class-certificate"), "Binary evidence: class-certificate");
  if (fuels.some(f => num(f.quantityTonnes) > 0 || Boolean(txt(f.bdnReference)))) {
    req(hasEvidence("bdn"), "Binary evidence: bdn");
    req(hasEvidence("rob-register"), "Binary evidence: rob-register");
  }
  if (voyages.some(v => v.dataGap === true)) req(hasEvidence("data-gaps"), "Binary evidence: data-gaps");
  if (needsSustainability) req(hasEvidence("fuel-certificates"), "Binary evidence: fuel-certificates");
  if (needsElectricity) req(hasEvidence("electricity"), "Binary evidence: electricity");
  if (needsCalibration) req(hasEvidence("calibration"), "Binary evidence: calibration");
  if (file?.ice?.exclusionClaimed) req(hasEvidence("ice"), "Binary evidence: ice");
  if (c.role !== "gemi-sahibi") req(hasEvidence("formal-mandate"), "Binary evidence: formal-mandate");

  const etsRelevant = Number(file?.reportingYear) >= 2024 && voyages.some(v => etsScope(v?.scope) && (num(v?.co2Tonnes) > 0 || num(v?.ch4TonnesCo2e) > 0 || num(v?.n2oTonnesCo2e) > 0));
  if (etsRelevant) {
    req(Boolean(txt(c.administeringAuthority)), "Administering authority legal name");
    req(hasEvidence("administering-authority"), "Binary evidence: administering-authority");
    req(hasEvidence("union-registry-moha"), "Binary evidence: union-registry-moha");
  }

  req(Boolean(txt(file?.verifier?.verifierName)), "Verifier current legal entity");
  req(Boolean(txt(file?.verifier?.accreditationNumber)), "Verifier accreditation number");
  req(hasEvidence("verifier-accreditation"), "Binary evidence: verifier-accreditation");

  if (file?.monitoring?.monitoringPlanAssessed !== true) warnings.push("Monitoring Plan verifier assessment is an external regulated-stage status and remains pending.");
  if (file?.flexibility?.bankingRequested || file?.flexibility?.borrowingRequested || file?.flexibility?.poolingPlanned) {
    warnings.push("FuelEU flexibility action remains subject to verifier approval / FuelEU Database workflow.");
  }

  const ready = missing.length === 0;
  return {
    rulesetId: RULESET_ID,
    ready,
    score: ready ? 100 : Math.min(49, Math.round((passed.length / Math.max(1, passed.length + missing.length)) * 100)),
    missing,
    warnings,
    passed,
    evidenceCoverage: coverage,
    reconciliations: {
      fuelRegisterTonnes,
      voyageFuelTonnes,
      fuelVarianceTonnes: fuelRegisterTonnes - voyageFuelTonnes,
      fuelVariancePercent: relativeDifferencePercent(fuelRegisterTonnes, voyageFuelTonnes),
    },
  };
}

module.exports = {
  RULESET_ID,
  GWP100,
  WTW_COMPARATOR_TOLERANCE_PERCENT,
  ENERGY_COMPARATOR_TOLERANCE_PERCENT,
  ALWAYS_REQUIRED_EVIDENCE,
  validImoNumber,
  geographicFactor,
  deterministicWtWGco2e,
  evidenceCoverage,
  relativeDifferencePercent,
  auditPreparationFile,
};

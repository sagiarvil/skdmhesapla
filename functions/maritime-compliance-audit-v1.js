"use strict";

/**
 * Maritime strict pre-verification audit core.
 * Internal gate only: 100/100 means the configured preparation/evidence controls are complete,
 * deterministic calculations reconcile and no known internal contradiction remains.
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
const OPS_ENERGY_COMPARATOR_TOLERANCE_PERCENT = 0.05;
const FUELEU_REFERENCE_GCO2E_PER_MJ = 91.16;

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
function etsPhaseIn(reportingYear) {
  const year = Math.trunc(num(reportingYear));
  if (year < 2024) return 0;
  if (year === 2024) return 0.4;
  if (year === 2025) return 0.7;
  return 1;
}
function fueleuReduction(reportingYear) {
  const year = Math.trunc(num(reportingYear));
  if (year >= 2050) return 0.8;
  if (year >= 2045) return 0.62;
  if (year >= 2040) return 0.31;
  if (year >= 2035) return 0.145;
  if (year >= 2030) return 0.06;
  if (year >= 2025) return 0.02;
  return 0;
}
function fueleuIntensityLimit(reportingYear) {
  return FUELEU_REFERENCE_GCO2E_PER_MJ * (1 - fueleuReduction(reportingYear));
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
function energyCategory(row) {
  if (num(row?.opsElectricityKwh) > 0 || /(ops|shore power|electric)/i.test(txt(row?.fuelType))) return "ops";
  if (num(row?.rfNboEnergyMj) > 0 || /(rfnbo|e-fuel|synthetic hydrogen|renewable hydrogen)/i.test(txt(row?.fuelType))) return "rfnbo";
  if (looksNonFossil(row?.fuelType) || txt(row?.sustainabilityCertificate)) return "biofuel";
  return txt(row?.fuelType) ? "fossil" : "other";
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
    if (doc.integrityStatus && doc.integrityStatus !== "verified-at-ingest") continue;
    const key = txt(doc.documentType);
    coverage[key] = Number(coverage[key] || 0) + 1;
  }
  return coverage;
}

function calculateAuthority(file) {
  const voyages = Array.isArray(file?.voyages) ? file.voyages : [];
  const fuels = Array.isArray(file?.fuels) ? file.fuels : [];
  const year = Math.trunc(num(file?.reportingYear));
  let co2 = 0, ch4 = 0, n2o = 0, etsGeographic = 0, voyageFuelTonnes = 0;
  let distanceNm = 0, timeAtSeaHours = 0, timeAtBerthHours = 0, transportWorkTonneNm = 0;
  for (const v of voyages) {
    const vCo2 = Math.max(0, num(v?.co2Tonnes));
    const vCh4 = Math.max(0, num(v?.ch4TonnesCo2e));
    const vN2o = Math.max(0, num(v?.n2oTonnesCo2e));
    co2 += vCo2; ch4 += vCh4; n2o += vN2o;
    voyageFuelTonnes += Math.max(0, num(v?.fuelTonnes));
    distanceNm += Math.max(0, num(v?.distanceNm));
    timeAtSeaHours += Math.max(0, num(v?.timeAtSeaHours));
    timeAtBerthHours += Math.max(0, num(v?.timeAtBerthHours));
    transportWorkTonneNm += Math.max(0, num(v?.transportWorkTonneNm));
    const etsGas = year >= 2026 ? vCo2 + vCh4 + vN2o : vCo2;
    etsGeographic += etsGas * geographicFactor(v?.scope);
  }
  const totalGhg = co2 + ch4 + n2o;
  const phase = etsPhaseIn(year);
  const etsLiable = etsGeographic * phase;

  let fuelRegisterTonnes = 0, fueleuEnergy = 0, fueleuWtW = 0;
  const categories = { fossil: 0, biofuel: 0, rfnbo: 0, ops: 0, other: 0 };
  const fuelRows = [];
  for (const f of fuels) {
    const physicalEnergy = fuelEnergyMj(f);
    const factor = geographicFactor(f?.scope);
    const scopedEnergy = physicalEnergy * factor;
    const physicalWtW = deterministicWtWGco2e(f);
    const scopedWtW = physicalWtW * factor;
    const category = energyCategory(f);
    fuelRegisterTonnes += Math.max(0, num(f?.quantityTonnes));
    fueleuEnergy += scopedEnergy;
    fueleuWtW += scopedWtW;
    categories[category] += scopedEnergy;
    fuelRows.push({
      fuelId: txt(f?.id), fuelType: txt(f?.fuelType), category, scopeFactor: factor,
      physicalEnergyMj: physicalEnergy, scopedEnergyMj: scopedEnergy,
      physicalWtWGco2e: physicalWtW, scopedWtWGco2e: scopedWtW,
      intensityGco2ePerMj: physicalEnergy > 0 ? physicalWtW / physicalEnergy : null,
    });
  }
  const intensity = fueleuEnergy > 0 ? fueleuWtW / fueleuEnergy : null;
  const target = fueleuIntensityLimit(year);
  const balance = intensity === null ? null : (target - intensity) * fueleuEnergy;
  const shares = Object.fromEntries(Object.entries(categories).map(([key, value]) => [key, fueleuEnergy > 0 ? value / fueleuEnergy * 100 : 0]));
  const transportWorkCo2Intensity = transportWorkTonneNm > 0 ? co2 * 1_000_000 / transportWorkTonneNm : null;
  return {
    mrv: { co2Tonnes: co2, ch4TonnesCo2e: ch4, n2oTonnesCo2e: n2o, totalGhgTonnesCo2e: totalGhg },
    ets: {
      gasBasis: year >= 2026 ? "CO2_CH4_N2O" : "CO2",
      geographicCoveredGasTonnesCo2e: etsGeographic,
      phaseIn: phase,
      preliminaryLiableTonnesCo2e: etsLiable,
      wholeEuaPlanningQuantity: etsLiable > 0 ? Math.ceil(etsLiable) : 0,
    },
    fueleu: {
      energyMj: fueleuEnergy, wtwEmissionsGco2e: fueleuWtW, intensityGco2ePerMj: intensity,
      targetIntensityGco2ePerMj: target, complianceBalanceGco2eq: balance, energySharesPercent: shares, fuelRows,
    },
    operations: { distanceNm, timeAtSeaHours, timeAtBerthHours, transportWorkTonneNm, transportWorkCo2IntensityGco2PerTonneNm: transportWorkCo2Intensity },
    reconciliation: {
      fuelRegisterTonnes, voyageFuelTonnes,
      fuelVarianceTonnes: fuelRegisterTonnes - voyageFuelTonnes,
      fuelVariancePercent: relativeDifferencePercent(fuelRegisterTonnes, voyageFuelTonnes),
    },
  };
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
  const sameCompanyNumber = txt(c.imoCompanyNumber) && txt(c.imoCompanyNumber) === txt(c.registeredOwnerImoNumber);
  const differentLegalNames = txt(c.companyName).toLocaleLowerCase("en") !== txt(c.registeredOwnerName).toLocaleLowerCase("en");
  if (sameCompanyNumber && differentLegalNames) {
    req(Boolean(txt(c.formalMandateReference) || txt(c.legalIdentityRelationshipReference)), "Distinct legal names sharing one IMO company/owner number require documentary relationship reference");
    req(hasEvidence("formal-mandate") || hasEvidence("company-registry"), "Binary evidence: legal-entity relationship / mandate");
  }

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
  const voyageIds = new Set();
  for (let i = 0; i < voyages.length; i += 1) {
    const v = voyages[i] || {};
    const p = `Voyage ${i + 1}`;
    req(Boolean(txt(v.id)) && !voyageIds.has(txt(v.id)), `${p}: unique voyage ID`);
    voyageIds.add(txt(v.id));
    req(Boolean(txt(v.departurePort) && txt(v.arrivalPort)), `${p}: ports`);
    req(Boolean(txt(v.departureUnlocode) && txt(v.arrivalUnlocode)), `${p}: UN/LOCODE`);
    req(Boolean(txt(v.departureAt) && txt(v.arrivalAt)), `${p}: UTC timestamps`);
    const dep = Date.parse(txt(v.departureAt));
    const arr = Date.parse(txt(v.arrivalAt));
    req(Number.isFinite(dep) && Number.isFinite(arr) && dep < arr, `${p}: chronological departure/arrival`);
    if (i > 0) {
      const prev = voyages[i - 1] || {};
      const prevArrival = Date.parse(txt(prev.arrivalAt));
      req(!Number.isFinite(prevArrival) || !Number.isFinite(dep) || dep >= prevArrival, `${p}: no temporal overlap with previous voyage`);
      req(!txt(prev.arrivalUnlocode) || !txt(v.departureUnlocode) || txt(prev.arrivalUnlocode) === txt(v.departureUnlocode), `${p}: port-chain continuity`);
    }
    req(Boolean(txt(v.portCallPurpose)), `${p}: port-call purpose`);
    req(nonNegative(v.distanceNm) && nonNegative(v.timeAtSeaHours) && nonNegative(v.timeAtBerthHours), `${p}: distance/time`);
    req(nonNegative(v.co2Tonnes) && nonNegative(v.ch4TonnesCo2e) && nonNegative(v.n2oTonnesCo2e), `${p}: CO2/CH4/N2O`);
    req(nonNegative(v.fuelTonnes), `${p}: fuel consumption`);
    if (v.scope === "excluded") req(Boolean(txt(v.exclusionReason)), `${p}: exclusion reason`);
    if (v.dataGap === true) req(Boolean(txt(v.dataGapReason)), `${p}: data-gap reason/method`);
  }

  req(fuels.length > 0, "Fuel/energy register");
  let needsSustainability = false;
  let needsElectricity = false;
  let needsCalibration = false;
  const fuelIds = new Set();
  for (let i = 0; i < fuels.length; i += 1) {
    const f = fuels[i] || {};
    const p = `Fuel ${i + 1}`;
    req(Boolean(txt(f.id)) && !fuelIds.has(txt(f.id)), `${p}: unique fuel/energy ID`);
    fuelIds.add(txt(f.id));
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
    const canonicalEnergy = fuelEnergyMj(f);
    req(canonicalEnergy > 0, `${p}: energy basis`);
    if (derivedEnergy > 0 && positive(f.energyMj)) {
      req(relativeDifferencePercent(derivedEnergy, num(f.energyMj)) <= ENERGY_COMPARATOR_TOLERANCE_PERCENT,
        `${p}: entered energy must reconcile to quantity × LCV`);
    }
    if (num(f.opsElectricityKwh) > 0 && positive(f.energyMj)) {
      req(relativeDifferencePercent(num(f.opsElectricityKwh) * 3.6, num(f.energyMj)) <= OPS_ENERGY_COMPARATOR_TOLERANCE_PERCENT,
        `${p}: OPS kWh must reconcile to explicit MJ at 3.6 MJ/kWh`);
    }
    req(nonNegative(f.wellToTankFactorGco2ePerMj), `${p}: WtT factor`);
    req(nonNegative(f.tankToWakeCo2Factor) && nonNegative(f.tankToWakeCh4Factor) && nonNegative(f.tankToWakeN2oFactor), `${p}: TtW factors`);
    req(num(f.slipFactor) >= 0 && num(f.slipFactor) <= 100, `${p}: Cslip`);
    req(Boolean(txt(f.measurementMethod) && txt(f.factorSourceReference)), `${p}: measurement/factor source`);

    const comparator = num(f.wellToWakeEmissionsGco2e);
    if (comparator > 0) {
      const calculated = deterministicWtWGco2e(f);
      req(relativeDifferencePercent(calculated, comparator) <= WTW_COMPARATOR_TOLERANCE_PERCENT,
        `${p}: WtW comparator must reconcile to source-factor calculation`);
    }
  }

  const calculated = calculateAuthority(file);
  if (calculated.reconciliation.fuelRegisterTonnes > 0 || calculated.reconciliation.voyageFuelTonnes > 0) {
    const tolerance = Math.max(0, num(m.uncertaintyPercent));
    req(calculated.reconciliation.fuelVariancePercent <= tolerance,
      `Annual fuel reconciliation: fuel register ${calculated.reconciliation.fuelRegisterTonnes.toFixed(3)} t vs voyage register ${calculated.reconciliation.voyageFuelTonnes.toFixed(3)} t`);
  }
  req(calculated.mrv.totalGhgTonnesCo2e >= calculated.mrv.co2Tonnes, "MRV gas bridge: total GHG must equal CO2 + CH4 + N2O");
  req(calculated.ets.preliminaryLiableTonnesCo2e >= 0, "EU ETS deterministic scope/phase-in calculation");
  if (Number(file?.reportingYear) === 2025) req(calculated.ets.gasBasis === "CO2" && Math.abs(calculated.ets.phaseIn - 0.7) < 1e-12, "EU ETS 2025: CO2-only gas basis + 70% phase-in");
  if (Number(file?.reportingYear) >= 2026) req(calculated.ets.gasBasis === "CO2_CH4_N2O" && calculated.ets.phaseIn === 1, "EU ETS 2026+: CO2+CH4+N2O gas basis + 100% phase-in");
  req(calculated.fueleu.energyMj > 0 && calculated.fueleu.intensityGco2ePerMj !== null, "FuelEU deterministic scoped-energy/WtW intensity calculation");
  req(calculated.fueleu.complianceBalanceGco2eq !== null && Number.isFinite(calculated.fueleu.complianceBalanceGco2eq), "FuelEU compliance balance in gCO2eq");
  const shareTotal = Object.values(calculated.fueleu.energySharesPercent).reduce((sum, value) => sum + num(value), 0);
  req(calculated.fueleu.energyMj <= 0 || Math.abs(shareTotal - 100) <= 1e-9, "FuelEU energy shares including OPS must total 100%");

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
  warnings.push("Whole-EUA planning quantity uses ceiling only as an internal operational estimate; verifier/Union Registry remains authoritative.");

  const ready = missing.length === 0;
  return {
    rulesetId: RULESET_ID,
    ready,
    score: ready ? 100 : Math.min(49, Math.round((passed.length / Math.max(1, passed.length + missing.length)) * 100)),
    missing,
    warnings,
    passed,
    evidenceCoverage: coverage,
    calculated,
    reconciliations: calculated.reconciliation,
  };
}

module.exports = {
  RULESET_ID,
  GWP100,
  WTW_COMPARATOR_TOLERANCE_PERCENT,
  ENERGY_COMPARATOR_TOLERANCE_PERCENT,
  OPS_ENERGY_COMPARATOR_TOLERANCE_PERCENT,
  ALWAYS_REQUIRED_EVIDENCE,
  validImoNumber,
  geographicFactor,
  deterministicWtWGco2e,
  calculateAuthority,
  evidenceCoverage,
  relativeDifferencePercent,
  auditPreparationFile,
};
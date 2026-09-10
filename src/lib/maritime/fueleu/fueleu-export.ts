/**
 * EU Denizcilik Karbon Uyumu — Resmî FuelEU Maritime Dışa Aktarım Motoru
 *
 * Dayanak Mevzuat:
 * 1. Regulation (EU) 2023/1805 (FuelEU Maritime)
 * 2. Commission Implementing Regulation (EU) 2024/2027 (FuelEU Verification Activities & Report Templates)
 * 3. Commission Implementing Regulation (EU) 2024/2031 (FuelEU Monitoring Plan Electronic Template)
 */

import type { MaritimeComplianceDossier } from "../dossier/schema";

export function generateFuelEuReportJson(dossier: MaritimeComplianceDossier): string {
  const payload = {
    standard: "Regulation (EU) 2023/1805 & IR (EU) 2024/2027",
    reportingPeriod: dossier.reportingYear,
    shipDetails: {
      shipName: dossier.ship.shipName,
      imoNumber: dossier.ship.imoNumber,
      grossTonnage: dossier.ship.grossTonnage,
      shipType: dossier.ship.shipType,
    },
    companyDetails: {
      companyName: dossier.company.companyName,
      imoCompanyNumber: dossier.company.imoCompanyNumber,
      administeringMemberState: dossier.company.administeringAuthority,
    },
    verifierDetails: dossier.verifier,
    fuelEuMonitoringPlanSummary: dossier.fuelEuMonitoringPlan,
    complianceBalanceRecord: {
      totalEnergyConsumedMj: dossier.fuelEuCalculation.totalEnergyMj,
      targetGhgIntensityGco2ePerMj: dossier.fuelEuCalculation.targetGhgIntensity,
      actualGhgIntensityGco2ePerMj: dossier.fuelEuCalculation.actualGhgIntensity,
      intensityDeficitOrSurplusGco2ePerMj: dossier.fuelEuCalculation.intensityGap,
      complianceBalanceMj: dossier.fuelEuCalculation.complianceBalanceMj,
      complianceStatus: dossier.fuelEuCalculation.isCompliant ? "COMPLIANT" : "DEFICIT_PENALTY_EXPOSURE",
      penaltyExposureEur: dossier.fuelEuCalculation.compliancePenaltyEur,
      consecutiveDeficitFactor: dossier.fuelEuCalculation.consecutiveDeficitYears,
      opsComplianceStatus: dossier.fuelEuCalculation.opsComplianceStatus,
      rfnboRewardMj: dossier.fuelEuCalculation.rfnboRewardMj,
      bankingAllowed: dossier.fuelEuCalculation.bankingAllowed,
      borrowingLimitMj: dossier.fuelEuCalculation.borrowingLimitMj,
    },
    energyConsumersInventory: dossier.fuelEuMonitoringPlan.energyConsumers,
    fuelDeliveriesAuditTrail: dossier.fuels.map((f) => ({
      fuelType: f.fuelType,
      bdnReference: f.bdnReference,
      sustainabilityCertificate: f.sustainabilityCertificate || "N/A",
      quantityTonnes: f.quantityTonnes,
      energyMj: f.energyMj,
      atBerthEnergyMj: f.atBerthEnergyMj,
      wellToTankFactor: f.wellToTankFactorGco2ePerMj,
      tankToWakeCo2Factor: f.tankToWakeCo2Factor,
      opsElectricityKwh: f.opsElectricityKwh,
    })),
    rootIntegrityHash: dossier.rootSha256,
  };

  return JSON.stringify(payload, null, 2);
}

export function generateFuelEuXml(dossier: MaritimeComplianceDossier): string {
  const { ship, company, verifier, fuelEuCalculation, fuelEuMonitoringPlan, fuels, reportingYear } = dossier;

  return `<?xml version="1.0" encoding="UTF-8"?>
<FuelEuMaritimeReport xmlns="urn:eu:europa:ec:clima:fueleu:v1" schemaVersion="2024.1" reportingYear="${reportingYear}">
  <ShipInformation>
    <ImoNumber>${ship.imoNumber}</ImoNumber>
    <ShipName><![CDATA[${ship.shipName}]]></ShipName>
    <ShipType>${ship.shipType}</ShipType>
    <GrossTonnage>${ship.grossTonnage}</GrossTonnage>
  </ShipInformation>
  <CompanyInformation>
    <ImoCompanyNumber>${company.imoCompanyNumber}</ImoCompanyNumber>
    <CompanyName><![CDATA[${company.companyName}]]></CompanyName>
    <AdministeringAuthority>${company.administeringAuthority}</AdministeringAuthority>
  </CompanyInformation>
  <MonitoringPlanTemplateIR20242031>
    <PlanVersion>${fuelEuMonitoringPlan.planVersion}</PlanVersion>
    <SubmissionDate>${fuelEuMonitoringPlan.submissionDate}</SubmissionDate>
    <AssessedByVerifier>${fuelEuMonitoringPlan.assessedByVerifier}</AssessedByVerifier>
    <OpsConnectionProcedure><![CDATA[${fuelEuMonitoringPlan.opsConnectionProcedure}]]></OpsConnectionProcedure>
    <OpsNominalPowerKw>${fuelEuMonitoringPlan.opsNominalPowerKw}</OpsNominalPowerKw>
    <EnergyConsumers>
      ${fuelEuMonitoringPlan.energyConsumers
        .map(
          (ec) => `
      <Consumer id="${ec.id}">
        <Type>${ec.consumerType}</Type>
        <PowerRatingKw>${ec.powerRatingKw}</PowerRatingKw>
        <MonitoringMethod>${ec.monitoringMethod}</MonitoringMethod>
      </Consumer>`
        )
        .join("")}
    </EnergyConsumers>
  </MonitoringPlanTemplateIR20242031>
  <ComplianceBalanceIR20242027>
    <TotalEnergyMj>${fuelEuCalculation.totalEnergyMj}</TotalEnergyMj>
    <TargetIntensity>${fuelEuCalculation.targetGhgIntensity}</TargetIntensity>
    <ActualIntensity>${fuelEuCalculation.actualGhgIntensity}</ActualIntensity>
    <ComplianceBalanceMj>${fuelEuCalculation.complianceBalanceMj}</ComplianceBalanceMj>
    <IsCompliant>${fuelEuCalculation.isCompliant}</IsCompliant>
    <PenaltyEur>${fuelEuCalculation.compliancePenaltyEur}</PenaltyEur>
    <OpsStatus>${fuelEuCalculation.opsComplianceStatus}</OpsStatus>
    <BankingAllowed>${fuelEuCalculation.bankingAllowed}</BankingAllowed>
    <BorrowingLimitMj>${fuelEuCalculation.borrowingLimitMj}</BorrowingLimitMj>
  </ComplianceBalanceIR20242027>
  <VerifierStatement>
    <VerifierName><![CDATA[${verifier.verifierName}]]></VerifierName>
    <AccreditationNumber>${verifier.accreditationNumber}</AccreditationNumber>
    <Status>${verifier.verificationStatus}</Status>
  </VerifierStatement>
</FuelEuMaritimeReport>`;
}

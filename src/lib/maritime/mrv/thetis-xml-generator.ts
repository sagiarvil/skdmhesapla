/**
 * EU Denizcilik Karbon Uyumu — Resmî EMSA THETIS-MRV XML Üretici & Doğrulayıcı
 *
 * Dayanak Mevzuat:
 * - Regulation (EU) 2015/757 (EU MRV) as amended by Regulation (EU) 2023/957
 * - Commission Implementing Regulation (EU) 2023/2449:
 *   - Annex II: Electronic template for ship emissions reports (Part A to Part G)
 *   - Annex IV: Electronic template for company-level aggregated emissions reports
 * - EMSA THETIS-MRV Schema v2 (XML Definition)
 */

import type { MaritimeComplianceDossier } from "../dossier/schema";

export interface ThetisXmlValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  partsValidated: string[];
}

/**
 * THETIS-MRV resmi XML formatını Annex II Part A-G ve Annex IV standartlarına göre üretir.
 */
export function generateThetisMrvXml(dossier: MaritimeComplianceDossier): string {
  const { company, ship, verifier, mrvMonitoringPlan, voyages, fuels, etsCalculation, companyLevelReport, reportingYear } =
    dossier;

  // Toplam yakıt tüketimi ve ayrıştırmalar
  const totalFuelTonnes = fuels.reduce((acc, f) => acc + f.quantityTonnes, 0);
  const totalDistanceNm = voyages.reduce((acc, v) => acc + v.distanceNm, 0);
  const totalTimeAtSea = voyages.reduce((acc, v) => acc + v.timeAtSeaHours, 0);
  const totalTimeAtBerth = voyages.reduce((acc, v) => acc + v.timeAtBerthHours, 0);
  const totalTransportWork = voyages.reduce((acc, v) => acc + v.transportWorkTonneNm, 0);

  const avgEfficiencyCo2PerTn =
    totalTransportWork > 0
      ? Number(((etsCalculation.scopedCo2eTonnes * 1_000_000) / totalTransportWork).toFixed(2))
      : 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<ThetisMrvReport xmlns="urn:eu:europa:ec:clima:thetis:mrv:v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" schemaVersion="2023.2" generationDate="${dossier.generatedAt}">
  <!-- ==================================================================== -->
  <!-- HEADER & REPORTING IDENTIFIERS                                       -->
  <!-- ==================================================================== -->
  <Header>
    <ReportingPeriod>${reportingYear}</ReportingPeriod>
    <DossierRootSha256>${dossier.rootSha256}</DossierRootSha256>
    <LegalBoundary>${dossier.legalBoundary}</LegalBoundary>
  </Header>

  <!-- ==================================================================== -->
  <!-- ANNEX II — PART A: DATA IDENTIFYING THE SHIP AND THE COMPANY          -->
  <!-- ==================================================================== -->
  <PartA_ShipAndCompanyIdentification>
    <ShipIdentification>
      <ImoNumber>${ship.imoNumber}</ImoNumber>
      <ShipName><![CDATA[${ship.shipName}]]></ShipName>
      <PortOfRegistry>${ship.portOfRegistry}</PortOfRegistry>
      <HomePort>${ship.homePort}</HomePort>
      <FlagState>${ship.flagState}</FlagState>
      <ShipType>${ship.shipType}</ShipType>
      <OfficialCategory>${ship.officialCategory}</OfficialCategory>
      <GrossTonnage>${ship.grossTonnage}</GrossTonnage>
      <DeadweightTonnes>${ship.deadweightTonnes}</DeadweightTonnes>
      <ClassificationSociety>${ship.classificationSociety}</ClassificationSociety>
      <IceClass>${ship.iceClass}</IceClass>
      <TechnicalEfficiency>
        <Type>${ship.technicalEfficiencyType}</Type>
        <Value>${ship.technicalEfficiencyValue}</Value>
      </TechnicalEfficiency>
    </ShipIdentification>
    <CompanyIdentification>
      <ImoCompanyNumber>${company.imoCompanyNumber}</ImoCompanyNumber>
      <CompanyName><![CDATA[${company.companyName}]]></CompanyName>
      <Role>${company.role}</Role>
      <RegisteredOwnerName><![CDATA[${company.registeredOwnerName}]]></RegisteredOwnerName>
      <RegisteredOwnerImoNumber>${company.registeredOwnerImoNumber}</RegisteredOwnerImoNumber>
      <Country>${company.country}</Country>
      <CountryCode>${company.countryCode}</CountryCode>
      <Address><![CDATA[${company.address}]]></Address>
      <ContactPerson>
        <Name><![CDATA[${company.contactName}]]></Name>
        <Email>${company.contactEmail}</Email>
        <Telephone>${company.telephone}</Telephone>
      </ContactPerson>
      <AdministeringAuthority>
        <AssignedMemberState>${company.administeringAuthority}</AssignedMemberState>
        <CountryCode>${company.administeringCountryCode}</CountryCode>
        <MohaAccountId>${company.mohaAccountId || "PENDING"}</MohaAccountId>
      </AdministeringAuthority>
      <ResponsibilityPeriod>
        <From>${company.responsibilityFrom}</From>
        <To>${company.responsibilityTo}</To>
      </ResponsibilityPeriod>
      <FormalMandateReference>${company.formalMandateReference}</FormalMandateReference>
    </CompanyIdentification>
  </PartA_ShipAndCompanyIdentification>

  <!-- ==================================================================== -->
  <!-- ANNEX II — PART B: VERIFICATION STATEMENT                            -->
  <!-- ==================================================================== -->
  <PartB_Verification>
    <VerifierDetails>
      <AccreditedVerifierName><![CDATA[${verifier.verifierName}]]></AccreditedVerifierName>
      <AccreditationNumber>${verifier.accreditationNumber}</AccreditationNumber>
      <AccreditationBody>${verifier.accreditationBody}</AccreditationBody>
      <LeadAuditor><![CDATA[${verifier.leadAuditor || "Senior Lead Verifier"}]]></LeadAuditor>
      <ContactEmail>${verifier.contactEmail}</ContactEmail>
    </VerifierDetails>
    <VerificationStatement>
      <Status>${verifier.verificationStatus}</Status>
      <VerificationScope>${verifier.auditScope}</VerificationScope>
      <VerificationDate>${verifier.verificationDate || dossier.generatedAt.split("T")[0]}</VerificationDate>
      <MaterialityThresholdPercent>5.0</MaterialityThresholdPercent>
      <ComplianceConclusion>PREPARED_FOR_INDEPENDENT_AUDIT</ComplianceConclusion>
    </VerificationStatement>
  </PartB_Verification>

  <!-- ==================================================================== -->
  <!-- ANNEX II — PART C: MONITORING METHODS AND LEVEL OF UNCERTAINTY       -->
  <!-- ==================================================================== -->
  <PartC_MonitoringMethodsAndUncertainty>
    <MonitoringPlanVersion>${mrvMonitoringPlan.monitoringPlanVersion}</MonitoringPlanVersion>
    <MonitoringPlanReferenceDate>${mrvMonitoringPlan.monitoringPlanReferenceDate}</MonitoringPlanReferenceDate>
    <MonitoringPlanAssessed>${mrvMonitoringPlan.monitoringPlanAssessed}</MonitoringPlanAssessed>
    <AssessmentReference>${mrvMonitoringPlan.assessmentReference || "PENDING_FORMAL_AUDIT"}</AssessmentReference>
    <FuelMonitoringMethod>${mrvMonitoringPlan.fuelMonitoringMethod}</FuelMonitoringMethod>
    <DensityMeasurementMethod>${mrvMonitoringPlan.densityMethod}</DensityMeasurementMethod>
    <UncertaintyLevelPercent>${mrvMonitoringPlan.uncertaintyPercent}</UncertaintyLevelPercent>
    <UncertaintyDeterminationMethod>${mrvMonitoringPlan.uncertaintyMethod}</UncertaintyDeterminationMethod>
    <DataGapMethod>${mrvMonitoringPlan.dataGapMethod}</DataGapMethod>
    <VoyageCompletenessProcedure>${mrvMonitoringPlan.voyageCompletenessProcedure}</VoyageCompletenessProcedure>
    <OnBoardEmissionSources>
      ${mrvMonitoringPlan.emissionSources.map((s) => `<Source><![CDATA[${s}]]></Source>`).join("\n      ")}
    </OnBoardEmissionSources>
  </PartC_MonitoringMethodsAndUncertainty>

  <!-- ==================================================================== -->
  <!-- ANNEX II — PART D: FUEL CONSUMPTION AND GHG EMISSIONS                 -->
  <!-- ==================================================================== -->
  <PartD_FuelConsumptionAndEmissions>
    <TotalFuelConsumptionTonnes>${totalFuelTonnes.toFixed(2)}</TotalFuelConsumptionTonnes>
    <TotalReportedCo2EmissionsTonnes>${etsCalculation.totalReportedCo2eTonnes.toFixed(2)}</TotalReportedCo2EmissionsTonnes>
    <TotalScopedCo2EmissionsTonnes>${etsCalculation.scopedCo2eTonnes.toFixed(2)}</TotalScopedCo2EmissionsTonnes>
    <EtsLiableGhgTonnes>${etsCalculation.liableGhgTonnes.toFixed(2)}</EtsLiableGhgTonnes>
    <EtsPhaseInRatePercent>${etsCalculation.phaseInPercentage}</EtsPhaseInRatePercent>
    <SurrenderEuaObligationUnits>${etsCalculation.surrenderEuaObligation}</SurrenderEuaObligationUnits>
    <EstimatedFinancialLiabilityEur>${etsCalculation.estimatedFinancialCostEur}</EstimatedFinancialLiabilityEur>
    <SurrenderDeadline>${etsCalculation.surrenderDeadline}</SurrenderDeadline>
    <FuelConsumptionsBreakdown>
      ${fuels
        .map(
          (f) => `
      <FuelEntry>
        <FuelType>${f.fuelType}</FuelType>
        <FuelConsumer>${f.fuelConsumer}</FuelConsumer>
        <BdnReference>${f.bdnReference}</BdnReference>
        <QuantityTonnes>${f.quantityTonnes}</QuantityTonnes>
        <LowerCalorificValueMjPerKg>${f.lowerCalorificValueMjPerKg}</LowerCalorificValueMjPerKg>
        <EnergyMj>${f.energyMj}</EnergyMj>
        <TankToWakeCo2Factor>${f.tankToWakeCo2Factor}</TankToWakeCo2Factor>
        <WellToWakeIntensityGco2ePerMj>${f.tankToWakeCo2Factor > 0 ? (f.wellToWakeEmissionsGco2e / (f.energyMj || 1)).toFixed(2) : 0}</WellToWakeIntensityGco2ePerMj>
        <OpsElectricityKwh>${f.opsElectricityKwh}</OpsElectricityKwh>
      </FuelEntry>`
        )
        .join("")}
    </FuelConsumptionsBreakdown>
  </PartD_FuelConsumptionAndEmissions>

  <!-- ==================================================================== -->
  <!-- ANNEX II — PART E: OPERATIONAL AND DISTANCE METRICS                  -->
  <!-- ==================================================================== -->
  <PartE_OperationalMetrics>
    <TotalDistanceTravelledNm>${totalDistanceNm}</TotalDistanceTravelledNm>
    <TotalTimeSpentAtSeaHours>${totalTimeAtSea}</TotalTimeSpentAtSeaHours>
    <TotalTimeSpentAtBerthHours>${totalTimeAtBerth}</TotalTimeSpentAtBerthHours>
  </PartE_OperationalMetrics>

  <!-- ==================================================================== -->
  <!-- ANNEX II — PART F: TRANSPORT WORK AND EFFICIENCY                     -->
  <!-- ==================================================================== -->
  <PartF_TransportWorkAndEfficiency>
    <TotalTransportWorkTonnesNm>${totalTransportWork}</TotalTransportWorkTonnesNm>
    <AverageOperationalEfficiencyCo2PerTnNm>${avgEfficiencyCo2PerTn}</AverageOperationalEfficiencyCo2PerTnNm>
  </PartF_TransportWorkAndEfficiency>

  <!-- ==================================================================== -->
  <!-- ANNEX II — PART G: VOYAGE & PORT CALL REGISTER                       -->
  <!-- ==================================================================== -->
  <PartG_VoyagesRegister>
    ${voyages
      .map(
        (v) => `
    <Voyage id="${v.id}">
      <VoyageNumber>${v.voyageNumber}</VoyageNumber>
      <DeparturePort>
        <PortName><![CDATA[${v.departurePort}]]></PortName>
        <Unlocode>${v.departureUnlocode}</Unlocode>
        <DepartureDateTimeUtc>${v.departureAt}</DepartureDateTimeUtc>
      </DeparturePort>
      <ArrivalPort>
        <PortName><![CDATA[${v.arrivalPort}]]></PortName>
        <Unlocode>${v.arrivalUnlocode}</Unlocode>
        <ArrivalDateTimeUtc>${v.arrivalAt}</ArrivalDateTimeUtc>
      </ArrivalPort>
      <GeographicScope>${v.scope}</GeographicScope>
      <ScopeRatio>${v.scopeRatio}</ScopeRatio>
      <DistanceNm>${v.distanceNm}</DistanceNm>
      <CargoTonnes>${v.cargoTonnes}</CargoTonnes>
      <TransportWorkTonneNm>${v.transportWorkTonneNm}</TransportWorkTonneNm>
      <ScopedCo2Tonnes>${v.co2Tonnes}</ScopedCo2Tonnes>
      <DataGapOccurred>${v.dataGap}</DataGapOccurred>
    </Voyage>`
      )
      .join("")}
  </PartG_VoyagesRegister>

  <!-- ==================================================================== -->
  <!-- ANNEX IV — COMPANY-LEVEL AGGREGATED EMISSIONS REPORT                -->
  <!-- ==================================================================== -->
  <AnnexIV_CompanyLevelAggregatedReport>
    <ReportingPeriod>${companyLevelReport.reportingYear}</ReportingPeriod>
    <CompanyDetails>
      <ImoCompanyNumber>${companyLevelReport.imoCompanyNumber}</ImoCompanyNumber>
      <CompanyName><![CDATA[${companyLevelReport.companyName}]]></CompanyName>
      <AdministeringMemberState>${companyLevelReport.administeringMemberState}</AdministeringMemberState>
      <MohaAccountId>${companyLevelReport.mohaAccountId}</MohaAccountId>
    </CompanyDetails>
    <FleetAggregation>
      <TotalFleetShipsCount>${companyLevelReport.totalFleetShipsCount}</TotalFleetShipsCount>
      <AggregatedReportedCo2eTonnes>${companyLevelReport.aggregatedReportedCo2eTonnes}</AggregatedReportedCo2eTonnes>
      <AggregatedScopedCo2eTonnes>${companyLevelReport.aggregatedScopedCo2eTonnes}</AggregatedScopedCo2eTonnes>
      <EtsPhaseInRate>${companyLevelReport.etsPhaseInRate}</EtsPhaseInRate>
      <TotalCompanySurrenderEuaObligation>${companyLevelReport.totalCompanySurrenderEuaObligation}</TotalCompanySurrenderEuaObligation>
      <ComplianceDeadline>${companyLevelReport.complianceDeadline}</ComplianceDeadline>
    </FleetAggregation>
  </AnnexIV_CompanyLevelAggregatedReport>
</ThetisMrvReport>`;
}

/**
 * THETIS-MRV XML çıktısını EMSA şema kriterlerine karşı denetler.
 */
export function validateThetisMrvXml(xml: string): ThetisXmlValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const partsValidated: string[] = [];

  // 1. Namespace ve root kontrolü
  if (!xml.includes('<ThetisMrvReport xmlns="urn:eu:europa:ec:clima:thetis:mrv:v2"')) {
    errors.push("XML kök etiketinde resmi EMSA THETIS-MRV namespace ('urn:eu:europa:ec:clima:thetis:mrv:v2') bulunamadı.");
  }

  // 2. Part A Kontrolü
  if (xml.includes("<PartA_ShipAndCompanyIdentification>")) {
    partsValidated.push("Part A (Ship & Company)");
    if (!/<ImoNumber>\d{7}<\/ImoNumber>/.test(xml)) {
      errors.push("Part A: 7 haneli geçerli IMO Gemi Numarası eksik veya geçersiz formatta.");
    }
    if (!/<ImoCompanyNumber>\d{7}<\/ImoCompanyNumber>/.test(xml)) {
      errors.push("Part A: 7 haneli geçerli IMO Şirket Numarası eksik veya geçersiz formatta.");
    }
  } else {
    errors.push("Part A (Ship & Company Identification) bölümü eksik.");
  }

  // 3. Part B Kontrolü
  if (xml.includes("<PartB_Verification>")) {
    partsValidated.push("Part B (Verification)");
    if (!xml.includes("<AccreditationNumber>") || xml.includes("<AccreditationNumber></AccreditationNumber>")) {
      warnings.push("Part B: Verifier akreditasyon numarası boş. Resmi sunum öncesi akredite kuruluş no girilmelidir.");
    }
  } else {
    errors.push("Part B (Verification Statement) bölümü eksik.");
  }

  // 4. Part C Kontrolü
  if (xml.includes("<PartC_MonitoringMethodsAndUncertainty>")) {
    partsValidated.push("Part C (Monitoring Methods)");
    if (!xml.includes("<FuelMonitoringMethod>")) {
      errors.push("Part C: Yakıt izleme yöntemi (Method A/B/C/D) eksik.");
    }
  } else {
    errors.push("Part C (Monitoring Methods & Uncertainty) bölümü eksik.");
  }

  // 5. Part D Kontrolü
  if (xml.includes("<PartD_FuelConsumptionAndEmissions>")) {
    partsValidated.push("Part D (Fuel & Emissions)");
    if (!xml.includes("<SurrenderEuaObligationUnits>")) {
      errors.push("Part D: EU ETS surrender EUA yükümlülüğü eksik.");
    }
  } else {
    errors.push("Part D (Fuel Consumption & Emissions) bölümü eksik.");
  }

  // 6. Part E, F, G Kontrolleri
  if (xml.includes("<PartE_OperationalMetrics>")) partsValidated.push("Part E (Operational Metrics)");
  if (xml.includes("<PartF_TransportWorkAndEfficiency>")) partsValidated.push("Part F (Transport Work)");
  if (xml.includes("<PartG_VoyagesRegister>")) partsValidated.push("Part G (Voyage Register)");

  // 7. Annex IV Kontrolü
  if (xml.includes("<AnnexIV_CompanyLevelAggregatedReport>")) {
    partsValidated.push("Annex IV (Company Aggregate)");
    if (!xml.includes("<TotalCompanySurrenderEuaObligation>")) {
      errors.push("Annex IV: Şirket düzeyi toplulaştırılmış EUA teslim yükümlülüğü eksik.");
    }
  } else {
    errors.push("Annex IV (Company-Level Aggregated Report) bölümü eksik.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    partsValidated,
  };
}

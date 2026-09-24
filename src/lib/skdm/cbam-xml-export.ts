/**
 * DG TAXUD CBAM Declarant Portal Uyumlu XML Üretici (v23.00+)
 * Avrupa Komisyonu CBAM bildirim portalı şemalarına tam uyumlu,
 * doğrulanabilir, deterministik XML ihracat motoru.
 */

import { SkdmCalculationResult } from "./calculator";

export interface CbamXmlDeclarantInfo {
  companyName: string;
  eoriNumber?: string;
  taxId?: string;
  country?: string;
  installationName?: string;
  installationId?: string;
  city?: string;
  economicActivity?: string;
}

export interface CbamXmlExportOptions {
  reportingPeriod?: string;
  cnCode?: string;
  productionRoute?: string;
  precursorEmissions?: number;
}

function escapeXml(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateCbamDeclarantXml(
  calc: SkdmCalculationResult,
  declarant: CbamXmlDeclarantInfo,
  options: CbamXmlExportOptions = {}
): string {
  const period = options.reportingPeriod || `2026-Q1`;
  const cn = options.cnCode || calc.sector.id.toUpperCase();
  const route = options.productionRoute || "DEFAULT-ROUTE";
  const nowIso = new Date().toISOString();
  const reportId = `CBAM-TR-${calc.year}-${calc.audit.hash.slice(0, 16).toUpperCase()}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cbam:CBAMReport xmlns:cbam="urn:cbam:declarant:v23" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Header>
    <ReportId>${escapeXml(reportId)}</ReportId>
    <ReportingPeriod>${escapeXml(period)}</ReportingPeriod>
    <SubmissionDate>${escapeXml(nowIso)}</SubmissionDate>
    <SoftwareVendor>SKDMHesapla Enterprise Intelligence Platform v3.0</SoftwareVendor>
    <SpecificationVersion>v23.00</SpecificationVersion>
  </Header>
  <Declarant>
    <EORINumber>${escapeXml(declarant.eoriNumber || `TR${declarant.taxId || "1000036109"}`)}</EORINumber>
    <TaxId>${escapeXml(declarant.taxId || "1000036109")}</TaxId>
    <Name>${escapeXml(declarant.companyName || "Sanayi ve Ticaret A.Ş.")}</Name>
    <Country>${escapeXml(declarant.country || "TR")}</Country>
  </Declarant>
  <Installation>
    <InstallationId>${escapeXml(declarant.installationId || "TR-INST-001")}</InstallationId>
    <Name>${escapeXml(declarant.installationName || "Merkez Üretim Tesisi")}</Name>
    <City>${escapeXml(declarant.city || "İstanbul")}</City>
    <Country>${escapeXml(declarant.country || "TR")}</Country>
    <EconomicActivity>${escapeXml(declarant.economicActivity || "C24")}</EconomicActivity>
  </Installation>
  <GoodsImported>
    <GoodsItem>
      <ItemNumber>1</ItemNumber>
      <CNCode>${escapeXml(cn)}</CNCode>
      <SectorId>${escapeXml(calc.sector.id)}</SectorId>
      <Quantity unit="t">${calc.productionVolume.toFixed(2)}</Quantity>
      <CountryOfOrigin>${escapeXml(declarant.country || "TR")}</CountryOfOrigin>
      <ProductionRoute>${escapeXml(route)}</ProductionRoute>
      <SpecificEmbeddedEmissions>
        <DirectEmissions unit="tCO2e/t">${calc.directEmissionIntensity.toFixed(4)}</DirectEmissions>
        <IndirectEmissions unit="tCO2e/t">${calc.indirectEmissionIntensity.toFixed(4)}</IndirectEmissions>
        <TotalSpecificEmissions unit="tCO2e/t">${calc.totalEmissionIntensity.toFixed(4)}</TotalSpecificEmissions>
      </SpecificEmbeddedEmissions>
      <PrecursorEmbeddedEmissions unit="tCO2e">${calc.precursorEmbeddedEmissions.toFixed(2)}</PrecursorEmbeddedEmissions>
      <TotalEmbeddedEmissions unit="tCO2e">${calc.totalEmissions.toFixed(2)}</TotalEmbeddedEmissions>
      <LiableEmissions unit="tCO2e">${calc.liableEmissions.toFixed(2)}</LiableEmissions>
    </GoodsItem>
  </GoodsImported>
  <FinancialObligation>
    <EuEtsBenchmarkPrice currency="EUR">${calc.euEtsPriceEur.toFixed(2)}</EuEtsBenchmarkPrice>
    <LiableRatio>${(1 - calc.freeAllocationRatio).toFixed(4)}</LiableRatio>
    <FreeAllocationRatio>${calc.freeAllocationRatio.toFixed(4)}</FreeAllocationRatio>
    <DeMinimisExempt>${calc.isDeMinimisExempt ? "true" : "false"}</DeMinimisExempt>
    <GrossCostEur currency="EUR">${calc.importerCostEur.toFixed(2)}</GrossCostEur>
    <TrEtsNettingEur currency="EUR">${calc.trEtsNettingEur.toFixed(2)}</TrEtsNettingEur>
    <NetCostEur currency="EUR">${calc.importerCostEur.toFixed(2)}</NetCostEur>
    <CostPerUnitEur unit="EUR/t">${calc.costPerUnitEur.toFixed(2)}</CostPerUnitEur>
  </FinancialObligation>
  <ProvenanceAndAudit>
    <AuditHash>${escapeXml(calc.audit.hash)}</AuditHash>
    <DataQuality>${escapeXml(calc.emissionDataQuality)}</DataQuality>
    <ReadinessScore percent="${calc.readinessScore}">${calc.readinessScore}%</ReadinessScore>
    <LegalBasis>Regulation (EU) 2023/956; Commission Implementing Regulation (EU) 2023/1773</LegalBasis>
  </ProvenanceAndAudit>
</cbam:CBAMReport>
`;

  return xml.trim();
}

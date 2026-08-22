export const CBAM_REGISTRY_RULESET_VERSION = "2026-08-21" as const;
export const CERTIFICATE_COVERAGE_EFFECTIVE_FROM = "2027-01-01" as const;

export type RegistryAggregationLevel = "YEARLY" | "QUARTERLY" | "UNAGGREGATED";

export interface RegistryInstallationIdentity {
  o3ciInstallationId?: string;
  installationNameLatin: string;
  countryOfEstablishment: string;
  economicActivity?: string;
  operatorCorporateRegisterNumber: string;
  operatorNameLatin: string;
  registryIdentityVerifiedAt?: string;
}

export interface RegistryGoodsEmissionRecord {
  reportingYear: number;
  sector: string;
  cnCode: string;
  countryOfOrigin: string;
  quantity: number;
  goodsUnit: string;
  embeddedEmissionsTco2: number;
  installationId?: string;
}

export interface RegistryIdentityReview {
  status: "PASS" | "REGISTRY_IDENTITY_REVIEW";
  reasons: string[];
}

const normalized = (value?: string) => (value ?? "").trim().toLocaleUpperCase("en-US");

export function validateRegistryInstallationIdentity(
  identity: Partial<RegistryInstallationIdentity>,
  expected?: Partial<RegistryInstallationIdentity>,
): RegistryIdentityReview {
  const reasons: string[] = [];

  if (!identity.o3ciInstallationId?.trim()) reasons.push("O3CI_INSTALLATION_ID_MISSING");
  if (!identity.operatorCorporateRegisterNumber?.trim()) reasons.push("OPERATOR_REGISTER_NUMBER_MISSING");
  if (!identity.installationNameLatin?.trim()) reasons.push("INSTALLATION_NAME_LATIN_MISSING");
  if (!identity.operatorNameLatin?.trim()) reasons.push("OPERATOR_NAME_LATIN_MISSING");
  if (!identity.countryOfEstablishment?.trim()) reasons.push("COUNTRY_OF_ESTABLISHMENT_MISSING");

  if (
    expected?.installationNameLatin &&
    normalized(identity.installationNameLatin) !== normalized(expected.installationNameLatin)
  ) reasons.push("REGISTRY_INSTALLATION_NAME_MISMATCH");

  if (
    expected?.operatorCorporateRegisterNumber &&
    normalized(identity.operatorCorporateRegisterNumber) !== normalized(expected.operatorCorporateRegisterNumber)
  ) reasons.push("REGISTRY_OPERATOR_REGISTER_NUMBER_MISMATCH");

  return {
    status: reasons.length === 0 ? "PASS" : "REGISTRY_IDENTITY_REVIEW",
    reasons,
  };
}

export function isCertificateCoverageRequirementActive(asOfIsoDate: string): boolean {
  return asOfIsoDate >= CERTIFICATE_COVERAGE_EFFECTIVE_FROM;
}

export function groupRegistryRecords(
  records: RegistryGoodsEmissionRecord[],
  level: RegistryAggregationLevel,
): RegistryGoodsEmissionRecord[] {
  if (level === "UNAGGREGATED") return [...records];

  const groups = new Map<string, RegistryGoodsEmissionRecord>();
  for (const row of records) {
    const key = [row.reportingYear, row.sector, row.cnCode, row.countryOfOrigin, row.goodsUnit, row.installationId ?? ""].join("|");
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, { ...row });
      continue;
    }
    existing.quantity += row.quantity;
    existing.embeddedEmissionsTco2 += row.embeddedEmissionsTco2;
  }
  return [...groups.values()];
}

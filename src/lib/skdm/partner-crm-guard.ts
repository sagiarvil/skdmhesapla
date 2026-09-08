/**
 * SKDMHesapla — Partner Network CRM & Data Ownership Guard
 * Mandate Section 7: Enforces strict data isolation, non-poaching guarantees,
 * and zero-direct-marketing protection for partner-originated client records.
 */

export interface PartnerClientRecord {
  id: string;
  companyName: string;
  taxNumber?: string;
  partnerOwnerId: string;
  partnerFirmName: string;
  source: "partner";
  directMarketingEligible: false;
  commercialContactAllowed: false;
  createdAt: string;
  updatedAt: string;
  status: "active" | "archived" | "in_progress";
}

export interface PartnerLeadRecord {
  id: string;
  companyName: string;
  contactName: string;
  workEmail: string;
  phone?: string;
  companyType: "gumruk-musavirligi" | "dis-ticaret" | "karbon-cbam" | "diger";
  clientScale: "1_5" | "6_20" | "21_50" | "50_plus";
  mainNeed?: string;
  source: "partner_network_landing";
  directMarketingEligible: false;
  status: "NEW" | "QUALIFIED" | "CONTACTED" | "ACTIVE_PARTNER";
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Enforces the partner protection contract at the data boundary.
 * Prevents any accidental assignment of directMarketingEligible: true.
 */
export function assertPartnerMarketingProtection(record: Partial<PartnerClientRecord | PartnerLeadRecord>): void {
  if (record.source === "partner" || record.source === "partner_network_landing") {
    if ((record as { directMarketingEligible?: boolean }).directMarketingEligible === true) {
      throw new Error("SECURITY_VIOLATION: Partner-originated clients cannot be enrolled into direct marketing.");
    }
  }
}

/**
 * Factory for creating compliant partner-originated lead entities.
 */
export function createPartnerLeadEntity(input: Omit<PartnerLeadRecord, "id" | "source" | "directMarketingEligible" | "status" | "createdAt">): PartnerLeadRecord {
  const lead: PartnerLeadRecord = {
    id: `PARTNER-LEAD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    ...input,
    source: "partner_network_landing",
    directMarketingEligible: false,
    status: "NEW",
    createdAt: new Date().toISOString(),
  };

  assertPartnerMarketingProtection(lead);
  return lead;
}

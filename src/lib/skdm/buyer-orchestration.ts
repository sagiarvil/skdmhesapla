/**
 * SKDMHesapla — EU Importer Supplier Data Collection Orchestration Model
 * Mandate Section 20: Conceptual domain entities and deterministic state machine
 * for managing CBAM supplier data intake, validation, and buyer-side aggregation.
 */

export type CollectionState =
  | "DRAFT"
  | "INVITED"
  | "OPENED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "REVIEW_REQUIRED"
  | "DATA_READY";

export interface BuyerOrganisation {
  id: string;
  legalName: string;
  countryCode: string; // ISO 3166-1 alpha-2 (e.g. DE, IT, NL, FR)
  eoriNumber?: string;
  declarantStatus: "authorised_declarant" | "indirect_representative" | "importer";
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierRelationship {
  id: string;
  buyerId: string;
  supplierCompanyName: string;
  supplierCountry: string; // Typically "TR"
  supplierTaxId?: string; // VKN / Mersis
  contactName: string;
  contactEmail: string;
  status: "ACTIVE" | "ARCHIVED" | "PENDING";
  directMarketingEligible: false; // Non-poaching guarantee: strictly false
  createdAt: string;
}

export interface SupplierInvitation {
  id: string;
  relationshipId: string;
  invitationToken: string;
  reportingYear: number;
  reportingQuarter?: 1 | 2 | 3 | 4;
  targetSectors: Array<"iron-steel" | "aluminium" | "cement" | "fertilizers" | "hydrogen" | "electricity">;
  status: CollectionState;
  invitedAt: string;
  openedAt?: string;
  submittedAt?: string;
}

export interface SupplierSubmission {
  id: string;
  invitationId: string;
  installationName: string;
  installationAddress: string;
  unLocode?: string;
  cnCode: string;
  activityVolumeTonnes: number;
  directEmissionsTCO2e: number;
  indirectEmissionsTCO2e: number;
  specificDirectEmissions: number; // tCO2e / t product
  specificIndirectEmissions: number; // tCO2e / t product
  precursorEmissions?: number;
  evidenceHashes: string[]; // SHA-256 hashes of primary utility records
  status: CollectionState;
  validationIssues?: string[];
  submittedAt: string;
  reviewedAt?: string;
}

export interface BuyerCollection {
  id: string;
  buyerId: string;
  title: string;
  reportingYear: number;
  supplierCount: number;
  readinessScore: number; // 0 to 100
  state: CollectionState;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  entityId: string;
  entityType: "buyer" | "supplier_relationship" | "invitation" | "submission" | "collection";
  eventType: string;
  timestamp: string;
  actor: {
    type: "buyer" | "supplier" | "system";
    id: string;
  };
  details: Record<string, unknown>;
}

/**
 * Valid state transitions for the collection lifecycle.
 */
const VALID_TRANSITIONS: Record<CollectionState, CollectionState[]> = {
  DRAFT: ["INVITED"],
  INVITED: ["OPENED", "DRAFT"],
  OPENED: ["IN_PROGRESS", "INVITED"],
  IN_PROGRESS: ["SUBMITTED", "OPENED"],
  SUBMITTED: ["REVIEW_REQUIRED", "DATA_READY"],
  REVIEW_REQUIRED: ["IN_PROGRESS", "DATA_READY"],
  DATA_READY: ["REVIEW_REQUIRED"], // can reopen if subsequent verification requires adjustments
};

/**
 * Validates whether a state transition is permitted.
 */
export function canTransitionCollection(
  currentState: CollectionState,
  targetState: CollectionState
): boolean {
  const allowed = VALID_TRANSITIONS[currentState];
  return allowed ? allowed.includes(targetState) : false;
}

/**
 * Executes a verified transition with audit trail generation.
 */
export function transitionCollectionState(
  currentState: CollectionState,
  targetState: CollectionState,
  context: {
    entityId: string;
    actor: { type: "buyer" | "supplier" | "system"; id: string };
    reason?: string;
  }
): { newState: CollectionState; auditEvent: AuditEvent } {
  if (!canTransitionCollection(currentState, targetState)) {
    throw new Error(
      "INVALID_LIFECYCLE_TRANSITION: Cannot transition collection from " + currentState + " to " + targetState + "."
    );
  }

  const auditEvent: AuditEvent = {
    id: "AUDIT-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    entityId: context.entityId,
    entityType: "invitation",
    eventType: "STATE_CHANGE_" + currentState + "_TO_" + targetState,
    timestamp: new Date().toISOString(),
    actor: context.actor,
    details: {
      previousState: currentState,
      newState: targetState,
      reason: context.reason || "Standard operational transition",
    },
  };

  return {
    newState: targetState,
    auditEvent,
  };
}

/**
 * Computes a deterministic readiness score (0-100) based on completeness.
 */
export function calculateCollectionReadiness(submission: Partial<SupplierSubmission>): {
  score: number;
  isComplete: boolean;
  missingRequirements: string[];
} {
  const missingRequirements: string[] = [];
  let score = 0;

  if (submission.installationName && submission.installationAddress) {
    score += 20;
  } else {
    missingRequirements.push("Installation boundaries and physical address");
  }

  if (submission.cnCode && /^\d{8}$/.test(submission.cnCode)) {
    score += 20;
  } else {
    missingRequirements.push("Valid 8-digit Combined Nomenclature (CN) code");
  }

  if (
    typeof submission.activityVolumeTonnes === "number" &&
    submission.activityVolumeTonnes > 0
  ) {
    score += 20;
  } else {
    missingRequirements.push("Production activity data in metric tonnes");
  }

  if (
    typeof submission.specificDirectEmissions === "number" &&
    submission.specificDirectEmissions >= 0
  ) {
    score += 20;
  } else {
    missingRequirements.push("Specific direct emissions (SEE direct)");
  }

  if (submission.evidenceHashes && submission.evidenceHashes.length > 0) {
    score += 20;
  } else {
    missingRequirements.push("At least one primary evidence record (energy/fuel bill hash)");
  }

  return {
    score,
    isComplete: score === 100,
    missingRequirements,
  };
}

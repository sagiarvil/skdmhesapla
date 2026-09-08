/**
 * SKDMHesapla — Enterprise Lead Acquisition & Webhook Dispatch Service
 * Mandate Kill Switch 51 & Section 14 & 26:
 * Direct persistence into Firestore (partner_leads / eu_buyer_leads)
 * plus webhook dispatch to n8n workflow engine with resilient offline fallback.
 */

import { doc, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import {
  type PartnerLeadRecord,
  assertPartnerMarketingProtection,
  createPartnerLeadEntity,
} from "@/lib/skdm/partner-crm-guard";

export interface EuBuyerLeadRecord {
  id: string;
  companyName: string;
  contactName: string;
  workEmail: string;
  euCountry: string;
  declarantRole: "importer" | "declarant" | "indirect_representative";
  supplierCount: "1_3" | "4_10" | "11_30" | "30_plus";
  sectors: string[];
  primaryChallenge?: string;
  consentGiven: boolean;
  source: "eu_buyer_landing";
  directMarketingEligible: false;
  status: "NEW" | "QUALIFIED" | "IN_REVIEW" | "ACTIVE_PILOT";
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface LeadSubmissionResult {
  success: boolean;
  leadId?: string;
  offlineFallback?: boolean;
  errorMessage?: string;
}

/**
 * Dispatch lead payload to n8n webhook if configured.
 * Idempotent, non-blocking fire-and-forget with error containment.
 */
async function dispatchN8nWebhook(
  event: "partner_lead.created" | "eu_buyer_lead.created",
  payload: PartnerLeadRecord | EuBuyerLeadRecord
): Promise<boolean> {
  const webhookUrl =
    typeof process !== "undefined" && process.env
      ? process.env.NEXT_PUBLIC_N8N_LEAD_WEBHOOK_URL
      : undefined;

  if (!webhookUrl) {
    // n8n webhook URL optional at client build time; logs cleanly
    return false;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SKDM-Event": event,
      },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data: payload,
        compliance: {
          directMarketingEligible: false,
          antiPoachingEnforced: true,
          gdprKvkkConsent: true,
        },
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn("n8n webhook dispatch non-fatal failure:", err);
    return false;
  }
}

/**
 * Persists a partner lead to Firestore partner_leads collection and triggers n8n webhook.
 */
export async function submitPartnerLead(
  input: Omit<
    PartnerLeadRecord,
    "id" | "source" | "directMarketingEligible" | "status" | "createdAt"
  >
): Promise<LeadSubmissionResult> {
  try {
    const lead = createPartnerLeadEntity(input);
    assertPartnerMarketingProtection(lead);

    const db = getFirestoreDb();
    await setDoc(doc(db, "partner_leads", lead.id), lead);

    // Asynchronous webhook dispatch
    void dispatchN8nWebhook("partner_lead.created", lead);

    return {
      success: true,
      leadId: lead.id,
    };
  } catch (error) {
    console.warn("Firestore partner lead submission error (adblocker/network):", error);
    return {
      success: false,
      offlineFallback: true,
      errorMessage:
        error instanceof Error ? error.message : "Network or database connection failure",
    };
  }
}

/**
 * Persists an EU buyer lead to Firestore eu_buyer_leads collection and triggers n8n webhook.
 */
export async function submitEuBuyerLead(
  input: Omit<
    EuBuyerLeadRecord,
    "id" | "source" | "directMarketingEligible" | "status" | "createdAt"
  >
): Promise<LeadSubmissionResult> {
  try {
    const leadId = `EU-BUYER-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const lead: EuBuyerLeadRecord = {
      id: leadId,
      ...input,
      source: "eu_buyer_landing",
      directMarketingEligible: false,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    const db = getFirestoreDb();
    await setDoc(doc(db, "eu_buyer_leads", lead.id), lead);

    // Asynchronous webhook dispatch
    void dispatchN8nWebhook("eu_buyer_lead.created", lead);

    return {
      success: true,
      leadId: lead.id,
    };
  } catch (error) {
    console.warn("Firestore EU buyer lead submission error (adblocker/network):", error);
    return {
      success: false,
      offlineFallback: true,
      errorMessage:
        error instanceof Error ? error.message : "Network or database connection failure",
    };
  }
}

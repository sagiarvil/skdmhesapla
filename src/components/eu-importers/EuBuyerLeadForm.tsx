"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  Clock,
  Briefcase,
  Globe,
  Layers,
} from "lucide-react";
import { track } from "@/lib/skdm/analytics";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";
import { submitEuBuyerLead } from "@/lib/firebase/lead-service";

const ROLES = [
  { id: "importer-declarant", label: "EU Importer / Authorised Declarant" },
  { id: "customs-rep", label: "Indirect Customs Representative" },
  { id: "procurement", label: "Procurement / Supply Chain Sourcing" },
  { id: "sustainability", label: "Sustainability & Compliance Team" },
  { id: "other", label: "Other Trade & Legal Professional" },
] as const;

const SUPPLIER_COUNTS = [
  { id: "1_5", label: "1 – 5 Turkish Suppliers" },
  { id: "6_20", label: "6 – 20 Turkish Suppliers" },
  { id: "21_50", label: "21 – 50 Turkish Suppliers" },
  { id: "51_plus", label: "51+ Turkish Suppliers" },
] as const;

const CBAM_SECTORS = [
  { id: "iron-steel", label: "Iron & Steel (CN 7201–7326)" },
  { id: "aluminium", label: "Aluminium (CN 7601–7616)" },
  { id: "cement", label: "Cement (CN 2523)" },
  { id: "fertilizer", label: "Fertilizers" },
  { id: "hydrogen", label: "Hydrogen" },
  { id: "multiple", label: "Multiple CBAM Sectors" },
] as const;

export function EuBuyerLeadForm() {
  const [started, setStarted] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [euCountry, setEuCountry] = useState("");
  const [contactName, setContactName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [role, setRole] = useState<string>("importer-declarant");
  const [supplierCount, setSupplierCount] = useState<string>("1_5");
  const [sector, setSector] = useState<string>("iron-steel");
  const [mainChallenge, setMainChallenge] = useState("");
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [serverSaved, setServerSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetEmail = LEGAL_ENTITY.supportEmail;

  function handleInteraction() {
    if (!started) {
      setStarted(true);
      track("eu_importer_form_start");
    }
  }

  function getSummaryText(refId?: string | null) {
    const roleLabel = ROLES.find((r) => r.id === role)?.label || role;
    const countLabel = SUPPLIER_COUNTS.find((s) => s.id === supplierCount)?.label || supplierCount;
    const sectorLabel = CBAM_SECTORS.find((sec) => sec.id === sector)?.label || sector;

    return [
      `=== SKDMHESAPLA EU BUYER SUPPLIER COLLECTION INQUIRY ===`,
      refId ? `Inquiry Reference ID: ${refId}` : "",
      `Timestamp: ${new Date().toISOString()}`,
      `Company Name: ${companyName}`,
      `EU Member State: ${euCountry}`,
      `Contact Name: ${contactName}`,
      `Work Email: ${workEmail}`,
      `Role / Function: ${roleLabel}`,
      `Turkish Supplier Count: ${countLabel}`,
      `Primary CBAM Sector: ${sectorLabel}`,
      "",
      `=== MAIN CHALLENGE / DATA COLLECTION REQUIREMENT ===`,
      mainChallenge || "Requesting standard supplier collection workspace onboarding and data verification support.",
      "",
      `----------------------------------------`,
      `Generated via skdmhesapla.com/eu-importers/`,
      `Data sovereignty: Frankfurt, Germany (EU-hosted).`,
      `Legal notice: SKDMHesapla is a structured software workflow platform, not an authorised CBAM declarant or accredited verifier.`,
    ].filter(Boolean).join("\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    track("eu_importer_form_submit", { role, supplierCount, sector });

    if (!companyName.trim() || !contactName.trim() || !workEmail.trim() || !euCountry.trim()) {
      setError("Please complete all required fields: Company Name, Country, Contact Name, and Work Email.");
      return;
    }
    if (!workEmail.includes("@") || !workEmail.includes(".")) {
      setError("Please enter a valid corporate work email address.");
      return;
    }
    if (!consent) {
      setError("Please confirm your consent for data processing and contact.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const declarantRole: "importer" | "declarant" | "indirect_representative" =
      role === "customs-rep"
        ? "indirect_representative"
        : role === "importer-declarant"
        ? "declarant"
        : "importer";

    const mappedSupplierCount: "1_3" | "4_10" | "11_30" | "30_plus" =
      supplierCount === "1_5"
        ? "1_3"
        : supplierCount === "6_20"
        ? "4_10"
        : supplierCount === "21_50"
        ? "11_30"
        : "30_plus";

    const submission = await submitEuBuyerLead({
      companyName,
      contactName,
      workEmail,
      euCountry: euCountry.trim(),
      declarantRole,
      supplierCount: mappedSupplierCount,
      sectors: [sector],
      primaryChallenge: mainChallenge.trim() || undefined,
      consentGiven: consent,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    if (submission.success && submission.leadId) {
      setLeadId(submission.leadId);
      setServerSaved(true);
    }
    track("eu_importer_form_success", { role, supplierCount, sector, leadId: submission.leadId });

    const subject = encodeURIComponent(`[CBAM Supplier Collection] ${companyName} (${euCountry}) — ${contactName}`);
    const body = encodeURIComponent(getSummaryText(submission.leadId));
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(getSummaryText(leadId)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  return (
    <div id="start-collection" className="relative overflow-hidden rounded-3xl border-2 border-brand-800/25 bg-white p-6 shadow-xl sm:p-8 lg:p-10" lang="en">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-900 via-brand-500 to-emerald-700" />

      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-900 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-500 shadow-xs">
            <Globe className="h-3.5 w-3.5" /> EU Importer Collection Desk
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-ink-700">
            <Clock className="h-3.5 w-3.5 text-brand-800" />
            <span>Target Response: <strong>Same Business Day</strong></span>
          </div>
        </div>
        <h3 className="mt-3 text-2xl font-black text-ink-900 sm:text-3xl">
          Start Your Supplier Collection
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
          Structure emissions data collection from your Turkish suppliers into an auditable, verified-ready CBAM dataset.
        </p>
      </div>

      {submitted ? (
        <div className="mt-8 space-y-6 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  {serverSaved ? "Inquiry Registered" : "Inquiry Prepared"}
                </span>
                {leadId && (
                  <span className="rounded-md border border-emerald-300 bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-950">
                    Ref: {leadId}
                  </span>
                )}
              </div>
              <h4 className="text-xl font-black text-ink-900">
                Thank You, {contactName}
              </h4>
              <p className="text-sm leading-relaxed text-ink-700">
                {serverSaved
                  ? "Your collection inquiry has been registered in our cross-border compliance desk. Our engineering team will review your Turkish supplier setup within one business day. You may also send the inquiry directly from your email client."
                  : `Your collection requirements have been formatted and your email client has opened. You can also copy the structured inquiry below to send directly to ${targetEmail}.`}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-4 font-mono text-xs leading-relaxed text-ink-800 whitespace-pre-wrap">
            {getSummaryText(leadId)}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-800/30 bg-brand-100 px-4 py-2.5 text-xs font-bold text-brand-950 transition hover:bg-brand-100/80"
            >
              {copied ? <Check className="h-4 w-4 text-brand-800" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied to Clipboard" : "Copy Inquiry Text"}
            </button>
            <a
              href={`mailto:${targetEmail}?subject=${encodeURIComponent(`[CBAM Supplier Collection] ${companyName}`)}&body=${encodeURIComponent(getSummaryText(leadId))}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-bold text-brand-500 transition hover:bg-brand-800 hover:text-white"
            >
              <Send className="h-4 w-4" /> Re-open Email Client
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} onFocus={handleInteraction} className="mt-6 space-y-5">
          {error && (
            <div className="rounded-xl border-2 border-amber-500/40 bg-amber-50/90 p-4 text-xs font-bold text-amber-950">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Company / Declarant Name *
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Industrial Europe B.V."
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
            <div>
              <label htmlFor="euCountry" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                EU Member State *
              </label>
              <input
                id="euCountry"
                type="text"
                required
                value={euCountry}
                onChange={(e) => setEuCountry(e.target.value)}
                placeholder="e.g. Germany, Netherlands, Italy..."
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contactName" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Contact Person *
              </label>
              <input
                id="contactName"
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Sophie Weber"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
            <div>
              <label htmlFor="workEmail" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Work Email *
              </label>
              <input
                id="workEmail"
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="name@company.eu"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Your Role / Function *
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="supplierCount" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                Turkish Suppliers *
              </label>
              <select
                id="supplierCount"
                value={supplierCount}
                onChange={(e) => setSupplierCount(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              >
                {SUPPLIER_COUNTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sector" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
                CBAM Goods Sourced *
              </label>
              <select
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
              >
                {CBAM_SECTORS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="mainChallenge" className="block text-xs font-bold uppercase tracking-wider text-ink-800">
              Current Challenge or Requirements
            </label>
            <textarea
              id="mainChallenge"
              rows={3}
              value={mainChallenge}
              onChange={(e) => setMainChallenge(e.target.value)}
              placeholder="e.g. Sourcing steel bar and coil from 8 Turkish mills; need standardized Communication Template outputs and traceable electricity/fuel invoices."
              className="mt-1.5 w-full rounded-xl border border-line bg-white p-3.5 text-sm text-ink-900 placeholder:text-ink-600/50 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800"
            />
          </div>

          <div className="rounded-xl border border-brand-800/15 bg-brand-50/50 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-brand-800 text-brand-800 focus:ring-brand-800"
              />
              <span className="text-xs leading-relaxed text-ink-700">
                I agree to the processing of this corporate inquiry under applicable privacy rules and understand that SKDMHesapla serves as data collection infrastructure, not an accredited verifier.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-900 py-4 px-6 text-sm font-black uppercase tracking-wider text-brand-500 shadow-md transition hover:bg-brand-800 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Registering Inquiry..." : "Submit Collection Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}

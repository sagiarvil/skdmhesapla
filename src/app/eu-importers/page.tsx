import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  Globe,
  FileCheck2,
  Scale,
  Users,
  Layers,
  FileSpreadsheet,
  Lock,
  ArrowDown,
  Database,
  FileText,
  AlertCircle,
  Inbox,
  Workflow,
} from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { EuBuyerLeadForm } from "@/components/eu-importers/EuBuyerLeadForm";
import { EuImporterPageTracker, EuImporterCtaButton } from "@/components/eu-importers/EuImporterPageTracker";

export const metadata: Metadata = pageMetadata({
  path: "/eu-importers/",
  title: "CBAM Supplier Data Collection for EU Importers | SKDMHesapla",
  description:
    "Collect structured CBAM emissions data and supporting evidence from Turkish suppliers through one controlled supplier workflow.",
});

const PROBLEMS = [
  {
    title: "Inconsistent Supplier Data",
    desc: "Turkish manufacturers send varying spreadsheets with inconsistent units, differing boundary definitions, and incomplete production routes.",
    icon: Database,
  },
  {
    title: "Email-Based Follow-Up",
    desc: "Missing parameters such as precursor emissions or specific electricity emission factors are identified through repetitive email exchanges.",
    icon: Inbox,
  },
  {
    title: "Evidence Gaps at Audit",
    desc: "A specific embedded emissions number without primary utility invoices or mass balance records cannot withstand independent verifier scrutiny.",
    icon: AlertCircle,
  },
  {
    title: "Disparate CBAM Readiness",
    desc: "Some Turkish mills possess dedicated carbon accounting teams; others need guided step-by-step navigation from CN classification to installation boundaries.",
    icon: Layers,
  },
];

const COMPARISON_ROWS = [
  {
    metric: "Data Consistency",
    manual: "Disparate spreadsheet layouts, broken formulas, and mismatched units",
    automated: "Uniform, structured workflow aligned with official EU rules",
  },
  {
    metric: "Missing Data Identification",
    manual: "Discovered late during declarant review via repeated email chases",
    automated: "Immediate, visible readiness scoring and real-time gap detection",
  },
  {
    metric: "Evidence & Audit Trail",
    manual: "Utility bills and precursor files stored across disconnected folders",
    automated: "Cryptographically hashed evidence linked directly to emission lines",
  },
  {
    metric: "Supplier Comparison",
    manual: "Manual normalisation required to compare supplier emission intensities",
    automated: "Standardised dataset structures across your entire supplier base",
  },
  {
    metric: "Version Control",
    manual: "Confusion over email attachments and superseded revisions",
    automated: "Controlled submission state machine and transparent revision history",
  },
  {
    metric: "Supplier Guidance",
    manual: "Repetitive guidance calls and regulatory explanation to each supplier",
    automated: "Guided data entry with field-level legal references (FieldHelp)",
  },
];

const WORKFLOW_STEPS = [
  {
    num: "01",
    role: "EU Importer / Declarant",
    title: "Initiate Supplier Collection",
    desc: "Define your reporting period and specify the CBAM goods sourced from your Turkish supply base.",
  },
  {
    num: "02",
    role: "Turkish Manufacturers",
    title: "Structured Data Entry",
    desc: "Suppliers enter verified installation identity, CN products, activity levels, fuel, and precursor inputs.",
  },
  {
    num: "03",
    role: "SKDMHesapla Engine",
    title: "Deterministic Validation & QC",
    desc: "The engine computes direct and indirect specific emissions (SEE) with automated mass-balance checks.",
  },
  {
    num: "04",
    role: "Shared Audit Layer",
    title: "Evidence Dossier Assembly",
    desc: "Supporting utility records, monitoring methodologies, and calculation traces are indexed in a master manifest.",
  },
  {
    num: "05",
    role: "EU Importer Workflow",
    title: "Standardised Dataset Delivery",
    desc: "Receive auditable datasets ready for your internal declarant review and CBAM Transitional / Definitive filing.",
  },
];

const DELIVERABLE_ITEMS = [
  {
    title: "Supplier-Level Readiness Status",
    desc: "A two-axis score measuring data completeness and internal consistency for each supplier installation.",
  },
  {
    title: "Installation Identity & Boundaries",
    desc: "Verified operator name, English trade name, coordinates, UN/LOCODE, and production route boundaries.",
  },
  {
    title: "Product & Combined Nomenclature (CN) Mapping",
    desc: "Exact 8-digit CN codes, representative categories, and production volumes for declared goods.",
  },
  {
    title: "Embedded Emissions Calculations",
    desc: "Explicit separation of specific direct (SEE_dir) and indirect (SEE_indir) emissions per metric tonne.",
  },
  {
    title: "Precursor Substance Accounting",
    desc: "Integrated tracking of complex goods requiring precursor supplier emissions and production routes.",
  },
  {
    title: "Official Communication Template Mapping",
    desc: "Outputs mapped directly to Sections A through G of the European Commission CBAM communication format.",
  },
];

export default function EuImportersPage() {
  return (
    <>
      <RegistryJsonLd route="/eu-importers/" />
      <EuImporterPageTracker />
      <main id="main" className="bg-white text-ink-900" lang="en">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-[#f2f8ed] via-[#f8fbf6] to-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                EU BUYER SUPPLIER COLLECTION
              </div>

              <h1 className="mt-6 text-3xl font-black leading-[1.12] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                Collect CBAM supplier emissions data from Türkiye in one structured workflow.
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base font-normal leading-relaxed text-ink-700 sm:text-lg">
                Invite Turkish suppliers, collect structured installation and product data, organise emissions evidence, and prepare a consistent dataset for your CBAM reporting workflow.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <EuImporterCtaButton
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-900 px-6 py-4 text-sm font-black uppercase tracking-wider text-brand-500 shadow-md transition hover:bg-brand-800 hover:text-white"
                >
                  Start Supplier Collection <ArrowRight className="h-4 w-4" />
                </EuImporterCtaButton>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-2xl border border-brand-800/25 bg-white px-6 py-4 text-sm font-black uppercase tracking-wider text-brand-900 shadow-xs transition hover:bg-brand-50"
                >
                  See How It Works <ArrowDown className="h-4 w-4" />
                </a>
              </div>

              {/* 5-SECOND CLARITY BAR */}
              <div className="mt-12 grid grid-cols-2 gap-3 rounded-2xl border border-brand-800/15 bg-white/90 p-4 shadow-sm sm:grid-cols-4 sm:gap-4 text-left">
                <div className="border-r border-line/60 pr-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">TARGET AUDIENCE</span>
                  <p className="mt-0.5 text-xs font-bold text-ink-900 sm:text-sm">EU Importers &amp; Declarants</p>
                </div>
                <div className="sm:border-r sm:border-line/60 pr-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">SOURCE GEOGRAPHY</span>
                  <p className="mt-0.5 text-xs font-bold text-ink-900 sm:text-sm">Turkish Manufacturers</p>
                </div>
                <div className="border-r border-line/60 pr-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">CORE DELIVERABLE</span>
                  <p className="mt-0.5 text-xs font-bold text-ink-900 sm:text-sm">Structured Verified-Ready Data</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">REGULATORY REGIME</span>
                  <p className="mt-0.5 text-xs font-bold text-brand-900 sm:text-sm">Definitive CBAM 2026</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM STATEMENT */}
        <section className="border-b border-line bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                THE SUPPLY CHAIN DATA PROBLEM
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                Twenty suppliers should not mean twenty different CBAM spreadsheets.
              </h2>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                Procurement and compliance teams sourcing from Türkiye face unstandardised files, missing precursor numbers, and protracted email follow-ups.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROBLEMS.map((prob, i) => {
                const Icon = prob.icon;
                return (
                  <div
                    key={i}
                    className="rounded-3xl border-2 border-brand-800/15 bg-gradient-to-b from-[#fbfdfa] to-white p-6 shadow-xs hover:border-brand-800 transition"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-900 text-brand-500 shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-black text-ink-900">{prob.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-700">{prob.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section id="workflow" className="border-b border-line bg-gradient-to-b from-[#f7fbf3] via-white to-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                END-TO-END COLLECTION WORKFLOW
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                How Data Flows from Turkish Factories to Your Desk
              </h2>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                A structured collection pipeline providing suppliers with guided Turkish interfaces while generating standardized English datasets for EU declarants.
              </p>
            </div>

            <div className="mt-14 space-y-5">
              {WORKFLOW_STEPS.map((s) => (
                <div
                  key={s.num}
                  className="rounded-3xl border-2 border-brand-800/15 bg-white p-6 sm:p-7 shadow-xs hover:border-brand-800 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900 font-mono text-sm font-black text-brand-500 shadow-xs">
                        {s.num}
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-800">
                          {s.role}
                        </span>
                        <h3 className="text-lg font-black text-ink-900">{s.title}</h3>
                        <p className="mt-1 text-xs sm:text-sm text-ink-700 max-w-2xl">{s.desc}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-900 border border-brand-800/20 self-start sm:self-center">
                      Controlled Phase
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION (21ST.DEV PATTERN) */}
        <section id="how-it-works" className="border-b border-line bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                OPERATIONAL COMPARISON
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                From Supplier Chasing to Structured CBAM Data Collection
              </h2>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                Eliminate disconnected email attachments in favor of a traceable, rules-enforced compliance workflow.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border-2 border-brand-800/20 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 bg-brand-900 text-white p-4 sm:p-6">
                <div className="border-b border-white/10 pb-3 md:border-b-0 md:border-r md:pr-6 md:pb-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-300">TRADITIONAL PRACTICE</span>
                  <h3 className="mt-1 text-lg font-black">Spreadsheet &amp; Email Workflow</h3>
                </div>
                <div className="pt-3 md:pt-0 md:pl-6">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-400">STRUCTURED SOLUTION</span>
                  <h3 className="mt-1 text-lg font-black text-brand-500">SKDMHesapla Buyer Collection</h3>
                </div>
              </div>

              <div className="divide-y divide-line bg-white">
                {COMPARISON_ROWS.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 p-5 sm:p-6 gap-4 sm:gap-6 hover:bg-brand-50/30 transition">
                    <div className="space-y-1.5 md:border-r md:border-line md:pr-6">
                      <span className="text-[11px] font-bold text-ink-600 uppercase tracking-wider">{row.metric}</span>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-700">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <span>{row.manual}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 md:pl-6">
                      <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider md:hidden">{row.metric}</span>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-ink-900">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                        <span>{row.automated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU RECEIVE */}
        <section id="dataset" className="border-b border-line bg-gradient-to-b from-[#f9fbf8] to-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                STANDARDISED DELIVERABLES
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                A dataset you can review — not another inbox full of attachments.
              </h2>
              <p className="mt-3 text-sm text-ink-700 sm:text-base">
                Every supplier dataset is organized into verified-ready packages with consistent schemas and audit trails.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {DELIVERABLE_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl border-2 border-brand-800/15 bg-white p-6 shadow-xs hover:border-brand-800 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                    <FileCheck2 className="h-5 w-5 text-brand-800" />
                  </div>
                  <h3 className="mt-4 text-base font-black text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REGULATORY EVIDENCE SECTION */}
        <section id="regulatory-basis" className="border-b border-line bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="rounded-3xl border-2 border-brand-800/25 bg-gradient-to-br from-brand-900 via-brand-900 to-brand-950 p-8 sm:p-12 text-white shadow-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-800/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-400">
                Regulatory Framework
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl text-white">
                Definitive CBAM Alignment &amp; Official Standards
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-100/90 max-w-3xl">
                The EU Carbon Border Adjustment Mechanism transitions to its definitive period on 1 January 2026. Data collected through this platform reflects active European Commission legislation.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-brand-400">
                    CBAM DEFINITIVE PERIOD
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-white">Applicable from 1 January 2026</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    Data structures enforce installation boundaries and direct vs indirect allocation under Regulation (EU) 2023/956 and (EU) 2025/2547.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-brand-400">
                    AUTHORISED DECLARANT
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-white">Statutory Importer Status</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    Relevant EU importers and indirect customs representatives must fulfill their statutory CBAM declarant and surrender requirements.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-brand-400">
                    ACTUAL EMISSIONS DATA
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-white">Primary Verification Evidence</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    Where actual values are used, applicable verification requirements for embedded-emissions data are satisfied with primary records.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-brand-400">
                    OFFICIAL COMMUNICATION
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-white">Commission Templates</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-200">
                    Outputs map directly to European Commission CBAM communication resources and quarterly reporting templates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROLE BOUNDARIES & DISCLAIMER */}
        <section className="border-b border-line bg-gradient-to-b from-[#f7fbf3] to-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="rounded-3xl border-2 border-amber-500/30 bg-white p-6 sm:p-10 shadow-xs">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                  <Lock className="h-5 w-5 text-amber-800" />
                </div>
                <h3 className="text-lg font-black text-ink-900">Regulatory Role &amp; Legal Boundary</h3>
              </div>

              <div className="mt-5 space-y-3 text-xs sm:text-sm text-ink-800 leading-relaxed">
                <p>
                  <strong>SKDMHesapla is a specialized data orchestration and calculation software platform.</strong> To ensure absolute regulatory clarity:
                </p>
                <ul className="space-y-2 text-xs text-ink-700 pl-4 list-disc">
                  <li>SKDMHesapla is <strong>not an authorised CBAM declarant</strong> and does not file reports or surrender CBAM certificates on behalf of importers.</li>
                  <li>SKDMHesapla is <strong>not an accredited CBAM verifier</strong> or auditing body. Datasets produced serve as verification evidence dossiers to streamline review by independent verifiers.</li>
                  <li>SKDMHesapla is <strong>not a competent authority</strong> and provides no official government certification or guaranteed acceptance by EU customs authorities.</li>
                  <li>EU importers and their indirect customs representatives remain solely responsible for fulfilling their statutory declarant obligations under Regulation (EU) 2023/956.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD CAPTURE SECTION */}
        <section className="border-b border-line bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-black uppercase tracking-wider text-brand-800">
                CONNECT YOUR SUPPLY BASE
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                Onboard Your Turkish Suppliers
              </h2>
              <p className="mt-2 text-sm text-ink-700">
                Tell us about your supplier footprint in Türkiye. We will structure your supplier collection workflow and data requirements.
              </p>
            </div>

            <EuBuyerLeadForm />
          </div>
        </section>

        {/* BOTTOM NAV / CORPORATE DESK */}
        <section className="bg-[#f2f8ed] py-12 text-center border-t border-brand-800/10">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-900">
              EU Data Sovereignty &amp; Server Location
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-ink-700">
              Hosted in Frankfurt, Germany (EU-West3) with strict data sovereignty and encryption standards.
              Compliant with European data protection regulations.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-brand-900">
              <Link href="/mevzuat-guncellemeleri/" className="underline hover:text-brand-800">Regulatory Updates →</Link>
              <Link href="/kaynak-politikasi/" className="underline hover:text-brand-800">Source Policy →</Link>
              <Link href="/kullanim-kosullari/" className="underline hover:text-brand-800">Terms of Service →</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

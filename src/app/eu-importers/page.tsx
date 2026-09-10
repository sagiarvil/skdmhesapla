import type { Metadata } from "next";
import Link from "next/link";
import { Check, FileCheck2, Layers3, ShieldCheck, TableProperties } from "lucide-react";
import { CommercialEventLink, CommercialLeadForm, CommercialViewEvent } from "@/components/commercial/CommercialLeadForm";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { SITE_ORIGIN } from "@/lib/skdm/seo";

const title = "CBAM Supplier Data Collection for EU Importers | SKDMHesapla";
const description = "Collect structured CBAM emissions data and supporting evidence from Turkish suppliers through one controlled supplier workflow.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/eu-importers/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "en_GB", url: `${SITE_ORIGIN}/eu-importers/`, siteName: "SKDMHesapla", title, description },
  twitter: { card: "summary_large_image", title, description },
};

const problems = [
  ["INCONSISTENT SUPPLIER DATA", "Different structures, units and levels of completeness."],
  ["EMAIL-BASED FOLLOW-UP", "Missing fields are discovered through repeated email exchanges."],
  ["EVIDENCE GAPS", "A number without source context is difficult to review."],
  ["DIFFERENT LEVELS OF CBAM READINESS", "Some suppliers know their installation data; others are starting from zero."],
];

const comparison = [
  ["Different file structures", "Structured supplier workflow"],
  ["Manual missing-data follow-up", "Visible data-readiness status"],
  ["Evidence stored separately", "Evidence linked to data"],
  ["Difficult supplier comparison", "Consistent dataset structure"],
  ["Version confusion", "Traceable workflow"],
  ["Repeated supplier guidance", "Guided supplier data entry"],
];

const workflow = ["EU IMPORTER / DECLARANT","CREATE SUPPLIER COLLECTION","COORDINATE TURKISH SUPPLIERS","SUPPLIER DATA ENTRY","INSTALLATION + PRODUCT + EMISSIONS + EVIDENCE","VALIDATION / DATA-READINESS","STANDARDISED BUYER DATASET","BUYER'S CBAM WORKFLOW"];

export default function EuImportersPage() {
  return (
    <main id="main" lang="en" className="min-h-screen overflow-x-hidden bg-[#f7f9f3] text-ink-900">
      <RegistryJsonLd route="/eu-importers/" />
      <header className="border-b border-brand-950/15 bg-brand-950 text-white">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-5 px-5 sm:px-7 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="SKDMHesapla home"><img src="/logo/skdm-hesapla.gif" alt="" width="38" height="38" className="h-10 w-10" /><span><strong className="block text-lg tracking-tight">SKDMHesapla</strong><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-300">CBAM supplier data</span></span></Link>
          <nav aria-label="EU importer navigation" className="hidden items-center gap-6 text-sm font-bold text-white/80 md:flex"><a href="#workflow" className="hover:text-white">How it works</a><a href="#data" className="hover:text-white">What you receive</a><a href="#roles" className="hover:text-white">Role boundaries</a></nav>
          <a href="#start" className="inline-flex min-h-11 items-center rounded-xl bg-brand-400 px-4 text-sm font-black text-brand-950">Start collection</a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-brand-950/20 bg-brand-950 text-white" style={{ backgroundImage: "linear-gradient(90deg,rgba(21,38,10,.98),rgba(33,49,16,.94)),url('/desen/guilloche-mesh-koyu.svg')" }}>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-300">EU BUYER SUPPLIER COLLECTION</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">Collect CBAM supplier emissions data from Türkiye in <span className="text-brand-300">one structured workflow.</span></h1>
              <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-white/85 sm:text-lg sm:leading-8">Coordinate Turkish suppliers, collect structured installation and product data, organise emissions evidence and prepare a consistent dataset for your CBAM reporting workflow.</p>
              <div className="mt-8 flex flex-wrap gap-3"><CommercialEventLink href="#start" event="eu_importer_primary_cta_click" className="inline-flex min-h-12 items-center rounded-xl bg-brand-400 px-6 text-sm font-black text-brand-950 shadow-lg hover:bg-brand-300">Start Supplier Collection</CommercialEventLink><a href="#workflow" className="inline-flex min-h-12 items-center rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-black text-white hover:bg-white/10">See How It Works</a></div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl sm:p-8"><Layers3 className="h-9 w-9 text-brand-300" /><p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-brand-300">FOR EU BUYERS</p><h2 className="mt-2 text-2xl font-black">One collection logic for supplier data coming from Türkiye.</h2><div className="mt-6 space-y-3 text-sm font-semibold text-white/85">{['Installation and product data','Embedded-emissions inputs and results','Evidence references','Reporting-period and readiness context'].map((item)=><div key={item} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-brand-300" />{item}</div>)}</div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-7 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">THE SUPPLIER DATA PROBLEM</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">Twenty suppliers should not mean twenty different CBAM spreadsheets.</h2>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{problems.map(([heading,body])=><article key={heading} className="rounded-2xl border border-brand-900/15 bg-white p-5"><p className="text-xs font-black uppercase tracking-[0.1em] text-brand-800">{heading}</p><p className="mt-3 text-sm font-medium leading-6 text-ink-600">{body}</p></article>)}</div>
      </section>

      <section id="workflow" className="relative border-y border-brand-900/10 bg-white py-16">
        <CommercialViewEvent event="eu_importer_workflow_view" />
        <div className="mx-auto max-w-6xl px-5 sm:px-7 lg:px-8"><p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">CONTROLLED WORKFLOW</p><h2 className="mt-3 text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">Move supplier data into a reviewable structure before it reaches your CBAM workflow.</h2><div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{workflow.map((item,index)=><div key={item} className="rounded-2xl border border-brand-900/15 bg-[#fbfcf9] p-4"><span className="font-mono text-xs font-black text-brand-700">{String(index+1).padStart(2,'0')}</span><p className="mt-2 text-sm font-black leading-5 text-brand-950">{item}</p></div>)}</div></div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-7 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">FROM SUPPLIER CHASING TO STRUCTURED CBAM DATA COLLECTION</p>
        <h2 className="mt-3 text-3xl font-black text-brand-950 sm:text-4xl">Make differences visible instead of hiding them in email threads.</h2>
        <div className="mt-8 overflow-hidden rounded-2xl border border-brand-900/15"><div className="grid grid-cols-2 bg-brand-950 px-4 py-4 text-xs font-black uppercase tracking-[0.1em] text-white sm:px-6"><span>SPREADSHEET / EMAIL WORKFLOW</span><span>SKDMHESAPLA BUYER COLLECTION</span></div>{comparison.map(([left,right])=><div key={left} className="grid grid-cols-2 border-t border-brand-900/10 bg-white px-4 py-4 text-sm leading-6 sm:px-6"><span className="pr-4 font-semibold text-ink-600">{left}</span><span className="flex gap-2 font-black text-brand-900"><Check className="mt-1 h-4 w-4 shrink-0" />{right}</span></div>)}</div>
      </section>

      <section id="data" className="border-y border-brand-900/10 bg-brand-50 py-16"><div className="mx-auto max-w-6xl px-5 sm:px-7 lg:px-8"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><TableProperties className="h-8 w-8 text-brand-800" /><h2 className="mt-4 text-3xl font-black text-brand-950 sm:text-4xl">A dataset you can review — not another inbox full of attachments.</h2></div><div className="grid gap-3 sm:grid-cols-2">{['Supplier-level data status','Installation information','Product / CN information','Embedded-emissions inputs and results','Evidence references','Reporting period','Data-readiness status','Structured review context'].map(item=><div key={item} className="flex gap-3 rounded-xl border border-brand-900/10 bg-white p-4 text-sm font-bold text-ink-700"><FileCheck2 className="h-4 w-4 shrink-0 text-brand-800" />{item}</div>)}</div></div></div></section>

      <section id="roles" className="bg-brand-950 py-16 text-white"><div className="mx-auto max-w-6xl px-5 sm:px-7 lg:px-8"><div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr]"><div><ShieldCheck className="h-8 w-8 text-brand-300" /><h2 className="mt-4 text-3xl font-black">Your legal role remains yours.</h2></div><div><p className="text-base font-semibold leading-7 text-white/85">SKDMHesapla structures supplier data and verification-preparation evidence. It does not replace the legal actors in the CBAM chain.</p><ul className="mt-5 grid gap-3 text-sm font-semibold text-white/80 sm:grid-cols-2"><li>Not the authorised CBAM declarant</li><li>Not the competent authority</li><li>Not an accredited CBAM verifier</li><li>No guaranteed filing or acceptance claim</li></ul></div></div></div></section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-7 lg:px-8"><p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">REGULATORY FOUNDATION</p><div className="mt-6 grid gap-4 md:grid-cols-3"><article className="rounded-2xl border border-brand-900/15 bg-white p-5"><h2 className="font-black text-brand-950">Definitive period</h2><p className="mt-2 text-sm leading-6 text-ink-600">CBAM's definitive period applies from 1 January 2026.</p></article><article className="rounded-2xl border border-brand-900/15 bg-white p-5"><h2 className="font-black text-brand-950">Authorised declarant</h2><p className="mt-2 text-sm leading-6 text-ink-600">Applicable EU importers and indirect customs representatives remain responsible for the relevant authorised-declarant requirements.</p></article><article className="rounded-2xl border border-brand-900/15 bg-white p-5"><h2 className="font-black text-brand-950">Actual emissions data</h2><p className="mt-2 text-sm leading-6 text-ink-600">Where actual values are used, applicable verification requirements for embedded-emissions data must be satisfied.</p></article></div></section>

      <section id="start" className="border-t border-brand-900/10 bg-white py-16"><div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-7 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">START SUPPLIER COLLECTION</p><h2 className="mt-3 text-3xl font-black text-brand-950">Tell us how many Turkish suppliers you need to coordinate.</h2><p className="mt-4 text-sm font-medium leading-6 text-ink-600">The form prepares a business enquiry in your email application. It does not claim that a buyer workspace has already been provisioned.</p></div><div className="rounded-3xl border border-brand-900/15 bg-[#f9fbf6] p-6 shadow-sm sm:p-8"><CommercialLeadForm variant="eu" locale="en" /></div></div></section>

      <footer className="border-t border-brand-900/15 bg-[#f2f5ee] py-10"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:px-7 lg:px-8"><div className="flex flex-wrap items-center justify-between gap-5"><Link href="/" className="flex items-center gap-3"><img src="/logo/skdm-hesapla.gif" alt="" width="34" height="34" /><strong>SKDMHesapla</strong></Link><nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-brand-900"><Link href="/partner-network/">Partner Network</Link><Link href="/metodoloji/">Methodology</Link><Link href="/kaynak-politikasi/">Source policy</Link><Link href="/iletisim/">Contact</Link></nav></div><p className="text-xs leading-5 text-ink-500">SKDMHesapla provides structured data preparation and workflow support. It does not provide accredited verification, competent-authority approval or authorised-declarant status.</p></div></footer>
    </main>
  );
}

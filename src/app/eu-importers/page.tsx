import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  FileCheck2,
  Globe2,
  Network,
  Ship,
  ShieldCheck,
} from "lucide-react";
import { pageMetadata, SITE_ORIGIN } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/eu-importers/",
  title: "CBAM Supplier Support in Türkiye for EU Importers | SKDMHesapla",
  description:
    "Refer your Turkish exporter or manufacturer to SKDMHesapla. We coordinate supplier-side CBAM data, evidence and verification-readiness in Türkiye for your EU declarant and verifier workflow.",
});

const importerResponsibilities = [
  "Authorised CBAM declarant status and customs responsibility",
  "Final CBAM declaration and certificate obligations",
  "Selection and engagement of the accredited verifier",
  "Acceptance of the final data used in the EU workflow",
];

const skdmResponsibilities = [
  "Supplier onboarding and requirement translation in Türkiye",
  "Production, energy, precursor and emissions data mapping",
  "Evidence collection structure and consistency checks",
  "Calculation trace and preparation package for declarant/verifier review",
];

const supplierResponsibilities = [
  "Provide source records from the installation and production process",
  "Confirm production routes, quantities and relevant energy/fuel data",
  "Provide precursor and supplier information where applicable",
  "Answer evidence questions and confirm the underlying records",
];

const workflow = [
  ["1", "Refer the supplier", "Send the Turkish exporter or manufacturer to our Türkiye-side workflow."],
  ["2", "Map the data owners", "We identify which records sit with production, energy, purchasing, finance or the installation team."],
  ["3", "Collect and structure evidence", "Source records are organised around the CBAM data fields instead of being exchanged as unstructured email attachments."],
  ["4", "Build the calculation trace", "Production, energy, precursor and emissions inputs are connected to a traceable preparation record."],
  ["5", "Prepare the handover", "You receive a structured supplier-side package for your declarant and accredited-verifier workflow."],
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}/eu-importers/#webpage`,
      url: `${SITE_ORIGIN}/eu-importers/`,
      name: "CBAM Supplier Support in Türkiye for EU Importers",
      description:
        "Türkiye-based supplier-side CBAM data and evidence preparation for EU importers, authorised CBAM declarants and their verifier workflows.",
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      about: ["Carbon Border Adjustment Mechanism", "CBAM supplier data", "embedded emissions"],
    },
    {
      "@type": "Service",
      "@id": `${SITE_ORIGIN}/eu-importers/#service`,
      name: "Türkiye-side CBAM supplier data preparation",
      serviceType: "CBAM supplier-side data, evidence and verification-readiness preparation",
      provider: { "@id": `${SITE_ORIGIN}/#organization` },
      areaServed: [
        { "@type": "Country", name: "Türkiye" },
        { "@type": "AdministrativeArea", name: "European Union" },
      ],
      url: `${SITE_ORIGIN}/eu-importers/`,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_ORIGIN}/eu-importers/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SKDMHesapla", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "EU Importers", item: `${SITE_ORIGIN}/eu-importers/` },
      ],
    },
  ],
};

export default function EuImportersPage() {
  return (
    <main lang="en" className="bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-brand-900 py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-brand-100">
              Türkiye supplier-side CBAM operations
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Your CBAM obligation is in Europe. The data starts in Türkiye.
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-brand-100 sm:text-xl">
              Refer your Turkish exporter or manufacturer to us. We coordinate the supplier-side production, energy, precursor and emissions evidence and prepare it for your EU declarant and accredited-verifier workflow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/iletisim/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 font-black text-brand-900 transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
                Refer a Turkish supplier <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a href="#scope" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-500/40 px-6 font-black text-white transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
                See what we prepare
              </a>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Local execution in Türkiye", "Supplier-side data coordination", "Traceable evidence preparation", "No transfer of declarant responsibility"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-bold text-brand-100">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-brand-500/20 bg-brand-800 p-6 shadow-2xl sm:p-8" aria-label="CBAM supplier-side operating model">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-500 p-3 text-brand-900"><Network className="h-7 w-7" aria-hidden="true" /></div>
              <div><p className="text-xs font-black uppercase tracking-[0.14em] text-brand-100">Local execution layer</p><h2 className="mt-1 text-2xl font-black">EU requirement → Türkiye data → EU workflow</h2></div>
            </div>
            <div className="mt-7 space-y-4">
              {[
                [Building2, "EU importer / declarant", "Defines the compliance need and remains responsible for the EU-side declaration."],
                [Factory, "Turkish exporter / installation", "Provides the underlying production and source records."],
                [FileCheck2, "SKDMHesapla Türkiye", "Turns the supplier-side records into a structured, reviewable preparation package."],
                [ShieldCheck, "Accredited verifier", "Independently verifies actual emissions where actual values are used."],
              ].map(([Icon, title, text]) => {
                const RowIcon = Icon as typeof Building2;
                return <div key={String(title)} className="rounded-2xl border border-brand-500/15 bg-brand-900 p-4"><div className="flex gap-3"><RowIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" /><div><h3 className="font-black">{String(title)}</h3><p className="mt-1 text-sm leading-relaxed text-brand-100">{String(text)}</p></div></div></div>;
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">The operational gap we solve</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">You may already know what your CBAM team needs. Your supplier may not.</h2>
            <p className="mt-5 text-base font-medium leading-relaxed text-ink-700 sm:text-lg">
              The practical delay usually sits between the EU requirement and the Turkish installation records: different terminology, unclear internal data owners, production records in separate departments, precursor information with purchasing teams, and evidence exchanged without a consistent structure. That is the part we manage in Türkiye.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [Globe2, "Translate the requirement", "We turn the EU-side request into supplier-side data tasks that production and finance teams in Türkiye can act on."],
              [Network, "Coordinate the evidence", "We map which record comes from which department and keep the data chain tied to the relevant CBAM field."],
              [FileCheck2, "Prepare the handover", "We organise the result for declarant and verifier review without claiming to replace either role."],
            ].map(([Icon, title, text]) => {
              const CardIcon = Icon as typeof Globe2;
              return <article key={String(title)} className="rounded-3xl border border-line bg-white p-6 shadow-sm"><CardIcon className="h-7 w-7 text-brand-800" aria-hidden="true" /><h3 className="mt-4 text-xl font-black">{String(title)}</h3><p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">{String(text)}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section id="scope" className="bg-brand-100 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Responsibility matrix</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A local execution partner does not change the legal responsibility chain.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink-700">The operating model is intentionally explicit: your EU-side obligations stay with the relevant EU actors; we organise the Turkish supplier-side preparation.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <ResponsibilityCard icon={Building2} title="EU importer / authorised declarant" items={importerResponsibilities} />
            <ResponsibilityCard icon={FileCheck2} title="SKDMHesapla Türkiye" items={skdmResponsibilities} emphasis />
            <ResponsibilityCard icon={Factory} title="Turkish exporter / installation" items={supplierResponsibilities} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Two distinct regulatory workstreams</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Industrial CBAM and maritime carbon are not the same obligation.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink-700">We keep them separate so the right legal actor, data model and evidence chain are used for each case.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border-2 border-brand-800/20 bg-white p-7 shadow-sm">
              <Factory className="h-8 w-8 text-brand-800" aria-hidden="true" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-brand-800">Industrial goods</p>
              <h3 className="mt-2 text-2xl font-black">CBAM / SKDM supplier-side preparation</h3>
              <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-ink-700">
                {["CN / GTİP and installation context","Production process and production volume records","Fuel, electricity and applicable precursor data","Embedded-emissions calculation trace","Evidence structure for actual-values verification readiness","Operator-side data package for declarant/verifier workflow"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" aria-hidden="true" />{item}</li>)}
              </ul>
              <p className="mt-5 rounded-2xl bg-brand-100 p-4 text-sm font-bold leading-relaxed text-ink-900">Actual emissions used in a CBAM declaration require independent verification by an accredited verifier. We prepare the operator-side data and evidence; we do not issue that verification opinion.</p>
            </article>

            <article className="rounded-3xl border-2 border-brand-800/20 bg-white p-7 shadow-sm">
              <Ship className="h-8 w-8 text-brand-800" aria-hidden="true" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-brand-800">Shipping operations</p>
              <h3 className="mt-2 text-2xl font-black">EU MRV · EU ETS Maritime · FuelEU Maritime</h3>
              <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-ink-700">
                {["Ship and responsible-company evidence","Voyage, port, fuel and emissions data structure","MRV and EU ETS calculation preparation","FuelEU energy and GHG-intensity preparation","THETIS-MRV-oriented data/evidence organisation","Verifier-readiness and annual reconciliation controls"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" aria-hidden="true" />{item}</li>)}
              </ul>
              <p className="mt-5 rounded-2xl bg-brand-100 p-4 text-sm font-bold leading-relaxed text-ink-900">This workstream applies to the responsible shipping company / shipowner / ISM Company as defined by the applicable rules. It does not turn an EU goods importer into a maritime compliance actor.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-brand-100 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-3xl"><span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Operating flow</span><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Send us the supplier. Receive a structured supplier-side package back.</h2></div>
          <ol className="mt-10 grid gap-5 lg:grid-cols-5">
            {workflow.map(([step, title, text]) => <li key={step} className="rounded-3xl border border-brand-800/20 bg-white p-5 shadow-sm"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-900 text-sm font-black text-white">{step}</span><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Official reference points</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Built around the current EU operating chain.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink-700">The European Commission’s current CBAM material separates the roles of the non-EU installation operator, accredited verifier and CBAM declarant. Maritime MRV/ETS and FuelEU use a separate shipping-company and THETIS-MRV workflow.</p>
          </div>
          <div className="space-y-3">
            <OfficialLink href="https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en" label="European Commission — CBAM Registry and non-EU operators" />
            <OfficialLink href="https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-verification_en" label="European Commission — CBAM verification" />
            <OfficialLink href="https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector/faq-maritime-transport-eu-emissions-trading-system-ets_en" label="European Commission — EU ETS and MRV Maritime FAQ" />
            <OfficialLink href="https://transport.ec.europa.eu/transport-modes/maritime/decarbonising-maritime-transport-fueleu-maritime_en" label="European Commission — FuelEU Maritime" />
          </div>
        </div>
      </section>

      <section className="bg-brand-900 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 sm:px-6 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight">You do not need to build CBAM capability inside every Turkish supplier.</h2>
            <p className="mt-3 text-base font-medium leading-relaxed text-brand-100">You need a reliable local execution layer that can translate the requirement, structure the supplier-side records and hand the work back into your EU process.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/iletisim/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 font-black text-brand-900 transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Refer a Turkish supplier <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
            <Link href="/is-ortakligi/" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-500/40 px-6 font-black text-white transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Türkiye partner network</Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-10">
        <div className="mx-auto max-w-6xl px-5 text-sm font-medium leading-relaxed text-ink-700 sm:px-6">
          <p><strong className="text-ink-900">Scope boundary:</strong> SKDMHesapla does not replace an authorised CBAM declarant, customs representative, accredited CBAM verifier, administering authority, THETIS-MRV authority workflow or Union Registry obligation. It provides data collection, calculation, quality-control and preparation infrastructure.</p>
        </div>
      </section>
    </main>
  );
}

function ResponsibilityCard({ icon: Icon, title, items, emphasis = false }: { icon: typeof Building2; title: string; items: readonly string[]; emphasis?: boolean }) {
  return <article className={`rounded-3xl border p-6 shadow-sm ${emphasis ? "border-brand-800 bg-brand-900 text-white" : "border-brand-800/20 bg-white"}`}><Icon className={`h-7 w-7 ${emphasis ? "text-brand-500" : "text-brand-800"}`} aria-hidden="true" /><h3 className="mt-4 text-xl font-black">{title}</h3><ul className={`mt-5 space-y-3 text-sm font-medium leading-relaxed ${emphasis ? "text-brand-100" : "text-ink-700"}`}>{items.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${emphasis ? "text-brand-500" : "text-brand-800"}`} aria-hidden="true" />{item}</li>)}</ul></article>;
}

function OfficialLink({ href, label }: { href: string; label: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 font-black text-ink-900 shadow-sm transition hover:border-brand-800/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800"><span>{label}</span><ArrowRight className="h-5 w-5 shrink-0 text-brand-800" aria-hidden="true" /></a>;
}

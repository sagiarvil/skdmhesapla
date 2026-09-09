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

const trustItems = [
  { icon: Globe2, title: "CBAM", text: "Supplier-side industrial data" },
  { icon: Factory, title: "EU ETS", text: "Carbon-cost context" },
  { icon: Ship, title: "FuelEU Maritime", text: "Separate maritime workflow" },
  { icon: FileCheck2, title: "THETIS-MRV", text: "Evidence-oriented preparation" },
] as const;

const steps = [
  {
    no: "01",
    title: "Refer your supplier",
    text: "Introduce the Turkish exporter or installation to SKDMHesapla. We take over the supplier-side preparation workflow from there.",
  },
  {
    no: "02",
    title: "We coordinate the data in Türkiye",
    text: "Production, energy, precursor and source records are mapped to the people who actually hold them inside the supplier organisation.",
  },
  {
    no: "03",
    title: "You receive a structured handover",
    text: "The supplier-side evidence and calculation trace are organised for your declarant and accredited-verifier workflow.",
  },
] as const;

const responsibilityRows = [
  {
    area: "Regulatory responsibility",
    importer: "Remains with the relevant EU-side actor and authorised CBAM declarant.",
    supplier: "Provides the underlying installation and production records.",
    skdm: "Supports preparation only; legal responsibility is not transferred.",
  },
  {
    area: "Data collection",
    importer: "Defines the information needed for the EU workflow.",
    supplier: "Shares activity data, evidence and confirmations.",
    skdm: "Coordinates, structures and quality-checks the Türkiye-side data flow.",
  },
  {
    area: "Emissions inputs",
    importer: "Uses accepted data in the relevant declaration process.",
    supplier: "Provides accurate production, fuel, electricity and precursor inputs.",
    skdm: "Builds a traceable calculation and preparation record.",
  },
  {
    area: "Evidence package",
    importer: "Maintains the EU-side compliance file and review process.",
    supplier: "Provides source documents and installation evidence.",
    skdm: "Organises the supplier-side package for review and verification-readiness.",
  },
  {
    area: "Verification",
    importer: "Engages the appropriate accredited verifier where required.",
    supplier: "Responds to evidence questions about its underlying records.",
    skdm: "Prepares the working file; does not issue the independent verification opinion.",
  },
] as const;

const confidenceItems = [
  { icon: Network, title: "Structured collection", text: "Every request is tied to a clear data owner and field." },
  { icon: FileCheck2, title: "Evidence discipline", text: "Source records remain connected to the figures they support." },
  { icon: Factory, title: "Calculation trace", text: "Production, energy and precursor inputs stay reviewable." },
  { icon: ShieldCheck, title: "Verification boundary", text: "Preparation is separated from independent verifier responsibility." },
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

      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block" aria-hidden="true">
          <img
            src="/desen/ab-turkiye-tokalasma.png"
            alt=""
            className="h-full w-full object-cover opacity-75"
            width="1280"
            height="900"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/70 to-brand-900/10" />
        </div>
        <div className="absolute inset-0 bg-[url('/desen/guilloche-mesh-koyu.svg')] bg-cover bg-center opacity-[0.035]" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.02fr_.98fr] lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-brand-100">
              <span className="h-px w-10 bg-brand-500" />
              Türkiye supplier-side CBAM operations
            </div>
            <h1 className="mt-7 max-w-3xl font-serif text-[42px] font-semibold leading-[1.03] tracking-[-0.035em] sm:text-[64px] lg:text-[72px]">
              Your CBAM obligation is in Europe.
              <span className="mt-2 block text-brand-500">The data starts in Türkiye.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-brand-100 sm:text-lg">
              Refer your Turkish exporter or manufacturer to us. We coordinate the supplier-side data, evidence and calculation preparation needed for a cleaner handover into your EU declarant and accredited-verifier workflow.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/iletisim/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-black text-brand-900 transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Refer your Turkish supplier <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#process"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-100/30 px-6 text-sm font-black text-white transition hover:bg-brand-800"
              >
                See how the handover works
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-brand-100/15 pt-6 text-xs font-bold text-brand-100">
              <span>Türkiye-based execution</span>
              <span>Supplier-side coordination</span>
              <span>Traceable evidence preparation</span>
              <span>No transfer of declarant responsibility</span>
            </div>
          </div>

          <div className="relative mt-14 lg:mt-0 lg:min-h-[520px]" aria-hidden="true">
            <div className="absolute bottom-8 right-0 hidden w-[310px] border-l border-brand-500/50 pl-7 lg:block">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-100">The operational bridge</p>
              <p className="mt-3 font-serif text-2xl leading-tight text-white">EU requirement → Turkish source records → structured handover.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-6 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className={`flex min-h-28 items-center gap-4 py-5 ${index ? "border-l border-line pl-5 sm:pl-7" : "pr-5"}`}>
              <Icon className="h-6 w-6 shrink-0 text-brand-800" aria-hidden="true" />
              <div>
                <p className="font-serif text-lg font-semibold leading-tight">{title}</p>
                <p className="mt-1 text-xs font-medium leading-5 text-ink-700">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="border-b border-line pb-10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-16">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-800">The challenge</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-5xl">
              High compliance pressure. Uneven supplier readiness.
            </h2>
            <p className="mt-6 max-w-xl text-base font-medium leading-8 text-ink-700">
              Your EU team may already know what the CBAM file needs. The friction begins when that request reaches a Turkish supplier whose production records, energy data, precursor information and evidence sit across different departments and systems.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-800">Our role in Türkiye</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-5xl">
              A practical bridge to buyer-ready data.
            </h2>
            <p className="mt-6 max-w-xl text-base font-medium leading-8 text-ink-700">
              We translate the request into supplier-side tasks, map the data owners, structure the source records and prepare the calculation trace. Your legal and verification chain remains exactly where it belongs; the Türkiye-side operational burden becomes manageable.
            </p>
          </div>
        </div>
      </section>

      <section id="process" className="bg-brand-100 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-800">A simple operating model</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">Three steps. One clear handover.</h2>
            </div>
            <p className="max-w-md text-sm font-medium leading-7 text-ink-700">The EU-side team should not need to build CBAM capability inside every supplier. It needs a reliable local execution layer.</p>
          </div>

          <ol className="mt-12 grid gap-0 border-y border-brand-800/20 lg:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.no} className={`relative py-9 lg:px-8 ${index ? "border-t border-brand-800/20 lg:border-l lg:border-t-0" : "lg:pr-8"}`}>
                <span className="font-serif text-sm font-semibold text-brand-800">{step.no}</span>
                <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight">{step.title}</h3>
                <p className="mt-4 max-w-sm text-sm font-medium leading-7 text-ink-700">{step.text}</p>
                {index < 2 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 bg-brand-100 text-brand-800 lg:block" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="max-w-4xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-800">Roles and responsibilities</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">A clear division of roles. No blurred responsibility.</h2>
            <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-ink-700">The table is deliberately explicit: SKDMHesapla is the supplier-side preparation layer in Türkiye, not the authorised declarant or the accredited verifier.</p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-line shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px] border-collapse text-left text-sm">
                <thead className="bg-brand-900 text-white">
                  <tr>
                    <th scope="col" className="w-[18%] px-5 py-5 text-xs font-black uppercase tracking-[0.12em]">Key area</th>
                    <th scope="col" className="w-[27%] border-l border-white/10 px-5 py-5 text-sm font-black">EU importer / declarant</th>
                    <th scope="col" className="w-[27%] border-l border-white/10 px-5 py-5 text-sm font-black">Turkish supplier</th>
                    <th scope="col" className="w-[28%] border-l border-white/10 bg-brand-800 px-5 py-5 text-sm font-black">SKDMHesapla Türkiye support</th>
                  </tr>
                </thead>
                <tbody>
                  {responsibilityRows.map((row, index) => (
                    <tr key={row.area} className={index % 2 ? "bg-brand-100/40" : "bg-white"}>
                      <th scope="row" className="border-t border-line px-5 py-4 font-black text-ink-900">{row.area}</th>
                      <td className="border-l border-t border-line px-5 py-4 font-medium leading-6 text-ink-700">{row.importer}</td>
                      <td className="border-l border-t border-line px-5 py-4 font-medium leading-6 text-ink-700">{row.supplier}</td>
                      <td className="border-l border-t border-line bg-brand-100/35 px-5 py-4 font-semibold leading-6 text-ink-900">{row.skdm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-brand-100 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-800">Different regulations. A common discipline.</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">Two scopes. One partner in Türkiye.</h2>
            </div>
            <p className="max-w-md text-sm font-medium leading-7 text-ink-700">Industrial CBAM and maritime carbon are kept separate because their legal actors, data structures and evidence chains are different.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="relative h-44 overflow-hidden bg-brand-900">
                <img src="/desen/hero-illus-bayrak-A-temiz.png" alt="Industrial supply chain illustration" className="h-full w-full object-cover opacity-55" width="1536" height="976" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 to-brand-900/20" />
                <div className="absolute bottom-5 left-6 flex items-center gap-3 text-white"><Factory className="h-6 w-6 text-brand-500" aria-hidden="true" /><span className="text-xs font-black uppercase tracking-[0.18em]">Industrial goods</span></div>
              </div>
              <div className="p-7 sm:p-8">
                <h3 className="font-serif text-3xl font-semibold">CBAM / SKDM supplier-side preparation</h3>
                <p className="mt-4 text-sm font-medium leading-7 text-ink-700">CN / GTİP context, installation and production records, fuels, electricity, applicable precursor data, embedded-emissions calculation trace and evidence preparation for actual-values review.</p>
                <Link href="/platform-kabiliyetleri/" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-800 hover:text-brand-900">Explore industrial CBAM capabilities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="relative h-44 overflow-hidden bg-brand-900">
                <img src="/desen/dunya-nokta-harita-koyu.webp" alt="International maritime trade map" className="h-full w-full object-cover opacity-70" width="1400" height="700" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 to-brand-900/25" />
                <div className="absolute bottom-5 left-6 flex items-center gap-3 text-white"><Ship className="h-6 w-6 text-brand-500" aria-hidden="true" /><span className="text-xs font-black uppercase tracking-[0.18em]">Shipping operations</span></div>
              </div>
              <div className="p-7 sm:p-8">
                <h3 className="font-serif text-3xl font-semibold">EU MRV · EU ETS Maritime · FuelEU Maritime</h3>
                <p className="mt-4 text-sm font-medium leading-7 text-ink-700">A separate shipping workflow for ship and responsible-company evidence, voyage and fuel data, annual reconciliation, THETIS-MRV-oriented preparation and verifier-readiness controls.</p>
                <Link href="/denizcilik/" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-800 hover:text-brand-900">Explore maritime preparation <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-800">Built for confidence</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">Practical support. Clear evidence. Defined boundaries.</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {confidenceItems.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border-t border-brand-800/25 pt-6">
                <Icon className="h-6 w-6 text-brand-800" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-ink-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-500">From Türkiye-side data to a cleaner EU workflow</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">Refer your Turkish supplier.</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-brand-100">You keep control of the EU compliance process. We help organise the supplier-side work in Türkiye.</p>
          </div>
          <Link href="/iletisim/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 text-sm font-black text-brand-900 hover:bg-brand-400">
            Start the supplier handover <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

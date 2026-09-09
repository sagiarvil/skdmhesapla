import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Factory,
  FileCheck2,
  Globe2,
  Languages,
  Lock,
  Ship,
  ShieldCheck,
} from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";
import { LEGAL_ENTITY } from "@/lib/skdm/constants";

export const metadata: Metadata = pageMetadata({
  path: "/eu/cbam-supplier-support/",
  title: "CBAM Supplier Support for EU Importers | SKDMHesapla",
  description:
    "Refer a Turkish supplier that is late or incomplete on CBAM data. SKDMHesapla structures supplier-side production and emissions data into an evidence-linked working file for the EU compliance workflow.",
});

const PROCESS = [
  {
    step: "01",
    title: "Refer the supplier and deadline",
    text: "Send the supplier contact, product/CN context, reporting period and the date your team needs the working file.",
  },
  {
    step: "02",
    title: "Supplier-side coordination in Turkish",
    text: "With your authorisation, the supplier receives a structured Turkish data request covering the information needed for the relevant workflow.",
  },
  {
    step: "03",
    title: "Build the evidence-linked data chain",
    text: "Production, energy, process, precursor and supporting records are mapped into a traceable calculation and evidence structure.",
  },
  {
    step: "04",
    title: "Return a controlled handover pack",
    text: "Your importer, adviser or verifier workflow receives an organised working file with open items clearly separated from completed data.",
  },
];

const COMPARISON = [
  ["Supplier communication", "Repeated multilingual follow-up", "Structured supplier-side coordination in Turkish"],
  ["Data request", "Different spreadsheets and email threads", "One workflow-specific request structure"],
  ["Evidence trail", "Attachments separated from calculations", "Inputs, calculations and supporting records linked"],
  ["Open items", "Often discovered late", "Visible before handover"],
  ["Deadline control", "Dependent on ad-hoc supplier responses", "Case brief starts from your required handover date"],
  ["Formal compliance decision", "Remains with the responsible EU party", "Remains with the responsible EU party"],
] as const;

const FAQS = [
  {
    q: "Can you contact our Turkish supplier directly?",
    a: "Yes. After your referral and authorisation, supplier-side data collection can be coordinated in Turkish while the EU-facing working file remains in English.",
  },
  {
    q: "Do you replace the EU importer, authorised CBAM declarant or accredited verifier?",
    a: "No. SKDMHesapla prepares supplier-side data, calculations and supporting working files. Formal declarations, verification opinions and competent-authority decisions remain with the legally responsible parties.",
  },
  {
    q: "Can you work alongside our existing customs or compliance adviser?",
    a: "Yes. The service is designed as a supplier-data and working-file layer that can hand over into an existing importer, adviser or verifier process.",
  },
  {
    q: "Is maritime EU ETS or FuelEU treated as CBAM?",
    a: "No. Maritime EU ETS, FuelEU Maritime and THETIS-MRV are kept as a separate regulatory lane. They are never presented as CBAM.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "EU Importer CBAM Supplier Support Desk",
      provider: { "@type": "Organization", name: "SKDMHesapla", url: "https://skdmhesapla.com/" },
      areaServed: "European Union",
      serviceType: "Supplier-side CBAM data preparation and working-file support",
      url: "https://skdmhesapla.com/eu/cbam-supplier-support/",
      description:
        "Supplier-side production and emissions data coordination for EU importers and advisers working with Turkish suppliers.",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SKDMHesapla", item: "https://skdmhesapla.com/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "EU CBAM Supplier Support",
          item: "https://skdmhesapla.com/eu/cbam-supplier-support/",
        },
      ],
    },
  ],
};

export default function EuCbamSupplierSupportPage() {
  const referHref = `mailto:${LEGAL_ENTITY.supportEmail}?subject=EU%20Importer%20-%20Turkish%20Supplier%20Referral`;

  return (
    <article lang="en" className="pasaport-zemin-acik min-h-screen bg-[#f7f9f5] text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.18fr_.82fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-sky-900">
                <Globe2 className="h-4 w-4" /> EU Importer &amp; Adviser Supplier Desk
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-brand-950 sm:text-5xl lg:text-6xl lg:leading-[1.04]">
                When a Turkish supplier cannot deliver CBAM data on time, route the case to us.
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-ink-700 sm:text-xl">
                We work on the supplier side: organise production and emissions data, build the evidence trail and prepare an importer-ready working file. Your team keeps control of the compliance decision and deadline.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={referHref}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800"
                >
                  Refer a Turkish supplier <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#handover"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-800/25 bg-white px-6 py-3 text-sm font-black text-brand-950 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800"
                >
                  See the handover model
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-ink-600">
                <span className="inline-flex items-center gap-1.5"><Languages className="h-4 w-4 text-sky-700" /> Supplier-facing support in Turkish</span>
                <span className="inline-flex items-center gap-1.5"><FileCheck2 className="h-4 w-4 text-brand-800" /> EU-facing working file in English</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-700" /> Evidence-linked calculation trail</span>
              </div>
            </div>

            <aside className="rounded-3xl border border-brand-800/20 bg-[#eef3eb] p-6 shadow-sm sm:p-8" aria-label="Supplier referral case brief">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Case brief</p>
              <h2 className="mt-2 text-2xl font-black text-brand-950">One hand-off instead of another email chain.</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-ink-700">
                Start with the information your team already has. Missing supplier-side records become part of the controlled collection workflow.
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                {[
                  ["EU party", "Company, role and contact"],
                  ["Turkish supplier", "Company and supplier contact"],
                  ["Workflow", "CBAM or separate maritime lane"],
                  ["Timing", "Reporting period and required handover date"],
                  ["Context", "Product/CN or ship/voyage scope information"],
                ].map(([term, value]) => (
                  <div key={term} className="grid grid-cols-[110px_1fr] gap-3 border-b border-brand-900/10 pb-3 last:border-0 last:pb-0">
                    <dt className="font-black text-brand-950">{term}</dt>
                    <dd className="font-medium text-ink-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="pressure-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-800">The supplier-side bottleneck</p>
            <h2 id="pressure-title" className="mt-2 text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">
              The exposure is not another spreadsheet. It is losing control of the deadline.
            </h2>
            <p className="mt-4 text-base font-medium leading-7 text-ink-700">
              EU teams often know what they need but still depend on factory records, local terminology and people inside the Turkish supplier. The value of the Supplier Desk is to move that dependency into a structured, visible handover process.
            </p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Clock, "Late supplier response", "Reporting dates arrive while key production or emissions inputs are still moving through email."],
              [Languages, "Language and ownership gaps", "The right data may exist, but not in the language, owner or format the EU team can use quickly."],
              [Factory, "Factory evidence is fragmented", "Production, fuel, electricity, process and precursor records may sit with different departments."],
              [FileCheck2, "Handover is hard to audit", "A number without its input source and calculation trail creates another review cycle."],
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <Icon className="h-5 w-5 text-brand-800" aria-hidden="true" />
                <h3 className="mt-4 text-base font-black text-brand-950">{String(title)}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-ink-600">{String(text)}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="handover" className="border-y border-line bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Controlled hand-off</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">Four steps. Clear ownership at every boundary.</h2>
            </div>
            <ol className="mt-9 grid gap-4 lg:grid-cols-4">
              {PROCESS.map((item) => (
                <li key={item.step} className="rounded-2xl border border-line bg-[#fbfcfa] p-5">
                  <span className="text-xs font-black tracking-[0.14em] text-sky-800">{item.step}</span>
                  <h3 className="mt-3 text-lg font-black text-brand-950">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-ink-600">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="compare-title">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-800">Operating model comparison</p>
            <h2 id="compare-title" className="mt-2 text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">
              Keep chasing the supplier, or convert the supplier into a managed workstream.
            </h2>
          </div>

          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-line bg-white shadow-sm md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#eef3eb] text-brand-950">
                  <th scope="col" className="w-[28%] px-5 py-4 font-black">Control point</th>
                  <th scope="col" className="w-[36%] px-5 py-4 font-black">Internal supplier chase</th>
                  <th scope="col" className="w-[36%] border-l border-brand-900/10 px-5 py-4 font-black">SKDMHesapla Supplier Desk</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([label, current, desk]) => (
                  <tr key={label} className="border-t border-line align-top">
                    <th scope="row" className="px-5 py-4 font-black text-brand-950">{label}</th>
                    <td className="px-5 py-4 font-medium leading-6 text-ink-600">{current}</td>
                    <td className="border-l border-brand-900/10 px-5 py-4 font-semibold leading-6 text-ink-800">{desk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-7 space-y-3 md:hidden">
            {COMPARISON.map(([label, current, desk]) => (
              <div key={label} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <h3 className="font-black text-brand-950">{label}</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div><dt className="text-xs font-black uppercase tracking-wide text-ink-500">Internal chase</dt><dd className="mt-1 font-medium leading-6 text-ink-600">{current}</dd></div>
                  <div><dt className="text-xs font-black uppercase tracking-wide text-brand-800">Supplier Desk</dt><dd className="mt-1 font-semibold leading-6 text-ink-800">{desk}</dd></div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-[#eef3eb]" aria-labelledby="lanes-title">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Two regulatory lanes</p>
              <h2 id="lanes-title" className="mt-2 text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">Industrial CBAM and maritime carbon compliance stay separate.</h2>
              <p className="mt-4 text-base font-medium leading-7 text-ink-700">The commercial relationship can be one desk. The legal and data architecture must not be one bucket.</p>
            </div>
            <div className="mt-9 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-brand-900/15 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-900"><Factory className="h-5 w-5" /></div><div><p className="text-xs font-black uppercase tracking-wide text-brand-800">Industrial lane</p><h3 className="text-xl font-black text-brand-950">CBAM / SKDM supplier working file</h3></div></div>
                <ul className="mt-6 space-y-3 text-sm font-medium leading-6 text-ink-700">
                  {["CN/GTIP and product-scope context", "Installation, production process and reporting-period data", "Direct and applicable indirect emissions inputs", "SEE (specific embedded emissions), precursor and purchased-material evidence where applicable", "Calculation trail and supporting evidence index", "Communication Template support where applicable to the case"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />{item}</li>)}
                </ul>
                <a className="mt-6 inline-flex items-center gap-1.5 text-sm font-black text-brand-900 underline decoration-brand-300 underline-offset-4" href="https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en" target="_blank" rel="noreferrer">European Commission CBAM definitive regime <ArrowRight className="h-4 w-4" /></a>
              </div>

              <div className="rounded-3xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-900"><Ship className="h-5 w-5" /></div><div><p className="text-xs font-black uppercase tracking-wide text-sky-800">Maritime lane</p><h3 className="text-xl font-black text-brand-950">EU ETS · FuelEU · THETIS-MRV workflow support</h3></div></div>
                <ul className="mt-6 space-y-3 text-sm font-medium leading-6 text-ink-700">
                  {["Company, ship, voyage, fuel and activity data normalisation", "EU MRV / EU ETS reporting evidence structure", "FuelEU Maritime monitoring and reporting data preparation", "THETIS-MRV handover preparation for company/verifier workflows", "Evidence index and review-ready supporting pack", "Regulation-specific boundaries kept separate from CBAM"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />{item}</li>)}
                </ul>
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-black">
                  <a className="text-sky-900 underline decoration-sky-300 underline-offset-4" href="https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector_en" target="_blank" rel="noreferrer">EU ETS shipping</a>
                  <a className="text-sky-900 underline decoration-sky-300 underline-offset-4" href="https://transport.ec.europa.eu/transport-modes/maritime/decarbonising-maritime-transport-fueleu-maritime_en" target="_blank" rel="noreferrer">FuelEU Maritime</a>
                  <a className="text-sky-900 underline decoration-sky-300 underline-offset-4" href="https://www.emsa.europa.eu/thetis-mrv.html" target="_blank" rel="noreferrer">THETIS-MRV / EMSA</a>
                </div>
              </div>
            </div>
            <p className="mt-5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold leading-6 text-sky-950">
              Maritime EU ETS, FuelEU Maritime and THETIS-MRV are not presented as CBAM. Each lane follows its own data, reporting and verification architecture.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="control-title">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-800">Governance boundary</p>
              <h2 id="control-title" className="mt-2 text-3xl font-black tracking-tight text-brand-950">Your control remains yours.</h2>
              <p className="mt-4 text-base font-medium leading-7 text-ink-700">The Supplier Desk removes supplier-side coordination friction. It does not transfer the importer&apos;s, declarant&apos;s, verifier&apos;s or authority&apos;s legal role to SKDMHesapla.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [Building2, "EU party", "Keeps the commercial relationship, reporting calendar and formal compliance role."],
                [ShieldCheck, "Verifier", "Keeps independent verification judgement where verification is required."],
                [Lock, "Supplier data", "Is requested and structured with purpose limitation and a clear evidence trail."],
                [FileCheck2, "SKDMHesapla", "Prepares the supplier-side working file, calculations and supporting data package."],
              ].map(([Icon, title, text]) => (
                <div key={String(title)} className="rounded-2xl border border-line bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-brand-800" /><h3 className="mt-3 font-black text-brand-950">{String(title)}</h3><p className="mt-2 text-sm font-medium leading-6 text-ink-600">{String(text)}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-white" aria-labelledby="faq-title">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <h2 id="faq-title" className="text-3xl font-black tracking-tight text-brand-950">EU supplier referral FAQ</h2>
            <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-[#fbfcfa] px-5 sm:px-7">
              {FAQS.map((item) => (
                <div key={item.q} className="py-5"><h3 className="text-base font-black text-brand-950">{item.q}</h3><p className="mt-2 text-sm font-medium leading-6 text-ink-700">{item.a}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brand-900/15 bg-brand-950 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.14em] text-brand-400">Supplier deadline approaching?</p><h2 className="mt-2 text-3xl font-black">Forward the Turkish supplier. Keep the compliance decision with your team.</h2><p className="mt-3 text-sm font-medium leading-6 text-white/75">Include the required handover date and the regulatory lane in your first message.</p></div>
            <a href={referHref} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-brand-950 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Refer a supplier <ArrowRight className="h-4 w-4" /></a>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-[#f7f9f5]">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs font-semibold leading-5 text-ink-600 sm:px-6 lg:px-8">
          SKDMHesapla prepares working files and supporting data. It does not issue an accredited verification opinion, customs approval, authorised-CBAM-declarant decision or competent-authority decision.
        </div>
      </footer>
    </article>
  );
}

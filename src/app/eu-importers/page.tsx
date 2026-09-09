import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Globe2,
  Leaf,
  MessageCircle,
  Play,
  Ship,
  ShieldCheck,
  Target,
  UserRoundPlus,
} from "lucide-react";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { pageMetadata, SITE_ORIGIN } from "@/lib/skdm/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  path: "/eu-importers/",
  title: "CBAM Supplier Support in Türkiye for EU Importers | SKDMHesapla",
  description:
    "Refer your Turkish exporter or manufacturer to SKDMHesapla. We coordinate supplier-side CBAM data, evidence and verification-readiness in Türkiye for your EU declarant and verifier workflow.",
});

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
  ],
};

const regulations = [
  [Leaf, "CBAM", "Carbon Border Adjustment Mechanism"],
  [Factory, "EU ETS", "EU Emissions Trading System"],
  [Ship, "FuelEU Maritime", "Lower-emission shipping for Europe"],
  [FileCheck2, "THETIS-MRV", "Monitoring, Reporting and Verification"],
] as const;

const steps = [
  {
    no: "1",
    icon: UserRoundPlus,
    title: "Refer your supplier",
    text: "Introduce your Turkish supplier to SKDMHesapla. We take it from there.",
  },
  {
    no: "2",
    icon: ClipboardCheck,
    title: "We coordinate the data in Türkiye",
    text: "We work with your supplier to collect data, prepare emissions inputs and structure the documentation.",
  },
  {
    no: "3",
    icon: BarChart3,
    title: "You receive a structured, review-ready package",
    text: "Get a clear data package to support your CBAM reporting and verifier workflow.",
  },
] as const;

const responsibilityRows = [
  ["Regulatory responsibility", "Holds the relevant EU-side legal responsibility and CBAM declarant obligations.", "Provides required installation, production and activity information.", "Supports data preparation; legal responsibility is not transferred."],
  ["Data collection", "Defines or receives the information needed for the EU compliance workflow.", "Shares activity data, documents and supporting evidence.", "Coordinates and structures supplier-side data collection in Türkiye."],
  ["Emissions calculation inputs", "Reviews and uses accepted data for CBAM reporting.", "Provides accurate production, fuel, electricity and precursor inputs.", "Prepares traceable emissions inputs and calculation support."],
  ["Documentation and evidence", "Maintains the EU-side compliance record and review process.", "Supplies source documents, records and technical evidence.", "Organises a structured, review-ready supplier evidence package."],
  ["CBAM declaration handover", "The authorised CBAM declarant completes and submits the relevant CBAM declaration.", "Supports additional evidence requests when needed.", "Provides preparation support up to the independent verification boundary."],
  ["Ongoing communication", "Maintains the overall EU-side compliance process.", "Responds to supplier-side data and evidence requests.", "Acts as the operational coordination layer in Türkiye."],
] as const;

const confidence = [
  [Target, "Structured data collection", "A clear process for gathering the right activity data and documents."],
  [FileCheck2, "Evidence discipline", "Supporting records remain connected to the figures they support."],
  [BarChart3, "Calculation workflow", "Preparation of emissions inputs using the applicable methodology."],
  [ShieldCheck, "Verifier-ready preparation", "Documentation structured for internal review and external assurance."],
  [MessageCircle, "Ongoing communication", "We liaise with the Turkish supplier to keep the process moving."],
] as const;

export default function EuImportersPage() {
  return (
    <main id="main" lang="en" className={styles.page}>
      <RegistryJsonLd route="/eu-importers/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <header className={styles.nav}>
          <div className={`${styles.shell} ${styles.navInner}`}>
            <Link href="/" className={styles.brand} aria-label="SKDMHesapla home">
              <Leaf className={styles.brandIcon} aria-hidden="true" />
              <span><span className={styles.brandName}>SKDMHesapla</span><span className={styles.brandTag}>Bridging Data for a Cleaner Tomorrow</span></span>
            </Link>
            <nav className={styles.navLinks} aria-label="EU importer page navigation">
              <Link href="/eu-importers/" className={styles.active}>For EU Importers</Link>
              <Link href="/">For Exporters</Link>
              <Link href="/metodoloji/">Our Approach</Link>
              <Link href="/rehber/">Resources</Link>
              <Link href="/hakkinda/">About</Link>
            </nav>
            <span className={styles.lang}><Globe2 size={14} /> EN⌄</span>
            <Link href="/iletisim/" className={styles.contact}>Contact us</Link>
          </div>
        </header>

        <div className={`${styles.shell} ${styles.heroBody}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>Your CBAM obligation<br />is in Europe.<span>The data starts in Türkiye.</span></h1>
            <p className={styles.heroText}>Refer your Turkish supplier to SKDMHesapla for structured data collection, emissions input preparation and buyer-ready reporting support.</p>
            <div className={styles.heroActions}>
              <Link href="/iletisim/" className={styles.primary}>Refer your Turkish supplier <ArrowRight size={14} /></Link>
              <a href="#process" className={styles.how}><span className={styles.play}><Play size={11} /></span> How it works</a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.regStrip} aria-label="EU carbon workstreams">
        <div className={`${styles.shell} ${styles.regGrid}`}>
          {regulations.map(([Icon,title,text]) => <div className={styles.regItem} key={title}><Icon className={styles.regIcon} /><div><div className={styles.regTitle}>{title}</div><div className={styles.regText}>{text}</div></div></div>)}
        </div>
      </section>

      <section className={styles.challenge}>
        <div className={`${styles.shell} ${styles.challengeGrid}`}>
          <article className={styles.challengeBlock}>
            <p className={styles.eyebrow}>The challenge</p>
            <h2 className={styles.sectionTitle}>High compliance pressure.<br />Uneven readiness.</h2>
            <p className={styles.body}>EU importers face demanding CBAM data requirements. Many Turkish suppliers are still early in their preparation, lack structured data, or are unsure how to convert production records into a buyer-ready information set.</p>
          </article>
          <article className={styles.challengeBlock}>
            <p className={styles.eyebrow}>Our solution</p>
            <h2 className={styles.sectionTitle}>A practical bridge to<br />buyer-ready data.</h2>
            <p className={styles.body}>SKDMHesapla works in Türkiye with your supplier to coordinate data collection, prepare emissions inputs and build a structured, review-ready package — while your EU-side legal and verification responsibilities remain unchanged.</p>
          </article>
          <aside className={styles.bridge} aria-label="Same markets. A cleaner tomorrow."><div className={styles.bridgeText}>Same<br />markets.<br />A cleaner<br />tomorrow.</div></aside>
        </div>
      </section>

      <section id="process" className={styles.process}>
        <div className={styles.shell}>
          <div className={styles.processHead}><div><h2 className={styles.sectionTitle}>A simple 3-step process</h2><p className={styles.subtext}>From introduction to a structured, review-ready package.</p></div><span className={styles.sideCaps}>Clear steps. Real progress.</span></div>
          <ol className={styles.stepGrid}>
            {steps.map(({no,icon:Icon,title,text}) => <li className={styles.stepCard} key={no}><span className={styles.stepNo}>{no}</span><div className={styles.stepBody}><Icon className={styles.stepIcon} /><h3>{title}</h3><p>{text}</p></div></li>)}
          </ol>
        </div>
      </section>

      <section className={styles.roles}>
        <div className={styles.shell}>
          <div className={styles.rolesHead}><div><h2 className={styles.sectionTitle}>Roles and responsibilities</h2><p className={styles.subtext}>A clear division of roles. A stronger, more efficient process.</p></div><span className={styles.sideCaps}>Partnership enables compliance.</span></div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Key Area</th><th>EU Importer / Declarant<br />(Your Company)</th><th>Turkish Supplier<br />(Your Business Partner)</th><th>SKDMHesapla Türkiye Support<br />(Our Role)</th></tr></thead>
              <tbody>{responsibilityRows.map(([area, importer, supplier, support]) => <tr key={area}><td>{area}</td><td>{importer}</td><td>{supplier}</td><td>{support}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.scope}>
        <div className={styles.shell}>
          <div className={styles.scopeHead}><div><h2 className={styles.sectionTitle}>Two scopes. One partner in Türkiye.</h2><p className={styles.subtext}>Supporting industrial CBAM and, separately, maritime carbon workstreams.</p></div><span className={styles.sideCaps}>Different regulations.<br />A common goal.</span></div>
          <div className={styles.scopeGrid}>
            <article className={styles.scopeCard}><div className={styles.scopeImageIndustrial} aria-hidden="true" /><div className={styles.scopeCopy}><h3>Industrial CBAM</h3><p>Support your Turkish suppliers in preparing emissions data for CBAM-covered goods, including the production, energy and precursor evidence needed for the relevant workflow.</p><Link href="/platform-kabiliyetleri/">Learn more about industrial CBAM <ArrowRight size={12} /></Link></div></article>
            <article className={styles.scopeCard}><div className={styles.scopeImageMaritime} aria-hidden="true" /><div className={styles.scopeCopy}><h3>Maritime: EU ETS, FuelEU and THETIS-MRV</h3><p>For shipping companies and maritime operators, a separate workstream supports fuel, voyage, emissions and evidence preparation for the applicable maritime regimes.</p><Link href="/denizcilik/">Learn more about maritime support <ArrowRight size={12} /></Link></div></article>
          </div>
        </div>
      </section>

      <section className={styles.confidence}>
        <div className={styles.shell}>
          <div className={styles.confidenceHead}><div><h2 className={styles.sectionTitle}>Built for confidence</h2><p className={styles.subtext}>Practical support. Real progress.</p></div><span className={styles.sideCaps}>From data to confidence.</span></div>
          <div className={styles.confidenceGrid}>{confidence.map(([Icon,title,text]) => <article className={styles.confidenceItem} key={title}><Icon className={styles.confidenceIcon} /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`${styles.shell} ${styles.ctaInner}`}>
          <div className={styles.ctaLeft}><Leaf className={styles.ctaLeaf} /><span>A stronger, more transparent supply chain<br />connects people, businesses and a cleaner Europe.</span></div>
          <div className={styles.ctaCenter}><h2>Refer your Turkish supplier</h2><p>Take the next step towards a more resilient CBAM data workflow.</p></div>
          <Link href="/iletisim/" className={styles.ctaButton}>Get in touch <ArrowRight size={13} /></Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.shell} ${styles.footerInner}`}>
          <div className={styles.footerBrand}><Leaf /><div><strong>SKDMHesapla</strong><span>Bridging Data for a Cleaner Tomorrow</span></div></div>
          <nav className={styles.footerLinks} aria-label="EU importer footer navigation"><Link href="/eu-importers/">For EU Importers</Link><Link href="/">For Exporters</Link><Link href="/metodoloji/">Our Approach</Link><Link href="/rehber/">Resources</Link><Link href="/hakkinda/">About</Link><Link href="/iletisim/">Contact</Link></nav>
          <div className={styles.footerNote}>Türkiye &nbsp; | &nbsp; A cleaner tomorrow, together.</div>
        </div>
      </footer>
    </main>
  );
}

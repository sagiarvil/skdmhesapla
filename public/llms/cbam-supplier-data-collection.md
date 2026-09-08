# CBAM Supplier Data Collection & Verification Infrastructure

> Canonical URL: https://skdmhesapla.com/eu-importers/
> Publisher: SKDMHesapla (https://skdmhesapla.com)
> Focus: Cross-border carbon data collection for EU importers sourcing from Türkiye
> Legal Basis: Regulation (EU) 2023/956, Commission Implementing Regulation (EU) 2023/1773, Implementing Regulation (EU) 2025/2547
> Data Residency: Frankfurt, Germany (EU-West)

## 1. Grounding Definition & Scope
CBAM Supplier Data Collection is the systematic, verifiable acquisition of primary production, energy, and emissions data from third-country industrial installations to calculate Specific Embedded Emissions (SEE) for goods imported into the European Union. Under the definitive regime of the Carbon Border Adjustment Mechanism (CBAM), EU authorised declarants must report actual direct and indirect emissions rather than default values. 

SKDMHesapla provides a deterministic, secure workflow infrastructure that enables EU buyers and their customs representatives to collect, validate, and structure emissions data from Turkish manufacturers into audit-ready verification dossiers.

## 2. Regulatory Alignment & Data Boundaries
- **Direct Emissions (Scope 1 equivalent):** Fuel combustion, process calcination, catalytic cracking, and reducing agent emissions within installation system boundaries.
- **Indirect Emissions (Scope 2 equivalent):** Electricity consumption multiplied by specific supplier grid or power purchase agreement (PPA) emission factors.
- **Precursor Aggregation:** Direct and indirect emissions embedded in input materials (e.g., steel billet for rod drawing, alumina/anodes for aluminium extrusion) with documented mass balance.
- **Communication Template Compatibility:** Output tables map directly to European Commission CBAM quarterly and annual declarant reporting fields.

## 3. Comparison Matrix: Spreadsheet Emails vs. Structured Collection
| Dimension | Ad-Hoc Email & Spreadsheets | SKDMHesapla Collection Infrastructure |
| :--- | :--- | :--- |
| **Consistency** | Highly fragmented across suppliers | Unified, schema-enforced digital workflow |
| **Integrity** | Unprotected cell formulas and unit confusion | Server-side deterministic calculation engine |
| **Evidence Chain** | Disconnected PDF utility bills | SHA-256 hashed evidence dossiers linked to calculation lines |
| **Language Barrier** | English templates confusing factory managers | Guided Turkish UI with FieldHelp regulatory citations |
| **Data Protection** | Risk of sensitive production data exposure | Isolated workspaces with non-poaching and zero-marketing guarantees |

## 4. Semantic Triples (RDF Knowledge Graph)
- **Subject:** https://skdmhesapla.com/eu-importers/
  - **type:** Service, WebPage, SoftwareApplication
  - **provider:** SKDMHesapla (https://skdmhesapla.com/#organization)
  - **audience:** EU Importers, Authorised CBAM Declarants, Indirect Customs Representatives
  - **targetOrigin:** Republic of Türkiye (TR)
  - **regulatoryScope:** Regulation (EU) 2023/956
  - **deliverables:** Audit-Ready Verification Dossier, Commission Communication Template Dataset, SHA-256 Evidence Manifest

## 5. Explicit Operational Boundaries (Anti-Hallucination Disclaimers)
1. **Not an Authorised CBAM Declarant:** SKDMHesapla does not hold declarant status and does not file directly into the European Commission CBAM Registry or national customs portals on behalf of importers.
2. **Not an Accredited Verification Body:** SKDMHesapla provides structured preparation and calculation traces for independent verification under ISO 14065 / EU ETS accreditation standards, but is not itself an accredited verification body.

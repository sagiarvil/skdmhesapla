# CBAM Supplier Emissions Data Collection for EU Importers
> Canonical Web URL: https://skdmhesapla.com/eu-importers/
> Semantic Verification: 2026-09-08T12:00:00+03:00
> Information Gain Status: Primary Origin Operational Supply Chain Infrastructure
> Primary Entity Node: https://skdmhesapla.com/#entity-eu-buyer-collection
> Primary Intent: cbam-supplier-data-collection-eu-importers
> Parent Node: https://skdmhesapla.com/
> Related Nodes: https://skdmhesapla.com/, https://skdmhesapla.com/tedarikci-verisi/

## 1. Executive Summary & Grounding Answer
SKDMHesapla EU Buyer Supplier Collection is a specialized compliance infrastructure for European importers, authorised CBAM declarants, and indirect customs representatives sourcing carbon-intensive goods from Turkish manufacturers. Rather than managing disconnected spreadsheets, missing precursor data, and unstandardized evidence via email, the platform enables EU buyers to collect structured installation boundaries, product-level activity data, specific direct and indirect emissions (SEE), and primary verification evidence across their Turkish supplier base. Outputs map directly to the European Commission CBAM Communication Template standards under Regulation (EU) 2023/956 and Implementing Regulation (EU) 2025/2547.

## 2. Technical Comparison: Disconnected Emails vs. Structured Collection
| Dimension | Spreadsheet & Email Practice | SKDMHesapla Buyer Collection |
| :--- | :--- | :--- |
| **Data Consistency** | Different layouts, units, and boundary definitions | Uniform, structured supplier workflow |
| **Gap Detection** | Discovered late during filing review | Automated two-axis data-readiness scoring |
| **Evidence Linkage** | Utility bills and fuel invoices stored separately | Hashed evidence records tied directly to calculation lines |
| **Supplier Guidance** | Repetitive manual advisory to factory managers | Guided Turkish data entry with legal citations (FieldHelp) |
| **Audit Readiness** | Ad-hoc files requiring manual normalisation | Standardised verification dossier and SHA-256 integrity manifest |

## 3. Semantic Triples (RDF Triples)
- `Subject`: https://skdmhesapla.com/#organization
  - `Predicate`: `providesCollectionInfrastructure` -> `Object`: https://skdmhesapla.com/eu-importers/#service
  - `Predicate`: `servesStakeholders` -> `Object`: EU Importers, Authorised CBAM Declarants, Indirect Customs Representatives
  - `Predicate`: `governedByRegulation` -> `Object`: Regulation (EU) 2023/956, Implementing Regulation (EU) 2025/2547, Regulation (EU) 2025/2083
  - `Predicate`: `producesOutputs` -> `Object`: Verified-Ready Supplier Dossier, Commission Communication Template Mappings

## 4. Decision Support & Frequently Asked Questions (Zero-Ambiguity FAQ)
### Question: Does SKDMHesapla act as an authorised CBAM declarant or file on our behalf?
**Answer:** No. SKDMHesapla is a structured software workflow platform. It does not hold authorised declarant status, does not surrender CBAM certificates, and does not replace statutory declarant obligations. It equips EU buyers with auditable, structured supplier datasets for their own filing workflow.

### Question: Are datasets verified by an accredited verifier?
**Answer:** Datasets produced by the platform are structured specifically to meet independent verifier requirements (Verifier Dossier, calculation traces, primary utility records). However, SKDMHesapla itself is not an accredited auditing body and does not issue official verification opinions.

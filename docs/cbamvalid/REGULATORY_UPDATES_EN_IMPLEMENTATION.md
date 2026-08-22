# CBAMValid — English Regulatory Updates Hub

Target route: `/regulatory-updates/`
Language: `en`
Canonical host: `https://cbamvalid.com`

## Homepage section

**Eyebrow:** Live regulatory monitoring

**Heading:** What changed in EU CBAM?

**Body:** We track European Commission and EUR-Lex changes with their effective date, affected verification module and required implementation action — not as generic news, but as operational verification impact.

**CTA:** View all regulatory updates

## Update 1 — detected 22 August 2026, 18:08 Europe/Istanbul

**Official publication:** 21 August 2026  
**Priority:** P1  
**Title:** CBAM Registry Declarants Portal manual updated

The updated Declarants Portal manual clarifies Registry installation identity matching, goods/emissions query dimensions and the operational timing of the 50% certificate-coverage view from 2027.

Affected modules:
- O3CI / Installation Registry
- Importer Pack
- Verification dossier export
- 2027 certificate-coverage UI

Required implementation:
- Store O3CI installation ID, Latin installation/operator names, country, economic activity and operator corporate register number.
- Normalize importer-facing data by reporting year, sector, CN code, country of origin, quantity, unit, embedded emissions and installation ID.
- Keep 2026 UI from presenting the 50% certificate-coverage requirement as already active; activate date-aware messaging from 1 January 2027.

Official source: European Commission CBAM Registry.

## Update 2 — detected 19 August 2026, 18:14 Europe/Istanbul

**Official publication:** 14 August 2026  
**Priority:** P0  
**Title:** Definitive-period CBAM guidance set published

The Commission's horizontal and sector-specific definitive-period guidance further operationalises production-process grouping, precursor weighted averages, Annex II indirect-emissions logic, composition-aware functional units and monitoring-plan requirements.

Affected modules:
- Production Process
- Precursor Engine
- Embedded Emissions
- Functional Unit
- Monitoring Plan

Required implementation:
- Do not model `CN code = production process` as a one-to-one rule.
- Apply evidence-controlled weighted averages for precursor data where required.
- Remove legacy blanket 5% material-threshold logic from definitive-period calculations.
- Make cement/fertiliser functional-unit inputs composition-aware.

Official source: European Commission CBAM sectors / definitive-period guidance.

## Update 3 — detected 18 August 2026, 18:16 Europe/Istanbul

**Official publication:** 10 August 2026  
**Application:** from 1 January 2026  
**Priority:** P0  
**Title:** Corrected definitive-period default values published

The Commission published a corrected information-only Excel dataset reflecting Implementing Regulation (EU) 2026/1740. The legally binding basis remains Implementing Regulation (EU) 2025/2621 as corrected by 2026/1740.

Affected modules:
- Default Values Engine
- Precursor fallback
- Ruleset/version provenance
- Seal / final verification gate

Required implementation:
- Retire the superseded production reference dataset.
- Persist corrected dataset version and legal basis in calculation provenance.
- Recalculate open dossiers that used superseded default values.

Official sources: European Commission CBAM legislation and guidance; EUR-Lex Implementing Regulation (EU) 2026/1740.

## SEO/index contract

The page must be `index,follow`, self-canonical and present in the XML sitemap. Use `CollectionPage + ItemList` structured data on the hub. Each update should have a stable anchor or dedicated indexable leaf URL once the site has enough update volume to justify separate pages.

Recommended title: `EU CBAM Regulatory Updates | CBAMValid`

Recommended description: `Track EU CBAM regulations, implementing acts, default values, guidance, verification rules and Registry changes with effective dates and verification impact.`

## Trust boundary

Display both `Detected` and `Official publication` as separate fields. A monitoring timestamp must never be presented as the legal publication date. Summaries are informational; the linked Commission/EUR-Lex source remains authoritative.

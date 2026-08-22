# CBAM Registry Alignment — 2026-08-21

This change aligns SKDMHesapla's Verification-Ready Dossier data model with the European Commission's 21 August 2026 Declarants Portal manual.

## Scope

- Add O3CI/Registry installation identity fields.
- Normalize importer-facing goods/emissions records by reporting year, sector, CN code, origin country, quantity, goods unit, embedded emissions and installation ID.
- Support yearly, quarterly and unaggregated presentation layers without coupling the canonical calculation model to a Registry UI view.
- Add Registry identity review gating for missing/mismatched installation identity data.
- Activate the 50% certificate coverage awareness rule from 2027-01-01 only.

## Product rules

1. O3CI-linked dossiers must not be treated as Registry-aligned when the O3CI installation ID or operator corporate register number is missing.
2. Latin-character installation/operator names are stored explicitly for Registry matching.
3. Registry identity mismatch creates `REGISTRY_IDENTITY_REVIEW`; it must not silently pass sealing/export checks.
4. The 50% certificate coverage requirement must not be presented as a currently active 2026 obligation.
5. Aggregation is a presentation/export concern; source calculation records remain canonical and immutable.

## Code

Implemented in `src/lib/skdm/registry-alignment.ts`.

`CBAM_REGISTRY_RULESET_VERSION = 2026-08-21`

`CERTIFICATE_COVERAGE_EFFECTIVE_FROM = 2027-01-01`

## Follow-up integration points

- Wire `validateRegistryInstallationIdentity()` into dossier seal/export validation.
- Map installation onboarding/O3CI screens to `RegistryInstallationIdentity`.
- Map importer-pack export data to `RegistryGoodsEmissionRecord`.
- Add UI text/feature flag driven by `isCertificateCoverageRequirementActive()`.
- Add unit/regression tests for missing identity fields, mismatches and 2026/2027 boundary dates.

import type registryJson from "../../../data/seo/registry.json";
import type factsJson from "../../../data/seo/legal-facts.json";

export type SeoState =
  | "PUBLISHED_INDEXABLE"
  | "PUBLISHED_NOINDEX"
  | "REDIRECTED"
  | "GONE"
  | "DRAFT";

export type SeoRole =
  | "home"
  | "hub"
  | "glossaryHub"
  | "article"
  | "toolLanding"
  | "profile"
  | "application";

export type ConversionEvent =
  | "organic_scope_check_started"
  | "candidate_cn_selected"
  | "scope_result_viewed"
  | "wizard_started"
  | "wizard_layer_completed"
  | "seal_intent"
  | "purchase";

export type RegistryEntry = (typeof registryJson)["entries"][number];
export type LegalFact = (typeof factsJson)["facts"][number];

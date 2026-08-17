import decisions from "../../../data/seo/product-decisions.json";

export type ProductDecision = {
  slug: string;
  attributes: { title: string; body: string }[];
  cnNeed: string;
  boundary: string;
  ctaNote: string;
};

export const PRODUCT_DECISIONS = decisions as ProductDecision[];

export function getProductDecision(slug: string) {
  return PRODUCT_DECISIONS.find((p) => p.slug === slug);
}

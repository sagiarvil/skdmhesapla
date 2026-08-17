import factsJson from "../../../data/seo/legal-facts.json";
import type { LegalFact } from "./types";

const BY_ID = new Map<string, LegalFact>(factsJson.facts.map((f) => [f.id, f]));

export function getLegalFact(id: string): LegalFact {
  const f = BY_ID.get(id);
  if (!f) throw new Error(`legal-facts: ${id} yok`);
  return f;
}

export function legalFactRender(id: string): string {
  return String(getLegalFact(id).render);
}

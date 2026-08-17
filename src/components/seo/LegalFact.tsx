import { legalFactRender } from "@/lib/seo/legal-facts";

export function LegalFact({ id }: { id: string }) {
  return <span data-legal-fact={id}>{legalFactRender(id)}</span>;
}

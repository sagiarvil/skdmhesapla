export type QueryIntent = {
  query: string;
  ownerUrl: string;
  intentType: "informational" | "commercial" | "transactional";
};

export const QUERY_OWNERSHIP_REGISTRY: QueryIntent[] = [
  { query: "SKDM nedir", ownerUrl: "/sozluk/cbam", intentType: "informational" },
  { query: "CBAM nedir", ownerUrl: "/sozluk/cbam", intentType: "informational" },
  { query: "SKDM hesaplama", ownerUrl: "/basla", intentType: "transactional" },
  { query: "SKDM mevzuatı", ownerUrl: "/mevzuat", intentType: "informational" },
  { query: "CBAM metodolojisi", ownerUrl: "/metodoloji", intentType: "informational" },
  { query: "GTİP SKDM kapsamı", ownerUrl: "/basla", intentType: "transactional" },
  { query: "demir çelik SKDM", ownerUrl: "/sektor/demir-celik", intentType: "commercial" },
  { query: "alüminyum SKDM", ownerUrl: "/sektor/aluminyum", intentType: "commercial" },
  { query: "çimento SKDM", ownerUrl: "/sektor/cimento", intentType: "commercial" },
  { query: "gübre SKDM", ownerUrl: "/sektor/gubre", intentType: "commercial" },
  { query: "elektrik SKDM", ownerUrl: "/sektor/elektrik", intentType: "commercial" },
  { query: "hidrojen SKDM", ownerUrl: "/sektor/hidrojen", intentType: "commercial" }
];

export function checkCannibalization(newQuery: string, targetUrl: string) {
  const existing = QUERY_OWNERSHIP_REGISTRY.find(q => q.query.toLowerCase() === newQuery.toLowerCase());
  if (existing && existing.ownerUrl !== targetUrl) {
    console.warn(`[CANNIBALIZATION WARN] Intent "${newQuery}" is already owned by ${existing.ownerUrl}. You are trying to use it for ${targetUrl}.`);
    return false;
  }
  return true;
}

export type QueryIntent = {
  query: string;
  ownerUrl: string;
  intentType: "informational" | "commercial" | "transactional";
};

export const QUERY_OWNERSHIP_REGISTRY: QueryIntent[] = [
  { query: "SKDM nedir", ownerUrl: "/rehber", intentType: "informational" },
  { query: "CBAM nedir", ownerUrl: "/sozluk/cbam", intentType: "informational" },
  { query: "SKDM hesaplama", ownerUrl: "/basla", intentType: "transactional" },
  { query: "SKDM mevzuatı", ownerUrl: "/mevzuat", intentType: "informational" },
  { query: "2026 CBAM metodolojisi", ownerUrl: "/metodoloji", intentType: "informational" },
  { query: "CBAM metodolojisi", ownerUrl: "/metodoloji", intentType: "informational" },
  { query: "GTİP SKDM kapsamı", ownerUrl: "/basla", intentType: "transactional" },
  { query: "50 ton muafiyeti", ownerUrl: "/rehber", intentType: "informational" },
  { query: "gömülü emisyon nedir", ownerUrl: "/rehber", intentType: "informational" },
  { query: "SEE nedir", ownerUrl: "/metodoloji", intentType: "informational" },
  { query: "prekürsör nedir", ownerUrl: "/metodoloji", intentType: "informational" },
  { query: "CBAM doğrulama", ownerUrl: "/rehber", intentType: "informational" },
  { query: "Communication Template", ownerUrl: "/rehber", intentType: "informational" },
  { query: "demir çelik SKDM", ownerUrl: "/sektor/demir-celik", intentType: "commercial" },
  { query: "alüminyum SKDM", ownerUrl: "/sektor/aluminyum", intentType: "commercial" },
  { query: "çimento SKDM", ownerUrl: "/sektor/cimento", intentType: "commercial" },
  { query: "gübre SKDM", ownerUrl: "/sektor/gubre", intentType: "commercial" },
  { query: "elektrik SKDM", ownerUrl: "/sektor/elektrik", intentType: "commercial" },
  { query: "hidrojen SKDM", ownerUrl: "/sektor/hidrojen", intentType: "commercial" },
];

export function checkCannibalization(newQuery: string, targetUrl: string) {
  const normalizedQuery = newQuery.trim().toLocaleLowerCase("tr-TR");
  const existing = QUERY_OWNERSHIP_REGISTRY.find(
    (item) => item.query.trim().toLocaleLowerCase("tr-TR") === normalizedQuery,
  );
  if (existing && existing.ownerUrl !== targetUrl) {
    console.warn(
      `[CANNIBALIZATION WARN] Intent "${newQuery}" is already owned by ${existing.ownerUrl}. You are trying to use it for ${targetUrl}.`,
    );
    return false;
  }
  return true;
}

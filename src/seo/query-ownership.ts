export type QueryIntent = {
  query: string;
  ownerUrl: string;
  intentType: "informational" | "commercial" | "transactional";
};

export const QUERY_OWNERSHIP_REGISTRY: QueryIntent[] = [
  { query: "SKDM nedir", ownerUrl: "/rehber", intentType: "informational" },
  { query: "CBAM nedir", ownerUrl: "/sozluk/cbam", intentType: "informational" },

  // Ana para sorguları — tek ticari owner.
  { query: "SKDM hesaplama", ownerUrl: "/cbam-hesaplama", intentType: "transactional" },
  { query: "CBAM hesaplama", ownerUrl: "/cbam-hesaplama", intentType: "transactional" },
  { query: "SKDM hesaplama aracı", ownerUrl: "/cbam-hesaplama", intentType: "transactional" },
  { query: "CBAM hesaplama aracı", ownerUrl: "/cbam-hesaplama", intentType: "transactional" },
  { query: "CBAM raporu", ownerUrl: "/cbam-hesaplama", intentType: "commercial" },
  { query: "SKDM raporu", ownerUrl: "/cbam-hesaplama", intentType: "commercial" },
  { query: "CBAM raporu nasıl hazırlanır", ownerUrl: "/cbam-hesaplama", intentType: "commercial" },
  { query: "SKDM raporu hazırlama", ownerUrl: "/cbam-hesaplama", intentType: "commercial" },
  { query: "CBAM Excel", ownerUrl: "/cbam-hesaplama", intentType: "commercial" },
  { query: "CBAM hesaplama Excel", ownerUrl: "/cbam-hesaplama", intentType: "commercial" },
  { query: "Communication Template", ownerUrl: "/cbam-hesaplama", intentType: "informational" },

  // Kapsam ve satın alma öncesi sorgular.
  { query: "GTİP SKDM kapsamı", ownerUrl: "/basla", intentType: "transactional" },
  { query: "CBAM GTİP sorgulama", ownerUrl: "/basla", intentType: "transactional" },
  { query: "SKDM GTİP sorgulama", ownerUrl: "/basla", intentType: "transactional" },
  { query: "CBAM 50 ton", ownerUrl: "/cbam-50-ton-muafiyeti", intentType: "informational" },
  { query: "SKDM 50 ton", ownerUrl: "/cbam-50-ton-muafiyeti", intentType: "informational" },
  { query: "CBAM 50 ton muafiyeti", ownerUrl: "/cbam-50-ton-muafiyeti", intentType: "informational" },
  { query: "50 ton muafiyeti", ownerUrl: "/cbam-50-ton-muafiyeti", intentType: "informational" },

  // Doğrulama / Registry sorguları.
  { query: "CBAM doğrulama", ownerUrl: "/cbam-dogrulama", intentType: "informational" },
  { query: "SKDM doğrulayıcı", ownerUrl: "/cbam-dogrulama", intentType: "informational" },
  { query: "CBAM verifier", ownerUrl: "/cbam-dogrulama", intentType: "informational" },
  { query: "CBAM Registry verifier", ownerUrl: "/cbam-dogrulama", intentType: "informational" },

  // Maliyet ve takvim.
  { query: "CBAM sertifika fiyatı", ownerUrl: "/fiyatlandirma", intentType: "commercial" },
  { query: "SKDM maliyeti", ownerUrl: "/fiyatlandirma", intentType: "commercial" },
  { query: "karbon vergisi hesaplama", ownerUrl: "/fiyatlandirma", intentType: "commercial" },
  { query: "CBAM 2026", ownerUrl: "/sss", intentType: "informational" },
  { query: "SKDM 2026", ownerUrl: "/sss", intentType: "informational" },

  // Denizcilik karbon uyum sorguları — CBAM çekirdeğinden ayrı owner'lar.
  { query: "denizcilik karbon uyum", ownerUrl: "/denizcilik", intentType: "commercial" },
  { query: "EU MRV Türkiye", ownerUrl: "/denizcilik/eu-mrv", intentType: "commercial" },
  { query: "denizcilik MRV", ownerUrl: "/denizcilik/eu-mrv", intentType: "commercial" },
  { query: "EU ETS denizcilik", ownerUrl: "/denizcilik/eu-ets", intentType: "commercial" },
  { query: "EU ETS gemi maliyeti", ownerUrl: "/denizcilik/eu-ets", intentType: "transactional" },
  { query: "FuelEU Maritime Türkiye", ownerUrl: "/denizcilik/fueleu", intentType: "commercial" },
  { query: "FuelEU hesaplama", ownerUrl: "/denizcilik/fueleu", intentType: "transactional" },
  { query: "denizcilik ETS kapsam kontrolü", ownerUrl: "/denizcilik/kapsam-kontrolu", intentType: "transactional" },
  { query: "CBAM lojistik partner", ownerUrl: "/denizcilik/cbam-ihracatci-masasi", intentType: "commercial" },

  // Teknik bilgi kümeleri.
  { query: "SKDM mevzuatı", ownerUrl: "/mevzuat", intentType: "informational" },
  { query: "2026 CBAM metodolojisi", ownerUrl: "/metodoloji", intentType: "informational" },
  { query: "CBAM metodolojisi", ownerUrl: "/metodoloji", intentType: "informational" },
  { query: "gömülü emisyon nedir", ownerUrl: "/rehber", intentType: "informational" },
  { query: "SEE nedir", ownerUrl: "/metodoloji", intentType: "informational" },
  { query: "prekürsör nedir", ownerUrl: "/metodoloji", intentType: "informational" },

  // Sektör owner'ları.
  { query: "demir çelik SKDM", ownerUrl: "/sektor/demir-celik", intentType: "commercial" },
  { query: "alüminyum SKDM", ownerUrl: "/sektor/aluminyum", intentType: "commercial" },
  { query: "çimento SKDM", ownerUrl: "/sektor/cimento", intentType: "commercial" },
  { query: "gübre SKDM", ownerUrl: "/sektor/gubre", intentType: "commercial" },
  { query: "elektrik SKDM", ownerUrl: "/sektor/elektrik", intentType: "commercial" },
  { query: "hidrojen SKDM", ownerUrl: "/sektor/hidrojen", intentType: "commercial" },
];

export function checkCannibalization(newQuery: string, targetUrl: string) {
  const normalizedQuery = newQuery.trim().toLocaleLowerCase("tr-TR");
  const normalizeRoute = (route: string) => route === "/" ? "/" : route.replace(/\/$/, "");
  const target = normalizeRoute(targetUrl);
  const existing = QUERY_OWNERSHIP_REGISTRY.find(
    (item) => item.query.trim().toLocaleLowerCase("tr-TR") === normalizedQuery,
  );
  if (existing && normalizeRoute(existing.ownerUrl) !== target) {
    console.warn(
      `[CANNIBALIZATION WARN] Intent "${newQuery}" is already owned by ${existing.ownerUrl}. You are trying to use it for ${targetUrl}.`,
    );
    return false;
  }
  return true;
}

export interface PcfMaterialDefinition {
  readonly id: string;
  readonly labelTr: string;
  readonly labelEn: string;
  readonly group: string;
  readonly keywords: readonly string[];
}

export const PCF_MATERIALS: readonly PcfMaterialDefinition[] = [
  { id: "aluminium", labelTr: "Alüminyum", labelEn: "Aluminium", group: "metal", keywords: ["alüminyum", "aluminium", "aluminum", "profil", "ekstrüzyon"] },
  { id: "steel", labelTr: "Karbon çeliği", labelEn: "Carbon steel", group: "metal", keywords: ["çelik", "steel"] },
  { id: "stainless-steel", labelTr: "Paslanmaz çelik", labelEn: "Stainless steel", group: "metal", keywords: ["paslanmaz", "inox", "stainless"] },
  { id: "copper", labelTr: "Bakır", labelEn: "Copper", group: "metal", keywords: ["bakır", "copper"] },
  { id: "brass", labelTr: "Pirinç", labelEn: "Brass", group: "metal", keywords: ["pirinç", "brass"] },
  { id: "zinc", labelTr: "Çinko", labelEn: "Zinc", group: "metal", keywords: ["çinko", "zinc"] },
  { id: "lead", labelTr: "Kurşun", labelEn: "Lead", group: "metal", keywords: ["kurşun", "lead"] },
  { id: "glass", labelTr: "Cam", labelEn: "Glass", group: "mineral", keywords: ["cam", "glass"] },
  { id: "ceramic-tile", labelTr: "Seramik / karo", labelEn: "Ceramic tile", group: "mineral", keywords: ["seramik", "karo", "ceramic", "tile"] },
  { id: "sanitary-ceramic", labelTr: "Vitrifiye / sıhhi seramik", labelEn: "Sanitary ceramic", group: "mineral", keywords: ["vitrifiye", "lavabo", "sanitary ceramic"] },
  { id: "marble", labelTr: "Mermer", labelEn: "Marble", group: "stone", keywords: ["mermer", "marble"] },
  { id: "travertine", labelTr: "Traverten", labelEn: "Travertine", group: "stone", keywords: ["traverten", "travertine"] },
  { id: "granite", labelTr: "Granit", labelEn: "Granite", group: "stone", keywords: ["granit", "granite"] },
  { id: "pvc", labelTr: "PVC", labelEn: "PVC", group: "polymer", keywords: ["pvc", "polivinil"] },
  { id: "pp", labelTr: "Polipropilen (PP)", labelEn: "Polypropylene (PP)", group: "polymer", keywords: ["pp", "polipropilen"] },
  { id: "pet", labelTr: "PET", labelEn: "PET", group: "polymer", keywords: ["pet", "polyethylene terephthalate"] },
  { id: "hdpe", labelTr: "HDPE", labelEn: "HDPE", group: "polymer", keywords: ["hdpe"] },
  { id: "ldpe", labelTr: "LDPE", labelEn: "LDPE", group: "polymer", keywords: ["ldpe"] },
  { id: "rubber", labelTr: "Kauçuk", labelEn: "Rubber", group: "polymer", keywords: ["kauçuk", "rubber"] },
  { id: "mdf", labelTr: "MDF", labelEn: "MDF", group: "wood", keywords: ["mdf"] },
  { id: "particleboard", labelTr: "Sunta / yonga levha", labelEn: "Particleboard", group: "wood", keywords: ["sunta", "yonga", "particleboard"] },
  { id: "plywood", labelTr: "Kontrplak", labelEn: "Plywood", group: "wood", keywords: ["kontrplak", "plywood"] },
  { id: "solid-wood", labelTr: "Masif ahşap", labelEn: "Solid wood", group: "wood", keywords: ["ahşap", "masif", "wood"] },
  { id: "paper", labelTr: "Kâğıt", labelEn: "Paper", group: "paper", keywords: ["kağıt", "kâğıt", "paper"] },
  { id: "cardboard", labelTr: "Karton / oluklu mukavva", labelEn: "Cardboard / corrugated board", group: "paper", keywords: ["karton", "mukavva", "cardboard"] },
  { id: "textile", labelTr: "Tekstil", labelEn: "Textile", group: "textile", keywords: ["tekstil", "kumaş", "textile"] },
  { id: "carpet", labelTr: "Halı", labelEn: "Carpet", group: "textile", keywords: ["halı", "carpet"] },
  { id: "leather", labelTr: "Deri", labelEn: "Leather", group: "textile", keywords: ["deri", "leather"] },
  { id: "cement-product", labelTr: "Çimento esaslı mamul", labelEn: "Cement-based product", group: "construction", keywords: ["çimento mamul", "beton", "cement product"] },
  { id: "paint", labelTr: "Boya / kaplama", labelEn: "Paint / coating", group: "chemical", keywords: ["boya", "kaplama", "paint", "coating"] },
  { id: "chemical-generic", labelTr: "Kimyasal girdi", labelEn: "Chemical input", group: "chemical", keywords: ["kimyasal", "chemical"] },
] as const;

export const PCF_PRIORITY_COVERAGE_IDS = [
  "ceramic-tile", "sanitary-ceramic", "marble", "travertine", "granite",
  "mdf", "particleboard", "plywood", "copper", "brass", "zinc", "lead",
  "stainless-steel", "carpet", "textile", "leather", "cement-product", "paint",
  "chemical-generic", "aluminium", "glass", "pvc",
] as const;

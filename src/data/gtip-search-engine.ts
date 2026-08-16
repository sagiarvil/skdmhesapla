import lexiconData from "./skdm_product_cn_lexicon_2026.json";

export interface LexiconRecord {
  id: string;
  sector: string;
  canonical_product_tr: string;
  aliases: string[];
  candidate_cn: string[];
  official_heading_summary: string;
  cbam_scope_candidate: "IN" | "OUT" | "LIKELY_OUT" | "AMBIGUOUS";
  base_confidence: "high" | "medium" | "low" | "very_low";
  disambiguation_questions: string[];
  exclusion_or_alt_triggers: string[];
  source_url: string;
  notes: string;
}

export interface GenericOption {
  label: string;
  query: string;
}

export interface GenericGuard {
  keywords: string[];
  title: string;
  options: GenericOption[];
}

export const GENERIC_GUARDS: GenericGuard[] = [
  {
    keywords: ["demir", "demır"],
    title: "Demir çok geniş bir ailedir. Hangi ürünü arıyorsunuz?",
    options: [
      { label: "İnşaat Demiri (Nervürlü)", query: "inşaat demiri" },
      { label: "Sac / Rulo / Levha", query: "çelik sac" },
      { label: "Çelik Profil (HEA/HEB/IPE)", query: "çelik profil" },
      { label: "Dikişli / Dikişsiz Çelik Boru", query: "çelik boru" },
      { label: "Civata / Somun / Bağlantı Elemanı", query: "cıvata" },
      { label: "Filmaşin / Kangal Çubuk", query: "filmaşin" },
    ],
  },
  {
    keywords: ["celik", "çelik"],
    title: "Çelik ürünleri farklı GTİP fasıllarına ayrılır. Seçiminizi daraltın:",
    options: [
      { label: "Sıcak Haddelenmiş Rulo (HRC)", query: "sıcak haddelenmiş rulo" },
      { label: "Soğuk Haddelenmiş Sac (CRC / DKP)", query: "soğuk haddelenmiş sac" },
      { label: "Paslanmaz Çelik Sac / Profil", query: "paslanmaz çelik sac" },
      { label: "Yapısal Çelik Konstrüksiyon", query: "çelik konstrüksiyon" },
      { label: "Çelik Tel / Halat", query: "çelik tel" },
    ],
  },
  {
    keywords: ["aluminyum", "alüminyum"],
    title: "Alüminyum ürün kategorisini seçin:",
    options: [
      { label: "Ham Alüminyum Külçe", query: "alüminyum külçe" },
      { label: "Ekstrüzyon Alüminyum Profil", query: "alüminyum profil" },
      { label: "Alüminyum Levha / Plaka", query: "alüminyum levha" },
      { label: "Alüminyum Folyo", query: "alüminyum folyo" },
      { label: "Alüminyum Kapı / Pencere / Yapı", query: "alüminyum kapı" },
      { label: "Alüminyum Tel / İletken", query: "alüminyum tel" },
    ],
  },
  {
    keywords: ["gubre", "gübre"],
    title: "Gübre türünüzü seçiniz:",
    options: [
      { label: "Üre (%46 N)", query: "üre gübre" },
      { label: "Amonyum Nitrat (AN / CAN)", query: "amonyum nitrat" },
      { label: "Kompoze Gübre (NPK / DAP)", query: "npk gübre" },
      { label: "Sıvı Azot Çözeltisi (UAN)", query: "uan çözeltisi" },
      { label: "Susuz Amonyak", query: "susuz amonyak" },
    ],
  },
  {
    keywords: ["profil"],
    title: "Profil malzemesini ve tipini seçin:",
    options: [
      { label: "Çelik Profil (Ağır Yapı / IPE / HEB)", query: "çelik profil" },
      { label: "Alüminyum Profil (Ekstrüzyon)", query: "alüminyum profil" },
      { label: "Paslanmaz Çelik Profil", query: "paslanmaz çelik profil" },
      { label: "PVC / Plastik Pencere Profili", query: "pvc profil" },
    ],
  },
  {
    keywords: ["boru"],
    title: "Boru malzemesini seçiniz:",
    options: [
      { label: "Dikişli Çelik Boru", query: "dikişli çelik boru" },
      { label: "Dikişsiz Çelik Boru", query: "dikişsiz çelik boru" },
      { label: "Alüminyum Boru / Boru Bağlantı", query: "alüminyum boru" },
      { label: "Plastik / Polietilen Boru", query: "plastik boru" },
    ],
  },
  {
    keywords: ["sac"],
    title: "Sac / rulo tipini seçiniz:",
    options: [
      { label: "Sıcak Haddelenmiş Rulo (HRC)", query: "sıcak haddelenmiş rulo" },
      { label: "Soğuk Haddelenmiş Sac (CRC / DKP)", query: "soğuk haddelenmiş sac" },
      { label: "Galvanizli Çelik Sac", query: "galvanizli sac" },
      { label: "Boyalı Çelik Rulo / Sac", query: "boyalı rulo" },
      { label: "Alüminyum Sac / Plaka", query: "alüminyum levha" },
    ],
  },
  {
    keywords: ["raf"],
    title: "Raf sisteminizi seçiniz:",
    options: [
      { label: "Depo / Palet Raf Sistemi (Çelik Yapı)", query: "çelik depo rafı" },
      { label: "Market / Mağaza Metal Rafı", query: "metal market rafı" },
    ],
  },
  {
    keywords: ["parca", "parça", "yedek parca", "yedek parça"],
    title: "Parça niteliğini seçiniz:",
    options: [
      { label: "Genel Dövme / Talaşlı İmalat Demir-Çelik Parça", query: "cnc çelik parça" },
      { label: "Makineye Özel Aksam (Fasıl 84)", query: "makine parçası" },
      { label: "Otomotiv Yan Sanayi Parçası", query: "otomotiv parçası" },
    ],
  },
];

export function normalizeTr(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

export function sectorToSlug(sector: string): string {
  const norm = normalizeTr(sector);
  if (norm.includes("demir") || norm.includes("celik")) return "demir-celik";
  if (norm.includes("aluminyum")) return "aluminyum";
  if (norm.includes("cimento")) return "cimento";
  if (norm.includes("gubre")) return "gubre";
  if (norm.includes("elektrik")) return "elektrik";
  if (norm.includes("hidrojen")) return "hidrojen";
  if (norm.includes("plastik")) return "plastik";
  if (norm.includes("cam")) return "cam";
  if (norm.includes("tekstil")) return "tekstil";
  if (norm.includes("batarya") || norm.includes("pil")) return "batarya";
  if (norm.includes("otomotiv")) return "otomotiv";
  if (norm.includes("makine")) return "makine";
  if (norm.includes("ambalaj")) return "ambalaj";
  if (norm.includes("mobilya")) return "mobilya";
  if (norm.includes("kagit")) return "kagit";
  return "demir-celik";
}

export interface SearchResult {
  genericGuard?: GenericGuard;
  matches: LexiconRecord[];
}

export function searchLexicon(rawQuery: string): SearchResult {
  const q = rawQuery.trim();
  if (!q || q.length < 2) {
    return { matches: [] };
  }

  const normQuery = normalizeTr(q);

  // 1. Generic Guard Kontrolü (tek kelimelik veya dar kapsamlı aramalar)
  const guard = GENERIC_GUARDS.find((g) =>
    g.keywords.some((k) => normalizeTr(k) === normQuery)
  );

  const records = (lexiconData.records as LexiconRecord[]) || [];

  // 2. Arama Algoritması: Canonical name, Aliases, Candidate CN, Sector
  const matches: { record: LexiconRecord; score: number }[] = [];

  for (const record of records) {
    let score = 0;
    const normCanonical = normalizeTr(record.canonical_product_tr);

    if (normCanonical === normQuery) {
      score += 100;
    } else if (normCanonical.startsWith(normQuery)) {
      score += 60;
    } else if (normCanonical.includes(normQuery)) {
      score += 40;
    }

    // Aliases kontrolü
    for (const alias of record.aliases) {
      const normAlias = normalizeTr(alias);
      if (normAlias === normQuery) {
        score += 90;
        break;
      } else if (normAlias.startsWith(normQuery)) {
        score = Math.max(score, 50);
      } else if (normAlias.includes(normQuery)) {
        score = Math.max(score, 30);
      }
    }

    // Candidate CN kodları kontrolü (ör. "7214", "7610")
    for (const cn of record.candidate_cn) {
      const cleanCn = cn.replace(/\s+/g, "");
      const cleanQ = q.replace(/\s+/g, "");
      if (cleanCn.startsWith(cleanQ)) {
        score += 80;
        break;
      }
    }

    // Kelime bazlı token araması
    const tokens = normQuery.split(" ").filter((t) => t.length > 1);
    if (tokens.length > 1) {
      let allTokensMatch = true;
      for (const t of tokens) {
        const matchesAny =
          normCanonical.includes(t) ||
          record.aliases.some((a) => normalizeTr(a).includes(t));
        if (!matchesAny) {
          allTokensMatch = false;
          break;
        }
      }
      if (allTokensMatch) {
        score += 50;
      }
    }

    if (score > 0) {
      matches.push({ record, score });
    }
  }

  // Skora göre sırala
  matches.sort((a, b) => b.score - a.score);

  return {
    genericGuard: guard,
    matches: matches.slice(0, 6).map((m) => m.record),
  };
}

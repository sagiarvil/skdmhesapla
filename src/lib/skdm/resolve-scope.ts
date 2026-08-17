/**
 * CN → Kademe A sektör. Karar Parameters_CNCodes + önek eşlemesinden gelir.
 * SEKTÖR ADI ≠ HUKUKİ KAPSAM.
 */
import {
  matchPrefix,
  matchExclusion,
  normalizeCn,
  SECTORS,
  KNOWN_OUT_OF_SCOPE_CHAPTERS,
  RULESET_VERSION,
  type SectorDef,
} from "./annex-ruleset";

export type ScopeResolution =
  | { status: "resolved"; sectorId: string; sectorSlug: string; cn4: number }
  | { status: "ambiguous"; reason: string }
  | { status: "out_of_scope"; reason: string }
  | { status: "unknown"; reason: string };

export function cnTo4Digit(cnCode: string): number | null {
  const digits = normalizeCn(cnCode);
  if (digits.length < 4) return null;
  const n = parseInt(digits.slice(0, 4), 10);
  return Number.isFinite(n) ? n : null;
}

/** RM-003: kapsam CN'den; önekler resmi 8 haneli listenin çalışma zamanı özetidir. */
export function resolveScopeFromCn(cnCode: string): ScopeResolution {
  const cn = normalizeCn(cnCode);
  if (cn.length < 4) {
    return { status: "unknown", reason: "CN kodu en az 4 hane olmalıdır." };
  }

  const rule = matchPrefix(cn);
  if (!rule) {
    return {
      status: "out_of_scope",
      reason: `CN ${cn} SKDM Kademe A kapsamında tanınmadı.`,
    };
  }

  const sector = SECTORS[rule.sector];
  const cn4 = parseInt(cn.slice(0, 4), 10);
  return {
    status: "resolved",
    sectorId: sector.id,
    sectorSlug: sector.slug,
    cn4,
  };
}

/** Sektör etiketi hukuki karar değildir — yalnız geriye dönük etiket okuma. */
export function sectorLabelToSlug(sectorLabel: string): string | null {
  const norm = sectorLabel
    .toLocaleLowerCase("tr")
    .trim()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

  if (norm.includes("aluminyum")) return SECTORS.aluminum.slug;
  if (norm.includes("demir") || norm.includes("celik")) return SECTORS["iron-steel"].slug;
  if (norm.includes("cimento")) return SECTORS.cement.slug;
  if (norm.includes("gubre")) return SECTORS.fertilizer.slug;
  if (norm.includes("elektrik")) return SECTORS.electricity.slug;
  if (norm.includes("hidrojen")) return SECTORS.hydrogen.slug;
  return null;
}

/**
 * Arama sorgusu veya aday listesinden kapsam kararı için CN seçer.
 * ⚠️ candidate_cn[0] kör kullanılırsa 7610 sorgusu 7308 (demir-çelik) üretir.
 */
export function pickCnForScope(
  candidateCn: string[] | undefined,
  queryRaw?: string,
): string | null {
  const q = normalizeCn(queryRaw ?? "");
  if (q.length >= 4) return q;
  if (!candidateCn?.length) return null;
  if (q.length > 0) {
    const hit = candidateCn.find((c) => {
      const n = normalizeCn(c);
      return n.startsWith(q) || q.startsWith(n);
    });
    if (hit) return hit;
  }
  return candidateCn[0] ?? null;
}

/** GTİP arama sonucu → hesapla URL. Sektör etiketinden yönlendirme YOK. */
export function hesaplaUrlFromLexicon(
  candidateCn: string[] | undefined,
  cbamScope: string,
  _sectorLabel: string,
  queryRaw?: string,
): string | null {
  if (cbamScope === "AMBIGUOUS" || cbamScope === "LIKELY_OUT" || cbamScope === "OUT") {
    return null;
  }

  const cn = pickCnForScope(candidateCn, queryRaw);
  if (!cn) return null;
  const route = routeVerdict(cn);
  if (route.status !== "in_scope") return null;
  const cnParam = encodeURIComponent(cn.replace(/\s+/g, " ").trim());
  const base = route.ctas[0]?.href;
  if (!base) return null;
  return base.includes("?") ? `${base}&cn=${cnParam}` : `${base}?cn=${cnParam}`;
}

/* ==========================================================================
   Kapsam çözücü + yönlendirici (çıkmaz sokak yasağı)
   ========================================================================== */

export type ScopeStatus = "in_scope" | "out_of_scope" | "needs_cn_code";

export interface ScopeResult {
  status: ScopeStatus;
  rulesetVersion: string;
  normalizedCn: string | null;
  sector: SectorDef | null;
  annexIIDirectOnly: boolean | null;
  reasonTr: string;
  chapterLabelTr?: string;
}

export function resolveScope(rawCn: string | null | undefined): ScopeResult {
  const cn = normalizeCn(rawCn ?? "");

  if (cn.length < 4) {
    return {
      status: "needs_cn_code",
      rulesetVersion: RULESET_VERSION,
      normalizedCn: cn || null,
      sector: null,
      annexIIDirectOnly: null,
      reasonTr:
        "Kapsam kararı için en az 4 haneli GTİP kodu gerekiyor. " +
        "Kodu gümrük beyannamenizin 33 numaralı kutusunda bulabilirsiniz.",
    };
  }

  const exclusion = matchExclusion(cn);
  if (exclusion) {
    return {
      status: "out_of_scope",
      rulesetVersion: RULESET_VERSION,
      normalizedCn: cn,
      sector: null,
      annexIIDirectOnly: null,
      reasonTr: exclusion.reasonTr,
    };
  }

  const rule = matchPrefix(cn);
  if (rule) {
    const sector = SECTORS[rule.sector];
    return {
      status: "in_scope",
      rulesetVersion: RULESET_VERSION,
      normalizedCn: cn,
      sector,
      annexIIDirectOnly: sector.annexIIDirectOnly,
      reasonTr:
        `Bu GTİP kodu ${sector.labelTr} sektöründe SKDM kapsamında görünüyor` +
        (rule.note ? ` (${rule.note})` : "") +
        ". " +
        (sector.annexIIDirectOnly
          ? "Bu sektörde yalnızca tesisinizin doğrudan emisyonu fiyatlanır — elektrik tüketiminiz sertifika maliyetine girmez."
          : "Bu sektörde hem doğrudan emisyon hem elektrik tüketimi fiyatlanır."),
    };
  }

  const chapter = cn.slice(0, 2);
  const chapterLabel = KNOWN_OUT_OF_SCOPE_CHAPTERS[chapter];
  return {
    status: "out_of_scope",
    rulesetVersion: RULESET_VERSION,
    normalizedCn: cn,
    sector: null,
    annexIIDirectOnly: null,
    reasonTr: chapterLabel
      ? `Bu GTİP kodu ${chapter}. fasılda (${chapterLabel}) sınıflandırılıyor ve SKDM kapsamına girmiyor. Yani SKDM sertifika maliyeti doğmaz.`
      : "Bu GTİP kodu SKDM kapsamındaki ürün listesinde görünmüyor. Yani SKDM sertifika maliyeti doğmaz.",
    chapterLabelTr: chapterLabel,
  };
}

export const TIERB_MATERIAL_IDS = [
  "aluminium",
  "steel",
  "scrap_metal",
  "mixed_metal",
  "construction_metal",
  "glass",
  "bricks",
  "concrete",
  "aggregates",
  "plasterboard",
  "insulation",
  "asphalt",
  "pvc",
  "pp",
  "pet",
  "hdpe",
  "ldpe",
  "ps",
  "plastic_rigid",
  "plastic_film",
  "plastic_average",
  "rubber",
  "wood",
  "paper",
  "cardboard",
  "textile",
  "battery_liion",
  "electrical_it",
  "electrical_large",
  "electrical_small",
  "food_drink",
  "mineral_oil",
] as const;

export type TierBMaterialId = (typeof TIERB_MATERIAL_IDS)[number];
const VALID_MATERIALS = new Set<string>(TIERB_MATERIAL_IDS);

export interface ClassificationAnswers {
  invoice?: "sistem" | "cam" | "profil";
  frame?: "alu" | "celik" | "pvc" | "ahsap";
  dominantMaterial?: string;
}

export function suggestTierBMaterials(a: ClassificationAnswers): TierBMaterialId[] {
  const out: string[] = [];
  const add = (id: string) => {
    if (VALID_MATERIALS.has(id) && !out.includes(id)) out.push(id);
  };
  switch (a.invoice) {
    case "cam":
      add("glass");
      break;
    case "profil":
      add("aluminium");
      break;
    case "sistem":
      add("aluminium");
      add("glass");
      break;
  }
  switch (a.frame) {
    case "alu":
      add("aluminium");
      break;
    case "celik":
      add("steel");
      break;
    case "pvc":
      add("pvc");
      break;
    case "ahsap":
      add("wood");
      break;
  }
  if (a.dominantMaterial) add(a.dominantMaterial);
  return out as TierBMaterialId[];
}

export interface Cta {
  labelTr: string;
  href: string;
  variant: "primary" | "secondary";
}

export interface VerdictRoute {
  status: ScopeStatus;
  scope: ScopeResult;
  headlineTr: string;
  bodyTr: string;
  bridgeTr?: string;
  ctas: Cta[];
  suggestedMaterialIds: TierBMaterialId[];
}

const TIERB_EXPLANATION =
  "AB'li alıcılar, SKDM kapsamı dışındaki ürünler için de tedarikçilerinden " +
  "karbon verisi istiyor: kendi Kapsam 3 raporlamaları, CSRD yükümlülükleri " +
  "veya tedarikçi değerlendirme anketleri için. Alıcınız sizden böyle bir veri " +
  "istediyse bunu da hazırlayabiliriz.";

export function routeVerdict(
  rawCn: string | null | undefined,
  answers: ClassificationAnswers = {},
): VerdictRoute {
  const scope = resolveScope(rawCn);
  const suggested = suggestTierBMaterials(answers);
  const matParam = suggested.length ? `?malzeme=${suggested.join(",")}` : "";

  if (scope.status === "in_scope" && scope.sector) {
    return {
      status: "in_scope",
      scope,
      headlineTr: `Bu ürün SKDM kapsamında — ${scope.sector.labelTr}`,
      bodyTr: scope.reasonTr,
      ctas: [
        {
          labelTr: "SKDM dosyamı hazırla",
          href: `/hesapla/${scope.sector.slug}/`,
          variant: "primary",
        },
      ],
      suggestedMaterialIds: [],
    };
  }

  if (scope.status === "needs_cn_code") {
    return {
      status: "needs_cn_code",
      scope,
      headlineTr: "Kapsam kararı için GTİP kodunuz gerekiyor",
      bodyTr: scope.reasonTr,
      bridgeTr:
        "GTİP kodunu şimdi bulamıyorsanız, alıcınızın istediği karbon verisini " +
        "kapsam kararını beklemeden de hazırlamaya başlayabilirsiniz.",
      ctas: [
        { labelTr: "GTİP kodumu bulmama yardım et", href: "/rehber/gtip-bulma/", variant: "primary" },
        {
          labelTr: "Tedarikçi karbon dosyası hazırla",
          href: `/tedarikci-verisi/hazirla/${matParam}`,
          variant: "secondary",
        },
      ],
      suggestedMaterialIds: suggested,
    };
  }

  return {
    status: "out_of_scope",
    scope,
    headlineTr: "Bu ürün SKDM kapsamında değil — ama alıcınız yine de karbon verisi isteyebilir",
    bodyTr: scope.reasonTr,
    bridgeTr: TIERB_EXPLANATION,
    ctas: [
      {
        labelTr: "Tedarikçi karbon dosyası hazırla",
        href: `/tedarikci-verisi/hazirla/${matParam}`,
        variant: "primary",
      },
      {
        labelTr: "Kapsam dışı beyanı oluştur",
        href: "/kapsam-disi-beyani/",
        variant: "secondary",
      },
    ],
    suggestedMaterialIds: suggested,
  };
}

export function assertNoDeadEnd(route: VerdictRoute): void {
  if (route.status === "in_scope") return;
  const hasTierB = route.ctas.some((c) => c.href.includes("/tedarikci-verisi/"));
  if (!hasTierB) {
    throw new Error(
      `Çıkmaz sokak tespit edildi: status="${route.status}" için Kademe B teklifi yok.`,
    );
  }
}

export function assertNoSkdmCalcWhenOutOfScope(route: VerdictRoute): void {
  if (route.status !== "out_of_scope") return;
  if (route.ctas.some((c) => c.href.startsWith("/hesapla/"))) {
    throw new Error("Kapsam dışı ürün SKDM hesaplayıcısına yönlendiriliyor. Bu yasaktır.");
  }
}

export const FORBIDDEN_PHRASES = [
  "işlem gerekmez",
  "yapacak bir şey yok",
  "gerek yok",
  "hata",
  "geçersiz",
  "başarısız",
  "reddedildi",
];

export function assertCopyIsClean(route: VerdictRoute): void {
  const all = [route.headlineTr, route.bodyTr, route.bridgeTr ?? "", ...route.ctas.map((c) => c.labelTr)]
    .join(" ")
    .toLocaleLowerCase("tr-TR");
  for (const bad of FORBIDDEN_PHRASES) {
    if (all.includes(bad.toLocaleLowerCase("tr-TR"))) {
      throw new Error(`Yasaklı ifade tespit edildi: "${bad}"`);
    }
  }
}

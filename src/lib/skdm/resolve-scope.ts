/**
 * CN kodu → SKDM Kademe A sektör kararı (tek kaynak).
 * SEKTÖR ADI ≠ HUKUKİ KAPSAM — karar CN'den verilir.
 */

export type ScopeResolution =
  | { status: "resolved"; sectorId: string; sectorSlug: string; cn4: number }
  | { status: "ambiguous"; reason: string }
  | { status: "out_of_scope"; reason: string }
  | { status: "unknown"; reason: string };

const TIER_A_SLUG: Record<string, string> = {
  "iron-steel": "demir-celik",
  aluminum: "aluminyum",
  cement: "cimento",
  fertilizer: "gubre",
  hydrogen: "hidrojen",
  electricity: "elektrik",
};

/** CN string → ilk 4 hane sayı */
export function cnTo4Digit(cnCode: string): number | null {
  const digits = cnCode.replace(/\D/g, "");
  if (digits.length < 4) return null;
  const n = parseInt(digits.slice(0, 4), 10);
  return Number.isFinite(n) ? n : null;
}

function inRange(cn4: number, lo: number, hi: number): boolean {
  return cn4 >= lo && cn4 <= hi;
}

/** RM-001 Kademe A CN aralıkları — sektör etiketinden bağımsız */
export function resolveScopeFromCn(cnCode: string): ScopeResolution {
  const cn4 = cnTo4Digit(cnCode);
  if (cn4 === null) {
    return { status: "unknown", reason: "CN kodu en az 4 hane olmalıdır." };
  }

  if (inRange(cn4, 7201, 7229) || inRange(cn4, 7301, 7326)) {
    return { status: "resolved", sectorId: "iron-steel", sectorSlug: TIER_A_SLUG["iron-steel"]!, cn4 };
  }
  if (inRange(cn4, 7601, 7616)) {
    return { status: "resolved", sectorId: "aluminum", sectorSlug: TIER_A_SLUG.aluminum!, cn4 };
  }
  if (cn4 === 2523) {
    return { status: "resolved", sectorId: "cement", sectorSlug: TIER_A_SLUG.cement!, cn4 };
  }
  if (cn4 === 2808 || inRange(cn4, 3102, 3105)) {
    return { status: "resolved", sectorId: "fertilizer", sectorSlug: TIER_A_SLUG.fertilizer!, cn4 };
  }
  if (cn4 === 2804) {
    return { status: "resolved", sectorId: "hydrogen", sectorSlug: TIER_A_SLUG.hydrogen!, cn4 };
  }
  if (cn4 === 2716) {
    return { status: "resolved", sectorId: "electricity", sectorSlug: TIER_A_SLUG.electricity!, cn4 };
  }

  return {
    status: "out_of_scope",
    reason: `CN ${cn4} SKDM Kademe A (6 sektör) kapsamında tanınmadı.`,
  };
}

/** Lexicon sektör etiketi → slug (yalnızca tier A; varsayılan demir-çelik YOK) */
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

  if (norm.includes("demir") || norm.includes("celik")) return TIER_A_SLUG["iron-steel"]!;
  if (norm.includes("aluminyum")) return TIER_A_SLUG.aluminum!;
  if (norm.includes("cimento")) return TIER_A_SLUG.cement!;
  if (norm.includes("gubre")) return TIER_A_SLUG.fertilizer!;
  if (norm.includes("elektrik")) return TIER_A_SLUG.electricity!;
  if (norm.includes("hidrojen")) return TIER_A_SLUG.hydrogen!;
  return null;
}

/** GTİP arama sonucu → hesapla URL veya null (belirsiz/kapsam dışı) */
export function hesaplaUrlFromLexicon(
  candidateCn: string[] | undefined,
  cbamScope: string,
  sectorLabel: string
): string | null {
  if (cbamScope === "AMBIGUOUS" || cbamScope === "LIKELY_OUT" || cbamScope === "OUT") {
    return null;
  }

  const primaryCn = candidateCn?.[0];
  if (primaryCn) {
    const scope = resolveScopeFromCn(primaryCn);
    if (scope.status === "resolved") {
      const cnParam = encodeURIComponent(primaryCn.replace(/\s+/g, " ").trim());
      return `/hesapla/${scope.sectorSlug}/?cn=${cnParam}`;
    }
    if (scope.status !== "out_of_scope") return null;
  }

  if (cbamScope !== "IN") return null;
  const slug = sectorLabelToSlug(sectorLabel);
  return slug ? `/hesapla/${slug}/` : null;
}

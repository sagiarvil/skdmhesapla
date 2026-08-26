"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CN_EXCLUSIONS = exports.KNOWN_OUT_OF_SCOPE_CHAPTERS = exports.CN_PREFIX_RULES = exports.SECTORS = exports.RULESET_VERSION = void 0;
exports.normalizeCn = normalizeCn;
exports.matchPrefix = matchPrefix;
exports.matchExclusion = matchExclusion;
exports.reconcileWithOfficialList = reconcileWithOfficialList;
exports.officialCnStatus = officialCnStatus;
/**
 * Kapsam kütüğü — önek eşleştirici.
 *
 * Hukuki bağlayıcı liste: data/skdm/parameters-cn-codes.json
 * (Communication Template → Parameters_CNCodes, 569 adet 8 haneli CN).
 * Bu dosyadaki önekler çalışma zamanı eşlemesidir; tam liste değildir.
 * Yeni önek ancak resmi listeden doğrulanır.
 *
 * RM-003: kapsam kararı CN/GTİP'ten; sektör adı hukuki karar değildir.
 */
exports.RULESET_VERSION = "2026.1-annex-v1";
exports.SECTORS = {
    "iron-steel": {
        id: "iron-steel",
        labelTr: "Demir & Çelik",
        slug: "demir-celik",
        cnRangeLabel: "CN 2601 12 00, 7201–7203, 7205–7229, 7301–7311, 7318, 7326",
        representativeCn: "7201–7229",
        cardCnHint: "72142000",
        annexIIDirectOnly: true,
    },
    aluminum: {
        id: "aluminum",
        labelTr: "Alüminyum",
        slug: "aluminyum",
        cnRangeLabel: "CN 7601, 7603–7614, 7616",
        representativeCn: "7601–7616",
        cardCnHint: "76109090",
        annexIIDirectOnly: true,
    },
    cement: {
        id: "cement",
        labelTr: "Çimento",
        slug: "cimento",
        cnRangeLabel: "CN 2507 00 80, 2523",
        representativeCn: "2523",
        cardCnHint: "25231000",
        annexIIDirectOnly: false,
    },
    fertilizer: {
        id: "fertilizer",
        labelTr: "Gübre (azotlu)",
        slug: "gubre",
        cnRangeLabel: "CN 2808, 2814, 2834 21 00, 3102, 3105 (3105 60 00 hariç)",
        representativeCn: "2808 00 00",
        cardCnHint: "31021010",
        annexIIDirectOnly: false,
    },
    hydrogen: {
        id: "hydrogen",
        labelTr: "Hidrojen",
        slug: "hidrojen",
        cnRangeLabel: "CN 2804 10 00",
        representativeCn: "2804 10 00",
        cardCnHint: "28041000",
        annexIIDirectOnly: true,
    },
    electricity: {
        id: "electricity",
        labelTr: "Elektrik",
        slug: "elektrik",
        cnRangeLabel: "CN 2716 00 00",
        representativeCn: "2716 00 00",
        cardCnHint: "27160000",
        annexIIDirectOnly: true,
    },
};
function steelHeadings() {
    const out = [
        { prefix: "26011200", sector: "iron-steel", note: "Sinterlenmiş cevher" },
    ];
    for (const h of ["7201", "7202", "7203"]) {
        out.push({ prefix: h, sector: "iron-steel" });
    }
    for (let h = 7205; h <= 7229; h++) {
        out.push({ prefix: String(h), sector: "iron-steel" });
    }
    for (let h = 7301; h <= 7311; h++) {
        out.push({ prefix: String(h), sector: "iron-steel" });
    }
    out.push({ prefix: "7318", sector: "iron-steel", note: "Vida, somun, cıvata" });
    out.push({ prefix: "7326", sector: "iron-steel", note: "Diğer demir/çelik eşya" });
    return out;
}
function aluminumHeadings() {
    const out = [{ prefix: "7601", sector: "aluminum" }];
    for (let h = 7603; h <= 7614; h++) {
        out.push({ prefix: String(h), sector: "aluminum" });
    }
    out.push({ prefix: "7616", sector: "aluminum" });
    return out;
}
exports.CN_PREFIX_RULES = [
    { prefix: "25070080", sector: "cement", note: "Kalsine kil" },
    { prefix: "2523", sector: "cement", note: "Çimento ve klinker" },
    { prefix: "27160000", sector: "electricity", note: "Elektrik enerjisi" },
    { prefix: "28041000", sector: "hydrogen", note: "Hidrojen" },
    { prefix: "28080000", sector: "fertilizer", note: "Nitrik asit" },
    { prefix: "28141000", sector: "fertilizer", note: "Anhidr amonyak" },
    { prefix: "28142000", sector: "fertilizer", note: "Amonyak çözeltisi" },
    { prefix: "28342100", sector: "fertilizer", note: "Potasyum nitrat" },
    { prefix: "3102", sector: "fertilizer", note: "Azotlu gübreler" },
    { prefix: "310510", sector: "fertilizer" },
    { prefix: "310520", sector: "fertilizer" },
    { prefix: "31053000", sector: "fertilizer" },
    { prefix: "31054000", sector: "fertilizer" },
    { prefix: "31055100", sector: "fertilizer" },
    { prefix: "31055900", sector: "fertilizer" },
    { prefix: "310590", sector: "fertilizer" },
    ...steelHeadings(),
    ...aluminumHeadings(),
];
exports.KNOWN_OUT_OF_SCOPE_CHAPTERS = {
    "39": "Plastik ve plastik eşya",
    "44": "Ahşap ve ahşap eşya",
    "48": "Kağıt ve karton",
    "52": "Pamuk",
    "54": "Sentetik filament",
    "61": "Örme giyim eşyası",
    "62": "Dokuma giyim eşyası",
    "64": "Ayakkabı",
    "68": "Taş, alçı, çimento eşyası (mamul)",
    "69": "Seramik ürünler",
    "70": "Cam ve cam eşya",
    "84": "Makine ve mekanik cihazlar",
    "85": "Elektrikli makine ve cihazlar",
    "87": "Motorlu taşıtlar",
    "94": "Mobilya ve aydınlatma",
};
function normalizeCn(raw) {
    return (raw ?? "").replace(/[^0-9]/g, "");
}
function matchPrefix(normalizedCn) {
    if (matchExclusion(normalizedCn))
        return null;
    let best = null;
    for (const rule of exports.CN_PREFIX_RULES) {
        if (normalizedCn.startsWith(rule.prefix)) {
            if (!best || rule.prefix.length > best.prefix.length)
                best = rule;
        }
    }
    return best;
}
/**
 * ⚠️ KAPSAM DIŞI İSTİSNALAR — öneklerden DAHA GÜÇLÜDÜR.
 * Toptan "72"/"76" asla eklenmez; yine de 7204/7602 savunma katmanıdır.
 * Yeni istisna ancak resmi 8 haneli listede YOKLUĞU doğrulanarak eklenir.
 */
exports.CN_EXCLUSIONS = [
    {
        prefix: "7204",
        reasonTr: "Çelik hurda (CN 7204) ikincil hammaddedir ve SKDM ürün listesinde yer almaz. " +
            "Hurda alımınız için öncül madde emisyonu beyan etmeniz gerekmez — bu, hurda " +
            "bazlı elektrik ark ocağı üretiminin yapısal avantajıdır.",
    },
    {
        prefix: "7602",
        reasonTr: "Alüminyum hurda ve döküntü (CN 7602) ikincil hammaddedir ve SKDM ürün " +
            "listesinde yer almaz.",
    },
];
function matchExclusion(normalizedCn) {
    let best = null;
    for (const ex of exports.CN_EXCLUSIONS) {
        if (normalizedCn.startsWith(ex.prefix)) {
            if (!best || ex.prefix.length > best.prefix.length)
                best = ex;
        }
    }
    return best;
}
/** Resmi 8 haneli listeyle önek kütüğünü karşılaştırır. isClean değilse CI/deploy blok. */
function reconcileWithOfficialList(officialCnCodes, candidatePool = []) {
    const official = new Set(officialCnCodes.map(normalizeCn).filter(Boolean));
    const missing = [];
    const extra = [];
    for (const code of official) {
        if (!matchPrefix(code))
            missing.push(code);
    }
    for (const code of candidatePool.map(normalizeCn).filter(Boolean)) {
        if (matchPrefix(code) && !official.has(code))
            extra.push(code);
    }
    return {
        rulesetVersion: exports.RULESET_VERSION,
        officialCount: official.size,
        matchedCount: official.size - missing.length,
        missingFromRuleset: missing.sort(),
        extraInRuleset: extra.sort(),
        isClean: missing.length === 0 && extra.length === 0,
    };
}
/** 8 haneli resmi liste mi, yalnız önek mi, kapsam dışı mı. */
function officialCnStatus(raw, officialCodes) {
    const n = normalizeCn(raw);
    if (officialCodes.includes(n))
        return "listed";
    if (matchPrefix(n))
        return "prefix-only";
    return "out";
}

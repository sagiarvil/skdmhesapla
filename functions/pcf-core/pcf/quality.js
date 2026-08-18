"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizePcfQuality = summarizePcfQuality;
const policy_1 = require("./policy");
const ratio = (num, den) => (den > 0 ? num / den : 0);
function summarizePcfQuality(contributions, evidence, unresolvedCount) {
    const findings = [];
    const total = contributions.reduce((s, c) => s + c.kgCo2ePerFunctionalUnit, 0);
    const withProvenance = contributions.filter((c) => Boolean(c.factor.source.sourceUrl && c.factor.source.title));
    const proxy = contributions.filter((c) => c.factor.isProxy);
    const generic = contributions.filter((c) => ["official_generic", "sector_generic"].includes(c.factor.quality));
    const verifiedSupplier = contributions.filter((c) => ["supplier_specific_verified", "epd_verified"].includes(c.factor.quality));
    const proxyContribution = proxy.reduce((s, c) => s + c.kgCo2ePerFunctionalUnit, 0);
    const genericContribution = generic.reduce((s, c) => s + c.kgCo2ePerFunctionalUnit, 0);
    const verifiedSupplierContribution = verifiedSupplier.reduce((s, c) => s + c.kgCo2ePerFunctionalUnit, 0);
    const factorProvenanceCoverage = contributions.length > 0 ? withProvenance.length / contributions.length : 1;
    const proxyContributionRatio = ratio(proxyContribution, total);
    const genericContributionRatio = ratio(genericContribution, total);
    const verifiedSupplierContributionRatio = ratio(verifiedSupplierContribution, total);
    const needsFuelEvidence = contributions.some((c) => c.category === "scope1");
    const needsElectricityEvidence = contributions.some((c) => c.category === "scope2");
    const materialLineCount = contributions.filter((c) => c.category === "upstream_material" || c.category === "packaging").length;
    const needsMaterialEvidence = materialLineCount > 0;
    const materialEvidenceComplete = !needsMaterialEvidence || evidence.materialEvidenceCount >= materialLineCount;
    const evidenceComplete = evidence.productionRecord &&
        (!needsElectricityEvidence || evidence.electricityInvoice) &&
        (!needsFuelEvidence || evidence.fuelInvoice) &&
        materialEvidenceComplete;
    if (unresolvedCount > 0) {
        findings.push({
            code: "PCF_UNRESOLVED_FACTOR",
            severity: "blocking",
            messageTr: `${unresolvedCount} kalem için emisyon faktörü çözümlenemedi; rapor sonucu tamamlanamaz.`,
        });
    }
    if (contributions.length === 0 && unresolvedCount === 0) {
        findings.push({
            code: "PCF_NO_ACTIVITY",
            severity: "blocking",
            messageTr: "Fonksiyonel birim için malzeme, ambalaj veya enerji faaliyeti girilmeden rapor tamamlanamaz.",
        });
    }
    if (contributions.length > 0 && factorProvenanceCoverage < 1) {
        findings.push({
            code: "PCF_PROVENANCE_INCOMPLETE",
            severity: "blocking",
            messageTr: "Tüm emisyon faktörlerinde kaynak ve sürüm bilgisi bulunmalıdır.",
        });
    }
    if (proxy.length > 0) {
        findings.push({
            code: "PCF_PROXY_USED",
            severity: "warning",
            messageTr: `${proxy.length} kalemde vekil veri kullanılmıştır; çıktı tahmini statüsünde kalır.`,
        });
    }
    const nonBuyerReadyFactors = contributions.filter((c) => !c.factor.buyerReadyEligible ||
        !policy_1.PCF_POLICY.buyerReadyAllowedReviewStatuses.has(c.factor.reviewStatus) ||
        !policy_1.PCF_POLICY.buyerReadyAllowedFactorQualities.has(c.factor.quality));
    if (nonBuyerReadyFactors.length > 0) {
        findings.push({
            code: "PCF_FACTOR_QUALITY_LIMIT",
            severity: "warning",
            messageTr: `${nonBuyerReadyFactors.length} faktör iç kalite kapısında alıcıya gönderime hazır statüsünü karşılamıyor.`,
        });
    }
    if (!evidence.productionRecord) {
        findings.push({ code: "PCF_PRODUCTION_EVIDENCE", severity: "warning", messageTr: "Dönem üretim miktarı üretim kaydıyla desteklenmemiştir." });
    }
    if (needsElectricityEvidence && !evidence.electricityInvoice) {
        findings.push({ code: "PCF_ELECTRICITY_EVIDENCE", severity: "warning", messageTr: "Elektrik tüketimi fatura veya sayaç kaydıyla desteklenmemiştir." });
    }
    if (needsFuelEvidence && !evidence.fuelInvoice) {
        findings.push({ code: "PCF_FUEL_EVIDENCE", severity: "warning", messageTr: "Yakıt tüketimi fatura veya sayaç kaydıyla desteklenmemiştir." });
    }
    if (!materialEvidenceComplete) {
        findings.push({
            code: "PCF_MATERIAL_EVIDENCE",
            severity: "warning",
            messageTr: `Malzeme/ambalaj miktarı kanıtı ${evidence.materialEvidenceCount}/${materialLineCount} satırdır; alıcıya gönderime hazır statüsü için tüm kullanılan satırlar desteklenmelidir.`,
        });
    }
    const blocking = findings.some((f) => f.severity === "blocking");
    const buyerReady = !blocking &&
        proxy.length === 0 &&
        nonBuyerReadyFactors.length === 0 &&
        evidenceComplete &&
        contributions.length > 0;
    const status = blocking ? "blocked" : buyerReady ? "buyer_ready" : "estimated";
    let grade = "DQ4";
    if (buyerReady && verifiedSupplierContributionRatio >= 0.5)
        grade = "DQ1";
    else if (buyerReady)
        grade = "DQ2";
    else if (!blocking && proxyContributionRatio === 0)
        grade = "DQ3";
    return {
        status,
        quality: {
            grade,
            factorProvenanceCoverage,
            proxyContributionRatio,
            genericContributionRatio,
            verifiedSupplierContributionRatio,
            evidenceComplete,
        },
        findings,
    };
}

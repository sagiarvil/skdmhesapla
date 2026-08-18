"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPcfFactorRecord = assertPcfFactorRecord;
exports.validateFactorRegistry = validateFactorRegistry;
exports.isReviewExpired = isReviewExpired;
exports.isFactorValidAt = isFactorValidAt;
exports.isReviewStatusUsable = isReviewStatusUsable;
exports.unitMatches = unitMatches;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
function assertPcfFactorRecord(value) {
    if (!value || typeof value !== "object")
        throw new Error("PCF factor kaydı nesne olmalıdır.");
    const f = value;
    if (!f.id || typeof f.id !== "string")
        throw new Error("PCF factor id zorunlu.");
    if (!f.labelTr || !f.labelEn)
        throw new Error(`${f.id}: TR/EN etiket zorunlu.`);
    if (!Array.isArray(f.materialIds) || f.materialIds.length === 0) {
        throw new Error(`${f.id}: materialIds boş olamaz.`);
    }
    if (!Array.isArray(f.geographies) || f.geographies.length === 0) {
        throw new Error(`${f.id}: geographies boş olamaz.`);
    }
    if (!Number.isFinite(f.kgCo2ePerActivityUnit) || Number(f.kgCo2ePerActivityUnit) < 0) {
        throw new Error(`${f.id}: kgCo2ePerActivityUnit >= 0 olmalıdır.`);
    }
    if (!f.activityUnit)
        throw new Error(`${f.id}: activityUnit zorunlu.`);
    if (!f.boundary)
        throw new Error(`${f.id}: boundary zorunlu.`);
    if (!f.gwpBasis)
        throw new Error(`${f.id}: gwpBasis zorunlu.`);
    if (!f.quality)
        throw new Error(`${f.id}: quality zorunlu.`);
    if (!f.reviewStatus)
        throw new Error(`${f.id}: reviewStatus zorunlu.`);
    if (typeof f.buyerReadyEligible !== "boolean") {
        throw new Error(`${f.id}: buyerReadyEligible boolean olmalıdır.`);
    }
    if (!f.source)
        throw new Error(`${f.id}: source zorunlu.`);
    if (!f.source.publisher || !f.source.title || !f.source.version || !f.source.sourceUrl) {
        throw new Error(`${f.id}: kaynak künyesi eksik.`);
    }
    if (!f.source.licence)
        throw new Error(`${f.id}: source.licence zorunlu.`);
    if (!ISO_DATE.test(f.source.reviewedAt))
        throw new Error(`${f.id}: source.reviewedAt ISO tarih olmalıdır.`);
    if (f.source.nextReviewAt && !ISO_DATE.test(f.source.nextReviewAt)) {
        throw new Error(`${f.id}: source.nextReviewAt ISO tarih olmalıdır.`);
    }
    if (!Array.isArray(f.limitations))
        throw new Error(`${f.id}: limitations dizi olmalıdır.`);
}
function validateFactorRegistry(records) {
    const ids = new Set();
    for (const record of records) {
        assertPcfFactorRecord(record);
        if (ids.has(record.id))
            throw new Error(`Tekrarlanan PCF factor id: ${record.id}`);
        ids.add(record.id);
    }
    return records;
}
function isReviewExpired(factor, asOfIso) {
    if (!factor.source.nextReviewAt)
        return false;
    return factor.source.nextReviewAt < asOfIso.slice(0, 10);
}
function isFactorValidAt(factor, asOfIso) {
    const day = asOfIso.slice(0, 10);
    if (factor.validFrom && factor.validFrom > day)
        return false;
    if (factor.validTo && factor.validTo < day)
        return false;
    return !isReviewExpired(factor, asOfIso);
}
function isReviewStatusUsable(status, allowEstimate) {
    if (status === "approved")
        return true;
    return allowEstimate && status === "estimate_only";
}
function unitMatches(a, b) {
    return a === b;
}

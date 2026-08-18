"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPcfSealedPackage = createPcfSealedPackage;
exports.pcfSealedFilesForApi = pcfSealedFilesForApi;
/**
 * PCF mühürlü ZIP — 8 dosya, CBAM paketinden ayrı.
 * CBAM calculator/qc/package-seal import YASAK. ZIP primitive: seal-binary.
 */
const crypto_1 = __importDefault(require("crypto"));
const seal_binary_1 = require("../skdm/seal-binary");
const policy_1 = require("./policy");
const package_manifest_1 = require("./package-manifest");
const report_1 = require("./report");
const sha256hex = (bytes) => crypto_1.default.createHash("sha256").update(bytes).digest("hex");
const csvEscape = (v) => `"${String(v).replace(/"/g, '""')}"`;
function carbonSummaryCsv(input, result) {
    const rows = [
        ["field", "value"],
        ["reportId", input.reportId],
        ["company", input.companyName],
        ["facility", input.facilityName],
        ["product", input.productName],
        ["cn", input.cnCode || ""],
        ["functionalUnit", input.functionalUnit],
        ["periodStart", input.reportingPeriodStart],
        ["periodEnd", input.reportingPeriodEnd],
        ["productionQuantity", String(input.productionQuantityForPeriod)],
        ["allocationShare", String(input.allocationShare)],
        ["allocationMethod", input.allocationMethod],
        ["status", result.status],
        ["totalKgCo2ePerFU", String(result.totalKgCo2ePerFunctionalUnit)],
        ["scope1", String(result.scope1KgCo2ePerFunctionalUnit)],
        ["scope2", String(result.scope2KgCo2ePerFunctionalUnit)],
        ["upstream", String(result.upstreamMaterialKgCo2ePerFunctionalUnit)],
        ["packaging", String(result.packagingKgCo2ePerFunctionalUnit)],
        ["engineVersion", result.engineVersion],
        ["methodologyVersion", result.methodologyVersion],
    ];
    return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}
function factorRegisterCsv(result) {
    const header = [
        "item",
        "factorId",
        "quality",
        "referenceYear",
        "version",
        "publisher",
        "sourceUrl",
        "licence",
        "boundary",
        "geographyNotes",
        "limitations",
    ];
    const lines = [header.map(csvEscape).join(",")];
    for (const c of result.contributions) {
        const s = c.factor.source;
        lines.push([
            c.label,
            c.factor.factorId,
            c.factor.quality,
            String(s.referenceYear),
            s.version,
            s.publisher,
            s.sourceUrl,
            s.licence,
            c.factor.boundary,
            s.notes || "",
            c.factor.limitations.join("; "),
        ]
            .map(csvEscape)
            .join(","));
    }
    return lines.join("\n");
}
function evidenceRegisterCsv(input) {
    const rows = [
        ["evidence", "present"],
        ["productionRecord", input.evidence.productionRecord ? "yes" : "no"],
        ["electricityInvoice", input.evidence.electricityInvoice ? "yes" : "no"],
        ["fuelInvoice", input.evidence.fuelInvoice ? "yes" : "no"],
        ["materialEvidenceCount", String(input.evidence.materialEvidenceCount)],
    ];
    return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}
function dateStamp(iso) {
    return iso.slice(0, 10).replace(/-/g, "");
}
function createPcfSealedPackage(input, result, meta) {
    if (result.status === "blocked") {
        throw new Error("PCF blocked iken mühürlü paket üretilemez.");
    }
    const createdAt = meta.createdAt || new Date().toISOString();
    const packageId = meta.packageId ||
        `PCF-SEAL-${dateStamp(createdAt)}-${crypto_1.default.randomBytes(4).toString("hex").toUpperCase()}`;
    const pdfEn = (0, report_1.pcfReportPdfBytes)(input, result);
    const pdfTr = (0, report_1.pcfArchiveReportPdfBytesTr)(input, result);
    const xlsxSummary = (0, seal_binary_1.csvToXlsxBytes)(carbonSummaryCsv(input, result));
    const xlsxFactors = (0, seal_binary_1.csvToXlsxBytes)(factorRegisterCsv(result));
    const xlsxEvidence = (0, seal_binary_1.csvToXlsxBytes)(evidenceRegisterCsv(input));
    const trace = new TextEncoder().encode(JSON.stringify({
        reportId: input.reportId,
        sessionId: meta.sessionId,
        engineVersion: result.engineVersion,
        methodologyVersion: result.methodologyVersion,
        factorRegistryVersion: policy_1.PCF_FACTOR_REGISTRY_VERSION,
        status: result.status,
        totalKgCo2ePerFunctionalUnit: result.totalKgCo2ePerFunctionalUnit,
        contributions: result.contributions,
        findings: result.findings,
        quality: result.quality,
        methodologyStatement: result.methodologyStatement,
    }, null, 2));
    const filesHashes = {
        "01-Product-Carbon-Footprint-Report-EN.pdf": sha256hex(pdfEn),
        "02-Urun-Karbon-Ayak-Izi-Raporu-TR.pdf": sha256hex(pdfTr),
        "03-Carbon-Data-Summary.xlsx": sha256hex(xlsxSummary),
        "04-Emission-Factor-Register.xlsx": sha256hex(xlsxFactors),
        "05-Evidence-Register.xlsx": sha256hex(xlsxEvidence),
        "06-Calculation-Trace.json": sha256hex(trace),
    };
    const masterHash = `sha256:${sha256hex(new TextEncoder().encode(JSON.stringify(filesHashes)))}`;
    const pdfSeal = (0, report_1.pcfSealVerificationPdfBytes)({
        packageId,
        reportId: input.reportId,
        sessionId: meta.sessionId,
        masterHash,
        reportStatus: result.status,
        engineVersion: result.engineVersion,
        methodologyVersion: result.methodologyVersion,
        factorRegistryVersion: policy_1.PCF_FACTOR_REGISTRY_VERSION,
        createdAt,
    });
    filesHashes["08-Muhur-Dogrulama-Belgesi.pdf"] = sha256hex(pdfSeal);
    const manifesto = {
        packageId,
        reportId: input.reportId,
        sessionId: meta.sessionId,
        createdAt,
        packageType: "PCF_SEAL_PACKAGE",
        workflowType: "pcf",
        engineVersion: result.engineVersion,
        methodologyVersion: result.methodologyVersion,
        factorRegistryVersion: policy_1.PCF_FACTOR_REGISTRY_VERSION,
        reportStatus: result.status,
        functionalUnit: input.functionalUnit,
        resultKgCo2ePerFunctionalUnit: result.totalKgCo2ePerFunctionalUnit,
        filesHashes: { ...filesHashes },
        masterHash,
        disclaimer: "Not an accredited verification opinion, ISO certificate, customs ruling or CBAM declaration",
    };
    const manifestoBytes = new TextEncoder().encode(JSON.stringify(manifesto, null, 2));
    const byName = {
        "01-Product-Carbon-Footprint-Report-EN.pdf": { mime: "application/pdf", bytes: pdfEn },
        "02-Urun-Karbon-Ayak-Izi-Raporu-TR.pdf": { mime: "application/pdf", bytes: pdfTr },
        "03-Carbon-Data-Summary.xlsx": {
            mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            bytes: xlsxSummary,
        },
        "04-Emission-Factor-Register.xlsx": {
            mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            bytes: xlsxFactors,
        },
        "05-Evidence-Register.xlsx": {
            mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            bytes: xlsxEvidence,
        },
        "06-Calculation-Trace.json": { mime: "application/json", bytes: trace },
        "07-BUTUNLUK-MANIFESTOSU.json": { mime: "application/json", bytes: manifestoBytes },
        "08-Muhur-Dogrulama-Belgesi.pdf": { mime: "application/pdf", bytes: pdfSeal },
    };
    const files = package_manifest_1.PCF_SEALED_PACKAGE_FILES.map((spec) => {
        const part = byName[spec.filename];
        if (!part)
            throw new Error(`PCF paket dosyası eksik: ${spec.filename}`);
        return {
            filename: spec.filename,
            mimeType: part.mime,
            sizeBytes: part.bytes.length,
            sha256: sha256hex(part.bytes),
            bytes: part.bytes,
        };
    });
    if (files.length !== package_manifest_1.PCF_SEALED_PACKAGE_FILE_COUNT) {
        throw new Error("PCF paket dosya sayısı manifest ile eşleşmiyor.");
    }
    for (const forbidden of package_manifest_1.PCF_FORBIDDEN_CBAM_FILENAMES) {
        if (files.some((f) => f.filename === forbidden)) {
            throw new Error(`PCF paketine CBAM dosyası giremez: ${forbidden}`);
        }
    }
    const zipBytes = (0, seal_binary_1.buildStoreZip)(files.map((f) => ({ name: f.filename, data: f.bytes })));
    return {
        packageId,
        zipFilename: `${packageId}-Urun-Karbon-Ayak-Izi-Paketi.zip`,
        zipBytes,
        masterHash,
        manifesto,
        files,
    };
}
function pcfSealedFilesForApi(pkg) {
    return pkg.files.map((f) => ({
        filename: f.filename,
        mimeType: f.mimeType,
        sizeBytes: f.sizeBytes,
        sha256: f.sha256,
        content: (0, seal_binary_1.bytesToBase64)(f.bytes),
        contentEncoding: "base64",
    }));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPcfReportLines = buildPcfReportLines;
exports.pcfReportPdfBytes = pcfReportPdfBytes;
exports.pcfArchiveReportPdfBytesTr = pcfArchiveReportPdfBytesTr;
exports.pcfSealVerificationPdfBytes = pcfSealVerificationPdfBytes;
const seal_binary_1 = require("../skdm/seal-binary");
const sec = (text) => ({ type: "section", text });
const kv = (key, val) => ({ type: "kv", key, val });
const tblH = (...cols) => ({ type: "table-h", cols });
const tblR = (even, ...cols) => ({ type: "table-r", cols, even });
const metric = (label, value) => ({ type: "metric", label, value });
const body = (text) => ({ type: "body", text });
const note = (text) => ({ type: "note", text });
const bullet = (text) => ({ type: "bullet", text });
const spacer = () => ({ type: "spacer" });
const num = (n, d = 4) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (n) => `${(n * 100).toFixed(1)}%`;
function buildPcfReportLines(input, result) {
    if (result.status === "blocked")
        throw new Error("PCF report cannot be generated while blocking findings remain.");
    const title = result.status === "buyer_ready"
        ? "PRODUCT CARBON FOOTPRINT REPORT"
        : "ESTIMATED PRODUCT CARBON FOOTPRINT REPORT";
    const L = [];
    L.push(spacer(), metric(title, `${num(result.totalKgCo2ePerFunctionalUnit, 3)} kg CO2e / ${input.functionalUnit}`), spacer(), kv("Report ID", input.reportId), kv("Company", input.companyName), kv("Facility", input.facilityName), kv("Product", input.productName), kv("Reporting period", `${input.reportingPeriodStart} - ${input.reportingPeriodEnd}`), kv("Functional / declared unit", input.functionalUnit), kv("Internal status", result.status === "buyer_ready" ? "Buyer-ready data package" : "Estimated data package"), spacer(), note("This document is a manufacturer-prepared product carbon footprint data package. It is not an accredited verification opinion, an ISO certificate, a customs ruling or a CBAM declaration."));
    L.push(spacer(), sec("01 - EXECUTIVE CARBON RESULT"), spacer(), tblH("Component", `kg CO2e / ${input.functionalUnit}`), tblR(false, "Scope 1 - on-site fuels", num(result.scope1KgCo2ePerFunctionalUnit)), tblR(true, "Scope 2 - purchased grid electricity", num(result.scope2KgCo2ePerFunctionalUnit)), tblR(false, "Upstream materials", num(result.upstreamMaterialKgCo2ePerFunctionalUnit)), tblR(true, "Packaging", num(result.packagingKgCo2ePerFunctionalUnit)), tblR(false, "TOTAL", num(result.totalKgCo2ePerFunctionalUnit)), spacer(), kv("Data quality grade", result.quality.grade), kv("Factor provenance coverage", pct(result.quality.factorProvenanceCoverage)), kv("Proxy contribution", pct(result.quality.proxyContributionRatio)), kv("Verified supplier / EPD contribution", pct(result.quality.verifiedSupplierContributionRatio)));
    L.push(spacer(), sec("02 - COMPANY AND FACILITY"), spacer(), kv("Company", input.companyName), kv("Facility", input.facilityName), kv("Country", input.country), kv("Buyer / recipient", input.buyerName?.trim() || "Not specified"));
    L.push(spacer(), sec("03 - PRODUCT DEFINITION"), spacer(), kv("Product", input.productName), kv("CN / GTIP", input.cnCode?.trim() || "Not specified"), kv("Functional / declared unit", input.functionalUnit), kv("Period production quantity", num(input.productionQuantityForPeriod, 2)));
    L.push(spacer(), sec("04 - GOAL AND SYSTEM BOUNDARY"), spacer(), body("Goal: provide a traceable product-level carbon data package to the buyer for supplier carbon-data exchange and internal value-chain accounting."), body("System boundary: cradle-to-gate. The calculation covers upstream material production, packaging, on-site fuel combustion and purchased electricity allocated to the product."), bullet("Downstream transport to the customer: excluded unless separately documented."), bullet("Use phase: excluded."), bullet("End-of-life: excluded."), bullet("Offsets / avoided emissions: excluded from the product carbon footprint result."));
    L.push(spacer(), sec("05 - MATERIAL AND PACKAGING INVENTORY"), spacer(), tblH("Item", "Category", "Activity", "Factor", `kg CO2e / ${input.functionalUnit}`));
    result.contributions
        .filter((c) => c.category === "upstream_material" || c.category === "packaging")
        .forEach((c, i) => {
        L.push(tblR(i % 2 === 0, c.label, c.category === "packaging" ? "Packaging" : "Material", `${num(c.activityQuantity, 3)} ${c.activityUnit}`, `${num(c.factor.kgCo2ePerActivityUnit, 6)} kgCO2e/${c.factor.activityUnit}`, num(c.kgCo2ePerFunctionalUnit)));
    });
    L.push(spacer(), sec("06 - ENERGY AND ALLOCATION"), spacer(), kv("Allocation share", pct(input.allocationShare)), kv("Allocation method", input.allocationMethod), spacer(), tblH("Energy item", "Activity", "Factor", `kg CO2e / ${input.functionalUnit}`));
    result.contributions
        .filter((c) => c.category === "scope1" || c.category === "scope2")
        .forEach((c, i) => {
        L.push(tblR(i % 2 === 0, c.label, `${num(c.activityQuantity, 3)} ${c.activityUnit}`, `${num(c.factor.kgCo2ePerActivityUnit, 6)} kgCO2e/${c.factor.activityUnit}`, num(c.kgCo2ePerFunctionalUnit)));
    });
    L.push(spacer(), sec("07 - DATA QUALITY AND EVIDENCE"), spacer(), kv("Internal data quality grade", result.quality.grade), kv("Production record", input.evidence.productionRecord ? "Available" : "Not evidenced"), kv("Electricity invoice / meter evidence", input.evidence.electricityInvoice ? "Available" : "Not evidenced"), kv("Fuel invoice / meter evidence", input.evidence.fuelInvoice ? "Available" : "Not evidenced"), kv("Material evidence records", String(input.evidence.materialEvidenceCount)), spacer(), body("Important: the internal buyer-ready status is a SKDMHesapla workflow quality label. It does not mean independent verification or conformity certification."));
    L.push(spacer(), sec("08 - EMISSION FACTOR REGISTER"), spacer(), tblH("Item", "Factor ID", "Quality", "Reference year", "Source"));
    result.contributions.forEach((c, i) => {
        L.push(tblR(i % 2 === 0, c.label, c.factor.factorId, c.factor.quality, String(c.factor.source.referenceYear), `${c.factor.source.publisher} - ${c.factor.source.version}`));
        L.push(note(`${c.label} source URL: ${c.factor.source.sourceUrl}; licence: ${c.factor.source.licence}.`));
        if (c.factor.limitations.length) {
            c.factor.limitations.forEach((x) => L.push(note(`${c.label}: ${x}`)));
        }
    });
    L.push(spacer(), sec("09 - METHODOLOGY AND SOURCES"), spacer(), body("The product carbon footprint is quantified within a cradle-to-gate system boundary using manufacturer activity data and traceable emission-factor records. The calculation framework references the quantification principles of ISO 14067:2018 and the cradle-to-gate transparency and data-exchange approach of WBCSD PACT Methodology V3. This report is not independent verification, an ISO certificate or a CBAM declaration."), spacer(), body("Source traceability"));
    const sourceKeys = new Set();
    for (const c of result.contributions) {
        const s = c.factor.source;
        const key = `${s.publisher}|${s.title}|${s.version}`;
        if (sourceKeys.has(key))
            continue;
        sourceKeys.add(key);
        L.push(bullet(`${s.publisher} - ${s.title}; version: ${s.version}; reference year: ${s.referenceYear}; source: ${s.sourceUrl}; licence: ${s.licence}.`));
    }
    L.push(spacer(), sec("10 - FINDINGS, ASSUMPTIONS AND LIMITATIONS"), spacer());
    const reportable = result.findings.filter((f) => f.severity !== "note");
    if (reportable.length === 0)
        L.push(body("No material workflow finding was recorded."));
    const findingEn = {
        PCF_REPORT_ID: "Report identity is incomplete.",
        PCF_COMPANY: "Company name is incomplete.",
        PCF_FACILITY: "Manufacturing facility is incomplete.",
        PCF_PRODUCT: "Product identification is incomplete.",
        PCF_FUNCTIONAL_UNIT: "Functional / declared unit is incomplete.",
        PCF_PERIOD: "Reporting-period dates require review.",
        PCF_NUMERIC_INPUT: "A numeric activity value requires review.",
        PCF_PRODUCTION_ZERO: "Period production quantity must be greater than zero.",
        PCF_ALLOCATION_SHARE: "Allocation share must be greater than zero and no more than one.",
        PCF_ALLOCATION_METHOD: "Allocation method and rationale are incomplete.",
        PCF_FACTOR_NOT_RESOLVED: "No usable, current and traceable emission factor was resolved for an activity.",
        PCF_UNIT_MISMATCH: "Activity and emission-factor units do not match; no silent conversion was applied.",
        PCF_ELECTRICITY_UNIT: "The electricity factor unit is not compatible with the activity data.",
        PCF_FUEL_UNIT: "Fuel activity and factor units do not match; no silent conversion was applied.",
        PCF_PROXY_USED: "One or more proxy emission factors were used; the report remains estimated.",
        PCF_EVIDENCE_INCOMPLETE: "Manufacturer evidence coverage is incomplete; the report remains estimated.",
        PCF_FACTOR_NOT_BUYER_READY: "One or more factor records are not approved for the internal buyer-ready gate.",
        PCF_UNRESOLVED_FACTOR: "One or more activities could not be resolved to a current, traceable emission factor.",
        PCF_PROVENANCE_INCOMPLETE: "Factor provenance (source title and URL) is incomplete.",
        PCF_FACTOR_QUALITY_LIMIT: "One or more factor records do not meet the internal buyer-ready quality gate.",
        PCF_PRODUCTION_EVIDENCE: "Period production quantity is not supported by a production record.",
        PCF_ELECTRICITY_EVIDENCE: "Electricity consumption is not supported by invoice or meter evidence.",
        PCF_FUEL_EVIDENCE: "Fuel consumption is not supported by invoice or meter evidence.",
        PCF_MATERIAL_EVIDENCE: "Material or packaging quantities are not fully evidenced.",
        PCF_SUPPLIER_FACTOR_VALUE: "A supplier-specific carbon value requires review.",
        PCF_SUPPLIER_FACTOR_EVIDENCE: "Supplier carbon data cannot be used without a source document.",
        PCF_SUPPLIER_FACTOR_EXPIRED: "A supplier carbon document is past its stated validity date.",
        PCF_ELECTRICITY_CONNECTION_UNKNOWN: "Grid electricity connection type was not specified; distribution was not assumed.",
        PCF_NO_ACTIVITY: "No material, packaging or energy activity was entered for the functional unit.",
    };
    reportable.forEach((f) => L.push(bullet(`${f.severity.toUpperCase()} - ${findingEn[f.code] ?? "A calculation or data-quality finding requires review; see the corresponding input and factor register."}`)));
    L.push(spacer(), sec("11 - DECLARATION AND BOUNDARIES OF USE"), spacer(), body("The result is based on the activity data and evidence supplied by the manufacturer and on the factor records identified in this report."), bullet("No accredited verification opinion is issued by this report."), bullet("No claim of ISO 14067 certification is made."), bullet("This report is not a CBAM declaration and must not substitute a legally required CBAM operator emissions report."), bullet("Any proxy or estimate-only factor keeps the report in estimated status."), bullet("The receiving buyer may request additional primary data, EPDs, supplier-specific PCFs or independent verification."));
    L.push(spacer(), sec("12 - VERSION AND TRACEABILITY"), spacer(), kv("Report ID", input.reportId), kv("Engine version", result.engineVersion), kv("Methodology version", result.methodologyVersion), kv("Created at", input.createdAt), kv("Status", result.status), note("Document integrity hash must be added by the existing SKDMHesapla sealing / download layer; the PCF engine itself remains deterministic and side-effect free."));
    return L;
}
function pcfReportPdfBytes(input, result) {
    const lines = buildPcfReportLines(input, result);
    const pages = (0, seal_binary_1.paginateRichLines)(lines);
    const plain = [
        "PRODUCT CARBON FOOTPRINT REPORT",
        `Report ID: ${input.reportId}`,
        `Product: ${input.productName}`,
        `Total: ${result.totalKgCo2ePerFunctionalUnit} kg CO2e / ${input.functionalUnit}`,
        `Status: ${result.status}`,
        "01 EXECUTIVE CARBON RESULT",
        "02 COMPANY AND FACILITY",
        "03 PRODUCT DEFINITION",
        "04 GOAL AND SYSTEM BOUNDARY",
        "05 MATERIAL AND PACKAGING INVENTORY",
        "06 ENERGY AND ALLOCATION",
        "07 DATA QUALITY AND EVIDENCE",
        "08 EMISSION FACTOR REGISTER",
        "09 METHODOLOGY AND SOURCES",
        "10 FINDINGS ASSUMPTIONS AND LIMITATIONS",
        "11 DECLARATION AND BOUNDARIES OF USE",
        "12 VERSION AND TRACEABILITY",
    ].join("\n");
    return (0, seal_binary_1.richPagesToPdfBytes)(pages, {
        title: `${input.companyName} | PRODUCT CARBON FOOTPRINT REPORT`,
        footer: `${input.reportId} | skdmhesapla.com/dogrula/`,
    }, plain);
}
function pcfArchiveReportPdfBytesTr(input, result) {
    if (result.status === "blocked")
        throw new Error("PCF report cannot be generated while blocking findings remain.");
    const title = result.status === "buyer_ready"
        ? "ÜRÜN KARBON AYAK İZİ RAPORU (İŞLETMECİ ARŞİVİ)"
        : "TAHMİNİ ÜRÜN KARBON AYAK İZİ RAPORU (İŞLETMECİ ARŞİVİ)";
    const L = [
        spacer(),
        metric(title, `${num(result.totalKgCo2ePerFunctionalUnit, 3)} kg CO2e / ${input.functionalUnit}`),
        spacer(),
        kv("Rapor no", input.reportId),
        kv("İşletme", input.companyName),
        kv("Tesis", input.facilityName),
        kv("Ürün", input.productName),
        kv("Dönem", `${input.reportingPeriodStart} - ${input.reportingPeriodEnd}`),
        kv("Fonksiyonel birim", input.functionalUnit),
        kv("İç durum", result.status === "buyer_ready" ? "Alıcıya gönderime hazır veri paketi" : "Tahmini veri paketi"),
        spacer(),
        note("Bu belge üretici tarafından hazırlanmış ürün karbon ayak izi veri paketidir. Akredite doğrulama görüşü, ISO sertifikası, gümrük kararı veya CBAM beyanı değildir."),
        spacer(),
        sec("01 - SONUÇ"),
        spacer(),
        tblH("Bileşen", `kg CO2e / ${input.functionalUnit}`),
        tblR(false, "Kapsam 1 - tesis yakıtı", num(result.scope1KgCo2ePerFunctionalUnit)),
        tblR(true, "Kapsam 2 - şebeke elektriği", num(result.scope2KgCo2ePerFunctionalUnit)),
        tblR(false, "Öncül malzemeler", num(result.upstreamMaterialKgCo2ePerFunctionalUnit)),
        tblR(true, "Ambalaj", num(result.packagingKgCo2ePerFunctionalUnit)),
        tblR(false, "TOPLAM", num(result.totalKgCo2ePerFunctionalUnit)),
        spacer(),
        kv("Motor", result.engineVersion),
        kv("Metodoloji", result.methodologyVersion),
        kv("Kalite notu", result.quality.grade),
    ];
    const pages = (0, seal_binary_1.paginateRichLines)(L);
    const plain = [
        "URUN KARBON AYAK IZI RAPORU",
        `Report ID: ${input.reportId}`,
        `Status: ${result.status}`,
        "Bu belge CBAM beyani veya akredite dogrulama gorusu degildir.",
    ].join("\n");
    return (0, seal_binary_1.richPagesToPdfBytes)(pages, {
        title: `${input.companyName} | Urun Karbon Ayak Izi Raporu`,
        footer: `${input.reportId} | skdmhesapla.com/dogrula/`,
    }, plain);
}
function pcfSealVerificationPdfBytes(args) {
    const L = [
        spacer(),
        metric("SEAL VERIFICATION", args.packageId),
        spacer(),
        kv("Package ID", args.packageId),
        kv("Report ID", args.reportId),
        kv("Session ID", args.sessionId),
        kv("Package type", "Product Carbon Footprint Package"),
        kv("Internal status", args.reportStatus),
        kv("Engine version", args.engineVersion),
        kv("Methodology version", args.methodologyVersion),
        kv("Factor registry version", args.factorRegistryVersion),
        kv("Sealed at", args.createdAt),
        kv("Master SHA-256", args.masterHash),
        spacer(),
        body("Verify this package at https://skdmhesapla.com/dogrula/ by entering the package ID or the master hash. Compare the displayed hash with 07-BUTUNLUK-MANIFESTOSU.json inside the ZIP."),
        spacer(),
        note("This seal confirms file integrity only. It is not an accredited verification opinion, ISO certificate, customs ruling or CBAM declaration."),
    ];
    const pages = (0, seal_binary_1.paginateRichLines)(L);
    const plain = [
        "SEAL VERIFICATION",
        args.packageId,
        args.masterHash,
        "Not an accredited verification opinion, ISO certificate, customs ruling or CBAM declaration",
    ].join("\n");
    return (0, seal_binary_1.richPagesToPdfBytes)(pages, { title: `${args.packageId} | seal verification`, footer: "skdmhesapla.com/dogrula/" }, plain);
}

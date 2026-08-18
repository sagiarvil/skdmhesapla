"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PCF_POLICY = exports.PCF_FACTOR_REGISTRY_VERSION = exports.PCF_METHODOLOGY_VERSION = exports.PCF_ENGINE_VERSION = void 0;
exports.PCF_ENGINE_VERSION = "pcf-calc-v1.0.0";
exports.PCF_METHODOLOGY_VERSION = "SKDMH-PCF-2026.08.1";
exports.PCF_FACTOR_REGISTRY_VERSION = "pcf-factors-v1.0.0";
/**
 * Ürün politikasıdır; ISO 14067 veya PACT tarafından verilmiş bir "uygunluk" eşiği değildir.
 * buyer_ready etiketi yalnız SKDMHesapla iç kalite kapısıdır ve bağımsız doğrulama anlamına gelmez.
 */
exports.PCF_POLICY = Object.freeze({
    reportBoundary: "cradle-to-gate",
    buyerReadyAllowedReviewStatuses: new Set(["approved"]),
    buyerReadyAllowedFactorQualities: new Set([
        "supplier_specific_verified",
        "epd_verified",
        "official_generic",
        "sector_generic",
    ]),
    methodologyStatement: "Ürün karbon ayak izi, cradle-to-gate sistem sınırında faaliyet verileri ve izlenebilir emisyon faktörleriyle hesaplanır. " +
        "Metodoloji ISO 14067:2018'in ürün karbon ayak izi nicelendirme ilkelerini ve WBCSD PACT Methodology V3'ün cradle-to-gate veri şeffaflığı yaklaşımını referans alır. " +
        "Bu çıktı bağımsız doğrulama, ISO sertifikası veya CBAM beyanı değildir.",
});

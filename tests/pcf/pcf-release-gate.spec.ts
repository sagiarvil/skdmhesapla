import { PCF_FACTORS } from "../../src/lib/pcf/factors";
import { assertPcfPremiumReleaseCoverage } from "../../src/lib/pcf/release-gate";

/**
 * RELEASE GATE — mevcut codepack'te bilinçli olarak geçmez.
 * Cursor, factor sourcing fazını tamamlayıp tüm kaynakları insan incelemesinden
 * geçirmeden bu testin yeşil olmasını sağlamaya çalışmamalıdır; placeholder sayı
 * eklemek kesinlikle yasaktır.
 */
assertPcfPremiumReleaseCoverage(PCF_FACTORS, "2026-08-17T00:00:00.000Z");
console.log("PCF PREMIUM FACTOR COVERAGE PASSED");

/**
 * EU Denizcilik Karbon Uyumu — Mevzuat Değişiklik Otomasyonu & Takip Motoru
 * EUR-Lex ve Avrupa Komisyonu Resmî Gazete düzenlemelerini izleyen kural motoru.
 *
 * İşlev:
 * - Mevzuat kural versiyonlarını kontrol eder.
 * - Beklenen parametre ile geçerli kurallar arasında fark tespit edildiğinde
 *   sistemi / ilgili raporlama dosyasını "REGULATORY_REVIEW_REQUIRED" durumuna alır.
 */

import {
  FUELEU_BASELINE_GHG_INTENSITY,
  FUELEU_TARGETS,
  ETS_PHASE_IN,
  NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS,
} from "../constants";
import type { ReportingYearStatus } from "../types";

export interface MaritimeRulesetSnapshot {
  version: string;
  effectiveDate: string;
  sourceEurLexUris: string[];
  parameters: {
    fueleuBaselineGhgIntensity: number;
    fueleu2025Target: number;
    etsPhaseIn2024: number;
    etsPhaseIn2025: number;
    etsPhaseIn2026: number;
    neighbouringTransshipmentPortCodes: string[];
  };
}

export const CURRENT_MARITIME_RULESET: MaritimeRulesetSnapshot = {
  version: "EU-MARITIME-2025.1",
  effectiveDate: "2025-01-01",
  sourceEurLexUris: [
    "https://eur-lex.europa.eu/eli/reg/2023/1805/oj", // FuelEU Maritime
    "https://eur-lex.europa.eu/eli/dir/2023/957/oj", // EU ETS Maritime
    "https://eur-lex.europa.eu/eli/reg_impl/2023/2297/oj", // Neighbouring ports
  ],
  parameters: {
    fueleuBaselineGhgIntensity: FUELEU_BASELINE_GHG_INTENSITY,
    fueleu2025Target: FUELEU_TARGETS[2025],
    etsPhaseIn2024: ETS_PHASE_IN[2024],
    etsPhaseIn2025: ETS_PHASE_IN[2025],
    etsPhaseIn2026: ETS_PHASE_IN[2026],
    neighbouringTransshipmentPortCodes: NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS.map((p) => p.code),
  },
};

export interface RegulatoryAuditCheckResult {
  hasDeviation: boolean;
  status: ReportingYearStatus;
  detectedChanges: string[];
  recommendedAction: string;
}

/**
 * Bir gemi raporlama oturumunun kural versiyonunu yürürlükteki mevzuatla kıyaslar.
 */
export function auditSessionAgainstActiveRules(
  sessionRulesetVersion: string,
  sessionParameters?: Partial<MaritimeRulesetSnapshot["parameters"]>
): RegulatoryAuditCheckResult {
  const detectedChanges: string[] = [];

  if (sessionRulesetVersion !== CURRENT_MARITIME_RULESET.version) {
    detectedChanges.push(
      `Oturum kural versiyonu (${sessionRulesetVersion}) güncel versiyon (${CURRENT_MARITIME_RULESET.version}) ile uyuşmuyor.`
    );
  }

  if (sessionParameters) {
    if (
      sessionParameters.fueleu2025Target !== undefined &&
      Math.abs(sessionParameters.fueleu2025Target - CURRENT_MARITIME_RULESET.parameters.fueleu2025Target) > 0.0001
    ) {
      detectedChanges.push("FuelEU 2025 referans hedefinde mevzuat sapması tespit edildi.");
    }

    if (
      sessionParameters.etsPhaseIn2025 !== undefined &&
      sessionParameters.etsPhaseIn2025 !== CURRENT_MARITIME_RULESET.parameters.etsPhaseIn2025
    ) {
      detectedChanges.push("EU ETS 2025 teslim yüzdesinde (%70) mevzuat sapması tespit edildi.");
    }
  }

  const hasDeviation = detectedChanges.length > 0;

  return {
    hasDeviation,
    status: hasDeviation ? "REGULATORY_REVIEW_REQUIRED" : "audited",
    detectedChanges,
    recommendedAction: hasDeviation
      ? "Mevzuat değişikliği tespit edildi. Klas doğrulaması öncesinde yeni mevzuat kuralları ile yeniden hesaplama yapılması zorunludur."
      : "Yürürlükteki mevzuatla %100 uyumludur.",
  };
}

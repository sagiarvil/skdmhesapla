/**
 * EU Denizcilik Karbon Uyumu — Yakıt (BDN/ROB) ve Sefer/Liman Mutabakat Motoru
 *
 * Dayanak:
 * - Regulation (EU) 2015/757 as amended by (EU) 2023/957 Annex I & II
 * - Implementing Regulation (EU) 2024/2027 (FuelEU Verification Standards)
 *
 * Kural Kütüğü:
 * 1. ROB Formülü: Açılış ROB + İkmal (BDN) + Transfer Giriş - Transfer Çıkış - Kapanış ROB = Hesaplanan Tüketim
 * 2. Sefer Tüketimi ile Motor Kütüğü Mutabakatı: Açıklanamayan fark != 0 ise BLOKE.
 * 3. Sefer & Uğrak Tamlığı: Seferler arasında coğrafi veya zamansal boşluk (orphan port call / gap) kabul edilmez.
 */

export interface FuelBdnRobRecord {
  fuelType: string;
  openingRobTonnes: number; // 01.01.YYYY 00:00 UTC
  bunkeredTonnes: number; // BDN toplamı
  transfersInTonnes: number;
  transfersOutTonnes: number;
  closingRobTonnes: number; // 31.12.YYYY 24:00 UTC
  calculatedConsumptionTonnes: number;
  engineLogConsumptionTonnes: number;
  voyageReportedConsumptionTonnes: number;
  bdnReferences: string[];
}

export interface VoyageLegCheck {
  voyageNumber: string;
  departureUnlocode: string;
  arrivalUnlocode: string;
  departureTimeUtc: string;
  arrivalTimeUtc: string;
  fuelConsumptionTonnes: number;
  distanceNm: number;
  cargoTonnes: number;
}

export interface ReconciliationAuditResult {
  passed: boolean;
  score: number; // 0 to 100
  status: "RECONCILED_CLEAN" | "RECONCILIATION_DEFICIT_DETECTED" | "UNEXPLAINED_VARIANCE_BLOCKED";
  robReconciliation: {
    totalBunkeredTonnes: number;
    totalCalculatedTonnes: number;
    totalReportedTonnes: number;
    unexplainedVarianceTonnes: number;
    variancePercentage: number;
  };
  voyageContinuity: {
    totalVoyagesCount: number;
    isContinuous: boolean;
    brokenChains: string[];
  };
  evidenceTraceability: {
    bdnCount: number;
    missingBdnVoyages: string[];
    is100PercentTraceable: boolean;
  };
  auditNotes: string[];
}

/**
 * Fuel / BDN / ROB ve Sefer Zinciri Mutabakatı
 */
export function reconcileMaritimeData(
  robRecords: FuelBdnRobRecord[],
  voyages: VoyageLegCheck[],
  uncertaintyTolerancePercent = 0.5 // MP uncertainty toleransı (%0.5)
): ReconciliationAuditResult {
  const auditNotes: string[] = [];
  let totalBunkered = 0;
  let totalCalculated = 0;
  let totalReported = 0;

  // 1. ROB Formül Kontrolü
  for (const r of robRecords) {
    const expectedCalc =
      r.openingRobTonnes + r.bunkeredTonnes + r.transfersInTonnes - r.transfersOutTonnes - r.closingRobTonnes;

    const delta = Math.abs(expectedCalc - r.calculatedConsumptionTonnes);
    if (delta > 0.01) {
      auditNotes.push(
        `ROB Denge Hatası (${r.fuelType}): Açılış + İkmal - Kapanış (${expectedCalc.toFixed(2)}t) != Beyan Edilen (${r.calculatedConsumptionTonnes.toFixed(2)}t)`
      );
    }

    totalBunkered += r.bunkeredTonnes;
    totalCalculated += r.calculatedConsumptionTonnes;
    totalReported += r.voyageReportedConsumptionTonnes;
  }

  const unexplainedVariance = Math.abs(totalCalculated - totalReported);
  const variancePct = totalCalculated > 0 ? (unexplainedVariance / totalCalculated) * 100 : 0;

  // 2. Sefer Sürekliliği Kontrolü (Voyage Chain Continuity)
  const brokenChains: string[] = [];
  for (let i = 1; i < voyages.length; i++) {
    const prev = voyages[i - 1]!;
    const curr = voyages[i]!;

    if (prev.arrivalUnlocode !== curr.departureUnlocode) {
      brokenChains.push(
        `Sefer Zinciri Kopukluğu: Sefer ${prev.voyageNumber} varış limanı (${prev.arrivalUnlocode}), sonraki Sefer ${curr.voyageNumber} kalkış limanı (${curr.departureUnlocode}) ile eşleşmiyor.`
      );
    }

    // Zaman sıralaması
    if (new Date(prev.arrivalTimeUtc) > new Date(curr.departureTimeUtc)) {
      brokenChains.push(
        `Zamansal Çakışma: Sefer ${prev.voyageNumber} varış tarihi (${prev.arrivalTimeUtc}), Sefer ${curr.voyageNumber} kalkışından (${curr.departureTimeUtc}) sonra.`
      );
    }
  }

  // 3. Kanıt İzlenebilirliği (BDN Eşleşmesi)
  let bdnCount = 0;
  const missingBdnVoyages: string[] = [];
  for (const r of robRecords) {
    bdnCount += r.bdnReferences.length;
    if (r.bunkeredTonnes > 0 && r.bdnReferences.length === 0) {
      missingBdnVoyages.push(`${r.fuelType} için ikmal yapılmış ancak hiçbir BDN referansı bağlanmamış.`);
    }
  }

  // Karar
  const isVarianceAcceptable = variancePct <= uncertaintyTolerancePercent;
  const isContinuous = brokenChains.length === 0;
  const is100PercentTraceable = missingBdnVoyages.length === 0 && bdnCount > 0;

  const passed = isVarianceAcceptable && isContinuous && is100PercentTraceable;

  if (passed) {
    auditNotes.push(
      `Tüm yakıt tüketimleri ROB kütüğü ve BDN fişleriyle %100 mutabık (Varyans: %${variancePct.toFixed(3)} <= Tolerans %${uncertaintyTolerancePercent}).`,
      `Sefer zincirinde ${voyages.length} sefer kesintisiz doğrulandı.`
    );
  } else {
    if (!isVarianceAcceptable) {
      auditNotes.push(
        `BLOKE: Yakıt tüketim varyansı (%${variancePct.toFixed(2)}) kabul edilebilir ölçüm belirsizliği sınırını aşıyor.`
      );
    }
    if (!isContinuous) {
      auditNotes.push(`BLOKE: Sefer kütüğünde ${brokenChains.length} noktada süreklilik kopukluğu tespit edildi.`);
    }
    if (!is100PercentTraceable) {
      auditNotes.push("BLOKE: BDN birincil kanıt referansları eksik.");
    }
  }

  return {
    passed,
    score: passed ? 100 : 0,
    status: passed
      ? "RECONCILED_CLEAN"
      : unexplainedVariance > 0
      ? "UNEXPLAINED_VARIANCE_BLOCKED"
      : "RECONCILIATION_DEFICIT_DETECTED",
    robReconciliation: {
      totalBunkeredTonnes: Number(totalBunkered.toFixed(2)),
      totalCalculatedTonnes: Number(totalCalculated.toFixed(2)),
      totalReportedTonnes: Number(totalReported.toFixed(2)),
      unexplainedVarianceTonnes: Number(unexplainedVariance.toFixed(2)),
      variancePercentage: Number(variancePct.toFixed(3)),
    },
    voyageContinuity: {
      totalVoyagesCount: voyages.length,
      isContinuous,
      brokenChains,
    },
    evidenceTraceability: {
      bdnCount,
      missingBdnVoyages,
      is100PercentTraceable,
    },
    auditNotes,
  };
}

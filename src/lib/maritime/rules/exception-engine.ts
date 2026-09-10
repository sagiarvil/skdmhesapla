/**
 * EU Denizcilik Karbon Uyumu — Denetçi İstisna Motoru (Exception Engine)
 * Direktif 2003/87/EC, Tüzük (EU) 2015/757 ve Tüzük (EU) 2023/1805 Dayanaklı
 *
 * Denetlenen İstisna ve Muafiyetler:
 * 1. Port Call İstisnaları (Yakıt ikmali, personel değişimi, tersane/tamir, acil durum)
 * 2. Komşu Konteyner Aktarma Limanı (Tanger Med, Port Said - 300 mil kuralı)
 * 3. Tonaj & Tip Sınırları (<5.000 GT muafiyeti; 400-4.999 GT genel kargo/offshore MRV-yalnız kuralı)
 * 4. Buz Sınıfı Düzeltmesi (Ice Class IA / IAS seyir düzeltmesi)
 * 5. Adalar ve En Dış Bölgeler (Outermost Regions) geçici istisnaları
 */

import type { ShipType, IceClass, PortInfo } from "../types";
import { NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS } from "../constants";

export type StopPurpose =
  | "CARGO_OPERATION"
  | "PASSENGER_EMBARKATION"
  | "BUNKERING_ONLY"
  | "CREW_CHANGE_ONLY"
  | "DRY_DOCK_REPAIR"
  | "SEARCH_AND_RESCUE"
  | "DISTRESS_WEATHER";

export interface ExceptionEvaluationResult {
  isValidPortCall: boolean;
  isSubjectToMrv: boolean;
  isSubjectToEtsSurrender: boolean;
  isSubjectToFuelEu: boolean;
  appliedExceptions: string[];
  auditorNotes: string[];
  fuelCorrectionFactor: number; // e.g. 0.95 for ice class navigation
}

export function evaluateMaritimeExceptions(params: {
  shipType: ShipType;
  grossTonnage: number;
  iceClass: IceClass;
  stopPurpose: StopPurpose;
  port: PortInfo;
  reportingYear: number;
  isIceNavigation?: boolean;
}): ExceptionEvaluationResult {
  const appliedExceptions: string[] = [];
  const auditorNotes: string[] = [];
  let fuelCorrectionFactor = 1.0;

  // 1. Port Call Tanımı (Madde 3z - Yalnızca yük/yolcu operasyonları resmi duraktır)
  let isValidPortCall = true;
  if (
    params.stopPurpose === "BUNKERING_ONLY" ||
    params.stopPurpose === "CREW_CHANGE_ONLY" ||
    params.stopPurpose === "DRY_DOCK_REPAIR" ||
    params.stopPurpose === "SEARCH_AND_RESCUE" ||
    params.stopPurpose === "DISTRESS_WEATHER"
  ) {
    isValidPortCall = false;
    appliedExceptions.push(`EXCLUDED_PORT_CALL_${params.stopPurpose}`);
    auditorNotes.push(
      `Liman uğrağı amacı (${params.stopPurpose}) ticari yük/yolcu operasyonu içermediğinden sefer bölücü 'Port Call' kabul edilmez.`
    );
  }

  // 2. Komşu Konteyner Aktarma Limanı (Tanger Med / Port Said)
  if (
    params.shipType === "container" &&
    NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS.some((p) => p.code === params.port.code)
  ) {
    isValidPortCall = false;
    appliedExceptions.push("NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORT");
    auditorNotes.push(
      `Liman (${params.port.name} - ${params.port.code}), Direktif 2003/87/EC Art 3ga uyarınca komşu konteyner aktarma limanıdır; sefer bu noktada kesilmez.`
    );
  }

  // 3. Tonaj Kapsamı Denetimi
  let isSubjectToMrv = false;
  let isSubjectToEtsSurrender = false;
  let isSubjectToFuelEu = false;

  if (params.grossTonnage >= 5000) {
    isSubjectToMrv = true;
    isSubjectToEtsSurrender = true;
    isSubjectToFuelEu = true;
  } else if (params.grossTonnage >= 400 && params.grossTonnage < 5000) {
    if (params.shipType === "general_cargo" || params.shipType === "offshore") {
      isSubjectToMrv = params.reportingYear >= 2025;
      isSubjectToEtsSurrender = false; // Şu an için ETS teslimi yok
      isSubjectToFuelEu = false;
      appliedExceptions.push("GENERAL_CARGO_OFFSHORE_MRV_ONLY_400_4999_GT");
      auditorNotes.push(
        "400-4.999 GT arası genel kargo/offshore gemisi: 2025 itibarıyla yalnızca MRV kapsamındadır, ETS teslim yükümlülüğü dışındadır."
      );
    } else {
      appliedExceptions.push("BELOW_5000_GT_EXEMPTION");
      auditorNotes.push("5.000 GT altı gemi tüm AB denizcilik rejimlerinden muaftır.");
    }
  } else {
    appliedExceptions.push("BELOW_400_GT_FULL_EXCLUSION");
    auditorNotes.push("400 GT altı gemi rejim dışıdır.");
  }

  // 4. Buz Sınıfı Seyir Düzeltmesi (FuelEU Madde 10(2) & MRV)
  if (
    (params.iceClass === "IA" || params.iceClass === "IAS") &&
    params.isIceNavigation
  ) {
    fuelCorrectionFactor = 0.95; // %5 emisyon ve tüketim indirimi tanınır
    appliedExceptions.push(`ICE_CLASS_${params.iceClass}_NAVIGATION_CORRECTION`);
    auditorNotes.push(
      `Buz koşullarında seyir (Ice Class ${params.iceClass}): Mevzuat uyarınca %5 yakıt tüketim indirimi uygulanır.`
    );
  }

  return {
    isValidPortCall,
    isSubjectToMrv,
    isSubjectToEtsSurrender,
    isSubjectToFuelEu,
    appliedExceptions,
    auditorNotes,
    fuelCorrectionFactor,
  };
}

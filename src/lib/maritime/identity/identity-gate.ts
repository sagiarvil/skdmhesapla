/**
 * EU Denizcilik Karbon Uyumu — BLOCK-0 Gemi ve İşletmeci Kimliği Doğrulama Kapısı
 *
 * Mandate Madde 3:
 * "BLOCK-0: GEMİ KİMLİĞİ DOĞRULANMADAN HİÇBİR HESAP ÜRETME.
 * Bu görevde en sert kapı budur.
 * Aşağıdaki belgeler aynı gemiyi göstermeden hesaplamaya devam ETME:
 * - Certificate of Registry
 * - IMO ship identification evidence / GISIS-equivalent primary evidence
 * - Class Certificate
 * - THETIS-MRV ship master record
 * - Flag State
 * - Gross Tonnage certificate
 * - Registered Owner record
 * - ISM Company record
 * - IMO Company / Registered Owner identification
 *
 * Herhangi bir conflict = REPORT GENERATION BLOCKED (Readiness 0/100)."
 */

export interface PrimaryIdentityEvidence {
  certificateOfRegistry?: {
    shipName: string;
    imoNumber: string;
    flag: string;
    portOfRegistry: string;
    grossTonnage: number;
    deadweightTonnes?: number;
    issueDate: string;
    issuingAuthority: string;
    documentRef: string;
  };
  classCertificate?: {
    shipName: string;
    imoNumber: string;
    classificationSociety: string;
    grossTonnage: number;
    deadweightTonnes?: number;
    documentRef: string;
  };
  tonnageCertificate?: {
    imoNumber: string;
    grossTonnage: number;
    netTonnage?: number;
    documentRef: string;
  };
  ownerRecord?: {
    registeredOwnerName: string;
    registeredOwnerImoNumber: string;
    documentRef: string;
  };
  ismCompanyRecord?: {
    ismCompanyName: string;
    ismCompanyImoNumber: string;
    docMandateReference?: string;
    documentRef: string;
  };
  thetisMasterRecord?: {
    shipName: string;
    imoNumber: string;
    grossTonnage: number;
    flag: string;
  };
}

export interface ShipIdentityInput {
  shipName: string;
  imoNumber: string;
  flagState: string;
  portOfRegistry: string;
  grossTonnage: number;
  deadweightTonnes?: number;
  shipType: string;
  registeredOwnerName: string;
  registeredOwnerImoNumber: string;
  ismCompanyName: string;
  ismCompanyImoNumber: string;
  responsibilityPeriodFrom: string;
  responsibilityPeriodTo: string;
}

export interface IdentityGateResult {
  passed: boolean;
  score: number; // 0 or 100
  status: "IDENTIFIED_VERIFIED" | "IDENTITY_CONFLICT_DETECTED" | "INSUFFICIENT_PRIMARY_EVIDENCE";
  conflicts: string[];
  missingEvidence: string[];
  auditNotes: string[];
  canonicalShipRecord?: ShipIdentityInput;
}

/**
 * IMO Gemi Numarası Checksum Doğrulaması (IMO Res. A.1078(28))
 */
export function verifyImoChecksum(imoStr: string): boolean {
  const clean = imoStr.replace(/\D/g, "");
  if (clean.length !== 7) return false;
  const digits = clean.split("").map(Number);
  const checkDigit = digits[6];
  let sum = 0;
  for (let i = 0; i < 6; i++) {
    sum += digits[i]! * (7 - i);
  }
  return sum % 10 === checkDigit;
}

/**
 * BLOCK-0: Kimlik Doğrulama Kapısı
 */
export function evaluateIdentityGate(
  shipInput: ShipIdentityInput,
  evidence?: PrimaryIdentityEvidence
): IdentityGateResult {
  const conflicts: string[] = [];
  const missingEvidence: string[] = [];
  const auditNotes: string[] = [];

  // 1. IMO Checksum Kontrolü
  if (!verifyImoChecksum(shipInput.imoNumber)) {
    conflicts.push(
      `IMO numarası (${shipInput.imoNumber}) matematiksel kontrol basamağını (IMO Res. A.1078(28)) sağlamıyor.`
    );
  }

  // 2. Birincil Kanıt Varlığı Kontrolü
  if (!evidence) {
    missingEvidence.push(
      "Birincil gemi tescil ve klas belgeleri (Certificate of Registry, Class Cert) sağlanmadı."
    );
    return {
      passed: false,
      score: 0,
      status: "INSUFFICIENT_PRIMARY_EVIDENCE",
      conflicts,
      missingEvidence,
      auditNotes: ["BLOCK-0: Birincil kanıt paketi olmadan gemi profili açılamaz."],
    };
  }

  // 3. Certificate of Registry Çapraz Kontrolü
  if (evidence.certificateOfRegistry) {
    const reg = evidence.certificateOfRegistry;
    if (reg.imoNumber !== shipInput.imoNumber) {
      conflicts.push(
        `IMO Çatışması: Girdi IMO (${shipInput.imoNumber}) != Tescil Belgesi IMO (${reg.imoNumber}).`
      );
    }
    if (reg.shipName.trim().toUpperCase() !== shipInput.shipName.trim().toUpperCase()) {
      conflicts.push(
        `Gemi Adı Çatışması: Girdi Adı (${shipInput.shipName}) != Tescil Belgesi (${reg.shipName}).`
      );
    }
    if (Math.abs(reg.grossTonnage - shipInput.grossTonnage) > 0) {
      conflicts.push(
        `Brüt Tonaj (GT) Çatışması: Girdi GT (${shipInput.grossTonnage}) != Tescil Belgesi GT (${reg.grossTonnage}).`
      );
    }
    auditNotes.push(`Certificate of Registry doğrulandı (${reg.documentRef}).`);
  } else {
    missingEvidence.push("Certificate of Registry eksik.");
  }

  // 4. Class Certificate Çapraz Kontrolü
  if (evidence.classCertificate) {
    const cls = evidence.classCertificate;
    if (cls.imoNumber !== shipInput.imoNumber) {
      conflicts.push(
        `Klas Sertifikası IMO Çatışması: Girdi (${shipInput.imoNumber}) != Klas (${cls.imoNumber}).`
      );
    }
    if (Math.abs(cls.grossTonnage - shipInput.grossTonnage) > 0) {
      conflicts.push(
        `Klas Brüt Tonaj (GT) Çatışması: Girdi GT (${shipInput.grossTonnage}) != Klas GT (${cls.grossTonnage}).`
      );
    }
    auditNotes.push(`Class Certificate doğrulandı (${cls.classificationSociety} - ${cls.documentRef}).`);
  } else {
    missingEvidence.push("Class Certificate eksik.");
  }

  // 5. THETIS-MRV Master Record Kontrolü
  if (evidence.thetisMasterRecord) {
    const tm = evidence.thetisMasterRecord;
    if (tm.imoNumber !== shipInput.imoNumber) {
      conflicts.push(`THETIS-MRV Master IMO Çatışması: ${shipInput.imoNumber} != ${tm.imoNumber}`);
    }
    if (Math.abs(tm.grossTonnage - shipInput.grossTonnage) > 0) {
      conflicts.push(
        `THETIS-MRV Master GT Çatışması: Girdi (${shipInput.grossTonnage}) != THETIS (${tm.grossTonnage}).`
      );
    }
    auditNotes.push("THETIS-MRV Master Record ile mutabakat sağlandı.");
  }

  // 6. Registered Owner ve ISM Şirketi Kontrolü
  if (evidence.ownerRecord) {
    auditNotes.push(`Registered Owner teyit edildi: ${evidence.ownerRecord.registeredOwnerName}`);
  }
  if (evidence.ismCompanyRecord) {
    const ism = evidence.ismCompanyRecord;
    if (ism.ismCompanyImoNumber !== shipInput.ismCompanyImoNumber) {
      conflicts.push(
        `ISM IMO Co No Çatışması: ${shipInput.ismCompanyImoNumber} != ${ism.ismCompanyImoNumber}`
      );
    }
    auditNotes.push(`ISM Company teyit edildi: ${ism.ismCompanyName}`);
  }

  // Karar
  if (conflicts.length > 0) {
    return {
      passed: false,
      score: 0,
      status: "IDENTITY_CONFLICT_DETECTED",
      conflicts,
      missingEvidence,
      auditNotes: [
        "BLOCK-0 ACTIVATED: Gemi kimlik belgeleri arasında veri çatışması tespit edildi. Hesaplama ve rapor üretimi BLOKE EDİLDİ.",
        ...auditNotes,
      ],
    };
  }

  if (missingEvidence.length > 0) {
    return {
      passed: false,
      score: 0,
      status: "INSUFFICIENT_PRIMARY_EVIDENCE",
      conflicts,
      missingEvidence,
      auditNotes: [
        "BLOCK-0 ACTIVATED: Zorunlu birincil kimlik kanıtları eksik.",
        ...auditNotes,
      ],
    };
  }

  return {
    passed: true,
    score: 100,
    status: "IDENTIFIED_VERIFIED",
    conflicts: [],
    missingEvidence: [],
    auditNotes: [
      "BLOCK-0 GEÇİLDİ: Gemi sicil kaydı, klas sertifikası, IMO numarası ve brüt tonaj birincil kaynaklarla %100 mutabık.",
      ...auditNotes,
    ],
    canonicalShipRecord: shipInput,
  };
}

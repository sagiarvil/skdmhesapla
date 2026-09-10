/**
 * EU Denizcilik Karbon Uyumu — Yönetici Üye Devlet (Administering Authority) & Union Registry Motoru
 * Direktif 2003/87/EC Madde 3gd & Komisyon Uygulama Tüzüğü (EU) 2024/411
 *
 * Karar Ağacı:
 * 1. Şirket bir AB Üye Devletinde kayıtlı ise -> Kayıtlı olduğu Üye Devlet (Registered Member State)
 * 2. Şirket AB dışı ise (örn. Türkiye merkezli armatör) -> Son 4 yılda en çok liman uğrağı yapılan Üye Devlet
 * 3. Şirketin geçmiş 4 yılda seferi yoksa -> Kapsama giren ilk seferin başladığı veya bittiği AB Üye Devleti
 */

export interface PortCallHistory {
  countryCode: string; // e.g. "IT", "GR", "ES", "NL", "DE"
  portCallsCount: number;
}

export interface AdministeringAuthorityDecision {
  assignedMemberState: string; // ISO country code
  ruleApplied: "REGISTERED_OFFICE" | "GREATEST_PORT_CALLS_4YR" | "FIRST_PORT_CALL_DEFAULT";
  legalBasis: string;
  mohaOpeningChecklist: Array<{
    item: string;
    required: boolean;
    status: "READY" | "PENDING";
    instructions: string;
  }>;
}

/**
 * Şirket profili ve liman geçmişine göre AB Yönetici Yetkili Makamını belirler.
 */
export function determineAdministeringMemberState(
  isRegisteredInEu: boolean,
  registeredEuCountry: string | undefined,
  historicalPortCalls: PortCallHistory[],
  firstPortCallCountry: string
): AdministeringAuthorityDecision {
  let assignedMemberState = "DE";
  let ruleApplied: AdministeringAuthorityDecision["ruleApplied"] = "FIRST_PORT_CALL_DEFAULT";
  let legalBasis = "";

  // 1. Kural: AB içi tescil
  if (isRegisteredInEu && registeredEuCountry) {
    assignedMemberState = registeredEuCountry.toUpperCase();
    ruleApplied = "REGISTERED_OFFICE";
    legalBasis = "Direktif 2003/87/EC Madde 3gd(a) — Şirketin tescil edildiği AB Üye Devleti.";
  }
  // 2. Kural: Geçmiş 4 yıldaki en yoğun liman uğrağı
  else if (historicalPortCalls.length > 0) {
    const sorted = [...historicalPortCalls].sort(
      (a, b) => b.portCallsCount - a.portCallsCount
    );
    if (sorted[0] && sorted[0].portCallsCount > 0) {
      assignedMemberState = sorted[0].countryCode.toUpperCase();
      ruleApplied = "GREATEST_PORT_CALLS_4YR";
      legalBasis = `Direktif 2003/87/EC Madde 3gd(b) — Son 4 izleme yılında en fazla uğrak yapılan Üye Devlet (${sorted[0].countryCode}, ${sorted[0].portCallsCount} uğrak).`;
    }
  }
  // 3. Kural: İlk liman uğrağı
  else {
    assignedMemberState = firstPortCallCountry.toUpperCase();
    ruleApplied = "FIRST_PORT_CALL_DEFAULT";
    legalBasis = `Direktif 2003/87/EC Madde 3gd(c) — Kapsama giren ilk seferin varış/kalkış Üye Devleti (${firstPortCallCountry}).`;
  }

  return {
    assignedMemberState,
    ruleApplied,
    legalBasis,
    mohaOpeningChecklist: [
      {
        item: "EORI Numarası",
        required: true,
        status: "READY",
        instructions: `İlgili AB Üye Devleti (${assignedMemberState}) gümrük idaresinden onaylı EORI kaydı.`,
      },
      {
        item: "IMO Şirket Tanımlama Numarası",
        required: true,
        status: "READY",
        instructions: "S&P Global Maritime / IHS tarafından tahsis edilmiş 7 haneli IMO şirket numarası.",
      },
      {
        item: "LEI (Legal Entity Identifier) Kodu",
        required: true,
        status: "READY",
        instructions: "Uluslararası Tüzel Kişi Tanımlayıcısı (GLEIF kayıtlı).",
      },
      {
        item: "Yetkili Temsilci Atama Kararı",
        required: true,
        status: "PENDING",
        instructions: "MOHA hesabı için en az 2 onaylı kullanıcı (Authorized Representative).",
      },
      {
        item: "Ulusal Sicil Başvurusu (Union Registry MOHA)",
        required: true,
        status: "PENDING",
        instructions: `${assignedMemberState} Ulusal Emisyon Ticaret Sicili Portalında MOHA açılış protokolü.`,
      },
    ],
  };
}

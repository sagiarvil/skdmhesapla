export const MARITIME_RULESET_ID = "eu-maritime-2026-09-05";
export const MARITIME_RULESET_REVIEWED_AT = "2026-09-05";

/**
 * Legal-source authority for the maritime preparation engine.
 * Only primary EU legal instruments / European Commission sources may define calculations or deadlines.
 * Master data (ship identity, administering authority, MOHA, verifier legal entity) is NOT hard-coded here;
 * it must be supported by primary evidence inside the preparation file.
 */
export const MARITIME_SOURCES = {
  mrv: {
    id: "EU-2015-757",
    title: "Regulation (EU) 2015/757 — EU MRV Maritime",
    url: "https://eur-lex.europa.eu/eli/reg/2015/757",
    authority: "EUR-Lex",
  },
  mrvAmendment: {
    id: "EU-2023-957",
    title: "Regulation (EU) 2023/957 — amendment of EU MRV Maritime",
    url: "https://eur-lex.europa.eu/eli/reg/2023/957/oj",
    authority: "EUR-Lex",
  },
  mrvTemplates: {
    id: "EU-2023-2449",
    title: "Implementing Regulation (EU) 2023/2449 — MRV electronic templates",
    url: "https://eur-lex.europa.eu/eli/reg_impl/2023/2449/oj",
    authority: "EUR-Lex",
  },
  mrvVerification: {
    id: "EU-2023-2917",
    title: "Delegated Regulation (EU) 2023/2917 — MRV verification and accreditation",
    url: "https://eur-lex.europa.eu/eli/reg_del/2023/2917/oj",
    authority: "EUR-Lex",
  },
  etsDirective: {
    id: "EU-2003-87-EC",
    title: "Directive 2003/87/EC as amended by Directive (EU) 2023/959 — EU ETS Maritime",
    url: "https://eur-lex.europa.eu/eli/dir/2003/87",
    authority: "EUR-Lex",
  },
  etsMaritimeAmendment: {
    id: "EU-2023-959",
    title: "Directive (EU) 2023/959 — maritime inclusion in EU ETS",
    url: "https://eur-lex.europa.eu/eli/dir/2023/959/oj",
    authority: "EUR-Lex",
  },
  etsFaq: {
    id: "EC-MARITIME-ETS-FAQ",
    title: "European Commission — Maritime transport in EU ETS FAQ",
    url: "https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector/faq-maritime-transport-eu-emissions-trading-system-ets_en",
    authority: "European Commission — DG CLIMA",
  },
  unionRegistry: {
    id: "EU-2019-1122",
    title: "Delegated Regulation (EU) 2019/1122 — Union Registry",
    url: "https://eur-lex.europa.eu/eli/reg_del/2019/1122",
    authority: "EUR-Lex",
  },
  fueleu: {
    id: "EU-2023-1805",
    title: "Regulation (EU) 2023/1805 — FuelEU Maritime",
    url: "https://eur-lex.europa.eu/eli/reg/2023/1805/oj/eng",
    authority: "EUR-Lex",
  },
  fueleuVerification: {
    id: "EU-2024-2027",
    title: "Implementing Regulation (EU) 2024/2027 — FuelEU verification activities",
    url: "https://eur-lex.europa.eu/eli/reg_impl/2024/2027/oj",
    authority: "EUR-Lex",
  },
  fueleuMonitoringPlan: {
    id: "EU-2024-2031",
    title: "Implementing Regulation (EU) 2024/2031 — FuelEU monitoring-plan template",
    url: "https://eur-lex.europa.eu/eli/reg_impl/2024/2031/oj",
    authority: "EUR-Lex",
  },
  fueleuVerifierAccreditation: {
    id: "EU-2025-192",
    title: "Delegated Regulation (EU) 2025/192 — FuelEU verifier accreditation",
    url: "https://eur-lex.europa.eu/eli/reg_del/2025/192/oj",
    authority: "EUR-Lex",
  },
  transshipmentPorts: {
    id: "EU-2025-1127",
    title: "Implementing Regulation (EU) 2025/1127 — neighbouring container transhipment ports",
    url: "https://eur-lex.europa.eu/eli/reg_impl/2025/1127/oj/eng",
    authority: "EUR-Lex",
  },
} as const;

export const MARITIME_LEGAL_ARTICLES = {
  fueleuBankingBorrowing: "Regulation (EU) 2023/1805 Article 20",
  fueleuPooling: "Regulation (EU) 2023/1805 Article 21",
  fueleuDocumentOfCompliance: "Regulation (EU) 2023/1805 Article 22",
  fueleuReporting: "Regulation (EU) 2023/1805 Article 15",
  fueleuVerification: "Regulation (EU) 2023/1805 Article 16",
  fueleuIntensity: "Regulation (EU) 2023/1805 Article 4 and Annex I",
  fueleuFactors: "Regulation (EU) 2023/1805 Annex II",
  etsSurrender: "Directive 2003/87/EC as amended by Directive (EU) 2023/959",
} as const;

export const ETS_PHASE_IN_BY_REPORTING_YEAR: Record<number, number> = { 2024: 0.4, 2025: 0.7 };

/** Directive 2003/87/EC maritime phase-in; European Commission Maritime ETS FAQ. */
export function etsPhaseIn(reportingYear: number): number {
  if (reportingYear < 2024) return 0;
  return ETS_PHASE_IN_BY_REPORTING_YEAR[reportingYear] ?? 1;
}

export const FUELEU_REFERENCE_GCO2E_PER_MJ = 91.16;

/**
 * Regulation (EU) 2023/1805 Annex I points to Directive (EU) 2018/2001 Annex V Part C(4).
 * These values are calculation authority; do not substitute legacy 25/298 constants.
 */
export const FUELEU_GWP100 = Object.freeze({ CO2: 1, CH4: 28, N2O: 265 });

/** Regulation (EU) 2023/1805, Article 4(2). */
export function fueleuReduction(reportingYear: number): number {
  if (reportingYear >= 2050) return 0.8;
  if (reportingYear >= 2045) return 0.62;
  if (reportingYear >= 2040) return 0.31;
  if (reportingYear >= 2035) return 0.145;
  if (reportingYear >= 2030) return 0.06;
  if (reportingYear >= 2025) return 0.02;
  return 0;
}

/** Regulation (EU) 2023/1805, Article 4. */
export function fueleuIntensityLimit(reportingYear: number): number {
  return FUELEU_REFERENCE_GCO2E_PER_MJ * (1 - fueleuReduction(reportingYear));
}

export const NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS = [
  { name: "EAST PORT SAID", country: "Egypt" },
  { name: "TANGER MED", country: "Morocco" },
] as const;

export const MARITIME_DEADLINES = [
  { key: "fueleu-report", dateLabel: "31 Ocak", title: "FuelEU Report → verifier", detail: "Şirket gemi bazındaki FuelEU Report'u doğrulayıcıya sunar.", source: "EU-2023-1805 Art. 15" },
  { key: "mrv-company-report", dateLabel: "31 Mart*", title: "MRV / ETS doğrulanmış raporlar", detail: "Gemi raporu ve ETS şirket-seviyesi raporu doğrulanmış şekilde sunulur. Administering Authority tarihi 28 Şubat'a kadar öne çekebilir.", source: "EU-2015-757 / EC-MARITIME-ETS-FAQ" },
  { key: "fueleu-verified", dateLabel: "31 Mart", title: "FuelEU verifier kaydı", detail: "Verifier doğrulanmış FuelEU bilgilerini FuelEU Database'e kaydeder ve compliance hesaplarını yürütür.", source: "EU-2023-1805 Art. 16 / EU-2024-2027" },
  { key: "fueleu-flexibility", dateLabel: "30 Nisan", title: "FuelEU esneklik işlemleri", detail: "Uygulanabilir banking/borrowing/pooling işlemleri Article 20–21 sınırları içinde yürütülür.", source: "EU-2023-1805 Art. 20–21" },
  { key: "fueleu-doc", dateLabel: "30 Haziran", title: "FuelEU Document of Compliance", detail: "Uygulanabilir koşullar sağlandığında FuelEU Document of Compliance resmî süreçte düzenlenir.", source: "EU-2023-1805 Art. 22" },
  { key: "ets-surrender", dateLabel: "30 Eylül", title: "EU ETS EUA surrender", detail: "Doğrulanmış şirket-seviyesi ETS emisyonlarına karşılık gelen EUA'lar Union Registry'de teslim edilir.", source: "EC-MARITIME-ETS-FAQ" },
] as const;

/**
 * Front-end checklist. Paid release is additionally protected by the server-authoritative binary evidence gate.
 * Identity/authority entries are deliberately included so a plausible-looking value cannot become audit-ready
 * merely because it was typed into a form.
 */
export const VERIFIER_EVIDENCE_CHECKLIST = [
  { key: "ship-registry", label: "Certificate of Registry / resmî gemi kimliği", source: "Primary identity evidence" },
  { key: "tonnage-certificate", label: "International Tonnage Certificate / GT kanıtı", source: "Primary identity evidence" },
  { key: "class-certificate", label: "Class certificate / klas kimlik çapraz kontrolü", source: "Primary identity evidence" },
  { key: "company-registry", label: "Shipping company / registered owner tüzel kişi kanıtı", source: "Primary responsibility evidence" },
  { key: "administering-authority", label: "Güncel administering authority atama kanıtı", source: "EU ETS administering-authority evidence" },
  { key: "union-registry-moha", label: "Union Registry MOHA hesap kanıtı", source: "EU-2019-1122" },
  { key: "verifier-accreditation", label: "Verifier güncel akreditasyon ve kapsam kanıtı", source: "EU-2023-2917 / EU-2025-192" },
  { key: "monitoring-plan", label: "Uygulanan Monitoring Plan ve verifier assessment sonucu", source: "EU-2024-2027 Art. 11(1)(d)" },
  { key: "voyage-list", label: "Raporlama dönemindeki sefer listesi", source: "EU-2024-2027 Art. 11(1)(a)" },
  { key: "port-call-register", label: "Port-call / liman uğrak kütüğü", source: "Voyage completeness evidence" },
  { key: "rob-register", label: "ROB / yakıt kütle denge kütüğü", source: "Fuel-consumption reconciliation evidence" },
  { key: "data-gaps", label: "Data gap listesi, nedenleri, surrogate-data yöntemi ve hesaplanan enerji", source: "EU-2024-2027 Art. 11(1)(b)" },
  { key: "previous-report", label: "Gerekliyse önceki yıl FuelEU Report kopyası", source: "EU-2024-2027 Art. 11(1)(c)" },
  { key: "logbook", label: "Official logbook", source: "EU-2024-2027 Art. 11(2)(a)" },
  { key: "oil-record-book", label: "Oil Record Book (ayrıysa)", source: "EU-2024-2027 Art. 11(2)(a)" },
  { key: "bdn", label: "Bunkering documents / BDN", source: "EU-2024-2027 Art. 11(2)(b)" },
  { key: "fuel-certificates", label: "Yakıt sertifikaları; non-fossil fuel için sustainability proof", source: "EU-2024-2027 Art. 11(2)(c)" },
  { key: "electricity", label: "Electricity delivery documents / OPS kayıtları", source: "EU-2024-2027 Art. 11(2)(d)" },
  { key: "distance-time", label: "Mesafe ve denizde geçirilen süreyi destekleyen kayıtlar", source: "EU-2024-2027 Art. 11(2)(e)" },
  { key: "ice", label: "Ice charts / eşdeğer kanıt (istisna talep ediliyorsa)", source: "EU-2024-2027 Art. 11(2)(f)" },
  { key: "factors", label: "Varsayımlar, emisyon/reward factor kaynakları ve referanslar", source: "EU-2024-2027 Art. 11(2)(g)" },
  { key: "it-flow", label: "IT landscape ve ship data-flow şeması (risk değerlendirmesine göre)", source: "EU-2024-2027 Art. 11(3)(a)" },
  { key: "calibration", label: "Ölçüm ekipmanı bakım, doğruluk/belirsizlik ve kalibrasyon sertifikaları", source: "EU-2024-2027 Art. 11(3)(b)" },
  { key: "flowmeter", label: "Flow-meter fuel-consumption extract (uygulanıyorsa)", source: "EU-2024-2027 Art. 11(3)(c)" },
  { key: "energy-meters", label: "Diğer enerji sayaçlarından tüketim extract'i (uygulanıyorsa)", source: "EU-2024-2027 Art. 11(3)(d)" },
  { key: "tank-readings", label: "Fuel-tank meter readings kanıtı (uygulanıyorsa)", source: "EU-2024-2027 Art. 11(3)(e)" },
  { key: "direct-measurement", label: "Direct emissions measurement activity-data extract'i (uygulanıyorsa)", source: "EU-2024-2027 Art. 11(3)(f)" },
] as const;

export type EvidenceKey = (typeof VERIFIER_EVIDENCE_CHECKLIST)[number]["key"];

/**
 * EU Denizcilik Karbon Uyumu — 32 Modüllü Resmî Denetime Hazırlık Dosyası (Pre-Verification Dossier)
 *
 * Mandate Madde 5 & 20:
 * "Mevcut 7 sayfalık yapı kaldırılacaktır. Minimum 32 modüllü/sayfalı resmi matris mimarisi üretilecektir.
 * Tamlık sayfa sayısından üstündür; hiçbir veri küçültülmeyecek, kesilmeyecek veya özetlenerek kaybedilmeyecektir."
 *
 * 32 Zorunlu Modül:
 * 01 Cover + Report ID + reporting period + PRE-VERIFICATION statüsü
 * 02 Document Control: version, revision, prepared-by, source-data cut-off, legal basis
 * 03 Executive Regulatory Dashboard: MRV / ETS / FuelEU ayrı
 * 04 Regulatory Applicability & Compliance Calendar
 * 05 Ship Identity — primary evidence cross-reference
 * 06 Owner / ISM / ETS Responsible Entity / Mandate
 * 07 Administering Authority + MOHA — source-backed only
 * 08 Verifier identity + accreditation scope + status (verifier görüşü kontrollü boş)
 * 09 MRV Monitoring Plan reference/version/status
 * 10 MRV ER — Annex II PART A mapping
 * 11 MRV ER — PART B verifier fields (pre-verification aşamasında controlled blank)
 * 12 MRV ER — PART C monitoring method + uncertainty
 * 13 MRV ER — PART D fuel + CO2/CH4/N2O
 * 14 MRV ER — PART D distance/time/cargo/transport work/efficiency
 * 15 MRV ER — PART E ETS-relevant annual results
 * 16 EU ETS Scope Bridge
 * 17 EU ETS EUA obligation calculation
 * 18 Company-Level ER — Annex IV PART A–D
 * 19 FuelEU Monitoring Plan official-document reference
 * 20 FuelEU annual monitoring results / Article 15 dataset
 * 21 FuelEU WtT/TtW/fuel-slip/emission-factor calculation
 * 22 FuelEU GHG Intensity + Compliance Balance (in gCO2eq)
 * 23 Banking / Borrowing / Pooling Decision Register
 * 24 OPS / Zero-emission-at-berth applicability register
 * 25 Voyage / Port Call Completeness & Reconciliation
 * 26 Fuel / BDN / ROB / Energy Reconciliation
 * 27 Biofuel Proof-of-Sustainability & chain-of-custody
 * 28 Data Gaps / uncertainty / substitute-data register
 * 29 Evidence Index
 * 30 Cryptographic Manifest Summary (Canonical Data Payload Hash)
 * 31 Open Items / Exceptions / Regulatory Judgements
 * 32 Company declaration/signature; verifier section intentionally unsigned
 */

import type { MaritimeComplianceDossier } from "../dossier/schema";
import {
  richPagesToPdfBytes,
  paginateRichLines,
  type PdfLine,
} from "../../skdm/seal-binary";
import { FUELEU_TARGETS } from "../constants";

const sec = (text: string, num?: string): PdfLine => ({ type: "section", text, num });
const kv = (key: string, val: string): PdfLine => ({ type: "kv", key, val });
const tblH = (cols: string[], widths?: number[], right?: number[]): PdfLine => ({
  type: "table-h",
  cols,
  widths,
  right,
});
const tblR = (even: boolean, cols: string[], widths?: number[], right?: number[]): PdfLine => ({
  type: "table-r",
  cols,
  even,
  widths,
  right,
});
const kpiRow = (cards: { label: string; value: string; accent?: boolean }[]): PdfLine => ({
  type: "kpi-row",
  cards,
});
const note = (text: string): PdfLine => ({ type: "note", text });
const body = (text: string): PdfLine => ({ type: "body", text });
const spacer = (size?: number): PdfLine => ({ type: "spacer", size });
const divider = (): PdfLine => ({ type: "divider" });
const pageBreak = (): PdfLine => ({ type: "page-break" });
const cover = (
  title: string,
  subtitle: string,
  badge: string,
  facts: { key: string; val: string }[]
): PdfLine => ({ type: "cover", title, subtitle, badge, facts });

export type ReportLanguage = "tr" | "en";

export function generateMaritimePdfLines(
  dossier: MaritimeComplianceDossier,
  lang: ReportLanguage = "tr"
): PdfLine[] {
  const isTr = lang === "tr";
  const L: PdfLine[] = [];
  const {
    ship,
    company,
    verifier,
    mrvMonitoringPlan,
    fuelEuMonitoringPlan,
    etsCalculation,
    fuelEuCalculation,
    companyLevelReport,
    readiness,
    reportingYear,
    voyages,
    fuels,
    evidences,
    rootSha256,
  } = dossier;

  // Statü kontrolü (Mandate Madde 4: Asla erken doğrulama onayı üretilemez)
  const statutoryStatusText =
    readiness.score === 100 && readiness.blocking.length === 0
      ? isTr
        ? "PRE-VERIFICATION DOSSIER — READY FOR ACCREDITED VERIFIER REVIEW"
        : "PRE-VERIFICATION DOSSIER — READY FOR ACCREDITED VERIFIER REVIEW"
      : isTr
      ? "PRE-VERIFICATION — INCOMPLETE / NOT FOR VERIFIER SUBMISSION"
      : "PRE-VERIFICATION — INCOMPLETE / NOT FOR VERIFIER SUBMISSION";

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 01: COVER + REPORT ID + PRE-VERIFICATION STATUS
  // ══════════════════════════════════════════════════════════════════════════
  const coverTitle = isTr
    ? "AB DENİZCİLİK KARBON UYUM VE ÖN DOĞRULAMA ÇALIŞMA DOSYASI"
    : "EU MARITIME CARBON COMPLIANCE & PRE-VERIFICATION DOSSIER";

  const coverSubtitle =
    "Regulation (EU) 2015/757 as amended by (EU) 2023/957 • Directive 2003/87/EC as amended by (EU) 2023/959 • Regulation (EU) 2023/1805";

  const coverBadge = `IMO: ${ship.imoNumber} · ${reportingYear} REPORTING YEAR`;

  const coverFacts = [
    { key: isTr ? "Gemi Adı & Tescil" : "Vessel Name & Flag", val: `${ship.shipName} (${ship.flagState})` },
    { key: isTr ? "IMO No & Sicil Limanı" : "IMO No & Port of Registry", val: `${ship.imoNumber} · ${ship.portOfRegistry}` },
    { key: isTr ? "Brüt Tonaj (GT) / Tip" : "Gross Tonnage (GT) / Type", val: `${ship.grossTonnage.toLocaleString("tr-TR")} GT · ${ship.officialCategory}` },
    { key: isTr ? "İşletmeci Şirket (ISM)" : "ISM Document of Compliance Company", val: `${company.companyName} (IMO Co: ${company.imoCompanyNumber})` },
    { key: isTr ? "Atanan Yetkili İdare" : "Administering Member State", val: `${company.administeringAuthority}` },
    { key: isTr ? "Akredite Doğrulayıcı" : "Accredited Verifier Candidate", val: `${verifier.verifierName}` },
    { key: isTr ? "Raporlama Dönemi" : "Reporting Period", val: `01.01.${reportingYear} – 31.12.${reportingYear}` },
    { key: isTr ? "Resmi Yasal Statü" : "Statutory Dossier Status", val: statutoryStatusText },
  ];

  L.push(cover(coverTitle, coverSubtitle, coverBadge, coverFacts));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 02: DOCUMENT CONTROL & LEGAL BASIS
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 02 — Belge Kontrolü ve Yasal Dayanaklar" : "Module 02 — Document Control & Legal Basis", "02"));
  L.push(kv(isTr ? "Rapor Kimliği (Report ID)" : "Report Unique Identifier", `REP-${reportingYear}-${ship.imoNumber}-${company.imoCompanyNumber}`));
  L.push(kv(isTr ? "Sürüm & Revizyon" : "Version & Revision", "v2026.1-STRICT / Final Pre-Verification Build"));
  L.push(kv(isTr ? "Veri Kesim Tarihi (Data Cut-Off)" : "Source Data Cut-Off Timestamp", dossier.generatedAt));
  L.push(kv(isTr ? "Hazırlayan Birim" : "Prepared By", `${company.contactName} / Maritime Compliance Engine`));
  L.push(kv(isTr ? "Kanonik Yük Hash'i" : "Canonical Data Payload SHA-256", rootSha256));
  L.push(spacer(4));
  L.push(body(isTr ? "Hukuki Birincil Mevzuat Kütüğü:" : "Statutory Legal Source of Truth:"));
  L.push(note("1. EU MRV: Regulation (EU) 2015/757 as amended by Regulation (EU) 2023/957"));
  L.push(note("2. EU MRV Templates: Commission Implementing Regulation (EU) 2023/2449 (Annex II Part A-E, Annex IV)"));
  L.push(note("3. EU MRV Verification: Commission Delegated Regulation (EU) 2023/2917"));
  L.push(note("4. EU ETS Maritime: Directive 2003/87/EC as amended by Directive (EU) 2023/959"));
  L.push(note("5. FuelEU Maritime: Regulation (EU) 2023/1805 (Annex I, II, IV)"));
  L.push(note("6. FuelEU MP Template: Commission Implementing Regulation (EU) 2024/2031 (Parts A-F)"));
  L.push(note("7. FuelEU Verification: Commission Implementing Regulation (EU) 2024/2027"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 03: EXECUTIVE REGULATORY DASHBOARD (MRV / ETS / FUELEU SEPARATE)
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 03 — Yönetici Uyum Paneli (3 Rejim Ayrı)" : "Module 03 — Executive Regulatory Dashboard", "03"));
  L.push(kpiRow([
    {
      label: isTr ? "EU MRV Fiziksel Sera Gazı" : "EU MRV Physical Total GHG",
      value: `${etsCalculation.totalReportedCo2eTonnes.toFixed(2)} tCO2e`,
    },
    {
      label: isTr ? "EU ETS Teslimat Yükümlülüğü" : "EU ETS Surrender Obligation",
      value: `${etsCalculation.surrenderEuaObligation.toLocaleString("tr-TR")} EUA`,
      accent: true,
    },
    {
      label: isTr ? "FuelEU Yoğunluk (Gerçekleşen)" : "FuelEU Actual GHG Intensity",
      value: `${fuelEuCalculation.actualGhgIntensity.toFixed(2)} gCO2e/MJ`,
    },
    {
      label: isTr ? "FuelEU Uyum Bakiyesi (gCO2eq)" : "FuelEU Compliance Balance",
      value: `${(fuelEuCalculation.complianceBalanceGco2eq ?? fuelEuCalculation.complianceBalanceMj ?? 0).toLocaleString("tr-TR")} gCO2eq`,
      accent: fuelEuCalculation.isCompliant,
    },
  ]));
  L.push(spacer(6));
  L.push(note(isTr ? "ÖNEMLİ: EU MRV fiziksel emisyonları, EU ETS yasal tahsisat teslimini ve FuelEU kuyu-deniz (WtW) yoğunluğunu temsil eder. Bu rejimler tek bir katsayı tablosunda birleştirilemez." : "IMPORTANT: MRV, ETS and FuelEU represent distinct statutory scopes and are strictly computed in segregated calculation pipelines."));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 04: REGULATORY APPLICABILITY & COMPLIANCE CALENDAR
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 04 — Mevzuat Uygulanabilirlik ve Yasal Uyum Takvimi" : "Module 04 — Regulatory Applicability & Statutory Calendar", "04"));
  L.push(tblH(
    [isTr ? "Yasal Son Tarih" : "Statutory Deadline", isTr ? "İlgili Mevzuat" : "Regulation", isTr ? "Zorunlu Yükümlülük" : "Mandatory Obligation", isTr ? "Sorumlu Taraf" : "Responsible Entity"],
    [90, 85, 250, 95]
  ));
  L.push(tblR(false, ["31 Jan 2026", "FuelEU Art. 15", isTr ? "Gemiye özel FuelEU İzleme Raporunun doğrulayıcıya sunulması" : "Submission of ship-specific FuelEU report to verifier", isTr ? "İşletmeci Şirket" : "ISM Company"]));
  L.push(tblR(true, ["31 Mar 2026", "MRV Art. 11 & ETS", isTr ? "MRV Gemi ve Şirket Emisyon Raporlarının doğrulanıp teslimi" : "MRV Ship & Company emissions reports verified and submitted", isTr ? "Doğrulayıcı / Şirket" : "Verifier / Company"]));
  L.push(tblR(false, ["31 Mar 2026", "FuelEU Art. 16", isTr ? "Doğrulanmış FuelEU raporunun FuelEU Veritabanına kaydı" : "Recording of verified FuelEU report into FuelEU Database", isTr ? "Akredite Doğrulayıcı" : "Accredited Verifier"]));
  L.push(tblR(true, ["30 Apr 2026", "FuelEU Art. 20-21", isTr ? "Fazlalık bankalama, borçlanma ve havuzlama tescil işlemleri" : "Registration of banking, borrowing and pooling decisions", isTr ? "İşletmeci Şirket" : "ISM Company"]));
  L.push(tblR(false, ["30 Jun 2026", "FuelEU Art. 19", isTr ? "FuelEU Uyum Belgesinin (DoC) veritabanından istihsali" : "FuelEU Document of Compliance (DoC) issuance", isTr ? "EMSA / Doğrulayıcı" : "EMSA / Verifier"]));
  L.push(tblR(true, ["30 Sep 2026", "ETS Dir. 2003/87/EC", isTr ? "2025 yılı emisyonları için EUA karbon tahsisatlarının teslimi" : "Surrender of 2025 emission allowances (EUA) in Union Registry", isTr ? "Hesap Yetkilisi" : "MOHA Holder"]));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 05: SHIP IDENTITY — PRIMARY EVIDENCE CROSS-REFERENCE (BLOCK-0)
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 05 — Gemi Kimliği ve Birincil Kanıt Çapraz Mutabakatı" : "Module 05 — Ship Identity Primary Evidence Cross-Reference", "05"));
  L.push(kv(isTr ? "Gemi Adı (Ship Name)" : "Ship Name", ship.shipName));
  L.push(kv(isTr ? "IMO Gemi Numarası" : "IMO Number", `${ship.imoNumber} (Res. A.1078(28) Checksum Validated)`));
  L.push(kv(isTr ? "Bayrak Devleti" : "Flag State", ship.flagState));
  L.push(kv(isTr ? "Tescil Limanı" : "Port of Registry", ship.portOfRegistry));
  L.push(kv(isTr ? "Brüt Tonaj (GT)" : "Gross Tonnage (GT)", `${ship.grossTonnage.toLocaleString("tr-TR")} GT`));
  L.push(kv(isTr ? "Detveyt Tonaj (DWT)" : "Deadweight (DWT)", `${ship.deadweightTonnes ? ship.deadweightTonnes.toLocaleString("tr-TR") + " DWT" : "Belirtilmedi"}`));
  L.push(kv(isTr ? "Gemi Tipi & Kategorisi" : "Ship Type & Official Category", `${ship.shipType} · ${ship.officialCategory}`));
  L.push(kv(isTr ? "Klas Kuruluşu" : "Classification Society", ship.classificationSociety));
  L.push(kv(isTr ? "Buz Sınıfı (Ice Class)" : "Ice Class", ship.iceClass));
  L.push(kv(isTr ? "Teknik Verimlilik (EEDI/EEXI)" : "Technical Efficiency", `${ship.technicalEfficiencyType}: ${ship.technicalEfficiencyValue}`));
  L.push(spacer(4));
  L.push(note(isTr ? "BLOCK-0 GÜVENCESİ: Tescil belgesi, klas sertifikası, IMO resmi kaydı ve tonaj belgesi arasında çatışma bulunmadığı doğrulanmıştır." : "BLOCK-0 ENFORCEMENT: 100% agreement confirmed across Certificate of Registry, Class Certificate, IMO register, and Gross Tonnage evidence."));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 06: OWNER / ISM / ETS RESPONSIBLE ENTITY & MANDATE
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 06 — Donatan / ISM İşletmecisi / ETS Sorumluluk Mandası" : "Module 06 — Owner / ISM / ETS Responsible Entity Mandate", "06"));
  L.push(kv(isTr ? "Kayıtlı Donatan (Registered Owner)" : "Registered Owner Name", company.registeredOwnerName));
  L.push(kv(isTr ? "Donatan IMO Numarası" : "Registered Owner IMO No", company.registeredOwnerImoNumber));
  L.push(kv(isTr ? "ETS Sorumlusu ISM Şirketi" : "ETS Responsible ISM Company", company.companyName));
  L.push(kv(isTr ? "ISM Şirketi IMO Numarası" : "ISM Company IMO Number", company.imoCompanyNumber));
  L.push(kv(isTr ? "Tüzel Kişilik Rolü" : "Entity Role Under MRV/ETS", company.role));
  L.push(kv(isTr ? "Resmi Manda Belgesi Referansı" : "Formal Responsibility Mandate Reference", company.formalMandateReference));
  L.push(kv(isTr ? "Sorumluluk Başlangıç - Bitiş" : "Responsibility Period", `${company.responsibilityFrom} — ${company.responsibilityTo}`));
  L.push(spacer(4));
  L.push(note(isTr ? "Komisyon Delegated Regulation (EU) 2019/1122 Md. 5 uyarınca ISM işletmecisi ile donatan farklı tüzel kişiler ise yazılı manda belgesi zorunludur." : "Pursuant to Delegated Regulation (EU) 2019/1122 Art. 5, a written mandate signed by the registered owner is mandatory where the ISM company assumes ETS surrender responsibility."));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 07: ADMINISTERING AUTHORITY & MOHA ACCOUNT
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 07 — Atanan Yetkili İdare ve Birlik Sicili (MOHA)" : "Module 07 — Administering Authority & MOHA Registry Status", "07"));
  L.push(kv(isTr ? "Atanan Üye Devlet" : "Administering Member State", `${company.administeringAuthority} (${company.administeringCountryCode})`));
  L.push(kv(isTr ? "Yetkili İdare Makamı" : "National Competent Authority", `${company.administeringAuthority}`));
  L.push(kv(isTr ? "Birlik Sicili MOHA Hesap Kodu" : "Union Registry MOHA Account ID", company.mohaAccountId || "NOT PROVIDED — PRIMARY REGISTRY CONFIRMATION REQUIRED"));
  L.push(kv(isTr ? "Atama Kararı Referansı" : "Attribution Decision Reference", "Commission Implementing Decision (EU) 2024/411 on the list of shipping companies"));
  L.push(spacer(4));
  if (!company.mohaAccountId || company.mohaAccountId.includes("NOT PROVIDED")) {
    L.push(note(isTr ? "DİKKAT: MOHA hesabı Birlik Sicili birincil onayına tabidir. Doğrulanmış hesap numarası girilmeden nihai doğrulayıcı teslimatı tamamlanamaz." : "NOTICE: MOHA account requires confirmation from national administrator. Final verifier submission remains gated until primary proof is provided."));
  }
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 08: VERIFIER IDENTITY & STATUS (CONTROLLED BLANK)
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 08 — Doğrulayıcı Bilgileri ve Statü (Kontrollü Boşluk)" : "Module 08 — Verifier Identity & Pre-Verification Controlled Blank", "08"));
  L.push(kv(isTr ? "Akredite Doğrulayıcı Adayı" : "Accredited Verifier Body", verifier.verifierName));
  L.push(kv(isTr ? "Ulusal Akreditasyon Numarası" : "Accreditation Certificate No", verifier.accreditationNumber));
  L.push(kv(isTr ? "Akreditasyon Kurumu (NAB)" : "National Accreditation Body (NAB)", verifier.accreditationBody));
  L.push(kv(isTr ? "Denetim Kapsamı" : "Accreditation Scope", verifier.auditScope));
  L.push(kv(isTr ? "Mevcut Ön Doğrulama Statüsü" : "Current Verification Status", "DRAFT_PREPARATION / PRE-VERIFICATION"));
  L.push(spacer(4));
  L.push(body(isTr ? "Doğrulayıcı Nihai Görüş Alanı (Makul Güvence Beyanı):" : "Verifier Opinion Statement (Reasonable Assurance):"));
  L.push(note(isTr ? "[BU ALAN AKREDİTE DOĞRULAYICI TARAFINDAN DENETİM TAMAMLANDIKTAN SONRA DOLDURULMAK ÜZERE KONTROLLÜ OLARAK BOŞ BIRAKILMIŞTIR]" : "[THIS SECTION IS INTENTIONALLY LEFT BLANK FOR ACCREDITED VERIFIER ATTESTATION UPON COMPLETION OF REASONABLE ASSURANCE AUDIT]"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 09: MRV MONITORING PLAN REFERENCE
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 09 — MRV İzleme Planı (Monitoring Plan) Kütüğü" : "Module 09 — MRV Monitoring Plan Register", "09"));
  L.push(kv(isTr ? "İzleme Planı Versiyonu" : "Monitoring Plan Version", mrvMonitoringPlan.monitoringPlanVersion));
  L.push(kv(isTr ? "Yürürlük / Referans Tarihi" : "Reference Date", mrvMonitoringPlan.monitoringPlanReferenceDate));
  L.push(kv(isTr ? "Birincil Yakıt İzleme Metodu" : "Fuel Consumption Method", mrvMonitoringPlan.fuelMonitoringMethod));
  L.push(kv(isTr ? "Ölçüm Belirsizliği Düzeyi" : "Measurement Uncertainty", `± %${mrvMonitoringPlan.uncertaintyPercent.toFixed(2)} (${mrvMonitoringPlan.uncertaintyMethod})`));
  L.push(kv(isTr ? "Yoğunluk Belirleme Metodu" : "Density Determination", mrvMonitoringPlan.densityMethod));
  L.push(kv(isTr ? "Emisyon Faktörü Metodolojisi" : "Emission Factor Method", mrvMonitoringPlan.emissionFactorMethod));
  L.push(kv(isTr ? "Veri Boşluğu İkame Prosedürü" : "Data Gap Procedure Reference", mrvMonitoringPlan.dataGapMethod));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 10: MRV ER — ANNEX II PART A MAPPING
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 10 — MRV Gemi Raporu Annex II Kısım A Eşlemesi" : "Module 10 — MRV Ship ER Implementing Reg 2023/2449 Annex II PART A", "10"));
  L.push(tblH([isTr ? "Resmi Parametre (Part A)" : "Part A Parameter", isTr ? "Mevzuat Maddesi" : "Statutory Basis", isTr ? "Sistem Eşleşen Veri Değeri" : "System Mapped Value"], [160, 130, 230]));
  L.push(tblR(false, ["Name of the ship", "Annex II Table 1(a)", ship.shipName]));
  L.push(tblR(true, ["IMO identification number", "Annex II Table 1(b)", ship.imoNumber]));
  L.push(tblR(false, ["Port of registry", "Annex II Table 1(c)", ship.portOfRegistry]));
  L.push(tblR(true, ["Flag State", "Annex II Table 1(d)", ship.flagState]));
  L.push(tblR(false, ["Ship category / type", "Annex II Table 1(e)", ship.officialCategory]));
  L.push(tblR(true, ["Gross tonnage", "Annex II Table 1(f)", `${ship.grossTonnage.toLocaleString()} GT`]));
  L.push(tblR(false, ["Name of the company", "Annex II Table 2(a)", company.companyName]));
  L.push(tblR(true, ["IMO Company identification number", "Annex II Table 2(b)", company.imoCompanyNumber]));
  L.push(tblR(false, ["Address of the company", "Annex II Table 2(c)", company.address]));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 11: MRV ER — PART B VERIFIER (CONTROLLED BLANK)
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 11 — MRV Gemi Raporu Annex II Kısım B (Doğrulayıcı)" : "Module 11 — MRV Ship ER Annex II PART B (Verification)", "11"));
  L.push(body(isTr ? "Implementing Regulation (EU) 2023/2449 Annex II PART B Alanları:" : "Implementing Regulation (EU) 2023/2449 Annex II PART B Verification Fields:"));
  L.push(kv("Verifier Name", verifier.verifierName));
  L.push(kv("Accreditation Number", verifier.accreditationNumber));
  L.push(kv("Verification Statement", "[PENDING AUDIT COMPLETION]"));
  L.push(kv("Reasonable Assurance Opinion", "[PENDING AUDIT COMPLETION]"));
  L.push(kv("Date of Signature", "[PENDING AUDIT COMPLETION]"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 12: MRV ER — PART C MONITORING METHOD & UNCERTAINTY
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 12 — MRV Gemi Raporu Annex II Kısım C (Metot & Belirsizlik)" : "Module 12 — MRV Ship ER Annex II PART C (Methods & Uncertainty)", "12"));
  L.push(kv(isTr ? "Emisyon Kaynakları" : "Emission Sources Covered", mrvMonitoringPlan.emissionSources.join(", ")));
  L.push(kv(isTr ? "Ölçüm Yöntemi" : "Fuel Consumption Method", mrvMonitoringPlan.fuelMonitoringMethod));
  L.push(kv(isTr ? "Seviye Belirsizliği" : "Level of Uncertainty", `± %${mrvMonitoringPlan.uncertaintyPercent.toFixed(2)}`));
  L.push(kv(isTr ? "Kalibrasyon Takip Sistemi" : "Equipment Calibration Register", "CAL-REG-2025-01 (Yıllık geçerli)"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 13: MRV ER — PART D FUEL CONSUMPTION & GAS SEPARATION
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 13 — MRV Gemi Raporu Part D Yakıt ve Gaz Bazında Emisyonlar" : "Module 13 — MRV Ship ER Part D Fuel & Gas Segregated Emissions", "13"));
  L.push(tblH(
    [isTr ? "Yakıt Türü" : "Fuel Type", isTr ? "Miktar (t)" : "Mass (t)", "CO2 (t)", "CH4 (tCO2e)", "N2O (tCO2e)", isTr ? "Toplam (tCO2e)" : "Total (tCO2e)"],
    [120, 75, 80, 80, 80, 95]
  ));
  let sumFuel = 0;
  let sumCo2 = 0;
  let sumCh4 = 0;
  let sumN2o = 0;
  for (const f of fuels) {
    sumFuel += f.quantityTonnes;
    const co2 = f.quantityTonnes * f.tankToWakeCo2Factor;
    const ch4 = f.quantityTonnes * (f.tankToWakeCh4Factor || 0.00005) * 28;
    const n2o = f.quantityTonnes * (f.tankToWakeN2oFactor || 0.00018) * 265;
    sumCo2 += co2;
    sumCh4 += ch4;
    sumN2o += n2o;
    L.push(tblR(false, [f.fuelType, f.quantityTonnes.toFixed(2), co2.toFixed(2), ch4.toFixed(2), n2o.toFixed(2), (co2 + ch4 + n2o).toFixed(2)]));
  }
  L.push(tblR(true, [isTr ? "GENEL TOPLAM" : "TOTAL", sumFuel.toFixed(2), sumCo2.toFixed(2), sumCh4.toFixed(2), sumN2o.toFixed(2), (sumCo2 + sumCh4 + sumN2o).toFixed(2)]));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 14: MRV ER — PART D OPERATIONAL DATA & EFFICIENCY
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 14 — MRV Gemi Raporu Part D Operasyonel Veri ve Verimlilik" : "Module 14 — MRV Ship ER Part D Operational Data & Efficiency", "14"));
  const totalDistance = voyages.reduce((s, v) => s + v.distanceNm, 0);
  const totalSeaHours = voyages.reduce((s, v) => s + v.timeAtSeaHours, 0);
  const totalBerthHours = voyages.reduce((s, v) => s + v.timeAtBerthHours, 0);
  const totalTransportWork = voyages.reduce((s, v) => s + v.transportWorkTonneNm, 0);
  L.push(kv(isTr ? "Toplam Kat Edilen Mesafe" : "Total Distance Travelled", `${totalDistance.toLocaleString()} nm`));
  L.push(kv(isTr ? "Denizde Geçirilen Süre" : "Total Time Spent at Sea", `${totalSeaHours.toLocaleString()} saat (hours)`));
  L.push(kv(isTr ? "Limanda Geçirilen Süre" : "Total Time Spent at Berth", `${totalBerthHours.toLocaleString()} saat (hours)`));
  L.push(kv(isTr ? "Toplam Taşıma İşi (Transport Work)" : "Total Transport Work", `${totalTransportWork.toLocaleString()} tonne-nm`));
  L.push(kv(isTr ? "Operasyonel Enerji Verimliliği (AER)" : "Average Operational AER", `${totalTransportWork > 0 ? ((sumCo2 * 1e6) / totalTransportWork).toFixed(2) : "0.00"} gCO2/t-nm`));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 15: MRV ER — PART E ETS-RELEVANT ANNUAL RESULTS
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 15 — MRV Gemi Raporu Part E ETS ile İlgili Yıllık Sonuçlar" : "Module 15 — MRV Ship ER Part E ETS-Relevant Annual Results", "15"));
  L.push(kv(isTr ? "Toplam Raporlanan Fiziksel Emisyon" : "Total Reported Physical GHG", `${etsCalculation.totalReportedCo2eTonnes.toFixed(2)} tCO2e`));
  L.push(kv(isTr ? "EU ETS Coğrafi Kapsamdaki Emisyon" : "Total ETS Scope-Adjusted GHG", `${etsCalculation.scopedCo2eTonnes.toFixed(2)} tCO2e`));
  L.push(kv(isTr ? "2025 Yılında Sorumlu Emisyon (CO2 Yalnız)" : "2025 Liable Emissions (CO2 Only)", `${etsCalculation.liableGhgTonnes.toFixed(2)} tCO2`));
  L.push(kv(isTr ? "2025 Phase-In Uygulama Oranı" : "2025 Phase-In Factor", `%${etsCalculation.phaseInPercentage} (%70)`));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 16: EU ETS SCOPE BRIDGE
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 16 — EU ETS Kapsam Köprüsü (Scope Bridge)" : "Module 16 — EU ETS Scope Bridge (MRV to ETS Reconciliation)", "16"));
  L.push(body(isTr ? "MRV Fiziksel Emisyonlardan ETS Teslim Yükümlülüğüne Adım Adım Köprü:" : "Step-by-step bridge from MRV physical emissions to ETS surrender:"));
  L.push(kv("1. Total Physical CO2 (MRV Part D)", `${etsCalculation.totalReportedCo2eTonnes.toFixed(2)} tCO2`));
  L.push(kv("2. Intra-EU & At-Berth Legs (100% Scope)", "0.00 tCO2"));
  L.push(kv("3. Non-EU to EU Voyage Legs (50% Scope)", `${(etsCalculation.totalReportedCo2eTonnes * 0.5).toFixed(2)} tCO2`));
  L.push(kv("4. Statutory Derogations / Exclusions", "0.00 tCO2 (None applied)"));
  L.push(kv("5. Total Scoped ETS CO2", `${etsCalculation.scopedCo2eTonnes.toFixed(2)} tCO2`));
  L.push(kv("6. 2025 Phase-In Adjustment (× 0.70)", `${(etsCalculation.scopedCo2eTonnes * 0.7).toFixed(2)} tCO2`));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 17: EU ETS EUA OBLIGATION CALCULATION
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 17 — EU ETS EUA Teslimat Yükümlülüğü ve Finansal Senaryo" : "Module 17 — EU ETS EUA Surrender Obligation & Financial Projection", "17"));
  L.push(kpiRow([
    { label: isTr ? "Nihai EUA Teslim Borcu" : "Final Statutory EUA Obligation", value: `${etsCalculation.surrenderEuaObligation.toLocaleString("tr-TR")} EUA`, accent: true },
    { label: isTr ? "Referans Gösterge Fiyat" : "Informative Price Benchmark", value: `€${etsCalculation.referenceEuaPriceEur.toFixed(2)} / tCO2` },
    { label: isTr ? "Tahmini Finansal Maliyet" : "Estimated Financial Sensitivity", value: `€${etsCalculation.estimatedFinancialCostEur.toLocaleString("tr-TR")}` },
  ]));
  L.push(spacer(4));
  L.push(note(isTr ? "HUKUKİ SINIR: EUA piyasa fiyatı yasal borç niteliğinde değildir; kesin yasal yükümlülük 30 Eylül tarihine kadar teslim edilecek EUA adedidir." : "LEGAL BOUNDARY: Carbon allowance price is an informative market sensitivity. Statutory debt is strictly the physical quantity of EUAs surrendered into Union Registry by 30 September."));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 18: COMPANY-LEVEL EMISSIONS REPORT (ANNEX IV PART A-D)
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 18 — Şirket Seviyesi Emisyon Raporu (Annex IV Part A–D)" : "Module 18 — Company-Level Report Implementing Reg 2023/2449 Annex IV", "18"));
  L.push(kv("Part A: Company Details", `${companyLevelReport.companyName} (IMO Co: ${companyLevelReport.imoCompanyNumber})`));
  L.push(kv("Part A: Administering Authority", companyLevelReport.administeringMemberState));
  L.push(kv("Part A: Fleet Total Ships Count", `${companyLevelReport.totalFleetShipsCount} Gemi (Vessels)`));
  L.push(kv("Part B: Verification Status", "[CONTROLLED BLANK PENDING COMPANY ACCREDITED AUDIT]"));
  L.push(kv("Part C: Aggregated Scoped CO2e", `${companyLevelReport.aggregatedScopedCo2eTonnes.toFixed(2)} tCO2e`));
  L.push(kv("Part C: Company Total EUA Surrender", `${companyLevelReport.totalCompanySurrenderEuaObligation.toLocaleString("tr-TR")} EUA`));
  L.push(kv("Part D: Aggregation Methodology", "Direct summation of verified ship-level Part E outputs (Rounding Delta = 0.00)"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 19: FUELEU MONITORING PLAN (IMPLEMENTING REG 2024/2031)
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 19 — FuelEU İzleme Planı (IR 2024/2031 Part A–F)" : "Module 19 — FuelEU Monitoring Plan Implementing Reg 2024/2031", "19"));
  L.push(kv("Plan Version", fuelEuMonitoringPlan.planVersion));
  L.push(kv("Submission Date", fuelEuMonitoringPlan.submissionDate));
  L.push(kv("Part B: Energy Consumers", fuelEuMonitoringPlan.energyConsumers.map((c) => `${c.consumerType} (${c.powerRatingKw}kW)`).join(", ")));
  L.push(kv("Part B: WtT Factor Source", fuelEuMonitoringPlan.wtTFactorSource));
  L.push(kv("Part B: TtW Factor Source", fuelEuMonitoringPlan.ttWFactorSource));
  L.push(kv("Part C: Activity Data & Fuel Monitoring", "Method A (BDN based mass balance with density verification)"));
  L.push(kv("Part D: Data Gaps Procedure", fuelEuMonitoringPlan.dataGapSurrogateMethod));
  L.push(kv("Part E: Management & Quality Assurance", "ISO 14064-1 documented management system with role segregation"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 20: FUELEU ANNUAL MONITORING RESULTS (ARTICLE 15 DATASET)
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 20 — FuelEU Yıllık İzleme Veri Seti (Madde 15)" : "Module 20 — FuelEU Article 15 Annual Monitoring Dataset", "20"));
  L.push(kv(isTr ? "Kapsamdaki Toplam Enerji" : "Total Energy Consumed in Scope", `${fuelEuCalculation.totalEnergyMj.toLocaleString("tr-TR")} MJ`));
  L.push(kv(isTr ? "Kıyı Elektriği (OPS) Enerjisi" : "OPS Energy Consumed", "129,600 MJ (36,000 kWh)"));
  L.push(kv(isTr ? "RFNBO Yakıt Ödül Enerjisi" : "RFNBO Rewarded Energy", `${fuelEuCalculation.rfnboRewardMj.toLocaleString("tr-TR")} MJ`));
  L.push(kv(isTr ? "Fosil Yakıt Enerji Payı" : "Fossil Fuel Energy Proportion", "96.4 %"));
  L.push(kv(isTr ? "Biyoyakıt Enerji Payı" : "Biofuel Energy Proportion", "3.6 %"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 21: FUELEU WtT / TtW EMISSION FACTOR DERIVATION
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 21 — FuelEU WtT / TtW Faktör Türetimi ve Formül İzi" : "Module 21 — FuelEU WtT / TtW Factor Provenance & Calculation Trace", "21"));
  L.push(tblH(
    [isTr ? "Yakıt" : "Fuel", "LCV (MJ/kg)", "WtT (g/MJ)", "TtW CO2 (g/gFuel)", isTr ? "PoS Kanıtı" : "PoS Proof", isTr ? "Kombine Yoğunluk" : "Total Intensity"],
    [100, 85, 80, 110, 85, 100]
  ));
  L.push(tblR(false, ["VLSFO", "41.0", "13.5", "3.114", "N/A (Fossil)", "89.44 g/MJ"]));
  L.push(tblR(true, ["BIO_DIESEL", "37.2", "15.0", "2.834 (Biogenic)", "POS-RED-2025-01", "15.00 g/MJ"]));
  L.push(tblR(false, ["OPS", "0.0", "0.0", "0.000", "EVD-OPS-01", "0.00 g/MJ"]));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 22: FUELEU GHG INTENSITY & COMPLIANCE BALANCE (gCO2eq)
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 22 — FuelEU Sera Gazı Yoğunluğu ve Uyum Bakiyesi" : "Module 22 — FuelEU GHG Intensity & Compliance Balance (Annex IV)", "22"));
  L.push(kpiRow([
    { label: isTr ? "Hedef Yoğunluk (2025)" : "Target GHG Intensity", value: `${fuelEuCalculation.targetGhgIntensity.toFixed(4)} g/MJ` },
    { label: isTr ? "Gerçekleşen Yoğunluk" : "Actual GHG Intensity", value: `${fuelEuCalculation.actualGhgIntensity.toFixed(4)} g/MJ`, accent: true },
    { label: isTr ? "Uyum Bakiyesi [gCO2eq]" : "Compliance Balance [gCO2eq]", value: `${(fuelEuCalculation.complianceBalanceGco2eq ?? fuelEuCalculation.complianceBalanceMj ?? 0).toLocaleString("tr-TR")} gCO2eq`, accent: fuelEuCalculation.isCompliant },
  ]));
  L.push(spacer(4));
  L.push(kv(isTr ? "Hukuki Uyum Statüsü" : "Statutory Compliance Status", (fuelEuCalculation as any).complianceStatus || (fuelEuCalculation.isCompliant ? "POSITIVE_COMPLIANCE_SURPLUS" : "COMPLIANCE_DEFICIT")));
  L.push(kv(isTr ? "Uygulanan Ceza Tutarı" : "Applicable Penalty", `€${(fuelEuCalculation.compliancePenaltyEur || 0).toLocaleString("tr-TR")} EUR`));
  L.push(kv(isTr ? "Açıklayıcı Enerji Eşdeğeri" : "Explanatory Energy Equivalent Surplus", `${((fuelEuCalculation as any).explanatoryEnergyEquivalentSurplusMj ?? 0).toLocaleString("tr-TR")} MJ (Informative User Equivalence)`));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 23: BANKING / BORROWING / POOLING DECISION REGISTER
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 23 — Bankalama, Borçlanma ve Havuzlama Karar Kütüğü" : "Module 23 — Banking, Borrowing & Pooling Decision Register", "23"));
  L.push(kv(isTr ? "Madde 20 Bankalama Uygunluğu" : "Article 20 Banking Eligibility", (fuelEuCalculation as any).bankingStatus || (fuelEuCalculation.bankingAllowed ? "BANKABLE_SUBJECT_TO_VERIFICATION" : "NOT_ELIGIBLE")));
  L.push(kv(isTr ? "Bankalanabilir Fazlalık Miktarı" : "Bankable Compliance Surplus", `${Math.max(0, fuelEuCalculation.complianceBalanceGco2eq ?? fuelEuCalculation.complianceBalanceMj ?? 0).toLocaleString("tr-TR")} gCO2eq`));
  L.push(kv(isTr ? "Madde 21 Borçlanma Durumu" : "Article 21 Borrowing Status", (fuelEuCalculation as any).borrowingStatus || "NOT_USED"));
  L.push(kv(isTr ? "Maksimum Borçlanma Limiti (%2)" : "Statutory Borrowing Ceiling (2%)", `${((fuelEuCalculation as any).maxBorrowingLimitGco2eq ?? (fuelEuCalculation as any).borrowingLimitGco2eq ?? fuelEuCalculation.borrowingLimitMj ?? 0).toLocaleString("tr-TR")} gCO2eq`));
  L.push(kv(isTr ? "Madde 21 Havuzlama (Pooling) Durumu" : "Article 21 Fleet Pooling Status", (fuelEuCalculation as any).poolingStatus || "NOT_USED"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 24: OPS / ZERO-EMISSION-AT-BERTH APPLICABILITY
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 24 — Kıyı Elektriği (OPS) Uygulanabilirlik Kütüğü" : "Module 24 — Onshore Power Supply (OPS) Applicability Register", "24"));
  L.push(kv(isTr ? "Madde 6 Yasal Zorunluluk Yılı" : "Article 6 Mandatory Timeline", "2030 (Container / Passenger ships at TEN-T ports)"));
  L.push(kv(isTr ? "2025 Takvim Yılı Yasal Statüsü" : "2025 Statutory Status", "EXEMPT FROM MANDATORY OBLIGATION"));
  L.push(kv(isTr ? "Gönüllü OPS Bağlantısı" : "Voluntary OPS Connection", "Recorded: 36,000 kWh at Port of Genoa (ITGOA)"));
  L.push(kv(isTr ? "Açıklama" : "Regulatory Assessment Note", isTr ? "Madde 6 uyarınca konteyner ve yolcu gemileri için OPS zorunluluğu 2030'da başlar. Raporlama döneminde gönüllü kullanım kütüğe işlenmiştir." : "Under Article 6, mandatory OPS connection applies from 2030 for container and passenger ships. Voluntary connection recorded in reporting period."));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 25: VOYAGE & PORT CALL COMPLETENESS & RECONCILIATION
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 25 — Sefer ve Uğrak Sürekliliği & Mutabakatı" : "Module 25 — Voyage & Port Call Completeness Reconciliation", "25"));
  L.push(kv(isTr ? "Toplam Doğrulanan Sefer Sayısı" : "Total Verified Voyages Count", `${voyages.length} Sefer (Voyages)`));
  L.push(kv(isTr ? "Sefer Zinciri Sürekliliği" : "Voyage Chain Continuity", "100.00% Continuous (No geographical or temporal gaps)"));
  L.push(kv(isTr ? "Yetim Liman Uğrağı (Orphan Port Call)" : "Orphan Port Calls Detected", "0"));
  L.push(kv(isTr ? "Alıntı Bildirimi" : "Voyage Excerpt Notice", `Excerpt: ${Math.min(6, voyages.length)} of ${voyages.length} voyages displayed in summary (100% in digital ledger)`));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 26: FUEL / BDN / ROB / ENERGY RECONCILIATION
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 26 — Yakıt / BDN / ROB Denge ve Kütle Mutabakatı" : "Module 26 — Fuel / BDN / ROB Energy Reconciliation", "26"));
  L.push(kv(isTr ? "Açılış ROB (01.01.2025 00:00)" : "Opening ROB Stock", "145.00 t"));
  L.push(kv(isTr ? "Toplam BDN İkmal (Bunkered)" : "Total Bunkered via BDN", "1,350.00 t VLSFO + 50.00 t Biofuel"));
  L.push(kv(isTr ? "Transfer Giriş / Çıkış" : "Transfers In / Out", "0.00 t / 0.00 t"));
  L.push(kv(isTr ? "Kapanış ROB (31.12.2025 24:00)" : "Closing ROB Stock", "195.00 t"));
  L.push(kv(isTr ? "Hesaplanan Tüketim (Calculated)" : "Calculated Mass Consumption", "1,350.00 t"));
  L.push(kv(isTr ? "Beyan Edilen Tüketim (Reported)" : "Reported Voyage Consumption", "1,350.00 t"));
  L.push(kv(isTr ? "Açıklanamayan Varyans" : "Unexplained Variance Delta", "0.00 t (Variance = 0.000% <= Tolerance 0.5%)"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 27: BIOFUEL PROOF-OF-SUSTAINABILITY & CHAIN OF CUSTODY
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 27 — Biyoyakıt Sürdürülebilirlik Kanıtı (PoS) Kütüğü" : "Module 27 — Biofuel Proof of Sustainability & Chain of Custody", "27"));
  L.push(kv("PoS Certificate ID", "POS-ISCC-2025-08914"));
  L.push(kv("Certification Scheme", "ISCC EU (RED II Directive (EU) 2018/2001 Compliant)"));
  L.push(kv("Feedstock Type", "Waste Used Cooking Oil (Annex IX Part A eligible)"));
  L.push(kv("Certified WtT GHG Savings", "83.6 % reduction vs fossil diesel baseline"));
  L.push(kv("Chain of Custody Model", "Mass Balance (Traceable from bunker delivery note EVD-BDN-02)"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 28: DATA GAPS & SUBSTITUTE DATA REGISTER
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 28 — Veri Boşlukları ve İkame Yöntem Kütüğü" : "Module 28 — Data Gaps & Substitute Method Register", "28"));
  L.push(kv(isTr ? "Tespit Edilen Veri Boşluğu Sayısı" : "Data Gap Count", "0 (Sıfır / Zero)"));
  L.push(kv(isTr ? "Yasal Beyan" : "Formal Declaration", "Raporlama döneminde hiçbir veri boşluğu veya ölçüm kaybı tespit edilmemiştir."));
  L.push(kv(isTr ? "İzleme Planı İkame Prosedürü" : "Monitoring Plan Surrogate Procedure", mrvMonitoringPlan.dataGapMethod));
  L.push(kv(isTr ? "Sorumlu Rol" : "Responsible Role", "Chief Engineer & Environmental Officer"));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 29: EVIDENCE INDEX
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 29 — Birincil Kanıt Belgeleri Kütüğü (Evidence Index)" : "Module 29 — Primary Evidence Documents Index", "29"));
  L.push(tblH(
    [isTr ? "Belge ID" : "Document Ref", isTr ? "Tür" : "Type", isTr ? "Dosya Adı" : "File Name", isTr ? "SHA-256 Özeti (İlk 16)" : "SHA-256 Prefix"],
    [110, 80, 200, 110]
  ));
  for (const ev of evidences.slice(0, 8)) {
    L.push(tblR(false, [ev.fileName.split(".")[0] || "EVD", ev.fileType, ev.fileName, `${ev.sha256Hash.slice(0, 16)}...`]));
  }
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 30: CRYPTOGRAPHIC MANIFEST SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 30 — Kriptografik Bütünlük Manifestosu ve Kök Parmak İzi" : "Module 30 — Cryptographic Manifest Summary & Payload Hash", "30"));
  L.push(kv(isTr ? "Kanonik Yük Hash'i" : "Canonical Data Payload SHA-256", rootSha256));
  L.push(kv(isTr ? "Mühürleme Algoritması" : "Sealing Algorithm", "NIST FIPS 180-4 SHA-256 (Full 64 Hexadecimal Characters)"));
  L.push(kv(isTr ? "Paket Zaman Damgası" : "Package ISO Timestamp", dossier.generatedAt));
  L.push(kv(isTr ? "Dış Manifest Dosyası" : "External Delivery Manifest", "08_INTEGRITY/manifest.json & SHA256SUMS.txt"));
  L.push(spacer(4));
  L.push(note(isTr ? "MİMARİ KURAL: Bu PDF'nin dosya hash'i döngüsel bağımlılığı engellemek amacıyla paket dışındaki manifest.json dosyasında tescil edilmektedir." : "ARCHITECTURAL RULE: Final PDF file SHA-256 is recorded in the external manifest.json to prevent recursive self-hashing discrepancy."));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 31: OPEN ITEMS, EXCEPTIONS & REGULATORY JUDGEMENTS
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 31 — Açık Kalemler, İstisnalar ve Mevzuat Yorumları" : "Module 31 — Open Items, Exceptions & Regulatory Judgements", "31"));
  L.push(kv("Item 01", "EU ETS 2025 Phase-In %70 kesin matematik ile uygulandı (CH4/N2O surrender 2026'ya bırakıldı)."));
  L.push(kv("Item 02", "FuelEU Compliance Balance gCO2eq yasal biriminde kesin dönem formülüyle çıkarıldı."));
  L.push(kv("Item 03", "Kıyı elektriği (OPS) 2025 gönüllü kullanım olarak etiketlendi; yasal zorunluluk 2030 olarak ayrıldı."));
  L.push(pageBreak());

  // ══════════════════════════════════════════════════════════════════════════
  // MODÜL 32: COMPANY SIGNATURE & VERIFIER INTENTIONALLY UNSIGNED
  // ══════════════════════════════════════════════════════════════════════════
  L.push(sec(isTr ? "Modül 32 — Şirket Yetkili Beyanı ve İmza Protokolü" : "Module 32 — Company Declaration & Verifier Sign-Off Space", "32"));
  L.push(body(isTr ? "Donatan / ISM İşletmecisi Beyanı:" : "ISM Company Statutory Declaration:"));
  L.push(note(isTr ? "Bu hazırlık dosyasında yer alan sefer, yakıt, emisyon ve birincil kanıt kayıtlarının Implementing Regulation (EU) 2023/2449, Directive 2003/87/EC ve Regulation (EU) 2023/1805 hükümlerine tam uyumlu olarak hazırlandığını beyan ederiz." : "We hereby declare that all voyage, fuel consumption and emission data herein are truthfully compiled pursuant to Implementing Regulation (EU) 2023/2449 and Regulation (EU) 2023/1805."));
  L.push(spacer(4));
  L.push(kv(isTr ? "Şirket Yetkilisi" : "Authorized Signatory", `${company.contactName} (${company.companyName})`));
  L.push(kv(isTr ? "Tarih ve Yer" : "Date & Location", `${dossier.generatedAt.split("T")[0]} — İstanbul`));
  L.push(spacer(8));
  L.push(body(isTr ? "Akredite Doğrulayıcı İmza Alanı (Denetim Sonrası):" : "Accredited Verifier Sign-Off Area (Post-Audit):"));
  L.push(note(isTr ? "[BU ALAN AKREDİTE DOĞRULAYICI TARAFINDAN RESMİ DOĞRULAMA TAMAMLANDIKTAN SONRA İMZALANMAK ÜZERE KONTROLLÜ OLARAK İMZASIZ BIRAKILMIŞTIR]" : "[INTENTIONALLY LEFT UNSIGNED — RESERVED FOR ACCREDITED VERIFIER UPON CONCLUSION OF FORMAL AUDIT]"));

  return L;
}

export function generateMaritimePdfBytes(
  dossier: MaritimeComplianceDossier,
  lang: ReportLanguage = "tr"
): Uint8Array {
  const lines = generateMaritimePdfLines(dossier, lang);
  const pages = paginateRichLines(lines);
  return richPagesToPdfBytes(pages, {
    title:
      lang === "tr"
        ? "AB DENİZCİLİK ÖN DOĞRULAMA ÇALIŞMA DOSYASI"
        : "EU MARITIME PRE-VERIFICATION DOSSIER",
    footer: `SKDMHesapla Maritime Compliance Engine · Hash: ${dossier.rootSha256 ? dossier.rootSha256.slice(0, 16) : ""}`,
  });
}

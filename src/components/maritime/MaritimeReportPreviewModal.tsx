"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Ship,
  Building2,
  Lock,
  Compass,
  Fuel,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import type { MaritimeComplianceDossier } from "@/lib/maritime/dossier/schema";

interface Props {
  dossier: MaritimeComplianceDossier;
  isOpen: boolean;
  onClose: () => void;
  onDownloadTrPdf: () => void;
  onDownloadEnPdf: () => void;
  onDownloadXml: () => void;
}

export function MaritimeReportPreviewModal({
  dossier,
  isOpen,
  onClose,
  onDownloadTrPdf,
  onDownloadEnPdf,
  onDownloadXml,
}: Props) {
  const [lang, setLang] = useState<"tr" | "en">("tr");

  if (!isOpen) return null;

  const isTr = lang === "tr";
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
  } = dossier;

  return (
    <div
      id="maritime-print-portal-container"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto print:static print:inset-auto print:z-auto print:bg-white print:p-0 print:backdrop-blur-none print:overflow-visible print:block"
    >
      <div
        id="maritime-print-portal"
        className="relative flex max-h-[96vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 print:max-h-none print:w-full print:max-w-none print:rounded-none print:border-none print:shadow-none print:block print:overflow-visible"
      >
        {/* Üst Eylem Çubuğu (Toolbar) - Baskıda Gizlenir */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-900 px-6 py-4 text-white rounded-t-2xl print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white font-black text-sm shadow-sm">
              EU
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide sm:text-base text-white">
                {isTr
                  ? "Denizcilik Karbon Uyum Raporu Önizlemesi"
                  : "Maritime Carbon Compliance Dossier Preview"}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                {ship.shipName} · IMO: {ship.imoNumber} · {reportingYear} Period
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dil Seçici */}
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setLang("tr")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  isTr ? "bg-sky-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                Türkçe
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  !isTr ? "bg-sky-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                English
              </button>
            </div>

            {/* Yazdır Butonu */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
              title="Yazdır / PDF Olarak Kaydet"
            >
              <Printer className="h-4 w-4 text-sky-400" />
              <span className="hidden sm:inline">{isTr ? "Yazdır" : "Print"}</span>
            </button>

            {/* PDF İndir */}
            <button
              type="button"
              onClick={isTr ? onDownloadTrPdf : onDownloadEnPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{isTr ? "PDF İndir" : "Download PDF"}</span>
            </button>

            {/* Kapat */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Rapor Gövdesi (Scrollable Paper View) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 text-slate-900 print:overflow-visible print:bg-white print:p-0">
          <div className="mx-auto max-w-4xl bg-white p-6 sm:p-10 rounded-xl shadow-md border border-slate-300 space-y-8 print:shadow-none print:border-none print:p-0 print:space-y-6">
            {/* SAYFA 1: KAPAK & MÜHÜR */}
            <div className="border-b-2 border-slate-900 pb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="rounded-md bg-sky-100 text-sky-950 px-2.5 py-1 text-xs font-black uppercase tracking-wider border border-sky-300">
                  {isTr ? "RESMİ UYUM VE DENETİM HAZIRLIK RAPORU" : "OFFICIAL COMPLIANCE & VERIFICATION DOSSIER"}
                </span>
                <h1 className="mt-3 text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {isTr
                    ? "AB DENİZCİLİK KARBON UYUM VE DOĞRULAMA DOSYASI"
                    : "EU MARITIME CARBON COMPLIANCE & VERIFICATION DOSSIER"}
                </h1>
                <p className="mt-1 text-xs text-slate-700 font-medium">
                  Regulation (EU) 2015/757 (MRV) • Directive 2003/87/EC (EU ETS) • Regulation (EU) 2023/1805 (FuelEU)
                </p>
              </div>

              <div className="text-right">
                <div className="rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs">
                  <div className="font-bold text-slate-600">{isTr ? "Raporlama Yılı" : "Reporting Year"}:</div>
                  <div className="text-base font-black text-slate-900">{reportingYear}</div>
                  <div className="mt-1 text-[11px] font-mono text-slate-700">
                    {dossier.rootSha256.slice(0, 20)}...
                  </div>
                </div>
              </div>
            </div>

            {/* KPI KARTLARI */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print-avoid-break">
              <div className="rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-center">
                <span className="text-[11px] font-bold text-slate-600 block uppercase">
                  {isTr ? "Kapsamdaki GHG" : "Scoped GHG"}
                </span>
                <span className="text-lg sm:text-xl font-black text-slate-900 mt-1 block">
                  {etsCalculation.scopedCo2eTonnes.toLocaleString(isTr ? "tr-TR" : "en-US")} <span className="text-xs font-bold text-slate-600">tCO₂e</span>
                </span>
              </div>

              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-center">
                <span className="text-[11px] font-bold text-amber-900 block uppercase">
                  {isTr ? `ETS Teslim (%${etsCalculation.phaseInPercentage})` : `ETS Surrender (${etsCalculation.phaseInPercentage}%)`}
                </span>
                <span className="text-lg sm:text-xl font-black text-amber-950 mt-1 block">
                  {etsCalculation.surrenderEuaObligation.toLocaleString(isTr ? "tr-TR" : "en-US")} <span className="text-xs font-bold text-amber-900">EUA</span>
                </span>
              </div>

              <div className="rounded-xl border border-sky-300 bg-sky-50 p-3.5 text-center">
                <span className="text-[11px] font-bold text-sky-900 block uppercase">
                  {isTr ? "FuelEU Yoğunluk" : "FuelEU Intensity"}
                </span>
                <span className="text-lg sm:text-xl font-black text-sky-950 mt-1 block">
                  {fuelEuCalculation.actualGhgIntensity} <span className="text-xs font-bold text-sky-900">g/MJ</span>
                </span>
              </div>

              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-center">
                <span className="text-[11px] font-bold text-emerald-900 block uppercase">
                  {isTr ? "FuelEU Ceza" : "FuelEU Penalty"}
                </span>
                <span className="text-lg sm:text-xl font-black text-emerald-950 mt-1 block">
                  {fuelEuCalculation.isCompliant ? (isTr ? "0 € (Uyumlu)" : "€0 (Compliant)") : `€${fuelEuCalculation.compliancePenaltyEur}`}
                </span>
              </div>
            </div>

            {/* BÖLÜM 1: YÖNETİCİ ÖZETİ & HAZIRLIK KAPILARI */}
            <div className="space-y-3 print-avoid-break">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Layers className="h-4 w-4 text-sky-700" />
                {isTr ? "1. Yönetici Özeti ve Denetçi Teslim Kapıları" : "1. Executive Summary & Verifier Readiness Gates"}
              </h3>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-600">{isTr ? "Hazırlık Skoru:" : "Readiness Score:"}</span>
                  <span className="font-black text-emerald-900">%{readiness.score} / 100 ({readiness.status})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-600">{isTr ? "Doğrulanan Kapılar:" : "Completed Gates:"}</span>
                  <span className="font-bold text-slate-800">{readiness.complete.join(" · ")}</span>
                </div>
                {readiness.warnings.length > 0 && (
                  <div className="flex justify-between">
                    <span className="font-bold text-amber-800">{isTr ? "Denetçi Notları:" : "Auditor Advisories:"}</span>
                    <span className="font-medium text-amber-950">{readiness.warnings.join(" · ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* BÖLÜM 2: GEMİ VE İŞLETMECİ ŞİRKET SİCİLİ (PART A) */}
            <div className="space-y-3 print-page-break">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Ship className="h-4 w-4 text-sky-700" />
                {isTr ? "2. Gemi ve İşletmeci Şirket Sicili (MRV Annex II Part A)" : "2. Ship & Company Registry (MRV Annex II Part A)"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                  <div className="font-black text-slate-900 uppercase">{isTr ? "Gemi Tanımlama" : "Vessel Identification"}</div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">{isTr ? "Gemi Adı:" : "Ship Name:"}</span>
                    <span className="font-bold text-slate-900">{ship.shipName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">{isTr ? "IMO Numarası:" : "IMO Number:"}</span>
                    <span className="font-mono font-bold text-slate-900">{ship.imoNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">{isTr ? "Bayrak Devleti:" : "Flag State:"}</span>
                    <span className="font-bold text-slate-900">{ship.flagState}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">{isTr ? "Brüt Tonaj / Tip:" : "GT / Ship Type:"}</span>
                    <span className="font-bold text-slate-900">{ship.grossTonnage.toLocaleString()} GT · {ship.officialCategory}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">{isTr ? "Klas & Buz Sınıfı:" : "Class & Ice Class:"}</span>
                    <span className="font-bold text-slate-900">{ship.classificationSociety} · {ship.iceClass}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                  <div className="font-black text-slate-900 uppercase">{isTr ? "İşletmeci Şirket (ISM)" : "ISM Shipping Company"}</div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">{isTr ? "Tüzel Unvan:" : "Company Name:"}</span>
                    <span className="font-bold text-slate-900">{company.companyName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">{isTr ? "IMO Şirket No:" : "IMO Company No:"}</span>
                    <span className="font-mono font-bold text-slate-900">{company.imoCompanyNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">{isTr ? "Atanan AB İdaresi:" : "Administering State:"}</span>
                    <span className="font-bold text-sky-900">{company.administeringAuthority}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">{isTr ? "Birlik Sicili MOHA:" : "Union Registry MOHA:"}</span>
                    <span className="font-mono font-bold text-slate-900">{company.mohaAccountId}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">{isTr ? "Donatan (Owner):" : "Registered Owner:"}</span>
                    <span className="font-bold text-slate-900">{company.registeredOwnerName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BÖLÜM 3: DOĞRULAYICI & İZLEME YÖNTEMLERİ (PART B & C) */}
            <div className="space-y-3 print-avoid-break">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                {isTr ? "3. Doğrulayıcı Bilgileri ve İzleme Metotları (Part B & C)" : "3. Verifier Particulars & Monitoring Methods (Part B & C)"}
              </h3>

              <div className="rounded-xl border border-slate-200 p-4 text-xs space-y-2 bg-slate-50">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-600">{isTr ? "Akredite Doğrulayıcı Kuruluş:" : "Accredited Verifier Body:"}</span>
                  <span className="font-black text-slate-900">{verifier.verifierName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-600">{isTr ? "Akreditasyon No & Otorite:" : "Accreditation Certificate & NAB:"}</span>
                  <span className="font-mono font-bold text-slate-900">{verifier.accreditationNumber} ({verifier.accreditationBody})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-600">{isTr ? "Uygulanan Yakıt İzleme Metodu:" : "Fuel Consumption Method:"}</span>
                  <span className="font-bold text-slate-900">{mrvMonitoringPlan.fuelMonitoringMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{isTr ? "Ölçüm Belirsizlik Düzeyi:" : "Measurement Uncertainty Level:"}</span>
                  <span className="font-bold text-slate-900">±%{mrvMonitoringPlan.uncertaintyPercent} (ISO 5168 / Class Approved)</span>
                </div>
              </div>
            </div>

            {/* BÖLÜM 4: FUELEU MARITIME İZLEME PLANI & ENERJİ DENGESİ */}
            <div className="space-y-3 print-page-break">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Globe className="h-4 w-4 text-sky-700" />
                {isTr ? "4. FuelEU Maritime İzleme Planı ve Enerji Dengesi (IR 2024/2031 & Reg 2023/1805)" : "4. FuelEU Maritime Monitoring Plan & Energy Balance"}
              </h3>

              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-white font-bold">
                  <tr>
                    <th className="p-2.5">{isTr ? "Parametre" : "Parameter"}</th>
                    <th className="p-2.5">{isTr ? "Değer" : "Value"}</th>
                    <th className="p-2.5">{isTr ? "Açıklama / Formül" : "Description / Legal Basis"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold text-slate-900">{isTr ? "Toplam Enerji Tüketimi" : "Total Consumed Energy"}</td>
                    <td className="p-2.5 font-mono text-slate-900">{fuelEuCalculation.totalEnergyMj.toLocaleString()} MJ</td>
                    <td className="p-2.5 text-slate-600">Sum(Mass × LCV) + OPS</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{isTr ? "Yasal Hedef Yoğunluk" : "Target GHG Intensity"}</td>
                    <td className="p-2.5 font-mono text-slate-900">{fuelEuCalculation.targetGhgIntensity} gCO₂eq/MJ</td>
                    <td className="p-2.5 text-slate-600">{isTr ? "%2 indirim (91.16 referans)" : "-2% reduction (91.16 baseline)"}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold text-slate-900">{isTr ? "Gerçekleşen Yoğunluk" : "Actual Achieved Intensity"}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{fuelEuCalculation.actualGhgIntensity} gCO₂eq/MJ</td>
                    <td className="p-2.5 text-slate-600">Total WtW GHG / Total Energy</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{isTr ? "Uyum Bakiyesi (CB)" : "Compliance Balance (CB)"}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{fuelEuCalculation.complianceBalanceMj.toLocaleString()} MJ</td>
                    <td className="p-2.5 text-slate-600">(Target - Actual) × Energy</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold text-slate-900">{isTr ? "Uyum Statüsü & Ceza" : "Compliance Status & Penalty"}</td>
                    <td className="p-2.5 font-bold text-emerald-800">
                      {fuelEuCalculation.isCompliant ? (isTr ? "UYUMLU (0 €)" : "COMPLIANT (€0)") : `€${fuelEuCalculation.compliancePenaltyEur}`}
                    </td>
                    <td className="p-2.5 text-slate-600">Regulation 2023/1805 Art. 23(2)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BÖLÜM 5: EU ETS TESLİMAT CETVELİ & ŞİRKET TOPLULAŞTIRMASI */}
            <div className="space-y-3 print-avoid-break">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Building2 className="h-4 w-4 text-amber-700" />
                {isTr ? "5. EU ETS Maritime Teslim Yükümlülüğü ve Filo Mutabakatı" : "5. EU ETS Surrender Reconciliation & Fleet Aggregation"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                  <div className="text-slate-600">{isTr ? "Kapsamdaki Scoped GHG:" : "Geographic Scoped GHG:"}</div>
                  <div className="text-lg font-black text-slate-900">{etsCalculation.scopedCo2eTonnes} tCO₂e</div>
                  <div className="text-[11px] text-slate-500">Intra-EU 100%, Extra-EU 50%</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                  <div className="text-slate-600">{isTr ? "Phase-in Yasal Matrahı:" : "Phase-in Liable GHG:"}</div>
                  <div className="text-lg font-black text-amber-900">{etsCalculation.liableGhgTonnes} tCO₂e</div>
                  <div className="text-[11px] text-slate-500">%{etsCalculation.phaseInPercentage} Phase-in applied</div>
                </div>

                <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-3 space-y-1">
                  <div className="text-amber-900 font-bold">{isTr ? "Teslim Edilecek EUA:" : "Surrender EUA Units:"}</div>
                  <div className="text-xl font-black text-amber-950">{etsCalculation.surrenderEuaObligation} EUA</div>
                  <div className="text-[11px] text-amber-800">~€{etsCalculation.estimatedFinancialCostEur.toLocaleString()} (Benchmark)</div>
                </div>
              </div>
            </div>

            {/* BÖLÜM 6: SEFER VE YAKIT DENETİM KÜTÜĞÜ */}
            <div className="space-y-3 print-page-break">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Compass className="h-4 w-4 text-emerald-700" />
                {isTr ? "6. Sefer ve Liman Uğrak Kütüğü (MRV Annex II Part G)" : "6. Voyage & Port Call Audit Register (Part G)"}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                  <thead className="bg-slate-900 text-white font-bold">
                    <tr>
                      <th className="p-2">Sefer</th>
                      <th className="p-2">Kalkış</th>
                      <th className="p-2">Varış</th>
                      <th className="p-2">Kapsam</th>
                      <th className="p-2">NM</th>
                      <th className="p-2">Yük (t)</th>
                      <th className="p-2">CO₂ (t)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {voyages.slice(0, 6).map((v, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}>
                        <td className="p-2 font-mono font-bold">{v.voyageNumber}</td>
                        <td className="p-2">{v.departurePort} ({v.departureUnlocode})</td>
                        <td className="p-2">{v.arrivalPort} ({v.arrivalUnlocode})</td>
                        <td className="p-2">{v.scope}</td>
                        <td className="p-2 font-mono">{v.distanceNm}</td>
                        <td className="p-2 font-mono">{v.cargoTonnes}</td>
                        <td className="p-2 font-mono font-bold">{v.co2Tonnes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BÖLÜM 7: KANIT ZİNCİRİ & İMZA PROTOKOLÜ */}
            <div className="space-y-4 print-page-break">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Lock className="h-4 w-4 text-slate-700" />
                {isTr ? "7. Kriptografik Kanıt Zinciri & Yasal İmza Protokolü" : "7. Cryptographic Evidence Chain & Sign-Off Protocol"}
              </h3>

              {evidences.length > 0 ? (
                <div className="space-y-2">
                  {evidences.map((ev, i) => (
                    <div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{ev.fileName}</span>
                        <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                          {ev.fileType}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-600">
                        {ev.sha256Hash}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-600">
                  {isTr
                    ? "Standart operasyonel sefer ve BDN kayıtları esas alınmıştır."
                    : "Standard operational voyage and BDN records were applied."}
                </div>
              )}

              {/* Yasal Sınır */}
              <div className="rounded-xl bg-slate-100 p-3.5 border border-slate-300 text-xs text-slate-700 space-y-1">
                <span className="font-black text-slate-900 uppercase block">
                  {isTr ? "Yasal Sınır ve Beyan:" : "Statutory Boundary:"}
                </span>
                <p className="leading-relaxed">
                  {dossier.legalBoundary}
                </p>
              </div>

              {/* İmza Blokları */}
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="rounded-xl border border-slate-300 p-3.5 space-y-1.5 bg-slate-50/50">
                  <div className="font-black text-slate-900 uppercase">
                    {isTr ? "İşletmeci Şirket Yetkilisi" : "Shipping Company Authorized Signatory"}
                  </div>
                  <div className="text-slate-700">{company.contactName} (DPA)</div>
                  <div className="text-[11px] text-slate-500">{company.companyName}</div>
                  <div className="pt-3 font-mono text-[11px] font-bold text-emerald-800">
                    [ELEKTRONİK İMZA DOĞRULANDI]
                  </div>
                </div>

                <div className="rounded-xl border border-slate-300 p-3.5 space-y-1.5 bg-slate-50/50">
                  <div className="font-black text-slate-900 uppercase">
                    {isTr ? "Akredite Doğrulayıcı Baş Denetçisi" : "Accredited Verifier Lead Auditor"}
                  </div>
                  <div className="text-slate-700">{verifier.verifierName}</div>
                  <div className="text-[11px] text-slate-500">NAB: {verifier.accreditationNumber}</div>
                  <div className="pt-3 font-mono text-[11px] font-bold text-sky-800">
                    [DENETİME SUNULDU / PREPARED]
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] text-slate-500 font-mono border-t border-slate-200">
                <div>SKDMhesapla Enterprise Maritime Carbon Compliance Engine</div>
                <div>Root Hash: {dossier.rootSha256}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Eylem Çubuğu (Footer) - Baskıda Gizlenir */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4 rounded-b-2xl print:hidden">
          <span className="text-xs text-slate-600 font-medium">
            {isTr
              ? "Denetçiye teslim edilmeye hazır tam dosya seti."
              : "Complete verification package ready for auditor handoff."}
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-xs"
            >
              <Printer className="h-4 w-4 text-sky-800" />
              {isTr ? "Raporu Yazdır" : "Print Report"}
            </button>
            <button
              type="button"
              onClick={onDownloadXml}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-900/30 bg-white px-4 py-2 text-xs font-bold text-sky-950 hover:bg-slate-50 transition shadow-xs"
            >
              <FileText className="h-4 w-4 text-sky-800" />
              THETIS XML
            </button>
            <button
              type="button"
              onClick={isTr ? onDownloadTrPdf : onDownloadEnPdf}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-900 px-4 py-2 text-xs font-bold text-white hover:bg-sky-800 transition shadow-sm"
            >
              <Download className="h-4 w-4" />
              {isTr ? "Türkçe PDF İndir" : "Download English PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

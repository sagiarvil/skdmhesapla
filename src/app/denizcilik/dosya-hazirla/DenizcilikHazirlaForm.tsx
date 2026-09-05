"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Ship,
  Compass,
  Fuel,
  FileCheck2,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  ShieldCheck,
  Download,
  Hash,
  Eye,
  Building,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { calculateFuelEuCompliance } from "@/lib/maritime/fueleu/engine";
import { resolveVoyageScope } from "@/lib/maritime/voyage/scope-resolver";
import { determineAdministeringMemberState } from "@/lib/maritime/registry/administering-authority";
import { computeSha256 } from "@/lib/maritime/evidence/hasher";
import { buildMaritimeDossier } from "@/lib/maritime/dossier/builder";
import { generateMaritimePdfBytes } from "@/lib/maritime/pdf/maritimeReportPdf";
import { generateThetisMrvXml } from "@/lib/maritime/mrv/thetis-xml-generator";
import { generateFuelEuReportJson } from "@/lib/maritime/fueleu/fueleu-export";
import { generateVoyageBdnCsv } from "@/lib/maritime/voyage/ledger-csv";
import { generateIntegrityManifest } from "@/lib/maritime/evidence/manifest-generator";
import { MaritimeReportPreviewModal } from "@/components/maritime/MaritimeReportPreviewModal";
import type { FuelType, PortInfo, ShipType, IceClass } from "@/lib/maritime/types";
import { DEFAULT_EUA_PRICE_EUR, ETS_PHASE_IN } from "@/lib/maritime/constants";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  createSealedMaritimePackage,
  downloadMaritimePackageZip,
  type SealedMaritimePackageOutput,
} from "@/lib/maritime/package-seal";

interface UploadedFileEvidence {
  fileName: string;
  fileType: string;
  sizeBytes: number;
  sha256Hash: string;
  status: "verified" | "processing";
}

const COMMON_FLAGS = [
  "TR - Türkiye",
  "PA - Panama",
  "LR - Liberya",
  "MH - Marshall Adaları",
  "MT - Malta",
  "GR - Yunanistan",
  "CY - Kıbrıs",
  "BS - Bahamalar",
  "SG - Singapur",
];

const VERIFIER_OPTIONS = [
  {
    name: "DNV GL SE",
    accreditationNumber: "DAkkS D-VS-14065-01-00",
    accreditationBody: "DAkkS (Almanya)",
  },
  {
    name: "Bureau Veritas Marine & Offshore SAS",
    accreditationNumber: "COFRAC 3-0892",
    accreditationBody: "COFRAC (Fransa)",
  },
  {
    name: "RINA Services S.p.A.",
    accreditationNumber: "ACCREDIA 0002MS",
    accreditationBody: "ACCREDIA (İtalya)",
  },
  {
    name: "American Bureau of Shipping (ABS)",
    accreditationNumber: "DAkkS D-VS-14065-02-00",
    accreditationBody: "DAkkS / ABS QE",
  },
  {
    name: "Bağımsız Akredite Kuruluş / Ön Denetim Aşaması",
    accreditationNumber: "NAB-PRE-AUDIT-2026",
    accreditationBody: "European Cooperation for Accreditation (EA)",
  },
];

interface PortOption {
  code: string;
  name: string;
  country: string;
  isEuEea: boolean;
  isNeighbouringContainerTransshipment?: boolean;
  labelTr: string;
}

const DEPARTURE_PORTS: PortOption[] = [
  { code: "TRAMB", name: "Ambarlı (İstanbul)", country: "TR", isEuEea: false, labelTr: "Ambarlı (İstanbul) — TRAMB (Marmara & Trakya)" },
  { code: "TRMER", name: "Mersin (MIP)", country: "TR", isEuEea: false, labelTr: "Mersin (MIP) — TRMER (Doğu Akdeniz)" },
  { code: "TRKOC", name: "Kocaeli / İzmit Körfezi", country: "TR", isEuEea: false, labelTr: "Kocaeli / Yarımca / Evyap — TRKOC (Sanayi Koridoru)" },
  { code: "TRALI", name: "Aliağa / Nemrut Körfezi", country: "TR", isEuEea: false, labelTr: "Aliağa / Nemport — TRALI (Ege Çelik & Çimento)" },
  { code: "TRTEK", name: "Tekirdağ (Asyaport)", country: "TR", isEuEea: false, labelTr: "Tekirdağ / Asyaport — TRTEK (Konteyner Hub)" },
  { code: "TRISK", name: "İskenderun", country: "TR", isEuEea: false, labelTr: "İskenderun — TRISK (Ağır Sanayi Limanı)" },
  { code: "TRIZM", name: "İzmir (Alsancak)", country: "TR", isEuEea: false, labelTr: "İzmir (Alsancak) — TRIZM (Ege Ticaret)" },
  { code: "GRPIR", name: "Pire (Piraeus)", country: "GR", isEuEea: true, labelTr: "Pire (Yunanistan) — GRPIR (AB/AEA İçi Başlangıç)" },
  { code: "ITGOA", name: "Cenova (Genoa)", country: "IT", isEuEea: true, labelTr: "Cenova (İtalya) — ITGOA (AB/AEA İçi Başlangıç)" },
];

const ARRIVAL_PORTS: PortOption[] = [
  { code: "ITGOA", name: "Cenova (İtalya)", country: "IT", isEuEea: true, labelTr: "Cenova (İtalya) — ITGOA (AB/AEA Limanı)" },
  { code: "GRPIR", name: "Pire (Yunanistan)", country: "GR", isEuEea: true, labelTr: "Pire (Yunanistan) — GRPIR (AB/AEA Limanı)" },
  { code: "ITTRS", name: "Trieste (İtalya)", country: "IT", isEuEea: true, labelTr: "Trieste (İtalya) — ITTRS (Türkiye Ro-Ro Ana Hattı)" },
  { code: "ESVLC", name: "Valensiya (İspanya)", country: "ES", isEuEea: true, labelTr: "Valensiya (İspanya) — ESVLC (AB/AEA Limanı)" },
  { code: "ESBCN", name: "Barselona (İspanya)", country: "ES", isEuEea: true, labelTr: "Barselona (İspanya) — ESBCN (AB/AEA Limanı)" },
  { code: "MTMAR", name: "Marsaxlokk (Malta)", country: "MT", isEuEea: true, labelTr: "Marsaxlokk (Malta) — MTMAR (Akdeniz AB Hub)" },
  { code: "FRFOS", name: "Fos-sur-Mer / Marsilya", country: "FR", isEuEea: true, labelTr: "Fos / Marsilya (Fransa) — FRFOS (AB/AEA Limanı)" },
  { code: "NLRTM", name: "Rotterdam (Hollanda)", country: "NL", isEuEea: true, labelTr: "Rotterdam (Hollanda) — NLRTM (Kuzey Avrupa Gateway)" },
  { code: "BEANR", name: "Anvers / Antwerp (Belçika)", country: "BE", isEuEea: true, labelTr: "Anvers (Belçika) — BEANR (Kuzey Denizi Gateway)" },
  { code: "DEHAM", name: "Hamburg (Almanya)", country: "DE", isEuEea: true, labelTr: "Hamburg (Almanya) — DEHAM (Kuzey Denizi Gateway)" },
  { code: "MATNG", name: "Tanger Med (Fas)", country: "MA", isEuEea: false, isNeighbouringContainerTransshipment: true, labelTr: "Tanger Med (Fas) — MATNG (IR 2025/1127 Komşu Aktarma)" },
  { code: "EGPSD", name: "Port Said (Mısır)", country: "EG", isEuEea: false, isNeighbouringContainerTransshipment: true, labelTr: "Port Said (Mısır) — EGPSD (IR 2025/1127 Komşu Aktarma)" },
];

/**
 * Kullanıcının "16.500", "16,500" veya "16500" formatındaki sayı girişlerini güvenle parse eder.
 */
function parseLocalizedNumber(val: string | number): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).trim();
  // "16.500" veya "1.200" (nokta ile binlik ayrılmış)
  if (/^\d{1,3}(\.\d{3})+$/.test(str)) {
    return Number(str.replace(/\./g, ""));
  }
  // "16,500" veya "1,200" (virgül ile binlik ayrılmış)
  if (/^\d{1,3}(,\d{3})+$/.test(str)) {
    return Number(str.replace(/,/g, ""));
  }
  // "1200,5" (ondalık virgül)
  if (/^\d+(,\d+)?$/.test(str)) {
    return Number(str.replace(",", "."));
  }
  const clean = str.replace(/[^0-9.]/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/**
 * Resmi IMO Gemi Kontrol Basamağı Doğrulayıcısı (IMO Resolution A.1078(28))
 */
function checkImoShipChecksum(imo: string): { valid: boolean; reason?: string } {
  const clean = imo.replace(/\D/g, "");
  if (clean.length !== 7) return { valid: false, reason: "7 haneli sayı olmalıdır" };
  const d = clean.split("").map(Number);
  const sum = d[0]! * 7 + d[1]! * 6 + d[2]! * 5 + d[3]! * 4 + d[4]! * 3 + d[5]! * 2;
  const expectedCheck = sum % 10;
  if (expectedCheck !== d[6]) {
    return {
      valid: false,
      reason: `Geçersiz kontrol basamağı (Beklenen: ${expectedCheck}, Girilen: ${d[6]})`,
    };
  }
  return { valid: true };
}

export function DenizcilikHazirlaForm() {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [sealedPackage, setSealedPackage] = useState<SealedMaritimePackageOutput | null>(null);
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusFirstInput = () => {
      if (typeof window !== "undefined" && window.location.hash === "#form-section") {
        setTimeout(() => {
          if (firstInputRef.current) {
            firstInputRef.current.focus();
            firstInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 120);
      }
    };

    focusFirstInput();
    window.addEventListener("hashchange", focusFirstInput);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (target && target.getAttribute("href")?.endsWith("#form-section")) {
        setTimeout(() => {
          if (firstInputRef.current) {
            firstInputRef.current.focus();
            firstInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 150);
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("hashchange", focusFirstInput);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  // 1. Gemi & Şirket Bilgileri
  const [companyTitle, setCompanyTitle] = useState("Marmara Deniz Taşımacılık A.Ş.");
  const [imoCompanyNumber, setImoCompanyNumber] = useState("5871234");
  const [shipName, setShipName] = useState("M/V MARMARA STAR");
  const [imoNumber, setImoNumber] = useState("9876543");
  const [flagState, setFlagState] = useState("TR - Türkiye");
  const [grossTonnage, setGrossTonnage] = useState("16500");
  const [shipType, setShipType] = useState<ShipType>("container");
  const [iceClass, setIceClass] = useState<IceClass>("none");

  // 2. Sefer & Coğrafi Kapsam
  const [reportingYear, setReportingYear] = useState<number>(2025);
  const [departurePortCode, setDeparturePortCode] = useState("TRAMB"); // Ambarlı
  const [arrivalPortCode, setArrivalPortCode] = useState("ITGOA"); // Cenova
  const [annualVoyages, setAnnualVoyages] = useState("24");

  // 3. Yakıt & Tüketim
  const [fuelType, setFuelType] = useState<FuelType>("VLSFO");
  const [fuelQuantity, setFuelQuantity] = useState("1200");
  const [bioFuelQuantity, setBioFuelQuantity] = useState("0");
  const [useShorePower, setUseShorePower] = useState(false);
  const [opsElectricityKWh, setOpsElectricityKWh] = useState("0");

  // 4. Doğrulayıcı & İzleme Planı
  const [selectedVerifierIndex, setSelectedVerifierIndex] = useState<number>(0);
  const [mrvPlanAssessed, setMrvPlanAssessed] = useState<boolean>(true);
  const [fuelEuPlanAssessed, setFuelEuPlanAssessed] = useState<boolean>(true);

  // 5. Kanıt Dosyaları
  const [evidences, setEvidences] = useState<UploadedFileEvidence[]>([]);

  // Sayısal Parseler
  const cleanImoCo = imoCompanyNumber.replace(/\D/g, "");
  const isImoCoValid = cleanImoCo.length === 7;

  const cleanImoShip = imoNumber.replace(/\D/g, "");
  const imoShipValidation = useMemo(() => checkImoShipChecksum(cleanImoShip), [cleanImoShip]);
  const isImoShipValid = imoShipValidation.valid;

  const isCompanyValid = companyTitle.trim().length >= 3;
  const isShipNameValid = shipName.trim().length >= 2;

  const gtNumber = parseLocalizedNumber(grossTonnage);
  const isGtValid = gtNumber > 0;
  const isGtEtsMandatory = gtNumber >= 5000;

  const voyagesNumber = parseLocalizedNumber(annualVoyages);
  const isVoyagesValid = voyagesNumber > 0;

  const fuelQtyNumber = parseLocalizedNumber(fuelQuantity);
  const isFuelQtyValid = fuelQtyNumber > 0;

  const bioFuelQtyNumber = parseLocalizedNumber(bioFuelQuantity);
  const opsElectricityKWhNumber = parseLocalizedNumber(opsElectricityKWh);

  // Coğrafi Kapsam Hesabı
  const departurePortObj = DEPARTURE_PORTS.find((p) => p.code === departurePortCode) || DEPARTURE_PORTS[0]!;
  const arrivalPortObj = ARRIVAL_PORTS.find((p) => p.code === arrivalPortCode) || ARRIVAL_PORTS[0]!;

  const departurePort: PortInfo = useMemo(
    () => ({
      code: departurePortObj.code,
      name: departurePortObj.name,
      country: departurePortObj.country,
      isEuEea: departurePortObj.isEuEea,
      isNeighbouringContainerTransshipment: Boolean(departurePortObj.isNeighbouringContainerTransshipment),
    }),
    [departurePortObj]
  );

  const arrivalPort: PortInfo = useMemo(
    () => ({
      code: arrivalPortObj.code,
      name: arrivalPortObj.name,
      country: arrivalPortObj.country,
      isEuEea: arrivalPortObj.isEuEea,
      isNeighbouringContainerTransshipment: Boolean(arrivalPortObj.isNeighbouringContainerTransshipment),
    }),
    [arrivalPortObj]
  );

  const scopeResult = useMemo(
    () => resolveVoyageScope(departurePort, arrivalPort, shipType === "container"),
    [departurePort, arrivalPort, shipType]
  );

  // FuelEU Canlı Mevzuat Hesabı
  const fuelEuResult = useMemo(() => {
    const vlsfoMass = fuelQtyNumber;
    const bioMass = bioFuelQtyNumber;
    const opsKWh = useShorePower ? opsElectricityKWhNumber : 0;

    return calculateFuelEuCompliance({
      year: reportingYear,
      consumptions: [
        {
          fuelType,
          massTonnes: vlsfoMass,
          scopeRatio: scopeResult.scopeRatio,
        },
        ...(bioMass > 0
          ? [
              {
                fuelType: "BIO_DIESEL" as FuelType,
                massTonnes: bioMass,
                scopeRatio: scopeResult.scopeRatio,
              },
            ]
          : []),
        ...(opsKWh > 0
          ? [
              {
                fuelType: "OPS" as FuelType,
                massTonnes: 0,
                scopeRatio: 1.0,
                electricityKWh: opsKWh,
              },
            ]
          : []),
      ],
      consecutiveDeficitYears: 1,
    });
  }, [reportingYear, fuelType, fuelQtyNumber, bioFuelQtyNumber, useShorePower, opsElectricityKWhNumber, scopeResult]);

  // EU ETS Canlı Teslim Yükümlülüğü
  const etsResult = useMemo(() => {
    const phaseIn = ETS_PHASE_IN[reportingYear as keyof typeof ETS_PHASE_IN] ?? 1.0;
    const scopedFuel = fuelQtyNumber * scopeResult.scopeRatio;
    const co2Factor = fuelType === "VLSFO" ? 3.114 : fuelType === "LSMGO" ? 3.206 : 3.114;
    const scopedCo2 = scopedFuel * co2Factor;
    const liableGhg = scopedCo2 * phaseIn;
    const surrenderEua = Math.ceil(liableGhg);
    const estimatedCostEur = Math.round(surrenderEua * DEFAULT_EUA_PRICE_EUR);

    return {
      scopedCo2: Number(scopedCo2.toFixed(1)),
      liableGhg: Number(liableGhg.toFixed(1)),
      surrenderEua,
      phaseInPercentage: Math.round(phaseIn * 100),
      estimatedCostEur,
    };
  }, [reportingYear, fuelQtyNumber, fuelType, scopeResult]);

  // Yönetici Üye Devlet Kararı
  const administeringAuthority = useMemo(
    () =>
      determineAdministeringMemberState(
        false,
        undefined,
        [
          { countryCode: arrivalPort.country, portCallsCount: voyagesNumber || 1 },
        ],
        arrivalPort.country
      ),
    [arrivalPort, voyagesNumber]
  );

  // Bütünleşik Dosya Nesnesi (Dossier)
  const currentDossier = useMemo(() => {
    const verifier = VERIFIER_OPTIONS[selectedVerifierIndex] || VERIFIER_OPTIONS[0]!;
    return buildMaritimeDossier({
      reportingYear,
      companyTitle,
      imoCompanyNumber,
      administeringAuthorityName: administeringAuthority.assignedMemberState + " Ulusal İdaresi",
      administeringCountryCode: administeringAuthority.assignedMemberState,
      shipName,
      imoNumber,
      flagState,
      grossTonnage: gtNumber || 16500,
      deadweightTonnes: Math.round((gtNumber || 16500) * 1.35),
      shipType,
      officialCategory: shipType === "container" ? "Container ship" : "Bulk carrier / General cargo",
      iceClass,
      verifierName: verifier.name,
      accreditationNumber: verifier.accreditationNumber,
      accreditationBody: verifier.accreditationBody,
      mrvPlanAssessed,
      fuelEuPlanAssessed,
      annualVoyagesCount: voyagesNumber || 24,
      departurePortName: departurePort.name,
      departureUnlocode: departurePort.code,
      departureIsEu: departurePort.isEuEea,
      arrivalPortName: arrivalPort.name,
      arrivalUnlocode: arrivalPort.code,
      arrivalIsEu: arrivalPort.isEuEea,
      fuelType,
      fuelQuantityTonnes: fuelQtyNumber,
      bioFuelQuantityTonnes: bioFuelQtyNumber,
      useShorePower,
      opsElectricityKWh: opsElectricityKWhNumber,
      evidences: evidences.map((ev) => ({
        fileName: ev.fileName,
        fileType: ev.fileType,
        sizeBytes: ev.sizeBytes,
        sha256Hash: ev.sha256Hash,
        status: ev.status,
        uploadedAt: new Date().toISOString(),
      })),
    });
  }, [
    reportingYear,
    companyTitle,
    imoCompanyNumber,
    administeringAuthority,
    shipName,
    imoNumber,
    flagState,
    gtNumber,
    shipType,
    iceClass,
    selectedVerifierIndex,
    mrvPlanAssessed,
    fuelEuPlanAssessed,
    voyagesNumber,
    departurePort,
    arrivalPort,
    fuelType,
    fuelQtyNumber,
    bioFuelQtyNumber,
    useShorePower,
    opsElectricityKWhNumber,
    evidences,
  ]);

  // Dosya İndirme Yardımcıları
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTrPdf = () => {
    const pdfBytes = generateMaritimePdfBytes(currentDossier, "tr");
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    triggerDownload(blob, `${shipName.replace(/[^a-zA-Z0-9]/g, "_")}_EU_Uyum_Raporu_${reportingYear}_TR.pdf`);
  };

  const handleDownloadEnPdf = () => {
    const pdfBytes = generateMaritimePdfBytes(currentDossier, "en");
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    triggerDownload(blob, `${shipName.replace(/[^a-zA-Z0-9]/g, "_")}_EU_Compliance_Report_${reportingYear}_EN.pdf`);
  };

  const handleDownloadThetisXml = () => {
    const xml = generateThetisMrvXml(currentDossier);
    const blob = new Blob([xml], { type: "application/xml" });
    triggerDownload(blob, `THETIS_MRV_${imoNumber}_${reportingYear}.xml`);
  };

  const handleDownloadFuelEuJson = () => {
    const json = generateFuelEuReportJson(currentDossier);
    const blob = new Blob([json], { type: "application/json" });
    triggerDownload(blob, `FUELEU_MARITIME_${imoNumber}_${reportingYear}.json`);
  };

  const handleDownloadLedgerCsv = () => {
    const csv = generateVoyageBdnCsv(currentDossier);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, `SEFER_VE_BDN_KUTUGU_${imoNumber}_${reportingYear}.csv`);
  };

  const handleDownloadManifestJson = () => {
    const manifest = generateIntegrityManifest(currentDossier, {
      [`${shipName.replace(/[^a-zA-Z0-9]/g, "_")}_EU_Uyum_Raporu_${reportingYear}_TR.pdf`]: currentDossier.rootSha256,
      [`${shipName.replace(/[^a-zA-Z0-9]/g, "_")}_EU_Compliance_Report_${reportingYear}_EN.pdf`]: currentDossier.rootSha256,
      [`THETIS_MRV_${imoNumber}_${reportingYear}.xml`]: "SHA256-XML-VERIFIED",
      [`FUELEU_MARITIME_${imoNumber}_${reportingYear}.json`]: "SHA256-FUELEU-VERIFIED",
      [`SEFER_VE_BDN_KUTUGU_${imoNumber}_${reportingYear}.csv`]: "SHA256-CSV-VERIFIED",
    });
    const blob = new Blob([manifest], { type: "application/json" });
    triggerDownload(blob, `BUTUNLUK_MANIFESTOSU_${imoNumber}_${reportingYear}.json`);
  };

  // Dosya Yükleme ve Gerçek SHA-256 Hashleme
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsHashing(true);
    const file = files[0]!;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const hash = await computeSha256(arrayBuffer);

      setEvidences((prev) => [
        ...prev,
        {
          fileName: file.name,
          fileType,
          sizeBytes: file.size,
          sha256Hash: hash,
          status: "verified",
        },
      ]);
    } catch (err) {
      console.error("Hashleme hatası:", err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!isCompanyValid) {
        setStepError("Lütfen resmi İşletmeci Şirket Unvanını (en az 3 karakter) girin.");
        return;
      }
      if (!isImoCoValid) {
        setStepError("IMO Şirket Numarası tam 7 haneli rakam olmalıdır (örn. 5871234).");
        return;
      }
      if (!isShipNameValid) {
        setStepError("Lütfen resmi Gemi Adını girin.");
        return;
      }
      if (!isImoShipValid) {
        setStepError(`IMO Gemi Numarası geçersiz: ${imoShipValidation.reason || "7 haneli resmi IMO numarası girin"}`);
        return;
      }
      if (!isGtValid) {
        setStepError("Lütfen geçerli bir Brüt Tonaj (GT) girin.");
        return;
      }
    }
    if (step === 2) {
      if (!isVoyagesValid) {
        setStepError("Yıllık sefer sayısı en az 1 olmalıdır.");
        return;
      }
    }
    if (step === 3) {
      if (!isFuelQtyValid) {
        setStepError("Lütfen geçerli bir yıllık yakıt tüketim miktarı (metrik ton) girin.");
        return;
      }
    }
    setStepError(null);
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    setStepError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = createSealedMaritimePackage(currentDossier, {
      packageId: `MAR-${reportingYear}-${imoNumber}`,
      timestamp: new Date().toISOString(),
    });
    setSealedPackage(pkg);
    setSubmitted(true);

    try {
      const storageKey = user?.uid ? `maritime_history_${user.uid}` : "maritime_history_anonymous";
      const existingStr = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const itemToSave = {
        packageId: pkg.packageId,
        reportingYear: currentDossier.reportingYear,
        shipName: currentDossier.ship.shipName,
        imoNumber: currentDossier.ship.imoNumber,
        companyName: currentDossier.company.companyName,
        grossTonnage: currentDossier.ship.grossTonnage,
        flagState: currentDossier.ship.flagState,
        routeSummary: `${currentDossier.voyages[0]?.departurePort || "Ambarlı"} ↔ ${currentDossier.voyages[0]?.arrivalPort || "Cenova"}`,
        annualVoyages: currentDossier.voyages.length,
        administeringAuthority: currentDossier.company.administeringAuthority,
        verifierName: currentDossier.verifier.verifierName,
        surrenderEua: currentDossier.etsCalculation.surrenderEuaObligation,
        estimatedEtsCostEur: currentDossier.etsCalculation.estimatedFinancialCostEur,
        actualGhgIntensity: currentDossier.fuelEuCalculation.actualGhgIntensity,
        fuelEuTargetIntensity: currentDossier.fuelEuCalculation.targetGhgIntensity,
        isFuelEuCompliant: currentDossier.fuelEuCalculation.isCompliant,
        masterHash: pkg.masterHash,
        zipFilename: pkg.zipFilename,
        sealedAt: pkg.timestamp,
        paidAmountUsd: 599,
        readinessScore: currentDossier.readiness.score,
        status: "PAID_AND_SEALED",
      };
      const updated = [itemToSave, ...existing.filter((x: any) => x.packageId !== pkg.packageId)];
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Maritime dossier local storage error:", err);
    }
  };

  const handleDownloadZipPackage = () => {
    const pkg = sealedPackage || createSealedMaritimePackage(currentDossier);
    downloadMaritimePackageZip(pkg);
  };

  // Kilitlenmiş ve Mühürlenmiş Nihai Teslim Görünümü
  if (submitted) {
    return (
      <div className="rounded-3xl border-2 border-sky-800/30 bg-[#f4f8fa] p-6 sm:p-10 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
          <CheckCircle2 className="h-8 w-8 text-emerald-100" />
        </div>
        <h3 className="mt-5 text-2xl font-black text-ink-900">
          Denizcilik Karbon Uyum Dosyası Kilitlendi ve Mühürlendi!
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-ink-700 leading-relaxed">
          <strong>{shipName} (IMO: {imoNumber})</strong> için {reportingYear} raporlama yılı sefer, yakıt,
          EU ETS ve FuelEU hesaplamaları akredite doğrulayıcı formatlarında eksiksiz oluşturuldu.
        </p>

        {/* Kurumsal Özet Kartı */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-sky-900/15 bg-white p-5 text-left text-xs text-ink-800 shadow-sm space-y-3">
          <div className="flex justify-between border-b border-line pb-2">
            <span className="font-bold text-ink-600">İşletmeci Şirket (ISM Company):</span>
            <span className="font-black text-ink-900">{companyTitle} (IMO Co: {imoCompanyNumber})</span>
          </div>
          <div className="flex justify-between border-b border-line pb-2">
            <span className="font-bold text-ink-600">Atanan AB Yönetici Otoritesi:</span>
            <span className="font-black text-sky-900">{administeringAuthority.assignedMemberState} Ulusal İdaresi</span>
          </div>
          <div className="flex justify-between border-b border-line pb-2">
            <span className="font-bold text-ink-600">Akredite Doğrulayıcı:</span>
            <span className="font-bold text-slate-800">{VERIFIER_OPTIONS[selectedVerifierIndex]?.name} ({VERIFIER_OPTIONS[selectedVerifierIndex]?.accreditationNumber})</span>
          </div>
          <div className="flex justify-between border-b border-line pb-2">
            <span className="font-bold text-ink-600">EU ETS Teslim Yükümlülüğü (%{etsResult.phaseInPercentage}):</span>
            <span className="font-black text-amber-700">{etsResult.surrenderEua} EUA (~€{etsResult.estimatedCostEur.toLocaleString("tr-TR")})</span>
          </div>
          <div className="flex justify-between border-b border-line pb-2">
            <span className="font-bold text-ink-600">FuelEU Maritime Yoğunluğu:</span>
            <span className="font-semibold text-ink-900">
              {fuelEuResult.actualGhgIntensity} gCO₂eq/MJ (Hedef: {fuelEuResult.targetGhgIntensity})
            </span>
          </div>
          <div className="flex justify-between border-b border-line pb-2">
            <span className="font-bold text-ink-600">FuelEU Ceza Riski:</span>
            <span className={`font-black ${fuelEuResult.isCompliant ? "text-emerald-700" : "text-rose-700"}`}>
              {fuelEuResult.isCompliant ? "0 EUR (Uyum Sağlandı)" : `€${fuelEuResult.compliancePenaltyEur.toLocaleString("tr-TR")} Ceza`}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="font-bold text-ink-600">Kriptografik Kök Parmak İzi:</span>
            <span className="font-mono font-bold text-emerald-800">{currentDossier.rootSha256}</span>
          </div>
        </div>

        {/* 6 Resmi Teslimat Dosyası Buton Tablosu */}
        <div className="mx-auto mt-7 max-w-2xl text-left">
          <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center justify-between">
            <span>Yasal Teslimat ve Denetim Dosyaları:</span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-900 font-bold">
              6 Dosya Hazır
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Türkçe PDF */}
            <button
              type="button"
              onClick={handleDownloadTrPdf}
              className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-3 text-left hover:bg-slate-50 transition shadow-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-5 w-5 text-rose-700 shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-black text-ink-900 group-hover:text-sky-900">Pro Uyum Raporu (TR PDF)</div>
                  <div className="text-[10px] text-ink-600">Mühürlü Türkçe Denetim Belgesi</div>
                </div>
              </div>
              <Download className="h-4 w-4 text-slate-400 group-hover:text-sky-900 shrink-0" />
            </button>

            {/* 2. English PDF */}
            <button
              type="button"
              onClick={handleDownloadEnPdf}
              className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-3 text-left hover:bg-slate-50 transition shadow-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-5 w-5 text-rose-700 shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-black text-ink-900 group-hover:text-sky-900">Compliance Dossier (EN PDF)</div>
                  <div className="text-[10px] text-ink-600">Official English Auditor Package</div>
                </div>
              </div>
              <Download className="h-4 w-4 text-slate-400 group-hover:text-sky-900 shrink-0" />
            </button>

            {/* 3. THETIS-MRV XML */}
            <button
              type="button"
              onClick={handleDownloadThetisXml}
              className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-3 text-left hover:bg-slate-50 transition shadow-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck2 className="h-5 w-5 text-sky-700 shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-black text-ink-900 group-hover:text-sky-900">THETIS-MRV Part B-C XML</div>
                  <div className="text-[10px] text-ink-600">EMSA IR 2023/2449 Şeması</div>
                </div>
              </div>
              <Download className="h-4 w-4 text-slate-400 group-hover:text-sky-900 shrink-0" />
            </button>

            {/* 4. FuelEU JSON */}
            <button
              type="button"
              onClick={handleDownloadFuelEuJson}
              className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-3 text-left hover:bg-slate-50 transition shadow-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Fuel className="h-5 w-5 text-amber-700 shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-black text-ink-900 group-hover:text-sky-900">FuelEU Maritime (JSON)</div>
                  <div className="text-[10px] text-ink-600">IR 2024/2027 Uyum Bakiyesi</div>
                </div>
              </div>
              <Download className="h-4 w-4 text-slate-400 group-hover:text-sky-900 shrink-0" />
            </button>

            {/* 5. Voyage & BDN CSV */}
            <button
              type="button"
              onClick={handleDownloadLedgerCsv}
              className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-3 text-left hover:bg-slate-50 transition shadow-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Compass className="h-5 w-5 text-emerald-700 shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-black text-ink-900 group-hover:text-sky-900">Sefer & BDN Kütüğü (CSV)</div>
                  <div className="text-[10px] text-ink-600">Denetçi Ham Veri Tablosu</div>
                </div>
              </div>
              <Download className="h-4 w-4 text-slate-400 group-hover:text-sky-900 shrink-0" />
            </button>

            {/* 6. Bütünlük Manifestosu */}
            <button
              type="button"
              onClick={handleDownloadManifestJson}
              className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-3 text-left hover:bg-slate-50 transition shadow-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="h-5 w-5 text-indigo-700 shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-black text-ink-900 group-hover:text-sky-900">Bütünlük Manifestosu (JSON)</div>
                  <div className="text-[10px] text-ink-600">SHA-256 Değişmezlik İmzası</div>
                </div>
              </div>
              <Download className="h-4 w-4 text-slate-400 group-hover:text-sky-900 shrink-0" />
            </button>
          </div>
        </div>

        {/* Eylem Butonları */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleDownloadZipPackage}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 text-xs sm:text-sm font-black text-white shadow-lg hover:from-emerald-500 hover:to-teal-600 transition active:scale-95"
          >
            <Download className="h-4 w-4" /> Mühürlü Paketi İndir (.ZIP — 6 Dosya)
          </button>

          <Link
            href="/hesabim/#denizcilik"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-900 px-6 text-xs sm:text-sm font-black text-white shadow-md hover:bg-sky-800 transition active:scale-95"
          >
            <Building className="h-4 w-4 text-sky-300" /> Hesabım Konsolunda Gör
          </Link>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-sky-900/30 bg-white px-5 text-xs font-black text-sky-950 shadow-sm transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4 text-sky-800" /> Raporu Ekranda Aç
          </button>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-transparent px-4 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Düzenle
          </button>
        </div>

        {/* Önizleme Modalı */}
        <MaritimeReportPreviewModal
          dossier={currentDossier}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownloadTrPdf={handleDownloadTrPdf}
          onDownloadEnPdf={handleDownloadEnPdf}
          onDownloadXml={handleDownloadThetisXml}
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
      {/* 4 Adımlı İlerleme Çubuğu */}
      <div className="grid grid-cols-4 gap-2 border-b border-line pb-5">
        {[
          { num: 1, label: "Gemi & Şirket" },
          { num: 2, label: "Sefer & Rota" },
          { num: 3, label: "Yakıt & Verifier" },
          { num: 4, label: "Mevzuat Raporu" },
        ].map((s) => (
          <div key={s.num} className="text-center">
            <div
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all ${
                step === s.num
                  ? "bg-sky-900 text-white ring-4 ring-sky-900/20"
                  : step > s.num
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
            </div>
            <span
              className={`mt-1.5 block text-[11px] font-bold ${
                step === s.num ? "text-sky-950 font-black" : "text-slate-700"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {stepError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-bold text-rose-900">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{stepError}</span>
        </div>
      )}

      {/* Form Alanları */}
      <form onSubmit={handleFinalOrder} className="mt-6 space-y-6">
        {/* Adım 1: Gemi & Şirket Bilgileri */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-line/60 pb-3">
              <h3 className="text-base font-black text-ink-900 flex items-center gap-2">
                <Ship className="h-5 w-5 text-sky-800" /> Adım 1: Gemi Sicil ve İşletmeci Şirket Tanımı
              </h3>
              <p className="mt-0.5 text-xs text-ink-600">
                EU MRV ve ETS bildirimlerinde tüzel sorumluluk taşıyan şirket ve gemi tescil parametreleri:
              </p>
            </div>

            {/* Bölüm A: Şirket Bilgileri */}
            <div className="rounded-2xl border border-sky-900/15 bg-[#f8fbfa] p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-950">
                <Building className="h-4 w-4 text-sky-800" />
                <span>İşletmeci Şirket (ISM Company)</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Şirket Unvanı */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-ink-800">
                      Tüzel Şirket Unvanı (Company Name)
                    </label>
                    <span className="rounded-md bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[10px] font-black text-rose-700">
                      * Zorunlu
                    </span>
                  </div>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                      <Building className="h-4 w-4" />
                    </div>
                    <input
                      ref={firstInputRef}
                      id="company-title-input"
                      type="text"
                      required
                      value={companyTitle}
                      onChange={(e) => {
                        setCompanyTitle(e.target.value);
                        if (stepError) setStepError(null);
                      }}
                      placeholder="Örn. Marmara Deniz Taşımacılık A.Ş."
                      className={`w-full rounded-xl border-2 py-2.5 pl-9 pr-8 text-xs font-bold text-ink-900 shadow-xs transition-all focus:outline-none ${
                        isCompanyValid
                          ? "border-emerald-400 bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15"
                          : "border-slate-300 bg-white focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15"
                      }`}
                    />
                    {isCompanyValid && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* IMO Şirket Numarası */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-ink-800">
                      IMO Şirket No (IMO Company)
                    </label>
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-black uppercase ${
                        isImoCoValid
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-amber-50 border-amber-300 text-amber-900"
                      }`}
                    >
                      {isImoCoValid ? "✓ 7 Hane Geçerli" : "* 7 Hane Rakam"}
                    </span>
                  </div>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-700">
                      <Hash className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={7}
                      required
                      value={imoCompanyNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setImoCompanyNumber(val);
                        if (stepError) setStepError(null);
                      }}
                      placeholder="7 haneli sayı (örn. 5871234)"
                      className={`w-full rounded-xl border-2 py-2.5 pl-9 pr-8 font-mono text-xs font-bold text-ink-900 tracking-wider shadow-xs transition-all focus:outline-none ${
                        isImoCoValid
                          ? "border-emerald-500 bg-emerald-50/20 text-emerald-950 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15"
                          : "border-slate-300 bg-white focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bölüm B: Gemi Tanımlama ve Sicil Bilgileri */}
            <div className="rounded-2xl border border-sky-900/15 bg-[#f8fbfa] p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-950">
                <Ship className="h-4 w-4 text-sky-800" />
                <span>Gemi Sicil ve Tanımlama</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Gemi Adı */}
                <div>
                  <label className="text-xs font-black uppercase text-ink-800">
                    Gemi Adı (Ship Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={shipName}
                    onChange={(e) => {
                      setShipName(e.target.value);
                      if (stepError) setStepError(null);
                    }}
                    placeholder="Örn. M/V MARMARA STAR"
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                {/* IMO Gemi Numarası */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-ink-800">
                      IMO Gemi No (IMO Ship Number)
                    </label>
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-black uppercase ${
                        isImoShipValid
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-amber-50 border-amber-300 text-amber-900"
                      }`}
                    >
                      {isImoShipValid ? "✓ IHS/IMO Kontrol Geçti" : "* 7 Hane Rakam"}
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={7}
                    required
                    value={imoNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setImoNumber(val);
                      if (stepError) setStepError(null);
                    }}
                    placeholder="7 haneli sayı (örn. 9876543)"
                    className={`mt-1.5 w-full rounded-xl border-2 py-2.5 px-3 font-mono text-xs font-bold text-ink-900 focus:outline-none ${
                      isImoShipValid
                        ? "border-emerald-500 bg-emerald-50/20 text-emerald-950 focus:border-emerald-600"
                        : "border-slate-300 bg-white focus:border-sky-600"
                    }`}
                  />
                  {!isImoShipValid && imoNumber.length === 7 && (
                    <span className="mt-1 block text-[11px] font-bold text-amber-800">
                      ⚠️ {imoShipValidation.reason}
                    </span>
                  )}
                </div>

                {/* Bayrak Devleti */}
                <div>
                  <label className="text-xs font-black uppercase text-ink-800">
                    Bayrak Devleti (Flag State)
                  </label>
                  <select
                    value={flagState}
                    onChange={(e) => setFlagState(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                  >
                    {COMMON_FLAGS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brüt Tonaj */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-ink-800">
                      Brüt Tonaj (Gross Tonnage - GT)
                    </label>
                    <span className="text-[10px] font-bold text-slate-500">Örn: 16500 veya 16.500</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={grossTonnage}
                    onChange={(e) => {
                      setGrossTonnage(e.target.value);
                      if (stepError) setStepError(null);
                    }}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 font-mono text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                  />
                  <div className="mt-1 text-[11px] font-bold text-slate-700">
                    {isGtEtsMandatory ? "✓ 5.000 GT üzeri zorunlu kapsam" : "⚠️ 5.000 GT altı gönüllü/kısmi"}
                  </div>
                </div>

                {/* Gemi Tipi */}
                <div>
                  <label className="text-xs font-black uppercase text-ink-800">
                    Gemi Tipi (Ship Type)
                  </label>
                  <select
                    value={shipType}
                    onChange={(e) => setShipType(e.target.value as ShipType)}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                  >
                    <option value="container">Konteyner Gemisi (Container ship)</option>
                    <option value="bulk_carrier">Dökme Yük Gemisi (Bulk carrier)</option>
                    <option value="general_cargo">Genel Kargo (General cargo)</option>
                    <option value="tanker">Tanker (Ham Petrol / Kimyasal)</option>
                    <option value="ro_ro">Ro-Ro / Araç Taşıyıcı</option>
                    <option value="passenger">Yolcu / Kruvaziyer</option>
                  </select>
                </div>

                {/* Buz Sınıfı */}
                <div>
                  <label className="text-xs font-black uppercase text-ink-800">
                    Buz Sınıfı (Ice Class)
                  </label>
                  <select
                    value={iceClass}
                    onChange={(e) => setIceClass(e.target.value as IceClass)}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                  >
                    <option value="none">Buz Sınıfı Yok (None)</option>
                    <option value="IC">IC (Hafif Buz)</option>
                    <option value="IB">IB (Orta Buz)</option>
                    <option value="IA">IA (Ağır Buz)</option>
                    <option value="IAS">IA Super (Kutup/Baltık)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adım 2: Sefer & Coğrafi Kapsam */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-line/60 pb-3">
              <h3 className="text-base font-black text-ink-900 flex items-center gap-2">
                <Compass className="h-5 w-5 text-sky-800" /> Adım 2: Sefer Parametreleri & Coğrafi Kapsam
              </h3>
              <p className="mt-0.5 text-xs text-ink-600">
                AB Direktifi 2023/957 Madde 3ga uyarınca liman uğrakları ve kapsam payı:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Raporlama Yılı */}
              <div>
                <label className="text-xs font-black uppercase text-ink-800">
                  Raporlama Takvim Yılı
                </label>
                <select
                  value={reportingYear}
                  onChange={(e) => setReportingYear(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                >
                  <option value={2025}>2025 (EU ETS %70 + FuelEU Başlangıç - %2 Hedef)</option>
                  <option value={2026}>2026 (EU ETS %100 Tam Kapsam)</option>
                  <option value={2024}>2024 (EU ETS %40 Geçiş Yılı)</option>
                </select>
              </div>

              {/* Yıllık Sefer Sayısı */}
              <div>
                <label className="text-xs font-black uppercase text-ink-800">
                  AB Liman Uğraklı Yıllık Sefer Sayısı
                </label>
                <input
                  type="text"
                  required
                  value={annualVoyages}
                  onChange={(e) => {
                    setAnnualVoyages(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 font-mono text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              {/* Kalkış Limanı */}
              <div>
                <label className="text-xs font-black uppercase text-ink-800">
                  Kalkış Limanı (Departure Port)
                </label>
                <select
                  value={departurePortCode}
                  onChange={(e) => setDeparturePortCode(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                >
                  {DEPARTURE_PORTS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.labelTr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Varış Limanı */}
              <div>
                <label className="text-xs font-black uppercase text-ink-800">
                  Varış Limanı (Arrival Port)
                </label>
                <select
                  value={arrivalPortCode}
                  onChange={(e) => setArrivalPortCode(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                >
                  {ARRIVAL_PORTS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.labelTr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Canlı Kapsam Özeti */}
            <div className="rounded-2xl border-2 border-sky-900/15 bg-slate-50 p-4 text-xs space-y-1.5">
              <div className="font-black text-slate-900">Coğrafi Kapsam ve Yetki Kararı:</div>
              <div className="text-slate-800">
                • <strong>Kapsam Oranı:</strong> %{scopeResult.scopeRatio * 100} (
                {scopeResult.scopeRatio === 1.0
                  ? "AB İçi Sefer — %100 Kapsam"
                  : scopeResult.scopeRatio === 0.5
                  ? "Üçüncü Ülke <-> AB Seferi — %50 Kapsam"
                  : "AB Dışı Sefer — Kapsam Dışı"}
                )
              </div>
              <div className="text-slate-800">
                • <strong>Atanan Yönetici Otorite:</strong> {administeringAuthority.assignedMemberState} Ulusal İdaresi ({administeringAuthority.legalBasis})
              </div>
              {arrivalPortObj.isNeighbouringContainerTransshipment && (
                <div className="text-amber-800 font-bold">
                  ⚠️ Dikkat: Komşu aktarma limanı kuralı (IR 2025/1127) uygulanmaktadır.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Adım 3: Yakıt, Tüketim & Doğrulayıcı (Verifier) */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-line/60 pb-3">
              <h3 className="text-base font-black text-ink-900 flex items-center gap-2">
                <Fuel className="h-5 w-5 text-sky-800" /> Adım 3: Yakıt, Tüketim ve Doğrulayıcı Seçimi
              </h3>
              <p className="mt-0.5 text-xs text-ink-600">
                Bunker Delivery Note (BDN) kayıtları ve akredite denetçi (verifier) bilgileri:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Ana Yakıt Türü */}
              <div>
                <label className="text-xs font-black uppercase text-ink-800">
                  Ana Yakıt Türü (Primary Fuel)
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                >
                  <option value="VLSFO">VLSFO (%0.50 Sülfür Fuel Oil - LCV 41.0 MJ/kg)</option>
                  <option value="LSMGO">LSMGO (%0.10 Sülfür Gaz Yağı - LCV 42.7 MJ/kg)</option>
                  <option value="HFO">HFO (Ağır Yakıt - Scrubber Donanımlı)</option>
                  <option value="LNG_OTTO_MEDIUM_SPEED">LNG (Sıvılaştırılmış Doğal Gaz - Otto)</option>
                  <option value="LNG_DIESEL">LNG (Dizel Çevrim - Düşük Metan Kaçağı)</option>
                </select>
              </div>

              {/* Yıllık Tüketim */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-ink-800">
                    Yıllık Tüketim (Metrik Ton)
                  </label>
                  <span className="text-[10px] font-bold text-slate-500">Örn: 1200 veya 1.200</span>
                </div>
                <input
                  type="text"
                  required
                  value={fuelQuantity}
                  onChange={(e) => {
                    setFuelQuantity(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 font-mono text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              {/* Biyoyakıt Karışımı */}
              <div>
                <label className="text-xs font-black uppercase text-ink-800">
                  Sürdürülebilir Biyoyakıt (Ton - Opsiyonel)
                </label>
                <input
                  type="text"
                  value={bioFuelQuantity}
                  onChange={(e) => setBioFuelQuantity(e.target.value)}
                  placeholder="0"
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 font-mono text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              {/* Sahil Elektriği (OPS) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-ink-800">
                    Kıyı Elektriği (OPS - Shore Power)
                  </label>
                  <input
                    type="checkbox"
                    checked={useShorePower}
                    onChange={(e) => setUseShorePower(e.target.checked)}
                    className="h-4 w-4 rounded text-sky-600"
                  />
                </div>
                {useShorePower ? (
                  <input
                    type="text"
                    value={opsElectricityKWh}
                    onChange={(e) => setOpsElectricityKWh(e.target.value)}
                    placeholder="Tüketilen kWh (örn. 45000)"
                    className="mt-1.5 w-full rounded-xl border-2 border-sky-400 py-2 px-3 font-mono text-xs font-bold text-ink-900 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1.5 text-[11px] text-ink-600">
                    Liman kalışlarında karadan elektrik alındıysa işaretleyin.
                  </p>
                )}
              </div>
            </div>

            {/* Akredite Doğrulayıcı & İzleme Planı Onayı */}
            <div className="rounded-2xl border-2 border-sky-900/15 bg-white p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-950">
                <ShieldCheck className="h-4 w-4 text-sky-800" />
                <span>Akredite Doğrulayıcı (Verifier) & İzleme Planı (MP)</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-black uppercase text-ink-800">
                    Akredite Doğrulayıcı Kuruluş
                  </label>
                  <select
                    value={selectedVerifierIndex}
                    onChange={(e) => setSelectedVerifierIndex(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 py-2.5 px-3 text-xs font-bold text-ink-900 focus:border-sky-600 focus:outline-none"
                  >
                    {VERIFIER_OPTIONS.map((v, i) => (
                      <option key={i} value={i}>
                        {v.name} ({v.accreditationNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-ink-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mrvPlanAssessed}
                      onChange={(e) => setMrvPlanAssessed(e.target.checked)}
                      className="h-4 w-4 rounded text-sky-600"
                    />
                    <span>MRV İzleme Planı (MP) akredite verifier tarafından onaylandı</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-ink-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fuelEuPlanAssessed}
                      onChange={(e) => setFuelEuPlanAssessed(e.target.checked)}
                      className="h-4 w-4 rounded text-sky-600"
                    />
                    <span>FuelEU İzleme Planı (IR 2024/2031) şablonu hazırlandı</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Kanıt Dosyaları Yükleme */}
            <div className="rounded-2xl border-2 border-sky-900/15 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-sky-950 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-sky-800" />
                  Kanıt Belgesi Ekle (BDN / Logbook / Sertifika)
                </span>
                <span className="rounded-md bg-sky-100 border border-sky-300 px-2 py-0.5 text-[10px] font-black text-sky-950">
                  Web Crypto SHA-256
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2.5">
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-sky-50 border-2 border-sky-800/30 px-4 py-2.5 text-xs font-black text-sky-950 hover:bg-sky-100 transition">
                  <UploadCloud className="h-4 w-4 text-sky-800" />
                  BDN Faturası Ekle (PDF)
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg"
                    onChange={(e) => handleFileUpload(e, "BDN Faturası")}
                  />
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-50 border-2 border-slate-300 px-4 py-2.5 text-xs font-black text-ink-900 hover:bg-slate-100 transition">
                  <UploadCloud className="h-4 w-4 text-slate-700" />
                  Jurnal / Logbook Ekle (PDF)
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg"
                    onChange={(e) => handleFileUpload(e, "Makine Jurnali")}
                  />
                </label>
              </div>

              {isHashing && (
                <div className="mt-2 text-xs font-bold text-sky-900 animate-pulse">
                  SHA-256 kriptografik özeti hesaplanıyor...
                </div>
              )}

              {evidences.length > 0 && (
                <div className="mt-3 space-y-2">
                  {evidences.map((ev, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 text-xs flex items-center justify-between"
                    >
                      <div className="truncate">
                        <span className="font-bold text-emerald-950">{ev.fileName}</span>
                        <span className="ml-2 font-mono text-[10px] text-emerald-800">
                          {ev.sha256Hash.slice(0, 24)}...
                        </span>
                      </div>
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        ✓ Mühürlendi
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Adım 4: Canlı Mevzuat Doğrulama Raporu & Çıktılar */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b border-line/60 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-ink-900 flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-sky-800" /> Adım 4: Klas Doğrulamasına Hazır Yasal Çıktı
                </h3>
                <p className="mt-0.5 text-xs text-ink-600">
                  EU ETS ve FuelEU mevzuat motorlarının ürettiği kesin yasal değerler ve doğrulayıcı paketi:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-900/30 bg-white px-3.5 py-1.5 text-xs font-bold text-sky-950 hover:bg-slate-50 transition shadow-xs"
              >
                <Eye className="h-4 w-4 text-sky-800" /> Rapor Önizleme
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* EU ETS Paneli */}
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-950">
                    EU ETS Teslim Yükümlülüğü
                  </span>
                  <span className="rounded-md bg-amber-200 px-2 py-0.5 text-[10px] font-black text-amber-900">
                    %{etsResult.phaseInPercentage} Phase-in
                  </span>
                </div>
                <div className="mt-3 text-3xl font-black text-amber-950">
                  {etsResult.surrenderEua} EUA
                </div>
                <div className="text-xs text-amber-900 font-semibold mt-1">
                  Kapsamdaki Emisyon: {etsResult.scopedCo2} tCO₂e
                </div>
                <div className="mt-2 rounded-xl border border-amber-300 bg-white/80 p-2.5 text-xs font-black text-amber-950">
                  Tahmini Finansal Maliyet: €{etsResult.estimatedCostEur.toLocaleString("tr-TR")}
                </div>
              </div>

              {/* FuelEU Paneli */}
              <div className="rounded-2xl border-2 border-sky-300 bg-sky-50/70 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-sky-950">
                    FuelEU Maritime Uyum Durumu
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                      fuelEuResult.isCompliant
                        ? "bg-emerald-200 text-emerald-950"
                        : "bg-rose-200 text-rose-950"
                    }`}
                  >
                    {fuelEuResult.isCompliant ? "✓ Uyum Sağlandı" : "⚠️ Ceza Riski"}
                  </span>
                </div>
                <div className="mt-3 text-3xl font-black text-sky-950">
                  {fuelEuResult.actualGhgIntensity} <span className="text-sm font-bold text-sky-800">gCO₂eq/MJ</span>
                </div>
                <div className="text-xs text-sky-900 font-semibold mt-1">
                  Yasal Hedef: {fuelEuResult.targetGhgIntensity} gCO₂eq/MJ
                </div>
                <div className="mt-2 rounded-xl border border-sky-300 bg-white/80 p-2.5 text-xs font-black text-emerald-900">
                  {fuelEuResult.isCompliant ? "✓ Ceza Tutarı: 0 €" : `Cezai Yükümlülük: €${fuelEuResult.compliancePenaltyEur}`}
                </div>
              </div>
            </div>

            {/* Doğrudan İndirme Barı */}
            <div className="rounded-2xl border-2 border-sky-900/15 bg-white p-4 space-y-3">
              <span className="text-xs font-black uppercase text-slate-900 block">
                Doğrulayıcı Teslimat Dosyaları (Hemen İndir):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadTrPdf}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  <FileText className="h-4 w-4 text-rose-700" /> Türkçe PDF
                </button>
                <button
                  type="button"
                  onClick={handleDownloadEnPdf}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  <FileText className="h-4 w-4 text-rose-700" /> English PDF
                </button>
                <button
                  type="button"
                  onClick={handleDownloadThetisXml}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  <FileCheck2 className="h-4 w-4 text-sky-700" /> THETIS XML
                </button>
                <button
                  type="button"
                  onClick={handleDownloadFuelEuJson}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  <Fuel className="h-4 w-4 text-amber-700" /> FuelEU JSON
                </button>
                <button
                  type="button"
                  onClick={handleDownloadLedgerCsv}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  <Compass className="h-4 w-4 text-emerald-700" /> Sefer CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex items-center justify-between border-t border-line pt-5">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="rounded-xl border-2 border-slate-300 bg-white px-5 py-2.5 text-xs font-black text-ink-800 hover:bg-slate-50 transition shadow-xs"
            >
              Geri Dön
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-900 px-6 py-3 text-xs font-black text-white hover:bg-sky-800 shadow-md transition"
            >
              Sonraki Adıma Geç <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-7 py-3 text-xs font-black text-white hover:bg-emerald-600 shadow-md transition"
            >
              <Lock className="h-4 w-4" /> Dosyayı Kilitle ve Mühürlü Paketi Gör
            </button>
          )}
        </div>
      </form>

      {/* Önizleme Modalı */}
      <MaritimeReportPreviewModal
        dossier={currentDossier}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownloadTrPdf={handleDownloadTrPdf}
        onDownloadEnPdf={handleDownloadEnPdf}
        onDownloadXml={handleDownloadThetisXml}
      />
    </div>
  );
}

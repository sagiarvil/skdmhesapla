import crypto from "crypto";
import { validateSealRegisterSnapshot } from "./registerValidation";
import { deMinimisVerdictFor, SkdmCalculationResult } from "./calculator";
import { SKDM_RULESET_VERSION } from "./config";
import { checkTaxIdField } from "./qc";
import { matchPrefix, normalizeCn } from "./annex-ruleset";
import { trUpper } from "./tr-locale";
import {
  base64ToBytes,
  bytesToBase64,
  csvToXlsxBytes,
  paginateRichLines,
  richPagesToPdfBytes,
  type PdfLine,
} from "./seal-binary";
import {
  buildKapsamliRaporGirdisi,
  kapsamliDurumRaporuPdfBytes,
} from "./pdf/kapsamliDurumRaporu";
import type { GoodRow, PrecRow, ProcessRow, StreamRow } from "./session-store";
import { filenamesForAudience, type PackageAudience } from "./package-manifest";
import { REG_REF } from "./regulatoryRefs";

/** Rich layout yardımcıları — tüm mühür PDF'leri aynı premium standardı kullanır. */
const kv = (key: string, val: string): PdfLine => ({ type: "kv", key, val });
const body = (text: string): PdfLine => ({ type: "body", text });
const note = (text: string): PdfLine => ({ type: "note", text });
const bullet = (text: string): PdfLine => ({ type: "bullet", text });
const spacer = (size?: number): PdfLine => ({ type: "spacer", size });
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

type FormalSection = { num: string; title: string; lines: PdfLine[] };

/** PdfLine → düz metin (PDF UTF-8 gövde yorumu / metin çıkarımı için). */
function pdfLineToPlain(line: PdfLine): string {
  switch (line.type) {
    case "kv":
      return `${line.key}: ${line.val}`;
    case "body":
    case "note":
      return line.text;
    case "bullet":
      return `- ${line.text}`;
    case "table-h":
    case "table-r":
      return line.cols.join(" | ");
    case "metric":
      return `${line.label}: ${line.value}`;
    default:
      return "";
  }
}

/** Kapak + bölüm çipli bölümler + alt bilgi: paketteki yardımcı raporların ortak üreticisi. */
function formalReportPdfBytes(
  meta: { title: string; subtitle: string; badge: string; facts: { key: string; val: string }[] },
  sections: FormalSection[],
  footer: string
): Uint8Array {
  const L: PdfLine[] = [
    { type: "cover", title: meta.title, subtitle: meta.subtitle, badge: meta.badge, facts: meta.facts },
    { type: "page-break" },
  ];
  for (const s of sections) {
    L.push({ type: "section", text: s.title, num: s.num });
    for (const ln of s.lines) L.push(ln);
  }
  const plainBody = [
    meta.title,
    meta.subtitle,
    `Paket: ${meta.badge}`,
    ...sections.flatMap((s) => [`${s.num} · ${s.title}`, ...s.lines.map(pdfLineToPlain)]),
  ].join("\n");
  return richPagesToPdfBytes(
    paginateRichLines(L),
    {
      title: `SKDMHESAPLA  |  ${meta.title}`,
      footer,
    },
    plainBody
  );
}

export interface SealedFileEntry {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  /** utf8 metin veya base64 (contentEncoding=base64) */
  content: string;
  contentEncoding?: "utf8" | "base64";
}

export function sealedFileBytes(file: SealedFileEntry): Uint8Array {
  if (file.contentEncoding === "base64") return base64ToBytes(file.content);
  return new TextEncoder().encode(file.content);
}

/** Plan 20: mühür anındaki register anlık görüntüsü (G/P/B/E/D). */
export type SealRegisterSnapshot = {
  sessionId?: string;
  sectorSlug?: string;
  goods?: GoodRow[];
  processes?: ProcessRow[];
  streams?: StreamRow[];
  precs?: PrecRow[];
  dProcesses?: { a: number; b: number; c: number; d: number };
  fieldValues?: Record<string, string>;
};

export interface SealedPackageOutput {
  packageId: string;
  timestamp: string;
  rulesetVersion: string;
  engineVersion: string;
  masterHash: string;
  files: SealedFileEntry[];
  manifesto: {
    packageId: string;
    timestamp: string;
    engineVersion: string;
    rulesetVersion: string;
    usedEtsPrice: number;
    etsQuarter: string;
    sectorId: string;
    productionVolume: number;
    filesHashes: Record<string, string>;
    packageSignature: string;
  };
  signedDownloadUrl: string;
  /** STORE yöntemiyle üretilmiş ZIP (istemci/sunucu ortak) */
  zipBytes?: Uint8Array;
  zipFilename?: string;
}

/** CRC-32 (ZIP uyumlu) — ek bağımlılık yok */
function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c ^= bytes[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function u16(n: number): Uint8Array {
  const b = new Uint8Array(2);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  return b;
}

function u32(n: number): Uint8Array {
  const b = new Uint8Array(4);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  b[2] = (n >>> 16) & 0xff;
  b[3] = (n >>> 24) & 0xff;
  return b;
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

/**
 * Madde 2 — mühürlü paketi ZIP (STORE) olarak üretir (dosya sayısı: package-manifest SSOT).
 * Deterministik: aynı dosya içerikleri → aynı ZIP baytları (dosya sırası sabit).
 * GATE-M4: `files` verilirse yalnız o kitleye ait dosyalarla ZIP üretilir.
 */
export function buildSealedZipUint8Array(
  pkg: SealedPackageOutput,
  files?: SealedFileEntry[]
): Uint8Array {
  const entries = files ?? pkg.files;
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of entries) {
    const nameBytes = encoder.encode(file.filename);
    const dataBytes = sealedFileBytes(file);
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    const localHeader = concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0), // STORE
      u16(0),
      u16(0),
      u32(crc),
      u32(size),
      u32(size),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
    ]);

    localParts.push(localHeader, dataBytes);

    const centralHeader = concatBytes([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(size),
      u32(size),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBytes,
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const localBlob = concatBytes(localParts);
  const centralBlob = concatBytes(centralParts);
  const end = concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(entries.length),
    u16(entries.length),
    u32(centralBlob.length),
    u32(localBlob.length),
    u16(0),
  ]);

  return concatBytes([localBlob, centralBlob, end]);
}

/**
 * GATE-M4 (RM-005) — kitleye göre teslimat seti.
 * "Yalnızca doğrulayıcı" etiketli dosyalar alıcı (buyer) setinden manifest
 * SSOT üzerinden filtrelenir; manuel liste veya dokümantasyon güvencesi yok.
 */
export function sealedFilesForAudience(
  pkg: SealedPackageOutput,
  audience: PackageAudience
): SealedFileEntry[] {
  const allowed = filenamesForAudience(audience);
  return pkg.files.filter((f) => allowed.has(f.filename));
}

export function buildSealedZipForAudience(
  pkg: SealedPackageOutput,
  audience: PackageAudience
): Uint8Array {
  return buildSealedZipUint8Array(pkg, sealedFilesForAudience(pkg, audience));
}


/** Deterministik mühür (test / yeniden indirme) — opsiyonel sabit kimlik. */
export type SealMeta = {
  packageId?: string;
  timestamp?: string;
};

/**
 * GATE-J (RM-006): Doğrulayıcı Çalışma Alanı CSV — satır-bazlı, birebir.
 * Her G/B/E register satırı kendi kontrol satırını üretir (kendi CN/rota/verisi);
 * eksik veride "Gözden Geçirilmeli" (FAILED karşılığı) ve "Belirtilmedi"
 * (VERİ YOK karşılığı) durumları üretilir. İçerik mühür akışından bağımsız
 * test edilebilir (INV-5: tek tanım, iki yer).
 */
export function buildVerifierWorksheetCsv(
  result: SkdmCalculationResult,
  reg: SealRegisterSnapshot,
  footerText: string
): string {
  const cvsafe = (v: unknown): string => {
    const s = String(v ?? "-").replace(/,/g, ";").trim();
    return s.length > 0 ? s : "-";
  };
  const sectorId = result.sector.id;
  const cnCheckRows = (reg.goods || [])
    .map((g, i) => {
      const cn = cvsafe(g.cn);
      const kapsamda = cn !== "-" && matchPrefix(normalizeCn(g.cn))?.sector === sectorId;
      return `G${i + 1},GTİP / CN Kod Eşleşmesi,${kapsamda ? "Kayıtlı" : "Gözden Geçirilmeli"},CN ${cn} | ${cvsafe(g.category)} | Rota: ${cvsafe(g.route)}`;
    })
    .join("\n");
  const streamCheckRows = (reg.streams || [])
    .map((s, i) => {
      const tam = cvsafe(s.method) !== "-" && cvsafe(s.name) !== "-" && Number.isFinite(Number(s.ad));
      return `B${i + 1},Kaynak Akışı Beyanı,${tam ? "Kayıtlı" : "Gözden Geçirilmeli"},${cvsafe(s.method)} | ${cvsafe(s.name)} | AD=${cvsafe(s.ad)} ${cvsafe(s.unit)} | NCV=${cvsafe(s.ncv)} | P=${cvsafe(s.processId)}`;
    })
    .join("\n");
  const precCheckRows = (reg.precs || [])
    .map((p, i) => {
      const tam = cvsafe(p.name) !== "-" && cvsafe(p.source) !== "-" && Number.isFinite(Number(p.see));
      return `E${i + 1},Öncül Madde Beyanı,${tam ? "Kayıtlı" : "Gözden Geçirilmeli"},${cvsafe(p.name)} | toplam=${cvsafe(p.total)} | iç=${cvsafe(p.internal)} | dış=${cvsafe(p.other)} | kaynak=${cvsafe(p.source)} | SEE=${cvsafe(p.see)}`;
    })
    .join("\n");
  const dEq = reg.dProcesses
    ? reg.dProcesses.a === reg.dProcesses.b + reg.dProcesses.c + reg.dProcesses.d
      ? "Kayıtlı"
      : "Gözden Geçirilmeli"
    : "Belirtilmedi";
  return `Doğrulayıcı Çalışma Alanı (Verifier Worksheet)
Adım,Kontrol Noktası,Sonuç,Not
${cnCheckRows}
${streamCheckRows}
${precCheckRows}
1,Sevkiyat Hacmi Ölçümü,Kayıtlı,${result.productionVolume} ${result.sector.unit}
2,Kapsam 1${result.sector.scope2DefaultApplicable ? " & 2" : ""} Hesaplaması,Kayıtlı,${result.totalEmissions.toFixed(2)} tCO2e (K1=${result.scope1TotalEmissions.toFixed(2)}${result.sector.scope2DefaultApplicable ? `; K2=${result.scope2TotalEmissions.toFixed(2)}` : "; K2 fatura dışı Annex II"})
3,Ruleset Çeyreklik ETS Fiyatı,Kayıtlı,${result.euEtsPriceEur} EUR (${result.etsQuarter})
4,Audit SHA-256 Bütünlük,Kayıtlı,${result.audit.hash}
5,Register G/P/B/E doluluk,${(reg.goods || []).length > 0 && (reg.processes || []).length > 0 && (reg.streams || []).length > 0 ? "Kayıtlı" : "Gözden Geçirilmeli"},G=${(reg.goods || []).length} P=${(reg.processes || []).length} B=${(reg.streams || []).length} E=${(reg.precs || []).length}
6,D_Processes a=b+c+d,${dEq},${reg.dProcesses ? `a=${reg.dProcesses.a} b=${reg.dProcesses.b} c=${reg.dProcesses.c} d=${reg.dProcesses.d}` : "—"}
7,Register satır eşleşmesi,${(reg.goods || []).length + (reg.streams || []).length + (reg.precs || []).length > 0 ? "Kayıtlı" : "Gözden Geçirilmeli"},Kontrol satırı=${(reg.goods || []).length + (reg.streams || []).length + (reg.precs || []).length} (G=${(reg.goods || []).length} B=${(reg.streams || []).length} E=${(reg.precs || []).length})
${footerText}`;
}

export function createSealedAuditPackage(
  result: SkdmCalculationResult,
  registers?: SealRegisterSnapshot,
  meta?: SealMeta
): SealedPackageOutput {
  // Fail-Closed QC Controls: Case Readiness Score must be %100
  if (result.readinessScore < 100) {
    throw new Error("Fail-Closed QC: Hazırlık skoru %100 olmadan paket mühürlenemez.");
  }

  // GATE-M1 (RM-005) + GATE-1 (RM-007): tüzel kişi unvanı + geçersiz VKN → engelleyici, mühürleme durdurulur.
  const fvQc = registers?.fieldValues || {};
  const fvTuru =
    fvQc.isletmeTuru === "turel" || fvQc.isletmeTuru === "sahis" ? fvQc.isletmeTuru : undefined;
  const taxIdBlocking = checkTaxIdField(
    fvQc.tesisAdiTR || fvQc.vFirma,
    fvQc.vkn,
    fvTuru,
    fvQc.isletmeTuru
  ).some((f) => f.severity === "blocking");
  if (taxIdBlocking) {
    throw new Error(
      "Fail-Closed QC: Vergi kimlik numarası unvan/işletme türü ile uyumlu değil — tüzel kişi için 10 haneli VKN, şahıs firması için 11 haneli T.C. kimlik numarası gerekir; mühürleme engelli."
    );
  }

  // GATE-A (RM-006): satır bazlı mutabakat — Σ(steps) === totalEmissions zorunludur.
  // INV-1: girdi verisinden türetilemeyen toplam emisyonla paket mühürlenemez.
  const emissionStepSum = result.emissionSteps.reduce((acc, s) => acc + s.emissions, 0);
  if (
    result.emissionSteps.length === 0 ||
    Math.abs(emissionStepSum - result.totalEmissions) > 1e-6
  ) {
    throw new Error(
      `Fail-Closed Reconciliation (GATE-A): Satır bazlı emisyon toplamı (${emissionStepSum.toFixed(2)} tCO2e) beyan edilen toplamla (${result.totalEmissions.toFixed(2)} tCO2e) eşit değil; mühürleme engelli.`
    );
  }

  const timestamp = meta?.timestamp || new Date().toISOString();
  const packageId =
    meta?.packageId ||
    `SEAL-${Date.now()}-${trUpper(crypto.randomBytes(4).toString("hex"))}`;
  const engineVersion = "skdm-calc-v2026.1";
  const rulesetVersion = SKDM_RULESET_VERSION;

  const headerFooterText = `SKDMHesapla | Engine: ${engineVersion} | Ruleset: ${rulesetVersion} | Hash: ${result.audit.hash} | ${timestamp}`;

  const reg = registers || {};
  // GATE-S (RM-007): PDF/XLSX üretimine girmeden önce register'ı doğrula.
  // Birinci savunma hattı — hata burada net bir Türkçe mesajla durur,
  // formatlayıcıların derinliklerinde stack trace olarak patlamaz.
  validateSealRegisterSnapshot(reg);

  // File 0 / 12: Kapsamlı Durum Raporu (A'dan Z'ye özet)
  const kapsamliGirdi = buildKapsamliRaporGirdisi(result, reg, {
    packageId,
    timestamp,
    engineVersion,
    rulesetVersion,
    packageHash: result.audit.hash,
  });
  const pdfKapsamli = kapsamliDurumRaporuPdfBytes(kapsamliGirdi);

  const fv = reg.fieldValues || {};
  const pdfFooter = `${packageId}  |  skdmhesapla.com/dogrula/`;

  // File 1: Denetime-Hazirlik-Dosyasi.pdf (Ana İnceleme Raporu)
  const pdf1 = formalReportPdfBytes(
    {
      title: "DENETİME HAZIRLIK DOSYASI",
      subtitle: "AB 2023/956 & 2025/2083 Omnibus-I — İdari kimlik ve yönetici özeti",
      badge: packageId,
      facts: [
        { key: "İŞLETME", val: fv.tesisAdiTR || fv.vFirma || "—" },
        { key: "VKN", val: fv.vkn || "—" },
        { key: "TESİS (EN)", val: fv.tesisAdiEN || "—" },
        { key: "UNLOCODE", val: fv.unlocode || "—" },
        { key: "SEKTÖR", val: result.sector.name },
        { key: "PAKET", val: packageId },
      ],
    },
    [
      {
        num: "01",
        title: "KİMLİK",
        lines: [
          kv("Paket", packageId),
          kv("Tarih", timestamp),
          kv("Oturum", reg.sessionId || "—"),
          kv("İşletme", fv.tesisAdiTR || fv.vFirma || "—"),
          kv("VKN", fv.vkn || "—"),
          kv("Tesis (EN)", fv.tesisAdiEN || "—"),
          kv("UNLOCODE", fv.unlocode || "—"),
          kv("Yetkili", fv.yetkili || "—"),
          kv("Sektör", `${result.sector.name} (${result.sector.id})`),
          kv("Sektör slug", reg.sectorSlug || result.sector.id),
          kv("İhraç hacmi", `${result.productionVolume} ${result.sector.unit}`),
          kv("Beyan yılı", `${result.year}`),
        ],
      },
      {
        num: "02",
        title: "REGISTER ÖZETİ (G / P / B / E)",
        lines: [
          kv("Mal kategorisi (G)", `${(reg.goods || []).length}`),
          kv("Üretim süreci (P1–P10)", `${(reg.processes || []).length}`),
          kv("Kaynak akışı (B_EmInst)", `${(reg.streams || []).length}`),
          kv("Öncül madde (E_PurchPrec)", `${(reg.precs || []).length}`),
          ...(reg.dProcesses
            ? [kv("D_Processes", `a=${reg.dProcesses.a} b=${reg.dProcesses.b} c=${reg.dProcesses.c} d=${reg.dProcesses.d} (b+c+d=${reg.dProcesses.b + reg.dProcesses.c + reg.dProcesses.d})`)]
            : []),
        ],
      },
      {
        num: "03",
        title: "HESAPLAMA SONUÇLARI",
        lines: [
          kv("Alıcının üstleneceği tahmini SKDM maliyeti", `€${result.importerCostEur.toFixed(2)} (~ TL${result.importerCostTry.toFixed(0)})`),
          kv("Yükümlü emisyon", `${result.liableEmissions.toFixed(2)} tCO2e`),
          kv("Çeyreklik elde tutma (%50)", `${result.quarterlyHoldingEmissions.toFixed(2)} tCO2e`),
          kv("Ruleset ETS fiyatı", `${result.euEtsPriceEur} € / tCO2e (${result.etsQuarter})`),
          kv("TR ETS mahsup", `${result.trEtsNettingEur} € / tCO2e`),
          kv("De minimis", deMinimisVerdictFor(result).label),
        ],
      },
      {
        num: "04",
        title: "HUKUKİ BİLDİRİM",
        lines: [note("SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır.")],
      },
    ],
    pdfFooter
  );

  // File 2: Emisyon-Hesaplama-Eki.pdf — GATE-A: satır bazlı mutabakat.
  const dataQualityLabel =
    result.emissionDataQuality === "dogrudan-olcum"
      ? "Gerçek tesis verisi / çözümlenmiş kaynak akışı"
      : "Varsayılan değer kullanıldı";
  const pdf2 = formalReportPdfBytes(
    {
      title: "EMİSYON HESAPLAMA EKİ",
      subtitle: "Spesifik gömülü emisyon (SEE) özeti — satır bazlı mutabakat",
      badge: packageId,
      facts: [
        { key: "SEKTÖR", val: result.sector.name },
        { key: "VERİ KALİTESİ", val: dataQualityLabel },
        { key: "KAPSAM 1", val: `${result.scope1TotalEmissions.toFixed(2)} tCO2e` },
        { key: "KAPSAM 2", val: `${result.scope2TotalEmissions.toFixed(2)} tCO2e` },
        { key: "TOPLAM", val: `${result.totalEmissions.toFixed(2)} tCO2e` },
        { key: "PAKET", val: packageId },
      ],
    },
    [
      {
        num: "01",
        title: "SATIR BAZLI HESAP",
        lines: [
          tblH(["#", "Kaynak akışı", "Hesap (faaliyet verisi × NCV × EF)", "tCO2e"], [0.55, 1.25, 2.35, 0.85], [4]),
          ...result.emissionSteps.map((s, i) =>
            tblR(i % 2 === 0, [`${i + 1}`, s.label, s.formula, s.emissions.toFixed(2)], [0.55, 1.25, 2.35, 0.85], [4])
          ),
          tblR(false, ["", "TOPLAM", "Σ satır hesapları", result.totalEmissions.toFixed(2)], [0.55, 1.25, 2.35, 0.85], [4]),
          spacer(5),
          note(
            `Mutabakat (GATE-A): Σ(satır hesapları) = ${result.emissionSteps.reduce((a, s) => a + s.emissions, 0).toFixed(2)} tCO2e, beyan edilen toplam ${result.totalEmissions.toFixed(2)} tCO2e ile kuruşu kuruşuna eşittir.`
          ),
          note(
            result.emissionDataQuality === "varsayilan-deger"
              ? "Kapsam 1/2 için akış kaydı çözümlenemedi; sektör varsayılan yoğunluğu kullanılmıştır. Bu, 'Doğrudan ölçüm' veri kalitesi kademesi DEĞİLDİR — mutabakat yalnız varsayılan satır üzerinden kurulmuştur."
              : "Veri kalitesi kademesi gerçek tesis verisidir: satırlar kullanıcının kaynak akışı/sayaç/fatura girdisinden türetilmiştir; bu ifade bağımsız ölçüm doğrulaması anlamına gelmez."
          ),
        ],
      },
      {
        num: "02",
        title: "FAKTÖR KAYNAKLARI",
        lines: [
          ...result.emissionSteps.map((s, i) => body(`${i + 1}. ${s.label}: ${s.factorSource}`)),
          body(`${result.emissionSteps.length + 1}. AB varsayılan karşılaştırması: ${result.sector.applicableRegulation}`),
        ],
      },
      {
        num: "03",
        title: "YOĞUNLUKLAR",
        lines: [
          kv("Kapsam 1 (doğrudan)", `${result.directEmissionIntensity.toFixed(3)} tCO2e/${result.sector.unit}`),
          kv("Kapsam 2 (dolaylı elektrik)", `${result.indirectEmissionIntensity.toFixed(3)} tCO2e/${result.sector.unit}`),
          kv("Toplam emisyon yoğunluğu (SEE)", `${result.totalEmissionIntensity.toFixed(3)} tCO2e/${result.sector.unit}`),
        ],
      },
      {
        num: "04",
        title: "MİKTARLAR",
        lines: [
          kv("Toplam emisyon", `${result.totalEmissions.toFixed(2)} tCO2e`),
          kv("Öncül madde gömülü emisyonu", `${result.precursorEmbeddedEmissions.toFixed(2)} tCO2e`),
          kv("Ücretsiz tahsisat oranı", `%${(result.freeAllocationRatio * 100).toFixed(1)}`),
          kv("AB varsayılan (default) yoğunluk", `${(result.defaultBenchmark.directEmissionIntensity + result.defaultBenchmark.indirectEmissionIntensity).toFixed(2)} tCO2e/${result.sector.unit}`),
        ],
      },
    ],
    pdfFooter
  );

  // File 3: Kanit-Kayit-Defteri.xlsx
  // GATE-B (RM-006 / INV-2): "Kanıt Durumu" sütunu yalnız 4 değer alabilir:
  // Kullanıcı beyanı | Belge yüklendi | Belge yüklenmedi | Varsayılan değer kullanıldı.
  // Sistem akredite doğrulama görüşü üretmediği için "Doğrulama kanıtı" satırı
  // her zaman "Belge yüklenmedi" olur ve eksiklik olarak görünür.
  const defaultKademe =
    result.emissionDataQuality === "varsayilan-deger"
      ? "Varsayılan değer kullanıldı"
      : "Kullanıcı beyanı";
  const goodsLines = (reg.goods || [])
    .map((g, i) => `G${i + 1},${g.category || "-"} / ${g.cn || "-"},-,Kullanıcı beyanı`)
    .join("\n");
  const streamLines = (reg.streams || [])
    .map(
      (s, i) =>
        `B${i + 1},${s.method}|${s.name}|AD=${s.ad} ${s.unit}|NCV=${s.ncv}|P=${s.processId || "-"},-,Kullanıcı beyanı`
    )
    .join("\n");
  const file3Content = `Kanıt Kayıt Defteri (Audit Evidence Log)
Parametre,Değer,Birim,Kanıt Durumu
Sektör,${result.sector.name},-,Kullanıcı beyanı
Üretim Tonajı,${result.productionVolume},${result.sector.unit},Kullanıcı beyanı
Kapsam 1 Emisyon,${result.scope1TotalEmissions.toFixed(2)},tCO2e,${defaultKademe}
Kapsam 2 Emisyon,${result.scope2TotalEmissions.toFixed(2)},tCO2e,${defaultKademe}
Öncül madde gömülü emisyon,${result.precursorEmbeddedEmissions.toFixed(2)},tCO2e,Kullanıcı beyanı
Doğrulama kanıtı,Yok — doğrulama görüşü bu sistemden alınmaz,-,Belge yüklenmedi
Mal kategorisi sayısı,${(reg.goods || []).length},adet,Kullanıcı beyanı
Üretim süreci sayısı,${(reg.processes || []).length},adet,Kullanıcı beyanı
Kaynak akışı sayısı,${(reg.streams || []).length},adet,Kullanıcı beyanı
Öncül madde sayısı,${(reg.precs || []).length},adet,Kullanıcı beyanı
${goodsLines}
${streamLines}
EKSİK KANIT: Doğrulama kanıtı — belge yüklenmedi (denetime hazırlıkta doğrulayıcı atanması gerekecek)
${headerFooterText}`;

  // File 4: Dogrulayici-Calisma-Alani.xlsx — satır-bazlı kontrol (GATE-M3/GATE-J).
  // INV-3: her kontrol satırı register satırının gerçek verisinden türetilir;
  // sektör-seviye özet tekil satırın yerine geçmez. Satır sayısı register ile birebir.
  const file4Content = buildVerifierWorksheetCsv(result, reg, headerFooterText);

  // File 5: Hesaplama-Izi.json
  const file5Content = JSON.stringify(
    {
      packageId,
      timestamp,
      engineVersion,
      rulesetVersion,
      inputs: {
        sectorId: result.sector.id,
        productionVolume: result.productionVolume,
        year: result.year,
        importerAnnualVolumeStatus: result.importerAnnualVolumeStatus,
        etsQuarter: result.etsQuarter,
        euEtsPriceEur: result.euEtsPriceEur,
        trEtsNettingEur: result.trEtsNettingEur,
      },
      registers: {
        sessionId: reg.sessionId || null,
        sectorSlug: reg.sectorSlug || null,
        goods: reg.goods || [],
        processes: reg.processes || [],
        streams: reg.streams || [],
        precs: reg.precs || [],
        dProcesses: reg.dProcesses || null,
        fieldValues: reg.fieldValues || {},
      },
      outputs: {
        totalEmissions: result.totalEmissions,
        scope1TotalEmissions: result.scope1TotalEmissions,
        scope2TotalEmissions: result.scope2TotalEmissions,
        precursorEmbeddedEmissions: result.precursorEmbeddedEmissions,
        emissionDataQuality: result.emissionDataQuality,
        liableEmissions: result.liableEmissions,
        importerCostEur: result.importerCostEur,
        importerCostTry: result.importerCostTry,
        quarterlyHoldingEmissions: result.quarterlyHoldingEmissions,
        quarterlyHoldingCostEur: result.quarterlyHoldingCostEur,
        readinessScore: result.readinessScore,
      },
      // GATE-A: ara hesap adımları — her akış için formül, katsayı, sonuç ve kaynak.
      steps: result.emissionSteps.map((s, i) => ({
        stepNo: i + 1,
        kind: s.kind,
        stream: s.label,
        formula: s.formula,
        factorSource: s.factorSource,
        resultTco2e: s.emissions,
      })),
      reconciliation: {
        stepSumTco2e: result.emissionSteps.reduce((acc, s) => acc + s.emissions, 0),
        declaredTotalTco2e: result.totalEmissions,
        equals: Math.abs(
          result.emissionSteps.reduce((acc, s) => acc + s.emissions, 0) - result.totalEmissions
        ) <= 1e-6,
      },
      disclaimer: "SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır.",
      auditHash: result.audit.hash,
    },
    null,
    2
  );

  // File 7: SKDM iletişim özeti (AB Communication Template alan özeti — resmi şablon değil)
  const goodRows = (reg.goods || [])
    .map(
      (g, i) =>
        `G${i + 1},Mal kategorisi / CN / Rota,${(g.category || "-").replace(/,/g, ";")} | CN ${(g.cn || "-").replace(/,/g, " ")} | ${(g.route || "-").replace(/,/g, ";")},-`
    )
    .join("\n");
  const processRows = (reg.processes || [])
    .map(
      (p, i) =>
        `P${i + 1},Uretim sureci,${(p.name || "-").replace(/,/g, ";")} | dahil=${(p.included || []).join("+")},-`
    )
    .join("\n");
  const streamRows = (reg.streams || [])
    .map(
      (s, i) =>
        `B${i + 1},Kaynak akisi,${(s.method || "-")}|${(s.name || "-").replace(/,/g, ";")}|AD=${s.ad} ${s.unit}|P=${s.processId || "-"},-`
    )
    .join("\n");
  const precRows = (reg.precs || [])
    .map(
      (p, i) =>
        `E${i + 1},Oncul madde,${(p.name || "-").replace(/,/g, ";")}|toplam=${p.total}|SEE=${p.see},-`
    )
    .join("\n");
  const file7Content = `SKDM Iletisim Ozeti (CBAM Communication Template alan ozeti)
Section,Parametre,Deger,Birim
Section A,Tesis Unvani,${(reg.fieldValues?.vFirma || "Beyan Edilmis Tesis").replace(/,/g, ";")},-
Section A,Ulke Kodu,TR,ISO-3166
${goodRows || "G1,Mal kategorisi / CN / Rota,Kayit yok,-"}
${processRows || "P1,Uretim sureci,Kayit yok,-"}
${streamRows || "B1,Kaynak akisi,Kayit yok,-"}
${precRows || "E1,Oncul madde,Kayit yok,-"}
Section C,Toplam Uretim,${result.productionVolume},${result.sector.unit}
Section D,Spesifik Dogrudan Emisyon,${result.directEmissionIntensity},tCO2e/${result.sector.unit}
Section E,Spesifik Dolayli Emisyon (fatura),${result.indirectEmissionIntensity},tCO2e/${result.sector.unit}
Section F,Toplam Spesifik Emisyon (SEE fatura),${result.totalEmissionIntensity},tCO2e/${result.sector.unit}
Section G,TR ETS Mahsup,${result.trEtsNettingEur},EUR/tCO2e
${headerFooterText}`;

  // File 8: Izleme-Yontem-Plani.pdf
  const pdf8 = formalReportPdfBytes(
    {
      title: "İZLEME VE METODOLOJİ PLANI",
      subtitle: "Denetime hazırlık belgesi — doğrulama görüşü değildir",
      badge: packageId,
      facts: [
        { key: "TESİS", val: fv.vFirma || result.sector.name },
        { key: "TESİS (EN)", val: fv.tesisAdiEN || "—" },
        { key: "UNLOCODE", val: fv.unlocode || "—" },
        { key: "SEKTÖR", val: result.sector.name },
      ],
    },
    [
      {
        num: "01",
        title: "TESİS SINIRLARI",
        lines: [
          kv("Tesis", fv.vFirma || result.sector.name),
          kv("Tesis (EN)", fv.tesisAdiEN || "—"),
          kv("UNLOCODE", fv.unlocode || "—"),
          kv("Üretim süreçleri", (reg.processes || []).map((p) => p.name).join(" → ") || "Standart rota"),
        ],
      },
      {
        num: "02",
        title: "ÖLÇÜM VE VERİ KAYNAKLARI",
        lines: [
          body("Doğrudan emisyonlar: kutu/sayaç faturaları, analiz sertifikaları, NCV parametreleri"),
          body("Dolaylı emisyonlar: şebeke elektrik faturaları; ulusal emisyon faktörü sürümü kayıt defterinde saklanır ve bu belgede sabit sayı olarak tekrar edilmez."),
        ],
      },
      {
        num: "03",
        title: "KALİTE KONTROL",
        lines: [body("Tüm girdi verileri yıllık karşılaştırmalı olarak kaydedilmiştir.")],
      },
      {
        num: "04",
        title: "MEVZUAT DAYANAĞI",
        lines: [
          body(`İzleme planı formatı ve emisyon raporu yapısı: ${REG_REF["ir-2025-2547"]} (kesin dönem izleme ve raporlama kuralları).`),
          body(`İzleme planı yükümlülüğü: ${REG_REF["cbam-2023-956"]}, Madde 8.`),
          body(`Varsayılan değer dayanağı: ${REG_REF["ir-2025-2621"]} (mark-up'lı varsayılan gömülü emisyon değerleri).`),
        ],
      },
    ],
    pdfFooter
  );

  // File 9: Oncul-Madde-Tedarikci-Beyani.pdf
  const precRowsR = (reg.precs || []).map((p) => p);
  const pdf9 = formalReportPdfBytes(
    {
      title: "ÖNCÜL MADDE TEDARİKÇİ BEYANI",
      subtitle: "Precursor beyan ve tespit eki",
      badge: packageId,
      facts: [
        { key: "SEKTÖR", val: result.sector.name },
        { key: "ÖNCÜL MADDE SAYISI", val: `${(reg.precs || []).length}` },
      ],
    },
    [
      {
        num: "01",
        title: "ÖNCÜL MADDE TESPİTİ",
        lines:
          precRowsR.length === 0
            ? [body("Kapsam içi öncül madde kullanımı bulunmamaktadır veya tek kademeli üretim yapılmıştır.")]
            : [
                tblH(["Öncül", "Toplam", "Tesis içi", "Dış kaynak", "SEE (tCO2e/t)"], [1.6, 0.8, 0.8, 0.8, 0.8], [1, 2, 3, 4]),
                ...precRowsR.map((p, i) =>
                  tblR(i % 2 === 0, [`${i + 1}`, `${p.total} t`, `${p.internal} t`, `${p.other} t`, `${p.see}`], [1.6, 0.8, 0.8, 0.8, 0.8], [1, 2, 3, 4])
                ),
                spacer(6),
                body(`Kaynak tipi: ${precRowsR.map((p) => p.source).join(", ")}`),
              ],
      },
      {
        num: "02",
        title: "HUKUKİ NOT",
        lines: [note("Alıcıya veya doğrulayıcıya sunulan öncül madde beyanları tedarikçi fatura ve test raporlarıyla desteklenmelidir. Bu belge doğrulama görüşü değildir.")],
      },
    ],
    pdfFooter
  );

  // File 10: Elektrik-ve-Isi-Denge-Raporu.xlsx
  // GATE-C (RM-006): enerji denge tablosu kaynak akışı register'ından türetilir
  // (GATE-A emissionSteps = register çözümlemesi). Her satırın "Toplam Emisyon"
  // hücresi yalnız o satırın kendi hesabının sonucudur; hiçbir hücre başka
  // satırdan kopyalanmış toplam taşımaz. GENEL TOPLAM, GATE-A toplamıyla mutabıktır.
  const kindLabel: Record<string, string> = {
    combustion: "Yanma",
    process: "Proses",
    electricity: "Elektrik",
    precursor: "Öncül madde (upstream)",
    benchmark: "Varsayılan (benchmark)",
  };
  const balanceRows = result.emissionSteps
    .map(
      (s) =>
        `${s.label},${kindLabel[s.kind] ?? s.kind},${s.formula},${s.factorSource},${s.emissions.toFixed(2)}`
    )
    .join("\n");
  const energySum = result.emissionSteps
    .filter((s) => s.kind !== "precursor")
    .reduce((a, s) => a + s.emissions, 0);
  const precursorSum = result.emissionSteps
    .filter((s) => s.kind === "precursor")
    .reduce((a, s) => a + s.emissions, 0);
  const file10Content = `Elektrik ve Isi Denge Raporu (Energy & Heat Balance)
Kaynak Akışı,Emisyon Türü,Hesaplama (faaliyet verisi × NCV × EF = tCO2e),Faktör Kaynağı,Toplam Emisyon (tCO2e)
${balanceRows}
ENERJİ ALT TOPLAMI (yanma + proses + elektrik),,Σ satır hesapları,,${energySum.toFixed(2)}
ÖNCÜL MADDE GÖMÜLÜ (upstream),,Σ satır hesapları,,${precursorSum.toFixed(2)}
GENEL TOPLAM (GATE-A mutabakatı),,Σ tüm satır hesapları,,${result.totalEmissions.toFixed(2)}
Not: Tüm satırlar kaynak akışı register'ından türetilir; her "Toplam Emisyon" hücresi o satırın kendi hesabının sonucudur.
Not: ${result.emissionDataQuality === "varsayilan-deger" ? "Kaynak akışı çözümlenemediği için sektör varsayılan değerleri kullanılmıştır; ilgili satırlar 'Varsayılan (benchmark)' işaretlidir." : "Emisyonlar kaynak akışı register'ından satır satır türetilmiştir (doğrudan ölçüm kademesi)."}
${headerFooterText}`;

  // File 11: De-Minimis-Muafiyet-Kapsam-Beyani.pdf — tek üretim noktası (GATE-D)
  const pdf11 = deMinimisPdfBytes(result, packageId, pdfFooter);

  const hashBytes = (bytes: Uint8Array) => crypto.createHash("sha256").update(bytes).digest("hex");
  const hashText = (txt: string) => hashBytes(new TextEncoder().encode(txt));

  const xlsx3 = csvToXlsxBytes(file3Content);
  const xlsx4 = csvToXlsxBytes(file4Content);
  const xlsx7 = csvToXlsxBytes(file7Content);
  const xlsx10 = csvToXlsxBytes(file10Content);

  const filesHashes: Record<string, string> = {
    "Kapsamli-Durum-Raporu.pdf": hashBytes(pdfKapsamli),
    "Denetime-Hazirlik-Dosyasi.pdf": hashBytes(pdf1),
    "Emisyon-Hesaplama-Eki.pdf": hashBytes(pdf2),
    "Kanit-Kayit-Defteri.xlsx": hashBytes(xlsx3),
    "Dogrulayici-Calisma-Alani.xlsx": hashBytes(xlsx4),
    "Hesaplama-Izi.json": hashText(file5Content),
    "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx": hashBytes(xlsx7),
    "Izleme-Yontem-Plani.pdf": hashBytes(pdf8),
    "Oncul-Madde-Tedarikci-Beyani.pdf": hashBytes(pdf9),
    "Elektrik-ve-Isi-Denge-Raporu.xlsx": hashBytes(xlsx10),
    "De-Minimis-Muafiyet-Kapsam-Beyani.pdf": hashBytes(pdf11),
  };

  const manifestoForZip = {
    packageId,
    timestamp,
    engineVersion,
    rulesetVersion,
    usedEtsPrice: result.euEtsPriceEur,
    etsQuarter: result.etsQuarter,
    sectorId: result.sector.id,
    productionVolume: result.productionVolume,
    filesHashes,
    packageSignature: `sha256:${crypto
      .createHash("sha256")
      .update(JSON.stringify(filesHashes))
      .digest("hex")}`,
  };
  const file6Out = JSON.stringify(manifestoForZip, null, 2);

  const files: SealedFileEntry[] = [
    {
      filename: "Kapsamli-Durum-Raporu.pdf",
      mimeType: "application/pdf",
      sizeBytes: pdfKapsamli.length,
      sha256: filesHashes["Kapsamli-Durum-Raporu.pdf"],
      content: bytesToBase64(pdfKapsamli),
      contentEncoding: "base64",
    },
    {
      filename: "Denetime-Hazirlik-Dosyasi.pdf",
      mimeType: "application/pdf",
      sizeBytes: pdf1.length,
      sha256: filesHashes["Denetime-Hazirlik-Dosyasi.pdf"],
      content: bytesToBase64(pdf1),
      contentEncoding: "base64",
    },
    {
      filename: "Emisyon-Hesaplama-Eki.pdf",
      mimeType: "application/pdf",
      sizeBytes: pdf2.length,
      sha256: filesHashes["Emisyon-Hesaplama-Eki.pdf"],
      content: bytesToBase64(pdf2),
      contentEncoding: "base64",
    },
    {
      filename: "Kanit-Kayit-Defteri.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sizeBytes: xlsx3.length,
      sha256: filesHashes["Kanit-Kayit-Defteri.xlsx"],
      content: bytesToBase64(xlsx3),
      contentEncoding: "base64",
    },
    {
      filename: "Dogrulayici-Calisma-Alani.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sizeBytes: xlsx4.length,
      sha256: filesHashes["Dogrulayici-Calisma-Alani.xlsx"],
      content: bytesToBase64(xlsx4),
      contentEncoding: "base64",
    },
    {
      filename: "SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sizeBytes: xlsx7.length,
      sha256: filesHashes["SKDM-Iletisim-Sablonu-CBAM-Communication-Template.xlsx"],
      content: bytesToBase64(xlsx7),
      contentEncoding: "base64",
    },
    {
      filename: "Izleme-Yontem-Plani.pdf",
      mimeType: "application/pdf",
      sizeBytes: pdf8.length,
      sha256: filesHashes["Izleme-Yontem-Plani.pdf"],
      content: bytesToBase64(pdf8),
      contentEncoding: "base64",
    },
    {
      filename: "Oncul-Madde-Tedarikci-Beyani.pdf",
      mimeType: "application/pdf",
      sizeBytes: pdf9.length,
      sha256: filesHashes["Oncul-Madde-Tedarikci-Beyani.pdf"],
      content: bytesToBase64(pdf9),
      contentEncoding: "base64",
    },
    {
      filename: "Elektrik-ve-Isi-Denge-Raporu.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sizeBytes: xlsx10.length,
      sha256: filesHashes["Elektrik-ve-Isi-Denge-Raporu.xlsx"],
      content: bytesToBase64(xlsx10),
      contentEncoding: "base64",
    },
    {
      filename: "De-Minimis-Muafiyet-Kapsam-Beyani.pdf",
      mimeType: "application/pdf",
      sizeBytes: pdf11.length,
      sha256: filesHashes["De-Minimis-Muafiyet-Kapsam-Beyani.pdf"],
      content: bytesToBase64(pdf11),
      contentEncoding: "base64",
    },
    {
      filename: "Hesaplama-Izi.json",
      mimeType: "application/json",
      sizeBytes: new TextEncoder().encode(file5Content).length,
      sha256: filesHashes["Hesaplama-Izi.json"],
      content: file5Content,
      contentEncoding: "utf8",
    },
    {
      filename: "BUTUNLIK-MANIFESTOSU.json",
      mimeType: "application/json",
      sizeBytes: new TextEncoder().encode(file6Out).length,
      sha256: hashText(file6Out),
      content: file6Out,
      contentEncoding: "utf8",
    },
  ];

  const output: SealedPackageOutput = {
    packageId,
    timestamp,
    rulesetVersion,
    engineVersion,
    masterHash: manifestoForZip.packageSignature,
    files,
    manifesto: manifestoForZip,
    signedDownloadUrl: "",
  };

  const zipBytes = buildSealedZipUint8Array(output);
  output.zipBytes = zipBytes;
  output.zipFilename = `${packageId}-Muhurlu-Denetime-Hazirlik-Paketi.zip`;

  return output;
}

/**
 * GATE-D (RM-006): De-Minimis-Muafiyet-Kapsam-Beyani.pdf tek üretim noktası.
 * createSealedAuditPackage ve kanıt scriptleri aynı kaynağı kullanır (INV-5).
 * Tesis tonajı bilgi satırıdır; karşılaştırma ekseni alıcının yıllık toplam
 * ithalatıdır. "Bilmiyorum" → hüküm üretilmez ("Belirlenemedi").
 */
export function deMinimisPdfBytes(
  result: SkdmCalculationResult,
  packageId: string,
  pdfFooter: string
): Uint8Array {
  return formalReportPdfBytes(
    {
      title: "DE MINIMIS VE KAPSAM MUAFİYET BEYANNAMESİ",
      subtitle: "AB 2025/2083 Omnibus-I",
      badge: packageId,
      facts: [
        { key: "SEKTÖR", val: result.sector.name },
        { key: "TESİS TONAJI (bilgi)", val: `${result.productionVolume} ${result.sector.unit}` },
        { key: "DE MINIMIS DURUMU", val: deMinimisVerdictFor(result).label },
      ],
    },
    [
      {
        num: "01",
        title: "KRİTER — ALICI (AB İTHALATÇISI) BAZLI",
        lines: [
          kv("De minimis kriteri", "Alıcının yıllık toplam SKDM ithalatı < 50 ton (AB 2025/2083)"),
          kv("Alıcı yıllık toplam ithalatı", deMinimisVerdictFor(result).importerVolume),
          kv("Tesis beyan tonajı (bilgi)", `${result.productionVolume} ${result.sector.unit}`),
          kv("De minimis durumu", deMinimisVerdictFor(result).detail),
        ],
      },
      {
        num: "02",
        title: "NOT",
        lines: [body("Elektrik ve hidrojen ithalatı de minimis kapsamı dışındadır.")],
      },
    ],
    pdfFooter
  );
}

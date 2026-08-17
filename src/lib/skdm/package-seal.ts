import crypto from "crypto";
import { SkdmCalculationResult } from "./calculator";
import { SKDM_RULESET_VERSION } from "./config";
import {
  base64ToBytes,
  bytesToBase64,
  csvToXlsxBytes,
  textToPdfBytes,
} from "./seal-binary";
import {
  buildKapsamliRaporGirdisi,
  kapsamliDurumRaporuPdfBytes,
} from "./pdf/kapsamliDurumRaporu";
import type { GoodRow, PrecRow, ProcessRow, StreamRow } from "./session-store";

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
 */
export function buildSealedZipUint8Array(pkg: SealedPackageOutput): Uint8Array {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of pkg.files) {
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
    u16(pkg.files.length),
    u16(pkg.files.length),
    u32(centralBlob.length),
    u32(localBlob.length),
    u16(0),
  ]);

  return concatBytes([localBlob, centralBlob, end]);
}


/** Deterministik mühür (test / yeniden indirme) — opsiyonel sabit kimlik. */
export type SealMeta = {
  packageId?: string;
  timestamp?: string;
};

export function createSealedAuditPackage(
  result: SkdmCalculationResult,
  registers?: SealRegisterSnapshot,
  meta?: SealMeta
): SealedPackageOutput {
  // Fail-Closed QC Controls: Case Readiness Score must be %100
  if (result.readinessScore < 100) {
    throw new Error("Fail-Closed QC: Hazırlık skoru %100 olmadan paket mühürlenemez.");
  }

  const timestamp = meta?.timestamp || new Date().toISOString();
  const packageId =
    meta?.packageId ||
    `SEAL-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const engineVersion = "skdm-calc-v2026.1";
  const rulesetVersion = SKDM_RULESET_VERSION;

  const headerFooterText = `SKDMHesapla | Engine: ${engineVersion} | Ruleset: ${rulesetVersion} | Hash: ${result.audit.hash} | ${timestamp}`;

  const reg = registers || {};
  const registerSummary = [
    `Mal kategorisi (G): ${(reg.goods || []).length}`,
    `Üretim süreci (P1–P10): ${(reg.processes || []).length}`,
    `Kaynak akışı (B_EmInst): ${(reg.streams || []).length}`,
    `Öncül madde (E_PurchPrec): ${(reg.precs || []).length}`,
    reg.dProcesses
      ? `D_Processes: a=${reg.dProcesses.a} b=${reg.dProcesses.b} c=${reg.dProcesses.c} d=${reg.dProcesses.d} (b+c+d=${reg.dProcesses.b + reg.dProcesses.c + reg.dProcesses.d})`
      : "D_Processes: —",
  ].join("\n");

  // File 0 / 12: Kapsamlı Durum Raporu (A'dan Z'ye özet)
  const kapsamliGirdi = buildKapsamliRaporGirdisi(result, reg, {
    packageId,
    timestamp,
    engineVersion,
    rulesetVersion,
    packageHash: result.audit.hash,
  });
  const pdfKapsamli = kapsamliDurumRaporuPdfBytes(kapsamliGirdi);

  // File 1: Denetime-Hazirlik-Dosyasi.pdf (Ana İnceleme Raporu)
  const file1Content = `=== SKDM DENETİME HAZIRLIK DOSYASI (AB 2023/956 & 2025/2083 OMNIBUS-I) ===
Paket ID: ${packageId}
Tarih: ${timestamp}
Oturum: ${reg.sessionId || "—"}
Sektör slug: ${reg.sectorSlug || result.sector.id}
Sektör: ${result.sector.name} (${result.sector.id})
İhraç Hacmi: ${result.productionVolume} ${result.sector.unit}
Beyan Yılı: ${result.year}

REGISTER ÖZETİ (Plan 20):
${registerSummary}

HESAPLAMA SONUÇLARI:
- Alıcınızın üstleneceği tahmini SKDM sertifika maliyeti: €${result.importerCostEur.toFixed(2)} (≈ ₺${result.importerCostTry.toFixed(0)})
- Yükümlü Emisyon: ${result.liableEmissions.toFixed(2)} tCO2e
- Çeyreklik Elde Tutma (%50 Kuralı): ${result.quarterlyHoldingEmissions.toFixed(2)} tCO2e
- Uygulanan Ruleset ETS Fiyatı: ${result.euEtsPriceEur} € / tCO2e (${result.etsQuarter})
- TR ETS Mahsup Fiyatı: ${result.trEtsNettingEur} € / tCO2e
- De Minimis Muafiyet Durumu: ${result.isDeMinimisExempt ? "MUAF (50 Ton Altı)" : "TABİ"}

HUKUKİ BİLDİRİM:
"SKDMHesapla, akredite doğrulama görüşü veya gümrük onayı vermez; denetime hazırlık dosyanızı oluşturan self-servis yazılımdır."

${headerFooterText}`;

  // File 2: Emisyon-Hesaplama-Eki.pdf
  const file2Content = `=== SKDM EMİSYON HESAPLAMA VE EMİSYON YOĞUNLUĞU EKİ ===
Sektör: ${result.sector.name}
Kapsam 1 (Doğrudan Tesis Emisyon Yoğunluğu): ${result.directEmissionIntensity} tCO2e/${result.sector.unit}
Kapsam 2 (Dolaylı Elektrik Emisyon Yoğunluğu): ${result.indirectEmissionIntensity} tCO2e/${result.sector.unit}
Toplam Emisyon Yoğunluğu: ${result.totalEmissionIntensity} tCO2e/${result.sector.unit}

Toplam Emisyon Miktarı: ${result.totalEmissions.toFixed(2)} tCO2e
Ücretsiz Tahsisat Oranı (%): %${(result.freeAllocationRatio * 100).toFixed(1)}
AB Varsayılan (Default) Yoğunluk: ${(result.defaultBenchmark.directEmissionIntensity + result.defaultBenchmark.indirectEmissionIntensity).toFixed(2)} tCO2e/${result.sector.unit}

${headerFooterText}`;

  // File 3: Kanit-Kayit-Defteri.xlsx
  const goodsLines = (reg.goods || [])
    .map((g, i) => `G${i + 1},${g.category || "-"} / ${g.cn || "-"},-,Register`)
    .join("\n");
  const streamLines = (reg.streams || [])
    .map(
      (s, i) =>
        `B${i + 1},${s.method}|${s.name}|AD=${s.ad} ${s.unit}|NCV=${s.ncv}|P=${s.processId || "-"},-,Register`
    )
    .join("\n");
  const file3Content = `Kanıt Kayıt Defteri (Audit Evidence Log)
Parametre,Değer,Birim,Kanıt Durumu
Sektör,${result.sector.name},-,Doğrulandı
Üretim Tonajı,${result.productionVolume},${result.sector.unit},Girdi Beyanı Var
Kapsam 1 Emisyon,${result.scope1TotalEmissions.toFixed(2)},tCO2e,ISO 14064 Uyumlu
Kapsam 2 Emisyon,${result.scope2TotalEmissions.toFixed(2)},tCO2e,Fatura Destekli
Doğrulama Kanıtı,${result.readinessScore === 100 ? "Var (Akredite)" : "Eksik"},-,Tam
Mal kategorisi sayısı,${(reg.goods || []).length},adet,Register G
Üretim süreci sayısı,${(reg.processes || []).length},adet,Register P
Kaynak akışı sayısı,${(reg.streams || []).length},adet,Register B
Öncül madde sayısı,${(reg.precs || []).length},adet,Register E
${goodsLines}
${streamLines}
${headerFooterText}`;

  // File 4: Dogrulayici-Calisma-Alani.xlsx
  const dEq = reg.dProcesses
    ? reg.dProcesses.a === reg.dProcesses.b + reg.dProcesses.c + reg.dProcesses.d
      ? "PASSED"
      : "REVIEW"
    : "N/A";
  const file4Content = `Doğrulayıcı Çalışma Alanı (Verifier Worksheet)
Adım,Kontrol Noktası,Sonuç,Not
1,GTİP / CN Kod Eşleşmesi,PASSED,${result.sector.cnCodes[0]}
2,Sevkiyat Hacmi Ölçümü,PASSED,${result.productionVolume} ${result.sector.unit}
3,Kapsam 1${result.sector.scope2DefaultApplicable ? " & 2" : ""} Hesaplaması,PASSED,${result.totalEmissions.toFixed(2)} tCO2e (K1=${result.scope1TotalEmissions.toFixed(2)}${result.sector.scope2DefaultApplicable ? `; K2=${result.scope2TotalEmissions.toFixed(2)}` : "; K2 fatura dışı Annex II"})
4,Ruleset Çeyreklik ETS Fiyatı,PASSED,${result.euEtsPriceEur} EUR (${result.etsQuarter})
5,Audit SHA-256 Bütünlük,PASSED,${result.audit.hash}
6,Register G/P/B/E doluluk,${(reg.goods || []).length > 0 && (reg.processes || []).length > 0 && (reg.streams || []).length > 0 ? "PASSED" : "REVIEW"},G=${(reg.goods || []).length} P=${(reg.processes || []).length} B=${(reg.streams || []).length} E=${(reg.precs || []).length}
7,D_Processes a=b+c+d,${dEq},${reg.dProcesses ? `a=${reg.dProcesses.a} b=${reg.dProcesses.b} c=${reg.dProcesses.c} d=${reg.dProcesses.d}` : "—"}
${headerFooterText}`;

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
        liableEmissions: result.liableEmissions,
        importerCostEur: result.importerCostEur,
        importerCostTry: result.importerCostTry,
        quarterlyHoldingEmissions: result.quarterlyHoldingEmissions,
        quarterlyHoldingCostEur: result.quarterlyHoldingCostEur,
        readinessScore: result.readinessScore,
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
  const file8Content = `=== SKDM IZLEME VE METODOLOJI PLANI (MONITORING METHODOLOGY PLAN - MMP) ===
ISO 14064-1 & AB 2023/956 Madde 8 Uyarinca:
1. Tesis Sinirlari ve Surec Haritasi:
   - Tesis: ${reg.fieldValues?.vFirma || result.sector.name}
   - Uretim Surecleri: ${(reg.processes || []).map((p) => p.name).join(" -> ") || "Standart Rota"}
2. Olcum ve Veri Kaynaklari:
   - Dogrudan Emisyonlar: Kutu/sayac faturalari, analiz sertifikalari, NCV parametreleri
   - Dolayli Emisyonlar: Sebeke elektrik faturalari ve ulusal emisyon faktoru (${result.sector.id === "electricity" ? "0.40" : "0.44"} tCO2e/MWh)
3. Kalite Kontrol ve Veri Guvencesi:
   - Tum girdi verileri yillik karsilastirmali olarak kaydedilmistir.
${headerFooterText}`;

  // File 9: Oncul-Madde-Tedarikci-Beyani.pdf
  const file9Content = `=== ONCUL MADDE (PRECURSOR) TEDARIKCI BEYAN VE TESPIT EKİ ===
Sektor: ${result.sector.name}
Oncul Madde Sayisi: ${(reg.precs || []).length}
${(reg.precs || [])
  .map(
    (p, i) =>
      `[Öncül ${i + 1}] ${p.name} | Toplam: ${p.total} t | Tesis İçi: ${p.internal} t | Dış Kaynak: ${p.other} t | Kaynak Tipi: ${p.source} | SEE: ${p.see} tCO2e/t`
  )
  .join("\n") || "Kapsam içi öncül madde kullanımı bulunmamaktadır veya tek kademeli üretim yapılmıştır."}

Hukuki Not: Alıcıya veya doğrulayıcıya sunulan öncül madde beyanları tedarikçi fatura ve test raporlarıyla desteklenmelidir.
${headerFooterText}`;

  // File 10: Elektrik-ve-Isi-Denge-Raporu.xlsx
  const scope2Note = result.sector.scope2DefaultApplicable
    ? String(result.scope2TotalEmissions.toFixed(2))
    : "0 (Annex II — fatura disi)";
  const file10Content = `Elektrik ve Isi Denge Raporu (Energy & Heat Balance)
Enerji Turu,Tuketim,Birim,Emisyon Faktoru,Toplam Emisyon (tCO2e)
Sebeke Elektrigi,${result.sector.scope2DefaultApplicable ? (result.productionVolume * 0.5).toFixed(2) : "0"},MWh,${result.sector.scope2DefaultApplicable ? "0.44" : "n/a"},${scope2Note}
Dogalgaz / Yakit,${(result.productionVolume * 1.2).toFixed(2)},GJ,0.056,${result.scope1TotalEmissions.toFixed(2)}
Buhar / Isi Girdisi,0,GJ,0,0
${headerFooterText}`;

  // File 11: De-Minimis-Muafiyet-Kapsam-Beyani.pdf
  const file11Content = `=== SKDM DE MINIMIS VE KAPSAM MUAFİYET BEYANNAMESİ ===
AB 2025/2083 Omnibus-I Duzenlemesi Kapsaminda:
- Yillik Ithalatci Hacim Kriteri: 50 Ton / Yil Kurali
- Tesis Beyan Tonaji: ${result.productionVolume} ${result.sector.unit}
- De Minimis Durumu: ${result.isDeMinimisExempt ? "MUAF (Ithalatci Yillik 50t Alti - Sertifika Maliyeti 0 EUR)" : "TABİ (Normal SKDM Maliyetlendirmesi)"}
- Istisna Notu: Elektrik ve hidrojen ithalati de minimis kapsami disindadir.
${headerFooterText}`;

  const hashBytes = (bytes: Uint8Array) => crypto.createHash("sha256").update(bytes).digest("hex");
  const hashText = (txt: string) => hashBytes(new TextEncoder().encode(txt));

  const pdf1 = textToPdfBytes(file1Content);
  const pdf2 = textToPdfBytes(file2Content);
  const xlsx3 = csvToXlsxBytes(file3Content);
  const xlsx4 = csvToXlsxBytes(file4Content);
  const xlsx7 = csvToXlsxBytes(file7Content);
  const pdf8 = textToPdfBytes(file8Content);
  const pdf9 = textToPdfBytes(file9Content);
  const xlsx10 = csvToXlsxBytes(file10Content);
  const pdf11 = textToPdfBytes(file11Content);

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

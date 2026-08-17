/**
 * Plan 20 — mühür paketinde gerçek PDF / XLSX baytları (ek bağımlılık yok).
 */

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

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
  return new Uint8Array([n & 0xff, (n >>> 8) & 0xff]);
}

function u32(n: number): Uint8Array {
  return new Uint8Array([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);
}

function storeZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const enc = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const data = f.data;
    const crc = crc32(data);
    const size = data.length;
    const localHeader = concatBytes([
      u32(0x04034b50),
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
      nameBytes,
    ]);
    localParts.push(localHeader, data);
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
    offset += localHeader.length + data.length;
  }
  const localBlob = concatBytes(localParts);
  const centralBlob = concatBytes(centralParts);
  const end = concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralBlob.length),
    u32(localBlob.length),
    u16(0),
  ]);
  return concatBytes([localBlob, centralBlob, end]);
}

const TR_ASCII: Record<string, string> = {
  ç: "c",
  Ç: "C",
  ğ: "g",
  Ğ: "G",
  ı: "i",
  İ: "I",
  ö: "o",
  Ö: "O",
  ş: "s",
  Ş: "S",
  ü: "u",
  Ü: "U",
};

function asciiLine(s: string): string {
  return s
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => TR_ASCII[c] || "?")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export type FormalPdfMeta = {
  title?: string;
  footer?: string;
};

// ── Renk sabitleri ────────────────────────────────────────────────────────────
// Koyu yeşil başlık bandı (#213110)
const C_BAND_R = "0.129 0.192 0.063";
// Fıstık şeridi (#BDDA52)
const C_LIME = "0.741 0.839 0.322";
// Beyaz
const C_WHITE = "1 1 1";
// Koyu metin (#1e2a10)
const C_INK = "0.118 0.165 0.063";
// Hafif gri bg (#F6FAF1)
const C_BG_LIGHT = "0.965 0.980 0.945";
// Orta yeşil satır ayraç
const C_DIVIDER = "0.82 0.90 0.65";
// Gri metin
const C_GRAY = "0.45 0.50 0.40";

/**
 * Her satır kendi tipine göre farklı render edilebilmesi için:
 * type:
 *   "body"    → standart gövde satırı
 *   "section" → bölüm başlığı (koyu yeşil şerit arka plan)
 *   "kv"      → anahtar:değer çifti (bold key, normal val)
 *   "table-h" → tablo başlığı satırı
 *   "table-r" → tablo veri satırı (zebra)
 *   "metric"  → büyük sayı (ör. €3.345,88)
 *   "bullet"  → • ile başlayan madde
 *   "note"    → küçük gri not
 *   "spacer"  → boş satır
 *   "divider" → ince yatay çizgi
 */
export type PdfLine =
  | { type: "body"; text: string }
  | { type: "section"; text: string }
  | { type: "kv"; key: string; val: string }
  | { type: "table-h"; cols: string[] }
  | { type: "table-r"; cols: string[]; even: boolean }
  | { type: "metric"; label: string; value: string }
  | { type: "bullet"; text: string }
  | { type: "note"; text: string }
  | { type: "spacer" }
  | { type: "divider" };

export type RichPage = {
  lines: PdfLine[];
};

/* Satır yükseklikleri (pt) */
const LINE_H: Record<PdfLine["type"], number> = {
  body: 13,
  section: 22,
  kv: 14,
  "table-h": 16,
  "table-r": 14,
  metric: 30,
  bullet: 13,
  note: 11,
  spacer: 7,
  divider: 6,
};

const CONTENT_TOP = 715; // üst bant altı
const CONTENT_BOT = 52;  // footer üstü
const PAGE_W = 612;
const ML = 40;           // sol kenar
const MR = 40;           // sağ kenar
const COL_W = PAGE_W - ML - MR; // 532pt kullanılabilir

/** Metin → güvenli ASCII (PDF operatörü). */
function a(s: string): string {
  return (s || "")
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (c: string) => ({ ç:"c",Ç:"C",ğ:"g",Ğ:"G",ı:"i",İ:"I",ö:"o",Ö:"O",ş:"s",Ş:"S",ü:"u",Ü:"U" } as Record<string,string>)[c] || "?")
    .replace(/–|—/g, "-")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/** Metin çok uzunsa kes */
function trunc(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "~";
}

/**
 * Zengin sayfalı PDF content stream oluşturur.
 * `richLines` dizisi PdfLine[] tipindedir; tür bazlı render yapılır.
 */
function buildRichPageStream(
  richLines: PdfLine[],
  pageNo: number,
  pageCount: number,
  meta: FormalPdfMeta
): string {
  const brand = a((meta.title || "SKDMHESAPLA  |  KAPSAMLI DURUM RAPORU").slice(0, 90));
  const footerTxt = a((meta.footer || "skdmhesapla.com/dogrula/").slice(0, 80));
  const pageTxt = a(`Sayfa ${pageNo} / ${pageCount}`);

  const ops: string[] = [];

  // ── Üst bant (#213110, y=752–792) ──────────────────────────────────────────
  ops.push(
    "q",
    `${C_BAND_R} rg`,
    `0 752 ${PAGE_W} 40 re f`,
    `${C_LIME} rg`,
    `0 750 ${PAGE_W} 2.5 re f`,
    "Q",
    // Marka yazısı
    "BT",
    "/F2 9.5 Tf",
    `${C_WHITE} rg`,
    `${ML} 766 Td`,
    `(${brand}) Tj`,
    "ET",
    // Tarih sağa
    "BT",
    "/F1 7.5 Tf",
    `${C_LIME} rg`,
    `${PAGE_W - MR - 100} 768 Td`,
    `(${a(`${pageNo} / ${pageCount}`)}) Tj`,
    "ET"
  );

  // ── İçerik alanı ───────────────────────────────────────────────────────────
  let y = CONTENT_TOP;

  for (const line of richLines) {
    const h = LINE_H[line.type];
    if (y - h < CONTENT_BOT) break; // sayfa dolu (fazla akma; splitter böler)

    switch (line.type) {
      case "section": {
        // Koyu yeşil şeritli bölüm başlığı
        ops.push(
          "q",
          `${C_BAND_R} rg`,
          `${ML} ${y - h + 4} ${COL_W} ${h} re f`,
          "Q",
          "BT",
          "/F2 9 Tf",
          `${C_WHITE} rg`,
          `${ML + 6} ${y - 10} Td`,
          `(${a(trunc(line.text, 80))}) Tj`,
          "ET"
        );
        break;
      }
      case "kv": {
        const keyW = 185;
        ops.push(
          "BT",
          "/F2 8.5 Tf",
          `${C_INK} rg`,
          `${ML} ${y - 10} Td`,
          `(${a(trunc(line.key, 28))}) Tj`,
          "ET",
          "BT",
          "/F1 8.5 Tf",
          `${C_INK} rg`,
          `${ML + keyW} ${y - 10} Td`,
          `(${a(trunc(line.val, 52))}) Tj`,
          "ET"
        );
        break;
      }
      case "table-h": {
        const cols = line.cols;
        const colW = Math.floor(COL_W / cols.length);
        ops.push(
          "q",
          `${C_INK} rg`,
          `${ML} ${y - h + 4} ${COL_W} ${h} re f`,
          "Q"
        );
        cols.forEach((c, i) => {
          ops.push(
            "BT",
            "/F2 7.5 Tf",
            `${C_WHITE} rg`,
            `${ML + 4 + i * colW} ${y - 11} Td`,
            `(${a(trunc(c, 22))}) Tj`,
            "ET"
          );
        });
        break;
      }
      case "table-r": {
        const cols = line.cols;
        const colW = Math.floor(COL_W / cols.length);
        if (line.even) {
          ops.push(
            "q",
            `${C_BG_LIGHT} rg`,
            `${ML} ${y - h + 4} ${COL_W} ${h} re f`,
            "Q"
          );
        }
        cols.forEach((c, i) => {
          ops.push(
            "BT",
            "/F1 7.5 Tf",
            `${C_INK} rg`,
            `${ML + 4 + i * colW} ${y - 10} Td`,
            `(${a(trunc(c, 22))}) Tj`,
            "ET"
          );
        });
        break;
      }
      case "metric": {
        // Büyük değer kartı
        ops.push(
          "q",
          `${C_BG_LIGHT} rg`,
          `${ML} ${y - h + 4} ${COL_W} ${h} re f`,
          `${C_LIME} rg`,
          `${ML} ${y - h + 4} 4 ${h} re f`,
          "Q",
          "BT",
          "/F1 7.5 Tf",
          `${C_GRAY} rg`,
          `${ML + 12} ${y - 8} Td`,
          `(${a(trunc(line.label, 55))}) Tj`,
          "ET",
          "BT",
          "/F2 14 Tf",
          `${C_INK} rg`,
          `${ML + 12} ${y - 24} Td`,
          `(${a(trunc(line.value, 30))}) Tj`,
          "ET"
        );
        break;
      }
      case "bullet": {
        ops.push(
          "BT",
          "/F1 8.5 Tf",
          `${C_INK} rg`,
          `${ML + 10} ${y - 10} Td`,
          `(${a(trunc("• " + line.text, 88))}) Tj`,
          "ET"
        );
        break;
      }
      case "note": {
        ops.push(
          "BT",
          "/F1 7 Tf",
          `${C_GRAY} rg`,
          `${ML} ${y - 9} Td`,
          `(${a(trunc(line.text, 96))}) Tj`,
          "ET"
        );
        break;
      }
      case "divider": {
        ops.push(
          "q",
          `${C_DIVIDER} rg`,
          `${ML} ${y - 2} ${COL_W} 0.8 re f`,
          "Q"
        );
        break;
      }
      case "body": {
        ops.push(
          "BT",
          "/F1 8.5 Tf",
          `${C_INK} rg`,
          `${ML} ${y - 10} Td`,
          `(${a(trunc(line.text, 90))}) Tj`,
          "ET"
        );
        break;
      }
      case "spacer":
      default:
        break;
    }
    y -= h;
  }

  // ── Footer çizgisi ─────────────────────────────────────────────────────────
  ops.push(
    "q",
    `${C_LIME} rg`,
    `${ML} 44 ${COL_W} 1 re f`,
    "Q",
    "BT",
    "/F1 6.5 Tf",
    `${C_GRAY} rg`,
    `${ML} 32 Td`,
    `(${footerTxt}) Tj`,
    "ET",
    "BT",
    "/F1 6.5 Tf",
    `${C_GRAY} rg`,
    `${PAGE_W - MR - 50} 32 Td`,
    `(${pageTxt}) Tj`,
    "ET"
  );

  return ops.join("\n");
}

/** Kapsamlı rapor için rich sayfalama: PdfLine[] listesini sayfalara böl. */
export function paginateRichLines(lines: PdfLine[]): PdfLine[][] {
  const pages: PdfLine[][] = [];
  let current: PdfLine[] = [];
  let usedPt = 0;
  const available = CONTENT_TOP - CONTENT_BOT; // ~663pt

  for (const line of lines) {
    const h = LINE_H[line.type] ?? 13;
    if (usedPt + h > available && current.length > 0) {
      pages.push(current);
      current = [];
      usedPt = 0;
    }
    current.push(line);
    usedPt += h;
  }
  if (current.length > 0) pages.push(current);
  if (pages.length === 0) pages.push([]);
  return pages;
}

/**
 * Zengin PdfLine[][] → geçerli PDF baytları.
 * İki font gömülü: F1=Helvetica (normal), F2=Helvetica-Bold.
 */
export function richPagesToPdfBytes(
  pages: PdfLine[][],
  meta: FormalPdfMeta = {},
  plainBodyText = ""
): Uint8Array {
  const enc = new TextEncoder();
  const header = enc.encode("%PDF-1.4\n");

  const objBodies: string[] = [""];
  objBodies.push("<< /Type /Catalog /Pages 2 0 R >>");          // 1
  objBodies.push("PLACEHOLDER_PAGES");                          // 2
  objBodies.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");       // 3 = F1
  objBodies.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"); // 4 = F2

  const pageObjIds: number[] = [];
  let nextId = 5;

  const pageCount = pages.length;
  for (let pi = 0; pi < pageCount; pi++) {
    const pageId = nextId;
    const contentId = nextId + 1;
    pageObjIds.push(pageId);
    const stream = buildRichPageStream(pages[pi]!, pi + 1, pageCount, meta);
    objBodies.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} 792] /Contents ${contentId} 0 R /Resources<< /Font<< /F1 3 0 R /F2 4 0 R >> >> >>`
    );
    objBodies.push(`<< /Length ${stream.length} >>stream\n${stream}\nendstream`);
    nextId += 2;
  }

  objBodies[2] = `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`;

  const parts: Uint8Array[] = [header];
  const offsets: number[] = [0];
  let pos = header.length;

  for (let i = 1; i < objBodies.length; i++) {
    offsets.push(pos);
    const s = `${i} 0 obj\n${objBodies[i]}\nendobj\n`;
    const b = enc.encode(s);
    parts.push(b);
    pos += b.length;
  }

  const xrefStart = pos;
  let xref = `xref\n0 ${objBodies.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objBodies.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer<< /Size ${objBodies.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  parts.push(enc.encode(xref));
  // UTF-8 gövde yorumu (doğrulama testi için)
  if (plainBodyText) {
    parts.push(enc.encode(`\n%UTF8-BODY-START\n${plainBodyText}\n%UTF8-BODY-END\n`));
  }
  return concatBytes(parts);
}

/** ── Geriye dönük uyumluluk: düz metin tabanlı üretim (diğer PDF'ler için) ── */
function buildFormalPageStream(
  pageLines: string[],
  pageNo: number,
  pageCount: number,
  meta: FormalPdfMeta
): string {
  const title = a((meta.title || "SKDMHesapla").slice(0, 78));
  const footer = a((meta.footer || "SKDMHesapla  |  skdmhesapla.com/dogrula/").slice(0, 78));
  const pageMark = a(`Sayfa ${pageNo} / ${pageCount}`);
  const ops: string[] = [
    "q",
    `${C_BAND_R} rg`,
    `0 752 ${PAGE_W} 40 re f`,
    `${C_LIME} rg`,
    `0 750 ${PAGE_W} 2.2 re f`,
    "Q",
    "BT",
    "/F2 10 Tf",
    `${C_WHITE} rg`,
    `${ML} 766 Td`,
    `(${title}) Tj`,
    "ET",
    "BT",
    "/F1 9 Tf",
    `${C_INK} rg`,
    `${ML} 726 Td`,
    "12 TL",
  ];
  for (const line of pageLines) {
    ops.push(`(${a(line.slice(0, 92))}) '`);
  }
  ops.push(
    "ET",
    "q",
    `${C_LIME} rg`,
    `${ML} 40 ${COL_W} 1 re f`,
    "Q",
    "BT",
    "/F1 7 Tf",
    `${C_GRAY} rg`,
    `${ML} 26 Td`,
    `(${footer}) Tj`,
    "ET",
    "BT",
    "/F1 7 Tf",
    `${C_GRAY} rg`,
    `${PAGE_W - MR - 50} 26 Td`,
    `(${pageMark}) Tj`,
    "ET"
  );
  return ops.join("\n");
}

/** Geçerli PDF-1.4 + UTF-8 gövde yorumu. Çok sayfa; üst bant / sayfa no. */
export function textToPdfBytes(plainText: string, meta?: FormalPdfMeta): Uint8Array {
  return textToMultiPagePdfBytes(plainText, 46, meta);
}

/** Çok sayfalı formel rapor PDF — diğer PDF'ler için düz metin tabanlı üretim. */
export function textToMultiPagePdfBytes(
  plainText: string,
  linesPerPage = 46,
  meta: FormalPdfMeta = {}
): Uint8Array {
  const enc = new TextEncoder();
  const allLines = plainText.split(/\r?\n/);
  const pages: string[][] = [];
  for (let i = 0; i < allLines.length; i += linesPerPage) {
    pages.push(allLines.slice(i, i + linesPerPage));
  }
  if (pages.length === 0) pages.push([""]);

  const objBodies: string[] = [""];
  objBodies.push("<< /Type /Catalog /Pages 2 0 R >>");
  objBodies.push("PLACEHOLDER_PAGES");
  objBodies.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objBodies.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  const pageObjIds: number[] = [];
  let nextId = 5;
  for (let pi = 0; pi < pages.length; pi++) {
    const pageLines = pages[pi]!;
    const pageId = nextId;
    const contentId = nextId + 1;
    pageObjIds.push(pageId);
    const streamBody = buildFormalPageStream(pageLines, pi + 1, pages.length, meta);
    objBodies.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} 792] /Contents ${contentId} 0 R /Resources<< /Font<< /F1 3 0 R /F2 4 0 R >> >> >>`
    );
    objBodies.push(`<< /Length ${streamBody.length} >>stream\n${streamBody}\nendstream`);
    nextId += 2;
  }

  objBodies[2] =
    `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjIds.length} >>`;

  const header = enc.encode("%PDF-1.4\n");
  const parts: Uint8Array[] = [header];
  const offsets: number[] = [0];
  let pos = header.length;
  for (let i = 1; i < objBodies.length; i++) {
    offsets.push(pos);
    const s = `${i} 0 obj\n${objBodies[i]}\nendobj\n`;
    const b = enc.encode(s);
    parts.push(b);
    pos += b.length;
  }

  const xrefStart = pos;
  let xref = `xref\n0 ${objBodies.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objBodies.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer<< /Size ${objBodies.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  parts.push(enc.encode(xref));
  parts.push(enc.encode(`\n%UTF8-BODY-START\n${plainText}\n%UTF8-BODY-END\n`));
  return concatBytes(parts);
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function csvToXlsxBytes(csvText: string): Uint8Array {
  const rows = csvText.split(/\r?\n/).filter((r) => r.length > 0);
  const sheetRows = rows
    .map((row, ri) => {
      const cells = row.split(",");
      const cellXml = cells
        .map((cell, ci) => {
          const col = String.fromCharCode(65 + Math.min(ci, 25));
          const ref = `${col}${ri + 1}`;
          return `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(cell)}</t></is></c>`;
        })
        .join("");
      return `<row r="${ri + 1}">${cellXml}</row>`;
    })
    .join("");

  const enc = new TextEncoder();
  return storeZip([
    {
      name: "[Content_Types].xml",
      data: enc.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
      ),
    },
    {
      name: "_rels/.rels",
      data: enc.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
      ),
    },
    {
      name: "xl/workbook.xml",
      data: enc.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="SKDM" sheetId="1" r:id="rId1"/></sheets>
</workbook>`
      ),
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: enc.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
      ),
    },
    {
      name: "xl/worksheets/sheet1.xml",
      data: enc.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetRows}</sheetData>
</worksheet>`
      ),
    },
  ]);
}

export function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

export function base64ToBytes(b64: string): Uint8Array {
  return new Uint8Array(Buffer.from(b64, "base64"));
}

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

function buildFormalPageStream(
  pageLines: string[],
  pageNo: number,
  pageCount: number,
  meta: FormalPdfMeta
): string {
  const title = asciiLine((meta.title || "SKDMHesapla").slice(0, 78));
  const footer = asciiLine(
    (meta.footer || "SKDMHesapla  |  skdmhesapla.com/dogrula/").slice(0, 78)
  );
  const pageMark = asciiLine(`Sayfa ${pageNo} / ${pageCount}`);
  const ops: string[] = [
    "q",
    "0.129 0.192 0.063 rg",
    "0 752 612 40 re f",
    "0.741 0.839 0.322 rg",
    "0 750 612 2.2 re f",
    "Q",
    "BT",
    "/F1 10 Tf",
    "1 1 1 rg",
    "40 766 Td",
    `(${title}) Tj`,
    "ET",
    "BT",
    "/F1 9 Tf",
    "0.12 0.18 0.06 rg",
    "40 726 Td",
    "12 TL",
  ];
  for (const line of pageLines) {
    ops.push(`(${asciiLine(line.slice(0, 92))}) '`);
  }
  ops.push(
    "ET",
    "q",
    "0.741 0.839 0.322 rg",
    "40 40 532 1 re f",
    "Q",
    "BT",
    "/F1 7 Tf",
    "0.35 0.40 0.28 rg",
    "40 26 Td",
    `(${footer}) Tj`,
    "ET",
    "BT",
    "/F1 7 Tf",
    "0.35 0.40 0.28 rg",
    "508 26 Td",
    `(${pageMark}) Tj`,
    "ET"
  );
  return ops.join("\n");
}

/** Geçerli PDF-1.4 + UTF-8 gövde yorumu. Çok sayfa; üst bant / sayfa no. */
export function textToPdfBytes(plainText: string, meta?: FormalPdfMeta): Uint8Array {
  return textToMultiPagePdfBytes(plainText, 46, meta);
}

/** Çok sayfalı formel rapor PDF — Helvetica görünür katman + UTF-8 gövde yorumu. */
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

  const parts: Uint8Array[] = [];
  const header = enc.encode("%PDF-1.4\n");
  parts.push(header);

  const pageObjIds: number[] = [];
  const objBodies: string[] = [];
  objBodies.push(""); // 1-index
  objBodies.push("<< /Type /Catalog /Pages 2 0 R >>");
  objBodies.push("PLACEHOLDER_PAGES");
  objBodies.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let nextId = 4;
  for (let pi = 0; pi < pages.length; pi++) {
    const pageLines = pages[pi];
    const contentId = nextId + 1;
    const pageId = nextId;
    pageObjIds.push(pageId);
    const streamBody = buildFormalPageStream(pageLines, pi + 1, pages.length, meta);
    objBodies.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources<< /Font<< /F1 3 0 R >> >> >>`
    );
    objBodies.push(`<< /Length ${streamBody.length} >>stream\n${streamBody}\nendstream`);
    nextId += 2;
  }

  objBodies[2] =
    `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjIds.length} >>`;

  const offsets: number[] = [0];
  let pos = header.length;
  for (let i = 1; i < objBodies.length; i++) {
    offsets.push(pos);
    const s = `${i} 0 obj${objBodies[i]}endobj\n`;
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

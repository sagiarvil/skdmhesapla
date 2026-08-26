"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStoreZip = buildStoreZip;
exports.getLineHeight = getLineHeight;
exports.paginateRichLines = paginateRichLines;
exports.richPagesToPdfBytes = richPagesToPdfBytes;
exports.textToPdfBytes = textToPdfBytes;
exports.textToMultiPagePdfBytes = textToMultiPagePdfBytes;
exports.csvToXlsxBytes = csvToXlsxBytes;
exports.bytesToBase64 = bytesToBase64;
exports.base64ToBytes = base64ToBytes;
/**
 * Plan 20 — mühür paketinde gerçek PDF / XLSX baytları (ek bağımlılık yok).
 *
 * GATE-M2 (RM-005): PDF metinleri artık WinAnsi+ASCII ikame ile değil, gömülü
 * Inter altkümesi (CIDFontType2 + Identity-H) üzerinden çizilir. Türkçe glifler
 * (İ ı Ş ş Ğ ğ ç ö ü) gömülü font cmap'inde birebir korunur.
 */
const font_data_1 = require("./font-data");
function concatBytes(parts) {
    const total = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(total);
    let o = 0;
    for (const p of parts) {
        out.set(p, o);
        o += p.length;
    }
    return out;
}
function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
        c ^= bytes[i];
        for (let k = 0; k < 8; k++) {
            c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
        }
    }
    return (c ^ 0xffffffff) >>> 0;
}
function u16(n) {
    return new Uint8Array([n & 0xff, (n >>> 8) & 0xff]);
}
function u32(n) {
    return new Uint8Array([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);
}
/** ZIP STORE — PCF/CBAM paketleri paylaşır; hesaplama domain'i paylaşılmaz. */
function buildStoreZip(files) {
    return storeZip(files);
}
function storeZip(files) {
    const enc = new TextEncoder();
    const localParts = [];
    const centralParts = [];
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
/** Küme dışı karakterler için görünür ikame — '?' glifi. */
const MISSING_CHAR_FALLBACK = 0x3f;
/** Bağımlılıksız base64 → bayt (Tarayıcı + Node ortak, Buffer/atob yok). */
function base64DecodeBytes(b64) {
    const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let buffer = 0;
    let bits = 0;
    const out = [];
    for (const ch of b64) {
        if (ch === "=")
            break;
        const val = ALPHA.indexOf(ch);
        if (val < 0)
            continue;
        buffer = (buffer << 6) | val;
        bits += 6;
        if (bits >= 8) {
            bits -= 8;
            out.push((buffer >> bits) & 0xff);
        }
    }
    return new Uint8Array(out);
}
/**
 * Metin → Identity-H hex GID dizisi (GATE-M2).
 * FONT_CMAP'te olmayan karakterler '?' glifine düşer — hiçbir Türkçe
 * karakter ASCII ikamesiyle ezilmez.
 */
function hexGids(s) {
    let out = "";
    for (const ch of String(s ?? "")) {
        const code = ch.codePointAt(0);
        const gid = font_data_1.FONT_CMAP[code] ?? font_data_1.FONT_CMAP[MISSING_CHAR_FALLBACK] ?? 0;
        out += gid.toString(16).padStart(4, "0");
    }
    return `<${out}>`;
}
/** /W dizisi — font ünitesindeki advance genişlikleri 1/1000 em'e ölçeklenir. */
function cidWidths(widths) {
    return widths.map((w) => Math.round((w / font_data_1.FONT_UPEM) * 1000));
}
/** ToUnicode CMap — gid → Unicode (metin seçme/kopyalama). */
function buildToUnicodeCmap() {
    const gidToChar = new Map();
    for (const [code, gid] of Object.entries(font_data_1.FONT_CMAP)) {
        const g = Number(gid);
        if (!gidToChar.has(g))
            gidToChar.set(g, Number(code));
    }
    const rows = [...gidToChar.entries()]
        .sort((x, y) => x[0] - y[0])
        .map(([gid, code]) => `<${gid.toString(16).padStart(4, "0")}> <${code.toString(16).padStart(4, "0")}>`);
    const chunks = [];
    for (let i = 0; i < rows.length; i += 100) {
        const slice = rows.slice(i, i + 100);
        chunks.push(`${slice.length} beginbfchar\n${slice.join("\n")}\nendbfchar`);
    }
    return `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000> <FFFF>
endcodespacerange
${chunks.join("\n")}
endcmap
CMapName currentdict /CMap defineresource pop
end
end`;
}
/**
 * Gömülü Inter font ön haznesi — nesne 1..12 (Catalog, Pages, F1/F2 Type0,
 * CIDFont, FontDescriptor, FontFile2×2, ToUnicode×2). Sayfalar 13'ten başlar.
 */
function embeddedFontPreamble() {
    const enc = new TextEncoder();
    const toUnicode = buildToUnicodeCmap();
    const reg = base64DecodeBytes(font_data_1.FONT_REGULAR_BASE64);
    const bold = base64DecodeBytes(font_data_1.FONT_BOLD_BASE64);
    const regW = cidWidths(font_data_1.FONT_REGULAR_WIDTHS).map((w, i) => `${i} ${i} ${w}`).join(" ");
    const boldW = cidWidths(font_data_1.FONT_BOLD_WIDTHS).map((w, i) => `${i} ${i} ${w}`).join(" ");
    const bbox = font_data_1.FONT_BBOX.join(" ");
    const str = (s) => [enc.encode(s)];
    const objects = [
        str("<< /Type /Catalog /Pages 2 0 R >>"),
        str("PLACEHOLDER_PAGES"),
        str("<< /Type /Font /Subtype /Type0 /BaseFont /Inter-Regular /Encoding /Identity-H /DescendantFonts [5 0 R] /ToUnicode 11 0 R >>"),
        str("<< /Type /Font /Subtype /Type0 /BaseFont /Inter-Bold /Encoding /Identity-H /DescendantFonts [6 0 R] /ToUnicode 12 0 R >>"),
        str(`<< /Type /Font /Subtype /CIDFontType2 /BaseFont /Inter-Regular /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor 7 0 R /DW 1000 /W [${regW}] /CIDToGIDMap /Identity >>`),
        str(`<< /Type /Font /Subtype /CIDFontType2 /BaseFont /Inter-Bold /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor 8 0 R /DW 1000 /W [${boldW}] /CIDToGIDMap /Identity >>`),
        str(`<< /Type /FontDescriptor /FontName /Inter-Regular /Flags 4 /FontBBox [${bbox}] /ItalicAngle 0 /Ascent ${font_data_1.FONT_ASCENT} /Descent ${font_data_1.FONT_DESCENT} /StemV 80 /FontFile2 9 0 R >>`),
        str(`<< /Type /FontDescriptor /FontName /Inter-Bold /Flags 4 /FontBBox [${bbox}] /ItalicAngle 0 /Ascent ${font_data_1.FONT_ASCENT} /Descent ${font_data_1.FONT_DESCENT} /StemV 120 /FontFile2 10 0 R >>`),
        [enc.encode(`<< /Length ${reg.length} /Length1 ${reg.length} >>stream\n`), reg, enc.encode("\nendstream")],
        [enc.encode(`<< /Length ${bold.length} /Length1 ${bold.length} >>stream\n`), bold, enc.encode("\nendstream")],
        [enc.encode(`<< /Length ${toUnicode.length} >>stream\n${toUnicode}\nendstream`)],
        [enc.encode(`<< /Length ${toUnicode.length} >>stream\n${toUnicode}\nendstream`)],
    ];
    return { objects, firstPageId: objects.length + 1 };
}
/** PDF iskelet montajı — nesne listesi + xref + trailer. */
function assemblePdf(objects, after = []) {
    const enc = new TextEncoder();
    const header = enc.encode("%PDF-1.4\n");
    const parts = [header];
    const offsets = [0];
    let pos = header.length;
    for (let i = 0; i < objects.length; i++) {
        offsets.push(pos);
        const objParts = objects[i];
        const head = enc.encode(`${i + 1} 0 obj\n`);
        const tail = enc.encode("\nendobj\n");
        const total = head.length + objParts.reduce((s, x) => s + x.length, 0) + tail.length;
        parts.push(head, ...objParts, tail);
        pos += total;
    }
    const xrefStart = pos;
    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 0; i < objects.length; i++) {
        xref += `${String(offsets[i + 1]).padStart(10, "0")} 00000 n \n`;
    }
    xref += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    parts.push(enc.encode(xref), ...after);
    return concatBytes(parts);
}
/** Kelime sınırlarından kırparak metni satırlara böler. Hiçbir zaman ~ ile kesmez. */
function wrapText(text, maxCharsPerLine) {
    if (!text)
        return [""];
    const max = Math.max(8, maxCharsPerLine);
    const paragraphs = text.split(/\r?\n/);
    const result = [];
    for (const para of paragraphs) {
        if (!para.trim()) {
            result.push("");
            continue;
        }
        const words = para.split(" ");
        let currentLine = "";
        for (const word of words) {
            if (!word)
                continue;
            if (word.length > max) {
                if (currentLine) {
                    result.push(currentLine);
                    currentLine = "";
                }
                let remaining = word;
                while (remaining.length > max) {
                    result.push(remaining.slice(0, max));
                    remaining = remaining.slice(max);
                }
                currentLine = remaining;
            }
            else if (!currentLine) {
                currentLine = word;
            }
            else if (currentLine.length + 1 + word.length <= max) {
                currentLine += " " + word;
            }
            else {
                result.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) {
            result.push(currentLine);
        }
    }
    return result.length > 0 ? result : [""];
}
// ── Executive Color Palette (#172510, #84CC16, #F8FAF4, #0F172A) ─────────────
const C_BAND_R = "0.090 0.145 0.063"; // Deep Forest Bar (#172510)
const C_LIME = "0.518 0.800 0.086"; // Vibrant Lime Accent (#84CC16)
const C_WHITE = "1 1 1";
const C_INK = "0.059 0.090 0.165"; // Executive Obsidian Ink (#0F172A)
const C_BG_LIGHT = "0.969 0.980 0.957"; // Warm Soft Card Surface (#F7FAF4)
const C_DIVIDER = "0.850 0.890 0.820"; // Subtle Divider
const C_GRAY = "0.278 0.333 0.412"; // Slate Gray Muted Text (#475569)
const C_HEADER_BG = "0.118 0.161 0.231"; // Dark Obsidian Table Header (#1E293B)
const C_LIME_DARK = "0.173 0.271 0.043"; // Deep Olive (lime üstü metin) (#2C450B)
const C_SOFT_LIME = "0.851 0.918 0.639"; // Açık zeytin-pastel (hero üstü alt metin) (#D9EA9B)
const C_HAIRLINE = "0.941 0.961 0.910"; // İnce çizgi (#F0F5E8)
/** Helvetica yaklaşık metin genişliği (pt) — sağa hizalı sütunlar için. */
function approxTextWidth(text, fontSize) {
    return (text || "").length * fontSize * 0.5;
}
/** Sütun oranları → piksel genişlikleri. widths yoksa eşit bölünür. */
function colWidths(count, widths) {
    const w = widths && widths.length === count ? widths : Array.from({ length: count }, () => 1);
    const total = w.reduce((a, b) => a + b, 0) || 1;
    return w.map((x) => (x / total) * COL_W);
}
const CONTENT_TOP = 715;
const CONTENT_BOT = 48;
const PAGE_W = 612;
const ML = 36;
const MR = 36;
const COL_W = PAGE_W - ML - MR; // 540pt
/** Her satır öğesinin dinamik yüksekliği (pt). */
function getLineHeight(line) {
    switch (line.type) {
        case "body": {
            const lines = wrapText(line.text, 92);
            return lines.length * 13 + 3;
        }
        case "section":
            return 22;
        case "kv": {
            const valLines = wrapText(line.val, 64);
            return Math.max(1, valLines.length) * 13 + 4;
        }
        case "table-h": {
            const widths = colWidths(line.cols.length, line.widths);
            let maxL = 1;
            line.cols.forEach((col, i) => {
                const charsPerCol = Math.max(6, Math.floor(widths[i] / 5.2));
                maxL = Math.max(maxL, wrapText(col, charsPerCol).length);
            });
            return maxL * 13 + 9;
        }
        case "table-r": {
            const widths = colWidths(line.cols.length, line.widths);
            let maxL = 1;
            line.cols.forEach((col, i) => {
                const charsPerCol = Math.max(6, Math.floor(widths[i] / 5.2));
                maxL = Math.max(maxL, wrapText(col, charsPerCol).length);
            });
            return maxL * 13 + 7;
        }
        case "metric":
            return 44;
        case "kpi-row":
            return 56;
        case "bullet": {
            const lines = wrapText("• " + line.text, 88);
            return lines.length * 13 + 3;
        }
        case "note": {
            const lines = wrapText(line.text, 105);
            return lines.length * 10 + 3;
        }
        case "spacer":
            return line.size ?? 6;
        case "divider":
            return 6;
        case "page-break":
            return 0;
        case "cover": {
            const rows = Math.ceil(line.facts.length / 2);
            return 252 + rows * 50 + (rows > 0 ? 8 : 0);
        }
        default:
            return 13;
    }
}
/**
 * Zengin sayfalı PDF content stream oluşturur.
 * Otomatik kelime kaydırma, WinAnsiEncoding ve Executive layout.
 */
function buildRichPageStream(richLines, pageNo, pageCount, meta) {
    const brand = hexGids(meta.title || "SKDMHESAPLA  |  KAPSAMLI DURUM RAPORU");
    const footerTxt = hexGids(meta.footer || "SKDMHesapla Mühürlü Veri Paketi  ·  skdmhesapla.com/dogrula/");
    const pageTxt = hexGids(`Sayfa ${pageNo} / ${pageCount}`);
    const ops = [];
    // ── Executive Header Band (#172510, y=748–792) ─────────────────────────────
    const badgeText = "DOĞRULANABİLİR MÜHÜR";
    const badgeW = 134;
    const badgeX = PAGE_W - MR - badgeW;
    const badgeTW = approxTextWidth(badgeText, 7.5);
    ops.push("q", `${C_BAND_R} rg`, `0 748 ${PAGE_W} 44 re f`, `${C_LIME} rg`, `0 745 ${PAGE_W} 3 re f`, "Q", 
    // Marka + rapor adı (harf aralıklı)
    "BT", "/F2 9 Tf", "0.6 Tc", `${C_WHITE} rg`, `${ML} 764 Td`, `${brand} Tj`, "0 Tc", "ET", 
    // Mühür rozeti — ince lime çerçeve + lime metin
    "q", `${C_LIME} RG`, "1 w", `${badgeX} 757 ${badgeW} 15 re S`, "Q", "BT", "/F2 7.5 Tf", `${C_LIME} rg`, `${badgeX + (badgeW - badgeTW) / 2} 762 Td`, `${hexGids(badgeText)} Tj`, "ET");
    // ── İçerik Alanı Render ───────────────────────────────────────────────────
    let y = CONTENT_TOP;
    for (const line of richLines) {
        const h = getLineHeight(line);
        if (y - h < CONTENT_BOT)
            break;
        switch (line.type) {
            case "section": {
                // Executive bölüm bandı: lime aksan + numara çipi
                const bandH = h - 2;
                ops.push("q", `${C_BAND_R} rg`, `${ML} ${y - h + 2} ${COL_W} ${bandH} re f`, `${C_LIME} rg`, `${ML} ${y - h + 2} 4 ${bandH} re f`, "Q");
                if (line.num) {
                    ops.push("q", `${C_LIME} rg`, `${ML + 8} ${y - h + 5} 26 ${bandH - 6} re f`, "Q", "BT", "/F2 8 Tf", `${C_LIME_DARK} rg`, `${ML + 13} ${y - 14} Td`, `${hexGids(line.num)} Tj`, "ET", "BT", "/F2 8.5 Tf", "0.5 Tc", `${C_WHITE} rg`, `${ML + 44} ${y - 14} Td`, `${hexGids(line.text)} Tj`, "0 Tc", "ET");
                }
                else {
                    ops.push("BT", "/F2 8.5 Tf", `${C_WHITE} rg`, `${ML + 10} ${y - 14} Td`, `${hexGids(line.text)} Tj`, "ET");
                }
                break;
            }
            case "kv": {
                const keyW = 180;
                const valLines = wrapText(line.val, 64);
                const lineH = Math.max(1, valLines.length) * 13 + 4;
                ops.push("q", `${C_BG_LIGHT} rg`, `${ML} ${y - lineH + 2} ${COL_W} ${lineH - 1} re f`, `${C_HAIRLINE} rg`, `${ML} ${y - lineH + 2} ${COL_W} 0.5 re f`, "Q", "BT", "/F2 8.5 Tf", `${C_INK} rg`, `${ML + 8} ${y - 12} Td`, `${hexGids(line.key)} Tj`, "ET");
                valLines.forEach((vl, idx) => {
                    ops.push("BT", "/F1 8.5 Tf", `${C_INK} rg`, `${ML + keyW} ${y - 12 - idx * 13} Td`, `${hexGids(vl)} Tj`, "ET");
                });
                break;
            }
            case "table-h": {
                const cols = line.cols;
                const widths = colWidths(cols.length, line.widths);
                const rightSet = new Set(line.right || []);
                ops.push("q", `${C_HEADER_BG} rg`, `${ML} ${y - h + 2} ${COL_W} ${h - 2} re f`, "Q");
                let x = ML;
                cols.forEach((c, i) => {
                    const colW = widths[i];
                    const charsPerCol = Math.max(6, Math.floor(colW / 5.2));
                    const cLines = wrapText(c, charsPerCol);
                    cLines.forEach((cl, idx) => {
                        const tx = rightSet.has(i) ? x + colW - approxTextWidth(cl, 7.5) - 6 : x + 6;
                        ops.push("BT", "/F2 7.5 Tf", `${C_WHITE} rg`, `${tx} ${y - 13 - idx * 13} Td`, `${hexGids(cl)} Tj`, "ET");
                    });
                    x += colW;
                });
                break;
            }
            case "table-r": {
                const cols = line.cols;
                const widths = colWidths(cols.length, line.widths);
                const rightSet = new Set(line.right || []);
                if (line.even) {
                    ops.push("q", `${C_BG_LIGHT} rg`, `${ML} ${y - h + 2} ${COL_W} ${h - 2} re f`, "Q");
                }
                ops.push("q", `${C_HAIRLINE} rg`, `${ML} ${y - h + 2} ${COL_W} 0.4 re f`, "Q");
                let x = ML;
                cols.forEach((c, i) => {
                    const colW = widths[i];
                    const charsPerCol = Math.max(6, Math.floor(colW / 5.2));
                    const cLines = wrapText(c, charsPerCol);
                    cLines.forEach((cl, idx) => {
                        const tx = rightSet.has(i) ? x + colW - approxTextWidth(cl, 8) - 6 : x + 6;
                        ops.push("BT", "/F1 8 Tf", `${C_INK} rg`, `${tx} ${y - 11 - idx * 13} Td`, `${hexGids(cl)} Tj`, "ET");
                    });
                    x += colW;
                });
                break;
            }
            case "metric": {
                ops.push("q", `${C_BG_LIGHT} rg`, `${ML} ${y - h + 2} ${COL_W} ${h - 2} re f`, `${C_LIME} rg`, `${ML} ${y - h + 2} 4 ${h - 2} re f`, `${C_HAIRLINE} rg`, `${ML + 4} ${y - h + 2} ${COL_W - 4} 0.5 re f`, `${ML + 4} ${y} ${COL_W - 4} 0.5 re f`, "Q", "BT", "/F2 8 Tf", "0.4 Tc", `${C_GRAY} rg`, `${ML + 14} ${y - 13} Td`, `${hexGids(line.label)} Tj`, "0 Tc", "ET", "BT", "/F2 16 Tf", `${C_INK} rg`, `${ML + 14} ${y - 34} Td`, `${hexGids(line.value)} Tj`, "ET");
                break;
            }
            case "kpi-row": {
                const gap = 8;
                const n = Math.max(1, line.cards.length);
                const cardW = (COL_W - (n - 1) * gap) / n;
                line.cards.forEach((card, i) => {
                    const cx = ML + i * (cardW + gap);
                    const ch = h - 2;
                    ops.push("q", `${C_BG_LIGHT} rg`, `${cx} ${y - h + 2} ${cardW} ${ch} re f`, card.accent ? `${C_LIME} rg` : `${C_HAIRLINE} rg`, `${cx} ${y - h + 2} ${cardW} 3 re f`, "Q", "BT", "/F2 7 Tf", "0.3 Tc", `${C_GRAY} rg`, `${cx + 8} ${y - 13} Td`, `${hexGids(card.label)} Tj`, "0 Tc", "ET", "BT", "/F2 15 Tf", `${C_INK} rg`, `${cx + 8} ${y - 34} Td`, `${hexGids(card.value)} Tj`, "ET");
                });
                break;
            }
            case "bullet": {
                const bLines = wrapText("• " + line.text, 88);
                bLines.forEach((bl, idx) => {
                    ops.push("BT", "/F1 9 Tf", `${C_INK} rg`, `${ML + 10} ${y - 11 - idx * 13} Td`, `${hexGids(bl)} Tj`, "ET");
                });
                break;
            }
            case "note": {
                const nLines = wrapText(line.text, 105);
                nLines.forEach((nl, idx) => {
                    ops.push("BT", "/F1 7.5 Tf", `${C_GRAY} rg`, `${ML} ${y - 10 - idx * 10} Td`, `${hexGids(nl)} Tj`, "ET");
                });
                break;
            }
            case "divider": {
                ops.push("q", `${C_DIVIDER} rg`, `${ML} ${y - 2} ${COL_W} 0.8 re f`, "Q");
                break;
            }
            case "body": {
                const bodyLines = wrapText(line.text, 92);
                bodyLines.forEach((bl, idx) => {
                    ops.push("BT", "/F1 9 Tf", `${C_INK} rg`, `${ML} ${y - 11 - idx * 13} Td`, `${hexGids(bl)} Tj`, "ET");
                });
                break;
            }
            case "cover": {
                // Tam genişlik hero bandı + bilgi kartları grid'i
                const heroH = 250;
                const heroBottom = y - heroH;
                const badgeW = 170;
                const badgeH = 20;
                ops.push("q", `${C_BAND_R} rg`, `${ML - 8} ${heroBottom} ${COL_W + 16} ${heroH + 31} re f`, `${C_LIME} rg`, `${ML - 8} ${y + 29} ${COL_W + 16} 3 re f`, `${ML - 8} ${heroBottom - 1} ${COL_W + 16} 3 re f`, "Q", "BT", "/F2 8 Tf", "1.2 Tc", `${C_LIME} rg`, `${ML} ${y - 28} Td`, `${hexGids("MÜHÜRLÜ VERİ PAKETİ")} Tj`, "0 Tc", "ET", "BT", "/F2 22 Tf", `${C_WHITE} rg`, `${ML} ${y - 60} Td`, `${hexGids(line.title)} Tj`, "ET", "BT", "/F1 10.5 Tf", `${C_SOFT_LIME} rg`, `${ML} ${y - 82} Td`, `${hexGids(line.subtitle)} Tj`, "ET", "q", `${C_LIME} RG`, "1 w", `${ML} ${heroBottom + 22} ${badgeW} ${badgeH} re S`, "Q", "BT", "/F2 8.5 Tf", `${C_LIME} rg`, `${ML + 12} ${heroBottom + 30} Td`, `${hexGids(line.badge)} Tj`, "ET");
                const cardGap = 8;
                const cardW = (COL_W - cardGap) / 2;
                line.facts.forEach((f, i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    const cx = ML + col * (cardW + cardGap);
                    const cy = heroBottom - 10 - row * 52;
                    ops.push("q", `${C_WHITE} rg`, `${cx} ${cy - 46} ${cardW} 46 re f`, `${C_HAIRLINE} rg`, `${cx} ${cy - 46} ${cardW} 0.6 re f`, `${cx} ${cy} ${cardW} 0.6 re f`, `${cx} ${cy - 46} 0.6 ${46} re f`, `${cx + cardW} ${cy - 46} 0.6 ${46} re f`, "Q", "BT", "/F2 7 Tf", "0.3 Tc", `${C_GRAY} rg`, `${cx + 10} ${cy - 13} Td`, `${hexGids(f.key)} Tj`, "0 Tc", "ET", "BT", "/F1 9 Tf", `${C_INK} rg`, `${cx + 10} ${cy - 33} Td`, `${hexGids(f.val)} Tj`, "ET");
                });
                break;
            }
            case "spacer":
            case "page-break":
            default:
                break;
        }
        y -= h;
    }
    // ── Alt Bilgi Footer (lime hairline + paket bağlantısı + sayfa no) ─────────
    ops.push("q", `${C_LIME} rg`, `${ML} 42 ${COL_W} 1.2 re f`, "Q", "BT", "/F1 7 Tf", `${C_GRAY} rg`, `${ML} 28 Td`, `${footerTxt} Tj`, "ET", "BT", "/F2 7 Tf", `${C_INK} rg`, `${PAGE_W - MR - 60} 28 Td`, `${pageTxt} Tj`, "ET");
    return ops.join("\n");
}
/** Kapsamlı rapor için rich sayfalama: Dinamik yükseklikle sayfalara böl. */
function paginateRichLines(lines) {
    const pages = [];
    let current = [];
    let usedPt = 0;
    const available = CONTENT_TOP - CONTENT_BOT; // ~667pt
    for (const line of lines) {
        if (line.type === "page-break") {
            if (current.length > 0) {
                pages.push(current);
                current = [];
                usedPt = 0;
            }
            continue;
        }
        const h = getLineHeight(line);
        if (usedPt + h > available && current.length > 0) {
            pages.push(current);
            current = [];
            usedPt = 0;
        }
        current.push(line);
        usedPt += h;
    }
    if (current.length > 0)
        pages.push(current);
    if (pages.length === 0)
        pages.push([]);
    return pages;
}
/**
 * Zengin PdfLine[][] → geçerli PDF baytları (GATE-M2).
 * F1=Inter-Regular, F2=Inter-Bold — CIDFontType2 + Identity-H gömülü TTF.
 * Türkçe glifler tam korunur; WinAnsi/ASCII ikamesi yok.
 */
function richPagesToPdfBytes(pages, meta = {}, plainBodyText = "") {
    const enc = new TextEncoder();
    const { objects, firstPageId } = embeddedFontPreamble();
    const pageObjIds = [];
    let nextId = firstPageId;
    const pageCount = pages.length;
    for (let pi = 0; pi < pageCount; pi++) {
        const pageId = nextId;
        const contentId = nextId + 1;
        pageObjIds.push(pageId);
        const stream = buildRichPageStream(pages[pi], pi + 1, pageCount, meta);
        objects.push([enc.encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} 792] /Contents ${contentId} 0 R /Resources<< /Font<< /F1 3 0 R /F2 4 0 R >> >> >>`)], [enc.encode(`<< /Length ${stream.length} >>stream\n${stream}\nendstream`)]);
        nextId += 2;
    }
    objects[1] = [enc.encode(`<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`)];
    const after = [];
    if (plainBodyText) {
        after.push(enc.encode(`\n%UTF8-BODY-START\n${plainBodyText}\n%UTF8-BODY-END\n`));
    }
    return assemblePdf(objects, after);
}
/** ── Geriye dönük uyumluluk: düz metin tabanlı üretim (GATE-M2 ile hex GID) ── */
function buildFormalPageStream(pageLines, pageNo, pageCount, meta) {
    const title = (meta.title || "SKDMHesapla").slice(0, 78);
    const footer = (meta.footer || "SKDMHesapla  |  skdmhesapla.com/dogrula/").slice(0, 78);
    const pageMark = `Sayfa ${pageNo} / ${pageCount}`;
    const ops = [
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
        `${hexGids(title)} Tj`,
        "ET",
        "BT",
        "/F1 9 Tf",
        `${C_INK} rg`,
        `${ML} 726 Td`,
        "12 TL",
    ];
    for (const line of pageLines) {
        ops.push(`${hexGids(line.slice(0, 92))} '`);
    }
    ops.push("ET", "q", `${C_LIME} rg`, `${ML} 40 ${COL_W} 1 re f`, "Q", "BT", "/F1 7 Tf", `${C_GRAY} rg`, `${ML} 26 Td`, `${hexGids(footer)} Tj`, "ET", "BT", "/F1 7 Tf", `${C_GRAY} rg`, `${PAGE_W - MR - 50} 26 Td`, `${hexGids(pageMark)} Tj`, "ET");
    return ops.join("\n");
}
/** Geçerli PDF-1.4 + UTF-8 gövde yorumu. Çok sayfa; üst bant / sayfa no. */
function textToPdfBytes(plainText, meta) {
    return textToMultiPagePdfBytes(plainText, 46, meta);
}
/** Çok sayfalı formel rapor PDF — düz metin tabanlı üretim (GATE-M2 gömülü font). */
function textToMultiPagePdfBytes(plainText, linesPerPage = 46, meta = {}) {
    const enc = new TextEncoder();
    const allLines = plainText.split(/\r?\n/);
    const pages = [];
    for (let i = 0; i < allLines.length; i += linesPerPage) {
        pages.push(allLines.slice(i, i + linesPerPage));
    }
    if (pages.length === 0)
        pages.push([""]);
    const { objects, firstPageId } = embeddedFontPreamble();
    const pageObjIds = [];
    let nextId = firstPageId;
    for (let pi = 0; pi < pages.length; pi++) {
        const pageLines = pages[pi];
        const pageId = nextId;
        const contentId = nextId + 1;
        pageObjIds.push(pageId);
        const streamBody = buildFormalPageStream(pageLines, pi + 1, pages.length, meta);
        objects.push([enc.encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} 792] /Contents ${contentId} 0 R /Resources<< /Font<< /F1 3 0 R /F2 4 0 R >> >> >>`)], [enc.encode(`<< /Length ${streamBody.length} >>stream\n${streamBody}\nendstream`)]);
        nextId += 2;
    }
    objects[1] = [enc.encode(`<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjIds.length} >>`)];
    return assemblePdf(objects, [enc.encode(`\n%UTF8-BODY-START\n${plainText}\n%UTF8-BODY-END\n`)]);
}
function xmlEscape(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function csvToXlsxBytes(csvText) {
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
            data: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`),
        },
        {
            name: "_rels/.rels",
            data: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`),
        },
        {
            name: "xl/workbook.xml",
            data: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="SKDM" sheetId="1" r:id="rId1"/></sheets>
</workbook>`),
        },
        {
            name: "xl/_rels/workbook.xml.rels",
            data: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`),
        },
        {
            name: "xl/worksheets/sheet1.xml",
            data: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetRows}</sheetData>
</worksheet>`),
        },
    ]);
}
function bytesToBase64(bytes) {
    return Buffer.from(bytes).toString("base64");
}
function base64ToBytes(b64) {
    return new Uint8Array(Buffer.from(b64, "base64"));
}

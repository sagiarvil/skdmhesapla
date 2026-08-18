/**
 * GATE-M2 (RM-005) font pipeline — Türkçe glifli TTF altkümesi üretimi.
 *
 * Kaynak: .cache/fonts/extras/ttf/Inter-{Regular,Bold}.ttf (SIL OFL 1.1).
 * Çıktı:  src/lib/skdm/font-data.ts — iki ağırlık için
 *         subset TTF (base64) + ortak unicode→GID eşlemesi + GID genişlikleri.
 *
 * Her iki ağırlık AYNI GID sırasını paylaşır (küme karakter koduna göre
 * sıralanır); böylece seal-binary tek bir cmap ile Identity-H hex GID üretir.
 * GSUB/GPOS/kern/DSIG gibi GID referanslı tablolar subset'ten düşer —
 * PDF okuyucuları CIDFontType2'de OpenType şekillendirme uygulamaz.
 *
 * Kullanım: node scripts/build-font-data.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TTF_DIR = join(ROOT, ".cache", "fonts", "extras", "ttf");
const OUT = join(ROOT, "src", "lib", "skdm", "font-data.ts");

const WEIGHTS = [
  { key: "REGULAR", tag: "Inter-Regular.ttf" },
  { key: "BOLD", tag: "Inter-Bold.ttf" },
];

const u8 = (n) => new Uint8Array([n & 0xff]);
const u16 = (n) => new Uint8Array([(n >>> 8) & 0xff, n & 0xff]);
const i16 = (n) => {
  const v = n < 0 ? n + 0x10000 : n;
  return new Uint8Array([(v >>> 8) & 0xff, v & 0xff]);
};
const u32 = (n) => new Uint8Array([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
const f32 = (n) => {
  const b = new DataView(new ArrayBuffer(4));
  b.setFloat32(0, n, false);
  return new Uint8Array(b.buffer);
};

const readU16 = (b, o) => (b[o] << 8) | b[o + 1];
const readU32 = (b, o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
const s16 = (v) => (v >= 0x8000 ? v - 0x10000 : v);

function concatParts(parts) {
  const total = parts.reduce((s, p) => s + (p ? p.length : 0), 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    if (p) {
      out.set(p, o);
      o += p.length;
    }
  }
  return out;
}

function parseTables(buf) {
  const numTables = readU16(buf, 4);
  const tables = new Map();
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    const tag = String.fromCharCode(buf[o], buf[o + 1], buf[o + 2], buf[o + 3]);
    const offset = readU32(buf, o + 8);
    const length = readU32(buf, o + 12);
    tables.set(tag, { offset, length, data: buf.subarray(offset, offset + length) });
  }
  return tables;
}

/** Windows Unicode cmap çözümleyici — önce format 12 (UCS-4), yoksa format 4 (BMP). */
function parseCmapLookup(tables) {
  const cmapTable = tables.get("cmap").data;
  const numTables = readU16(cmapTable, 2);
  let sub = null;
  for (let i = 0; i < numTables; i++) {
    const o = 4 + i * 8;
    if (readU16(cmapTable, o) === 3 && readU16(cmapTable, o + 2) === 10) {
      sub = { offset: readU32(cmapTable, o + 4) };
      break;
    }
  }
  if (!sub) {
    for (let i = 0; i < numTables; i++) {
      const o = 4 + i * 8;
      if (readU16(cmapTable, o) === 3 && readU16(cmapTable, o + 2) === 1) {
        sub = { offset: readU32(cmapTable, o + 4) };
        break;
      }
    }
  }
  if (!sub) throw new Error("cmap: Windows unicode alt tablosu bulunamadı");
  const d = cmapTable.subarray(sub.offset);
  const format = readU16(d, 0);
  if (format === 4) {
    const segCount = readU16(d, 6) >> 1;
    const end = [], start = [], delta = [], roff = [];
    let o = 14;
    for (let i = 0; i < segCount; i++) end.push(readU16(d, o + i * 2));
    o += segCount * 2 + 2;
    for (let i = 0; i < segCount; i++) start.push(readU16(d, o + i * 2));
    o += segCount * 2;
    for (let i = 0; i < segCount; i++) delta.push(readU16(d, o + i * 2));
    o += segCount * 2;
    for (let i = 0; i < segCount; i++) roff.push(readU16(d, o + i * 2));
    const glyphBase = sub.offset + o;
    return (code) => {
      for (let i = 0; i < segCount; i++) {
        if (code >= start[i] && code <= end[i]) {
          if (roff[i] === 0) {
            const gid = (code + delta[i]) % 65536;
            return gid === 0 ? undefined : gid;
          }
          const addr = glyphBase + roff[i] + (code - start[i]) * 2;
          return readU16(cmapTable, addr) || undefined;
        }
      }
      return undefined;
    };
  }
  if (format === 12) {
    const nGroups = readU32(d, 12);
    const groups = [];
    for (let i = 0; i < nGroups; i++) {
      const o = 16 + i * 12;
      groups.push([readU32(d, o), readU32(d, o + 4), readU32(d, o + 8)]);
    }
    return (code) => {
      for (const [sc, ec, sg] of groups) {
        if (code >= sc && code <= ec) return sg + (code - sc);
      }
      return undefined;
    };
  }
  throw new Error(`cmap: desteklenmeyen format ${format}`);
}

/** Uygulama karakter kümesi — PDF metinlerinin kapsadığı tüm glifler. */
function buildCharSet() {
  const set = new Set();
  for (let c = 0x20; c <= 0x7e; c++) set.add(c);   // ASCII printable
  for (let c = 0xa0; c <= 0xff; c++) if (c !== 0xad) set.add(c); // Latin-1 (yumuşak tire hariç)
  for (let c = 0x100; c <= 0x17f; c++) set.add(c); // Latin Ext-A (İ ı Ş ş Ğ ğ)
  for (const c of [0x20ac, 0x20ba, 0x2022, 0x2013, 0x2014, 0x2026, 0x2713, 0x2715]) set.add(c);
  return set;
}

function checksumTable(data) {
  const padded = data.length % 4 ? concatParts([data, new Uint8Array(4 - (data.length % 4))]) : data;
  let sum = 0;
  for (let i = 0; i < padded.length; i += 4) sum = (sum + readU32(padded, i)) >>> 0;
  return sum;
}

function checksumWhole(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) sum = (sum + readU32(data, i)) >>> 0;
  return sum;
}

/** Kompozit glifin bileşen glyph index'lerini yeni GID'lere taşı. */
function remapComposite(gb, newGids) {
  const parts = [gb.subarray(0, 10)];
  let o = 10;
  let more = true;
  while (more) {
    const flags = readU16(gb, o);
    const compGid = readU16(gb, o + 2);
    const newComp = newGids.get(compGid);
    if (newComp === undefined) throw new Error(`Kompozit referans kümede yok: gid ${compGid}`);
    const head = new Uint8Array(4);
    head[0] = (flags >> 8) & 0xff;
    head[1] = flags & 0xff;
    head[2] = (newComp >> 8) & 0xff;
    head[3] = newComp & 0xff;
    parts.push(head);
    const aLen = flags & 0x0001 ? 4 : 2;
    let extra = 0;
    if (flags & 0x0008) extra = 2;
    else if (flags & 0x0040) extra = 4;
    else if (flags & 0x0080) extra = 8;
    parts.push(gb.subarray(o + 4, o + 4 + aLen + extra));
    o += 4 + aLen + extra;
    more = !!(flags & 0x0020);
  }
  if (o < gb.length) parts.push(gb.subarray(o));
  return concatParts(parts);
}

/**
 * Altküme TTF üretir. charList → yeni GID sırası (0=.notdef + kod sıralı).
 * Ağırlıklar arası GID paylaşımı bu sıralama ile sağlanır.
 */
function buildSubset(buf, tables, charList, lookup) {
  const head = tables.get("head").data;
  const upem = readU16(head, 18);
  const indexToLocFormat = readU16(head, 50);
  const maxp = tables.get("maxp").data;
  const origNumGlyphs = readU16(maxp, 4);
  const hhea = tables.get("hhea").data;
  const numHMetrics = readU16(hhea, 34);
  const hmtx = tables.get("hmtx").data;
  const glyf = tables.get("glyf").data;
  const loca = tables.get("loca").data;

  const locaOffsets = [];
  for (let g = 0; g <= origNumGlyphs; g++) {
    locaOffsets.push(indexToLocFormat === 0 ? readU16(loca, g * 2) * 2 : readU32(loca, g * 4));
  }
  const glyphBytes = (gid) => {
    if (gid >= origNumGlyphs) return new Uint8Array(0);
    return glyf.subarray(locaOffsets[gid], locaOffsets[gid + 1]);
  };

  // orijinal hmtx
  const origWidth = [];
  const origLsb = [];
  const lastAdvance = numHMetrics > 0 ? readU16(hmtx, (numHMetrics - 1) * 4) : 0;
  for (let g = 0; g < origNumGlyphs; g++) {
    if (g < numHMetrics) {
      origWidth.push(readU16(hmtx, g * 4));
      origLsb.push(s16(readU16(hmtx, g * 4 + 2)));
    } else {
      origWidth.push(lastAdvance);
      origLsb.push(s16(readU16(hmtx, numHMetrics * 4 + (g - numHMetrics) * 2)));
    }
  }

  // kompozit bağımlılık kapanışı
  const needed = new Set();
  const queue = [];
  for (const c of charList) {
    const g = lookup(c);
    if (g && !needed.has(g)) {
      needed.add(g);
      queue.push(g);
    }
  }
  while (queue.length) {
    const g = queue.pop();
    const gb = glyphBytes(g);
    if (gb.length < 10) continue;
    if (s16(readU16(gb, 0)) >= 0) continue;
    let o = 10;
    let flags = 0;
    do {
      flags = readU16(gb, o);
      const compGid = readU16(gb, o + 2);
      if (compGid !== 0 && !needed.has(compGid)) {
        needed.add(compGid);
        queue.push(compGid);
      }
      o += 4 + (flags & 0x0001 ? 4 : 2);
      if (flags & 0x0008) o += 2;
      else if (flags & 0x0040) o += 4;
      else if (flags & 0x0080) o += 8;
    } while (flags & 0x0020);
  }

  // yeni GID sırası:
  //  faz 1 — charList glyph'leri (her iki ağırlıkta AYNI sıra, kod sıralı),
  //  faz 2 — kompozit bileşenleri (ağırlık başına farklı olabilir).
  const newGids = new Map([[0, 0]]);
  const charToNewGid = new Map();
  let next = 1;
  for (const c of charList) {
    const g = lookup(c);
    if (g === undefined || g === 0) continue;
    if (!newGids.has(g)) newGids.set(g, next++);
    charToNewGid.set(c, newGids.get(g));
  }
  for (const g of needed) {
    if (!newGids.has(g)) newGids.set(g, next++);
  }
  const newGlyphCount = next;

  // yeni glyf + loca
  const newGlyfParts = [];
  const newLoca = [0];
  for (let newG = 0; newG < newGlyphCount; newG++) {
    const orig = [...newGids.entries()].find(([, ng]) => ng === newG)?.[0];
    if (orig === undefined) throw new Error("GID sıralama tutarsız");
    let gb = glyphBytes(orig);
    if (gb.length >= 10 && s16(readU16(gb, 0)) < 0) {
      try {
        gb = remapComposite(gb, newGids);
      } catch (e) {
        console.error(`REMAP HATASI: yeni gid ${newG} = orijinal gid ${orig}, yeniGids büyüklüğü ${newGids.size}`);
        console.error(e.message);
        // hangi bileşenler orijinalde?
        let p = 10;
        let f = 0;
        do {
          f = readU16(gb, p);
          console.error(`  komponent gid ${readU16(gb, p + 2)} (flags 0x${f.toString(16)}) kümede mi: ${newGids.has(readU16(gb, p + 2))}`);
          p += 4 + (f & 0x0001 ? 4 : 2);
          if (f & 0x0008) p += 2;
          else if (f & 0x0040) p += 4;
          else if (f & 0x0080) p += 8;
        } while (f & 0x0020);
        throw e;
      }
    }
    newGlyfParts.push(gb);
  }
  let glyfLen = newGlyfParts.reduce((s, p) => s + p.length, 0);
  if (glyfLen % 2 !== 0) {
    newGlyfParts.push(u8(0));
    glyfLen += 1;
  }
  const newGlyf = concatParts(newGlyfParts);
  const useLongLoca = glyfLen >= 0x10000;
  let acc = 0;
  const locaVals = [0];
  for (const p of newGlyfParts) {
    acc += p.length;
    locaVals.push(acc);
  }
  const newLocaBytes = concatParts(locaVals.map((off) => (useLongLoca ? u32(off) : u16(off / 2))));

  // yeni hmtx
  const newHmtx = concatParts(
    Array.from({ length: newGlyphCount }, (_, ng) => {
      const orig = [...newGids.entries()].find(([, v]) => v === ng)?.[0];
      return concatParts([u16(origWidth[orig]), i16(origLsb[orig])]);
    })
  );

  // hhea.numberOfHMetrics = newGlyphCount
  const newHhea = new Uint8Array(hhea);
  newHhea[34] = (newGlyphCount >> 8) & 0xff;
  newHhea[35] = newGlyphCount & 0xff;

  // maxp.numGlyphs
  const newMaxp = new Uint8Array(maxp);
  newMaxp[4] = (newGlyphCount >> 8) & 0xff;
  newMaxp[5] = newGlyphCount & 0xff;

  // head: indexToLocFormat + checkSumAdjustment=0
  const newHead = new Uint8Array(head);
  newHead[50] = useLongLoca ? 1 : 0;
  newHead[51] = 0;
  for (let i = 8; i < 12; i++) newHead[i] = 0;

  // yeni cmap: format 4 (contiguous idDelta, idRangeOffset=0) + 0xFFFF sentinel
  const sortedChars = charList.filter((c) => charToNewGid.has(c)).sort((a, b) => a - b);
  const segments = [];
  for (let i = 0; i < sortedChars.length; i++) {
    const start = sortedChars[i];
    let end = start;
    while (i + 1 < sortedChars.length && sortedChars[i + 1] === end + 1) {
      end++;
      i++;
    }
    segments.push({ start, end, delta: (charToNewGid.get(start) - start + 0x10000) % 0x10000 });
  }
  segments.push({ start: 0xffff, end: 0xffff, delta: 1 }); // spec zorunlu son segment
  const segCount = segments.length;
  const segCountX2 = segCount * 2;
  const maxPow2Seg = 1 << Math.floor(Math.log2(segCount));
  const cmapSearchRange = maxPow2Seg * 2;
  const cmapEntrySelector = Math.log2(maxPow2Seg);
  const cmapRangeShift = segCountX2 - cmapSearchRange;
  const format4Len = 16 + segCountX2 * 4; // 14 hdr + endCode + 2 pad + start + delta + roff
  const f4 = concatParts([
    u16(4), u16(format4Len), u16(0), u16(segCountX2),
    u16(cmapSearchRange), u16(cmapEntrySelector), u16(cmapRangeShift),
    ...segments.flatMap((s) => [u16(s.end)]),
    u16(0),
    ...segments.flatMap((s) => [u16(s.start)]),
    ...segments.flatMap((s) => [u16(s.delta)]),
    ...segments.flatMap(() => [u16(0)]),
  ]);
  const newCmap = concatParts([
    u16(0), u16(2),
    u16(0), u16(3), u32(20),
    u16(3), u16(1), u32(20),
    f4,
  ]);

  // post format 3.0 (glif adı yok)
  const newPost = concatParts([
    u32(0x00030000),
    f32(0),
    i16(0), i16(0),
    u32(0),
    u32(0), u32(0), u32(0), u32(0),
  ]);

  // GID referanssız statik tablolar
  const tableBlobs = new Map([
    ["head", newHead],
    ["hhea", newHhea],
    ["maxp", newMaxp],
    ["hmtx", newHmtx],
    ["cmap", newCmap],
    ["loca", newLocaBytes],
    ["glyf", newGlyf],
    ["post", newPost],
  ]);
  for (const tag of ["name", "OS/2", "cvt ", "fpgm", "prep"]) {
    const t = tables.get(tag);
    if (t) tableBlobs.set(tag, new Uint8Array(t.data));
  }

  // tablo dizini (sıralı) + dosya
  const entries = [...tableBlobs.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const num = entries.length;
  const maxPow2 = 1 << Math.floor(Math.log2(num));
  const searchRange = maxPow2 * 16;
  const rangeShift = num * 16 - searchRange;
  const dirParts = [u32(0x00010000), u16(num), u16(searchRange), u16(Math.log2(maxPow2)), u16(rangeShift)];
  let offset = 12 + num * 16;
  const blobParts = [];
  const headIdx = entries.findIndex(([t]) => t === "head");
  for (let i = 0; i < num; i++) {
    const [tag, data] = entries[i];
    dirParts.push(
      new Uint8Array([tag.charCodeAt(0), tag.charCodeAt(1), tag.charCodeAt(2), tag.charCodeAt(3)]),
      u32(checksumTable(data)),
      u32(offset),
      u32(data.length)
    );
    blobParts.push(data, (4 - (data.length % 4)) % 4 ? new Uint8Array((4 - (data.length % 4)) % 4) : null);
    offset += data.length + ((4 - (data.length % 4)) % 4);
  }
  const fileBytes = concatParts([concatParts(dirParts), ...blobParts.filter(Boolean)]);

  // head.checkSumAdjustment = 0xB1B0AFBA − dosya checksum'u
  const headDataOffset = readU32(fileBytes, 12 + headIdx * 16 + 8);
  const checkSumAdjPos = headDataOffset + 8;
  const adj = (0xb1b0afba - checksumWhole(fileBytes)) >>> 0;
  fileBytes[checkSumAdjPos] = (adj >>> 24) & 0xff;
  fileBytes[checkSumAdjPos + 1] = (adj >>> 16) & 0xff;
  fileBytes[checkSumAdjPos + 2] = (adj >>> 8) & 0xff;
  fileBytes[checkSumAdjPos + 3] = adj & 0xff;

  // genişlikler (yeni gid sırasına göre)
  const widths = [];
  for (let ng = 0; ng < newGlyphCount; ng++) {
    const orig = [...newGids.entries()].find(([, v]) => v === ng)?.[0];
    widths.push(origWidth[orig]);
  }

  return { fileBytes, newGlyphCount, charToNewGid, widths, upem };
}

// ── ana akış ────────────────────────────────────────────────────────────────
const charList = [...buildCharSet()].sort((a, b) => a - b);
const results = [];
let sharedCmap = null;

for (const { key, tag } of WEIGHTS) {
  const buf = readFileSync(join(TTF_DIR, tag));
  const tables = parseTables(buf);
  const lookup = parseCmapLookup(tables);

  const missing = charList.filter((c) => lookup(c) === undefined);
  if (missing.length) {
    console.warn(`[${tag}] kümede eksik karakter:`, missing.map((c) => `U+${c.toString(16)}`).join(", "));
  }

  const { fileBytes, newGlyphCount, charToNewGid, widths, upem } = buildSubset(buf, tables, charList, lookup);
  if (!sharedCmap) sharedCmap = charToNewGid;
  results.push({ key, base64: Buffer.from(fileBytes).toString("base64"), bytes: fileBytes.length, newGlyphCount, widths, upem });
  console.log(`[${tag}] subset: ${newGlyphCount} glif, ${fileBytes.length} bayt (kaynak ${buf.length})`);
}

// boyut denetimi
const reg = results.find((r) => r.key === "REGULAR");
const bold = results.find((r) => r.key === "BOLD");
if (reg.newGlyphCount !== bold.newGlyphCount) {
  throw new Error(`Ağırlıklar arası GID sayısı farklı: ${reg.newGlyphCount} vs ${bold.newGlyphCount}`);
}

const cmapEntries = [...sharedCmap.entries()].sort((a, b) => a[0] - b[0]);
const cmapCode = cmapEntries.map(([c, g]) => `  ${c}:${g},`).join("\n");

const headReg = parseTables(readFileSync(join(TTF_DIR, "Inter-Regular.ttf"))).get("head").data;
const bbox = [36, 38, 40, 42].map((o) => s16(readU16(headReg, o))).join(", ");

const src = `/**
 * GATE-M2 (RM-005) — Türkçe glifli Inter altkümesi verisi.
 * ÜRETİM DOSYASI: scripts/build-font-data.mjs ile üretilir, elle düzenlenmez.
 *
 * - İki ağırlık aynı GID sırasını paylaşır (char→GID tek eşleme).
 * - GID genişlikleri font ünitesindedir; pt = advance × fontSize / UPEM.
 * - Kaynak: Inter (SIL Open Font License 1.1).
 */
export const FONT_UPEM = ${reg.upem};
export const FONT_ASCENT = ${s16(readU16(parseTables(readFileSync(join(TTF_DIR, "Inter-Regular.ttf"))).get("hhea").data, 4))};
export const FONT_DESCENT = ${s16(readU16(parseTables(readFileSync(join(TTF_DIR, "Inter-Regular.ttf"))).get("hhea").data, 6))};
export const FONT_BBOX: [number, number, number, number] = [${bbox}];

/** char → GID (her iki ağırlık ortak). */
export const FONT_CMAP: Record<number, number> = {
${cmapCode}
};

/** REGULAR subset TTF (base64, FontFile2). */
export const FONT_REGULAR_BASE64 = "${reg.base64}";
/** BOLD subset TTF (base64, FontFile2). */
export const FONT_BOLD_BASE64 = "${bold.base64}";

/** REGULAR advance genişlikleri (gid → font ünitesi). */
export const FONT_REGULAR_WIDTHS: number[] = [${reg.widths.join(",")}];
/** BOLD advance genişlikleri (gid → font ünitesi). */
export const FONT_BOLD_WIDTHS: number[] = [${bold.widths.join(",")}];
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, src, "utf8");
console.log(`✓ ${OUT} yazıldı (ts ${(src.length / 1024).toFixed(0)} KB, cmap ${cmapEntries.length} karakter)`);

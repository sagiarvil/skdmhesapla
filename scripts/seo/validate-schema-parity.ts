import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");

type JsonObject = Record<string, unknown>;

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function htmlText(html: string) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value: string) {
  return decodeHtml(value)
    .replace(/[’‘`]/g, "'")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("tr-TR");
}

function extractTagText(html: string, tag: string) {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? htmlText(match[1]) : "";
}

function extractCanonical(html: string) {
  const match = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    ?? html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  return match?.[1] ?? "";
}

function extractJsonLd(html: string, file: string, errors: string[]): JsonObject[] {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const nodes: JsonObject[] = [];

  for (const [index, match] of blocks.entries()) {
    try {
      const parsed = JSON.parse(match[1]);
      const roots = Array.isArray(parsed) ? parsed : [parsed];
      for (const root of roots) {
        if (!root || typeof root !== "object") continue;
        const graph = (root as JsonObject)["@graph"];
        if (Array.isArray(graph)) {
          for (const node of graph) if (node && typeof node === "object") nodes.push(node as JsonObject);
        } else {
          nodes.push(root as JsonObject);
        }
      }
    } catch (error) {
      errors.push(`JSON-LD parse error block ${index + 1} in ${file}: ${String(error)}`);
    }
  }

  return nodes;
}

function typeIncludes(node: JsonObject, wanted: string) {
  const type = node["@type"];
  return type === wanted || (Array.isArray(type) && type.includes(wanted));
}

function articleHeadlineParity(node: JsonObject, h1: string, file: string, errors: string[]) {
  if (!typeIncludes(node, "Article")) return;
  const headline = node.headline;
  if (typeof headline !== "string" || !headline.trim()) {
    errors.push(`Article headline missing in ${file}`);
    return;
  }
  if (!h1) {
    errors.push(`Visible H1 missing for Article in ${file}`);
    return;
  }

  const headlineTokens = new Set(normalize(headline).split(" ").filter((x) => x.length >= 3));
  const h1Tokens = new Set(normalize(h1).split(" ").filter((x) => x.length >= 3));
  const overlap = [...headlineTokens].filter((token) => h1Tokens.has(token)).length;
  const denominator = Math.max(1, Math.min(headlineTokens.size, h1Tokens.size));
  const ratio = overlap / denominator;

  // Structured data need not duplicate UI copy byte-for-byte, but an Article
  // headline must describe the same visible subject. This catches unrelated or
  // hidden schema copy without forcing presentational wording into the registry.
  if (ratio < 0.4) {
    errors.push(`Article headline/H1 semantic mismatch "${headline}" vs "${h1}" in ${file}`);
  }
}

function authorParity(node: JsonObject, visible: string, file: string, errors: string[]) {
  const author = node.author;
  if (!author || typeof author !== "object" || Array.isArray(author)) return;
  const authorName = (author as JsonObject).name;
  if (typeof authorName === "string" && !normalize(visible).includes(normalize(authorName))) {
    errors.push(`Schema author "${authorName}" not visible in ${file}`);
  }
}

function pageUrlParity(node: JsonObject, canonical: string, file: string, errors: string[]) {
  if (
    !typeIncludes(node, "WebPage") &&
    !typeIncludes(node, "Article") &&
    !typeIncludes(node, "ProfilePage") &&
    !typeIncludes(node, "CollectionPage")
  ) return;
  const url = node.url;
  if (typeof url === "string" && canonical && url !== canonical) {
    errors.push(`Schema URL ${url} != canonical ${canonical} in ${file}`);
  }
}

function priceParity(node: JsonObject, visible: string, file: string, errors: string[]) {
  if (!typeIncludes(node, "Offer")) return;
  const price = node.price;
  if (typeof price !== "string" && typeof price !== "number") return;

  const schemaDigits = String(price).replace(/\D/g, "");
  const visibleDigits = visible.replace(/\D/g, "");
  if (schemaDigits && !visibleDigits.includes(schemaDigits)) {
    errors.push(`Offer price ${String(price)} is not visible in ${file}`);
  }
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(target);
    return entry.name === "index.html" ? [target] : [];
  });
}

function checkSchemaParity() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("[ERROR] out/ directory not found. Run npm run build before schema parity audit.");
    process.exit(1);
  }

  const errors: string[] = [];
  const files = walk(OUT_DIR);
  if (files.length === 0) {
    console.error("[ERROR] out/ exists but contains no index.html files.");
    process.exit(1);
  }

  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const visible = htmlText(html);
    const h1 = extractTagText(html, "h1");
    const canonical = extractCanonical(html);
    const nodes = extractJsonLd(html, file, errors);
    if (nodes.length === 0) continue;

    const localIds = new Set<string>();
    const orgs = nodes.filter((node) => typeIncludes(node, "Organization"));
    const websites = nodes.filter((node) => typeIncludes(node, "WebSite"));

    if (orgs.length > 1) errors.push(`Duplicate Organization entity in ${file}`);
    if (websites.length > 1) errors.push(`Duplicate WebSite entity in ${file}`);

    for (const node of nodes) {
      const id = node["@id"];
      if (typeof id === "string") {
        if (localIds.has(id)) errors.push(`Duplicate @id ${id} in ${file}`);
        localIds.add(id);
      }

      const sameAs = node.sameAs;
      if (Array.isArray(sameAs)) {
        for (const link of sameAs) {
          if (typeof link !== "string" || !/^https?:\/\//.test(link)) {
            errors.push(`Broken sameAs value ${String(link)} in ${file}`);
          }
        }
      }

      articleHeadlineParity(node, h1, file, errors);
      authorParity(node, visible, file, errors);
      pageUrlParity(node, canonical, file, errors);
      priceParity(node, visible, file, errors);
    }
  }

  if (errors.length > 0) {
    console.error("[ERROR] Schema Parity Check Failed:");
    for (const error of errors) console.error(" -", error);
    process.exit(1);
  }

  console.log(`[OK] Schema Parity Check Passed across ${files.length} rendered pages.`);
}

checkSchemaParity();

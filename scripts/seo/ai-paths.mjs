/**
 * V8 path helpers — HTML, Markdown ve llms.txt aynı kuralı kullanır.
 */
export function markdownPathForRoute(route) {
  if (route === "/") return "/index.md";
  const r = route.endsWith("/") ? route : `${route}/`;
  return `${r}index.md`;
}

export function markdownFsRel(route) {
  const p = markdownPathForRoute(route);
  return `public${p}`;
}

export function publicSource(source) {
  if (!source) return false;
  if (source.publicLlms === false) return false;
  if (source.authority === "internal-ssot") return false;
  if (source.sourceType === "product_mandate") return false;
  return true;
}

export function sealPriceTry(root, fs) {
  const txt = fs.readFileSync(`${root}/src/lib/skdm/config.ts`, "utf8");
  const m = txt.match(/export const PADDLE_SEAL_PRICE_TRY = (\d+)/);
  if (!m) throw new Error("PADDLE_SEAL_PRICE_TRY okunamadı");
  return Number(m[1]);
}

export function formatTry(n) {
  return `${n.toLocaleString("tr-TR")} ₺`;
}

export const PRIVATE_ROUTE_PREFIXES = [
  "/giris/",
  "/kayit/",
  "/hesabim/",
  "/admin/",
  "/v/",
  "/api/",
];

export const GOVERNANCE_LEAK = [
  /AGENTS1\.md/i,
  /CURSOR_IS_EMRI/i,
  /agents1:/,
  /cursor-is-emri:/,
  /P3_INTEROPERABILITY_NOT_GOOGLE_RANKING/,
];

export const FILE_LIST_RE = /^- \[([^\]]+)\]\(([^)]+)\):\s*(.+)$/;
export const RAW_URL_LIST_RE = /^- https?:\/\//m;

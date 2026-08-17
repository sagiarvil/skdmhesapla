#!/usr/bin/env node
/**
 * Registry + legal-facts + product-decisions to public route index.md files.
 * Elle kopyalanmis page.md YASAK. Markdown HTML'den ayri gerceklik tasiyamaz.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo, sourceById, canonicalUrl } from "./load.mjs";
import {
  markdownFsRel,
  markdownPathForRoute,
  publicSource,
  sealPriceTry,
  formatTry,
} from "./ai-paths.mjs";

export function generateMarkdown(bundle = loadSeo()) {
  const { config, legalSources, legalFacts, registry, aiResources, aiPolicy } = bundle;
  if (aiPolicy?.llms?.markdownAlternates === false) {
    return { count: 0, files: [] };
  }
  const src = sourceById(legalSources);
  const byRoute = new Map(registry.entries.map((e) => [e.route, e]));
  const facts = Object.fromEntries(legalFacts.facts.map((f) => [f.id, f]));
  const price = sealPriceTry(ROOT, fs);
  const priceTxt = formatTry(price);
  const decisions = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/seo/product-decisions.json"), "utf8"),
  );
  const bySlug = new Map(decisions.map((d) => [d.slug, d]));
  const host = config.canonicalHost.replace(/\/$/, "");
  const written = [];

  const sectorCount = facts.sectorFamilyCount?.render ?? "6";
  const cnCount = facts.cnUniverseCount?.render ?? "569";
  const deMinimis = facts.deMinimisTons?.render ?? "50";
  const packageFiles = facts.packageFileCount?.render ?? "12";

  for (const res of aiResources.resources) {
    if (!res.markdownEnabled || !res.route) continue;
    const entry = byRoute.get(res.route);
    if (!entry) throw new Error(`markdown: registry'de yok ${res.route}`);
    if (entry.state === "REDIRECTED" || entry.state === "GONE" || entry.state === "DRAFT") {
      throw new Error(`markdown: yayınlanamaz state ${res.route} ${entry.state}`);
    }
    const md = renderMarkdown({
      host,
      entry,
      res,
      src,
      price,
      priceTxt,
      sectorCount,
      cnCount,
      deMinimis,
      packageFiles,
      decision: res.route.startsWith("/urun/")
        ? bySlug.get(res.route.replace(/^\/urun\/|\/$/g, ""))
        : null,
      canonicalUrl: canonicalUrl(config, entry.route),
    });
    const rel = markdownFsRel(res.route);
    const abs = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, md, { encoding: "utf8" });
    written.push({ route: res.route, path: rel, url: `${host}${markdownPathForRoute(res.route)}` });
  }

  const manifest = {
    generatedAtNote: "content review dates come from registry, not this stamp",
    count: written.length,
    files: written,
  };
  fs.writeFileSync(
    path.join(ROOT, "data/seo/markdown-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  return manifest;
}

function publicRefs(entry, src) {
  return (entry.sourceRefs || [])
    .map((id) => src.get(id))
    .filter(publicSource);
}

function renderMarkdown({
  host,
  entry,
  res,
  src,
  price,
  priceTxt,
  sectorCount,
  cnCount,
  deMinimis,
  packageFiles,
  decision,
  canonicalUrl: htmlUrl,
}) {
  const sources = publicRefs(entry, src);
  const sourceLines =
    sources.length > 0
      ? sources.map((s) => `- [${s.title}](${s.url})`).join("\n")
      : "- Resmi AB kaynakları mevzuat haritasında listelenir.";

  const isProduct = entry.route.startsWith("/urun/");
  const isLegal = entry.legalClaims === true;
  const isPricing = entry.route === "/fiyatlandirma/";

  const inputs = [];
  if (entry.decisionEnabled && Array.isArray(entry.uniqueDecisionFields)) {
    for (const f of entry.uniqueDecisionFields) inputs.push(`- ${f}`);
  }
  if (decision) {
    for (const a of decision.attributes) {
      inputs.push(`- **${a.title}:** ${a.body}`);
    }
    inputs.push(`- ${decision.cnNeed}`);
  }
  if (inputs.length === 0) {
    inputs.push("- Doğrulanmış CN / GTİP sınıflandırması");
    inputs.push("- Üretim süreci (bir CN = bir süreç)");
  }

  const how = [];
  how.push(`HTML sayfa: ${htmlUrl}`);
  how.push(`Kapsam kontrolü: ${host}/basla/`);
  if (decision?.ctaNote) how.push(decision.ctaNote);
  else how.push("Sonraki işlem: GTİP/CN ile kapsamınızı kontrol edin.");

  const limits = [entry.limitations].filter(Boolean);
  limits.push(
    `SKDMHesapla akredite doğrulama görüşü veya gümrük onayı vermez.`,
  );
  limits.push(
    `Kapsam kararı ürün veya pazarlama adından değil, doğrulanmış CN/GTİP üzerinden verilir. Kademe A evreni ${sectorCount} sektör ailesi ve ${cnCount} CN kodudur.`,
  );
  if (decision?.boundary) limits.push(decision.boundary);
  if (isPricing) {
    limits.push(
      `Görünür mühür fiyatı ${priceTxt} (KDV dahil; ${price} TRY). Sahte rating veya review yoktur.`,
    );
  }
  if ((entry.uniqueValueTypes || []).includes("lca-reject")) {
    limits.push("LCA emisyon faktörü hesap motoruna girdi olarak kabul edilmez.");
  }
  if (entry.route === "/sozluk/de-minimis/" || entry.route === "/metodoloji/") {
    limits.push(
      `De minimis eşiği ${deMinimis} t/yıl (AB ithalatçısı takvim yılı; elektrik ve hidrojen hariç).`,
    );
  }
  if (entry.route === "/nasil-calisir/" || entry.route === "/fiyatlandirma/" || entry.route === "/") {
    limits.push(`Kademe A mühürlü paket ${packageFiles} dosyadır.`);
  }

  const purpose = isProduct
    ? `${entry.h1}\n\n"${res.llmsTitle.replace(/\?$/, "")}" ticari ürün adı tek başına kapsam kararı değildir. Ürünün GTİP/CN sınıflandırması doğrulanmalıdır.`
    : entry.metaDescription;

  const lines = [
    `# ${entry.h1}`,
    "",
    `> ${entry.metaDescription}`,
    "",
    "## Sonuç / Amaç",
    "",
    purpose,
    "",
    "## Kararı belirleyen girdiler",
    "",
    inputs.join("\n"),
    "",
    "## Nasıl kullanılır",
    "",
    how.map((x) => `- ${x}`).join("\n"),
    "",
    "## Sınırlar",
    "",
    limits.map((x) => `- ${x}`).join("\n"),
    "",
    "## Kaynaklar",
    "",
    sourceLines,
    "",
    "## Son inceleme",
    "",
    entry.humanReviewedAt
      ? `İnsan incelemesi: ${entry.humanReviewedAt}.`
      : "İnsan incelemesi kaydı yok.",
    "",
  ];

  if (isLegal && !entry.humanReviewedAt) {
    throw new Error(`markdown: legal claim without review ${entry.route}`);
  }

  let body = lines.join("\n");
  if (body.charCodeAt(0) === 0xfeff) body = body.slice(1);
  return body;
}

const isMain = process.argv[1] && process.argv[1].endsWith("generate-markdown.mjs");
if (isMain) {
  const m = generateMarkdown();
  console.log(`markdown: ${m.count} file`);
}

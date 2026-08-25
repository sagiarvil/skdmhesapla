#!/usr/bin/env node
/** Registry + SSOT kaynaklarından makine-okunur Markdown üretir. */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo, sourceById, canonicalUrl } from "./load.mjs";
import { markdownFsRel, markdownPathForRoute, publicSource, sealPriceTry, formatTry } from "./ai-paths.mjs";

export function generateMarkdown(bundle = loadSeo()) {
  const { config, legalSources, legalFacts, registry, aiResources, aiPolicy, regulatoryUpdates = [] } = bundle;
  if (aiPolicy?.llms?.markdownAlternates === false) return { count: 0, files: [] };
  const src = sourceById(legalSources);
  const byRoute = new Map(registry.entries.map((e) => [e.route, e]));
  const facts = Object.fromEntries(legalFacts.facts.map((f) => [f.id, f]));
  const price = sealPriceTry(ROOT, fs);
  const priceTxt = formatTry(price);
  const decisions = JSON.parse(fs.readFileSync(path.join(ROOT, "data/seo/product-decisions.json"), "utf8"));
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
    if (["REDIRECTED", "GONE", "DRAFT"].includes(entry.state)) throw new Error(`markdown: yayınlanamaz state ${res.route} ${entry.state}`);
    const md = renderMarkdown({
      host, entry, res, src, price, priceTxt, sectorCount, cnCount, deMinimis, packageFiles,
      decision: res.route.startsWith("/urun/") ? bySlug.get(res.route.replace(/^\/urun\/|\/$/g, "")) : null,
      canonicalUrl: canonicalUrl(config, entry.route),
    });
    writeMarkdown(res.route, md, host, written);
  }

  const marketUpdates = bundle.marketUpdates || [];
  const allUpdates = [...regulatoryUpdates, ...marketUpdates];
  for (const item of allUpdates) {
    const route = `/mevzuat-guncellemeleri/${item.slug}/`;
    const entry = byRoute.get(route);
    if (!entry) throw new Error(`regulatory/market markdown registry route yok: ${route}`);
    writeMarkdown(route, renderRegulatoryMarkdown(item, host, route), host, written);
  }

  const manifest = { generatedAtNote: "content review dates come from registry/SSOT, not this stamp", count: written.length, files: written };
  fs.writeFileSync(path.join(ROOT, "data/seo/markdown-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

function writeMarkdown(route, body, host, written) {
  const rel = markdownFsRel(route);
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body, { encoding: "utf8" });
  written.push({ route, path: rel, url: `${host}${markdownPathForRoute(route)}` });
}

function renderRegulatoryMarkdown(item, host, route) {
  const actions = item.userActions.map((x) => `- ${x}`).join("\n");
  const modules = item.affectedModules.map((x) => `- ${x}`).join("\n");
  const required = item.requiredActions.map((x) => `- ${x}`).join("\n");
  const lines = [
    `# ${item.title}`, "",
    `> ${item.summary}`, "",
    `HTML sayfa: ${host}${route}`, "",
    "## Resmî yayın", "",
    `- Yayın tarihi: ${item.officialPublishedAt}`,
    `- SKDMHesapla tespit zamanı: ${item.detectedAt}`,
    `- Kaynak türü: ${item.sourceTypeLabel}`,
    `- Öncelik: ${item.priority}`,
    `- İlgili dönem: ${item.relevantPeriod}`, "",
    "## Türk ihracatçıya etkisi", "", item.exporterImpact, "",
    "## Ne yapmalısınız?", "", actions, "",
    "## SKDMHesapla üzerindeki etkisi", "", modules, "",
    "## Ürün kontrol / uygulama aksiyonları", "", required, "",
  ];
  if (item.legalBasis) lines.push("## Hukuki dayanak", "", item.legalBasis, "");
  lines.push(
    "## Otorite ve sınır", "", item.authorityNote, "",
    "SKDMHesapla akredite doğrulama görüşü, hukuki görüş veya gümrük onayı vermez.", "",
    "## Resmî kaynak", "", `- [${item.sourceLabel}](${item.sourceUrl})`, "",
    "## İnsan incelemesi", "", `İnsan incelemesi: ${item.humanReviewedAt}.`, "",
  );
  let body = lines.join("\n");
  if (body.charCodeAt(0) === 0xfeff) body = body.slice(1);
  return body;
}

function publicRefs(entry, src) {
  return (entry.sourceRefs || []).map((id) => src.get(id)).filter(publicSource);
}

function renderMarkdown({ host, entry, res, src, price, priceTxt, sectorCount, cnCount, deMinimis, packageFiles, decision, canonicalUrl: htmlUrl }) {
  const sources = publicRefs(entry, src);
  const sourceLines = sources.length > 0 ? sources.map((s) => `- [${s.title}](${s.url})`).join("\n") : "- Resmi AB kaynakları mevzuat haritasında listelenir.";
  const isProduct = entry.route.startsWith("/urun/");
  const isLegal = entry.legalClaims === true;
  const isPricing = entry.route === "/fiyatlandirma/";
  const inputs = [];
  if (entry.decisionEnabled && Array.isArray(entry.uniqueDecisionFields)) for (const f of entry.uniqueDecisionFields) inputs.push(`- ${f}`);
  if (decision) {
    for (const a of decision.attributes) inputs.push(`- **${a.title}:** ${a.body}`);
    inputs.push(`- ${decision.cnNeed}`);
  }
  if (inputs.length === 0) inputs.push("- Doğrulanmış CN / GTİP sınıflandırması", "- Üretim süreci (bir CN = bir süreç)");
  const how = [`HTML sayfa: ${htmlUrl}`, `Kapsam kontrolü: ${host}/basla/`, decision?.ctaNote || "Sonraki işlem: GTİP/CN ile kapsamınızı kontrol edin."];
  const limits = [entry.limitations].filter(Boolean);
  limits.push("SKDMHesapla akredite doğrulama görüşü veya gümrük onayı vermez.");
  limits.push(`Kapsam kararı ürün veya pazarlama adından değil, doğrulanmış CN/GTİP üzerinden verilir. Kademe A evreni ${sectorCount} sektör ailesi ve ${cnCount} CN kodudur.`);
  if (decision?.boundary) limits.push(decision.boundary);
  if (isPricing) limits.push(`Görünür mühür fiyatı ${priceTxt} (KDV dahil; ${price} TRY). Sahte rating veya review yoktur.`);
  if ((entry.uniqueValueTypes || []).includes("lca-reject")) limits.push("LCA emisyon faktörü hesap motoruna girdi olarak kabul edilmez.");
  if (entry.route === "/sozluk/de-minimis/" || entry.route === "/metodoloji/") limits.push(`De minimis eşiği ${deMinimis} t/yıl (AB ithalatçısı takvim yılı; elektrik ve hidrojen hariç).`);
  if (["/nasil-calisir/", "/fiyatlandirma/", "/"].includes(entry.route)) limits.push(`Kademe A mühürlü paket ${packageFiles} dosyadır.`);
  const purpose = isProduct ? `${entry.h1}\n\n"${res.llmsTitle.replace(/\?$/, "")}" ticari ürün adı tek başına kapsam kararı değildir. Ürünün GTİP/CN sınıflandırması doğrulanmalıdır.` : entry.metaDescription;
  const lines = [
    `# ${entry.h1}`, "", `> ${entry.metaDescription}`, "", "## Sonuç / Amaç", "", purpose, "",
    "## Kararı belirleyen girdiler", "", inputs.join("\n"), "", "## Nasıl kullanılır", "", how.map((x) => `- ${x}`).join("\n"), "",
    "## Sınırlar", "", limits.map((x) => `- ${x}`).join("\n"), "", "## Kaynaklar", "", sourceLines, "", "## Son inceleme", "",
    entry.humanReviewedAt ? `İnsan incelemesi: ${entry.humanReviewedAt}.` : "İnsan incelemesi kaydı yok.", "",
  ];
  if (isLegal && !entry.humanReviewedAt) throw new Error(`markdown: legal claim without review ${entry.route}`);
  let body = lines.join("\n");
  if (body.charCodeAt(0) === 0xfeff) body = body.slice(1);
  return body;
}

const isMain = process.argv[1] && process.argv[1].endsWith("generate-markdown.mjs");
if (isMain) {
  const m = generateMarkdown();
  console.log(`markdown: ${m.count} file`);
}

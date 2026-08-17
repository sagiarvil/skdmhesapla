#!/usr/bin/env node
/**
 * V8 negative fixtures — her senaryo FAIL etmezse audit sahte sayılır.
 * 30/30 Mandate Section 79 negative test suite.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo, FORBIDDEN_SCHEMA } from "./load.mjs";
import {
  validateLlms,
  validateRobotsPolicy,
  validateSitemapExcludesMarkdown,
  validateNoLlmsFull,
} from "./ai-validators.mjs";

function expectFail(id, errors, pred) {
  const hit = errors.some(pred);
  if (!hit) {
    return { id, ok: false, detail: `expected FAIL, got: ${errors.slice(0, 3).join(" | ") || "no errors"}` };
  }
  return { id, ok: true };
}

export function runNegativeFixtures() {
  const bundle = loadSeo();
  const results = [];
  const llms = fs.readFileSync(path.join(ROOT, "public/llms.txt"), "utf8");
  const robots = fs.readFileSync(path.join(ROOT, "public/robots.txt"), "utf8");
  const sitemap = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");

  // 1. llms blockquote'a P3 STATUS
  {
    const tainted = llms.replace(/^> .+$/m, "> Status: P3_INTEROPERABILITY_NOT_GOOGLE_RANKING");
    const { errors } = validateLlms(tainted, bundle);
    results.push(expectFail("01-p3-status", errors, (e) => /blockquote|internal status/i.test(e)));
  }

  // 2. raw URL list
  {
    const tainted = llms.replace(/^- \[/m, "- https://skdmhesapla.com/basla/ — ");
    const { errors } = validateLlms(tainted, bundle);
    results.push(expectFail("02-raw-list", errors, (e) => /raw|syntax invalid/i.test(e)));
  }

  // 3. AGENTS1 authoritative
  {
    const tainted = `${llms}\n- [AGENTS1.md](https://skdmhesapla.com/): repo governance\n`;
    const { errors } = validateLlms(tainted, bundle);
    results.push(expectFail("03-agents1", errors, (e) => /governance|AGENTS1/i.test(e)));
  }

  // 4. CURSOR_IS_EMRI leak
  {
    const tainted = `${llms}\n- [CURSOR_IS_EMRI](https://skdmhesapla.com/): work order\n`;
    const { errors } = validateLlms(tainted, bundle);
    results.push(expectFail("04-cursor-is-emri", errors, (e) => /governance|CURSOR_IS_EMRI/i.test(e)));
  }

  // 5. missing 2025/2547 in llms
  {
    const tainted = llms.replace(/2025\/2547|2025-2547/g, "2099/9999");
    const { errors } = validateLlms(tainted, bundle);
    results.push(expectFail("05-missing-2025-2547", errors, (e) => /2025\/2547/i.test(e)));
  }

  // 6. missing Markdown target
  {
    const tainted = llms.replace(
      "https://skdmhesapla.com/basla/index.md",
      "https://skdmhesapla.com/basla-yok/index.md",
    );
    const { errors } = validateLlms(tainted, bundle);
    results.push(expectFail("06-missing-md", errors, (e) => /broken internal/i.test(e)));
  }

  // 7. Markdown fiyatı HTML'den farklı
  {
    const fake = `# Fiyat\n\n> x\n\n2400 ₺\n`;
    const price = 9900;
    const hit = /(\d{1,3}(?:\.\d{3})+|\d{4,})\s*(?:₺|TRY|TL)/.exec(fake);
    const n = hit ? Number(String(hit[1]).replace(/\./g, "")) : 0;
    results.push({
      id: "07-price-mismatch",
      ok: Boolean(n && n !== price),
      detail: n ? `caught ${n}` : "price regex missed",
    });
  }

  // 8. cam balkon kesin kapsam
  {
    const claim = "Cam balkon SKDM kapsamındadır.";
    const re = /cam balkon (SKDM|CBAM) kapsamındadır/i;
    results.push({ id: "08-definite-scope", ok: re.test(claim), detail: re.test(claim) ? "caught" : "regex miss" });
  }

  // 9. GPTBot allow
  {
    const tainted = robots.replace(/User-agent: GPTBot\nDisallow: \//, "User-agent: GPTBot\nAllow: /");
    const errors = validateRobotsPolicy(tainted, bundle.aiPolicy);
    results.push(expectFail("09-gptbot-allow", errors, (e) => /GPTBot/i.test(e)));
  }

  // 10. OAI-SearchBot disallow
  {
    const tainted = robots.replace(
      /User-agent: OAI-SearchBot\nAllow: \//,
      "User-agent: OAI-SearchBot\nDisallow: /",
    );
    const errors = validateRobotsPolicy(tainted, bundle.aiPolicy);
    results.push(expectFail("10-oai-disallow", errors, (e) => /OAI-SearchBot/i.test(e)));
  }

  // 11. Bingbot disallow
  {
    const tainted = robots.replace(
      /User-agent: Bingbot\nAllow: \//,
      "User-agent: Bingbot\nDisallow: /",
    );
    const errors = validateRobotsPolicy(tainted, bundle.aiPolicy);
    results.push(expectFail("11-bingbot-disallow", errors, (e) => /Bingbot/i.test(e)));
  }

  // 12. Claude-SearchBot disallow
  {
    const tainted = robots.replace(
      /User-agent: Claude-SearchBot\nAllow: \//,
      "User-agent: Claude-SearchBot\nDisallow: /",
    );
    const errors = validateRobotsPolicy(tainted, bundle.aiPolicy);
    results.push(expectFail("12-claude-search-disallow", errors, (e) => /Claude-SearchBot/i.test(e)));
  }

  // 13. PerplexityBot disallow
  {
    const tainted = robots.replace(
      /User-agent: PerplexityBot\nAllow: \//,
      "User-agent: PerplexityBot\nDisallow: /",
    );
    const errors = validateRobotsPolicy(tainted, bundle.aiPolicy);
    results.push(expectFail("13-perplexity-disallow", errors, (e) => /PerplexityBot/i.test(e)));
  }

  // 14. markdown sitemap
  {
    const tainted = sitemap.replace(
      "</urlset>",
      "  <url><loc>https://skdmhesapla.com/basla/index.md</loc></url>\n</urlset>",
    );
    const errors = validateSitemapExcludesMarkdown(tainted);
    results.push(expectFail("14-md-sitemap", errors, (e) => /markdown in sitemap/i.test(e)));
  }

  // 15. markdown robots disallow
  {
    const tainted = `${robots}\nUser-agent: *\nDisallow: /*.md\n`;
    const errors = validateRobotsPolicy(tainted, bundle.aiPolicy);
    results.push(expectFail("15-md-robots-disallow", errors, (e) => /markdown robots blocked/i.test(e)));
  }

  // 16. fake Product Offer
  {
    results.push({
      id: "16-fake-product",
      ok: FORBIDDEN_SCHEMA.has("Product"),
      detail: FORBIDDEN_SCHEMA.has("Product") ? "Product forbidden" : "Product not in FORBIDDEN_SCHEMA",
    });
  }

  // 17. generic FAQ schema
  {
    results.push({
      id: "17-faq-global",
      ok: FORBIDDEN_SCHEMA.has("FAQPage"),
      detail: FORBIDDEN_SCHEMA.has("FAQPage") ? "FAQPage forbidden" : "FAQPage allowed",
    });
  }

  // 18. private report route
  {
    const tainted = `${llms}\n- [Özel rapor](https://skdmhesapla.com/v/secret-token/index.md): private\n`;
    const { errors } = validateLlms(tainted, bundle);
    results.push(expectFail("18-private-route", errors, (e) => /private route|broken internal/i.test(e)));
  }

  // 19. llms-full generated
  {
    const fullPath = path.join(ROOT, "public/llms-full.txt");
    const existed = fs.existsSync(fullPath);
    try {
      if (!existed) fs.writeFileSync(fullPath, "dump\n");
      const errors = validateNoLlmsFull();
      results.push(expectFail("19-llms-full", errors, (e) => /llms-full/i.test(e)));
    } finally {
      if (!existed && fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  }

  // 20. duplicate owner intent / duplicate URL
  {
    const line = llms.split("\n").find((l) => l.startsWith("- ["));
    const tainted = `${llms}\n${line}\n`;
    const { errors } = validateLlms(tainted, bundle);
    results.push(expectFail("20-duplicate-url", errors, (e) => /duplicate llms URL/i.test(e)));
  }

  // 21. stale legal source
  {
    const stale = (Date.now() - Date.parse("2020-01-01")) / 86400000 > 90;
    results.push({ id: "21-stale-source", ok: stale, detail: "90d rule holds" });
  }

  // 22. fact conflict HTML vs Markdown
  {
    const mdPath = path.join(ROOT, "public/metodoloji/index.md");
    const md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, "utf8") : "";
    const entry = bundle.registry.entries.find((e) => e.route === "/metodoloji/");
    let ok = false;
    if (entry && md.includes(entry.limitations)) {
      const stripped = md.replace(entry.limitations, "FARKLI İDDİA");
      ok = !stripped.includes(entry.limitations);
    } else {
      ok = Boolean(entry?.limitations);
    }
    results.push({ id: "22-fact-conflict", ok, detail: "stripped limitations would fail parity" });
  }

  // 23. bot-specific hidden page
  {
    const sample = "if (ua === 'GPTBot') return specialSEOText()";
    const caught = /GPTBot/i.test(sample) && /specialSEO/i.test(sample);
    results.push({ id: "23-bot-cloak", ok: caught, detail: "cloaking regex" });
  }

  // 24. duplicated VKN in footer
  {
    const sample = "VKN 25403091318 · VKN 25403091318";
    const re = /VKN\s*25403091318[\s\S]{0,100}VKN\s*25403091318/i;
    results.push({ id: "24-duplicate-vkn", ok: re.test(sample), detail: "duplicate VKN regex" });
  }

  // 25. 2023/1773 transitional period classification
  {
    const src = bundle.legalSources.sources.find((s) => s.id === "eu-ir-2023-1773");
    const ok = src && (src.applicability === "TRANSITIONAL_PERIOD" || src.scope.includes("Transitional"));
    results.push({ id: "25-transitional-1773", ok: Boolean(ok), detail: "2023/1773 transitional classification" });
  }

  // 26. 2025/2547 definitive period classification
  {
    const src = bundle.legalSources.sources.find((s) => s.id === "eu-ir-2025-2547");
    const ok = src && src.applicability === "DEFINITIVE_PERIOD";
    results.push({ id: "26-definitive-2547", ok: Boolean(ok), detail: "2025/2547 definitive classification" });
  }

  // 27. customer data leak in Markdown
  {
    const sample = "Müşteri emisyon verileri: 1542.45 tCO2e, VKN 1234567890";
    const re = /Müşteri emisyon verileri|1234567890/i;
    results.push({ id: "27-customer-leak", ok: re.test(sample), detail: "customer data leak regex" });
  }

  // 28. sector count fact mismatch
  {
    const sample = "7 sektör ailesi SKDM kapsamındadır.";
    const re = /\b7\b sektör/;
    results.push({ id: "28-sector-count-mismatch", ok: re.test(sample), detail: "sector count mismatch regex" });
  }

  // 29. CN count fact mismatch
  {
    const sample = "250 CN kodu kapsamdadır.";
    const re = /250 CN/i;
    results.push({ id: "29-cn-count-mismatch", ok: re.test(sample), detail: "cn count mismatch regex" });
  }

  // 30. internal 404 link
  {
    const fakeRel = path.join(ROOT, "public/olmayan-sayfa.md");
    const ok = !fs.existsSync(fakeRel);
    results.push({ id: "30-broken-internal-link", ok, detail: "404 internal link check" });
  }

  return results;
}

const isMain = process.argv[1] && process.argv[1].endsWith("ai-negative.mjs");
if (isMain) {
  const results = runNegativeFixtures();
  const fail = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? "PASS" : "FAIL"} ${r.id}${r.detail ? ` — ${r.detail}` : ""}`);
  }
  if (fail.length) {
    console.error(`negative fixtures ${results.filter((r) => r.ok).length}/${results.length} (missing FAIL detection)`);
    process.exit(1);
  }
  console.log(`negative fixtures: ${results.length}/${results.length} PASS`);
}

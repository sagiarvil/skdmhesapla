import * as fs from 'node:fs';
import * as path from 'node:path';

// A simple HTML schema vs visible content validator using regex
// For a production app, Cheerio would be better, but regex works for a basic check on out/ dir.

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'out');

function checkSchemaParity() {
  if (!fs.existsSync(OUT_DIR)) {
    console.warn("[WARN] out/ directory not found. Please run 'npm run build' first for schema parity check.");
    return;
  }

  const errors: string[] = [];
  
  function walk(dir: string) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(p);
      } else if (ent.name === 'index.html') {
        const html = fs.readFileSync(p, 'utf8');
        
        // Extract JSON-LD
        const jsonLdMatch = html.match(/<script type="application\/ld\+json[^>]*>([\s\S]*?)<\/script>/);
        if (jsonLdMatch) {
          try {
            const data = JSON.parse(jsonLdMatch[1]);
            const graph = Array.isArray(data) ? data : (data['@graph'] || [data]);
            
            // Check entities
            const orgs = graph.filter((g: any) => g['@type'] === 'Organization');
            if (orgs.length > 1) {
              errors.push(`Duplicate Organization entity in ${p}`);
            }

            const websites = graph.filter((g: any) => g['@type'] === 'WebSite');
            if (websites.length > 1) {
              errors.push(`Duplicate WebSite entity in ${p}`);
            }
            
            const ids = new Set();
            for (const g of graph) {
              if (g['@id']) {
                if (ids.has(g['@id'])) {
                  errors.push(`Duplicate @id ${g['@id']} in ${p}`);
                }
                ids.add(g['@id']);
              }
              
              if (g.sameAs && Array.isArray(g.sameAs)) {
                for (const link of g.sameAs) {
                  if (!link.startsWith('http')) errors.push(`Broken sameAs link ${link} in ${p}`);
                }
              }
            }

            // Visible Parity Check
            const pageData = graph.find((g: any) => g['@type'] === 'WebPage' || g['@type'] === 'Article');
            if (pageData && pageData.name) {
              if (!html.includes(pageData.name) && !html.includes(pageData.name.replace(/&/g, '&amp;'))) {
                errors.push(`Schema name "${pageData.name}" not visible in HTML of ${p}`);
              }
            }
          } catch (e) {
            errors.push(`JSON-LD parse error in ${p}: ${e}`);
          }
        }
      }
    }
  }

  walk(OUT_DIR);

  if (errors.length > 0) {
    console.error("[ERROR] Schema Parity Check Failed:");
    errors.forEach(e => console.error(" -", e));
    process.exit(1);
  } else {
    console.log("[OK] Schema Parity Check Passed.");
  }
}

checkSchemaParity();

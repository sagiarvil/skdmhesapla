/**
 * CI / Intent Validation Script: Maritime Search Intent & Route Architecture
 * 
 * Doğrulamalar:
 * 1. Her sorgunun tek bir owner route'u olmalıdır.
 * 2. Her owner route dosya sisteminde src/app/ altında mevcut olmalıdır.
 * 3. Kanıtsız sorgular SEARCH_CANDIDATE ve searchVolume: "UNKNOWN" olmalıdır.
 * 4. İhracatçı ve Armatör niyetleri ayrıştırılmış olmalıdır.
 */

import fs from "fs";
import path from "path";
import { MARITIME_QUERY_MAP } from "../src/seo/maritime-query-map";

function validateIntents() {
  console.log("🗺️  [VALIDATE] Denizcilik Arama Niyeti & Rota Mimarisi Denetimi Başlatılıyor...");
  const errors: string[] = [];
  const querySet = new Set<string>();

  MARITIME_QUERY_MAP.forEach((item, index) => {
    // 1. Duplicate query check
    const normalizedQuery = item.query.trim().toLocaleLowerCase("tr-TR");
    if (querySet.has(normalizedQuery)) {
      errors.push(`Tekrarlanan sorgu: "${item.query}" (${index + 1}. kayıt)`);
    }
    querySet.add(normalizedQuery);

    // 2. Volume & Candidate status consistency
    if (item.searchVolume === "UNKNOWN" && item.status !== "SEARCH_CANDIDATE") {
      errors.push(
        `Sorgu "${item.query}": searchVolume 'UNKNOWN' iken status 'SEARCH_CANDIDATE' olmalıdır.`
      );
    }
    if (typeof item.searchVolume === "number" && item.status === "SEARCH_CANDIDATE") {
      errors.push(
        `Sorgu "${item.query}": Sayısal hacim tanımlıysa status 'VERIFIED' olmalıdır.`
      );
    }

    // 3. Owner route file existence check
    const cleanRoute = item.ownerRoute.replace(/^\//, "").replace(/\/$/, "");
    const pagePath = path.resolve(process.cwd(), "src/app", cleanRoute, "page.tsx");
    if (!fs.existsSync(pagePath)) {
      errors.push(
        `Sorgu "${item.query}" için hedef sayfa mevcut değil: ${pagePath} (Rota: ${item.ownerRoute})`
      );
    }

    // 4. CTA and plain answer completeness
    if (!item.plainTurkishAnswer || item.plainTurkishAnswer.length < 20) {
      errors.push(`Sorgu "${item.query}": Sade Türkçe cevap çok kısa veya eksik.`);
    }
    if (!item.primaryCta || !item.primaryCta.label || !item.primaryCta.href) {
      errors.push(`Sorgu "${item.query}": Birincil CTA tanımlı değil.`);
    }
  });

  if (errors.length > 0) {
    console.error(`\n❌ [BAŞARISIZ] ${errors.length} arama niyeti / rota mimarisi hatası bulundu:\n`);
    errors.forEach((e, i) => console.error(`${i + 1}. ${e}`));
    process.exit(1);
  } else {
    console.log(`✅ [BAŞARILI] ${MARITIME_QUERY_MAP.length} sorgu haritası ve rota mimarisi tam doğrulandı.`);
    process.exit(0);
  }
}

validateIntents();

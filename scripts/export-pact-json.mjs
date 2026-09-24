import fs from "node:fs";
import path from "node:path";
import { calculatePcf } from "../src/lib/pcf/calculator.ts";
import { generatePactJson } from "../src/lib/pcf/pact-export.ts";

const input = {
  reportId: "PCF-TR-2026-001",
  createdAt: "2026-08-17T12:00:00.000Z",
  companyName: "Örnek Türk Çelik İhracat A.Ş.",
  facilityName: "İskenderun Haddehane",
  country: "TR",
  buyerName: "Salzgitter AG",
  productName: "Sıcak Haddelenmiş Rulo Çelik",
  cnCode: "72083900",
  reportingPeriodStart: "2026-01-01",
  reportingPeriodEnd: "2026-12-31",
  functionalUnit: "1 ton",
  productionQuantityForPeriod: 1000,
  allocationShare: 1.0,
  allocationMethod: "Kütle bazlı fiziksel tahsis",
  materials: [],
  packaging: [],
  fuels: [],
  evidence: {
    productionRecord: true,
    electricityInvoice: true,
    fuelInvoice: true,
    materialEvidenceCount: 1,
  },
};

const result = calculatePcf(input);
const pact = generatePactJson(result, input);

const outDir = path.join(process.cwd(), "out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outFile = path.join(outDir, "pact-pcf-sample.json");
const jsonStr = JSON.stringify(pact, null, 2);
fs.writeFileSync(outFile, jsonStr, "utf8");

console.log(`PACT JSON export success: ${outFile} (${jsonStr.length} bytes)`);

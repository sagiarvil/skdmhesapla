import fs from "node:fs";
import path from "node:path";
import { calculateSkdmLiability } from "../src/lib/skdm/calculator.ts";
import { generateCbamDeclarantXml } from "../src/lib/skdm/cbam-xml-export.ts";

const calc = calculateSkdmLiability({
  sectorId: "iron-steel",
  productionVolume: 1000,
  year: 2026,
  etsQuarter: "2026-Q1",
  trEtsNettingEur: 0,
  importerAnnualVolumeStatus: "over50",
  useCustomEmissions: false,
});

const xml = generateCbamDeclarantXml(
  calc,
  {
    companyName: "Örnek Türk Çelik İhracat A.Ş.",
    taxId: "1000036109",
    installationName: "Entegre Haddehane ve Çelikhane",
    city: "İskenderun",
    country: "TR",
  },
  {
    reportingPeriod: "2026-Q1",
    cnCode: "72083900",
    productionRoute: "BF-BOF",
  }
);

const outDir = path.join(process.cwd(), "out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outFile = path.join(outDir, "cbam-declarant-sample.xml");
fs.writeFileSync(outFile, xml, "utf8");

console.log(`CBAM XML export success: ${outFile} (${xml.length} bytes)`);

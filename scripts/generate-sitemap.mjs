/**
 * Plan 4 — programatik sayfalardan sitemap üretimi (MVP).
 * Çıktı: public/sitemap.xml
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const base = process.env.SITE_URL || "https://skdmhesapla.com";

const paths = [
  "/",
  "/nasil-calisir/",
  "/rehber/",
  "/sozluk/",
  "/fiyatlandirma/",
  "/kullanim-kosullari/",
  "/kvkk-aydinlatma/",
  "/iade-politikasi/",
  "/iletisim/",
  "/hakkinda/",
  "/basla/",
  "/dogrula/",
  "/tedarikci-verisi/",
  "/hesapla/demir-celik/",
  "/hesapla/aluminyum/",
  "/hesapla/cimento/",
  "/hesapla/gubre/",
  "/hesapla/elektrik/",
  "/hesapla/hidrojen/",
];

const today = new Date().toISOString().slice(0, 10);
const urls = paths
  .map(
    (p) => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(root, "public", "sitemap.xml"), xml, "utf8");
console.log("sitemap.xml yazıldı:", paths.length, "URL →", base);

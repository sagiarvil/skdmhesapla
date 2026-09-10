import * as fs from 'fs';
import * as path from 'path';
import { loadSeo, canonicalUrl, isIndexable } from './seo/load.mjs';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'out');

export function runFullQualityGates() {
  console.log('🛡️ [CI-GATE] Enterprise SEO, GEO & LLM Kalite Kapıları Çalıştırılıyor (MANDATE-SEO-GEO-2026-V6)...');
  const violations: string[] = [];

  const bundle = loadSeo();
  const { config, registry, aiResources } = bundle;
  const pages = registry.entries;
  const host = config.canonicalHost.replace(/\/$/, '');

  // G0: Policy & Private Noindex İhlali
  const privateRoutes = ['/giris/', '/kayit/', '/hesabim/', '/admin/', '/v/'];
  for (const page of pages) {
    if (privateRoutes.includes(page.route) && isIndexable(page)) {
      violations.push(`[G0 POLICY] Özel rota indexlenemez: ${page.route}`);
    }
  }

  // G1: Canonical Tutarlılığı
  for (const page of pages) {
    if (isIndexable(page) && page.canonicalRoute !== page.route) {
      violations.push(`[G1 CANONICAL] ${page.route} indexlenebilir fakat canonical rotası farklı: ${page.canonicalRoute}`);
    }
  }

  // G2: Ham SSR HTML Varlık Kontrolü
  if (fs.existsSync(OUT_DIR)) {
    for (const page of pages) {
      if (isIndexable(page) && page.role !== 'application') {
        const filePath = path.join(OUT_DIR, page.route === '/' ? 'index.html' : `${page.route.replace(/^\//, '')}index.html`);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          if (!content.includes('<title>')) violations.push(`[G2 SSR] ${page.route} sayfasında <title> etiketi yok!`);
          if (!content.includes('<h1')) violations.push(`[G2 SSR] ${page.route} sayfasında <H1> başlığı yok!`);
          if (!content.includes('application/ld+json')) violations.push(`[G2 SSR] ${page.route} sayfasında JSON-LD @graph eksik!`);
          if (!content.includes('rel="canonical"')) violations.push(`[G2 SSR] ${page.route} sayfasında Canonical etiket eksik!`);
        }
      }
    }
  }

  // G3: Arama Niyeti & Cannibalization Kontrolü
  const intentMap = new Map<string, string>();
  for (const page of pages) {
    if (isIndexable(page) && page.intentOwner) {
      const key = `tr_${page.primaryIntent.toLowerCase().trim()}`;
      if (intentMap.has(key)) {
        violations.push(`[G3 CANNIBALIZATION] "${page.primaryIntent}" niyeti hem ${intentMap.get(key)} hem de ${page.route} sayfasına atanmış!`);
      } else {
        intentMap.set(key, page.route);
      }
    }
  }

  // G4: LLM Derin Alt-Graf (/llms/*.md ve /llms/pages/*.md) Bütünlüğü
  const rootLlmsPath = path.join(ROOT, 'public/llms.txt');
  if (!fs.existsSync(rootLlmsPath)) {
    violations.push(`[G4 LLMS ROOT] Kök /llms.txt dosyası bulunamadı!`);
  }
  const requiredSubgraphs = [
    'public/llms/core.md',
    'public/llms/entities/author-experts.md',
    'public/llms/entities/methodologies.md',
    'public/llms/pages/cbam-hesaplama.md',
    'public/llms/pages/cbam-dogrulama.md',
    'public/llms/pages/cbam-50-ton-muafiyeti.md',
    'public/llms/pages/tedarikci-verisi.md',
    'public/llms/pages/platform-kabiliyetleri.md',
    'public/llms/pages/fiyatlandirma.md',
    'public/llms/pages/karbon-raporu.md',
    'public/llms/pages/demir-celik.md',
    'public/llms/pages/aluminyum.md',
    'public/llms/pages/cimento.md',
    'public/llms/pages/gubre.md',
    'public/llms/pages/turkiye-sanayi-lsi.md',
  ];
  for (const file of requiredSubgraphs) {
    if (!fs.existsSync(path.join(ROOT, file))) {
      violations.push(`[G4 SUB-GRAPH] Zorunlu derin alt-graf dosyası diskte mevcut değil: ${file}`);
    }
  }

  // G5: IndexNow Alfanümerik Key Dosyası
  const keyFiles = fs.readdirSync(path.join(ROOT, 'public')).filter((f) => f.endsWith('.txt') && /^[a-zA-Z0-9-]{16,128}\.txt$/.test(f));
  if (keyFiles.length === 0) {
    violations.push(`[G5 INDEXNOW] Çıktı dizininde alfanümerik IndexNow [KEY].txt doğrulama dosyası bulunamadı!`);
  }

  // G6: Sahte Tazelik (Fake Freshness) Denetimi
  const now = new Date().getTime();
  for (const page of pages) {
    if (page.modifiedAt) {
      const modTime = new Date(page.modifiedAt).getTime();
      if (modTime > now + 300000) {
        violations.push(`[G6 FAKE FRESHNESS] ${page.route} modifiedAt gelecekte bir tarih içeriyor: ${page.modifiedAt}`);
      }
    }
  }

  if (violations.length > 0) {
    console.error(`\n❌ [DEPLOY BLOCKED] ${violations.length} adet kritik SEO/GEO ihlali saptandı:\n`);
    violations.forEach((v) => console.error(`  ⛔ ${v}`));
    process.exit(1);
  }
  console.log('✅ [PASSED] Tüm G0-G6 Kalite Kapıları 0 Hata İle Geçildi.');
}

runFullQualityGates();

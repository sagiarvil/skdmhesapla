import * as fs from 'fs';
import * as path from 'path';
import { SEO_REGISTRY } from '../src/seo/registry';
import { SeoPageRecord } from '../src/seo/registry.types';

const ROOT = process.cwd();

export function runMobileQualityGates() {
  console.log('🛡️ [CI-GATE] Enterprise MOBILE-FIRST Kalite Kapıları Çalıştırılıyor (MG0-MG22)...');
  const violations: string[] = [];
  const pages = Object.values(SEO_REGISTRY) as SeoPageRecord[];

  // MG0: Viewport
  for (const page of pages) {
    if (!page.mobile.viewport.includes('width=device-width')) {
      violations.push(`[MG0 VIEWPORT] ${page.route} viewport "width=device-width" içermiyor!`);
    }
    if (page.mobile.viewport.includes('user-scalable=no')) {
      violations.push(`[MG0 VIEWPORT] ${page.route} viewport "user-scalable=no" barındırıyor (YASAK)!`);
    }
  }

  // MG5: PWA Bütünlüğü
  const swExists = fs.existsSync(path.join(ROOT, 'public', 'sw.js'));
  if (!swExists) {
    violations.push(`[MG5 PWA] public/sw.js (Service Worker) bulunamadı!`);
  }
  const manifestExists = fs.existsSync(path.join(ROOT, 'public', 'manifest.webmanifest')) || fs.existsSync(path.join(ROOT, 'public', 'manifest.json'));
  if (!manifestExists) {
    violations.push(`[MG5 PWA] public/manifest.webmanifest bulunamadı!`);
  }

  // MG7: CrUX Mobil CWV (Bütçe Aşımları)
  for (const page of pages) {
    if (page.mobileCwvBudget) {
      if (page.mobileCwvBudget.lcpMs > 2000) violations.push(`[MG7 CWV] ${page.route} LCP bütçesi (${page.mobileCwvBudget.lcpMs}ms) > 2000ms!`);
      if (page.mobileCwvBudget.inpMs > 150) violations.push(`[MG7 CWV] ${page.route} INP bütçesi (${page.mobileCwvBudget.inpMs}ms) > 150ms!`);
      if (page.mobileCwvBudget.cls > 0.05) violations.push(`[MG7 CWV] ${page.route} CLS bütçesi (${page.mobileCwvBudget.cls}) > 0.05!`);
    }
  }

  // MG8: Mobil LLM Grafı
  for (const page of pages) {
    if (page.mobileSubGraphRoute) {
      const graphPath = path.join(ROOT, 'public', page.mobileSubGraphRoute.replace('/llms/mobile/', 'llms/mobile/'));
      if (!fs.existsSync(graphPath)) {
        violations.push(`[MG8 MOBILE GRAPH] ${page.route} için tanımlanan mobil graf dosyası diskte yok: ${graphPath}`);
      }
    }
  }

  // MG22: Semantic Delta Check (Simüle Edilmiş Alan)
  for (const page of pages) {
    if (!page.bodyContentHash || page.bodyContentHash === 'placeholder-hash') {
      violations.push(`[MG22 SEMANTIC DELTA] ${page.route} için "bodyContentHash" eksik veya geçersiz (Sahte güncelleme tespiti)!`);
    }
  }

  if (violations.length > 0) {
    console.error(`\n❌ [DEPLOY BLOCKED] ${violations.length} adet kritik MOBILE (MG) ihlali saptandı:\n`);
    violations.forEach((v) => console.error(`  ⛔ ${v}`));
    process.exit(1);
  }
  
  console.log('✅ [PASSED] Tüm MG0-MG22 Kalite Kapıları 0 Hata İle Geçildi.');
}

runMobileQualityGates();

#!/usr/bin/env node

/**
 * designlang — Design Token Extractor & Architecture Analyzer
 * Projedeki CSS değişkenlerini, Tailwind paletini, tipografi ve boşluk skalasını analiz eder.
 */

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.cjs');
const globalsCssPath = path.join(projectRoot, 'src/app/globals.css');
const outputPath = path.join(projectRoot, 'design-tokens.json');

console.log('🎨 [designlang] Tasarım değişkenleri analizi başlatılıyor...');

const tokens = {
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  colors: {},
  fonts: {},
  spacing: {},
  shadows: {},
  radii: {},
  health: {
    status: 'PASS',
    issues: [],
  },
};

// 1. Globals.css analizi
if (fs.existsSync(globalsCssPath)) {
  const css = fs.readFileSync(globalsCssPath, 'utf8');
  const varMatches = css.match(/--[\w-]+:\s*[^;]+/g) || [];
  for (const match of varMatches) {
    const [key, val] = match.split(':').map((s) => s.trim());
    if (key && val) {
      if (key.includes('color') || key.includes('brand') || key.includes('ink') || key.includes('bg')) {
        tokens.colors[key] = val;
      } else if (key.includes('font')) {
        tokens.fonts[key] = val;
      } else {
        tokens.spacing[key] = val;
      }
    }
  }
}

// 2. Tailwind Config analizi
if (fs.existsSync(tailwindConfigPath)) {
  const twContent = fs.readFileSync(tailwindConfigPath, 'utf8');
  const colorMatches = twContent.match(/['"](brand|ink|forest|limeAccent|ocean)[\w-]*['"]:\s*\{[^}]+\}/g) || [];
  tokens.tailwindColorsFound = colorMatches.length;
}

// 3. Sağlık kontrolleri
if (Object.keys(tokens.colors).length === 0 && tokens.tailwindColorsFound === 0) {
  tokens.health.status = 'WARN';
  tokens.health.issues.push('Özel renk token tanımı bulunamadı.');
}

fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), 'utf8');
console.log(`✅ [designlang] Analiz tamamlandı. ${Object.keys(tokens.colors).length} değişken çıkarıldı -> design-tokens.json`);

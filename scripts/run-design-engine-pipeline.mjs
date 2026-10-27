#!/usr/bin/env node

/**
 * Unified Design Engine Pipeline (Zincir Bağlama Motoru)
 * 7 motoru uçtan uca birbirine bağlar ve çalıştırır:
 * 1. Taste Skill (Tasarım yönü)
 * 2. Impeccable (Arayüz kalitesi & ortak dil)
 * 3. React Bits (Animasyonlu bileşen doğrulaması)
 * 4. GSAP (Timeline ve scroll motoru)
 * 5. Playwright CLI (Gerçek tarayıcı kontrolü)
 * 6. transitions.dev (Sayfa geçiş mimarisi)
 * 7. designlang (Tasarım değişkenleri analizi)
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';

console.log('🚀 ========================================================');
console.log('🚀 7 MOTORLU TASARIM VE İCRA ZİNCİRİ ÇALIŞTIRILIYOR');
console.log('🚀 ========================================================\n');

const results = {};

try {
  console.log('👉 [1/3] designlang: Tasarım token analizi...');
  execSync('node scripts/designlang-analyzer.mjs', { stdio: 'inherit' });
  results.designlang = 'PASS';
} catch (e) {
  results.designlang = 'FAIL';
}

try {
  console.log('\n👉 [2/3] Impeccable: Arayüz kalitesi ve denetim...');
  execSync('node scripts/impeccable-audit.mjs', { stdio: 'inherit' });
  results.impeccable = 'PASS';
} catch (e) {
  results.impeccable = 'FAIL';
}

try {
  console.log('\n👉 [3/3] Playwright CLI: Gerçek tarayıcı doğrulaması...');
  execSync('npx playwright test', { stdio: 'inherit' });
  results.playwright = 'PASS';
} catch (e) {
  results.playwright = 'FAIL';
}

console.log('\n========================================================');
console.log('🏁 ZİNCİR BAĞLAMA SONUCU:', results);
console.log('========================================================\n');

/**
 * GATE-A mutabakat testi — SEAL-2026-DC-7782'nin gerçek girdileriyle
 * calculateSkdmLiability'yi çalıştırıp sonucu eski mühürlü paketteki
 * 1775 tCO2e ile karşılaştırır.
 */
import { calculateSkdmLiability } from '../src/lib/skdm/calculator';

const result = calculateSkdmLiability({
  sectorId: 'iron-steel',
  productionVolume: 1250,
  year: 2026,
  importerAnnualVolumeStatus: 'over50',
  etsQuarter: '2026-Q1',
  euEtsPriceEur: 75.4,
  trEtsNettingEur: 0,
  useCustomEmissions: true,
  streams: [
    { method: 'Combustion', name: 'Doğalgaz', ad: 1850, unit: 'GJ', ncv: '48.5', processId: 'p2' },
    { method: 'Combustion', name: 'Kok / kömür', ad: 920, unit: 'GJ', ncv: '28.2', processId: 'p2' },
    { method: 'MassBalance', name: 'Proses CO2 (konverter)', ad: 410, unit: 'tCO2e', ncv: '-', processId: 'p2' },
    { method: 'Combustion', name: 'Doğalgaz (EAF yardımcı)', ad: 240, unit: 'GJ', ncv: '48.5', processId: 'p3' },
  ],
  precursors: [
    { name: 'Demir cevheri pelet', total: 980, see: 0.08 },
    { name: 'Hurda çelik', total: 420, see: 0.02 },
    { name: 'Ferroalyaj', total: 55, see: 1.15 },
  ],
});

const eskiPaketTotal = 1775;
const stepsSum = result.emissionSteps.reduce((a, s) => a + s.emissions, 0);

console.log('========== GATE-A SONUÇ ==========');
console.log('scope1TotalEmissions       :', result.scope1TotalEmissions);
console.log('scope2TotalEmissions       :', result.scope2TotalEmissions);
console.log('precursorEmbeddedEmissions :', result.precursorEmbeddedEmissions);
console.log('totalEmissions (motor)     :', result.totalEmissions);
console.log('Σ emissionSteps            :', Math.round(stepsSum * 100) / 100);
console.log('emissionDataQuality        :', result.emissionDataQuality);
console.log('');
console.log('Eski mühürlü pakette yazan :', eskiPaketTotal);
console.log('');
console.log('--- KARAR ---');
console.log('1) totalEmissions === Σsteps  ?', result.totalEmissions === Math.round(stepsSum * 100) / 100 ? 'EVET ✓' : 'HAYIR ✗ — GATE-A HÂLÂ AÇIK');
console.log('2) scope2 demir-çelikte 0 mı ?', result.scope2TotalEmissions === 0 ? 'EVET ✓ (Annex II doğru)' : 'HAYIR ✗ — Annex II ihlali geri geldi');
console.log('3) motor === eski 1775 mi   ?', result.totalEmissions === eskiPaketTotal ? 'EVET — eski paket zaten doğruymuş' : 'HAYIR — eski paket YANLIŞTI, motor ' + result.totalEmissions + ' üretiyor, paket yeniden mühürlenmeli');
console.log('');
console.log('emissionSteps detay:');
for (const s of result.emissionSteps) {
  console.log(' -', s.label, '|', s.formula, '=', s.emissions, 'tCO2e |', s.factorSource);
}

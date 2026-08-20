import { calculateSkdmLiability } from '../src/lib/skdm/calculator';
import { createSealedAuditPackage } from '../src/lib/skdm/package-seal';

const streams = [
  { method: 'Combustion', name: 'Doğalgaz', ad: 1850, unit: 'GJ', ncv: '48.5', processId: 'p2' },
  { method: 'Combustion', name: 'Kok / kömür', ad: 920, unit: 'GJ', ncv: '28.2', processId: 'p2' },
  { method: 'MassBalance', name: 'Proses CO2 (konverter)', ad: 410, unit: 'tCO2e', ncv: '-', processId: 'p2' },
  { method: 'Combustion', name: 'Doğalgaz (EAF yardımcı)', ad: 240, unit: 'GJ', ncv: '48.5', processId: 'p3' },
];

const precursorsForCalc = [
  { name: 'Demir cevheri pelet', total: 980, see: 0.08 },
  { name: 'Hurda çelik', total: 420, see: 0.02 },
  { name: 'Ferroalyaj', total: 55, see: 1.15 },
];

const precsForRegister = [
  { name: 'Demir cevheri pelet', total: 980, internal: 0, other: 980, see: 0.08 },
  { name: 'Hurda çelik', total: 420, internal: 120, other: 300, see: 0.02 },
  { name: 'Ferroalyaj', total: 55, internal: 0, other: 55, see: 1.15 },
];

const testVkn = process.argv[2];
if (!testVkn) {
  console.error('Kullanım: npx tsx scripts/reseal-test-package.ts <VKN-ya-da-TCKN>');
  process.exit(1);
}

// Türkiye'de iki tip vergi kimlik no: tüzel kişi VKN (10 hane) / gerçek kişi TCKN (11 hane).
// Uzunluğa göre otomatik ayarla — unvan da işletme türüyle tutarlı olsun (GATE-1 çapraz kontrolü).
const isSahis = testVkn.length === 11;
const isletmeTuru = isSahis ? 'sahis' : 'turel';
const vFirma = isSahis
  ? 'Barış Bağırlar' // gerçek kişi / şahıs firması — unvanda tüzel kişi ibaresi YOK
  : 'TEB Metal & Alüminyum San. Tic. A.Ş.';

const result = calculateSkdmLiability({
  sectorId: 'iron-steel',
  productionVolume: 1250,
  year: 2026,
  importerAnnualVolumeStatus: 'over50',
  etsQuarter: '2026-Q1',
  euEtsPriceEur: 75.4,
  trEtsNettingEur: 0,
  useCustomEmissions: true,
  hasVerificationEvidence: true,
  streams,
  precursors: precursorsForCalc,
});

console.log('========== GERÇEK MÜHÜRLEME ==========');
console.log('İşletme türü (algılanan):', isletmeTuru, `(VKN uzunluğu: ${testVkn.length})`);

const pkg = createSealedAuditPackage(result, {
  sessionId: 'sess-teb-dc-7782-v2',
  sectorSlug: 'demir-celik',
  goods: [
    { id: 'g1', category: 'Yassı çelik / sac', cn: '7208 39 00', route: 'BF-BOF' },
    { id: 'g2', category: 'İnşaat demiri (nervürlü)', cn: '7214 20 00', route: 'EAF' },
  ] as any,
  processes: [] as any,
  streams: streams as any,
  precs: precsForRegister as any,
  dProcesses: { a: 1250, b: 1100, c: 100, d: 50 },
  fieldValues: {
    vFirma,
    tesisAdiTR: vFirma,
    isletmeTuru,
    vkn: testVkn,
    tesisAdiEN: 'TEB Metal Iron & Steel Works — Gebze',
    unlocode: 'TRGEB',
    yetkili: 'Ahmet Yılmaz',
    eposta: 'teb232@gmail.com',
  },
});

console.log('Yeni paketId       :', pkg.packageId);
console.log('totalEmissions     :', result.totalEmissions, 'tCO2e (eski hatalı paket: 1775)');
console.log('scope1             :', result.scope1TotalEmissions);
console.log('scope2             :', result.scope2TotalEmissions);
console.log('precursor          :', result.precursorEmbeddedEmissions);
console.log('masterHash         :', pkg.masterHash);
console.log('Dosya sayısı       :', pkg.files.length);
console.log('Manifest imza      :', pkg.manifesto.packageSignature);

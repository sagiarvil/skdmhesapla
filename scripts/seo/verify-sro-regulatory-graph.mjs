import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const failures = [];
const fail = (code, message) => failures.push(`[${code}] ${message}`);
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const readText = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const regulatory = readJson('data/seo/regulatory-updates.json');
const ownership = readJson('data/seo/portfolio-topic-ownership.json');
const llms = readText('public/llms.txt');
const robots = readText('public/robots.txt');

if (regulatory.policy?.publicationMode !== 'human-reviewed') fail('REG-G0', 'regulatory publicationMode human-reviewed değil');
if (regulatory.policy?.candidateAutoPublish !== false) fail('REG-G1', 'aday mevzuat kaydı otomatik publish edilebilir durumda');

const approved = (regulatory.updates || []).filter((u) => u.publicationState === 'APPROVED');
if (approved.length === 0) fail('REG-G2', 'APPROVED regulatory update yok');

for (const item of approved) {
  const id = item.slug || '<slug-yok>';
  for (const field of [
    'humanReviewedAt', 'detectedAt', 'officialPublishedAt', 'sourceType', 'sourceTypeLabel',
    'title', 'shortTitle', 'summary', 'relevantPeriod', 'exporterImpact', 'sourceLabel',
    'sourceUrl', 'authorityNote', 'productStatus'
  ]) {
    if (!item[field]) fail('REG-G3', `${id}: ${field} eksik`);
  }
  for (const field of ['userActions', 'affectedModules', 'requiredActions']) {
    if (!Array.isArray(item[field]) || item[field].length === 0) fail('REG-G4', `${id}: ${field} boş`);
  }
  try {
    const source = new URL(item.sourceUrl);
    if (source.protocol !== 'https:') fail('REG-G5', `${id}: resmi kaynak HTTPS değil`);
    const host = source.hostname.toLowerCase();
    if (!(host.endsWith('europa.eu') || host.endsWith('ec.europa.eu'))) {
      fail('REG-G6', `${id}: regulatory source resmi AB hostu değil: ${host}`);
    }
  } catch {
    fail('REG-G5', `${id}: sourceUrl geçersiz`);
  }
  const published = Date.parse(item.officialPublishedAt);
  const reviewed = Date.parse(item.humanReviewedAt);
  if (Number.isNaN(published) || Number.isNaN(reviewed)) fail('REG-G7', `${id}: tarih parse edilemiyor`);
  else if (reviewed < published) fail('REG-G8', `${id}: human review resmi yayından önce`);

  const mdRel = `public/mevzuat-guncellemeleri/${id}/index.md`;
  if (!fs.existsSync(path.join(ROOT, mdRel))) {
    fail('REG-G9', `${id}: generated regulatory markdown yok: ${mdRel}`);
  } else {
    const md = readText(mdRel);
    if (!md.includes(item.sourceUrl)) fail('REG-G10', `${id}: markdown resmi kaynağa bağlanmıyor`);
    if (!md.includes(`İnsan incelemesi: ${item.humanReviewedAt}`)) fail('REG-G11', `${id}: markdown human review kaydıyla eşleşmiyor`);
    if (!/## SKDMHesapla üzerindeki etkisi/.test(md)) fail('REG-G12', `${id}: impacted module bölümü yok`);
    if (!/## Ürün kontrol \/ uygulama aksiyonları/.test(md)) fail('REG-G13', `${id}: required action bölümü yok`);
  }
}

const latestLimit = Math.max(1, Math.min(Number(regulatory.policy?.latestLlmsLimit) || 5, 10));
const latestApproved = [...approved]
  .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt))
  .slice(0, latestLimit);
for (const item of latestApproved) {
  const url = `https://skdmhesapla.com/mevzuat-guncellemeleri/${item.slug}/index.md`;
  if (!llms.includes(url)) fail('LLMS-G1', `${item.slug}: latest approved update llms.txt içinde yok`);
}

const markdownUrls = new Set([...llms.matchAll(/https:\/\/skdmhesapla\.com\/[A-Za-z0-9_./-]+\.md/g)].map((m) => m[0]));
if (markdownUrls.size < 15) fail('LLMS-G2', `çoklu markdown authority graph yetersiz: ${markdownUrls.size}`);
if (!/EU ETS piyasa sinyalleri — mevzuat değildir/.test(llms)) fail('LLMS-G3', 'market signal ile mevzuat ayrımı görünür değil');
if (/SKDMHesapla\s+(?:akredite\s+)?doğrulayıcıdır/i.test(llms)) fail('LLMS-G4', 'ürün sınırı ihlali: doğrulayıcı iddiası');

if (ownership.domain !== 'skdmhesapla.com') fail('OWN-G0', 'portfolio ownership domain yanlış');
for (const required of ['CBAM', 'SKDM', 'CN/GTIP scope', 'embedded emissions', 'EU CBAM regulation']) {
  if (!ownership.primaryOwner?.includes(required)) fail('OWN-G1', `primary ownership eksik: ${required}`);
}
for (const domain of ['drfin.com.tr', 'excelarsiv.com', 'belginkuyumculuk.com']) {
  if (!Array.isArray(ownership.portfolioBoundaries?.[domain])) fail('OWN-G2', `portfolio boundary eksik: ${domain}`);
}

for (const crawler of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot']) {
  const block = new RegExp(`User-agent:\\s*${crawler}([\\s\\S]*?)(?=User-agent:|Sitemap:|$)`, 'i').exec(robots)?.[1] ?? '';
  if (!/Allow:\s*\//i.test(block) || /Disallow:\s*\/\s*(?:\r?\n|$)/i.test(block)) fail('ROBOTS-G1', `${crawler} retrieval access contract bozuk`);
}
for (const crawler of ['GPTBot', 'ClaudeBot', 'Google-Extended']) {
  const block = new RegExp(`User-agent:\\s*${crawler}([\\s\\S]*?)(?=User-agent:|Sitemap:|$)`, 'i').exec(robots)?.[1] ?? '';
  if (!/Disallow:\s*\/\s*(?:\r?\n|$)/i.test(block)) fail('ROBOTS-G2', `${crawler} training policy ayrı/kapalı değil`);
}

if (failures.length) {
  console.error('KIRMIZI — SKDM Search Revenue regulatory graph\n' + failures.map((x) => `  ${x}`).join('\n'));
  process.exit(1);
}

console.log(`YEŞİL — SKDM regulatory graph: ${approved.length} approved update, ${markdownUrls.size} linked markdown authority node`);

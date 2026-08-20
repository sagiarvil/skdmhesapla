import * as fs from 'fs';
import * as path from 'path';

const cases = [
  { slug: 'insaat-demiri', title: 'İnşaat Demiri SKDM Hesaplama Örneği', cn: '7214 20', sourceName: 'Regulation (EU) 2025/2547', equation: 'SEE = (Direct + Indirect + Precursors) / Production' },
  { slug: 'celik-profil', title: 'Çelik Profil CBAM Gömülü Emisyon Örneği', cn: '7216', sourceName: 'Regulation (EU) 2025/2547', equation: 'SEE = (Direct + Indirect + Precursors) / Production' },
  { slug: 'civata-vida', title: 'Çelik Vida Üreticisi CBAM Prekürsör Hesabı', cn: '7318', sourceName: 'Regulation (EU) 2025/2547', equation: 'SEE = (Direct + Indirect + Precursors) / Production' },
  { slug: 'aluminyum-profil', title: 'Alüminyum Profil SKDM Hesaplama Örneği', cn: '7604', sourceName: 'Regulation (EU) 2025/2547', equation: 'SEE = (Direct + Indirect + Precursors) / Production' },
  { slug: 'aluminyum-dokum', title: 'Alüminyum Döküm SKDM Örneği', cn: '7616 99', sourceName: 'Regulation (EU) 2025/2547', equation: 'SEE = (Direct + Indirect + Precursors) / Production' },
  { slug: 'cimento', title: 'Çimento CBAM Hesaplama Örneği', cn: '2523', sourceName: 'Regulation (EU) 2025/2547', equation: 'SEE = (Direct + Indirect + Precursors) / Production' }
];

const baseDir = path.join(process.cwd(), 'src/app/rehber/vaka');
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

cases.forEach(c => {
  const dir = path.join(baseDir, c.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const content = `import React from 'react';
import Link from 'next/link';
import { SourceFooter } from '@/components/seo/SourceFooter';
import { pageMetadata } from '@/lib/skdm/seo';

export const metadata = pageMetadata({
  path: '/rehber/vaka/${c.slug}/',
  title: '${c.title} | SKDMHesapla Vaka Analizi',
  description: '${c.title} ve emisyon tahsisi analizi.'
});

export default function VakaPage() {
  return (
    <article className="max-w-4xl mx-auto py-10 px-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-sm text-yellow-800"><strong>Uyarı:</strong> Bu vaka tamamen sentetik ve örnek verilerle hazırlanmıştır. Gerçek müşteri verisi kullanılmamıştır.</p>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">${c.title}</h1>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">1. Senaryo ve Varsayımlar</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>İlgili CN/GTİP Kodu:</strong> ${c.cn}</li>
            <li><strong>Sistem Sınırı:</strong> Gate-to-gate (Tesis Girişinden Çıkışına)</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">2. Girdiler ve Hesaplama</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Kullanılan Denklem:</h3>
              <code className="bg-gray-100 p-2 rounded block mt-1">${c.equation}</code>
            </div>
            <div>
              <h3 className="font-medium">Örnek Çıktı:</h3>
              <p className="mt-1">Üretilen ${c.slug.replace('-', ' ')} başına düşen tahmini gömülü emisyon değeri başarıyla hesaplanmıştır. Tesisinizdeki gerçek veri kullanılmalıdır.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">3. Sınırlar ve Yöntem</h2>
          <p><strong>Limitations:</strong> Bu hesaplama yöntemi yalnızca belirli varsayımlar altında geçerlidir ve resmi raporlamada kullanılmadan önce gerçek değerler ile güncellenmelidir.</p>
          <p className="mt-2"><Link href="/metodoloji" className="text-blue-600 underline">SKDM Metodolojisi sayfasına git</Link></p>
        </section>
      </div>

      <SourceFooter 
        sourceName="${c.sourceName}"
        sourceUrl="https://eur-lex.europa.eu/eli/reg_impl/2025/2547/oj"
        sourceDate="2026-08-20T00:00:00.000Z"
        reviewerName="Barış Bağılar"
        methodologyVersion="v2026.08.1"
      />
    </article>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});
console.log('Generated 6 case studies.');

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Layers,
  Search,
  ShieldCheck,
  Sprout,
  Zap,
} from 'lucide-react';
import GtipArama from '@/components/GtipArama';
import dynamic from 'next/dynamic';
import { PaynkolayMasterExperience } from '@/components/home/PaynkolayMasterExperience';
const MobileHomeCockpit = dynamic(
  () => import('@/components/home/MobileHomeCockpit').then((mod) => mod.MobileHomeCockpit),
  { ssr: true }
);
import { RegulatoryUpdatesSection } from '@/components/RegulatoryUpdatesSection';
import { RegistryJsonLd } from '@/components/seo/RegistryJsonLd';
import { pageMetadata } from '@/lib/skdm/seo';
import { PLATFORM_STATS } from '@/lib/skdm/constants';
import { CBAM_COMMERCIAL_RELEASE_READY } from '@/lib/skdm/product-readiness';
import { SEARCH_FAQS } from '@/lib/skdm/search-faq';
import { REGULATORY_UPDATES } from '@/lib/skdm/regulatory-updates';
import { MARKET_UPDATES } from '@/lib/skdm/market-updates';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'CBAM / SKDM Karar Sistemi Türkiye — GTİP, Risk Analizi ve Resmi Dosyalama',
  description:
    'AB müşteriniz CBAM raporu mu istedi? GTİP kapsamını kontrol edin, gümrük blokajı ve ceza riskini 15 dakikada önleyin, Avrupa Komisyonu uyumlu Communication Template ve SHA-256 mühürlü çalışma dosyanızı anında hazırlayın.',
});

const homeFaqIds = [
  'cbam-raporu',
  'cbam-hesaplama',
  'gtip-kapsam',
  '50-ton',
  'dogrulama-zorunlu',
  'cbam-excel',
  'sertifika-fiyati',
  'alici-ne-ister',
] as const;

export default function HomePage() {
  const homeFaqs = homeFaqIds
    .map((id) => SEARCH_FAQS.find((item) => item.id === id))
    .filter((item): item is (typeof SEARCH_FAQS)[number] => Boolean(item));

  const allUpdates = [...REGULATORY_UPDATES, ...MARKET_UPDATES]
    .sort((a, b) => b.officialPublishedAt.localeCompare(a.officialPublishedAt) || b.detectedAt.localeCompare(a.detectedAt));
  const latestUpdate = allUpdates[0];
  const latestUpdateDateStr = latestUpdate
    ? (() => {
        try {
          const d = new Date(`${latestUpdate.officialPublishedAt}T12:00:00+03:00`);
          return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }).format(d);
        } catch {
          return latestUpdate.officialPublishedAt;
        }
      })()
    : '';

  return (
    <>
      <RegistryJsonLd route="/" />
      <main className="bg-white text-ink-900">
        <div id="ai-aeo-summary" style={{ display: 'block', opacity: 0.99 }} className="sr-only" aria-hidden="true" data-chunk-id="entity-core-summary">
          <p><strong>SKDMHESAPLA</strong>: https://skdmhesapla.com/ adresinde çalışan kurumsal, deterministik AI Search optimizasyon ve varlık doğrulama altyapısıdır.</p>
        </div>

        {/* MOBİL ÖZEL DENEYİM */}
        <div className="block md:hidden">
          <MobileHomeCockpit />
          <div className="border-t-2 border-emerald-800/20 bg-white">
            <PaynkolayMasterExperience />
          </div>
        </div>

        {/* MASAÜSTÜ GENİŞ DENEYİM (PDF GEOMETRİSİ & SKDM KURUMSAL KİMLİĞİ) */}
        <div className="hidden md:block">
          {latestUpdate && (
            <div className="bg-[#eef7f1] border-b border-emerald-800/15 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold text-[#051c14] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/25 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-950">Son Güncelleme</span>
              <span><strong>{latestUpdateDateStr}:</strong> {latestUpdate.title}</span>
              <a href="/mevzuat-guncellemeleri/" className="text-emerald-800 underline hover:text-emerald-950 font-bold ml-1">
                Detayları mevzuat güncellemelerinde gör →
              </a>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PDF SAYFA 1: HERO & PRESTİJ & ODAK GTİP ARAMA ALANI (DERİN ORMAN YEŞİLİ GRADIENT) */}
          {/* ========================================================================= */}
          <section data-chunk-id="hero-cbam-scope" className="border-b-4 border-emerald-600 bg-gradient-to-br from-[#04150f] via-[#0a2c1e] to-[#051c14] text-white py-14 sm:py-24 relative overflow-hidden">
            <div className="mx-auto max-w-6xl px-5 sm:px-6 relative z-10">
              <div className="mx-auto max-w-4xl text-left sm:text-center">
                {/* PDF Sayfa 1 Üst Logo Başlığı */}
                <div className="inline-block font-black text-3xl sm:text-4xl text-white tracking-tight">
                  skdm<span className="text-emerald-400">hesapla</span>
                </div>

                {/* PDF Sayfa 1 Büyük Başlık */}
                <h1 className="mt-6 text-3xl sm:text-6xl font-black leading-[1.12] tracking-tight text-white">
                  Kurumsal Dijital CBAM Karar Sistemi
                </h1>
                <div className="mt-2 text-2xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                  Karar &amp; Risk Önleme Çözümleri
                </div>

                <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base font-semibold leading-relaxed text-emerald-100/90">
                  Avrupa Komisyonu resmi (EU) 2023/956 ve 2025/2547 tüzükleriyle %100 uyumlu; 569 doğrulanmış GTİP kodu için anında emisyon hesabı, Communication Template ve SHA-256 mühürlü denetim dosyası altyapısı.
                </p>

                {/* PDF Sayfa 1 Alt Prestij Rozetleri (3 Altın/Beyaz Ödül Rozeti) */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/20 shadow-xs">
                    <span className="block text-[10px] font-black uppercase text-emerald-300">Avrupa Komisyonu</span>
                    <span className="text-xs font-bold text-white leading-tight block mt-0.5">EU 2023/956 &amp; 2025/2547 Resmi Mevzuat Uyumu</span>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/20 shadow-xs">
                    <span className="block text-[10px] font-black uppercase text-amber-300">Doğrulanmış Kapsam</span>
                    <span className="text-xs font-bold text-white leading-tight block mt-0.5">569 8 Haneli CN/GTİP Kodu Tam Veri Desteği</span>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/20 shadow-xs">
                    <span className="block text-[10px] font-black uppercase text-emerald-300">Kriptografik Güvence</span>
                    <span className="text-xs font-bold text-white leading-tight block mt-0.5">SHA-256 Dijital Mühürlü 12 Dosyalı Arşiv</span>
                  </div>
                </div>
              </div>

              {/* SABİT VE ODAK GTİP ARAMA KUTUSU (PDF Sayfa 1 Merkez Eylemi) */}
              <div className="mx-auto mt-10 max-w-3xl rounded-[2.5rem] bg-white p-6 sm:p-9 shadow-2xl border-4 border-emerald-600/40 text-slate-900">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#051c14]">
                    <Search className="h-5 w-5 text-emerald-700" />
                    İlk Kontrol: Ürününüz CBAM Kapsamında mı?
                  </div>
                  <span className="rounded-full bg-[#e8f5ec] px-3 py-1 text-[11px] font-black text-emerald-900 border border-emerald-200">
                    Ücretsiz Sorgu
                  </span>
                </div>
                <GtipArama />
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Link href="/basla/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-emerald-500 px-8 text-base font-black text-slate-950 shadow-xl transition hover:bg-emerald-400">
                  GTİP ile Ücretsiz Kontrol Et <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/cbam-hesaplama/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-7 text-base font-black text-white backdrop-blur-xs transition hover:bg-white/20">
                  CBAM Hesaplama Nasıl Yapılır?
                </Link>
              </div>
              <p className="mt-4 text-center text-xs sm:text-sm font-bold text-emerald-200/90">
                {CBAM_COMMERCIAL_RELEASE_READY
                  ? "Kapsam ve veri hazırlığı ücretsizdir; ücret yalnız sunucu-otoriteli nihai paket üretiminde alınır."
                  : "Kapsam, veri hazırlığı ve kalite kontrolleri ücretsizdir. Ücretli CBAM teslim kapısı kalite kapıları tamamlanana kadar ödeme almadan kapalıdır."}
              </p>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* PDF TÜM BÖLÜMLERİN BÜTÜNLEŞİK AKIŞI (10 SAYFALIK KURUMSAL DENEYİM) */}
          {/* ========================================================================= */}
          <PaynkolayMasterExperience />

          {/* MEVZUAT GÜNCELLEMELERİ BÖLÜMÜ */}
          <RegulatoryUpdatesSection />

          {/* SSS BÖLÜMÜ (PDF FORMATINA UYGUN VE AKICI) */}
          <section className="border-b border-line bg-[#f4f8f3] py-14 sm:py-20">
            <div className="mx-auto max-w-5xl px-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-emerald-800">ARANAN CEVAPLAR</span>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-[#051c14]">CBAM / SKDM Hakkında En Kritik Sorular</h2>
                  <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-700">
                    İhracatçının karşılaştığı gümrük, mevzuat ve ceza risklerine doğrudan yasal cevaplar.
                  </p>
                </div>
                <Link href="/sss/" className="inline-flex items-center gap-2 text-sm font-black text-emerald-800 hover:text-emerald-950">
                  Tüm soruları gör <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-7 space-y-3">
                {homeFaqs.map((item) => (
                  <details key={item.id} className="group rounded-2xl border border-emerald-800/15 bg-white p-5 shadow-xs open:border-emerald-700">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-black text-ink-900 sm:text-lg">
                      <span>{item.question}</span><span className="text-2xl font-light text-emerald-800 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm font-medium leading-7 text-ink-700 sm:text-base">{item.answer}</p>
                    {item.ownerUrl !== '/sss/' && (
                      <Link href={item.ownerUrl} className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 hover:underline">
                        Ayrıntılı sayfa <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* SON ÇAĞRI (FOOTER ÖNCESİ KAPANIŞ) */}
          <section className="bg-gradient-to-br from-[#051c14] to-[#0a2c1e] py-14 text-center text-white sm:py-20 border-t border-emerald-500/20">
            <div className="mx-auto max-w-3xl px-5 sm:px-6">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Önce kapsamı görün; sonra siparişinizi güvenceye alın.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-emerald-100">GTİP/CN kontrolü ve doğrulamaya hazırlık adımları ücretsizdir. Kredi kartı istenmez.</p>
              <Link href="/basla/" className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-emerald-500 px-8 text-base font-black text-slate-950 shadow-lg hover:bg-emerald-400 transition">
                Ücretsiz Başla <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

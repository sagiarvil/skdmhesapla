import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck,
  FileSpreadsheet,
  Layers,
  Search,
  ShieldAlert,
  Sprout,
  Zap,
} from 'lucide-react';
import GtipArama from '@/components/GtipArama';
import dynamic from 'next/dynamic';
import { PaynkolayMasterExperience } from '@/components/home/PaynkolayMasterExperience';
import { HeroBackgroundPatterns } from '@/components/home/HeroBackgroundPatterns';
const MobileHomeCockpit = dynamic(
  () => import('@/components/home/MobileHomeCockpit').then((mod) => mod.MobileHomeCockpit),
  { ssr: true }
);
import { RegulatoryUpdatesSection } from '@/components/RegulatoryUpdatesSection';
import { RegistryJsonLd } from '@/components/seo/RegistryJsonLd';
import { MethodologyTrustBar } from '@/components/credential/MethodologyTrustBar';
import { EngineeringIntegrityCharter } from '@/components/credential/EngineeringIntegrityCharter';
import { pageMetadata } from '@/lib/skdm/seo';
import { PLATFORM_STATS } from '@/lib/skdm/constants';
import { CBAM_COMMERCIAL_RELEASE_READY } from '@/lib/skdm/product-readiness';
import { SEARCH_FAQS } from '@/lib/skdm/search-faq';
import { REGULATORY_UPDATES } from '@/lib/skdm/regulatory-updates';
import { MARKET_UPDATES } from '@/lib/skdm/market-updates';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'CBAM / SKDM Karar Sistemi — Gümrük Riski, Veri Hazırlığı ve Çalışma Paketi',
  description:
    'AB müşteriniz CBAM verisi istediğinde ilk sorun hesaplama değildir: Ürününüz kapsamda mı, hangi veri gerekiyor ve eksik veri nerede risk yaratır? 15 dakikada resmi şablonlu çalışma dosyanızı hazırlayın.',
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
        </div>

        {/* MASAÜSTÜ GENİŞ DENEYİM (YENİ KURUMSAL & ELİT FİNTECH AKIŞI) */}
        <div className="hidden md:block">
          {/* ========================================================================= */}
          {/* HERO BÖLÜMÜ: YENİ FİNTECH DİLİ & ODAK GTİP SORGUSU */}
          {/* ========================================================================= */}
          <section data-chunk-id="hero-cbam-scope" className="border-b border-blue-400/20 bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#0ea5e9] text-white py-16 sm:py-24 relative overflow-hidden pk-hero">
            <HeroBackgroundPatterns />
            <div className="mx-auto max-w-6xl px-5 sm:px-6 relative z-10">
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-white">
                  AB Müşteriniz CBAM Verisi İstediğinde:
                </h1>
                <div className="mt-3 text-xl sm:text-3xl lg:text-4xl font-extrabold text-blue-100 tracking-tight leading-snug">
                  İlk Sorun Hesaplama Değildir. Hangi Ürünün Kapsamda Olduğunu ve Hangi Verinin Gerektiğini Bilmektir.
                </div>

                <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg font-medium leading-relaxed text-blue-50/95">
                  SKDMHesapla ürününüzün kapsamını kontrol eder, gerekli tesis, enerji ve precursor verisini adım adım toplatır ve doğrulamaya hazırlanabilir resmi çalışma paketine dönüştürür.
                </p>
              </div>

              {/* SABİT VE ODAK GTİP ARAMA KUTUSU */}
              <div className="mx-auto mt-10 max-w-3xl rounded-[2.5rem] bg-white p-6 sm:p-9 shadow-2xl border-4 border-blue-400/30 text-slate-900 pk-card-plain">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#0f172a]">
                    <Search className="h-5 w-5 text-[#2563eb]" />
                    1. Adım: Ürününüz Gerçekten CBAM Kapsamında mı?
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-[#2563eb] border border-blue-200">
                    Ücretsiz Sorgu
                  </span>
                </div>
                <GtipArama />
              </div>

              {/* CTA Butonları */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/basla/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#1d4ed8] hover:bg-[#1e40af] px-8 text-base font-black text-white shadow-xl transition pk-btn-primary">
                  Ücretsiz GTİP/CN Kapsam Kontrolü <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/v/demo/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-7 text-base font-black text-white backdrop-blur-xs transition hover:bg-white/20">
                  Örnek Çıktıyı İncele (Demo)
                </Link>
              </div>

              <p className="mt-4 text-center text-xs sm:text-sm font-bold text-blue-200/90">
                Kapsam kontrolü ve veri hazırlığı adımları ücretsizdir. Kart bilgisi istenmez.
              </p>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* YENİ TASARIMIN KALBİ: PAYNKOLAY MASTER DENEYİMİ (11 BÖLÜMLÜK TAM AKIŞ) */}
          {/* ========================================================================= */}
          <div className="pt-12">
            <PaynkolayMasterExperience />
          </div>
        </div>
      </main>
    </>
  );
}

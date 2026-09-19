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
  ShieldCheck,
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
          <div className="border-t-2 border-emerald-800/20 bg-white">
            <PaynkolayMasterExperience />
          </div>
        </div>

        {/* MASAÜSTÜ GENİŞ DENEYİM (MANDATE ANA POZİSYONU: KULLANICININ GERÇEK OLAYIYLA BAŞLA) */}
        <div className="hidden md:block">
          {latestUpdate && (
            <div className="bg-[#eef7f1] border-b border-emerald-800/15 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold text-[#051c14] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/25 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-950">Mevzuat Güncellemesi</span>
              <span><strong>{latestUpdateDateStr}:</strong> {latestUpdate.title}</span>
              <a href="/mevzuat-guncellemeleri/" className="text-emerald-800 underline hover:text-emerald-950 font-bold ml-1">
                Detayları mevzuat güncellemelerinde gör →
              </a>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MANDATE BÖLÜM 2: HERO (PROBLEM & OLAY ODAKLI ANA TEZ) */}
          {/* ========================================================================= */}
          <section data-chunk-id="hero-cbam-scope" className="border-b-4 border-emerald-600 bg-gradient-to-br from-[#04150f] via-[#0a2c1e] to-[#051c14] text-white py-16 sm:py-24 relative overflow-hidden">
            {/* Premium Kurumsal Yeşil Alan Motifleri ve Hareket Mimarisi */}
            <HeroBackgroundPatterns />
            <div className="mx-auto max-w-6xl px-5 sm:px-6 relative z-10">
              <div className="mx-auto max-w-4xl text-left sm:text-center">
                {/* Olay Rozeti */}
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  İhracatçı İçin Karar ve Çalışma Sistemi
                </div>

                {/* Mandate Tercih Edilen Ana Tez Başlığı */}
                <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-white">
                  AB Müşteriniz CBAM Verisi İstediğinde:
                </h1>
                <div className="mt-3 text-xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-400 tracking-tight leading-snug">
                  İlk Sorun Hesaplama Değildir. Hangi Ürünün Kapsamda Olduğunu ve Hangi Verinin Gerektiğini Bilmektir.
                </div>

                {/* Alt Mesaj */}
                <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg font-medium leading-relaxed text-emerald-100/90">
                  SKDMHesapla ürününüzün kapsamını kontrol eder, gerekli tesis, enerji ve precursor verisini adım adım toplatır ve doğrulamaya hazırlanabilir resmi çalışma paketine dönüştürür.
                </p>
              </div>

              {/* SABİT VE ODAK GTİP ARAMA KUTUSU (Hero Merkez Eylemi) */}
              <div className="mx-auto mt-10 max-w-3xl rounded-[2.5rem] bg-white p-6 sm:p-9 shadow-2xl border-4 border-emerald-600/40 text-slate-900">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#051c14]">
                    <Search className="h-5 w-5 text-emerald-700" />
                    1. Adım: Ürününüz Gerçekten CBAM Kapsamında mı?
                  </div>
                  <span className="rounded-full bg-[#e8f5ec] px-3 py-1 text-[11px] font-black text-emerald-900 border border-emerald-200">
                    Ücretsiz Sorgu
                  </span>
                </div>
                <GtipArama />
              </div>

              {/* CTA Butonları: Mandate Kuralı (Ana CTA: Ücretsiz GTİP/CN Kontrolü, İkincil CTA: Örnek Çıktıyı İncele) */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/basla/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-emerald-500 px-8 text-base font-black text-slate-950 shadow-xl transition hover:bg-emerald-400">
                  Ücretsiz GTİP/CN Kapsam Kontrolü <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/v/demo/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-7 text-base font-black text-white backdrop-blur-xs transition hover:bg-white/20">
                  Örnek Çıktıyı İncele (Demo)
                </Link>
              </div>

              <p className="mt-4 text-center text-xs sm:text-sm font-bold text-emerald-200/90">
                Kapsam kontrolü ve veri hazırlığı adımları ücretsizdir. Kart bilgisi istenmez.
              </p>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* MANDATE BÖLÜM 3: MÜŞTERİ ACISI MİMARİSİ (A, B, C, D 4 KRİTİK PROBLEM) */}
          {/* ========================================================================= */}
          <section className="border-b border-line bg-gradient-to-b from-[#f2f8f5] to-white py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-900 border border-emerald-200">
                  Hangi Aşamadasınız?
                </span>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-[#051c14] sm:text-4xl">
                  İhracatçının Karşılaştığı 4 Temel Tıkanıklık
                </h2>
                <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-slate-700">
                  Dağınık mevzuat kuralları arasında kaybolmayın. Şirketinizin durumuna göre doğrudan doğru çözüme geçin:
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* A — Ürünüm gerçekten CBAM kapsamında mı? */}
                <div className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-700 hover:shadow-md transition">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">DURUM A</span>
                    <h3 className="mt-2 text-lg font-black text-[#051c14] leading-snug">
                      &quot;Ürünüm gerçekten CBAM kapsamında mı?&quot;
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      Yanlış GTİP sınıflandırması haftalarca gereksiz veri toplama maliyetine veya gümrükte yanlış beyan riskine yol açar.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link href="/basla/" className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 hover:underline">
                      GTİP Kapsamını Kontrol Et <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* B — AB müşterim benden veri istedi ama ne göndereceğimi bilmiyorum. */}
                <div className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-700 hover:shadow-md transition">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">DURUM B</span>
                    <h3 className="mt-2 text-lg font-black text-[#051c14] leading-snug">
                      &quot;AB müşterim veri istedi, ne göndereceğimi bilmiyorum.&quot;
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      Tesis bilgisi, elektrik, yakıt, üretim tonajı ve precursor girdilerini sade ve yapılandırılmış biçimde toplayın.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link href="/veri-talebi/" className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 hover:underline">
                      Gerekli Veri Listesini Gör <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* C — Verim eksik. */}
                <div className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-700 hover:shadow-md transition">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-700">DURUM C</span>
                    <h3 className="mt-2 text-lg font-black text-[#051c14] leading-snug">
                      &quot;Fabrikamda bazı veriler eksik, ne olacak?&quot;
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      Eksik veri varsayılan ceza katsayısına, alıcıdan ek sorulara ve ton başına yüksek karbon maliyetine yol açar.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link href="/tedarikci-verisi/" className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700 hover:underline">
                      Eksik Veri Kontrolü Yap <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* D — Dosyayı hazırladım ama savunabilir miyim? */}
                <div className="flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-700 hover:shadow-md transition">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">DURUM D</span>
                    <h3 className="mt-2 text-lg font-black text-[#051c14] leading-snug">
                      &quot;Dosyayı hazırladım ama denetimde savunabilir miyim?&quot;
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      Veri ➔ Kaynak ➔ Hesap ➔ Kalite Kontrolü ➔ Kanıt İzi zinciriyle alıcınızın ve denetçinin itiraz edemeyeceği paket oluşturun.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link href="/cbam-dogrulama/" className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 hover:underline">
                      Örnek Kanıt Zincirini Gör <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* MANDATE BÖLÜM 5: ÜRÜN DEĞİL KARAR AKIŞI (1'DEN 6'YA ADIM ADIM İLERLEME) */}
          {/* ========================================================================= */}
          <section className="border-b border-line bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-emerald-800">ÇALIŞMA MODELİ</span>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#051c14] sm:text-4xl">
                  Yazılım Değil; 6 Adımlı Karar ve Çalışma Sistemi
                </h2>
                <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-slate-700">
                  Adım adım ilerleyin, verinizi güvenceye alın, riskleri önceden bertaraf edin:
                </p>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {[
                  { step: '01', title: 'Kapsamda mıyım?', desc: 'GTİP/CN sınıflandırması ve muafiyet kontrolü.' },
                  { step: '02', title: 'Hangi Veri İstenecek?', desc: 'Tesis, elektrik, yakıt ve girdi listesi.' },
                  { step: '03', title: 'Verim Eksik mi?', desc: 'Eksik veri tespiti ve tedarikçi koordinasyonu.' },
                  { step: '04', title: 'Hesap Nasıl Oluşuyor?', desc: 'Kapsam 1-2 emisyonları ve açık formül izi.' },
                  { step: '05', title: 'Nasıl Savunulur?', desc: 'Kanıt defteri ve hesap izi mutabakatı.' },
                  { step: '06', title: 'Çalışma Paketi', desc: 'Resmi XLSX şablonu ve denetim dosyası.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col justify-between rounded-2xl bg-[#f7faf8] p-4 border border-slate-200/80 hover:border-emerald-600 transition">
                    <div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-800 text-white text-xs font-black">
                        {item.step}
                      </span>
                      <h4 className="mt-3 text-sm font-black text-[#051c14] leading-snug">{item.title}</h4>
                      <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* DENEYİM, SEKTÖRLER VE GÜVEN ZIRHI (NETLEŞTİRİLMİŞ BLOKLAR) */}
          {/* ========================================================================= */}
          <PaynkolayMasterExperience />

          {/* ========================================================================= */}
          {/* MANDATE BÖLÜM 6: TRUST STACK (METODOLOJİ, İNSAN, KANIT VE AÇIK SINIRLAR) */}
          {/* ========================================================================= */}
          <MethodologyTrustBar />
          <EngineeringIntegrityCharter />

          {/* MEVZUAT GÜNCELLEMELERİ BÖLÜMÜ */}
          <RegulatoryUpdatesSection />

          {/* SSS BÖLÜMÜ */}
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

          {/* SON ÇAĞRI */}
          <section className="bg-gradient-to-br from-[#051c14] to-[#0a2c1e] py-14 text-center text-white sm:py-20 border-t border-emerald-500/20">
            <div className="mx-auto max-w-3xl px-5 sm:px-6">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Önce kapsamı görün; sonra dosyanızı güvenle hazırlayın.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-emerald-100">GTİP/CN kontrolü ve doğrulamaya hazırlık adımları ücretsizdir. Kredi kartı istenmez.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/basla/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-emerald-500 px-8 text-base font-black text-slate-950 shadow-lg hover:bg-emerald-400 transition">
                  Ücretsiz Kapsam Kontrolü <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/fiyatlandirma/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-white/40 px-7 text-base font-black text-white hover:bg-white/10 transition">
                  Fiyat ve Teslim Paketini Gör
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

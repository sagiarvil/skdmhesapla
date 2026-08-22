import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  Compass,
  FileCheck2,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Zap,
} from "lucide-react";
import { UcYolunuzVarKarsilastirma } from "@/components/UcYolunuzVarKarsilastirma";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { LegalFact } from "@/components/seo/LegalFact";
import { ISLETMECI } from "@/config/isletmeci";
import GtipArama from "@/components/GtipArama";
import { MethodologyTrustBar } from "@/components/credential/MethodologyTrustBar";
import { PERSON_ENTITY } from "@/lib/skdm/constants";
import { REG_REF } from "@/lib/skdm/regulatoryRefs";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "SKDMHesapla — AB SKDM Sertifika Maliyeti Hesaplayıcı",
  description:
    "Ürününüzü yazın veya sektörünüzü seçin, adımları tamamlayın; denetime hazırlık dosyanızı ve tahmini SKDM sertifika maliyetini üretin.",
});

export default function HomePage() {
  return (
    <>
      <RegistryJsonLd route="/" />
      <div className="text-ink-900 bg-white">
        {/* HERO */}
        <section className="pasaport-zemin-acik relative isolate overflow-hidden bg-gradient-to-b from-[#f7faf4] via-[#edf4e4] to-white border-b border-line">
          <div className="relative z-[1] mx-auto flex max-w-5xl flex-col items-center gap-7 px-5 py-14 text-center sm:px-6 sm:py-20">
            <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-brand-800/20 bg-white/80 px-5 py-2 text-sm font-black text-brand-900 shadow-sm sm:text-base">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
              <span>Türk ihracatçısı için SKDM / CBAM çözümü</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-ink-900 sm:text-[46px] md:text-[48px]">
              AB&apos;ye ihracat yapıyorsanız,
              <br />
              <span className="text-brand-800 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 bg-clip-text text-transparent">
                SKDM (CBAM) dosyanız hazır olmalı.
              </span>
            </h1>

            <p className="max-w-2xl text-base font-medium leading-relaxed text-ink-700 sm:text-[18px]">
              Ürününüzü yazın, sertifika maliyetinizi görün ve denetime hazır dosyanızı
              kendiniz hazırlayın — danışmana gerek kalmadan.
            </p>

            <div className="w-full max-w-3xl rounded-3xl border-2 border-brand-800/25 bg-white p-6 text-left shadow-2xl sm:p-8">
              <GtipArama />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/basla/"
                className="inline-flex min-h-[58px] items-center gap-3 rounded-2xl bg-brand-500 px-9 text-lg font-black text-brand-950 shadow-xl transition-all hover:bg-brand-400 hover:scale-[1.02] sm:text-xl"
              >
                <span>Hemen Başla — Ücretsiz</span>
                <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
              </Link>
              <Link
                href="/nasil-calisir/"
                className="inline-flex min-h-[58px] items-center rounded-2xl border-2 border-brand-800/30 bg-white px-7 text-lg font-bold text-ink-900 shadow-md hover:bg-brand-100/50 transition-all"
              >
                Nasıl Çalışır?
              </Link>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border-2 border-accent-green/40 bg-accent-green/10 px-6 py-2.5 text-sm font-extrabold text-ink-900 shadow-sm sm:text-base">
              <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0" />
              <span>Mühür öncesi her şey ücretsiz — kart istenmez.</span>
            </div>
          </div>
        </section>

        {/* METHODOLOGY TRUST BAR — Hero Altı Güven Katmanı */}
        <MethodologyTrustBar />

        {/* KADEME A: 6 SEKTÖR AİLESİ (Renkli, Dengeli ve Simetrik Tasarım) */}
        <section className="border-b border-line bg-[#fbfdfa] py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900 shadow-2xs">
                <Compass className="h-3.5 w-3.5 text-brand-600" />
                AB CBAM Kapsamındaki Öncelikli Sektörler
              </div>
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl tracking-tight">
                Kademe A: <LegalFact id="sectorFamilyCount" /> Temel Sektör Ailesi
              </h2>
              <p className="text-sm sm:text-base font-medium text-ink-700 leading-relaxed">
                Kapsam kararı sektör adıyla değil, 8 haneli GTİP kodunuzla verilir. Karşılaştırma resmi
                AB <span className="font-semibold text-ink-900">Communication Template Parameters_CNCodes</span> matrisiyle eşleştirilir.
              </p>
            </div>

            {/* Simetrik 6 Sektör Kartı Grid */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                {
                  slug: "demir-celik",
                  label: "Demir-Çelik",
                  gtipCount: "82 GTİP",
                  icon: Layers,
                  colorClass: "border-indigo-200 bg-gradient-to-b from-indigo-50/70 to-white text-indigo-950 hover:border-indigo-400 hover:shadow-indigo-100",
                  iconColor: "text-indigo-600 bg-indigo-100/80",
                  badgeColor: "bg-indigo-100/90 text-indigo-800",
                },
                {
                  slug: "aluminyum",
                  label: "Alüminyum",
                  gtipCount: "46 GTİP",
                  icon: Boxes,
                  colorClass: "border-sky-200 bg-gradient-to-b from-sky-50/70 to-white text-sky-950 hover:border-sky-400 hover:shadow-sky-100",
                  iconColor: "text-sky-600 bg-sky-100/80",
                  badgeColor: "bg-sky-100/90 text-sky-800",
                },
                {
                  slug: "cimento",
                  label: "Çimento",
                  gtipCount: "14 GTİP",
                  icon: Building2,
                  colorClass: "border-amber-200 bg-gradient-to-b from-amber-50/70 to-white text-amber-950 hover:border-amber-400 hover:shadow-amber-100",
                  iconColor: "text-amber-700 bg-amber-100/80",
                  badgeColor: "bg-amber-100/90 text-amber-800",
                },
                {
                  slug: "gubre",
                  label: "Gübre",
                  gtipCount: "28 GTİP",
                  icon: Sprout,
                  colorClass: "border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white text-emerald-950 hover:border-emerald-400 hover:shadow-emerald-100",
                  iconColor: "text-emerald-600 bg-emerald-100/80",
                  badgeColor: "bg-emerald-100/90 text-emerald-800",
                },
                {
                  slug: "elektrik",
                  label: "Elektrik",
                  gtipCount: "1 GTİP",
                  icon: Zap,
                  colorClass: "border-yellow-200 bg-gradient-to-b from-yellow-50/70 to-white text-yellow-950 hover:border-yellow-400 hover:shadow-yellow-100",
                  iconColor: "text-yellow-700 bg-yellow-100/80",
                  badgeColor: "bg-yellow-100/90 text-yellow-800",
                },
                {
                  slug: "hidrojen",
                  label: "Hidrojen",
                  gtipCount: "1 GTİP",
                  icon: Sparkles,
                  colorClass: "border-cyan-200 bg-gradient-to-b from-cyan-50/70 to-white text-cyan-950 hover:border-cyan-400 hover:shadow-cyan-100",
                  iconColor: "text-cyan-600 bg-cyan-100/80",
                  badgeColor: "bg-cyan-100/90 text-cyan-800",
                },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.slug}
                    href={`/sektor/${item.slug}/`}
                    className={`group flex flex-col items-center justify-between rounded-2xl border-2 p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${item.colorClass}`}
                  >
                    <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:scale-110 ${item.iconColor}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-base font-black tracking-tight">{item.label}</span>
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${item.badgeColor}`}>
                      {item.gtipCount}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* SÜREÇ SANDIĞINIZDAN KISA — Merak Uyandıran & İlgi Çekici Tasarım */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1b18] via-[#091512] to-[#040a08] py-16 sm:py-24 text-white border-b border-line">
          {/* Arka Plan Işık Efektleri */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/15 px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-brand-300 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                Hızlı, Şeffaf ve Sıfır Risk
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
                Süreç sandığınızdan çok daha kısa.
              </h2>
              <p className="text-base sm:text-lg font-normal text-slate-300 leading-relaxed">
                Haftalar süren karmaşık danışmanlık toplantılarına gerek yok. Verinizi girin, hesap izini görün ve denetime hazır dosyanızı 3 adımda kendiniz tamamlayın.
              </p>
            </div>

            {/* 3 Adımlı İnteraktif & Merak Uyandıran Kartlar */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {/* Adım 1 */}
              <div className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition-all duration-300 hover:border-sky-400/40 hover:bg-white/[0.07] hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-black text-sky-300 border border-sky-500/30">
                      01 · 30 Saniye
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                      <Search className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Akıllı GTİP &amp; Kapsam Tespiti</h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Ürününüzün adını veya 8 haneli CN kodunu yazın. Sistem AB resmi matrisiyle eşleştirip SKDM kapsamında olup olmadığınızı anında gösterir.
                  </p>
                </div>
                <div className="mt-6 rounded-xl border border-sky-500/20 bg-sky-950/40 p-3 text-xs text-sky-200">
                  ⚡ <strong>Sürpriz Yok:</strong> Ürününüz kapsam dışıysa gereksiz bürokrasiye hiç başlamazsınız.
                </div>
              </div>

              {/* Adım 2 */}
              <div className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.07] hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 border border-amber-500/30">
                      02 · Rehberli Giriş
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">(i) İpuçlarıyla Sihirbaz Akışı</h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Tesis, enerji ve hammadde girişinde her alanın yanındaki <strong>(i)</strong> kutusu veriyi faturadan mı yoksa laboratuvardan mı alacağınızı açıklar.
                  </p>
                </div>
                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-950/40 p-3 text-xs text-amber-200">
                  💡 <strong>Güvence:</strong> Eksik veride mevzuat izinli resmi varsayılan değerler kullanılır.
                </div>
              </div>

              {/* Adım 3 */}
              <div className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition-all duration-300 hover:border-brand-400/40 hover:bg-white/[0.07] hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-black text-brand-300 border border-brand-500/30">
                      03 · Anında Teslim
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">6 Parçalı Mühürlü Dosya</h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Hesap izi, XML şablonu ve SHA-256 kriptografik mührü içeren çalışma paketinizi üretin. Yalnızca mühürlemek istediğinizde ödeme yaparsınız.
                  </p>
                </div>
                <div className="mt-6 rounded-xl border border-brand-500/20 bg-brand-950/40 p-3 text-xs text-brand-200">
                  🔒 <strong>Sıfır Risk:</strong> Mühür öncesi tüm adımları ücretsiz test edin.
                </div>
              </div>
            </div>

            {/* Alt Eylem ve Güven Çubuğu */}
            <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md sm:flex-row sm:px-8">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <ShieldCheck className="h-6 w-6 text-brand-400 shrink-0" />
                <span>Hazırlanan her dosya, AB Komisyonu kesin dönem şablonuna ({REG_REF["ir-2025-2547"]}) tam uyumludur.</span>
              </div>
              <Link
                href="/basla/"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-black text-brand-950 shadow-lg hover:bg-brand-400 hover:scale-[1.02] transition shrink-0"
              >
                <span>Hemen Deneyin — Ücretsiz</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* KARŞILAŞTIRMA */}
        <UcYolunuzVarKarsilastirma />

        {/* KURUCU NOTU — doğrulanabilir insan otoritesi */}
        <section className="bg-white py-16 sm:py-24 border-b border-line">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <figure className="space-y-6 rounded-2xl border-2 border-line bg-[#f8fbf9] p-8 shadow-sm">
              <blockquote className="space-y-4 text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
                <p>
                  "Bu siteyi kurarken aklımda tek bir şey vardı: Anadolu&apos;daki bir ihracatçının,
                  Almanya&apos;daki alıcısından gelen iki sayfalık CBAM e-postası karşısında yalnız
                  kalmaması. Mevzuatı aylarca okudum, yanlış anlaşılan her maddeyi sözlüğe işledim,
                  hesabı herkesin kontrol edebileceği kadar şeffaf yaptım."
                </p>
                <p>
                  "SKDMHesapla hukuki görüş veya akredite doğrulama görüşü vermez. Kendi verinizi
                  düzenlemeniz, hesaplama izini görmeniz ve denetime hazırlık çalışma dosyanızı
                  oluşturmanız için self-servis bir araçtır."
                </p>
              </blockquote>
              <figcaption className="border-t border-line pt-4">
                <Link href={`${PERSON_ENTITY.profileUrl}/`} className="font-black text-ink-900 underline decoration-brand-500 underline-offset-4">
                  {PERSON_ENTITY.name}
                </Link>
                <div className="text-sm font-semibold text-ink-600">{PERSON_ENTITY.jobTitle} — {ISLETMECI.urunAdi}</div>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* İKİ ÖNEMLİ KAPI: TEDARİKÇİ VERİSİ & MÜHÜR DOĞRULAMA */}
        <section className="bg-[#f7faf5] py-14 sm:py-20 border-b border-line">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-between rounded-3xl border-2 border-line bg-white p-7 shadow-sm hover:border-brand-500/50 transition-all">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800">Kademe B Sektörleri İçin</span>
                  <h3 className="text-xl font-bold text-ink-900 sm:text-[22px]">SKDM Kapsamında Değil misiniz?</h3>
                  <p className="text-base font-normal leading-relaxed text-ink-700">
                    Plastik, ambalaj, tekstil, batarya veya kimya sektöründeyseniz; AB&apos;li alıcınızın istediği CSRD Kapsam 3, PPWR veya Pil Tüzüğü tedarikçi veri çerçevesini ve şablonlarını inceleyin.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line">
                  <Link href="/tedarikci-verisi/" className="inline-flex items-center gap-2 font-bold text-brand-800 hover:text-brand-950 transition-colors">
                    <span>Tedarikçi Veri Merkezini İncele</span><ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-3xl border-2 border-line bg-white p-7 shadow-sm hover:border-brand-500/50 transition-all">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800">Alıcılar ve Denetçiler İçin</span>
                  <h3 className="text-xl font-bold text-ink-900 sm:text-[22px]">Mühür Doğrulama Konsolu</h3>
                  <p className="text-base font-normal leading-relaxed text-ink-700">
                    Elinizdeki denetime hazırlık paketinin orijinal olup olmadığını, SHA-256 master imzasını ve bayt seviyesinde dosya bütünlüğünü bağımsız olarak teyit edin.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line">
                  <Link href="/dogrula/" className="inline-flex items-center gap-2 font-bold text-brand-800 hover:text-brand-950 transition-colors">
                    <span>Mührü ve Paketi Doğrula</span><ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SSS */}
        <section className="bg-[#f3f7f4] py-16 sm:py-24 border-b border-line">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 space-y-8">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-[30px]">Merak edilenler</h2>
            <div className="space-y-4">
              {[
                {
                  s: "GTİP kodumu bilmiyorum, ne yapacağım?",
                  c: "Yukarıdaki arama kutusuna ürününüzü yazın (örneğin 'inşaat demiri'); sistem karşılık gelen 8 haneli CN kodunu önerir. Kesin teyidi her zaman gümrük müşaviriniz veya alıcınızla yapın.",
                },
                {
                  s: "Ne zaman ödeme yaparım?",
                  c: `Yalnızca dosyanız tamamlanıp mühürlü paketi indirmek istediğinizde: ${ISLETMECI.muhurFiyatiEtiket} (KDV dahil). Öncesindeki tüm adımlar ücretsizdir, kart bilgisi istenmez.`,
                },
                {
                  s: "Dosyamı alıcım veya doğrulayıcı kabul eder mi?",
                  c: `Dosyalar AB Komisyonu'nun kesin dönem uygulama tüzüğü (${REG_REF["ir-2025-2547"]}) yapısında hazırlanır ve resmi iletişim şablonu formatında çıktı içerir. Nihai kabul kararı her zaman alıcınıza ve akredite doğrulayıcıya aittir.`,
                },
                {
                  s: "Sektörüm SKDM kapsamında değil ama alıcım karbon verisi istiyor?",
                  c: "Kademe B tam da bunun için: 14 ek sektörde ISO 14067 mantığında tedarikçi veri dosyası hazırlarsınız. Bu çıktı bir SKDM raporu değildir; alıcınızın Kapsam 3 hesabına girdi sağlar.",
                },
                {
                  s: "Mühürledikten sonra bir şeyi düzeltmem gerekirse?",
                  c: ISLETMECI.yenidenMuhurlemePolitikasi,
                },
              ].map((item) => (
                <details key={item.s} className="group rounded-2xl border-2 border-line bg-white p-5 shadow-sm open:border-brand-800/40">
                  <summary className="cursor-pointer list-none text-base sm:text-lg font-black text-ink-900 flex items-center justify-between gap-3">
                    <span>{item.s}</span>
                    <span className="text-brand-800 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-700 font-medium">{item.c}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* KAPANIŞ CTA */}
        <section className="bg-brand-950 py-16 sm:py-20 text-center text-white">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 space-y-6">
            <h2 className="text-3xl font-black sm:text-4xl">Avrupa&apos;daki müşterilerinizi kaybetmeyin.</h2>
            <p className="text-base sm:text-lg text-brand-mist font-medium">Başlamak ücretsiz. Ödeme yalnızca mühür anında.</p>
            <div>
              <Link href="/basla/" className="inline-flex min-h-[58px] items-center gap-3 rounded-2xl bg-brand-500 px-9 text-lg font-black text-brand-950 shadow-xl transition-all hover:bg-brand-400 hover:scale-[1.02] sm:text-xl">
                <span>Hemen Başla — Ücretsiz</span><ArrowRight className="h-6 w-6" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

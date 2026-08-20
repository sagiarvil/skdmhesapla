import type { Metadata } from "next";
import { UcYolunuzVarKarsilastirma } from "@/components/UcYolunuzVarKarsilastirma";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { LegalFact } from "@/components/seo/LegalFact";
import { ISLETMECI } from "@/config/isletmeci";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "SKDMHesapla — AB SKDM Sertifika Maliyeti Hesaplayıcı",
  description:
    "Ürününüzü yazın veya sektörünüzü seçin, adımları tamamlayın; denetime hazırlık dosyanızı ve tahmini SKDM sertifika maliyetini üretin.",
});

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import GtipArama from "@/components/GtipArama";
import { MethodologyTrustBar } from "@/components/credential/MethodologyTrustBar";
import { PERSON_ENTITY } from "@/lib/skdm/constants";
import { REG_REF } from "@/lib/skdm/regulatoryRefs";

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

        <section className="border-b border-line bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 space-y-4">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              Kademe A: <LegalFact id="sectorFamilyCount" /> sektör ailesi
            </h2>
            <p className="text-sm font-medium text-ink-700">
              Kapsam kararı sektör adıyla değil, GTİP kodunuzla verilir. Karşılaştırma resmi
              Communication Template Parameters_CNCodes listesiyledir.
            </p>
            <ul className="flex flex-wrap gap-3 text-sm font-bold">
              {[
                ["demir-celik", "Demir-çelik"],
                ["aluminyum", "Alüminyum"],
                ["cimento", "Çimento"],
                ["gubre", "Gübre"],
                ["elektrik", "Elektrik"],
                ["hidrojen", "Hidrojen"],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    href={`/sektor/${slug}/`}
                    className="inline-flex rounded-full border-2 border-brand-800/20 bg-brand-100/50 px-4 py-2 text-brand-900 hover:bg-brand-500/20"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* NASIL İLERLER */}
        <section className="bg-white py-14 sm:py-20 border-b border-line">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 space-y-6">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-[30px]">Süreç sandığınızdan kısa</h2>
            <p className="text-base sm:text-[17px] leading-relaxed text-ink-700 font-normal">
              Ürününüzü yazarsınız, sistem 8 haneli CN kodunu önerir. Ardından sihirbaz sizi adım adım
              gezdirir: tesis bilgileriniz, enerji ve hammadde verileriniz, üretim miktarınız. Her alanın
              yanındaki <strong>(i)</strong> simgesi o veriyi nereden bulacağınızı ve kiminizden
              isteyeceğinizi açıklar. Sonunda dosyanızı mühürleyip indirirsiniz — mühürden önceki
              hiçbir adım için ödeme alınmaz.
            </p>
            <p className="text-base sm:text-[17px] leading-relaxed text-ink-700 font-normal">
              Eksik veri varsa yalnızca mevzuatın açıkça izin verdiği alanlarda varsayılan değer
              kullanılabilir. Kullanılan varsayılan değer ve gerekçesi çalışma dosyasında görünür;
              zorunlu kanıt veya kalite kapısı tamamlanmadan mühürleme yapılmaz.
            </p>
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

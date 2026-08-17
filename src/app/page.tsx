import type { Metadata } from "next";
import { pageMetadata } from "@/lib/skdm/seo";

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
import { LEGAL_ENTITY, PLATFORM_STATS } from "@/lib/skdm/constants";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";

export default function HomePage() {
  return (
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

      {/* NASIL İLERLER — numaralı kare yok, düz insan dili */}
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
            Eksik veriniz varsa sistem durmaz: mevzuatın izin verdiği varsayılan değerlerle devam
            eder, hangi alanın varsayılanla doldurulduğunu dosyanızda açıkça işaretler.
          </p>
        </div>
      </section>

      {/* KARŞILAŞTIRMA */}
      <section className="bg-[#f3f7f4] py-16 sm:py-24 border-b border-line">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-[30px]">Üç yolunuz var</h2>
            <p className="text-base sm:text-[18px] leading-relaxed text-ink-700 font-medium">
              SKDM yükümlülüğünü karşılamanın üç yaygın yolunu yan yana koyduk:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-line bg-white shadow-md">
            <table className="w-full min-w-[640px] text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b-2 border-line bg-brand-100/60">
                  <th className="p-4 font-black text-ink-900"></th>
                  <th className="p-4 font-black text-ink-900">Danışmanlık</th>
                  <th className="p-4 font-black text-ink-900">Abonelikli CBAM yazılımı</th>
                  <th className="p-4 font-black text-brand-900 bg-brand-500/15">SKDMHesapla</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-medium text-ink-700">
                <tr>
                  <td className="p-4 font-bold text-ink-900">Maliyet</td>
                  <td className="p-4">Proje bazlı yüksek bedel</td>
                  <td className="p-4">Yıllık abonelik modelleri</td>
                  <td className="p-4 font-bold text-brand-900 bg-brand-500/10">
                    {PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR")} ₺ tek sefer (KDV dahil)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-ink-900">Süre</td>
                  <td className="p-4">Haftalar süren yazışma</td>
                  <td className="p-4">Kurulum ve eğitim gerektirir</td>
                  <td className="p-4 bg-brand-500/10">
                    Belgeler hazırsa aynı oturumda ilerleyebilirsiniz
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-ink-900">Düzeltme</td>
                  <td className="p-4">Ek ücrete tabi olabilir</td>
                  <td className="p-4">Abonelik devam ettiği sürece</td>
                  <td className="p-4 bg-brand-500/10">Aynı dosyada yeniden mühürleme ücretsiz</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-ink-900">Dil</td>
                  <td className="p-4">Değişken</td>
                  <td className="p-4">Çoğunlukla İngilizce</td>
                  <td className="p-4 bg-brand-500/10">Tamamen Türkçe</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-ink-900">Veri gizliliği</td>
                  <td className="p-4">Üçüncü kişilerle paylaşılır</td>
                  <td className="p-4">Yurt dışı sunucular</td>
                  <td className="p-4 bg-brand-500/10">Verileriniz sizde kalır; alıcıya yalnızca özet gider</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-ink-600 font-medium max-w-3xl">
            Açık olmak gerekirse: Elektrik ark ocağı (EAF) ile hurda ağırlıklı üretim yapan çelik
            tesisleri için gerçek veriler genellikle varsayılan değerlerden daha avantajlıdır.
            Entegre (BF-BOF) tesislerde ise durum her zaman böyle olmayabilir — sistem iki senaryoyu
            da gösterir, seçimi size bırakır.
          </p>
        </div>
      </section>

      {/* KURUCU NOTU — insan sesi */}
      <section className="bg-white py-16 sm:py-24 border-b border-line">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <figure className="space-y-6 rounded-2xl border-2 border-line bg-[#f8fbf9] p-8 shadow-sm">
            <blockquote className="space-y-4 text-base sm:text-lg leading-relaxed text-ink-700 font-medium">
              <p>
                "Bu siteyi kurarken aklımda tek bir şey vardı: Anadolu'daki bir ihracatçının,
                Almanya'daki alıcısından gelen iki sayfalık CBAM e-postası karşısında yalnız
                kalmaması. Mevzuatı aylarca okudum, yanlış anlaşılan her maddeyi sözlüğe işledim,
                hesabı herkesin kontrol edebileceği kadar şeffaf yaptım."
              </p>
              <p>
                "SKDMHesapla size hukuki görüş vermez, danışmanlık satmaz. Size kendi dosyanızı
                kendinizin hazırlayabileceği, arkasında durabileceğiniz bir araç verir."
              </p>
            </blockquote>
            <figcaption className="border-t border-line pt-4">
              <div className="font-black text-ink-900">{LEGAL_ENTITY.companyName}</div>
              <div className="text-sm font-semibold text-ink-600">Kurucu &amp; Mühendislik Ekibi — {LEGAL_ENTITY.brandName}</div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* İKİ ÖNEMLİ KAPI: TEDARİKÇİ VERİSİ & MÜHÜR DOĞRULAMA */}
      <section className="bg-[#f7faf5] py-14 sm:py-20 border-b border-line">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Kapı 1: Tedarikçi Verisi */}
            <div className="flex flex-col justify-between rounded-3xl border-2 border-line bg-white p-7 shadow-sm hover:border-brand-500/50 transition-all">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                  Kademe B Sektörleri İçin
                </span>
                <h3 className="text-xl font-bold text-ink-900 sm:text-[22px]">
                  SKDM Kapsamında Değil misiniz?
                </h3>
                <p className="text-base font-normal leading-relaxed text-ink-700">
                  Plastik, ambalaj, tekstil, batarya veya kimya sektöründeyseniz; AB&apos;li alıcınızın istediği CSRD Kapsam 3, PPWR veya Pil Tüzüğü tedarikçi veri çerçevesini ve şablonlarını inceleyin.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  href="/tedarikci-verisi/"
                  className="inline-flex items-center gap-2 font-bold text-brand-800 hover:text-brand-950 transition-colors"
                >
                  <span>Tedarikçi Veri Merkezini İncele</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Kapı 2: Mühür Doğrulama */}
            <div className="flex flex-col justify-between rounded-3xl border-2 border-line bg-white p-7 shadow-sm hover:border-brand-500/50 transition-all">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                  Alıcılar ve Denetçiler İçin
                </span>
                <h3 className="text-xl font-bold text-ink-900 sm:text-[22px]">
                  Mühür Doğrulama Konsolu
                </h3>
                <p className="text-base font-normal leading-relaxed text-ink-700">
                  Elinizdeki denetime hazırlık paketinin orijinal olup olmadığını, SHA-256 master imzasını ve bayt seviyesinde dosya bütünlüğünü bağımsız olarak teyit edin.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  href="/dogrula/"
                  className="inline-flex items-center gap-2 font-bold text-brand-800 hover:text-brand-950 transition-colors"
                >
                  <span>Mührü ve Paketi Doğrula</span>
                  <ArrowRight className="h-4 w-4" />
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
                c: "Yalnızca dosyanız tamamlanıp mühürlü paketi indirmek istediğinizde: 9.900 ₺ (KDV dahil). Öncesindeki tüm adımlar ücretsizdir, kart bilgisi istenmez.",
              },
              {
                s: "Dosyamı alıcım veya doğrulayıcı kabul eder mi?",
                c: "Dosyalar AB Komisyonu'nun kesin dönem uygulama tüzüğü (IR 2025/2547) yapısında hazırlanır ve resmi iletişim şablonu formatında çıktı içerir. Nihai kabul kararı her zaman alıcınıza ve akredite doğrulayıcıya aittir.",
              },
              {
                s: "Sektörüm SKDM kapsamında değil ama alıcım karbon verisi istiyor?",
                c: "Kademe B tam da bunun için: 14 ek sektörde ISO 14067 mantığında tedarikçi veri dosyası hazırlarsınız. Bu çıktı bir SKDM raporu değildir; alıcınızın Kapsam 3 hesabına girdi sağlar.",
              },
              {
                s: "Mühürledikten sonra bir şeyi düzeltmem gerekirse?",
                c: "Aynı dosyada düzeltme ve yeniden mühürleme ücretsizdir. Yeni bir tesis veya yeni bir dönem ise yeni dosya ve yeni ödeme gerekir.",
              },
            ].map((item) => (
              <details
                key={item.s}
                className="group rounded-2xl border-2 border-line bg-white p-5 shadow-sm open:border-brand-800/40"
              >
                <summary className="cursor-pointer list-none text-base sm:text-lg font-black text-ink-900 flex items-center justify-between gap-3">
                  <span>{item.s}</span>
                  <span className="text-brand-800 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-700 font-medium">
                  {item.c}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* KAPANIŞ CTA */}
      <section className="bg-brand-950 py-16 sm:py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 space-y-6">
          <h2 className="text-3xl font-black sm:text-4xl">
            Avrupa&apos;daki müşterilerinizi kaybetmeyin.
          </h2>
          <p className="text-base sm:text-lg text-brand-mist font-medium">
            Başlamak ücretsiz. Ödeme yalnızca mühür anında.
          </p>
          <div>
            <Link
              href="/basla/"
              className="inline-flex min-h-[58px] items-center gap-3 rounded-2xl bg-brand-500 px-9 text-lg font-black text-brand-950 shadow-xl transition-all hover:bg-brand-400 hover:scale-[1.02] sm:text-xl"
            >
              <span>Hemen Başla — Ücretsiz</span>
              <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

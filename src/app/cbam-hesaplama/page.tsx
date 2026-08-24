import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, FileSpreadsheet, Search, ShieldCheck } from "lucide-react";
import { absoluteUrl, pageMetadata } from "@/lib/skdm/seo";
import { PLATFORM_STATS } from "@/lib/skdm/constants";

export const metadata: Metadata = pageMetadata({
  path: "/cbam-hesaplama/",
  title: "CBAM Hesaplama (SKDM) Türkiye — Rapor, GTİP ve Excel",
  description:
    "CBAM / SKDM hesaplama: GTİP kapsam kontrolü, gömülü emisyon, sertifika maliyeti ve Communication Template çıktısını Türk ihracatçı için tek akışta hazırlayın.",
});

const steps = [
  ["1", "GTİP / CN kapsam kontrolü", "Ürün adından tahminle değil, 8 haneli CN/GTİP koduyla kapsamı kontrol edin."],
  ["2", "Tesis ve üretim verisi", "Üretim süreçleri, enerji-yakıt kaynakları, üretim miktarı ve kapsam içi öncül maddeleri toplayın."],
  ["3", "Gömülü emisyon hesabı", "Kesin dönem metodolojisine göre hesap izini ve özgül gömülü emisyonu oluşturun."],
  ["4", "Communication Template", "AB alıcısının kullanacağı resmi Excel alanlarına veriyi aktarın ve kanıt referanslarını koruyun."],
  ["5", "Doğrulama hazırlığı", "İzleme planı, kanıt zinciri ve hesap izini akredite doğrulayıcının inceleyebileceği düzende tutun."],
] as const;

export default function CbamHesaplamaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl("/cbam-hesaplama/")}#page`,
    url: absoluteUrl("/cbam-hesaplama/"),
    name: "CBAM Hesaplama (SKDM) Türkiye — Rapor, GTİP ve Excel",
    description:
      "Türk ihracatçı için GTİP kapsam kontrolünden gömülü emisyon ve Communication Template çıktısına uzanan CBAM hesaplama çalışma akışı.",
    inLanguage: "tr-TR",
    about: ["CBAM hesaplama", "SKDM hesaplama", "CBAM raporu", "Communication Template", "gömülü emisyon"],
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
  };

  return (
    <main className="min-h-screen bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-line bg-gradient-to-b from-[#f3f8ef] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="inline-flex rounded-full border border-brand-800/20 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-brand-900">
            Türkiye · 2026 kesin dönem
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            CBAM / SKDM hesaplama ve rapor hazırlama aracı
          </h1>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-ink-700">
            AB müşteriniz “CBAM raporunu gönderin” dediğinde nereden başlayacağınızı tek akışta görün: GTİP kapsam kontrolü, tesis verisi, gömülü emisyon hesabı, sertifika maliyeti ve resmi Communication Template çıktısı.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/basla/" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-800 px-6 text-sm font-black text-white hover:bg-brand-700">
              Ücretsiz kapsam kontrolü <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sss/" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-brand-800/20 bg-white px-6 text-sm font-black text-brand-900 hover:bg-brand-50">
              CBAM sorularına bak
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
              <Search className="h-6 w-6 text-brand-700" />
              <h2 className="mt-3 text-lg font-black">Önce kapsam</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">Sektör adı değil CN/GTİP kodu karar verir. Yanlış ürünle hesaplamaya başlamayın.</p>
            </article>
            <article className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
              <Calculator className="h-6 w-6 text-brand-700" />
              <h2 className="mt-3 text-lg font-black">Sonra hesap</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">Hesap sonucu ile sertifika maliyeti aynı şey değildir. Emisyon hesabı ve maliyet katmanı ayrı izlenir.</p>
            </article>
            <article className="rounded-2xl border border-line bg-[#fbfdfb] p-5">
              <FileSpreadsheet className="h-6 w-6 text-brand-700" />
              <h2 className="mt-3 text-lg font-black">Son olarak teslim</h2>
              <p className="mt-2 text-sm leading-6 text-ink-700">Veriyi alıcının ve doğrulayıcının okuyabileceği Communication Template ve kanıt paketi düzenine taşıyın.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#f7faf6] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <h2 className="text-3xl font-black tracking-tight">CBAM hesaplama adımları</h2>
          <div className="mt-7 grid gap-4">
            {steps.map(([no, title, text]) => (
              <article key={no} className="grid gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-[56px_1fr] sm:items-start">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 font-black text-brand-900">{no}</span>
                <div>
                  <h3 className="text-lg font-black">{title}</h3>
                  <p className="mt-1 text-sm font-medium leading-6 text-ink-700">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 sm:px-6 lg:grid-cols-2">
          <article className="rounded-3xl border-2 border-brand-800/15 bg-white p-6 sm:p-7">
            <h2 className="text-2xl font-black">CBAM Excel dosyası ne demek?</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-ink-700">
              Kullanıcıların “CBAM Excel” diye aradığı ana dosya çoğu zaman Komisyonun Communication Template çalışma kitabıdır. Bu Excel hesap metodolojisinin kendisi değildir; tesis ve ürün verisinin AB alıcısına iletildiği resmi iletişim formatıdır.
            </p>
            <Link href="/rehber/" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-900">
              Resmi şablon ve veri katmanlarını incele <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-3xl border-2 border-brand-800/15 bg-[#071812] p-6 text-white sm:p-7">
            <ShieldCheck className="h-7 w-7 text-brand-400" />
            <h2 className="mt-3 text-2xl font-black">Doğrulama ile yazılım kontrolünü ayırın</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
              SKDMHesapla akredite doğrulayıcı değildir. Yazılım veri, kanıt ve hesap izini hazırlayıp kalite kontrollerini çalıştırır. Kesin dönem doğrulama görüşü CBAM kapsamında akredite bağımsız doğrulayıcı tarafından verilir.
            </p>
            <Link href="/cbam-dogrulama/" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-300">
              2026–2027 doğrulama akışını gör <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>

      <section className="border-t border-line bg-[#f7faf6] py-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black">SKDMHesapla çıktısı</h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-ink-700">
              Paket yapısı tek doğruluk kaynağından üretilir ve güncel manifestte {PLATFORM_STATS.fileCount} dosya bulunur. İçerik; hesap izi, Communication Template, kanıt kayıtları ve alıcı/doğrulayıcı için ayrıştırılmış çalışma dosyalarını içerir. Nihai kabul kararı alıcıya ve akredite doğrulayıcıya aittir.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/fiyatlandirma/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-800/20 px-5 text-sm font-black text-brand-900 hover:bg-brand-50">Paket ve fiyatı gör</Link>
              <Link href="/basla/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-black text-white hover:bg-brand-700">Ücretsiz başla <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

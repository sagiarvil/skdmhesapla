import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { absoluteUrl, pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/cbam-50-ton-muafiyeti/",
  title: "CBAM 50 Ton Muafiyeti 2026 — Kim Muaf, Nasıl Hesaplanır?",
  description:
    "CBAM / SKDM 50 ton de minimis muafiyeti Türk ihracatçı için ne anlama gelir? Eşik tek sevkiyata değil AB ithalatçısının yıllık toplamına göre değerlendirilir.",
});

export default function Cbam50TonPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl("/cbam-50-ton-muafiyeti/")}#page`,
    url: absoluteUrl("/cbam-50-ton-muafiyeti/"),
    name: "CBAM 50 Ton Muafiyeti 2026",
    inLanguage: "tr-TR",
    about: ["CBAM 50 ton", "SKDM muafiyet", "de minimis", "Türkiye ihracatçı"],
  };

  return (
    <main className="min-h-screen bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-line bg-gradient-to-b from-[#f7f3e8] to-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <Scale className="h-8 w-8 text-brand-800" />
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">CBAM 50 ton muafiyeti: en çok karıştırılan nokta</h1>
          <p className="mt-5 text-lg font-medium leading-8 text-ink-700">
            50 ton eşiği tek bir Türk ihracatçının sevkiyatına göre değil, AB tarafındaki ithalatçının ilgili takvim yılındaki toplam CBAM ithalatına göre değerlendirilir. “Ben 40 ton gönderiyorum, otomatik muafım” sonucu bu nedenle güvenli değildir.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-6 px-5 sm:px-6">
          <article className="rounded-3xl border-2 border-brand-800/15 bg-[#f7faf6] p-6 sm:p-8">
            <h2 className="text-2xl font-black">Doğru kontrol sırası</h2>
            <ol className="mt-5 space-y-3 text-sm font-medium leading-7 text-ink-700">
              <li><b>1.</b> Ürününüzün CN/GTİP koduyla CBAM kapsamında olup olmadığını kontrol edin.</li>
              <li><b>2.</b> AB alıcınızın aynı yıl içindeki toplam CBAM ithalatının 50 ton eşiğini aşıp aşmadığını teyit edin.</li>
              <li><b>3.</b> Alıcı “muaf” diyorsa bu teyidi çalışma dosyanızda tarih ve dönem bilgisiyle saklayın.</li>
              <li><b>4.</b> Alıcının toplamı bilinmiyorsa kapsam dışı varsaymayın; veri hazırlığını durdurmadan eksik teyit olarak işaretleyin.</li>
            </ol>
          </article>

          <article className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black">Örnek</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-ink-700">
              Siz aynı AB müşterisine yılda 18 ton ürün gönderiyor olabilirsiniz. Ancak aynı müşteri başka tedarikçilerden 40 ton daha CBAM malı ithal ediyorsa toplam 58 tona ulaşabilir. Bu yüzden muafiyet kararının ekseni sizin tek sevkiyatınız değil, AB ithalatçısının yıllık toplamıdır.
            </p>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
            <h2 className="text-2xl font-black">Türk ihracatçı için pratik sonuç</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-ink-700">
              Satış ekibi “50 ton altındayız” dediğinde dosyayı kapatmayın. Önce alıcının yıllık toplam ithalat durumunu teyit edin. SKDMHesapla kapsam akışında bu bilgi ayrı tutulur; bilinmiyorsa sonuç kesin muafiyet olarak işaretlenmez.
            </p>
          </article>

          <div className="flex flex-wrap gap-3">
            <Link href="/basla/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-black text-white">GTİP kapsamını kontrol et <ArrowRight className="h-4 w-4" /></Link>
            <a href="https://ticaret.gov.tr/dis-iliskiler/yesil-mutabakat/ab-sinirda-karbon-duzenleme-mekanizmasi/ab-skdm-hakkinda-genel-bilgiler-ve-uygulama-mevzuati" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-brand-800/20 px-5 text-sm font-black text-brand-900">T.C. Ticaret Bakanlığı kaynağı</a>
          </div>
        </div>
      </section>
    </main>
  );
}

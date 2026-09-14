import type { Metadata } from "next";
import Link from "next/link";
import { GeriLink } from "@/components/nav/GeriLink";
import { pageMetadata } from "@/lib/skdm/seo";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";

export const metadata: Metadata = pageMetadata({
  path: "/rehber/gtip-bulma/",
  title: "GTİP / CN kodunu nerede bulursunuz",
  description:
    "Kapsam kararı için en az 4 haneli GTİP. Gümrük beyannamesi kutu 33, fatura ve gümrük müşaviri.",
});

export default function GtipBulmaPage() {
  return (
    <>
      <RegistryJsonLd route="/rehber/gtip-bulma/" />
      <article className="pasaport-zemin-yogun min-h-screen bg-[#f4f7f6] py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-5 sm:px-6">
          <GeriLink />
          <header className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Rehber</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              GTİP / CN kodunu nerede bulursunuz
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-700">
              Kapsam kararı ürün adından çıkmaz. En az 4 haneli CN/GTİP gerekir. Bu sayfa gümrük
              kararı değildir.
            </p>
          </header>
          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 text-sm font-medium text-ink-700">
            <h2 className="text-lg font-black text-ink-900">Beyanname kutu 33</h2>
            <p>
              İhracat gümrük beyannamesinin 33 numaralı kutusunda 8 haneli GTİP yer alır. SKDM
              karşılaştırması bu kodun haneleriyle yapılır.
            </p>
          </section>
          <section className="space-y-3 rounded-3xl border-2 border-line bg-white p-6 text-sm font-medium text-ink-700">
            <h2 className="text-lg font-black text-ink-900">Fatura ve müşavir</h2>
            <p>
              Ticari faturadaki kalem açıklaması ile beyanname kodu uyuşmuyorsa kodu gümrük
              müşavirinizle netleştirin. SKDMHesapla akredite görüş veya gümrük onayı vermez.
            </p>
          </section>
          <section className="space-y-3 rounded-3xl border-2 border-amber-300 bg-amber-50/70 p-6 text-sm font-medium text-ink-800">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                Yasama Radarı (Pending Legislation)
              </span>
              <span className="text-xs font-semibold text-amber-800">10 Eylül 2026 · EPRS</span>
            </div>
            <h2 className="text-base font-black text-ink-900">
              Downstream Kapsam Genişlemesi Uyarısı (180 vs 457 Ürün)
            </h2>
            <p>
              Avrupa Parlamentosu Araştırma Servisi (EPRS) brifingine göre, Komisyonun 180 ürünlük teklifine karşı ENVI Komitesi kapsamı <strong>457 downstream ürüne</strong> çıkarmayı talep etmiştir.
            </p>
            <p className="text-xs text-ink-700">
              Bu bir taslak/sinyaldir; kesinleşmiş mevzuat değildir. skdmhesapla.com üzerindeki <strong>569 resmi CN kodu</strong> kapsam motoru bağlayıcı AB Resmî Gazetesi tüzüğü yayımlanana kadar korunur. Demir-çelik ve alüminyum işlenmiş ürün ihracatçılarının girdi verilerini şimdiden kayıt altına alması tavsiye edilir.
            </p>
          </section>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/basla/" className="text-brand-800 underline underline-offset-2">
              Kapsam kontrolüne dön
            </Link>
            <Link href="/karbon-raporu/" className="text-brand-800 underline underline-offset-2">
              Karbon raporunu hazırla
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

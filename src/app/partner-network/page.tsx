import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Check, FileCheck2, Network, ShieldCheck, UsersRound } from "lucide-react";
import { CommercialEventLink, CommercialLeadForm, CommercialViewEvent } from "@/components/commercial/CommercialLeadForm";
import { RegistryJsonLd } from "@/components/seo/RegistryJsonLd";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/partner-network/",
  title: "Gümrük Müşavirleri İçin CBAM Partner Network | SKDMHesapla",
  description: "Müşterinizi devretmeden kendi CBAM/SKDM çalışmalarınızı üretin. Gümrük müşavirleri, dış ticaret ve karbon danışmanları için SKDMHesapla Partner Network.",
});

const personas = [
  {
    title: "Gümrük Müşavirleri",
    problem: "Müşterinin CN/GTİP ve AB ihracat sürecini biliyorsunuz; gömülü emisyon verisi farklı bir teknik üretim katmanı yaratıyor.",
    value: "Mevcut müşterinize yeni SKDM/CBAM hizmeti ekleyin.",
  },
  {
    title: "Dış Ticaret Danışmanları",
    problem: "Üretici, ithalatçı ve emisyon verisi arasındaki bilgi akışı ayrı bir operasyon yüküne dönüşebiliyor.",
    value: "CBAM veri toplama ve çalışma hazırlığını standardize edin.",
  },
  {
    title: "Karbon / CBAM Danışmanları",
    problem: "Her müşteri için yeniden Excel, kontrol listesi ve evidence yapısı kurmak ölçeklenebilir değil.",
    value: "Uzmanlığınızı koruyun; tekrar eden üretim katmanını sistemleştirin.",
  },
];

const comparison = [
  ["Dağınık müşteri veri talepleri", "Standart veri akışı"],
  ["Farklı Excel dosyaları", "Tek çalışma mantığı"],
  ["Tekrarlanan hesaplama operasyonu", "Mevcut hesap motoru"],
  ["Evidence dosyalarının manuel takibi", "Yapılandırılmış evidence workflow"],
  ["Kişiye bağımlı kontrol", "Sistematik validation / readiness"],
  ["Her müşteri için yeniden kurulum", "Tekrarlanabilir üretim modeli"],
];

const steps = [
  ["01", "Partner müşterisini açar", "Müşteri ilişkisini ve iletişimi partner yönetir."],
  ["02", "Tesis / ürün / üretim verisi toplanır", "Mevcut SKDMHesapla veri yapısı kullanılır."],
  ["03", "Hesaplama + validation + readiness", "Mevcut hesap motoru ve kalite kontrolleri çalışır."],
  ["04", "Evidence / çıktı hazırlanır", "Kanıt referansları ve çalışma çıktısı düzenlenir."],
  ["05", "Partner çalışmayı müşterisine sunar", "Teknik üretim altyapısı ile müşteri ilişkisi ayrıştırılır."],
];

export default function PartnerNetworkPage() {
  return (
    <article className="min-h-screen overflow-x-hidden bg-[#f7f9f3] text-ink-900">
      <RegistryJsonLd route="/partner-network/" />

      <section className="relative overflow-hidden border-b border-brand-950/20 bg-brand-950 text-white" style={{ backgroundImage: "linear-gradient(90deg,rgba(21,38,10,.98),rgba(33,49,16,.94)),url('/desen/guilloche-mesh-koyu.svg')" }}>
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-7 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-300">SKDMHESAPLA PARTNER NETWORK</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
                Müşterinizi bize vermeyin.<br />
                <span className="text-brand-300">SKDM dosyasını kendi müşteriniz adına siz üretin.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-white/85 sm:text-lg sm:leading-8">
                Gümrük müşavirleri, dış ticaret danışmanları ve karbon danışmanları için CBAM/SKDM veri, hesaplama, kontrol ve çalışma hazırlık altyapısı. Müşteri ilişkisini siz yönetin; teknik üretim sürecini standartlaştırın.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CommercialEventLink href="#partner-application" event="partner_primary_cta_click" className="inline-flex min-h-12 items-center rounded-xl bg-brand-400 px-6 text-sm font-black text-brand-950 shadow-lg transition hover:bg-brand-300">Partner Başvurusu</CommercialEventLink>
                <a href="#partner-model" className="inline-flex min-h-12 items-center rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-black text-white hover:bg-white/10">Partner Modelini İncele</a>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm sm:p-8">
              <Network className="h-9 w-9 text-brand-300" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-brand-300">ÜRETİM ALTYAPISI</p>
              <h2 className="mt-2 text-2xl font-black">Müşteri sizde. Teknik çalışma standardı tek yerde.</h2>
              <div className="mt-6 space-y-3 text-sm font-semibold text-white/85">
                {['GTİP / CN ve kapsam girişi','Tesis, ürün ve üretim verisi','Gömülü emisyon hesap izi','Evidence ve readiness hazırlığı'].map((item) => <div key={item} className="flex items-center gap-3"><Check className="h-4 w-4 shrink-0 text-brand-300" />{item}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-900/10 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-7 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">MÜŞTERİ İLİŞKİSİ</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">Müşteriniz sizin müşterinizdir.</h2>
            </div>
            <div className="rounded-2xl border border-brand-900/15 bg-brand-50 p-6 text-base font-semibold leading-7 text-ink-700">
              Müşteri ilişkisini siz yönetirsiniz. SKDMHesapla teknik üretim altyapısı olarak çalışır. Bu sayfa, SKDMHesapla&apos;nın akredite doğrulayıcı, yetkili AB makamı veya authorised CBAM declarant rolünü üstlendiği anlamına gelmez.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-7 lg:px-8" id="partner-model">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">KİM İÇİN?</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">Mevcut müşteri ilişkinizin üzerine tekrarlanabilir bir CBAM üretim modeli kurun.</h2>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {personas.map((item, index) => {
            const Icon = [Building2, UsersRound, FileCheck2][index];
            return <article key={item.title} className="rounded-2xl border border-brand-900/15 bg-white p-6 shadow-sm"><Icon className="h-7 w-7 text-brand-800" /><h3 className="mt-5 text-xl font-black text-brand-950">{item.title}</h3><p className="mt-3 text-sm font-medium leading-6 text-ink-600">{item.problem}</p><p className="mt-5 border-t border-brand-900/10 pt-4 text-sm font-black text-brand-900">{item.value}</p></article>;
          })}
        </div>
      </section>

      <section className="relative border-y border-brand-900/10 bg-white py-16">
        <CommercialViewEvent event="partner_comparison_view" />
        <div className="mx-auto max-w-6xl px-5 sm:px-7 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">MANUELDEN STANDARDA</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">Aynı işi her müşteri için yeniden kurmayın.</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-900/15">
            <div className="grid grid-cols-2 bg-brand-950 px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-white sm:px-6"><span>MANUEL OPERASYON</span><span>SKDMHESAPLA PARTNER NETWORK</span></div>
            {comparison.map(([left, right]) => <div key={left} className="grid grid-cols-2 border-t border-brand-900/10 bg-white px-4 py-4 text-sm leading-6 sm:px-6"><span className="pr-4 font-semibold text-ink-600">{left}</span><span className="flex gap-2 font-black text-brand-900"><Check className="mt-1 h-4 w-4 shrink-0" />{right}</span></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-7 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">NASIL ÇALIŞIR?</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-950 sm:text-4xl">Partner ve platform rolü beş adımda ayrılır.</h2>
        <div className="mt-9 grid gap-4 lg:grid-cols-5">
          {steps.map(([no, title, desc]) => <div key={no} className="rounded-2xl border border-brand-900/15 bg-white p-5"><span className="font-mono text-xs font-black text-brand-700">{no}</span><h3 className="mt-3 text-base font-black text-brand-950">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-600">{desc}</p></div>)}
        </div>
      </section>

      <section className="bg-brand-950 py-14 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-7 lg:grid-cols-2 lg:px-8">
          <div>
            <ShieldCheck className="h-8 w-8 text-brand-300" />
            <h2 className="mt-4 text-3xl font-black">Sınırlar açık: altyapı üretir, resmî rol iddiası üretmez.</h2>
          </div>
          <ul className="space-y-3 text-sm font-semibold leading-6 text-white/85">
            <li>Akredite CBAM doğrulayıcısı değildir.</li><li>AB makamı değildir.</li><li>Authorised CBAM declarant statüsü sağlamaz.</li><li>Resmî kabul veya verifier acceptance garantisi vermez.</li>
          </ul>
        </div>
      </section>

      <section id="partner-application" className="mx-auto max-w-5xl px-5 py-16 sm:px-7 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-xs font-black uppercase tracking-[0.15em] text-brand-800">PARTNER BAŞVURUSU</p><h2 className="mt-3 text-3xl font-black text-brand-950">Müşteri ilişkinizi koruyarak çalışma modelini konuşalım.</h2><p className="mt-4 text-sm font-medium leading-6 text-ink-600">Form üçüncü taraf bir servise veri göndermez. Başvurunuzu kurumsal e-posta akışında hazırlar.</p></div>
          <div className="rounded-3xl border border-brand-900/15 bg-white p-6 shadow-sm sm:p-8"><CommercialLeadForm variant="partner" locale="tr" /></div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-brand-900/10 pt-7 text-sm font-bold text-ink-600"><span>AB tarafındaki tedarikçi veri toplama ihtiyacı için:</span><Link href="/eu-importers/" className="font-black text-brand-900 hover:underline">EU Buyer Supplier Collection →</Link></div>
      </section>
    </article>
  );
}

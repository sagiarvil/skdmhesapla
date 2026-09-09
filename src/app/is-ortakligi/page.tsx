import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Factory,
  FileCheck2,
  Handshake,
  Network,
  Ship,
  ShieldCheck,
  Users,
} from "lucide-react";
import { pageMetadata, SITE_ORIGIN } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/is-ortakligi/",
  title: "SKDM / CBAM ve Denizcilik Karbon İş Ortaklığı | SKDMHesapla",
  description:
    "Gümrük müşavirleri, dış ticaret ve sürdürülebilirlik hizmet firmaları için SKDM/CBAM, EU MRV, EU ETS ve FuelEU Maritime teknik hazırlık partnerliği.",
});

const trustItems = [
  { icon: Factory, title: "SKDM / CBAM", text: "Sanayi karbon hazırlığı" },
  { icon: Network, title: "EU ETS", text: "Karbon maliyet ve veri disiplini" },
  { icon: Ship, title: "FuelEU Maritime", text: "Denizcilik çalışma hattı" },
  { icon: FileCheck2, title: "THETIS-MRV", text: "Raporlama hazırlık akışı" },
] as const;

const valueItems = [
  {
    icon: BriefcaseBusiness,
    title: "Yeni gelir kanalı",
    text: "Mevcut müşteri portföyünüze karbon uyum hizmeti ekleyin; ayrı bir teknik çekirdek kurmak zorunda kalmayın.",
  },
  {
    icon: Network,
    title: "Hizmet alanını genişletin",
    text: "SKDM/CBAM ve denizcilik karbon çalışmalarını, doğru kapsam ayrımıyla aynı ticari ilişki içinde sunun.",
  },
  {
    icon: ShieldCheck,
    title: "Standart operasyon",
    text: "Veri talebi, hesaplama izi, kanıt düzeni ve teslim sınırları baştan tanımlı bir üretim akışına otursun.",
  },
  {
    icon: Users,
    title: "Müşteri ilişkisi sizde kalsın",
    text: "Uygun modelde ticari ilişki ve müşteri yönetimi sizde kalırken teknik hazırlık katmanını birlikte yürütelim.",
  },
] as const;

const partnerModels = [
  {
    no: "01",
    icon: Handshake,
    title: "Yönlendir ve Kazan",
    lead: "En hafif operasyon modeli.",
    text: "Müşterinizi bize yönlendirin. Proje gerçekleşirse ticari paylaşım; kapsam, iş hacmi ve sorumluluk dağılımına göre yazılı partner anlaşmasında belirlenir.",
    bullets: ["Ek teknik ekip gerekmez", "Hızlı başlangıç", "Yazılı gelir paylaşım modeli"],
    featured: false,
  },
  {
    no: "02",
    icon: BriefcaseBusiness,
    title: "Kendi Müşterine Kendi Fiyatınla Sat",
    lead: "Müşteri ilişkisi ve ticari paket sizde.",
    text: "Kendi hizmet paketinizi ve satış fiyatınızı siz belirlersiniz. SKDMHesapla'nın teknik teslim kapsamı ve partner bedeli ayrıca netleştirilir.",
    bullets: ["Fiyatlandırma özgürlüğü", "Müşteri ilişkisi sizde", "Teknik kapsam ayrı tanımlanır"],
    featured: true,
  },
  {
    no: "03",
    icon: Users,
    title: "Birlikte Proje Yürütelim",
    lead: "Daha büyük ve çok paydaşlı işler için.",
    text: "Kurumsal veya çoklu çalışma ihtiyaçlarında teklif, veri akışı, teknik üretim ve teslim sorumluluklarını proje bazında birlikte kuralım.",
    bullets: ["Ortak teklif yapısı", "Rol ve sorumluluk matrisi", "Kurumsal teslim disiplini"],
    featured: false,
  },
] as const;

const audiences = [
  { icon: Building2, title: "Gümrük müşavirleri" },
  { icon: BriefcaseBusiness, title: "Dış ticaret hizmet firmaları" },
  { icon: Users, title: "Sürdürülebilirlik hizmet firmaları" },
  { icon: Ship, title: "Lojistik ve denizcilik hizmet sağlayıcıları" },
] as const;

const workflow = [
  ["1", "Müşteri gelir", "Siz yönlendirirsiniz veya birlikte ele alırız."],
  ["2", "Kapsam belirlenir", "Sanayi CBAM mı, denizcilik hattı mı ayrıştırılır."],
  ["3", "Ticari model seçilir", "Yönlendirme, kendi satışınız veya ortak proje modeli netleşir."],
  ["4", "Teknik operasyon hazırlanır", "Veri, hesaplama izi ve kanıt çalışma akışı yürütülür."],
  ["5", "Teslim yapılır", "Kararlaştırılmış rol ve marka modeliyle çıktı teslim edilir."],
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}/is-ortakligi/#webpage`,
      url: `${SITE_ORIGIN}/is-ortakligi/`,
      name: "SKDM / CBAM ve Denizcilik Karbon İş Ortaklığı",
      description:
        "Gümrük müşavirleri, dış ticaret ve sürdürülebilirlik hizmet firmaları için teknik karbon hazırlık partnerliği.",
      inLanguage: "tr-TR",
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      about: ["CBAM", "EU ETS Maritime", "EU MRV", "FuelEU Maritime"],
    },
    {
      "@type": "Service",
      "@id": `${SITE_ORIGIN}/is-ortakligi/#service`,
      name: "SKDMHesapla teknik partner teslim modeli",
      serviceType: "CBAM ve denizcilik karbon veri, hesaplama ve doğrulamaya hazırlık altyapısı",
      provider: { "@id": `${SITE_ORIGIN}/#organization` },
      areaServed: { "@type": "Country", name: "Türkiye" },
      url: `${SITE_ORIGIN}/is-ortakligi/`,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_ORIGIN}/is-ortakligi/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SKDMHesapla", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "İş Ortaklığı", item: `${SITE_ORIGIN}/is-ortakligi/` },
      ],
    },
  ],
};

export default function IsOrtakligiPage() {
  return (
    <main className="bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-y-0 right-0 w-full opacity-30 lg:w-[58%]" aria-hidden="true">
          <img src="/desen/dunya-nokta-harita-koyu.webp" alt="" className="h-full w-full object-cover" width="1400" height="700" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
        </div>
        <div className="absolute inset-0 bg-[url('/desen/guilloche-mesh-koyu.svg')] bg-cover opacity-[0.025]" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-200">
              <span className="h-px w-10 bg-amber-200" />
              Çözüm ortaklığı · satış ortaklığı · teknik üretim
            </div>
            <h1 className="mt-7 font-serif text-[42px] font-semibold leading-[1.03] tracking-[-0.035em] sm:text-[62px] lg:text-[70px]">
              Müşterinize karbon uyum hizmeti satın.
              <span className="mt-2 block text-amber-200">Operasyonu birlikte kuralım.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
              SKDMHesapla'nın teknik altyapısını arkanıza alın. İster müşterinizi yönlendirin, ister kendi hizmet paketiniz içinde satın, ister daha büyük projeleri birlikte yürütelim.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/iletisim/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-black text-slate-950 transition hover:bg-emerald-400">
                Ortaklık görüşmesi talep et <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="#modeller" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-500 px-6 text-sm font-black text-white transition hover:border-slate-300 hover:bg-white/5">
                İş birliği modellerini gör
              </a>
            </div>
          </div>

          <aside className="relative lg:pl-10" aria-label="Partner çalışma modeli">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-sm sm:p-8">
              <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Partner operating desk</p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">Müşteri sizde kalsın. Teknik üretim standartlaşsın.</h2>
                </div>
                <Handshake className="h-8 w-8 shrink-0 text-emerald-300" aria-hidden="true" />
              </div>
              <div className="mt-6 grid gap-4">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <span className="text-xs font-black text-slate-400">01</span><div><p className="font-black">Müşteri ilişkisi</p><p className="mt-1 text-xs text-slate-400">Sizde veya ortak modelde</p></div><CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-4">
                  <span className="text-xs font-black text-emerald-200">02</span><div><p className="font-black">Teknik hazırlık</p><p className="mt-1 text-xs text-slate-300">SKDMHesapla çalışma motoru</p></div><Network className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <span className="text-xs font-black text-slate-400">03</span><div><p className="font-black">Ticari model</p><p className="mt-1 text-xs text-slate-400">Yazılı ve proje bazında net</p></div><BriefcaseBusiness className="h-5 w-5 text-amber-200" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-6 border-l border-amber-200/50 pl-4 text-sm font-medium leading-7 text-slate-300">Teknik hazırlık desteği; akredite doğrulayıcı, yetkili beyan sahibi veya resmî makam rolü oluşturmaz.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-6 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className={`flex min-h-28 items-center gap-4 py-5 ${index ? "border-l border-white/10 pl-5 sm:pl-7" : "pr-5"}`}>
              <Icon className="h-6 w-6 shrink-0 text-emerald-300" aria-hidden="true" />
              <div><p className="font-black">{title}</p><p className="mt-1 text-xs font-medium leading-5 text-slate-400">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800">Neden iş ortaklığı?</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-5xl">Mevcut müşteri tabanınız, yeni bir hizmet hattına dönüşebilir.</h2>
            </div>
            <p className="max-w-2xl text-base font-medium leading-8 text-ink-700">Karbon uyum işi çoğu zaman yeni müşteri aramaktan değil, zaten hizmet verdiğiniz müşterinin yeni ihtiyacından doğar. Teknik üretim kapasitesini birlikte kurarak bu talebi geri çevirmek yerine kontrollü biçimde yeni gelire dönüştürebilirsiniz.</p>
          </div>

          <div className="mt-14 grid gap-0 border-y border-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {valueItems.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className={`py-8 md:px-7 ${index ? "border-t border-slate-200 md:border-l md:border-t-0" : "md:pr-7"}`}>
                <Icon className="h-7 w-7 text-emerald-800" aria-hidden="true" />
                <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-ink-700">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="modeller" className="bg-slate-100 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800">İş birliği modelleri</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">Size uygun ticari yapıyı seçin.</h2>
            </div>
            <p className="max-w-md text-sm font-medium leading-7 text-ink-700">Tek model dayatmıyoruz. Müşteri ilişkisi, marka görünürlüğü, teknik sorumluluk ve hacim hangi yapının doğru olduğunu belirler.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {partnerModels.map(({ no, icon: Icon, title, lead, text, bullets, featured }) => (
              <article key={title} className={`relative rounded-[28px] border p-7 sm:p-8 ${featured ? "border-emerald-700 bg-slate-950 text-white shadow-2xl" : "border-slate-200 bg-white shadow-sm"}`}>
                {featured && <span className="absolute right-6 top-6 rounded-full bg-amber-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-950">En esnek model</span>}
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-black ${featured ? "text-emerald-300" : "text-emerald-800"}`}>{no}</span>
                  <Icon className={`h-7 w-7 ${featured ? "text-emerald-300" : "text-emerald-800"}`} aria-hidden="true" />
                </div>
                <h3 className="mt-7 font-serif text-3xl font-semibold leading-tight">{title}</h3>
                <p className={`mt-3 text-sm font-black ${featured ? "text-amber-200" : "text-emerald-800"}`}>{lead}</p>
                <p className={`mt-4 text-sm font-medium leading-7 ${featured ? "text-slate-300" : "text-ink-700"}`}>{text}</p>
                <ul className={`mt-7 space-y-3 border-t pt-6 text-sm font-semibold ${featured ? "border-white/10 text-slate-200" : "border-slate-200 text-ink-900"}`}>
                  {bullets.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-emerald-300" : "text-emerald-700"}`} aria-hidden="true" />{item}</li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 rounded-[24px] border border-slate-300 bg-white p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Ticari sınır</p><h3 className="mt-3 font-serif text-2xl font-semibold">Kendi fiyatınız mümkündür; rol ve kapsam yine açık kalır.</h3></div>
            <p className="text-sm font-medium leading-7 text-ink-700">Partner kendi hizmet paketini ve ticari değerini fiyatlayabilir. SKDMHesapla'nın teknik teslim kapsamı, partner bedeli, marka kullanımı ve sorumluluk dağılımı ise yazılı anlaşmada açıkça belirlenir. Resmî yetki veya doğrulayıcı statüsü ima edilmez.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800">Kimler için?</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight">Bu model, müşterisine zaten yakın olan profesyoneller için.</h2>
          </div>
          <div className="grid grid-cols-2 gap-0 border-y border-slate-200 lg:grid-cols-4">
            {audiences.map(({ icon: Icon, title }, index) => (
              <div key={title} className={`min-h-36 py-6 ${index ? "border-l border-slate-200 pl-5 lg:pl-6" : "pr-5"}`}>
                <Icon className="h-6 w-6 text-emerald-800" aria-hidden="true" />
                <p className="mt-5 text-sm font-black leading-6 text-ink-900">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800">Hizmet kapsamı</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">Karada ve denizde iki ayrı teknik hat.</h2>
            </div>
            <p className="max-w-2xl text-base font-medium leading-8 text-ink-700">Aynı ticari ilişki içinde sunulabilirler; fakat SKDM/CBAM ile denizcilik karbon rejimleri aynı dosya veya aynı sorumluluk zinciri değildir.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="relative h-48 overflow-hidden bg-brand-900">
                <img src="/desen/hero-illus-bayrak-A-temiz.png" alt="Sanayi ve ihracat çalışma alanı" className="h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-[1.02]" width="1536" height="976" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-950/20" />
                <div className="absolute bottom-6 left-7"><Factory className="h-7 w-7 text-emerald-300" aria-hidden="true" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">Karasal kapsam</p></div>
              </div>
              <div className="p-7 sm:p-8">
                <h3 className="font-serif text-3xl font-semibold">SKDM / CBAM teknik hazırlık</h3>
                <ul className="mt-6 grid gap-3 text-sm font-medium leading-6 text-ink-700 sm:grid-cols-2">
                  {["CN / GTİP kapsam kontrolü","Tesis ve üretim veri haritası","Enerji ve yakıt verileri","Precursor veri koordinasyonu","Gömülü emisyon hesaplama izi","Communication Template hazırlığı"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />{item}</li>)}
                </ul>
                <Link href="/platform-kabiliyetleri/" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-emerald-800 hover:text-emerald-950">Sanayi kabiliyetlerini incele <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </article>

            <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 text-white shadow-sm">
              <div className="relative h-48 overflow-hidden">
                <img src="/desen/dunya-nokta-harita-koyu.webp" alt="Uluslararası denizcilik ağı" className="h-full w-full object-cover opacity-65 transition duration-500 group-hover:scale-[1.02]" width="1400" height="700" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-950/20" />
                <div className="absolute bottom-6 left-7"><Ship className="h-7 w-7 text-amber-200" aria-hidden="true" /><p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Denizcilik kapsamı</p></div>
              </div>
              <div className="p-7 sm:p-8">
                <h3 className="font-serif text-3xl font-semibold">EU MRV · EU ETS · FuelEU · THETIS-MRV</h3>
                <ul className="mt-6 grid gap-3 text-sm font-medium leading-6 text-slate-300 sm:grid-cols-2">
                  {["Gemi ve şirket kanıtları","Sefer ve liman kayıtları","Yakıt ve emisyon veri yapısı","Yıllık mutabakat kontrolleri","FuelEU hazırlık katmanı","Verifier-ready çalışma dosyası"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />{item}</li>)}
                </ul>
                <Link href="/denizcilik/" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-emerald-300 hover:text-emerald-200">Denizcilik kabiliyetlerini incele <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-[url('/desen/dunya-nokta-harita-koyu.webp')] bg-cover bg-center opacity-10" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[.62fr_1.38fr] lg:items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Nasıl çalışır?</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight">Basit ticari akış. Kontrollü teknik üretim.</h2>
            </div>
            <ol className="grid gap-0 border-y border-white/10 md:grid-cols-5">
              {workflow.map(([step, title, text], index) => (
                <li key={step} className={`py-6 md:px-5 ${index ? "border-t border-white/10 md:border-l md:border-t-0" : "md:pr-5"}`}>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/50 text-xs font-black text-emerald-300">{step}</span>
                  <h3 className="mt-4 text-sm font-black leading-5">{title}</h3>
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-400">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">Ortaklık ve satış iş birliği</p>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">Müşterinizde talep varsa, yeni bir hizmet hattını birlikte açalım.</h2>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-ink-700">İlk görüşmede müşteri tipi, hedef hizmet, satış modeli ve operasyon sorumluluğunu netleştiririz. Uygun değilse zorlamayız; uygunsa yazılı çalışma modeline geçeriz.</p>
          </div>
          <Link href="/iletisim/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 text-sm font-black text-white hover:bg-slate-800">
            İş ortaklığını görüşelim <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

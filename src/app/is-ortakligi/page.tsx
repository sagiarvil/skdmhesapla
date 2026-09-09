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

const partnerModels = [
  {
    icon: Handshake,
    title: "Yönlendirme modeli",
    text: "Müşteriyi SKDMHesapla'ya yönlendirirsiniz. Ticari paylaşım; iş hacmi, kapsam ve sorumluluk dağılımına göre yazılı partner anlaşmasında belirlenir.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Partner teslim modeli",
    text: "Müşteri ilişkisi sizde kalabilir. Siz ticari ve operasyonel iletişimi yürütürken teknik veri, hesaplama izi ve kanıt hazırlık kapsamını SKDMHesapla üretir.",
  },
  {
    icon: Users,
    title: "Ortak markalı proje",
    text: "Kurumsal müşteri veya çoklu dosya çalışmalarında ortak markalı teslim modeli; kapsam, veri güvenliği ve operasyon uygunluğuna göre proje bazında kararlaştırılır.",
  },
] as const;

const partnerValue = [
  "Yeni uzman ekip kurmadan portföye yeni bir hizmet kalemi ekleme",
  "Mevzuat ve metodoloji güncellemelerini teknik çekirdekte takip eden altyapı",
  "Tek müşterilik işten yıllık tekrar eden veri ve raporlama ihtiyacına geçiş",
  "Müşteriye yalnız hesap değil, veri ve kanıt hazırlık zinciri sunabilme",
  "Sanayi CBAM ve denizcilik karbon çalışmalarını ayrı metodolojilerle ele alma",
  "Ticari modelin müşteri hacmi ve teslim sorumluluğuna göre yazılı belirlenmesi",
];

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

      <section className="bg-brand-900 py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-brand-100">
              Gümrük müşavirleri · dış ticaret · sürdürülebilirlik hizmet firmaları
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Mevcut müşterinizden yeni bir karbon hizmet geliri yaratın; teknik altyapıyı sıfırdan kurmayın.
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-brand-100 sm:text-xl">
              Müşteriniz SKDM/CBAM, EU MRV, EU ETS veya FuelEU Maritime çalışması istediğinde teknik veri, hesaplama izi ve kanıt hazırlık katmanını SKDMHesapla ile birlikte yürütebilirsiniz. Ticari model ve müşteri yönetimi çalışma biçimine göre baştan netleştirilir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/iletisim/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 font-black text-brand-900 transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
                İş ortaklığını görüşelim <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a href="#modeller" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-500/40 px-6 font-black text-white transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
                Partner modellerini incele
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-brand-500/20 bg-brand-800 p-6 shadow-2xl sm:p-8" aria-label="İş ortaklığı değer modeli">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-500 p-3 text-brand-900"><Network className="h-7 w-7" aria-hidden="true" /></div>
              <div><p className="text-xs font-black uppercase tracking-[0.14em] text-brand-100">Teknik üretim katmanı</p><h2 className="mt-1 text-2xl font-black">Müşteri sizde olabilir. Teknik karbon çalışması standartlaşır.</h2></div>
            </div>
            <ul className="mt-7 space-y-3 text-sm font-medium leading-relaxed text-brand-100">
              {partnerValue.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />{item}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Kimler için?</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Karbon işini müşterisinden duyan ama ayrı bir teknik ekip kurmak istemeyen firmalar için.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink-700 sm:text-lg">İş ortaklığı; müşterinin ticari ve dış ticaret sürecini zaten yöneten profesyonellerin mevcut portföyüne, teknik üretim kapasitesi eklemek için tasarlanır.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Building2, "Gümrük müşavirleri", "GTİP, ithalat/ihracat akışı ve müşteri operasyonunu bilen firmalar."],
              [BriefcaseBusiness, "Dış ticaret hizmet firmaları", "AB müşterisi ve Türk üretici arasındaki belge akışını yöneten ekipler."],
              [Users, "Sürdürülebilirlik hizmet firmaları", "Müşterisine karbon ve ESG çalışmaları sunup CBAM veya denizcilik tarafında teknik üretim katmanı arayan firmalar."],
              [Factory, "Sektörel çözüm sağlayıcılar", "Sanayi veya denizcilik müşterisine düzenli hizmet verip yeni bir uyum hizmeti eklemek isteyen firmalar."],
            ].map(([Icon, title, text]) => {
              const CardIcon = Icon as typeof Building2;
              return <article key={String(title)} className="rounded-3xl border border-line bg-white p-6 shadow-sm"><CardIcon className="h-7 w-7 text-brand-800" aria-hidden="true" /><h3 className="mt-4 text-lg font-black">{String(title)}</h3><p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{String(text)}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section id="modeller" className="bg-brand-100 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Ticari çalışma modelleri</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Tek bir komisyon modeli dayatmıyoruz.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink-700">Müşteri kiminle sözleşme yapacak, teknik kapsamı kim anlatacak, revizyonu kim yönetecek ve teslim sorumluluğu kimde olacak? Marj veya paylaşım bu dört soruya göre yazılı olarak belirlenir.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {partnerModels.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-brand-800/20 bg-white p-7 shadow-sm"><Icon className="h-8 w-8 text-brand-800" aria-hidden="true" /><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-3 text-sm font-medium leading-relaxed text-ink-700">{text}</p></article>)}
          </div>
          <div className="mt-6 rounded-3xl border-2 border-brand-800/20 bg-white p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div><p className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Ticari sınır</p><h3 className="mt-2 text-2xl font-black">Fiyatı şişirip müşteriyi yanıltan bir model kurmuyoruz.</h3></div>
              <p className="text-sm font-medium leading-relaxed text-ink-700">Partner kendi hizmet kapsamını, operasyonunu ve ticari değerini fiyatlayabilir. SKDMHesapla teknik teslim kapsamı ve partner bedeli ise tarafların yazılı anlaşmasında açıkça tanımlanır. Gizli ücret, yanıltıcı resmî yetki iddiası veya müşteriye farklı bir hukuki statü sunulmaz.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Hizmet hatları</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Sanayi CBAM ile denizcilik karbon çalışmasını aynı dosya gibi ele almıyoruz.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink-700">Partnerlik aynı ticari çatı altında yürüyebilir; teknik motor, veri sahibi ve hukuki sorumluluk zinciri ayrı kalır.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border-2 border-brand-800/20 bg-white p-7 shadow-sm">
              <Factory className="h-8 w-8 text-brand-800" aria-hidden="true" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-brand-800">Sanayi</p>
              <h3 className="mt-2 text-2xl font-black">SKDM / CBAM teknik hazırlık</h3>
              <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-ink-700">
                {["CN / GTİP kapsam kontrolü","Tesis, üretim ve enerji veri haritası","Precursor ve tedarikçi veri koordinasyonu","Gömülü emisyon hesaplama izi","Communication Template hazırlık akışı","Actual values için doğrulayıcı incelemesine hazırlık kanıt yapısı"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" aria-hidden="true" />{item}</li>)}
              </ul>
              <Link href="/platform-kabiliyetleri/" className="mt-6 inline-flex items-center gap-2 font-black text-brand-800 hover:text-brand-900">CBAM kabiliyetlerini incele <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </article>

            <article className="rounded-3xl border-2 border-brand-800/20 bg-white p-7 shadow-sm">
              <Ship className="h-8 w-8 text-brand-800" aria-hidden="true" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-brand-800">Denizcilik</p>
              <h3 className="mt-2 text-2xl font-black">EU MRV · EU ETS · FuelEU Maritime hazırlığı</h3>
              <ul className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-ink-700">
                {["Gemi ve sorumlu şirket kanıt yapısı","Sefer, liman, yakıt ve emisyon veri zinciri","EU MRV ve EU ETS hesap hazırlığı","FuelEU enerji ve GHG yoğunluğu hesap hazırlığı","THETIS-MRV odaklı veri ve kanıt düzeni","Yıllık mutabakat ve verifier-readiness kontrolleri"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" aria-hidden="true" />{item}</li>)}
              </ul>
              <Link href="/denizcilik/" className="mt-6 inline-flex items-center gap-2 font-black text-brand-800 hover:text-brand-900">Denizcilik çalışma alanını incele <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-brand-100 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-6 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Sorumluluk ayrımı</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Partnerlik, yetkili aktörlerin yerine geçmez.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink-700">Bu ayrım hem müşteriyi hem partneri korur. Teknik hazırlık üretilir; hukuki yetki veya bağımsız doğrulama rolü taklit edilmez.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [ShieldCheck, "CBAM", "Yetkilendirilmiş CBAM beyan sahibi ve akredite doğrulayıcı rollerinin yerine geçilmez."],
              [Ship, "Denizcilik", "Shipping company / shipowner / ISM Company sorumluluğu, verifier rolü, THETIS-MRV ve Union Registry yükümlülükleri yerinde kalır."],
              [FileCheck2, "SKDMHesapla", "Veri toplama, hesaplama, kalite kontrolü, kanıt izi ve doğrulamaya hazırlık altyapısı sağlar."],
              [Handshake, "Partner", "Müşteri ilişkisi ve ticari rol, seçilen modele göre yazılı olarak sınırlandırılır."],
            ].map(([Icon, title, text]) => {
              const CardIcon = Icon as typeof ShieldCheck;
              return <article key={String(title)} className="rounded-2xl border border-brand-800/20 bg-white p-5"><CardIcon className="h-6 w-6 text-brand-800" aria-hidden="true" /><h3 className="mt-3 font-black">{String(title)}</h3><p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{String(text)}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-3xl"><span className="text-xs font-black uppercase tracking-[0.14em] text-brand-800">Partner başlangıç akışı</span><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">İlk müşteriyi getirmeden önce çalışma modelini netleştirelim.</h2></div>
          <ol className="mt-10 grid gap-5 lg:grid-cols-4">
            {[
              ["1", "Müşteri tipini belirle", "Sanayi CBAM mı, denizcilik mi; tek şirket mi, çoklu portföy mü?"],
              ["2", "Rol dağılımını yaz", "Teklif, veri toplama, teknik üretim, revizyon ve teslim sorumluluklarını ayır."],
              ["3", "Ticari modeli belirle", "Yönlendirme, partner teslim veya ortak markalı proje modelini seç."],
              ["4", "İlk işi kontrollü başlat", "Kapsam ve veri haritası netleşince müşteriye verilecek teslim sınırını birlikte sabitle."],
            ].map(([step, title, text]) => <li key={step} className="rounded-3xl border border-line bg-white p-6 shadow-sm"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-900 text-sm font-black text-white">{step}</span><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="bg-brand-900 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 sm:px-6 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight">Müşteriniz karbon çalışması istediğinde yeni bir ekip kurmak zorunda değilsiniz.</h2>
            <p className="mt-3 text-base font-medium leading-relaxed text-brand-100">Önce müşteri tipinizi ve yıllık iş hacmi ihtimalini konuşalım; sonra ticari ve teknik sorumlulukları tek sayfada netleştirelim.</p>
          </div>
          <Link href="/iletisim/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 font-black text-brand-900 transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">İş ortaklığı için iletişime geç <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="border-t border-line py-10">
        <div className="mx-auto max-w-6xl px-5 text-sm font-medium leading-relaxed text-ink-700 sm:px-6">
          <p><strong className="text-ink-900">Kapsam sınırı:</strong> İş ortaklığı modeli, SKDMHesapla'ya veya partnere akredite doğrulayıcı, yetkilendirilmiş CBAM beyan sahibi, gümrük otoritesi, administering authority veya resmî denizcilik uyum otoritesi statüsü kazandırmaz.</p>
        </div>
      </section>
    </main>
  );
}

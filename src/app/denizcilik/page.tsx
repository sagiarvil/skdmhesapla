import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, FileCheck2, Fuel, Network, Ship, ShieldCheck, WalletCards } from "lucide-react";
import { MaritimeComparison } from "@/components/maritime/MaritimeComparison";
import { absoluteUrl, pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/",
  title: "Denizcilik Karbon Uyum — EU ETS, MRV ve FuelEU",
  description:
    "AB limanlarına sefer yapan denizcilik firmaları için EU MRV kapsamı, EU ETS maliyet maruziyeti, FuelEU Maritime veri hazırlığı ve ihracatçı müşterilere CBAM hizmet kanalı.",
});

const modules = [
  { title: "EU MRV", text: "Gemi tipi, gross tonnage ve rota üzerinden izleme-raporlama kapsamını görün; monitoring plan ve kanıt setinizi düzenleyin.", href: "/denizcilik/eu-mrv/", icon: FileCheck2 },
  { title: "EU ETS", text: "ETS kapsam emisyonunu, phase-in oranını ve kendi girdiğiniz EUA fiyatıyla maliyet maruziyetini görün.", href: "/denizcilik/eu-ets/", icon: WalletCards },
  { title: "FuelEU Maritime", text: "Yakıtların Well-to-Wake sera gazı yoğunluğunu, veri ihtiyacını ve verifier hazırlığını ayrı modülde yönetin.", href: "/denizcilik/fueleu/", icon: Fuel },
  { title: "CBAM İhracatçı Masası", text: "Denizcilik firmasının ihracatçı müşteri portföyünü sürekli CBAM kapsam kontrolü ve hizmet talebi kanalına dönüştürün.", href: "/denizcilik/cbam-ihracatci-masasi/", icon: Network },
] as const;

export default function DenizcilikPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl("/denizcilik/")}#service`,
    url: absoluteUrl("/denizcilik/"),
    name: "SKDMHesapla Denizcilik Karbon Uyum",
    description: "EU MRV, EU ETS ve FuelEU Maritime için kapsam, veri ve maliyet ön analizi; CBAM ihracatçı partner kanalı.",
    provider: { "@id": `${absoluteUrl("/")}#organization` },
    areaServed: "TR",
    serviceType: ["EU MRV", "EU ETS maritime", "FuelEU Maritime", "CBAM partner channel"],
  };

  return (
    <main className="min-h-screen bg-white text-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden border-b border-line bg-[#071812] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(124,184,82,0.22),transparent_34%),radial-gradient(circle_at_20%_90%,rgba(60,130,246,0.12),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-brand-300"><Ship className="h-4 w-4" /> SKDMHesapla · Denizcilik</span>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.06] tracking-tight sm:text-6xl">AB limanlarına sefer yapıyorsanız karbon artık yalnız rapor değil, <span className="text-brand-300">maliyet ve müşteri yönetimi</span> işidir.</h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-300 sm:text-xl">EU MRV kapsamını kontrol edin, EU ETS maliyet maruziyetini görün, FuelEU veri hazırlığını yönetin; aynı yapıyı ihracatçı müşterilerinize CBAM hizmet kanalı olarak açın.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/denizcilik/kapsam-kontrolu/" className="inline-flex min-h-13 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-black text-brand-950 shadow-lg hover:bg-brand-400">Ücretsiz kapsam kontrolü <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/denizcilik/cbam-ihracatci-masasi/" className="inline-flex min-h-13 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-6 text-sm font-black text-white hover:bg-white/[0.08]">Partner modelini gör</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-5 shadow-2xl backdrop-blur sm:p-7">
            <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.12em] text-brand-300">Tek firma / dört gelir noktası</p><h2 className="mt-2 text-2xl font-black">Uyumdan dağıtım kanalına</h2></div><BarChart3 className="h-7 w-7 text-brand-300" /></div>
            <div className="mt-6 space-y-3">
              {[["1", "Kapsam", "Gemi ve rota hangi mevzuata giriyor?"], ["2", "Maliyet", "ETS / FuelEU etkisi ne kadar?"], ["3", "Yıllık yönetim", "Filo verisi ve kanıtlar düzenli mi?"], ["4", "CBAM partner kanalı", "İhracatçı müşteriler SKDMHesapla'ya nasıl akar?"]].map(([no, title, text]) => (
                <div key={no} className="grid grid-cols-[40px_1fr] gap-3 rounded-2xl border border-white/10 bg-black/10 p-4"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-black text-brand-950">{no}</span><div><p className="font-black">{title}</p><p className="mt-1 text-sm font-medium text-slate-300">{text}</p></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20"><div className="mx-auto max-w-6xl px-5 sm:px-6"><div className="max-w-3xl"><span className="text-xs font-black uppercase tracking-[0.12em] text-brand-800">Ürün mimarisi</span><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">CBAM çekirdeğine dokunmadan dört denizcilik modülü</h2><p className="mt-3 text-sm font-medium leading-7 text-ink-700 sm:text-base">Kimlik, belge, faturalama ve audit altyapısı ortaktır. MRV, ETS ve FuelEU hesap/kapsam mantığı ise birbirinden ayrıdır.</p></div><div className="mt-8 grid gap-4 md:grid-cols-2">{modules.map((module) => { const Icon = module.icon; return <Link key={module.href} href={module.href} className="group rounded-3xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-800/30 hover:shadow-xl"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-900"><Icon className="h-5 w-5" /></span><h3 className="mt-4 text-xl font-black">{module.title}</h3><p className="mt-2 text-sm font-medium leading-7 text-ink-700">{module.text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-900">İncele <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span></Link>; })}</div></div></section>

      <MaritimeComparison />

      <section className="py-14 sm:py-20"><div className="mx-auto grid max-w-6xl gap-5 px-5 sm:px-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-line bg-[#fbfdfb] p-6"><ShieldCheck className="h-6 w-6 text-brand-800" /><h2 className="mt-4 text-xl font-black">Doğrulama iddiası yok</h2><p className="mt-2 text-sm font-medium leading-7 text-ink-700">SKDMHesapla veri, kapsam, hesap izi ve kanıt hazırlığı sağlar. Akredite verifier görüşünün yerine geçmez.</p></article>
        <article className="rounded-3xl border border-line bg-[#fbfdfb] p-6"><WalletCards className="h-6 w-6 text-brand-800" /><h2 className="mt-4 text-xl font-black">Canlı EUA fiyatını uydurmaz</h2><p className="mt-2 text-sm font-medium leading-7 text-ink-700">Maliyet ön tahmini, kullanıcının girdiği EUA fiyatıyla hesaplanır. Piyasa verisi entegrasyonu yapılmadan canlı fiyat iddiası verilmez.</p></article>
        <article className="rounded-3xl border border-line bg-[#fbfdfb] p-6"><Network className="h-6 w-6 text-brand-800" /><h2 className="mt-4 text-xl font-black">Asıl ölçek: ihracatçı ağı</h2><p className="mt-2 text-sm font-medium leading-7 text-ink-700">Denizcilik firması tek müşteri olarak kalmaz; kendi ihracatçı portföyüne SKDMHesapla kapsam kontrolü ve CBAM hizmeti sunan dağıtım kanalı olur.</p></article>
      </div></section>

      <section className="border-t border-line bg-brand-950 py-14 text-white sm:py-18"><div className="mx-auto max-w-4xl px-5 text-center sm:px-6"><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Önce geminin hangi kurala girdiğini görün.</h2><p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">Yanlış mevzuata göre dosya hazırlamadan önce GT, gemi tipi ve liman bağlantısıyla kapsamı daraltın.</p><Link href="/denizcilik/kapsam-kontrolu/" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-black text-brand-950 hover:bg-brand-400">Denizcilik kapsam kontrolünü başlat <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  );
}

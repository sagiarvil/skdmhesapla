import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, Gauge, Ship, Waves } from "lucide-react";

function CargoShipMark() {
  return (
    <svg viewBox="0 0 760 280" className="h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="seaGlow" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="0.55" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path d="M72 182h560l-60 50H180L72 182Z" fill="currentColor" opacity="0.14" />
      <path d="M104 178h488M158 178l30-79h227l39 79M217 99V62h91v37m-45-37V34m0 0 17 16m-17-16-17 16M456 178v-59h106v59M478 119V85h23v34m38 0V75" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 235c88-30 139 30 227 0s139 30 227 0 140 30 238 0" fill="none" stroke="url(#seaGlow)" strokeWidth="4" />
    </svg>
  );
}

const outcomes = [
  "Hangi geminin EU MRV, EU ETS ve FuelEU yükümlülüğünde olduğunu görün.",
  "ETS kapsam emisyonu, EUA ihtiyacı ve karbon maliyetini hesaplayın.",
  "Denetçiye gitmeden önce eksik veri ve kanıtları sistemde kapatın.",
] as const;

export function MaritimeConversionHero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-800 bg-brand-900 text-white">
      <div aria-hidden className="absolute inset-0 opacity-[0.11]" style={{ backgroundImage: "url('/desen/guilloche-mesh-koyu.svg')", backgroundSize: "900px" }} />
      <div aria-hidden className="absolute -right-24 top-14 h-72 w-72 rounded-full border border-brand-500/10" />
      <div aria-hidden className="absolute -right-10 top-28 h-52 w-52 rounded-full border border-brand-500/10" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/35 bg-brand-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-brand-500">
            <Ship className="h-4 w-4" /> AB/AEA limanlarına sefer yapan denizcilik şirketleri için
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl">
            Geminiz AB karbon kurallarına tabi ise, denetçiye gidecek uyum dosyanızı burada hazırlayın.
          </h1>

          <p className="mt-5 max-w-3xl text-lg font-black text-brand-500 sm:text-xl">
            EU MRV + EU ETS + FuelEU Maritime · tek otomasyon akışı
          </p>

          <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-200 sm:text-lg">
            Sistem kapsamı belirler; sefer, yakıt/BDN, emisyon ve kanıt verilerini kontrol eder; ETS ve FuelEU hesaplarını otomatik yapar. Kritik veri eksikse dosyayı tamamlanmış göstermez.
          </p>

          <div className="mt-6 grid max-w-3xl gap-3">
            {outcomes.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm font-bold leading-6 text-slate-100 sm:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/denizcilik/kapsam-kontrolu/" className="inline-flex min-h-14 items-center gap-2 rounded-xl bg-brand-500 px-7 text-base font-black text-brand-950 shadow-lg transition hover:-translate-y-0.5">
              Kapsamımı ücretsiz kontrol et <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/denizcilik/dosya-hazirla/" className="inline-flex min-h-14 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-7 text-base font-black text-white transition hover:bg-white/[0.08]">
              <FileCheck2 className="h-5 w-5 text-brand-500" /> Uyum dosyamı hazırlamaya başla
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">1 gemi + 1 raporlama yılı</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Otomatik kapsam + hesap + kanıt kontrolü</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Doğrulamaya hazırlık</span>
          </div>
        </div>

        <aside className="relative rounded-[2rem] border border-brand-500/20 bg-[#0a2119]/90 p-5 shadow-2xl sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-500">Maritime Compliance Workbench</p>
              <p className="mt-1 text-lg font-black">Gemiden denetçi hazırlığına tek veri zinciri</p>
            </div>
            <Waves className="h-7 w-7 shrink-0 text-brand-500" />
          </div>

          <div className="mt-2 text-brand-500"><CargoShipMark /></div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["EU MRV", "Emisyon + aktivite"],
              ["EU ETS", "EUA + maliyet"],
              ["FuelEU", "GHG yoğunluğu"],
            ].map(([title, sub]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-center">
                <p className="text-sm font-black text-white">{title}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">{sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-white"><Gauge className="h-4 w-4 text-brand-500" /> Sistem size üç şeyi net söyler:</div>
            <div className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-200">
              <p><b className="text-white">1.</b> Kapsamda mısınız?</p>
              <p><b className="text-white">2.</b> Karbon yükümlülüğünüz ve maliyetiniz nedir?</p>
              <p><b className="text-white">3.</b> Verifier öncesi hangi veri veya kanıt eksik?</p>
            </div>
          </div>

          <p className="mt-4 text-xs font-semibold leading-5 text-slate-400">
            SKDMhesapla akredite verifier değildir. Platform hesaplama ve doğrulamaya hazırlık dosyası üretir; resmî doğrulama bağımsız akredite verifier tarafından yürütülür.
          </p>
        </aside>
      </div>
    </section>
  );
}

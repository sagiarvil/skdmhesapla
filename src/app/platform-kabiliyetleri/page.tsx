import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Calculator, FileCheck2, Network, Search, ShieldCheck, Sliders, Users } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/platform-kabiliyetleri/",
  title: "SKDMHesapla Platform Kabiliyetleri — Veri, Precursor, Hesaplama ve Denetime Hazırlık",
  description: "SKDMHesapla'nın GTİP kapsam kontrolü, tesis ve üretim verisi, enerji/emisyon hesabı, öncül madde ve tedarikçi verisi, kanıt izi, maliyet ve denetime hazırlık kabiliyetlerini inceleyin.",
});

const capabilities = [
  { icon: Search, title: "GTİP / CN kapsam kontrolü", text: "Ürün adıyla tahmin yürütmek yerine doğrulanmış CN/GTİP sınıflandırmasını esas alır; kapsam dışı kodları SKDM hesap motoruna taşımaz." },
  { icon: Sliders, title: "Tesis, üretim ve enerji verisi", text: "Üretim miktarı, tesis sınırları, yakıt, elektrik ve proses girdilerini aynı çalışma akışında toplar; alan bazlı yönlendirme ile verinin nereden bulunacağını açıklar." },
  { icon: Boxes, title: "Öncül madde / precursor takibi", text: "CBAM kapsamındaki ara girdileri ayrı katmanda izler; precursor miktarı ve tedarikçi gömülü emisyon bilgisini ürün hesabına bağlar." },
  { icon: Users, title: "Tedarikçi veri koordinasyonu", text: "Eksik SEE ve girdi verileri için tedarikçiye iletilecek veri talebini standardize eder; gelen bilgiyi çalışma dosyasına taşımayı kolaylaştırır." },
  { icon: Calculator, title: "Gömülü emisyon ve maliyet hesabı", text: "Doğrudan, dolaylı ve uygulanabilir precursor emisyonlarını hesaplama izinde birleştirir; SKDM sertifika maliyeti için senaryo üretir." },
  { icon: Network, title: "Hesaplama izi ve veri zinciri", text: "Kullanılan veriyi, varsayımı, kaynağı ve hesap adımını birbirine bağlayarak sonuçların geriye doğru izlenebilmesini sağlar." },
  { icon: FileCheck2, title: "Alıcı / doğrulayıcı hazırlık paketi", text: "Hesap özeti, veri tablosu, kanıt listesi ve çalışma dosyalarını tek paket mantığında düzenler; akredite doğrulama görüşü yerine denetime hazırlık sağlar." },
  { icon: ShieldCheck, title: "Kalite kapıları ve mühürleme", text: "Eksik veya gerekçesiz veriyle mühürlemeyi engelleyen kontroller uygular; oluşturulan paketin bütünlüğünü doğrulanabilir mühür kimliğiyle korur." },
];

export default function PlatformKabiliyetleriPage() {
  return <main className="bg-white text-ink-900">
    <section className="border-b border-line bg-gradient-to-b from-[#f4f9f4] via-white to-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-4xl">
          <span className="inline-flex rounded-full border border-brand-800/20 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-900">Platform kabiliyetleri</span>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">Bir hesap makinesinden daha fazlası: SKDM veri hazırlama ve kontrol sistemi</h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-ink-700 sm:text-lg">SKDMHesapla; kapsam kararından tedarikçi verisine, öncül maddelerden gömülü emisyon hesabına, kanıt izinden alıcı/doğrulayıcı hazırlık paketine kadar süreci tek çalışma zincirinde toplar.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map(({icon:Icon,title,text},i)=><article key={title} className={`rounded-3xl border p-6 shadow-sm ${["bg-emerald-50/70 border-emerald-200","bg-sky-50/70 border-sky-200","bg-amber-50/70 border-amber-200","bg-violet-50/70 border-violet-200"][i%4]}`}>
            <Icon className="h-7 w-7 text-brand-800" />
            <h2 className="mt-4 text-lg font-black">{title}</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-ink-700">{text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-6 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <h2 className="text-2xl font-black sm:text-3xl">Karmaşık tedarik zincirinde precursor verisi nasıl ele alınır?</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-700">Öncül madde takibi ayrı bir veri katmanıdır. Üründe kullanılan CBAM kapsamındaki ara girdiler, miktarları ve varsa tedarikçi SEE bilgileriyle ilişkilendirilir. Veri tedarikçideyse sistem bunu kullanıcıdan gizlemez; hangi bilginin kimden istenmesi gerektiğini açıkça gösterir ve veri talebini standardize eder.</p>
          <p className="mt-4 text-base leading-relaxed text-ink-700">Bu nedenle “karmaşık tedarik zincirinde precursor desteği yok” değerlendirmesi doğru değildir. Gereken üçüncü taraf verisinin tedarikçiden sağlanması gerekir; SKDMHesapla bu verinin toplanması, sınıflandırılması ve hesap zincirine taşınması için akış sağlar.</p>
        </div>
        <aside className="rounded-3xl border-2 border-brand-800/20 bg-[#071812] p-7 text-white">
          <h2 className="text-xl font-black">Kullanıcı ne elde eder?</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-200">
            {["Kapsam kararı ve GTİP dayanağı","Tesis / üretim / enerji veri seti","Precursor ve tedarikçi veri tablosu","Hesaplama izi ve varsayım kayıtları","SKDM maliyet senaryosu","Kanıt listesi ve çalışma dosyaları","Mühürlü, bütünlüğü doğrulanabilir paket"].map(x=><li key={x} className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{x}</li>)}
          </ul>
        </aside>
      </div>
    </section>

    <section className="border-y border-line bg-[#f7faf7] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-6 rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 sm:p-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.15em] text-indigo-700">24 Ağustos 2026 · doğrulama hazırlığı</span>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Actual values kullanacaksanız dosyanız akredite doğrulayıcı incelemesine hazır olmalı.</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink-700 sm:text-base">Avrupa Komisyonunun 24 Ağustos 2026 tarihli doğrulama ve akreditasyon rehberi, 2026 emisyon verilerinin akredite CBAM doğrulayıcıları tarafından incelenmesine yönelik operasyonel çerçeveyi açıklıyor. SKDMHesapla doğrulayıcı değildir; monitoring planı, üretim süreçleri, precursor verileri, enerji/yakıt kayıtları, hesaplama izi ve kanıt referanslarını doğrulama öncesi düzenli ve izlenebilir hale getirir.</p>
          </div>
          <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-ink-900">Resmî çerçeve</p>
            <ul className="mt-3 space-y-2 text-sm font-medium leading-relaxed text-ink-700">
              <li>• (EU) 2025/2546 — actual emissions doğrulama ilkeleri</li>
              <li>• (EU) 2025/2551 — doğrulayıcı akreditasyonu ve faaliyet grupları</li>
              <li>• 1 Eylül 2026 — verifier Registry erişim sürecinin başlangıç eşiği</li>
              <li>• Ocak 2027 — ilk doğrulama raporlarının Registry üzerinden düzenlenmesi</li>
            </ul>
            <Link href="/mevzuat-guncellemeleri/#cbam-verification-accreditation-guidance-24-agustos-2026" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-indigo-800 hover:text-indigo-600">Güncellemenin etkisini incele <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>

    <section className="py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-5 sm:px-6 lg:flex-row lg:items-center">
        <div><h2 className="text-2xl font-black">Önce kapsamınızı kontrol edin.</h2><p className="mt-2 text-sm font-medium text-ink-700">GTİP/CN kodunuz kapsamdaysa sistem sizi gerekli veri ve hesap adımlarına yönlendirir.</p></div>
        <Link href="/basla/" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 font-black text-brand-950 hover:bg-brand-400">Ücretsiz kapsam kontrolü <ArrowRight className="h-5 w-5" /></Link>
      </div>
    </section>
  </main>;
}

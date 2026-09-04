import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Network } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/cbam-ihracatci-masasi/",
  title: "CBAM İhracatçı Masası — Denizcilik Partner Kanalı",
  description: "Denizcilik firmalarının taşıdığı CBAM kapsamlı ihracatçı portföyünü SKDMhesapla müşteri kanalına dönüştüren partner masası.",
});

export default function CbamIhracatciMasasiPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-800"><Network className="h-6 w-6" /></span>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Denizcilik firmanızı CBAM müşteri kanalına çevirin.</h1>
        <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-ink-700 sm:text-lg">EU ETS + MRV + FuelEU uyum hizmeti alan denizcilik firması, taşıdığı ihracatçı müşterilere özel SKDMhesapla bağlantısı gönderir. İhracatçı GTİP kontrolü yapar, kapsam oluşursa CBAM çalışma akışına alınır.</p>
        <div className="mt-8 rounded-3xl border border-line bg-[#071812] p-6 text-white shadow-xl">
          {[
            "Partner bağlantısı oluşturulur: skdmhesapla.com/p/partner-kodu",
            "Denizcilik firması ihracatçı müşterisine bu bağlantıyı gönderir.",
            "İhracatçı GTİP ve ürün bilgisiyle CBAM kapsam kontrolü yapar.",
            "Kapsamlı iş SKDMhesapla CBAM hizmetine döner.",
            "Denizcilik firması sektöründe katma değerli uyum ortağı olarak konumlanır.",
          ].map((item, index) => (
            <div key={item} className="flex gap-4 border-b border-white/10 py-4 last:border-b-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-black text-brand-950">{index + 1}</span>
              <p className="text-sm font-bold leading-6 text-slate-200">{item}</p>
            </div>
          ))}
        </div>
        <Link href="/iletisim/" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950">Partner görüşmesi başlat <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

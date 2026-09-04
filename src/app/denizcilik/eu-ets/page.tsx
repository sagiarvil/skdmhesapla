import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/eu-ets/",
  title: "EU ETS Denizcilik Maliyet Yönetimi",
  description: "Denizcilik şirketleri için sefer, yakıt, emisyon ve EUA maruziyetini maliyet yönetimi kararına çeviren EU ETS ön analiz akışı.",
});

export default function EuEtsPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-800"><Calculator className="h-6 w-6" /></span>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">EU ETS maliyetini sefer, müşteri ve yük bazında görün.</h1>
        <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-ink-700 sm:text-lg">Amaç yalnız emisyon hesabı değildir. Yakıt tüketimi, rota, AB kapsam oranı ve EUA fiyatı üzerinden karbon maliyetini ticari karara çevirmektir.</p>
        <div className="mt-8 rounded-3xl border border-line bg-[#071812] p-6 text-white shadow-xl">
          <div className="grid gap-4 sm:grid-cols-4">
            {["Yakıt", "CO2e", "ETS kapsamı", "EUA maliyeti"].map((item, i) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-black text-brand-300">{i + 1}</p><p className="mt-2 text-lg font-black">{item}</p></div>)}
          </div>
        </div>
        <Link href="/denizcilik/kapsam-kontrolu/" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950">Kapsam kontrolü yap <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

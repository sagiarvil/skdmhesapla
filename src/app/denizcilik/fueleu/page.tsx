import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Fuel } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/fueleu/",
  title: "FuelEU Maritime Uyum Ön Analizi",
  description: "FuelEU Maritime için yakıt türü, enerji içeriği, GHG yoğunluğu ve uyum açığı ön analiz akışı.",
});

export default function FuelEuPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-800"><Fuel className="h-6 w-6" /></span>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">FuelEU Maritime uyum açığını yakıt verisinden yönetin.</h1>
        <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-ink-700 sm:text-lg">FuelEU tarafında kritik konu yalnız tüketim miktarı değildir. Yakıt türü, enerji, WtW yoğunluğu ve uyum bakiyesi birlikte izlenmelidir.</p>
        <div className="mt-8 rounded-3xl border border-line bg-[#f6faf3] p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-4">
            {["Fuel type", "Energy", "GHG intensity", "Compliance balance"].map((item) => <div key={item} className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-ink-900">{item}</p></div>)}
          </div>
        </div>
        <Link href="/denizcilik/kapsam-kontrolu/" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950">FuelEU kapsamını kontrol et <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

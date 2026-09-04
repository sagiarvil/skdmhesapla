import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { pageMetadata } from "@/lib/skdm/seo";

export const metadata: Metadata = pageMetadata({
  path: "/denizcilik/eu-mrv/",
  title: "EU MRV Denizcilik Veri ve Kanıt Hazırlığı",
  description: "Gemi ve sefer verilerini MRV raporlama düzenine hazırlayan denizcilik karbon uyum ön analiz sayfası.",
});

export default function EuMrvPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-800"><FileCheck2 className="h-6 w-6" /></span>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">EU MRV için gemi, sefer ve yakıt kanıt zincirini hazırlayın.</h1>
        <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-ink-700 sm:text-lg">MRV tarafında değer, hesap sonucundan önce veri disiplinindedir. Monitoring Plan, sefer kayıtları, liman uğrakları ve yakıt belgeleri tek dosya düzenine alınır.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["Monitoring Plan", "Voyage records", "Fuel evidence"].map((item) => <div key={item} className="rounded-3xl border border-line bg-[#f6faf3] p-6"><h2 className="text-xl font-black">{item}</h2><p className="mt-3 text-sm font-semibold leading-6 text-ink-700">Eksik veya tutarsız veri varsa nihai çıktı bloke edilir; önce kanıt kalitesi tamamlanır.</p></div>)}
        </div>
        <Link href="/denizcilik/kapsam-kontrolu/" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-black text-brand-950">MRV kapsamını kontrol et <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

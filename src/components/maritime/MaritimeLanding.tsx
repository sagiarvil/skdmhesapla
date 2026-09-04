import Link from "next/link";
import { ArrowRight, Anchor, Calculator, FileCheck2, Network, Ship, ShieldCheck } from "lucide-react";
import { MARITIME_VALUE_CARDS } from "@/data/maritime/content";
import { MaritimeComparison } from "./MaritimeComparison";

const icons = [Ship, Calculator, ShieldCheck, Network] as const;

export function MaritimeLanding() {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-[#071812] via-[#0f2a1f] to-[#f6faf3] text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-brand-200">
              <Anchor className="h-4 w-4" /> Denizcilik karbon uyum
            </div>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              AB limanlarına sefer yapan firmalar için EU ETS, MRV ve FuelEU karar sistemi.
            </h1>
            <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-200 sm:text-xl">
              Gemi, sefer, yakıt ve kanıt verisini tek akışta okuyun; uyum kapsamını, karbon maliyetini ve CBAM ihracatçı müşteri fırsatını ayrı ayrı görün.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/denizcilik/kapsam-kontrolu/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-brand-500 px-7 text-base font-black text-brand-950 shadow-lg hover:bg-brand-400">
                Ücretsiz kapsam kontrolü <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/denizcilik/cbam-ihracatci-masasi/" className="inline-flex min-h-14 items-center gap-2 rounded-2xl border border-white/20 px-7 text-base font-black text-white hover:bg-white/10">
                Partner Masası
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-[#f6faf3] py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {MARITIME_VALUE_CARDS.map((card, index) => {
            const Icon = icons[index] ?? FileCheck2;
            return (
              <div key={card.title} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-800"><Icon className="h-5 w-5" /></span>
                <h2 className="mt-5 text-xl font-black text-ink-900">{card.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-ink-700">{card.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <MaritimeComparison />

      <section className="bg-brand-950 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1fr] lg:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-brand-300">Gelir zinciri</span>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Denizcilik müşterisi aynı zamanda CBAM müşteri kanalıdır.</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-300 sm:text-base">
                Firmaya EU ETS + MRV + FuelEU uyum ve maliyet yönetimi satılır. Aynı firmanın taşıdığı ihracatçı portföyü, partner bağlantılarıyla SKDMhesapla CBAM akışına yönlendirilir.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              {[
                "Denizcilik firması kapsam kontrolü yapar.",
                "Filo/sefer/yakıt verisiyle ücretli ön analiz alır.",
                "Yıllık uyum ve maliyet yönetimine geçer.",
                "CBAM kapsamlı ihracatçı müşterilerine özel bağlantı gönderir.",
                "SKDMhesapla yeni CBAM müşterisi kazanır; denizcilik firması kanal ortağı olur.",
              ].map((item, index) => (
                <div key={item} className="flex gap-4 border-b border-white/10 py-4 last:border-b-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-black text-brand-950">{index + 1}</span>
                  <p className="text-sm font-bold leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

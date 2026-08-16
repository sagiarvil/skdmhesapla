import type { Metadata } from "next";
import Link from "next/link";
import { Package, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = {
  title: "PPWR 2025/40 Ambalaj Tüzüğü Tedarikçi Verisi — AB Ambalaj İhracatı",
  description:
    "Plastik, oluklu mukavva, metal ve cam ambalaj üreticileri için PPWR (AB) 2025/40 uyumlu geri dönüştürülmüş içerik ve karbon ayak izi veri beyanı.",
};

export default function PpwrAmbalajPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
        <GeriLink />

        {/* BAŞLIK */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Tüzük (AB) 2025/40 — Ambalaj ve Ambalaj Atıkları (PPWR)
          </span>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">
            PPWR Ambalaj Tüzüğü: Tedarikçiden İstenen Veriler Nelerdir?
          </h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl">
            AB&apos;ye doğrudan ambalaj ihraç eden veya ürünlerini ambalajlı olarak AB pazarına sokan Türk firmaları, 2025/40 sayılı yeni PPWR tüzüğü gereğince katı geri dönüşüm ve karbon beyanlarına tabidir.
          </p>
        </div>

        {/* SENARYO VE İŞLEYİŞ */}
        <div className="space-y-6 rounded-3xl border-2 border-line bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black text-ink-900">Ambalaj Sektöründeki Temel Zorunluluklar</h2>
          
          <div className="space-y-4 text-base text-ink-700 font-medium leading-relaxed">
            <p>
              Oluklu mukavva kutu, esnek plastik ambalaj, sert plastik kaplar, alüminyum/teneke kutular veya cam şişe üreten Türk firmaları; AB&apos;li müşterilerine her teslimat partisinde teknik kompozisyon ve karbon verisi sağlamalıdır.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-500/30 bg-brand-100/60 p-5 space-y-2">
            <div className="font-black text-brand-950 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent-green" />
              <span>PPWR Tedarikçi Beyan Maddeleri:</span>
            </div>
            <ul className="list-disc pl-5 text-sm text-ink-900 space-y-1 font-semibold">
              <li>Ambalajın birim ağırlığı (gram/adet) ve malzeme dağılımı (monomateryal / kompozit)</li>
              <li>Tüketici sonrası geri dönüştürülmüş içerik (Post-Consumer Recycled - PCR) oranı (%)</li>
              <li>Ambalaj üretim sürecindeki enerji yoğunluğu ve Kapsam 1/2 emisyonları</li>
              <li>Geri dönüştürülebilirlik tasarım kriterleri (Design for Recycling - DfR uyumu)</li>
            </ul>
          </div>
        </div>

        {/* 10 KATMANLI ÇÖZÜM */}
        <div className="space-y-6 rounded-3xl border-2 border-brand-800/30 bg-brand-950 p-8 text-white shadow-xl">
          <h2 className="text-2xl font-black text-white">Ambalaj Veri Dosyanızı Oluşturun</h2>
          <p className="text-brand-mist text-base leading-relaxed font-medium">
            SKDMHesapla, ambalaj üreticileri için fatura ve hammadde kayıtlarına dayanan, SHA-256 dijital mühürlü ISO 14067 tedarikçi veri paketi sunar.
          </p>
          <div className="pt-2">
            <Link
              href="/basla/"
              className="inline-flex min-h-[50px] items-center gap-2 rounded-2xl bg-brand-500 px-7 text-base font-black text-brand-950 hover:bg-brand-400 transition"
            >
              <span>Ambalaj Tedarikçi Dosyası Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BatteryCharging, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = {
  title: "AB Pil Tüzüğü 2023/1542 Tedarikçi Verisi — Batarya Karbon Ayak İzi",
  description:
    "Endüstriyel bataryalar, elektrikli araç pilleri ve SLI akü üreticileri için (AB) 2023/1542 yaşam döngüsü karbon ayak izi ve dijital batarya pasaportu veri rehberi.",
};

export default function PilTuzuguPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
        <GeriLink />

        {/* BAŞLIK */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <BatteryCharging className="h-4 w-4" />
            <span>Tüzük (AB) 2023/1542 — Yeni Pil ve Batarya Düzenlemesi</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">
            Pil ve Batarya Tüzüğü: Karbon Ayak İzi ve Pasaport Verisi
          </h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Elektrikli araç bataryaları, şarj edilebilir endüstriyel piller (2 kWh üzeri) ve LMT bataryaları üreten ya da bu bileşenleri içeren cihazları AB&apos;ye ihraç eden Türk firmaları için zorunlu yaşam döngüsü karbon beyanı.
          </p>
        </div>

        {/* SENARYO VE İŞLEYİŞ */}
        <div className="space-y-6 rounded-3xl border-2 border-line bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black text-ink-900">Batarya Üreticilerinin Yükümlülükleri</h2>
          
          <div className="space-y-4 text-base text-ink-700 font-medium leading-relaxed">
            <p>
              Pil Tüzüğü uyarınca AB pazarına giren bataryalar; hammadde madenciliğinden hücre üretimine ve montaja kadar her aşamanın karbon ayak izini (kg CO₂e / kWh) beyan etmek zorundadır. İlerleyen fazlarda karbon performans sınıfları ve maksimum karbon sınırları yürürlüğe girecektir.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-500/30 bg-brand-100/60 p-5 space-y-2">
            <div className="font-black text-brand-950 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent-green" />
              <span>Batarya Tedarikçi Veri Dosyası Gereksinimleri:</span>
            </div>
            <ul className="list-disc pl-5 text-sm text-ink-900 space-y-1 font-semibold">
              <li>Toplam Batarya Kapasitesi (kWh) ve Kimyasal Yapı (LFP, NMC, Kurşun-Asit vb.)</li>
              <li>Hammadde tedarik zinciri izlenebilirliği (Kobalt, Lityum, Nikel, Grafit menşei)</li>
              <li>Hücre üretim tesisi doğrudan ve dolaylı elektrik tüketimi (Kapsam 1 &amp; Kapsam 2)</li>
              <li>Geri dönüştürülmüş kobalt (%16), kurşun (%85), lityum (%6) ve nikel (%6) payları</li>
            </ul>
          </div>
        </div>

        {/* 10 KATMANLI ÇÖZÜM */}
        <div className="space-y-6 rounded-3xl border-2 border-brand-800/30 bg-brand-950 p-8 text-white shadow-xl">
          <h2 className="text-2xl font-black text-white">Batarya Veri Dosyanızı Oluşturun</h2>
          <p className="text-brand-mist text-base leading-relaxed font-medium">
            SKDMHesapla altyapısı, pil ve akü üreticilerinin tesis enerji kayıtlarını ISO 14067 metodolojisiyle mühürlü bir tedarikçi dosyasına dönüştürür.
          </p>
          <div className="pt-2">
            <Link
              href="/basla/"
              className="inline-flex min-h-[50px] items-center gap-2 rounded-2xl bg-brand-500 px-7 text-base font-black text-brand-950 hover:bg-brand-400 transition"
            >
              <span>Batarya Tedarikçi Dosyası Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

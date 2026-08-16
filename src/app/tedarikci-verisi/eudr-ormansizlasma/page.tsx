import type { Metadata } from "next";
import Link from "next/link";
import { TreePine, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { GeriLink } from "@/components/nav/GeriLink";

export const metadata: Metadata = {
  title: "EUDR 2023/1115 Ormansızlaşma Tüzüğü Tedarikçi Verisi — AB Ahşap ve Tarım",
  description:
    "Ahşap, mobilya, kâğıt, kauçuk, soya, kakao ve kahve üreticileri için (AB) 2023/1115 parsel coğrafi konumu ve ormansızlaşma teyit veri çerçevesi.",
};

export default function EudrOrmansizlasmaPage() {
  return (
    <article className="pasaport-zemin-yogun min-h-screen bg-[#f7faf5] py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10 px-5 sm:px-6">
        <GeriLink />

        {/* BAŞLIK */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 bg-brand-100 px-4 py-1 text-xs font-black text-brand-900">
            <TreePine className="h-4 w-4" />
            <span>Tüzük (AB) 2023/1115 — Ormansızlaşmanın Önlenmesi (EUDR)</span>
          </div>
          <h1 className="text-3xl font-black text-ink-900 sm:text-5xl">
            EUDR Ormansızlaşma Tüzüğü: Ahşap, Kâğıt ve Kauçuk Tedarikçileri
          </h1>
          <p className="text-base font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Avrupa Birliği&apos;ne ahşap ürünleri, kereste, mobilya, kâğıt/karton ambalaj, doğal kauçuk veya tarım ürünleri ihraç eden Türk firmaları için zorunlu durum tespiti (Due Diligence) ve coğrafi konum veri gereksinimleri.
          </p>
        </div>

        {/* SENARYO VE İŞLEYİŞ */}
        <div className="space-y-6 rounded-3xl border-2 border-line bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black text-ink-900">EUDR Kapsamında İstenen Temel Bilgiler</h2>
          
          <div className="space-y-4 text-base text-ink-700 font-medium leading-relaxed">
            <p>
              EUDR düzenlemesi, 31 Aralık 2020 tarihinden sonra ormansızlaştırılmış arazilerden elde edilen ürünlerin AB pazarına girişini kesin olarak yasaklar. İhracatçı, ürünün üretildiği tüm parsellerin coğrafi koordinatlarını (ve 4 hektardan büyükse poligon sınırlarını) AB Bilgi Sistemine beyan etmekle yükümlüdür.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-500/30 bg-brand-100/60 p-5 space-y-2">
            <div className="font-black text-brand-950 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent-green" />
              <span>Tedarikçi Durum Tespit Beyan Maddeleri:</span>
            </div>
            <ul className="list-disc pl-5 text-sm text-ink-900 space-y-1 font-semibold">
              <li>Hammadde kaynağı üretim arazisinin kesin GPS koordinatları / WGS84 poligon verisi</li>
              <li>Üretim arazisinin 31 Aralık 2020&apos;den sonra ormansızlaşmaya maruz kalmadığının uydu teyidi</li>
              <li>Menşe ülke ormancılık ve çalışma mevzuatına tam yasal uyum belgeleri</li>
              <li>Tedarik zinciri izlenebilirlik (Traceability) referans kodları ve sevk irsaliyeleri</li>
            </ul>
          </div>
        </div>

        {/* 10 KATMANLI ÇÖZÜM */}
        <div className="space-y-6 rounded-3xl border-2 border-brand-800/30 bg-brand-950 p-8 text-white shadow-xl">
          <h2 className="text-2xl font-black text-white">EUDR Tedarikçi Dosyanızı Oluşturun</h2>
          <p className="text-brand-mist text-base leading-relaxed font-medium">
            SKDMHesapla, ahşap ve tarım ihracatçıları için coğrafi konum ve tesis emisyon kayıtlarını birleştiren mühürlü bir tedarikçi uyumluluk paketi hazırlar.
          </p>
          <div className="pt-2">
            <Link
              href="/basla/"
              className="inline-flex min-h-[50px] items-center gap-2 rounded-2xl bg-brand-500 px-7 text-base font-black text-brand-950 hover:bg-brand-400 transition"
            >
              <span>EUDR Tedarikçi Dosyası Başlat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

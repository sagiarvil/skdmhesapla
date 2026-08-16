import Link from "next/link";
import {
  Battery,
  Boxes,
  Car,
  Factory,
  FileText,
  FlaskConical,
  Leaf,
  Package,
  Ship,
  Sofa,
  Shirt,
  Layers,
  Cpu,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import { CiftDalga } from "@/components/brand/CiftDalga";
import GtipArama from "@/components/GtipArama";
import { SKDM_SECTORS, type SectorBenchmark } from "@/lib/skdm/config";

const GUVEN_CHIPLERI = [
  "AB 2023/956 & 2025/2083 uyumlu",
  "Deterministik motor",
  "SHA-256 mühürlü",
] as const;

const TIER_BC_ICONS: Record<string, LucideIcon> = {
  battery: Battery,
  packaging: Package,
  food: Leaf,
  logistics: Ship,
  plastics: Boxes,
  chemicals: FlaskConical,
  glass: Droplets,
  textile: Shirt,
  machinery: Factory,
  automotive: Car,
  electronics: Cpu,
  furniture: Sofa,
  paper: FileText,
  construction: Layers,
};

export default function HomePage() {
  const tierA = Object.values(SKDM_SECTORS).filter((s) => s.tier === "A").slice(0, 6);
  const tierBC = Object.values(SKDM_SECTORS).filter((s) => s.tier === "B" || s.tier === "C");

  return (
    <div>
      {/* HERO — tek kolon, kısa, okunaklı, bölünme yok */}
      <section className="pasaport-zemin-koyu relative isolate overflow-hidden bg-brand-950">
        <div className="relative z-[1] mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center rounded-pill bg-brand-500/15 px-4 py-1.5 text-sm font-semibold text-brand-500">
            SKDM / CBAM maliyet hesaplayıcı
          </span>
          <h1 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl sm:leading-[1.15]">
            AB&apos;ye satıyorsanız, karbon dosyanız hazır olmalı.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-brand-mist sm:text-lg">
            Ürününüzü yazın, adımları izleyin; denetime hazır dosyanızı dakikalar içinde alın.
          </p>

          {/* Birincil eylem: büyük arama kutusu */}
          <div className="mt-2 w-full max-w-xl rounded-card bg-white p-4 text-left shadow-card sm:p-5">
            <GtipArama />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/basla/"
              className="inline-flex min-h-[52px] items-center rounded-ctl bg-brand-500 px-8 text-lg font-bold text-brand-900 shadow-card transition hover:bg-brand-100"
            >
              Hemen Başla
            </Link>
            <Link
              href="/nasil-calisir/"
              className="hero-ghost-border inline-flex min-h-[52px] items-center rounded-ctl px-6 text-base font-semibold text-brand-mist hover:bg-brand-500/10"
            >
              Nasıl Çalışır?
            </Link>
          </div>

          <p className="inline-flex items-center rounded-pill border border-brand-500/35 bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-500">
            Mühür öncesi her şey ücretsiz — kart istenmez.
          </p>

          <ul className="flex flex-wrap justify-center gap-2">
            {GUVEN_CHIPLERI.map((metin) => (
              <li
                key={metin}
                className="inline-flex items-center gap-1.5 rounded-pill border border-brand-500/20 bg-brand-950/50 px-3 py-1 text-xs text-brand-mist"
              >
                <span className="font-bold text-accent-green" aria-hidden>
                  ✓
                </span>
                {metin}
              </li>
            ))}
          </ul>
        </div>

        {/* Kurdele görseli: ince dekoratif şerit — ekranı bölmüyor */}
        <div className="relative z-[1] mx-auto -mb-2 w-full max-w-4xl px-6 opacity-90">
          <img
            src="/desen/hero-illus-bayrak-A-temiz.png"
            alt="AB ve Türkiye kurdeleleri"
            width={1536}
            height={976}
            decoding="async"
            className="mx-auto h-24 w-auto object-contain sm:h-32"
          />
        </div>
        <div className="relative z-[2]">
          <CiftDalga yon="asagi" dolguSinif="text-white" sinifAdi="h-14 sm:h-16" />
        </div>
      </section>

      {/* 3 ADIM ÖZETİ — 5 saniyede anlaşılır akış */}
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto grid max-w-container gap-4 px-5 sm:grid-cols-3 sm:px-6">
          {[
            { n: "1", t: "Ürününüzü seçin", d: "GTİP bilmiyorsanız ürün adını yazın — kodu biz önerelim." },
            { n: "2", t: "Adımları izleyin", d: "Her alanda ne istendiğini anlatan ipucu pencereleri var." },
            { n: "3", t: "Dosyanızı mühürleyin", d: "Ödeme yalnızca bu son adımda — tek fiyat 9.900 ₺." },
          ].map((a) => (
            <div key={a.n} className="rounded-card border border-line bg-soft-section p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-base font-bold text-brand-900">
                {a.n}
              </div>
              <div className="mt-3 text-lg font-bold text-ink-900">{a.t}</div>
              <div className="mt-1 text-sm leading-relaxed text-ink-600">{a.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* KADEME A */}
      <section className="pasaport-zemin-acik bg-soft-section py-14 sm:py-20">
        <div className="mx-auto max-w-container space-y-6 px-5 sm:px-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              SKDM zorunlu kapsam — Kademe A
            </h2>
            <p className="text-base leading-relaxed text-ink-600">
              Bu 6 sektördeyseniz alıcınız sizden veri isteyecek. Sektörünüzü seçin, dosyanızı başlatın.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tierA.map((s) => (
              <Link
                key={s.id}
                href={`/hesapla/${slugFromSectorId(s.id)}/`}
                className="rounded-card border border-line border-t-[3px] border-t-brand-500 bg-white p-5 shadow-card transition hover:border-brand-500"
              >
                <div className="text-lg font-semibold text-ink-900">{s.name}</div>
                <div className="mt-1 font-mono text-sm text-ink-600">CN: {s.cnCodes[0]}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KADEME B */}
      <section className="pasaport-zemin-acik bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-container space-y-6 px-5 sm:px-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              Kademe B — zorunlu değil ama alıcınız isteyebilir
            </h2>
            <p className="text-base leading-relaxed text-ink-600">
              Bu 14 sektör için çıktı SKDM raporu değildir; ISO 14067 mantığında tedarikçi veri
              dosyasıdır. Aynı adımlar ve aynı kalite kontrolleriyle hazırlanır.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tierBC.map((s) => (
              <KademeBcKart key={s.id} sector={s} />
            ))}
          </div>
          <Link href="/rehber/#kademe-b" className="inline-flex text-base font-semibold text-brand-800 underline">
            Kademe B rehberine git →
          </Link>
        </div>
      </section>
    </div>
  );
}

function KademeBcKart({ sector }: { sector: SectorBenchmark }) {
  const Icon = TIER_BC_ICONS[sector.id] || Package;
  return (
    <Link
      href="/rehber/#kademe-b"
      className="flex gap-3 rounded-card border border-line bg-brand-100/40 p-4 transition hover:border-brand-800"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-800" strokeWidth={1.5} aria-hidden />
      <div>
        <div className="text-sm font-semibold text-ink-900">{sector.name}</div>
        <div className="mt-0.5 text-xs text-ink-600">Alıcı talebine bağlı · tedarikçi veri dosyası</div>
      </div>
    </Link>
  );
}

function slugFromSectorId(id: string): string {
  const map: Record<string, string> = {
    "iron-steel": "demir-celik",
    aluminum: "aluminyum",
    cement: "cimento",
    fertilizer: "gubre",
    electricity: "elektrik",
    hydrogen: "hidrojen",
  };
  return map[id] || id;
}

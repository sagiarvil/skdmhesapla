"use client";

import Link from "next/link";
import {
  BatteryHigh,
  Package,
  Leaf,
  Boat,
  Flask,
  Drop,
  TShirt,
  Factory,
  Car,
  Cpu,
  Armchair,
  FileText,
  Stack,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  type Icon,
} from "@phosphor-icons/react";
import GtipArama from "@/components/GtipArama";
import { SKDM_SECTORS, type SectorBenchmark } from "@/lib/skdm/config";

const TIER_BC_ICONS: Record<string, Icon> = {
  battery: BatteryHigh,
  packaging: Package,
  food: Leaf,
  logistics: Boat,
  plastics: Package,
  chemicals: Flask,
  glass: Drop,
  textile: TShirt,
  machinery: Factory,
  automotive: Car,
  electronics: Cpu,
  furniture: Armchair,
  paper: FileText,
  construction: Stack,
};

/** Kademe B/C sektör kimliği → Türkçe URL (SEO + /hesapla/ rotasıyla birebir aynı olmalı) */
const TIER_BC_SLUGS: Record<string, string> = {
  battery: "batarya",
  packaging: "ambalaj",
  food: "gida",
  logistics: "lojistik",
  plastics: "plastik",
  chemicals: "kimya",
  glass: "cam",
  textile: "tekstil",
  machinery: "makine",
  automotive: "otomotiv",
  electronics: "elektronik",
  furniture: "mobilya",
  paper: "kagit",
  construction: "yapi",
};

export default function BaslaPage() {
  const tierA = Object.values(SKDM_SECTORS).filter((s) => s.tier === "A").slice(0, 6);
  const tierBC = Object.values(SKDM_SECTORS).filter((s) => s.tier === "B" || s.tier === "C");

  return (
    <div className="pasaport-zemin-acik min-h-screen bg-gradient-to-b from-[#f7faf4] via-[#edf4e4] to-white text-ink-900 pb-20">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-20 space-y-12">
        {/* HERO BAŞLIK */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            SKDM ve Tedarikçi Veri Giriş Konsolu
          </span>
          <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-ink-900 sm:text-6xl sm:leading-[1.1]">
            Dosyanızı başlatalım.
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-semibold leading-relaxed text-ink-700 sm:text-xl">
            Ürününüzü arayın veya sektörünüzü seçin. Bilgilerinizi girip mühürlü paketinizi oluşturun — mühür öncesi her şey ücretsizdir.
          </p>
        </div>

        {/* GTİP CANLI ARAMA KUTUSU */}
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-brand-800/25 bg-white p-6 shadow-2xl sm:p-8">
          <GtipArama />
        </div>

        {/* AYRAÇ */}
        <div className="mx-auto flex max-w-3xl items-center gap-4 text-sm font-extrabold uppercase tracking-wider text-ink-600">
          <span className="h-0.5 flex-1 bg-line" />
          <span>veya sektörünüzü seçin</span>
          <span className="h-0.5 flex-1 bg-line" />
        </div>

        {/* 2 KOLONLU SEKTÖR SEÇİM KARTLARI */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* KADEME A: SKDM ZORUNLU 6 SEKTÖR */}
          <section className="flex flex-col justify-between rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-black text-brand-900 border border-brand-500/40">
                  Kademe A — Zorunlu Kapsam
                </span>
              </div>
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">
                AB SKDM Kapsamındaki 6 Ana Sektör
              </h2>
              <p className="text-base font-medium leading-relaxed text-ink-700">
                Demir-çelik, alüminyum, çimento, gübre, elektrik veya hidrojen üretiyorsanız; AB CBAM mevzuatı gereği resmi veri beyanı zorunludur.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {tierA.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/hesapla/${slugFromSectorId(s.id)}/`}
                    className="group flex items-center justify-between rounded-2xl border-2 border-brand-800/20 bg-[#f8fbf9] p-4 text-base font-black text-ink-900 shadow-sm transition-all hover:border-brand-800 hover:bg-brand-100/60 hover:scale-[1.01]"
                  >
                    <span className="group-hover:text-brand-900">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-white px-2 py-1 font-mono text-xs font-bold text-ink-700 border border-line">
                        CN: {s.cnCodes[0]}
                      </span>
                      <ArrowRight className="h-5 w-5 text-brand-800 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* KADEME B: 14 TEDARİKÇİ VERİ SEKTÖRÜ */}
          <section className="flex flex-col justify-between rounded-3xl border-2 border-brand-800/25 bg-white p-7 shadow-xl sm:p-9">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent-green/15 px-3 py-1 text-xs font-black text-brand-900 border border-accent-green/30">
                  Kademe B — ISO 14067 Standardı
                </span>
              </div>
              <h2 className="text-2xl font-black text-ink-900 sm:text-3xl">
                Alıcınızın Veri İstediği Diğer Sektörler
              </h2>
              <p className="text-base font-medium leading-relaxed text-ink-700">
                Doğrudan SKDM kapsamında değilsiniz ama alıcınız CSRD, PPWR veya Pil Tüzüğü için karbon ve tesis verisi talep ediyorsa bu şablonları kullanın.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tierBC.map((s) => {
                const IconComp = TIER_BC_ICONS[s.id] || Package;
                const slug = TIER_BC_SLUGS[s.id] || slugFromSectorId(s.id);
                return (
                  <li key={s.id}>
                    <Link
                      href={`/hesapla/${slug}/`}
                      className="group flex items-center justify-between rounded-2xl border-2 border-brand-800/15 bg-[#f8fbf9] p-3 text-sm font-bold text-ink-900 shadow-sm transition-all hover:border-brand-800 hover:bg-brand-100/60 hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconComp className="h-5 w-5 text-brand-800 shrink-0" weight="duotone" />
                        <span className="truncate group-hover:text-brand-900 font-extrabold">{s.name}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-brand-800 shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* ALT GÜVEN BİLGİLENDİRMESİ */}
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 rounded-full border-2 border-accent-green/40 bg-accent-green/10 px-6 py-3 text-sm font-black text-ink-900 shadow-sm sm:text-base text-center">
          <CheckCircle className="h-5 w-5 text-accent-green shrink-0" weight="duotone" />
          <span>Tüm veri girişleri ve kalite kontrolleri ücretsizdir. Kart istenmez.</span>
        </div>
      </div>
    </div>
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

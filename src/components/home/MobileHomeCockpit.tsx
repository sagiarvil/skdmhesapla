"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Cpu,
  Layers,
  Building2,
  Sprout,
  Zap,
  ChevronDown,
  Lock,
  Server,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import GtipArama from "@/components/GtipArama";
import { PADDLE_SEAL_PRICE_TRY } from "@/lib/skdm/config";

const SECTORS = [
  { slug: "demir-celik", label: "Demir-Çelik", icon: Layers, code: "7201-7326" },
  { slug: "aluminyum", label: "Alüminyum", icon: Building2, code: "7601-7616" },
  { slug: "cimento", label: "Çimento", icon: Building2, code: "2507-2523" },
  { slug: "gubre", label: "Gübre", icon: Sprout, code: "2808-3105" },
  { slug: "elektrik", label: "Elektrik", icon: Zap, code: "2716 00 00" },
  { slug: "hidrojen", label: "Hidrojen", icon: Zap, code: "2804 10 00" },
] as const;

const QUICK_GTIPS = [
  { gtip: "7208", label: "Sıcak Haddelenmiş Sac" },
  { gtip: "7601", label: "İşlenmemiş Alüminyum" },
  { gtip: "2523", label: "Çimento Klinkeri" },
  { gtip: "3102", label: "Azotlu Mineral Gübre" },
];

const MOBILE_FAQS = [
  {
    q: "AB müşterim CBAM raporu istedi, ne yapmalıyım?",
    a: "Önce ihraç ettiğiniz ürünün GTİP/CN kodunun CBAM kapsamında olup olmadığını kontrol edin. Kapsamdaysa, tesisinizin elektrik, yakıt ve girdi tüketim verilerini girerek resmi Communication Template formatında rapor üretin.",
  },
  {
    q: "Ücret ne zaman alınır?",
    a: "GTİP kapsam kontrolü, veri girişi ve hesaplama hazırlığı tamamen ücretsizdir. Yalnızca 12 parçalı resmi mühürlü arşiv paketini indirmek istediğinizde tek seferlik 9.900 ₺ (KDV Dahil) ödenir.",
  },
  {
    q: "Doğrulama (Verification) zorunlu mu?",
    a: "2026 yılından itibaren akredite doğrulayıcı denetimi zorunludur. SKDMHesapla, doğrulayıcının talep edeceği hesap izi, formül dökümü ve kaynak kanıtlarını eksiksiz paketler.",
  },
  {
    q: "50 ton muafiyeti kimleri kapsar?",
    a: "Yıllık net sevkiyatı 50 tonun altında kalan bazı alıcılar için geçici istisnalar bulunsa da AB ithalatçıları tedarikçi emisyon verisini şeffaf olarak talep etmektedir.",
  },
];

export function MobileHomeCockpit() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col bg-[#0c1409] text-white">
      {/* 1. TOP MISSION STATUS HUD */}
      <div className="sticky top-[57px] z-30 flex items-center justify-between border-b border-white/10 bg-[#0f190a]/95 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
            2026 AB SKDM MOTORU
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
          <Server className="h-3 w-3 text-emerald-400" />
          <span>Frankfurt AB Güvencesi</span>
        </div>
      </div>

      {/* 2. HERO COCKPIT HEADER */}
      <section className="relative overflow-hidden px-4 pt-6 pb-8">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute top-10 -right-20 h-56 w-56 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-lime-300">
            <Sparkles className="h-3 w-3" />
            Türk İhracatçısı İçin Doğrudan Çözüm
          </div>

          <h1 className="mt-3.5 text-[28px] font-black leading-[1.15] tracking-tight text-white">
            AB Müşteriniz <span className="text-[#bdd652]">CBAM Raporu</span> mu İstedi?
          </h1>

          <p className="mt-3 text-[13.5px] font-medium leading-snug text-slate-300">
            Tahminlerle değil; fabrikanızın gerçek elektrik ve yakıt verileriyle,
            resmî <strong className="text-white">Communication Template</strong> formatında
            denetime hazır 12 parçalı mühürlü dosya hazırlayın.
          </p>

          {/* QUICK TELEMETRY METRICS HUD */}
          <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-base font-black text-[#bdd652]">569</span>
              <span className="text-[10px] font-bold text-slate-400">CN / GTİP Kodu</span>
            </div>
            <div className="flex flex-col border-x border-white/10">
              <span className="text-base font-black text-emerald-400">12 Dosya</span>
              <span className="text-[10px] font-bold text-slate-400">Denetim Arşivi</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-lime-300">SHA-256</span>
              <span className="text-[10px] font-bold text-slate-400">Kripto Mühür</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GTIP INSTANT SCANNER (MICRO-CARD) */}
      <section className="px-4 pb-6">
        <div className="rounded-2xl border-2 border-[#bdd652]/30 bg-white p-4 text-ink-900 shadow-2xl shadow-black/40">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#305018]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#213110]">
                GTİP Kapsam Kontrolü
              </span>
            </div>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9.5px] font-black text-emerald-900">
              ÜCRETSİZ
            </span>
          </div>

          <p className="mb-3 text-[11.5px] font-medium leading-tight text-ink-600">
            Ürününüzün 4 veya 8 haneli GTİP kodunu girerek CBAM kapsamını anında sorgulayın:
          </p>

          <GtipArama />

          {/* Quick Filter Chips */}
          <div className="mt-3.5 pt-3 border-t border-line/60">
            <span className="text-[10px] font-bold uppercase text-ink-400 tracking-wider block mb-1.5">
              Sık Sorgulanan Ürünler:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_GTIPS.map((chip) => (
                <Link
                  key={chip.gtip}
                  href={`/gtip/${chip.gtip}/`}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-slate-50 px-2 py-1 text-[11px] font-bold text-ink-800 transition hover:border-[#bdd652] hover:bg-lime-50"
                >
                  <span className="font-mono text-emerald-800">{chip.gtip}</span>
                  <span className="text-ink-500">· {chip.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4-ADIMDA HAP AKIŞ (COCKPIT STEP FLOW) */}
      <section className="border-t border-white/10 bg-[#0a1107] px-4 py-7">
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#bdd652]">
            İŞLEYİŞ PROTOKOLÜ
          </span>
          <h2 className="mt-1 text-lg font-black text-white">4 Adımda Denetime Hazır Paket</h2>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#bdd652] text-xs font-black text-[#213110]">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">GTİP Kapsamınızı Doğrulayın</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">
                569 resmî CN kodunda ürününüzün Kapsam 1 ve 2 sınırlarını ücretsiz test edin.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#bdd652] text-xs font-black text-[#213110]">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Tesis Verilerini Girin</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">
                Doğrudan yakıt, elektrik faturası ve öncül madde tüketim miktarlarınızı işleyin.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#bdd652] text-xs font-black text-[#213110]">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Deterministik Hesap İzi Alın</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">
                AB formüllerine göre özgül gömülü emisyonu (tCO2e/t) şeffaf olarak hesaplayın.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#bdd652]/40 bg-[#bdd652]/10 p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#bdd652] text-xs font-black text-[#213110]">
              4
            </div>
            <div>
              <h3 className="text-xs font-bold text-lime-300">12 Parçalı Mühürlü Arşivi İndirin</h3>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-200">
                Resmi Communication Template XLSX, SHA-256 bütünlük özeti ve kanıt kütüğü anında hazır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 6 TEMEL SEKTÖR KOKPİT SEÇİCİ */}
      <section className="border-t border-white/10 bg-[#0f190a] px-4 py-7">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#bdd652]">
              SEKTÖREL REHBERLER
            </span>
            <h2 className="mt-0.5 text-base font-black text-white">6 Temel CBAM Sektörü</h2>
          </div>
          <Link href="/basla/" className="text-[11px] font-bold text-[#bdd652] hover:underline">
            Tümü →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SECTORS.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.slug}
                href={`/sektor/${sec.slug}/`}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 transition active:scale-[0.98] hover:border-[#bdd652]/50 hover:bg-white/[0.08]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#bdd652]/20 text-[#bdd652]">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-white">{sec.label}</div>
                  <div className="font-mono text-[9.5px] text-slate-400">{sec.code}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. DANIŞMANLIK VS SKDMHESAPLA ROZETİ */}
      <section className="border-t border-white/10 bg-gradient-to-b from-[#0a1107] to-[#12200c] px-4 py-7">
        <div className="rounded-2xl border border-lime-500/30 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-lime-400">
              NEDEN SKDMHESAPLA?
            </span>
            <span className="rounded-full bg-[#bdd652] px-2 py-0.5 text-[9.5px] font-black text-[#213110]">
              SABİT {PADDLE_SEAL_PRICE_TRY.toLocaleString("tr-TR")} ₺
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#bdd652] mt-0.5" />
              <div>
                <strong className="text-white">Aynı Gün Teslim:</strong> Haftalarca süren danışmanlık görüşmeleri yerine verinizi girip saatler içinde dosyanızı alın.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#bdd652] mt-0.5" />
              <div>
                <strong className="text-white">Resmi Formata Uyumlu:</strong> Avrupa Komisyonu Communication Template veri alanlarıyla birebir eşleşir.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#bdd652] mt-0.5" />
              <div>
                <strong className="text-white">Kriptografik SHA-256:</strong> Veri bütünlüğü matematiksel olarak mühürlenir, sonradan değiştirilemez.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Kapsam testi ücretsizdir</span>
            <Link
              href="/basla/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#bdd652] px-3.5 py-1.5 text-xs font-black text-[#213110] shadow hover:bg-lime-300"
            >
              Hemen Başla <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. MOBİL HAP SSS AKORDEONU */}
      <section className="border-t border-white/10 bg-[#0f190a] px-4 py-7">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-[#bdd652]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Sıkça Sorulan Sorular
            </h2>
          </div>
          <Link href="/sss/" className="text-[11px] font-bold text-[#bdd652] hover:underline">
            Tüm SSS →
          </Link>
        </div>

        <div className="space-y-2">
          {MOBILE_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-3 text-left text-xs font-bold text-white transition hover:bg-white/[0.05]"
                  aria-expanded={isOpen}
                >
                  <span className="pr-2">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#bdd652] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/5 bg-black/20 p-3 text-[11.5px] font-medium leading-relaxed text-slate-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FRANKFURT GÜVENLİK VE MÜHÜR ROZETİ */}
      <section className="border-t border-white/10 bg-[#080e05] px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Frankfurt AWS / Hetzner AB Veri Güvencesi</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-500">
          Verileriniz KVKK ve GDPR uyumlu olarak Avrupa Birliği sınırları içinde saklanır.
        </p>

        <div className="mt-5">
          <Link
            href="/basla/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bdd652] py-3 text-sm font-black text-[#213110] shadow-lg shadow-[#bdd652]/20 active:scale-[0.98]"
          >
            Ücretsiz GTİP Kontrolü Yap <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

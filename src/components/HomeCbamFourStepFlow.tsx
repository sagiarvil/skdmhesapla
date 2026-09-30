import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileCheck2,
  FileSpreadsheet,
  Factory,
  Search,
  Zap,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function HomeCbamFourStepFlow() {
  return (
    <section className="border-b border-line bg-[#f8faf7] py-10 sm:py-16" aria-labelledby="cbam-four-step-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* N8N CANVAS CONTAINER */}
        <div className="relative overflow-hidden rounded-[32px] border-2 border-[#d5e2d1] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_24px_64px_rgba(20,45,30,.08)]">
          {/* Canvas Dot Grid Background */}
          <div className="pointer-events-none absolute inset-0 n8n-canvas-grid-emerald opacity-65" />

          {/* Canvas Header / Telemetry Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2ece0] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-black tracking-wide text-emerald-900 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 beacon-pulse-dot" />
                <span>OTOMASYON HATTI &bull; 4 FAZLI DOĞRULAMA DAG</span>
              </div>
              <h2 id="cbam-four-step-title" className="mt-3 text-2xl sm:text-4xl font-black leading-tight tracking-tight text-[#0a1826]">
                “CBAM Raporunu Gönderin” Talebini Otomasyon Hattında Yönetin
              </h2>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-line bg-[#f4f7f2] px-3.5 py-2 text-xs font-bold text-ink-700 shadow-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>15 Kontrollü Mikro Adım &bull; Sıfır Hata Toleransı</span>
            </div>
          </div>

          <p className="relative z-10 mt-4 max-w-3xl text-sm sm:text-base font-medium leading-relaxed text-[#506054]">
            Karmaşık AB CBAM tüzüğü arka planda 4 deterministik otomasyon düğümünde işlenir: GTİP kapsam tespiti, tesis-enerji-precursor veri zinciri, Annex IV çoklu hesaplama motoru ve akredite doğrulayıcı teslim paketi.
          </p>

          {/* =========================================================================
              N8N WORKFLOW GRAPH (DESKTOP & RESPONSIVE GRID WITH ANIMATED CONNECTIONS)
              ========================================================================= */}
          <div className="relative z-10 mt-8 grid gap-6 lg:grid-cols-4 items-stretch">
            {/* SVG Interactive Animated Connection Lines (Desktop Overlay) */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 hidden lg:block h-12 z-0">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 60">
                <defs>
                  <linearGradient id="dagLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="35%" stopColor="#0284C7" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                {/* Background cable trace */}
                <path d="M 120 30 L 880 30" stroke="rgba(200, 215, 205, 0.6)" strokeWidth="3" fill="none" />
                {/* Active animated flow cable */}
                <path d="M 120 30 L 880 30" stroke="url(#dagLineGradient)" strokeWidth="3.5" fill="none" className="cable-anim-flow" />
                {/* Moving glowing particle */}
                <circle r="4.5" fill="#10B981" filter="drop-shadow(0 0 6px #10B981)">
                  <animateMotion path="M 120 30 L 880 30" dur="3.2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>

            {/* DÜĞÜM 1: TETİKLEYİCİ (EMERALD) */}
            <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-emerald-300 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-emerald-500">
              {/* Node Header */}
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                      <Search className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Tetikleyici (Trigger)</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">Adım 01</span>
                </div>
                <h3 className="mt-3 text-base font-black text-[#0f241a]">
                  GTİP &amp; CN Kapsam Doğrulaması
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-[#506054]">
                  8 haneli CN/GTİP kodunu doğrular, 50 ton eşik muafiyetini tartar ve ürünü doğru CBAM rotasına sevk eder.
                </p>
                <div className="mt-3 rounded-xl bg-emerald-50/80 p-2.5 text-[11px] font-bold text-emerald-900 border border-emerald-200/60">
                  ⚡ Çıktı: Doğrulanmış Sektör &amp; Karar Raporu
                </div>
              </div>

              {/* Node Connector Pins */}
              <div className="mt-4 flex items-center justify-between border-t border-emerald-100 pt-3 text-[11px] font-bold text-emerald-800">
                <span>Giriş: İhracatçı Talebi</span>
                <span className="inline-flex items-center gap-1 text-emerald-700">Port Out →</span>
              </div>
            </div>

            {/* DÜĞÜM 2: VERİ TOPLAMA VE PRECURSOR (SKY BLUE) */}
            <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-sky-300 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-sky-500">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-sky-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-xs">
                      <Factory className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">Veri Ayrıştırma</span>
                  </div>
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-black text-sky-800">Adım 02</span>
                </div>
                <h3 className="mt-3 text-base font-black text-[#0c2333]">
                  Tesis, Enerji &amp; Precursor Zinciri
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-[#506054]">
                  Elektrik faturaları, proses yakıtı (doğalgaz/kömür), üretim tonajı ve alt tedarikçi hammadde verilerini toplar.
                </p>
                <div className="mt-3 rounded-xl bg-sky-50/80 p-2.5 text-[11px] font-bold text-sky-900 border border-sky-200/60">
                  ⚙️ Çıktı: Yapılandırılmış Emisyon Girdileri
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-sky-100 pt-3 text-[11px] font-bold text-sky-800">
                <span>← Port In</span>
                <span className="inline-flex items-center gap-1 text-sky-700">Port Out →</span>
              </div>
            </div>

            {/* DÜĞÜM 3: ÇOKLU HESAPLAMA MOTORU (AMBER / ORANGE) */}
            <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-amber-300 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-amber-500">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white shadow-xs">
                      <Cpu className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">Hesaplama &amp; QC</span>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">Adım 03</span>
                </div>
                <h3 className="mt-3 text-base font-black text-[#311f0a]">
                  Çoklu Model &amp; Hata Avcısı Motoru
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-[#506054]">
                  Annex IV kurallarıyla doğrudan ve dolaylı gömülü emisyonları hesaplar; varsayılan değer sapmalarını denetler.
                </p>
                
                {/* 3'lü Motor Dallanması (Image 4-5 Cloud Branching Tarzı) */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50/90 px-2 py-1 text-[10.5px] font-bold text-amber-900 border border-amber-200/50">
                    <Sparkles className="h-3 w-3 text-amber-600" />
                    <span>Annex IV Emisyon Formülü</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50/90 px-2 py-1 text-[10.5px] font-bold text-amber-900 border border-amber-200/50">
                    <ShieldCheck className="h-3 w-3 text-amber-600" />
                    <span>Varsayılan Değer Risk Filtresi</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-amber-100 pt-3 text-[11px] font-bold text-amber-800">
                <span>← Port In</span>
                <span className="inline-flex items-center gap-1 text-amber-700">Port Out →</span>
              </div>
            </div>

            {/* DÜĞÜM 4: RESMİ ÇIKTI & DOĞRULAYICI TESLİM (VIOLET) */}
            <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-violet-300 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-violet-500">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-violet-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-xs">
                      <FileSpreadsheet className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-violet-800">Resmi Çıktı</span>
                  </div>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-800">Adım 04</span>
                </div>
                <h3 className="mt-3 text-base font-black text-[#200f33]">
                  Communication Template &amp; XML
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-[#506054]">
                  AB alıcısı için resmi Excel şablonu, XML veri çıktısı ve bağımsız denetçi için kriptografik kanıt dosyasını üretir.
                </p>
                <div className="mt-3 rounded-xl bg-violet-50/80 p-2.5 text-[11px] font-bold text-violet-900 border border-violet-200/60">
                  🏆 Çıktı: Doğrulamaya Hazır Paket
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-violet-100 pt-3 text-[11px] font-bold text-violet-800">
                <span>← Port In</span>
                <span className="inline-flex items-center gap-1 text-violet-700">Mühürlü Teslim ✅</span>
              </div>
            </div>
          </div>

          {/* ALT TERMINAL BİLGİ BANDI */}
          <div className="relative z-10 mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-white to-sky-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f241a] text-emerald-400 font-bold shadow-sm">
                <Check className="h-5 w-5" />
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#183023]">
                Her faz bağımsız çalışır; hesaplama motoru geriye dönük denetim izini SHA-256 bütünlük kontrolü ile kilitler.
              </p>
            </div>
            <Link
              href="/nasil-calisir/"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0a1826] px-5 text-xs sm:text-sm font-black text-white shadow-md transition hover:bg-[#132d47]"
            >
              15 Mikro Adımı İnceleyin <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

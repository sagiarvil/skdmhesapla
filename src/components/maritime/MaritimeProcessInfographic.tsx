import React from "react";
import Link from "next/link";
import {
  Ship,
  Compass,
  FileCheck2,
  Download,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Anchor,
  Activity,
} from "lucide-react";

export function MaritimeProcessInfographic() {
  const steps = [
    {
      number: "01",
      nodeType: "TETİKLEYİCİ · GİRİŞ",
      title: "Gemi & DOC Şirket Profili",
      duration: "Doğrulama",
      badge: "IMO Checksum Doğrulaması",
      badgeColor: "bg-cyan-100 text-cyan-900 border-cyan-300",
      icon: Ship,
      borderColor: "border-cyan-300 hover:border-cyan-500",
      iconBg: "bg-cyan-600 text-white",
      accentText: "text-cyan-800",
      description:
        "IMO numaranızı, gemi adını, tonajını ve akredite doğrulayıcınızı (DNV, Bureau Veritas, RINA, ABS vb.) seçin.",
      benefits: [
        "Resmi IMO kontrol basamağı formülü (Res. A.1078(28)) yanlış girişleri engeller.",
        "Yetkili İdareci Makam (Yunanistan, İtalya, Almanya vb.) otomatik eşlenir.",
      ],
      portIn: "IMO Girdisi",
      portOut: "Port Out →",
    },
    {
      number: "02",
      nodeType: "VERİ AYRIŞTIRMA",
      title: "Sefer & Bunker (BDN) Ayrıştırma",
      duration: "Hesaplama",
      badge: "Mevzuat Karar Ağacı",
      badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
      icon: Compass,
      borderColor: "border-teal-300 hover:border-teal-500",
      iconBg: "bg-teal-600 text-white",
      accentText: "text-teal-800",
      description:
        "Türk limanlarından (Ambarlı, Mersin vb.) AB limanlarına (Rotterdam, Pire vb.) yapılan seferleri ve yakıt miktarını girin.",
      benefits: [
        "Direktif 2023/957 gereği TR-AB seferlerindeki %50 emisyon kuralı ayrılır.",
        "Türkçe ve uluslararası sayı formatları deterministik hassasiyetle işlenir.",
      ],
      portIn: "← Port In",
      portOut: "Port Out →",
    },
    {
      number: "03",
      nodeType: "DUAL HESAPLAMA ÇEKİRDEĞİ",
      title: "ETS Karbon Açığı & FuelEU",
      duration: "Denetim İzi",
      badge: "Tam Şeffaf Hesaplama İzi",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      icon: Activity,
      borderColor: "border-blue-300 hover:border-blue-500",
      iconBg: "bg-blue-600 text-white",
      accentText: "text-blue-800",
      description:
        "EU ETS karbon açığı (%70 phase-in) ve FuelEU sera gazı yoğunluğu (gCO₂e/MJ) ceza maruziyetini detaylı inceleyin.",
      benefits: [
        "Nihai onay öncesinde raporun tüm matematiksel ara ve nihai değerleri listelenir.",
        "Raporu hem Türkçe hem İngilizce olarak modalda denetleyin ve doğrulayın.",
      ],
      portIn: "← Port In",
      portOut: "Port Out →",
    },
    {
      number: "04",
      nodeType: "MÜHÜRLÜ ÇIKTI",
      title: "6 Parçalık Resmi Teknik Paket",
      duration: "Mühürlü Paket",
      badge: "Klas Denetimine Hazır",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      icon: Download,
      borderColor: "border-emerald-300 hover:border-emerald-500",
      iconBg: "bg-emerald-600 text-white",
      accentText: "text-emerald-800",
      description:
        "Paddle PCI-DSS Seviye 1 güvencesiyle tek seferlik 599 USD lisanslama ile tüm resmi çıktı setini indirin.",
      benefits: [
        "İngilizce & Türkçe Pro Premium PDF'ler, EMSA THETIS XML ve FuelEU JSON tek pakette.",
        "Kriptografik SHA-256 bütünlük manifestosu ile klas doğrulayıcısına sunulmaya hazır.",
      ],
      portIn: "← Port In",
      portOut: "Mühürlendi ✅",
    },
  ];

  return (
    <section className="border-t border-line bg-gradient-to-b from-[#f5f9fc] via-white to-[#f0f6fa] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* N8N CANVAS CONTAINER */}
        <div className="relative overflow-hidden rounded-[32px] border-2 border-cyan-200/80 bg-white p-5 sm:p-8 lg:p-10 shadow-[0_24px_64px_rgba(6,182,212,.08)]">
          {/* Canvas Dot Grid Background */}
          <div className="pointer-events-none absolute inset-0 n8n-canvas-grid-cyan opacity-50" />

          {/* Canvas Header / Telemetry Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-3.5 py-1 text-xs font-black tracking-wide text-cyan-900 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-cyan-500 beacon-pulse-dot" />
                <span>DENİZCİLİK ETS &bull; N8N OTOMASYON VE KLAS AKIŞI</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black leading-tight tracking-tight text-[#0a1b2a]">
                Gemi ve Sefer Verilerinden Doğrulama Dosyasına: 4 Aşamalı Denizcilik DAG
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50/60 px-3.5 py-2 text-xs font-bold text-cyan-900 shadow-xs">
              <Anchor className="h-4 w-4 text-cyan-700" />
              <span>THETIS-MRV &bull; FuelEU Maritime Deterministik Formülleri</span>
            </div>
          </div>

          <p className="relative z-10 mt-4 max-w-3xl text-sm sm:text-base font-medium leading-relaxed text-[#405668]">
            THETIS-MRV ve FuelEU Maritime kuralları kapsamında sefer kayıtları, bunker belgeleri (BDN) ve liman operasyonları otomasyon hattında işlenir; akredite klas denetimine (DNV, BV, RINA vb.) tam uyumlu teknik paket üretilir.
          </p>

          {/* =========================================================================
              N8N WORKFLOW GRAPH (DESKTOP & RESPONSIVE GRID WITH ANIMATED CONNECTIONS)
              ========================================================================= */}
          <div className="relative z-10 mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
            {/* SVG Interactive Animated Connection Lines (Desktop Overlay) */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 hidden lg:block h-12 z-0">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 60">
                <defs>
                  <linearGradient id="maritimeDagGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="35%" stopColor="#0D9488" />
                    <stop offset="70%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                {/* Background cable trace */}
                <path d="M 120 30 L 880 30" stroke="rgba(207, 222, 233, 0.6)" strokeWidth="3" fill="none" />
                {/* Active animated flow cable */}
                <path d="M 120 30 L 880 30" stroke="url(#maritimeDagGradient)" strokeWidth="3.5" fill="none" className="cable-anim-flow-fast" />
                {/* Moving glowing particle */}
                <circle r="4.5" fill="#06B6D4" filter="drop-shadow(0 0 6px #06B6D4)">
                  <animateMotion path="M 120 30 L 880 30" dur="2.4s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>

            {/* 4 DÜĞÜM KARTLARI */}
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`group relative z-10 flex flex-col justify-between rounded-2xl border-2 ${step.borderColor} bg-white p-5 shadow-xs hover:shadow-lg transition-all duration-300`}
                >
                  <div>
                    {/* Üst Düğüm Tipi & Numara */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-xs ${step.iconBg}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${step.accentText}`}>
                          {step.nodeType}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-black text-[#0f2130] leading-snug">
                      {step.title}
                    </h3>

                    {/* Kategori Rozeti */}
                    <div className="mt-2.5">
                      <span className={`inline-block rounded-md border px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs font-medium leading-relaxed text-[#506677]">
                      {step.description}
                    </p>

                    {/* Faydalar */}
                    <ul className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-700">
                      {step.benefits.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-600" />
                          <span className="leading-tight">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Port Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10.5px] font-bold text-slate-600">
                    <span>{step.portIn}</span>
                    <span className="font-semibold text-cyan-800">{step.portOut}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alt Bilgi Bandı */}
          <div className="relative z-10 mt-8 rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50/80 via-white to-teal-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a1e30] text-cyan-400 font-bold shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#102d42]">
                DNV, Bureau Veritas, RINA ve ABS gibi tüm IACS üyesi bağımsız doğrulayıcılar için resmi XML ve kanıt dizini tek tıkla mühürlenir.
              </p>
            </div>
            <Link
              href="/denizcilik/#hesaplayici"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#091b2c] px-5 text-xs sm:text-sm font-black text-white shadow-md transition hover:bg-[#133252]"
            >
              Denizcilik Hesaplayıcısını Başlat <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

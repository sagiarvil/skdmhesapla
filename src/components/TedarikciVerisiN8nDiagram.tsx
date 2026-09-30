import React from "react";
import {
  FileText,
  Users,
  Cpu,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";

export function TedarikciVerisiN8nDiagram() {
  const nodes = [
    {
      step: "01",
      type: "TETİKLEYİCİ (TRIGGER)",
      title: "AB Müşteri Veri Talebi",
      subtitle: "CSRD, PPWR, Pil veya EUDR",
      desc: "AB'li ana alıcı firmanın gönderdiği emisyon, geri dönüştürülmüş içerik veya menşe koordinat anketi tetiklenir.",
      badge: "Girdi Bildirimi",
      badgeColor: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300",
      borderColor: "border-fuchsia-300 hover:border-fuchsia-500",
      icon: FileText,
      iconBg: "bg-fuchsia-600 text-white",
      tagColor: "text-fuchsia-800",
      portIn: "Talep Girdisi",
      portOut: "Port Out →",
    },
    {
      step: "02",
      type: "VERİ TOPLAMA PORTALI",
      title: "Tesis & Malzeme Girdileri",
      subtitle: "Tedarikçi Dijital Formu",
      desc: "Ürün ağırlığı, malzeme kompozisyonu, ambalaj tipi ve tesis elektrik/proses tüketimleri yapılandırılmış girilir.",
      badge: "Kapsam 3 Havuzu",
      badgeColor: "bg-violet-100 text-violet-900 border-violet-300",
      borderColor: "border-violet-300 hover:border-violet-500",
      icon: Users,
      iconBg: "bg-violet-600 text-white",
      tagColor: "text-violet-800",
      portIn: "← Port In",
      portOut: "Port Out →",
    },
    {
      step: "03",
      type: "HESAPLAMA & EŞLEŞTİRME",
      title: "ISO 14067 & DPP Motoru",
      subtitle: "Çoklu Mevzuat Filtresi",
      desc: "Yaşam döngüsü karbon ayak izi hesaplanır; ESPR Dijital Ürün Pasaportu ve PPWR geri dönüşüm eşikleri taranır.",
      badge: "Çoklu Model Motoru",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      borderColor: "border-purple-300 hover:border-purple-500",
      icon: Cpu,
      iconBg: "bg-purple-600 text-white",
      tagColor: "text-purple-800",
      portIn: "← Port In",
      portOut: "Port Out →",
    },
    {
      step: "04",
      type: "KALİTE KONTROL (QC)",
      title: "Otomasyon & Anomali Filtresi",
      subtitle: "Sıfır Tutarsızlık Kapısı",
      desc: "Alıcının reddetmesine neden olabilecek birim hataları, aşırı sapmalar ve eksik alanlar otomatik olarak düzeltilir.",
      badge: "Hata Avcısı",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      borderColor: "border-amber-300 hover:border-amber-500",
      icon: ShieldCheck,
      iconBg: "bg-amber-600 text-white",
      tagColor: "text-amber-800",
      portIn: "← Port In",
      portOut: "Port Out →",
    },
    {
      step: "05",
      type: "MÜHÜRLÜ ÇIKTI",
      title: "Tedarikçi Beyan Dosyası",
      subtitle: "Alıcıya Teslim Edilebilir Handoff",
      desc: "AB denetçisinin talep ettiği formatta doğrulanabilir PDF/Excel raporu ve kriptografik SHA-256 doğrulama paketi üretilir.",
      badge: "Teslime Hazır",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      borderColor: "border-emerald-300 hover:border-emerald-500",
      icon: PackageCheck,
      iconBg: "bg-emerald-600 text-white",
      tagColor: "text-emerald-800",
      portIn: "← Port In",
      portOut: "Mühürlendi ✅",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[32px] border-2 border-violet-200/80 bg-white p-5 sm:p-8 lg:p-10 shadow-[0_24px_64px_rgba(139,92,246,.08)]">
      {/* n8n Violet Canvas Grid */}
      <div className="pointer-events-none absolute inset-0 n8n-canvas-grid-violet opacity-50" />

      {/* Telemetry Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-violet-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-3.5 py-1 text-xs font-black tracking-wide text-violet-900 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-violet-500 beacon-pulse-dot" />
            <span>KÜRESEL TEDARİK ZİNCİRİ &bull; N8N VERİ DOĞRULAMA HATTI</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[#1e1035]">
            Tedarikçi Veri Taleplerini Yöneten 5 Düğümlü Otomasyon DAG
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/60 px-3 py-1.5 text-xs font-bold text-violet-900">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <span>CSRD &bull; PPWR &bull; Pil Tüzüğü Standartları</span>
        </div>
      </div>

      <p className="relative z-10 mt-4 max-w-3xl text-sm sm:text-base font-medium leading-relaxed text-[#4e4060]">
        SKDM dışındaki imalatçıların AB alıcılarına sunduğu Kapsam 3 ve ürün sürdürülebilirlik verileri, dağınık e-posta yazışmaları yerine kurumsal bir veri doğrulama hattında işlenir.
      </p>

      {/* =========================================================================
          N8N WORKFLOW GRAPH (DESKTOP & RESPONSIVE GRID WITH ANIMATED CONNECTIONS)
          ========================================================================= */}
      <div className="relative z-10 mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5 items-stretch">
        {/* SVG Interactive Animated Connection Lines (Desktop Overlay) */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 hidden lg:block h-12 z-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 60">
            <defs>
              <linearGradient id="tedarikciDagGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D946EF" />
                <stop offset="25%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#9333EA" />
                <stop offset="75%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <path d="M 90 30 L 910 30" stroke="rgba(221, 214, 254, 0.6)" strokeWidth="3" fill="none" />
            <path d="M 90 30 L 910 30" stroke="url(#tedarikciDagGradient)" strokeWidth="3.5" fill="none" className="cable-anim-flow" />
            <circle r="4.5" fill="#8B5CF6" filter="drop-shadow(0 0 6px #8B5CF6)">
              <animateMotion path="M 90 30 L 910 30" dur="2.9s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* 5 DÜĞÜM KARTLARI */}
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.step}
              className={`group relative z-10 flex flex-col justify-between rounded-2xl border-2 ${node.borderColor} bg-white p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-300`}
            >
              <div>
                {/* Üst Kısım */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg shadow-xs ${node.iconBg}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className={`text-[9.5px] font-black uppercase tracking-wider ${node.tagColor}`}>
                      {node.type}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                    {node.step}
                  </span>
                </div>

                <h3 className="mt-2.5 text-sm font-black text-[#1a0e2d] leading-snug">
                  {node.title}
                </h3>
                <p className="text-[11px] font-bold text-violet-700">
                  {node.subtitle}
                </p>

                <div className="mt-2">
                  <span className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${node.badgeColor}`}>
                    {node.badge}
                  </span>
                </div>

                <p className="mt-2 text-[11.5px] leading-relaxed text-[#5a4d6e]">
                  {node.desc}
                </p>
              </div>

              {/* Alt Port */}
              <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-bold text-slate-600">
                <span>{node.portIn}</span>
                <span className="text-violet-700">{node.portOut}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alt Bilgi */}
      <div className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-violet-100 pt-4 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Veriler AB ithalatçısının ERP ve CSRD yazılımlarıyla %100 uyumlu standart veri zarfında iletilir.</span>
        </div>
        <span className="rounded-lg bg-violet-100/70 px-3 py-1 font-mono text-[11px] font-bold text-violet-900">
          COMPLIANCE PIPELINE &bull; VERIFIED
        </span>
      </div>
    </div>
  );
}

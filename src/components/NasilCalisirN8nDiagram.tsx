import React from "react";
import {
  Search,
  Factory,
  Cpu,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";

export function NasilCalisirN8nDiagram() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border-2 border-[#d5dbe6] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_24px_64px_rgba(30,41,59,.08)]">
      {/* n8n Canvas Grid Background */}
      <div className="pointer-events-none absolute inset-0 n8n-canvas-grid opacity-60" />

      {/* Telemetry Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-50 px-3.5 py-1 text-xs font-black tracking-wide text-indigo-900 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-indigo-500 beacon-pulse-dot" />
            <span>N8N ETKİNLİĞİNDE CBAM HESAPLAMA DAG MİMARİSİ</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black leading-tight tracking-tight text-[#0f172a]">
            15 Kontrollü Adımın Otomasyon Akış Şeması
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-bold text-indigo-900">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Canlı Doğrulama &bull; 0 Hata Toleransı</span>
        </div>
      </div>

      {/* SVG Connecting Flow Lines (Desktop Multi-Branch) */}
      <div className="relative z-10 mt-8 grid gap-5 lg:grid-cols-5 items-stretch">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 hidden lg:block h-12 z-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 60">
            <defs>
              <linearGradient id="nasilCalisirFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E11D48" />
                <stop offset="25%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="75%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <path d="M 90 30 L 910 30" stroke="rgba(203, 213, 225, 0.6)" strokeWidth="3" fill="none" />
            <path d="M 90 30 L 910 30" stroke="url(#nasilCalisirFlowGradient)" strokeWidth="3.5" fill="none" className="cable-anim-flow" />
            <circle r="4.5" fill="#4F46E5" filter="drop-shadow(0 0 6px #4F46E5)">
              <animateMotion path="M 90 30 L 910 30" dur="2.8s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* DÜĞÜM 1: TETİKLEYİCİ (ROSE) */}
        <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-rose-300 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md hover:border-rose-500">
          <div>
            <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
                <Search className="h-3.5 w-3.5" />
              </span>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-800">Düğüm 01</span>
            </div>
            <span className="mt-2.5 inline-block text-[10.5px] font-bold uppercase tracking-wider text-rose-700">Tetikleyici (Trigger)</span>
            <h3 className="mt-1 text-sm font-black text-slate-900">GTİP &amp; Kapsam Kararı</h3>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">
              8 haneli CN kodu kontrol edilir, ürünün sektör kapsamı ve 50 ton muafiyeti belirlenir.
            </p>
          </div>
          <div className="mt-4 border-t border-rose-100 pt-2.5 text-[10px] font-bold text-rose-800 flex justify-between">
            <span>Girdi Portalı</span>
            <span>Çıkış →</span>
          </div>
        </div>

        {/* DÜĞÜM 2: VERİ TOPLAMA (INDIGO) */}
        <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-indigo-300 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md hover:border-indigo-500">
          <div>
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <Factory className="h-3.5 w-3.5" />
              </span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-800">Düğüm 02</span>
            </div>
            <span className="mt-2.5 inline-block text-[10.5px] font-bold uppercase tracking-wider text-indigo-700">Veri Zinciri</span>
            <h3 className="mt-1 text-sm font-black text-slate-900">Tesis, Enerji &amp; Precursor</h3>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">
              Tesis sınırları, elektrik/doğalgaz sarfiyatı ve alt tedarikçi hammadde beyanları toplanır.
            </p>
          </div>
          <div className="mt-4 border-t border-indigo-100 pt-2.5 text-[10px] font-bold text-indigo-800 flex justify-between">
            <span>← Giriş</span>
            <span>Çıkış →</span>
          </div>
        </div>

        {/* DÜĞÜM 3: HESAPLAMA MOTORU (AMBER) */}
        <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-amber-300 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md hover:border-amber-500">
          <div>
            <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white shadow-xs">
                <Cpu className="h-3.5 w-3.5" />
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">Düğüm 03</span>
            </div>
            <span className="mt-2.5 inline-block text-[10.5px] font-bold uppercase tracking-wider text-amber-700">Hesaplama Motoru</span>
            <h3 className="mt-1 text-sm font-black text-slate-900">Annex IV &amp; Emisyon İzi</h3>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">
              Doğrudan, dolaylı ve precursor emisyonları resmi AB katsayılarıyla izlenebilir hesaplanır.
            </p>
          </div>
          <div className="mt-4 border-t border-amber-100 pt-2.5 text-[10px] font-bold text-amber-800 flex justify-between">
            <span>← Giriş</span>
            <span>Çıkış →</span>
          </div>
        </div>

        {/* DÜĞÜM 4: KALİTE KAPISI (TEAL) */}
        <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-teal-300 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md hover:border-teal-500">
          <div>
            <div className="flex items-center justify-between border-b border-teal-100 pb-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-black text-teal-800">Düğüm 04</span>
            </div>
            <span className="mt-2.5 inline-block text-[10.5px] font-bold uppercase tracking-wider text-teal-700">Kalite Kapısı</span>
            <h3 className="mt-1 text-sm font-black text-slate-900">Varsayılan Değer &amp; QC</h3>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">
              Eksik veri cezası kontrolü yapılır; şüpheli sapmalar ve çelişkiler doğrulama öncesi filtrelenir.
            </p>
          </div>
          <div className="mt-4 border-t border-teal-100 pt-2.5 text-[10px] font-bold text-teal-800 flex justify-between">
            <span>← Giriş</span>
            <span>Çıkış →</span>
          </div>
        </div>

        {/* DÜĞÜM 5: RESMİ TESLİM (VIOLET) */}
        <div className="relative z-10 flex flex-col justify-between rounded-2xl border-2 border-violet-300 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md hover:border-violet-500">
          <div>
            <div className="flex items-center justify-between border-b border-violet-100 pb-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white shadow-xs">
                <FileSpreadsheet className="h-3.5 w-3.5" />
              </span>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-800">Düğüm 05</span>
            </div>
            <span className="mt-2.5 inline-block text-[10.5px] font-bold uppercase tracking-wider text-violet-700">Mühürlü Paket</span>
            <h3 className="mt-1 text-sm font-black text-slate-900">Excel, XML &amp; Handoff</h3>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">
              AB Komisyonu Excel şablonu, XML veri çıktısı ve bağımsız denetçi kanıt seti teslim edilir.
            </p>
          </div>
          <div className="mt-4 border-t border-violet-100 pt-2.5 text-[10px] font-bold text-violet-800 flex justify-between">
            <span>← Giriş</span>
            <span className="text-emerald-700">Mühürlendi ✅</span>
          </div>
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Her düğüm geriye dönük kriptografik SHA-256 sağlama ile kilitlenir.</span>
        </div>
        <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-800">
          DAG STATUS: ACTIVE &bull; 0 DRIFT
        </span>
      </div>
    </div>
  );
}

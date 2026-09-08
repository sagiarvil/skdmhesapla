"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Radio,
  Zap,
  Anchor,
  Ship,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Activity,
  Sliders,
  Maximize2,
  Crosshair,
  SlidersHorizontal,
  X,
  Calculator,
  ArrowRight,
  ShieldAlert,
  FileCheck
} from "lucide-react";
import { MaritimeCanvasRadar, TargetVessel } from "./MaritimeCanvasRadar";

export function MaritimeHeroVisual() {
  const [activeTab, setActiveTab] = useState<"dual" | "radar" | "telemetry">("dual");
  
  // Donanım Konsol Kontrolleri
  const [radarRange, setRadarRange] = useState<number>(12); // 6, 12, 24 NM
  const [gain, setGain] = useState<number>(82);
  const [seaClutter, setSeaClutter] = useState<number>(24);
  const [trailTime, setTrailTime] = useState<"OFF" | "3MIN" | "TRUE">("TRUE");
  const [motionMode, setMotionMode] = useState<"TRUE" | "REL">("TRUE");

  // Seçili Hedef (ARPA Click-to-Track)
  const [selectedVessel, setSelectedVessel] = useState<TargetVessel | null>(null);

  // Canlı Telemetri
  const [telemetry, setTelemetry] = useState({
    heading: 248.5,
    speed: 19.2,
    nearestCpa: 0.78,
    nearestTcpa: 6.8,
    dangerVesselName: "M/T AEGEAN PIONEER"
  });

  const [alarmAck, setAlarmAck] = useState<boolean>(false);

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-8 select-none">
      {/* High-Tech Glowing Ambient Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/25 via-sky-500/35 to-emerald-500/25 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

      {/* Main Bridge Console Frame (Furuno FAR-3000 / Kongsberg K-Bridge Style) */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-sky-400/40 bg-gradient-to-b from-[#020b14] via-[#041525] to-[#010810] p-3 sm:p-5 shadow-2xl backdrop-blur-xl">
        
        {/* Hardware Console Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/20 pb-3 text-xs">
          {/* Left: GPS & Vessel Waypoint */}
          <div className="flex items-center gap-2.5 text-cyan-300 font-mono tracking-wider">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <Compass className="h-4 w-4 text-cyan-400" />
            <span className="font-black text-white text-xs sm:text-sm tracking-wide">
              M/V SKDM TITAN <span className="text-cyan-400 font-medium">(5.800 TEU · IMO 9842145)</span>
            </span>
            <span className="hidden lg:inline text-sky-400/40">|</span>
            <span className="hidden lg:inline text-sky-300 text-xs font-mono">
              AMBARLI (TR) ➔ ROTTERDAM (NL) · 3.180 NM
            </span>
          </div>

          {/* Right: Console Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-[#010910] border border-sky-400/30 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setActiveTab("dual")}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-black transition ${
                activeTab === "dual"
                  ? "bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 shadow-md scale-[1.02]"
                  : "text-sky-300/80 hover:text-white hover:bg-sky-900/40"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>ÇİFT KONSOL</span>
            </button>
            <button
              onClick={() => setActiveTab("radar")}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-black transition ${
                activeTab === "radar"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md scale-[1.02]"
                  : "text-sky-300/80 hover:text-white hover:bg-sky-900/40"
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>TAM EKRAN RADAR</span>
            </button>
            <button
              onClick={() => setActiveTab("telemetry")}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-black transition ${
                activeTab === "telemetry"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md scale-[1.02]"
                  : "text-emerald-300/80 hover:text-white hover:bg-emerald-900/40"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>YASAL TELEMETRİ</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="mt-4">
          {activeTab === "dual" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Sol Sütun: CANLI HTML5 CANVAS RADAR (7/12 Sütun - Ana Sahne) */}
              <div className="lg:col-span-7 xl:col-span-7 rounded-2xl border-2 border-cyan-500/40 bg-[#010810] p-3 sm:p-4 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                
                {/* Radar Üst Ayar Düğmeleri */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 px-1 border-b border-cyan-500/20 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <strong className="text-white">FURUNO FAR-3000 PPI</strong>
                    <span className="text-emerald-300 hidden sm:inline">[X-BAND 3CM · 24 RPM]</span>
                  </div>

                  {/* Range & Trails Selector */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center bg-sky-950/80 border border-cyan-500/40 rounded-md px-1 py-0.5">
                      <span className="text-slate-400 text-[9px] mr-1">RANGE:</span>
                      {[6, 12, 24].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRadarRange(r)}
                          type="button"
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${radarRange === r ? "bg-cyan-400 text-slate-950" : "text-cyan-300 hover:text-white"}`}
                        >
                          {r}NM
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setTrailTime(trailTime === "TRUE" ? "OFF" : trailTime === "OFF" ? "3MIN" : "TRUE")}
                      type="button"
                      className="bg-sky-950/80 hover:bg-sky-900 border border-cyan-500/40 rounded-md px-2 py-0.5 text-[10px] font-bold text-cyan-300"
                    >
                      TRAILS: {trailTime}
                    </button>
                  </div>
                </div>

                {/* Canvas Konteyneri */}
                <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] my-2 flex items-center justify-center">
                  <MaritimeCanvasRadar
                    range={radarRange}
                    gain={gain}
                    seaClutter={seaClutter}
                    rainClutter={0}
                    trailTime={trailTime}
                    motionMode={motionMode}
                    selectedTargetId={selectedVessel?.id || null}
                    onSelectTarget={setSelectedVessel}
                    onTelemetryUpdate={setTelemetry}
                  />
                </div>

                {/* Radar Alt Canlı Telemetri Paneli */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-300 pt-2 px-1 border-t border-cyan-500/20 bg-[#010810]/90">
                  <div className="flex items-center gap-3">
                    <span>HDG: <strong className="text-cyan-300">{telemetry.heading.toFixed(1)}°T</strong></span>
                    <span>SPD: <strong className="text-cyan-300">{telemetry.speed.toFixed(1)} KT</strong></span>
                  </div>

                  {/* CPA Çatışma Uyarısı Rozeti */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-red-950/90 border border-red-500/60 px-2 py-0.5 rounded text-red-300 text-[10px] font-bold animate-pulse">
                      <AlertTriangle className="h-3 w-3 text-red-400" />
                      <span>CPA: {telemetry.nearestCpa.toFixed(2)} NM ({telemetry.nearestTcpa} MIN)</span>
                    </div>
                    <button
                      onClick={() => setAlarmAck(!alarmAck)}
                      type="button"
                      className="bg-sky-950 hover:bg-sky-900 border border-sky-400/30 text-sky-200 px-2 py-0.5 rounded text-[9px] font-bold"
                    >
                      {alarmAck ? "ALARM SUSTURULDU" : "ACK"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Sağ Sütun: Gemi Profili, Kilitli Hedef Kartı & 2026 Mevzuat Paneli (5/12 Sütun) */}
              <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-3 justify-between">
                {/* Eğer bir gemiye tıklandıysa Kilitli ARPA Hedef Kartı göster, yoksa standart gemi profilini göster */}
                {selectedVessel ? (
                  <LockedTargetCard
                    vessel={selectedVessel}
                    onClose={() => setSelectedVessel(null)}
                  />
                ) : (
                  <ShipGraphicPanel />
                )}
                
                <RegulatoryLiveStatusCards />
              </div>
            </div>
          )}

          {activeTab === "radar" && (
            <div className="rounded-2xl border-2 border-cyan-500/40 bg-[#010810] p-4 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col items-center">
              {/* Üst Genişletilmiş Radar Kontrolleri */}
              <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-500/20 text-xs font-mono text-cyan-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <strong className="text-white text-sm">TAM EKRAN KÖPRÜÜSTÜ ARPA RADAR SKOPU</strong>
                  <span className="text-emerald-300">[24 RPM S-BAND / X-BAND RADAR]</span>
                </div>
                
                {/* Range Seçici */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">MENZİL:</span>
                  {[6, 12, 24].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRadarRange(r)}
                      type="button"
                      className={`px-2.5 py-1 rounded text-xs font-bold ${radarRange === r ? "bg-cyan-400 text-slate-950 shadow-sm" : "bg-sky-950 text-cyan-300 hover:text-white"}`}
                    >
                      {r} NM
                    </button>
                  ))}
                </div>
              </div>

              {/* Devasa Canvas Alanı */}
              <div className="relative w-full max-w-3xl h-[460px] sm:h-[540px] md:h-[620px] my-3">
                <MaritimeCanvasRadar
                  range={radarRange}
                  gain={gain}
                  seaClutter={seaClutter}
                  rainClutter={0}
                  trailTime={trailTime}
                  motionMode={motionMode}
                  selectedTargetId={selectedVessel?.id || null}
                  onSelectTarget={setSelectedVessel}
                  onTelemetryUpdate={setTelemetry}
                />
              </div>

              {/* Seçili Hedef Varsa Alt Kart */}
              {selectedVessel && (
                <div className="w-full max-w-3xl mt-2">
                  <LockedTargetCard
                    vessel={selectedVessel}
                    onClose={() => setSelectedVessel(null)}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="space-y-4">
              <ShipGraphicPanel detailed />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailedEtsTelemetryCard />
                <DetailedFuelEuTelemetryCard />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Hardware Telemetry Pill Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 border-t border-sky-400/20 text-center">
          <div className="rounded-xl bg-sky-950/70 border border-sky-400/25 p-2.5 hover:border-cyan-400/50 transition">
            <span className="block text-[10px] font-mono text-cyan-400 tracking-wider">EMİSYON KAPSAMI</span>
            <span className="text-xs sm:text-sm font-black text-white">5.000+ GT Gemiler</span>
          </div>
          <div className="rounded-xl bg-sky-950/70 border border-sky-400/25 p-2.5 hover:border-emerald-400/50 transition">
            <span className="block text-[10px] font-mono text-cyan-400 tracking-wider">2026 ETS REJİMİ</span>
            <span className="text-xs sm:text-sm font-black text-emerald-300">%100 Tam Teslim</span>
          </div>
          <div className="rounded-xl bg-sky-950/70 border border-sky-400/25 p-2.5 hover:border-cyan-400/50 transition">
            <span className="block text-[10px] font-mono text-cyan-400 tracking-wider">FUELEU MARITIME</span>
            <span className="text-xs sm:text-sm font-black text-cyan-200">89.34 gCO₂e/MJ</span>
          </div>
          <div className="rounded-xl bg-emerald-950/70 border border-emerald-400/40 p-2.5 hover:border-emerald-300 transition shadow-lg shadow-emerald-950/40">
            <span className="block text-[10px] font-mono text-emerald-400 tracking-wider">UYUM PAKETİ</span>
            <span className="text-xs sm:text-sm font-black text-emerald-200">6 Parça Mühürlü Dosya</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * Radarda Tıklanarak Kilitlenmiş Hedef Bilgi Kartı (ARPA Target Lock HUD)
 */
function LockedTargetCard({
  vessel,
  onClose
}: {
  vessel: TargetVessel;
  onClose: () => void;
}) {
  const isDangerous = vessel.dangerous;

  return (
    <div className={`relative rounded-2xl border-2 ${isDangerous ? "border-red-500/70 bg-gradient-to-b from-[#1c080d] to-[#0f0406]" : "border-cyan-500/60 bg-gradient-to-b from-[#03182b] to-[#010c17]"} p-4 shadow-2xl text-xs font-mono transition-all animate-in fade-in`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Crosshair className={`h-4 w-4 ${isDangerous ? "text-red-400 animate-spin-slow" : "text-cyan-400"}`} />
          <div>
            <span className={`font-black tracking-wide ${isDangerous ? "text-red-300" : "text-cyan-300"}`}>
              ARPA KİLİTLİ HEDEF: {vessel.name}
            </span>
            <span className="text-[10px] text-slate-400 block">
              IMO: {vessel.imo || "YOK"} · MMSI: {vessel.mmsi} · BAYRAK: {vessel.flag || "TR 🇹🇷"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          title="Kapat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Seyir & Çatışma Telemetrisi */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
        <div className="bg-black/30 p-2 rounded-lg border border-white/5">
          <span className="text-slate-400 block text-[9px]">GEMİ TİPİ:</span>
          <strong className="text-white text-xs truncate block">{vessel.type}</strong>
        </div>
        <div className="bg-black/30 p-2 rounded-lg border border-white/5">
          <span className="text-slate-400 block text-[9px]">SÜRAT (SOG):</span>
          <strong className="text-white text-xs">{vessel.sog} KNOTS</strong>
        </div>
        <div className="bg-black/30 p-2 rounded-lg border border-white/5">
          <span className="text-slate-400 block text-[9px]">ROTA (COG):</span>
          <strong className="text-white text-xs">{vessel.cog}°T</strong>
        </div>
        <div className="bg-black/30 p-2 rounded-lg border border-white/5">
          <span className="text-slate-400 block text-[9px]">KENDİ GEMİMİZE MESAFE:</span>
          <strong className="text-white text-xs">{Math.hypot(vessel.x, vessel.y).toFixed(1)} NM</strong>
        </div>
        <div className="col-span-2 bg-black/30 p-2 rounded-lg border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[9px]">ÇATIŞMA RİSKİ (CPA / TCPA):</span>
            <strong className={isDangerous ? "text-red-400 font-black text-xs" : "text-emerald-400 text-xs"}>
              {isDangerous ? "0.78 NM (TCPA: 6.8 DAKİKA)" : "Emniyetli Seyir (>3.0 NM)"}
            </strong>
          </div>
          {isDangerous && (
            <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 font-bold text-[9px] animate-pulse">
              ALARM VERİLDİ
            </span>
          )}
        </div>
      </div>

      {/* Yasal Mevzuat ve Karbon İstihbaratı */}
      <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px]">
        <div className="p-2 rounded bg-sky-950/50 border border-sky-400/20">
          <span className="text-slate-400 block text-[9px]">2026 EU ETS SORUMLULUĞU:</span>
          <span className="text-cyan-300 font-bold text-xs">
            {vessel.etsLiabilityEur && vessel.etsLiabilityEur > 0
              ? `€${vessel.etsLiabilityEur.toLocaleString("tr-TR")} / Sefer`
              : "Muaf / Hesaplama Bekliyor"}
          </span>
        </div>
        <div className="p-2 rounded bg-emerald-950/40 border border-emerald-400/20">
          <span className="text-slate-400 block text-[9px]">FUELEU MARITIME DURUMU:</span>
          <span className={`font-bold text-xs ${vessel.fueleuStatus === "AÇIK_RİSK" ? "text-red-400" : "text-emerald-300"}`}>
            {vessel.fueleuGhgIntensity
              ? `${vessel.fueleuGhgIntensity} gCO₂e/MJ (${vessel.fueleuStatus === "UYUMLU" ? "Uyumlu" : "Ceza Riski"})`
              : "89.34 gCO₂e/MJ Ref"}
          </span>
        </div>
      </div>

      {/* Doğrudan Hesaplama Motoru Aksiyon Butonu (AI Intelligence Deep Link) */}
      <Link
        href={`/denizcilik/gemi-karbon-hesaplama/?gemi=${encodeURIComponent(vessel.name)}&yakit=${vessel.dangerous ? 120 : 65}&yakitTipi=vlsfo&rota=extra_eu`}
        className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-mono font-black text-[11px] shadow-lg transition transform active:scale-98"
      >
        <Calculator className="h-4 w-4" />
        <span>BU GEMİ İÇİN 2026 ETS &amp; FUELEU RAPORU ÇIKAR</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/**
 * Konteyner Gemisi ve Yasal/Operasyonel Çizim Paneli
 */
function ShipGraphicPanel({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="relative rounded-2xl border border-sky-400/25 bg-[#031424] p-3 sm:p-4 overflow-hidden shadow-md">
      <div className="flex items-center justify-between border-b border-sky-400/15 pb-2">
        <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold">
          <Ship className="h-4 w-4 text-cyan-400" />
          <span>KONTEYNER GEMİSİ TEKNİK PROFİLİ &amp; SEYİR HATTI</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
          THETIS-MRV AKTİF
        </span>
      </div>

      {/* Vektörel Gemi & Dalga Sahnesi */}
      <div className="relative w-full h-[140px] sm:h-[160px] mt-2 flex items-center justify-center">
        <svg
          viewBox="0 0 650 180"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="shipHullGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="40%" stopColor="#1e293b" />
              <stop offset="85%" stopColor="#334155" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="shipKeelGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="70%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            <linearGradient id="seaWaveFront" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Arka Dalga */}
          <path d="M 0 125 Q 160 115, 320 125 T 650 120 L 650 180 L 0 180 Z" fill="#062540" opacity="0.6" />

          {/* Gemi Gövdesi */}
          <g transform="translate(45, 10)">
            {/* Kırmızı Karina (Underwater Keel) */}
            <path d="M 40 100 L 480 100 Q 520 100 535 88 L 510 115 L 60 115 Z" fill="url(#shipKeelGrad)" />
            {/* Beyaz Su Hattı */}
            <path d="M 44 98 L 484 98 L 492 92 L 40 92 Z" fill="#ffffff" opacity="0.9" />
            {/* Ana Çelik Borda (Freeboard Hull) */}
            <path d="M 35 62 L 420 62 L 485 62 Q 520 62 535 50 L 505 92 L 40 92 Z" fill="url(#shipHullGrad)" />

            {/* Gemi Adı */}
            <text x="440" y="76" fill="#cbd5e1" fontSize="9" fontFamily="monospace" fontWeight="bold">
              SKDM TITAN
            </text>

            {/* Köprüüstü Yaşam Mahalli (Superstructure) */}
            <g transform="translate(68, -4)">
              <rect x="0" y="20" width="55" height="48" rx="2" fill="#f1f5f9" />
              <rect x="-6" y="14" width="67" height="10" rx="2" fill="#e2e8f0" />
              {/* Köprüüstü Camları */}
              <rect x="-3" y="16" width="61" height="4" rx="1" fill="#0284c7" />
              {/* Radar Direği */}
              <line x1="28" y1="14" x2="28" y2="-2" stroke="#64748b" strokeWidth="2.5" />
              <line x1="16" y1="2" x2="40" y2="2" stroke="#0ea5e9" strokeWidth="2" />
              {/* Baca & Egzoz */}
              <rect x="-18" y="24" width="14" height="28" rx="1" fill="#0f172a" />
              <rect x="-18" y="24" width="14" height="6" fill="#0284c7" />
            </g>

            {/* Konteyner İstifleri (Bay 1-4) */}
            <g transform="translate(135, 14)">
              {/* Blok 1 */}
              <rect x="0" y="16" width="46" height="32" rx="1" fill="#0284c7" />
              <rect x="0" y="-12" width="46" height="26" rx="1" fill="#f59e0b" />
              {/* Blok 2 */}
              <rect x="52" y="16" width="46" height="32" rx="1" fill="#dc2626" />
              <rect x="52" y="-12" width="46" height="26" rx="1" fill="#0284c7" />
              {/* Blok 3 */}
              <rect x="104" y="16" width="46" height="32" rx="1" fill="#10b981" />
              <rect x="104" y="-12" width="46" height="26" rx="1" fill="#dc2626" />
              {/* Blok 4 */}
              <rect x="156" y="16" width="46" height="32" rx="1" fill="#f59e0b" />
              <rect x="156" y="-12" width="46" height="26" rx="1" fill="#0284c7" />
              {/* Blok 5 (Baş Taraf) */}
              <rect x="208" y="24" width="46" height="24" rx="1" fill="#0284c7" />
              <rect x="208" y="2" width="46" height="20" rx="1" fill="#10b981" />
            </g>

            {/* Pruva Köpüğü */}
            <path d="M 520 88 Q 545 94 570 102 Q 540 100 515 106 Z" fill="#67e8f9" opacity="0.85" />
          </g>

          {/* Ön Dalgalar ve Köpük */}
          <path d="M 0 135 C 100 125, 200 145, 320 130 C 440 118, 540 142, 650 128 L 650 180 L 0 180 Z" fill="url(#seaWaveFront)" />
          <path d="M 180 132 Q 220 127 260 133" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M 420 130 Q 460 125 500 131" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-300 px-1">
        <span>GRT: 54.200 GT</span>
        <span>DRAFT: 13.8M</span>
        <span className="text-cyan-300 font-bold">HIZ: 19.2 KNOTS</span>
        <span className="text-emerald-300 font-bold">SEFER: TR-AB (%50 ETS)</span>
      </div>
    </div>
  );
}

/**
 * 2026 Tam Kapsam Rejimi İkili Durum Kartları
 */
function RegulatoryLiveStatusCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Kart 1: EU ETS 2026 Tam Teslim */}
      <div className="rounded-xl border border-sky-400/30 bg-[#061d30]/90 p-3 shadow-md hover:border-cyan-400/50 transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-cyan-300">
            <Anchor className="h-3.5 w-3.5 text-cyan-400" />
            <span>EU ETS REJİMİ</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 border border-sky-400/40 text-cyan-200">
            DİREKTİF 2023/957
          </span>
        </div>
        <div className="mt-2 text-base font-black text-white flex items-baseline gap-2">
          <span>%100</span>
          <span className="text-xs font-bold text-emerald-300">2026 Tam Kapsam Devrede</span>
        </div>
        <p className="mt-1 text-[11px] text-sky-100/80 leading-snug">
          Türkiye-AB arası doğrulanmış emisyonların %50&apos;si için tam EUA teslimi zorunludur. Karbondioksit yanında CH₄ ve N₂O sisteme dahildir.
        </p>
      </div>

      {/* Kart 2: FuelEU Maritime */}
      <div className="rounded-xl border border-emerald-400/35 bg-[#04201c]/90 p-3 shadow-md hover:border-emerald-400/60 transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-emerald-300">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span>FUELEU MARITIME</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400/40 text-emerald-200">
            TÜZÜK 2023/1805
          </span>
        </div>
        <div className="mt-2 text-base font-black text-white flex items-baseline gap-2">
          <span>89.34</span>
          <span className="text-xs font-bold text-emerald-200">gCO₂e/MJ GHG Sınırı</span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-100/80 leading-snug">
          Well-to-Wake sera gazı yoğunluğu denetimi ve ceza mekanizması yürürlüktedir. Klas onaylı yakıt izleme kütüğü gerektirir.
        </p>
      </div>
    </div>
  );
}

function DetailedEtsTelemetryCard() {
  return (
    <div className="rounded-2xl border border-sky-400/30 bg-[#061d30] p-4 text-xs font-mono space-y-2 shadow-lg">
      <div className="flex items-center justify-between border-b border-sky-400/20 pb-2">
        <span className="text-cyan-300 font-bold flex items-center gap-1.5">
          <Anchor className="h-4 w-4" /> 2026 EU ETS DENİZ HESAPLAMASI
        </span>
        <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">%100 TESLİM</span>
      </div>
      <div className="flex justify-between py-1 border-b border-sky-400/10">
        <span className="text-slate-300">Sefer Rotası:</span>
        <span className="text-white font-bold">Ambarlı ➔ Rotterdam (3.180 NM)</span>
      </div>
      <div className="flex justify-between py-1 border-b border-sky-400/10">
        <span className="text-slate-300">Gemi Yakıt Tüketimi (VLSFO):</span>
        <span className="text-white">92.4 Metrik Ton</span>
      </div>
      <div className="flex justify-between py-1 border-b border-sky-400/10">
        <span className="text-slate-300">Doğrulanmış Emisyon:</span>
        <span className="text-white">287.8 ton CO₂e (CO₂ + CH₄ + N₂O)</span>
      </div>
      <div className="flex justify-between py-1 border-b border-sky-400/10">
        <span className="text-slate-300">TR-AB Sorumluluk Payı (%50):</span>
        <span className="text-cyan-300 font-bold">143.9 ton CO₂e</span>
      </div>
      <div className="flex justify-between py-1 text-emerald-300 font-bold">
        <span>Tahmini EUA Yükümlülüğü ($95/EUA):</span>
        <span>$13.670 (Sefer Başı)</span>
      </div>
    </div>
  );
}

function DetailedFuelEuTelemetryCard() {
  return (
    <div className="rounded-2xl border border-emerald-400/30 bg-[#04201c] p-4 text-xs font-mono space-y-2 shadow-lg">
      <div className="flex items-center justify-between border-b border-emerald-400/20 pb-2">
        <span className="text-emerald-300 font-bold flex items-center gap-1.5">
          <Zap className="h-4 w-4" /> FUELEU MARITIME CEZA DENETİMİ
        </span>
        <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">UYUMLU (CEZASIZ)</span>
      </div>
      <div className="flex justify-between py-1 border-b border-emerald-400/10">
        <span className="text-slate-300">Yasal Sera Gazı Yoğunluk Sınırı:</span>
        <span className="text-white">89.34 gCO₂e/MJ (-%2 Referans)</span>
      </div>
      <div className="flex justify-between py-1 border-b border-emerald-400/10">
        <span className="text-slate-300">Gerçekleşen Gemi Enerji Yoğunluğu:</span>
        <span className="text-emerald-300 font-bold">88.10 gCO₂e/MJ</span>
      </div>
      <div className="flex justify-between py-1 border-b border-emerald-400/10">
        <span className="text-slate-300">Uyum Bakiyesi (Compliance Balance):</span>
        <span className="text-emerald-300">+1.24 gCO₂e/MJ Fazla Uyum</span>
      </div>
      <div className="flex justify-between py-1 border-b border-emerald-400/10">
        <span className="text-slate-300">FuelEU Ceza Riski:</span>
        <span className="text-emerald-400 font-bold">$0.00 (Temiz Rapor)</span>
      </div>
      <div className="flex justify-between py-1 text-cyan-300 font-bold">
        <span>IACS Klas Denetim Durumu:</span>
        <span>DNV / RINA / BV Hazır</span>
      </div>
    </div>
  );
}

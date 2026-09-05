import React from "react";
import { Compass, Radio, Zap, Anchor } from "lucide-react";

export function MaritimeHeroVisual() {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-8 select-none">
      {/* Glow / Halo Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-sky-500/30 to-emerald-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

      {/* Main Container */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-400/30 bg-gradient-to-b from-[#061726]/95 via-[#082033]/90 to-[#030d17]/95 p-4 sm:p-7 shadow-2xl backdrop-blur-md">
        {/* Radar Coordinates Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/15 pb-4 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-mono tracking-wider font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>39°55′N 26°14′E · AMBARLI (TR) ➔ ROTTERDAM (NL)</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-sky-200/80">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="bg-sky-950/80 border border-sky-400/30 px-2 py-0.5 rounded text-cyan-300">
              AIS LIVE: 19.2 KTS · DRAFT 13.8M
            </span>
            <span className="hidden sm:inline bg-emerald-950/80 border border-emerald-400/30 text-emerald-300 px-2 py-0.5 rounded">
              EU ETS: %70 PHASE-IN
            </span>
          </div>
        </div>

        {/* Hero Artwork Canvas */}
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] mt-2 flex items-center justify-center">
          {/* Radar Circles in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-48 h-48 sm:w-72 sm:h-72 rounded-full border border-dashed border-cyan-400/40"></div>
            <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-cyan-400/20"></div>
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
          </div>

          {/* SVG Vessel & Ocean Scene */}
          <svg
            viewBox="0 0 900 360"
            className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Ocean Gradients */}
              <linearGradient id="skyGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#082b49" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#04121f" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="deepOcean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e3a5f" />
                <stop offset="100%" stopColor="#03111f" />
              </linearGradient>

              <linearGradient id="waveFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="waveMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="hullGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="40%" stopColor="#1e293b" />
                <stop offset="85%" stopColor="#334155" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              <linearGradient id="keelGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#991b1b" />
                <stop offset="70%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>

              <linearGradient id="bridgeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>

            {/* Background Atmosphere Lights */}
            <circle cx="280" cy="110" r="140" fill="url(#skyGlow)" />
            <circle cx="680" cy="90" r="120" fill="url(#skyGlow)" />

            {/* Back Wave Swell */}
            <path
              d="M0 240 Q 150 225, 300 240 T 600 240 T 900 235 L 900 360 L 0 360 Z"
              fill="#06223b"
              opacity="0.7"
            />

            {/* Container Ship Group */}
            <g className="maritime-ship-group" transform="translate(110, 50)">
              {/* Ship Wake Foam (Back) */}
              <ellipse cx="68" cy="205" rx="55" ry="12" fill="#38bdf8" opacity="0.35" />

              {/* Underwater Keel / Red Anti-Fouling Bottom */}
              <path
                d="M 50 196 L 620 196 Q 665 196 680 178 L 650 216 L 80 216 Z"
                fill="url(#keelGrad)"
              />

              {/* White Waterline stripe */}
              <path d="M 55 194 L 624 194 L 634 186 L 50 186 Z" fill="#f8fafc" opacity="0.9" />

              {/* Draft Markers on Hull */}
              <g stroke="#ffffff" strokeWidth="1" opacity="0.7">
                <line x1="628" y1="184" x2="628" y2="194" />
                <line x1="624" y1="187" x2="628" y2="187" />
                <line x1="624" y1="190" x2="628" y2="190" />
                <line x1="60" y1="186" x2="60" y2="194" />
                <line x1="60" y1="189" x2="64" y2="189" />
              </g>

              {/* Main Steel Hull */}
              <path
                d="M 45 142 L 520 142 L 610 142 Q 652 142 675 125 L 635 186 L 50 186 Z"
                fill="url(#hullGrad)"
              />

              {/* Ship Name & IMO on Bow */}
              <text
                x="560"
                y="160"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
                letterSpacing="1"
              >
                SKDM TITAN · ISTANBUL
              </text>

              {/* Anchor Hawsehole on Bow */}
              <ellipse cx="616" cy="155" rx="4.5" ry="6" fill="#090d16" />
              <path d="M 616 160 L 618 178" stroke="#64748b" strokeWidth="2" />
              <circle cx="618" cy="178" r="3.5" fill="#334155" />

              {/* Superstructure / Accommodation Deckhouse (Stern/Aft) */}
              <g transform="translate(90, 48)">
                {/* Main Tower */}
                <rect x="0" y="24" width="70" height="70" rx="3" fill="url(#bridgeGrad)" />
                {/* Bridge Wings (Top) */}
                <rect x="-8" y="16" width="86" height="15" rx="3" fill="#f1f5f9" />
                {/* Bridge Windows (Glowing Cyan/Amber) */}
                <rect x="-4" y="19" width="78" height="6" rx="1.5" fill="#0284c7" />
                <rect x="-2" y="20" width="74" height="4" rx="1" fill="#38bdf8" />

                {/* Lower Accommodation Porch Windows */}
                <g fill="#0f172a" opacity="0.75">
                  <rect x="8" y="38" width="10" height="5" rx="1" />
                  <rect x="24" y="38" width="10" height="5" rx="1" />
                  <rect x="40" y="38" width="10" height="5" rx="1" />
                  <rect x="54" y="38" width="8" height="5" rx="1" />

                  <rect x="8" y="52" width="10" height="5" rx="1" />
                  <rect x="24" y="52" width="10" height="5" rx="1" />
                  <rect x="40" y="52" width="10" height="5" rx="1" />
                  <rect x="54" y="52" width="8" height="5" rx="1" />
                </g>

                {/* Radar Mast & Antennas */}
                <line x1="35" y1="16" x2="35" y2="-12" stroke="#e2e8f0" strokeWidth="3" />
                <line x1="20" y1="-4" x2="50" y2="-4" stroke="#94a3b8" strokeWidth="2" />
                <line x1="26" y1="-9" x2="44" y2="-9" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Radar Scanner */}
                <rect x="30" y="-14" width="18" height="3" rx="1" fill="#38bdf8" />
                <circle cx="35" cy="-14" r="2" fill="#ef4444" className="animate-ping" />

                {/* Funnel / Exhaust Stack */}
                <rect x="-26" y="34" width="22" height="60" rx="3" fill="#1e293b" />
                <rect x="-26" y="34" width="22" height="12" fill="#0284c7" />
                <circle cx="-15" cy="40" r="3.5" fill="#38bdf8" />
              </g>

              {/* Colorful Container Stacks */}
              <g transform="translate(170, 62)">
                {/* Row 4 (Bottom) */}
                <rect x="0" y="56" width="62" height="22" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
                <rect x="66" y="56" width="62" height="22" rx="2" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
                <rect x="132" y="56" width="62" height="22" rx="2" fill="#10b981" stroke="#047857" strokeWidth="1" />
                <rect x="198" y="56" width="62" height="22" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                <rect x="264" y="56" width="62" height="22" rx="2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
                <rect x="330" y="56" width="60" height="22" rx="2" fill="#475569" stroke="#334155" strokeWidth="1" />

                {/* Row 3 */}
                <rect x="0" y="32" width="62" height="22" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                <rect x="66" y="32" width="62" height="22" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
                <rect x="132" y="32" width="62" height="22" rx="2" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />
                <rect x="198" y="32" width="62" height="22" rx="2" fill="#059669" stroke="#047857" strokeWidth="1" />
                <rect x="264" y="32" width="62" height="22" rx="2" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
                <rect x="330" y="32" width="60" height="22" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />

                {/* Row 2 */}
                <rect x="4" y="8" width="58" height="22" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1" />
                <rect x="66" y="8" width="62" height="22" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                <rect x="132" y="8" width="62" height="22" rx="2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
                <rect x="198" y="8" width="62" height="22" rx="2" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1" />
                <rect x="264" y="8" width="62" height="22" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1" />

                {/* Row 1 (Top Tier) */}
                <rect x="70" y="-16" width="58" height="22" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
                <rect x="132" y="-16" width="62" height="22" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                <rect x="202" y="-16" width="58" height="22" rx="2" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />

                {/* Container Ribs / Fluting Lines */}
                <g stroke="#ffffff" strokeWidth="0.75" opacity="0.35">
                  <line x1="14" y1="58" x2="14" y2="76" />
                  <line x1="28" y1="58" x2="28" y2="76" />
                  <line x1="42" y1="58" x2="42" y2="76" />

                  <line x1="80" y1="58" x2="80" y2="76" />
                  <line x1="94" y1="58" x2="94" y2="76" />
                  <line x1="108" y1="58" x2="108" y2="76" />

                  <line x1="146" y1="58" x2="146" y2="76" />
                  <line x1="160" y1="58" x2="160" y2="76" />
                  <line x1="174" y1="58" x2="174" y2="76" />

                  <line x1="212" y1="58" x2="212" y2="76" />
                  <line x1="226" y1="58" x2="226" y2="76" />
                  <line x1="240" y1="58" x2="240" y2="76" />

                  <line x1="278" y1="58" x2="278" y2="76" />
                  <line x1="292" y1="58" x2="292" y2="76" />
                  <line x1="306" y1="58" x2="306" y2="76" />

                  {/* Top Ribs */}
                  <line x1="146" y1="-14" x2="146" y2="4" />
                  <line x1="160" y1="-14" x2="160" y2="4" />
                  <line x1="174" y1="-14" x2="174" y2="4" />
                </g>

                {/* Lashing Rods */}
                <g stroke="#94a3b8" strokeWidth="1" opacity="0.5">
                  <line x1="4" y1="78" x2="62" y2="34" />
                  <line x1="62" y1="78" x2="4" y2="34" />
                  <line x1="70" y1="78" x2="128" y2="34" />
                  <line x1="128" y1="78" x2="70" y2="34" />
                  <line x1="202" y1="78" x2="260" y2="34" />
                  <line x1="260" y1="78" x2="202" y2="34" />
                  <line x1="268" y1="78" x2="326" y2="34" />
                  <line x1="326" y1="78" x2="268" y2="34" />
                </g>
              </g>

              {/* Bow Wave / Waterline Spray (Front) */}
              <path
                d="M 660 178 Q 695 186 730 196 Q 690 194 650 200 Z"
                fill="#67e8f9"
                opacity="0.85"
              />
              <circle cx="682" cy="188" r="3" fill="#ffffff" opacity="0.9" />
              <circle cx="704" cy="192" r="2.5" fill="#e0f2fe" opacity="0.8" />
              <circle cx="722" cy="195" r="2" fill="#bae6fd" opacity="0.7" />
            </g>

            {/* Mid Ocean Waves with Rolling Swell */}
            <path
              d="M0 248 C 120 236, 220 262, 340 246 C 460 230, 580 264, 700 245 C 790 232, 850 252, 900 244 L 900 360 L 0 360 Z"
              fill="url(#waveMid)"
            />

            {/* Foreground Wave Crest with Foaming Lip */}
            <path
              d="M0 265 C 100 250, 180 278, 280 262 C 380 245, 490 280, 590 260 C 690 240, 800 274, 900 258 L 900 360 L 0 360 Z"
              fill="url(#waveFront)"
            />

            {/* Seafoam Highlights on Wave Tops */}
            <path
              d="M 240 264 Q 280 258 320 265"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M 550 262 Q 590 256 630 263"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M 68 255 Q 110 248 150 256"
              stroke="#e0f2fe"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M 760 258 Q 800 252 840 260"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />

            {/* Deep Water Base Gradient Overlay */}
            <rect x="0" y="315" width="900" height="45" fill="url(#deepOcean)" opacity="0.9" />
          </svg>

          {/* Floating Telemetry Badges (Overlaid Glass Badges) */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-6 rounded-xl border border-sky-400/30 bg-[#071d2e]/90 p-2.5 sm:p-3 shadow-xl backdrop-blur-md max-w-[200px] sm:max-w-[220px]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-cyan-300">
              <Anchor className="h-3.5 w-3.5 text-cyan-400" />
              <span>EU ETS REJİMİ</span>
            </div>
            <div className="mt-1 text-sm sm:text-base font-black text-white">
              %70 <span className="text-[11px] font-medium text-sky-200">Phase-in Yürürlükte</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-300 leading-tight">
              Türkiye-AB rotalarında emisyonun %50&apos;si için EUA teslim zorunluluğu
            </p>
          </div>

          <div className="absolute bottom-6 right-3 sm:bottom-8 sm:right-6 rounded-xl border border-emerald-400/40 bg-[#06201b]/90 p-2.5 sm:p-3 shadow-xl backdrop-blur-md max-w-[210px] sm:max-w-[240px]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-300">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>FUELEU MARITIME</span>
            </div>
            <div className="mt-1 text-sm sm:text-base font-black text-white">
              89.34 <span className="text-[11px] font-medium text-emerald-200">gCO₂e/MJ Hedefi</span>
            </div>
            <p className="mt-0.5 text-[10px] text-emerald-100/80 leading-tight">
              1 Ocak 2025 itibarıyla sera gazı yoğunluğu sınırı ve ceza denetimi devrede
            </p>
          </div>
        </div>

        {/* Bottom Feature Pill Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-sky-400/15 text-center">
          <div className="rounded-lg bg-sky-950/60 border border-sky-400/20 p-2">
            <span className="block text-[10px] font-mono text-cyan-400">EMİSYON KAPSAMI</span>
            <span className="text-xs sm:text-sm font-black text-white">5.000+ GT Gemiler</span>
          </div>
          <div className="rounded-lg bg-sky-950/60 border border-sky-400/20 p-2">
            <span className="block text-[10px] font-mono text-cyan-400">SEFER PAYLAŞIMI</span>
            <span className="text-xs sm:text-sm font-black text-white">TR-AB %50 / İçi %100</span>
          </div>
          <div className="rounded-lg bg-sky-950/60 border border-sky-400/20 p-2">
            <span className="block text-[10px] font-mono text-cyan-400">DENETİM STANDARDI</span>
            <span className="text-xs sm:text-sm font-black text-white">IACS Klas Hazır</span>
          </div>
          <div className="rounded-lg bg-emerald-950/60 border border-emerald-400/30 p-2">
            <span className="block text-[10px] font-mono text-emerald-400">UYUM PAKETİ</span>
            <span className="text-xs sm:text-sm font-black text-emerald-200">6 Parça Mühürlü Dosya</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";

/**
 * Derin Gece Seyri ve Köprüüstü Ambiyansı (Deep Oceanic Bridge Atmosphere)
 * 
 * Metinlerin, H1 başlığının ve CTA butonlarının arkasındaki görsel karmaşayı sıfırlar.
 * Sol metin alanını tamamen jilet gibi net ve okunabilir tutarken, sağ tarafa ve derinliğe
 * hafif gece seyri ışık hüzmesi ve atmosferik deniz parıltısı verir.
 */
export function MaritimeHeroBackgroundDrawing() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      <svg
        viewBox="0 0 1600 750"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-70"
      >
        <defs>
          <radialGradient id="bridgeNightGlow" cx="80%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#082f49" stopOpacity="0.10" />
            <stop offset="75%" stopColor="#03111f" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#03111f" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="beaconCyanGlow" cx="85%" cy="25%" r="25%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#03111f" stopOpacity="0" />
          </radialGradient>

          <pattern id="tacticalMicroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0284c7" strokeWidth="0.5" strokeOpacity="0.06" />
            <circle cx="60" cy="0" r="0.75" fill="#38bdf8" fillOpacity="0.10" />
          </pattern>
        </defs>

        {/* Ambient Dark Horizon & Night Glow */}
        <rect width="1600" height="750" fill="url(#bridgeNightGlow)" />
        <circle cx="1300" cy="200" r="380" fill="url(#beaconCyanGlow)" />

        {/* Subtle Far-Right Navigation Grid (Never crosses into left text area) */}
        <g opacity="0.7">
          <rect x="850" y="40" width="750" height="520" fill="url(#tacticalMicroGrid)" />
          {/* Soft Depth Bathymetry Contours far on the right edge */}
          <path
            d="M 1050 80 Q 1250 130 1450 100 T 1600 140"
            stroke="#0284c7"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            strokeOpacity="0.15"
          />
          <path
            d="M 1000 180 Q 1280 230 1480 180 T 1600 220"
            stroke="#06b6d4"
            strokeWidth="0.8"
            strokeDasharray="6 10"
            strokeOpacity="0.12"
          />
        </g>

        {/* Distant Navigational Lights / Sea Waypoints (Far Right Horizon) */}
        <g opacity="0.6">
          <circle cx="1420" cy="160" r="2" fill="#22c55e" />
          <circle cx="1420" cy="160" r="6" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.4" />
          <text x="1432" y="164" fill="#22c55e" fontSize="9" fontFamily="monospace" opacity="0.7">
            WPT 04 · CANAKKALE S.
          </text>

          <circle cx="1530" cy="250" r="2" fill="#38bdf8" />
          <circle cx="1530" cy="250" r="6" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" />
          <text x="1450" y="254" fill="#38bdf8" fontSize="9" fontFamily="monospace" opacity="0.6">
            TSS SEPARATION
          </text>
        </g>
      </svg>
    </div>
  );
}

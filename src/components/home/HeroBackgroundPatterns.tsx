"use client";

import React from "react";

/**
 * Enterprise Kurumsal Yeşil Alan Arka Plan Motifleri ve Hareket Mimarisi
 * 
 * Konuyla Birebir Alakalı İnce Motifler:
 * 1. Karbon Moleküler & Kristal Halka Ağı (Hexagonal Lattice - Çelik, Alüminyum, Karbon İzleme)
 * 2. Sanayi Fabrika Bacası & Proses İzleme Çizgileri (Industrial Blueprint / Emission Stream)
 * 3. Gümrük & Sevkiyat Koordinat Gridleri (EU Trade Flow & Verification Waypoints)
 * 4. Hafif Dinamik Parıltı & Atmosferik Yeşil Işık Hüzmeleri (Ambient Emerald & Lime Glow)
 * 
 * Kesinlikle metinlerin okunmasını engellemez; z-0 arkasında derinlik, kurumsallık ve hareket katar.
 */
export function HeroBackgroundPatterns() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* 1. Dinamik Atmosferik Işıltılar (Ambient Glowing Orbs) */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pk-hero-orb-1" />
      <div className="absolute top-1/4 -right-24 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl pk-hero-orb-2" />
      <div className="absolute -bottom-20 left-1/3 h-72 w-96 rounded-full bg-emerald-600/15 blur-3xl pk-hero-orb-3" />

      <svg
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-65"
      >
        <defs>
          {/* Karbon Moleküler Hexagon Deseni */}
          <pattern id="carbonHexPattern" width="90" height="155.88" patternUnits="userSpaceOnUse">
            <path
              d="M45 0 L90 25.98 L90 77.94 L45 103.92 L0 77.94 L0 25.98 Z M45 155.88 L90 129.9 L90 77.94 M0 77.94 L0 129.9 L45 155.88"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.8"
              strokeOpacity="0.12"
            />
            <circle cx="45" cy="0" r="1.5" fill="#60a5fa" fillOpacity="0.2" />
            <circle cx="90" cy="25.98" r="1.5" fill="#60a5fa" fillOpacity="0.2" />
            <circle cx="90" cy="77.94" r="1.5" fill="#60a5fa" fillOpacity="0.2" />
            <circle cx="45" cy="103.92" r="1.5" fill="#60a5fa" fillOpacity="0.2" />
            <circle cx="0" cy="77.94" r="1.5" fill="#60a5fa" fillOpacity="0.2" />
            <circle cx="0" cy="25.98" r="1.5" fill="#60a5fa" fillOpacity="0.2" />
          </pattern>

          {/* İnce Teknik Çizim / Blueprint Koordinat Izgarası */}
          <pattern id="technicalMesh" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="0.5" strokeOpacity="0.08" />
            <circle cx="40" cy="0" r="0.8" fill="#3b82f6" fillOpacity="0.15" />
          </pattern>

          {/* Gradyan Akış Çizgileri */}
          <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="streamGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
            <stop offset="40%" stopColor="#60a5fa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Arka Plan Koordinat Grid Katmanı (Sol ve Sağ Kanatlar) */}
        <rect x="0" y="0" width="420" height="850" fill="url(#technicalMesh)" />
        <rect x="1180" y="0" width="420" height="850" fill="url(#technicalMesh)" />

        {/* Karbon & Metalurji Hexagon Ağı (Sol Üst & Sağ Orta) */}
        <rect x="40" y="20" width="380" height="450" fill="url(#carbonHexPattern)" opacity="0.85" />
        <rect x="1180" y="160" width="380" height="450" fill="url(#carbonHexPattern)" opacity="0.85" />

        {/* Sanayi Emisyon & Tesis Veri Akış Eğrileri (Proses Akışı İzleri) */}
        <g opacity="0.75">
          {/* Eğri 1: Sol Alttan Merkeze Doğru Yükselen Akış */}
          <path
            d="M -50 780 C 250 720, 380 480, 520 380 S 780 280, 1100 240"
            stroke="url(#streamGrad1)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          {/* Eğri 2: Sağ Üstten Aşağı İnen Ticaret & Gümrük Hattı */}
          <path
            d="M 1650 120 C 1420 180, 1280 340, 1120 480 S 840 680, 480 720"
            stroke="url(#streamGrad2)"
            strokeWidth="1.8"
          />
          {/* Eğri 3: Taban Sabitleyici Denge Çizgisi */}
          <path
            d="M 120 860 Q 550 790 950 830 T 1560 760"
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeOpacity="0.2"
          />
        </g>

        {/* Sanayi / Tesis İkonik Vektörel Blueprint Silueti (Sol Alt Köşede Minimalist Tesis) */}
        <g opacity="0.15" transform="translate(60, 620)">
          {/* Fabrika Bacaları & Çatı Hattı */}
          <path
            d="M 0 160 L 0 60 L 30 60 L 30 160 L 50 160 L 50 40 L 75 40 L 75 160 L 95 160 L 135 100 L 135 160 L 175 100 L 175 160 L 220 160"
            stroke="#60a5fa"
            strokeWidth="1.2"
            fill="none"
          />
          {/* Emisyon Çıkış / Karbon Filtreleme İzi */}
          <path d="M 15 50 Q 15 25 35 15 T 45 -10" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 4" fill="none" />
          <path d="M 62 30 Q 62 10 82 0 T 90 -20" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 4" fill="none" />
          <circle cx="45" cy="-10" r="3" fill="#60a5fa" fillOpacity="0.4" />
          <circle cx="90" cy="-20" r="3" fill="#60a5fa" fillOpacity="0.4" />
        </g>

        {/* Doğrulama / Mühür & Güvenlik Sembolü (Sağ Üst Köşede Zarif Geometrik Pusula/Mühür) */}
        <g opacity="0.18" transform="translate(1360, 90)">
          <circle cx="80" cy="80" r="70" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="80" cy="80" r="54" stroke="#3b82f6" strokeWidth="1.2" />
          <circle cx="80" cy="80" r="38" stroke="#2563eb" strokeWidth="0.8" />
          {/* Çapraz Eksen Çizgileri */}
          <line x1="80" y1="0" x2="80" y2="160" stroke="#60a5fa" strokeWidth="0.7" strokeDasharray="3 5" />
          <line x1="0" y1="80" x2="160" y2="80" stroke="#60a5fa" strokeWidth="0.7" strokeDasharray="3 5" />
          {/* Köşe Koordinat Noktaları */}
          <rect x="76" y="6" width="8" height="8" fill="#93c5fd" />
          <rect x="76" y="146" width="8" height="8" fill="#93c5fd" />
          <rect x="6" y="76" width="8" height="8" fill="#93c5fd" />
          <rect x="146" y="76" width="8" height="8" fill="#93c5fd" />
        </g>

        {/* Mikro Doğrulama Noktaları (Floating Trust Particles) */}
        <g opacity="0.4">
          <circle cx="340" cy="220" r="2" fill="#93c5fd" />
          <circle cx="480" cy="140" r="1.5" fill="#bfdbfe" />
          <circle cx="1120" cy="180" r="2" fill="#93c5fd" />
          <circle cx="1260" cy="340" r="2.5" fill="#60a5fa" />
          <circle cx="1320" cy="520" r="1.5" fill="#bfdbfe" />
          <circle cx="280" cy="620" r="2" fill="#60a5fa" />
          <circle cx="820" cy="820" r="1.5" fill="#93c5fd" />
        </g>
      </svg>
    </div>
  );
}

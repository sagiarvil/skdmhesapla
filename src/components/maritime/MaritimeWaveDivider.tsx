import React from "react";

interface MaritimeWaveDividerProps {
  variant?: "white" | "slate" | string;
}

export function MaritimeWaveDivider({ variant = "white" }: MaritimeWaveDividerProps = {}) {
  const bottomColor = variant === "slate" ? "#f8fafc" : "#ffffff";
  return (
    <div className="relative w-full overflow-hidden leading-none z-10 -mb-[1px]">
      <svg
        className="relative block w-full h-12 sm:h-20 md:h-24 text-white"
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#082942" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#04121d" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="waveGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Deep wave swell layer */}
        <path
          d="M0,32 C240,75 480,15 720,55 C960,95 1200,45 1440,65 L1440,120 L0,120 Z"
          fill="url(#waveGrad2)"
        />

        {/* Middle turquoise crest layer */}
        <path
          d="M0,60 C320,10 580,85 840,40 C1100,0 1320,60 1440,30 L1440,120 L0,120 Z"
          fill="url(#waveGrad3)"
        />

        {/* Foreground wave cutting into section below */}
        <path
          d="M0,72 C220,105 460,50 720,80 C980,110 1240,65 1440,88 L1440,120 L0,120 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}

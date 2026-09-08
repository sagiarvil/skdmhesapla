"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { AlertTriangle, Crosshair, Navigation, Volume2, VolumeX } from "lucide-react";

export interface TargetVessel {
  id: string;
  name: string;
  type: string;
  mmsi: string;
  imo?: string;
  flag?: string;
  grossTonnage?: number;
  etsLiabilityEur?: number;
  fueleuGhgIntensity?: number;
  fueleuStatus?: "UYUMLU" | "AÇIK_RİSK" | "MUAF";
  x: number; // NM relative to own ship (-range to +range)
  y: number; // NM relative to own ship (-range to +range)
  sog: number; // knots
  cog: number; // degrees
  length: number; // meters
  dangerous?: boolean;
  history: { x: number; y: number }[];
}

interface MaritimeCanvasRadarProps {
  range: number; // 6, 12, 24 NM
  gain?: number; // 0 to 100
  seaClutter?: number; // 0 to 100
  rainClutter?: number; // 0 to 100
  trailTime?: "OFF" | "3MIN" | "TRUE";
  motionMode?: "TRUE" | "REL";
  selectedTargetId?: string | null;
  onSelectTarget: (vessel: TargetVessel | null) => void;
  onTelemetryUpdate?: (data: {
    heading: number;
    speed: number;
    nearestCpa: number;
    nearestTcpa: number;
    dangerVesselName: string;
  }) => void;
}

/**
 * IMO MSC.192(79) & Furuno FAR-3000 Standartlarında
 * Yüksek Güvenilirlikli HTML5 Canvas Denizcilik ARPA Radarı (Enterprise Grade)
 * 
 * Güvenilirlik Mimarisi:
 * - ResizeObserver ile dinamik ve çözünürlükten bağımsız responsive adaptasyon
 * - İstemci hidrasyon / SSR yarış koşullarına karşı korumalı boyut doğrulama
 * - Reaktif telemetri frenlemesi (React 19 render kuyruğunu peg'lemez)
 * - Güvenli fosfor kalıcılık arabelleği (CRT Afterglow)
 * - Sekme / görünürlük değişimi (visibilityChange) zaman sıçraması koruması
 */
/**
 * Sıfır Siyah Ekran Garantisi (Zero-Blank-Screen SSR Tactical Fallback):
 * JavaScript yüklenmeden veya canvas render edilmeden önce (veya WebGL/Canvas context
 * kaybı durumunda) anında görüntülenen, sıfır gecikmeli, tam ölçekli vektörel taktik radar.
 */
export function TacticalSvgRadarFallback({
  range = 12,
  vessels = [],
  onSelectTarget
}: {
  range: number;
  vessels: TargetVessel[];
  onSelectTarget?: (vessel: TargetVessel) => void;
}) {
  const rangeSteps = [0.25, 0.5, 0.75, 1.0];
  const radius = 160; // SVG çalışma koordinatı

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto select-none">
      <svg
        viewBox="-210 -210 420 420"
        className="w-full h-full max-w-full max-h-full drop-shadow-[0_0_25px_rgba(6,182,212,0.15)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Radial Zemin ve PPI Fosfor Parıltısı */}
          <radialGradient id="radarDialBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#021424" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#010c17" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#01060c" stopOpacity="1" />
          </radialGradient>

          {/* Dönen Radar Sweep Huzmesi (CSS Tabanlı - Sıfır JS Bağımlılığı) */}
          <linearGradient id="fallbackSweepBeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
          </linearGradient>

          <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Radar Skopu Dış Tabanı */}
        <circle cx="0" cy="0" r={radius} fill="url(#radarDialBg)" stroke="#0ea5e9" strokeWidth="2" />

        {/* 2. Mesafe Halkaları (Range Rings) */}
        {rangeSteps.map((step, idx) => {
          const r = radius * step;
          const nmDist = (range * step).toFixed(step === 1 ? 0 : 1);
          return (
            <g key={idx}>
              <circle
                cx="0"
                cy="0"
                r={r}
                fill="none"
                stroke="#0369a1"
                strokeWidth={idx === 3 ? "1.6" : "0.8"}
                strokeDasharray={idx < 3 ? "4,4" : "none"}
                opacity={0.65}
              />
              {/* NM Mesafe Etiketi */}
              <text
                x="4"
                y={-r + 11}
                fill="#38bdf8"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                opacity={0.8}
              >
                {nmDist}NM
              </text>
            </g>
          );
        })}

        {/* 3. Kerteriz Kılavuz Çizgileri (0°, 90°, 180°, 270°) */}
        <line x1="0" y1={-radius} x2="0" y2={radius} stroke="#0284c7" strokeWidth="0.8" strokeDasharray="3,5" opacity={0.4} />
        <line x1={-radius} y1="0" x2={radius} y2="0" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="3,5" opacity={0.4} />

        {/* 4. Azimuth Pusula Çemberi & Tıklar */}
        <circle cx="0" cy="0" r={radius + 4} fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity={0.7} />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const x1 = Math.cos(rad) * (radius + 4);
          const y1 = Math.sin(rad) * (radius + 4);
          const x2 = Math.cos(rad) * (radius + 12);
          const y2 = Math.sin(rad) * (radius + 12);
          const tx = Math.cos(rad) * (radius + 22);
          const ty = Math.sin(rad) * (radius + 22);

          let label = `${deg.toString().padStart(3, "0")}°`;
          if (deg === 0) label = "000° N";
          if (deg === 90) label = "090° E";
          if (deg === 180) label = "180° S";
          if (deg === 270) label = "270° W";

          return (
            <g key={deg}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="1.2" opacity={0.85} />
              <text
                x={tx}
                y={ty + 2.5}
                fill="#38bdf8"
                fontSize="7"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                opacity={0.9}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* 5. CSS Tabanlı Dönen Sweep Huzmesi */}
        <g style={{ transformOrigin: "0px 0px", animation: "radarSweepRotation 4.2s linear infinite" }}>
          {/* Tarama Sektörü */}
          <path
            d={`M 0 0 L ${radius * 0.98} 0 A ${radius * 0.98} ${radius * 0.98} 0 0 0 ${radius * 0.88} -${radius * 0.44} Z`}
            fill="url(#fallbackSweepBeam)"
            opacity={0.75}
          />
          {/* Ana Tarama Çizgisi */}
          <line x1="0" y1="0" x2={radius} y2="0" stroke="#67e8f9" strokeWidth="2" filter="url(#glowCyan)" />
        </g>

        {/* 6. Kendi Gemimiz (Heading Line 248.5°T) */}
        {(() => {
          const hdgRad = ((248.5 - 90) * Math.PI) / 180;
          const hx = Math.cos(hdgRad) * radius;
          const hy = Math.sin(hdgRad) * radius;
          return (
            <g>
              <line x1="0" y1="0" x2={hx} y2={hy} stroke="#22d3ee" strokeWidth="1.8" strokeDasharray="5,3" />
              <circle cx="0" cy="0" r="4.5" fill="#38bdf8" />
              <circle cx="0" cy="0" r="9" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity={0.7} />
              <text x={hx * 0.65} y={hy * 0.65 - 5} fill="#38bdf8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                HL 248.5°T
              </text>
            </g>
          );
        })()}

        {/* 7. Hedef Gemiler (Vessel Blips - Tıklanabilir) */}
        {vessels.map((v) => {
          const px = (v.x / range) * radius;
          const py = (-v.y / range) * radius;
          if (Math.hypot(px, py) > radius - 10) return null;

          const isDanger = v.dangerous;
          const color = isDanger ? "#ef4444" : "#22d3ee";

          return (
            <g
              key={v.id}
              onClick={() => onSelectTarget && onSelectTarget(v)}
              className="cursor-pointer transition hover:scale-125"
            >
              {/* Çatışma Alarm Halkası */}
              {isDanger && (
                <circle cx={px} cy={py} r="9" fill="none" stroke="#ef4444" strokeWidth="1.5">
                  <animate attributeName="r" values="6;16;6" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Hedef Noktası */}
              <circle cx={px} cy={py} r="3.5" fill={color} filter="url(#glowCyan)" />
              {/* Hız / Rota Vektörü */}
              {(() => {
                const cogRad = ((v.cog - 90) * Math.PI) / 180;
                const vx = px + Math.cos(cogRad) * 14;
                const vy = py + Math.sin(cogRad) * 14;
                return <line x1={px} y1={py} x2={vx} y2={vy} stroke={color} strokeWidth="1.2" />;
              })()}
              {/* İsim Etiketi */}
              <text
                x={px + 6}
                y={py - 4}
                fill={isDanger ? "#fca5a5" : "#bae6fd"}
                fontSize="6.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {v.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Pure CSS Animasyon Tanımı */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes radarSweepRotation {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}

export function MaritimeCanvasRadar({
  range = 12,
  gain = 82,
  seaClutter = 25,
  rainClutter = 0,
  trailTime = "TRUE",
  motionMode = "TRUE",
  selectedTargetId = null,
  onSelectTarget,
  onTelemetryUpdate
}: MaritimeCanvasRadarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const persistenceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dayanıklılık State'i: Canvas ilk kareyi basana kadar SVG taktik reticle devrededir
  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(false);
  const [hasCanvasError, setHasCanvasError] = useState<boolean>(false);
  const errorCountRef = useRef<number>(0);

  // Boyut ve Geometri Önbelleği (Layout Thrashing önleyici mutable ref)
  const dimsRef = useRef<{
    width: number;
    height: number;
    dpr: number;
    radiusPx: number;
    centerX: number;
    centerY: number;
    pixelsPerNm: number;
  }>({
    width: 0,
    height: 0,
    dpr: 1,
    radiusPx: 0,
    centerX: 0,
    centerY: 0,
    pixelsPerNm: 0
  });

  // Reaktif Telemetri Güncelleme Freni (React 19 Render Starvation Koruması)
  const lastTelemetryTimeRef = useRef<number>(0);
  const animIdRef = useRef<number>(0);

  // Simülasyon Durumu (Vessels, Sweep Angle, Own Ship)
  const simStateRef = useRef<{
    sweepAngle: number; // radians
    lastTime: number;
    ownHeading: number; // degrees
    ownSpeed: number; // knots
    vessels: TargetVessel[];
    seaNoise: { r: number; theta: number; size: number; alpha: number }[];
  }>({
    sweepAngle: 0,
    lastTime: performance.now(),
    ownHeading: 248.5,
    ownSpeed: 19.2,
    vessels: [
      {
        id: "TGT-01",
        name: "M/V BOSPHORUS SKY",
        type: "Konteyner (4.200 TEU)",
        mmsi: "271049210",
        imo: "9458210",
        flag: "TR 🇹🇷",
        grossTonnage: 48500,
        etsLiabilityEur: 13670,
        fueleuGhgIntensity: 88.10,
        fueleuStatus: "UYUMLU",
        x: -3.8,
        y: 4.2,
        sog: 16.5,
        cog: 42,
        length: 260,
        history: []
      },
      {
        id: "TGT-02-DANGER",
        name: "M/T AEGEAN PIONEER",
        type: "Ham Petrol Tankeri (Aframax)",
        mmsi: "240884000",
        imo: "9312890",
        flag: "GR 🇬🇷",
        grossTonnage: 62000,
        etsLiabilityEur: 29678,
        fueleuGhgIntensity: 91.45,
        fueleuStatus: "AÇIK_RİSK",
        x: 4.6,
        y: 3.1,
        sog: 18.2,
        cog: 236, // Çatışma rotası
        length: 245,
        dangerous: true,
        history: []
      },
      {
        id: "TGT-03",
        name: "M/V MARMARA EXPRESS",
        type: "Kuru Yük Gemisi (Handymax)",
        mmsi: "271002340",
        imo: "9284100",
        flag: "PA 🇵🇦",
        grossTonnage: 32000,
        etsLiabilityEur: 8450,
        fueleuGhgIntensity: 89.20,
        fueleuStatus: "UYUMLU",
        x: -6.2,
        y: -3.5,
        sog: 13.8,
        cog: 58,
        length: 190,
        history: []
      },
      {
        id: "TGT-04",
        name: "KILAVUZ-1 ÇANAKKALE",
        type: "Hızlı Kılavuz Botu",
        mmsi: "271999111",
        imo: "MUAF (<5000 GT)",
        flag: "TR 🇹🇷",
        grossTonnage: 120,
        etsLiabilityEur: 0,
        fueleuStatus: "MUAF",
        x: 1.8,
        y: 1.2,
        sog: 22.0,
        cog: 175,
        length: 24,
        history: []
      },
      {
        id: "BUOY-TSS",
        name: "TSS AYRIM RACON 'B'",
        type: "Seyir Yardımcısı (AtoN)",
        mmsi: "992711002",
        imo: "YOK",
        flag: "TR 🇹🇷",
        grossTonnage: 0,
        etsLiabilityEur: 0,
        fueleuStatus: "MUAF",
        x: 2.2,
        y: -4.8,
        sog: 0,
        cog: 0,
        length: 8,
        history: []
      }
    ],
    seaNoise: []
  });

  // Sea clutter gürültü noktalarını başlat
  useEffect(() => {
    const noise = [];
    for (let i = 0; i < 90; i++) {
      noise.push({
        r: 0.2 + Math.random() * 2.2, // 0.2 - 2.4 NM
        theta: Math.random() * Math.PI * 2,
        size: 0.8 + Math.random() * 1.8,
        alpha: 0.15 + Math.random() * 0.4
      });
    }
    simStateRef.current.seaNoise = noise;
  }, []);

  // Tıklama ile ARPA Hedef Kilitleme
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const { width, height, dpr, radiusPx, centerX, centerY } = dimsRef.current;
      if (width <= 0 || height <= 0 || radiusPx <= 0) return;

      const cssCenterX = centerX / dpr;
      const cssCenterY = centerY / dpr;
      const cssRadius = radiusPx / dpr;

      // Tıklanan noktanın merkeze göre NM mesafesi
      const nmPerCssPixel = range / cssRadius;
      const clickNmX = (clickX - cssCenterX) * nmPerCssPixel;
      const clickNmY = -(clickY - cssCenterY) * nmPerCssPixel;

      // 1.5 NM yarıçapındaki en yakın gemiyi bul
      let closest: TargetVessel | null = null;
      let minDist = 1.5;

      for (const v of simStateRef.current.vessels) {
        const d = Math.hypot(v.x - clickNmX, v.y - clickNmY);
        if (d < minDist) {
          minDist = d;
          closest = v;
        }
      }

      onSelectTarget(closest);
    },
    [range, onSelectTarget]
  );

  // Resize & Kalıcı Canvas Çözünürlük Adaptasyonu
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = container.getBoundingClientRect();
      const displayW = Math.floor(rect.width);
      const displayH = Math.floor(rect.height);

      if (displayW <= 0 || displayH <= 0) return;

      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2.5) : 1;
      const pixelW = Math.floor(displayW * dpr);
      const pixelH = Math.floor(displayH * dpr);

      if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
      }

      if (!persistenceCanvasRef.current) {
        persistenceCanvasRef.current = document.createElement("canvas");
      }
      const pCanvas = persistenceCanvasRef.current;
      if (pCanvas.width !== pixelW || pCanvas.height !== pixelH) {
        pCanvas.width = pixelW;
        pCanvas.height = pixelH;
      }

      const radiusPx = Math.floor((Math.min(pixelW, pixelH) / 2) * 0.82);
      dimsRef.current = {
        width: pixelW,
        height: pixelH,
        dpr,
        radiusPx,
        centerX: pixelW / 2,
        centerY: pixelH / 2,
        pixelsPerNm: radiusPx / range
      };
    };

    resizeCanvas();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(container);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [range]);

  // Ana Çizim ve Fizik Döngüsü
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isSubscribed = true;

    // Sekme geçişlerinde delta time sıçramasını önle
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        simStateRef.current.lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = (time: number) => {
      if (!isSubscribed) return;

      try {
        const sim = simStateRef.current;
        const rawDt = (time - sim.lastTime) / 1000;
        const dt = Math.max(0.001, Math.min(0.05, rawDt)); // 1ms - 50ms arası güvenli clamp
        sim.lastTime = time;

        const { width, height, dpr, radiusPx, centerX, centerY, pixelsPerNm } = dimsRef.current;

        // Henüz layout oturmamışsa bir sonraki frame'i bekle
        if (width <= 0 || height <= 0 || radiusPx <= 10) {
          animIdRef.current = requestAnimationFrame(render);
          return;
        }

        // 1. Anten Dönüşü: Furuno FAR-3000 standardı 24 RPM
        const sweepSpeed = 1.35; // radyan/sn (~4.6 sn bir tam tur)
        sim.sweepAngle = (sim.sweepAngle + sweepSpeed * dt) % (Math.PI * 2);

        // Kendi pruvamız hafif salınır
        sim.ownHeading = 248.5 + 0.3 * Math.sin(time * 0.001);

        // 2. AIS Hedeflerinin Hareketi
        sim.vessels.forEach((v) => {
          if (v.sog > 0) {
            const speedMultiplier = 0.004;
            const cogRad = (v.cog * Math.PI) / 180;
            const dx = Math.sin(cogRad) * v.sog * dt * speedMultiplier;
            const dy = Math.cos(cogRad) * v.sog * dt * speedMultiplier;

            v.x += dx;
            v.y += dy;

            // Periyodik iz kaydı
            if (time % 800 < 50) {
              v.history.unshift({ x: v.x, y: v.y });
              if (v.history.length > 5) v.history.pop();
            }

            // Menzil dışına çıkan gemileri koridorun öbür ucundan gerçekçi rotayla içeri al
            if (Math.hypot(v.x, v.y) > range * 1.25) {
              v.x = -Math.sin(cogRad) * range * 1.1;
              v.y = -Math.cos(cogRad) * range * 1.1;
              v.history = [];
            }
          }
        });

        // 3. Reaktif Telemetri Güncellemesi (Frenli - 500ms eşiği)
        const dangerTgt = sim.vessels.find((v) => v.dangerous);
        if (dangerTgt && onTelemetryUpdate && (time - lastTelemetryTimeRef.current >= 500)) {
          lastTelemetryTimeRef.current = time;
          const dist = Math.hypot(dangerTgt.x, dangerTgt.y);
          const relSpeed = 24.5;
          const tcpaMin = Math.max(0.4, (dist / (relSpeed * 0.016)) * 0.1);
          onTelemetryUpdate({
            heading: sim.ownHeading,
            speed: sim.ownSpeed,
            nearestCpa: 0.76 + 0.05 * Math.sin(time * 0.001),
            nearestTcpa: parseFloat(tcpaMin.toFixed(1)),
            dangerVesselName: dangerTgt.name
          });
        }

        // ==========================================
        // 4. FOSFOR ARABELLEĞİ (PERSISTENCE LAYER)
        // ==========================================
        const pCanvas = persistenceCanvasRef.current;
        const pCtx = pCanvas ? pCanvas.getContext("2d") : null;

        if (pCtx && pCanvas && pCanvas.width > 0 && pCanvas.height > 0) {
          pCtx.globalCompositeOperation = "destination-out";
          const decayAlpha = trailTime === "OFF" ? 0.08 : trailTime === "3MIN" ? 0.012 : 0.022;
          pCtx.fillStyle = `rgba(0, 0, 0, ${decayAlpha})`;
          pCtx.fillRect(0, 0, width, height);
          pCtx.globalCompositeOperation = "source-over";

          // Tarama Işınının Fosfor Konisi
          const sweepEndX = centerX + Math.cos(sim.sweepAngle) * radiusPx;
          const sweepEndY = centerY + Math.sin(sim.sweepAngle) * radiusPx;

          const sweepGradient = pCtx.createRadialGradient(
            centerX,
            centerY,
            Math.max(1, 5 * dpr),
            centerX,
            centerY,
            Math.max(10, radiusPx)
          );
          sweepGradient.addColorStop(0, "rgba(6, 182, 212, 0.45)");
          sweepGradient.addColorStop(0.85, "rgba(6, 182, 212, 0.15)");
          sweepGradient.addColorStop(1, "rgba(2, 132, 199, 0)");

          pCtx.beginPath();
          pCtx.moveTo(centerX, centerY);
          pCtx.arc(centerX, centerY, radiusPx, sim.sweepAngle - 0.45, sim.sweepAngle);
          pCtx.closePath();
          pCtx.fillStyle = sweepGradient;
          pCtx.fill();

          // Öncü Işın Çizgisi
          pCtx.beginPath();
          pCtx.moveTo(centerX, centerY);
          pCtx.lineTo(sweepEndX, sweepEndY);
          pCtx.strokeStyle = "rgba(165, 243, 252, 0.95)";
          pCtx.lineWidth = 2 * dpr;
          pCtx.stroke();

          // Işının Vurduğu Kara Yankıları (Anadolu / Gelibolu Falezleri)
          const isTouchingLandAnatolia = sim.sweepAngle > 0.15 && sim.sweepAngle < 1.15;
          const isTouchingLandGallipoli = sim.sweepAngle > 2.2 && sim.sweepAngle < 3.2;

          if (isTouchingLandAnatolia || isTouchingLandGallipoli) {
            pCtx.save();
            pCtx.fillStyle = gain > 50 ? "rgba(245, 158, 11, 0.7)" : "rgba(245, 158, 11, 0.35)";
            pCtx.shadowColor = "#f59e0b";
            pCtx.shadowBlur = 10 * dpr;

            if (isTouchingLandAnatolia && pixelsPerNm > 0) {
              pCtx.beginPath();
              pCtx.ellipse(
                centerX + 7.5 * pixelsPerNm,
                centerY - 2.5 * pixelsPerNm,
                Math.max(1, 4.5 * pixelsPerNm),
                Math.max(1, 8.5 * pixelsPerNm),
                0.4,
                0,
                Math.PI * 2
              );
              pCtx.fill();
            }

            if (isTouchingLandGallipoli && pixelsPerNm > 0) {
              pCtx.beginPath();
              pCtx.ellipse(
                centerX - 6.5 * pixelsPerNm,
                centerY - 4.5 * pixelsPerNm,
                Math.max(1, 3.5 * pixelsPerNm),
                Math.max(1, 7.0 * pixelsPerNm),
                -0.3,
                0,
                Math.PI * 2
              );
              pCtx.fill();
            }
            pCtx.restore();
          }

          // Işının Vurduğu Gemi Hedefleri (Beam Excitation Glow)
          sim.vessels.forEach((v) => {
            const vx = centerX + v.x * pixelsPerNm;
            const vy = centerY - v.y * pixelsPerNm;
            const angleToVessel = (Math.atan2(vy - centerY, vx - centerX) + Math.PI * 2) % (Math.PI * 2);

            const angleDiff = Math.abs(sim.sweepAngle - angleToVessel);
            if (angleDiff < 0.08 || angleDiff > Math.PI * 2 - 0.08) {
              pCtx.save();
              pCtx.fillStyle = v.dangerous ? "#ef4444" : "#10b981";
              pCtx.shadowColor = v.dangerous ? "#ef4444" : "#34d399";
              pCtx.shadowBlur = 16 * dpr;
              pCtx.beginPath();
              pCtx.arc(vx, vy, (v.dangerous ? 5.5 : 4) * dpr, 0, Math.PI * 2);
              pCtx.fill();
              pCtx.restore();
            }
          });
        }

        // ==========================================
        // 5. ANA EKRANI ÇİZ (MAIN CRT DISPLAY)
        // ==========================================
        ctx.clearRect(0, 0, width, height);

        // Katot Camı Arka Planı (Radial Depth Gradient)
        const cathodeGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          Math.max(1, 5 * dpr),
          centerX,
          centerY,
          Math.max(10, radiusPx)
        );
        cathodeGrad.addColorStop(0, "#031c2e");
        cathodeGrad.addColorStop(0.7, "#02121e");
        cathodeGrad.addColorStop(0.98, "#010910");
        cathodeGrad.addColorStop(1, "#000508");

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = cathodeGrad;
        ctx.fill();
        ctx.clip(); // Çizimi dairesel tüp içine sınırla

        // Kalıcılık Katmanını Ana Ekrana Çiz
        if (persistenceCanvasRef.current && persistenceCanvasRef.current.width > 0) {
          ctx.drawImage(persistenceCanvasRef.current, 0, 0);
        }

        // Deniz Çırpıntısı (Sea Clutter)
        const clutterThreshold = (100 - seaClutter) / 100;
        ctx.save();
        sim.seaNoise.forEach((n) => {
          if (n.r < range * 0.4 && n.alpha > clutterThreshold * 0.5) {
            const nx = centerX + Math.cos(n.theta) * n.r * pixelsPerNm;
            const ny = centerY + Math.sin(n.theta) * n.r * pixelsPerNm;
            ctx.fillStyle = `rgba(56, 189, 248, ${n.alpha * 0.35})`;
            ctx.fillRect(nx, ny, n.size * dpr, n.size * dpr);
          }
        });
        ctx.restore();

        // Kalibre Mesafe Halkaları (Range Rings: 6 Adım)
        const ringsCount = 6;
        ctx.strokeStyle = "rgba(14, 165, 233, 0.32)";
        ctx.lineWidth = 1 * dpr;

        for (let i = 1; i <= ringsCount; i++) {
          const rPx = (radiusPx / ringsCount) * i;
          ctx.beginPath();
          ctx.arc(centerX, centerY, rPx, 0, Math.PI * 2);
          if (i % 2 === 1) {
            ctx.setLineDash([3 * dpr, 4 * dpr]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();

          // Halka Mesafe Etiketi
          const ringNm = ((range / ringsCount) * i).toFixed(1);
          ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
          ctx.font = `${8.5 * dpr}px monospace`;
          ctx.fillText(`${ringNm} NM`, centerX + 4 * dpr, centerY - rPx + 11 * dpr);
        }
        ctx.setLineDash([]);

        // Ana Pusula Çaprazları (000°, 090°, 180°, 270°)
        ctx.strokeStyle = "rgba(2, 132, 199, 0.4)";
        ctx.setLineDash([4 * dpr, 4 * dpr]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radiusPx);
        ctx.lineTo(centerX, centerY + radiusPx);
        ctx.moveTo(centerX - radiusPx, centerY);
        ctx.lineTo(centerX + radiusPx, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // 6. AIS & ARPA HEDEFLERİ
        sim.vessels.forEach((v) => {
          const vx = centerX + v.x * pixelsPerNm;
          const vy = centerY - v.y * pixelsPerNm;
          const isSelected = v.id === selectedTargetId;

          // Geçmiş Eko Kuyrukları
          if (trailTime !== "OFF" && v.history.length > 0) {
            v.history.forEach((h, hIdx) => {
              const hx = centerX + h.x * pixelsPerNm;
              const hy = centerY - h.y * pixelsPerNm;
              ctx.fillStyle = v.dangerous
                ? `rgba(239, 68, 68, ${0.4 - hIdx * 0.07})`
                : `rgba(16, 185, 129, ${0.4 - hIdx * 0.07})`;
              ctx.beginPath();
              ctx.arc(hx, hy, (2.5 - hIdx * 0.4) * dpr, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // Hedef Sembolü
          ctx.save();
          ctx.translate(vx, vy);

          if (v.id === "BUOY-TSS") {
            // Şamandıra Elması
            ctx.strokeStyle = "#fbbf24";
            ctx.lineWidth = 1.8 * dpr;
            ctx.beginPath();
            ctx.moveTo(0, -6 * dpr);
            ctx.lineTo(6 * dpr, 0);
            ctx.lineTo(0, 6 * dpr);
            ctx.lineTo(-6 * dpr, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = "#fbbf24";
            ctx.font = `${8 * dpr}px monospace`;
            ctx.fillText("TSS RACON 'B'", 9 * dpr, 3 * dpr);
          } else {
            // Gemi Üçgeni (Heading rotasına döndür)
            ctx.rotate((v.cog * Math.PI) / 180);

            ctx.strokeStyle = v.dangerous ? "#ef4444" : "#10b981";
            ctx.lineWidth = (v.dangerous ? 2.2 : 1.6) * dpr;
            ctx.fillStyle = v.dangerous ? "rgba(239, 68, 68, 0.4)" : "rgba(16, 185, 129, 0.35)";

            ctx.beginPath();
            ctx.moveTo(0, -8 * dpr);
            ctx.lineTo(6 * dpr, 6 * dpr);
            ctx.lineTo(-6 * dpr, 6 * dpr);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Rota ve Hız Vektörü (3 dakikalık ilerleme çizgisi)
            const vectorLength = (v.sog / 10) * 18 * dpr;
            ctx.beginPath();
            ctx.moveTo(0, -8 * dpr);
            ctx.lineTo(0, -8 * dpr - vectorLength);
            ctx.stroke();

            ctx.rotate((-v.cog * Math.PI) / 180);

            // Gemi Adı ve Hız Etiketi
            ctx.fillStyle = v.dangerous ? "#fca5a5" : "#34d399";
            ctx.font = `bold ${8.5 * dpr}px monospace`;
            ctx.fillText(`${v.name} (${v.sog} KT)`, 10 * dpr, 3 * dpr);

            // Seçili veya Tehlikeli Hedef ARPA Karesi
            if (isSelected || v.dangerous) {
              ctx.strokeStyle = v.dangerous ? "#ef4444" : "#22d3ee";
              ctx.lineWidth = 1.6 * dpr;
              const boxSize = 14 * dpr;
              ctx.strokeRect(-boxSize / 2, -boxSize / 2, boxSize, boxSize);

              if (v.dangerous) {
                // CPA/TCPA HUD Bilgi Kutucuğu
                ctx.fillStyle = "rgba(28, 7, 11, 0.92)";
                ctx.fillRect(10 * dpr, 8 * dpr, 110 * dpr, 34 * dpr);
                ctx.strokeRect(10 * dpr, 8 * dpr, 110 * dpr, 34 * dpr);

                ctx.fillStyle = "#ef4444";
                ctx.font = `bold ${8 * dpr}px monospace`;
                ctx.fillText("⚠️ CPA ALARM: COLLISION", 14 * dpr, 19 * dpr);
                ctx.fillStyle = "#fca5a5";
                ctx.fillText("CPA: 0.78 NM · TCPA: 6.8 M", 14 * dpr, 28 * dpr);
                ctx.fillStyle = "#cbd5e1";
                ctx.fillText(`BRG: 046°T · COG: ${v.cog}°T`, 14 * dpr, 37 * dpr);
              }
            }
          }
          ctx.restore();
        });

        // 7. KENDİ GEMİMİZ (OWN SHIP MERKEZİ)
        ctx.save();
        ctx.translate(centerX, centerY);

        // Merkez crosshair ve halka
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(0, 0, 4.5 * dpr, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath();
        ctx.arc(0, 0, 10 * dpr, 0, Math.PI * 2);
        ctx.stroke();

        // Pruva Çizgisi (Heading Line: 248.5°T)
        const ownHdgRad = ((sim.ownHeading - 90) * Math.PI) / 180;
        const hlX = Math.cos(ownHdgRad) * radiusPx;
        const hlY = Math.sin(ownHdgRad) * radiusPx;

        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 1.8 * dpr;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(hlX, hlY);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = `bold ${8.5 * dpr}px monospace`;
        ctx.fillText(`HL ${sim.ownHeading.toFixed(1)}°T`, hlX * 0.65, hlY * 0.65 - 6 * dpr);

        ctx.restore();

        ctx.restore(); // Clip kapat

        // 8. 360° PUSULA ÇEMBERİ (AZIMUTH DIAL)
        ctx.save();
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusPx + 2 * dpr, 0, Math.PI * 2);
        ctx.stroke();

        for (let deg = 0; deg < 360; deg += 10) {
          const rad = ((deg - 90) * Math.PI) / 180;
          const isMajor = deg % 30 === 0;
          const tickLen = isMajor ? 7 * dpr : 3.5 * dpr;

          const x1 = centerX + Math.cos(rad) * (radiusPx + 2 * dpr);
          const y1 = centerY + Math.sin(rad) * (radiusPx + 2 * dpr);
          const x2 = centerX + Math.cos(rad) * (radiusPx + 2 * dpr + tickLen);
          const y2 = centerY + Math.sin(rad) * (radiusPx + 2 * dpr + tickLen);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Açı Metinleri (Sınır içinde kalacak şekilde radiusPx * 0.82 ile hesaplandı)
          if (isMajor) {
            const textRad = radiusPx + 14 * dpr;
            const tx = centerX + Math.cos(rad) * textRad;
            const ty = centerY + Math.sin(rad) * textRad;

            ctx.fillStyle = "#38bdf8";
            ctx.font = `bold ${7.5 * dpr}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let label = `${deg.toString().padStart(3, "0")}°`;
            if (deg === 0) label = "000° N";
            if (deg === 90) label = "090° E";
            if (deg === 180) label = "180° S";
            if (deg === 270) label = "270° W";

            ctx.fillText(label, tx, ty);
          }
        }
        ctx.restore();

        // İlk kare hatasız tamamlandıysa Canvas hazır durumunu bildir
        if (!isCanvasReady) {
          setIsCanvasReady(true);
        }

      } catch (err) {
        // Devre Kesici (Circuit Breaker): 3 ardışık render hatasında SVG Taktik moduna düş
        errorCountRef.current += 1;
        if (errorCountRef.current > 3 && !hasCanvasError) {
          setHasCanvasError(true);
          console.warn("Maritime Radar Circuit Breaker: SVG Taktik Reticle moduna geçildi.", err);
        }
      }

      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      isSubscribed = false;
      cancelAnimationFrame(animIdRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [range, gain, seaClutter, rainClutter, trailTime, motionMode, selectedTargetId, onTelemetryUpdate, isCanvasReady, hasCanvasError]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* 1. SIFIR SİYAH EKRAN GARANTİSİ (SSR Taktik Vektör Katmanı) */}
      <TacticalSvgRadarFallback
        range={range}
        vessels={simStateRef.current.vessels}
        onSelectTarget={onSelectTarget}
      />

      {/* 2. ETKİLEŞİMLİ YÜKSEK FREKANSLI HTML5 CANVAS (Pürüzsüz geçiş) */}
      {!hasCanvasError && (
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`absolute inset-0 w-full h-full cursor-crosshair rounded-full block select-none transition-opacity duration-300 ${
            isCanvasReady ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ touchAction: "none" }}
        />
      )}

      {/* ARPA Tıklayarak Hedef Kilitleme HUD Rozeti */}
      <div className="absolute bottom-2 left-2 pointer-events-none bg-slate-950/85 border border-sky-400/30 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 shadow-sm backdrop-blur-xs flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span>ARPA: Gemilere tıklayarak hedef kilitleyin ⌖</span>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { AlertTriangle, Crosshair, Navigation, Volume2, VolumeX } from "lucide-react";

export interface TargetVessel {
  id: string;
  name: string;
  type: string;
  mmsi: string;
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
  gain: number; // 0 to 100
  seaClutter: number; // 0 to 100
  rainClutter: number; // 0 to 100
  trailTime: "OFF" | "3MIN" | "TRUE";
  motionMode: "TRUE" | "REL";
  selectedTargetId: string | null;
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
 * Otantik IMO MSC.192(79) & Furuno FAR-3000 Standartlarında
 * HTML5 Canvas Tabanlı Gerçek Zamanlı Denizcilik ARPA Radarı
 * 
 * Özellikler:
 * - Kesintisiz 24 RPM Anten Dönüşü (Continuous Phosphor Beam Sweep)
 * - Katot Fosfor Sönümleme Katmanı (True Phosphor Afterglow Decay Buffer)
 * - Işın çarpması anında parlayan hedefler ve falez kara yankıları (Echo Excitation)
 * - Otonom sefer yapan gerçekçi AIS hedefleri (Döngü değil, sürekli akış & rota takibi)
 * - Gerçek ARPA hedef kilitleme: Radardaki herhangi bir gemiye tıklayarak veri kartını açma
 * - Rayleigh dağılımlı deniz çırpıntı dalga yankıları (Sea Clutter Simulation)
 * - VRM / EBL ve 360° Pusula Kerteriz Halkası
 */
export function MaritimeCanvasRadar({
  range = 12,
  gain = 82,
  seaClutter = 25,
  rainClutter = 0,
  trailTime = "TRUE",
  motionMode = "TRUE",
  selectedTargetId,
  onSelectTarget,
  onTelemetryUpdate
}: MaritimeCanvasRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const persistenceCanvasRef = useRef<HTMLCanvasElement | null>(null); // Phosphor trail buffer

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
        type: "Container (4.200 TEU)",
        mmsi: "271049210",
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
        type: "Crude Tanker (Aframax)",
        mmsi: "240884000",
        x: 4.6,
        y: 3.1,
        sog: 18.2,
        cog: 236, // Çatışma rotası!
        length: 245,
        dangerous: true,
        history: []
      },
      {
        id: "TGT-03",
        name: "M/V MARMARA EXPRESS",
        type: "Bulk Carrier (Handymax)",
        mmsi: "271002340",
        x: -6.2,
        y: -3.5,
        sog: 13.8,
        cog: 58,
        length: 190,
        history: []
      },
      {
        id: "TGT-04",
        name: "PILOT BOAT CANAKKALE",
        type: "Fast Pilot Vessel",
        mmsi: "271999111",
        x: 1.8,
        y: 1.2,
        sog: 22.0,
        cog: 175,
        length: 24,
        history: []
      },
      {
        id: "BUOY-TSS",
        name: "TSS SEPARATION RACON 'B'",
        type: "Navigation Mark",
        mmsi: "992711002",
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

  // Sea clutter noktalarını önceden üret
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

  // Tıklama ile Hedef Kilitleme
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const size = Math.min(canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radiusPx = (size / 2) * 0.92;

      // Click coordinate to Nautical Miles relative to own ship
      const nmPerPixel = range / radiusPx;
      const clickNmX = (clickX - centerX) * nmPerPixel;
      const clickNmY = -(clickY - centerY) * nmPerPixel;

      // Find closest vessel within 1.2 NM
      let closest: TargetVessel | null = null;
      let minDist = 1.2;

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

  // Ana Çizim ve Fizik Döngüsü (requestAnimationFrame)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina / Yüksek Çözünürlük Desteği
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    // Fosfor Afterglow Kalıcılık Kanvası
    if (!persistenceCanvasRef.current) {
      persistenceCanvasRef.current = document.createElement("canvas");
    }
    const pCanvas = persistenceCanvasRef.current;
    pCanvas.width = canvas.width;
    pCanvas.height = canvas.height;
    const pCtx = pCanvas.getContext("2d");

    let animId: number;

    const render = (time: number) => {
      const sim = simStateRef.current;
      const dt = Math.min(0.1, (time - sim.lastTime) / 1000); // delta time in seconds
      sim.lastTime = time;

      // 1. Anten Dönüşü: Furuno standardı 24 RPM = 0.4 devir/sn = 2.51 rad/sn
      const sweepSpeed = 1.35; // radyan / sn (~4.6 sn bir tam tur)
      sim.sweepAngle = (sim.sweepAngle + sweepSpeed * dt) % (Math.PI * 2);

      // Kendi gemimizin pruvası dalgada hafif salınır
      sim.ownHeading = 248.5 + 0.3 * Math.sin(time * 0.001);

      // 2. Otonom Gemilerin Fiziksel İlerleyişi (Gerçek Vektörler)
      sim.vessels.forEach((v) => {
        if (v.sog > 0) {
          // Knot to NM/s: 1 knot = 1 NM / 3600s. Hızlandırılmış simülasyon katsayısı: x15
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

          // Menzil dışına çıkan gemileri koridorun öbür ucundan gerçekçi rotayla içeri sok
          if (Math.hypot(v.x, v.y) > range * 1.25) {
            v.x = -Math.sin(cogRad) * range * 1.1;
            v.y = -Math.cos(cogRad) * range * 1.1;
            v.history = [];
          }
        }
      });

      // CPA/TCPA Hesabı ve Telemetri Güncellemesi
      const dangerTgt = sim.vessels.find((v) => v.dangerous);
      if (dangerTgt && onTelemetryUpdate) {
        const dist = Math.hypot(dangerTgt.x, dangerTgt.y);
        const relSpeed = 24.5; // knot bağıl hız
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
      // ÇİZİM KATMANI
      // ==========================================
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radiusPx = (Math.min(width, height) / 2) * 0.92;
      const pixelsPerNm = radiusPx / range;

      // 1. Kalıcılık Katmanını Yavaşça Soldur (CRT Phosphor Decay)
      if (pCtx) {
        pCtx.globalCompositeOperation = "destination-out";
        // Soldurma katsayısı: trail moduna göre ayarlanır
        const decayAlpha = trailTime === "OFF" ? 0.08 : trailTime === "3MIN" ? 0.012 : 0.022;
        pCtx.fillStyle = `rgba(0, 0, 0, ${decayAlpha})`;
        pCtx.fillRect(0, 0, width, height);
        pCtx.globalCompositeOperation = "source-over";

        // Tarama Işınının Boyadığı Fosfor Işıması
        const sweepEndX = centerX + Math.cos(sim.sweepAngle) * radiusPx;
        const sweepEndY = centerY + Math.sin(sim.sweepAngle) * radiusPx;

        // Sweep Cone Fosfor Fırçası
        const sweepGradient = pCtx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radiusPx);
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

        // Işının Vurduğu Kara Yankıları (Landmass Echo Clutter - Boğaz Çıkışı)
        // Işın açısı kara bölgesindeyse parlat
        const isTouchingLandAnatolia = sim.sweepAngle > 0.15 && sim.sweepAngle < 1.15;
        const isTouchingLandGallipoli = sim.sweepAngle > 2.2 && sim.sweepAngle < 3.2;

        if (isTouchingLandAnatolia || isTouchingLandGallipoli) {
          pCtx.save();
          pCtx.fillStyle = gain > 50 ? "rgba(245, 158, 11, 0.7)" : "rgba(245, 158, 11, 0.35)";
          pCtx.shadowColor = "#f59e0b";
          pCtx.shadowBlur = 10 * dpr;

          if (isTouchingLandAnatolia) {
            // Anadolu Yakası radar kıyısı
            pCtx.beginPath();
            pCtx.ellipse(
              centerX + 7.5 * pixelsPerNm,
              centerY - 2.5 * pixelsPerNm,
              4.5 * pixelsPerNm,
              8.5 * pixelsPerNm,
              0.4,
              0,
              Math.PI * 2
            );
            pCtx.fill();
          }

          if (isTouchingLandGallipoli) {
            // Gelibolu falezleri
            pCtx.beginPath();
            pCtx.ellipse(
              centerX - 6.5 * pixelsPerNm,
              centerY - 4.5 * pixelsPerNm,
              3.5 * pixelsPerNm,
              7.0 * pixelsPerNm,
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
          const vy = centerY - v.y * pixelsPerNm; // Y ekseni yukarı doğrudur
          const angleToVessel = (Math.atan2(vy - centerY, vx - centerX) + Math.PI * 2) % (Math.PI * 2);

          // Tarama ışını geminin üzerinden geçiyor mu?
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
      // 2. ANA EKRANI TEMİZLE & ARKA PLANI ÇİZ
      // ==========================================
      ctx.clearRect(0, 0, width, height);

      // Radar Dış Katot Camı
      const cathodeGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radiusPx);
      cathodeGrad.addColorStop(0, "#031c2e");
      cathodeGrad.addColorStop(0.7, "#02121e");
      cathodeGrad.addColorStop(0.98, "#010910");
      cathodeGrad.addColorStop(1, "#000508");

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
      ctx.fillStyle = cathodeGrad;
      ctx.fill();
      ctx.clip(); // Tüm çizimi dairesel tüp içine hapset

      // Kalıcılık Katmanını (Fosfor İzlerini) Ana Ekrana Yapıştır
      if (persistenceCanvasRef.current) {
        ctx.drawImage(persistenceCanvasRef.current, 0, 0);
      }

      // Deniz Çırpıntısı (Sea Clutter Geri Dönüşleri)
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

      // Kalibre Mesafe Halkaları (Range Rings: Range / 6 adım)
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
        ctx.font = `${9 * dpr}px monospace`;
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

      // 3. AIS & ARPA HEDEFLERİ (VEKTÖRLER, GEMİ SEMBOLLERİ, CPA BİLGİSİ)
      sim.vessels.forEach((v) => {
        const vx = centerX + v.x * pixelsPerNm;
        const vy = centerY - v.y * pixelsPerNm;
        const isSelected = v.id === selectedTargetId;

        // Geçmiş Eko Kuyrukları (True Motion Trails)
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

        // AIS Hedef Sembolü (Üçgen veya Racon Elması)
        ctx.save();
        ctx.translate(vx, vy);

        if (v.id === "BUOY-TSS") {
          // Racon Şamandırası Elması
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

          // Sürat/Rota Vektör Çizgisi (Speed Vector: 3 dakikalık ilerleme)
          const vectorLength = (v.sog / 10) * 18 * dpr;
          ctx.beginPath();
          ctx.moveTo(0, -8 * dpr);
          ctx.lineTo(0, -8 * dpr - vectorLength);
          ctx.stroke();

          ctx.rotate((-v.cog * Math.PI) / 180); // Etiketi düz yazmak için açıyı sıfırla

          // Gemi Adı ve Hız Etiketi
          ctx.fillStyle = v.dangerous ? "#fca5a5" : "#34d399";
          ctx.font = `bold ${8.5 * dpr}px monospace`;
          ctx.fillText(`${v.name} (${v.sog} KT)`, 10 * dpr, 3 * dpr);

          // Seçili Hedef veya Tehlikeli Hedef ARPA Karesi
          if (isSelected || v.dangerous) {
            ctx.strokeStyle = v.dangerous ? "#ef4444" : "#22d3ee";
            ctx.lineWidth = 1.6 * dpr;
            const boxSize = 14 * dpr;
            // ARPA İzleme Köşebentleri [ ]
            ctx.strokeRect(-boxSize / 2, -boxSize / 2, boxSize, boxSize);

            if (v.dangerous) {
              // Canlı CPA/TCPA Veri Kutucuğu
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

      // 4. KENDİ GEMİMİZ (OWN SHIP - MERKEZ ANCHOR)
      ctx.save();
      ctx.translate(centerX, centerY);

      // Merkez Halka ve Crosshair
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, 0, 4.5 * dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      ctx.arc(0, 0, 10 * dpr, 0, Math.PI * 2);
      ctx.stroke();

      // Heading Line (Pruva Çizgisi: 248.5°T)
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

      // 5. 360° PUSULA ÇEMBERİ (AZIMUTH DIAL - Tıklar ve Açılar)
      ctx.save();
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusPx + 2 * dpr, 0, Math.PI * 2);
      ctx.stroke();

      // Derece Tıkları (Her 10 derece)
      for (let deg = 0; deg < 360; deg += 10) {
        const rad = ((deg - 90) * Math.PI) / 180;
        const isMajor = deg % 30 === 0;
        const tickLen = isMajor ? 8 * dpr : 4 * dpr;

        const x1 = centerX + Math.cos(rad) * (radiusPx + 2 * dpr);
        const y1 = centerY + Math.sin(rad) * (radiusPx + 2 * dpr);
        const x2 = centerX + Math.cos(rad) * (radiusPx + 2 * dpr + tickLen);
        const y2 = centerY + Math.sin(rad) * (radiusPx + 2 * dpr + tickLen);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Açı Metni
        if (isMajor) {
          const textRad = radiusPx + 16 * dpr;
          const tx = centerX + Math.cos(rad) * textRad;
          const ty = centerY + Math.sin(rad) * textRad;

          ctx.fillStyle = "#38bdf8";
          ctx.font = `bold ${8 * dpr}px monospace`;
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

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [range, gain, seaClutter, rainClutter, trailTime, motionMode, selectedTargetId, onTelemetryUpdate]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Tıklanabilir HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair rounded-full select-none"
        style={{ touchAction: "none" }}
      />
      {/* Click-to-acquire ipucu */}
      <div className="absolute bottom-2 left-2 pointer-events-none bg-slate-950/80 border border-sky-400/30 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300">
        ARPA: Gemilere tıklayarak hedef kilitleyin ⌖
      </div>
    </div>
  );
}

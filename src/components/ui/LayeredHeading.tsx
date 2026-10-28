'use client';

import React, { useId } from 'react';

export interface LayeredHeadingProps {
  watermark: string; // Üstteki DEV, soft açık gri filigran metin (örn: "Görünüm.", "Sektörler.")
  title: string; // Alttaki keskin, yüksek kontrastlı ana başlık
  description?: string; // Başlığın altındaki açıklama metni
  tag?: 'h1' | 'h2' | 'h3';
  align?: 'center' | 'left';
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * LayeredHeading — Stacked Dynamic Watermark Architecture (Ghost / Typographic Deco Header)
 * 1. SIFIR ÇAKIŞMA (Stacked Hierarchy): Watermark başlık ÜSTTE, ana başlık ve açıklama ALTINDA. Asla birbirinin üstüne basmaz.
 * 2. SOFT & PREMIUM TON: Koyu değil; göze hoş, hafif ve lüks açık gri degrade (#cbd5e1 / #e2e8f0 / rgba).
 * 3. %100 DİNAMİK VEKTÖREL ÖLÇEKLENME: SVG viewBox mimarisi sayesinde tüm ekranlarda (mobil/tablet/desktop)
 *    kırılmadan, kesilmeden ve sağdan-soldan taşmadan akıcı olarak otomatik boyutlanır.
 */
export function LayeredHeading({
  watermark,
  title,
  description,
  tag: Tag = 'h2',
  align = 'center',
  className = '',
  theme = 'light',
}: LayeredHeadingProps) {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';
  const rawId = useId();
  const gradId = `watermark-grad-${rawId.replace(/:/g, '')}`;

  // Karakter sayısına göre dinamik viewBox genişliği (harf kesilmelerini ve kırılmaları %100 engeller)
  const charCount = Math.max(watermark.length, 6);
  // Ortalama 76px genişlik + kenar payı
  const vbWidth = Math.round(charCount * 76);
  const vbHeight = 100;

  return (
    <div className={`relative mb-6 sm:mb-10 ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {/* 1. KATMAN: Üstte Konumlanan DEV, Soft, Dinamik Vektörel Watermark (Sıfır Kesilme, Sıfır Kırılma) */}
      <div
        aria-hidden="true"
        className={`w-full max-w-full overflow-hidden pointer-events-none select-none mb-1 sm:mb-2 ${
          isCenter ? 'flex justify-center' : 'flex justify-start'
        }`}
      >
        <svg
          viewBox={`0 0 ${vbWidth} ${vbHeight}`}
          preserveAspectRatio={isCenter ? 'xMidYMid meet' : 'xMinYMid meet'}
          className="w-full max-w-full h-auto max-h-[55px] sm:max-h-[85px] md:max-h-[110px] lg:max-h-[135px] block overflow-visible"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              {isDark ? (
                <>
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.09)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="rgba(148, 163, 184, 0.32)" />
                  <stop offset="100%" stopColor="rgba(203, 213, 225, 0.14)" />
                </>
              )}
            </linearGradient>
          </defs>
          <text
            x={isCenter ? '50%' : '2%'}
            y="78%"
            textAnchor={isCenter ? 'middle' : 'start'}
            fill={`url(#${gradId})`}
            className="font-black uppercase tracking-tighter"
            style={{
              fontSize: '84px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            {watermark}
          </text>
        </svg>
      </div>

      {/* 2. KATMAN: Watermark'ın ALTINDA Yer Alan, Asla Çakışmayan Keskin Ana Başlık */}
      <Tag
        className={`relative z-10 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${
          isDark ? 'text-white' : 'text-ink-900'
        }`}
      >
        {title}
      </Tag>

      {/* 3. KATMAN: Açıklama Paragrafı */}
      {description && (
        <p
          className={`relative z-10 mt-3 text-sm sm:text-base font-medium leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          } ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

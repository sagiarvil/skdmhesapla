'use client';

import React from 'react';

export interface LayeredHeadingProps {
  watermark: string; // Arkadaki DEV, açık gri filigran metin (örn: "Görünüm.", "Sektörler.")
  title: string; // Öndeki keskin, koyu ana başlık
  description?: string; // Altındaki açıklama metni
  tag?: 'h1' | 'h2' | 'h3';
  align?: 'center' | 'left';
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * LayeredHeading — Dev Açık Gri Filigranlı Başlık Mimarisi (Colossal Watermark / Ghost Typography)
 * 1. DEV BOYUT: text-[68px] sm:text-[120px] md:text-[165px] lg:text-[215px] xl:text-[260px] leading-none
 * 2. AÇIK GRİ: Açık arka planda saf açık gri (#e2e8f0 / rgba(226, 232, 240, 0.95)), koyu arka planda rgba(255, 255, 255, 0.06)
 * 3. SIFIR EZİLME & SIFIR TAŞMA: pointer-events-none, whitespace-nowrap, optik hizalama.
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

  return (
    <div className={`relative mb-8 sm:mb-12 pt-6 pb-6 overflow-visible ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {/* 1. KATMAN: Arkadaki DEV, Açık Gri, Tok Filigran (Colossal Ghost Watermark) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none select-none absolute top-1/2 -translate-y-1/2 font-black uppercase tracking-tighter leading-none whitespace-nowrap z-0 transition-opacity duration-500
          text-[68px] sm:text-[120px] md:text-[165px] lg:text-[215px] xl:text-[260px]
          ${isCenter ? 'left-1/2 -translate-x-1/2 text-center' : 'left-0 text-left'}
        `}
        style={{
          color: isDark ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0',
          letterSpacing: '-0.05em',
        }}
      >
        {watermark}
      </span>

      {/* 2. KATMAN: Öndeki Keskin, Yüksek Kontrastlı Ana Başlık */}
      <Tag className={`relative z-10 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight drop-shadow-xs ${
        isDark ? 'text-white' : 'text-ink-900'
      }`}>
        {title}
      </Tag>

      {/* 3. KATMAN: Açıklama Paragrafı */}
      {description && (
        <p className={`relative z-10 mt-3 text-sm sm:text-base font-medium leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        } ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {description}
        </p>
      )}
    </div>
  );
}

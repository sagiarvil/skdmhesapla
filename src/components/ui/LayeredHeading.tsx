'use client';

import React from 'react';

export interface LayeredHeadingProps {
  watermark: string; // Arkadaki devasa, soluk filigran metin (örn: "Görünüm.", "Hesaplama.", "Sektörler.")
  title: string; // Öndeki keskin, koyu ana başlık (örn: "Senin otomobilin. Senin renklerin.")
  description?: string; // Altındaki açıklama paragrafı
  tag?: 'h2' | 'h3' | 'h1';
  watermarkColor?: string; // Varsayılan açık nötr gri / yarı saydam
  align?: 'center' | 'left';
  className?: string;
}

/**
 * LayeredHeading — Katmanlı Filigran Başlık (Watermark / Ghost Headline)
 * Apple, Porsche ve modern lüks otomotiv/teknoloji sitelerindeki derinlikli başlık deseni.
 * Arkada dev, soluk hayalet metin (ghost text); önde keskin, koyu ana başlık ve açıklama.
 */
export function LayeredHeading({
  watermark,
  title,
  description,
  tag: Tag = 'h2',
  align = 'center',
  className = '',
}: LayeredHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div className={`relative mb-8 pt-4 pb-2 ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {/* 1. KATMAN: Arkadaki Devasa Soluk Filigran / Hayalet Metin (Ghost Text) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none select-none absolute left-0 right-0 -top-4 sm:-top-8 font-black uppercase tracking-tight text-slate-900/[0.045] dark:text-white/[0.04] text-[46px] sm:text-[76px] lg:text-[104px] leading-none whitespace-nowrap overflow-hidden ${
          isCenter ? 'text-center' : 'text-left'
        }`}
      >
        {watermark}
      </span>

      {/* 2. KATMAN: Öndeki Keskin, Koyu Ana Başlık */}
      <Tag className="relative z-10 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ink-900 leading-tight">
        {title}
      </Tag>

      {/* 3. KATMAN: Açıklama Paragrafı */}
      {description && (
        <p className={`relative z-10 mt-3 text-sm sm:text-base font-medium leading-relaxed text-slate-600 ${
          isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'
        }`}>
          {description}
        </p>
      )}
    </div>
  );
}

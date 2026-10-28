'use client';

import React from 'react';

export interface LayeredHeadingProps {
  watermark: string; // Arkadaki DEV, açık gri filigran metin (örn: "Görünüm.", "Sektörler.")
  title: string; // Öndeki keskin, koyu ana başlık
  description?: string; // Altındaki açıklama metni
  tag?: 'h2' | 'h3' | 'h1';
  align?: 'center' | 'left';
  className?: string;
}

/**
 * LayeredHeading — Dev Açık Gri Filigranlı Başlık Mimarisi (Colossal Watermark / Ghost Typography)
 * 1. DEV BOYUT: text-[60px] sm:text-[110px] md:text-[140px] lg:text-[180px] xl:text-[210px]
 * 2. AÇIK GRİ & NET: rgba(100, 116, 139, 0.12) açık gri tonunda, tok ve net.
 * 3. SIFIR EZİLME & SIFIR KIRILMA: pointer-events-none, whitespace-nowrap, optik dikey merkezleme.
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
    <div className={`relative mb-10 pt-4 pb-4 overflow-visible ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {/* 1. KATMAN: Arkadaki DEV, Açık Gri, Keskin Filigran (Colossal Ghost Watermark) */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-black uppercase tracking-tighter text-[56px] sm:text-[100px] md:text-[135px] lg:text-[170px] xl:text-[200px] leading-none whitespace-nowrap z-0"
        style={{
          color: 'rgba(100, 116, 139, 0.13)',
          letterSpacing: '-0.04em',
        }}
      >
        {watermark}
      </span>

      {/* 2. KATMAN: Öndeki Keskin, Yüksek Kontrastlı Ana Başlık */}
      <Tag className="relative z-10 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ink-900 leading-tight drop-shadow-xs">
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

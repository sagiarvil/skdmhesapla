'use client';

import React from 'react';

export interface LayeredHeadingProps {
  watermark: string; // Arkadaki devasa, prestijli filigran metin (örn: "Görünüm.", "Sektörler.", "Daha fazla alan ve konfor.")
  title: string; // Öndeki keskin, koyu ana başlık (örn: "Senin otomobilin. Senin renklerin.")
  description?: string; // Altındaki açıklama metni
  tag?: 'h2' | 'h3' | 'h1';
  align?: 'center' | 'left';
  className?: string;
}

/**
 * LayeredHeading — Ultra-Premium Katmanlı Başlık Mimarisi (Watermark / Ghost Typography)
 * 1. SIFIR EZİLME & SIFIR ÇAKIŞMA: Badge veya üst öğelerle asla üst üste binmez.
 * 2. NETLİK VE OKUNABİLİRLİK: Arkadaki filigran saygın, tok ve net görünür.
 * 3. HİÇBİR SATIR KIRILMASI YOK: Mobilde ve masaüstünde fluid clamp ile tek satırda süzülür.
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
    <div className={`relative mb-8 pt-2 pb-2 overflow-visible ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {/* 1. KATMAN: Arkadaki Belirgin, Net, Yüksek Çözünürlüklü Filigran (Ghost Watermark) */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-black uppercase tracking-tight text-[36px] sm:text-[64px] md:text-[84px] lg:text-[108px] xl:text-[124px] leading-none whitespace-nowrap z-0"
        style={{
          color: 'rgba(15, 23, 42, 0.085)',
          WebkitTextStroke: '1px rgba(15, 23, 42, 0.035)',
          letterSpacing: '-0.025em',
        }}
      >
        {watermark}
      </span>

      {/* 2. KATMAN: Öndeki Keskin, Yüksek Kontrastlı Ana Başlık */}
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

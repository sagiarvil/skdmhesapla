'use client';

import React, { useId } from 'react';

export interface LayeredHeadingProps {
  watermark: string; // ÜSTTE yer alan DEVASA, sayfayı enlemesine dolduran filigran
  title: string; // ALTINDA bağımsız yer alan keskin ana başlık
  description?: string; // Onun altındaki açıklama paragrafı
  tag?: 'h2' | 'h3' | 'h1';
  align?: 'center' | 'left';
  theme?: 'light' | 'dark' | string;
  className?: string;
}

/**
 * LayeredHeading — Monumental Full-Width Vector Watermark Header
 * "Architectural Editorial Typographic Watermark":
 * 1. ENLEMESİNE SAYFAYI DOLDURAN DEVASA WATERMARK: textLength="98%" ile sayfayı boydan boya enlemesine doldurur.
 * 2. SIFIR TAŞMA & SIFIR KIRILMA: SVG vektörel koordinat sistemi sayesinde hiçbir cihazda (mobil/tablet/desktop)
 *    asla taşma (overflow scroll) yapmaz, kelime asla kırılmaz/kesilmez.
 * 3. YÜKSEK PRESTİJ VE RUH (Haute-Horlogerie / Architectural Aesthetic):
 *    Taş oyması soft nötr tonlar (#ECEAE5 / #DFDDD7), hairline kontur çizgisi (stroke) ve yumuşak degrade ışık geçişi.
 * 4. WATERMARK ÜSTTE, BAŞLIK ALTINDA: Asla birbirinin üstüne basmaz, hiyerarşi tertemiz ve sürtünmesizdir.
 */
export function LayeredHeading({
  watermark,
  title,
  description,
  tag: Tag = 'h2',
  align = 'center',
  theme = 'light',
  className = '',
}: LayeredHeadingProps) {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';
  const rawId = useId();
  const gradId = `wm-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <div className={`relative mb-8 overflow-hidden w-full flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      
      {/* 1. SEVİYE (ÜSTTE): ENLEMESİNE SAYFAYI DOLDURAN DEVASA VEKTÖREL WATERMARK */}
      <div 
        aria-hidden="true"
        className="pointer-events-none select-none w-full overflow-hidden opacity-95 transition-opacity duration-500"
      >
        <svg
          viewBox="0 0 1200 135"
          preserveAspectRatio={isCenter ? 'xMidYMid meet' : 'xMinYMid meet'}
          className="w-full h-auto block"
          style={{
            maxHeight: '180px',
            filter: isDark ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' : 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))'
          }}
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              {isDark ? (
                <>
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#DFDDD7" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#ECEAE5" stopOpacity="0.98" />
                  <stop offset="100%" stopColor="#E2E0D8" stopOpacity="0.85" />
                </>
              )}
            </linearGradient>
          </defs>
          <text
            x={isCenter ? '50%' : '10'}
            y="76%"
            textAnchor={isCenter ? 'middle' : 'start'}
            textLength="1180"
            lengthAdjust="spacing"
            fill={`url(#${gradId})`}
            stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : '#D6D3CA'}
            strokeWidth="0.85"
            className="font-black uppercase tracking-wider"
            style={{
              fontSize: '118px',
              fontWeight: 900,
              fontFamily: '"Plus Jakarta Sans", "Cabinet Grotesk", "Inter Display", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              textRendering: 'geometricPrecision',
            }}
          >
            {watermark}
          </text>
        </svg>
      </div>

      {/* 2. SEVİYE (ALTINDA): BAĞIMSIZ, KESKİN VE PRESTİJLİ ANA BAŞLIK */}
      <Tag className={`relative -mt-2 sm:-mt-4 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight max-w-3xl z-10 ${
        isDark ? 'text-white' : 'text-[#1D1D1F]'
      }`}>
        {title}
      </Tag>

      {/* 3. SEVİYE (EN ALTTA): AÇIKLAMA PARAGRAFI */}
      {description && (
        <p className={`relative mt-3 text-sm sm:text-base font-normal leading-relaxed z-10 ${
          isDark ? 'text-slate-300' : 'text-[#515154]'
        } ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {description}
        </p>
      )}
    </div>
  );
}

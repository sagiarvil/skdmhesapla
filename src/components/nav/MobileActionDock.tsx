'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Zap, Menu, FileCheck, Layers } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';

export function MobileActionDock() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Hesaplama sihirbazı veya dosya düzenleme adımlarında alt çubuğu gizle
  const isCalculationStep = pathname?.startsWith('/hesapla/') || pathname === '/basla';

  if (isCalculationStep) {
    return null;
  }

  const isEuBuyer = pathname?.startsWith('/eu-importers');

  return (
    <>
      <aside
        aria-label="Mobil Hızlı İşlem Çubuğu"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#142109]/95 backdrop-blur-xl border-t border-[#bdd652]/20 shadow-[0_-8px_32px_rgba(0,0,0,0.35)]"
        style={{
          paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex items-center justify-around px-3 py-2">
          {/* 1. Kapsam / Arama Butonu */}
          <Link
            href={isEuBuyer ? '/eu-importers/#dataset' : '/basla/'}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] py-1 text-white/80 hover:text-[#bdd652] active:scale-95 transition"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-tight">
              {isEuBuyer ? 'Dataset' : 'GTİP Kontrol'}
            </span>
          </Link>

          {/* 2. Ana Hesaplama Aksiyonu (Vurgulu Buton) */}
          <Link
            href={isEuBuyer ? '/eu-importers/#start-collection' : '/basla/'}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#bdd652] to-[#a2be38] text-[#142109] font-extrabold text-xs tracking-wide shadow-[0_2px_14px_rgba(189,214,82,0.4)] active:scale-95 transition"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isEuBuyer ? 'Start' : 'Hemen Başla'}</span>
          </Link>

          {/* 3. Menü Tetikleyici */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] py-1 text-white/80 hover:text-[#bdd652] active:scale-95 transition cursor-pointer"
            aria-label="Menüyü Aç"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-tight">Menü</span>
          </button>
        </div>
      </aside>

      {/* Portal ile açılan Mobil Menü Çekmecesi */}
      <MobileNavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        lang={isEuBuyer ? 'en' : 'tr'}
      />
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Zap, Menu, FolderKanban, MessageCircle, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useAuth } from '@/lib/firebase/auth-context';
import GtipArama from '@/components/GtipArama';

import { loadLatestSessionDraft } from '@/lib/skdm/session-store';

export function MobileActionDock() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const draft = loadLatestSessionDraft();
    setHasDraft(Boolean(draft));
  }, [pathname]);

  // Hesaplama sihirbazı veya dosya düzenleme adımlarında alt çubuğu gizle
  const isCalculationStep = pathname?.startsWith('/hesapla/') || pathname === '/basla';

  useEffect(() => {
    setSearchOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  if (isCalculationStep) {
    return null;
  }

  const isEuBuyer = pathname?.startsWith('/eu-importers');
  const oturumAcik = Boolean(user && !user.isAnonymous);

  return (
    <>
      {/* 1. HIZLI GTİP ARAMA SHEET'İ (MODAL BOTTOM SHEET) */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Hızlı GTİP Arama"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="flex flex-col max-h-[85vh] w-full rounded-t-3xl bg-[#07135e] border-t border-white/20 p-5 text-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-white" />
                <span className="text-sm font-black uppercase tracking-wider text-white">
                  {isEuBuyer ? 'Search CN Code' : 'Canlı GTİP Arama'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-90 transition"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-300 mb-3">
                {isEuBuyer
                  ? 'Enter 4 or 8 digit CN code to verify EU CBAM coverage:'
                  : '4 veya 8 haneli GTİP / CN kodunu girerek CBAM kapsamını ve vergilendirme durumunu sorgulayın:'}
              </p>
              <div className="bg-white rounded-2xl p-3 text-ink-900 shadow-inner">
                <GtipArama />
              </div>

              {/* Hızlı Çipler */}
              <div className="mt-3.5 pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-400 block w-full mb-1">Popüler İhracat Malları:</span>
                {[
                  { gtip: '7208', label: 'Sac' },
                  { gtip: '7601', label: 'Alüminyum' },
                  { gtip: '2523', label: 'Klinker' },
                  { gtip: '3102', label: 'Üre' },
                ].map((item) => (
                  <Link
                    key={item.gtip}
                    href={`/gtip/${item.gtip}/`}
                    onClick={() => setSearchOpen(false)}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/10"
                  >
                    <span className="font-mono text-white">{item.gtip}</span>
                    <span className="text-slate-300">· {item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
                569 Doğrulanmış CN Kodu
              </span>
              <Link
                href="/basla/"
                onClick={() => setSearchOpen(false)}
                className="font-bold text-white hover:underline flex items-center gap-1"
              >
                Gelişmiş Sihirbaz <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. ANA ULTRA-LÜKS MOBİL FLOATING ACTION DOCK */}
      <aside
        aria-label="Mobil Hızlı İşlem Çubuğu"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0a1fc8]/95 backdrop-blur-2xl border-t border-white/20 shadow-[0_-10px_35px_rgba(0,0,0,0.45)]"
        style={{
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          {/* 1. GTİP Arama Butonu */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-slate-300 hover:text-white active:scale-90 transition cursor-pointer"
            aria-label="GTİP Arama"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[9.5px] font-bold tracking-tight">
              {isEuBuyer ? 'Dataset' : 'GTİP Ara'}
            </span>
          </button>

          {/* 2. Dosyalarım / Giriş / Taslak */}
          <Link
            href={hasDraft ? '/hesabim/' : (oturumAcik ? '/hesabim/' : '/giris/')}
            className="flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-slate-300 hover:text-white active:scale-90 transition relative"
          >
            <div className="relative">
              <FolderKanban className="w-5 h-5 stroke-[2.2]" />
              {(oturumAcik || hasDraft) && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#1030e0] ring-2 ring-[#0e1707] animate-pulse" />
              )}
            </div>
            <span className="text-[9.5px] font-bold tracking-tight">
              {hasDraft ? 'Dosyam' : (oturumAcik ? 'Dosyalar' : 'Giriş')}
            </span>
          </Link>

          {/* 3. Ana Merkez Hesapla / Başla (Vurgulu Parlak Buton) */}
          <Link
            href={isEuBuyer ? '/eu-importers/#start-collection' : '/basla/'}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 mx-1 rounded-2xl bg-gradient-to-r from-[#1030e0] via-[#2563eb] to-[#0a1fc8] text-white font-black text-xs tracking-tight shadow-[0_4px_18px_rgba(16,48,224,0.45)] active:scale-95 transition shrink-0"
          >
            <Zap className="w-4 h-4 fill-white stroke-[2.5]" />
            <span>{isEuBuyer ? 'Start' : 'Hesapla'}</span>
          </Link>

          {/* 4. Uzman Hattı / Destek */}
          <Link
            href="/iletisim/"
            className="flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-slate-300 hover:text-white active:scale-90 transition"
            aria-label="Uzmana Danış"
          >
            <MessageCircle className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[9.5px] font-bold tracking-tight">Destek</span>
          </Link>

          {/* 5. Menü Çekmecesi */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-slate-300 hover:text-white active:scale-90 transition cursor-pointer"
            aria-label="Menüyü Aç"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[9.5px] font-bold tracking-tight">Menü</span>
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

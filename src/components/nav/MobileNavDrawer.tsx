'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import {
  X,
  Home,
  Zap,
  HelpCircle,
  Scale,
  BookOpen,
  FileText,
  Truck,
  Ship,
  CreditCard,
  Layers,
  ShieldCheck,
  User,
  ChevronRight,
  Plus,
  RotateCcw,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { loadLatestSessionDraft } from '@/lib/skdm/session-store';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'tr' | 'en';
}

const NAV_ITEMS = [
  { ad: 'Nasıl Çalışır', yol: '/nasil-calisir/', icon: HelpCircle, aciklama: '4 adımda SKDM süreci' },
  { ad: 'Metodoloji', yol: '/metodoloji/', icon: Scale, aciklama: 'Yasal ve bilimsel formüller' },
  { ad: 'İhracatçı Rehberi', yol: '/rehber/', icon: BookOpen, aciklama: 'Uygulamalı hazırlık kılavuzu' },
  { ad: 'SKDM Sözlüğü', yol: '/sozluk/', icon: FileText, aciklama: 'Mevzuat terimleri ve tanımlar' },
  { ad: 'Tedarikçi Verisi', yol: '/tedarikci-verisi/', icon: Truck, aciklama: 'Tesis & hammadde veri toplama' },
  { ad: 'Denizcilik (ETS)', yol: '/denizcilik/', icon: Ship, aciklama: 'ETS navlun sürşarjı hesabı' },
  { ad: 'Fiyatlandırma', yol: '/fiyatlandirma/', icon: CreditCard, aciklama: 'Şeffaf self-servis paketler' },
  { ad: 'Mevzuat Bülteni', yol: '/mevzuat-guncellemeleri/', icon: Layers, aciklama: 'En son AB kararları' },
];

const EN_NAV_ITEMS = [
  { ad: 'How It Works', yol: '/eu-importers/#how-it-works', icon: HelpCircle, aciklama: '4-step CBAM workflow' },
  { ad: 'Data Structure', yol: '/eu-importers/#dataset', icon: Scale, aciklama: 'Template dataset specs' },
  { ad: 'Regulatory Basis', yol: '/eu-importers/#regulatory-basis', icon: BookOpen, aciklama: '(EU) 2023/956 & 2025/2547' },
  { ad: 'Collection Workflow', yol: '/eu-importers/#workflow', icon: Truck, aciklama: 'Supplier engagement' },
];

export function MobileNavDrawer({ isOpen, onClose, lang = 'tr' }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [latestDraft, setLatestDraft] = useState<ReturnType<typeof loadLatestSessionDraft>>(null);

  useEffect(() => {
    setMounted(true);
    setLatestDraft(loadLatestSessionDraft());
  }, []);

  // Sayfa değiştiğinde çekmeceyi otomatik kapat
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // Çekmece açıkken arkadaki body kaydırmasını dondur
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const oturum = Boolean(user && !user.isAnonymous);
  const ad = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Kullanıcı';
  const basHarf = (ad.trim()[0] ?? '?').toLocaleUpperCase('tr-TR');
  const taslakVar = Boolean(latestDraft);
  const taslakYolu = latestDraft ? `/hesapla/${latestDraft.sectorSlug}/` : '/basla/';

  const isEn = lang === 'en' || pathname?.startsWith('/eu-importers');
  const items = isEn ? EN_NAV_ITEMS : NAV_ITEMS;

  function handleYeniDosya() {
    onClose();
    if (taslakVar) {
      const devam = window.confirm(
        'Yarım kalan bir dosyanız var. Yeni dosya açarsanız ona profil menünüzden geri dönebilirsiniz. Yeni dosya açılsın mı?'
      );
      if (!devam) return;
    }
    window.location.href = '/basla/';
  }

  const drawerContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobil Gezinme Menüsü"
      className="fixed inset-0 z-[99999] flex flex-col bg-[#0f1906] text-[#f2f5e9] antialiased overflow-hidden"
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#0f1906',
      }}
    >
      {/* 1. Üst Başlık (Header) */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#ffffff15] bg-[#142109]/95 backdrop-blur-md shrink-0">
        <a href={isEn ? '/eu-importers/' : '/'} className="flex items-center gap-2.5" onClick={onClose}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/skdm-hesapla.gif" alt="SKDMHesapla Logo" className="w-8 h-8 rounded-lg object-contain" />
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold tracking-tight text-white leading-tight">
              <span className="font-normal text-[#bdd652]">SKDM</span>Hesapla
            </span>
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-[#bdd652]/80">
              {isEn ? 'CBAM · EU IMPORTER SUITE' : 'CBAM · DENETİME HAZIR'}
            </span>
          </div>
        </a>

        {/* Kapat Butonu (48px ferah dokunma alanı) */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#bdd652]"
          aria-label="Menüyü Kapat"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Kaydırılabilir İçerik Alanı */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">
        {/* Kullanıcı Durum Kartı (Giriş Yapılmış veya Misafir) */}
        {!isEn && (
          <div className="rounded-2xl border border-[#bdd652]/25 bg-gradient-to-b from-[#1b2b0c] to-[#142109] p-4 shadow-lg">
            {oturum ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#bdd652] text-[#213110] flex items-center justify-center text-base font-black shrink-0 shadow-sm">
                    {basHarf}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate">{ad}</div>
                    <div className="text-[11px] font-mono text-[#bdd652] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#bdd652] animate-pulse" />
                      Oturum Aktif
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-semibold">
                  {taslakVar && (
                    <a
                      href={taslakYolu}
                      onClick={onClose}
                      className="flex items-center justify-between col-span-2 p-2.5 rounded-xl bg-[#bdd652]/15 text-[#bdd652] border border-[#bdd652]/30 hover:bg-[#bdd652]/25 transition"
                    >
                      <span className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Dosyama Dön
                      </span>
                      <span>→</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleYeniDosya}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Yeni Dosya
                  </button>
                  <a
                    href="/hesabim/"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
                  >
                    Dosyalarım
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      void logout();
                    }}
                    className="col-span-2 flex items-center justify-center gap-1.5 p-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white">Hesabınız var mı?</div>
                  <div className="text-xs text-white/60">Dosyalarınızı yönetmek için giriş yapın</div>
                </div>
                <a
                  href="/giris/"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition active:scale-95 shrink-0"
                >
                  <User className="w-3.5 h-3.5" />
                  Giriş Yap
                </a>
              </div>
            )}
          </div>
        )}

        {/* Birincil Aksiyon Butonu */}
        <div>
          <a
            href={isEn ? '/eu-importers/#start-collection' : '/basla/'}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full min-h-[50px] rounded-2xl bg-[#bdd652] hover:bg-[#a8c240] text-[#142109] font-black text-sm tracking-wide shadow-[0_4px_16px_rgba(189,214,82,0.3)] transition active:scale-98"
          >
            <Zap className="w-4 h-4 fill-current" />
            {isEn ? 'Start Data Collection' : 'SKDM Hesaplamaya Başla'}
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </a>
        </div>

        {/* Ana Gezinme Listesi */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white/40">
            {isEn ? 'Navigation' : 'Platform Modülleri'}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden">
            <a
              href={isEn ? '/eu-importers/' : '/'}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium transition ${
                pathname === '/' ? 'bg-[#bdd652]/15 text-[#bdd652] font-bold' : 'text-white/90 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-white/60" />
                <span>Ana Sayfa</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </a>

            {items.map((item) => {
              const aktif = pathname === item.yol || (item.yol !== '/' && Boolean(pathname?.startsWith(item.yol)));
              const IconComponent = item.icon;
              return (
                <a
                  key={item.yol}
                  href={item.yol}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium transition ${
                    aktif ? 'bg-[#bdd652]/15 text-[#bdd652] font-bold' : 'text-white/90 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${aktif ? 'text-[#bdd652]' : 'text-white/60'}`} />
                    <div>
                      <div className="leading-tight">{item.ad}</div>
                      {item.aciklama && (
                        <div className="text-[11px] text-white/50 leading-tight mt-0.5">{item.aciklama}</div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${aktif ? 'text-[#bdd652]' : 'opacity-40'}`} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Hızlı Araçlar & Güvenlik Kartları */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white/40">
            Hızlı Araçlar
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="/basla/"
              onClick={onClose}
              className="flex flex-col p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs transition"
            >
              <span className="font-bold text-white">GTİP Kapsam</span>
              <span className="text-[10px] text-white/50 mt-0.5">8 Haneli CN Kontrolü</span>
            </a>
            <a
              href="/dogrula/"
              onClick={onClose}
              className="flex flex-col p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs transition"
            >
              <span className="font-bold text-white">Mühür Doğrula</span>
              <span className="text-[10px] text-white/50 mt-0.5">SHA-256 Doğrulama</span>
            </a>
            <a
              href="/cbam-50-ton-muafiyeti/"
              onClick={onClose}
              className="flex flex-col p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs transition"
            >
              <span className="font-bold text-white">50 Ton Muafiyeti</span>
              <span className="text-[10px] text-white/50 mt-0.5">De Minimis Kuralı</span>
            </a>
            <a
              href="/iletisim/"
              onClick={onClose}
              className="flex flex-col p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs transition"
            >
              <span className="font-bold text-white">Uzman Desteği</span>
              <span className="text-[10px] text-white/50 mt-0.5">İletişim &amp; Yardım</span>
            </a>
          </div>
        </div>

        {/* Alt Güvenlik Rozeti */}
        <div className="pt-2 pb-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
            <ShieldCheck className="w-3.5 h-3.5 text-[#bdd652]" />
            Frankfurt, Almanya AB Sunucusu · SHA-256
          </div>
          <div className="mt-2 text-[10px] text-white/40">
            AB Regülasyonu: (EU) 2023/956 &amp; (EU) 2025/2547
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}

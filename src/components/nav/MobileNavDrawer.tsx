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
  const [menuSearch, setMenuSearch] = useState('');

  useEffect(() => {
    setMounted(true);
    setLatestDraft(loadLatestSessionDraft());
  }, []);

  // Sayfa değiştiğinde çekmeceyi ve aramayı otomatik kapat
  useEffect(() => {
    if (isOpen) {
      setMenuSearch('');
      onClose();
    }
  }, [pathname]);
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

  const filtrelenenItems = items.filter((it) => {
    if (!menuSearch.trim()) return true;
    const q = menuSearch.toLocaleLowerCase('tr-TR');
    return (
      it.ad.toLocaleLowerCase('tr-TR').includes(q) ||
      (it.aciklama && it.aciklama.toLocaleLowerCase('tr-TR').includes(q))
    );
  });

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
      className="fixed inset-0 z-[99999] flex flex-col bg-white text-ink-900 antialiased overflow-hidden"
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. Üst Başlık (Header) */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-md shrink-0">
        <a href={isEn ? '/eu-importers/' : '/'} className="flex items-center gap-2.5" onClick={onClose}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/skdm-hesapla.gif" alt="SKDMHesapla Logo" className="w-8 h-8 rounded-lg object-contain" />
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold tracking-tight text-ink-900 leading-tight">
              <span className="font-normal text-brand-800">SKDM</span>Hesapla
            </span>
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-brand-800">
              {isEn ? 'CBAM · EU IMPORTER SUITE' : 'CBAM · DENETİME HAZIR'}
            </span>
          </div>
        </a>

        {/* Kapat Butonu (48px ferah dokunma alanı) */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition-all cursor-pointer border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-800"
          aria-label="Menüyü Kapat"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Kaydırılabilir İçerik Alanı */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 bg-slate-50/50">
        {/* Kullanıcı Durum Kartı (Giriş Yapılmış veya Misafir) */}
        {!isEn && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            {oturum ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center text-base font-black shrink-0 shadow-xs">
                    {basHarf}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-ink-900 truncate">{ad}</div>
                    <div className="text-[11px] font-mono text-brand-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-800 animate-pulse" />
                      Oturum Aktif
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs font-semibold">
                  {taslakVar && (
                    <a
                      href={taslakYolu}
                      onClick={onClose}
                      className="flex items-center justify-between col-span-2 p-2.5 rounded-xl bg-emerald-50 text-brand-800 border border-emerald-200 hover:bg-emerald-100 transition"
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
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-ink-800 border border-slate-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Yeni Dosya
                  </button>
                  <a
                    href="/hesabim/"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-ink-800 border border-slate-200 transition"
                  >
                    Dosyalarım
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      void logout();
                    }}
                    className="col-span-2 flex items-center justify-center gap-1.5 p-2 rounded-xl text-red-600 hover:bg-red-50 text-xs transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-ink-900">Hesabınız var mı?</div>
                  <div className="text-xs text-slate-500">Dosyalarınızı yönetmek için giriş yapın</div>
                </div>
                <a
                  href="/giris/"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold transition active:scale-95 shrink-0 shadow-xs"
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
            className="flex items-center justify-center gap-2 w-full min-h-[50px] rounded-2xl bg-brand-800 hover:bg-brand-900 text-white font-black text-sm tracking-wide shadow-[0_4px_16px_rgba(42,107,66,0.25)] transition active:scale-98"
          >
            <Zap className="w-4 h-4 fill-white stroke-[2.5]" />
            {isEn ? 'Start Data Collection' : 'SKDM Hesaplamaya Başla'}
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </a>
        </div>

        {/* Canlı Menü İçi Arama Çubuğu */}
        <div className="relative">
          <input
            type="text"
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            placeholder={isEn ? 'Search menu modules...' : 'Menüde veya konularda ara...'}
            className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 pl-10 text-xs text-ink-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-800 focus:border-transparent transition shadow-xs"
          />
          <span className="absolute left-3 top-3 text-slate-400">
            🔍
          </span>
          {menuSearch && (
            <button
              type="button"
              onClick={() => setMenuSearch('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-ink-900"
            >
              ✕
            </button>
          )}
        </div>

        {/* Ana Gezinme Listesi */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
            <span>{isEn ? 'Navigation' : 'Platform Modülleri'}</span>
            {menuSearch && (
              <span className="text-[10px] text-brand-800 lowercase font-normal">
                {filtrelenenItems.length} sonuç
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden shadow-xs">
            {!menuSearch && (
              <a
                href={isEn ? '/eu-importers/' : '/'}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium transition ${
                  pathname === '/' ? 'bg-emerald-50 text-brand-800 font-bold' : 'text-ink-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Ana Sayfa</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 text-slate-400" />
              </a>
            )}

            {filtrelenenItems.length > 0 ? (
              filtrelenenItems.map((item) => {
                const aktif = pathname === item.yol || (item.yol !== '/' && Boolean(pathname?.startsWith(item.yol)));
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.yol}
                    href={item.yol}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium transition ${
                      aktif ? 'bg-emerald-50 text-brand-800 font-bold' : 'text-ink-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${aktif ? 'text-brand-800' : 'text-slate-500'}`} />
                      <div>
                        <div className="leading-tight">{item.ad}</div>
                        {item.aciklama && (
                          <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.aciklama}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${aktif ? 'text-brand-800' : 'opacity-40 text-slate-400'}`} />
                  </a>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                Aramanızla eşleşen bir modül bulunamadı.
              </div>
            )}
          </div>
        </div>

        {/* Hızlı Araçlar & Güvenlik Kartları */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Hızlı Araçlar
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="/basla/"
              onClick={onClose}
              className="flex flex-col p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs transition shadow-xs"
            >
              <span className="font-bold text-ink-900">GTİP Kapsam</span>
              <span className="text-[10px] text-slate-500 mt-0.5">8 Haneli CN Kontrolü</span>
            </a>
            <a
              href="/dogrula/"
              onClick={onClose}
              className="flex flex-col p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs transition shadow-xs"
            >
              <span className="font-bold text-ink-900">Mühür Doğrula</span>
              <span className="text-[10px] text-slate-500 mt-0.5">SHA-256 Doğrulama</span>
            </a>
            <a
              href="/cbam-50-ton-muafiyeti/"
              onClick={onClose}
              className="flex flex-col p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs transition shadow-xs"
            >
              <span className="font-bold text-ink-900">50 Ton Muafiyeti</span>
              <span className="text-[10px] text-slate-500 mt-0.5">De Minimis Kuralı</span>
            </a>
            <a
              href="/iletisim/"
              onClick={onClose}
              className="flex flex-col p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs transition shadow-xs"
            >
              <span className="font-bold text-ink-900">Uzman Desteği</span>
              <span className="text-[10px] text-slate-500 mt-0.5">İletişim &amp; Yardım</span>
            </a>
          </div>
        </div>

        {/* Alt Güvenlik Rozeti */}
        <div className="pt-2 pb-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-800" />
            Frankfurt, Almanya AB Sunucusu · SHA-256
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            AB Regülasyonu: (EU) 2023/956 &amp; (EU) 2025/2547
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}

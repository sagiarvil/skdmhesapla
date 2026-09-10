'use client';

/**
 * SiteHeader — tek birincil eylem kuralı.
 *
 * Oturum kapalı           → "Hemen Başla"
 * Oturum açık + taslak    → "Dosyama dön"  (+ menüde "Yeni dosya aç")
 * Oturum açık, taslak yok → "Yeni dosya"
 *
 * "Yeni dosya" artık ayrı CTA değil, kullanıcı menüsünde. Aktif taslak
 * varken tıklanırsa onay sorulur — yarım dosyayı kaybetme riski oradaydı.
 *
 * Auth durumu varsayılan olarak içeriden bağlanır (useAuth +
 * loadLatestSessionDraft); dışarıdan prop verilirse o değerler kazanır.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import bicem from './SiteHeader.module.css';
import { useAuth } from '@/lib/firebase/auth-context';
import { loadLatestSessionDraft } from '@/lib/skdm/session-store';

const GEZINME = [
  { ad: 'Nasıl Çalışır', yol: '/nasil-calisir/' },
  { ad: 'Metodoloji', yol: '/metodoloji/' },
  { ad: 'Rehber', yol: '/rehber/' },
  { ad: 'Sözlük', yol: '/sozluk/' },
  { ad: 'Tedarikçi', yol: '/tedarikci-verisi/' },
  { ad: 'Denizcilik', yol: '/denizcilik/' },
  { ad: 'Fiyatlandırma', yol: '/fiyatlandirma/' },
];

export interface SiteHeaderProps {
  oturumAcik?: boolean;
  kullaniciAdi?: string;
  aktifTaslakVar?: boolean;
  taslakYolu?: string;
  onCikisYap?: () => void;
}

export function SiteHeader({
  oturumAcik,
  kullaniciAdi,
  aktifTaslakVar,
  taslakYolu,
  onCikisYap,
}: SiteHeaderProps = {}) {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const [latestDraft, setLatestDraft] = useState<ReturnType<typeof loadLatestSessionDraft>>(null);

  if (
    pathname === '/sozluk/' ||
    pathname === '/sozluk' ||
    pathname === '/metodoloji/' ||
    pathname === '/metodoloji' ||
    pathname === '/rehber/' ||
    pathname === '/rehber'
  ) {
    return null;
  }
  const [menuAcik, setMenuAcik] = useState(false);
  const [cekmeceAcik, setCekmeceAcik] = useState(false);
  const sarmalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLatestDraft(loadLatestSessionDraft());
  }, []);

  useEffect(() => {
    setCekmeceAcik(false);
    setMenuAcik(false);
  }, [pathname]);

  useEffect(() => {
    if (!cekmeceAcik) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCekmeceAcik(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [cekmeceAcik]);

  const oturum = oturumAcik ?? Boolean(user && !user.isAnonymous);
  const ad =
    kullaniciAdi ??
    (profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Kullanıcı');
  const taslakVar = aktifTaslakVar ?? Boolean(latestDraft);
  const yol = taslakYolu ?? (latestDraft ? `/hesapla/${latestDraft.sectorSlug}/` : '/basla/');
  const cikisYap = onCikisYap ?? (() => { void logout(); });

  useEffect(() => {
    if (!menuAcik) return;
    function disariTiklama(e: MouseEvent) {
      if (!sarmalRef.current?.contains(e.target as Node)) setMenuAcik(false);
    }
    function tusa(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuAcik(false);
    }
    document.addEventListener('mousedown', disariTiklama);
    document.addEventListener('keydown', tusa);
    return () => {
      document.removeEventListener('mousedown', disariTiklama);
      document.removeEventListener('keydown', tusa);
    };
  }, [menuAcik]);

  function yeniDosya() {
    setMenuAcik(false);
    setCekmeceAcik(false);
    if (taslakVar) {
      const devam = window.confirm(
        'Yarım kalan bir dosyanız var. Yeni dosya açarsanız ona bu menüden ' +
          'geri dönebilirsiniz. Yeni dosya açılsın mı?',
      );
      if (!devam) return;
    }
    window.location.href = '/basla/';
  }

  const isEuBuyer = pathname?.startsWith('/eu-importers');

  const gezinmeItems = isEuBuyer
    ? [
        { ad: 'How It Works', yol: '/eu-importers/#how-it-works' },
        { ad: 'Data Structure', yol: '/eu-importers/#dataset' },
        { ad: 'Regulatory Basis', yol: '/eu-importers/#regulatory-basis' },
        { ad: 'Collection Workflow', yol: '/eu-importers/#workflow' },
      ]
    : GEZINME;

  const birincil = isEuBuyer
    ? { metin: 'Start Collection', yol: '/eu-importers/#start-collection' }
    : !oturum
      ? { metin: 'Hemen Başla', yol: '/basla/' }
      : taslakVar
        ? { metin: 'Kaldığım yerden devam', yol }
        : { metin: 'Yeni dosya', yol: '/basla/' };

  const basHarf = (ad.trim()[0] ?? '?').toLocaleUpperCase('tr-TR');

  return (
    <header className={bicem.header} lang={isEuBuyer ? 'en' : 'tr'}>
      <div className={bicem.satir}>
        <a href={isEuBuyer ? '/eu-importers/' : '/'} className={bicem.marka} aria-label={isEuBuyer ? 'SKDMHesapla Supplier Collection Home' : 'SKDMHesapla Ana Sayfa'}>
          <img src="/logo/skdm-hesapla.gif" alt=""
            className={bicem.markaIsaret} width={34} height={34} />
          <span className={bicem.markaYazi}>
            <span className={bicem.markaAd}>
              <span style={{ fontWeight: 400 }}>SKDM</span>Hesapla
            </span>
            <span className={bicem.markaAlt}>{isEuBuyer ? 'CBAM · Supplier Collection' : 'CBAM · Denetime hazır'}</span>
          </span>
        </a>

        <nav className={bicem.gezinme} aria-label={isEuBuyer ? 'Main navigation' : 'Ana gezinme'}>
          {gezinmeItems.map((b) => {
            const aktif = pathname === b.yol || (b.yol !== '/' && Boolean(pathname?.startsWith(b.yol)));
            return (
              <a
                key={b.yol}
                href={b.yol}
                className={`${bicem.gezinmeBag} ${aktif ? bicem.gezinmeBagAktif : ''}`}
              >
                {b.ad}
              </a>
            );
          })}
        </nav>

        <div className={bicem.saglik}>
          {!oturum && !isEuBuyer && (
            <a href="/giris/" className={bicem.girisDugme}>Üye Girişi</a>
          )}

          <a href={birincil.yol} className={bicem.birincil}>{birincil.metin}</a>

          {oturum && (
            <div className={bicem.kullaniciSarmal} ref={sarmalRef}>
              <button type="button" className={bicem.kullaniciDugme}
                onClick={() => setMenuAcik((a) => !a)}
                aria-expanded={menuAcik} aria-haspopup="menu">
                <span className={bicem.rozet} aria-hidden="true">{basHarf}</span>
                <span className={bicem.kullaniciAd}>{ad}</span>
                <svg className={bicem.okIsareti} width="12" height="12"
                  viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor"
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={bicem.gizli}>Hesap menüsü</span>
              </button>

              {menuAcik && (
                <div className={bicem.menuPanel} role="menu">
                  <p className={bicem.menuBaslik}>{ad}</p>
                  {taslakVar && (
                    <a href={yol} className={bicem.menuOge} role="menuitem">
                      Yarım kalan dosyama dön
                    </a>
                  )}
                  <button type="button" className={bicem.menuOge}
                    role="menuitem" onClick={yeniDosya}>
                    Yeni dosya aç
                  </button>
                  <a href="/hesabim/" className={bicem.menuOge} role="menuitem">
                    Dosyalarım
                  </a>
                  <a href="/dogrula/" className={bicem.menuOge} role="menuitem">
                    Mühür doğrula
                  </a>
                  <hr className={bicem.menuAyrac} />
                  <button type="button" className={bicem.menuOge} role="menuitem"
                    onClick={() => { setMenuAcik(false); cikisYap(); }}>
                    Çıkış yap
                  </button>
                </div>
              )}
            </div>
          )}

          <button type="button" className={bicem.cekmeceDugme}
            onClick={() => setCekmeceAcik((a) => !a)}
            aria-expanded={cekmeceAcik} aria-controls="site-cekmece">
            <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
              {cekmeceAcik ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
            <span className={bicem.gizli}>{isEuBuyer ? "Open menu" : "Menüyü aç"}</span>
          </button>
        </div>
      </div>

      {/* Enterprise & Exclusive Slide-over Mobile Drawer (60fps Butter-smooth Transition) */}
      <div
        className={`${bicem.drawerOverlay} ${cekmeceAcik ? bicem.drawerOverlayVisible : ''}`}
        onClick={() => setCekmeceAcik(false)}
        aria-hidden="true"
      />
      <div
        className={`${bicem.drawerPanel} ${cekmeceAcik ? bicem.drawerPanelOpen : ''}`}
        id="site-cekmece"
        role="dialog"
        aria-modal="true"
        aria-hidden={!cekmeceAcik}
        aria-label={isEuBuyer ? "Mobile navigation menu" : "Mobil gezinme menüsü"}
      >
        <div className={bicem.drawerHead}>
          <a href={isEuBuyer ? "/eu-importers/" : "/"} className={bicem.marka} onClick={() => setCekmeceAcik(false)}>
            <img src="/logo/skdm-hesapla.gif" alt="" className={bicem.markaIsaret} width={30} height={30} />
            <span className={bicem.markaYazi}>
              <span className={bicem.markaAd} style={{ fontSize: '17px' }}>
                <span style={{ fontWeight: 400 }}>SKDM</span>Hesapla
              </span>
              <span className={bicem.markaAlt} style={{ fontSize: '9px' }}>
                {isEuBuyer ? "CBAM · Supplier Collection" : "CBAM · Denetime hazır"}
              </span>
            </span>
          </a>
          <button
            type="button"
            className={bicem.drawerClose}
            onClick={() => setCekmeceAcik(false)}
            aria-label={isEuBuyer ? "Close menu" : "Menüyü kapat"}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Auth / Kullanici Durumu */}
        {!isEuBuyer && (
          <div className={bicem.drawerAuth}>
            {oturum ? (
              <div>
                <div className={bicem.drawerAuthUser}>
                  <span className={bicem.rozet} aria-hidden="true">{basHarf}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className={bicem.drawerAuthName}>{ad}</div>
                    <div className={bicem.drawerAuthSub}>Giriş yapıldı</div>
                  </div>
                </div>
                <div className={bicem.drawerAuthActions}>
                  {taslakVar && (
                    <a href={yol} className={bicem.drawerAuthLink} onClick={() => setCekmeceAcik(false)}>
                      <span>Yarım kalan dosyama dön</span>
                      <span>→</span>
                    </a>
                  )}
                  <button type="button" className={bicem.drawerAuthLink} onClick={yeniDosya}>
                    <span>Yeni dosya aç</span>
                    <span>+</span>
                  </button>
                  <a href="/hesabim/" className={bicem.drawerAuthLink} onClick={() => setCekmeceAcik(false)}>
                    <span>Dosyalarım</span>
                    <span>→</span>
                  </a>
                  <a href="/dogrula/" className={bicem.drawerAuthLink} onClick={() => setCekmeceAcik(false)}>
                    <span>Mühür doğrula</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    className={bicem.drawerAuthLink}
                    onClick={() => { setCekmeceAcik(false); cikisYap(); }}
                    style={{ color: '#f87171' }}
                  >
                    <span>Çıkış yap</span>
                  </button>
                </div>
              </div>
            ) : (
              <a href="/giris/" className={bicem.drawerGirisCta} onClick={() => setCekmeceAcik(false)}>
                <span>Üye Girişi / Kayıt</span>
                <span>→</span>
              </a>
            )}
          </div>
        )}

        {/* Gezinme Linkleri */}
        <ul className={bicem.drawerNavList}>
          {gezinmeItems.map((b) => {
            const aktif = pathname === b.yol || (b.yol !== '/' && Boolean(pathname?.startsWith(b.yol)));
            return (
              <li key={b.yol}>
                <a
                  href={b.yol}
                  className={`${bicem.drawerNavLink} ${aktif ? bicem.drawerNavLinkAktif : ''}`}
                  onClick={() => setCekmeceAcik(false)}
                >
                  <span>{b.ad}</span>
                  <span style={{ opacity: 0.5, fontSize: '13px' }}>→</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Hızlı Aksiyonlar ve Alt Bilgi */}
        <div className={bicem.drawerFooter}>
          <a
            href={birincil.yol}
            className={bicem.drawerPrimaryBtn}
            onClick={() => setCekmeceAcik(false)}
          >
            {birincil.metin} →
          </a>
          {!isEuBuyer ? (
            <>
              <a
                href="/basla/"
                className={bicem.drawerSecondaryBtn}
                onClick={() => setCekmeceAcik(false)}
              >
                GTİP Kapsam Kontrolü
              </a>
              <div className={bicem.drawerTrust}>
                AB Regülasyonu: (EU) 2023/956 &amp; 2025/2547<br />
                Frankfurt, Almanya AB Sunucusu · SHA-256 Mühür
              </div>
            </>
          ) : (
            <div className={bicem.drawerTrust}>
              EU Regulation: (EU) 2023/956 &amp; 2025/2547<br />
              Frankfurt, Germany EU Server · Data Sovereignty
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

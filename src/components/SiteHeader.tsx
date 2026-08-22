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
    pathname === '/mevzuat-guncellemeleri/' ||
    pathname === '/mevzuat-guncellemeleri' ||
    pathname === '/sozluk/' ||
    pathname === '/sozluk' ||
    pathname === '/metodoloji/' ||
    pathname === '/metodoloji'
  ) {
    return null;
  }
  const [menuAcik, setMenuAcik] = useState(false);
  const [cekmeceAcik, setCekmeceAcik] = useState(false);
  const sarmalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLatestDraft(loadLatestSessionDraft());
  }, []);

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
    if (taslakVar) {
      const devam = window.confirm(
        'Yarım kalan bir dosyanız var. Yeni dosya açarsanız ona bu menüden ' +
          'geri dönebilirsiniz. Yeni dosya açılsın mı?',
      );
      if (!devam) return;
    }
    window.location.href = '/basla/';
  }

  const birincil = !oturum
    ? { metin: 'Hemen Başla', yol: '/basla/' }
    : taslakVar
      ? { metin: 'Kaldığım yerden devam', yol }
      : { metin: 'Yeni dosya', yol: '/basla/' };

  const basHarf = (ad.trim()[0] ?? '?').toLocaleUpperCase('tr-TR');

  return (
    <header className={bicem.header}>
      <div className={bicem.satir}>
        <a href="/" className={bicem.marka}>
          <img src="/logo/skdm-hesapla.gif" alt=""
            className={bicem.markaIsaret} width={34} height={34} />
          <span className={bicem.markaYazi}>
            <span className={bicem.markaAd}>
              <span style={{ fontWeight: 400 }}>SKDM</span>Hesapla
            </span>
            <span className={bicem.markaAlt}>CBAM · Denetime hazır</span>
          </span>
        </a>

        <nav className={bicem.gezinme} aria-label="Ana gezinme">
          {GEZINME.map((b) => (
            <a key={b.yol} href={b.yol} className={bicem.gezinmeBag}>{b.ad}</a>
          ))}
        </nav>

        <div className={bicem.saglik}>
                      {!oturum && (
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
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {cekmeceAcik ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
            <span className={bicem.gizli}>Menüyü aç</span>
          </button>
        </div>
      </div>

      {cekmeceAcik && (
        <div className={bicem.cekmece} id="site-cekmece">
          <ul className={bicem.cekmeceListe}>
            {GEZINME.map((b) => (
              <li key={b.yol}>
                <a href={b.yol} className={bicem.cekmeceBag}
                  onClick={() => setCekmeceAcik(false)}>{b.ad}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

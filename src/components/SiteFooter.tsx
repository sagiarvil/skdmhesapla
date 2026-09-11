"use client";

import { usePathname } from "next/navigation";
import styles from "./SiteFooter.module.css";
import { ISLETMECI } from "@/config/isletmeci";

const URUN_TR = [
  ["Platform Kabiliyetleri", "/platform-kabiliyetleri/"],
  ["Nasıl Çalışır", "/nasil-calisir/"],
  ["Metodoloji", "/metodoloji/"],
  ["Fiyatlandırma", "/fiyatlandirma/"],
  ["Tedarikçi Verisi", "/tedarikci-verisi/"],
  ["Mühür Doğrulama", "/dogrula/"],
] as const;

const IS_BIRLIKLERI_TR = [
  ["Partner Network", "/partner-network/"],
  ["For EU Importers", "/eu-importers/"],
  ["Denizcilik Karbon Rejimi", "/denizcilik/"],
  ["Mevzuat Güncellemeleri", "/mevzuat-guncellemeleri/"],
] as const;

const KURUMSAL_TR = [
  ["Hakkında", "/hakkinda/"],
  ["Metodoloji Sorumlusu", "/uzmanlik/baris-bagirlar/"],
  ["Kaynak Politikası", "/kaynak-politikasi/"],
  ["Kullanım Koşulları", "/kullanim-kosullari/"],
  ["KVKK Aydınlatma", "/kvkk-aydinlatma/"],
  ["İade Politikası", "/iade-politikasi/"],
  ["İletişim", "/iletisim/"],
] as const;

const URUN_EN = [
  ["Overview", "/eu-importers/"],
  ["How It Works", "/eu-importers/#how-it-works"],
  ["Data Structure", "/eu-importers/#dataset"],
  ["Regulatory Basis", "/eu-importers/#regulatory-basis"],
  ["Start Collection", "/eu-importers/#start-collection"],
  ["Turkish Platform", "/"],
] as const;

const COOPERATION_EN = [
  ["EU Importer Desk", "/eu-importers/"],
  ["Partner Network (TR)", "/partner-network/"],
  ["Supplier Data Portal", "/tedarikci-verisi/"],
  ["Maritime EU ETS / FuelEU", "/denizcilik/"],
] as const;

const KURUMSAL_EN = [
  ["Methodology Supervisor", "/uzmanlik/baris-bagirlar/"],
  ["Regulatory Updates", "/mevzuat-guncellemeleri/"],
  ["Source Policy", "/kaynak-politikasi/"],
  ["Terms of Use", "/kullanim-kosullari/"],
  ["Privacy Notice", "/kvkk-aydinlatma/"],
  ["Contact Desk", "/iletisim/"],
] as const;

export default function SiteFooter() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/eu-importers");

  if (isEn) {
    return (
      <footer className={styles.altBilgi} lang="en">
        <div className={styles.icerik}>
          <div className={styles.ust}>
            <div className={styles.marka}>
              <a className={styles.markaBag} href="/eu-importers/" aria-label="SKDMHesapla EU Buyer Collection Home">
                <img className={styles.logo} src="/logo/skdm-logo-header.svg" alt="" width="28" height="28" aria-hidden="true" />
                <span className={styles.markaAd}>SKDMHesapla</span>
              </a>
              <p className={styles.markaMetin}>
                Structured CBAM supplier emissions data and evidence collection infrastructure for Turkish manufacturing supply chains.
              </p>
              <a className={styles.eposta} href={`mailto:${ISLETMECI.eposta}`}>{ISLETMECI.eposta}</a>
            </div>
            <FooterNav title="Product & Platform" label="Product links" items={URUN_EN} />
            <FooterNav title="Network & B2B" label="B2B and network links" items={COOPERATION_EN} />
            <FooterNav title="Governance & Trust" label="Governance links" items={KURUMSAL_EN} />
          </div>
          <p className={styles.kapsamNotu}>
            SKDMHesapla is not an authorised CBAM declarant, competent authority, or accredited verifier. It is deterministic software providing structured supplier data collection, calculation, and evidence preparation.
          </p>
          <div className={styles.yasal}>
            <p className={styles.yasalSatir}>
              © {new Date().getFullYear()} {ISLETMECI.ticariUnvan}
              <span className={styles.ayrac}>·</span>
              Server Location: Frankfurt, Germany (EU data sovereignty).
              <span className={styles.ayrac}>·</span>
              <a href="https://www.google.com/preferences/source?q=skdmhesapla.com" rel="noopener noreferrer" className="hover:underline">
                Google Preferred Source
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.altBilgi}>
      <div className={styles.icerik}>
        <div className={styles.ust}>
          <div className={styles.marka}>
            <a className={styles.markaBag} href="/" aria-label={`${ISLETMECI.urunAdi} ana sayfa`}>
              <img className={styles.logo} src="/logo/skdm-logo-header.svg" alt="" width="28" height="28" aria-hidden="true" />
              <span className={styles.markaAd}>{ISLETMECI.urunAdi}</span>
            </a>
            <p className={styles.markaMetin}>Türk ihracatçısı için kapsam, veri toplama, precursor, hesaplama izi ve denetime hazırlık çalışma altyapısı.</p>
            <a className={styles.eposta} href={`mailto:${ISLETMECI.eposta}`}>{ISLETMECI.eposta}</a>
          </div>
          <FooterNav title="Ürün" label="Ürün bağlantıları" items={URUN_TR} />
          <FooterNav title="İş Birlikleri & B2B" label="İş birliği ve kurumsal kanallar" items={IS_BIRLIKLERI_TR} />
          <FooterNav title="Kurumsal ve Yasal" label="Kurumsal ve yasal bağlantılar" items={KURUMSAL_TR} />
        </div>
        <p className={styles.kapsamNotu}>{ISLETMECI.urunAdi}, akredite doğrulama görüşü veya gümrük onayı vermez; veri toplama, hesaplama, kalite kontrolü ve denetime hazırlık çalışma dosyanızı oluşturan self-servis yazılımdır.</p>
        <div className={styles.yasal}>
          <p className={styles.yasalSatir}>
            © {new Date().getFullYear()} {ISLETMECI.ticariUnvan}
            <span className={styles.ayrac}>·</span>
            {ISLETMECI.vergiEtiketi}: {ISLETMECI.vergiNo}
            <span className={styles.ayrac}>·</span>
            {ISLETMECI.adres}
            <span className={styles.ayrac}>·</span>
            <a href="https://www.google.com/preferences/source?q=skdmhesapla.com" rel="noopener noreferrer" className="hover:underline">
              Google Tercih Edilen Kaynak
            </a>
          </p>
          <p className={styles.yasalNot}>Sunucu konumu: {ISLETMECI.sunucuKonumu} — işletmeci merkezi değildir.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ title, label, items }: { title: string; label: string; items: readonly (readonly [string, string])[] }) {
  return (
    <nav className={styles.sutun} aria-label={label}>
      <h2 className={styles.sutunBaslik}>{title}</h2>
      <ul className={styles.liste}>
        {items.map(([ad, href]) => (
          <li key={href}><a className={styles.bag} href={href}>{ad}</a></li>
        ))}
      </ul>
    </nav>
  );
}
